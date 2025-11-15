# Reply Dude - Reddit Promotion Service!

A service that finds relevant Reddit threads and comments to help promote your website. Built with Express.js and Reddit JSON endpoint scraping (no API authentication required).

## Getting Started

### Installation

Install dependencies:

```bash
npm install
```

### Configuration (Optional)

Create a `.env` file for custom configuration:

```env
PORT=3000
REDDIT_USER_AGENT=ReplyDude/1.0 (Node.js)
```

**Note:** No Reddit API credentials are required! The service uses Reddit's public JSON endpoints, which don't require authentication.

### Running the Server

Start the server:

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

The server will start on `http://localhost:3000` by default.

## API Endpoints

### General Endpoints

- `GET /` - Welcome message with available endpoints
- `GET /health` - Health check endpoint
- `GET /api` - API documentation

### Reddit Endpoints

#### Search for Threads

```
GET /api/reddit/search/threads?query=keyword&subreddit=all&limit=25&keywords=word1,word2
```

**Query Parameters:**

- `query` (required) - Search query string
- `subreddit` (optional) - Subreddit to search in (default: 'all')
- `sort` (optional) - Sort order: 'relevance', 'hot', 'top', 'new' (default: 'relevance')
- `time` (optional) - Time period: 'all', 'year', 'month', 'week', 'day', 'hour' (default: 'all')
- `limit` (optional) - Number of results (default: 25, max: 100)
- `keywords` (optional) - Comma-separated keywords for relevance scoring

**Example:**

```bash
curl "http://localhost:3000/api/reddit/search/threads?query=web%20development&subreddit=programming&limit=10"
```

#### Get Thread Comments

```
GET /api/reddit/thread/:threadId/comments?sort=top&limit=100&keywords=word1,word2
```

**Path Parameters:**

- `threadId` - Reddit thread/post ID

**Query Parameters:**

- `sort` (optional) - Sort order: 'top', 'best', 'new', 'controversial' (default: 'top')
- `limit` (optional) - Number of comments (default: 100)
- `keywords` (optional) - Comma-separated keywords for relevance filtering

**Example:**

```bash
curl "http://localhost:3000/api/reddit/thread/abc123/comments?sort=top&limit=50"
```

#### Find Promotion Opportunities

```
POST /api/reddit/promotion-opportunities
```

**Request Body:**

```json
{
  "websiteDescription": "A tool for web developers",
  "keywords": ["web development", "coding", "tools"],
  "subreddits": ["programming", "webdev"],
  "maxThreads": 10,
  "maxCommentsPerThread": 5
}
```

**Response:**
Returns threads with relevant comments that match your keywords, sorted by relevance score.

**Example:**

```bash
curl -X POST http://localhost:3000/api/reddit/promotion-opportunities \
  -H "Content-Type: application/json" \
  -d '{
    "websiteDescription": "AI-powered code assistant",
    "keywords": ["AI", "coding", "developer tools"],
    "maxThreads": 5
  }'
```

#### Get Thread Details

```
GET /api/reddit/thread/:threadId
```

**Example:**

```bash
curl "http://localhost:3000/api/reddit/thread/abc123"
```

## Environment Variables

- `PORT` - Server port (default: 3000)
- `REDDIT_USER_AGENT` - User agent string for Reddit requests (optional, default: "ReplyDude/1.0 (Node.js)")

## How It Works

1. **Relevance Scoring:** The service scores threads and comments based on:

   - Keyword matches
   - Engagement (upvotes, comments)
   - Recency
   - Content quality

2. **Promotion Opportunities:** Identifies threads and comments where your website/service would be relevant and valuable to the discussion.

3. **Filtering:** Only returns results with sufficient engagement and keyword relevance to ensure quality opportunities.

## Project Structure

```
.
├── server.js                  # HTTP server setup and middleware
├── package.json               # Dependencies and scripts
├── services/
│   ├── redditService.js       # Low-level Reddit JSON endpoint scraper
│   └── promotionService.js    # Business logic layer (validation, parsing, formatting)
├── routes/
│   └── redditRoutes.js        # Thin HTTP endpoint wrappers
├── examples/
│   └── wod-gpt-promotion.js   # Example script using PromotionService directly
└── README.md                  # This file
```

## Architecture

The codebase follows a clean architecture pattern:

- **Server** (`server.js`) - HTTP server setup, middleware, and route mounting only
- **Routes** (`routes/redditRoutes.js`) - Thin HTTP layer that extracts request data and calls services
- **Services** (`services/promotionService.js`) - Business logic layer containing validation, parsing, and data transformation
- **Reddit Service** (`services/redditService.js`) - Low-level Reddit API client

### Using Services Directly

You can use `PromotionService` directly in scripts without running the HTTP server:

```javascript
import PromotionService from "./services/promotionService.js";

const promotionService = new PromotionService();

// Find promotion opportunities
const results = await promotionService.findPromotionOpportunities(
  "Your website description",
  ["keyword1", "keyword2"],
  {
    subreddits: ["subreddit1", "subreddit2"],
    maxThreads: 10,
    maxCommentsPerThread: 1,
  }
);
```

See `examples/wod-gpt-promotion.js` for a complete example.

## Usage Examples

### Using the HTTP API

```javascript
// Find promotion opportunities via HTTP API
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
// Returns threads with relevant comments sorted by relevance score
```

### Using the Service Directly

```javascript
// Find promotion opportunities using the service directly (no HTTP server needed)
import PromotionService from "./services/promotionService.js";

const promotionService = new PromotionService();

const data = await promotionService.findPromotionOpportunities(
  "AI code review tool",
  ["code review", "AI", "developer tools"],
  {
    subreddits: ["programming", "webdev"],
    maxThreads: 10,
  }
);
// Returns the same data structure as the HTTP API
```

## Notes

- **No Authentication Required:** The service uses Reddit's public JSON endpoints, so no API credentials are needed
- **Rate Limiting:** Reddit public endpoints have rate limits (~60 requests/minute). The service handles rate limit errors gracefully
- **Respect Reddit's Terms:** Always follow Reddit's terms of service and guidelines
- **Be Respectful:** When promoting, add value to discussions - don't spam
- **Automatic Filtering:** The service filters out low-engagement posts and comments automatically
  #
