"use client";

import React, { useRef, useEffect, useCallback } from "react";
import { useUserPrints } from "@/hooks/prints/use-user-prints";
import { PrintCard } from "@/components/prints/print-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, Loader2 } from "lucide-react";

interface PrintsInfiniteScrollProps {
  userId: string;
  statusFilter: string;
  searchTerm: string;
}

export function PrintsInfiniteScroll({
  userId,
  statusFilter,
  searchTerm,
}: PrintsInfiniteScrollProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useUserPrints(userId, {
    status: statusFilter,
    search: searchTerm,
  });

  // Simple intersection observer for infinite scroll
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        rootMargin: "100px",
        threshold: 0.1,
      }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Flatten all pages into a single array
  const allPrints = data?.pages.flatMap((page) => page.prints) ?? [];
  const totalCount = data?.pages[0]?.totalCount ?? 0;

  if (isLoading) {
    return (
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
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <Package className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Error loading prints</h3>
        <p className="text-muted-foreground mb-4">
          {error?.message ||
            "There was an error loading your prints. Please try again."}
        </p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  if (allPrints.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No prints found</h3>
        <p className="text-muted-foreground mb-4">
          {searchTerm || statusFilter !== "all"
            ? "Try adjusting your search or filters to find what you're looking for."
            : "You haven't created any prints yet. Start by creating your first 3D print project!"}
        </p>
        {searchTerm || statusFilter !== "all" ? (
          <Button
            onClick={() => {
              // This will be handled by the parent component
              window.location.reload();
            }}
          >
            Clear Filters
          </Button>
        ) : (
          <Button asChild>
            <a href="/creator/start-print/">Create a Print</a>
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {allPrints.length} of {totalCount} prints
      </div>

      {/* Prints Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allPrints.map((print) => (
          <PrintCard key={print.id} print={print} />
        ))}
      </div>

      {/* Load More Trigger */}
      {hasNextPage && (
        <div ref={loadMoreRef} className="flex justify-center py-6">
          {isFetchingNextPage ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading more prints...</span>
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              Load More Prints
            </Button>
          )}
        </div>
      )}

      {/* End of Results */}
      {!hasNextPage && allPrints.length > 0 && (
        <div className="text-center py-6 text-muted-foreground">
          <p>You've reached the end of your prints.</p>
        </div>
      )}
    </div>
  );
}
