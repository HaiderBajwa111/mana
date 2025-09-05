import React from "react";
import { Loader2 } from "lucide-react";

interface AnalyzingIndicatorProps {
  fileSize: number;
}

export const AnalyzingIndicator: React.FC<AnalyzingIndicatorProps> = ({
  fileSize,
}) => {
  const fileSizeMB = fileSize / (1024 * 1024);

  // Estimate time based on file size
  const getEstimatedTime = (sizeMB: number) => {
    if (sizeMB < 5) return "a few seconds";
    if (sizeMB < 15) return "10-30 seconds";
    if (sizeMB < 30) return "30-60 seconds";
    return "1-2 minutes";
  };

  // Show different messages based on file size
  const getMessage = (sizeMB: number) => {
    if (sizeMB < 5) return "Quick analysis...";
    if (sizeMB < 15) return "Analyzing model structure...";
    if (sizeMB < 30) return "Processing large model...";
    return "Analyzing complex model (this may take a while)...";
  };

  return (
    <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground mb-4 p-4 bg-muted/30 rounded-lg">
      <div className="flex items-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>{getMessage(fileSizeMB)}</span>
      </div>
      <div className="text-xs text-center">
        <span className="font-medium">{fileSizeMB.toFixed(1)}MB file</span>
        <span className="mx-2">•</span>
        <span>Estimated time: {getEstimatedTime(fileSizeMB)}</span>
      </div>
      <div className="text-xs text-center text-muted-foreground">
        This helps calculate accurate pricing and print time
      </div>
    </div>
  );
};
