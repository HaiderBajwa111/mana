"use client";

import PostedHome from "./posted-home";
import type { DashboardData, BuyerDashboardViewProps } from "@/types/dashboard";

export const BuyerDashboardView: React.FC<BuyerDashboardViewProps> = ({
  user,
  initialData,
}) => {
  const fallbackData: DashboardData = {
    stats: {
      totalPrints: 0,
      activePrints: 0,
      completedPrints: 0,
      totalQuotes: 0,
      activeRequests: 0,
      totalSpent: 0,
    },
    needsAction: [],
    openRequests: [],
    drafts: [],
    completed: [],
    activity: [],
  };

  const data = initialData ?? fallbackData;

  return (
    <div className="w-full">
      <PostedHome {...data} user={user} />
    </div>
  );
};
