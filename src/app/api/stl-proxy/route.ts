import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl.searchParams.get("url");
    
    if (!url) {
      return NextResponse.json(
        { error: "URL parameter is required" },
        { status: 400 }
      );
    }

    console.log("[STL Proxy] Fetching STL from:", url);

    // If it's a Supabase storage URL, we can fetch it directly
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "*/*",
      },
    });

    if (!response.ok) {
      console.error("[STL Proxy] Failed to fetch STL:", response.status, response.statusText);
      return NextResponse.json(
        { error: `Failed to fetch STL: ${response.statusText}` },
        { status: response.status }
      );
    }

    // Get the content as array buffer
    const buffer = await response.arrayBuffer();
    
    console.log("[STL Proxy] Successfully fetched STL, size:", buffer.byteLength);

    // Return the STL file with proper CORS headers
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/octet-stream",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
      },
    });
  } catch (error: any) {
    console.error("[STL Proxy] Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch STL file" },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}