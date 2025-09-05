"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  Zap,
  Map,
  ArrowLeft,
  Search,
  Ghost,
  Star,
  MapPin,
  Clock,
  Verified,
  List,
} from "lucide-react";
import Link from "next/link";
import { Input } from "../ui/input";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MapHeaderProps {
  mapMode: "manual" | "fast";
  onModeSwitch: (mode: "manual" | "fast") => void;
  onFileUpload: (file: File) => void;
  uploadedFile: File | null;
  manufacturers?: any[];
  loading?: boolean;
  onManufacturerSelect?: (manufacturer: any) => void;
  viewMode?: "map" | "list";
  onViewModeChange?: (mode: "map" | "list") => void;
}

export function MapHeader({
  mapMode,
  onModeSwitch,
  onFileUpload,
  uploadedFile,
  manufacturers = [],
  loading = false,
  onManufacturerSelect,
  viewMode = "map",
  onViewModeChange,
}: MapHeaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    const validFile = files.find((file) =>
      file.name.match(/\.(stl|obj|3mf|ply)$/i)
    );
    if (validFile) {
      onFileUpload(validFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "text-green-400";
      case "busy":
        return "text-yellow-400";
      case "offline":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "available":
        return "Available";
      case "busy":
        return "Busy";
      case "offline":
        return "Offline";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="h-full flex flex-col relative bg-mana-black">
      {/* Header Section */}
      <div className="p-4 md:p-6 border-b border-mana-gray-light/20 bg-mana-gray/30">
        <div className="flex flex-col items-start gap-4">
          <h1 className="text-lg md:text-xl font-bold text-mana-text">
            Find Manufacturers
          </h1>
        </div>
      </div>

      {/* Search Selection */}
      <div className="flex gap-2 md:gap-3 p-4 md:p-6 border-b border-mana-gray-light/20 bg-mana-gray/20">
        <Input
          placeholder="Search a location"
          className="w-full bg-mana-gray/50 text-mana-text border-mana-gray-light/30 focus:border-mana-mint/50 focus:ring-mana-mint/20 rounded-[6px] placeholder:text-mana-text-secondary"
        />
        <Button
          variant="outline"
          size="icon"
          className="bg-mana-gray/50 text-mana-text border-mana-gray-light/30 hover:bg-mana-gray hover:border-mana-mint/50 rounded-[6px] p-2 transition-colors"
        >
          <Search className="w-4 h-4" />
        </Button>
      </div>

      {/* Mode Toggle - Desktop: Manual/Fast Print, Mobile: Map/List */}
      <div className="p-4 md:p-6 border-b border-mana-gray-light/20 bg-mana-gray/10">
        {/* Desktop Mode Toggle */}
        <div className="hidden md:flex gap-3">
          <Button
            variant={mapMode === "manual" ? "default" : "outline"}
            size="sm"
            onClick={() => onModeSwitch("manual")}
            className={`flex-1 ${
              mapMode === "manual"
                ? "bg-mana-mint text-mana-black hover:bg-mana-mint/90"
                : "bg-mana-gray/50 text-mana-text border-mana-gray-light/30 hover:bg-mana-gray hover:border-mana-mint/50"
            }`}
          >
            <Map className="w-4 h-4 mr-2" />
            Manual
          </Button>
          <Button
            variant={mapMode === "fast" ? "default" : "outline"}
            size="sm"
            onClick={() => onModeSwitch("fast")}
            className={`flex-1 ${
              mapMode === "fast"
                ? "bg-mana-mint text-mana-black hover:bg-mana-mint/90"
                : "bg-mana-gray/50 text-mana-text border-mana-gray-light/30 hover:bg-mana-gray hover:border-mana-mint/50"
            }`}
          >
            <Zap className="w-4 h-4 mr-2" />
            Fast Print
          </Button>
        </div>
      </div>

      {/* File Upload Section - Only show on desktop or when in fast print mode */}
      {mapMode === "fast" && (
        <div className="p-4 md:p-6 border-b border-mana-gray-light/20 bg-mana-gray/10">
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              isDragOver
                ? "border-mana-mint bg-mana-mint/10"
                : "border-mana-gray-light/30 bg-mana-gray/20"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {uploadedFile ? (
              <div className="space-y-3">
                <div className="flex items-center justify-center w-12 h-12 bg-mana-mint/20 rounded-full mx-auto">
                  <Upload className="w-6 h-6 text-mana-mint" />
                </div>
                <p className="text-mana-text font-medium">
                  {uploadedFile.name}
                </p>
                <p className="text-mana-text-secondary text-sm">
                  Ready for fast printing
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-center w-12 h-12 bg-mana-gray/40 rounded-full mx-auto">
                  <Upload className="w-6 h-6 text-mana-text-secondary" />
                </div>
                <p className="text-mana-text font-medium">Upload 3D File</p>
                <p className="text-mana-text-secondary text-sm">
                  Drag & drop or click to browse
                </p>
                <input
                  type="file"
                  accept=".stl,.obj,.3mf,.ply"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-block mt-2 px-4 py-2 bg-mana-mint text-mana-black rounded-lg cursor-pointer hover:bg-mana-mint/90 transition-colors"
                >
                  Choose File
                </label>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Manufacturers List - Show on desktop or when in list view on mobile, but hide in fast print mode */}
      <div
        className={`flex-1 overflow-hidden ${
          viewMode === "list" ? "block" : "hidden md:block"
        } ${mapMode === "fast" ? "hidden" : ""}`}
      >
        <ScrollArea className="h-full">
          <div className="px-3 md:px-4 py-4 md:py-6 space-y-4 md:space-y-5">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mana-mint"></div>
                <span className="ml-2 text-mana-text">
                  Loading manufacturers...
                </span>
              </div>
            ) : manufacturers.length > 0 ? (
              manufacturers.map((manufacturer) => (
                <div
                  key={manufacturer.id}
                  onClick={() => onManufacturerSelect?.(manufacturer)}
                  className="bg-mana-gray/20 border border-mana-gray-light/20 rounded-lg p-4 md:p-5 cursor-pointer hover:border-mana-mint/30 hover:bg-mana-gray/30 transition-all duration-200"
                >
                  <div className="flex items-start gap-3 md:gap-4">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <Image
                        src={manufacturer.avatar || "/assets/placeholders/placeholder.svg"}
                        alt={manufacturer.businessName}
                        width={48}
                        height={48}
                        className="rounded-lg md:w-14 md:h-14"
                      />
                      {manufacturer.verified && (
                        <div className="absolute -top-1 -right-1 bg-mana-mint rounded-full p-0.5">
                          <Verified className="w-3 h-3 text-mana-black fill-current" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium text-mana-text truncate text-sm md:text-base">
                          {manufacturer.businessName}
                        </h3>
                        <Badge
                          className={`${getStatusColor(
                            manufacturer.status
                          )} bg-transparent border-current text-[10px] px-1.5 py-0.5`}
                        >
                          ● {getStatusText(manufacturer.status)}
                        </Badge>
                      </div>

                      <p className="text-mana-text-secondary text-xs md:text-sm mb-2 md:mb-3 line-clamp-2">
                        {manufacturer.tagline}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center gap-3 md:gap-5 text-xs text-mana-text-secondary mb-2 md:mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span>{manufacturer.rating}</span>
                          <span>({manufacturer.reviewCount})</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>
                            {manufacturer.distance.replace(" miles", " mi")}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>
                            {manufacturer.avgTurnaround
                              .replace(" hours", " hrs")
                              .replace(" hour", " hr")}
                          </span>
                        </div>
                      </div>

                      {/* Specialties */}
                      {manufacturer.specialties && (
                        <div className="flex flex-wrap gap-1 md:gap-2">
                          {manufacturer.specialties
                            .slice(0, 3)
                            .map((specialty: string) => (
                              <Badge
                                key={specialty}
                                variant="secondary"
                                className="text-xs bg-mana-gray/40 text-mana-text-secondary border-mana-gray-light/20"
                              >
                                {specialty}
                              </Badge>
                            ))}
                          {manufacturer.specialties.length > 3 && (
                            <Badge
                              variant="secondary"
                              className="text-xs bg-mana-gray/40 text-mana-text-secondary border-mana-gray-light/20"
                            >
                              +{manufacturer.specialties.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col justify-center items-center py-8">
                <div className="bg-mana-gray/60 w-16 h-16 rounded-full flex items-center justify-center mb-4 border border-mana-gray-light/30">
                  <Ghost className="w-8 h-8 text-mana-mint/70" />
                </div>
                <p className="text-mana-text font-medium mb-2">
                  No manufacturers found
                </p>
                <p className="text-mana-text-secondary text-center text-sm max-w-xs">
                  Try a different location or search for a different
                  manufacturer
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Fast Print Upload Area - Full height when in fast print mode */}
      {mapMode === "fast" && (
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="flex flex-col justify-center items-center h-full px-4 md:px-6 py-6">
              <div
                className={`border-2 border-dashed rounded-lg p-8 md:p-12 text-center transition-colors w-full max-w-md ${
                  isDragOver
                    ? "border-mana-mint bg-mana-mint/10"
                    : "border-mana-gray-light/30 bg-mana-gray/20"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {uploadedFile ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center w-16 h-16 bg-mana-mint/20 rounded-full mx-auto">
                      <Upload className="w-8 h-8 text-mana-mint" />
                    </div>
                    <p className="text-mana-text font-medium text-lg">
                      {uploadedFile.name}
                    </p>
                    <p className="text-mana-text-secondary text-sm">
                      Ready for fast printing
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center w-16 h-16 bg-mana-gray/40 rounded-full mx-auto">
                      <Upload className="w-8 h-8 text-mana-text-secondary" />
                    </div>
                    <p className="text-mana-text font-medium text-lg">
                      Upload 3D File
                    </p>
                    <p className="text-mana-text-secondary text-sm">
                      Drag & drop or click to browse
                    </p>
                    <input
                      type="file"
                      accept=".stl,.obj,.3mf,.ply"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-upload-fast"
                    />
                    <label
                      htmlFor="file-upload-fast"
                      className="inline-block mt-4 px-6 py-3 bg-mana-mint text-mana-black rounded-lg cursor-pointer hover:bg-mana-mint/90 transition-colors font-medium"
                    >
                      Choose File
                    </label>
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
