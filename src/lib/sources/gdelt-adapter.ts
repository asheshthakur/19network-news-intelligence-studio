import { GeoCategory, NewsCategory, NewsStory } from "@/types/news";
import { calculateOpportunityScore } from "../scoring";

interface GdeltArticle {
  url: string;
  url_mobile?: string;
  title: string;
  seendate: string;
  socialimage?: string;
  domain: string;
  language: string;
  sourcecountry: string;
}

interface GdeltResponse {
  articles?: GdeltArticle[];
}

export async function fetchGdeltNews(
  query: string = "UAE economy OR Dubai OR Middle East technology",
  timeoutMs: number = 7000
): Promise<NewsStory[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const endpoint = `https://api.gdeltproject.org/api/v2/doc/doc?query=${encodeURIComponent(
    query
  )}&mode=ArtList&maxrecords=25&format=json`;

  try {
    const res = await fetch(endpoint, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      throw new Error(`GDELT API error status: ${res.status}`);
    }

    const data: GdeltResponse = await res.json();
    if (!data || !data.articles || !Array.isArray(data.articles)) {
      return [];
    }

    const stories: NewsStory[] = [];

    for (const art of data.articles) {
      if (!art.title || !art.url) continue;

      let publishedAt: string;
      try {
        // GDELT seendate format: YYYYMMDDTHHMMSSZ
        if (art.seendate && art.seendate.length >= 8) {
          const y = art.seendate.slice(0, 4);
          const m = art.seendate.slice(4, 6);
          const d = art.seendate.slice(6, 8);
          publishedAt = `${y}-${m}-${d}T12:00:00Z`;
        } else {
          publishedAt = new Date().toISOString();
        }
      } catch {
        publishedAt = new Date().toISOString();
      }

      const title = art.title.trim();
      const domain = art.domain || "GDELT Monitored Publisher";

      let geoCategory: GeoCategory = "Global";
      const titleLower = title.toLowerCase();
      if (titleLower.includes("uae") || titleLower.includes("dubai") || titleLower.includes("abu dhabi")) {
        geoCategory = "UAE";
      } else if (titleLower.includes("saudi") || titleLower.includes("riyadh")) {
        geoCategory = "Saudi Arabia";
      } else if (titleLower.includes("qatar")) {
        geoCategory = "Qatar";
      } else if (titleLower.includes("gulf") || titleLower.includes("gcc")) {
        geoCategory = "GCC-wide";
      }

      let category: NewsCategory = "General";
      if (titleLower.includes("tech") || titleLower.includes("ai") || titleLower.includes("cyber")) {
        category = "AI & Technology";
      } else if (titleLower.includes("business") || titleLower.includes("market") || titleLower.includes("growth")) {
        category = "Business";
      } else if (titleLower.includes("finance") || titleLower.includes("bank") || titleLower.includes("rate")) {
        category = "Finance";
      } else if (titleLower.includes("oil") || titleLower.includes("energy")) {
        category = "Energy";
      }

      const score = calculateOpportunityScore({
        title,
        snippet: `Monitored across international publication feeds via GDELT global index.`,
        source: domain,
        publishedAt,
        geoCategory,
        category,
        isMeasuredTrend: true, // GDELT measures global coverage volume
      });

      const storyId = `gdelt-${Buffer.from(title.slice(0, 40)).toString("base64url")}`;

      stories.push({
        id: storyId,
        title,
        url: art.url,
        source: domain,
        publishedAt,
        discoveredAt: new Date().toISOString(),
        snippet: `Global media monitoring entry from ${domain}. Indexed via GDELT DOC 2.0 API.`,
        geoCategory,
        category,
        isBreaking: score.total >= 85,
        isTrending: true,
        isMeasuredTrend: true,
        score,
      });
    }

    return stories;
  } finally {
    clearTimeout(timeoutId);
  }
}
