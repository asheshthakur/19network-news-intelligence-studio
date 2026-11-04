"use client";

import { NewsStory } from "@/types/news";
import { ScoreBadge } from "../common/ScoreBadge";
import {
  ExternalLink,
  Bookmark,
  Sparkles,
  Layers,
  Clock,
  Globe,
  TrendingUp,
  Brain,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { studioStorage } from "@/lib/storage";

interface StoryCardProps {
  story: NewsStory;
  isSaved?: boolean;
  onToggleSave?: (story: NewsStory) => void;
  onOpenCluster?: (clusterId: string) => void;
}

export function StoryCard({
  story,
  isSaved = false,
  onToggleSave,
  onOpenCluster,
}: StoryCardProps) {
  const router = useRouter();

  const handleOpenIntelligence = () => {
    studioStorage.setActiveStory(story);
    router.push("/story-intelligence");
  };

  const handleOpenIdeation = () => {
    studioStorage.setActiveStory(story);
    router.push("/content-ideation");
  };

  const formattedDate = (() => {
    try {
      const d = new Date(story.publishedAt);
      return d.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Recent";
    }
  })();

  return (
    <div className="group relative flex flex-col justify-between rounded-xl border border-[#DCE6DF] bg-white p-5 shadow-card transition-all hover:border-[#16834A]/50 hover:shadow-cardHover">
      <div>
        {/* Top Meta row */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#DCE6DF]/40 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Publisher / Source */}
            <span className="font-semibold text-xs text-[#123B2B] bg-[#F5F8F5] px-2 py-0.5 rounded border border-[#DCE6DF]">
              {story.source}
            </span>

            {/* Geo Tag */}
            <span className="flex items-center gap-1 rounded bg-[#DDF5E8] px-2 py-0.5 text-[11px] font-semibold text-[#123B2B]">
              <Globe className="h-3 w-3 text-[#16834A]" />
              {story.geoCategory}
            </span>

            {/* Category Tag */}
            <span className="rounded bg-[#F5F8F5] px-2 py-0.5 text-[11px] font-medium text-[#728078]">
              {story.category}
            </span>

            {/* Trending indicator */}
            {story.isTrending && (
              <span
                className={`flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-bold ${
                  story.isMeasuredTrend
                    ? "bg-[#16834A] text-white"
                    : "bg-emerald-100 text-emerald-900 border border-emerald-300"
                }`}
                title={
                  story.isMeasuredTrend
                    ? "Measured velocity trend"
                    : "Estimated heuristic velocity"
                }
              >
                <TrendingUp className="h-3 w-3" />
                {story.isMeasuredTrend ? "Trending" : "Momentum"}
              </span>
            )}
          </div>

          {/* 100-Point Score Badge */}
          <ScoreBadge score={story.score} size="sm" />
        </div>

        {/* Headline */}
        <h3 className="mt-3 text-base font-bold leading-snug text-[#14231B] group-hover:text-[#123B2B]">
          <a
            href={story.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline flex items-start gap-1"
          >
            <span>{story.title}</span>
            <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-40 group-hover:opacity-100 transition-opacity mt-1 text-[#16834A]" />
          </a>
        </h3>

        {/* Snippet */}
        {story.snippet && (
          <p className="mt-2 text-xs leading-relaxed text-[#728078] line-clamp-3">
            {story.snippet}
          </p>
        )}
      </div>

      {/* Card Footer Actions & Meta */}
      <div className="mt-4 border-t border-[#DCE6DF]/40 pt-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3 text-[11px] text-[#728078]">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formattedDate}
          </span>

          {/* Duplicate / Cluster indicator */}
          {story.duplicateCount && story.duplicateCount > 1 && story.clusterId && (
            <button
              onClick={() => onOpenCluster && onOpenCluster(story.clusterId!)}
              className="flex items-center gap-1 font-semibold text-[#16834A] hover:underline bg-[#EDF8F2] px-2 py-0.5 rounded"
            >
              <Layers className="h-3 w-3" />
              <span>{story.duplicateCount} Sources Reporting</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Save Story Action */}
          <button
            onClick={() => onToggleSave && onToggleSave(story)}
            className={`rounded-lg p-1.5 transition-colors ${
              isSaved
                ? "bg-[#DDF5E8] text-[#123B2B]"
                : "text-[#728078] hover:bg-[#F5F8F5] hover:text-[#123B2B]"
            }`}
            title={isSaved ? "Saved in workspace" : "Save story"}
          >
            <Bookmark className={`h-4 w-4 ${isSaved ? "fill-[#16834A] text-[#16834A]" : ""}`} />
          </button>

          {/* Story Intelligence */}
          <button
            onClick={handleOpenIntelligence}
            className="flex items-center gap-1.5 rounded-lg border border-[#DCE6DF] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#14231B] hover:border-[#16834A] hover:text-[#123B2B] transition-colors"
          >
            <Brain className="h-3.5 w-3.5 text-[#16834A]" />
            <span>Research</span>
          </button>

          {/* Generate Brief & Content */}
          <button
            onClick={handleOpenIdeation}
            className="flex items-center gap-1.5 rounded-lg bg-[#123B2B] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#16834A] transition-colors shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#DDF5E8]" />
            <span>Ideate</span>
          </button>
        </div>
      </div>
    </div>
  );
}
