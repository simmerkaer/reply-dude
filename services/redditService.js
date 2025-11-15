/**
 * Reddit Service for finding relevant threads and comments
 * Uses Reddit's public JSON endpoints (no API authentication required)
 */
class RedditService {
  constructor() {
    this.baseUrl = "https://www.reddit.com";
    this.userAgent = process.env.REDDIT_USER_AGENT || "ReplyDude/1.0 (Node.js)";
  }

  /**
   * Make a request to Reddit JSON endpoint
   * @private
   */
  async fetchRedditJson(url) {
    const startTime = Date.now();
    const timestamp = new Date().toISOString();

    try {
      // Log request
      console.log(`[${timestamp}] Reddit API Request: ${url}`);

      const response = await fetch(url, {
        headers: {
          "User-Agent": this.userAgent,
        },
      });

      const duration = Date.now() - startTime;
      const responseTime = new Date().toISOString();

      if (!response.ok) {
        // Log error response
        console.log(
          `[${responseTime}] Reddit API Response: ${url} - ${response.status} (${duration}ms)`
        );
        if (response.status === 429) {
          throw new Error(
            "Rate limit exceeded. Please wait before making more requests."
          );
        }
        if (response.status === 404) {
          throw new Error("Resource not found");
        }
        throw new Error(
          `Reddit API error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      // Log successful response
      console.log(
        `[${responseTime}] Reddit API Response: ${url} - ${response.status} (${duration}ms)`
      );

      return data;
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorTime = new Date().toISOString();

      // Log error
      console.log(
        `[${errorTime}] Reddit API Error: ${url} - ${error.message} (${duration}ms)`
      );

      if (error.message.includes("Rate limit")) {
        throw error;
      }
      if (error.message.includes("not found")) {
        throw error;
      }
      throw new Error(`Network error: ${error.message}`);
    }
  }

  /**
   * Search for relevant threads across Reddit
   * @param {string} query - Search query
   * @param {Object} options - Search options
   * @returns {Promise<Array>} Array of relevant threads
   */
  async searchThreads(query, options = {}) {
    const {
      subreddit = "all",
      sort = "relevance",
      time = "all",
      limit = 25,
      keywords = [],
    } = options;

    try {
      // Build search URL
      let searchUrl;
      if (subreddit === "all") {
        searchUrl = `${this.baseUrl}/search.json?q=${encodeURIComponent(
          query
        )}&sort=${sort}&t=${time}&limit=${Math.min(limit, 100)}&count=10}`;
      } else {
        searchUrl = `${
          this.baseUrl
        }/r/${subreddit}/search.json?q=${encodeURIComponent(
          query
        )}&sort=${sort}&t=${time}&limit=${Math.min(10, 100)}&restrict_sr=1`;
      }

      const data = await this.fetchRedditJson(searchUrl);

      // Parse Reddit's JSON structure: { data: { children: [{ data: {...} }] } }
      const posts = data?.data?.children?.map((child) => child.data) || [];

      // Score relevance based on keywords and other factors
      const scoredResults = posts
        .map((post) => ({
          id: post.id,
          title: post.title,
          url: post.url,
          permalink: `https://reddit.com${post.permalink}`,
          subreddit: post.subreddit,
          author: post.author || "[deleted]",
          score: post.score || 0,
          numComments: post.num_comments || 0,
          created: new Date(post.created_utc * 1000).toISOString(),
          selftext: post.selftext || "",
          created_utc: post.created_utc,
          relevanceScore: this.calculateRelevanceScore(post, query, keywords),
          isPromotionOpportunity: this.isPromotionOpportunity(
            post,
            query,
            keywords
          ),
        }))
        .filter((post) => post.title); // Filter out invalid posts

