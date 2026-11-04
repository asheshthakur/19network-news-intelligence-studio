import { NewsStory } from "@/types/news";
import { CalendarItem } from "@/types/calendar";
import { CompleteIdeationBrief } from "@/types/editorial";
import { SocialDataset } from "@/types/social";
import { StudioSettings } from "@/types/settings";
import {
  INITIAL_CALENDAR_ITEMS,
  INITIAL_FALLBACK_STORIES,
  INITIAL_SETTINGS,
  INITIAL_SOCIAL_DATA,
} from "./sample-data";

const KEYS = {
  SETTINGS: "19network_studio_settings_v1",
  SAVED_STORIES: "19network_saved_stories_v1",
  CALENDAR_ITEMS: "19network_calendar_items_v1",
  IDEATION_BRIEFS: "19network_ideation_briefs_v1",
  SOCIAL_DATA: "19network_social_dataset_v1",
  ACTIVE_STORY_ID: "19network_active_story_id_v1",
  ACTIVE_BRIEF_ID: "19network_active_brief_id_v1",
};

export const studioStorage = {
  // Settings
  getSettings(): StudioSettings {
    if (typeof window === "undefined") return INITIAL_SETTINGS;
    try {
      const data = localStorage.getItem(KEYS.SETTINGS);
      return data ? { ...INITIAL_SETTINGS, ...JSON.parse(data) } : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  },

  saveSettings(settings: StudioSettings): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
      window.dispatchEvent(new Event("19network_settings_updated"));
    } catch (e) {
      console.error("Failed to save settings", e);
    }
  },

  // Saved Stories
  getSavedStories(): NewsStory[] {
    if (typeof window === "undefined") return [];
    try {
      const data = localStorage.getItem(KEYS.SAVED_STORIES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  toggleSaveStory(story: NewsStory): boolean {
    if (typeof window === "undefined") return false;
    const stories = this.getSavedStories();
    const index = stories.findIndex((s) => s.id === story.id);
    let isSavedNow = false;

    if (index >= 0) {
      stories.splice(index, 1);
      isSavedNow = false;
    } else {
      stories.push({ ...story, saved: true });
      isSavedNow = true;
    }

    localStorage.setItem(KEYS.SAVED_STORIES, JSON.stringify(stories));
    window.dispatchEvent(new Event("19network_stories_updated"));
    return isSavedNow;
  },

  isStorySaved(storyId: string): boolean {
    return this.getSavedStories().some((s) => s.id === storyId);
  },

  // Calendar Items
  getCalendarItems(): CalendarItem[] {
    if (typeof window === "undefined") return INITIAL_CALENDAR_ITEMS;
    try {
      const data = localStorage.getItem(KEYS.CALENDAR_ITEMS);
      if (!data) {
        localStorage.setItem(KEYS.CALENDAR_ITEMS, JSON.stringify(INITIAL_CALENDAR_ITEMS));
        return INITIAL_CALENDAR_ITEMS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_CALENDAR_ITEMS;
    }
  },

  saveCalendarItems(items: CalendarItem[]): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(KEYS.CALENDAR_ITEMS, JSON.stringify(items));
      window.dispatchEvent(new Event("19network_calendar_updated"));
    } catch (e) {
      console.error("Failed to save calendar items", e);
    }
  },

  addCalendarItem(item: CalendarItem): void {
    const items = this.getCalendarItems();
    items.push(item);
    this.saveCalendarItems(items);
  },

  updateCalendarItem(item: CalendarItem): void {
    const items = this.getCalendarItems().map((it) => (it.id === item.id ? item : it));
    this.saveCalendarItems(items);
  },

  deleteCalendarItem(id: string): void {
    const items = this.getCalendarItems().filter((it) => it.id !== id);
    this.saveCalendarItems(items);
  },

  // Ideation Briefs
  getIdeationBriefs(): CompleteIdeationBrief[] {
    if (typeof window === "undefined") return [];
    try {
      const data = localStorage.getItem(KEYS.IDEATION_BRIEFS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveIdeationBrief(brief: CompleteIdeationBrief): void {
    if (typeof window === "undefined") return;
    const briefs = this.getIdeationBriefs();
    const idx = briefs.findIndex((b) => b.id === brief.id);
    if (idx >= 0) {
      briefs[idx] = brief;
    } else {
      briefs.unshift(brief);
    }
    localStorage.setItem(KEYS.IDEATION_BRIEFS, JSON.stringify(briefs));
    window.dispatchEvent(new Event("19network_briefs_updated"));
  },

  // Social Intelligence Dataset
  getSocialData(): SocialDataset {
    if (typeof window === "undefined") return INITIAL_SOCIAL_DATA;
    try {
      const data = localStorage.getItem(KEYS.SOCIAL_DATA);
      return data ? JSON.parse(data) : INITIAL_SOCIAL_DATA;
    } catch {
      return INITIAL_SOCIAL_DATA;
    }
  },

  saveSocialData(data: SocialDataset): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(KEYS.SOCIAL_DATA, JSON.stringify(data));
      window.dispatchEvent(new Event("19network_social_updated"));
    } catch (e) {
      console.error("Failed to save social data", e);
    }
  },

  // Active Story & Active Brief for navigation handoffs
  setActiveStory(story: NewsStory): void {
    if (typeof window === "undefined") return;
    sessionStorage.setItem(KEYS.ACTIVE_STORY_ID, JSON.stringify(story));
  },

  getActiveStory(): NewsStory | null {
    if (typeof window === "undefined") return null;
    try {
      const data = sessionStorage.getItem(KEYS.ACTIVE_STORY_ID);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  // Reset all demo data
  resetAllDemoData(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(KEYS.SETTINGS);
    localStorage.removeItem(KEYS.SAVED_STORIES);
    localStorage.removeItem(KEYS.CALENDAR_ITEMS);
    localStorage.removeItem(KEYS.IDEATION_BRIEFS);
    localStorage.removeItem(KEYS.SOCIAL_DATA);
    sessionStorage.clear();
    window.dispatchEvent(new Event("19network_storage_reset"));
  },
};
