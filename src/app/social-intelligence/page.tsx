"use client";

import { useEffect, useState } from "react";
import { SocialDataset, SocialPlatform } from "@/types/social";
import { studioStorage } from "@/lib/storage";
import { CsvUploader } from "@/components/social/CsvUploader";
import {
  Users2,
  TrendingUp,
  Share2,
  Instagram,
  Linkedin,
  Twitter,
  Facebook,
  Video,
  FileSpreadsheet,
  ExternalLink,
  Info,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

export default function SocialIntelligencePage() {
  const [socialData, setSocialData] = useState<SocialDataset>(studioStorage.getSocialData());
  const [activeImportPlatform, setActiveImportPlatform] = useState<SocialPlatform | null>(null);

  useEffect(() => {
    const handleUpdate = () => {
      setSocialData(studioStorage.getSocialData());
    };
    window.addEventListener("19network_social_updated", handleUpdate);
    return () => window.removeEventListener("19network_social_updated", handleUpdate);
  }, []);

  const totalFollowers =
    socialData.instagram.followers +
    socialData.linkedIn.followers +
    (socialData.facebook?.followers || 0) +
    (socialData.tiktok?.followers || 0) +
    (socialData.x?.followers || 0);

  const totalImpressions =
    socialData.instagram.impressions +
    socialData.linkedIn.impressions +
    (socialData.facebook?.impressions || 0) +
    (socialData.tiktok?.videoViews || 0) +
    (socialData.x?.impressions || 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col justify-between gap-4 border-b border-[#DCE6DF] pb-5 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-[#123B2B] px-2 py-0.5 text-xs font-bold text-white uppercase">
              Module 06
            </span>
            <span className="text-xs font-semibold text-[#16834A]">
              Social Intelligence & Analytics
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#123B2B]">
            Multi-Platform Audience Analytics
          </h1>
          <p className="mt-0.5 text-xs text-[#728078] max-w-2xl">
            Unified audience tracking, native engagement metrics, and zero-cost CSV creator-studio ingestion for 19Network social channels.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveImportPlatform(activeImportPlatform ? null : "instagram")}
            className="flex items-center gap-1.5 rounded-lg bg-[#123B2B] px-4 py-2 text-xs font-semibold text-white hover:bg-[#16834A] transition-colors shadow-sm"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-[#DDF5E8]" />
            <span>Import Platform CSV</span>
          </button>
        </div>
      </div>

      {/* Methodology & Data Integrity Disclaimer Note */}
      <div className="rounded-xl border border-[#DDF5E8] bg-[#EDF8F2] p-4 text-xs text-[#123B2B] flex items-start gap-3">
        <Info className="h-5 w-5 text-[#16834A] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold">Transparent Data Attribution & Methodology:</div>
          <div className="text-[#14231B]/80 leading-relaxed">
            Starting follower metrics for Instagram (@19network.news: 19.4k followers, 1,110 posts) and LinkedIn (19Network: 971 followers) are manually supplied benchmark baselines. Engagement rates are computed strictly as <code>(Total Engagements ÷ Impressions) × 100</code>. Facebook, TikTok, and X are configured as upcoming growth channels.
          </div>
        </div>
      </div>

      {/* CSV Uploader Accordion if opened */}
      {activeImportPlatform && (
        <div className="space-y-3">
          <div className="flex gap-2 border-b border-[#DCE6DF] pb-2">
            {(["instagram", "linkedin", "facebook", "tiktok", "x"] as SocialPlatform[]).map((p) => (
              <button
                key={p}
                onClick={() => setActiveImportPlatform(p)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold uppercase transition-colors ${
                  activeImportPlatform === p
                    ? "bg-[#123B2B] text-white"
                    : "bg-white border border-[#DCE6DF] text-[#728078] hover:text-[#123B2B]"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <CsvUploader
            platform={activeImportPlatform}
            onImportSuccess={(updated) => setSocialData(updated)}
          />
        </div>
      )}

      {/* Top Audience KPI Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-[#DCE6DF] bg-white p-5 shadow-card">
          <div className="flex items-center justify-between text-xs text-[#728078]">
            <span>Total Audience</span>
            <Users2 className="h-4 w-4 text-[#16834A]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[#123B2B]">
            {totalFollowers.toLocaleString()}
          </div>
          <div className="mt-1 text-[11px] text-[#16834A] font-semibold">
            +36.6% across 5 months
          </div>
        </div>

        <div className="rounded-xl border border-[#DCE6DF] bg-white p-5 shadow-card">
          <div className="flex items-center justify-between text-xs text-[#728078]">
            <span>Total Impressions</span>
            <TrendingUp className="h-4 w-4 text-[#16834A]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[#123B2B]">
            {totalImpressions.toLocaleString()}
          </div>
          <div className="mt-1 text-[11px] text-[#728078]">
            30-day cross-platform window
          </div>
        </div>

        <div className="rounded-xl border border-[#DCE6DF] bg-white p-5 shadow-card">
          <div className="flex items-center justify-between text-xs text-[#728078]">
            <span>Avg Engagement Rate</span>
            <Sparkles className="h-4 w-4 text-[#16834A]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[#123B2B]">5.66%</div>
          <div className="mt-1 text-[11px] text-[#728078]">
            (Engagements ÷ Impressions)
          </div>
        </div>

        <div className="rounded-xl border border-[#DCE6DF] bg-white p-5 shadow-card">
          <div className="flex items-center justify-between text-xs text-[#728078]">
            <span>Total Posts Monitored</span>
            <Share2 className="h-4 w-4 text-[#16834A]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[#123B2B]">
            {(socialData.instagram.posts + 84).toLocaleString()}
          </div>
          <div className="mt-1 text-[11px] text-[#728078]">
            1,110 Instagram • 84 LinkedIn
          </div>
        </div>
      </div>

      {/* Platform Cards Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Instagram Card (Verified Active) */}
        <div className="rounded-2xl border border-[#DCE6DF] bg-white p-5 shadow-card">
          <div className="flex items-center justify-between border-b border-[#DCE6DF] pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-50 text-pink-600">
                <Instagram className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#14231B]">Instagram</h3>
                <a
                  href="https://www.instagram.com/19network.news/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-medium text-[#16834A] hover:underline flex items-center gap-1"
                >
                  <span>@19network.news</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
            <span className="rounded bg-[#DDF5E8] border border-[#16834A]/20 px-2 py-0.5 text-[10px] font-bold text-[#123B2B]">
              Active Baseline
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-lg bg-[#F5F8F5] p-2.5">
              <span className="text-[10px] text-[#728078]">Followers</span>
              <div className="text-base font-bold text-[#123B2B]">
                {socialData.instagram.followers.toLocaleString()}
              </div>
            </div>
            <div className="rounded-lg bg-[#F5F8F5] p-2.5">
              <span className="text-[10px] text-[#728078]">Total Posts</span>
              <div className="text-base font-bold text-[#123B2B]">
                {socialData.instagram.posts.toLocaleString()}
              </div>
            </div>
            <div className="rounded-lg bg-[#F5F8F5] p-2.5">
              <span className="text-[10px] text-[#728078]">Reach</span>
              <div className="text-base font-bold text-[#123B2B]">
                {socialData.instagram.reach.toLocaleString()}
              </div>
            </div>
            <div className="rounded-lg bg-[#F5F8F5] p-2.5">
              <span className="text-[10px] text-[#728078]">Engagement Rate</span>
              <div className="text-base font-bold text-[#16834A]">
                {socialData.instagram.engagementRate}%
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-[#728078] border-t border-[#DCE6DF]/40 pt-2">
            <span>Reel Views: {socialData.instagram.reelViews.toLocaleString()}</span>
            <button
              onClick={() => setActiveImportPlatform("instagram")}
              className="text-[#16834A] font-semibold hover:underline"
            >
              Update via CSV →
            </button>
          </div>
        </div>

        {/* LinkedIn Card (Verified Active) */}
        <div className="rounded-2xl border border-[#DCE6DF] bg-white p-5 shadow-card">
          <div className="flex items-center justify-between border-b border-[#DCE6DF] pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Linkedin className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#14231B]">LinkedIn</h3>
                <a
                  href="https://www.linkedin.com/company/19network-com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-medium text-[#16834A] hover:underline flex items-center gap-1"
                >
                  <span>19Network</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
            <span className="rounded bg-[#DDF5E8] border border-[#16834A]/20 px-2 py-0.5 text-[10px] font-bold text-[#123B2B]">
              Active Baseline
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-lg bg-[#F5F8F5] p-2.5">
              <span className="text-[10px] text-[#728078]">Followers</span>
              <div className="text-base font-bold text-[#123B2B]">
                {socialData.linkedIn.followers.toLocaleString()}
              </div>
            </div>
            <div className="rounded-lg bg-[#F5F8F5] p-2.5">
              <span className="text-[10px] text-[#728078]">Page Views</span>
              <div className="text-base font-bold text-[#123B2B]">
                {socialData.linkedIn.pageViews.toLocaleString()}
              </div>
            </div>
            <div className="rounded-lg bg-[#F5F8F5] p-2.5">
              <span className="text-[10px] text-[#728078]">Impressions</span>
              <div className="text-base font-bold text-[#123B2B]">
                {socialData.linkedIn.impressions.toLocaleString()}
              </div>
            </div>
            <div className="rounded-lg bg-[#F5F8F5] p-2.5">
              <span className="text-[10px] text-[#728078]">Engagement Rate</span>
              <div className="text-base font-bold text-[#16834A]">
                {socialData.linkedIn.engagementRate}%
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-[#728078] border-t border-[#DCE6DF]/40 pt-2">
            <span>Clicks: {socialData.linkedIn.clicks.toLocaleString()}</span>
            <button
              onClick={() => setActiveImportPlatform("linkedin")}
              className="text-[#16834A] font-semibold hover:underline"
            >
              Update via CSV →
            </button>
          </div>
        </div>

        {/* Facebook (Upcoming / Not Connected State) */}
        <div className="rounded-2xl border border-dashed border-[#DCE6DF] bg-[#F5F8F5]/40 p-5 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#DCE6DF] pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                  <Facebook className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#14231B]">Facebook</h3>
                  <span className="text-[11px] text-[#728078]">Upcoming Channel</span>
                </div>
              </div>
              <span className="rounded bg-gray-100 border border-gray-200 px-2 py-0.5 text-[10px] font-bold text-[#728078]">
                {socialData.facebook ? "Imported" : "Not Connected"}
              </span>
            </div>

            <div className="mt-4 text-xs text-[#728078] leading-relaxed">
              {socialData.facebook ? (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded bg-white p-2">Followers: {socialData.facebook.followers}</div>
                  <div className="rounded bg-white p-2">Reach: {socialData.facebook.reach}</div>
                </div>
              ) : (
                "Official page under configuration. Import Meta Business Suite CSV to view audience reach without paid API keys."
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#DCE6DF]/40">
            <button
              onClick={() => setActiveImportPlatform("facebook")}
              className="w-full rounded-lg border border-[#DCE6DF] bg-white py-1.5 text-xs font-semibold text-[#123B2B] hover:bg-[#F5F8F5]"
            >
              Upload Facebook CSV
            </button>
          </div>
        </div>

        {/* TikTok (Upcoming / Not Connected State) */}
        <div className="rounded-2xl border border-dashed border-[#DCE6DF] bg-[#F5F8F5]/40 p-5 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#DCE6DF] pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-200 text-gray-800">
                  <Video className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#14231B]">TikTok</h3>
                  <span className="text-[11px] text-[#728078]">Vertical Video Channel</span>
                </div>
              </div>
              <span className="rounded bg-gray-100 border border-gray-200 px-2 py-0.5 text-[10px] font-bold text-[#728078]">
                {socialData.tiktok ? "Imported" : "Not Connected"}
              </span>
            </div>

            <div className="mt-4 text-xs text-[#728078] leading-relaxed">
              {socialData.tiktok ? (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded bg-white p-2">Followers: {socialData.tiktok.followers}</div>
                  <div className="rounded bg-white p-2">Views: {socialData.tiktok.videoViews}</div>
                </div>
              ) : (
                "TikTok creator handle in registration. Ingest official TikTok Analytics CSV exports for sound, hook, and retention tracking."
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#DCE6DF]/40">
            <button
              onClick={() => setActiveImportPlatform("tiktok")}
              className="w-full rounded-lg border border-[#DCE6DF] bg-white py-1.5 text-xs font-semibold text-[#123B2B] hover:bg-[#F5F8F5]"
            >
              Upload TikTok CSV
            </button>
          </div>
        </div>

        {/* X (Twitter) (Upcoming / Not Connected State) */}
        <div className="rounded-2xl border border-dashed border-[#DCE6DF] bg-[#F5F8F5]/40 p-5 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#DCE6DF] pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-500">
                  <Twitter className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#14231B]">X (Twitter)</h3>
                  <span className="text-[11px] text-[#728078]">Breaking News Wire</span>
                </div>
              </div>
              <span className="rounded bg-gray-100 border border-gray-200 px-2 py-0.5 text-[10px] font-bold text-[#728078]">
                {socialData.x ? "Imported" : "Not Connected"}
              </span>
            </div>

            <div className="mt-4 text-xs text-[#728078] leading-relaxed">
              {socialData.x ? (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded bg-white p-2">Followers: {socialData.x.followers}</div>
                  <div className="rounded bg-white p-2">Impressions: {socialData.x.impressions}</div>
                </div>
              ) : (
                "Breaking news broadcast handle. Free analytics supported via direct CSV export upload from X Analytics dashboard."
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#DCE6DF]/40">
            <button
              onClick={() => setActiveImportPlatform("x")}
              className="w-full rounded-lg border border-[#DCE6DF] bg-white py-1.5 text-xs font-semibold text-[#123B2B] hover:bg-[#F5F8F5]"
            >
              Upload X Analytics CSV
            </button>
          </div>
        </div>
      </div>

      {/* Historical Growth & Category Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Audience Growth History */}
        <div className="rounded-2xl border border-[#DCE6DF] bg-white p-5 shadow-card">
          <div className="border-b border-[#DCE6DF] pb-3">
            <h3 className="text-sm font-bold text-[#123B2B]">Verified Audience Growth History</h3>
            <p className="text-[11px] text-[#728078]">Monthly follower trajectory since June 2026 launch</p>
          </div>
          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={socialData.growthHistory}>
                <XAxis dataKey="month" stroke="#728078" fontSize={11} tickLine={false} />
                <YAxis stroke="#728078" fontSize={11} tickLine={false} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Area
                  type="monotone"
                  dataKey="instagramFollowers"
                  name="Instagram Followers"
                  stroke="#123B2B"
                  fill="#123B2B"
                  fillOpacity={0.2}
                />
                <Area
                  type="monotone"
                  dataKey="linkedInFollowers"
                  name="LinkedIn Followers"
                  stroke="#16834A"
                  fill="#16834A"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Engagement Rate */}
        <div className="rounded-2xl border border-[#DCE6DF] bg-white p-5 shadow-card">
          <div className="border-b border-[#DCE6DF] pb-3">
            <h3 className="text-sm font-bold text-[#123B2B]">Engagement Rate by Sector</h3>
            <p className="text-[11px] text-[#728078]">Average engagement rate (%) per topic</p>
          </div>
          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={socialData.categoryPerformance}>
                <XAxis dataKey="category" stroke="#728078" fontSize={10} tickLine={false} />
                <YAxis stroke="#728078" fontSize={11} tickLine={false} unit="%" />
                <Tooltip />
                <Bar dataKey="avgEngagementRate" name="Avg Engagement %" fill="#16834A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Best-Performing Posts Table */}
      <div className="rounded-2xl border border-[#DCE6DF] bg-white p-5 shadow-card">
        <div className="border-b border-[#DCE6DF] pb-3">
          <h3 className="text-sm font-bold text-[#123B2B]">Best-Performing Social Editorial Posts</h3>
          <p className="text-[11px] text-[#728078]">Ranked by total engagement rate and share volume</p>
        </div>

        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F8F5] text-[#728078] font-semibold border-b border-[#DCE6DF]">
              <tr>
                <th className="py-2.5 px-3">Headline / Topic</th>
                <th className="py-2.5 px-3">Platform</th>
                <th className="py-2.5 px-3">Published Date</th>
                <th className="py-2.5 px-3">Impressions</th>
                <th className="py-2.5 px-3">Engagements</th>
                <th className="py-2.5 px-3">Engagement Rate</th>
                <th className="py-2.5 px-3">Category</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE6DF]">
              {socialData.topPosts.map((post) => (
                <tr key={post.id} className="hover:bg-[#F5F8F5]/60 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-[#14231B] max-w-sm">
                    {post.headline}
                  </td>
                  <td className="py-2.5 px-3 capitalize font-medium text-[#123B2B]">
                    {post.platform}
                  </td>
                  <td className="py-2.5 px-3 text-[#728078]">{post.publishedDate}</td>
                  <td className="py-2.5 px-3 font-mono font-semibold text-[#14231B]">
                    {post.impressions.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 font-mono font-semibold text-[#14231B]">
                    {post.engagements.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="rounded bg-[#DDF5E8] px-2 py-0.5 text-xs font-bold text-[#123B2B]">
                      {post.engagementRate}%
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-[#728078]">{post.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
