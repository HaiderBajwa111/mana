import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/app/actions/auth/get-current-user";
import db from "@/db";

export async function GET(request: NextRequest) {
  console.log("📊 [GET_QUOTES] Starting get quotes request");
  
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser || !currentUser.success) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    if (!("user" in currentUser)) {
      return NextResponse.json(
        { message: "Invalid user response" },
        { status: 500 }
      );
    }
    
    const userId = currentUser.user.id;
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json(
        { message: "Project ID is required" },
        { status: 400 }
      );
    }

    console.log("📊 [GET_QUOTES] Fetching quotes for project:", projectId);

    // Get quotes for the project
    const quotes = await db.quote.findMany({
      where: {
        projectId,
        creatorId: userId,
      },
      include: {
        manufacturer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        manufacturerProfile: {
          select: {
            businessName: true,
            city: true,
            state: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log(`📊 [GET_QUOTES] Found ${quotes.length} quotes`);

    return NextResponse.json(quotes);
  } catch (error) {
    console.error("📊 [GET_QUOTES] Error fetching quotes:", error);
    return NextResponse.json(
      { message: "Failed to fetch quotes", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}