# Setup Guide

## Quick Start

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Configure (Optional):**

   Create a `.env` file in the root directory for custom configuration:

   ```env
   PORT=3000
   REDDIT_USER_AGENT=ReplyDude/1.0 (Node.js)
   ```

   **Note:** No Reddit API credentials are needed! The service uses Reddit's public JSON endpoints.

3. **Start the server:**
   ```bash
   npm start
   ```

## Testing the API

### Search for threads:

```bash
curl "http://localhost:3000/api/reddit/search/threads?query=web%20development&limit=5"
```

### Find promotion opportunities:

```bash
curl -X POST http://localhost:3000/api/reddit/promotion-opportunities \
  -H "Content-Type: application/json" \
  -d '{
    "websiteDescription": "A tool for developers",
    "keywords": ["coding", "tools", "development"],
    "maxThreads": 5
  }'
```

## Troubleshooting

### Rate limit errors

- Reddit public endpoints have rate limits (~60 requests per minute)
- The service handles rate limit errors gracefully and will return an error message
- Wait a minute before making more requests if you hit the limit

### Network errors

- Check your internet connection
- Verify Reddit is accessible (visit reddit.com in your browser)
- Some requests may fail due to Reddit's rate limiting

### "Resource not found" errors

- The thread ID might be incorrect or the thread may have been deleted
- Verify the thread ID is correct before making requests
