"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Radar,
  Brain,
  Sparkles,
  CalendarDays,
  Share2,
  FileSearch,
  Globe2,
  FileBarChart2,
  Settings2,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { name: "Overview", href: "/", icon: LayoutDashboard },
  { name: "Topic Radar", href: "/topic-radar", icon: Radar, badge: "Live" },
  { name: "Story Intelligence", href: "/story-intelligence", icon: Brain },
  { name: "Content Ideation", href: "/content-ideation", icon: Sparkles },
  { name: "Editorial Calendar", href: "/calendar", icon: CalendarDays },
  { name: "Social Intelligence", href: "/social-intelligence", icon: Share2 },
  { name: "AI Compatibility", href: "/ai-compatibility", icon: FileSearch },
  { name: "Website Publishing", href: "/publishing", icon: Globe2 },
  { name: "Reports", href: "/reports", icon: FileBarChart2 },
  { name: "Settings", href: "/settings", icon: Settings2 },
];

export function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col border-r border-[#DCE6DF] bg-white transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header Branding */}
        <div className="flex h-20 items-center justify-between border-b border-[#DCE6DF] px-6">
          <Link href="/" className="flex flex-col group" onClick={onClose}>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#123B2B] text-xs font-bold text-white tracking-wider">
                19
              </span>
              <span className="font-bold tracking-tight text-lg text-[#123B2B]">
                19NETWORK
              </span>
            </div>
            <span className="text-[10px] font-semibold tracking-wider text-[#16834A] uppercase mt-0.5">
              News Intelligence Studio
            </span>
          </Link>
        </div>

        {/* Concept Disclaimer Pill */}
        <div className="mx-4 mt-3 rounded-md bg-[#EDF8F2] border border-[#DDF5E8] p-2.5 flex items-start gap-2">
          <ShieldAlert className="h-4 w-4 text-[#16834A] shrink-0 mt-0.5" />
          <div className="text-[11px] leading-snug text-[#14231B]/80 font-medium">
            <span className="font-semibold text-[#123B2B]">Editorial Concept Demo:</span> Independent newsroom prototype for UAE digital journalism.
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#728078]">
            Core Workflows
          </div>
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`group flex items-center justify-between rounded-lg px-3.5 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#123B2B] text-white shadow-sm"
                    : "text-[#14231B] hover:bg-[#F5F8F5] hover:text-[#123B2B]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4 w-4 transition-colors ${
                      isActive ? "text-[#DDF5E8]" : "text-[#728078] group-hover:text-[#16834A]"
                    }`}
                  />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      isActive
                        ? "bg-[#16834A] text-white"
                        : "bg-[#DDF5E8] text-[#123B2B]"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Footer info: UAE Time & System status */}
        <div className="border-t border-[#DCE6DF] p-4 bg-[#F5F8F5]/60">
          <div className="flex items-center justify-between text-xs text-[#728078]">
            <span>Timezone</span>
            <span className="font-semibold text-[#123B2B]">Asia/Dubai (GST)</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#16834A] animate-pulse" />
            <span className="text-[11px] text-[#728078]">
              Multi-source adapters active
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
