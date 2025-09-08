export default function Loading() {
  return (
    <div className="max-w-md md:max-w-lg mx-auto px-4 py-6">
      <div className="animate-pulse space-y-6">
        {/* Header skeleton */}
        <div className="glass-card rounded-card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
              <div>
                <div className="h-5 bg-gray-200 rounded w-24 mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-200 rounded-button"></div>
              <div className="w-20 h-8 bg-gray-200 rounded-button"></div>
            </div>
          </div>
        </div>

        {/* Stats skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass-card p-4 rounded-card">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 bg-gray-200 rounded-lg"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded w-12"></div>
            </div>
          ))}
        </div>

        {/* Content skeleton */}
        <div className="glass-card p-6 rounded-card">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="h-20 bg-gray-200 rounded mb-4"></div>
          <div className="h-16 bg-gray-200 rounded mb-6"></div>
          <div className="flex gap-3">
            <div className="h-10 bg-gray-200 rounded-button flex-1"></div>
            <div className="h-10 bg-gray-200 rounded-button flex-1"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
