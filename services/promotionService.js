import RedditService from "./redditService.js";

/**
 * Promotion Service - Business logic layer for finding promotion opportunities
 * Wraps RedditService and handles validation, parsing, and data transformation
 */
class PromotionService {
  constructor() {
    this.redditService = new RedditService();
  }

  /**
   * Search for relevant Reddit threads
   * @param {string} query - Search query
   * @param {Object} options - Search options
   * @param {string} options.subreddit - Subreddit to search (default: 'all')
   * @param {string} options.sort - Sort order (default: 'relevance')
   * @param {string} options.time - Time period (default: 'all')
   * @param {number} options.limit - Number of results (default: 25)
   * @param {string|Array} options.keywords - Keywords for relevance scoring (string or array)
   * @returns {Promise<Object>} Search results with count and results array
   * @throws {Error} If query is missing
   */
  async searchThreads(query, options = {}) {
    // Validation
    if (!query || typeof query !== "string" || query.trim().length === 0) {
      throw new Error("Query parameter is required");
    }

    // Parse options
    const {
      subreddit = "all",
      sort = "relevance",
      time = "all",
      limit = 25,
      keywords = [],
    } = options;

    // Parse keywords (handle both string and array)
    const keywordArray =
      typeof keywords === "string"
        ? keywords.split(",").map((k) => k.trim()).filter((k) => k.length > 0)
        : Array.isArray(keywords)
        ? keywords.map((k) => String(k).trim()).filter((k) => k.length > 0)
        : [];

    // Call RedditService
    const results = await this.redditService.searchThreads(query, {
      subreddit,
      sort,
      time,
      limit: parseInt(limit) || 25,
      keywords: keywordArray,
    });

    // Format response
    return {
      success: true,
      count: results.length,
      results,
    };
  }

  /**
   * Get comments from a specific thread
   * @param {string} threadId - Reddit thread ID
   * @param {Object} options - Options for comment retrieval
   * @param {string} options.sort - Sort order (default: 'top')
   * @param {number} options.limit - Number of comments (default: 100)
   * @param {string|Array} options.keywords - Keywords for relevance filtering (string or array)
   * @returns {Promise<Object>} Comments with threadId, count, and comments array
   */
  async getThreadComments(threadId, options = {}) {
    // Validation
    if (!threadId || typeof threadId !== "string" || threadId.trim().length === 0) {
      throw new Error("Thread ID is required");
    }

    // Parse options
    const { sort = "top", limit = 100, keywords = [] } = options;

    // Parse keywords (handle both string and array)
    const keywordArray =
      typeof keywords === "string"
        ? keywords.split(",").map((k) => k.trim()).filter((k) => k.length > 0)
        : Array.isArray(keywords)
        ? keywords.map((k) => String(k).trim()).filter((k) => k.length > 0)
        : [];

    // Call RedditService
    const comments = await this.redditService.getThreadComments(threadId, {
      sort,
      limit: parseInt(limit) || 100,
      keywords: keywordArray,
    });

    // Format response
    return {
      success: true,
      threadId,
      count: comments.length,
      comments,
    };
  }

  /**
   * Find promotion opportunities
   * Each thread is one promotion opportunity where you can post a reply
   * @param {string} websiteDescription - Description of the website/service
   * @param {Array<string>} keywords - Keywords related to the website
   * @param {Object} options - Search options
   * @param {Array<string>} options.subreddits - Subreddits to search (default: [])
   * @param {number} options.maxThreads - Maximum threads to return (default: 10)
   * @param {number} options.maxCommentsPerThread - Max comments per thread (default: 5)
   * @returns {Promise<Object>} Promotion opportunities with totalOpportunities, threadCount, and results
   * @throws {Error} If neither websiteDescription nor keywords are provided
   */
  async findPromotionOpportunities(
    websiteDescription,
    keywords = [],
    options = {}
  ) {
    // Validation
    const hasDescription =
      websiteDescription &&
      typeof websiteDescription === "string" &&
      websiteDescription.trim().length > 0;
    const hasKeywords =
      Array.isArray(keywords) && keywords.length > 0;

    if (!hasDescription && !hasKeywords) {
      throw new Error(
        "Either websiteDescription or keywords array is required"
      );
    }

    // Parse options
    const {
      subreddits = [],
      maxThreads = 10,
      maxCommentsPerThread = 5,
    } = options;

    // Ensure keywords is an array
    const keywordArray = Array.isArray(keywords) ? keywords : [];

    // Call RedditService
    const results = await this.redditService.findPromotionOpportunities(
      websiteDescription || "",
      keywordArray,
      {
        subreddits: Array.isArray(subreddits) ? subreddits : [],
        maxThreads: parseInt(maxThreads) || 10,
        maxCommentsPerThread: parseInt(maxCommentsPerThread) || 5,
      }
    );

    // Format response
    return {
      success: true,
      totalOpportunities: results.totalOpportunities,
      threadCount: results.threads.length,
      results: results.threads,
    };
  }

  /**
   * Get thread details
   * @param {string} threadId - Reddit thread ID
   * @returns {Promise<Object>} Thread details with success flag and thread object
   */
  async getThreadDetails(threadId) {
    // Validation
    if (!threadId || typeof threadId !== "string" || threadId.trim().length === 0) {
      throw new Error("Thread ID is required");
    }

    // Call RedditService
    const thread = await this.redditService.getThreadDetails(threadId);

    // Format response
    return {
      success: true,
      thread,
    };
  }
}

export default PromotionService;

