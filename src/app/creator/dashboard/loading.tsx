import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-[600px] px-4 py-6">
      {/* Dashboard Header Skeleton */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      {/* Dashboard Content Skeleton */}
      <div className="space-y-6">
        {/* First Row - Upload and Help cards */}
        <div className="flex flex-col md:flex-row gap-6 min-h-[300px]">
          {/* Upload Model Card Skeleton */}
          <div className="flex-1">
            <div className="h-full border rounded-lg p-8 bg-gray-50/50">
              <div className="space-y-6 text-center flex flex-col items-center justify-center h-full">
                <Skeleton className="w-12 h-12 rounded-full" />
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-12 w-32" />
              </div>
            </div>
          </div>

          {/* Nothing Here Yet Card Skeleton */}
          <div className="flex-1">
            <div className="h-full bg-white border rounded-lg p-6">
              <div className="flex flex-col items-center justify-center h-full space-y-4">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-6 w-44" />
                <div className="space-y-3 w-full">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Second Row - Your Prints Card Skeleton */}
        <div className="w-full">
          <div className="w-full bg-gray-50 border rounded-lg p-6 min-h-[200px]">
            <Skeleton className="h-6 w-24 mb-4" />
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
