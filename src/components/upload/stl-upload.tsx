"use client";

import type React from "react";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, File, CheckCircle, AlertCircle, X, Eye } from "lucide-react";
import { STLViewer } from "./stl-viewer";

interface UploadedFile {
  file: File;
  url: string;
  dimensions?: {
    width: number;
    height: number;
    depth: number;
  };
  volume?: number;
}

interface STLUploadProps {
  onFileUpload?: (file: UploadedFile) => void;
  maxFileSize?: number; // in MB
  className?: string;
}

export function STLUpload({
  onFileUpload,
  maxFileSize = 50,
  className,
}: STLUploadProps) {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file type
    const validTypes = [".stl", ".obj", ".3mf", ".ply"];
    const fileExtension = file.name
      .toLowerCase()
      .substring(file.name.lastIndexOf("."));

    if (!validTypes.includes(fileExtension)) {
      return `Invalid file type. Please upload: ${validTypes.join(", ")}`;
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxFileSize) {
      return `File too large. Maximum size is ${maxFileSize}MB`;
    }

    return null;
  };

  const analyzeSTL = async (
    file: File,
  ): Promise<{ dimensions?: any; volume?: number }> => {
    // Simulate STL analysis - in a real app, you'd parse the STL file
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          dimensions: {
            width: Math.random() * 100 + 50,
            height: Math.random() * 100 + 50,
            depth: Math.random() * 100 + 50,
          },
          volume: Math.random() * 1000 + 100,
        });
      }, 1500);
    });
  };

  const handleFileSelect = useCallback(
    async (file: File) => {
      setError(null);

      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      setIsAnalyzing(true);

      try {
        // Create object URL for preview
        const url = URL.createObjectURL(file);

        // Analyze the file
        const analysis = await analyzeSTL(file);

        const uploadedFileData: UploadedFile = {
          file,
          url,
          ...analysis,
        };

        setUploadedFile(uploadedFileData);
        onFileUpload?.(uploadedFileData);
      } catch (error) {
        setError("Failed to analyze file. Please try again.");
        console.error("File analysis error:", error);
      } finally {
        setIsAnalyzing(false);
      }
    },
    [onFileUpload, maxFileSize],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect],
  );

  const removeFile = () => {
    if (uploadedFile) {
      URL.revokeObjectURL(uploadedFile.url);
    }
    setUploadedFile(null);
    setError(null);
    setShowPreview(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  const formatDimensions = (dimensions: any) => {
    if (!dimensions) return "Unknown";
    return `${dimensions.width.toFixed(1)} × ${dimensions.height.toFixed(1)} × ${dimensions.depth.toFixed(1)} mm`;
  };

  return (
    <div className={className}>
      <Card className="bg-mana-gray/30 border-mana-gray-light/20">
        <CardHeader>
          <CardTitle className="text-mana-text flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload 3D Model
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!uploadedFile ? (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ${
                isDragging
                  ? "border-mana-mint bg-mana-mint/10"
                  : "border-mana-gray-light/30 hover:border-mana-mint/50 hover:bg-mana-mint/5"
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".stl,.obj,.3mf,.ply"
                onChange={handleFileInputChange}
                className="hidden"
              />

              {isAnalyzing ? (
                <div className="space-y-4">
                  <div className="w-12 h-12 border-2 border-mana-mint border-t-transparent rounded-full animate-spin mx-auto" />
                  <div>
                    <p className="font-medium text-mana-text">
                      Analyzing your model...
                    </p>
                    <p className="text-sm text-mana-text-secondary">
                      This may take a moment
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-mana-mint/20 rounded-full flex items-center justify-center mx-auto">
                    <Upload className="w-8 h-8 text-mana-mint" />
                  </div>
                  <div>
                    <p className="font-medium text-mana-text">
                      {isDragging
                        ? "Drop your file here"
                        : "Upload your 3D model"}
                    </p>
                    <p className="text-sm text-mana-text-secondary">
                      Drag & drop or click to browse
                    </p>
                    <p className="text-xs text-mana-text-secondary mt-2">
                      Supports: STL, OBJ, 3MF, PLY (max {maxFileSize}MB)
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* File Info */}
              <div className="flex items-start justify-between p-4 bg-mana-gray/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-mana-mint/20 rounded-lg flex items-center justify-center">
                    <File className="w-5 h-5 text-mana-mint" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium text-mana-text">
                      {uploadedFile.file.name}
                    </h4>
                    <div className="flex items-center gap-4 text-sm text-mana-text-secondary">
                      <span>{formatFileSize(uploadedFile.file.size)}</span>
                      {uploadedFile.dimensions && (
                        <span>{formatDimensions(uploadedFile.dimensions)}</span>
                      )}
                      {uploadedFile.volume && (
                        <span>{uploadedFile.volume.toFixed(1)} cm³</span>
                      )}
                    </div>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Ready to print
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPreview(true)}
                    className="border-mana-mint/30 text-mana-mint hover:bg-mana-mint hover:text-mana-black"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Preview
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                    className="text-mana-text-secondary hover:text-red-400"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2">
                <Button className="flex-1 bg-mana-mint text-mana-black hover:bg-mana-mint/90">
                  Continue to Print Settings
                </Button>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="border-mana-gray-light/30"
                >
                  Upload Different File
                </Button>
              </div>
            </div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
            >
              <AlertCircle className="w-4 h-4 text-red-400" />
              <p className="text-sm text-red-400">{error}</p>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* 3D Preview Modal */}
      <AnimatePresence>
        {showPreview && uploadedFile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-mana-black border border-mana-gray-light/20 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-mana-gray-light/20">
                <h3 className="text-xl font-bold text-mana-text">
                  3D Model Preview
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPreview(false)}
                  className="text-mana-text-secondary hover:text-mana-text"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="p-6">
                <STLViewer
                  url={uploadedFile.url}
                  width="100%"
                  height="400px"
                  className="rounded-lg overflow-hidden"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
