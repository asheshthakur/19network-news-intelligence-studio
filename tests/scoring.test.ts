import { describe, it, expect } from "vitest";
import { calculateOpportunityScore, KNOWN_SOURCE_CREDIBILITY } from "../src/lib/scoring";

describe("Opportunity Scoring Engine", () => {
  it("calculates a high opportunity score for a breaking UAE story from an official wire", () => {
    const score = calculateOpportunityScore({
      title: "UAE Central Bank Launches Sovereign Digital Dirham Pilot in Dubai",
      snippet: "Central bank initiates wholesale cross-border trial across UAE commercial banks.",
      source: "Emirates News Agency (WAM)",
      publishedAt: new Date().toISOString(),
      geoCategory: "UAE",
      category: "Finance",
      isMeasuredTrend: true,
    });

    expect(score.total).toBeGreaterThanOrEqual(85);
    expect(score.uaeRelevance).toBeGreaterThanOrEqual(25);
    expect(score.sourceCredibility).toBe(10);
    expect(score.freshness).toBe(10);
    expect(score.isHeuristicTrending).toBe(false);
  });

  it("handles non-UAE global stories with proportional scaling", () => {
    const score = calculateOpportunityScore({
      title: "European Central Bank Adjusts Benchmark Policy Rates",
      snippet: "Frankfurt updates inflation guidelines.",
      source: "Reuters",
      publishedAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
      geoCategory: "Europe",
      category: "Finance",
      isMeasuredTrend: false,
    });

    expect(score.uaeRelevance).toBeLessThan(10);
    expect(score.isHeuristicTrending).toBe(true);
    expect(score.total).toBeLessThan(75);
  });

  it("respects custom configurable weights from settings", () => {
    const customWeights = {
      uaeRelevance: 40,
      gccRelevance: 10,
      globalImportance: 20,
      trendingMomentum: 10,
      sourceCredibility: 10,
      freshness: 10,
    };

    const score = calculateOpportunityScore(
      {
        title: "Dubai Real Estate Surges to Record Highs",
        snippet: "DLD records historic transaction volume.",
        source: "Dubai Land Department",
        publishedAt: new Date().toISOString(),
        geoCategory: "UAE",
        category: "Real Estate",
      },
      customWeights
    );

    expect(score.uaeRelevance).toBeLessThanOrEqual(40);
    expect(score.total).toBeLessThanOrEqual(100);
  });
});
