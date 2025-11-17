# Azure App Service Deployment Guide

## Overview
This guide explains how to deploy the Reply Dude backend API to Azure App Service.

## Prerequisites
- Azure account with active subscription
- Node.js 18+ installed locally (for testing)
- Azure CLI installed (optional, for CLI deployment)
- GitHub repository (if using GitHub Actions)

## Azure Portal Configuration

### 1. Create App Service Resource
1. Go to Azure Portal (https://portal.azure.com)
2. Click "Create a resource"
3. Search for "Web App"
4. Click "Create"
5. Fill in the details:
   - **Subscription**: Your Azure subscription
   - **Resource Group**: Create new or use existing
   - **Name**: e.g., `reply-dude-api` (must be globally unique)
   - **Publish**: Code
   - **Runtime stack**: Node.js 20 LTS (or 18 LTS)
   - **Operating System**: Linux (recommended) or Windows
   - **Region**: Choose closest to your users
   - **App Service Plan**: Create new or use existing
     - For development: Free or Basic tier
     - For production: Standard or higher tier

### 2. Configure Application Settings
After creating the App Service:

1. Go to your App Service in Azure Portal
2. Navigate to **Configuration** > **Application settings**
3. Add the following environment variables:
   - **NODE_ENV**: `production`
   - **REDDIT_USER_AGENT**: `ReplyDude/1.0 (Node.js)`
   - **CORS_ORIGIN**: Your frontend URL (e.g., `https://your-app.azurestaticapps.net`)
   - **PORT**: (Do NOT set - Azure automatically sets this)

### 3. Configure Startup Command
1. Go to **Configuration** > **General settings**
2. Set **Startup Command**: `node server.js`
   - Or leave empty if using default `npm start`

## Deployment Methods

### Method 1: GitHub Actions (Recommended)
1. Create `.github/workflows/azure-app-service.yml` (see below)
2. Add the following secrets to your GitHub repository:
   - `AZURE_WEBAPP_NAME`: Your App Service name
   - `AZURE_WEBAPP_PUBLISH_PROFILE`: Get from Azure Portal > App Service > Get publish profile
   - Or use Azure Service Principal (more secure)

3. Push to `main` branch to trigger deployment

### Method 2: Azure CLI
1. Install Azure CLI: https://docs.microsoft.com/cli/azure/install-azure-cli
2. Login: `az login`
3. Deploy:
```bash
az webapp up --name reply-dude-api --resource-group your-resource-group --runtime "NODE:20-lts"
```

### Method 3: VS Code Extension
1. Install "Azure App Service" extension in VS Code
2. Right-click on project folder
3. Select "Deploy to Web App"
4. Follow the prompts

### Method 4: Local Git Deployment
1. In Azure Portal, go to **Deployment Center**
2. Choose **Local Git** as source
3. Follow the setup instructions
4. Push to the provided Git URL

## GitHub Actions Workflow

Create `.github/workflows/azure-app-service.yml`:

```yaml
name: Azure App Service Deploy

on:
  push:
    branches:
      - main
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Deploy to Azure Web App
        uses: azure/webapps-deploy@v3
        with:
          app-name: ${{ secrets.AZURE_WEBAPP_NAME }}
          publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
```

## Testing the Deployment

### 1. Test Health Endpoint
```bash
curl https://your-app-name.azurewebsites.net/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-..."
}
```

### 2. Test API Endpoint
```bash
curl https://your-app-name.azurewebsites.net/api
```

### 3. Test CORS
From your frontend, make a request to the API and verify CORS headers are present.

## Configuration Checklist

- [ ] App Service created with Node.js 20 LTS runtime
- [ ] Environment variables configured in Azure Portal
- [ ] CORS_ORIGIN set to frontend URL
- [ ] Startup command configured (if needed)
- [ ] Deployment method configured
- [ ] Health endpoint responds correctly
- [ ] API endpoints respond correctly
- [ ] CORS headers are present in responses

## Troubleshooting

### App Won't Start
- Check **Log stream** in Azure Portal for errors
- Verify Node.js version matches `package.json` engines
- Check that `server.js` is the entry point
- Verify all dependencies are in `package.json`

### CORS Errors
- Verify `CORS_ORIGIN` is set correctly in Azure Portal
- Check that frontend URL matches exactly (including https://)
- Restart the App Service after changing CORS_ORIGIN

### Rate Limiting Issues
- Adjust rate limit settings in `server.js` if needed
- Check if you're hitting the limit during testing

### Environment Variables Not Working
- Restart App Service after adding/changing variables
- Verify variable names match exactly (case-sensitive)
- Check **Log stream** for any errors

## Security Notes

- **Never commit `.env` file** to version control
- Use Azure Key Vault for sensitive secrets (production)
- Keep `CORS_ORIGIN` restricted to your frontend domain in production
- Regularly update dependencies for security patches

## Next Steps

After backend is deployed:
1. Update frontend `VITE_API_URL` to point to backend
2. Test end-to-end functionality
3. Monitor logs and performance
4. Set up Application Insights (optional, for monitoring)

## Resources

- [Azure App Service Documentation](https://docs.microsoft.com/azure/app-service/)
- [Node.js on Azure App Service](https://docs.microsoft.com/azure/app-service/quickstart-nodejs)
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

