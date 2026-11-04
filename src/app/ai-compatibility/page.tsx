"use client";

import { useEffect, useState } from "react";
import { AICompatibilityReport } from "@/types/seo";
import { analyzeArticleForAiReadiness } from "@/lib/ai-analyzer";
import { downloadTextFile } from "@/lib/export-utils";
import {
  FileSearch,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Code2,
  Download,
  Copy,
  Check,
  ShieldCheck,
  Globe,
  FileText,
  Layers,
  Info,
} from "lucide-react";

const SAMPLE_TEXT = `DUBAI — The Central Bank of the UAE has completed the technical framework testing for wholesale cross-border digital dirham transactions across international banking corridors. The initiative forms part of the UAE's Financial Infrastructure Transformation Programme.

## 1. Executive Summary & Core Facts
According to official regulatory releases issued in Abu Dhabi, the pilot verified transaction finality and atomic settlement across participating commercial banks.

## 2. Strategic Context within the UAE Market
Financial institutions across Dubai and Abu Dhabi are positioning for digital asset settlement frameworks, lowering cross-border remittance costs.

## Source Attribution
Reporting corroborated via Emirates News Agency (WAM) and Central Bank regulatory filings. Verified in accordance with 19Network Editorial Standards.`;

export default function AiCompatibilityPage() {
  const [title, setTitle] = useState("UAE Central Bank Advances Digital Dirham Architecture for Cross-Border Settlement");
  const [content, setContent] = useState(SAMPLE_TEXT);
  const [seoTitle, setSeoTitle] = useState("UAE Central Bank Advances Digital Dirham Settlement | 19Network");
  const [metaDescription, setMetaDescription] = useState("The Central Bank of the UAE completes technical framework testing for wholesale digital dirham transactions. Read the full analysis on 19Network.");
  const [slug, setSlug] = useState("uae-central-bank-digital-dirham-settlement");
  const [author, setAuthor] = useState("Sarah K. (Senior Editor)");
  const [featuredImageUrl, setFeaturedImageUrl] = useState("https://images.unsplash.com/photo-1512453979798-5ea266f8880c");

  const [report, setReport] = useState<AICompatibilityReport | null>(null);
  const [activeJsonTab, setActiveJsonTab] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  useEffect(() => {
    // Check if a publishing draft was saved in session
    const draftStr = sessionStorage.getItem("19network_publishing_draft");
    if (draftStr) {
      try {
        const d = JSON.parse(draftStr);
        if (d.title) setTitle(d.title);
        if (d.content) setContent(d.content);
        if (d.seoTitle) setSeoTitle(d.seoTitle);
        if (d.metaDescription) setMetaDescription(d.metaDescription);
        if (d.slug) setSlug(d.slug);
        if (d.author) setAuthor(d.author);
        if (d.featuredImageUrl) setFeaturedImageUrl(d.featuredImageUrl);
      } catch {
        // use default
      }
    }
  }, []);

  useEffect(() => {
    runAnalysis();
  }, [title, content, seoTitle, metaDescription, slug, author, featuredImageUrl]);

  const runAnalysis = () => {
    const rep = analyzeArticleForAiReadiness({
      title,
      content,
      seoTitle,
      metaDescription,
      slug,
      author,
      featuredImageUrl,
      sourceAttribution: content.includes("Source Attribution") ? "Attributed" : "",
    });
    setReport(rep);
  };

  const handleCopyJson = () => {
    if (!report?.jsonLdValidation.jsonLdString) return;
    navigator.clipboard.writeText(report.jsonLdValidation.jsonLdString);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleDownloadJson = () => {
    if (!report?.jsonLdValidation.jsonLdString) return;
    downloadTextFile(
      report.jsonLdValidation.jsonLdString,
      `${slug || "article"}-newsarticle-schema.json`,
      "application/ld+json"
    );
  };

  if (!report) return null;

  return (
    <div className="space-y-6">
      {/* Title & Banner */}
      <div className="flex flex-col justify-between gap-4 border-b border-[#DCE6DF] pb-5 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-[#123B2B] px-2 py-0.5 text-xs font-bold text-white uppercase">
              Module 07
            </span>
            <span className="text-xs font-semibold text-[#16834A]">
              AI Search & SEO Readiness Analyzer
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#123B2B]">
            AI Engine Compatibility & Schema Validator
          </h1>
          <p className="mt-0.5 text-xs text-[#728078] max-w-2xl">
            Audit article structure, entity density, editorial attribution, and Schema.org NewsArticle JSON-LD for Perplexity, Google SGE, and search engines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveJsonTab(!activeJsonTab)}
            className="flex items-center gap-1.5 rounded-lg border border-[#DCE6DF] bg-white px-3.5 py-2 text-xs font-semibold text-[#14231B] hover:bg-[#F5F8F5]"
          >
            <Code2 className="h-4 w-4 text-[#16834A]" />
            <span>{activeJsonTab ? "Hide JSON-LD" : "View JSON-LD Schema"}</span>
          </button>
        </div>
      </div>

      {/* Mandatory Regulatory / Honesty Disclaimer */}
      <div className="rounded-xl border border-[#DDF5E8] bg-[#EDF8F2] p-4 text-xs text-[#123B2B] flex items-start gap-3">
        <Info className="h-5 w-5 text-[#16834A] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Algorithmic Compatibility Notice:</span> This index measures structural alignment with Google Search Central guidelines and semantic LLM synthesis benchmarks. It does not claim a guaranteed citation guarantee inside proprietary search models (ChatGPT, Perplexity, Google SGE).
        </div>
      </div>

      {/* Top Compatibility Score Banner */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        {/* Overall Score */}
        <div className="rounded-2xl border border-[#DCE6DF] bg-white p-6 shadow-card flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-[#728078] uppercase">Overall AI Readiness</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-[#123B2B]">{report.overallScore}</span>
              <span className="text-base text-[#728078] font-bold">/100</span>
            </div>
            <div className="mt-2 text-xs text-[#16834A] font-semibold">
              Potential: Up to {report.potentialScore}/100 with fixes
            </div>
          </div>
          <div className="mt-4 h-2 w-full rounded-full bg-[#DCE6DF] overflow-hidden">
            <div
              className={`h-full rounded-full ${
                report.overallScore >= 80 ? "bg-[#16834A]" : report.overallScore >= 60 ? "bg-[#22A06B]" : "bg-amber-500"
              }`}
              style={{ width: `${report.overallScore}%` }}
            />
          </div>
        </div>

        {/* 4 Pillar Breakdown Cards */}
        <div className="rounded-2xl border border-[#DCE6DF] bg-white p-5 shadow-card flex flex-col justify-between">
          <span className="text-xs font-bold text-[#728078] uppercase">Content Structure</span>
          <div className="text-2xl font-bold text-[#14231B]">
            {report.breakdown.contentStructure.score} <span className="text-xs font-normal text-[#728078]">/ 25</span>
          </div>
          <span className="text-[11px] text-[#728078]">BLUF opening, H2 hierarchy, entity clarity</span>
        </div>

        <div className="rounded-2xl border border-[#DCE6DF] bg-white p-5 shadow-card flex flex-col justify-between">
          <span className="text-xs font-bold text-[#728078] uppercase">Editorial Quality</span>
          <div className="text-2xl font-bold text-[#14231B]">
            {report.breakdown.editorialQuality.score} <span className="text-xs font-normal text-[#728078]">/ 25</span>
          </div>
          <span className="text-[11px] text-[#728078]">Author byline, attribution, fact check</span>
        </div>

        <div className="rounded-2xl border border-[#DCE6DF] bg-white p-5 shadow-card flex flex-col justify-between">
          <span className="text-xs font-bold text-[#728078] uppercase">SEO & Structured Data</span>
          <div className="text-2xl font-bold text-[#14231B]">
            {report.breakdown.seoReadiness.score + report.breakdown.structuredData.score}{" "}
            <span className="text-xs font-normal text-[#728078]">/ 50</span>
          </div>
          <span className="text-[11px] text-[#728078]">Slug, meta desc, NewsArticle JSON-LD</span>
        </div>
      </div>

      {/* JSON-LD Schema Inspector if toggled */}
      {activeJsonTab && (
        <div className="rounded-2xl border border-[#16834A]/40 bg-[#0B2119] text-gray-100 p-5 shadow-float space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Code2 className="h-4 w-4 text-[#22A06B]" />
              <span className="text-xs font-mono font-bold uppercase text-[#DDF5E8]">
                Schema.org NewsArticle JSON-LD (Strict Validation: {report.jsonLdValidation.isValid ? "PASS" : "WARN"})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyJson}
                className="flex items-center gap-1 rounded bg-white/10 px-2.5 py-1 text-xs hover:bg-white/20 transition-colors"
              >
                {copiedJson ? <Check className="h-3.5 w-3.5 text-[#22A06B]" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedJson ? "Copied" : "Copy JSON"}</span>
              </button>
              <button
                onClick={handleDownloadJson}
                className="flex items-center gap-1 rounded bg-[#16834A] px-2.5 py-1 text-xs font-bold text-white hover:bg-[#22A06B] transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download .json</span>
              </button>
            </div>
          </div>

          <pre className="overflow-x-auto text-xs font-mono text-emerald-300 max-h-72 p-2 bg-black/30 rounded-lg">
            {report.jsonLdValidation.jsonLdString}
          </pre>
        </div>
      )}

      {/* Main Analysis Checklist Table & Warnings */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: Detailed Checks List */}
        <div className="rounded-2xl border border-[#DCE6DF] bg-white p-6 shadow-card lg:col-span-2 space-y-4">
          <h2 className="text-sm font-bold text-[#123B2B] uppercase tracking-wider">
            Automated & Editorial Readiness Checks
          </h2>

          <div className="divide-y divide-[#DCE6DF]">
            {report.checks.map((ck) => (
              <div key={ck.id} className="py-3 flex items-start justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#14231B]">{ck.title}</span>
                    <span className="rounded bg-[#F5F8F5] border border-[#DCE6DF] px-1.5 py-0.2 text-[10px] text-[#728078] capitalize">
                      {ck.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#728078]">{ck.details}</p>
                  {ck.recommendation && (
                    <div className="text-[11px] text-amber-800 bg-amber-50 rounded p-1.5 border border-amber-200">
                      Recommendation: {ck.recommendation}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-mono text-xs font-bold text-[#123B2B]">
                    {ck.score}/{ck.weight}
                  </span>
                  {ck.status === "pass" ? (
                    <CheckCircle2 className="h-4 w-4 text-[#16834A]" />
                  ) : ck.status === "warn" ? (
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-rose-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Warnings & Improvement Action Plan */}
        <div className="space-y-4">
          {/* Critical Warnings Card */}
          {report.criticalWarnings.length > 0 && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-5 shadow-card space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-800 uppercase">
                <AlertTriangle className="h-4 w-4 text-rose-600" />
                <span>Critical Warnings ({report.criticalWarnings.length})</span>
              </div>
              <ul className="space-y-1.5 text-xs text-rose-900 list-disc pl-4">
                {report.criticalWarnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendations Card */}
          <div className="rounded-2xl border border-[#DCE6DF] bg-white p-5 shadow-card space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#123B2B] uppercase">
              <Sparkles className="h-4 w-4 text-[#16834A]" />
              <span>Key Optimization Next Steps</span>
            </div>
            <ul className="space-y-2 text-xs text-[#14231B]">
              {report.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2 rounded-lg bg-[#F5F8F5] p-2">
                  <span className="font-bold text-[#16834A]">{i + 1}.</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
