"use client";

import { StoryCluster } from "@/types/news";
import { Modal } from "../common/Modal";
import { ExternalLink, Layers, Clock, Globe } from "lucide-react";
import { ScoreBadge } from "../common/ScoreBadge";

interface ClusterDrawerProps {
  cluster: StoryCluster | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectStory: (storyId: string) => void;
}

export function ClusterDrawer({
  cluster,
  isOpen,
  onClose,
  onSelectStory,
}: ClusterDrawerProps) {
  if (!cluster) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Story Cluster: Multi-Source Corroboration"
      subtitle={`Theme: "${cluster.keywordTheme}" • ${cluster.totalSources} Independent Reporting Outlets`}
      maxWidth="2xl"
    >
      <div className="space-y-4">
        <div className="rounded-xl bg-[#EDF8F2] border border-[#DDF5E8] p-3 text-xs text-[#123B2B]">
          <span className="font-bold">Editorial Cluster Intelligence:</span> Near-identical developments detected across multiple agencies. Preserving independent source URLs for fact-checking and multi-angle corroboration.
        </div>

        <div className="divide-y divide-[#DCE6DF]">
          {cluster.stories.map((story, idx) => (
            <div key={story.id} className="py-3.5 space-y-2 first:pt-0 last:pb-0">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-[#F5F8F5] border border-[#DCE6DF] px-2 py-0.5 text-xs font-semibold text-[#123B2B]">
                    {story.source}
                  </span>
                  {idx === 0 && (
                    <span className="rounded bg-[#123B2B] px-1.5 py-0.5 text-[10px] font-bold text-white uppercase">
                      Lead Outlet
                    </span>
                  )}
                  <span className="text-[11px] text-[#728078] flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(story.publishedAt).toLocaleDateString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>
                <ScoreBadge score={story.score} size="sm" />
              </div>

              <h4 className="text-sm font-bold text-[#14231B] hover:text-[#123B2B]">
                <a
                  href={story.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline flex items-start gap-1"
                >
                  <span>{story.title}</span>
                  <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-60 text-[#16834A] mt-0.5" />
                </a>
              </h4>

              {story.snippet && (
                <p className="text-xs text-[#728078] line-clamp-2">
                  {story.snippet}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-2 border-t border-[#DCE6DF]">
          <button
            onClick={onClose}
            className="rounded-lg bg-[#123B2B] px-4 py-2 text-xs font-semibold text-white hover:bg-[#16834A] transition-colors"
          >
            Close Cluster View
          </button>
        </div>
      </div>
    </Modal>
  );
}
