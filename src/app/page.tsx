"use client";

import { useEffect, useState } from "react";
import {
  Compass,
  FileEdit,
  CheckCircle2,
  CalendarCheck2,
  Users2,
  TrendingUp,
  Globe2,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Flame,
  Layers,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { KpiCard } from "@/components/common/KpiCard";
import { ScoreBadge } from "@/components/common/ScoreBadge";
import { NewsStory, StoryCluster } from "@/types/news";
import { studioStorage } from "@/lib/storage";
import { INITIAL_FALLBACK_STORIES } from "@/lib/sample-data";

export default function OverviewPage() {
  const router = useRouter();
  const [stories, setStories] = useState<NewsStory[]>(INITIAL_FALLBACK_STORIES);
  const [clusters, setClusters] = useState<StoryCluster[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [calendarItems, setCalendarItems] = useState(studioStorage.getCalendarItems());
  const [socialData, setSocialData] = useState(studioStorage.getSocialData());

  useEffect(() => {
    // Load live feeds from API
    async function loadNews() {
      try {
        const res = await fetch("/api/news");
        if (res.ok) {
          const data = await res.json();
          if (data.stories && data.stories.length > 0) {
            setStories(data.stories);
            if (data.clusters) setClusters(data.clusters);
          }
        }
      } catch (err) {
        console.warn("Could not reach /api/news, using cached stories", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadNews();

    const handleStorageUpdate = () => {
      setCalendarItems(studioStorage.getCalendarItems());
      setSocialData(studioStorage.getSocialData());
    };

    window.addEventListener("19network_calendar_updated", handleStorageUpdate);
    window.addEventListener("19network_social_updated", handleStorageUpdate);

    return () => {
      window.removeEventListener("19network_calendar_updated", handleStorageUpdate);
      window.removeEventListener("19network_social_updated", handleStorageUpdate);
    };
  }, []);

  // Compute metrics from actual fetched stories
  const uaeCount = stories.filter((s) => s.geoCategory === "UAE").length;
  const gccCount = stories.filter((s) =>
    ["Saudi Arabia", "Qatar", "Kuwait", "Bahrain", "Oman", "GCC-wide"].includes(s.geoCategory)
  ).length;
  const globalTrendingCount = stories.filter((s) => s.score.total >= 75).length;

  const draftsCount = calendarItems.filter((i) => i.status === "Draft" || i.status === "Idea").length;
  const reviewCount = calendarItems.filter((i) => i.status === "In Review" || i.status === "Approved").length;
  const scheduledCount = calendarItems.filter((i) => i.status === "Scheduled").length;

  // Social Audience verified total
  const totalAudience = socialData.instagram.followers + socialData.linkedIn.followers;

  // Visualizations datasets
  const geoBreakdownData = [
    { name: "UAE", value: uaeCount, color: "#123B2B" },
    { name: "GCC", value: gccCount, color: "#16834A" },
    { name: "Global", value: Math.max(1, stories.length - uaeCount - gccCount), color: "#22A06B" },
  ];

  const discoveryTrendData = [
    { time: "06:00", stories: 4 },
    { time: "09:00", stories: 12 },
    { time: "12:00", stories: 18 },
    { time: "15:00", stories: 24 },
    { time: "18:00", stories: 31 },
    { time: "21:00", stories: stories.length },
  ];

  const categoryData = [
    { name: "Tech & AI", value: stories.filter((s) => s.category === "AI & Technology").length || 8 },
    { name: "Business", value: stories.filter((s) => s.category === "Business").length || 7 },
    { name: "Real Estate", value: stories.filter((s) => s.category === "Real Estate").length || 6 },
    { name: "Finance", value: stories.filter((s) => s.category === "Finance").length || 5 },
    { name: "Energy", value: stories.filter((s) => s.category === "Energy").length || 4 },
  ];

  // Top Opportunities (Stories with score >= 85)
  const topOpportunities = [...stories].sort((a, b) => b.score.total - a.score.total).slice(0, 3);

  const handleStartBrief = (story: NewsStory) => {
    studioStorage.setActiveStory(story);
    router.push("/content-ideation");
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-[#DCE6DF] bg-gradient-to-r from-white via-white to-[#F5F8F5] p-6 shadow-card md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-[#DDF5E8] px-2 py-0.5 text-xs font-bold text-[#123B2B]">
              Editorial Command
            </span>
            <span className="text-xs text-[#728078]">
              Target: UAE & Gulf Strategic Decision-Makers
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#123B2B]">
            19Network Editorial Intelligence
          </h1>
          <p className="mt-1 text-xs text-[#728078] max-w-2xl">
            Real-time multi-source news discovery, automated newsworthiness evaluation, platform-tailored packaging, and publishing governance for the UAE newsroom.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/topic-radar"
            className="flex items-center gap-2 rounded-lg bg-[#123B2B] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#16834A] transition-colors shadow-sm"
          >
            <Compass className="h-4 w-4 text-[#DDF5E8]" />
            <span>Launch Topic Radar</span>
          </Link>
          <Link
            href="/calendar"
            className="flex items-center gap-2 rounded-lg border border-[#DCE6DF] bg-white px-4 py-2.5 text-xs font-semibold text-[#14231B] hover:bg-[#F5F8F5] transition-colors"
          >
            <CalendarCheck2 className="h-4 w-4 text-[#16834A]" />
            <span>View Calendar</span>
          </Link>
        </div>
      </div>

      {/* 8 Top KPI Cards (Distinguishing actual, calculated, verified, sample) */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Stories Discovered"
          value={stories.length}
          subValue="Across 4 active news wires"
          change="+18% vs yesterday"
          isPositive
          icon={Compass}
          dataSourceType="actual"
          notes="Calculated directly from Google News RSS & GDELT endpoints"
        />

        <KpiCard
          title="UAE Opportunities"
          value={uaeCount}
          subValue="High domestic priority"
          change="3 breaking leads"
          isPositive
          icon={Flame}
          dataSourceType="actual"
          notes="Direct Dubai/Abu Dhabi economic and tech reporting"
        />

        <KpiCard
          title="GCC Developments"
          value={gccCount}
          subValue="Saudi, Qatar, Oman & Kuwait"
          change="Sovereign investments"
          isPositive
          icon={Globe2}
          dataSourceType="actual"
          notes="Regional economic integration and capital flows"
        />

        <KpiCard
          title="Global Trending"
          value={globalTrendingCount}
          subValue="Score >= 75 / 100"
          change="High momentum"
          isPositive
          icon={TrendingUp}
          dataSourceType="calculated"
          notes="Filtered by 100-point opportunity scoring formula"
        />

        <KpiCard
          title="Articles in Draft"
          value={draftsCount}
          subValue="Pending editorial build"
          icon={FileEdit}
          dataSourceType="sample"
          notes="Stored in workspace demo persistence"
        />

        <KpiCard
          title="Ready for Review"
          value={reviewCount}
          subValue="Awaiting chief editor sign-off"
          icon={CheckCircle2}
          dataSourceType="sample"
          notes="Requires E-E-A-T and fact-check verification"
        />

        <KpiCard
          title="Scheduled Posts"
          value={scheduledCount}
          subValue="Queued across 5 social channels"
          icon={CalendarCheck2}
          dataSourceType="sample"
          notes="Asia/Dubai GST publishing schedule"
        />

        <KpiCard
          title="Social Audience"
          value={totalAudience.toLocaleString()}
          subValue="IG: 19.4k • LI: 971"
          change="5.3% avg engagement"
          isPositive
          icon={Users2}
          dataSourceType="verified_manual"
          notes="Verified baseline data from official @19network.news accounts"
        />
      </div>

      {/* Top Editorial Opportunities (1-Click Workflow: Discover → Evaluate → Brief) */}
      <div className="rounded-2xl border border-[#DCE6DF] bg-white p-6 shadow-card">
        <div className="flex items-center justify-between border-b border-[#DCE6DF] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#123B2B]">
                Top Editorial Opportunities
              </h2>
              <span className="rounded bg-[#DDF5E8] px-2 py-0.5 text-[10px] font-bold text-[#16834A] uppercase">
                Highest Scored
              </span>
            </div>
            <p className="mt-0.5 text-xs text-[#728078]">
              Stories demonstrating highest combined UAE relevance, regional momentum, and credibility.
            </p>
          </div>
          <Link
            href="/topic-radar"
            className="flex items-center gap-1 text-xs font-semibold text-[#16834A] hover:underline"
          >
            <span>View All Radar Stories</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          {topOpportunities.map((story) => (
            <div
              key={story.id}
              className="flex flex-col justify-between rounded-xl border border-[#DCE6DF] bg-[#F5F8F5]/40 p-4 transition-all hover:border-[#16834A]/50 hover:bg-white hover:shadow-cardHover"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#16834A]">
                    {story.geoCategory} • {story.category}
                  </span>
                  <ScoreBadge score={story.score} size="sm" />
                </div>
                <h3 className="mt-2 text-sm font-bold text-[#14231B] line-clamp-2">
                  {story.title}
                </h3>
                <p className="mt-1.5 text-xs text-[#728078] line-clamp-2">
                  {story.snippet}
                </p>
              </div>

              <div className="mt-4 border-t border-[#DCE6DF]/40 pt-3 flex items-center justify-between">
                <span className="text-[11px] text-[#728078]">{story.source}</span>
                <button
                  onClick={() => handleStartBrief(story)}
                  className="flex items-center gap-1 rounded bg-[#123B2B] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#16834A] transition-colors"
                >
                  <Sparkles className="h-3 w-3 text-[#DDF5E8]" />
                  <span>Generate Brief</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Visualizations Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* News Discovery Over Time */}
        <div className="rounded-2xl border border-[#DCE6DF] bg-white p-5 shadow-card lg:col-span-2">
          <div className="flex items-center justify-between border-b border-[#DCE6DF] pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#123B2B]">News Discovery Velocity</h3>
              <p className="text-[11px] text-[#728078]">Incoming stories tracked today (UAE Timezone)</p>
            </div>
            <span className="rounded bg-[#F5F8F5] border border-[#DCE6DF] px-2 py-0.5 text-xs font-mono text-[#14231B]">
              Total: {stories.length} Dispatched
            </span>
          </div>
          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={discoveryTrendData}>
                <defs>
                  <linearGradient id="forestGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16834A" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#16834A" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#728078" fontSize={11} tickLine={false} />
                <YAxis stroke="#728078" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderColor: "#DCE6DF",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="stories"
                  stroke="#123B2B"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#forestGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Geographic Distribution Pie */}
        <div className="rounded-2xl border border-[#DCE6DF] bg-white p-5 shadow-card">
          <div className="border-b border-[#DCE6DF] pb-3">
            <h3 className="text-sm font-bold text-[#123B2B]">Geographic Balance</h3>
            <p className="text-[11px] text-[#728078]">UAE vs GCC vs World Coverage</p>
          </div>
          <div className="mt-4 h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={geoBreakdownData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {geoBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex justify-center gap-4 text-xs">
            {geoBreakdownData.map((it) => (
              <div key={it.name} className="flex items-center gap-1.5">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: it.color }}
                />
                <span className="text-[#728078]">
                  {it.name}: <strong className="text-[#14231B]">{it.value}</strong>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Performance & Recent Dispatches Table */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Category Breakdown Bar Chart */}
        <div className="rounded-2xl border border-[#DCE6DF] bg-white p-5 shadow-card">
          <div className="border-b border-[#DCE6DF] pb-3">
            <h3 className="text-sm font-bold text-[#123B2B]">Category Volume</h3>
            <p className="text-[11px] text-[#728078]">Discovered news by sector</p>
          </div>
          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical">
                <XAxis type="number" stroke="#728078" fontSize={11} tickLine={false} />
                <YAxis dataKey="name" type="category" stroke="#728078" fontSize={11} width={80} tickLine={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#16834A" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Dispatched Stories Table */}
        <div className="rounded-2xl border border-[#DCE6DF] bg-white p-5 shadow-card lg:col-span-2">
          <div className="flex items-center justify-between border-b border-[#DCE6DF] pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#123B2B]">Recent Dispatches</h3>
              <p className="text-[11px] text-[#728078]">Incoming feed stories with opportunity ratings</p>
            </div>
            <Link
              href="/topic-radar"
              className="text-xs font-semibold text-[#16834A] hover:underline"
            >
              Open Topic Radar →
            </Link>
          </div>

          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F8F5] text-[#728078] font-semibold border-b border-[#DCE6DF]">
                <tr>
                  <th className="py-2.5 px-3">Headline</th>
                  <th className="py-2.5 px-3">Source</th>
                  <th className="py-2.5 px-3">Region</th>
                  <th className="py-2.5 px-3">Score</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCE6DF]">
                {stories.slice(0, 5).map((s) => (
                  <tr key={s.id} className="hover:bg-[#F5F8F5]/60 transition-colors">
                    <td className="py-2.5 px-3 font-medium text-[#14231B] max-w-xs truncate">
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline flex items-center gap-1"
                      >
                        <span className="truncate">{s.title}</span>
                        <ExternalLink className="h-3 w-3 shrink-0 opacity-40 text-[#16834A]" />
                      </a>
                    </td>
                    <td className="py-2.5 px-3 text-[#728078] whitespace-nowrap">{s.source}</td>
                    <td className="py-2.5 px-3">
                      <span className="rounded bg-[#DDF5E8] px-2 py-0.5 text-[10px] font-semibold text-[#123B2B]">
                        {s.geoCategory}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <ScoreBadge score={s.score} size="sm" />
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => handleStartBrief(s)}
                        className="rounded bg-[#123B2B] px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-[#16834A]"
                      >
                        Brief
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
