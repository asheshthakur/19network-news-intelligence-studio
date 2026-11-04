"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Bell,
  Menu,
  Wifi,
  Sparkles,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Dubai",
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(now);
      setCurrentDate(`${formatted} GST`);
    };

    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/topic-radar?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-[#DCE6DF] bg-white/95 px-6 backdrop-blur-md">
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          className="rounded-lg p-2 text-[#728078] hover:bg-[#F5F8F5] lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative w-64 md:w-80 lg:w-96">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#728078]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search UAE & GCC news, trends, topics..."
            className="w-full rounded-lg border border-[#DCE6DF] bg-[#F5F8F5] py-2 pl-9 pr-4 text-xs font-medium text-[#14231B] placeholder-[#728078] transition-all focus:border-[#16834A] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#16834A]"
          />
        </form>
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        {/* Source connection indicator badge */}
        <div className="hidden sm:flex items-center gap-2 rounded-full border border-[#DCE6DF] bg-[#F5F8F5] px-3 py-1">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#16834A] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#16834A]" />
          </span>
          <span className="text-[11px] font-medium text-[#14231B]">
            RSS & GDELT Live
          </span>
        </div>

        {/* Dubai Live Date/Time */}
        <div className="hidden md:block text-right">
          <div className="text-xs font-semibold text-[#14231B]">{currentDate}</div>
          <div className="text-[10px] text-[#728078]">Dubai Editorial HQ</div>
        </div>

        <div className="h-6 w-[1px] bg-[#DCE6DF] hidden sm:block" />

        {/* Notification toggle */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            aria-label="Notifications"
            className="relative rounded-lg p-2 text-[#728078] transition-colors hover:bg-[#F5F8F5] hover:text-[#123B2B]"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#16834A]" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-[#DCE6DF] bg-white p-3 shadow-lg z-50">
              <div className="flex items-center justify-between border-b border-[#DCE6DF] pb-2">
                <span className="text-xs font-bold text-[#123B2B]">Newsroom Alerts</span>
                <span className="text-[10px] text-[#16834A] font-semibold">2 New</span>
              </div>
              <div className="divide-y divide-[#DCE6DF]/40 mt-1">
                <div className="py-2.5 text-xs">
                  <div className="font-semibold text-[#14231B]">UAE Central Bank Digital Dirham</div>
                  <div className="text-[11px] text-[#728078] mt-0.5">High editorial opportunity (Score 95). Brief suggested.</div>
                </div>
                <div className="py-2.5 text-xs">
                  <div className="font-semibold text-[#14231B]">Upcoming Post Scheduled</div>
                  <div className="text-[11px] text-[#728078] mt-0.5">LinkedIn briefing queued for 11:00 AM GST.</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Link to 19Network reference */}
        <a
          href="https://www.19network.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden lg:flex items-center gap-1.5 rounded-lg border border-[#DCE6DF] bg-white px-3 py-1.5 text-xs font-medium text-[#123B2B] hover:bg-[#F5F8F5] transition-colors"
        >
          <span>19network.com</span>
          <ExternalLink className="h-3 w-3 text-[#728078]" />
        </a>

        {/* Profile Avatar / Desk */}
        <div className="flex items-center gap-2 pl-1">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#123B2B] text-xs font-bold text-white shadow-sm">
            ED
          </div>
          <div className="hidden xl:block text-left text-xs">
            <div className="font-semibold text-[#14231B]">Editorial Desk</div>
            <div className="text-[10px] text-[#728078]">UAE Lead Editor</div>
          </div>
        </div>
      </div>
    </header>
  );
}
