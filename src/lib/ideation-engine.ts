import { GeoCategory, NewsCategory, NewsStory } from "@/types/news";
import {
  ArticlePackage,
  EditorialAngle,
  FactCheckItem,
  HeadlineOption,
  SocialMediaPackage,
  StoryIntelligenceData,
} from "@/types/editorial";

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
}

export function generateStoryIntelligence(story: NewsStory): StoryIntelligenceData {
  const isUae = story.geoCategory === "UAE" || story.title.toLowerCase().includes("dubai") || story.title.toLowerCase().includes("uae");
  const isGcc = ["Saudi Arabia", "Qatar", "Kuwait", "Bahrain", "Oman", "GCC-wide"].includes(story.geoCategory);

  const geoSignificance = {
    uae: isUae
      ? `Directly impacts local UAE stakeholders, regulatory compliance, and commercial operations across Dubai and Abu Dhabi.`
      : `Presents cross-border investment, trade diversification, and supply chain implications for UAE-headquartered institutions.`,
    gcc: isGcc
      ? `Key milestone in regional economic integration and national transformation strategies across Gulf economies.`
      : `Affects GCC energy transition, sovereign wealth allocations, and capital flows between regional financial hubs.`,
    global: `Signals broader macro trends in market digitalization, international commerce, and sovereign technological autonomy.`,
  };

  const suggestedAudience = [
    "UAE C-Suite & Business Decision-Makers",
    "Regional Private Equity & Sovereign Investors",
    "Real Estate Developers & Institutional Buyers",
    "Public Sector Policy Analysts & Regulators",
    "Gulf Tech Founders & Innovation Directors",
  ];

  const angles: EditorialAngle[] = [
    {
      id: "angle-1",
      name: "Breaking News Desk",
      hook: `Breaking: ${story.title}`,
      targetAudience: "Executive Briefing Readers",
      recommendedFormat: "Article",
      description: `Rapid 350-word authoritative briefing focusing on official statements, confirmed data points, and immediate market impact.`,
    },
    {
      id: "angle-2",
      name: "Business & Capital Implications",
      hook: `Why the Capital Flow Behind This Story Signals a Structural Shift`,
      targetAudience: "Finance & Investment Community",
      recommendedFormat: "Analysis",
      description: `In-depth breakdown of transaction metrics, financing structures, and return on investment across regional corridors.`,
    },
    {
      id: "angle-3",
      name: "The UAE Perspective",
      hook: `How Dubai & Abu Dhabi Infrastructure Anchors This Development`,
      targetAudience: "UAE Residents & Business Leaders",
      recommendedFormat: "Article",
      description: `Localizing global or GCC events specifically to UAE free zones, regulatory advantages, and consumer sentiment.`,
    },
    {
      id: "angle-4",
      name: "GCC Regional Transformation",
      hook: `Cross-Border Synergies: Riyadh, Dubai, and Doha in Focus`,
      targetAudience: "Regional GCC Decision-Makers",
      recommendedFormat: "Feature",
      description: `Comparative analysis of how Gulf jurisdictions are collaborating or competing in this market sector.`,
    },
    {
      id: "angle-5",
      name: "The Explainer (Q&A Format)",
      hook: `What It Means, Why It Matters, and What Comes Next: 5 Key Questions`,
      targetAudience: "Broad Professional Audience",
      recommendedFormat: "Explainer",
      description: `Demystifying complex policy or technology jargon with accessible Q&A formatting and bulleted takeaways.`,
    },
    {
      id: "angle-6",
      name: "Data-Driven Analysis",
      hook: `The Numbers Behind the Headlines: Trends, Growth Rates, and Forecasts`,
      targetAudience: "Market Analysts & Researchers",
      recommendedFormat: "Analysis",
      description: `Chart-heavy analysis benchmarking historical performance against forward projections.`,
    },
    {
      id: "angle-7",
      name: "Long-Form Weekend Feature",
      hook: `Inside the Strategy: The Vision Reshaping Middle Eastern Enterprise`,
      targetAudience: "Weekend In-Depth Readership",
      recommendedFormat: "Feature",
      description: `Narrative-rich investigative storytelling examining founders, institutional leaders, and long-term societal effects.`,
    },
  ];

  const factCheckList: FactCheckItem[] = [
    {
      id: "fc-1",
      claim: `Headline development: "${story.title}"`,
      sourceReference: story.source,
      status: "verified",
      notes: `Reported by ${story.source} at ${new Date(story.publishedAt).toLocaleDateString()}. Cross-checked against feed records.`,
    },
    {
      id: "fc-2",
      claim: `Official monetary figures, investment sums, or commercial values`,
      sourceReference: "Primary Ministry or Regulatory Filings",
      status: "requires_verification",
      notes: `Verify reported currency and denomination with primary documentation before publication.`,
    },
    {
      id: "fc-3",
      claim: `Spokesperson attribution, executive quotes, and press releases`,
      sourceReference: "Official Press Release / Transcript",
      status: "official_statement",
      notes: `Ensure direct quotes retain precise context and avoid paraphrased distortion.`,
    },
    {
      id: "fc-4",
      claim: `Dates of implementation, regulatory enforcement, or project completion`,
      sourceReference: "Government Gazette or Corporate Roadmaps",
      status: "requires_verification",
      notes: `Distinguish confirmed completion milestones from aspirational targets.`,
    },
  ];

  const relatedDevelopments = [
    "UAE Sovereign Digital Transformation Milestones (2025–2030)",
    "GCC Interconnected Commercial & Regulatory Frameworks",
    "Venture Capital and Direct Foreign Investment Inflows to Dubai Hubs",
    "Clean Energy Transition and Sustainable Industrial Growth in the Gulf",
  ];

  return {
    story,
    geoSignificance,
    suggestedAudience,
    angles,
    factCheckList,
    relatedDevelopments,
  };
}

