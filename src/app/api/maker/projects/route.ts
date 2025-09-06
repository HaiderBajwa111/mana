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

    const userId = currentUser.user.id;

    // Fetch all projects for this maker:
    // 1. Available projects (not yet assigned)
    // 2. Assigned projects (where this maker is the manufacturer)
    const projects = await db.project.findMany({
      where: {
        OR: [
          // Available projects (not assigned to anyone)
          {
            status: "SUBMITTED",
            manufacturerId: null,
          },
          // Projects assigned to this maker
          {
            manufacturerId: userId,
          }
        ]
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

    const makerProjects: AvailableProject[] = await Promise.all(
      projects.map(async (project) => {
        let resolvedUrl = project.fileUrl;

        try {
          // Attempt to derive storage path from a public URL
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
          // Add project status and assignment info
          status: project.status,
          manufacturerId: project.manufacturerId,
          isAssigned: project.manufacturerId === userId,
        } as AvailableProject & { status: string; manufacturerId: string | null; isAssigned: boolean };
      })
    );

    console.log(`📋 Found ${makerProjects.length} projects for maker ${userId}`);
    makerProjects.forEach((project, index) => {
      console.log(`📄 Project ${index + 1}: ID=${project.id}, status=${project.status}, assigned=${project.isAssigned}`);
    });
    
    return NextResponse.json(makerProjects);

  } catch (error: any) {
    console.error("❌ Error fetching maker projects:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
