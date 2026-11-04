export type SocialPlatform =
  | "instagram"
  | "linkedin"
  | "facebook"
  | "tiktok"
  | "x";

export interface PlatformConnectionStatus {
  platform: SocialPlatform;
  name: string;
  handle: string;
  isConnected: boolean;
  isUpcoming: boolean;
  statusLabel: "Verified Direct Profile" | "Sample Baseline" | "Upcoming Channel" | "CSV Imported";
  lastUpdated: string;
}

export interface InstagramMetrics {
  followers: number;
  posts: number;
  reach: number;
  impressions: number;
  engagement: number;
  engagementRate: number; // percentage
  likes: number;
  comments: number;
  saves: number;
  shares: number;
  reelViews: number;
  period: string;
}

export interface LinkedInMetrics {
  followers: number;
  impressions: number;
  pageViews: number;
  engagement: number;
  engagementRate: number; // percentage
  clicks: number;
  reactions: number;
  comments: number;
  shares: number;
  period: string;
}

export interface FacebookMetrics {
  followers: number;
  reach: number;
  impressions: number;
  engagement: number;
  engagementRate: number;
  views: number;
  reactions: number;
  period: string;
}

export interface TikTokMetrics {
  followers: number;
  videoViews: number;
  likes: number;
  comments: number;
  shares: number;
  engagement: number;
  engagementRate: number;
  period: string;
}

export interface XMetrics {
  followers: number;
  impressions: number;
  likes: number;
  reposts: number;
  replies: number;
  engagement: number;
  engagementRate: number;
  period: string;
}

export interface TopPerformingPost {
  id: string;
  platform: SocialPlatform;
  headline: string;
  publishedDate: string;
  impressions: number;
  engagements: number;
  engagementRate: number;
  category: string;
  url?: string;
}

export interface SocialDataset {
  instagram: InstagramMetrics;
  linkedIn: LinkedInMetrics;
  facebook?: FacebookMetrics;
  tiktok?: TikTokMetrics;
  x?: XMetrics;
  topPosts: TopPerformingPost[];
  growthHistory: Array<{
    month: string;
    instagramFollowers: number;
    linkedInFollowers: number;
    totalReach: number;
  }>;
  categoryPerformance: Array<{
    category: string;
    postsCount: number;
    avgEngagementRate: number;
  }>;
  lastImportedAt?: string;
}
