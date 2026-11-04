import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#DCE6DF] bg-[#F5F8F5]/50 px-6 py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#DDF5E8] text-[#16834A]">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-sm font-bold text-[#123B2B]">{title}</h3>
      <p className="mt-1 max-w-sm text-xs text-[#728078]">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-4 rounded-lg bg-[#123B2B] px-4 py-2 text-xs font-semibold text-white hover:bg-[#16834A] transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
