"use client";

import { useEffect, useState } from "react";
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

interface AutoThumbnailGeneratorProps {
  projectId: string;
  stlUrl: string;
  onComplete?: (thumbnailUrl: string) => void;
  onError?: (error: string) => void;
}

export function AutoThumbnailGenerator({
  projectId,
  stlUrl,
  onComplete,
  onError,
}: AutoThumbnailGeneratorProps) {
  const [status, setStatus] = useState<"idle" | "generating" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!projectId || !stlUrl) return;

    const generateThumbnail = async () => {
      setStatus("generating");
      setMessage("Generating thumbnail...");
      
      try {
        console.log(`[Auto Thumbnail] Starting generation for project ${projectId}`);
        
        // Create offscreen canvas
        const canvas = document.createElement("canvas");
        canvas.width = 512;
        canvas.height = 512;
        canvas.style.display = "none";
        document.body.appendChild(canvas);
        
        // Setup Three.js
        const renderer = new THREE.WebGLRenderer({
          canvas,
          antialias: true,
          alpha: false,
          preserveDrawingBuffer: true,
        });
        renderer.setSize(512, 512);
        renderer.setPixelRatio(1);
        
        const scene = new THREE.Scene();
        scene.background = new THREE.Color("#f3f4f6");
        
        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);
        
        const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight1.position.set(10, 10, 10);
        scene.add(directionalLight1);
        
        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
        directionalLight2.position.set(-10, -10, -10);
        scene.add(directionalLight2);
        
        // Camera
        const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
        camera.position.set(5, 5, 5);
        camera.lookAt(0, 0, 0);
        
        // Load STL
        const loader = new STLLoader();
        const proxyUrl = `/api/stl-proxy?url=${encodeURIComponent(stlUrl)}`;
        
        const geometry = await new Promise<THREE.BufferGeometry>((resolve, reject) => {
          loader.load(
            proxyUrl,
            (geometry: THREE.BufferGeometry) => {
              console.log("[Auto Thumbnail] STL loaded successfully");
              resolve(geometry);
            },
            undefined,
            (error: ErrorEvent) => {
              console.error("[Auto Thumbnail] Failed to load STL:", error);
              reject(error);
            }
          );
        });
        
        // Center and scale
        geometry.computeBoundingBox();
        const box = geometry.boundingBox!;
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        geometry.translate(-center.x, -center.y, -center.z);
        
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2 / maxDim;
        geometry.scale(scale, scale, scale);
        
        geometry.computeVertexNormals();
        
        // Create mesh
        const material = new THREE.MeshPhongMaterial({
          color: 0x2563eb,
          specular: 0x111111,
          shininess: 20,
          side: THREE.DoubleSide,
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        
        // Render
        renderer.render(scene, camera);
        
        // Convert to data URL
        const dataUrl = canvas.toDataURL("image/png", 0.95);
        
        // Cleanup
        geometry.dispose();
        material.dispose();
        renderer.dispose();
        scene.clear();
        document.body.removeChild(canvas);
        
        console.log("[Auto Thumbnail] Sending to server...");
        
        // Send to server
        const response = await fetch("/api/generate-stl-thumbnail", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            projectId,
            thumbnailDataUrl: dataUrl,
          }),
        });
        
        if (!response.ok) {
          throw new Error("Failed to save thumbnail");
        }
        
        const result = await response.json();
        
        console.log("[Auto Thumbnail] Success:", result.thumbnailUrl);
        setStatus("success");
        setMessage("Thumbnail generated successfully!");
        onComplete?.(result.thumbnailUrl);
        
      } catch (error: any) {
        console.error("[Auto Thumbnail] Error:", error);
        setStatus("error");
        setMessage(error.message || "Failed to generate thumbnail");
        onError?.(error.message);
      }
    };
    
    generateThumbnail();
  }, [projectId, stlUrl, onComplete, onError]);

  if (status === "idle") return null;

  return (
    <div className="flex items-center gap-2 text-sm">
      {status === "generating" && (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
          <span className="text-muted-foreground">{message}</span>
        </>
      )}
      {status === "success" && (
        <>
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className="text-green-600">{message}</span>
        </>
      )}
      {status === "error" && (
        <>
          <XCircle className="w-4 h-4 text-red-500" />
          <span className="text-red-600">{message}</span>
        </>
      )}
    </div>
  );
}