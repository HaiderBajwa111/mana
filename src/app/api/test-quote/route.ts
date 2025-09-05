import { NextResponse } from "next/server";
import { getCurrentUser } from "@/app/actions/auth/get-current-user";

export async function GET() {
  console.log("🧪 [TEST_QUOTE] Testing authentication");
  
  try {
    const currentUser = await getCurrentUser();
    console.log("🧪 [TEST_QUOTE] User result:", currentUser);
    
    if (!currentUser || !currentUser.success) {
      return NextResponse.json(
        { 
          authenticated: false,
          message: "User not authenticated",
          details: currentUser
        },
        { status: 401 }
      );
    }
    
    return NextResponse.json({
      authenticated: true,
      user: "user" in currentUser ? currentUser.user : null,
      message: "Authentication successful"
    });
  } catch (error) {
    console.error("🧪 [TEST_QUOTE] Error:", error);
    return NextResponse.json(
      { 
        authenticated: false,
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}