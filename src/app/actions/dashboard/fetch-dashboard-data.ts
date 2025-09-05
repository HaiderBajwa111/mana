"use server";

import db from "@/db";

interface PrintRequest {
  id: number;
  title?: string;
  status: string;
  fileUrl?: string;
  createdAt: Date;
  updatedAt?: Date | null;
}

interface ActivityItem {
  id: string;
  title: string;
  timestamp: string;
  type:
    | "status_change"
    | "quote_received"
    | "message_received"
    | "payment_received";
  metadata?: any;
}

export async function fetchDashboardData(userId: string) {
  try {
    if (!userId) {
      throw new Error("User not authenticated");
    }

    // Check if user has any projects using Prisma
    const projects = await db.project.findMany({
      where: { creatorId: userId },
      include: {
        conversations: {
          select: {
            id: true,
          },
        },
      },
    });

    const hasProjects = projects && projects.length > 0;

    if (!hasProjects) {
      return {
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
    }

    // Calculate stats
    const stats = {
      totalPrints: projects.length,
      activePrints: projects.filter((p) =>
        ["SUBMITTED", "IN_PROGRESS"].includes(p.status)
      ).length,
      completedPrints: projects.filter((p) => p.status === "COMPLETED").length,
      totalQuotes: 0, // TODO: Calculate from conversations when quote system is implemented
      activeRequests: projects.filter((p) =>
        ["SUBMITTED", "IN_PROGRESS"].includes(p.status)
      ).length,
      totalSpent: 0, // TODO: Calculate from payment data
    };

    // Process projects into different categories
    const openRequests = projects
      .filter((p) => ["SUBMITTED", "IN_PROGRESS"].includes(p.status))
      .map((p) => ({
        id: p.id.toString(),
        title: p.title || `Project ${p.id}`,
        thumbnail: p.fileUrl || "",
        thumbnailUrl: p.fileUrl,
        fileUrl: p.fileUrl, // Add fileUrl for STL viewer
        lastUpdated: new Date(p.updatedAt || p.createdAt).toLocaleDateString(),
        status: p.status,
        quoteCount: 0, // TODO: Calculate from conversations when quote system is implemented
        contextCTA: getContextCTA(p.status),
        contextAction: getContextAction(p.status),
      }));

    const drafts = projects
      .filter((p) => p.status === "DRAFT")
      .map((p) => ({
        id: p.id.toString(),
        title: p.title || `Draft ${p.id}`,
        thumbnail: p.fileUrl || "",
        thumbnailUrl: p.fileUrl,
        fileUrl: p.fileUrl, // Add fileUrl for STL viewer
        lastUpdated: new Date(p.updatedAt || p.createdAt).toLocaleDateString(),
        status: p.status,
        contextCTA: getContextCTA(p.status),
        contextAction: getContextAction(p.status),
      }));

    const completed = projects
      .filter((p) => p.status === "COMPLETED")
      .map((p) => ({
        id: p.id.toString(),
        title: p.title || `Completed Project ${p.id}`,
        thumbnail: p.fileUrl || "",
        thumbnailUrl: p.fileUrl,
        fileUrl: p.fileUrl, // Add fileUrl for STL viewer
        lastUpdated: new Date(p.updatedAt || p.createdAt).toLocaleDateString(),
        status: p.status,
        contextCTA: getContextCTA(p.status),
        contextAction: getContextAction(p.status),
      }));

    // Build needs action items
    const needsAction = [];

    // Check for new quotes - since quotes are handled through conversations, we'll check for projects with conversations
    const projectsWithConversations = projects.filter(
      (p) => p.status === "SUBMITTED" // Projects that are submitted and waiting for responses
    );
    if (projectsWithConversations.length > 0) {
      needsAction.push({
        id: "new_quotes",
        type: "new_quotes" as const,
        title: "New Responses",
        description: `${projectsWithConversations.length} project${projectsWithConversations.length > 1 ? "s" : ""} waiting for maker responses`,
        count: projectsWithConversations.length,
        action: "View Responses",
        actionUrl: "/creator/prints",
        priority: "medium" as const,
      });
    }

    // Check for projects needing maker selection
    const projectsNeedingMaker = projects.filter(
      (p) => p.status === "SUBMITTED" // Projects that are submitted and may have responses
    );
    if (projectsNeedingMaker.length > 0) {
      needsAction.push({
        id: "select_maker",
        type: "select_maker" as const,
        title: "Select a Maker",
        description: `${projectsNeedingMaker.length} project${projectsNeedingMaker.length > 1 ? "s" : ""} ready for maker selection`,
        count: projectsNeedingMaker.length,
        action: "Compare Responses",
        actionUrl: "/creator/prints",
        priority: "medium" as const,
      });
    }

    // Check for projects in production
    const projectsInProduction = projects.filter(
      (p) => p.status === "IN_PROGRESS"
    );
    if (projectsInProduction.length > 0) {
      needsAction.push({
        id: "in_production",
        type: "payment_due" as const, // Using payment_due type for in_production
        title: "In Production",
        description: `${projectsInProduction.length} project${projectsInProduction.length > 1 ? "s" : ""} currently being manufactured`,
        count: projectsInProduction.length,
        action: "Track Progress",
        actionUrl: "/creator/prints",
        priority: "low" as const,
      });
    }

    // Check for projects awaiting responses for too long
    const longWaitingProjects = projects.filter((p) => {
      if (p.status !== "SUBMITTED") return false;
      const waitingHours =
        (Date.now() - new Date(p.createdAt).getTime()) / (1000 * 60 * 60);
      return waitingHours > 24; // 24 hours
    });
    if (longWaitingProjects.length > 0) {
      needsAction.push({
        id: "invite_makers",
        type: "invite_makers" as const,
        title: "Invite Makers",
        description: `${longWaitingProjects.length} project${longWaitingProjects.length > 1 ? "s" : ""} waiting for responses - invite recommended makers`,
        count: longWaitingProjects.length,
        action: "Invite Makers",
        actionUrl: "/creator/prints",
        priority: "high" as const,
      });
    }

    // Build activity feed
    const activity: ActivityItem[] = [];

    // Add status change activities
    projects.forEach((p) => {
      if (p.status === "IN_PROGRESS") {
        activity.push({
          id: `production_${p.id}`,
          title: `"${p.title || `Project ${p.id}`}" moved to In Progress`,
          timestamp: new Date(p.updatedAt || p.createdAt).toLocaleDateString(),
          type: "status_change" as const,
          metadata: { printId: p.id, status: p.status },
        });
      } else if (p.status === "COMPLETED") {
        activity.push({
          id: `completed_${p.id}`,
          title: `"${p.title || `Project ${p.id}`}" has been completed`,
          timestamp: new Date(p.updatedAt || p.createdAt).toLocaleDateString(),
          type: "status_change" as const,
          metadata: { printId: p.id, status: p.status },
        });
      }
    });

    // Sort activity by timestamp
    activity.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return {
      stats,
      needsAction,
      openRequests,
      drafts,
      completed,
      activity,
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw new Error("Failed to fetch dashboard data");
  }
}

function getContextCTA(status: string): string {
  switch (status) {
    case "SUBMITTED":
      return "Invite Makers";
    case "IN_PROGRESS":
      return "Track Progress";
    case "COMPLETED":
      return "View Details";
    case "DRAFT":
      return "Continue";
    default:
      return "View Details";
  }
}

function getContextAction(status: string): string {
  switch (status) {
    case "SUBMITTED":
      return "invite";
    case "IN_PROGRESS":
      return "track";
    case "COMPLETED":
      return "view";
    case "DRAFT":
      return "edit";
    default:
      return "view";
  }
}
