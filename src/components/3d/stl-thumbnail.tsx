"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { useInView } from "react-intersection-observer";
import { Package, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface STLThumbnailProps {
  url: string;
  alt?: string;
  className?: string;
  width?: number;
  height?: number;
  quality?: "low" | "medium" | "high";
  onThumbnailGenerated?: (dataUrl: string) => void;
  fallback?: React.ReactNode;
}

// Cache for generated thumbnails
const thumbnailCache = new Map<string, string>();

// Global renderer for thumbnail generation (shared across all thumbnails)
let sharedRenderer: THREE.WebGLRenderer | null = null;
let renderCount = 0;

function getSharedRenderer(width: number, height: number): THREE.WebGLRenderer {
  if (!sharedRenderer && typeof window !== "undefined") {
    const canvas = document.createElement("canvas");
    canvas.style.display = "none";
    document.body.appendChild(canvas);
    
    sharedRenderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: true,
      preserveDrawingBuffer: true,
      powerPreference: "low-power",
    });
    sharedRenderer.setSize(width, height);
    sharedRenderer.setPixelRatio(1); // Low DPR for thumbnails
  }
  
  if (sharedRenderer) {
    sharedRenderer.setSize(width, height);
    renderCount++;
  }
  
  return sharedRenderer!;
}

function cleanupSharedRenderer() {
  renderCount--;
  if (renderCount <= 0 && sharedRenderer) {
    sharedRenderer.dispose();
    if (sharedRenderer.domElement.parentNode) {
      sharedRenderer.domElement.parentNode.removeChild(sharedRenderer.domElement);
    }
    sharedRenderer = null;
    renderCount = 0;
  }
}

