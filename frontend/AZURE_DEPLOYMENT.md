# Azure Static Web Apps Deployment Guide

## Overview
This guide explains how to deploy the Reply Dude frontend to Azure Static Web Apps.

## Prerequisites
- Azure account with active subscription
- GitHub repository (if using GitHub Actions)
- Node.js 20+ installed locally (for testing builds)

## Azure Portal Configuration

### 1. Create Static Web App Resource
1. Go to Azure Portal (https://portal.azure.com)
2. Click "Create a resource"
3. Search for "Static Web App"
4. Click "Create"
5. Fill in the details:
   - **Subscription**: Your Azure subscription
   - **Resource Group**: Create new or use existing
   - **Name**: e.g., `reply-dude-frontend`
   - **Plan type**: Free (for development) or Standard (for production)
   - **Region**: Choose closest to your users
   - **Source**: GitHub (if using GitHub Actions) or Other (for manual deployment)

### 2. Build Configuration
When creating the Static Web App, configure these build settings:

- **App location**: `frontend`
- **Output location**: `dist`
- **Build command**: `npm run build`
- **API location**: (leave empty - backend is separate)

### 3. Environment Variables
After creating the Static Web App, configure environment variables:

1. Go to your Static Web App in Azure Portal
2. Navigate to **Configuration** > **Application settings**
3. Add the following environment variable:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-backend-api.azurewebsites.net/api/reddit`
   - (Replace with your actual backend URL once deployed)

**Note**: Environment variables prefixed with `VITE_` are available at build time in Vite applications.

## Deployment Methods

### Method 1: GitHub Actions (Recommended)
If you connected your GitHub repository during Static Web App creation:

1. The GitHub Actions workflow (`.github/workflows/azure-static-web-apps.yml`) will automatically deploy on push to `main`
2. Add the following secrets to your GitHub repository:
   - `AZURE_STATIC_WEB_APPS_API_TOKEN`: Get this from Azure Portal > Static Web App > Manage deployment token
   - `VITE_API_URL`: (Optional) Your backend API URL

3. Push to `main` branch to trigger deployment

### Method 2: Azure CLI
1. Install Azure CLI: https://docs.microsoft.com/cli/azure/install-azure-cli
2. Login: `az login`
3. Get deployment token from Azure Portal
4. Deploy:
```bash
cd frontend
npm run build
swa deploy ./dist --deployment-token YOUR_TOKEN --app-name YOUR_APP_NAME
```

### Method 3: VS Code Extension
1. Install "Azure Static Web Apps" extension in VS Code
2. Right-click on `frontend/dist` folder
3. Select "Deploy to Static Web App"
4. Follow the prompts

## Local Testing

Before deploying, test the production build locally:

```bash
cd frontend
npm run build
npm run preview
```

Visit `http://localhost:4173` to preview the production build.

## Build Output

The build process creates a `dist/` directory in the `frontend/` folder containing:
- `index.html` - Main HTML file
- `assets/` - Compiled JavaScript and CSS files

## Routing Configuration

The `staticwebapp.config.json` file configures:
- SPA routing (all routes serve `index.html`)
- 404 handling
- Security headers

This file is automatically used by Azure Static Web Apps.

## Troubleshooting

### Build Fails
- Check Node.js version (should be 20+)
- Verify all dependencies are installed: `npm ci`
- Check for TypeScript errors: `npm run build`

### Environment Variables Not Working
- Ensure variables are prefixed with `VITE_`
- Variables must be set in Azure Portal before build
- Rebuild after adding new environment variables

### API Calls Fail
- Verify `VITE_API_URL` is set correctly in Azure Portal
- Check that backend is deployed and CORS is configured
- Test backend URL directly in browser

### Routing Issues
- Verify `staticwebapp.config.json` is in the `frontend/` directory
- Check that all routes are configured to serve `index.html`

## Next Steps

After frontend is deployed:
1. Deploy backend to Azure App Service
2. Update `VITE_API_URL` in Azure Portal to point to backend
3. Configure CORS on backend to allow frontend domain
4. Test end-to-end functionality

## Resources

- [Azure Static Web Apps Documentation](https://docs.microsoft.com/azure/static-web-apps/)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Static Web Apps CLI](https://azure.github.io/static-web-apps-cli/)

