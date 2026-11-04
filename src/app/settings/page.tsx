"use client";

import { useEffect, useState } from "react";
import { StudioSettings, ScoringWeights, RSSFeedSource } from "@/types/settings";
import { studioStorage } from "@/lib/storage";
import { downloadJsonFile } from "@/lib/export-utils";
import { Modal } from "@/components/common/Modal";
import {
  Settings2,
  Sliders,
  Rss,
  Globe2,
  Share2,
  Database,
  Trash2,
  Download,
  Upload,
  Check,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ExternalLink,
} from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState<StudioSettings>(studioStorage.getSettings());
  const [savedFeedback, setSavedFeedback] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [newFeedUrl, setNewFeedUrl] = useState("");
  const [newFeedName, setNewFeedName] = useState("");
  const [newFeedRegion, setNewFeedRegion] = useState<"UAE" | "GCC" | "Global">("UAE");

  useEffect(() => {
    setSettings(studioStorage.getSettings());
  }, []);

  const handleWeightChange = (key: keyof ScoringWeights, val: number) => {
    const updatedWeights = { ...settings.scoringWeights, [key]: val };
    const updated = { ...settings, scoringWeights: updatedWeights };
    setSettings(updated);
    studioStorage.saveSettings(updated);
    triggerSaved();
  };

  const handleToggleSource = (id: string) => {
    const updatedSources = settings.sources.map((s) =>
      s.id === id ? { ...s, enabled: !s.enabled } : s
    );
    const updated = { ...settings, sources: updatedSources };
    setSettings(updated);
    studioStorage.saveSettings(updated);
    triggerSaved();
  };

  const handleAddCustomSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeedUrl.trim() || !newFeedName.trim()) return;

    const newSource: RSSFeedSource = {
      id: `custom-feed-${Date.now()}`,
      name: newFeedName.trim(),
      url: newFeedUrl.trim(),
      region: newFeedRegion,
      enabled: true,
      credibilityWeight: 8,
      isDefault: false,
    };

    const updated = { ...settings, sources: [...settings.sources, newSource] };
    setSettings(updated);
    studioStorage.saveSettings(updated);
    setNewFeedName("");
    setNewFeedUrl("");
    triggerSaved();
  };

  const handleDeleteSource = (id: string) => {
    const updated = { ...settings, sources: settings.sources.filter((s) => s.id !== id) };
    setSettings(updated);
    studioStorage.saveSettings(updated);
    triggerSaved();
  };

  const triggerSaved = () => {
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  const handleExportFullBackup = () => {
    const backup = {
      settings,
      savedStories: studioStorage.getSavedStories(),
      calendarItems: studioStorage.getCalendarItems(),
      socialData: studioStorage.getSocialData(),
      exportedAt: new Date().toISOString(),
    };
    downloadJsonFile(backup, `19network-studio-backup-${new Date().toISOString().split("T")[0]}.json`);
  };

  const handleResetData = () => {
    studioStorage.resetAllDemoData();
    setResetModalOpen(false);
    window.location.reload();
  };

  const totalWeights =
    settings.scoringWeights.uaeRelevance +
    settings.scoringWeights.gccRelevance +
    settings.scoringWeights.globalImportance +
    settings.scoringWeights.trendingMomentum +
    settings.scoringWeights.sourceCredibility +
    settings.scoringWeights.freshness;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col justify-between gap-4 border-b border-[#DCE6DF] pb-5 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-[#123B2B] px-2 py-0.5 text-xs font-bold text-white uppercase">
              Module 10
            </span>
            <span className="text-xs font-semibold text-[#16834A]">
              Settings & Connectivity
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#123B2B]">
            Newsroom Configuration
          </h1>
          <p className="mt-0.5 text-xs text-[#728078] max-w-2xl">
            Configure opportunity scoring algorithms, active news wires, publishing timezones, and local workspace data persistence.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {savedFeedback && (
            <span className="flex items-center gap-1 text-xs font-bold text-[#16834A] bg-[#DDF5E8] px-3 py-1.5 rounded-lg border border-[#16834A]/20">
              <Check className="h-3.5 w-3.5" />
              <span>Saved</span>
            </span>
          )}
          <button
            onClick={handleExportFullBackup}
            className="flex items-center gap-1.5 rounded-lg border border-[#DCE6DF] bg-white px-3.5 py-2 text-xs font-semibold text-[#14231B] hover:bg-[#F5F8F5]"
          >
            <Download className="h-3.5 w-3.5 text-[#16834A]" />
            <span>Export Backup JSON</span>
          </button>
        </div>
      </div>

      {/* 1. Algorithmic Scoring Weights Configuration */}
      <div className="rounded-2xl border border-[#DCE6DF] bg-white p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-[#DCE6DF] pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="h-4 w-4 text-[#16834A]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#123B2B]">
              100-Point Opportunity Scoring Weights
            </span>
          </div>
          <span
            className={`rounded px-2 py-0.5 text-xs font-bold font-mono ${
              totalWeights === 100
                ? "bg-[#DDF5E8] text-[#123B2B]"
                : "bg-amber-100 text-amber-900 border border-amber-300"
            }`}
          >
            Total Weight: {totalWeights} / 100 pts
          </span>
        </div>

        <p className="text-xs text-[#728078] leading-relaxed">
          Adjust the relative weighting for automatic newsworthiness ranking across incoming feed dispatches. All stories in Topic Radar dynamically re-rank when changed.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <div className="flex justify-between text-xs font-semibold text-[#14231B]">
              <span>UAE Relevance:</span>
              <span className="font-mono">{settings.scoringWeights.uaeRelevance} pts</span>
            </div>
            <input
              type="range"
              min="10"
              max="50"
              value={settings.scoringWeights.uaeRelevance}
              onChange={(e) => handleWeightChange("uaeRelevance", Number(e.target.value))}
              className="w-full accent-[#16834A] mt-1.5 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-[#14231B]">
              <span>GCC Regional Relevance:</span>
              <span className="font-mono">{settings.scoringWeights.gccRelevance} pts</span>
            </div>
            <input
              type="range"
              min="5"
              max="40"
              value={settings.scoringWeights.gccRelevance}
              onChange={(e) => handleWeightChange("gccRelevance", Number(e.target.value))}
              className="w-full accent-[#16834A] mt-1.5 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-[#14231B]">
              <span>Global Importance:</span>
              <span className="font-mono">{settings.scoringWeights.globalImportance} pts</span>
            </div>
            <input
              type="range"
              min="5"
              max="30"
              value={settings.scoringWeights.globalImportance}
              onChange={(e) => handleWeightChange("globalImportance", Number(e.target.value))}
              className="w-full accent-[#16834A] mt-1.5 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-[#14231B]">
              <span>Trending Velocity:</span>
              <span className="font-mono">{settings.scoringWeights.trendingMomentum} pts</span>
            </div>
            <input
              type="range"
              min="5"
              max="30"
              value={settings.scoringWeights.trendingMomentum}
              onChange={(e) => handleWeightChange("trendingMomentum", Number(e.target.value))}
              className="w-full accent-[#16834A] mt-1.5 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-[#14231B]">
              <span>Source Credibility:</span>
              <span className="font-mono">{settings.scoringWeights.sourceCredibility} pts</span>
            </div>
            <input
              type="range"
              min="5"
              max="20"
              value={settings.scoringWeights.sourceCredibility}
              onChange={(e) => handleWeightChange("sourceCredibility", Number(e.target.value))}
              className="w-full accent-[#16834A] mt-1.5 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-[#14231B]">
              <span>Publication Freshness:</span>
              <span className="font-mono">{settings.scoringWeights.freshness} pts</span>
            </div>
            <input
              type="range"
              min="5"
              max="20"
              value={settings.scoringWeights.freshness}
              onChange={(e) => handleWeightChange("freshness", Number(e.target.value))}
              className="w-full accent-[#16834A] mt-1.5 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* 2. News Sources & Feed Adapters Management */}
      <div className="rounded-2xl border border-[#DCE6DF] bg-white p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-[#DCE6DF] pb-3">
          <div className="flex items-center gap-2">
            <Rss className="h-4 w-4 text-[#16834A]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#123B2B]">
              Active Multi-Source Feed Adapters
            </span>
          </div>
          <span className="text-xs text-[#728078]">
            {settings.sources.filter((s) => s.enabled).length} Enabled
          </span>
        </div>

        <div className="space-y-2.5">
          {settings.sources.map((src) => (
            <div
              key={src.id}
              className="flex items-center justify-between rounded-xl border border-[#DCE6DF] p-3 text-xs"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#14231B]">{src.name}</span>
                  <span className="rounded bg-[#EDF8F2] px-1.5 py-0.2 text-[10px] font-semibold text-[#16834A]">
                    {src.region}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-[#728078] truncate max-w-md">
                  {src.url}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={src.enabled}
                    onChange={() => handleToggleSource(src.id)}
                    className="accent-[#16834A] h-4 w-4"
                  />
                  <span className="font-semibold text-[#14231B]">
                    {src.enabled ? "Enabled" : "Disabled"}
                  </span>
                </label>

                {!src.isDefault && (
                  <button
                    onClick={() => handleDeleteSource(src.id)}
                    className="rounded p-1 text-rose-500 hover:bg-rose-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add custom feed form */}
        <form onSubmit={handleAddCustomSource} className="mt-4 rounded-xl border border-dashed border-[#DCE6DF] p-4 bg-[#F5F8F5]/40 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#123B2B] block">
            Add Custom News Wire or RSS Feed
          </span>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <input
              type="text"
              required
              placeholder="Source Name (e.g. Dubai Chamber Wire)"
              value={newFeedName}
              onChange={(e) => setNewFeedName(e.target.value)}
              className="rounded-lg border border-[#DCE6DF] bg-white p-2 text-xs font-medium text-[#14231B] focus:outline-none"
            />
            <input
              type="url"
              required
              placeholder="Feed URL (https://.../rss.xml)"
              value={newFeedUrl}
              onChange={(e) => setNewFeedUrl(e.target.value)}
              className="rounded-lg border border-[#DCE6DF] bg-white p-2 text-xs font-mono text-[#14231B] focus:outline-none"
            />
            <div className="flex gap-2">
              <select
                value={newFeedRegion}
                onChange={(e) => setNewFeedRegion(e.target.value as "UAE" | "GCC" | "Global")}
                className="rounded-lg border border-[#DCE6DF] bg-white p-2 text-xs font-medium text-[#14231B] focus:outline-none flex-1"
              >
                <option value="UAE">Region: UAE</option>
                <option value="GCC">Region: GCC</option>
                <option value="Global">Region: Global</option>
              </select>
              <button
                type="submit"
                className="rounded-lg bg-[#123B2B] px-4 py-2 text-xs font-semibold text-white hover:bg-[#16834A] transition-colors"
              >
                Add Feed
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* 3. Publishing & Timezone Preferences */}
      <div className="rounded-2xl border border-[#DCE6DF] bg-white p-6 shadow-card space-y-4">
        <div className="border-b border-[#DCE6DF] pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#123B2B]">
            Editorial Standards & Publishing Preferences
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 text-xs">
          <div>
            <label className="block text-[#728078] font-bold uppercase mb-1">
              Newsroom Timezone
            </label>
            <div className="rounded-lg border border-[#DCE6DF] bg-[#F5F8F5] p-2.5 font-semibold text-[#123B2B]">
              Asia/Dubai (Gulf Standard Time UTC+4)
            </div>
          </div>

          <div>
            <label className="block text-[#728078] font-bold uppercase mb-1">
              Default Editorial Desk Byline
            </label>
            <input
              type="text"
              value={settings.defaultAuthor}
              onChange={(e) => {
                const updated = { ...settings, defaultAuthor: e.target.value };
                setSettings(updated);
                studioStorage.saveSettings(updated);
              }}
              className="w-full rounded-lg border border-[#DCE6DF] bg-[#F5F8F5] p-2.5 font-medium text-[#14231B] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[#728078] font-bold uppercase mb-1">
              WordPress Endpoint
            </label>
            <div className="rounded-lg border border-[#DCE6DF] bg-[#F5F8F5] p-2.5 font-mono text-[11px] text-[#14231B] truncate">
              https://www.19network.com
            </div>
          </div>
        </div>
      </div>

      {/* 4. Danger Zone: Reset Demo Workspace */}
      <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-6 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-rose-900">Reset Demo Workspace</h3>
          <p className="text-xs text-rose-700 mt-0.5">
            Clear all cached calendar drafts, saved stories, and restore baseline sample metrics.
          </p>
        </div>
        <button
          onClick={() => setResetModalOpen(true)}
          className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700 transition-colors shrink-0"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset All Demo Data</span>
        </button>
      </div>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        title="Confirm Workspace Reset"
        subtitle="This will restore all default data and reset local storage."
        maxWidth="md"
      >
        <div className="space-y-4 text-xs">
          <p className="text-[#14231B]">
            Are you sure you want to reset the 19Network demo workspace? Your scheduled items, custom feeds, and saved stories will be restored to their factory demonstration state.
          </p>
          <div className="flex justify-end gap-2 pt-2 border-t border-[#DCE6DF]">
            <button
              onClick={() => setResetModalOpen(false)}
              className="rounded-lg border border-[#DCE6DF] px-3.5 py-1.5 text-xs text-[#728078]"
            >
              Cancel
            </button>
            <button
              onClick={handleResetData}
              className="rounded-lg bg-rose-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-rose-700"
            >
              Yes, Reset Everything
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
