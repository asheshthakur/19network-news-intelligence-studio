import { describe, it, expect } from "vitest";
import {
  generateAndValidateNewsArticleSchema,
  analyzeArticleForAiReadiness,
} from "../src/lib/ai-analyzer";

describe("AI Compatibility & Schema Validator", () => {
  it("generates valid Google-supported Schema.org NewsArticle JSON-LD", () => {
    const result = generateAndValidateNewsArticleSchema({
      headline: "UAE Central Bank Completes Digital Dirham Cross-Border Architecture",
      description: "The Central Bank of the UAE completes technical framework testing for sovereign settlements.",
      articleBody: "DUBAI — In a decisive step...",
      authorName: "Sarah K.",
      url: "https://www.19network.com/news/digital-dirham",
      imageUrl: "https://www.19network.com/assets/banner.jpg",
    });

    expect(result.isValid).toBe(true);
    expect(result.errors.length).toBe(0);
    expect(result.schemaType).toBe("NewsArticle");

    const parsed = JSON.parse(result.jsonLdString);
    expect(parsed["@type"]).toBe("NewsArticle");
    expect(parsed.publisher.name).toBe("19Network");
    expect(parsed.author.name).toBe("Sarah K.");
  });

  it("calculates comprehensive readiness scores with critical warnings for missing metadata", () => {
    const report = analyzeArticleForAiReadiness({
      title: "Short",
      content: "Brief content without citations.",
      author: "",
      featuredImageUrl: "",
    });

    expect(report.overallScore).toBeLessThan(60);
    expect(report.criticalWarnings.length).toBeGreaterThanOrEqual(1);
    expect(report.recommendations.length).toBeGreaterThan(0);
  });
});
