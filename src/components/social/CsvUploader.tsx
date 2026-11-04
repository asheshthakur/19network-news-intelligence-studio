"use client";

import { useState } from "react";
import { SocialPlatform, SocialDataset } from "@/types/social";
import { Upload, Download, CheckCircle, AlertTriangle, FileText } from "lucide-react";
import { studioStorage } from "@/lib/storage";

interface CsvUploaderProps {
  platform: SocialPlatform;
  onImportSuccess: (updatedData: SocialDataset) => void;
}

const TEMPLATES: Record<SocialPlatform, { filename: string; content: string }> = {
  instagram: {
    filename: "instagram-analytics-template.csv",
    content: `Date,Followers,Posts,Reach,Impressions,Engagement,Likes,Comments,Saves,Shares,ReelViews\n2026-11-01,19400,1110,142500,218400,11620,8940,980,1120,580,94500`,
  },
  linkedin: {
    filename: "linkedin-analytics-template.csv",
    content: `Date,Followers,Impressions,PageViews,Engagement,Clicks,Reactions,Comments,Shares\n2026-11-01,971,24800,4120,1488,640,610,138,100`,
  },
  facebook: {
    filename: "facebook-analytics-template.csv",
    content: `Date,Followers,Reach,Impressions,Engagement,Views,Reactions\n2026-11-01,5200,34000,48000,2900,12000,1850`,
  },
  tiktok: {
    filename: "tiktok-analytics-template.csv",
    content: `Date,Followers,VideoViews,Likes,Comments,Shares,Engagement\n2026-11-01,8400,88000,6200,450,890,7540`,
  },
  x: {
    filename: "x-analytics-template.csv",
    content: `Date,Followers,Impressions,Likes,Reposts,Replies,Engagement\n2026-11-01,4300,52000,1400,380,210,1990`,
  },
};

