"use client";

import { useRef, useEffect, useState, Suspense, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useProgress, Html, PerspectiveCamera } from "@react-three/drei";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { useInView } from "react-intersection-observer";
import * as THREE from "three";
import { Loader2, Package } from "lucide-react";

interface OptimizedSTLViewerProps {
  url: string;
  className?: string;
  placeholder?: React.ReactNode;
  interactive?: boolean;
  autoRotate?: boolean;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  thumbnailMode?: boolean; // For card previews
  quality?: "low" | "medium" | "high";
}

// Loading component
function LoadingFallback() {
  const { progress } = useProgress();
  
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
        <span className="text-xs text-muted-foreground">
          {progress.toFixed(0)}%
        </span>
      </div>
    </Html>
  );
}

// STL Model Component
function STLModel({ 
  url, 
  onLoad, 
  onError,
  quality = "medium",
  autoRotate = false
}: {
  url: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  quality?: "low" | "medium" | "high";
  autoRotate?: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);
  const [loading, setLoading] = useState(true);
  const { camera, gl } = useThree();

  // Quality settings for LOD
  const qualitySettings = useMemo(() => ({
    low: { subdivisions: 0, simplify: 0.5 },
    medium: { subdivisions: 1, simplify: 0.8 },
    high: { subdivisions: 2, simplify: 1.0 }
  }), []);

  useEffect(() => {
    const loader = new STLLoader();
    
    // Use proxy to avoid CORS issues
    const proxyUrl = `/api/stl-proxy?url=${encodeURIComponent(url)}`;
    
    loader.load(
      proxyUrl,
      (loadedGeometry: THREE.BufferGeometry) => {
        // Center and scale the geometry
        loadedGeometry.computeBoundingBox();
        const box = loadedGeometry.boundingBox!;
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        // Center the geometry
        loadedGeometry.translate(-center.x, -center.y, -center.z);
        
        // Scale to fit in view
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 5 / maxDim;
        loadedGeometry.scale(scale, scale, scale);
        
        // Apply quality settings (simplified for now)
        if (quality === "low") {
          // Simplify geometry for better performance
          const vertexCount = loadedGeometry.attributes.position.count;
          if (vertexCount > 10000) {
            // Basic simplification - in production, use a proper simplification algorithm
            loadedGeometry.setAttribute(
              'position',
              new THREE.BufferAttribute(
                loadedGeometry.attributes.position.array.slice(0, 10000 * 3),
                3
              )
            );
          }
        }
        
        loadedGeometry.computeVertexNormals();
        setGeometry(loadedGeometry);
        setLoading(false);
        onLoad?.();
        
        // Adjust camera position
        if (camera instanceof THREE.PerspectiveCamera) {
          camera.position.set(0, 0, 10);
          camera.lookAt(0, 0, 0);
        }
      },
      (progress: ProgressEvent) => {
        // Progress callback
        console.log(`Loading STL: ${(progress.loaded / progress.total * 100).toFixed(0)}%`);
      },
      (error: ErrorEvent) => {
        console.error("Error loading STL:", error);
        setLoading(false);
        onError?.(new Error("Failed to load STL file"));
      }
    );

    // Cleanup
    return () => {
      if (geometry) {
        geometry.dispose();
      }
    };
  }, [url, quality, onLoad, onError, camera]);

  // Auto-rotation
  useFrame((state, delta) => {
    if (meshRef.current && autoRotate) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  if (!geometry) return null;

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshPhongMaterial
        color="#2563eb"
        specular="#444444"
        shininess={100}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// Main Optimized STL Viewer Component
export function OptimizedSTLViewer({
  url,
  className = "",
  placeholder,
  interactive = true,
  autoRotate = false,
  onLoad,
  onError,
  thumbnailMode = false,
  quality = "medium",
}: OptimizedSTLViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  
  // Use IntersectionObserver to detect when component is in viewport
  const { ref: inViewRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
    rootMargin: "50px",
  });

  // Combine refs
  useEffect(() => {
    if (containerRef.current) {
      inViewRef(containerRef.current);
    }
  }, [inViewRef]);

  // Start rendering when in view
  useEffect(() => {
    if (inView && !shouldRender) {
      setShouldRender(true);
    } else if (!inView && shouldRender && thumbnailMode) {
      // For thumbnail mode, stop rendering when out of view to save resources
      setShouldRender(false);
    }
  }, [inView, shouldRender, thumbnailMode]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = (error: Error) => {
    setHasError(true);
    onError?.(error);
  };

  // Show placeholder if not in view or not loaded
  if (!shouldRender || (!isLoaded && placeholder)) {
    return (
      <div 
        ref={containerRef}
        className={`relative bg-muted/50 rounded-lg flex items-center justify-center ${className}`}
      >
        {placeholder || (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Package className="w-8 h-8" />
            <span className="text-xs">3D Preview</span>
          </div>
        )}
      </div>
    );
  }

  if (hasError) {
    return (
      <div 
        ref={containerRef}
        className={`relative bg-red-50 rounded-lg flex items-center justify-center ${className}`}
      >
        <div className="text-center p-4">
          <Package className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <p className="text-xs text-red-600">Failed to load 3D model</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg overflow-hidden ${className}`}
    >
      {shouldRender && (
        <Canvas
          camera={{ position: [0, 0, 10], fov: 50 }}
          gl={{ 
            antialias: quality !== "low",
            alpha: true,
            powerPreference: thumbnailMode ? "low-power" : "default",
            preserveDrawingBuffer: true,
          }}
          dpr={thumbnailMode ? [1, 1] : [1, 2]} // Lower DPR for thumbnails
          frameloop={inView ? "always" : "never"} // Pause rendering when not in view
        >
          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <directionalLight position={[-10, -10, -5]} intensity={0.3} />
          
          {/* Model with Suspense */}
          <Suspense fallback={<LoadingFallback />}>
            <STLModel 
              url={url} 
              onLoad={handleLoad}
              onError={handleError}
              quality={quality}
              autoRotate={autoRotate}
            />
          </Suspense>
          
          {/* Controls */}
          {interactive && !thumbnailMode && (
            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={3}
              maxDistance={20}
              mouseButtons={{
                LEFT: THREE.MOUSE.ROTATE,
                MIDDLE: THREE.MOUSE.DOLLY,
                RIGHT: THREE.MOUSE.PAN
              }}
            />
          )}
        </Canvas>
      )}
      
      {/* Loading overlay */}
      {!isLoaded && shouldRender && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            <span className="text-xs text-muted-foreground">Loading 3D model...</span>
          </div>
        </div>
      )}
    </div>
  );
}