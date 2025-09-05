"use client";

import React, { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileText, ExternalLink, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { useSidebar } from "@/contexts/sidebar-context";
import Link from "next/link";

export const EmptyStateView: React.FC<{ user: any }> = ({ user }) => {
  const router = useRouter();
  const { isMinimized } = useSidebar();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    // Trigger the hidden file input
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      const ext = selectedFile.name
        .toLowerCase()
        .substring(selectedFile.name.lastIndexOf("."));
      if ([".stl", ".obj", ".3mf"].includes(ext)) {
        setIsUploading(true);

        // Simulate upload process
        setTimeout(() => {
          setIsUploading(false);

          // Store the actual file object in a global variable that persists across navigation
          (window as any).__transferredFile = selectedFile;

          toast({
            title: "Model uploaded successfully! 🎉",
            description: `${selectedFile.name} is ready for printing.`,
          });

          // Navigate to start-print with a flag to skip upload step
          router.push("/creator/start-print?skipUpload=true");
        }, 1500);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload an STL, OBJ, or 3MF file.",
          variant: "destructive",
        });
      }
    }

    // Reset the input value so the same file can be selected again
    if (event.target) {
      event.target.value = "";
    }
  };

  const handleSampleSTLClick = () => {
    window.open("https://www.thingiverse.com/thing:763622", "_blank");
  };

  // Drag and drop functionality
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      const validFile = files.find((file) => {
        const ext = file.name
          .toLowerCase()
          .substring(file.name.lastIndexOf("."));
        return [".stl", ".obj", ".3mf"].includes(ext);
      });

      if (validFile) {
        setIsUploading(true);
        // Simulate upload process
        setTimeout(() => {
          setIsUploading(false);

          // Store the actual file object in a global variable that persists across navigation
          // This is a simple but effective way to transfer the file
          (window as any).__transferredFile = validFile;

          toast({
            title: "Model uploaded successfully! 🎉",
            description: `${validFile.name} is ready for printing.`,
          });

          // Navigate to start-print with a flag to skip upload step
          router.push("/creator/start-print?skipUpload=true");
        }, 1500);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload an STL, OBJ, or 3MF file.",
          variant: "destructive",
        });
      }
    },
    [router]
  );

  return (
    <div className="min-h-[600px] px-4 py-6">
      {/* Hidden file input for upload button */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".stl,.obj,.3mf"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Parent flex-col container */}
      <div
        className={`w-full transition-all duration-300 flex flex-col space-y-8 ${
          isMinimized ? "max-w-6xl" : "max-w-5xl"
        } mx-auto`}
      >
        {/* Welcome Header Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-start"
        >
          <h1 className="text-3xl font-semibold text-foreground mb-3">
            👋 Welcome, {user.firstName || "there"}!
          </h1>
          <p className="text-xl text-muted-foreground">
            Let's start your first 3D print.
          </p>
        </motion.div>

        {/* Content Container - 2 rows layout */}
        <div className="space-y-6">
          {/* First Row - Upload Area and Help Section */}
          <div className="flex flex-col md:flex-row gap-6 min-h-[300px]">
            {/* Blue Section - Upload Area */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex-1"
            >
              <Card
                className={`h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed transition-all duration-200 hover:shadow-md border-blue-300 bg-blue-50/50 ${
                  isDragging
                    ? "border-blue-500 bg-blue-100/70 shadow-lg scale-[1.02]"
                    : "hover:border-blue-400"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <CardContent className="space-y-6 text-center flex flex-col items-center justify-center">
                  {/* Animated upload icon */}
                  <div className="text-blue-600">
                    {isUploading ? (
                      <div className="w-12 h-12 mx-auto mb-4 text-green-500">
                        <CheckCircle className="w-12 h-12" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 mb-4">
                        <Upload className="w-12 h-12" />
                      </div>
                    )}
                  </div>

                  {/* Improved typography hierarchy */}
                  <h2 className="text-xl font-semibold text-foreground">
                    Start by uploading a model
                  </h2>
                  <p className="text-gray-600 text-base">
                    {isDragging
                      ? "Drop your file here!"
                      : "Upload your STL or 3MF file to get matched with a Maker who can print your part. You can also drag and drop files here."}
                  </p>

                  {/* Enhanced upload button */}
                  <Button
                    onClick={handleUploadClick}
                    size="lg"
                    disabled={isUploading}
                    className="mt-6 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 bg-blue-600 hover:bg-blue-700"
                  >
                    {isUploading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-4 h-4 mr-2"
                        >
                          <Upload className="w-4 h-4" />
                        </motion.div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload a Model
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Green Section - Empty State Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex-1"
            >
              <Card className="h-full bg-white border-border p-6 flex flex-col justify-between">
                <div className="flex flex-col items-center justify-center my-auto ">
                  <div id="empty-state-message" className="">
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      📦 Nothing here yet...
                    </h3>
                    <p className="text-sm text-gray-600 mb-6">
                      You haven't submitted any print jobs.
                    </p>
                  </div>
                  <div id="help-section" className="space-y-4 mt-auto">
                    <h4 className="text-lg font-medium text-foreground">
                      🧠 Not sure what to upload?
                    </h4>
                    <div className="flex flex-col gap-3">
                      <Button
                        variant="outline"
                        onClick={handleSampleSTLClick}
                        className="flex items-center gap-2 hover:shadow-md transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-500/20 border-blue-800 hover:border-blue-900 hover:bg-blue-50"
                      >
                        <FileText className="w-4 h-4" />
                        Try our sample STL file
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="outline"
                        asChild
                        className="flex items-center gap-2 hover:shadow-md transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-500/20 border-blue-800 hover:border-blue-900 hover:bg-blue-50"
                      >
                        <Link
                          href="/guides/beginners"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FileText className="w-4 h-4" />
                          Read our beginner's guide
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Second Row - Projects Section (Full Width) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-full"
          >
            <Card className="w-full bg-gray-50 border-gray-300 p-6 min-h-[200px] hover:shadow-md transition-all duration-200">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Your Prints
              </h2>
              <div className="flex flex-col items-center justify-center h-full text-center">
                <p className="text-gray-500 text-sm">
                  Your print jobs and project history will appear here once you
                  start uploading models.
                </p>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Optional: Background pattern */}
        <div className="absolute inset-0 -z-10 opacity-5 pointer-events-none">
          <svg viewBox="0 0 400 300" className="w-full h-full">
            <defs>
              <pattern
                id="grid"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 20 0 L 0 0 0 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="400" height="300" fill="url(#grid)" />
          </svg>
        </div>
      </div>
    </div>
  );
};
