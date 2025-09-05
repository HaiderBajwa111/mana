import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Info,
  Sparkles,
  Settings,
  Palette,
  Image,
  CalendarIcon,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import ModelPreview from "./ModelPreview";

interface PrintSettings {
  material: string;
  color: string;
  customColor: string;
  quantity: number;
  resolution: string;
  finish: string;
  scale: number;
  deadline: Date | null;
  designNotes: string;
  referenceImage: File | null;
  // Advanced settings
  infill: number;
  infillPattern: string;
}

// Resolution options
const RESOLUTIONS = [
  {
    value: "draft",
    label: "Draft (0.3mm)",
    description: "Fast printing, lower detail",
  },
  {
    value: "standard",
    label: "Standard (0.2mm)",
    description: "Good balance of speed and quality",
  },
  {
    value: "high",
    label: "High (0.15mm)",
    description: "Fine detail, slower printing",
  },
  {
    value: "ultra",
    label: "Ultra (0.1mm)",
    description: "Highest detail, longest print time",
  },
];

// Common color swatches
const COLOR_SWATCHES = [
  { name: "White", hex: "#FFFFFF" },
  { name: "Black", hex: "#000000" },
  { name: "Red", hex: "#DC2626" },
  { name: "Blue", hex: "#2563EB" },
  { name: "Green", hex: "#16A34A" },
  { name: "Yellow", hex: "#FACC15" },
  { name: "Orange", hex: "#EA580C" },
  { name: "Purple", hex: "#9333EA" },
  { name: "Pink", hex: "#EC4899" },
  { name: "Gray", hex: "#6B7280" },
];

// Expanded materials with descriptions
const EXPANDED_MATERIALS = [
  {
    value: "pla",
    label: "PLA",
    description:
      "Most common beginner-friendly plastic; easy to print, eco-friendly, best for prototypes and decorative parts.",
  },
  {
    value: "abs",
    label: "ABS",
    description:
      "Tough and heat-resistant; suitable for mechanical parts but requires a heated bed and enclosure.",
  },
  {
    value: "petg",
    label: "PETG",
    description:
      "Strong and flexible; good for functional parts like brackets and containers; more durable than PLA.",
  },
  {
    value: "resin",
    label: "Resin",
    description:
      "High-detail printing; used for figurines, dental models, or finely detailed designs; requires post-curing.",
  },
  {
    value: "tpu",
    label: "TPU",
    description:
      "Rubber-like flexible material; perfect for gaskets, wearables, and phone cases.",
  },
  {
    value: "nylon",
    label: "Nylon",
    description:
      "Durable and slightly flexible; great for mechanical, load-bearing parts.",
  },
  {
    value: "carbon_fiber",
    label: "Carbon Fiber",
    description:
      "Reinforced composite material; extremely strong and lightweight; used for high-performance parts.",
  },
  {
    value: "metal",
    label: "Metal",
    description:
      "Metal printing; includes various metal alloys; requires specialized equipment and high temperatures.",
  },
  {
    value: "wood",
    label: "Wood",
    description:
      "Wood composite filament; provides natural wood appearance and texture; good for decorative items.",
  },
  {
    value: "ceramic",
    label: "Ceramic",
    description:
      "Ceramic material; used for high-temperature applications and artistic pieces; requires special handling.",
  },
];

// Infill patterns
const INFILL_PATTERNS = [
  {
    value: "grid",
    label: "Grid",
    description: "Standard grid pattern, good balance of strength and speed",
  },
  {
    value: "honeycomb",
    label: "Honeycomb",
    description: "Hexagonal pattern, excellent strength-to-weight ratio",
  },
  {
    value: "triangles",
    label: "Triangles",
    description: "Triangular pattern, good for structural parts",
  },
  {
    value: "cubic",
    label: "Cubic",
    description: "3D cubic pattern, strong in all directions",
  },
  {
    value: "gyroid",
    label: "Gyroid",
    description: "Complex curved pattern, excellent strength and flexibility",
  },
];

// Updated finishes
const UPDATED_FINISHES = [
  { value: "none", label: "None", description: "Keep supports on the part" },
  { value: "basic", label: "Basic", description: "Remove supports only" },
  {
    value: "enhanced",
    label: "Enhanced",
    description: "Remove supports and light sanding for smoother finish",
  },
];

interface FileInfo {
  file: File | null;
  dimensions?: {
    width: number;
    depth: number;
    height: number;
    volume: number;
  } | null;
  analysisComplete?: boolean;
}

