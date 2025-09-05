import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  FileIcon,
  Loader2,
  Users,
  Clock,
  DollarSign,
} from "lucide-react";
import { useToast } from "@/hooks/ui/use-toast";
import { submitPrintRequest } from "@/app/actions/start-print";

interface PostProjectStepProps {
  settings: any;
  fileInfo: any;
  onBack?: () => void;
  onComplete?: () => void;
}

export const PostProjectStep: React.FC<PostProjectStepProps> = ({
  settings,
  fileInfo,
  onBack,
  onComplete,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!fileInfo.file) {
      toast({
        title: "Error",
        description: "No file selected",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData
      const formData = new FormData();

      // Add all the settings
      formData.append("material", settings.material);
      formData.append("color", settings.color);
      formData.append("customColor", settings.customColor);
      formData.append("quantity", settings.quantity.toString());
      formData.append("resolution", settings.resolution);
      formData.append("finish", settings.finish);
      formData.append("scale", settings.scale.toString());
      formData.append(
        "deadline",
        settings.deadline ? settings.deadline.toISOString() : ""
      );
      formData.append("designNotes", settings.designNotes);
      formData.append("infill", settings.infill.toString());
      formData.append("infillPattern", settings.infillPattern);

      // Add the files
      formData.append("file", fileInfo.file);
      if (settings.referenceImage) {
        formData.append("referenceImage", settings.referenceImage);
      }

      // Call the server action
      const result = await submitPrintRequest(formData);

      if (result.success) {
        setIsSubmitted(true);
        toast({
          title: "Project Posted Successfully!",
          description:
            "Makers will start sending quotes shortly. Check your dashboard to view incoming quotes.",
        });

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          if (onComplete) {
            onComplete();
          }
        }, 2000);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to post project",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatFileSize = (size: number) =>
    `${(size / 1024 / 1024).toFixed(2)} MB`;

  const getFileExtension = (name?: string) =>
    name?.split(".").pop()?.toLowerCase() || "";

  if (isSubmitted) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Project Posted Successfully!
              </h3>
              <p className="text-muted-foreground mt-2">
                Your project is now live and makers will start sending quotes.
                You'll be redirected to your dashboard where you can view and
                compare quotes from different makers.
              </p>
            </div>
            <div className="flex items-center justify-center gap-4 mt-6 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-primary" />
                <span>Makers will quote within 24hrs</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-primary" />
                <span>Average response time: 2-4hrs</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Project Summary */}
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl">Review Your Project</CardTitle>
          <p className="text-muted-foreground">
            Review your project details before posting it for makers to quote
            on.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Info */}
          <div>
            <h4 className="font-medium mb-3">3D Model</h4>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <FileIcon className="w-6 h-6 text-primary" />
              <div className="flex-1">
                <p className="font-medium">{fileInfo.file?.name}</p>
                <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                  <span>Size: {formatFileSize(fileInfo.file?.size || 0)}</span>
                  <span>Format: .{getFileExtension(fileInfo.file?.name)}</span>
                  {fileInfo.dimensions && (
                    <span>
                      Dimensions:{" "}
                      {Math.round(
                        (fileInfo.dimensions.width * settings.scale) / 100
                      )}{" "}
                      ×{" "}
                      {Math.round(
                        (fileInfo.dimensions.depth * settings.scale) / 100
                      )}{" "}
                      ×{" "}
                      {Math.round(
                        (fileInfo.dimensions.height * settings.scale) / 100
                      )}
                      mm
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Project Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Print Specifications</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Material:</span>
                  <Badge variant="secondary">{settings.material}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Color:</span>
                  <span>
                    {settings.color === "custom"
                      ? settings.customColor
                      : settings.color}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Resolution:</span>
                  <span>{settings.resolution}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Finish:</span>
                  <span>{settings.finish}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Quantity:</span>
                  <span>{settings.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Scale:</span>
                  <span>{settings.scale}%</span>
                </div>
                {settings.deadline && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Deadline:</span>
                    <span>
                      {new Date(settings.deadline).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Additional Details</h4>
              <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                {settings.designNotes && (
                  <div>
                    <span className="text-sm font-medium">Design Notes:</span>
                    <p className="text-sm text-muted-foreground mt-1">
                      {settings.designNotes}
                    </p>
                  </div>
                )}
                {settings.referenceImage && (
                  <div>
                    <span className="text-sm font-medium">
                      Reference Image:
                    </span>
                    <p className="text-sm text-muted-foreground mt-1">
                      {settings.referenceImage.name}
                    </p>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    Makers will provide custom quotes
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            size="lg"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="min-w-40"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posting Project...
              </>
            ) : (
              "Post Project & Get Quotes"
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* What Happens Next */}
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-lg">What happens next?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-primary font-semibold">1</span>
              </div>
              <h5 className="font-medium mb-1">Makers Review</h5>
              <p className="text-xs text-muted-foreground">
                Local makers review your project requirements
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-primary font-semibold">2</span>
              </div>
              <h5 className="font-medium mb-1">Receive Quotes</h5>
              <p className="text-xs text-muted-foreground">
                Get competitive quotes with pricing and timeline
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-primary font-semibold">3</span>
              </div>
              <h5 className="font-medium mb-1">Choose & Print</h5>
              <p className="text-xs text-muted-foreground">
                Select your preferred maker and start printing
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
