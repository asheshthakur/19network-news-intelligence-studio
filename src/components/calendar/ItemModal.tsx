"use client";

import { useState, useEffect } from "react";
import { CalendarItem, ContentStatus, PublishingPlatform } from "@/types/calendar";
import { GeoCategory, NewsCategory } from "@/types/news";
import { Modal } from "../common/Modal";
import { Trash2 } from "lucide-react";

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: CalendarItem) => void;
  onDelete?: (id: string) => void;
  initialItem?: Partial<CalendarItem> | null;
}

const PLATFORMS: PublishingPlatform[] = [
  "Website",
  "Instagram",
  "LinkedIn",
  "X",
  "Facebook",
  "TikTok",
];

const STATUSES: ContentStatus[] = [
  "Idea",
  "Draft",
  "In Review",
  "Approved",
  "Scheduled",
  "Published",
  "Rejected",
];

const CATEGORIES: NewsCategory[] = [
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

const MARKETS: GeoCategory[] = [
  "UAE",
  "Saudi Arabia",
  "Qatar",
  "Kuwait",
  "Bahrain",
  "Oman",
  "GCC-wide",
  "Global",
];

export function ItemModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialItem,
}: ItemModalProps) {
  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState<PublishingPlatform>("Website");
  const [category, setCategory] = useState<NewsCategory>("Business");
  const [targetMarket, setTargetMarket] = useState<GeoCategory>("UAE");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("09:30");
  const [contentDraft, setContentDraft] = useState("");
  const [status, setStatus] = useState<ContentStatus>("Draft");
  const [assignedOwner, setAssignedOwner] = useState("Editorial Desk");
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    if (initialItem) {
      setTitle(initialItem.title || "");
      setPlatform(initialItem.platform || "Website");
      setCategory(initialItem.category || "Business");
      setTargetMarket(initialItem.targetMarket || "UAE");
      setScheduledDate(initialItem.scheduledDate || new Date().toISOString().split("T")[0]);
      setScheduledTime(initialItem.scheduledTime || "09:30");
      setContentDraft(initialItem.contentDraft || "");
      setStatus(initialItem.status || "Draft");
      setAssignedOwner(initialItem.assignedOwner || "Editorial Desk");
    } else {
      setTitle("");
      setPlatform("Website");
      setCategory("Business");
      setTargetMarket("UAE");
      setScheduledDate(new Date().toISOString().split("T")[0]);
      setScheduledTime("09:30");
      setContentDraft("");
      setStatus("Draft");
      setAssignedOwner("Editorial Desk");
    }
    setShowConfirmDelete(false);
  }, [initialItem, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const saved: CalendarItem = {
      id: initialItem?.id || `cal-${Date.now()}`,
      title: title.trim(),
      platform,
      category,
      targetMarket,
      scheduledDate,
      scheduledTime,
      contentDraft,
      status,
      assignedOwner,
      createdAt: initialItem?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      linkedStoryId: initialItem?.linkedStoryId,
      linkedStoryTitle: initialItem?.linkedStoryTitle,
    };

    onSave(saved);
    onClose();
  };

  const handleDelete = () => {
    if (initialItem?.id && onDelete) {
      onDelete(initialItem.id);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialItem?.id ? "Edit Editorial Calendar Item" : "Create Calendar Item"}
      subtitle="Scheduled in Asia/Dubai (GST) timezone"
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#728078] mb-1">
            Content Title / Headline *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Dubai AI Campus Growth Analysis"
            className="w-full rounded-lg border border-[#DCE6DF] bg-[#F5F8F5] p-2.5 text-xs font-medium text-[#14231B] focus:border-[#16834A] focus:bg-white focus:outline-none"
          />
        </div>

        {/* Platform & Status */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#728078] mb-1">
              Platform
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as PublishingPlatform)}
              className="w-full rounded-lg border border-[#DCE6DF] bg-[#F5F8F5] p-2 text-xs font-medium text-[#14231B] focus:border-[#16834A] focus:outline-none"
            >
              {PLATFORMS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#728078] mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ContentStatus)}
              className="w-full rounded-lg border border-[#DCE6DF] bg-[#F5F8F5] p-2 text-xs font-medium text-[#14231B] focus:border-[#16834A] focus:outline-none"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category & Target Market */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#728078] mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as NewsCategory)}
              className="w-full rounded-lg border border-[#DCE6DF] bg-[#F5F8F5] p-2 text-xs font-medium text-[#14231B] focus:border-[#16834A] focus:outline-none"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#728078] mb-1">
              Target Market
            </label>
            <select
              value={targetMarket}
              onChange={(e) => setTargetMarket(e.target.value as GeoCategory)}
              className="w-full rounded-lg border border-[#DCE6DF] bg-[#F5F8F5] p-2 text-xs font-medium text-[#14231B] focus:border-[#16834A] focus:outline-none"
            >
              {MARKETS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date, Time & Owner */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#728078] mb-1">
              Date (GST)
            </label>
            <input
              type="date"
              required
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full rounded-lg border border-[#DCE6DF] bg-[#F5F8F5] p-2 text-xs font-medium text-[#14231B] focus:border-[#16834A] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#728078] mb-1">
              Time (GST)
            </label>
            <input
              type="time"
              required
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="w-full rounded-lg border border-[#DCE6DF] bg-[#F5F8F5] p-2 text-xs font-medium text-[#14231B] focus:border-[#16834A] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#728078] mb-1">
              Assigned Editor
            </label>
            <input
              type="text"
              value={assignedOwner}
              onChange={(e) => setAssignedOwner(e.target.value)}
              placeholder="e.g. Sarah K."
              className="w-full rounded-lg border border-[#DCE6DF] bg-[#F5F8F5] p-2 text-xs font-medium text-[#14231B] focus:border-[#16834A] focus:outline-none"
            />
          </div>
        </div>

        {/* Content Draft / Copy */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#728078] mb-1">
            Content Draft / Caption / Copy Notes
          </label>
          <textarea
            rows={4}
            value={contentDraft}
            onChange={(e) => setContentDraft(e.target.value)}
            placeholder="Draft copy, carousel slides, script outline, or key hashtags..."
            className="w-full rounded-lg border border-[#DCE6DF] bg-[#F5F8F5] p-2.5 text-xs font-medium text-[#14231B] focus:border-[#16834A] focus:bg-white focus:outline-none"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between border-t border-[#DCE6DF] pt-4">
          <div>
            {initialItem?.id && onDelete && (
              <>
                {!showConfirmDelete ? (
                  <button
                    type="button"
                    onClick={() => setShowConfirmDelete(true)}
                    className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-rose-600 font-medium">Confirm?</span>
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="rounded bg-rose-600 px-2 py-1 text-xs font-bold text-white hover:bg-rose-700"
                    >
                      Yes, delete
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowConfirmDelete(false)}
                      className="rounded border border-[#DCE6DF] px-2 py-1 text-xs text-[#728078]"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#DCE6DF] px-4 py-2 text-xs font-semibold text-[#728078] hover:bg-[#F5F8F5]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#123B2B] px-5 py-2 text-xs font-semibold text-white hover:bg-[#16834A] transition-colors"
            >
              Save Calendar Entry
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
