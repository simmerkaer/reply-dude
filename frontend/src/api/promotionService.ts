// Use environment variable for production, fallback to relative path for development
const API_BASE = import.meta.env.VITE_API_URL || '/api/reddit';

export interface PromotionOpportunity {
  id: string;
  title: string;
  url: string;
  permalink: string;
  subreddit: string;
  author: string;
  score: number;
  numComments: number;
  created: string;
  selftext: string;
  relevanceScore: number;
  isPromotionOpportunity: boolean;
  topComments?: Comment[];
}

export interface Comment {
  id: string;
  body: string;
  author: string;
  score: number;
  created: string;
  permalink: string;
  parentId: string;
  relevanceScore: number;
  isPromotionOpportunity: boolean;
}

export interface PromotionOpportunitiesResponse {
  success: boolean;
  totalOpportunities: number;
  threadCount: number;
  results: PromotionOpportunity[];
}

export interface SearchThreadsResponse {
  success: boolean;
  count: number;
  results: PromotionOpportunity[];
}

export class PromotionService {
  async findPromotionOpportunities(
    websiteDescription: string,
    keywords: string[],
    options: {
      subreddits?: string[];
      maxThreads?: number;
      maxCommentsPerThread?: number;
    } = {}
  ): Promise<PromotionOpportunitiesResponse> {
    const response = await fetch(`${API_BASE}/promotion-opportunities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        websiteDescription,
        keywords,
        subreddits: options.subreddits || [],
        maxThreads: options.maxThreads || 10,
        maxCommentsPerThread: options.maxCommentsPerThread || 1,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async searchThreads(
    query: string,
    options: {
      subreddit?: string;
      sort?: string;
      time?: string;
      limit?: number;
      keywords?: string[];
    } = {}
  ): Promise<SearchThreadsResponse> {
    const params = new URLSearchParams({
      query,
      ...(options.subreddit && { subreddit: options.subreddit }),
      ...(options.sort && { sort: options.sort }),
      ...(options.time && { time: options.time }),
      ...(options.limit && { limit: String(options.limit) }),
      ...(options.keywords && { keywords: options.keywords.join(',') }),
    });

    const response = await fetch(`${API_BASE}/search/threads?${params}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}

export default new PromotionService();

