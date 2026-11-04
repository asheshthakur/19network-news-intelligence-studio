import { describe, it, expect } from "vitest";
import {
  generateArticlePackage,
  generateSocialPackage,
  generateStoryIntelligence,
} from "../src/lib/ideation-engine";
import { INITIAL_FALLBACK_STORIES } from "../src/lib/sample-data";

describe("Content Ideation Studio Engine", () => {
  it("produces complete 5-headline variation package with SEO slugs and H2 structure", () => {
    const pkg = generateArticlePackage(
      "Dubai AI Campus Expands to Support 500 Startups",
      "UAE",
      "AI & Technology"
    );

    expect(pkg.headlines.length).toBe(5);
    expect(pkg.primaryHeadline).toBeDefined();
    expect(pkg.seoTitle).toContain("19Network");
    expect(pkg.metaDescription.length).toBeGreaterThan(50);
    expect(pkg.suggestedSlug).toContain("dubai-ai-campus");
    expect(pkg.h2Structure.length).toBeGreaterThanOrEqual(4);
    expect(pkg.isDeterministic).toBe(true);
  });

  it("produces tailored packages for Instagram, LinkedIn, X, Facebook, and TikTok", () => {
    const soc = generateSocialPackage(
      "UAE Sovereign Clean Tech Investment Fund",
      "UAE",
      "Energy"
    );

    expect(soc.instagram.slides.length).toBe(5);
    expect(soc.instagram.hashtags).toContain("#19Network");
    expect(soc.linkedIn.supportingPoints.length).toBe(3);
    expect(soc.x.thread.length).toBe(4);
    expect(soc.tiktok.script.length).toBeGreaterThanOrEqual(3);
    expect(soc.facebook.caption).toBeDefined();
  });

  it("generates 7 distinct editorial angles for story intelligence research", () => {
    const intel = generateStoryIntelligence(INITIAL_FALLBACK_STORIES[0]);

    expect(intel.angles.length).toBe(7);
    expect(intel.factCheckList.length).toBeGreaterThanOrEqual(3);
    expect(intel.geoSignificance.uae).toBeDefined();
  });
});
