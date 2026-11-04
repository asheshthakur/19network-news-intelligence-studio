import { GeoCategory, NewsCategory, NewsStory } from "./news";

export interface EditorialAngle {
  id: string;
  name: string;
  hook: string;
  targetAudience: string;
  recommendedFormat: "Article" | "Explainer" | "Feature" | "Analysis" | "Social Series";
  description: string;
}

export interface FactCheckItem {
  id: string;
  claim: string;
  sourceReference: string;
  status: "verified" | "requires_verification" | "official_statement";
  notes?: string;
}

export interface StoryIntelligenceData {
  story: NewsStory;
  geoSignificance: {
    uae: string;
    gcc: string;
    global: string;
  };
  suggestedAudience: string[];
  angles: EditorialAngle[];
  factCheckList: FactCheckItem[];
  relatedDevelopments: string[];
}

export interface HeadlineOption {
  type: "Primary" | "Click-Worthy" | "SEO" | "Analytical" | "Short";
  text: string;
}

export interface ArticlePackage {
  headlines: HeadlineOption[];
  primaryHeadline: string;
  seoTitle: string;
  metaDescription: string;
  suggestedSlug: string;
  introduction: string;
  h2Structure: string[];
  keyFactsToVerify: string[];
  relevantKeywords: string[];
  relatedEntities: string[];
  internalLinkingSuggestions: string[];
  sourceAttribution: string;
  suggestedFeaturedImage: {
    description: string;
    altText: string;
    promptText: string;
  };
  socialSharingText: string;
  isDeterministic: boolean;
}

export interface SocialMediaPackage {
  instagram: {
    carouselConcept: string;
    coverHeadline: string;
    slides: Array<{
      slideNumber: number;
      headline: string;
      body: string;
      visualCue: string;
    }>;
    caption: string;
    hashtags: string[];
  };
  linkedIn: {
    businessAngle: string;
    openingHook: string;
    supportingPoints: string[];
    callToAction: string;
    fullPost: string;
  };
  x: {
    breakingPost: string;
    commentaryPost: string;
    thread: string[];
  };
  facebook: {
    newsSummary: string;
    caption: string;
    discussionPrompt: string;
  };
  tiktok: {
    hook: string;
    durationEstimate: string;
    visualDirection: string;
    script: Array<{
      timecode: string;
      audio: string;
      visual: string;
    }>;
  };
  isDeterministic: boolean;
}

export interface CompleteIdeationBrief {
  id: string;
  storyId?: string;
  topic: string;
  geoCategory: GeoCategory;
  category: NewsCategory;
  targetAudience: string;
  articlePackage: ArticlePackage;
  socialPackage: SocialMediaPackage;
  createdAt: string;
}
