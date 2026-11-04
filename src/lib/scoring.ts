import { GeoCategory, NewsCategory, ScoringBreakdown } from "@/types/news";
import { ScoringWeights } from "@/types/settings";

// Known reputable media sources and credibility tier (1 to 10)
export const KNOWN_SOURCE_CREDIBILITY: Record<string, number> = {
  "Emirates News Agency (WAM)": 10,
  "Saudi Press Agency (SPA)": 10,
  "Dubai Land Department": 10,
  "DIFC Official": 10,
  "Reuters": 10,
  "Bloomberg": 10,
  "Bloomberg Technology": 10,
  "Financial Times": 10,
  "Associated Press": 9,
  "The National": 9,
  "Gulf News": 9,
  "Arabian Business": 8,
  "Khaleej Times": 8,
  "Zawya": 8,
  "Al Arabiya": 8,
  "Asharq Business": 8,
  "Yahoo News": 7,
  "Google News": 7,
};

const UAE_KEYWORDS = [
  "uae",
  "dubai",
  "abu dhabi",
  "sharjah",
  "dirham",
  "difc",
  "adgm",
  "burj",
  "dld",
  "hub71",
  "masdar",
  "adnoc",
  "emirates",
  "central bank of the uae",
  "sheikh mohammed",
  "sheikh mohamed",
  "al maktoum",
  "palm jumeirah",
];

const GCC_KEYWORDS = [
  "saudi",
  "riyadh",
  "jeddah",
  "neom",
  "pif",
  "aramco",
  "vision 2030",
  "qatar",
  "doha",
  "kuwait",
  "bahrain",
  "oman",
  "muscat",
  "gcc",
  "gulf cooperation",
  "opec",
  "opec+",
];

const GLOBAL_IMPORTANCE_KEYWORDS = [
  "breakthrough",
  "central bank",
  "interest rate",
  "semiconductor",
  "artificial intelligence",
  "sovereign",
  "sovereign wealth",
  "gdp",
  "inflation",
  "merger",
  "acquisition",
  "billion",
  "geopolitical",
  "trade agreement",
  "global economy",
  "cross-border",
  "digital currency",
  "pilot",
];

export function calculateOpportunityScore(
  story: {
    title: string;
    snippet?: string;
    source: string;
    publishedAt: string;
    geoCategory?: GeoCategory;
    category?: NewsCategory;
    isMeasuredTrend?: boolean;
  },
  weights: ScoringWeights = {
    uaeRelevance: 30,
    gccRelevance: 20,
    globalImportance: 15,
    trendingMomentum: 15,
    sourceCredibility: 10,
    freshness: 10,
  }
): ScoringBreakdown {
  const content = `${story.title} ${story.snippet || ""}`.toLowerCase();
  const notes: string[] = [];

  // 1. UAE Relevance (Max 30, scaled by weights.uaeRelevance / 30)
  let uaeRaw = 0;
  if (story.geoCategory === "UAE") {
    uaeRaw += 20;
  }
  const uaeMatches = UAE_KEYWORDS.filter((k) => content.includes(k));
  if (uaeMatches.length > 0) {
    uaeRaw += Math.min(10, uaeMatches.length * 3);
    notes.push(`UAE keywords detected: ${uaeMatches.slice(0, 3).join(", ")}`);
  }
  uaeRaw = Math.min(30, uaeRaw);
  const uaeRelevance = Math.round((uaeRaw / 30) * weights.uaeRelevance);

  // 2. GCC Relevance (Max 20, scaled by weights.gccRelevance / 20)
  let gccRaw = 0;
  // Note: UAE is an integral member of the GCC, so UAE sovereign/financial stories hold intrinsic regional relevance
  if (story.geoCategory === "UAE") {
    gccRaw += 12;
  } else if (
    story.geoCategory &&
    ["Saudi Arabia", "Qatar", "Kuwait", "Bahrain", "Oman", "GCC-wide"].includes(story.geoCategory)
  ) {
    gccRaw += 16;
  }
  const gccMatches = GCC_KEYWORDS.filter((k) => content.includes(k));
  if (gccMatches.length > 0) {
    gccRaw += Math.min(8, gccMatches.length * 2);
    notes.push(`Regional GCC references: ${gccMatches.slice(0, 3).join(", ")}`);
  }
  gccRaw = Math.min(20, gccRaw);
  const gccRelevance = Math.round((gccRaw / 20) * weights.gccRelevance);

  // 3. Global Importance (Max 15, scaled by weights.globalImportance / 15)
  let globalRaw = 0;
  const globalMatches = GLOBAL_IMPORTANCE_KEYWORDS.filter((k) => content.includes(k));
  if (globalMatches.length > 0) {
    globalRaw = Math.min(15, 6 + globalMatches.length * 3);
  } else {
    globalRaw = 5;
  }
  const globalImportance = Math.round((globalRaw / 15) * weights.globalImportance);

  // 4. Trending / Search Momentum (Max 15)
  let trendingRaw = 0;
  const isMeasured = Boolean(story.isMeasuredTrend);
  if (isMeasured) {
    trendingRaw = 13;
    notes.push("Direct search/social velocity trend measured");
  } else {
    // Heuristic trend calculation based on breaking keywords
    const breakingKeywords = ["breaking", "surge", "record", "launches", "unveils", "approved", "first"];
    const hasBreaking = breakingKeywords.some((k) => content.includes(k));
    trendingRaw = hasBreaking ? 9 : 6;
    notes.push("Estimated velocity from editorial momentum heuristic");
  }
  const trendingMomentum = Math.round((trendingRaw / 15) * weights.trendingMomentum);

  // 5. Source Credibility (Max 10)
  let credibilityRating = 7;
  for (const [knownSource, rating] of Object.entries(KNOWN_SOURCE_CREDIBILITY)) {
    if (story.source.toLowerCase().includes(knownSource.toLowerCase())) {
      credibilityRating = rating;
      break;
    }
  }
  const sourceCredibility = Math.round((credibilityRating / 10) * weights.sourceCredibility);

  // 6. Freshness (Max 10)
  let freshnessRaw = 10;
  try {
    const pubDate = new Date(story.publishedAt);
    const now = new Date();
    const diffHours = (now.getTime() - pubDate.getTime()) / (1000 * 60 * 60);

    if (diffHours <= 2) {
      freshnessRaw = 10;
    } else if (diffHours <= 6) {
      freshnessRaw = 9;
    } else if (diffHours <= 12) {
      freshnessRaw = 8;
    } else if (diffHours <= 24) {
      freshnessRaw = 6;
    } else if (diffHours <= 48) {
      freshnessRaw = 4;
    } else {
      freshnessRaw = 2;
    }
  } catch {
    freshnessRaw = 5;
  }
  const freshness = Math.round((freshnessRaw / 10) * weights.freshness);

  const total = Math.min(
    100,
    uaeRelevance + gccRelevance + globalImportance + trendingMomentum + sourceCredibility + freshness
  );

  return {
    uaeRelevance,
    gccRelevance,
    globalImportance,
    trendingMomentum,
    sourceCredibility,
    freshness,
    total,
    scoringNotes: notes,
    isHeuristicTrending: !isMeasured,
  };
}
