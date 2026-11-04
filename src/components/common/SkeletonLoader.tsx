export function SkeletonCard() {
  return (
    <div className="rounded-xl border border-[#DCE6DF] bg-white p-5 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-4 w-24 bg-gray-200 rounded" />
        <div className="h-6 w-16 bg-gray-200 rounded-full" />
      </div>
      <div className="mt-3 h-6 w-3/4 bg-gray-200 rounded" />
      <div className="mt-2 h-4 w-full bg-gray-200 rounded" />
      <div className="mt-4 flex items-center gap-2">
        <div className="h-4 w-20 bg-gray-200 rounded" />
        <div className="h-4 w-20 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="space-y-3 p-4 animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center justify-between py-2 border-b border-[#DCE6DF]/40">
          <div className="h-4 w-1/3 bg-gray-200 rounded" />
          <div className="h-4 w-1/6 bg-gray-200 rounded" />
          <div className="h-4 w-1/6 bg-gray-200 rounded" />
          <div className="h-6 w-12 bg-gray-200 rounded-full" />
        </div>
      ))}
    </div>
  );
}
