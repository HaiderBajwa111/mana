import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";

interface ThumbnailOptions {
  width?: number;
  height?: number;
  backgroundColor?: string;
  modelColor?: string;
  quality?: number;
}

/**
 * Generates a static thumbnail image from an STL file URL
 * This runs client-side to create thumbnails during upload
 */
export async function generateSTLThumbnail(
  stlUrl: string,
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
    console.log(`[STL Thumbnail Generator] Starting generation for URL:`, stlUrl);
    
    // Create an offscreen canvas
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.style.display = "none";
    document.body.appendChild(canvas);
    
    // Create Three.js renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      preserveDrawingBuffer: true,
    });
    
    renderer.setSize(width, height);
    renderer.setPixelRatio(1); // Keep 1:1 for thumbnails
    
    // Create scene
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
    
    // Create camera (isometric view)
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    const distance = 5;
    camera.position.set(distance, distance, distance);
    camera.lookAt(0, 0, 0);
    
    // Load STL
    const loader = new STLLoader();
    const geometry = await new Promise<THREE.BufferGeometry>((resolve, reject) => {
      // Use proxy if needed for CORS
      const proxyUrl = stlUrl.includes('supabase') || stlUrl.includes('example.com') 
        ? `/api/stl-proxy?url=${encodeURIComponent(stlUrl)}`
        : stlUrl;
        
      loader.load(
        proxyUrl,
        (geometry: THREE.BufferGeometry) => resolve(geometry),
        undefined,
        (error: ErrorEvent) => reject(error)
      );
    });
    
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
    
    // Render the scene
    renderer.render(scene, camera);
    
    // Convert canvas to blob
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(
        (blob) => resolve(blob),
        "image/png",
        quality
      );
    });
    
    // Clean up Three.js resources
    geometry.dispose();
    material.dispose();
    renderer.dispose();
    scene.clear();
    
    // Remove canvas from DOM
    document.body.removeChild(canvas);
    
    if (!blob) {
      throw new Error("Failed to generate thumbnail blob");
    }
    
    // Convert blob to base64 data URL
    const reader = new FileReader();
    const dataUrl = await new Promise<string>((resolve, reject) => {
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
    
    console.log(`[STL Thumbnail Generator] Thumbnail generated successfully`);
    
    return dataUrl;
  } catch (error) {
    console.error(`[STL Thumbnail Generator] Error generating thumbnail:`, error);
    return null;
  }
}

/**
 * Converts a data URL to a File object for upload
 */
export function dataURLtoFile(dataUrl: string, filename: string): File {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new File([u8arr], filename, { type: mime });
}

/**
 * Converts a data URL to a Blob for upload
 */
export function dataURLtoBlob(dataUrl: string): Blob {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new Blob([u8arr], { type: mime });
}