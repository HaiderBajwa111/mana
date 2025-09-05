import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/app/actions/auth/get-current-user";
import db from "@/db";

export async function POST(request: NextRequest) {
  console.log("📤 [SEND_QUOTE] Starting send quote request");
  
  try {
    const currentUser = await getCurrentUser();
    console.log("📤 [SEND_QUOTE] Current user:", currentUser);
    
    if (!currentUser || !currentUser.success) {
      console.error("📤 [SEND_QUOTE] User not authenticated");
      return NextResponse.json(
        { message: "Unauthorized - User not found" },
        { status: 401 }
      );
    }
    
    if (!("user" in currentUser)) {
      console.error("📤 [SEND_QUOTE] Invalid user response structure");
      return NextResponse.json(
        { message: "Invalid user response" },
        { status: 500 }
      );
    }
    
    const userId = currentUser.user.id;
    console.log("📤 [SEND_QUOTE] User ID:", userId);

    const body = await request.json();
    const {
      projectId,
      materialCost,
      machineCost,
      laborCost,
      postProcessingCost,
      packagingCost,
      total,
      margin,
      notes,
      estimatedDeliveryDays,
      calculatorInputs,
    } = body;

    console.log("📤 [SEND_QUOTE] Request body:", {
      projectId,
      total,
      estimatedDeliveryDays,
      margin,
    });

    // Validate required fields
    if (!projectId || !total || total <= 0) {
      console.error("📤 [SEND_QUOTE] Invalid quote data", { projectId, total });
      return NextResponse.json(
        { message: "Invalid quote data - projectId and total are required" },
        { status: 400 }
      );
    }

    // Get the project and verify it exists
    const project = await db.project.findUnique({
      where: { id: projectId },
      include: {
        creator: true,
      },
    });

    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    // Get or create manufacturer profile
    let manufacturerProfile = await db.manufacturerProfile.findUnique({
      where: { userId },
    });

    console.log("📤 [SEND_QUOTE] Manufacturer profile:", manufacturerProfile);

    if (!manufacturerProfile) {
      console.log("📤 [SEND_QUOTE] Creating temporary manufacturer profile for user");
      // Create a basic manufacturer profile if it doesn't exist
      // This allows users to send quotes even if they haven't completed full maker onboarding
      manufacturerProfile = await db.manufacturerProfile.create({
        data: {
          userId,
          businessName: `${currentUser.user.firstName || 'Maker'} ${currentUser.user.lastName || ''}`.trim(),
          description: "Independent 3D printing service",
          country: "USA",
        },
      });
      console.log("📤 [SEND_QUOTE] Created manufacturer profile:", manufacturerProfile);
    }

    // Check if a quote already exists for this project from this manufacturer
    const existingQuote = await db.quote.findFirst({
      where: {
        projectId,
        manufacturerId: userId,
      },
    });

    if (existingQuote) {
      // Update existing quote
      const updatedQuote = await db.quote.update({
        where: { id: existingQuote.id },
        data: {
          price: total,
          notes: notes || `Material: $${materialCost.toFixed(2)}, Machine: $${machineCost.toFixed(2)}, Labor: $${laborCost.toFixed(2)}, Post-Processing: $${postProcessingCost.toFixed(2)}, Packaging: $${packagingCost.toFixed(2)}, Margin: ${margin}`,
          estimatedDeliveryDays,
          status: "PENDING",
          updatedAt: new Date(),
        },
      });

      console.log("📤 [SEND_QUOTE] Quote updated successfully:", updatedQuote.id);
      return NextResponse.json({
        success: true,
        message: "Quote updated successfully",
        quote: updatedQuote,
      });
    } else {
      // Create new quote
      const newQuote = await db.quote.create({
        data: {
          projectId,
          manufacturerId: userId,
          creatorId: project.creatorId,
          manufacturerProfileId: manufacturerProfile.id,
          price: total,
          notes: notes || `Material: $${materialCost.toFixed(2)}, Machine: $${machineCost.toFixed(2)}, Labor: $${laborCost.toFixed(2)}, Post-Processing: $${postProcessingCost.toFixed(2)}, Packaging: $${packagingCost.toFixed(2)}, Margin: ${margin}`,
          estimatedDeliveryDays,
          status: "PENDING",
        },
      });

      // Optionally create a notification or message for the creator
      // This depends on your notification system

      console.log("📤 [SEND_QUOTE] Quote created successfully:", newQuote.id);
      return NextResponse.json({
        success: true,
        message: "Quote sent successfully",
        quote: newQuote,
      });
    }
  } catch (error) {
    console.error("📤 [SEND_QUOTE] Error sending quote:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { 
        success: false,
        message: "Failed to send quote", 
        error: errorMessage,
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}