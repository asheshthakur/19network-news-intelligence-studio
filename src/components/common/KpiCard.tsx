import { LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  dataSourceType: "actual" | "verified_manual" | "calculated" | "sample";
  notes?: string;
}

const BADGE_MAP = {
  actual: { label: "Actual Feed", bg: "bg-[#DDF5E8] text-[#123B2B] border-[#16834A]/20" },
  verified_manual: { label: "Verified Data", bg: "bg-blue-50 text-blue-800 border-blue-200" },
  calculated: { label: "Algorithmic", bg: "bg-emerald-50 text-emerald-800 border-emerald-200" },
  sample: { label: "Baseline Demo", bg: "bg-amber-50 text-amber-800 border-amber-200" },
};

export function KpiCard({
  title,
  value,
  subValue,
  change,
  isPositive,
  icon: Icon,
  dataSourceType,
  notes,
}: KpiCardProps) {
  const badge = BADGE_MAP[dataSourceType];

  return (
    <div className="relative overflow-hidden rounded-xl border border-[#DCE6DF] bg-white p-5 shadow-card transition-all hover:shadow-cardHover">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#728078]">{title}</span>
            <span
              className={`rounded border px-1.5 py-0.5 text-[9px] font-semibold tracking-wide uppercase ${badge.bg}`}
            >
              {badge.label}
            </span>
          </div>
          <div className="text-2xl font-bold tracking-tight text-[#14231B]">{value}</div>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EDF8F2] text-[#16834A]">
          <Icon className="h-5 w-5" />
        </div>
      </div>

      {(subValue || change) && (
        <div className="mt-3 flex items-center gap-2 text-xs">
          {change && (
            <span
              className={`font-semibold ${
                isPositive ? "text-[#16834A]" : "text-amber-700"
              }`}
            >
              {change}
            </span>
          )}
          {subValue && <span className="text-[#728078]">{subValue}</span>}
        </div>
      )}

      {notes && (
        <div className="mt-2 text-[10px] text-[#728078]/80 line-clamp-1 border-t border-[#DCE6DF]/40 pt-1.5">
          {notes}
        </div>
      )}
    </div>
  );
}
