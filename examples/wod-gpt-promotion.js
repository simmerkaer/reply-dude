/**
 * Example: Finding Reddit promotion opportunities for WOD-GPT
 * A tool that generates custom CrossFit workouts for free
 */

import PromotionService from "../services/promotionService.js";

const promotionService = new PromotionService();

async function findWodGptPromotionOpportunities() {
  console.log("🔍 Searching for WOD-GPT promotion opportunities...\n");

  try {
    const data = await promotionService.findPromotionOpportunities(
      "WOD-GPT generates custom CrossFit workouts for free",
      [
        "crossfit",
        "wod",
        "workout",
        "fitness",
        "training",
        "exercise",
        "workout plan",
        "crossfit programming",
        "free workout",
        "custom workout",
      ],
      {
        subreddits: [
          "crossfit",
          "fitness",
          "workout",
          "bodyweightfitness",
          "homegym",
          "xxfitness",
        ],
        maxThreads: 10,
        maxCommentsPerThread: 1,
      }
    );

    console.log(`✅ Found ${data.totalOpportunities} promotion opportunities`);
    console.log(`📊 Across ${data.threadCount} threads\n`);
    console.log("=".repeat(60));

    data.results.forEach((thread, index) => {
      console.log(`\n${index + 1}. ${thread.title}`);
      console.log(`   Subreddit: r/${thread.subreddit}`);
      console.log(
        `   Score: ${thread.score} | Comments: ${thread.numComments}`
      );
      console.log(`   Relevance: ${thread.relevanceScore}/100`);
      console.log(`   URL: ${thread.permalink}`);

      if (thread.topComments && thread.topComments.length > 0) {
        const comment = thread.topComments[0];
        const preview = comment.body.substring(0, 150).replace(/\n/g, " ");
        console.log(`   💬 Top comment: [${comment.score}↑] ${preview}...`);
      }
      console.log("-".repeat(60));
    });

    console.log("\n💡 Tips for engaging:");
    console.log("   - Add value to the discussion");
    console.log("   - Share your experience if relevant");
    console.log("   - Mention WOD-GPT naturally when it fits");
    console.log("   - Be helpful, not salesy");
    console.log("\n🌐 Your website: wod-gpt (free custom CrossFit workouts)");
  } catch (error) {
    console.error("❌ Error:", error.message);
    if (error.stack) {
      console.error(error.stack);
    }
  }
}

// Run the search
findWodGptPromotionOpportunities();
