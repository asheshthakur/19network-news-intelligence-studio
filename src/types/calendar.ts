import { GeoCategory, NewsCategory } from "./news";

export type ContentStatus =
  | "Idea"
  | "Draft"
  | "In Review"
  | "Approved"
  | "Scheduled"
  | "Published"
  | "Rejected";

export type PublishingPlatform =
  | "Website"
  | "Instagram"
  | "LinkedIn"
  | "X"
  | "Facebook"
  | "TikTok";

export interface CalendarItem {
  id: string;
  title: string;
  platform: PublishingPlatform;
  category: NewsCategory;
  targetMarket: GeoCategory;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // HH:mm in Asia/Dubai
  contentDraft: string;
  status: ContentStatus;
  assignedOwner: string;
  linkedStoryId?: string;
  linkedStoryTitle?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WeeklyPlannerTarget {
  platform: PublishingPlatform;
  targetPerWeek: number;
  currentScheduled: number;
}
