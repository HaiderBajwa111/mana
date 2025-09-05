"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Download,
  MapPin,
  Package,
  Clock,
  FileText,
  Palette,
  Sparkles,
  Hash,
  Layers,
  Ruler,
  Calendar,
  User,
  Loader2,
  Eye,
  MessageSquare,
} from "lucide-react";
import { type AvailableProject } from "@/types/maker";
import { formatDistanceToNow } from "date-fns";
import { OptimizedSTLViewer } from "@/components/3d/optimized-stl-viewer";
import { useDevicePerformance } from "@/hooks/use-stl-manager";

interface ProjectDetailModalProps {
  project: AvailableProject | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSendQuote?: () => void;
}

// Map of pickup locations with friendly names
const PICKUP_LOCATIONS: Record<string, string> = {
  sdsu: "Starbucks @ SDSU — 5500 Campanile Dr, San Diego, CA",
  ucsd: "Starbucks @ UCSD — 9500 Gilman Dr, La Jolla, CA",
  downtown: "Downtown San Diego — 600 F St, San Diego, CA",
  balboa: "Balboa Park — 1549 El Prado, San Diego, CA",
};

export function ProjectDetailModal({
  project,
  open,
  onOpenChange,
  onSendQuote,
}: ProjectDetailModalProps) {
  const [activeTab, setActiveTab] = useState("details");
  const { defaultQuality } = useDevicePerformance();

  // Parse pickup location from designNotes
  const pickupLocation = project?.designNotes?.startsWith("Pickup: ")
    ? project.designNotes.substring(8)
    : null;
  
  const finishNotes = project?.designNotes && !project.designNotes.startsWith("Pickup: ")
    ? project.designNotes
    : null;

  const handleDownloadSTL = async () => {
    if (!project?.fileUrl) return;
    
    try {
      const response = await fetch(project.fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = project.fileName || "model.stl";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {project.title}
          </DialogTitle>
          <DialogDescription>
            Submitted {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })} by {project.creator.firstName} {project.creator.lastName}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="files">Files & Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6 mt-6">
            {/* Project Description */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Project Description
              </h3>
              <p className="text-sm text-foreground">
                {project.description || "No description provided"}
              </p>
            </div>

            <Separator />

            {/* Location & Delivery */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Delivery & Pickup
              </h3>
              <div className="grid gap-3">
                {pickupLocation && (
                  <div className="p-3 rounded-lg bg-muted/50 border">
                    <p className="text-sm font-medium mb-1">Preferred Pickup Location</p>
                    <p className="text-sm text-muted-foreground">
                      {PICKUP_LOCATIONS[pickupLocation] || pickupLocation}
                    </p>
                  </div>
                )}
                {project.deadline && (
                  <div className="p-3 rounded-lg bg-muted/50 border">
                    <p className="text-sm font-medium mb-1">Deadline</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(project.deadline).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Creator Info */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                <User className="w-4 h-4" />
                Creator
              </h3>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
                <div>
                  <p className="text-sm font-medium">
                    {project.creator.firstName} {project.creator.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {project.city || "Location not specified"}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Message
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="specifications" className="space-y-6 mt-6">
            {/* Print Settings */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Print Settings
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Palette className="w-3 h-3" />
                    Color
                  </p>
                  <p className="text-sm font-medium">{project.color}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Package className="w-3 h-3" />
                    Material
                  </p>
                  <p className="text-sm font-medium">{project.material}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Hash className="w-3 h-3" />
                    Quantity
                  </p>
                  <p className="text-sm font-medium">{project.quantity}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Layers className="w-3 h-3" />
                    Resolution
                  </p>
                  <p className="text-sm font-medium">{project.resolution || "0.2mm"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Finish
                  </p>
                  <p className="text-sm font-medium">{project.finish}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Ruler className="w-3 h-3" />
                    Infill
                  </p>
                  <p className="text-sm font-medium">{project.infill || 20}%</p>
                </div>
              </div>
            </div>

            {/* Post Processing */}
            {(project.finish === "Post-processed" || finishNotes) && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Post-Processing Requirements
                  </h3>
                  <div className="p-3 rounded-lg bg-orange-50 border border-orange-200">
                    <Badge className="mb-2 bg-orange-100 text-orange-800 border-orange-200">
                      Post-Processing Required
                    </Badge>
                    <p className="text-sm text-foreground">
                      {finishNotes || "Standard post-processing requested (sanding, smoothing, finishing)"}
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Additional Notes */}
            {project.designNotes && !project.designNotes.startsWith("Pickup: ") && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Design Notes
                  </h3>
                  <p className="text-sm text-foreground p-3 rounded-lg bg-muted/50 border">
                    {project.designNotes}
                  </p>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="files" className="space-y-6 mt-6">
            {/* File Information */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                3D Model File
              </h3>
              <div className="p-4 rounded-lg bg-muted/50 border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{project.fileName}</p>
                      <p className="text-xs text-muted-foreground">
                        {project.fileSize ? `${(project.fileSize / (1024 * 1024)).toFixed(2)} MB` : "Size unknown"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(project.fileUrl, "_blank")}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownloadSTL}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* STL Preview */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                3D Preview
              </h3>
              <div className="aspect-video rounded-lg bg-muted/50 border overflow-hidden">
                {project.fileUrl ? (
                  <OptimizedSTLViewer
                    url={project.fileUrl}
                    className="w-full h-full"
                    thumbnailMode={false}
                    quality={defaultQuality}
                    autoRotate={false}
                    interactive={true}
                    placeholder={
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center space-y-2">
                          <Package className="w-12 h-12 text-muted-foreground mx-auto" />
                          <p className="text-sm text-muted-foreground">
                            Loading 3D preview...
                          </p>
                        </div>
                      </div>
                    }
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center space-y-2">
                      <Package className="w-12 h-12 text-muted-foreground mx-auto" />
                      <p className="text-sm text-muted-foreground">
                        No 3D model available
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Use mouse to rotate, scroll to zoom, right-click to pan
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <Separator className="my-6" />

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            Quote within 24 hours for best response rate
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button 
              className="bg-purple-600 hover:bg-purple-700"
              onClick={onSendQuote}
            >
              Send Quote
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}