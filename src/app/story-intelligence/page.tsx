"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { NewsStory } from "@/types/news";
import { StoryIntelligenceData, EditorialAngle } from "@/types/editorial";
import { studioStorage } from "@/lib/storage";
import { generateStoryIntelligence } from "@/lib/ideation-engine";
import { INITIAL_FALLBACK_STORIES } from "@/lib/sample-data";
import { ScoreBadge } from "@/components/common/ScoreBadge";
import {
  Brain,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  FileCheck2,
  Globe2,
  Users,
  Compass,
  ArrowRight,
  ChevronRight,
} from "lucide-react";

export default function StoryIntelligencePage() {
  const router = useRouter();
  const [selectedStory, setSelectedStory] = useState<NewsStory>(INITIAL_FALLBACK_STORIES[0]);
  const [intelData, setIntelData] = useState<StoryIntelligenceData | null>(null);
  const [allStories, setAllStories] = useState<NewsStory[]>(INITIAL_FALLBACK_STORIES);
  const [selectedAngle, setSelectedAngle] = useState<EditorialAngle | null>(null);

  useEffect(() => {
    // Check if an active story was passed from Topic Radar or Overview
    const active = studioStorage.getActiveStory();
    if (active) {
      setSelectedStory(active);
    }

    // Load available stories for story switcher
    async function loadStories() {
      try {
        const res = await fetch("/api/news");
        if (res.ok) {
          const data = await res.json();
          if (data.stories && data.stories.length > 0) {
            setAllStories(data.stories);
            if (!active) {
              setSelectedStory(data.stories[0]);
            }
          }
        }
      } catch {
        // Fallback to sample data
      }
    }
    loadStories();
  }, []);

  useEffect(() => {
    if (selectedStory) {
      const data = generateStoryIntelligence(selectedStory);
      setIntelData(data);
      setSelectedAngle(data.angles[0]);
    }
  }, [selectedStory]);

  const handleSelectStory = (storyId: string) => {
    const s = allStories.find((it) => it.id === storyId);
    if (s) {
      setSelectedStory(s);
      studioStorage.setActiveStory(s);
    }
  };

  const handleTransferToIdeation = () => {
    if (!selectedStory) return;
    studioStorage.setActiveStory(selectedStory);
    router.push("/content-ideation");
  };

  if (!intelData) return null;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col justify-between gap-4 border-b border-[#DCE6DF] pb-5 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-[#123B2B] px-2 py-0.5 text-xs font-bold text-white uppercase">
              Module 03
            </span>
            <span className="text-xs font-semibold text-[#16834A]">
              Story Intelligence Workspace
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#123B2B]">
            Editorial Research & Fact Verification
          </h1>
          <p className="mt-0.5 text-xs text-[#728078] max-w-2xl">
            Analyze newsworthiness across UAE and GCC markets, evaluate 7 distinct editorial angles, and verify factual assertions against primary source records.
          </p>
        </div>

        {/* Story Selector Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-[#728078] whitespace-nowrap">
            Investigate Story:
          </label>
          <select
            value={selectedStory.id}
            onChange={(e) => handleSelectStory(e.target.value)}
            className="max-w-xs truncate rounded-lg border border-[#DCE6DF] bg-white p-2 text-xs font-semibold text-[#14231B] focus:border-[#16834A] focus:outline-none"
          >
            {allStories.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Story Hero Card */}
      <div className="rounded-2xl border border-[#DCE6DF] bg-white p-6 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DCE6DF] pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded bg-[#123B2B] px-2.5 py-1 text-xs font-bold text-white">
              {selectedStory.source}
            </span>
            <span className="rounded bg-[#DDF5E8] px-2.5 py-1 text-xs font-semibold text-[#123B2B]">
              {selectedStory.geoCategory}
            </span>
            <span className="rounded bg-[#F5F8F5] px-2.5 py-1 text-xs font-medium text-[#728078]">
              {selectedStory.category}
            </span>
            <span className="text-xs text-[#728078]">
              Published: {new Date(selectedStory.publishedAt).toLocaleString("en-GB", { timeZone: "Asia/Dubai" })} GST
            </span>
          </div>

          <div className="flex items-center gap-3">
            <ScoreBadge score={selectedStory.score} size="md" />
            <a
              href={selectedStory.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs font-semibold text-[#16834A] hover:underline"
            >
              <span>Original Source</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        <h2 className="mt-4 text-xl font-bold leading-snug text-[#14231B]">
          {selectedStory.title}
        </h2>

        {selectedStory.snippet && (
          <p className="mt-2 text-sm leading-relaxed text-[#728078]">
            {selectedStory.snippet}
          </p>
        )}

        {/* Multi-source corroboration if present */}
        {selectedStory.relatedSources && selectedStory.relatedSources.length > 0 && (
          <div className="mt-4 rounded-xl bg-[#EDF8F2] border border-[#DDF5E8] p-3 text-xs">
            <span className="font-bold text-[#123B2B]">Corroborated by Independent Outlets:</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedStory.relatedSources.map((rs, i) => (
                <a
                  key={i}
                  href={rs.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md border border-[#DCE6DF] bg-white px-2 py-1 text-[11px] font-medium text-[#123B2B] hover:text-[#16834A] hover:border-[#16834A] flex items-center gap-1"
                >
                  <span>{rs.source}</span>
                  <ExternalLink className="h-3 w-3 opacity-60" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Strategic Significance Grid (UAE, GCC, Global) */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* UAE Significance */}
        <div className="rounded-xl border border-[#DCE6DF] bg-white p-5 shadow-card">
          <div className="flex items-center gap-2 border-b border-[#DCE6DF] pb-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#123B2B] text-white">
              <span className="text-xs font-bold">UAE</span>
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#123B2B]">UAE Strategic Significance</h3>
              <p className="text-[10px] text-[#728078]">Domestic Market Relevance (30 pts)</p>
            </div>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-[#14231B]">
            {intelData.geoSignificance.uae}
          </p>
        </div>

        {/* GCC Significance */}
        <div className="rounded-xl border border-[#DCE6DF] bg-white p-5 shadow-card">
          <div className="flex items-center gap-2 border-b border-[#DCE6DF] pb-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#16834A] text-white">
              <span className="text-xs font-bold">GCC</span>
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#123B2B]">GCC Regional Significance</h3>
              <p className="text-[10px] text-[#728078]">Cross-Border Flows (20 pts)</p>
            </div>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-[#14231B]">
            {intelData.geoSignificance.gcc}
          </p>
        </div>

        {/* Global Significance */}
        <div className="rounded-xl border border-[#DCE6DF] bg-white p-5 shadow-card">
          <div className="flex items-center gap-2 border-b border-[#DCE6DF] pb-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#22A06B] text-white">
              <Globe2 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#123B2B]">Global Importance</h3>
              <p className="text-[10px] text-[#728078]">Macroeconomic Signals (15 pts)</p>
            </div>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-[#14231B]">
            {intelData.geoSignificance.global}
          </p>
        </div>
      </div>

      {/* Suggested Target Audiences */}
      <div className="rounded-xl border border-[#DCE6DF] bg-white p-4 shadow-card">
        <div className="flex items-center gap-2 text-xs font-bold text-[#123B2B] mb-2">
          <Users className="h-4 w-4 text-[#16834A]" />
          <span>Recommended Target Audiences:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {intelData.suggestedAudience.map((aud, i) => (
            <span
              key={i}
              className="rounded-full bg-[#F5F8F5] border border-[#DCE6DF] px-3 py-1 text-xs font-medium text-[#14231B]"
            >
              {aud}
            </span>
          ))}
        </div>
      </div>

      {/* 7 Distinct Editorial Angles */}
      <div className="rounded-2xl border border-[#DCE6DF] bg-white p-6 shadow-card">
        <div className="flex items-center justify-between border-b border-[#DCE6DF] pb-4">
          <div>
            <h2 className="text-base font-bold text-[#123B2B]">
              7 Editorial Angles for 19Network Coverage
            </h2>
            <p className="mt-0.5 text-xs text-[#728078]">
              Select an editorial angle to transfer into the Content Ideation Studio.
            </p>
          </div>
          <button
            onClick={handleTransferToIdeation}
            className="flex items-center gap-1.5 rounded-lg bg-[#123B2B] px-4 py-2 text-xs font-semibold text-white hover:bg-[#16834A] transition-colors shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#DDF5E8]" />
            <span>Generate Content Package</span>
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {intelData.angles.map((angle) => {
            const isSelected = selectedAngle?.id === angle.id;
            return (
              <div
                key={angle.id}
                onClick={() => setSelectedAngle(angle)}
                className={`flex flex-col justify-between rounded-xl border p-4 cursor-pointer transition-all ${
                  isSelected
                    ? "border-[#16834A] bg-[#EDF8F2]/60 shadow-sm ring-1 ring-[#16834A]"
                    : "border-[#DCE6DF] bg-white hover:border-[#16834A]/40 hover:bg-[#F5F8F5]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#16834A] uppercase tracking-wider">
                      {angle.recommendedFormat}
                    </span>
                    <span className="rounded bg-white border border-[#DCE6DF] px-1.5 py-0.5 text-[9px] font-semibold text-[#728078]">
                      {angle.targetAudience}
                    </span>
                  </div>
                  <h3 className="mt-2 text-sm font-bold text-[#14231B]">
                    {angle.name}
                  </h3>
                  <div className="mt-1 text-xs font-semibold text-[#123B2B] italic">
                    &ldquo;{angle.hook}&rdquo;
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-[#728078]">
                    {angle.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-[#DCE6DF]/40 flex items-center justify-between text-xs">
                  <span className={`font-semibold ${isSelected ? "text-[#16834A]" : "text-[#728078]"}`}>
                    {isSelected ? "Selected Angle" : "Click to select"}
                  </span>
                  <ChevronRight className={`h-4 w-4 ${isSelected ? "text-[#16834A]" : "text-[#728078]"}`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fact-Checking & Attribution Checklist */}
      <div className="rounded-2xl border border-[#DCE6DF] bg-white p-6 shadow-card">
        <div className="flex items-center gap-2 border-b border-[#DCE6DF] pb-4">
          <ShieldCheck className="h-5 w-5 text-[#16834A]" />
          <div>
            <h2 className="text-base font-bold text-[#123B2B]">
              Editorial Fact-Checking & Attribution Checklist
            </h2>
            <p className="text-xs text-[#728078]">
              Verify specific claims against primary source records before publication. Do not publish unverified figures.
            </p>
          </div>
        </div>

        <div className="mt-4 divide-y divide-[#DCE6DF]">
          {intelData.factCheckList.map((fc) => (
            <div key={fc.id} className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="font-semibold text-[#14231B]">{fc.claim}</div>
                <div className="text-[#728078] flex items-center gap-2">
                  <span>Source Reference: <strong className="text-[#123B2B]">{fc.sourceReference}</strong></span>
                  {fc.notes && <span>• {fc.notes}</span>}
                </div>
              </div>

              <div>
                {fc.status === "verified" ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#DDF5E8] border border-[#16834A]/30 px-3 py-1 font-semibold text-[#123B2B]">
                    <FileCheck2 className="h-3.5 w-3.5 text-[#16834A]" />
                    Corroborated in Dispatch
                  </span>
                ) : fc.status === "official_statement" ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200 px-3 py-1 font-semibold text-blue-800">
                    Official Statement
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 font-semibold text-amber-800">
                    <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
                    Requires Manual Check
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
