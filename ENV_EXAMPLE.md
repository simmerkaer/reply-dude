# Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Reddit API Configuration
REDDIT_USER_AGENT=ReplyDude/1.0 (Node.js)

# CORS Configuration
# In production, set this to your frontend URL (e.g., https://your-app.azurestaticapps.net)
# For development, leave as * or omit to allow all origins
CORS_ORIGIN=*
```

## Production Environment Variables (Azure App Service)

When deploying to Azure App Service, set these in the Azure Portal under Configuration > Application settings:

- `PORT` - Automatically set by Azure (do not override)
- `NODE_ENV` - Set to `production`
- `REDDIT_USER_AGENT` - User agent string for Reddit requests
- `CORS_ORIGIN` - Your frontend URL (e.g., `https://your-app.azurestaticapps.net`)

