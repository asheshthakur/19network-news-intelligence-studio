"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GeoCategory, NewsCategory, NewsStory } from "@/types/news";
import { ArticlePackage, SocialMediaPackage } from "@/types/editorial";
import { generateArticlePackage, generateSocialPackage } from "@/lib/ideation-engine";
import { studioStorage } from "@/lib/storage";
import { INITIAL_FALLBACK_STORIES } from "@/lib/sample-data";
import { ItemModal } from "@/components/calendar/ItemModal";
import { CalendarItem, PublishingPlatform } from "@/types/calendar";
import {
  Sparkles,
  Copy,
  Check,
  CalendarPlus,
  Send,
  Layers,
  Share2,
  FileText,
  Instagram,
  Linkedin,
  Twitter,
  Facebook,
  Video,
  Info,
} from "lucide-react";

const GEO_OPTIONS: GeoCategory[] = [
  "UAE",
  "Saudi Arabia",
  "Qatar",
  "Kuwait",
  "Bahrain",
  "Oman",
  "GCC-wide",
  "Global",
];

const CATEGORY_OPTIONS: NewsCategory[] = [
  "Business",
  "Finance",
  "Real Estate",
  "AI & Technology",
  "Politics & Policy",
  "Sports",
  "Lifestyle",
  "Automotive",
  "Energy",
  "Travel & Tourism",
];

