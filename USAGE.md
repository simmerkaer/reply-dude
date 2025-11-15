# How to Use Reply Dude

## Quick Start

### 1. Start the Server

```bash
npm start
```

The server will start on `http://localhost:3000`

### 2. Test the Server

Open your browser or use curl:

```bash
# Check if server is running
curl http://localhost:3000/health

# Get API documentation
curl http://localhost:3000/api
```

## Using the Reddit Search Features

### Search for Relevant Threads

Find Reddit threads matching your keywords:

```bash
# Basic search
curl "http://localhost:3000/api/reddit/search/threads?query=web%20development&limit=5"

# Search in specific subreddit
curl "http://localhost:3000/api/reddit/search/threads?query=javascript&subreddit=programming&limit=10"

# Search with relevance keywords
curl "http://localhost:3000/api/reddit/search/threads?query=coding&keywords=javascript,react,nodejs&limit=5"
```

**Response Example:**
```json
{
  "success": true,
  "count": 5,
  "results": [
    {
      "id": "abc123",
      "title": "Best practices for web development",
      "url": "https://example.com",
      "permalink": "https://reddit.com/r/programming/abc123",
      "subreddit": "programming",
      "author": "username",
      "score": 150,
      "numComments": 45,
      "created": "2024-01-15T10:30:00.000Z",
      "selftext": "Post content here...",
      "relevanceScore": 85,
      "isPromotionOpportunity": true
    }
  ]
}
```

### Get Comments from a Thread

Get comments from a specific Reddit thread:

```bash
# Get top comments (replace abc123 with actual thread ID)
curl "http://localhost:3000/api/reddit/thread/abc123/comments?sort=top&limit=20"

# Filter comments by keywords
curl "http://localhost:3000/api/reddit/thread/abc123/comments?keywords=javascript,tutorial&limit=10"
```

**Response Example:**
```json
{
  "success": true,
  "threadId": "abc123",
  "count": 10,
  "comments": [
    {
      "id": "def456",
      "body": "Great tutorial! I found this helpful...",
      "author": "commenter",
      "score": 25,
      "created": "2024-01-15T11:00:00.000Z",
      "permalink": "https://reddit.com/r/programming/comments/abc123/def456",
      "parentId": "t3_abc123",
      "relevanceScore": 60,
      "isPromotionOpportunity": true
    }
  ]
}
```

### Find Promotion Opportunities (Recommended)

This is the main feature - it finds threads AND relevant comments:

```bash
curl -X POST http://localhost:3000/api/reddit/promotion-opportunities \
  -H "Content-Type: application/json" \
  -d '{
    "websiteDescription": "AI-powered code assistant",
    "keywords": ["AI", "coding", "developer tools", "code review"],
    "subreddits": ["programming", "webdev"],
    "maxThreads": 5,
    "maxCommentsPerThread": 3
  }'
```

**Response Example:**
```json
{
  "success": true,
  "totalOpportunities": 12,
  "threadCount": 5,
  "results": [
    {
      "id": "abc123",
      "title": "What tools do you use for code review?",
      "permalink": "https://reddit.com/r/programming/abc123",
      "subreddit": "programming",
      "score": 200,
      "numComments": 50,
      "relevanceScore": 95,
      "isPromotionOpportunity": true,
      "topComments": [
        {
          "id": "def456",
          "body": "I've been looking for a good code review tool...",
          "score": 30,
          "relevanceScore": 75,
          "isPromotionOpportunity": true
        }
      ]
    }
  ]
}
```

### Get Thread Details

Get detailed information about a specific thread:

```bash
curl "http://localhost:3000/api/reddit/thread/abc123"
```

## Using with JavaScript/Node.js

```javascript
// Find promotion opportunities
const response = await fetch(
  "http://localhost:3000/api/reddit/promotion-opportunities",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      websiteDescription: "AI code review tool",
      keywords: ["code review", "AI", "developer tools"],
      subreddits: ["programming", "webdev"],
      maxThreads: 10,
    }),
  }
);

const data = await response.json();
console.log(`Found ${data.totalOpportunities} promotion opportunities`);
console.log(`Across ${data.threadCount} threads`);

// Process each thread
data.results.forEach((thread) => {
  console.log(`\nThread: ${thread.title}`);
  console.log(`URL: ${thread.permalink}`);
  console.log(`Relevance Score: ${thread.relevanceScore}`);
  
  // Process relevant comments
  thread.topComments?.forEach((comment) => {
    console.log(`  - Comment by ${comment.author}: ${comment.body.substring(0, 50)}...`);
  });
});
```

## Using with Python

```python
import requests

# Find promotion opportunities
response = requests.post(
    "http://localhost:3000/api/reddit/promotion-opportunities",
    json={
        "websiteDescription": "AI-powered code assistant",
        "keywords": ["AI", "coding", "developer tools"],
        "subreddits": ["programming"],
        "maxThreads": 5
    }
)

data = response.json()
print(f"Found {data['totalOpportunities']} opportunities")
print(f"Across {data['threadCount']} threads")

for thread in data['results']:
    print(f"\n{thread['title']}")
    print(f"Score: {thread['relevanceScore']}")
    print(f"URL: {thread['permalink']}")
```

## Tips for Best Results

1. **Use Specific Keywords**: More specific keywords yield better results
   - Good: `["code review", "static analysis", "CI/CD"]`
   - Less effective: `["coding", "tools"]`

2. **Target Relevant Subreddits**: Specify subreddits related to your product
   - Example: `["programming", "webdev", "learnprogramming"]`

3. **Adjust Limits**: Start with smaller limits (5-10 threads) to test, then increase

4. **Check Relevance Scores**: Higher scores indicate better matches

5. **Respect Rate Limits**: Reddit has rate limits (~60 requests/minute). The service handles this automatically, but be patient if you see rate limit errors.

## Example Use Cases

### Finding Where to Promote a Developer Tool

```bash
curl -X POST http://localhost:3000/api/reddit/promotion-opportunities \
  -H "Content-Type: application/json" \
  -d '{
    "websiteDescription": "A tool that helps developers write better code",
    "keywords": ["developer tools", "productivity", "code quality"],
    "subreddits": ["programming", "webdev", "learnprogramming"],
    "maxThreads": 10,
    "maxCommentsPerThread": 5
  }'
```

### Finding Discussions About Your Niche

```bash
curl "http://localhost:3000/api/reddit/search/threads?query=machine%20learning&subreddit=MachineLearning&limit=20&keywords=deep%20learning,neural%20networks"
```

## Troubleshooting

### Server won't start
- Make sure port 3000 is available
- Check Node.js version (requires Node 18+)
- Run `npm install` if dependencies are missing

### Rate limit errors
- Wait 1 minute before making more requests
- Reduce the number of requests per minute
- Reddit limits ~60 requests/minute

### No results found
- Try broader search terms
- Check if subreddit name is correct
- Some subreddits may have restricted search

### Network errors
- Check your internet connection
- Verify Reddit is accessible
- Some requests may fail due to Reddit's rate limiting

