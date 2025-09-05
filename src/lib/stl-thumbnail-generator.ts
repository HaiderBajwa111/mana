import { createClient } from "@/lib/supabase/server";
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { createCanvas } from "canvas";

interface ThumbnailOptions {
  width?: number;
  height?: number;
  backgroundColor?: string;
  modelColor?: string;
  quality?: number;
}

/**
 * Generates a static thumbnail image from an STL file URL
 * This runs server-side to create thumbnails once during upload
 */
export async function generateSTLThumbnail(
  stlUrl: string,
  projectId: string,
  options: ThumbnailOptions = {}
): Promise<string | null> {
  const {
    width = 256,
    height = 256,
    backgroundColor = "#f3f4f6",
    modelColor = "#2563eb",
    quality = 0.9,
  } = options;

  try {
    console.log(`[STL Thumbnail Generator] Starting generation for project ${projectId}`);
    
    // Fetch the STL file
    const response = await fetch(stlUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch STL: ${response.statusText}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const loader = new STLLoader();
    
    // Parse STL from buffer
    const geometry = loader.parse(arrayBuffer);
    
    // Create a canvas for server-side rendering
    const canvas = createCanvas(width, height);
    const gl = require('gl')(width, height, { preserveDrawingBuffer: true });
    
    // Create Three.js scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(backgroundColor);
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight1.position.set(10, 10, 10);
    scene.add(directionalLight1);
    
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight2.position.set(-10, -10, -10);
    scene.add(directionalLight2);
    
    // Center and scale geometry
    geometry.computeBoundingBox();
    const box = geometry.boundingBox!;
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    
    // Center the geometry
    geometry.translate(-center.x, -center.y, -center.z);
    
    // Scale to fit
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 2 / maxDim;
    geometry.scale(scale, scale, scale);
    
    // Compute normals for better lighting
    geometry.computeVertexNormals();
    
    // Create mesh with material
    const material = new THREE.MeshPhongMaterial({
      color: new THREE.Color(modelColor),
      specular: 0x111111,
      shininess: 20,
      side: THREE.DoubleSide,
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    
    // Create camera (isometric view)
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    const distance = 5;
    camera.position.set(distance, distance, distance);
    camera.lookAt(0, 0, 0);
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas as any,
      context: gl,
      antialias: true,
      alpha: false,
      preserveDrawingBuffer: true,
    });
    
    renderer.setSize(width, height);
    renderer.setPixelRatio(1); // Keep 1:1 for server-side
    
    // Render the scene
    renderer.render(scene, camera);
    
    // Convert canvas to buffer
    const buffer = canvas.toBuffer('image/png', { quality });
    
    // Clean up Three.js resources
    geometry.dispose();
    material.dispose();
    renderer.dispose();
    
    // Upload thumbnail to Supabase storage
    const supabase = await createClient();
    const fileName = `thumbnails/${projectId}.png`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("main")
      .upload(fileName, buffer, {
        contentType: "image/png",
        upsert: true, // Replace if exists
      });
    
    if (uploadError) {
      console.error(`[STL Thumbnail Generator] Upload error:`, uploadError);
      throw uploadError;
    }
    
    // Get public URL for the thumbnail
    const { data: urlData } = supabase.storage
      .from("main")
      .getPublicUrl(fileName);
    
    console.log(`[STL Thumbnail Generator] Thumbnail generated and saved: ${urlData.publicUrl}`);
    
    return urlData.publicUrl;
  } catch (error) {
    console.error(`[STL Thumbnail Generator] Error generating thumbnail:`, error);
    return null;
  }
}

/**
 * Deletes a thumbnail from storage
 */
export async function deleteSTLThumbnail(projectId: string): Promise<boolean> {
  try {
    const supabase = await createClient();
    const fileName = `thumbnails/${projectId}.png`;
    
    const { error } = await supabase.storage
      .from("main")
      .remove([fileName]);
    
    if (error) {
      console.error(`[STL Thumbnail Generator] Delete error:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`[STL Thumbnail Generator] Error deleting thumbnail:`, error);
    return false;
  }
}

/**
 * Checks if a thumbnail exists for a project
 */
export async function thumbnailExists(projectId: string): Promise<boolean> {
  try {
    const supabase = await createClient();
    const fileName = `thumbnails/${projectId}.png`;
    
    const { data, error } = await supabase.storage
      .from("main")
      .list("thumbnails", {
        search: `${projectId}.png`,
      });
    
    if (error) {
      console.error(`[STL Thumbnail Generator] List error:`, error);
      return false;
    }
    
    return data && data.length > 0;
  } catch (error) {
    console.error(`[STL Thumbnail Generator] Error checking thumbnail:`, error);
    return false;
  }
}