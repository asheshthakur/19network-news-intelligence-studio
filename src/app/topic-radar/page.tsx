"use client";

import { Suspense, useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { FilterBar } from "@/components/radar/FilterBar";
import { StoryCard } from "@/components/radar/StoryCard";
import { ClusterDrawer } from "@/components/radar/ClusterDrawer";
import { SkeletonCard } from "@/components/common/SkeletonLoader";
import { EmptyState } from "@/components/common/EmptyState";
import { GeoCategory, NewsCategory, NewsStory, QuickFilter, StoryCluster } from "@/types/news";
import { studioStorage } from "@/lib/storage";
import { exportStoriesToCsv } from "@/lib/export-utils";
import { INITIAL_FALLBACK_STORIES } from "@/lib/sample-data";
import { Compass, AlertCircle, CheckCircle2 } from "lucide-react";

function TopicRadarContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [stories, setStories] = useState<NewsStory[]>(INITIAL_FALLBACK_STORIES);
  const [clusters, setClusters] = useState<StoryCluster[]>([]);
  const [sourceStatuses, setSourceStatuses] = useState<
    Array<{ source: string; status: "ok" | "degraded" | "failed"; count: number; error?: string }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState(initialSearch);
  const [selectedGeo, setSelectedGeo] = useState<GeoCategory | "All">("All");
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory | "All">("All");
  const [quickFilter, setQuickFilter] = useState<QuickFilter>("All");
  const [minScore, setMinScore] = useState<number>(0);
  const [sortBy, setSortBy] = useState<"score" | "date" | "title">("score");
  const [onlySaved, setOnlySaved] = useState(false);

  // Cluster Drawer state
  const [activeCluster, setActiveCluster] = useState<StoryCluster | null>(null);
  const [isClusterOpen, setIsClusterOpen] = useState(false);

  // Saved story IDs cache
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const loadFeedData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/news");
      if (res.ok) {
        const data = await res.json();
        if (data.stories && data.stories.length > 0) {
          setStories(data.stories);
          if (data.clusters) setClusters(data.clusters);
          if (data.sourcesStatus) setSourceStatuses(data.sourcesStatus);
        }
      }
    } catch (err) {
      console.warn("Failed to load /api/news, using local cache", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFeedData();

    // Load saved stories
    const saved = studioStorage.getSavedStories();
    setSavedIds(new Set(saved.map((s) => s.id)));

    const handleSavedUpdate = () => {
      const updated = studioStorage.getSavedStories();
      setSavedIds(new Set(updated.map((s) => s.id)));
    };

    window.addEventListener("19network_stories_updated", handleSavedUpdate);
    return () => window.removeEventListener("19network_stories_updated", handleSavedUpdate);
  }, []);

  const handleToggleSave = (story: NewsStory) => {
    studioStorage.toggleSaveStory(story);
  };

  const handleOpenCluster = (clusterId: string) => {
    const cl = clusters.find((c) => c.id === clusterId);
    if (cl) {
      setActiveCluster(cl);
      setIsClusterOpen(true);
    }
  };

  // Filtered & Sorted stories
  const filteredStories = useMemo(() => {
    let result = [...stories];

    if (onlySaved) {
      result = result.filter((s) => savedIds.has(s.id));
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.source.toLowerCase().includes(q) ||
          (s.snippet && s.snippet.toLowerCase().includes(q))
      );
    }

    if (selectedGeo !== "All") {
      result = result.filter((s) => s.geoCategory === selectedGeo);
    }

    if (selectedCategory !== "All") {
      result = result.filter((s) => s.category === selectedCategory);
    }

    if (minScore > 0) {
      result = result.filter((s) => s.score.total >= minScore);
    }

    if (quickFilter === "Breaking") {
      result = result.filter((s) => s.isBreaking);
    } else if (quickFilter === "Trending") {
      result = result.filter((s) => s.isTrending);
    } else if (quickFilter === "Latest") {
      result.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    } else if (quickFilter === "Most Relevant") {
      result = result.filter((s) => s.score.total >= 80);
    }

    // Sort order
    if (sortBy === "score") {
      result.sort((a, b) => b.score.total - a.score.total);
    } else if (sortBy === "date") {
      result.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    } else if (sortBy === "title") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [stories, search, selectedGeo, selectedCategory, quickFilter, minScore, sortBy, onlySaved, savedIds]);

  return (
    <div className="space-y-6">
      {/* Module Title Banner */}
      <div className="flex flex-col justify-between gap-4 border-b border-[#DCE6DF] pb-5 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-[#123B2B] px-2 py-0.5 text-xs font-bold text-white uppercase">
              Module 02
            </span>
            <span className="text-xs font-semibold text-[#16834A]">
              Topic Radar Discovery Engine
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#123B2B]">
            Multi-Source News Discovery
          </h1>
          <p className="mt-0.5 text-xs text-[#728078] max-w-2xl">
            Live aggregation across Google News UAE & GCC RSS feeds, GDELT international monitoring, and regional publication wires with transparent 100-point opportunity scoring.
          </p>
        </div>

        {/* Source Adapter Health Indicator Bar */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {sourceStatuses.map((src, i) => (
            <div
              key={i}
              className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-medium ${
                src.status === "ok"
                  ? "border-[#16834A]/30 bg-[#DDF5E8] text-[#123B2B]"
                  : src.status === "degraded"
                  ? "border-amber-300 bg-amber-50 text-amber-800"
                  : "border-rose-300 bg-rose-50 text-rose-800"
              }`}
            >
              {src.status === "ok" ? (
                <CheckCircle2 className="h-3 w-3 text-[#16834A]" />
              ) : (
                <AlertCircle className="h-3 w-3" />
              )}
              <span>{src.source}: {src.count} stories</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filter & Control Bar */}
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        selectedGeo={selectedGeo}
        onGeoChange={setSelectedGeo}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        quickFilter={quickFilter}
        onQuickFilterChange={setQuickFilter}
        minScore={minScore}
        onMinScoreChange={setMinScore}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        onlySaved={onlySaved}
        onToggleOnlySaved={() => setOnlySaved(!onlySaved)}
        onRefresh={loadFeedData}
        onExport={() => exportStoriesToCsv(filteredStories)}
        isLoading={isLoading}
      />

      {/* Stories Count & Results Header */}
      <div className="flex items-center justify-between text-xs text-[#728078]">
        <span>
          Showing <strong className="text-[#14231B]">{filteredStories.length}</strong> of{" "}
          <strong className="text-[#14231B]">{stories.length}</strong> discovered dispatches
          {clusters.length > 0 && ` (${clusters.length} multi-source clusters detected)`}
        </span>
        {onlySaved && (
          <span className="font-semibold text-[#16834A]">Viewing Saved Stories Only</span>
        )}
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Stories Grid */}
      {!isLoading && filteredStories.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredStories.map((story) => (
            <StoryCard
              key={story.id}
              story={story}
              isSaved={savedIds.has(story.id)}
              onToggleSave={handleToggleSave}
              onOpenCluster={handleOpenCluster}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredStories.length === 0 && (
        <EmptyState
          icon={Compass}
          title="No stories matched your filter criteria"
          description="Try broadening your geographic location, reducing the opportunity score threshold, or resetting your search query."
          actionLabel="Reset All Filters"
          onAction={() => {
            setSearch("");
            setSelectedGeo("All");
            setSelectedCategory("All");
            setQuickFilter("All");
            setMinScore(0);
            setOnlySaved(false);
          }}
        />
      )}

      {/* Story Cluster Drawer Modal */}
      <ClusterDrawer
        cluster={activeCluster}
        isOpen={isClusterOpen}
        onClose={() => setIsClusterOpen(false)}
        onSelectStory={(id) => {
          setIsClusterOpen(false);
        }}
      />
    </div>
  );
}

export default function TopicRadarPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs text-[#728078]">Loading Topic Radar...</div>}>
      <TopicRadarContent />
    </Suspense>
  );
}
