import { NextResponse } from "next/server";
import { getCurrentUser } from "@/app/actions/auth/get-current-user";
import db from "@/db";

export async function GET() {
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

    // Get user's conversations
    const conversations = await db.conversation.findMany({
      where: {
        project: {
          OR: [
            { creatorId: userId },
            { manufacturerId: userId }
          ]
        }
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            status: true,
            creator: {
              select: {
                id: true,
                firstName: true,
                lastName: true
              }
            },
            manufacturer: {
              select: {
                id: true,
                firstName: true,
                lastName: true
              }
            }
          }
        },
        messages: {
          take: 1,
          orderBy: { createdAt: "desc" },
          include: {
            sender: {
              select: {
                id: true,
                firstName: true,
                lastName: true
              }
            }
          }
        }
      },
      orderBy: { updatedAt: "desc" }
    });

    return NextResponse.json({
      success: true,
      userId,
      conversationsCount: conversations.length,
      conversations: conversations.map(conv => ({
        id: conv.id,
        title: conv.title,
        projectTitle: conv.project.title,
        projectStatus: conv.project.status,
        lastMessage: conv.messages[0]?.content || "No messages yet",
        lastMessageSender: conv.messages[0]?.sender.firstName || "Unknown"
      }))
    });
  } catch (error) {
    console.error("Error testing chat:", error);
    return NextResponse.json(
      { message: "Failed to test chat", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

