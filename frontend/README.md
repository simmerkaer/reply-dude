# Reply Dude Frontend

Simple Vite React TypeScript frontend for the Reply Dude Reddit Promotion Service.

## Getting Started

### Install Dependencies

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173` (or another port if 5173 is taken).

### Build

Build for production:

```bash
npm run build
```

### Preview

Preview the production build:

```bash
npm run preview
```

## Configuration

- **Vite Config**: Proxy configured to forward `/api` requests to backend on `http://localhost:3000`
- **TypeScript**: React TypeScript setup with JSX support
- **API Client**: Located in `src/api/promotionService.ts`

## Project Structure

```
frontend/
├── src/
│   ├── api/
│   │   └── promotionService.ts  # API client for backend
│   ├── App.tsx                   # Main app component
│   ├── App.css                   # App styles
│   ├── main.tsx                  # React entry point
│   ├── index.css                 # Global styles
│   └── vite-env.d.ts            # Vite type definitions
├── index.html                    # HTML entry point
├── vite.config.ts               # Vite configuration
├── tsconfig.json                # TypeScript config
└── tsconfig.node.json           # TypeScript config for Node scripts
```

## Usage

Make sure the backend server is running on port 3000 before using the frontend.

The frontend uses the `PromotionService` API client to communicate with the backend API.