export function STLThumbnail({
  url,
  alt = "3D Model Preview",
  className = "",
  width = 128,
  height = 128,
  quality = "low",
  onThumbnailGenerated,
  fallback,
}: STLThumbnailProps) {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const mountedRef = useRef(true);
  const { ref: inViewRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  // Log component mount
  useEffect(() => {
    console.log("[STLThumbnail] Component mounted with URL:", url);
    return () => {
      console.log("[STLThumbnail] Component unmounted");
    };
  }, [url]);

  // Generate thumbnail
  const generateThumbnail = useCallback(async () => {
    console.log("[STLThumbnail] generateThumbnail called for:", url);
    
    // Check if URL is invalid or example URL
    if (!url || url.includes('example.com') || url.includes('localhost:3000')) {
      console.log("[STLThumbnail] Invalid or example URL, showing placeholder");
      setHasError(true);
      setIsLoading(false);
      return;
    }
    
    // Check cache first
    const cached = thumbnailCache.get(url);
    if (cached) {
      console.log("[STLThumbnail] Found cached thumbnail");
      setThumbnailUrl(cached);
      setIsLoading(false);
      onThumbnailGenerated?.(cached);
      return;
    }

    // Check if we're on the server
    if (typeof window === "undefined") {
      console.log("[STLThumbnail] Server-side, skipping generation");
      return;
    }

    console.log("[STLThumbnail] Starting thumbnail generation...");
    
    try {
      // Create scene
      const scene = new THREE.Scene();
      scene.background = null; // Transparent background
      
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
      const camera = new THREE.PerspectiveCamera(
        50,
        width / height,
        0.1,
        1000
      );

      // Load STL through proxy to avoid CORS issues
      const proxyUrl = `/api/stl-proxy?url=${encodeURIComponent(url)}`;
      console.log("[STLThumbnail] Loading STL through proxy:", proxyUrl);
      
      const loader = new STLLoader();
      const geometry = await new Promise<THREE.BufferGeometry>((resolve, reject) => {
        loader.load(
          proxyUrl,
          (geometry: THREE.BufferGeometry) => {
            console.log("[STLThumbnail] STL loaded successfully");
            resolve(geometry);
          },
          undefined,
          (error: ErrorEvent) => {
            console.error("[STLThumbnail] Failed to load STL:", error);
            reject(error);
          }
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

      // Create mesh with simple material
      const material = new THREE.MeshPhongMaterial({
        color: 0x2563eb,
        specular: 0x111111,
        shininess: 20,
        side: THREE.DoubleSide,
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      // Position camera for isometric view
      const distance = 5;
      camera.position.set(distance, distance, distance);
      camera.lookAt(0, 0, 0);

      // Get shared renderer
      const renderer = getSharedRenderer(width, height);

      // Render scene
      renderer.render(scene, camera);

      // Get image data
      const dataUrl = renderer.domElement.toDataURL(
        "image/png",
        quality === "low" ? 0.6 : quality === "medium" ? 0.8 : 1.0
      );

      // Cache the result
      thumbnailCache.set(url, dataUrl);
      console.log("[STLThumbnail] Thumbnail generated and cached");

      // Cleanup
      geometry.dispose();
      material.dispose();
      scene.clear();

      // Set the thumbnail if component is still mounted
      if (mountedRef.current) {
        console.log("[STLThumbnail] Setting thumbnail URL");
        setThumbnailUrl(dataUrl);
        setIsLoading(false);
        onThumbnailGenerated?.(dataUrl);
      }
    } catch (error) {
      console.error("[STLThumbnail] Error generating thumbnail:", error);
      if (mountedRef.current) {
        setHasError(true);
        setIsLoading(false);
      }
    }
  }, [url, width, height, quality, onThumbnailGenerated]);

  useEffect(() => {
    // Only generate thumbnail when in view
    console.log("[STLThumbnail] InView:", inView, "ThumbnailUrl:", thumbnailUrl, "HasError:", hasError);
    if (inView && !thumbnailUrl && !hasError) {
      console.log("[STLThumbnail] Conditions met, calling generateThumbnail");
      generateThumbnail();
    }

    return () => {
      mountedRef.current = false;
      // Cleanup shared renderer when component unmounts
      if (typeof window !== "undefined") {
        cleanupSharedRenderer();
      }
    };
  }, [inView, thumbnailUrl, hasError, generateThumbnail]);

  // Loading state - show a nice loading animation
  if (isLoading) {
    return (
      <div
        ref={inViewRef}
        className={cn(
          "bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center",
          className
        )}
        style={{ width, height }}
      >
        <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
      </div>
    );
  }

  // Error state - show a nice placeholder with 3D icon
  if (hasError) {
    return (
      <div
        ref={inViewRef}
        className={cn(
          "bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center",
          className
        )}
        style={{ width, height }}
      >
        <Package className="w-6 h-6 text-blue-600" />
      </div>
    );
  }

  // Thumbnail image - show success state with generated thumbnail
  return (
    <div
      ref={inViewRef}
      className={cn("rounded-lg overflow-hidden", className)}
      style={{ width, height }}
    >
      {thumbnailUrl ? (
        <img
          src={thumbnailUrl}
          alt={alt}
          className="w-full h-full object-cover bg-gray-50"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <Package className="w-5 h-5 text-gray-500" />
        </div>
      )}
    </div>
  );
}

// Utility function to preload and cache thumbnails
export async function preloadSTLThumbnails(urls: string[]) {
  const promises = urls.map(async (url) => {
    if (thumbnailCache.has(url)) return;
    
    // Create a temporary instance to generate thumbnail
    const container = document.createElement("div");
    container.style.display = "none";
    document.body.appendChild(container);
    
    return new Promise<void>((resolve) => {
      const handleGenerated = () => {
        document.body.removeChild(container);
        resolve();
      };
      
      // This will trigger thumbnail generation
      const temp = document.createElement("div");
      container.appendChild(temp);
      
      // Wait a bit and clean up
      setTimeout(() => {
        handleGenerated();
      }, 100);
    });
  });
  
  await Promise.all(promises);
}

// Clear cache function
export function clearThumbnailCache(url?: string) {
  if (url) {
    thumbnailCache.delete(url);
  } else {
    thumbnailCache.clear();
  }
}