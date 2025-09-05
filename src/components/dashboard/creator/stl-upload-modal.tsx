"use client";

import { useState } from "react";
import { uploadSTLFile } from "@/app/actions/creator/upload-stl";
import { AutoThumbnailGenerator } from "@/components/upload/auto-thumbnail-generator";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Loader2, MapPin, PaintBucket, Sparkles } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface STLUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  file: File | null;
}

export function STLUploadModal({ open, onOpenChange, file }: STLUploadModalProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [title, setTitle] = useState(file?.name.replace(/\.[^/.]+$/, "") || "");
  const [description, setDescription] = useState("");
  const [pickupLocation, setPickupLocation] = useState<string>("sdsu");
  const [color, setColor] = useState<string>("Black");
  const [postProcessing, setPostProcessing] = useState<boolean>(false);
  const [finishNotes, setFinishNotes] = useState<string>("");
  const [uploadedProjectId, setUploadedProjectId] = useState<string | null>(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const router = useRouter();

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select an STL file to upload",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title || file.name.replace(/\.[^/.]+$/, ""));
      formData.append("description", description || "3D Print Project");
      formData.append("pickupLocation", pickupLocation);
      formData.append("color", color);
      formData.append("postProcessing", String(postProcessing));
      formData.append("finishNotes", finishNotes);

      const result = await uploadSTLFile(formData);

      if (result.success && result.data) {
        // Store project info for thumbnail generation
        setUploadedProjectId(result.data.projectId);
        setUploadedFileUrl(result.data.fileUrl);
        
        toast({
          title: "Project submitted successfully! 🎉",
          description: "Generating thumbnail preview...",
        });

        // Don't close modal yet - wait for thumbnail
        // The AutoThumbnailGenerator component will handle it
      } else {
        toast({
          title: "Submission failed",
          description: result.error || "Failed to submit project",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Submission failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[720px]">
        <DialogHeader>
          <DialogTitle>Upload STL File</DialogTitle>
          <DialogDescription>
            Upload your 3D model and add ticket details. It will be saved as a draft project.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="file">File</Label>
            <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted/50">
              <Upload className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{file?.name || "No file selected"}</span>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="title">Project Title</Label>
            <Input
              id="title"
              placeholder="Enter a title for your project"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isUploading}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="Describe your 3D print project (function, critical dimensions, tolerance needs, hardware, etc.)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isUploading}
              rows={3}
            />
          </div>

          {/* Pickup location */}
          <div className="grid gap-3">
            <Label className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Pickup Location</Label>
            <Select value={pickupLocation} onValueChange={setPickupLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a meeting point" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sdsu">Starbucks @ SDSU — 5500 Campanile Dr, San Diego, CA</SelectItem>
                <SelectItem value="ucsd">Starbucks @ UCSD — 9500 Gilman Dr, La Jolla, CA</SelectItem>
                <SelectItem value="downtown">Downtown San Diego — 600 F St, San Diego, CA</SelectItem>
                <SelectItem value="balboa">Balboa Park — 1549 El Prado, San Diego, CA</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Color and post-processing */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label className="flex items-center gap-2"><PaintBucket className="h-4 w-4" /> Color</Label>
              <Select value={color} onValueChange={setColor}>
                <SelectTrigger>
                  <SelectValue placeholder="Select color" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Black">Black</SelectItem>
                  <SelectItem value="White">White</SelectItem>
                  <SelectItem value="Gray">Gray</SelectItem>
                  <SelectItem value="Blue">Blue</SelectItem>
                  <SelectItem value="Red">Red</SelectItem>
                  <SelectItem value="Green">Green</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label className="flex items-center gap-2"><Sparkles className="h-4 w-4" /> Post Processing</Label>
              <div className="flex items-center justify-between border rounded-md px-3 py-2 bg-muted/30">
                <span className="text-sm text-muted-foreground">Sanding / smoothing / finishing</span>
                <Switch checked={postProcessing} onCheckedChange={setPostProcessing} />
              </div>
            </div>
          </div>

          {postProcessing && (
            <div className="grid gap-2">
              <Label>Finishing Notes (optional)</Label>
              <Textarea
                placeholder="E.g., sand visible faces, acetone vapor smooth, prime for paint, etc."
                value={finishNotes}
                onChange={(e)=>setFinishNotes(e.target.value)}
                rows={2}
              />
            </div>
          )}

          {file && (
            <div className="text-sm text-muted-foreground">
              File size: {(file.size / (1024 * 1024)).toFixed(2)} MB
            </div>
          )}
          
          {/* Show thumbnail generator after successful upload */}
          {uploadedProjectId && uploadedFileUrl && (
            <AutoThumbnailGenerator
              projectId={uploadedProjectId}
              stlUrl={uploadedFileUrl}
              onComplete={(thumbnailUrl) => {
                console.log("Thumbnail generated:", thumbnailUrl);
                // Reset form
                setTitle("");
                setDescription("");
                setPickupLocation("sdsu");
                setColor("Black");
                setPostProcessing(false);
                setFinishNotes("");
                setUploadedProjectId(null);
                setUploadedFileUrl(null);
                
                // Close modal
                onOpenChange(false);
                
                // Refresh the dashboard
                router.refresh();
              }}
              onError={(error) => {
                console.error("Thumbnail generation failed:", error);
                // Still close modal even if thumbnail fails
                onOpenChange(false);
                router.refresh();
              }}
            />
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={isUploading || !file}>
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting Project...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Submit Project
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}