      // Sort by relevance score
      return scoredResults.sort((a, b) => b.relevanceScore - a.relevanceScore);
    } catch (error) {
      console.error("Error searching threads:", error);
      throw new Error(`Failed to search Reddit threads: ${error.message}`);
    }
  }

  /**
   * Get comments from a specific thread
   * @param {string} threadId - Reddit thread ID
   * @param {Object} options - Options for comment retrieval
   * @returns {Promise<Array>} Array of comments
   */
  async getThreadComments(threadId, options = {}) {
    const { sort = "top", limit = 100, keywords = [] } = options;

    try {
      // Try to get subreddit from threadId if available, otherwise use generic endpoint
      // Reddit JSON endpoint: /r/{subreddit}/comments/{threadId}.json
      // Or: /comments/{threadId}.json (works but less efficient)
      let commentsUrl = `${
        this.baseUrl
      }/comments/${threadId}.json?sort=${sort}&limit=${Math.min(limit, 500)}`;

      const data = await this.fetchRedditJson(commentsUrl);

      // Reddit returns array: [threadData, commentsData]
      // commentsData structure: { data: { children: [{ data: {...} }] } }
      const commentsData = data?.[1]?.data?.children || [];

      // Flatten nested comment structure
      const comments = this.flattenComments(commentsData);

      // Score and filter comments
      const scoredComments = comments
        .map((comment) => {
          const commentData = comment.data || comment;
          return {
            id: commentData.id,
            body: commentData.body || "",
            author: commentData.author || "[deleted]",
            score: commentData.score || 0,
            created: new Date(commentData.created_utc * 1000).toISOString(),
            permalink: `https://reddit.com${commentData.permalink}`,
            parentId: commentData.parent_id,
            relevanceScore: this.calculateCommentRelevance(
              commentData,
              keywords
            ),
            isPromotionOpportunity: this.isCommentPromotionOpportunity(
              commentData,
              keywords
            ),
          };
        })
        .filter(
          (comment) =>
            comment.body && comment.body !== "[deleted]" && comment.body !== ""
        )
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, limit);

      return scoredComments;
    } catch (error) {
      console.error("Error getting thread comments:", error);
      throw new Error(`Failed to get thread comments: ${error.message}`);
    }
  }

  /**
   * Get thread details
   * @param {string} threadId - Reddit thread ID
   * @returns {Promise<Object>} Thread details
   */
  async getThreadDetails(threadId) {
    try {
      const url = `${this.baseUrl}/comments/${threadId}.json`;
      const data = await this.fetchRedditJson(url);

      // First element contains the thread data
      const threadData = data?.[0]?.data?.children?.[0]?.data;

      if (!threadData) {
        throw new Error("Thread not found");
      }

      return {
        id: threadData.id,
        title: threadData.title,
        url: threadData.url,
        permalink: `https://reddit.com${threadData.permalink}`,
        subreddit: threadData.subreddit,
        author: threadData.author || "[deleted]",
        score: threadData.score || 0,
        numComments: threadData.num_comments || 0,
        created: new Date(threadData.created_utc * 1000).toISOString(),
        selftext: threadData.selftext || "",
        upvoteRatio: threadData.upvote_ratio || 0,
      };
    } catch (error) {
      console.error("Error getting thread details:", error);
      throw new Error(`Failed to get thread details: ${error.message}`);
    }
  }

  /**
   * Find relevant threads and comments based on website keywords
   * Each thread is considered one promotion opportunity
   * @param {string} websiteDescription - Description of the website/service
   * @param {Array<string>} keywords - Keywords related to the website
   * @param {Object} options - Search options
   * @returns {Promise<Object>} Combined results with threads and top comments
   */
  async findPromotionOpportunities(
    websiteDescription,
    keywords = [],
    options = {}
  ) {
    const {
      subreddits = [],
      maxThreads = 10,
      maxCommentsPerThread = 5,
    } = options;

    const searchQuery =
      keywords.length > 0 ? keywords.join(" OR ") : websiteDescription;

    const results = {
      threads: [],
      totalOpportunities: 0,
    };

    // Search in specific subreddits or all of Reddit
    const searchTargets = subreddits.length > 0 ? subreddits : ["all"];

    for (const subreddit of searchTargets) {
      // Stop if we've reached the max threads limit
      if (results.threads.length >= maxThreads) {
        break;
      }

      try {
        // Calculate how many more threads we need
        const remainingThreads = maxThreads - results.threads.length;
        const threads = await this.searchThreads(searchQuery, {
          subreddit,
          limit: remainingThreads,
          keywords,
        });

        // Get top comments for each relevant thread
        for (const thread of threads) {
          // Stop if we've reached the max threads limit
          if (results.threads.length >= maxThreads) {
            break;
          }

          if (thread.isPromotionOpportunity) {
            try {
              const comments = await this.getThreadComments(thread.id, {
                keywords,
                limit: maxCommentsPerThread * 2, // Get more to filter
              });

              thread.topComments = comments
                .filter((c) => c.isPromotionOpportunity)
                .slice(0, maxCommentsPerThread);

              results.threads.push(thread);
              // Each thread is one promotion opportunity
              results.totalOpportunities += 1;
            } catch (error) {
              console.error(
                `Error getting comments for thread ${thread.id}:`,
                error
              );
              // Still add thread even if comments fail
              // Each thread is one promotion opportunity
              results.threads.push(thread);
              results.totalOpportunities += 1;
            }
          }
        }
      } catch (error) {
        console.error(`Error searching subreddit ${subreddit}:`, error);
      }
    }

    // Ensure we don't exceed maxThreads (safety check)
    results.threads = results.threads.slice(0, maxThreads);
    // totalOpportunities should equal the number of threads (each thread = 1 opportunity)
    results.totalOpportunities = results.threads.length;

    return results;
  }

  /**
   * Calculate relevance score for a thread
   */
  calculateRelevanceScore(post, query, keywords = []) {
    let score = 0;
    const text = `${post.title} ${post.selftext || ""}`.toLowerCase();
    const queryLower = query.toLowerCase();

    // Base score from upvotes
    score += Math.log10((post.score || 0) + 1) * 10;

    // Comment engagement
    score += Math.log10((post.num_comments || 0) + 1) * 5;

    // Keyword matching
    keywords.forEach((keyword) => {
      const keywordLower = keyword.toLowerCase();
      const matches = (text.match(new RegExp(keywordLower, "g")) || []).length;
      score += matches * 20;
    });

    // Query matching
    const queryWords = queryLower.split(/\s+/);
    queryWords.forEach((word) => {
      if (word.length > 2 && text.includes(word)) {
        score += 15;
      }
    });

    // Recency bonus (newer posts get slight boost)
    if (post.created_utc) {
      const daysSincePost =
        (Date.now() - post.created_utc * 1000) / (1000 * 60 * 60 * 24);
      if (daysSincePost < 7) {
        score += 10;
      }
    }

    return Math.round(score);
  }

  /**
   * Calculate relevance score for a comment
   */
  calculateCommentRelevance(comment, keywords = []) {
    let score = 0;
    const text = (comment.body || "").toLowerCase();

    // Base score from upvotes
    score += Math.log10((comment.score || 0) + 1) * 10;

    // Keyword matching
    keywords.forEach((keyword) => {
      const keywordLower = keyword.toLowerCase();
      const matches = (text.match(new RegExp(keywordLower, "g")) || []).length;
      score += matches * 25;
    });

    // Longer comments that match keywords are more valuable
    if (
      text.length > 100 &&
      keywords.some((k) => text.includes(k.toLowerCase()))
    ) {
      score += 15;
    }

    return Math.round(score);
  }

  /**
   * Determine if a thread is a good promotion opportunity
   */
  isPromotionOpportunity(post, query, keywords = []) {
    const text = `${post.title} ${post.selftext || ""}`.toLowerCase();
    const queryLower = query.toLowerCase();
    const queryWords = queryLower.split(/\s+/);

    // Must have engagement
    if ((post.num_comments || 0) < 3) return false;

    // Must match query or keywords
    const hasQueryMatch = queryWords.some(
      (word) => word.length > 2 && text.includes(word.toLowerCase())
    );
    const hasKeywordMatch = keywords.some((keyword) =>
      text.includes(keyword.toLowerCase())
    );

    return hasQueryMatch || hasKeywordMatch;
  }

  /**
   * Determine if a comment is a good promotion opportunity
   */
  isCommentPromotionOpportunity(comment, keywords = []) {
    const text = (comment.body || "").toLowerCase();

    // Must have some engagement
    if ((comment.score || 0) < 1) return false;

    // Must match keywords
    return keywords.some((keyword) => text.includes(keyword.toLowerCase()));
  }

  /**
   * Flatten nested comment structure
   */
  flattenComments(comments, depth = 0) {
    let result = [];

    for (const comment of comments) {
      const commentData = comment.data || comment;

      if (commentData.body && commentData.body !== "[deleted]") {
        result.push(comment);
      }

      // Handle nested replies
      if (commentData.replies && typeof commentData.replies === "object") {
        const replies =
          commentData.replies.data?.children || commentData.replies || [];
        if (replies.length > 0) {
          result = result.concat(this.flattenComments(replies, depth + 1));
        }
      }
    }

    return result;
  }
}

export default RedditService;
