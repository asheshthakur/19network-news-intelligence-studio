"use client";

import { useEffect, useState, useMemo } from "react";
import { CalendarItem, ContentStatus, PublishingPlatform } from "@/types/calendar";
import { GeoCategory } from "@/types/news";
import { studioStorage } from "@/lib/storage";
import { exportCalendarToCsv, exportCalendarToIcs } from "@/lib/export-utils";
import { ItemModal } from "@/components/calendar/ItemModal";
import {
  CalendarDays,
  Plus,
  Download,
  Filter,
  Search,
  Copy,
  Trash2,
  Edit2,
  Clock,
  ArrowUpDown,
  CheckCircle,
  AlertCircle,
  FileText,
  Calendar,
  Layers,
} from "lucide-react";

const PLATFORMS: Array<PublishingPlatform | "All"> = [
  "All",
  "Website",
  "Instagram",
  "LinkedIn",
  "X",
  "Facebook",
  "TikTok",
];

const STATUSES: Array<ContentStatus | "All"> = [
  "All",
  "Idea",
  "Draft",
  "In Review",
  "Approved",
  "Scheduled",
  "Published",
  "Rejected",
];

export default function EditorialCalendarPage() {
  const [items, setItems] = useState<CalendarItem[]>([]);
  const [viewMode, setViewMode] = useState<"month" | "week" | "list">("list");

  // Filters
  const [search, setSearch] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState<PublishingPlatform | "All">("All");
  const [selectedStatus, setSelectedStatus] = useState<ContentStatus | "All">("All");

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<CalendarItem> | null>(null);

  useEffect(() => {
    setItems(studioStorage.getCalendarItems());

    const handleUpdate = () => {
      setItems(studioStorage.getCalendarItems());
    };
    window.addEventListener("19network_calendar_updated", handleUpdate);
    return () => window.removeEventListener("19network_calendar_updated", handleUpdate);
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((it) => {
      if (selectedPlatform !== "All" && it.platform !== selectedPlatform) return false;
      if (selectedStatus !== "All" && it.status !== selectedStatus) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          it.title.toLowerCase().includes(q) ||
          it.assignedOwner.toLowerCase().includes(q) ||
          it.category.toLowerCase().includes(q) ||
          it.targetMarket.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [items, selectedPlatform, selectedStatus, search]);

  const handleCreateNew = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const handleEdit = (item: CalendarItem) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleDuplicate = (item: CalendarItem) => {
    const dup: CalendarItem = {
      ...item,
      id: `cal-${Date.now()}`,
      title: `${item.title} (Copy)`,
      status: "Draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    studioStorage.addCalendarItem(dup);
  };

  const handleDelete = (id: string) => {
    studioStorage.deleteCalendarItem(id);
  };

  const handleSaveItem = (item: CalendarItem) => {
    if (editingItem?.id) {
      studioStorage.updateCalendarItem(item);
    } else {
      studioStorage.addCalendarItem(item);
    }
  };

  const handleQuickStatusChange = (id: string, newStatus: ContentStatus) => {
    const it = items.find((x) => x.id === id);
    if (it) {
      studioStorage.updateCalendarItem({ ...it, status: newStatus, updatedAt: new Date().toISOString() });
    }
  };

  // Weekly Planner targets
  const platformCounts: Record<PublishingPlatform, number> = {
    Website: items.filter((i) => i.platform === "Website").length,
    Instagram: items.filter((i) => i.platform === "Instagram").length,
    LinkedIn: items.filter((i) => i.platform === "LinkedIn").length,
    X: items.filter((i) => i.platform === "X").length,
    Facebook: items.filter((i) => i.platform === "Facebook").length,
    TikTok: items.filter((i) => i.platform === "TikTok").length,
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions Banner */}
      <div className="flex flex-col justify-between gap-4 border-b border-[#DCE6DF] pb-5 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-[#123B2B] px-2 py-0.5 text-xs font-bold text-white uppercase">
              Module 05
            </span>
            <span className="text-xs font-semibold text-[#16834A]">
              Editorial Content Calendar
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#123B2B]">
            Publishing Schedule & Governance
          </h1>
          <p className="mt-0.5 text-xs text-[#728078] max-w-2xl">
            Coordinated omnichannel editorial scheduling across Website, Instagram, LinkedIn, X, Facebook, and TikTok in UAE/Gulf Standard Time (Asia/Dubai).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => exportCalendarToCsv(items)}
            className="flex items-center gap-1.5 rounded-lg border border-[#DCE6DF] bg-white px-3 py-2 text-xs font-semibold text-[#14231B] hover:bg-[#F5F8F5]"
          >
            <Download className="h-3.5 w-3.5 text-[#16834A]" />
            <span>CSV</span>
          </button>
          <button
            onClick={() => exportCalendarToIcs(items)}
            className="flex items-center gap-1.5 rounded-lg border border-[#DCE6DF] bg-white px-3 py-2 text-xs font-semibold text-[#14231B] hover:bg-[#F5F8F5]"
          >
            <Calendar className="h-3.5 w-3.5 text-[#16834A]" />
            <span>ICS File</span>
          </button>
          <button
            onClick={handleCreateNew}
            className="flex items-center gap-1.5 rounded-lg bg-[#123B2B] px-4 py-2 text-xs font-semibold text-white hover:bg-[#16834A] transition-colors shadow-sm"
          >
            <Plus className="h-3.5 w-3.5 text-[#DDF5E8]" />
            <span>Schedule Content</span>
          </button>
        </div>
      </div>

      {/* Weekly Planner Rhythm Bar */}
      <div className="rounded-2xl border border-[#DCE6DF] bg-white p-5 shadow-card">
        <div className="flex items-center justify-between border-b border-[#DCE6DF] pb-3 mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#123B2B]">
            Weekly Publishing Rhythm (Scheduled Targets)
          </span>
          <span className="text-[11px] text-[#728078]">
            Timezone: <strong className="text-[#123B2B]">Asia/Dubai (GST)</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-6">
          {(
            [
              { platform: "Website", target: 12, current: platformCounts.Website },
              { platform: "Instagram", target: 14, current: platformCounts.Instagram },
              { platform: "LinkedIn", target: 10, current: platformCounts.LinkedIn },
              { platform: "X", target: 20, current: platformCounts.X },
              { platform: "Facebook", target: 8, current: platformCounts.Facebook },
              { platform: "TikTok", target: 6, current: platformCounts.TikTok },
            ] as const
          ).map((item) => (
            <div
              key={item.platform}
              className="rounded-xl border border-[#DCE6DF] bg-[#F5F8F5]/40 p-3 text-center"
            >
              <div className="text-[11px] font-bold text-[#14231B]">{item.platform}</div>
              <div className="mt-1 text-lg font-bold text-[#123B2B]">
                {item.current} <span className="text-xs font-normal text-[#728078]">/ {item.target}</span>
              </div>
              <div className="mt-1 h-1.5 w-full rounded-full bg-[#DCE6DF] overflow-hidden">
                <div
                  className="h-full bg-[#16834A] rounded-full"
                  style={{ width: `${Math.min(100, (item.current / item.target) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter and View Mode Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#DCE6DF] bg-white p-4 shadow-card">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#728078]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search schedule..."
              className="w-full rounded-lg border border-[#DCE6DF] bg-[#F5F8F5] py-1.5 pl-8 pr-3 text-xs font-medium text-[#14231B] focus:border-[#16834A] focus:outline-none"
            />
          </div>

          {/* Platform Filter */}
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value as PublishingPlatform | "All")}
            className="rounded-lg border border-[#DCE6DF] bg-[#F5F8F5] p-1.5 text-xs font-medium text-[#14231B] focus:outline-none"
          >
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>
                Platform: {p}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as ContentStatus | "All")}
            className="rounded-lg border border-[#DCE6DF] bg-[#F5F8F5] p-1.5 text-xs font-medium text-[#14231B] focus:outline-none"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                Status: {s}
              </option>
            ))}
          </select>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 rounded-lg border border-[#DCE6DF] bg-[#F5F8F5] p-1 text-xs">
          <button
            onClick={() => setViewMode("list")}
            className={`rounded px-3 py-1 font-semibold transition-colors ${
              viewMode === "list" ? "bg-white text-[#123B2B] shadow-sm" : "text-[#728078]"
            }`}
          >
            List View
          </button>
          <button
            onClick={() => setViewMode("month")}
            className={`rounded px-3 py-1 font-semibold transition-colors ${
              viewMode === "month" ? "bg-white text-[#123B2B] shadow-sm" : "text-[#728078]"
            }`}
          >
            Calendar Grid
          </button>
        </div>
      </div>

      {/* Main View: List View */}
      {viewMode === "list" && (
        <div className="overflow-hidden rounded-2xl border border-[#DCE6DF] bg-white shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F8F5] text-[#728078] font-semibold border-b border-[#DCE6DF]">
                <tr>
                  <th className="py-3 px-4">Content Title</th>
                  <th className="py-3 px-4">Platform</th>
                  <th className="py-3 px-4">Category & Market</th>
                  <th className="py-3 px-4">Date & Time (GST)</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Assigned Owner</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCE6DF]">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-[#F5F8F5]/60 transition-colors">
                    <td className="py-3 px-4 font-semibold text-[#14231B] max-w-sm">
                      <div className="line-clamp-2">{item.title}</div>
                      {item.contentDraft && (
                        <div className="mt-0.5 text-[11px] text-[#728078] line-clamp-1">
                          {item.contentDraft}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="rounded bg-[#EDF8F2] border border-[#DDF5E8] px-2.5 py-1 text-xs font-bold text-[#123B2B]">
                        {item.platform}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-medium text-[#14231B]">{item.category}</div>
                      <div className="text-[11px] text-[#728078]">{item.targetMarket}</div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-mono text-xs font-semibold text-[#14231B]">
                        {item.scheduledDate}
                      </div>
                      <div className="text-[11px] text-[#728078] flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {item.scheduledTime} GST
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <select
                        value={item.status}
                        onChange={(e) => handleQuickStatusChange(item.id, e.target.value as ContentStatus)}
                        className={`rounded-full px-2.5 py-1 text-[11px] font-bold border focus:outline-none cursor-pointer ${
                          item.status === "Approved" || item.status === "Scheduled"
                            ? "bg-[#DDF5E8] text-[#123B2B] border-[#16834A]/30"
                            : item.status === "In Review"
                            ? "bg-blue-50 text-blue-800 border-blue-200"
                            : item.status === "Published"
                            ? "bg-[#123B2B] text-white border-transparent"
                            : "bg-gray-100 text-gray-700 border-gray-200"
                        }`}
                      >
                        {STATUSES.filter((s) => s !== "All").map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-[#728078]">
                      {item.assignedOwner}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleDuplicate(item)}
                          className="rounded p-1 text-[#728078] hover:bg-[#F5F8F5] hover:text-[#123B2B]"
                          title="Duplicate item"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleEdit(item)}
                          className="rounded p-1 text-[#728078] hover:bg-[#F5F8F5] hover:text-[#123B2B]"
                          title="Edit item"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="rounded p-1 text-rose-500 hover:bg-rose-50"
                          title="Delete item"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Grid View for Month / Week */}
      {viewMode === "month" && (
        <div className="rounded-2xl border border-[#DCE6DF] bg-white p-5 shadow-card space-y-4">
          <div className="text-xs font-bold text-[#123B2B] uppercase tracking-wider">
            Calendar Scheduling Matrix (November 2026)
          </div>
          <div className="grid grid-cols-7 gap-2 text-center text-xs">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="font-bold text-[#728078] py-1 border-b border-[#DCE6DF]">
                {day}
              </div>
            ))}
            {/* Days 1 to 7 */}
            {[1, 2, 3, 4, 5, 6, 7].map((d) => {
              const dayStr = `2026-11-0${d}`;
              const dayItems = items.filter((it) => it.scheduledDate === dayStr);
              return (
                <div
                  key={d}
                  className="min-h-[140px] rounded-lg border border-[#DCE6DF] bg-[#F5F8F5]/30 p-2 text-left flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#123B2B]">{d} Nov</span>
                    {dayItems.length > 0 && (
                      <span className="rounded bg-[#DDF5E8] px-1 text-[10px] font-bold text-[#16834A]">
                        {dayItems.length}
                      </span>
                    )}
                  </div>
                  <div className="space-y-1 mt-1 overflow-y-auto max-h-[100px]">
                    {dayItems.map((it) => (
                      <div
                        key={it.id}
                        onClick={() => handleEdit(it)}
                        className="rounded border border-[#DCE6DF] bg-white p-1 text-[10px] cursor-pointer hover:border-[#16834A] truncate"
                      >
                        <span className="font-bold text-[#16834A]">[{it.platform}]</span> {it.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Item Modal for creating / editing */}
      <ItemModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialItem={editingItem}
        onSave={handleSaveItem}
        onDelete={handleDelete}
      />
    </div>
  );
}
