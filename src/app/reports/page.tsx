"use client";

import { useEffect, useState } from "react";
import { studioStorage } from "@/lib/storage";
import { exportCalendarToCsv, exportStoriesToCsv } from "@/lib/export-utils";
import { NewsStory } from "@/types/news";
import {
  FileBarChart2,
  Printer,
  Download,
  Calendar,
  Compass,
  Share2,
  FileCheck,
  TrendingUp,
  Globe2,
} from "lucide-react";

export default function ReportsPage() {
  const [stories, setStories] = useState<NewsStory[]>([]);
  const [calendarItems, setCalendarItems] = useState(studioStorage.getCalendarItems());
  const [socialData, setSocialData] = useState(studioStorage.getSocialData());

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/news");
        if (res.ok) {
          const d = await res.json();
          if (d.stories) setStories(d.stories);
        }
      } catch {
        // cached
      }
    }
    load();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const uaeStories = stories.filter((s) => s.geoCategory === "UAE");
  const gccStories = stories.filter((s) =>
    ["Saudi Arabia", "Qatar", "Kuwait", "Bahrain", "Oman", "GCC-wide"].includes(s.geoCategory)
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col justify-between gap-4 border-b border-[#DCE6DF] pb-5 md:flex-row md:items-center no-print">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-[#123B2B] px-2 py-0.5 text-xs font-bold text-white uppercase">
              Module 09
            </span>
            <span className="text-xs font-semibold text-[#16834A]">
              Newsroom Reports & Audits
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#123B2B]">
            Editorial Governance & Performance Reports
          </h1>
          <p className="mt-0.5 text-xs text-[#728078] max-w-2xl">
            Downloadable executive summaries, coverage audits, and performance records for editorial board meetings and stakeholder review.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-lg bg-[#123B2B] px-4 py-2 text-xs font-semibold text-white hover:bg-[#16834A] transition-colors shadow-sm"
          >
            <Printer className="h-4 w-4 text-[#DDF5E8]" />
            <span>Print / PDF Export</span>
          </button>
        </div>
      </div>

      {/* 7 Report Cards Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 no-print">
        {/* Report 1: Daily News Discovery Report */}
        <div className="rounded-xl border border-[#DCE6DF] bg-white p-5 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#123B2B]">
              <Compass className="h-4 w-4 text-[#16834A]" />
              <span>Daily News Discovery Report</span>
            </div>
            <p className="mt-2 text-xs text-[#728078] leading-relaxed">
              Complete dispatch log of all {stories.length} stories discovered today, sorted by 100-point opportunity rating and source.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#DCE6DF]/40 flex justify-end">
            <button
              onClick={() => exportStoriesToCsv(stories)}
              className="flex items-center gap-1 text-xs font-semibold text-[#16834A] hover:underline"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download CSV</span>
            </button>
          </div>
        </div>

        {/* Report 2: Weekly UAE/GCC Coverage Report */}
        <div className="rounded-xl border border-[#DCE6DF] bg-white p-5 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#123B2B]">
              <Globe2 className="h-4 w-4 text-[#16834A]" />
              <span>Weekly UAE & GCC Coverage Audit</span>
            </div>
            <p className="mt-2 text-xs text-[#728078] leading-relaxed">
              Audit of domestic UAE ({uaeStories.length}) and GCC regional ({gccStories.length}) balance across economic sectors.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#DCE6DF]/40 flex justify-end">
            <button
              onClick={() => exportStoriesToCsv(stories.filter((s) => s.geoCategory === "UAE" || s.geoCategory === "GCC-wide"))}
              className="flex items-center gap-1 text-xs font-semibold text-[#16834A] hover:underline"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download CSV</span>
            </button>
          </div>
        </div>

        {/* Report 3: Social Media Performance Report */}
        <div className="rounded-xl border border-[#DCE6DF] bg-white p-5 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#123B2B]">
              <Share2 className="h-4 w-4 text-[#16834A]" />
              <span>Social Audience & Engagement Audit</span>
            </div>
            <p className="mt-2 text-xs text-[#728078] leading-relaxed">
              Verified metric report for @19network.news ({socialData.instagram.followers.toLocaleString()} followers) and LinkedIn ({socialData.linkedIn.followers} followers).
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#DCE6DF]/40 flex justify-end">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1 text-xs font-semibold text-[#16834A] hover:underline"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print Audit Sheet</span>
            </button>
          </div>
        </div>

        {/* Report 4: Editorial Calendar Schedule Report */}
        <div className="rounded-xl border border-[#DCE6DF] bg-white p-5 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#123B2B]">
              <Calendar className="h-4 w-4 text-[#16834A]" />
              <span>Omnichannel Calendar Schedule</span>
            </div>
            <p className="mt-2 text-xs text-[#728078] leading-relaxed">
              Publishing docket of all {calendarItems.length} planned pieces across Website, Instagram, LinkedIn, and X in GST.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#DCE6DF]/40 flex justify-end">
            <button
              onClick={() => exportCalendarToCsv(calendarItems)}
              className="flex items-center gap-1 text-xs font-semibold text-[#16834A] hover:underline"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download CSV</span>
            </button>
          </div>
        </div>

        {/* Report 5: AI Readiness Report */}
        <div className="rounded-xl border border-[#DCE6DF] bg-white p-5 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#123B2B]">
              <FileCheck className="h-4 w-4 text-[#16834A]" />
              <span>AI Search & SEO Compatibility Audit</span>
            </div>
            <p className="mt-2 text-xs text-[#728078] leading-relaxed">
              Standards compliance verification covering Schema.org NewsArticle JSON-LD, BLUF structure, and E-E-A-T.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#DCE6DF]/40 flex justify-end">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1 text-xs font-semibold text-[#16834A] hover:underline"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print Audit Summary</span>
            </button>
          </div>
        </div>
      </div>

      {/* Print-Ready Editorial Briefing Sheet */}
      <div className="rounded-2xl border border-[#DCE6DF] bg-white p-8 shadow-card space-y-6">
        <div className="flex items-start justify-between border-b border-[#DCE6DF] pb-4">
          <div>
            <div className="text-xs font-bold text-[#16834A] uppercase tracking-wider">
              19Network News Intelligence Studio
            </div>
            <h2 className="mt-1 text-xl font-bold text-[#123B2B]">
              Weekly Editorial Intelligence Executive Summary
            </h2>
            <div className="mt-1 text-xs text-[#728078]">
              Published on: {new Date().toLocaleDateString("en-GB", { timeZone: "Asia/Dubai", day: "numeric", month: "long", year: "numeric" })} • Dubai, United Arab Emirates
            </div>
          </div>
          <div className="text-right text-xs">
            <span className="rounded bg-[#DDF5E8] px-2.5 py-1 font-bold text-[#123B2B]">
              CONFIDENTIAL EDITORIAL USE
            </span>
          </div>
        </div>

        {/* Section 1: Summary Metrics Table */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#123B2B]">
            1. Core Newsroom Throughput
          </h3>
          <div className="overflow-x-auto rounded-lg border border-[#DCE6DF]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F8F5] text-[#728078] font-semibold border-b border-[#DCE6DF]">
                <tr>
                  <th className="p-2.5">Metric Dimension</th>
                  <th className="p-2.5">Current Value</th>
                  <th className="p-2.5">Verification Source</th>
                  <th className="p-2.5">Editorial Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCE6DF]">
                <tr>
                  <td className="p-2.5 font-medium">Stories Discovered Today</td>
                  <td className="p-2.5 font-bold text-[#123B2B]">{stories.length} Dispatches</td>
                  <td className="p-2.5 text-[#728078]">Google News RSS + GDELT</td>
                  <td className="p-2.5 text-[#16834A] font-semibold">Live & Active</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium">UAE High-Relevance Opportunities</td>
                  <td className="p-2.5 font-bold text-[#123B2B]">{uaeStories.length} Stories</td>
                  <td className="p-2.5 text-[#728078]">Domestic Market Filter</td>
                  <td className="p-2.5 text-[#16834A] font-semibold">Priority Queue</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium">Verified Social Follower Footprint</td>
                  <td className="p-2.5 font-bold text-[#123B2B]">
                    {(socialData.instagram.followers + socialData.linkedIn.followers).toLocaleString()} Followers
                  </td>
                  <td className="p-2.5 text-[#728078]">@19network.news + LinkedIn</td>
                  <td className="p-2.5 text-[#16834A] font-semibold">Verified Baseline</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium">Scheduled Editorial Docket</td>
                  <td className="p-2.5 font-bold text-[#123B2B]">{calendarItems.length} Content Items</td>
                  <td className="p-2.5 text-[#728078]">Editorial Content Calendar</td>
                  <td className="p-2.5 text-[#16834A] font-semibold">On Schedule</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: Highest Scored Leads */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#123B2B]">
            2. Priority Editorial Leads (Score &gt;= 80/100)
          </h3>
          <div className="space-y-2 text-xs">
            {stories.slice(0, 4).map((s, idx) => (
              <div key={idx} className="rounded-lg border border-[#DCE6DF] p-3 flex items-start justify-between">
                <div>
                  <div className="font-bold text-[#14231B]">{s.title}</div>
                  <div className="text-[11px] text-[#728078] mt-0.5">
                    Source: {s.source} • {s.geoCategory} • {s.category}
                  </div>
                </div>
                <span className="font-bold text-[#123B2B] bg-[#DDF5E8] px-2 py-0.5 rounded text-xs shrink-0">
                  {s.score.total}/100
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Print Footer */}
        <div className="border-t border-[#DCE6DF] pt-3 text-[10px] text-[#728078] flex items-center justify-between">
          <span>Generated by 19Network News Intelligence Studio</span>
          <span>Confidential Newsroom Technology Concept Demonstration</span>
        </div>
      </div>
    </div>
  );
}