export function generateArticlePackage(
  topicOrTitle: string,
  geoCategory: GeoCategory = "UAE",
  category: NewsCategory = "Business",
  sourceName: string = "19Network Newsroom"
): ArticlePackage {
  const cleanTitle = topicOrTitle.trim();
  const slug = generateSlug(cleanTitle);

  const headlines: HeadlineOption[] = [
    {
      type: "Primary",
      text: `${cleanTitle}: Strategic Implications for the UAE and GCC`,
    },
    {
      type: "Click-Worthy",
      text: `Why ${cleanTitle} Marks a Decisive Turning Point for Regional Markets`,
    },
    {
      type: "SEO",
      text: `${cleanTitle} – Latest Updates, Analysis & Key Takeaways`,
    },
    {
      type: "Analytical",
      text: `Inside ${cleanTitle}: Capital Flows, Market Drivers, and Regulatory Impact`,
    },
    {
      type: "Short",
      text: `${cleanTitle}: Key Insights`,
    },
  ];

  const primaryHeadline = headlines[0].text;
  const seoTitle = `${cleanTitle} | 19Network Intelligence`;
  const metaDescription = `Comprehensive editorial analysis on ${cleanTitle}. Explore regional significance, market reactions, and future outlook for ${geoCategory}.`;

  const introduction = `DUBAI — In a notable regional development, ${cleanTitle.toLowerCase()} has emerged as a central talking point for business leaders and policymakers across the ${geoCategory}. As markets prioritize resilience and accelerated technological adoption, this event underlines the shifting economic momentum characterizing the modern Gulf landscape.`;

  const h2Structure = [
    "1. Executive Summary & Core Facts",
    `2. Strategic Context within the ${geoCategory} Market`,
    "3. Commercial and Regulatory Repercussions",
    "4. What Decision-Makers Need to Watch in the Coming Quarters",
    "5. Methodology & Source Attribution",
  ];

  const keyFactsToVerify = [
    "Confirm primary institutional data release or gazette notice",
    "Cross-check numerical percentages and total valuation metrics",
    "Verify timeline commitments against previously announced roadmaps",
    "Check regulatory jurisdiction applicability across UAE free zones versus mainland",
  ];

  const relevantKeywords = [
    geoCategory,
    category,
    "Dubai Business",
    "UAE Economy",
    "GCC Markets",
    "Digital Newsroom",
    "19Network Intelligence",
    "Investment",
  ];

  const relatedEntities = [
    "Central Bank of the UAE",
    "Dubai Chamber of Commerce",
    "Ministry of Economy UAE",
    "DIFC / ADGM",
    "GCC Secretariat",
  ];

  const internalLinkingSuggestions = [
    "/tag/uae-economy (Recent policy briefings)",
    "/tag/gulf-investment (Quarterly sovereign wealth allocations)",
    "/insights/tech-roundup (AI and digital infrastructure milestones)",
  ];

  const sourceAttribution = `Reporting corroborated via verified newsroom dispatch, official filings, and monitored dispatches through ${sourceName}. All facts verified in accordance with 19Network Editorial Standards.`;

  const suggestedFeaturedImage = {
    description: `High-resolution editorial photography of modern Dubai skyline or corporate business environment, overlaid with subtle clean geometric data charts in forest green accents.`,
    altText: `${cleanTitle} editorial analysis featured banner`,
    promptText: `Editorial photograph of architectural skyline in Dubai, cinematic dusk lighting, subtle emerald green highlights (#16834A), clean glass facade, professional corporate aesthetic, 8k resolution.`,
  };

  const socialSharingText = `BREAKING & ANALYSIS: ${cleanTitle}. Here is what executives in the UAE and GCC need to know about the latest market shift. Full analysis on 19Network.`;

  return {
    headlines,
    primaryHeadline,
    seoTitle,
    metaDescription,
    suggestedSlug: slug,
    introduction,
    h2Structure,
    keyFactsToVerify,
    relevantKeywords,
    relatedEntities,
    internalLinkingSuggestions,
    sourceAttribution,
    suggestedFeaturedImage,
    socialSharingText,
    isDeterministic: true,
  };
}

