"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense, useEffect, useState, useRef } from "react";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import type { BufferGeometry } from "three";
import * as THREE from "three";
import { Button } from "@/components/ui/button";
import {
  Crosshair,
  Coins,
  CreditCard,
  Smartphone,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Scale reference objects data
const SCALE_REFERENCES = [
  {
    id: "coin",
    name: "Quarter",
    icon: Coins,
    dimensions: { width: 24.26, height: 24.26, depth: 1.75 }, // mm
    color: "#C4A484",
  },
  {
    id: "card",
    name: "Credit Card",
    icon: CreditCard,
    dimensions: { width: 85.6, height: 53.98, depth: 0.76 }, // mm
    color: "#1E40AF",
  },
  {
    id: "phone",
    name: "iPhone",
    icon: Smartphone,
    dimensions: { width: 71.5, height: 146.7, depth: 7.65 }, // mm (iPhone 14)
    color: "#1F2937",
  },
];

// Scale reference object component
function ScaleReference({
  reference,
  position = [0, 0, 0],
  baseScale = 1,
}: {
  reference: (typeof SCALE_REFERENCES)[0];
  position?: [number, number, number];
  baseScale?: number;
}) {
  return (
    <mesh position={position} scale={baseScale}>
      <boxGeometry
        args={[
          reference.dimensions.width,
          reference.dimensions.height,
          reference.dimensions.depth,
        ]}
      />
      <meshPhongMaterial
        color={reference.color}
        opacity={0.7}
        transparent={true}
        shininess={30}
      />
    </mesh>
  );
}

function STLModel({
  url,
  onModelLoaded,
  wireframe = false,
  color = "#125be3",
  scale: userScale = 100,
  scaleReference = null,
}: {
  url: string;
  onModelLoaded: (center: [number, number, number]) => void;
  wireframe?: boolean;
  color?: string;
  scale?: number;
  scaleReference?: (typeof SCALE_REFERENCES)[0] | null;
}) {
  const [geometry, setGeometry] = useState<BufferGeometry | null>(null);
  const [scale, setScale] = useState(0.5);
  const [baseScale, setBaseScale] = useState(0.5); // Store base scale for references
  const [position, setPosition] = useState<[number, number, number]>([0, 0, 0]);
  const meshRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    const loader = new STLLoader();
    loader.load(
      url, 
      (geometry: BufferGeometry) => {
      // Calculate bounding box to center the model
      geometry.computeBoundingBox();
      const boundingBox = geometry.boundingBox;

      if (boundingBox) {
        // Calculate model dimensions
        const size = new THREE.Vector3();
        boundingBox.getSize(size);

        // Calculate center point
        const center = new THREE.Vector3();
        boundingBox.getCenter(center);

        // Calculate appropriate scale to fit in view
        const maxDimension = Math.max(size.x, size.y, size.z);
        const targetSize = 50; // Target size in world units
        const calculatedBaseScale = targetSize / maxDimension;
        const newScale = calculatedBaseScale * (userScale / 100); // Apply user scale percentage

        // Set scale and position
        setBaseScale(calculatedBaseScale); // Store base scale for references
        setScale(newScale);
        const newPosition: [number, number, number] = [
          -center.x * newScale,
          -center.y * newScale,
          -center.z * newScale,
        ];
        setPosition(newPosition);

        // Notify parent component of the model's center
        onModelLoaded(newPosition);
      }

      setGeometry(geometry);
    },
    undefined, // Progress callback (optional)
    (error) => {
      console.error('Error loading STL model:', error);
    });
  }, [url, onModelLoaded]);

  // Update scale when userScale changes
  useEffect(() => {
    if (geometry && baseScale > 0) {
      const newScale = baseScale * (userScale / 100);
      setScale(newScale);

      geometry.computeBoundingBox();
      const boundingBox = geometry.boundingBox;
      if (boundingBox) {
        const center = new THREE.Vector3();
        boundingBox.getCenter(center);
        const newPosition: [number, number, number] = [
          -center.x * newScale,
          -center.y * newScale,
          -center.z * newScale,
        ];
        setPosition(newPosition);
      }
    }
  }, [userScale, geometry, baseScale]);

  if (!geometry) {
    return null;
  }

  return (
    <>
      <mesh
        ref={meshRef}
        geometry={geometry}
        scale={scale}
        position={position}
        rotation={[0, Math.PI / 2, 0]} // Rotate 90 degrees around Y-axis
      >
        {/* Professional studio material for optimal depth perception */}
        <meshPhongMaterial
          color={color}
          opacity={1}
          transparent={false}
          shininess={50}
          flatShading={true}
          specular="#ffffff"
          wireframe={wireframe}
        />
      </mesh>

      {/* Scale Reference Object */}
      {scaleReference && geometry && (
        <ScaleReference
          reference={scaleReference}
          position={[60, 0, 0]} // Position to the right of the model
          baseScale={baseScale}
        />
      )}
    </>
  );
}

