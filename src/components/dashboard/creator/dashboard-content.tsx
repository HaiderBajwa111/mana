"use client";

import { useSidebar } from "@/contexts/sidebar-context";
import {
  UploadModelCard,
  NothingHereYetCard,
  YourPrintsCard,
  NeedsAttentionCard,
  NewPrintCard,
  ProTipsCard,
  YourPrintsTabsCard,
} from "./dashboard-cards";
import type { DashboardData } from "@/types/dashboard";

interface DashboardContentProps {
  user: any;
  initialData?: DashboardData | null;
}

export const DashboardContent: React.FC<DashboardContentProps> = ({
  user,
  initialData,
}) => {
  const { isMinimized } = useSidebar();

  // Determine what to show based on user state
  const hasSubmittedPrints =
    initialData?.stats.totalPrints && initialData.stats.totalPrints > 0;
  const hasDrafts = initialData?.drafts && initialData.drafts.length > 0;
  const hasNeedsAction =
    initialData?.needsAction && initialData.needsAction.length > 0;

  // If user has existing prints, show the full dashboard
  if (hasSubmittedPrints) {
    return (
      <div
        className={`w-full transition-all duration-300 ${
          isMinimized ? "max-w-6xl" : "max-w-5xl"
        } mx-auto`}
      >
        <div className="space-y-6">
          {/* Needs Attention Section */}
          {hasNeedsAction && (
            <NeedsAttentionCard needsAction={initialData.needsAction} />
          )}

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Column - New Print Card */}
            <div className="lg:col-span-3">
              <NewPrintCard />
            </div>

            {/* Right Column - Pro Tips */}
            <ProTipsCard />
          </div>

          {/* Your Prints Section - Full Width */}
          <YourPrintsTabsCard
            openRequests={initialData.openRequests || []}
            drafts={initialData.drafts || []}
            completed={initialData.completed || []}
          />
        </div>

        {/* Optional: Background pattern */}
        <div className="absolute inset-0 -z-10 opacity-5 pointer-events-none">
          <svg viewBox="0 0 400 300" className="w-full h-full">
            <defs>
              <pattern
                id="grid"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 20 0 L 0 0 0 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="400" height="300" fill="url(#grid)" />
          </svg>
        </div>
      </div>
    );
  }

  // For new users without prints, show the empty state
  return (
    <div
      className={`w-full transition-all duration-300 ${
        isMinimized ? "max-w-6xl" : "max-w-5xl"
      } mx-auto`}
    >
      {/* Content Container - Empty state layout */}
      <div className="space-y-6">
        {/* First Row - Always show upload and help/status */}
        <div className="flex flex-col md:flex-row gap-6 min-h-[300px]">
          <UploadModelCard />
          <NothingHereYetCard />
        </div>

        {/* Second Row - Empty prints card */}
        <YourPrintsCard />
      </div>

      {/* Optional: Background pattern */}
      <div className="absolute inset-0 -z-10 opacity-5 pointer-events-none">
        <svg viewBox="0 0 400 300" className="w-full h-full">
          <defs>
            <pattern
              id="grid"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="400" height="300" fill="url(#grid)" />
        </svg>
      </div>
    </div>
  );
};
