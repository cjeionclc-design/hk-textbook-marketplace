export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse">
      <div className="h-3 bg-gray-100 rounded w-16 mb-3" />
      <div className="h-4 bg-gray-100 rounded w-full mb-2" />
      <div className="h-4 bg-gray-100 rounded w-3/4 mb-3" />
      <div className="h-3 bg-gray-100 rounded w-20 mb-4" />
      <div className="flex gap-2 items-end">
        <div className="h-7 bg-gray-100 rounded w-20" />
        <div className="h-4 bg-gray-100 rounded w-14" />
      </div>
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="max-w-3xl mx-auto animate-pulse">
      <div className="h-4 bg-gray-100 rounded w-24 mb-6" />
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="h-3 bg-gray-100 rounded w-32 mb-2" />
        <div className="h-7 bg-gray-100 rounded w-3/4 mb-4" />
        <div className="h-14 bg-gray-100 rounded-xl mb-4" />
        <div className="h-5 bg-gray-100 rounded w-40 mb-4" />
        <div className="h-20 bg-gray-100 rounded-lg mb-4" />
      </div>
    </div>
  );
}
