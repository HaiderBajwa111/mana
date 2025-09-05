import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/app/actions/auth/get-current-user";
import db from "@/db";

export async function GET(request: NextRequest) {
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

    // Get conversations for the user
    const conversations = await db.conversation.findMany({
      where: {
        project: {
          OR: [
            { creatorId: userId },
            { manufacturerId: userId },
            // Allow access to conversations for available projects (no assigned manufacturer)
            { manufacturerId: null }
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
                lastName: true,
                profilePictureUrl: true
              }
            },
            manufacturer: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profilePictureUrl: true
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

    // Filter by projectId if provided
    const filteredConversations = projectId 
      ? conversations.filter(conv => conv.projectId === projectId)
      : conversations;

    return NextResponse.json(filteredConversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { message: "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("🔍 [CONVERSATION_CREATE] Starting conversation creation");
    
    const currentUser = await getCurrentUser();
    
    if (!currentUser || !currentUser.success) {
      console.log("🔍 [CONVERSATION_CREATE] Unauthorized - no current user");
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    if (!("user" in currentUser)) {
      console.log("🔍 [CONVERSATION_CREATE] Invalid user response");
      return NextResponse.json(
        { message: "Invalid user response" },
        { status: 500 }
      );
    }
    
    const userId = currentUser.user.id;
    const body = await request.json();
    const { projectId, title } = body;
    
    console.log("🔍 [CONVERSATION_CREATE] Request data:", { userId, projectId, title });

    if (!projectId) {
      return NextResponse.json(
        { message: "Project ID is required" },
        { status: 400 }
      );
    }

    // Check if user has access to this project
    const project = await db.project.findFirst({
      where: {
        id: projectId,
        OR: [
          { creatorId: userId },
          { manufacturerId: userId },
          // Allow any authenticated user to create conversations for available projects (no assigned manufacturer)
          { manufacturerId: null }
        ]
      }
    });

    if (!project) {
      console.log("🔍 [CONVERSATION_CREATE] Project not found or access denied for projectId:", projectId);
      return NextResponse.json(
        { message: "Project not found or access denied" },
        { status: 404 }
      );
    }
    
    console.log("🔍 [CONVERSATION_CREATE] Project found:", { 
      id: project.id, 
      title: project.title, 
      creatorId: project.creatorId, 
      manufacturerId: project.manufacturerId 
    });

    // Check if conversation already exists
    const existingConversation = await db.conversation.findFirst({
      where: { projectId }
    });

    if (existingConversation) {
      console.log("🔍 [CONVERSATION_CREATE] Existing conversation found:", existingConversation.id);
      return NextResponse.json(existingConversation);
    }
    
    console.log("🔍 [CONVERSATION_CREATE] Creating new conversation...");

    // Create new conversation
    const conversation = await db.conversation.create({
      data: {
        projectId,
        title: title || `Chat about ${project.title}`
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
                lastName: true,
                profilePictureUrl: true
              }
            },
            manufacturer: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profilePictureUrl: true
              }
            }
          }
        }
      }
    });

    console.log("🔍 [CONVERSATION_CREATE] Conversation created successfully:", conversation.id);
    return NextResponse.json(conversation);
  } catch (error) {
    console.error("🔍 [CONVERSATION_CREATE] Error creating conversation:", error);
    return NextResponse.json(
      { message: "Failed to create conversation" },
      { status: 500 }
    );
  }
}

