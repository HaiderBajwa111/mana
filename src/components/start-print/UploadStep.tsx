import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Upload,
  HelpCircle,
  Loader2,
  Smartphone,
  UploadCloud,
  File as FileIcon,
} from "lucide-react";
import ModelPreview from "./ModelPreview";
import { parseSTLDimensions, type ModelDimensions } from "@/lib/stl-parser";
import { AnalyzingIndicator } from "./AnalyzingIndicator";
import { Badge } from "@/components/ui/badge";

interface UploadStepProps {
  file: File | null;
  setFile: (file: File | null) => void;
  error: string | null;
  setError: (err: string | null) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onNext: () => void;
  MAX_SIZE_MB: number;
  onDimensionsDetected?: (dimensions: ModelDimensions | null) => void;
  onBack?: () => void;
}

export const UploadStep: React.FC<UploadStepProps> = ({
  file,
  setFile,
  error,
  setError,
  fileInputRef,
  onNext,
  MAX_SIZE_MB,
  onDimensionsDetected,
  onBack,
}) => {
  const [fileUrl, setFileUrl] = useState<string>("");
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Add wireframe and orientation state
  const [showWireframe, setShowWireframe] = useState(false);
  const [view, setView] = useState<"iso" | "top" | "front">("iso");
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setFileUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setFileUrl("");
    }
  }, [file]);

  const handleReupload = () => {
    setFile(null);
    setError(null);
    setFileUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validateAndSetFile = async (f?: File) => {
    if (!f) return;

    const allowedExtensions = [".stl", ".obj", ".3mf"];
    const fileExtension = f.name
      .toLowerCase()
      .substring(f.name.lastIndexOf("."));

    if (!allowedExtensions.includes(fileExtension)) {
      setError("Only .stl, .obj, and .3mf files are allowed.");
      setFile(null);
      return;
    }

    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File must be less than ${MAX_SIZE_MB}MB.`);
      setFile(null);
      return;
    }

    setFile(f);
    setError(null);

    // Parse dimensions for STL files
    if (fileExtension === ".stl" && onDimensionsDetected) {
      setIsAnalyzing(true);
      try {
        const dimensions = await parseSTLDimensions(f);
        onDimensionsDetected(dimensions);
      } catch (error) {
        console.warn("Failed to parse STL dimensions:", error);
        // Show user-friendly error message for timeout
        if (error instanceof Error && error.message.includes("timeout")) {
          setError(
            "File is too large to analyze. You can continue without dimension analysis."
          );
        }
        // Don't fail the upload, just log the warning
        onDimensionsDetected(null);
      } finally {
        setIsAnalyzing(false);
      }
    } else if (onDimensionsDetected) {
      // For non-STL files, we could implement OBJ/3MF parsing later
      // For now, set a placeholder or null
      onDimensionsDetected(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const handleBrowse = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    validateAndSetFile(selectedFile);
  };

  const toggleTooltip = () => {
    setActiveTooltip(activeTooltip === "preview" ? null : "preview");
  };

  // Helper for file metadata
  const getFileExtension = (name?: string) =>
    name?.split(".").pop()?.toLowerCase() || "";
  const formatFileSize = (size: number) =>
    `${(size / 1024 / 1024).toFixed(2)} MB`;

  return (
    <Card
      ref={cardRef}
      className={
        isMobile
          ? "w-full h-full min-h-screen rounded-none shadow-none border-0"
          : "w-full max-w-2xl bg-card rounded-lg border shadow-sm"
      }
    >
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Upload your 3D model</CardTitle>
      </CardHeader>
      <CardContent>
        {!fileUrl ? (
          <div
            className="w-full flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-border rounded-lg p-10 bg-muted/30 hover:bg-muted transition-colors text-center"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={handleBrowse}
          >
            <UploadCloud className="w-12 h-12 text-primary mb-3" />
            <span className="font-medium text-base mb-1">
              Drag & drop or click to browse
            </span>
            <p className="text-sm text-muted-foreground">
              Supports: .stl, .obj, .3mf · Max size: {MAX_SIZE_MB}MB
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".stl,.obj,.3mf"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        ) : (
          <div className="w-full flex flex-col items-center gap-4">
            <div className="flex flex-col items-center w-full mb-4">
              <div className="flex items-center gap-3 justify-center mb-2">
                <FileIcon className="w-6 h-6 text-primary" />
                <span className="font-medium truncate max-w-[12rem]">
                  {file?.name}
                </span>
                <Badge variant="secondary">Uploaded</Badge>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  tabIndex={0}
                >
                  Replace file
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".stl,.obj,.3mf"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground justify-center">
                <span>Size: {file ? formatFileSize(file.size) : "--"}</span>
                <span>Format: .{getFileExtension(file?.name)}</span>
              </div>
            </div>
            <div className="relative w-full h-80 flex items-center justify-center">
              <div className="absolute top-4 left-4 z-10 flex">
                <Button
                  variant={showWireframe ? "secondary" : "outline"}
                  size="icon"
                  className="p-2"
                  onClick={() => setShowWireframe((w) => !w)}
                  title="Toggle wireframe"
                >
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                    <path
                      d="M3 3h18v18H3V3zm2 2v14h14V5H5zm2 2h10v10H7V7z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </Button>
              </div>
              <ModelPreview
                fileUrl={fileUrl}
                isMobile={isMobile}
                wireframe={showWireframe}
                view={view}
              />
            </div>
          </div>
        )}
        {error && (
          <div className="mt-3 text-sm text-destructive text-center px-4">
            {error}
          </div>
        )}
      </CardContent>
      {fileUrl && (
        <CardFooter className="justify-center">
          <Button
            size="lg"
            className="w-48"
            onClick={onNext}
            disabled={!file || !!error || isAnalyzing}
            data-tooltip={!file ? "Upload a file to continue" : undefined}
          >
            Next
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