interface ModelPreviewProps {
  fileUrl: string;
  isMobile?: boolean;
  wireframe?: boolean;
  view?: "iso" | "top" | "front";
  color?: string;
  scale?: number;
  showScaleReferences?: boolean;
}

export default function ModelPreview({
  fileUrl,
  isMobile = false,
  wireframe = false,
  view = "iso",
  color = "#125be3",
  scale = 100,
  showScaleReferences = false,
}: ModelPreviewProps) {
  const [modelCenter, setModelCenter] = useState<[number, number, number]>([
    0, 0, 0,
  ]);
  const [selectedReference, setSelectedReference] = useState<
    (typeof SCALE_REFERENCES)[0] | null
  >(null);
  const [isCollapsed, setIsCollapsed] = useState(true); // Collapsed by default
  const [isMounted, setIsMounted] = useState(false);
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const handleHomeClick = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  // Camera position based on view
  let cameraPosition: [number, number, number];
  switch (view) {
    case "top":
      cameraPosition = [0, 100, 0];
      break;
    case "front":
      cameraPosition = [0, 0, 100];
      break;
    case "iso":
    default:
      cameraPosition = [80, 60, 80];
      break;
  }

  if (!isMounted || typeof window === 'undefined') {
    return (
      <div className={`w-full h-full relative ${isMobile ? "" : "border rounded-xl shadow-sm bg-white"}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-6 h-6 animate-spin text-blue-500 mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">Initializing 3D viewer…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-full h-full relative ${isMobile ? "" : "border rounded-xl shadow-sm bg-white"}`}
    >
      {/* Scale Reference Panel - Only show if prop is enabled */}
      {showScaleReferences && (
        <div className="absolute top-4 left-4 z-10 flex items-start gap-2">
          {/* Toggle Button */}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setIsCollapsed(!isCollapsed);
              // Clear selected reference when collapsing
              if (!isCollapsed) {
                setSelectedReference(null);
              }
            }}
            className="bg-white/90 hover:bg-white shadow-md border px-3 py-2 flex items-center gap-2"
            title={
              isCollapsed ? "Show Scale Reference" : "Hide Scale Reference"
            }
          >
            <span className="text-xs font-medium">Scale Reference</span>
            {isCollapsed ? (
              <ChevronRight className="w-3 h-3" />
            ) : (
              <ChevronLeft className="w-3 h-3" />
            )}
          </Button>

          {/* Reference Buttons - Only show when expanded */}
          {!isCollapsed && (
            <div className="flex flex-col gap-1">
              <div className="text-xs font-medium text-muted-foreground mb-1">
                Scale Reference:
              </div>
              {SCALE_REFERENCES.map((ref) => {
                const IconComponent = ref.icon;
                return (
                  <Button
                    key={ref.id}
                    variant={
                      selectedReference?.id === ref.id ? "default" : "secondary"
                    }
                    size="sm"
                    onClick={() =>
                      setSelectedReference(
                        selectedReference?.id === ref.id ? null : ref
                      )
                    }
                    className="bg-white/90 hover:bg-white shadow-md border p-1.5 w-16 h-12 flex flex-col items-center justify-center gap-0.5"
                    title={ref.name}
                  >
                    <IconComponent className="w-3 h-3" />
                    <span className="text-xs">{ref.name.split(" ")[0]}</span>
                  </Button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Home button overlay */}
      <div className="absolute top-4 right-4 z-10">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleHomeClick}
          className="bg-white/90 hover:bg-white shadow-md border p-2"
        >
          <Crosshair className="w-4 h-4" />
        </Button>
      </div>

      <Canvas camera={{ position: cameraPosition, fov: 45 }}>
        {/* Professional studio lighting setup */}
          {/* Key light - main illumination from above and front */}
          <directionalLight
            position={[15, 20, 10]}
            intensity={1.2}
            castShadow={false}
            color="#ffffff"
          />

          {/* Fill light - soft fill from opposite side */}
          <directionalLight
            position={[-15, 10, -10]}
            intensity={0.6}
            castShadow={false}
            color="#f0f8ff"
          />

          {/* Rim light - back lighting for edge definition */}
          <directionalLight
            position={[0, -15, -20]}
            intensity={0.4}
            castShadow={false}
            color="#e6f3ff"
          />

          {/* Ambient light - overall scene illumination */}
          <ambientLight intensity={0.3} color="#f5f5f5" />

          {/* Top accent light for highlights */}
          <pointLight position={[0, 25, 0]} intensity={0.3} color="#ffffff" />

          {/* Bottom fill for undercuts */}
          <pointLight position={[0, -10, 0]} intensity={0.2} color="#f0f0f0" />

          <Suspense fallback={null}>
            <STLModel
              url={fileUrl}
              onModelLoaded={setModelCenter}
              wireframe={wireframe}
              color={color}
              scale={scale}
              scaleReference={selectedReference}
            />
          </Suspense>
        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          autoRotate={false}
          minDistance={20}
          maxDistance={200}
          target={modelCenter}
        />
      </Canvas>
    </div>
  );
}
