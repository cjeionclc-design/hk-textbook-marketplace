export function CardSkeleton() {
  return (
    <div className="glass p-4 animate-pulse">
      <div className="aspect-[4/3] bg-gray-100/50 rounded-xl mb-4" />
      <div className="flex gap-2 mb-3">
        <div className="h-5 bg-gray-100/50 rounded-full w-14" />
        <div className="h-5 bg-gray-50/50 rounded-full w-10" />
      </div>
      <div className="h-4 bg-gray-100/50 rounded-lg w-full mb-2" />
      <div className="h-4 bg-gray-50/50 rounded-lg w-3/4 mb-3" />
      <div className="h-3 bg-gray-100/50 rounded w-20 mb-4" />
      <div className="flex gap-2 items-end">
        <div className="h-7 bg-gray-100/50 rounded-lg w-20" />
        <div className="h-4 bg-gray-50/50 rounded-lg w-14" />
      </div>
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="max-w-3xl mx-auto animate-pulse">
      <div className="h-4 bg-gray-100 rounded-lg w-24 mb-6" />
      <div className="glass p-6 sm:p-8">
        <div className="flex gap-2 mb-3"><div className="h-6 bg-gray-100/50 rounded-full w-16" /><div className="h-6 bg-gray-50/50 rounded-full w-12" /></div>
        <div className="h-8 bg-gray-100/50 rounded-xl w-3/4 mb-4" />
        <div className="h-16 bg-gray-50/50 rounded-2xl mb-4" />
        <div className="h-5 bg-gray-100/50 rounded-lg w-40 mb-4" />
        <div className="h-20 bg-gray-50/50 rounded-2xl" />
      </div>
    </div>
  );
}
