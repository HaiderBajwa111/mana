"use client";

import React from "react";
import { FileUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FastPrintModal } from "@/components/map/fast-print-modal";

// Mock Data
const MOCK_PRINTERS = [
  {
    id: "p1",
    name: "TechPrint Pro",
    pos: { top: "35%", left: "40%" },
    rating: 4.8,
    distance: "0.5 mi",
  },
  {
    id: "p2",
    name: "MakerSpace Labs",
    pos: { top: "50%", left: "55%" },
    rating: 4.6,
    distance: "1.2 mi",
  },
  {
    id: "p3",
    name: "AeroMakers",
    pos: { top: "65%", left: "30%" },
    rating: 4.9,
    distance: "2.1 mi",
  },
  {
    id: "p4",
    name: "Bay Area Prints",
    pos: { top: "25%", left: "65%" },
    rating: 4.7,
    distance: "0.8 mi",
  },
];

// File Drop Component
function FileDropZone({
  onFileUpload,
}: {
  onFileUpload: (file: File) => void;
}) {
  const [isDragOver, setIsDragOver] = React.useState(false);

  const handleDragOver = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = React.useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      const stlFile = files.find((file) =>
        file.name.toLowerCase().endsWith(".stl")
      );

      if (stlFile) {
        onFileUpload(stlFile);
      }
    },
    [onFileUpload]
  );

  const handleFileSelect = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && file.name.toLowerCase().endsWith(".stl")) {
        onFileUpload(file);
      }
    },
    [onFileUpload]
  );

  return (
    <div
      className={`relative text-center p-8 border-2 border-dashed rounded-xl transition-all duration-300 cursor-pointer ${
        isDragOver
          ? "border-mana-mint bg-mana-mint/10 scale-105"
          : "border-mana-mint/30 bg-mana-mint/5 hover:bg-mana-mint/10"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => document.getElementById("file-input")?.click()}
    >
      <input
        id="file-input"
        type="file"
        accept=".stl"
        onChange={handleFileSelect}
        className="hidden"
      />
      <div
        className={`transition-all duration-300 ${isDragOver ? "scale-110" : ""}`}
      >
        <FileUp className="w-12 h-12 text-mana-mint mx-auto mb-4" />
        <h3 className="font-semibold text-lg text-mana-text mb-2">
          Drop your STL file here
        </h3>
        <p className="text-mana-text-secondary">
          Get instant quotes from nearby printers
        </p>
        <p className="text-xs text-mana-text-secondary mt-2">
          or click to browse files
        </p>
      </div>
    </div>
  );
}

interface QuickUploadCardProps {
  uploadedFile: File | null;
  setUploadedFile: (file: File | null) => void;
  showFastPrint: boolean;
  setShowFastPrint: (show: boolean) => void;
}

export const QuickUploadCard: React.FC<QuickUploadCardProps> = ({
  uploadedFile,
  setUploadedFile,
  showFastPrint,
  setShowFastPrint,
}) => {
  const handleFileUpload = (file: File) => {
    console.log("File uploaded:", file.name);
    setUploadedFile(file);
    setShowFastPrint(true);
  };

  return (
    <>
      <Card className="bg-mana-gray/30 border-mana-gray-light/20 rounded-2xl shadow-lg h-full">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <FileUp className="w-6 h-6 text-mana-mint" />
              Quick Upload
            </CardTitle>
          </div>
          <div className="text-mana-text-secondary text-sm mt-2">
            Upload your STL file and get instant quotes from local
            manufacturers.
          </div>
        </CardHeader>
        <CardContent className="flex flex-col h-full">
          <div className="flex-1">
            <FileDropZone onFileUpload={handleFileUpload} />
          </div>
        </CardContent>
      </Card>

      {/* Fast Print Modal (Expanded State) */}
      {showFastPrint && uploadedFile && (
        <FastPrintModal
          file={uploadedFile}
          manufacturers={MOCK_PRINTERS.map((p) => ({
            id: p.id,
            businessName: p.name,
            avatar: "/assets/images/avatars/maker-avatar.png",
            tagline: "Top rated in your area",
            rating: p.rating,
            distance: p.distance,
            avgTurnaround: "1 day",
            recommended: p.id === "p1",
          }))}
          userLocation={{ lat: 37.7749, lng: -122.4194 }}
          onClose={() => setShowFastPrint(false)}
        />
      )}
    </>
  );
};

export default QuickUploadCard;
