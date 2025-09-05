export interface ModelDimensions {
  width: number;
  depth: number;
  height: number;
  volume: number;
}

export function parseSTLDimensions(file: File): Promise<ModelDimensions> {
  return new Promise((resolve, reject) => {
    console.log(
      "🔄 Starting STL parsing for file:",
      file.name,
      "Size:",
      file.size
    );

    const reader = new FileReader();

    // Add timeout for very large files (30+ MB)
    const timeout = file.size > 30 * 1024 * 1024 ? 30000 : 15000; // 30s for large files, 15s for others
    const timeoutId = setTimeout(() => {
      reject(new Error("Parsing timeout - file may be too large or complex"));
    }, timeout);

    reader.onload = (event) => {
      clearTimeout(timeoutId);
      try {
        const buffer = event.target?.result as ArrayBuffer;
        const data = new Uint8Array(buffer);

        console.log("📊 File loaded, size:", data.length, "bytes");

        // Check if it's a binary STL file
        // Try to read triangle count first to validate
        let isBinary = false;
        if (data.length >= 84) {
          const view = new DataView(data.buffer);
          const triangleCount = view.getUint32(80, true); // little-endian
          const triangleCountBE = view.getUint32(80, false); // big-endian

          console.log("🔍 Triangle count (LE):", triangleCount);
          console.log("🔍 Triangle count (BE):", triangleCountBE);

          // Use the smaller count (more likely to be correct)
          const validTriangleCount = Math.min(triangleCount, triangleCountBE);

          // Check if triangle count is reasonable (between 1 and 100 million)
          if (validTriangleCount > 0 && validTriangleCount < 100000000) {
            const expectedSize = 84 + validTriangleCount * 50;
            console.log("🔍 Expected file size:", expectedSize, "bytes");

            // If expected size is close to actual size, it's likely binary
            if (Math.abs(expectedSize - data.length) < 1000) {
              isBinary = true;
            }
          }
        }

        console.log("🔍 File type:", isBinary ? "Binary STL" : "ASCII STL");

        if (isBinary) {
          const result = parseBinarySTL(data);
          console.log("✅ Binary parsing successful:", result);
          resolve(result);
        } else {
          const result = parseASCIISTL(data);
          console.log("✅ ASCII parsing successful:", result);
          resolve(result);
        }
      } catch (error) {
        console.error("❌ STL parsing error:", error);
        reject(
          new Error(
            `Failed to parse STL file: ${error instanceof Error ? error.message : "Unknown error"}`
          )
        );
      }
    };

    reader.onerror = (error) => {
      clearTimeout(timeoutId);
      console.error("❌ File read error:", error);
      reject(new Error("Failed to read file"));
    };

    reader.readAsArrayBuffer(file);
  });
}

function parseBinarySTL(data: Uint8Array): ModelDimensions {
  console.log("🔧 Parsing binary STL, data length:", data.length);

  const view = new DataView(data.buffer);

  // Skip header (80 bytes)
  let offset = 80;

  // Read triangle count (4 bytes) - try both endianness
  const triangleCountLE = view.getUint32(offset, true);
  const triangleCountBE = view.getUint32(offset, false);

  // Use the smaller count (more likely to be correct)
  const triangleCount = Math.min(triangleCountLE, triangleCountBE);
  offset += 4;

  console.log("📐 Triangle count (LE):", triangleCountLE);
  console.log("📐 Triangle count (BE):", triangleCountBE);
  console.log("📐 Using triangle count:", triangleCount);

  // Validate triangle count
  if (triangleCount === 0) {
    throw new Error("No triangles found in STL file");
  }

  if (triangleCount > 100000000) {
    throw new Error(
      `Unreasonable triangle count: ${triangleCount}. File may not be a valid binary STL.`
    );
  }

  // Check if file size matches expected size (with some tolerance)
  const expectedSize = 84 + triangleCount * 50;
  console.log("📏 Expected size:", expectedSize, "Actual size:", data.length);

  if (Math.abs(expectedSize - data.length) > 1000) {
    throw new Error(
      `File size mismatch. Expected ${expectedSize} bytes, got ${data.length}. File may not be a valid binary STL.`
    );
  }

  let minX = Infinity,
    minY = Infinity,
    minZ = Infinity;
  let maxX = -Infinity,
    maxY = -Infinity,
    maxZ = -Infinity;

  // Parse each triangle (50 bytes per triangle)
  for (let i = 0; i < triangleCount; i++) {
    // Skip normal vector (12 bytes)
    offset += 12;

    // Read three vertices (36 bytes total, 12 bytes each)
    for (let j = 0; j < 3; j++) {
      const x = view.getFloat32(offset, true);
      const y = view.getFloat32(offset + 4, true);
      const z = view.getFloat32(offset + 8, true);

      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      minZ = Math.min(minZ, z);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
      maxZ = Math.max(maxZ, z);

      offset += 12;
    }

    // Skip attribute byte count (2 bytes)
    offset += 2;
  }

  const width = maxX - minX;
  const depth = maxY - minY;
  const height = maxZ - minZ;
  const volume = width * depth * height;

  console.log("📏 Bounding box:", { minX, minY, minZ, maxX, maxY, maxZ });
  console.log("📐 Dimensions:", { width, depth, height, volume });

  return {
    width: Math.abs(width),
    depth: Math.abs(depth),
    height: Math.abs(height),
    volume: Math.abs(volume),
  };
}

function parseASCIISTL(data: Uint8Array): ModelDimensions {
  console.log("🔧 Parsing ASCII STL, data length:", data.length);

  const text = new TextDecoder().decode(data);
  const lines = text.split("\n");

  console.log("📄 Text lines:", lines.length);

  let minX = Infinity,
    minY = Infinity,
    minZ = Infinity;
  let maxX = -Infinity,
    maxY = -Infinity,
    maxZ = -Infinity;

  let vertexCount = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("vertex")) {
      const parts = trimmed.split(/\s+/);
      if (parts.length >= 4) {
        const x = parseFloat(parts[1]);
        const y = parseFloat(parts[2]);
        const z = parseFloat(parts[3]);

        if (!isNaN(x) && !isNaN(y) && !isNaN(z)) {
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          minZ = Math.min(minZ, z);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
          maxZ = Math.max(maxZ, z);
          vertexCount++;
        }
      }
    }
  }

  console.log("📐 Vertex count:", vertexCount);

  if (vertexCount === 0) {
    throw new Error("No vertices found in ASCII STL file");
  }

  const width = maxX - minX;
  const depth = maxY - minY;
  const height = maxZ - minZ;
  const volume = width * depth * height;

  console.log("📏 Bounding box:", { minX, minY, minZ, maxX, maxY, maxZ });
  console.log("📐 Dimensions:", { width, depth, height, volume });

  return {
    width: Math.abs(width),
    depth: Math.abs(depth),
    height: Math.abs(height),
    volume: Math.abs(volume),
  };
}
