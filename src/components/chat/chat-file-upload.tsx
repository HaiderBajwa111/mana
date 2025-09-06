"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Paperclip, 
  Image, 
  File, 
  Upload, 
  X, 
  CheckCircle, 
  AlertCircle,
  Loader2 
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useChatFileUpload, type ChatFileAttachment, type UploadProgress } from "@/hooks/use-chat-file-upload";
import { useToast } from "@/hooks/ui/use-toast";

interface ChatFileUploadProps {
  onFilesSelected: (attachments: ChatFileAttachment[]) => void;
  disabled?: boolean;
  userId?: string;
  conversationId?: string;
}

export function ChatFileUpload({ onFilesSelected, disabled, userId, conversationId }: ChatFileUploadProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadMode, setUploadMode] = useState<"image" | "file" | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  
  const { uploading, uploadProgress, uploadMultipleFiles, clearProgress } = useChatFileUpload();
  const { toast } = useToast();

  const handleFileSelect = (files: FileList | null, mode: "image" | "file") => {
    if (!files || files.length === 0) return;
    
    const fileArray = Array.from(files);
    setSelectedFiles(fileArray);
    setUploadMode(mode);
    setIsOpen(true);
  };

  const handleImageClick = () => {
    if (disabled || uploading) return;
    imageInputRef.current?.click();
  };

  const handleFileClick = () => {
    if (disabled || uploading) return;
    fileInputRef.current?.click();
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "No Files Selected",
        description: "Please select files to upload",
        variant: "destructive",
      });
      return;
    }

    if (!userId || !conversationId) {
      console.error("Missing required parameters:", { userId, conversationId });
      toast({
        title: "Upload Error",
        description: "Missing user or conversation information. Please try again.",
        variant: "destructive",
      });
      return;
    }

    console.log("🔍 [CHAT_FILE_UPLOAD] Starting upload with:", { 
      fileCount: selectedFiles.length, 
      userId, 
      conversationId 
    });

    try {
      const attachments = await uploadMultipleFiles(selectedFiles, userId, conversationId);
      
      if (attachments.length > 0) {
        onFilesSelected(attachments);
        toast({
          title: "Files Uploaded",
          description: `Successfully uploaded ${attachments.length} file(s)`,
        });
        handleClose();
      } else {
        toast({
          title: "Upload Failed",
          description: "No files were uploaded successfully",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("🔍 [CHAT_FILE_UPLOAD] Upload error:", error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload files. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedFiles([]);
    setUploadMode(null);
    clearProgress();
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return <Image className="w-4 h-4" />;
    }
    return <File className="w-4 h-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getProgressForFile = (fileName: string): UploadProgress | undefined => {
    return uploadProgress.find(p => p.fileName === fileName);
  };

  return (
    <>
      {/* Hidden file inputs */}
      <Input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files, "image")}
      />
      <Input
        ref={fileInputRef}
        type="file"
        accept=".stl,.obj,.3mf,.ply,.step,.iges"
        multiple
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files, "file")}
      />

      {/* Upload buttons */}
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleImageClick}
        disabled={disabled || uploading}
        title="Upload Images"
      >
        <Image className="h-4 w-4" />
      </Button>
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleFileClick}
        disabled={disabled || uploading}
        title="Upload 3D Files"
      >
        <Paperclip className="h-4 w-4" />
      </Button>

      {/* Upload dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Upload {uploadMode === "image" ? "Images" : "3D Files"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Selected files */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Selected Files:</h4>
              {selectedFiles.map((file, index) => {
                const progress = getProgressForFile(file.name);
                return (
                  <div key={index} className="flex items-center gap-2 p-2 border rounded">
                    {getFileIcon(file)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)}
                      </p>
                      {progress && (
                        <div className="mt-1">
                          <Progress value={progress.progress} className="h-1" />
                          <div className="flex items-center gap-1 mt-1">
                            {progress.status === "uploading" && (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            )}
                            {progress.status === "completed" && (
                              <CheckCircle className="w-3 h-3 text-green-500" />
                            )}
                            {progress.status === "error" && (
                              <AlertCircle className="w-3 h-3 text-red-500" />
                            )}
                            <span className="text-xs text-muted-foreground">
                              {progress.status === "error" ? progress.error : `${progress.progress}%`}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    {!uploading && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Upload info */}
            <div className="text-xs text-muted-foreground">
              <p>• Maximum file size: 50MB</p>
              <p>• Supported formats: {uploadMode === "image" ? "JPG, PNG, GIF, WebP" : "STL, OBJ, 3MF, PLY, STEP, IGES"}</p>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleClose} disabled={uploading}>
                Cancel
              </Button>
              <Button 
                onClick={handleUpload} 
                disabled={selectedFiles.length === 0 || uploading}
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload {selectedFiles.length} file{selectedFiles.length !== 1 ? "s" : ""}
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
