import React from "react";
import { Skeleton } from "./skeleton";
import { Card, CardContent, CardHeader } from "./card";

// Reusable skeleton components for consistent loading states

export const HeaderSkeleton = () => (
  <div className="text-center mb-16">
    <Skeleton className="h-8 w-32 mx-auto mb-4" />
    <Skeleton className="h-12 w-96 mx-auto mb-6" />
    <Skeleton className="h-6 w-full max-w-3xl mx-auto mb-2" />
    <Skeleton className="h-6 w-2/3 mx-auto mb-8" />
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Skeleton className="h-12 w-40" />
      <Skeleton className="h-12 w-48" />
    </div>
  </div>
);

export const ContentCardSkeleton = () => (
  <Card className="overflow-hidden">
    <CardContent className="p-8">
      <div className="flex flex-col md:flex-row items-start gap-6">
        <Skeleton className="w-16 h-16 rounded-full flex-shrink-0" />
        <div className="flex-1 w-full">
          <div className="flex items-center gap-3 mb-3">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-8 w-48" />
          </div>
          <Skeleton className="h-6 w-full mb-4" />
          <div className="space-y-2 mb-4">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-4/5" />
            <Skeleton className="h-5 w-3/4" />
          </div>
          <Skeleton className="h-16 w-full rounded-lg" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export const GridCardSkeleton = () => (
  <Card className="h-full">
    <CardHeader>
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </CardContent>
  </Card>
);

export const IconCardSkeleton = () => (
  <Card className="text-center p-6">
    <Skeleton className="w-12 h-12 mx-auto mb-4 rounded-full" />
    <Skeleton className="h-6 w-24 mx-auto mb-2" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-3/4 mx-auto mt-1" />
  </Card>
);

export const DashboardCardSkeleton = () => (
  <Card className="p-6">
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-24" />
      </div>
    </div>
  </Card>
);

export const TableRowSkeleton = () => (
  <div className="flex items-center space-x-4 py-4 border-b">
    <Skeleton className="h-10 w-10 rounded-full" />
    <div className="space-y-2 flex-1">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-3 w-2/3" />
    </div>
    <Skeleton className="h-8 w-16" />
  </div>
);

export const PageSkeleton = ({
  headerSkeleton = true,
  contentCards = 5,
  gridCards = 3,
  showFooter = true,
}: {
  headerSkeleton?: boolean;
  contentCards?: number;
  gridCards?: number;
  showFooter?: boolean;
}) => (
  <div className="min-h-screen bg-background">
    <div className="container mx-auto px-4 py-12">
      {headerSkeleton && <HeaderSkeleton />}

      {/* Main content cards */}
      <div className="mb-16">
        <Skeleton className="h-8 w-48 mx-auto mb-12" />
        <div className="space-y-8">
          {[...Array(contentCards)].map((_, index) => (
            <ContentCardSkeleton key={index} />
          ))}
        </div>
      </div>

      {/* Grid section */}
      <div className="mb-16">
        <Skeleton className="h-8 w-56 mx-auto mb-12" />
        <div className="grid md:grid-cols-3 gap-6">
          {[...Array(gridCards)].map((_, index) => (
            <GridCardSkeleton key={index} />
          ))}
        </div>
      </div>

      {showFooter && (
        <Card className="p-8">
          <CardContent className="space-y-6 text-center">
            <Skeleton className="h-8 w-64 mx-auto" />
            <Skeleton className="h-6 w-full max-w-2xl mx-auto" />
            <Skeleton className="h-6 w-3/4 mx-auto" />
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Skeleton className="h-12 w-48" />
              <Skeleton className="h-12 w-40" />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  </div>
);

// Dashboard specific skeletons
export const DashboardSkeleton = () => (
  <div className="space-y-6">
    {/* Header */}
    <div className="space-y-2">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-5 w-48" />
    </div>

    {/* Grid layout */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <DashboardCardSkeleton key={index} />
      ))}
    </div>
  </div>
);

// Empty state dashboard skeleton that mimics the actual empty state layout
export const EmptyStateDashboardSkeleton = () => (
  <div className="min-h-[600px] px-4 py-6">
    {/* Parent flex-col container */}
    <div className="w-full max-w-5xl mx-auto flex flex-col space-y-8">
      {/* Welcome Header Container */}
      <div className="text-start space-y-3">
        <Skeleton className="h-8 w-72" />
        <Skeleton className="h-6 w-64" />
      </div>

      {/* Content Container - 2 rows layout */}
      <div className="space-y-6">
        {/* First Row - Two containers side by side */}
        <div className="flex flex-col md:flex-row gap-6 min-h-[300px]">
          {/* First Container (Blue section equivalent) */}
          <div className="flex-1">
            <Card className="h-full p-8 border-2 border-dashed border-border">
              <CardContent className="space-y-6 text-center flex flex-col items-center justify-center">
                <Skeleton className="w-12 h-12 mb-4" />
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-full max-w-md" />
                <Skeleton className="h-4 w-3/4 max-w-md" />
                <Skeleton className="h-12 w-32 mt-6" />
              </CardContent>
            </Card>
          </div>

          {/* Second Container (White section equivalent) */}
          <div className="flex-1">
            <Card className="h-full bg-white border-border p-6">
              <CardContent className="flex flex-col items-center justify-center my-auto space-y-6">
                <div className="space-y-2 text-center">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-4 w-52" />
                </div>
                <div className="space-y-4 w-full max-w-xs">
                  <Skeleton className="h-6 w-48" />
                  <div className="space-y-3">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Second Row - Full width container */}
        <div className="w-full">
          <Card className="w-full bg-gray-50 border-gray-300 p-6 min-h-[200px]">
            <CardContent className="space-y-4">
              <Skeleton className="h-6 w-32" />
              <div className="flex flex-col items-center justify-center h-32 text-center">
                <Skeleton className="h-4 w-80" />
                <Skeleton className="h-4 w-64 mt-2" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>
);

export const ListSkeleton = ({ items = 5 }: { items?: number }) => (
  <div className="space-y-4">
    <Skeleton className="h-8 w-48 mb-6" />
    {[...Array(items)].map((_, index) => (
      <TableRowSkeleton key={index} />
    ))}
  </div>
);
