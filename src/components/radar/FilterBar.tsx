"use client";

import { GeoCategory, NewsCategory, QuickFilter } from "@/types/news";
import {
  Search,
  Filter,
  RefreshCw,
  Download,
  Bookmark,
  SlidersHorizontal,
} from "lucide-react";

interface FilterBarProps {
  search: string;
  onSearchChange: (val: string) => void;
  selectedGeo: GeoCategory | "All";
  onGeoChange: (geo: GeoCategory | "All") => void;
  selectedCategory: NewsCategory | "All";
  onCategoryChange: (cat: NewsCategory | "All") => void;
  quickFilter: QuickFilter;
  onQuickFilterChange: (qf: QuickFilter) => void;
  minScore: number;
  onMinScoreChange: (score: number) => void;
  sortBy: "score" | "date" | "title";
  onSortByChange: (sort: "score" | "date" | "title") => void;
  onlySaved: boolean;
  onToggleOnlySaved: () => void;
  onRefresh: () => void;
  onExport: () => void;
  isLoading?: boolean;
}

const GEO_OPTIONS: Array<GeoCategory | "All"> = [
  "All",
  "UAE",
  "Saudi Arabia",
  "Qatar",
  "Kuwait",
  "Bahrain",
  "Oman",
  "GCC-wide",
  "South Asia",
  "Europe",
  "United States",
  "Asia-Pacific",
  "Global",
];

const CATEGORY_OPTIONS: Array<NewsCategory | "All"> = [
  "All",
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

const QUICK_FILTERS: QuickFilter[] = [
  "All",
  "Breaking",
  "Trending",
  "Latest",
  "Most Relevant",
];

export function FilterBar({
  search,
  onSearchChange,
  selectedGeo,
  onGeoChange,
  selectedCategory,
  onCategoryChange,
  quickFilter,
  onQuickFilterChange,
  minScore,
  onMinScoreChange,
  sortBy,
  onSortByChange,
  onlySaved,
  onToggleOnlySaved,
  onRefresh,
  onExport,
  isLoading,
}: FilterBarProps) {
  return (
    <div className="space-y-3 rounded-2xl border border-[#DCE6DF] bg-white p-4 shadow-card">
      {/* Search & Actions Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#728078]" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search discovered stories, entities, companies..."
            className="w-full rounded-lg border border-[#DCE6DF] bg-[#F5F8F5] py-2 pl-9 pr-3 text-xs font-medium text-[#14231B] placeholder-[#728078] focus:border-[#16834A] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#16834A]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Saved Toggle */}
          <button
            onClick={onToggleOnlySaved}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition-all ${
              onlySaved
                ? "border-[#16834A] bg-[#DDF5E8] text-[#123B2B]"
                : "border-[#DCE6DF] bg-white text-[#728078] hover:border-[#123B2B] hover:text-[#123B2B]"
            }`}
          >
            <Bookmark className={`h-3.5 w-3.5 ${onlySaved ? "fill-[#16834A]" : ""}`} />
            <span>Saved Stories</span>
          </button>

          {/* Refresh Feeds */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-1.5 rounded-lg border border-[#DCE6DF] bg-white px-3 py-2 text-xs font-semibold text-[#14231B] hover:border-[#16834A] hover:text-[#123B2B] transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-[#16834A] ${isLoading ? "animate-spin" : ""}`} />
            <span>{isLoading ? "Fetching..." : "Refresh"}</span>
          </button>

          {/* Export CSV */}
          <button
            onClick={onExport}
            className="flex items-center gap-1.5 rounded-lg bg-[#123B2B] px-3 py-2 text-xs font-semibold text-white hover:bg-[#16834A] transition-colors"
          >
            <Download className="h-3.5 w-3.5 text-[#DDF5E8]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Quick Filters Pill Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <span className="text-[11px] font-bold text-[#728078] uppercase tracking-wider pr-1">
          Signal:
        </span>
        {QUICK_FILTERS.map((qf) => (
          <button
            key={qf}
            onClick={() => onQuickFilterChange(qf)}
            className={`whitespace-nowrap rounded-full px-3 py-1 font-medium transition-colors ${
              quickFilter === qf
                ? "bg-[#123B2B] text-white font-semibold"
                : "bg-[#F5F8F5] text-[#728078] hover:bg-[#DDF5E8] hover:text-[#123B2B]"
            }`}
          >
            {qf}
          </button>
        ))}
      </div>

      {/* Dropdowns Row: Geography, Category, Score Threshold, Sort */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 border-t border-[#DCE6DF]/60 pt-3">
        {/* Geography */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#728078] mb-1">
            Geography
          </label>
          <select
            value={selectedGeo}
            onChange={(e) => onGeoChange(e.target.value as GeoCategory | "All")}
            className="w-full rounded-lg border border-[#DCE6DF] bg-[#F5F8F5] p-2 text-xs font-medium text-[#14231B] focus:border-[#16834A] focus:outline-none"
          >
            {GEO_OPTIONS.map((geo) => (
              <option key={geo} value={geo}>
                {geo}
              </option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#728078] mb-1">
            Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value as NewsCategory | "All")}
            className="w-full rounded-lg border border-[#DCE6DF] bg-[#F5F8F5] p-2 text-xs font-medium text-[#14231B] focus:border-[#16834A] focus:outline-none"
          >
            {CATEGORY_OPTIONS.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Min Score */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#728078] mb-1">
            Min Score: {minScore} pts
          </label>
          <input
            type="range"
            min="0"
            max="95"
            step="5"
            value={minScore}
            onChange={(e) => onMinScoreChange(Number(e.target.value))}
            className="w-full accent-[#16834A] cursor-pointer mt-1.5"
          />
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#728078] mb-1">
            Sort Order
          </label>
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value as "score" | "date" | "title")}
            className="w-full rounded-lg border border-[#DCE6DF] bg-[#F5F8F5] p-2 text-xs font-medium text-[#14231B] focus:border-[#16834A] focus:outline-none"
          >
            <option value="score">Opportunity Score (Highest)</option>
            <option value="date">Date Published (Latest)</option>
            <option value="title">Headline (A–Z)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
