#!/bin/bash
# Example query for finding WOD-GPT promotion opportunities

echo "🔍 Searching for WOD-GPT promotion opportunities..."
echo ""

curl -X POST http://localhost:3000/api/reddit/promotion-opportunities \
  -H "Content-Type: application/json" \
  -d '{
    "websiteDescription": "WOD-GPT generates custom CrossFit workouts for free",
    "keywords": [
      "crossfit",
      "wod",
      "workout",
      "fitness",
      "training",
      "exercise",
      "workout plan",
      "crossfit programming",
      "free workout",
      "custom workout"
    ],
    "subreddits": [
      "crossfit",
      "fitness",
      "workout",
      "bodyweightfitness",
      "homegym",
      "xxfitness"
    ],
    "maxThreads": 10,
    "maxCommentsPerThread": 1
  }' | jq '.'

echo ""
echo "💡 Tips:"
echo "   - Look for threads where people are asking for workout plans"
echo "   - Find discussions about CrossFit programming"
echo "   - Engage in threads about free fitness resources"
echo "   - Be helpful and add value to discussions"

