"use client";

import React, { useRef, useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowLeft } from "lucide-react";

import { UploadStep } from "@/components/start-print/UploadStep";
import { ProjectDetailsStep } from "@/components/start-print/ProjectDetailsStep";
import DeliveryMethodStep from "@/components/start-print/DeliveryMethodStep";
import type { DeliverySettings } from "@/components/start-print/DeliveryMethodStep";
import { PostProjectStep } from "@/components/start-print/PostProjectStep";
import { type ModelDimensions } from "@/lib/stl-parser";
import { useRouter } from "next/navigation";

const STEPS = [
  { label: "Upload File" },
  { label: "Project Details" },
  { label: "Delivery Method" },
  { label: "Post Project" },
];

function StepperHeader({
  currentStep,
  skipUploadStep = false,
}: {
  currentStep: number;
  skipUploadStep?: boolean;
}) {
  return (
    <div className="flex items-center justify-center gap-4 mb-8">
      {STEPS.map((step, idx) => (
        <React.Fragment key={step.label}>
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full border-2 text-sm font-bold transition-all duration-200
                ${
                  idx < currentStep
                    ? "bg-primary text-primary-foreground border-primary"
                    : idx === currentStep
                      ? "bg-background border-primary text-primary"
                      : "bg-background border-border text-muted-foreground"
                }
              `}
            >
              {idx < currentStep ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                idx + 1
              )}
            </div>
            <span
              className={`mt-2 text-xs font-medium ${idx === currentStep ? "text-primary" : "text-muted-foreground"}`}
            >
              {step.label}
            </span>
          </div>
          {idx < STEPS.length - 1 && (
            <div
              className={`w-8 h-1 rounded-full ${idx < currentStep ? "bg-primary" : "bg-border"}`}
            ></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function StartPrintPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const MAX_SIZE_MB = 50;
  const [modelDimensions, setModelDimensions] =
    useState<ModelDimensions | null>(null);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  // Check if we should skip the upload step (file dropped from dashboard)
  useEffect(() => {
    const skipUpload = searchParams.get("skipUpload");
    if (skipUpload === "true") {
      // Check if we have a transferred file from the dashboard
      const transferredFile = (window as any).__transferredFile;
      if (transferredFile && transferredFile instanceof File) {
        console.log("File received from dashboard:", transferredFile);
        setFile(transferredFile);

        // Stay on step 0 (Upload) but with file already loaded
        // User can see the 3D model preview and then proceed to step 1
        setStep(0);

        // Clear the global variable
        delete (window as any).__transferredFile;

        console.log(
          "Skipped upload step, actual file loaded from dashboard:",
          transferredFile
        );
      }
    }
  }, [searchParams]);

  const [settings, setSettings] = useState({
    material: "",
    color: "",
    customColor: "",
    quantity: 1,
    resolution: "",
    finish: "",
    scale: 100,
    deadline: null as Date | null,
    designNotes: "",
    referenceImage: null as File | null,
    // Advanced settings
    infill: 20,
    infillPattern: "grid",
  });

  const [deliverySettings, setDeliverySettings] = useState<DeliverySettings>({
    method: null,
    shippingAddress: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
    },
    pickupInstructions: "",
  });

  const requiredFilled =
    file &&
    settings.material &&
    settings.color &&
    settings.quantity > 0 &&
    settings.resolution &&
    settings.finish;

  const fileInfo = {
    file,
    dimensions: modelDimensions,
    analysisComplete,
  };

  // Debug logging
  console.log("Current modelDimensions:", modelDimensions);
  console.log("Current fileInfo:", fileInfo);

  const onSettingsChange = (newSettings: any) => {
    setSettings(newSettings);
  };

  const handleDimensionsDetected = (dimensions: ModelDimensions | null) => {
    console.log("Dimensions detected:", dimensions);
    setModelDimensions(dimensions);
    setAnalysisComplete(true);
  };

  // Reset analysis state when file changes
  const handleFileChange = (newFile: File | null) => {
    setFile(newFile);
    if (newFile) {
      setAnalysisComplete(false);
      setModelDimensions(null);
    }
  };

  const handleProjectComplete = () => {
    // Redirect to dashboard to view quotes
    router.push("/creator/dashboard");
  };

  const handleBackToDashboard = () => {
    router.push("/creator/dashboard");
  };

  const getBackAction = () => {
    if (step === 0) return handleBackToDashboard;
    if (step === 1) return () => setStep(0);
    if (step === 2) return () => setStep(1);
    if (step === 3) return () => setStep(2);
    return handleBackToDashboard;
  };

  return (
    <div className="min-h-[80vh] bg-background relative">
      {/* Back Arrow */}
      <div className="absolute top-4 left-4 z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={getBackAction()}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center justify-center min-h-[80vh]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-4xl mx-auto px-4"
        >
          <StepperHeader
            currentStep={step}
            skipUploadStep={searchParams.get("skipUpload") === "true"}
          />

          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="upload-step"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="w-full flex flex-col items-center"
              >
                <UploadStep
                  file={file}
                  setFile={handleFileChange}
                  error={error}
                  setError={setError}
                  fileInputRef={fileInputRef}
                  onNext={() => setStep(1)}
                  MAX_SIZE_MB={MAX_SIZE_MB}
                  onDimensionsDetected={handleDimensionsDetected}
                />
              </motion.div>
            )}
            {step === 1 && (
              <motion.div
                key="pricing-step"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <ProjectDetailsStep
                  settings={settings}
                  onSettingsChange={onSettingsChange}
                  fileInfo={fileInfo}
                  requiredFilled={!!requiredFilled}
                  onNext={() => setStep(2)}
                  isLastStep={false}
                />
              </motion.div>
            )}
            {step === 2 && (
              <motion.div
                key="delivery-method-step"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <DeliveryMethodStep
                  settings={deliverySettings}
                  onSettingsChange={setDeliverySettings}
                />
                <div className="flex justify-end mt-8">
                  <Button
                    onClick={() => setStep(3)}
                    disabled={!deliverySettings.method}
                    className="px-8"
                  >
                    Continue to Post Project
                  </Button>
                </div>
              </motion.div>
            )}
            {step === 3 && (
              <motion.div
                key="post-project-step"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <PostProjectStep
                  settings={settings}
                  fileInfo={fileInfo}
                  onComplete={handleProjectComplete}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

export default function StartPrintPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StartPrintPageContent />
    </Suspense>
  );
}
