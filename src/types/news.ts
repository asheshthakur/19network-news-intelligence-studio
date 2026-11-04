export type GeoCategory =
  | "UAE"
  | "Saudi Arabia"
  | "Qatar"
  | "Kuwait"
  | "Bahrain"
  | "Oman"
  | "GCC-wide"
  | "South Asia"
  | "Europe"
  | "United States"
  | "Asia-Pacific"
  | "Global";

export type NewsCategory =
  | "Business"
  | "Finance"
  | "Real Estate"
  | "AI & Technology"
  | "Politics & Policy"
  | "Sports"
  | "Lifestyle"
  | "Automotive"
  | "Energy"
  | "Travel & Tourism"
  | "General";

export type QuickFilter =
  | "All"
  | "Breaking"
  | "Trending"
  | "Latest"
  | "Most Relevant";

export interface ScoringBreakdown {
  uaeRelevance: number; // max 30
  gccRelevance: number; // max 20
  globalImportance: number; // max 15
  trendingMomentum: number; // max 15
  sourceCredibility: number; // max 10
  freshness: number; // max 10
  total: number; // 0 - 100
  scoringNotes?: string[];
  isHeuristicTrending?: boolean;
}

export interface NewsStory {
  id: string;
  title: string;
  url: string;
  source: string;
  sourceUrl?: string;
  publishedAt: string;
  discoveredAt: string;
  snippet: string;
  geoCategory: GeoCategory;
  category: NewsCategory;
  isBreaking?: boolean;
  isTrending?: boolean;
  isMeasuredTrend?: boolean;
  score: ScoringBreakdown;
  clusterId?: string;
  duplicateCount?: number;
  relatedSources?: Array<{
    title: string;
    source: string;
    url: string;
    publishedAt: string;
  }>;
  saved?: boolean;
}

export interface StoryCluster {
  id: string;
  canonicalStory: NewsStory;
  stories: NewsStory[];
  keywordTheme: string;
  totalSources: number;
}

export interface NewsFetchResponse {
  stories: NewsStory[];
  clusters: StoryCluster[];
  sourcesStatus: Array<{
    source: string;
    status: "ok" | "degraded" | "failed";
    count: number;
    error?: string;
  }>;
  fetchedAt: string;
}
