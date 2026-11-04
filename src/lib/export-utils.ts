import { CalendarItem } from "@/types/calendar";
import { NewsStory } from "@/types/news";

export function exportCalendarToCsv(items: CalendarItem[]): void {
  const headers = [
    "ID",
    "Title",
    "Platform",
    "Category",
    "Target Market",
    "Scheduled Date",
    "Scheduled Time (GST)",
    "Status",
    "Assigned Owner",
    "Content Draft",
  ];

  const rows = items.map((it) => [
    `"${it.id}"`,
    `"${it.title.replace(/"/g, '""')}"`,
    `"${it.platform}"`,
    `"${it.category}"`,
    `"${it.targetMarket}"`,
    `"${it.scheduledDate}"`,
    `"${it.scheduledTime}"`,
    `"${it.status}"`,
    `"${it.assignedOwner.replace(/"/g, '""')}"`,
    `"${it.contentDraft.replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  downloadBlob(csvContent, "19network-editorial-calendar.csv", "text/csv;charset=utf-8;");
}

export function exportCalendarToIcs(items: CalendarItem[]): void {
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//19Network//News Intelligence Studio Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-TIMEZONE:Asia/Dubai",
  ];

  for (const it of items) {
    if (!it.scheduledDate) continue;
    const cleanDate = it.scheduledDate.replace(/-/g, "");
    const cleanTime = (it.scheduledTime || "09:00").replace(/:/g, "") + "00";

    lines.push("BEGIN:VEVENT");
    lines.push(`UID:${it.id}@19network.com`);
    lines.push(`DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`);
    lines.push(`DTSTART;TZID=Asia/Dubai:${cleanDate}T${cleanTime}`);
    lines.push(`SUMMARY:[${it.platform}] ${it.title}`);
    lines.push(`DESCRIPTION:Status: ${it.status}\\nCategory: ${it.category}\\nMarket: ${it.targetMarket}\\n\\n${it.contentDraft.slice(0, 300)}`);
    lines.push(`STATUS:${it.status === "Published" ? "CONFIRMED" : "TENTATIVE"}`);
    lines.push("END:VEVENT");
  }

  lines.push("END:VCALENDAR");

  const icsContent = lines.join("\r\n");
  downloadBlob(icsContent, "19network-editorial-calendar.ics", "text/calendar;charset=utf-8;");
}

export function exportStoriesToCsv(stories: NewsStory[]): void {
  const headers = [
    "Headline",
    "Source",
    "URL",
    "Published At",
    "Geo Category",
    "News Category",
    "Opportunity Score",
    "UAE Relevance",
    "GCC Relevance",
    "Global Importance",
    "Trending Score",
    "Credibility",
    "Freshness",
  ];

  const rows = stories.map((s) => [
    `"${s.title.replace(/"/g, '""')}"`,
    `"${s.source.replace(/"/g, '""')}"`,
    `"${s.url}"`,
    `"${s.publishedAt}"`,
    `"${s.geoCategory}"`,
    `"${s.category}"`,
    s.score.total,
    s.score.uaeRelevance,
    s.score.gccRelevance,
    s.score.globalImportance,
    s.score.trendingMomentum,
    s.score.sourceCredibility,
    s.score.freshness,
  ]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  downloadBlob(csvContent, "19network-topic-radar-export.csv", "text/csv;charset=utf-8;");
}

export function downloadJsonFile(data: unknown, filename: string): void {
  const jsonContent = JSON.stringify(data, null, 2);
  downloadBlob(jsonContent, filename, "application/json;charset=utf-8;");
}

export function downloadTextFile(text: string, filename: string, mimeType = "text/plain"): void {
  downloadBlob(text, filename, `${mimeType};charset=utf-8;`);
}

function downloadBlob(content: string, filename: string, mimeType: string): void {
  if (typeof window === "undefined") return;
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
