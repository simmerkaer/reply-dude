import express from "express";
import PromotionService from "../services/promotionService.js";

const router = express.Router();
const promotionService = new PromotionService();

/**
 * Search for relevant Reddit threads
 * GET /api/reddit/search/threads?query=keyword&subreddit=all&limit=25
 */
router.get("/search/threads", async (req, res, next) => {
  try {
    const { query, subreddit, sort, time, limit, keywords } = req.query;

    const results = await promotionService.searchThreads(query, {
      subreddit,
      sort,
      time,
      limit,
      keywords,
    });

    res.json(results);
  } catch (error) {
    if (error.message === "Query parameter is required") {
      return res.status(400).json({
        error: "Missing required parameter",
        message: error.message,
      });
    }
    next(error);
  }
});

/**
 * Get comments from a specific thread
 * GET /api/reddit/thread/:threadId/comments?sort=top&limit=100
 */
router.get("/thread/:threadId/comments", async (req, res, next) => {
  try {
    const { threadId } = req.params;
    const { sort, limit, keywords } = req.query;

    const results = await promotionService.getThreadComments(threadId, {
      sort,
      limit,
      keywords,
    });

    res.json(results);
  } catch (error) {
    if (error.message === "Thread ID is required") {
      return res.status(400).json({
        error: "Missing required parameter",
        message: error.message,
      });
    }
    next(error);
  }
});

/**
 * Find promotion opportunities
 * Each thread is one promotion opportunity where you can post a reply
 * POST /api/reddit/promotion-opportunities
 * Body: { websiteDescription, keywords: [], subreddits: [], maxThreads: 10 }
 */
router.post("/promotion-opportunities", async (req, res, next) => {
  try {
    const {
      websiteDescription,
      keywords = [],
      subreddits = [],
      maxThreads = 10,
      maxCommentsPerThread = 5,
    } = req.body;

    const results = await promotionService.findPromotionOpportunities(
      websiteDescription,
      keywords,
      {
        subreddits,
        maxThreads,
        maxCommentsPerThread,
      }
    );

    res.json(results);
  } catch (error) {
    if (
      error.message ===
      "Either websiteDescription or keywords array is required"
    ) {
      return res.status(400).json({
        error: "Missing required field",
        message: error.message,
      });
    }
    next(error);
  }
});

/**
 * Get thread details
 * GET /api/reddit/thread/:threadId
 */
router.get("/thread/:threadId", async (req, res, next) => {
  try {
    const { threadId } = req.params;

    const results = await promotionService.getThreadDetails(threadId);

    res.json(results);
  } catch (error) {
    if (error.message === "Thread ID is required") {
      return res.status(400).json({
        error: "Missing required parameter",
        message: error.message,
      });
    }
    next(error);
  }
});

export default router;
