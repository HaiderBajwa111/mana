"use client";

import React, { useState } from "react";
import { Search, Filter, SortAsc } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PrintsInfiniteScroll } from "@/components/prints/prints-infinite-scroll";
import { useCurrentUser } from "@/hooks/auth/use-current-user";
import { usePrintCounts } from "@/hooks/prints/use-print-counts";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function PrintsPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  const { user } = useCurrentUser();
  const { counts, isLoading: countsLoading } = usePrintCounts(user?.id || "");

  const tabs = [
    { id: "all", label: "All Prints", count: counts?.all || 0 },
    { id: "SUBMITTED", label: "Pending", count: counts?.SUBMITTED || 0 },
    {
      id: "IN_PROGRESS",
      label: "In Progress",
      count: counts?.IN_PROGRESS || 0,
    },
    { id: "COMPLETED", label: "Completed", count: counts?.COMPLETED || 0 },
    { id: "CANCELLED", label: "Cancelled", count: counts?.CANCELLED || 0 },
  ];

  const handleTabChange = (tabId: string) => {
    setStatusFilter(tabId);
  };

  return (
    <div className="min-h-[600px] px-4 py-6">
      {/* Status Tabs */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-1 border-b border-border">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant="ghost"
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                "px-6 py-3 rounded-t-lg border-b-2 transition-all duration-200 relative group",
                statusFilter === tab.id
                  ? "border-primary bg-primary/5 text-primary font-medium shadow-sm"
                  : "border-transparent hover:border-border/50 hover:bg-muted/50 text-muted-foreground hover:text-foreground"
              )}
            >
              <span className="flex items-center gap-2">
                {tab.label}
                {tab.count > 0 && (
                  <span
                    className={cn(
                      "px-2 py-0.5 text-xs rounded-full font-medium transition-colors",
                      statusFilter === tab.id
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {countsLoading ? (
                      <Skeleton className="h-4 w-4 rounded-full" />
                    ) : (
                      tab.count
                    )}
                  </span>
                )}
              </span>
              {statusFilter === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Prints Content */}
      <PrintsInfiniteScroll
        userId={user?.id || ""}
        statusFilter={statusFilter}
        searchTerm=""
      />
    </div>
  );
}
