import { describe, it, expect } from "vitest";
import { clusterStories } from "../src/lib/clustering";
import { NewsStory } from "../src/types/news";

describe("Duplicate Detection & Clustering Engine", () => {
  const sampleStories: NewsStory[] = [
    {
      id: "story-1",
      title: "Dubai International Financial Centre Reports 26% Growth in Active Companies",
      url: "https://example.com/1",
      source: "DIFC",
      publishedAt: new Date().toISOString(),
      discoveredAt: new Date().toISOString(),
      snippet: "DIFC welcomed over 800 new financial firms.",
      geoCategory: "UAE",
      category: "Business",
      score: {
        uaeRelevance: 28,
        gccRelevance: 18,
        globalImportance: 12,
        trendingMomentum: 12,
        sourceCredibility: 10,
        freshness: 10,
        total: 90,
      },
    },
    {
      id: "story-2",
      title: "DIFC Reports 26% Surge in Active Registered Companies Across Dubai",
      url: "https://example.com/2",
      source: "Arabian Business",
      publishedAt: new Date().toISOString(),
      discoveredAt: new Date().toISOString(),
      snippet: "Financial hub registers milestone year.",
      geoCategory: "UAE",
      category: "Business",
      score: {
        uaeRelevance: 27,
        gccRelevance: 17,
        globalImportance: 11,
        trendingMomentum: 11,
        sourceCredibility: 8,
        freshness: 9,
        total: 83,
      },
    },
    {
      id: "story-3",
      title: "Saudi Arabia Launches New Solar Grid in Tabuk Province",
      url: "https://example.com/3",
      source: "SPA",
      publishedAt: new Date().toISOString(),
      discoveredAt: new Date().toISOString(),
      snippet: "Renewable energy milestone under Vision 2030.",
      geoCategory: "Saudi Arabia",
      category: "Energy",
      score: {
        uaeRelevance: 15,
        gccRelevance: 20,
        globalImportance: 12,
        trendingMomentum: 10,
        sourceCredibility: 10,
        freshness: 8,
        total: 75,
      },
    },
  ];

  it("clusters near-identical headlines while preserving independent source links", () => {
    const { clusteredStories, clusters } = clusterStories(sampleStories);

    expect(clusters.length).toBe(1);
    expect(clusters[0].totalSources).toBe(2);
    expect(clusters[0].canonicalStory.id).toBe("story-1");
    expect(clusters[0].canonicalStory.duplicateCount).toBe(2);
    expect(clusters[0].canonicalStory.relatedSources?.length).toBe(1);
    expect(clusters[0].canonicalStory.relatedSources?.[0].source).toBe("Arabian Business");
  });

  it("leaves unrelated stories unclustered", () => {
    const { clusters } = clusterStories(sampleStories);
    const hasSaudiStory = clusters.some((c) => c.stories.some((s) => s.id === "story-3"));
    expect(hasSaudiStory).toBe(false);
  });
});