export function generateSocialPackage(
  topicOrTitle: string,
  geoCategory: GeoCategory = "UAE",
  category: NewsCategory = "Business"
): SocialMediaPackage {
  const cleanTitle = topicOrTitle.trim();

  // 1. Instagram Carousel
  const instagram = {
    coverHeadline: cleanTitle,
    carouselConcept: "5-Slide Executive Breakdown with Forest Green Infographic Aesthetics",
    slides: [
      {
        slideNumber: 1,
        headline: "THE BRIEF",
        body: `${cleanTitle}\n\nWhat just happened and why it matters for the UAE right now.`,
        visualCue: "Bold typographic cover with 19Network logo badge and high-contrast dark green backdrop.",
      },
      {
        slideNumber: 2,
        headline: "KEY NUMBERS",
        body: "• Primary growth drivers\n• Cross-border regional impact\n• Timeline for implementation",
        visualCue: "Three-column metric card with emerald green callouts (#16834A).",
      },
      {
        slideNumber: 3,
        headline: "THE UAE ANGLE",
        body: `Local business ecosystems across Dubai and Abu Dhabi stand to gain operational efficiencies and regulatory clarity.`,
        visualCue: "Map silhouette of UAE with highlighted financial hub nodes.",
      },
      {
        slideNumber: 4,
        headline: "MARKET IMPACT",
        body: "How private equity, institutional investors, and sovereign entities are positioning for the next quarter.",
        visualCue: "Comparative bar chart showing sector distribution.",
      },
      {
        slideNumber: 5,
        headline: "TAKEAWAY FOR LEADERS",
        body: "Swipe up or tap link in bio for the complete data breakdown on 19network.com.\n\nSave this post for your weekly executive review.",
        visualCue: "Call-to-action button card with save icon indicator.",
      },
    ],
    caption: `📊 WHAT YOU NEED TO KNOW: ${cleanTitle}.\n\nSwipe through for the 60-second editorial breakdown by the 19Network team.\n\nAre you tracking this shift in your industry? Share your thoughts below. 👇\n\n#19Network #UAENews #DubaiBusiness #GCCEconomy #${category.replace(/[^a-zA-Z]/g, "")} #MiddleEastIntelligence`,
    hashtags: ["#19Network", "#UAENews", "#DubaiBusiness", "#GCCEconomy", "#UAEBusiness", "#MiddleEastNews"],
  };

  // 2. LinkedIn Post
  const linkedIn = {
    businessAngle: "Institutional & Macroeconomic Shift",
    openingHook: `A significant development is unfolding across the ${geoCategory} business landscape: ${cleanTitle}.`,
    supportingPoints: [
      "Capital deployment is shifting toward resilient digital and physical infrastructure.",
      "Regulatory alignment across UAE and Gulf hubs is accelerating transaction velocity.",
      "Early movers among regional corporates are securing strategic competitive advantages.",
    ],
    callToAction: "How is your organization adapting its strategy to these developments? Read our full intelligence brief at 19network.com.",
    fullPost: `A significant development is unfolding across the ${geoCategory} business landscape: ${cleanTitle}.\n\nHere are three strategic observations our editorial desk is tracking:\n\n1. Capital Deployment: We are seeing heightened discipline and faster closing times on cross-border transactions.\n2. Regulatory Alignment: Coordinated policy frameworks between regional hubs continue to de-risk investment.\n3. Strategic Agility: Organizations that pre-emptively build localized capabilities are winning market share.\n\nFor enterprise leaders, this is more than a headline—it is an indicator of where regional growth will compound over the next 24 months.\n\nHow is your team responding? Join the discussion below.\n\nRead the complete brief on 19Network: https://www.19network.com\n\n#BusinessStrategy #UAE #GCC #Leadership #19Network`,
  };

  // 3. X (Twitter)
  const x = {
    breakingPost: `🚨 JUST IN: ${cleanTitle}.\n\nHere's what it means for markets across the ${geoCategory} 🧵👇`,
    commentaryPost: `${cleanTitle} shows how quickly the Gulf economic landscape is evolving. Key takeaway: speed to execution is everything right now.`,
    thread: [
      `1/4 🚨 BREAKING & ANALYSIS: ${cleanTitle}.\n\nWhy this story matters for the UAE, GCC, and global decision-makers 🧵👇`,
      `2/4 The core catalyst: heightened capital flows and policy modernization across ${geoCategory}. This development directly impacts both institutional players and growing enterprises.`,
      `3/4 What to watch: implementation timelines over the coming quarter, regulatory follow-through, and regional commercial partnerships.`,
      `4/4 Read our full verified editorial brief with source citations and data charts: https://www.19network.com\n\nFollow @19network_news for continuous coverage.`,
    ],
  };

  // 4. Facebook
  const facebook = {
    newsSummary: `${cleanTitle}: What this means for business, jobs, and the economy in the UAE.`,
    caption: `LATEST UPDATE: ${cleanTitle}.\n\nOur editorial team has analyzed the figures, regional context, and key implications for residents and professionals in the UAE.\n\nWhat is your perspective on this change? Let us know in the comments!`,
    discussionPrompt: "Do you believe this development will accelerate growth in your sector over the next year?",
  };

  // 5. TikTok
  const tiktok = {
    hook: `If you live or do business in the UAE, you need to understand this headline right now.`,
    durationEstimate: "45 Seconds",
    visualDirection: "Fast-paced green screen explainer showing verified headline, followed by dynamic highlighted charts and key takeaways.",
    script: [
      {
        timecode: "00:00 - 00:05",
        audio: `Stop scrolling if you track business in Dubai or the UAE. Here is what just happened with ${cleanTitle}.`,
        visual: "Creator on camera with headline screenshot behind. Text overlay: 'UAE NEWS BRIEF'.",
      },
      {
        timecode: "00:05 - 00:18",
        audio: `First, the headline: this is a major move because it directly impacts regional investment and market regulations.`,
        visual: "Zoom into the primary data points on screen with emerald highlighter effect.",
      },
      {
        timecode: "00:18 - 00:32",
        audio: `Second, here is what it means for you: whether you are an entrepreneur, investor, or resident, expect ripple effects across pricing and partnerships.`,
        visual: "Show 3 bullet points with clean icons.",
      },
      {
        timecode: "00:32 - 00:45",
        audio: `Follow 19Network for your daily UAE news intelligence, and head to 19network.com for the full story.`,
        visual: "Call-to-action screen with 19Network website preview.",
      },
    ],
  };

  return {
    instagram,
    linkedIn,
    x,
    facebook,
    tiktok,
    isDeterministic: true,
  };
}
