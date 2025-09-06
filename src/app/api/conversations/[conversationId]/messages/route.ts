import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/app/actions/auth/get-current-user";
import db from "@/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { conversationId: string } }
) {
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
    const { conversationId } = params;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Verify user has access to this conversation
    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId,
        project: {
          OR: [
            { creatorId: userId },
            { manufacturerId: userId }
          ]
        }
      }
    });

    if (!conversation) {
      return NextResponse.json(
        { message: "Conversation not found or access denied" },
        { status: 404 }
      );
    }

    // Get messages
    const messages = await db.message.findMany({
      where: { conversationId },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePictureUrl: true
          }
        },
        fileAttachments: {
          select: {
            id: true,
            fileName: true,
            fileType: true,
            fileSize: true,
            fileUrl: true,
            mimeType: true
          }
        }
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset
    });

    // Mark messages as read for the current user
    await db.message.updateMany({
      where: {
        conversationId,
        senderId: { not: userId },
        isRead: false
      },
      data: { isRead: true }
    });

    return NextResponse.json(messages.reverse()); // Reverse to show oldest first
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { message: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { conversationId: string } }
) {
  try {
    console.log("🔍 [MESSAGE_CREATE] Starting message creation");
    
    const currentUser = await getCurrentUser();
    
    if (!currentUser || !currentUser.success) {
      console.log("🔍 [MESSAGE_CREATE] Unauthorized - no current user");
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    if (!("user" in currentUser)) {
      console.log("🔍 [MESSAGE_CREATE] Invalid user response");
      return NextResponse.json(
        { message: "Invalid user response" },
        { status: 500 }
      );
    }
    
    const userId = currentUser.user.id;
    const { conversationId } = params;
    const body = await request.json();
    const { content, fileAttachments = [] } = body;
    
    console.log("🔍 [MESSAGE_CREATE] Request data:", { 
      userId, 
      conversationId, 
      hasContent: !!content?.trim(), 
      fileAttachmentCount: fileAttachments.length 
    });

    if (!content?.trim() && fileAttachments.length === 0) {
      return NextResponse.json(
        { message: "Message content or file attachments are required" },
        { status: 400 }
      );
    }

    // Verify user has access to this conversation
    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId,
        project: {
          OR: [
            { creatorId: userId },
            { manufacturerId: userId }
          ]
        }
      }
    });

    if (!conversation) {
      return NextResponse.json(
        { message: "Conversation not found or access denied" },
        { status: 404 }
      );
    }

    // Create message
    const message = await db.message.create({
      data: {
        conversationId,
        senderId: userId,
        content: content.trim(),
        fileAttachments: {
          create: fileAttachments.map((attachment: any) => ({
            userId,
            fileName: attachment.fileName,
            fileType: attachment.fileType,
            fileSize: attachment.fileSize,
            fileUrl: attachment.fileUrl,
            mimeType: attachment.mimeType
          }))
        }
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePictureUrl: true
          }
        },
        fileAttachments: {
          select: {
            id: true,
            fileName: true,
            fileType: true,
            fileSize: true,
            fileUrl: true,
            mimeType: true
          }
        }
      }
    });

    // Update conversation's updatedAt timestamp
    await db.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() }
    });

    console.log("🔍 [MESSAGE_CREATE] Message created successfully:", message.id);
    return NextResponse.json(message);
  } catch (error) {
    console.error("🔍 [MESSAGE_CREATE] Error creating message:", error);
    return NextResponse.json(
      { message: "Failed to create message" },
      { status: 500 }
    );
  }
}

