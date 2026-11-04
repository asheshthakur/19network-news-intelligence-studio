"use client";

import { useEffect, useState } from "react";
import { downloadTextFile, downloadJsonFile } from "@/lib/export-utils";
import { generateAndValidateNewsArticleSchema } from "@/lib/ai-analyzer";
import {
  Globe2,
  FileText,
  Download,
  Copy,
  Check,
  Send,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Code2,
  Eye,
  ShieldAlert,
} from "lucide-react";

export default function WebsitePublishingPage() {
  const [title, setTitle] = useState("UAE Central Bank Advances Digital Dirham Architecture for Cross-Border Settlement");
  const [subtitle, setSubtitle] = useState("The initiative forms part of the UAE's Financial Infrastructure Transformation Programme to enhance sovereign cross-border settlement corridors.");
  const [body, setBody] = useState(`DUBAI — In a decisive step toward modernizing wholesale sovereign settlements, the Central Bank of the UAE has completed technical framework testing for cross-border digital dirham transactions across international banking corridors.

## 1. Executive Summary & Core Facts
According to official regulatory releases issued in Abu Dhabi, the pilot verified transaction finality, atomic settlement, and liquidity balancing across participating commercial institutions.

## 2. Strategic Context within the UAE Market
Financial institutions across Dubai and Abu Dhabi are accelerating digital asset settlement frameworks, lowering cross-border remittance costs and improving corporate treasury efficiency.

## Source Attribution
Reporting corroborated via Emirates News Agency (WAM) and Central Bank regulatory filings. All facts verified in accordance with 19Network Editorial Standards.`);

  const [category, setCategory] = useState("Finance");
  const [tags, setTags] = useState("UAE, Central Bank, Digital Dirham, Fintech, Abu Dhabi, Dubai");
  const [featuredImageUrl, setFeaturedImageUrl] = useState("https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80");
  const [seoTitle, setSeoTitle] = useState("UAE Central Bank Advances Digital Dirham Settlement | 19Network");
  const [metaDescription, setMetaDescription] = useState("The Central Bank of the UAE completes technical framework testing for wholesale digital dirham transactions. Read the full analysis on 19Network.");
  const [slug, setSlug] = useState("uae-central-bank-digital-dirham-settlement");
  const [author, setAuthor] = useState("Sarah K. (Senior Editor)");
  const [canonicalUrl, setCanonicalUrl] = useState("https://www.19network.com/news/uae-central-bank-digital-dirham-settlement");

  // Checklist verification
  const [checkedFacts, setCheckedFacts] = useState(true);
  const [checkedLegal, setCheckedLegal] = useState(true);
  const [checkedEditorSignoff, setCheckedEditorSignoff] = useState(false);

  // WordPress status
  const [wpStatus, setWpStatus] = useState<"idle" | "testing" | "connected" | "unconfigured" | "error">("idle");
  const [wpMessage, setWpMessage] = useState("");
  const [isPublishingWp, setIsPublishingWp] = useState(false);
  const [wpResult, setWpResult] = useState<{ success: boolean; link?: string; error?: string } | null>(null);

  // Copy feedback
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"editor" | "preview">("editor");

  useEffect(() => {
    // Check if an article package was transferred from Ideation Studio
    const draftStr = sessionStorage.getItem("19network_publishing_draft");
    if (draftStr) {
      try {
        const d = JSON.parse(draftStr);
        if (d.title) setTitle(d.title);
        if (d.subtitle) setSubtitle(d.subtitle);
        if (d.content) setBody(d.content);
        if (d.category) setCategory(d.category);
        if (d.tags) setTags(Array.isArray(d.tags) ? d.tags.join(", ") : d.tags);
        if (d.seoTitle) setSeoTitle(d.seoTitle);
        if (d.metaDescription) setMetaDescription(d.metaDescription);
        if (d.slug) setSlug(d.slug);
        if (d.author) setAuthor(d.author);
        if (d.featuredImageUrl) setFeaturedImageUrl(d.featuredImageUrl);
      } catch {
        // use defaults
      }
    }
  }, []);

  const handleTestWordPress = async () => {
    setWpStatus("testing");
    setWpMessage("");
    try {
      const res = await fetch("/api/wordpress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "test_connection" }),
      });
      const data = await res.json();
      if (data.connected) {
        setWpStatus("connected");
        setWpMessage(`Connected to ${data.siteUrl} as ${data.user}`);
      } else {
        setWpStatus("unconfigured");
        setWpMessage(data.message || "WordPress server credentials not configured. Native export options are active.");
      }
    } catch {
      setWpStatus("error");
      setWpMessage("Could not contact WordPress connector endpoint.");
    }
  };

  const handleCreateWordPressDraft = async () => {
    if (!checkedEditorSignoff) {
      alert("Please complete the Editorial Sign-Off checklist item before initiating CMS transmission.");
      return;
    }

    setIsPublishingWp(true);
    setWpResult(null);

    try {
      const res = await fetch("/api/wordpress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_draft",
          article: {
            title,
            content: body,
            metaDescription,
            slug,
          },
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setWpResult({ success: true, link: data.link });
      } else {
        setWpResult({
          success: false,
          error: data.error || "WordPress draft transmission unconfigured. Use HTML/Markdown export.",
        });
      }
    } catch (err: unknown) {
      setWpResult({
        success: false,
        error: err instanceof Error ? err.message : "CMS dispatch failed",
      });
    } finally {
      setIsPublishingWp(false);
    }
  };

  // Exports
  const handleExportHtml = () => {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${seoTitle}</title>
  <meta name="description" content="${metaDescription}">
  <link rel="canonical" href="${canonicalUrl}">
</head>
<body>
  <article>
    <h1>${title}</h1>
    <p class="subtitle">${subtitle}</p>
    <div class="byline">By ${author} | Published for 19Network</div>
    <div class="article-body">
      ${body.replace(/\n\n/g, "</p><p>")}
    </div>
  </article>
</body>
</html>`;
    downloadTextFile(html, `${slug || "article"}.html`, "text/html");
  };

  const handleExportMarkdown = () => {
    const md = `---
title: "${title}"
subtitle: "${subtitle}"
category: "${category}"
author: "${author}"
date: "${new Date().toISOString()}"
slug: "${slug}"
seoTitle: "${seoTitle}"
metaDescription: "${metaDescription}"
canonicalUrl: "${canonicalUrl}"
featuredImage: "${featuredImageUrl}"
---

# ${title}

*${subtitle}*

**By ${author}**

${body}
`;
    downloadTextFile(md, `${slug || "article"}.md`, "text/markdown");
  };

  const handleExportJson = () => {
    const schema = generateAndValidateNewsArticleSchema({
      headline: title,
      description: metaDescription,
      articleBody: body,
      authorName: author,
      imageUrl: featuredImageUrl,
      url: canonicalUrl,
    });

    const payload = {
      title,
      subtitle,
      body,
      category,
      tags: tags.split(",").map((t) => t.trim()),
      seoTitle,
      metaDescription,
      slug,
      author,
      canonicalUrl,
      featuredImageUrl,
      structuredData: schema.parsedObject,
    };
    downloadJsonFile(payload, `${slug || "article"}-publishing-package.json`);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Title & Banner */}
      <div className="flex flex-col justify-between gap-4 border-b border-[#DCE6DF] pb-5 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-[#123B2B] px-2 py-0.5 text-xs font-bold text-white uppercase">
              Module 08
            </span>
            <span className="text-xs font-semibold text-[#16834A]">
              Website Publishing Workspace
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#123B2B]">
            Editorial Packaging for 19Network.com
          </h1>
          <p className="mt-0.5 text-xs text-[#728078] max-w-2xl">
            Prepare, verify, and export publication-ready digital articles for the 19Network editorial team with optional WordPress REST API draft synchronization.
          </p>
        </div>

        {/* Export & Actions Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportHtml}
            className="flex items-center gap-1.5 rounded-lg border border-[#DCE6DF] bg-white px-3 py-2 text-xs font-semibold text-[#14231B] hover:bg-[#F5F8F5]"
          >
            <Download className="h-3.5 w-3.5 text-[#16834A]" />
            <span>Export HTML</span>
          </button>
          <button
            onClick={handleExportMarkdown}
            className="flex items-center gap-1.5 rounded-lg border border-[#DCE6DF] bg-white px-3 py-2 text-xs font-semibold text-[#14231B] hover:bg-[#F5F8F5]"
          >
            <Download className="h-3.5 w-3.5 text-[#16834A]" />
            <span>Markdown</span>
          </button>
          <button
            onClick={handleExportJson}
            className="flex items-center gap-1.5 rounded-lg border border-[#DCE6DF] bg-white px-3 py-2 text-xs font-semibold text-[#14231B] hover:bg-[#F5F8F5]"
          >
            <Code2 className="h-3.5 w-3.5 text-[#16834A]" />
            <span>JSON Package</span>
          </button>
        </div>
      </div>

      {/* Editor / Preview Switcher */}
      <div className="flex items-center justify-between border-b border-[#DCE6DF] pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("editor")}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-colors ${
              activeTab === "editor"
                ? "bg-[#123B2B] text-white"
                : "text-[#728078] hover:text-[#123B2B]"
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Article Editor</span>
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-colors ${
              activeTab === "preview"
                ? "bg-[#123B2B] text-white"
                : "text-[#728078] hover:text-[#123B2B]"
            }`}
          >
            <Eye className="h-4 w-4" />
            <span>Live Article Preview</span>
          </button>
        </div>

        <button
          onClick={() => copyToClipboard(body, "copy-all")}
          className="flex items-center gap-1 text-xs font-semibold text-[#16834A] hover:underline"
        >
          {copiedKey === "copy-all" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          <span>{copiedKey === "copy-all" ? "Copied" : "Copy Full Article"}</span>
        </button>
      </div>

      {/* TAB 1: Editor View */}
      {activeTab === "editor" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main 2 Cols: Headline, Subtitle, Body */}
          <div className="rounded-2xl border border-[#DCE6DF] bg-white p-6 shadow-card lg:col-span-2 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#728078] mb-1">
                Article Headline *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-[#DCE6DF] bg-[#F5F8F5] p-3 text-sm font-bold text-[#14231B] focus:border-[#16834A] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#728078] mb-1">
                Subtitle / Executive Lead
              </label>
              <textarea
                rows={2}
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full rounded-lg border border-[#DCE6DF] bg-[#F5F8F5] p-2.5 text-xs font-medium text-[#14231B] focus:border-[#16834A] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#728078] mb-1">
                Article Body (Markdown & Structure) *
              </label>
              <textarea
                rows={12}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full rounded-lg border border-[#DCE6DF] bg-[#F5F8F5] p-3 text-xs font-mono text-[#14231B] leading-relaxed focus:border-[#16834A] focus:bg-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#728078] mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-lg border border-[#DCE6DF] bg-[#F5F8F5] p-2 text-xs font-medium text-[#14231B] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#728078] mb-1">
                  Tags & Entities
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full rounded-lg border border-[#DCE6DF] bg-[#F5F8F5] p-2 text-xs font-medium text-[#14231B] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Right Col: Metadata, Checklist & WordPress Adapter */}
          <div className="space-y-5">
            {/* Editorial Sign-Off Checklist */}
            <div className="rounded-2xl border border-[#DCE6DF] bg-white p-5 shadow-card space-y-3">
              <span className="text-xs font-bold text-[#123B2B] uppercase tracking-wider">
                Editorial Verification Sign-Off
              </span>

              <div className="space-y-2 text-xs text-[#14231B]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checkedFacts}
                    onChange={(e) => setCheckedFacts(e.target.checked)}
                    className="accent-[#16834A] h-4 w-4 rounded"
                  />
                  <span>Factual claims cited & verified</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checkedLegal}
                    onChange={(e) => setCheckedLegal(e.target.checked)}
                    className="accent-[#16834A] h-4 w-4 rounded"
                  />
                  <span>UAE media & compliance verified</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checkedEditorSignoff}
                    onChange={(e) => setCheckedEditorSignoff(e.target.checked)}
                    className="accent-[#16834A] h-4 w-4 rounded"
                  />
                  <span className="font-semibold text-[#123B2B]">
                    Lead Editor Approval (Mandatory)
                  </span>
                </label>
              </div>
            </div>

            {/* WordPress REST API Connector */}
            <div className="rounded-2xl border border-[#DCE6DF] bg-white p-5 shadow-card space-y-3">
              <div className="flex items-center justify-between border-b border-[#DCE6DF] pb-2">
                <span className="text-xs font-bold text-[#123B2B] uppercase tracking-wider">
                  WordPress REST API Adapter
                </span>
                <button
                  type="button"
                  onClick={handleTestWordPress}
                  className="text-[11px] font-semibold text-[#16834A] hover:underline"
                >
                  Test Connection
                </button>
              </div>

              <p className="text-xs text-[#728078] leading-relaxed">
                Connects server-side via <code>WORDPRESS_SITE_URL</code> and application passwords. Creates drafts only.
              </p>

              {wpMessage && (
                <div
                  className={`rounded-lg p-2.5 text-xs ${
                    wpStatus === "connected"
                      ? "bg-[#DDF5E8] text-[#123B2B]"
                      : "bg-[#F5F8F5] text-[#728078]"
                  }`}
                >
                  {wpMessage}
                </div>
              )}

              {wpResult && (
                <div
                  className={`rounded-lg p-2.5 text-xs ${
                    wpResult.success
                      ? "bg-[#DDF5E8] text-[#123B2B]"
                      : "bg-amber-50 text-amber-800 border border-amber-200"
                  }`}
                >
                  {wpResult.success
                    ? `Draft created successfully in CMS!`
                    : `Notice: ${wpResult.error}`}
                </div>
              )}

              <button
                onClick={handleCreateWordPressDraft}
                disabled={isPublishingWp || !checkedEditorSignoff}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#123B2B] py-2 text-xs font-semibold text-white hover:bg-[#16834A] disabled:opacity-50 transition-colors shadow-sm"
              >
                <Send className="h-3.5 w-3.5 text-[#DDF5E8]" />
                <span>{isPublishingWp ? "Sending Draft..." : "Create WordPress Draft"}</span>
              </button>
            </div>

            {/* Publishing Metadata Card */}
            <div className="rounded-2xl border border-[#DCE6DF] bg-white p-5 shadow-card space-y-2 text-xs">
              <span className="text-xs font-bold text-[#123B2B] uppercase tracking-wider mb-2 block">
                Metadata Settings
              </span>
              <div>
                <span className="text-[10px] text-[#728078] font-bold uppercase">Author Byline</span>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full rounded border border-[#DCE6DF] p-1.5 mt-0.5"
                />
              </div>
              <div>
                <span className="text-[10px] text-[#728078] font-bold uppercase">Slug</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full rounded border border-[#DCE6DF] p-1.5 mt-0.5 font-mono text-[11px]"
                />
              </div>
              <div>
                <span className="text-[10px] text-[#728078] font-bold uppercase">Featured Image URL</span>
                <input
                  type="text"
                  value={featuredImageUrl}
                  onChange={(e) => setFeaturedImageUrl(e.target.value)}
                  className="w-full rounded border border-[#DCE6DF] p-1.5 mt-0.5 text-[11px]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Live Preview */}
      {activeTab === "preview" && (
        <div className="max-w-3xl mx-auto rounded-2xl border border-[#DCE6DF] bg-white p-8 shadow-card space-y-6">
          <div className="flex items-center gap-2 text-xs text-[#16834A] font-semibold uppercase tracking-wider">
            <span>{category}</span>
            <span>•</span>
            <span>19Network Intelligence</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-[#123B2B] leading-tight">
            {title}
          </h1>

          <p className="text-base font-medium text-[#728078] leading-relaxed">
            {subtitle}
          </p>

          <div className="flex items-center justify-between border-y border-[#DCE6DF] py-3 text-xs text-[#728078]">
            <span>By <strong className="text-[#14231B]">{author}</strong></span>
            <span>{new Date().toLocaleDateString("en-GB", { timeZone: "Asia/Dubai", day: "numeric", month: "long", year: "numeric" })} • Dubai</span>
          </div>

          {featuredImageUrl && (
            <div className="relative overflow-hidden rounded-xl h-64 bg-gray-100 border border-[#DCE6DF]">
              <img
                src={featuredImageUrl}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="text-sm leading-relaxed text-[#14231B] space-y-4 whitespace-pre-line font-serif">
            {body}
          </div>
        </div>
      )}
    </div>
  );
}
