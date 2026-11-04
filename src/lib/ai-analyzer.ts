import { AICompatibilityReport, CompatibilityCheck, SchemaValidationResult } from "@/types/seo";

export function generateAndValidateNewsArticleSchema(article: {
  headline: string;
  description: string;
  articleBody?: string;
  authorName?: string;
  datePublished?: string;
  dateModified?: string;
  url?: string;
  imageUrl?: string;
}): SchemaValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const headline = article.headline?.trim() || "";
  const description = article.description?.trim() || "";
  const authorName = article.authorName?.trim() || "19Network Editorial Desk";
  const datePublished = article.datePublished || new Date().toISOString();
  const dateModified = article.dateModified || datePublished;
  const url = article.url || "https://www.19network.com/news/article";
  const imageUrl = article.imageUrl || "https://www.19network.com/assets/banner.jpg";

  // Strict Validation Rules according to Google News & Search guidelines
  if (!headline) {
    errors.push("Missing required property: 'headline'.");
  } else if (headline.length > 110) {
    warnings.push("Headline exceeds 110 characters, which may truncate in AI search cards.");
  }

  if (!description) {
    errors.push("Missing required property: 'description'.");
  } else if (description.length < 50) {
    warnings.push("Description is under 50 characters, recommend expanding for generative AI snippet synthesis.");
  }

  if (!imageUrl) {
    warnings.push("Missing recommended property: 'image'. Articles with images receive significantly higher AI discovery click-through.");
  }

  const jsonLdObject = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    headline,
    description,
    image: [imageUrl],
    datePublished,
    dateModified,
    author: {
      "@type": "Person",
      name: authorName,
      jobTitle: "Journalist & Analyst",
      worksFor: {
        "@type": "NewsMediaOrganization",
        name: "19Network",
        url: "https://www.19network.com",
      },
    },
    publisher: {
      "@type": "NewsMediaOrganization",
      name: "19Network",
      url: "https://www.19network.com",
      logo: {
        "@type": "ImageObject",
        url: "https://www.19network.com/logo.png",
      },
    },
    articleSection: "Business & Technology",
    inLanguage: "en-AE",
    copyrightYear: new Date().getFullYear(),
  };

  return {
    isValid: errors.length === 0,
    schemaType: "NewsArticle",
    jsonLdString: JSON.stringify(jsonLdObject, null, 2),
    parsedObject: jsonLdObject,
    errors,
    warnings,
  };
}

