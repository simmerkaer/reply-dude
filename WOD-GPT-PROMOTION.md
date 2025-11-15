# WOD-GPT Promotion Guide

This guide shows you how to use Reply Dude to find Reddit promotion opportunities for **WOD-GPT** - your free custom CrossFit workout generator.

## Quick Start

### 1. Start the Server

```bash
npm start
```

### 2. Find Promotion Opportunities

**Using curl:**
```bash
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
  }'
```

**Using the example script:**
```bash
node examples/wod-gpt-promotion.js
```

## Target Subreddits

Here are the best subreddits for promoting WOD-GPT:

### Primary Targets
- **r/crossfit** - Main CrossFit community
- **r/fitness** - General fitness discussions
- **r/workout** - Workout planning and routines

### Secondary Targets
- **r/bodyweightfitness** - Bodyweight exercise enthusiasts
- **r/homegym** - Home gym users looking for workouts
- **r/xxfitness** - Women's fitness community
- **r/weightlifting** - Weightlifting enthusiasts
- **r/strength_training** - Strength training focused

## Best Keywords to Use

```
"crossfit"
"wod" (Workout of the Day)
"workout"
"fitness"
"training"
"exercise"
"workout plan"
"crossfit programming"
"free workout"
"custom workout"
"workout generator"
"fitness routine"
```

## What to Look For

### High-Value Threads
1. **People asking for workout plans**
   - "Looking for a new workout routine"
   - "Need help with CrossFit programming"
   - "What's a good WOD for beginners?"

2. **Discussions about free fitness resources**
   - "Best free workout apps"
   - "Free CrossFit programming"
   - "Looking for workout generators"

3. **Questions about customizing workouts**
   - "How do I create a custom WOD?"
   - "Need workouts tailored to my equipment"
   - "Looking for personalized training"

### High-Value Comments
- Comments asking for workout recommendations
- People sharing their workout struggles
- Discussions about needing variety in workouts
- Questions about free fitness tools

## Example Engagement Strategy

### Good Engagement Example:
```
"I've been using WOD-GPT (wod-gpt.com) for generating custom CrossFit 
workouts - it's free and creates workouts based on your equipment and 
goals. Might be worth checking out if you're looking for variety!"
```

### What Makes This Good:
✅ Adds value (solves their problem)
✅ Mentions it's free
✅ Explains what it does
✅ Natural, not pushy

### Bad Engagement Example:
```
"Check out WOD-GPT! It's the best!"
```

### Why This is Bad:
❌ No context
❌ Doesn't explain value
❌ Too salesy
❌ Will likely get downvoted

## Search Strategies

### Strategy 1: Broad Search (Find More Opportunities)
```json
{
  "keywords": ["crossfit", "workout", "fitness"],
  "subreddits": ["crossfit", "fitness"],
  "maxThreads": 10,
  "maxCommentsPerThread": 1
}
```

### Strategy 2: Focused Search (Higher Quality)
```json
{
  "keywords": ["wod", "crossfit programming", "workout plan"],
  "subreddits": ["crossfit"],
  "maxThreads": 10,
  "maxCommentsPerThread": 1
}
```

### Strategy 3: Problem-Specific Search
```json
{
  "keywords": ["free workout", "workout generator", "custom workout"],
  "subreddits": ["fitness", "workout", "homegym"],
  "maxThreads": 10,
  "maxCommentsPerThread": 1
}
```

**Note:** We're using `maxThreads: 10` and `maxCommentsPerThread: 1` to get the top 10 promotion opportunities with one comment per thread.

## API Endpoint Examples

### Search for Specific Topics
```bash
# Find threads about workout planning
curl "http://localhost:3000/api/reddit/search/threads?query=workout%20plan&subreddit=crossfit&limit=10"

# Find discussions about free fitness tools
curl "http://localhost:3000/api/reddit/search/threads?query=free%20workout&subreddit=fitness&limit=10"
```

### Get Comments from a Thread
```bash
# Replace abc123 with actual thread ID
curl "http://localhost:3000/api/reddit/thread/abc123/comments?keywords=crossfit,workout&limit=20"
```

## Best Practices

1. **Check Relevance Scores**: Higher scores (70+) indicate better matches
2. **Look at Engagement**: Threads with more comments = more visibility
3. **Timing Matters**: Newer threads (< 24 hours) get more attention
4. **Read Before Posting**: Make sure your comment actually adds value
5. **Be Authentic**: Share your experience, don't just promote

## Monitoring Results

Track which threads and subreddits work best:

1. Note which subreddits have highest relevance scores
2. Track which keywords find the best opportunities
3. Monitor engagement on your comments
4. Adjust your search strategy based on results

## Rate Limiting

Reddit limits ~60 requests per minute. The service handles this automatically, but:
- Don't make too many rapid requests
- Wait a minute if you see rate limit errors
- Consider running searches at different times

## Next Steps

1. **Run the search** using the examples above
2. **Review results** - check relevance scores and engagement
3. **Visit threads** - read the full context before engaging
4. **Craft helpful responses** - add value, mention WOD-GPT naturally
5. **Track results** - see which approaches work best

Good luck promoting WOD-GPT! 🏋️‍♂️

