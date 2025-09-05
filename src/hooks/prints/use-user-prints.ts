"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import {
  getUserPrints,
  type GetUserPrintsParams,
} from "@/app/actions/user/get-user-prints";

export function useUserPrints(
  userId: string,
  filters: Omit<GetUserPrintsParams, "userId" | "page" | "limit">
) {
  return useInfiniteQuery({
    queryKey: ["user-prints", userId, filters.status, filters.search],
    queryFn: ({ pageParam = 1 }) =>
      getUserPrints({
        userId,
        page: pageParam,
        limit: 9,
        status: filters.status,
        search: filters.search,
      }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
