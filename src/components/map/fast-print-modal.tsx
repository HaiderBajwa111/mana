"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  X,
  Zap,
  CheckCircle,
  Clock,
  Package,
  Ruler,
  Palette,
  MessageCircle,
  Star,
  MapPin,
  Loader2,
} from "lucide-react";

interface FastPrintModalProps {
  file: File;
  manufacturers: any[];
  userLocation: { lat: number; lng: number } | null;
  onClose: () => void;
}

export function FastPrintModal({
  file,
  manufacturers,
  userLocation,
  onClose,
}: FastPrintModalProps) {
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [selectedManufacturer, setSelectedManufacturer] = useState<any>(null);
  const [printSpecs, setPrintSpecs] = useState<any>(null);

  // Simulate file analysis
  useEffect(() => {
    const interval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setAnalysisComplete(true);
          // Set mock analysis results
          setPrintSpecs({
            dimensions: "120 × 80 × 45 mm",
            volume: "432 cm³",
            estimatedTime: "4h 30m",
            recommendedMaterial: "PLA",
            supportRequired: true,
            infill: "20%",
            layerHeight: "0.2mm",
            estimatedCost: "$12-18",
          });
          // Find best manufacturer
          const best =
            manufacturers.find((m) => m.recommended) || manufacturers[0];
          setSelectedManufacturer(best);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [manufacturers]);

  const handleSendRequest = () => {
    // Simulate sending request
    alert(`Request sent to ${selectedManufacturer.businessName}!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-mana-black border border-mana-gray-light/20 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="relative p-6 border-b border-mana-gray-light/20">
          <Button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-mana-gray/20 text-mana-text hover:bg-mana-gray/40 p-0"
          >
            <X className="w-5 h-5" />
          </Button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-400/20 rounded-full flex items-center justify-center">
              <Zap className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-mana-text">
                Fast Print Analysis
              </h2>
              <p className="text-mana-text-secondary">Analyzing {file.name}</p>
            </div>
          </div>
        </div>

        <div className="flex h-[600px]">
          {/* Left Side - Analysis */}
          <div className="w-1/2 p-6 border-r border-mana-gray-light/20">
            {!analysisComplete ? (
              <div className="space-y-6">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 animate-spin text-mana-mint mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-mana-text mb-2">
                    Analyzing Your 3D Model
                  </h3>
                  <p className="text-mana-text-secondary">
                    We're examining dimensions, complexity, and material
                    requirements...
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-mana-text-secondary">
                      Analysis Progress
                    </span>
                    <span className="text-mana-text">{analysisProgress}%</span>
                  </div>
                  <Progress value={analysisProgress} className="h-2" />
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-mana-text-secondary">
                      File format validated
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-mana-text-secondary">
                      Geometry analyzed
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {analysisProgress > 60 ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <Loader2 className="w-4 h-4 animate-spin text-mana-mint" />
                    )}
                    <span className="text-mana-text-secondary">
                      Print requirements calculated
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {analysisProgress > 80 ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <div className="w-4 h-4 border-2 border-mana-gray/40 rounded-full" />
                    )}
                    <span className="text-mana-text-secondary">
                      Matching with manufacturers
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-mana-text mb-2">
                    Analysis Complete!
                  </h3>
                  <p className="text-mana-text-secondary">
                    Here's what we found about your model:
                  </p>
                </div>

                {/* Print Specifications */}
                <div className="space-y-4">
                  <h4 className="font-medium text-mana-text">
                    Print Specifications
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-mana-gray/20 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Ruler className="w-4 h-4 text-mana-mint" />
                        <span className="text-sm font-medium text-mana-text">
                          Dimensions
                        </span>
                      </div>
                      <span className="text-mana-text-secondary">
                        {printSpecs?.dimensions}
                      </span>
                    </div>
                    <div className="bg-mana-gray/20 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4 text-mana-mint" />
                        <span className="text-sm font-medium text-mana-text">
                          Est. Time
                        </span>
                      </div>
                      <span className="text-mana-text-secondary">
                        {printSpecs?.estimatedTime}
                      </span>
                    </div>
                    <div className="bg-mana-gray/20 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Package className="w-4 h-4 text-mana-mint" />
                        <span className="text-sm font-medium text-mana-text">
                          Material
                        </span>
                      </div>
                      <span className="text-mana-text-secondary">
                        {printSpecs?.recommendedMaterial}
                      </span>
                    </div>
                    <div className="bg-mana-gray/20 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Palette className="w-4 h-4 text-mana-mint" />
                        <span className="text-sm font-medium text-mana-text">
                          Est. Cost
                        </span>
                      </div>
                      <span className="text-mana-text-secondary">
                        {printSpecs?.estimatedCost}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-mana-text-secondary">
                      Support Required
                    </span>
                    <Badge
                      variant={
                        printSpecs?.supportRequired
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {printSpecs?.supportRequired ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-mana-text-secondary">
                      Infill Density
                    </span>
                    <span className="text-mana-text">{printSpecs?.infill}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-mana-text-secondary">
                      Layer Height
                    </span>
                    <span className="text-mana-text">
                      {printSpecs?.layerHeight}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Side - Manufacturer Match */}
          <div className="w-1/2 p-6">
            {!analysisComplete ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-16 h-16 bg-mana-gray/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-mana-gray" />
                  </div>
                  <p className="text-mana-text-secondary">
                    Finding the best manufacturer for your print...
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-mana-text mb-2">
                    Recommended Manufacturer
                  </h3>
                  <p className="text-mana-text-secondary">
                    Based on your requirements and location
                  </p>
                </div>

                {selectedManufacturer && (
                  <div className="border border-mana-mint/30 rounded-lg p-4 bg-mana-mint/5">
                    <div className="flex items-start gap-4 mb-4">
                      <Image
                        src={selectedManufacturer.avatar || "/assets/placeholders/placeholder.svg"}
                        alt={selectedManufacturer.businessName}
                        width={60}
                        height={60}
                        className="rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-mana-text">
                          {selectedManufacturer.businessName}
                        </h4>
                        <p className="text-mana-text-secondary text-sm mb-2">
                          {selectedManufacturer.tagline}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-mana-text">
                              {selectedManufacturer.rating}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-mana-text-secondary">
                            <MapPin className="w-4 h-4" />
                            <span>{selectedManufacturer.distance}</span>
                          </div>
                          <div className="flex items-center gap-1 text-mana-text-secondary">
                            <Clock className="w-4 h-4" />
                            <span>{selectedManufacturer.avgTurnaround}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-mana-text-secondary">
                          Estimated Total
                        </span>
                        <span className="text-mana-mint font-semibold text-lg">
                          $15.50
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-mana-text-secondary">
                          Ready by
                        </span>
                        <span className="text-mana-text">
                          Tomorrow, 2:30 PM
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-mana-gray-light/20">
                      <h5 className="font-medium text-mana-text mb-2">
                        Why this match?
                      </h5>
                      <ul className="text-sm text-mana-text-secondary space-y-1">
                        <li>• Specializes in PLA printing</li>
                        <li>• Fastest turnaround in your area</li>
                        <li>• Excellent reviews for similar projects</li>
                        <li>• Available now</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* Alternative Options */}
                <div>
                  <h4 className="font-medium text-mana-text mb-3">
                    Other Options
                  </h4>
                  <div className="space-y-2">
                    {manufacturers.slice(1, 3).map((manufacturer) => (
                      <div
                        key={manufacturer.id}
                        onClick={() => setSelectedManufacturer(manufacturer)}
                        className="flex items-center gap-3 p-3 rounded-lg border border-mana-gray-light/20 hover:border-mana-mint/30 cursor-pointer transition-colors"
                      >
                        <Image
                          src={manufacturer.avatar || "/assets/placeholders/placeholder.svg"}
                          alt={manufacturer.businessName}
                          width={40}
                          height={40}
                          className="rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-mana-text text-sm">
                            {manufacturer.businessName}
                          </div>
                          <div className="text-xs text-mana-text-secondary">
                            {manufacturer.distance} • $18-22
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-mana-text">
                            {manufacturer.rating}
                          </div>
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        {analysisComplete && (
          <div className="p-6 border-t border-mana-gray-light/20 flex gap-3">
            <Button
              onClick={handleSendRequest}
              className="flex-1 bg-mana-mint text-mana-black hover:bg-mana-mint/90"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Send Print Request
            </Button>
            <Button variant="outline" className="border-mana-gray-light/30">
              View All Options
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
