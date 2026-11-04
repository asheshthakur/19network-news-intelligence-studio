import { NewsFetchResponse, NewsStory, StoryCluster } from "@/types/news";
import { fetchRssFeed } from "./rss-adapter";
import { fetchGdeltNews } from "./gdelt-adapter";
import { clusterStories } from "../clustering";
import { INITIAL_FALLBACK_STORIES } from "../sample-data";

export async function fetchAggregatedNews(options?: {
  query?: string;
  geo?: string;
}): Promise<NewsFetchResponse> {
  const sourcesStatus: NewsFetchResponse["sourcesStatus"] = [];
  const allStories: NewsStory[] = [];

  // 1. Google News UAE Feed
  const uaeQuery = options?.query ? `UAE+${encodeURIComponent(options.query)}` : "UAE+business+OR+AI+OR+economy";
  const uaeFeedUrl = `https://news.google.com/rss/search?q=${uaeQuery}&hl=en-AE&gl=AE&ceid=AE:en`;

  // 2. Google News GCC Feed
  const gccQuery = options?.query ? `Saudi+${encodeURIComponent(options.query)}` : "Saudi+Vision+2030+OR+GCC+economy";
  const gccFeedUrl = `https://news.google.com/rss/search?q=${gccQuery}&hl=en-US&gl=US&ceid=US:en`;

  // 3. Google News Global AI/Business Feed
  const globalQuery = options?.query ? encodeURIComponent(options.query) : "artificial+intelligence+breakthrough+OR+global+markets";
  const globalFeedUrl = `https://news.google.com/rss/search?q=${globalQuery}&hl=en-US&gl=US&ceid=US:en`;

  // Fetch in parallel using Promise.allSettled
  const results = await Promise.allSettled([
    fetchRssFeed(uaeFeedUrl, "Google News UAE", "UAE"),
    fetchRssFeed(gccFeedUrl, "Google News GCC", "GCC-wide"),
    fetchRssFeed(globalFeedUrl, "Google News Global", "Global"),
    fetchGdeltNews(options?.query || "UAE economy OR Dubai investment OR GCC artificial intelligence"),
  ]);

  // Process Google News UAE
  if (results[0].status === "fulfilled") {
    sourcesStatus.push({
      source: "Google News UAE RSS",
      status: "ok",
      count: results[0].value.length,
    });
    allStories.push(...results[0].value);
  } else {
    sourcesStatus.push({
      source: "Google News UAE RSS",
      status: "failed",
      count: 0,
      error: results[0].reason?.message || "Feed connection failed",
    });
  }

  // Process Google News GCC
  if (results[1].status === "fulfilled") {
    sourcesStatus.push({
      source: "Google News GCC RSS",
      status: "ok",
      count: results[1].value.length,
    });
    allStories.push(...results[1].value);
  } else {
    sourcesStatus.push({
      source: "Google News GCC RSS",
      status: "failed",
      count: 0,
      error: results[1].reason?.message || "Feed connection failed",
    });
  }

  // Process Google News Global
  if (results[2].status === "fulfilled") {
    sourcesStatus.push({
      source: "Google News Global RSS",
      status: "ok",
      count: results[2].value.length,
    });
    allStories.push(...results[2].value);
  } else {
    sourcesStatus.push({
      source: "Google News Global RSS",
      status: "failed",
      count: 0,
      error: results[2].reason?.message || "Feed connection failed",
    });
  }

  // Process GDELT DOC 2.0 API
  if (results[3].status === "fulfilled") {
    sourcesStatus.push({
      source: "GDELT DOC 2.0 API",
      status: results[3].value.length > 0 ? "ok" : "degraded",
      count: results[3].value.length,
    });
    allStories.push(...results[3].value);
  } else {
    sourcesStatus.push({
      source: "GDELT DOC 2.0 API",
      status: "degraded",
      count: 0,
      error: results[3].reason?.message || "Rate limited or timeout",
    });
  }

  // If live feeds were completely unavailable (e.g. sandbox offline), merge verified fallback sample stories
  if (allStories.length === 0) {
    allStories.push(...INITIAL_FALLBACK_STORIES);
    sourcesStatus.push({
      source: "Editorial Fallback Dataset",
      status: "ok",
      count: INITIAL_FALLBACK_STORIES.length,
    });
  }

  // Deduplicate exact same URLs
  const seenUrls = new Set<string>();
  const uniqueStories: NewsStory[] = [];
  for (const s of allStories) {
    if (!seenUrls.has(s.url)) {
      seenUrls.add(s.url);
      uniqueStories.push(s);
    }
  }

  // Apply clustering & duplicate detection
  const { clusteredStories, clusters } = clusterStories(uniqueStories);

  // Sort by opportunity score descending
  clusteredStories.sort((a, b) => b.score.total - a.score.total);

  return {
    stories: clusteredStories,
    clusters,
    sourcesStatus,
    fetchedAt: new Date().toISOString(),
  };
}