export default function ContentIdeationPage() {
  const router = useRouter();

  // Form Inputs
  const [topic, setTopic] = useState("UAE Central Bank Sovereign Digital Dirham Cross-Border Framework");
  const [geoCategory, setGeoCategory] = useState<GeoCategory>("UAE");
  const [category, setCategory] = useState<NewsCategory>("Finance");
  const [targetAudience, setTargetAudience] = useState("UAE Executives & Regional Investors");
  const [activeStory, setActiveStory] = useState<NewsStory | null>(null);

  // Generated Packages
  const [articlePkg, setArticlePkg] = useState<ArticlePackage | null>(null);
  const [socialPkg, setSocialPkg] = useState<SocialMediaPackage | null>(null);

  // Active view tab: "website" | "instagram" | "linkedin" | "x" | "facebook" | "tiktok"
  const [activeTab, setActiveTab] = useState<"website" | "instagram" | "linkedin" | "x" | "facebook" | "tiktok">("website");

  // Copy feedback state
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Calendar modal state
  const [calendarModalOpen, setCalendarModalOpen] = useState(false);
  const [calendarInitialData, setCalendarInitialData] = useState<Partial<CalendarItem> | null>(null);

  useEffect(() => {
    // Check if an active story was selected in Topic Radar / Story Intelligence
    const story = studioStorage.getActiveStory();
    if (story) {
      setActiveStory(story);
      setTopic(story.title);
      setGeoCategory(story.geoCategory);
      setCategory(story.category);
      handleGenerate(story.title, story.geoCategory, story.category, story.source);
    } else {
      handleGenerate(topic, geoCategory, category, "19Network Newsroom");
    }
  }, []);

  const handleGenerate = (t = topic, g = geoCategory, c = category, src = "19Network Newsroom") => {
    if (!t.trim()) return;
    const art = generateArticlePackage(t, g, c, src);
    const soc = generateSocialPackage(t, g, c);
    setArticlePkg(art);
    setSocialPkg(soc);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleAddToCalendar = (platform: PublishingPlatform, contentCopy: string) => {
    setCalendarInitialData({
      title: articlePkg?.primaryHeadline || topic,
      platform,
      category,
      targetMarket: geoCategory,
      contentDraft: contentCopy,
      status: "Draft",
      scheduledDate: new Date().toISOString().split("T")[0],
      scheduledTime: "11:00",
      assignedOwner: "Sarah K. (Senior Editor)",
    });
    setCalendarModalOpen(true);
  };

  const handleSendToPublishing = () => {
    if (!articlePkg) return;
    // Save draft for website publishing module
    sessionStorage.setItem(
      "19network_publishing_draft",
      JSON.stringify({
        title: articlePkg.primaryHeadline,
        subtitle: articlePkg.metaDescription,
        content: `${articlePkg.introduction}\n\n## 1. Executive Summary & Core Facts\nDetailed reporting corroborated across market records...\n\n## 2. Strategic Context within the ${geoCategory} Market\nImplications for local stakeholders...\n\n## Source Attribution\n${articlePkg.sourceAttribution}`,
        category,
        tags: articlePkg.relevantKeywords,
        seoTitle: articlePkg.seoTitle,
        metaDescription: articlePkg.metaDescription,
        slug: articlePkg.suggestedSlug,
        author: "19Network Editorial Desk",
        featuredImageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
        sourceAttribution: articlePkg.sourceAttribution,
      })
    );
    router.push("/publishing");
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col justify-between gap-4 border-b border-[#DCE6DF] pb-5 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-[#123B2B] px-2 py-0.5 text-xs font-bold text-white uppercase">
              Module 04
            </span>
            <span className="text-xs font-semibold text-[#16834A]">
              Content Ideation Studio
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#123B2B]">
            Multi-Platform Content Generation
          </h1>
          <p className="mt-0.5 text-xs text-[#728078] max-w-2xl">
            Produce website article packages and platform-native copy for Instagram, LinkedIn, X, Facebook, and TikTok in 19Network&apos;s editorial voice.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSendToPublishing}
            className="flex items-center gap-1.5 rounded-lg bg-[#123B2B] px-4 py-2 text-xs font-semibold text-white hover:bg-[#16834A] transition-colors shadow-sm"
          >
            <Send className="h-3.5 w-3.5 text-[#DDF5E8]" />
            <span>Send to Website Publishing</span>
          </button>
        </div>
      </div>

      {/* Input Controls Card */}
      <div className="rounded-2xl border border-[#DCE6DF] bg-white p-5 shadow-card">
        <div className="flex items-center justify-between border-b border-[#DCE6DF] pb-3 mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#123B2B]">
            Ideation Parameters
          </span>
          <div className="flex items-center gap-1.5 rounded-md bg-[#EDF8F2] px-2.5 py-1 text-[11px] font-semibold text-[#16834A]">
            <Info className="h-3.5 w-3.5" />
            <span>Deterministic High-Speed Rule Engine (Free & Operational)</span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#728078] mb-1">
              Topic or Story Headline *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter custom topic, news development, or select from Topic Radar..."
                className="flex-1 rounded-lg border border-[#DCE6DF] bg-[#F5F8F5] p-2.5 text-xs font-medium text-[#14231B] focus:border-[#16834A] focus:bg-white focus:outline-none"
              />
              <button
                onClick={() => handleGenerate()}
                className="flex items-center gap-1.5 rounded-lg bg-[#16834A] px-4 py-2 text-xs font-bold text-white hover:bg-[#123B2B] transition-colors shadow-sm"
              >
                <Sparkles className="h-4 w-4" />
                <span>Regenerate</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#728078] mb-1">
                Target Market
              </label>
              <select
                value={geoCategory}
                onChange={(e) => setGeoCategory(e.target.value as GeoCategory)}
                className="w-full rounded-lg border border-[#DCE6DF] bg-[#F5F8F5] p-2 text-xs font-medium text-[#14231B] focus:border-[#16834A] focus:outline-none"
              >
                {GEO_OPTIONS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#728078] mb-1">
                Content Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as NewsCategory)}
                className="w-full rounded-lg border border-[#DCE6DF] bg-[#F5F8F5] p-2 text-xs font-medium text-[#14231B] focus:border-[#16834A] focus:outline-none"
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#728078] mb-1">
                Primary Audience Persona
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full rounded-lg border border-[#DCE6DF] bg-[#F5F8F5] p-2 text-xs font-medium text-[#14231B] focus:border-[#16834A] focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Platform Navigation Tabs */}
      <div className="flex items-center gap-1 border-b border-[#DCE6DF] overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab("website")}
          className={`flex items-center gap-2 rounded-t-lg px-4 py-2.5 text-xs font-bold transition-all border-b-2 ${
            activeTab === "website"
              ? "border-[#16834A] bg-white text-[#123B2B] shadow-sm"
              : "border-transparent text-[#728078] hover:text-[#123B2B]"
          }`}
        >
          <FileText className="h-4 w-4 text-[#16834A]" />
          <span>Website Article Package</span>
        </button>

        <button
          onClick={() => setActiveTab("instagram")}
          className={`flex items-center gap-2 rounded-t-lg px-4 py-2.5 text-xs font-bold transition-all border-b-2 ${
            activeTab === "instagram"
              ? "border-[#16834A] bg-white text-[#123B2B] shadow-sm"
              : "border-transparent text-[#728078] hover:text-[#123B2B]"
          }`}
        >
          <Instagram className="h-4 w-4 text-pink-600" />
          <span>Instagram Carousel</span>
        </button>

        <button
          onClick={() => setActiveTab("linkedin")}
          className={`flex items-center gap-2 rounded-t-lg px-4 py-2.5 text-xs font-bold transition-all border-b-2 ${
            activeTab === "linkedin"
              ? "border-[#16834A] bg-white text-[#123B2B] shadow-sm"
              : "border-transparent text-[#728078] hover:text-[#123B2B]"
          }`}
        >
          <Linkedin className="h-4 w-4 text-blue-600" />
          <span>LinkedIn Editorial</span>
        </button>

        <button
          onClick={() => setActiveTab("x")}
          className={`flex items-center gap-2 rounded-t-lg px-4 py-2.5 text-xs font-bold transition-all border-b-2 ${
            activeTab === "x"
              ? "border-[#16834A] bg-white text-[#123B2B] shadow-sm"
              : "border-transparent text-[#728078] hover:text-[#123B2B]"
          }`}
        >
          <Twitter className="h-4 w-4 text-sky-500" />
          <span>X (Twitter) Thread</span>
        </button>

        <button
          onClick={() => setActiveTab("facebook")}
          className={`flex items-center gap-2 rounded-t-lg px-4 py-2.5 text-xs font-bold transition-all border-b-2 ${
            activeTab === "facebook"
              ? "border-[#16834A] bg-white text-[#123B2B] shadow-sm"
              : "border-transparent text-[#728078] hover:text-[#123B2B]"
          }`}
        >
          <Facebook className="h-4 w-4 text-blue-700" />
          <span>Facebook Summary</span>
        </button>

        <button
          onClick={() => setActiveTab("tiktok")}
          className={`flex items-center gap-2 rounded-t-lg px-4 py-2.5 text-xs font-bold transition-all border-b-2 ${
            activeTab === "tiktok"
              ? "border-[#16834A] bg-white text-[#123B2B] shadow-sm"
              : "border-transparent text-[#728078] hover:text-[#123B2B]"
          }`}
        >
          <Video className="h-4 w-4 text-slate-800" />
          <span>TikTok Video Script</span>
        </button>
      </div>

      {/* TAB CONTENT: Website Article Package */}
      {activeTab === "website" && articlePkg && (
        <div className="space-y-6">
          {/* 5 Headline Variations */}
          <div className="rounded-2xl border border-[#DCE6DF] bg-white p-5 shadow-card">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#123B2B] mb-3">
              5 Headline Angle Variations
            </h3>
            <div className="grid grid-cols-1 gap-2.5">
              {articlePkg.headlines.map((h, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border border-[#DCE6DF] bg-[#F5F8F5]/50 p-3 hover:bg-white hover:border-[#16834A] transition-all"
                >
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-[#16834A] uppercase tracking-wide">
                      {h.type}
                    </span>
                    <div className="text-xs font-bold text-[#14231B]">{h.text}</div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(h.text, `hl-${i}`)}
                    className="rounded p-1.5 text-[#728078] hover:bg-[#DDF5E8] hover:text-[#123B2B]"
                    title="Copy headline"
                  >
                    {copiedKey === `hl-${i}` ? (
                      <Check className="h-4 w-4 text-[#16834A]" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Core Package Details (Slug, SEO Title, Meta Description, Lead) */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-[#DCE6DF] bg-white p-5 shadow-card space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#123B2B]">
                SEO & Metadata Configuration
              </h3>

              <div>
                <span className="text-[10px] font-bold text-[#728078] uppercase">SEO Title Tag (50-60 chars)</span>
                <div className="mt-1 flex items-center justify-between rounded bg-[#F5F8F5] p-2 text-xs font-medium text-[#14231B]">
                  <span>{articlePkg.seoTitle}</span>
                  <button onClick={() => copyToClipboard(articlePkg.seoTitle, "seo-title")}>
                    {copiedKey === "seo-title" ? <Check className="h-3.5 w-3.5 text-[#16834A]" /> : <Copy className="h-3.5 w-3.5 text-[#728078]" />}
                  </button>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-[#728078] uppercase">URL Slug</span>
                <div className="mt-1 flex items-center justify-between rounded bg-[#F5F8F5] p-2 text-xs font-mono text-[#123B2B]">
                  <span>/{articlePkg.suggestedSlug}</span>
                  <button onClick={() => copyToClipboard(articlePkg.suggestedSlug, "slug")}>
                    {copiedKey === "slug" ? <Check className="h-3.5 w-3.5 text-[#16834A]" /> : <Copy className="h-3.5 w-3.5 text-[#728078]" />}
                  </button>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-[#728078] uppercase">Meta Description (120-160 chars)</span>
                <div className="mt-1 rounded bg-[#F5F8F5] p-2 text-xs text-[#14231B] leading-relaxed">
                  {articlePkg.metaDescription}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-[#728078] uppercase">Suggested H2 Structure</span>
                <ul className="mt-1 space-y-1 text-xs text-[#14231B]">
                  {articlePkg.h2Structure.map((h2, idx) => (
                    <li key={idx} className="rounded bg-[#F5F8F5] p-1.5 font-semibold">
                      {h2}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Introduction & Editorial Grounding */}
            <div className="rounded-2xl border border-[#DCE6DF] bg-white p-5 shadow-card space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#123B2B]">
                Opening Paragraph & Attribution
              </h3>

              <div>
                <span className="text-[10px] font-bold text-[#728078] uppercase">Lead Paragraph (BLUF)</span>
                <div className="mt-1 rounded-lg border border-[#DCE6DF] bg-[#F5F8F5]/40 p-3 text-xs leading-relaxed text-[#14231B]">
                  {articlePkg.introduction}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-[#728078] uppercase">Source Attribution Block</span>
                <div className="mt-1 rounded bg-[#EDF8F2] border border-[#DDF5E8] p-2.5 text-xs text-[#123B2B]">
                  {articlePkg.sourceAttribution}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-[#728078] uppercase">Featured Image Creative Prompt</span>
                <div className="mt-1 rounded bg-[#F5F8F5] p-2.5 text-xs text-[#728078] italic">
                  {articlePkg.suggestedFeaturedImage.promptText}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => handleAddToCalendar("Website", articlePkg.introduction)}
                  className="flex items-center gap-1.5 rounded-lg border border-[#DCE6DF] bg-white px-3.5 py-2 text-xs font-semibold text-[#123B2B] hover:bg-[#F5F8F5]"
                >
                  <CalendarPlus className="h-4 w-4 text-[#16834A]" />
                  <span>Queue to Content Calendar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Instagram Carousel */}
      {activeTab === "instagram" && socialPkg && (
        <div className="rounded-2xl border border-[#DCE6DF] bg-white p-6 shadow-card space-y-5">
          <div className="flex items-center justify-between border-b border-[#DCE6DF] pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#123B2B]">Instagram 5-Slide Visual Carousel</h3>
              <p className="text-xs text-[#728078]">{socialPkg.instagram.carouselConcept}</p>
            </div>
            <button
              onClick={() => handleAddToCalendar("Instagram", socialPkg.instagram.caption)}
              className="flex items-center gap-1.5 rounded-lg bg-[#123B2B] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#16834A]"
            >
              <CalendarPlus className="h-3.5 w-3.5 text-[#DDF5E8]" />
              <span>Queue on Calendar</span>
            </button>
          </div>

          {/* 5 Slide Cards */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-5">
            {socialPkg.instagram.slides.map((s) => (
              <div
                key={s.slideNumber}
                className="flex flex-col justify-between rounded-xl border border-[#DCE6DF] bg-[#123B2B] text-white p-4 min-h-[220px]"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-bold text-[#DDF5E8] uppercase tracking-wider">
                    <span>Slide {s.slideNumber}</span>
                    <span>19NETWORK</span>
                  </div>
                  <h4 className="mt-2 text-xs font-bold text-[#22A06B] uppercase tracking-wide">
                    {s.headline}
                  </h4>
                  <p className="mt-2 text-xs leading-relaxed text-gray-200 whitespace-pre-line">
                    {s.body}
                  </p>
                </div>
                <div className="mt-3 border-t border-white/20 pt-2 text-[10px] text-gray-300 italic">
                  Visual: {s.visualCue}
                </div>
              </div>
            ))}
          </div>

          {/* Caption & Hashtags */}
          <div className="rounded-xl border border-[#DCE6DF] bg-[#F5F8F5] p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#123B2B] uppercase">Post Caption & Hashtags</span>
              <button
                onClick={() => copyToClipboard(socialPkg.instagram.caption, "ig-caption")}
                className="flex items-center gap-1 text-xs font-semibold text-[#16834A] hover:underline"
              >
                {copiedKey === "ig-caption" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedKey === "ig-caption" ? "Copied" : "Copy Caption"}</span>
              </button>
            </div>
            <p className="text-xs text-[#14231B] whitespace-pre-line leading-relaxed">
              {socialPkg.instagram.caption}
            </p>
          </div>
        </div>
      )}

      {/* TAB CONTENT: LinkedIn Editorial */}
      {activeTab === "linkedin" && socialPkg && (
        <div className="rounded-2xl border border-[#DCE6DF] bg-white p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-[#DCE6DF] pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#123B2B]">LinkedIn Executive Briefing</h3>
              <p className="text-xs text-[#728078]">Business angle: {socialPkg.linkedIn.businessAngle}</p>
            </div>
            <button
              onClick={() => handleAddToCalendar("LinkedIn", socialPkg.linkedIn.fullPost)}
              className="flex items-center gap-1.5 rounded-lg bg-[#123B2B] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#16834A]"
            >
              <CalendarPlus className="h-3.5 w-3.5 text-[#DDF5E8]" />
              <span>Queue on Calendar</span>
            </button>
          </div>

          <div className="rounded-xl border border-[#DCE6DF] bg-[#F5F8F5] p-5 space-y-3">
            <div className="flex justify-end">
              <button
                onClick={() => copyToClipboard(socialPkg.linkedIn.fullPost, "li-post")}
                className="flex items-center gap-1 text-xs font-semibold text-[#16834A] hover:underline"
              >
                {copiedKey === "li-post" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedKey === "li-post" ? "Copied" : "Copy Post"}</span>
              </button>
            </div>
            <div className="text-xs text-[#14231B] whitespace-pre-line leading-relaxed font-sans">
              {socialPkg.linkedIn.fullPost}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: X Thread */}
      {activeTab === "x" && socialPkg && (
        <div className="rounded-2xl border border-[#DCE6DF] bg-white p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-[#DCE6DF] pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#123B2B]">X (Twitter) Breaking Post & 4-Tweet Thread</h3>
              <p className="text-xs text-[#728078]">Brevity-optimized for high retweet and bookmark velocity</p>
            </div>
            <button
              onClick={() => handleAddToCalendar("X", socialPkg.x.thread.join("\n\n"))}
              className="flex items-center gap-1.5 rounded-lg bg-[#123B2B] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#16834A]"
            >
              <CalendarPlus className="h-3.5 w-3.5 text-[#DDF5E8]" />
              <span>Queue on Calendar</span>
            </button>
          </div>

          <div className="space-y-3">
            {socialPkg.x.thread.map((tweet, i) => (
              <div key={i} className="flex items-start justify-between rounded-xl border border-[#DCE6DF] bg-[#F5F8F5] p-3 text-xs">
                <div className="text-[#14231B] leading-relaxed whitespace-pre-line flex-1 pr-3">
                  {tweet}
                </div>
                <button
                  onClick={() => copyToClipboard(tweet, `tweet-${i}`)}
                  className="rounded p-1 text-[#728078] hover:bg-white"
                  title="Copy tweet"
                >
                  {copiedKey === `tweet-${i}` ? <Check className="h-3.5 w-3.5 text-[#16834A]" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Facebook */}
      {activeTab === "facebook" && socialPkg && (
        <div className="rounded-2xl border border-[#DCE6DF] bg-white p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-[#DCE6DF] pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#123B2B]">Facebook Community Post</h3>
              <p className="text-xs text-[#728078]">Audience-friendly tone with discussion catalyst</p>
            </div>
            <button
              onClick={() => handleAddToCalendar("Facebook", socialPkg.facebook.caption)}
              className="flex items-center gap-1.5 rounded-lg bg-[#123B2B] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#16834A]"
            >
              <CalendarPlus className="h-3.5 w-3.5 text-[#DDF5E8]" />
              <span>Queue on Calendar</span>
            </button>
          </div>

          <div className="rounded-xl border border-[#DCE6DF] bg-[#F5F8F5] p-5 space-y-2 text-xs leading-relaxed text-[#14231B]">
            <div className="font-bold text-[#123B2B]">{socialPkg.facebook.newsSummary}</div>
            <p className="whitespace-pre-line">{socialPkg.facebook.caption}</p>
            <div className="mt-2 rounded bg-[#EDF8F2] border border-[#DDF5E8] p-2 text-[#123B2B] font-medium">
              Prompt for Comments: {socialPkg.facebook.discussionPrompt}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: TikTok */}
      {activeTab === "tiktok" && socialPkg && (
        <div className="rounded-2xl border border-[#DCE6DF] bg-white p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-[#DCE6DF] pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#123B2B]">TikTok / Vertical Video Script</h3>
              <p className="text-xs text-[#728078]">Estimated duration: {socialPkg.tiktok.durationEstimate} • Hook & screen beats</p>
            </div>
            <button
              onClick={() => handleAddToCalendar("TikTok", socialPkg.tiktok.hook)}
              className="flex items-center gap-1.5 rounded-lg bg-[#123B2B] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#16834A]"
            >
              <CalendarPlus className="h-3.5 w-3.5 text-[#DDF5E8]" />
              <span>Queue on Calendar</span>
            </button>
          </div>

          <div className="rounded-xl border border-[#DCE6DF] bg-[#EDF8F2] p-3 text-xs text-[#123B2B] font-medium">
            <strong>Video Hook:</strong> &ldquo;{socialPkg.tiktok.hook}&rdquo;
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#DCE6DF] bg-white">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F8F5] text-[#728078] font-semibold border-b border-[#DCE6DF]">
                <tr>
                  <th className="p-3 w-28">Timecode</th>
                  <th className="p-3">Spoken Audio Script</th>
                  <th className="p-3">Visual Direction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCE6DF]">
                {socialPkg.tiktok.script.map((sc, i) => (
                  <tr key={i} className="hover:bg-[#F5F8F5]/40">
                    <td className="p-3 font-mono font-bold text-[#16834A]">{sc.timecode}</td>
                    <td className="p-3 font-medium text-[#14231B]">{sc.audio}</td>
                    <td className="p-3 text-[#728078] italic">{sc.visual}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Item Modal for adding to Editorial Calendar */}
      <ItemModal
        isOpen={calendarModalOpen}
        onClose={() => setCalendarModalOpen(false)}
        initialItem={calendarInitialData}
        onSave={(item) => {
          studioStorage.addCalendarItem(item);
          router.push("/calendar");
        }}
      />
    </div>
  );
}
