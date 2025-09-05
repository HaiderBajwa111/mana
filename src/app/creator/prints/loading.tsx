import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-[600px] px-4 py-6">
      {/* Status Tabs Skeleton */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-1 border-b border-border">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="px-6 py-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-6 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prints Content Skeleton */}
      <div className="space-y-6">
        {/* Results Count Skeleton */}
        <div className="text-sm text-muted-foreground">
          <Skeleton className="h-4 w-32" />
        </div>

        {/* Prints Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="hover:shadow-lg transition-shadow duration-200"
            >
              <div className="border rounded-lg">
                {/* Card Header */}
                <div className="p-4 pb-3">
                  {/* Image Skeleton */}
                  <div className="w-full h-32 bg-muted rounded-lg mb-3">
                    <Skeleton className="w-full h-full rounded-lg" />
                  </div>

                  {/* Title and Menu Skeleton */}
                  <div className="flex items-start justify-between mb-3">
                    <Skeleton className="h-4 w-32 flex-1 pr-2" />
                    <Skeleton className="h-6 w-6 rounded" />
                  </div>

                  {/* Status Badge Skeleton */}
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>

                {/* Card Content */}
                <div className="px-4 pb-4 space-y-3">
                  {/* Print Details Skeletons */}
                  <div className="space-y-2 text-sm">
                    {Array.from({ length: 5 }).map((_, detailIndex) => (
                      <div
                        key={detailIndex}
                        className="flex items-center gap-2"
                      >
                        <Skeleton className="h-3 w-3 rounded" />
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons Skeleton */}
                  <div className="flex gap-2 pt-2">
                    <Skeleton className="h-8 flex-1 rounded" />
                    <Skeleton className="h-8 flex-1 rounded" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Section Skeleton */}
        <div className="flex justify-center py-6">
          <Skeleton className="h-10 w-32 rounded" />
        </div>
      </div>
    </div>
  );
}
