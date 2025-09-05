export interface DashboardData {
  stats: {
    totalPrints: number;
    activePrints: number;
    completedPrints: number;
    totalQuotes: number;
    activeRequests: number;
    totalSpent: number;
  };
  needsAction: Array<{
    id: string;
    type:
      | "new_quotes"
      | "select_maker"
      | "payment_due"
      | "unread_messages"
      | "invite_makers";
    title: string;
    description: string;
    count: number;
    action: string;
    actionUrl: string;
    priority: "high" | "medium" | "low";
  }>;
  openRequests: Array<{
    id: string;
    title: string;
    thumbnail: string;
    thumbnailUrl?: string;
    lastUpdated: string;
    status: "DRAFT" | "SUBMITTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
    quoteCount?: number;
    contextCTA: string;
    contextAction: string;
  }>;
  drafts: Array<{
    id: string;
    title: string;
    thumbnail: string;
    thumbnailUrl?: string;
    lastUpdated: string;
    status: "DRAFT" | "SUBMITTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
    contextCTA: string;
    contextAction: string;
  }>;
  completed: Array<{
    id: string;
    title: string;
    thumbnail: string;
    thumbnailUrl?: string;
    lastUpdated: string;
    status: "DRAFT" | "SUBMITTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
    contextCTA: string;
    contextAction: string;
  }>;
  activity: Array<{
    id: string;
    title: string;
    timestamp: string;
    type:
      | "quote_received"
      | "status_change"
      | "message_received"
      | "payment_received";
    metadata?: any;
  }>;
}

export interface BuyerDashboardViewProps {
  user: any;
  initialData?: DashboardData | null;
}
