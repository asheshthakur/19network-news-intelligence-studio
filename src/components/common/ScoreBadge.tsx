"use client";

import { useState } from "react";
import { ScoringBreakdown } from "@/types/news";
import { Info } from "lucide-react";

export function ScoreBadge({
  score,
  size = "md",
}: {
  score: ScoringBreakdown;
  size?: "sm" | "md" | "lg";
}) {
  const [showTooltip, setShowTooltip] = useState(false);

  const total = score.total;
  let bg = "bg-[#DDF5E8] text-[#123B2B] border-[#16834A]/30";
  if (total >= 85) {
    bg = "bg-[#123B2B] text-white border-transparent";
  } else if (total >= 70) {
    bg = "bg-[#16834A] text-white border-transparent";
  } else if (total < 50) {
    bg = "bg-gray-100 text-gray-700 border-gray-200";
  }

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs font-bold",
    md: "px-2.5 py-1 text-xs font-bold",
    lg: "px-3.5 py-1.5 text-sm font-bold",
  }[size];

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip(!showTooltip)}
        className={`inline-flex items-center gap-1.5 rounded-full border transition-all ${bg} ${sizeClasses}`}
        title="Click to view 100-point scoring breakdown"
      >
        <span>{total}</span>
        <span className="text-[10px] font-normal opacity-80">/100</span>
        <Info className="h-3 w-3 opacity-70" />
      </button>

      {showTooltip && (
        <div className="absolute right-0 top-full z-50 mt-2 w-72 rounded-xl border border-[#DCE6DF] bg-white p-3.5 shadow-float text-left text-xs">
          <div className="flex items-center justify-between border-b border-[#DCE6DF] pb-2 font-bold text-[#123B2B]">
            <span>Opportunity Score Breakdown</span>
            <span className="rounded bg-[#DDF5E8] px-2 py-0.5 text-[#123B2B]">
              {total} pts
            </span>
          </div>

          <div className="mt-2 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[#728078]">UAE Relevance:</span>
              <span className="font-semibold text-[#14231B]">
                {score.uaeRelevance} / 30
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#728078]">GCC Relevance:</span>
              <span className="font-semibold text-[#14231B]">
                {score.gccRelevance} / 20
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#728078]">Global Importance:</span>
              <span className="font-semibold text-[#14231B]">
                {score.globalImportance} / 15
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#728078]">Trending Velocity:</span>
              <span className="font-semibold text-[#14231B]">
                {score.trendingMomentum} / 15
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#728078]">Source Credibility:</span>
              <span className="font-semibold text-[#14231B]">
                {score.sourceCredibility} / 10
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#728078]">Publication Freshness:</span>
              <span className="font-semibold text-[#14231B]">
                {score.freshness} / 10
              </span>
            </div>
          </div>

          {score.scoringNotes && score.scoringNotes.length > 0 && (
            <div className="mt-2.5 border-t border-[#DCE6DF]/50 pt-2">
              <div className="text-[10px] font-semibold text-[#16834A] uppercase tracking-wide">
                Scoring Justification
              </div>
              <ul className="mt-1 list-disc pl-3 text-[11px] text-[#728078] space-y-0.5">
                {score.scoringNotes.map((note, idx) => (
                  <li key={idx}>{note}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-2 text-[10px] text-[#728078]/70 italic border-t border-[#DCE6DF]/40 pt-1">
            {score.isHeuristicTrending
              ? "Trending momentum derived from headline velocity heuristic."
              : "Direct trend measurement corroborated via feed velocity."}
          </div>
        </div>
      )}
    </div>
  );
}