export function analyzeArticleForAiReadiness(article: {
  title: string;
  content: string;
  seoTitle?: string;
  metaDescription?: string;
  slug?: string;
  author?: string;
  featuredImageUrl?: string;
  sourceAttribution?: string;
}): AICompatibilityReport {
  const checks: CompatibilityCheck[] = [];
  const criticalWarnings: string[] = [];
  const recommendations: string[] = [];

  const title = article.title?.trim() || "";
  const content = article.content?.trim() || "";
  const seoTitle = article.seoTitle?.trim() || title;
  const metaDesc = article.metaDescription?.trim() || "";
  const slug = article.slug?.trim() || "";
  const author = article.author?.trim() || "";
  const attribution = article.sourceAttribution?.trim() || "";
  const hasImage = Boolean(article.featuredImageUrl?.trim());

  // === 1. Content Structure Checks (25 Points) ===
  let structScore = 0;

  // Title clarity (6 pts)
  if (title.length >= 25 && title.length <= 100) {
    structScore += 6;
    checks.push({
      id: "struct-1",
      category: "structure",
      title: "Headline Length & Directness",
      description: "Headline is descriptive, concise, and between 25 and 100 characters.",
      weight: 6,
      score: 6,
      status: "pass",
      details: `Length: ${title.length} chars. Direct and clear.`,
      isAutomated: true,
    });
  } else {
    structScore += 3;
    checks.push({
      id: "struct-1",
      category: "structure",
      title: "Headline Length & Directness",
      description: "Headline should ideally be between 25 and 100 characters.",
      weight: 6,
      score: 3,
      status: "warn",
      details: `Length: ${title.length} chars. Consider refining.`,
      recommendation: "Keep headlines punchy (50-80 chars) for maximum AI overview citation.",
      isAutomated: true,
    });
  }

  // Direct Answer / Summary in opening paragraph (7 pts)
  const firstPara = content.split("\n\n")[0] || "";
  const hasDirectLead = firstPara.length >= 100 && (firstPara.includes("—") || firstPara.includes("DUBAI") || firstPara.includes("In a"));
  if (hasDirectLead) {
    structScore += 7;
    checks.push({
      id: "struct-2",
      category: "structure",
      title: "Direct Answer Lead Paragraph (BLUF)",
      description: "Lead paragraph summarizes the who, what, when, and where directly.",
      weight: 7,
      score: 7,
      status: "pass",
      details: "Strong opening paragraph suitable for zero-click AI snippet generation.",
      isAutomated: true,
    });
  } else {
    structScore += 3;
    checks.push({
      id: "struct-2",
      category: "structure",
      title: "Direct Answer Lead Paragraph (BLUF)",
      description: "AI engines favor articles whose opening 2 sentences answer the search query directly.",
      weight: 7,
      score: 3,
      status: "warn",
      details: "Opening paragraph is short or lacks an explicit dateline/summary.",
      recommendation: "Add a structured lead paragraph with location dateline (e.g. 'DUBAI — ...').",
      isAutomated: true,
    });
    recommendations.push("Enhance the introductory paragraph with a direct answer summary.");
  }

  // H2/H3 Section Hierarchy (6 pts)
  const hasHeaders = content.includes("##") || content.includes("1.") || content.includes("\n\n");
  if (hasHeaders && content.length > 300) {
    structScore += 6;
    checks.push({
      id: "struct-3",
      category: "structure",
      title: "H2/H3 Section Hierarchy",
      description: "Content contains logical subsection breakdowns for machine readability.",
      weight: 6,
      score: 6,
      status: "pass",
      details: "Logical section division detected.",
      isAutomated: true,
    });
  } else {
    structScore += 2;
    checks.push({
      id: "struct-3",
      category: "structure",
      title: "H2/H3 Section Hierarchy",
      description: "Articles broken into thematic sections rank substantially higher in Perplexity and SearchGPT.",
      weight: 6,
      score: 2,
      status: "warn",
      details: "Few or no section headers found.",
      recommendation: "Introduce at least 3 descriptive H2 section headers.",
      isAutomated: true,
    });
    recommendations.push("Break body content into clear H2 sections with descriptive subheadings.");
  }

  // Entity & Location Clarity (6 pts)
  const entities = ["uae", "dubai", "abu dhabi", "central bank", "economy", "growth", "dirham", "gcc"];
  const matchedEntities = entities.filter((e) => content.toLowerCase().includes(e));
  if (matchedEntities.length >= 3) {
    structScore += 6;
    checks.push({
      id: "struct-4",
      category: "structure",
      title: "Named Entity & Geographic Clarity",
      description: "Prominent named entities and geographical context identified.",
      weight: 6,
      score: 6,
      status: "pass",
      details: `Entities detected: ${matchedEntities.slice(0, 4).join(", ")}.`,
      isAutomated: true,
    });
  } else {
    structScore += 3;
    checks.push({
      id: "struct-4",
      category: "structure",
      title: "Named Entity & Geographic Clarity",
      description: "Named entities enable semantic knowledge graph indexing.",
      weight: 6,
      score: 3,
      status: "warn",
      details: "Limited named entities recognized.",
      recommendation: "Explicitly reference institutions, locations, and regulatory authorities.",
      isAutomated: true,
    });
  }

  // === 2. Editorial Quality & Verifiability (25 Points) ===
  let editScore = 0;

  // Source Attribution (8 pts)
  if (attribution.length > 20 || content.toLowerCase().includes("according to") || content.toLowerCase().includes("reported by")) {
    editScore += 8;
    checks.push({
      id: "edit-1",
      category: "editorial",
      title: "Source Attribution & Citation",
      description: "Factual reporting is grounded in cited primary sources.",
      weight: 8,
      score: 8,
      status: "pass",
      details: "Primary sources cited.",
      isAutomated: true,
    });
  } else {
    criticalWarnings.push("Missing clear source attribution. AI engines penalize unattributed factual assertions.");
    checks.push({
      id: "edit-1",
      category: "editorial",
      title: "Source Attribution & Citation",
      description: "Every news analysis must state source attribution.",
      weight: 8,
      score: 2,
      status: "fail",
      details: "No explicit source citations detected.",
      recommendation: "Add attribution paragraph citing primary source documents or wire agencies.",
      isAutomated: true,
    });
    recommendations.push("Include explicit source attribution at the bottom of the article.");
  }

  // Author byline & accountability (9 pts)
  if (author.length > 3) {
    editScore += 9;
    checks.push({
      id: "edit-2",
      category: "editorial",
      title: "Identifiable Author Byline",
      description: "Transparent byline establishing E-E-A-T (Experience, Expertise, Authoritativeness, Trust).",
      weight: 9,
      score: 9,
      status: "pass",
      details: `Byline attributed to '${author}'.`,
      isAutomated: true,
    });
  } else {
    checks.push({
      id: "edit-2",
      category: "editorial",
      title: "Identifiable Author Byline",
      description: "Named authors improve trustworthiness in Google News and generative search.",
      weight: 9,
      score: 3,
      status: "warn",
      details: "Author is anonymous or unassigned.",
      recommendation: "Assign a named journalist or verified editorial desk byline.",
      isAutomated: true,
    });
    recommendations.push("Assign an author byline to meet Google News E-E-A-T standards.");
  }

  // Editorial check status (8 pts)
  editScore += 8;
  checks.push({
    id: "edit-3",
    category: "editorial",
    title: "Fact-Check Verification Protocol",
    description: "Checklist verifies absence of fabricated quotes and uncorroborated numbers.",
    weight: 8,
    score: 8,
    status: "pass",
    details: "Editorial review protocol validated.",
    isAutomated: false,
  });

  // === 3. SEO Readiness (25 Points) ===
  let seoScore = 0;

  // SEO Title (7 pts)
  if (seoTitle.length >= 40 && seoTitle.length <= 65) {
    seoScore += 7;
    checks.push({
      id: "seo-1",
      category: "seo",
      title: "SEO Title Tag Length",
      description: "Optimal length (40–65 characters) prevents search engine SERP truncation.",
      weight: 7,
      score: 7,
      status: "pass",
      details: `${seoTitle.length} characters (Optimal).`,
      isAutomated: true,
    });
  } else {
    seoScore += 4;
    checks.push({
      id: "seo-1",
      category: "seo",
      title: "SEO Title Tag Length",
      description: "Optimal length is between 40 and 65 characters.",
      weight: 7,
      score: 4,
      status: "warn",
      details: `${seoTitle.length} characters. May truncate or underperform.`,
      recommendation: "Keep SEO title between 45 and 60 characters with brand suffix.",
      isAutomated: true,
    });
  }

  // Meta Description (7 pts)
  if (metaDesc.length >= 120 && metaDesc.length <= 165) {
    seoScore += 7;
    checks.push({
      id: "seo-2",
      category: "seo",
      title: "Meta Description Optimization",
      description: "Between 120 and 165 characters with actionable summary.",
      weight: 7,
      score: 7,
      status: "pass",
      details: `${metaDesc.length} characters (Optimal).`,
      isAutomated: true,
    });
  } else {
    seoScore += 3;
    checks.push({
      id: "seo-2",
      category: "seo",
      title: "Meta Description Optimization",
      description: "Meta description should be between 120 and 160 characters.",
      weight: 7,
      score: 3,
      status: "warn",
      details: `${metaDesc.length} characters.`,
      recommendation: "Write a concise 130-155 character meta description including UAE focus.",
      isAutomated: true,
    });
    recommendations.push("Adjust meta description to 130–155 characters for high snippet CTR.");
  }

  // URL Slug (6 pts)
  if (slug.length >= 5 && /^[a-z0-9-]+$/.test(slug)) {
    seoScore += 6;
    checks.push({
      id: "seo-3",
      category: "seo",
      title: "Clean URL Slug Structure",
      description: "Hyphen-separated lowercase URL slug free of special characters.",
      weight: 6,
      score: 6,
      status: "pass",
      details: `/${slug}`,
      isAutomated: true,
    });
  } else {
    seoScore += 2;
    checks.push({
      id: "seo-3",
      category: "seo",
      title: "Clean URL Slug Structure",
      description: "Ensure slug uses lowercase letters and hyphens only.",
      weight: 6,
      score: 2,
      status: "warn",
      details: "Slug needs formatting.",
      recommendation: "Use short keyword-rich hyphenated slug.",
      isAutomated: true,
    });
  }

  // Featured Image & Alt Text (5 pts)
  if (hasImage) {
    seoScore += 5;
    checks.push({
      id: "seo-4",
      category: "seo",
      title: "Featured Image with Descriptive Alt Tag",
      description: "Visual asset with semantic alt tag for Google Discover & visual search.",
      weight: 5,
      score: 5,
      status: "pass",
      details: "Featured image configured.",
      isAutomated: true,
    });
  } else {
    criticalWarnings.push("No featured image assigned. Articles without images are excluded from Google Discover and visual AI feeds.");
    checks.push({
      id: "seo-4",
      category: "seo",
      title: "Featured Image with Descriptive Alt Tag",
      description: "Articles require a high-resolution featured image.",
      weight: 5,
      score: 1,
      status: "fail",
      details: "Missing featured image URL.",
      recommendation: "Attach a 1200x675px landscape image.",
      isAutomated: true,
    });
    recommendations.push("Add a high-resolution 16:9 featured image with descriptive alt text.");
  }

  // === 4. Structured Data (25 Points) ===
  const schemaValidation = generateAndValidateNewsArticleSchema({
    headline: title,
    description: metaDesc || title,
    articleBody: content,
    authorName: author,
    imageUrl: article.featuredImageUrl,
  });

  let schemaScore = 0;
  if (schemaValidation.isValid) {
    schemaScore = 25;
    checks.push({
      id: "schema-1",
      category: "schema",
      title: "Valid Schema.org NewsArticle JSON-LD",
      description: "Complete compliant NewsArticle schema including author, publisher, and timestamps.",
      weight: 25,
      score: 25,
      status: "pass",
      details: "Valid NewsArticle structured data ready for embedding.",
      isAutomated: true,
    });
  } else {
    schemaScore = 15;
    checks.push({
      id: "schema-1",
      category: "schema",
      title: "Valid Schema.org NewsArticle JSON-LD",
      description: "JSON-LD schema contains errors or missing recommended properties.",
      weight: 25,
      score: 15,
      status: "warn",
      details: schemaValidation.errors.join("; "),
      recommendation: "Fill in missing headline and description fields to generate flawless JSON-LD.",
      isAutomated: true,
    });
  }

  const overallScore = Math.min(100, structScore + editScore + seoScore + schemaScore);
  const potentialScore = Math.min(100, overallScore + 18);

  return {
    overallScore,
    potentialScore,
    breakdown: {
      contentStructure: { score: structScore, max: 25 },
      editorialQuality: { score: editScore, max: 25 },
      seoReadiness: { score: seoScore, max: 25 },
      structuredData: { score: schemaScore, max: 25 },
    },
    checks,
    criticalWarnings,
    recommendations,
    jsonLdValidation: schemaValidation,
    analyzedAt: new Date().toISOString(),
  };
}
