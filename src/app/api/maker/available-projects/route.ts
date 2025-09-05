import { NextResponse } from "next/server";
import { getCurrentUser } from "@/app/actions/auth/get-current-user";
import db from "@/db";
import { createClient } from "@/lib/supabase/server";
import { type AvailableProject } from "@/types/maker";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser.success) {
      return NextResponse.json(
        { error: "Unauthorized - User not found" },
        { status: 401 }
      );
    }
    
    if (!("user" in currentUser)) {
      return NextResponse.json(
        { error: "Invalid user response" },
        { status: 500 }
      );
    }

    // Allow any authenticated user to view available projects
    // This enables testing and allows users with both roles to access

    // Fetch projects that are submitted but not yet assigned to a manufacturer
    const projects = await db.project.findMany({
      where: {
        status: "SUBMITTED",
        manufacturerId: null, // Not yet assigned to a maker
      },
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            creatorProfile: {
              select: {
                location: true,
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    // Create signed URLs for STL files to ensure accessibility
    const supabase = await createClient();

    const availableProjects: AvailableProject[] = await Promise.all(
      projects.map(async (project) => {
        let resolvedUrl = project.fileUrl;

        try {
          // Attempt to derive storage path from a public URL
          // Example: https://<proj>.supabase.co/storage/v1/object/public/main/<path>
          const publicPrefix = "/storage/v1/object/public/main/";
          const idx = project.fileUrl.indexOf(publicPrefix);
          if (idx !== -1) {
            const path = project.fileUrl.substring(idx + publicPrefix.length);
            const { data: signed, error: signErr } = await supabase
              .storage
              .from("main")
              .createSignedUrl(path, 60 * 60); // 1 hour
            if (!signErr && signed?.signedUrl) {
              resolvedUrl = signed.signedUrl;
            }
          }
        } catch (e) {
          // Fall back to original URL
        }

        return {
          id: project.id,
          title: project.title,
          description: project.description,
          fileName: project.fileName,
          fileUrl: resolvedUrl,
          thumbnailUrl: project.thumbnailUrl,
          fileSize: project.fileSize,
          quantity: project.quantity,
          material: project.material,
          color: project.color,
          customColor: project.customColor || undefined,
          finish: project.finish,
          infill: project.infill,
          infillPattern: project.infillPattern,
          resolution: project.resolution,
          scale: project.scale,
          designNotes: project.designNotes || undefined,
          referenceImageUrl: project.referenceImageUrl || undefined,
          deadline: project.deadline || undefined,
          createdAt: project.createdAt,
          creator: {
            id: project.creator.id,
            firstName: project.creator.firstName || "Unknown",
            lastName: project.creator.lastName || "User",
          },
          city: "Unknown",
          state: "Unknown",
          country: "Unknown",
          coordinates: undefined,
        } as AvailableProject;
      })
    );

    console.log(`📋 Found ${availableProjects.length} available projects for maker`);
    availableProjects.forEach((project, index) => {
      console.log(`📄 Project ${index + 1}: ID=${project.id}, fileUrl="${project.fileUrl}", original="${projects[index].fileUrl}"`);
    });
    
    return NextResponse.json(availableProjects);

  } catch (error: any) {
    console.error("❌ Error fetching available projects:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch projects" },
      { status: 500 }
    );
  }
}