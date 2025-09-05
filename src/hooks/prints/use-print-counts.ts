"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserPrintsStatusCounts } from "@/app/actions/user/get-user-prints";

export function usePrintCounts(userId: string) {
  const {
    data: counts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["print-status-counts", userId],
    queryFn: async () => {
      if (!userId) return null;
      return await getUserPrintsStatusCounts(userId);
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    counts: counts || {
      all: 0,
      SUBMITTED: 0,
      IN_PROGRESS: 0,
      COMPLETED: 0,
      CANCELLED: 0,
    },
    isLoading,
    error,
  };
}
