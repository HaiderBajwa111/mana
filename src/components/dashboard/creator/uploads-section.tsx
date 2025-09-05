"use client";

import React from "react";
import { motion } from "framer-motion";
import { Eye, Grid, List, MoreVertical } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock Data
const MOCK_UPLOADS = [
  {
    id: "up1",
    name: "Cybernetic_Arm_Mount_v3.stl",
    date: "2025-06-22",
    status: "Quoted",
    thumbnail: "/assets/images/products/futuristic-cybernetic-arm-mount.png",
    price: "$45.00",
    printer: "TechPrint Pro",
  },
  {
    id: "up2",
    name: "Voronoi_Lamp_Shade.stl",
    date: "2025-06-20",
    status: "Printing",
    thumbnail: "/assets/images/products/futuristic-voronoi-lamp.png",
    price: "$32.50",
    printer: "MakerSpace Labs",
  },
  {
    id: "up3",
    name: "Drone_Frame_Final.stl",
    date: "2025-06-18",
    status: "Delivered",
    thumbnail: "/assets/images/products/futuristic-3d-printed-drone-frame.png",
    price: "$78.00",
    printer: "AeroMakers",
  },
];

interface UploadsSectionProps {
  loading: boolean;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
}

export const UploadsSection: React.FC<UploadsSectionProps> = ({
  loading,
  viewMode,
  setViewMode,
}) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="bg-mana-gray/30 border-mana-gray-light/20 rounded-2xl shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold">My Uploads</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewMode("grid")}
                className={
                  viewMode === "grid"
                    ? "text-mana-mint"
                    : "text-mana-text-secondary"
                }
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewMode("list")}
                className={
                  viewMode === "list"
                    ? "text-mana-mint"
                    : "text-mana-text-secondary"
                }
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  : "space-y-3"
              }
            >
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`bg-mana-gray/50 rounded-xl border border-mana-gray-light/10 hover:border-mana-mint/30 transition-all duration-200 ${
                    viewMode === "grid"
                      ? "p-4 space-y-3"
                      : "p-3 flex items-center gap-4"
                  }`}
                >
                  <div
                    className={
                      viewMode === "grid"
                        ? "aspect-video bg-mana-black rounded-lg overflow-hidden"
                        : "w-16 h-16 bg-mana-black rounded-lg overflow-hidden flex-shrink-0"
                    }
                  >
                    <Skeleton className="w-full h-full bg-mana-gray/50" />
                  </div>
                  <div className={viewMode === "grid" ? "" : "flex-1 min-w-0"}>
                    <Skeleton className="h-4 w-3/4 bg-mana-gray/50" />
                    <Skeleton className="h-3 w-1/2 bg-mana-gray/50" />
                    {viewMode === "list" && (
                      <Skeleton className="h-4 w-16 bg-mana-gray/50 mt-1" />
                    )}
                  </div>
                  <div
                    className={`flex items-center ${viewMode === "grid" ? "justify-between" : "gap-3"}`}
                  >
                    <Skeleton className="h-6 w-16 bg-mana-gray/50 rounded-full" />
                    {viewMode === "grid" && (
                      <Skeleton className="h-4 w-16 bg-mana-gray/50" />
                    )}
                    <div className="flex items-center gap-1">
                      <Skeleton className="h-8 w-8 bg-mana-gray/50 rounded" />
                      <Skeleton className="h-8 w-8 bg-mana-gray/50 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  : "space-y-3"
              }
            >
              {MOCK_UPLOADS.map((upload) => (
                <div
                  key={upload.id}
                  className={`bg-mana-gray/50 rounded-xl border border-mana-gray-light/10 hover:border-mana-mint/30 transition-all duration-200 ${
                    viewMode === "grid"
                      ? "p-4 space-y-3"
                      : "p-3 flex items-center gap-4"
                  }`}
                >
                  <div
                    className={
                      viewMode === "grid"
                        ? "aspect-video bg-mana-black rounded-lg overflow-hidden"
                        : "w-16 h-16 bg-mana-black rounded-lg overflow-hidden flex-shrink-0"
                    }
                  >
                    <img
                      src={upload.thumbnail || "/assets/placeholders/placeholder.svg"}
                      alt={upload.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className={viewMode === "grid" ? "" : "flex-1 min-w-0"}>
                    <p className="font-medium truncate text-sm">
                      {upload.name}
                    </p>
                    <p className="text-xs text-mana-text-secondary">
                      {upload.date} • {upload.printer}
                    </p>
                    {viewMode === "list" && (
                      <p className="text-sm font-medium text-mana-mint">
                        {upload.price}
                      </p>
                    )}
                  </div>
                  <div
                    className={`flex items-center ${viewMode === "grid" ? "justify-between" : "gap-3"}`}
                  >
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        upload.status === "Delivered"
                          ? "border-green-500/30 text-green-400"
                          : upload.status === "Printing"
                            ? "border-blue-500/30 text-blue-400"
                            : "border-mana-mint/30 text-mana-mint"
                      }`}
                    >
                      {upload.status}
                    </Badge>
                    {viewMode === "grid" && (
                      <p className="text-sm font-medium text-mana-mint">
                        {upload.price}
                      </p>
                    )}
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="w-8 h-8">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-mana-gray/95 border-mana-gray-light/20"
                        >
                          <DropdownMenuItem className="text-mana-text">
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-mana-text">
                            Reorder
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-mana-text">
                            Download
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.section>
  );
};

export default UploadsSection;
