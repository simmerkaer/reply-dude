import express from "express";
import dotenv from "dotenv";
import redditRoutes from "./routes/redditRoutes.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request/Response logging middleware
app.use((req, res, next) => {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();

  // Log request
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);

  // Log response when it finishes
  const originalSend = res.send.bind(res);
  const originalJson = res.json.bind(res);

  const logResponse = () => {
    const duration = Date.now() - startTime;
    const responseTime = new Date().toISOString();
    console.log(
      `[${responseTime}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`
    );
  };

  res.send = function (data) {
    logResponse();
    return originalSend(data);
  };

  res.json = function (data) {
    logResponse();
    return originalJson(data);
  };

  next();
});

// Application settings
app.set("port", PORT);
app.disable("x-powered-by");

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Express Server",
    status: "running",
    endpoints: {
      health: "/health",
      api: "/api",
    },
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.get("/api", (req, res) => {
  res.json({
    message: "API endpoint",
    version: "1.0.0",
    endpoints: {
      reddit: {
        searchThreads: "GET /api/reddit/search/threads",
        getThreadComments: "GET /api/reddit/thread/:threadId/comments",
        findPromotionOpportunities: "POST /api/reddit/promotion-opportunities",
        getThread: "GET /api/reddit/thread/:threadId",
      },
    },
  });
});

// Reddit API routes
app.use("/api/reddit", redditRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `Route ${req.originalUrl} not found`,
  });
});

// Error handler
app.use((err, req, res, next) => {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] ERROR ${req.method} ${req.originalUrl}:`, err.message);
  if (process.env.NODE_ENV === "development") {
    console.error(err.stack);
  }
  res.status(err.status || 500).json({
    error: "Internal Server Error",
    message: err.message || "Something went wrong",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
