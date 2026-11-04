import { XMLParser } from "fast-xml-parser";
import { GeoCategory, NewsCategory, NewsStory } from "@/types/news";
import { calculateOpportunityScore } from "../scoring";

function isSafeUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    if (url.protocol !== "http:" && url.protocol !== "https:") return false;
    const hostname = url.hostname.toLowerCase();
    // Block internal and private IPs
    if (
      hostname === "localhost" ||
      hostname.endsWith(".localhost") ||
      hostname.startsWith("127.") ||
      hostname.startsWith("10.") ||
      hostname.startsWith("192.168.") ||
      hostname.startsWith("169.254.") ||
      hostname === "::1" ||
      hostname === "0.0.0.0"
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

function cleanHtmlSnippet(html: string): string {
  if (!html) return "";
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function detectGeoAndCategory(
  title: string,
  snippet: string,
  fallbackGeo: GeoCategory = "UAE"
): { geo: GeoCategory; category: NewsCategory } {
  const text = `${title} ${snippet}`.toLowerCase();

  // Geo
  let geo: GeoCategory = fallbackGeo;
  if (text.includes("dubai") || text.includes("abu dhabi") || text.includes("uae") || text.includes("sharjah")) {
    geo = "UAE";
  } else if (text.includes("saudi") || text.includes("riyadh") || text.includes("neom")) {
    geo = "Saudi Arabia";
  } else if (text.includes("qatar") || text.includes("doha")) {
    geo = "Qatar";
  } else if (text.includes("kuwait")) {
    geo = "Kuwait";
  } else if (text.includes("bahrain")) {
    geo = "Bahrain";
  } else if (text.includes("oman") || text.includes("muscat")) {
    geo = "Oman";
  } else if (text.includes("gcc") || text.includes("gulf")) {
    geo = "GCC-wide";
  }

  // Category
  let category: NewsCategory = "General";
  if (text.includes("real estate") || text.includes("property") || text.includes("villa") || text.includes("off-plan")) {
    category = "Real Estate";
  } else if (text.includes("ai") || text.includes("artificial intelligence") || text.includes("tech") || text.includes("chip") || text.includes("software")) {
    category = "AI & Technology";
  } else if (text.includes("bank") || text.includes("finance") || text.includes("fund") || text.includes("dirham") || text.includes("stock") || text.includes("crypto")) {
    category = "Finance";
  } else if (text.includes("economy") || text.includes("business") || text.includes("trade") || text.includes("startup") || text.includes("investment")) {
    category = "Business";
  } else if (text.includes("oil") || text.includes("gas") || text.includes("energy") || text.includes("renewable") || text.includes("solar") || text.includes("hydrogen")) {
    category = "Energy";
  } else if (text.includes("tourism") || text.includes("hotel") || text.includes("airline") || text.includes("travel") || text.includes("flight")) {
    category = "Travel & Tourism";
  } else if (text.includes("ev") || text.includes("automotive") || text.includes("car") || text.includes("vehicle")) {
    category = "Automotive";
  } else if (text.includes("sport") || text.includes("football") || text.includes("f1") || text.includes("race")) {
    category = "Sports";
  } else if (text.includes("policy") || text.includes("government") || text.includes("law") || text.includes("decree") || text.includes("minister")) {
    category = "Politics & Policy";
  }

  return { geo, category };
}

export async function fetchRssFeed(
  feedUrl: string,
  sourceName: string,
  defaultGeo: GeoCategory = "UAE",
  timeoutMs: number = 6000
): Promise<NewsStory[]> {
  if (!isSafeUrl(feedUrl)) {
    throw new Error(`Unsafe or disallowed feed URL: ${feedUrl}`);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(feedUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent": "19NetworkNewsStudio/1.0 (+https://www.19network.com)",
        Accept: "application/rss+xml, application/xml, text/xml, */*",
      },
      next: { revalidate: 300 }, // 5 min cache
    });

    if (!res.ok) {
      throw new Error(`HTTP error ${res.status} from ${sourceName}`);
    }

    const xmlText = await res.text();
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
    });
    const parsed = parser.parse(xmlText);

    const items =
      parsed?.rss?.channel?.item ||
      parsed?.feed?.entry ||
      [];

    const list = Array.isArray(items) ? items : [items];
    const stories: NewsStory[] = [];

    for (let i = 0; i < Math.min(list.length, 30); i++) {
      const it = list[i];
      if (!it || !it.title) continue;

      const title = cleanHtmlSnippet(String(it.title));
      const link = String(it.link?.["#text"] || it.link || it.guid?.["#text"] || it.guid || "");
      const description = cleanHtmlSnippet(String(it.description || it.summary || ""));
      const pubDateStr = String(it.pubDate || it.published || it.updated || new Date().toISOString());

      // Parse source publisher if in RSS
      let publisher = sourceName;
      if (it.source) {
        publisher = typeof it.source === "string" ? it.source : it.source["#text"] || sourceName;
      }

      const { geo, category } = detectGeoAndCategory(title, description, defaultGeo);

      const score = calculateOpportunityScore({
        title,
        snippet: description,
        source: publisher,
        publishedAt: pubDateStr,
        geoCategory: geo,
        category,
        isMeasuredTrend: false,
      });

      const storyId = `rss-${Buffer.from(title.slice(0, 40)).toString("base64url")}`;

      stories.push({
        id: storyId,
        title,
        url: link || "https://news.google.com",
        source: publisher,
        publishedAt: pubDateStr,
        discoveredAt: new Date().toISOString(),
        snippet: description.slice(0, 240) + (description.length > 240 ? "..." : ""),
        geoCategory: geo,
        category,
        isBreaking: score.total >= 85,
        isTrending: score.total >= 78,
        isMeasuredTrend: false,
        score,
      });
    }

    return stories;
  } finally {
    clearTimeout(timeoutId);
  }
}