export function CsvUploader({ platform, onImportSuccess }: CsvUploaderProps) {
  const [csvText, setCsvText] = useState("");
  const [parsedRows, setParsedRows] = useState<string[][]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleDownloadTemplate = () => {
    const template = TEMPLATES[platform];
    const blob = new Blob([template.content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = template.filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setSuccess(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvText(text);
      validateAndParse(text);
    };
    reader.readAsText(file);
  };

  const validateAndParse = (text: string) => {
    try {
      const lines = text.trim().split("\n");
      if (lines.length < 2) {
        throw new Error("CSV file must contain a header row and at least one data row.");
      }

      const rows = lines.map((l) => l.split(",").map((c) => c.trim().replace(/^"|"$/g, "")));
      const headers = rows[0].map((h) => h.toLowerCase());

      // Validate required columns based on platform
      if (platform === "instagram") {
        if (!headers.includes("followers") || !headers.includes("impressions")) {
          throw new Error("Instagram CSV must contain 'Followers' and 'Impressions' columns.");
        }
      } else if (platform === "linkedin") {
        if (!headers.includes("followers") || !headers.includes("impressions")) {
          throw new Error("LinkedIn CSV must contain 'Followers' and 'Impressions' columns.");
        }
      }

      setParsedRows(rows);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid CSV file structure.");
      setParsedRows([]);
    }
  };

  const handleCommitImport = () => {
    if (parsedRows.length < 2) return;

    try {
      const headers = parsedRows[0].map((h) => h.toLowerCase());
      const firstData = parsedRows[1];
      const getVal = (col: string) => {
        const idx = headers.indexOf(col.toLowerCase());
        return idx >= 0 && firstData[idx] ? Number(firstData[idx]) || 0 : 0;
      };

      const currentDataset = studioStorage.getSocialData();

      if (platform === "instagram") {
        const followers = getVal("followers") || currentDataset.instagram.followers;
        const posts = getVal("posts") || currentDataset.instagram.posts;
        const reach = getVal("reach") || currentDataset.instagram.reach;
        const impressions = getVal("impressions") || currentDataset.instagram.impressions;
        const engagement = getVal("engagement") || currentDataset.instagram.engagement;
        const likes = getVal("likes") || currentDataset.instagram.likes;
        const comments = getVal("comments") || currentDataset.instagram.comments;
        const saves = getVal("saves") || currentDataset.instagram.saves;
        const shares = getVal("shares") || currentDataset.instagram.shares;
        const reelViews = getVal("reelviews") || currentDataset.instagram.reelViews;

        currentDataset.instagram = {
          followers,
          posts,
          reach,
          impressions,
          engagement,
          engagementRate: impressions > 0 ? Number(((engagement / impressions) * 100).toFixed(2)) : 5.32,
          likes,
          comments,
          saves,
          shares,
          reelViews,
          period: "CSV Imported (Verified)",
        };
      } else if (platform === "linkedin") {
        const followers = getVal("followers") || currentDataset.linkedIn.followers;
        const impressions = getVal("impressions") || currentDataset.linkedIn.impressions;
        const pageViews = getVal("pageviews") || currentDataset.linkedIn.pageViews;
        const engagement = getVal("engagement") || currentDataset.linkedIn.engagement;
        const clicks = getVal("clicks") || currentDataset.linkedIn.clicks;
        const reactions = getVal("reactions") || currentDataset.linkedIn.reactions;
        const comments = getVal("comments") || currentDataset.linkedIn.comments;
        const shares = getVal("shares") || currentDataset.linkedIn.shares;

        currentDataset.linkedIn = {
          followers,
          impressions,
          pageViews,
          engagement,
          engagementRate: impressions > 0 ? Number(((engagement / impressions) * 100).toFixed(2)) : 6.0,
          clicks,
          reactions,
          comments,
          shares,
          period: "CSV Imported (Verified)",
        };
      } else if (platform === "facebook") {
        currentDataset.facebook = {
          followers: getVal("followers"),
          reach: getVal("reach"),
          impressions: getVal("impressions"),
          engagement: getVal("engagement"),
          engagementRate: getVal("impressions") > 0 ? Number(((getVal("engagement") / getVal("impressions")) * 100).toFixed(2)) : 4.5,
          views: getVal("views"),
          reactions: getVal("reactions"),
          period: "CSV Imported (Verified)",
        };
      } else if (platform === "tiktok") {
        currentDataset.tiktok = {
          followers: getVal("followers"),
          videoViews: getVal("videoviews"),
          likes: getVal("likes"),
          comments: getVal("comments"),
          shares: getVal("shares"),
          engagement: getVal("engagement"),
          engagementRate: getVal("videoviews") > 0 ? Number(((getVal("engagement") / getVal("videoviews")) * 100).toFixed(2)) : 8.5,
          period: "CSV Imported (Verified)",
        };
      } else if (platform === "x") {
        currentDataset.x = {
          followers: getVal("followers"),
          impressions: getVal("impressions"),
          likes: getVal("likes"),
          reposts: getVal("reposts"),
          replies: getVal("replies"),
          engagement: getVal("engagement"),
          engagementRate: getVal("impressions") > 0 ? Number(((getVal("engagement") / getVal("impressions")) * 100).toFixed(2)) : 3.8,
          period: "CSV Imported (Verified)",
        };
      }

      currentDataset.lastImportedAt = new Date().toISOString();
      studioStorage.saveSocialData(currentDataset);
      onImportSuccess(currentDataset);

      setSuccess(`Successfully imported official analytics for ${platform.toUpperCase()}. Metrics updated!`);
      setParsedRows([]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to apply CSV data.");
    }
  };

  return (
    <div className="rounded-xl border border-[#DCE6DF] bg-[#F5F8F5]/60 p-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-[#16834A]" />
          <span className="text-xs font-bold text-[#123B2B] uppercase tracking-wide">
            {platform.toUpperCase()} Official Analytics CSV Import
          </span>
        </div>
        <button
          onClick={handleDownloadTemplate}
          className="flex items-center gap-1.5 rounded-lg border border-[#DCE6DF] bg-white px-2.5 py-1 text-xs font-medium text-[#123B2B] hover:bg-[#F5F8F5]"
        >
          <Download className="h-3.5 w-3.5 text-[#16834A]" />
          <span>Download CSV Template</span>
        </button>
      </div>

      <p className="text-xs text-[#728078]">
        Upload native export CSVs from platform creator studios without paid third-party API dependencies.
      </p>

      {/* File input */}
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 rounded-lg bg-[#123B2B] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#16834A] cursor-pointer transition-colors shadow-sm">
          <Upload className="h-3.5 w-3.5 text-[#DDF5E8]" />
          <span>Select CSV File</span>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
        <span className="text-xs text-[#728078]">.csv files supported</span>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-lg bg-rose-50 border border-rose-200 p-2.5 text-xs text-rose-800">
          <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-2 rounded-lg bg-[#DDF5E8] border border-[#16834A]/30 p-2.5 text-xs text-[#123B2B]">
          <CheckCircle className="h-4 w-4 shrink-0 text-[#16834A] mt-0.5" />
          <span>{success}</span>
        </div>
      )}

      {/* Preview Table */}
      {parsedRows.length > 0 && (
        <div className="mt-3 space-y-2">
          <div className="text-xs font-bold text-[#14231B]">
            Data Preview ({parsedRows.length - 1} records detected):
          </div>
          <div className="max-h-40 overflow-auto rounded-lg border border-[#DCE6DF] bg-white text-xs">
            <table className="w-full text-left">
              <thead className="bg-[#F5F8F5] text-[#728078] font-semibold border-b border-[#DCE6DF]">
                <tr>
                  {parsedRows[0].map((h, i) => (
                    <th key={i} className="p-2 border-r border-[#DCE6DF] last:border-0">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCE6DF]">
                {parsedRows.slice(1, 3).map((r, ri) => (
                  <tr key={ri}>
                    {r.map((c, ci) => (
                      <td key={ci} className="p-2 border-r border-[#DCE6DF] last:border-0 font-mono text-[11px]">
                        {c}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={handleCommitImport}
            className="rounded-lg bg-[#16834A] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#123B2B] transition-colors"
          >
            Confirm & Import Data
          </button>
        </div>
      )}
    </div>
  );
}
