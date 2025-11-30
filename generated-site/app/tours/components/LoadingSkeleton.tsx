export function TourCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg h-full flex flex-col animate-pulse">
      {/* Image Skeleton */}
      <div className="relative aspect-video bg-gray-200" />

      {/* Content Skeleton */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="mb-4">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>

        <div className="space-y-2 mb-4 flex-1">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
          <div className="h-4 bg-gray-200 rounded w-4/6" />
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          <div className="h-6 bg-gray-200 rounded-full w-20" />
          <div className="h-6 bg-gray-200 rounded-full w-24" />
          <div className="h-6 bg-gray-200 rounded-full w-16" />
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="h-5 bg-gray-200 rounded w-24" />
          <div className="h-5 bg-gray-200 rounded w-28" />
        </div>
      </div>
    </div>
  )
}

export function CategorySectionSkeleton() {
  return (
    <section className="mb-24">
      <div className="mb-12 text-center max-w-3xl mx-auto">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse" />
        </div>
        <div className="h-12 bg-gray-200 rounded w-1/2 mx-auto mb-4 animate-pulse" />
        <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto animate-pulse" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <TourCardSkeleton key={i} />
        ))}
      </div>
    </section>
  )
}
