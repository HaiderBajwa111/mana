import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/app/actions/auth/get-current-user";
import db from "@/db";

export async function POST(request: NextRequest) {
  console.log("✅ [ACCEPT_QUOTE] Starting accept quote request");
  
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
    const body = await request.json();
    const { quoteId, projectId } = body;

    if (!quoteId || !projectId) {
      return NextResponse.json(
        { message: "Quote ID and Project ID are required" },
        { status: 400 }
      );
    }

    console.log("✅ [ACCEPT_QUOTE] Accepting quote:", quoteId, "for project:", projectId);

    // Verify the quote belongs to this user
    const quote = await db.quote.findUnique({
      where: { id: quoteId },
      include: {
        project: true,
      },
    });

    if (!quote) {
      return NextResponse.json(
        { message: "Quote not found" },
        { status: 404 }
      );
    }

    if (quote.creatorId !== userId) {
      return NextResponse.json(
        { message: "Unauthorized to accept this quote" },
        { status: 403 }
      );
    }

    // Update quote status to ACCEPTED
    const updatedQuote = await db.quote.update({
      where: { id: quoteId },
      data: {
        status: "ACCEPTED",
        updatedAt: new Date(),
      },
    });

    // Update project status and assign manufacturer
    await db.project.update({
      where: { id: projectId },
      data: {
        status: "IN_PROGRESS",
        manufacturerId: quote.manufacturerId,
        updatedAt: new Date(),
      },
    });

    // Optionally reject other pending quotes for this project
    await db.quote.updateMany({
      where: {
        projectId,
        id: { not: quoteId },
        status: "PENDING",
      },
      data: {
        status: "REJECTED",
        updatedAt: new Date(),
      },
    });

    console.log("✅ [ACCEPT_QUOTE] Quote accepted successfully");

    return NextResponse.json({
      success: true,
      message: "Quote accepted successfully",
      quote: updatedQuote,
    });
  } catch (error) {
    console.error("✅ [ACCEPT_QUOTE] Error accepting quote:", error);
    return NextResponse.json(
      { message: "Failed to accept quote", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}