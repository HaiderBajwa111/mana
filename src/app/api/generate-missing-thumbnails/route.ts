import { NextRequest, NextResponse } from "next/server";
import db from "@/db";

export async function GET(request: NextRequest) {
  try {
    // Find all projects without thumbnails
    const projectsWithoutThumbnails = await db.project.findMany({
      where: {
        OR: [
          { thumbnailUrl: null },
          { thumbnailUrl: "" },
          // Skip projects that already have local thumbnails
          { 
            NOT: {
              thumbnailUrl: {
                startsWith: "/thumbnails/"
              }
            }
          }
        ]
      },
      select: {
        id: true,
        fileUrl: true,
        title: true,
      },
    });

    console.log(`[Generate Missing Thumbnails] Found ${projectsWithoutThumbnails.length} projects without thumbnails`);

    // Update each project to use local thumbnail path
    const updates = await Promise.all(
      projectsWithoutThumbnails.map(async (project) => {
        const thumbnailPath = `/thumbnails/${project.id}.png`;
        
        try {
          await db.project.update({
            where: { id: project.id },
            data: { thumbnailUrl: thumbnailPath },
          });
          
          return {
            projectId: project.id,
            title: project.title,
            fileUrl: project.fileUrl,
            thumbnailPath,
            status: "updated",
          };
        } catch (error) {
          console.error(`Failed to update project ${project.id}:`, error);
          return {
            projectId: project.id,
            title: project.title,
            status: "error",
          };
        }
      })
    );

    return NextResponse.json({
      success: true,
      totalProjects: projectsWithoutThumbnails.length,
      updates,
      message: "Thumbnail paths updated. Client-side generation needed for actual images.",
    });
  } catch (error: any) {
    console.error("[Generate Missing Thumbnails] Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process thumbnails" },
      { status: 500 }
    );
  }
}