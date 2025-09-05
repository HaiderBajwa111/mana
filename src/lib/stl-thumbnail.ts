import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { createClient } from "@/lib/supabase/client";

export const generateSTLThumbnail = async (
  file: File,
  size: number = 128
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        const loader = new STLLoader();
        const geometry = loader.parse(arrayBuffer);

        // Create scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf0f0f0);

        // Add lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);

        // Create material
        const material = new THREE.MeshPhongMaterial({
          color: 0x156289,
          emissive: 0x072534,
          side: THREE.DoubleSide,
          flatShading: true,
        });

        // Create mesh
        const mesh = new THREE.Mesh(geometry, material);

        // Center and scale the model
        geometry.computeBoundingBox();
        const box = geometry.boundingBox!;
        const center = box.getCenter(new THREE.Vector3());
        const size_vec = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size_vec.x, size_vec.y, size_vec.z);
        const scale = 2 / maxDim;

        mesh.position.sub(center.multiplyScalar(scale));
        mesh.scale.setScalar(scale);

        scene.add(mesh);

        // Setup camera
        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
        camera.position.set(3, 3, 3);
        camera.lookAt(0, 0, 0);

        // Setup renderer
        const renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
        });
        renderer.setSize(size, size);
        renderer.setPixelRatio(1);

        // Render
        renderer.render(scene, camera);

        // Convert to data URL
        const canvas = renderer.domElement;
        const dataURL = canvas.toDataURL("image/jpeg", 0.8);

        // Cleanup
        renderer.dispose();
        geometry.dispose();
        material.dispose();

        resolve(dataURL);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsArrayBuffer(file);
  });
};

export const uploadThumbnail = async (
  thumbnailDataUrl: string,
  fileId: string
): Promise<string> => {
  try {
    const supabase = createClient();

    // Convert data URL to blob
    const response = await fetch(thumbnailDataUrl);
    const blob = await response.blob();

    // Create file from blob
    const thumbnailFile = new File([blob], `${fileId}.jpeg`, {
      type: "image/jpeg",
    });

    // Upload to Supabase storage
    const { data, error } = await supabase.storage
      .from("models")
      .upload(`${fileId}.jpeg`, thumbnailFile, {
        contentType: "image/jpeg",
        upsert: true,
      });

    if (error) throw error;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("models")
      .getPublicUrl(`${fileId}.jpeg`);

    return urlData.publicUrl;
  } catch (error) {
    console.error("Error uploading thumbnail:", error);
    throw error;
  }
};
