"use server";

import db from "@/db";
import { getCurrentUser } from "@/app/actions/auth/get-current-user";

export interface PrintProject {
  id: string;
  name: string;
  status: "DRAFT" | "SUBMITTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  material: string;
  color: string;
  quantity: number;
  price: number;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  imageUrl?: string;
  deadline?: Date;
}

export interface GetUserPrintsParams {
  userId: string;
  page: number;
  limit: number;
  status?: string;
  search?: string;
}

export interface GetUserPrintsResult {
  prints: PrintProject[];
  hasMore: boolean;
  totalCount: number;
  nextPage: number | null;
}

export async function getUserPrints({
  userId,
  page = 1,
  limit = 9,
  status,
  search,
}: GetUserPrintsParams): Promise<GetUserPrintsResult> {
  try {
    // Verify user is authenticated
    const currentUser = await getCurrentUser();
    if (!currentUser.success || !("user" in currentUser)) {
      throw new Error("Unauthorized");
    }

    // Verify user is requesting their own prints
    if (currentUser.user.id !== userId) {
      throw new Error("Unauthorized to access these prints");
    }

    // Build the base query using Prisma
    const whereClause: any = { creatorId: userId };

    // Add status filter if provided
    if (status && status !== "all") {
      whereClause.status = status;
    }

    // Add search filter if provided
    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { material: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get total count for pagination
    const totalCount = await db.project.count({
      where: whereClause,
    });

    // Get projects with pagination
    const projects = await db.project.findMany({
      where: whereClause,
      select: {
        id: true,
        title: true,
        status: true,
        material: true,
        color: true,
        quantity: true,
        resolution: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        creatorId: true,
        referenceImageUrl: true,
        deadline: true,
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Transform the data to match our interface
    const transformedPrints: PrintProject[] = projects.map((project) => ({
      id: project.id.toString(),
      name: project.title || `Project ${project.id}`,
      status: project.status as PrintProject["status"],
      material: project.material,
      color: project.color,
      quantity: project.quantity,
      price: 0, // Default to 0 since we don't have a price field
      description: project.description,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt || project.createdAt,
      userId: project.creatorId,
      imageUrl: project.referenceImageUrl || undefined,
      deadline: project.deadline || undefined,
    }));

    // Calculate pagination info
    const hasMore = (page - 1) * limit + projects.length < totalCount;
    const nextPage = hasMore ? page + 1 : null;

    return {
      prints: transformedPrints,
      hasMore,
      totalCount,
      nextPage,
    };
  } catch (error) {
    console.error("Error fetching user prints:", error);
    throw new Error("Failed to fetch prints");
  }
}

export async function getUserPrintsCount(userId: string): Promise<number> {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser.success || !("user" in currentUser)) {
      throw new Error("Unauthorized");
    }

    if (currentUser.user.id !== userId) {
      throw new Error("Unauthorized to access these prints");
    }

    const result = await db.project.count({
      where: { creatorId: userId },
    });

    return result;
  } catch (error) {
    console.error("Error fetching user prints count:", error);
    throw new Error("Failed to fetch prints count");
  }
}

export async function getUserPrintsStatusCounts(userId: string): Promise<{
  all: number;
  SUBMITTED: number;
  IN_PROGRESS: number;
  COMPLETED: number;
  CANCELLED: number;
}> {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser.success || !("user" in currentUser)) {
      throw new Error("Unauthorized");
    }

    if (currentUser.user.id !== userId) {
      throw new Error("Unauthorized to access these prints");
    }

    // Get counts for all statuses in parallel
    const [
      allCount,
      submittedCount,
      inProgressCount,
      completedCount,
      cancelledCount,
    ] = await Promise.all([
      db.project.count({ where: { creatorId: userId } }),
      db.project.count({ where: { creatorId: userId, status: "SUBMITTED" } }),
      db.project.count({ where: { creatorId: userId, status: "IN_PROGRESS" } }),
      db.project.count({ where: { creatorId: userId, status: "COMPLETED" } }),
      db.project.count({ where: { creatorId: userId, status: "CANCELLED" } }),
    ]);

    return {
      all: allCount,
      SUBMITTED: submittedCount,
      IN_PROGRESS: inProgressCount,
      COMPLETED: completedCount,
      CANCELLED: cancelledCount,
    };
  } catch (error) {
    console.error("Error fetching user prints status counts:", error);
    throw new Error("Failed to fetch prints status counts");
  }
}
