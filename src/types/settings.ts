export interface ScoringWeights {
  uaeRelevance: number; // default 30
  gccRelevance: number; // default 20
  globalImportance: number; // default 15
  trendingMomentum: number; // default 15
  sourceCredibility: number; // default 10
  freshness: number; // default 10
}

export interface RSSFeedSource {
  id: string;
  name: string;
  url: string;
  region: "UAE" | "GCC" | "Global";
  enabled: boolean;
  credibilityWeight: number; // 1 - 10
  isDefault: boolean;
}

export interface WordPressConnection {
  siteUrl: string;
  hasCredentials: boolean;
  status: "connected" | "unconfigured" | "error";
  lastTestedAt?: string;
}

export interface StudioSettings {
  scoringWeights: ScoringWeights;
  sources: RSSFeedSource[];
  defaultTimezone: string;
  defaultAuthor: string;
  darkMode: boolean;
  editorialReviewRequired: boolean;
  wordpress: WordPressConnection;
}