interface ProjectDetailsStepProps {
  settings: PrintSettings;
  onSettingsChange: (settings: PrintSettings) => void;
  fileInfo: FileInfo;
  requiredFilled: boolean;
  onNext: () => void;
  onBack?: () => void;
  isLastStep?: boolean;
}

export const ProjectDetailsStep: React.FC<ProjectDetailsStepProps> = ({
  settings,
  onSettingsChange,
  fileInfo,
  requiredFilled,
  onNext,
  onBack,
  isLastStep = true,
}) => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [userMode, setUserMode] = useState<"beginner" | "advanced">("beginner");

  // Set default values for resolution and finish when in beginner mode
  useEffect(() => {
    if (userMode === "beginner") {
      if (!settings.resolution) {
        updateSetting("resolution", "standard");
      }
      if (!settings.finish) {
        updateSetting("finish", "basic");
      }
    }
  }, [userMode, settings.resolution, settings.finish]);

  // Debug logging
  console.log("ProjectDetailsStep settings:", settings);

  const updateSetting = <K extends keyof PrintSettings>(
    key: K,
    value: PrintSettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    onSettingsChange(newSettings);
  };

  const handleModeChange = (mode: "beginner" | "advanced") => {
    setUserMode(mode);

    // Set default values when switching to beginner mode
    if (mode === "beginner") {
      if (!settings.resolution) {
        updateSetting("resolution", "standard");
      }
      if (!settings.finish) {
        updateSetting("finish", "basic");
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateSetting("referenceImage", file);
    }
  };

  const handleColorSelect = (colorName: string) => {
    console.log("Color selected:", colorName);
    const newSettings = {
      ...settings,
      color: colorName,
      // Clear custom color when selecting a swatch
      customColor: colorName !== "custom" ? "" : settings.customColor,
    };
    onSettingsChange(newSettings);
  };

  // Helper function to get hex color for preview
  const getPreviewColor = () => {
    if (settings.color === "custom" && settings.customColor) {
      // For custom colors, try to extract a valid hex color or default to blue
      const customColorLower = settings.customColor.toLowerCase();
      // Check if it's already a hex color
      if (/^#[0-9a-f]{6}$/i.test(customColorLower)) {
        return customColorLower;
      }
      // For named colors or Pantone codes, default to a nice blue
      return "#2563EB";
    }
    // Get hex from predefined colors
    const colorSwatch = COLOR_SWATCHES.find((c) => c.name === settings.color);
    return colorSwatch ? colorSwatch.hex : "#2563EB";
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Project Details Header */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold">Project Details</h3>
        <p className="text-sm text-muted-foreground">
          {userMode === "beginner"
            ? "Essential settings for your print project"
            : "Advanced controls for experienced users"}
        </p>
      </div>

      {/* File Info */}
      {fileInfo.file && (
        <div className="mb-6">
          <div className="text-sm text-muted-foreground mb-2">STL File</div>
          <div className="text-lg font-medium text-primary truncate">
            {fileInfo.file?.name}
          </div>
        </div>
      )}

      {/* Live Model Preview - Full Width */}
      {fileInfo.file && (
        <div className="mb-8 bg-muted/30 rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Live Preview
          </h3>
          <div className="h-64 w-full">
            <ModelPreview
              fileUrl={URL.createObjectURL(fileInfo.file)}
              color={getPreviewColor()}
              scale={settings.scale}
              isMobile={false}
              showScaleReferences={true}
            />
          </div>
        </div>
      )}

      {/* User Mode Toggle - Positioned on left side below preview */}
      <div className="mb-8 flex justify-start">
        <div className="flex items-center gap-4">
          <div className="flex bg-muted rounded-lg p-1 w-fit">
            <button
              onClick={() => handleModeChange("beginner")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                userMode === "beginner"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Beginner
            </button>
            <button
              onClick={() => handleModeChange("advanced")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                userMode === "advanced"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Settings className="w-4 h-4" />
              Advanced
            </button>
          </div>
          <div className="relative">
            <Info
              className="w-4 h-4 text-muted-foreground cursor-pointer"
              onMouseEnter={() => setActiveTooltip("mode")}
              onMouseLeave={() => setActiveTooltip(null)}
            />
            {activeTooltip === "mode" && (
              <div className="absolute z-50 bottom-full left-0 mb-2 px-4 py-2 bg-popover border border-border rounded-md shadow-md text-sm w-80">
                {userMode === "beginner"
                  ? "Switch to Advanced mode for more control over infill and technical settings."
                  : "Switch to Beginner mode for simplified settings focused on the essentials."}
                <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-popover"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Main Settings */}
        <div className="space-y-6">
          {/* Beginner Mode Info */}
          {userMode === "beginner" && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <div className="font-medium text-slate-900 mb-1">
                    Simplified Mode
                  </div>
                  <div className="text-slate-600">
                    Resolution and finish settings have been set to recommended
                    defaults. Switch to Advanced mode to customize these
                    settings.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Quantity <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              min={1}
              value={settings.quantity}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value >= 1) {
                  updateSetting("quantity", value);
                }
              }}
              className="w-full"
              placeholder="1"
            />
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Deadline (Optional)
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !settings.deadline && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {settings.deadline ? (
                    format(settings.deadline, "PPP")
                  ) : (
                    <span>Pick a deadline</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={settings.deadline}
                  onSelect={(date) => updateSetting("deadline", date)}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Finish */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Finish <span className="text-red-500">*</span>
            </label>
            <Select
              value={settings.finish || ""}
              onValueChange={(v) => updateSetting("finish", v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select finish">
                  {settings.finish
                    ? UPDATED_FINISHES.find((f) => f.value === settings.finish)
                        ?.label
                    : "Select finish"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {UPDATED_FINISHES.map((finish) => (
                  <SelectItem key={finish.value} value={finish.value}>
                    <div className="flex flex-col">
                      <span className="font-medium">{finish.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {finish.description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Material */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Material <span className="text-red-500">*</span>
            </label>
            <Select
              value={settings.material || ""}
              onValueChange={(v) => updateSetting("material", v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select material">
                  {settings.material
                    ? EXPANDED_MATERIALS.find(
                        (m) => m.value === settings.material
                      )?.label
                    : "Select material"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {EXPANDED_MATERIALS.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    <div className="flex flex-col">
                      <span className="font-medium">{m.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {m.description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Resolution - Only visible in Advanced Mode */}
          {userMode === "advanced" && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Resolution <span className="text-red-500">*</span>
              </label>
              <Select
                value={settings.resolution || ""}
                onValueChange={(v) => updateSetting("resolution", v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select resolution">
                    {settings.resolution
                      ? RESOLUTIONS.find((r) => r.value === settings.resolution)
                          ?.label
                      : "Select resolution"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {RESOLUTIONS.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      <div className="flex flex-col">
                        <span className="font-medium">{r.label}</span>
                        <span className="text-xs text-muted-foreground">
                          {r.description}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Right Column - Color and Scale */}
        <div className="space-y-6">
          {/* Color Picker */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Color <span className="text-red-500">*</span>
            </label>
            <div className="space-y-3">
              <div className="grid grid-cols-5 gap-2">
                {COLOR_SWATCHES.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => handleColorSelect(color.name)}
                    className={cn(
                      "w-full h-10 rounded-md border-2 transition-all hover:scale-105",
                      settings.color === color.name
                        ? "border-blue-500 ring-2 ring-blue-500/30 shadow-md"
                        : "border-gray-300 hover:border-blue-300"
                    )}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Custom:</span>
                <Input
                  placeholder="e.g., Pantone 123C, Forest Green"
                  value={settings.customColor}
                  onChange={(e) => {
                    console.log("Custom color changed:", e.target.value);
                    const newSettings = {
                      ...settings,
                      customColor: e.target.value,
                      color: "custom",
                    };
                    onSettingsChange(newSettings);
                  }}
                  className={cn(
                    "flex-1",
                    settings.color === "custom" && settings.customColor
                      ? "border-blue-500 ring-2 ring-blue-500/30"
                      : ""
                  )}
                />
              </div>
            </div>
          </div>

          {/* Scale */}
          <div className="bg-muted/50 rounded-md p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Scale</span>
              <div className="relative">
                <Info
                  className="w-4 h-4 text-muted-foreground cursor-pointer"
                  onMouseEnter={() => setActiveTooltip("scale")}
                  onMouseLeave={() => setActiveTooltip(null)}
                />
                {activeTooltip === "scale" && (
                  <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-4 py-2 bg-popover border border-border rounded-md shadow-md text-sm w-80">
                    Models are scaled proportionally to preserve geometry
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-popover"></div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={10}
                max={300}
                value={settings.scale}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (value >= 10 && value <= 300) {
                    updateSetting("scale", value);
                  }
                }}
                className="w-20"
              />
              <span className="text-sm font-medium">%</span>
              <div className="flex gap-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => updateSetting("scale", 50)}
                  className="text-xs px-2"
                >
                  50%
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => updateSetting("scale", 100)}
                  className="text-xs px-2"
                >
                  100%
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => updateSetting("scale", 200)}
                  className="text-xs px-2"
                >
                  200%
                </Button>
              </div>
            </div>

            <div className="text-xs text-muted-foreground">
              {fileInfo.dimensions ? (
                <>
                  <span className="font-medium">Final Size: </span>
                  {((fileInfo.dimensions.width * settings.scale) / 100).toFixed(
                    0
                  )}{" "}
                  ×{" "}
                  {((fileInfo.dimensions.depth * settings.scale) / 100).toFixed(
                    0
                  )}{" "}
                  ×{" "}
                  {(
                    (fileInfo.dimensions.height * settings.scale) /
                    100
                  ).toFixed(0)}
                  mm
                  <span className="text-muted-foreground ml-1">
                    (scaled from {fileInfo.dimensions.width.toFixed(1)} ×{" "}
                    {fileInfo.dimensions.depth.toFixed(1)} ×{" "}
                    {fileInfo.dimensions.height.toFixed(1)}mm)
                  </span>
                </>
              ) : fileInfo.analysisComplete ? (
                "Size information not available"
              ) : (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Analyzing model dimensions...
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Additional Advanced Settings - Only visible in Advanced Mode */}
      {userMode === "advanced" && (
        <div className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-1 flex items-center gap-1">
                <span className="text-sm font-medium">Infill %</span>
                <div className="relative">
                  <Info
                    className="w-4 h-4 ml-1 text-muted-foreground cursor-pointer"
                    onMouseEnter={() => setActiveTooltip("infill")}
                    onMouseLeave={() => setActiveTooltip(null)}
                  />
                  {activeTooltip === "infill" && (
                    <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-4 py-2 bg-popover border border-border rounded-md shadow-md text-sm w-80">
                      Infill determines how solid your print is inside. Higher
                      infill increases strength, print time, and cost. Most
                      prints use 10–30%.
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-popover"></div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Slider
                  min={5}
                  max={100}
                  step={5}
                  value={[settings.infill]}
                  onValueChange={(v) => updateSetting("infill", v[0])}
                  className="w-32"
                />
                <span className="text-sm font-medium w-8">
                  {settings.infill}%
                </span>
              </div>
            </div>

            <div>
              <div className="mb-1 flex items-center gap-1">
                <span className="text-sm font-medium">Infill Pattern</span>
                <div className="relative">
                  <Info
                    className="w-4 h-4 text-muted-foreground cursor-pointer"
                    onMouseEnter={() => setActiveTooltip("infillPattern")}
                    onMouseLeave={() => setActiveTooltip(null)}
                  />
                  {activeTooltip === "infillPattern" && (
                    <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-4 py-2 bg-popover border border-border rounded-md shadow-md text-sm w-80">
                      Different infill patterns affect strength, print time, and
                      material usage. Grid is the most common choice.
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-popover"></div>
                    </div>
                  )}
                </div>
              </div>
              <Select
                value={settings.infillPattern || "grid"}
                onValueChange={(v) => updateSetting("infillPattern", v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select infill pattern">
                    {settings.infillPattern
                      ? INFILL_PATTERNS.find(
                          (p) => p.value === settings.infillPattern
                        )?.label
                      : "Select infill pattern"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {INFILL_PATTERNS.map((pattern) => (
                    <SelectItem key={pattern.value} value={pattern.value}>
                      <div className="flex flex-col">
                        <span className="font-medium">{pattern.label}</span>
                        <span className="text-xs text-muted-foreground">
                          {pattern.description}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Design Notes */}
      <div className="mt-8 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Design Notes & Requirements (Optional)
          </label>
          <Textarea
            placeholder="Describe any specific requirements, color matching needs, functional requirements, or other important details for makers..."
            value={settings.designNotes}
            onChange={(e) => updateSetting("designNotes", e.target.value)}
            className="min-h-[100px]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Reference Image (Optional)
          </label>
          <div className="flex items-center gap-2">
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="referenceImage"
            />
            <label
              htmlFor="referenceImage"
              className="flex items-center gap-2 px-3 py-2 border border-border rounded-md cursor-pointer hover:bg-muted transition-colors"
            >
              <Image className="w-4 h-4" />
              <span className="text-sm">Upload reference photo</span>
            </label>
            {settings.referenceImage && (
              <span className="text-sm text-muted-foreground">
                {settings.referenceImage.name}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex w-full justify-end items-center mt-8">
        <Button size="lg" disabled={!requiredFilled} onClick={onNext}>
          {isLastStep ? "Submit Project" : "Review Project"}
        </Button>
      </div>
    </div>
  );
};
