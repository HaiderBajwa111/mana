"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Loader2,
  Plus,
  Minus,
  X,
  User,
  Building,
} from "lucide-react";
import type {
  BaseOnboardingData,
  UserRole,
  OnboardingState,
} from "@/types/onboarding";
import {
  getFlowConfig,
  getStepIndex,
  getStepById,
  canSkipStep,
} from "./shared/flow-config";
import { validateOnboardingData, isStepValid } from "./shared/validation";
import {
  TextInput,
  TextareaInput,
  SelectInput,
  RadioGroupInput,
  BigButtonRadioGroup,
  CheckboxInput,
  MultiSelectInput,
  FileUploadInput,
  AddressInput,
} from "./shared/form-fields";
import { fetchPrinterCatalog } from "@/app/actions/onboarding";
// Sheet/Dialog removed; catalog is now inline

// ============================================================================
// CONSTANTS
// ============================================================================

const PRINTER_TYPES = [
  { value: "FDM/FFF", label: "FDM/FFF" },
  { value: "SLA/Resin", label: "SLA/Resin" },
  { value: "SLS", label: "SLS" },
  { value: "Multi-Material", label: "Multi-Material" },
  { value: "Large Format", label: "Large Format" },
  { value: "Industrial", label: "Industrial" },
];

const USE_CASES = [
  { value: "Hobby/Personal", label: "Hobby/Personal" },
  { value: "School/Education", label: "School/Education" },
  { value: "Business", label: "Business" },
  { value: "Prototyping", label: "Prototyping" },
  { value: "Art/Creative", label: "Art/Creative" },
];

const CATEGORIES = [
  { value: "Mechanical Parts", label: "Mechanical Parts" },
  { value: "Miniatures", label: "Miniatures" },
  { value: "Jewelry", label: "Jewelry" },
  { value: "Functional Items", label: "Functional Items" },
  { value: "Art/Decorative", label: "Art/Decorative" },
  { value: "Toys/Games", label: "Toys/Games" },
];

const ACCOUNT_TYPES = [
  {
    value: "individual",
    label: "Individual",
    description: "Personal account for hobbyists and creators",
    icon: User,
  },
  {
    value: "business",
    label: "Business",
    description: "Business or organization account",
    icon: Building,
  },
];

// Model images provided for specific brand+model pairs
const MODEL_IMAGES: Array<{
  brand: string;
  model: string;
  type: string;
  buildVolume: string;
  image?: string;
  imagePage?: string;
}> = [
  {
    brand: "Anycubic",
    model: "Kobra 2 Max",
    type: "FDM",
    buildVolume: "420 × 420 × 500",
    image:
      "https://store.anycubic.com/cdn/shop/files/Kobra2Max_1.jpg?v=1755144036&width=416",
  },
  {
    brand: "Anycubic",
    model: "Kobra Neo",
    type: "FDM",
    buildVolume: "220 × 220 × 250",
    image:
      "https://store.anycubic.com/cdn/shop/files/Kobra2Neo_1_5f0bab06-36dd-4fb1-ba8c-6369d990c606.jpg?v=1699869521&width=416",
  },
  {
    brand: "Anycubic",
    model: "Photon Mono M5s",
    type: "SLA",
    buildVolume: "218 × 123 × 200",
    image:
      "https://store.anycubic.com/cdn/shop/files/PhotonMonoM5s.png?v=1725264493&width=416",
  },
  {
    brand: "Anycubic",
    model: "Photon Mono X 6K",
    type: "SLA",
    buildVolume: "197 × 122 × 245",
    image:
      "https://store.anycubic.com/cdn/shop/products/PhotonMonoX6K_1.jpg?v=1700989102&width=416",
  },
  {
    brand: "Anycubic",
    model: "Photon Mono 2",
    type: "SLA",
    buildVolume: "143 × 89 × 165",
    image:
      "https://store.anycubic.com/cdn/shop/files/PhotonMono2.png?v=1737430468&width=416",
  },
  {
    brand: "Elegoo",
    model: "Mars 4 Ultra",
    type: "SLA",
    buildVolume: "153 × 77 × 165",
    image:
      "https://us.elegoo.com/cdn/shop/products/elegoo-mars-4-ultra-3d-printer-2.jpg?v=1741605691&width=345",
  },
  {
    brand: "Elegoo",
    model: "Saturn 3 Ultra",
    type: "SLA",
    buildVolume: "218 × 123 × 260",
    imagePage:
      "https://us.elegoo.com/products/elegoo-saturn-3-ultra-resin-3d-printer-12k",
  },
  {
    brand: "Elegoo",
    model: "Jupiter SE",
    type: "SLA",
    buildVolume: "277 × 156 × 300",
    imagePage:
      "https://us.elegoo.com/products/elegoo-jupiter-se-resin-3d-printer",
  },
  {
    brand: "Elegoo",
    model: "Neptune 4 Max",
    type: "FDM",
    buildVolume: "420 × 420 × 480",
    imagePage: "https://us.elegoo.com/products/neptune-4-max-fdm-3d-printer",
  },
  {
    brand: "Elegoo",
    model: "Neptune 4 Pro",
    type: "FDM",
    buildVolume: "225 × 225 × 265",
    imagePage: "https://us.elegoo.com/products/neptune-4-pro-fdm-3d-printer",
  },
  {
    brand: "Raise3D",
    model: "Pro3",
    type: "FDM",
    buildVolume: "300 × 300 × 300",
    imagePage: "https://www.raise3d.com/pro3-series/",
  },
  {
    brand: "Raise3D",
    model: "Pro3 Plus",
    type: "FDM",
    buildVolume: "300 × 300 × 605",
    imagePage: "https://www.raise3d.com/pro3-plus/",
  },
  {
    brand: "Raise3D",
    model: "E2",
    type: "FDM",
    buildVolume: "330 × 240 × 240",
    imagePage: "https://www.raise3d.com/e2/",
  },
  {
    brand: "Raise3D",
    model: "E2CF",
    type: "FDM",
    buildVolume: "330 × 240 × 240",
    imagePage: "https://www.raise3d.com/e2cf/",
  },
  {
    brand: "Formlabs",
    model: "Form 3+",
    type: "SLA",
    buildVolume: "145 × 145 × 185",
    imagePage: "https://formlabs.com/3d-printers/form-3-plus/",
  },
  {
    brand: "Formlabs",
    model: "Form 3B+",
    type: "SLA",
    buildVolume: "145 × 145 × 185",
    imagePage: "https://formlabs.com/3d-printers/form-3b-plus/",
  },
  {
    brand: "Formlabs",
    model: "Form 4",
    type: "SLA",
    buildVolume: "200 × 125 × 210",
    imagePage: "https://formlabs.com/3d-printers/form-4/",
  },
  {
    brand: "Formlabs",
    model: "Form 4B",
    type: "SLA",
    buildVolume: "200 × 125 × 210",
    imagePage: "https://formlabs.com/3d-printers/form-4b/",
  },
  {
    brand: "Flashforge",
    model: "Creator 4",
    type: "FDM",
    buildVolume: "400 × 350 × 500",
    imagePage: "https://www.flashforge.com/pages/creator-4?lang=en",
  },
  {
    brand: "Flashforge",
    model: "Guider 2S",
    type: "FDM",
    buildVolume: "280 × 250 × 300",
    imagePage: "https://flashforge-usa.com/products/guider-2s",
  },
  {
    brand: "Flashforge",
    model: "Adventurer 4 Pro",
    type: "FDM",
    buildVolume: "220 × 200 × 250",
    imagePage: "https://eu.flashforge.com/en-eu/products/adventurer-4-pro",
  },
  {
    brand: "Flashforge",
    model: "Foto 13.3",
    type: "SLA",
    buildVolume: "292 × 165 × 400",
    imagePage: "https://www.flashforge.com.hk/products/foto-13-3",
  },
  {
    brand: "Phrozen",
    model: "Sonic Mega 8K S",
    type: "SLA",
    buildVolume: "330 × 185 × 400",
    imagePage: "https://phrozen3d.com/products/sonic-mega-8k-s",
  },
  {
    brand: "Phrozen",
    model: "Sonic Mighty 8K",
    type: "SLA",
    buildVolume: "218 × 123 × 235",
    imagePage: "https://phrozen3d.com/products/sonic-mighty-8k-3d-printer",
  },
  {
    brand: "Phrozen",
    model: "Sonic Mini 8K S",
    type: "SLA",
    buildVolume: "165 × 72 × 180",
    imagePage: "https://phrozen3d.com/products/sonic-mini-8k-s",
  },
  {
    brand: "Voron",
    model: "Voron 2.4",
    type: "FDM",
    buildVolume: "350 × 350 × 350",
    imagePage: "https://vorondesign.com/voron_2.4",
  },
  {
    brand: "Voron",
    model: "Voron Trident",
    type: "FDM",
    buildVolume: "300 × 300 × 250",
    imagePage: "https://vorondesign.com/voron_trident",
  },
  {
    brand: "Voron",
    model: "Voron Switchwire",
    type: "FDM",
    buildVolume: "250 × 210 × 210",
    imagePage: "https://vorondesign.com/voron_switchwire",
  },
  {
    brand: "Prusa Research",
    model: "Prusa MK4",
    type: "FDM",
    buildVolume: "250 × 210 × 220",
    image:
      "https://likeahorseracing.com/wp-content/uploads/2022/08/prusa-mk4-white.jpg",
  },
  {
    brand: "Prusa Research",
    model: "Prusa MINI+",
    type: "FDM",
    buildVolume: "180 × 180 × 180",
    imagePage:
      "https://shop.prusa3d.com/en/3d-printers/19133-original-prusa-mini-plus.html",
  },
  {
    brand: "Prusa Research",
    model: "Prusa XL",
    type: "FDM",
    buildVolume: "360 × 360 × 360",
    imagePage:
      "https://shop.prusa3d.com/en/3d-printers/19193-original-prusa-xl.html",
  },
  {
    brand: "Prusa Research",
    model: "Prusa SL1S",
    type: "SLA",
    buildVolume: "127 × 80 × 150",
    imagePage:
      "https://shop.prusa3d.com/en/resin-printers/14650-original-prusa-sl1s-ltr.html",
  },
  {
    brand: "Bambu Lab",
    model: "X1-Carbon",
    type: "FDM",
    buildVolume: "256 × 256 × 256",
    image:
      "https://top3dshop.com/_next/image?url=/product_images/Bambu-Lab-X1-Carbon-3D-Printer.png&w=3840&q=75",
  },
  {
    brand: "Bambu Lab",
    model: "P1S",
    type: "FDM",
    buildVolume: "256 × 256 × 256",
    imagePage: "https://us.store.bambulab.com/products/p1s",
  },
  {
    brand: "Bambu Lab",
    model: "A1",
    type: "FDM",
    buildVolume: "256 × 256 × 256",
    imagePage: "https://us.store.bambulab.com/products/a1",
  },
  {
    brand: "Bambu Lab",
    model: "A1 Mini",
    type: "FDM",
    buildVolume: "180 × 180 × 180",
    imagePage: "https://us.store.bambulab.com/products/a1-mini",
  },
  {
    brand: "Creality",
    model: "Ender 3 V3 KE",
    type: "FDM",
    buildVolume: "220 × 220 × 240",
    imagePage:
      "https://www.creality.com/collections/ender-3-v3-ke-series-3d-printer",
  },
  {
    brand: "Creality",
    model: "Ender 3 S1 Pro",
    type: "FDM",
    buildVolume: "220 × 220 × 270",
    imagePage: "https://www.creality.com/products/ender-3-s1-pro",
  },
  {
    brand: "Creality",
    model: "K1 Max",
    type: "FDM",
    buildVolume: "300 × 300 × 300",
    imagePage: "https://www.creality.com/products/k1-max",
  },
  {
    brand: "Creality",
    model: "CR-M4",
    type: "FDM",
    buildVolume: "450 × 450 × 470",
    imagePage: "https://www.creality.com/products/cr-m4",
  },
  {
    brand: "Creality",
    model: "CR-10 Smart Pro",
    type: "FDM",
    buildVolume: "300 × 300 × 400",
    imagePage: "https://www.creality.com/products/cr-10-smart-pro",
  },
];

const normalizeKey = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
const MODEL_IMAGE_MAP: Map<string, { image?: string; imagePage?: string }> =
  new Map(
    MODEL_IMAGES.map((m) => [
      `${normalizeKey(m.brand)}|${normalizeKey(m.model)}`,
      { image: m.image, imagePage: m.imagePage },
    ])
  );

// ============================================================================
// INTERFACES
// ============================================================================

interface UnifiedOnboardingFlowProps {
  role: UserRole;
  initialData?: Partial<BaseOnboardingData>;
  onComplete: (data: BaseOnboardingData) => void | Promise<void>;
  onUpdate?: (data: BaseOnboardingData) => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function UnifiedOnboardingFlow({
  role,
  initialData = {},
  onComplete,
  onUpdate,
}: UnifiedOnboardingFlowProps) {
  // ========================================================================
  // STATE MANAGEMENT
  // ========================================================================

  const [state, setState] = useState<OnboardingState>(() => {
    const savedData =
      typeof window !== "undefined"
        ? localStorage.getItem("mana_unified_onboarding_data")
        : null;

    const savedProgress =
      typeof window !== "undefined"
        ? localStorage.getItem("mana_unified_onboarding_progress")
        : null;

    const data = savedData
      ? JSON.parse(savedData)
      : {
          ...initialData,
          makerData: initialData.makerData || {},
          creatorData: initialData.creatorData || {},
        };

    const progress = savedProgress
      ? JSON.parse(savedProgress)
      : {
          currentStep: 0,
          completedSteps: [],
          totalSteps: getFlowConfig(role).steps.length,
          progressPercentage: 0,
        };

    return {
      data,
      progress,
      errors: {},
      isSubmitting: false,
    };
  });

  // Local UI state for printer catalog
  const [printerSearch, setPrinterSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [printerResults, setPrinterResults] = useState<any[]>([]);
  const [popularModels, setPopularModels] = useState<any[]>([]);
  const [selectedResultIds, setSelectedResultIds] = useState<number[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // ========================================================================
  // EFFECTS
  // ========================================================================

  // Persist data and progress to localStorage
  useEffect(() => {
    localStorage.setItem(
      "mana_unified_onboarding_data",
      JSON.stringify(state.data)
    );
  }, [state.data]);

  useEffect(() => {
    localStorage.setItem(
      "mana_unified_onboarding_progress",
      JSON.stringify(state.progress)
    );
  }, [state.progress]);

  // Load recent searches and popular models on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("mana_printer_recent_searches");
      setRecentSearches(saved ? JSON.parse(saved) : []);
    } catch {}
    (async () => {
      setIsSearching(true);
      try {
        const popular = await fetchPrinterCatalog();
        setPopularModels(Array.isArray(popular) ? (popular as any[]) : []);
      } finally {
        setIsSearching(false);
      }
    })();
  }, []);

  // Debounced search for catalog
  useEffect(() => {
    const controller = setTimeout(async () => {
      if (!printerSearch || !printerSearch.trim()) {
        setPrinterResults([]);
        return;
      }
      setIsSearching(true);
      try {
        const results = await fetchPrinterCatalog(printerSearch);
        setPrinterResults(Array.isArray(results) ? (results as any[]) : []);
      } finally {
        setIsSearching(false);
      }
    }, 300);
    return () => clearTimeout(controller);
  }, [printerSearch]);

  // Catalog source and brand options
  const sourceCatalogList = useMemo(
    () => (printerSearch ? printerResults : popularModels),
    [printerSearch, printerResults, popularModels]
  );
  const brandOptions = useMemo(() => {
    const set = new Set<string>();
    for (const m of sourceCatalogList) {
      if (m?.brand) set.add(m.brand);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [sourceCatalogList]);
  const filteredCatalogList = useMemo(() => {
    if (!selectedBrands.length) return sourceCatalogList;
    return sourceCatalogList.filter((m: any) =>
      selectedBrands.includes(m.brand)
    );
  }, [sourceCatalogList, selectedBrands]);

  // Pre-populate from signup data
  useEffect(() => {
    const signupEmail = sessionStorage.getItem("user_email");
    const signupPassword = sessionStorage.getItem("signup_password");
    const signupFirstName = sessionStorage.getItem("user_firstName");
    const signupLastName = sessionStorage.getItem("user_lastName");

    if (signupEmail && !state.data.email) {
      updateData({
        email: signupEmail,
        password: signupPassword || "",
        firstName: signupFirstName || state.data.firstName || "",
        lastName: signupLastName || state.data.lastName || "",
      });
    }
  }, [state.data.email, state.data.firstName, state.data.lastName]);

  // ========================================================================
  // UTILITY FUNCTIONS
  // ========================================================================

  const flowConfig = useMemo(() => getFlowConfig(role), [role]);
  const currentStep = useMemo(
    () => flowConfig.steps[state.progress.currentStep],
    [flowConfig.steps, state.progress.currentStep]
  );

  // Resolve brand logo icon path from public/icons, fallback to generic printer
  const getBrandIconSrc = useCallback((brand?: string) => {
    const b = (brand || "").toLowerCase();
    if (b.includes("bambu")) return "/assets/printer-brands/bambulablogo.webp";
    if (b.includes("prusa")) return "/assets/printer-brands/prusa.png";
    if (b.includes("creality")) return "/assets/printer-brands/creality.webp";
    if (b.includes("elegoo")) return "/assets/printer-brands/elegoo.png";
    if (b.includes("anycubic")) return "/assets/printer-brands/anycubic.png";
    if (b.includes("flashforge") || b.includes("flash forge"))
      return "/assets/printer-brands/FlashForge-Icon-Logo-Vector.svg-.png";
    if (b.includes("formlabs")) return "/assets/printer-brands/formlabs.png";
    if (b.includes("phrozen")) return "/assets/printer-brands/phrozen.png";
    if (b.includes("raise3d") || b.includes("raise 3d") || b.includes("raise"))
      return "/assets/printer-brands/raise-3d-impresoras.png";
    if (b.includes("voron")) return "/assets/printer-brands/Voron.png";
    return "/assets/icons/printer.webp";
  }, []);

  const updateData = useCallback(
    (updates: Partial<BaseOnboardingData>) => {
      setState((prev) => ({
        ...prev,
        data: { ...prev.data, ...updates },
        errors: {}, // Clear errors when data changes
      }));

      onUpdate?.(updates as BaseOnboardingData);
    },
    [onUpdate]
  );

  const updateMakerData = useCallback(
    (updates: Partial<BaseOnboardingData["makerData"]>) => {
      setState((prev) => ({
        ...prev,
        data: {
          ...prev.data,
          makerData: { ...prev.data.makerData, ...updates },
        },
        errors: {},
      }));
    },
    []
  );

  const updateCreatorData = useCallback(
    (updates: Partial<BaseOnboardingData["creatorData"]>) => {
      if (!updates) return;
      setState((prev) => {
        // If accountType or businessName is being updated, also update at root
        const rootUpdates: Partial<BaseOnboardingData> = {};
        if ("accountType" in updates) {
          rootUpdates.accountType = updates.accountType;
        }
        if ("businessName" in updates) {
          rootUpdates.businessName = updates.businessName;
        }
        return {
          ...prev,
          data: {
            ...prev.data,
            ...rootUpdates,
            creatorData: { ...prev.data.creatorData, ...updates },
          },
          errors: {},
        };
      });
    },
    []
  );

  // ========================================================================
  // NAVIGATION HANDLERS
  // ========================================================================

  const validateCurrentStep = useCallback(() => {
    if (!role) return false; // Ensure role is not null
    const errors = validateOnboardingData(
      state.data,
      role as "creator" | "maker" | "both",
      currentStep.id
    );
    setState((prev) => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  }, [state.data, role, currentStep.id]);

  const nextStep = useCallback(() => {
    if (!validateCurrentStep()) return;

    const nextIndex = state.progress.currentStep + 1;
    if (nextIndex < flowConfig.steps.length) {
      setState((prev) => ({
        ...prev,
        progress: {
          ...prev.progress,
          currentStep: nextIndex,
          completedSteps: [...prev.progress.completedSteps, currentStep.id],
          progressPercentage: ((nextIndex + 1) / flowConfig.steps.length) * 100,
        },
      }));
    } else {
      // Complete onboarding
      handleComplete();
    }
  }, [
    validateCurrentStep,
    state.progress.currentStep,
    flowConfig.steps.length,
    currentStep.id,
  ]);

  const prevStep = useCallback(() => {
    if (state.progress.currentStep > 0) {
      setState((prev) => ({
        ...prev,
        progress: {
          ...prev.progress,
          currentStep: prev.progress.currentStep - 1,
          progressPercentage:
            (prev.progress.currentStep / flowConfig.steps.length) * 100,
        },
      }));
    }
  }, [state.progress.currentStep, flowConfig.steps.length]);

  const skipStep = useCallback(() => {
    if (canSkipStep(role, currentStep.id)) {
      nextStep();
    }
  }, [role, currentStep.id, nextStep]);

  const handleComplete = useCallback(async () => {
    setState((prev) => ({ ...prev, isSubmitting: true }));

    try {
      await onComplete(state.data);
    } catch (error) {
      console.error("Error completing onboarding:", error);
      setState((prev) => ({ ...prev, isSubmitting: false }));
    }
  }, [onComplete, state.data]);

  // ========================================================================
  // STEP RENDERING
  // ========================================================================

  const renderProfileStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          {role === "maker"
            ? "Tell us about yourself"
            : "Complete your profile"}
        </h2>
        <p className="text-slate-600">
          {role === "maker"
            ? "Help us understand your business and experience"
            : "Let's get to know you better"}
        </p>
      </div>

      {/* No first name, last name, email, or phone fields here! */}

      <BigButtonRadioGroup
        label="Account Type"
        value={
          role === "creator"
            ? state.data.creatorData?.accountType || ""
            : state.data.accountType || ""
        }
        onChange={(value) => {
          if (role === "creator") {
            updateCreatorData({
              accountType: value as "individual" | "business",
            });
          } else {
            updateData({ accountType: value as "individual" | "business" });
          }
        }}
        options={ACCOUNT_TYPES}
        error={
          role === "creator"
            ? state.errors.accountType
            : state.errors.accountType
        }
        required
      />

      {((role === "creator" &&
        state.data.creatorData?.accountType === "business") ||
        (role !== "creator" && state.data.accountType === "business")) && (
        <TextInput
          label="Business Name"
          value={
            role === "creator"
              ? state.data.creatorData?.businessName || ""
              : state.data.businessName || ""
          }
          onChange={(value) => {
            if (role === "creator") {
              updateCreatorData({ businessName: value });
            } else {
              updateData({ businessName: value });
            }
          }}
          error={
            role === "creator"
              ? state.errors.businessName
              : state.errors.businessName
          }
          required
        />
      )}

      <TextInput
        label="Website"
        value={
          state.data.makerData?.portfolioLink ||
          state.data.creatorData?.portfolioLink ||
          ""
        }
        onChange={(value) => {
          if (role === "maker") updateMakerData({ portfolioLink: value });
          else updateCreatorData({ portfolioLink: value });
        }}
        placeholder="https://your-portfolio.com"
      />

      <TextareaInput
        label="Bio"
        value={state.data.makerData?.bio || state.data.creatorData?.bio || ""}
        onChange={(value) => {
          if (role === "maker") updateMakerData({ bio: value });
          else updateCreatorData({ bio: value });
        }}
        error={state.errors.bio}
        placeholder="Tell us about your experience and what you can offer..."
        required
      />

      <FileUploadInput
        label="Profile Picture"
        value={state.data.profilePicture}
        onChange={(file) => updateData({ profilePicture: file })}
        accept="image/*"
        maxSize={5}
      />
    </div>
  );

  const renderBusinessStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Business Information
        </h2>
        <p className="text-slate-600">
          Set up your business profile to attract customers
        </p>
      </div>

      <div className="p-4 bg-blue-100 rounded-xl border border-blue-200">
        <p className="text-sm text-slate-600">
          💡 <strong>Optional:</strong> Add a portfolio link to showcase your
          work and attract more customers.
        </p>
      </div>
    </div>
  );

  const renderEquipmentStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Add your printer(s)
        </h2>
        <p className="text-slate-600">
          List the printers you'll use to fulfill orders
        </p>
      </div>

      {/* Actions removed per request */}

      {/* Helper text */}
      <div className="text-sm text-slate-600">
        Up to 10 printers. Duplicates are blocked. Use the catalog or add a
        custom model.
      </div>

      {/* Inline catalog replaces previous actions and empty-state */}
      <div className="space-y-3">
        <TextInput
          label="Search catalog"
          value={printerSearch}
          onChange={(value) => setPrinterSearch(value)}
          placeholder="e.g. Prusa MK4, Bambu, Elegoo..."
        />
        {!!brandOptions.length && (
          <div className="flex flex-wrap gap-2">
            {brandOptions.map((brand) => {
              const active = selectedBrands.includes(brand);
              return (
                <button
                  key={brand}
                  type="button"
                  className={`px-2 py-1 rounded-full border text-sm ${
                    active
                      ? "border-blue-600 text-blue-600"
                      : "hover:border-blue-500"
                  }`}
                  onClick={() =>
                    setSelectedBrands((prev) =>
                      prev.includes(brand)
                        ? prev.filter((b) => b !== brand)
                        : [...prev, brand]
                    )
                  }
                >
                  {brand}
                </button>
              );
            })}
            {!!selectedBrands.length && (
              <button
                type="button"
                className="px-2 py-1 rounded-full border text-sm hover:border-blue-500"
                onClick={() => setSelectedBrands([])}
              >
                Clear brands
              </button>
            )}
          </div>
        )}
        {!!recentSearches.length && !printerSearch && (
          <div className="flex flex-wrap gap-2 text-sm">
            {recentSearches.map((term) => (
              <button
                key={term}
                type="button"
                className="px-2 py-1 rounded-full border hover:border-blue-500"
                onClick={() => setPrinterSearch(term)}
              >
                {term}
              </button>
            ))}
          </div>
        )}
        <div className="h-[48vh] overflow-auto border rounded-xl p-3">
          {isSearching && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Array.from({ length: 8 }).map((_, idx) => (
                <div key={idx} className="p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-md" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-3 w-40" />
                      <Skeleton className="h-2 w-28" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {!isSearching && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {filteredCatalogList.map((m: any) => {
                const selected = (state.data.makerData?.printers || []).some(
                  (p) => p.printerModelId === m.id
                );
                return (
                  <button
                    key={m.id}
                    type="button"
                    className={`text-left p-3 border rounded-lg hover:border-blue-500 ${
                      selected ? "border-blue-500 bg-blue-50" : ""
                    }`}
                    onClick={() => {
                      const existing = state.data.makerData?.printers || [];
                      const already = existing.some(
                        (p) => p.printerModelId === m.id
                      );
                      if (already) {
                        const next = existing.filter(
                          (p) => p.printerModelId !== m.id
                        );
                        updateMakerData({ printers: next });
                      } else {
                        if (existing.length >= 10) return;
                        const next = [
                          ...existing,
                          {
                            printerModelId: m.id,
                            brand: m.brand,
                            model: m.name,
                            type: m.type,
                            quantity: 1,
                          },
                        ];
                        updateMakerData({ printers: next });
                      }
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={(() => {
                          const key = `${normalizeKey(m.brand)}|${normalizeKey(m.name)}`;
                          const meta = MODEL_IMAGE_MAP.get(key);
                          return meta?.image || getBrandIconSrc(m.brand);
                        })()}
                        alt={`${m.brand} ${m.name}`}
                        className="w-10 h-10 rounded-md border object-cover bg-white"
                      />
                      <div>
                        <div className="font-medium">
                          {m.brand} {m.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          {m.type} • {m.buildVolume}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
          {!isSearching && filteredCatalogList.length === 0 && (
            <div className="text-sm text-slate-600">
              No results. Try a different term.
            </div>
          )}
        </div>
        {/* Selection summary/actions removed; click toggles selection and applies immediately */}
      </div>

      <div className="flex items-center justify-end pt-2">
        <CheckboxInput
          label="I'll add my printers later"
          checked={state.data.makerData?.equipmentSetupLater || false}
          onChange={(checked) =>
            updateMakerData({ equipmentSetupLater: checked })
          }
        />
      </div>

      {/* Catalog Sheet removed */}

      {/* Custom printer dialog removed per request */}
    </div>
  );

  const renderPreferencesStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Quick Preferences
        </h2>
        <p className="text-slate-600">Help us personalize your experience</p>
      </div>

      <SelectInput
        label="Primary Use Case"
        value={state.data.creatorData?.useCase || ""}
        onChange={(value) => updateCreatorData({ useCase: value })}
        options={USE_CASES}
        error={state.errors.useCase}
        required
      />

      <MultiSelectInput
        label="Categories of Interest"
        value={state.data.creatorData?.categoryInterests || []}
        onChange={(value) => updateCreatorData({ categoryInterests: value })}
        options={CATEGORIES}
        error={state.errors.categoryInterests}
        required
      />
    </div>
  );

  const renderShippingStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Delivery Address
        </h2>
        <p className="text-slate-600">Where should we deliver your prints?</p>
      </div>

      <AddressInput
        value={state.data.creatorData?.shippingAddress || {}}
        onChange={(address) => updateCreatorData({ shippingAddress: address })}
        errors={state.errors}
        required={!state.data.creatorData?.shippingSetupLater}
      />

      <CheckboxInput
        label="I'll add my shipping address later"
        checked={state.data.creatorData?.shippingSetupLater || false}
        onChange={(checked) =>
          updateCreatorData({ shippingSetupLater: checked })
        }
      />
    </div>
  );

  const renderPaymentStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Payment Method
        </h2>
        <p className="text-slate-600">Set up payment for your orders</p>
      </div>

      <div className="p-6 bg-slate-100 rounded-xl border border-slate-200">
        <p className="text-slate-600 text-center">
          Payment integration coming soon. For now, you can skip this step.
        </p>
      </div>

      <CheckboxInput
        label="I'll add my payment method later"
        checked={state.data.creatorData?.paymentSetupLater || false}
        onChange={(checked) =>
          updateCreatorData({ paymentSetupLater: checked })
        }
      />
    </div>
  );

  const renderTermsStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          {role === "maker" ? "Terms of Service" : "Final Touches"}
        </h2>
        <p className="text-slate-600">
          {role === "maker"
            ? "Review and accept our terms of service"
            : "Review and complete your setup"}
        </p>
      </div>

      <div className="space-y-4">
        <CheckboxInput
          label="I agree to the Terms of Service and Privacy Policy"
          checked={state.data.agreedToTerms || false}
          onChange={(checked) => updateData({ agreedToTerms: checked })}
          error={state.errors.agreedToTerms}
          required
        />

        {role === "maker" && (
          <>
            <CheckboxInput
              label="I agree to the Manufacturing Terms and Conditions"
              checked={
                state.data.makerData?.agreedToManufacturingTerms || false
              }
              onChange={(checked) =>
                updateMakerData({ agreedToManufacturingTerms: checked })
              }
              error={state.errors.agreedToManufacturingTerms}
              required
            />
          </>
        )}

        <CheckboxInput
          label="Send me updates about my orders and new features"
          checked={state.data.creatorData?.emailNotifications !== false}
          onChange={(checked) =>
            updateCreatorData({ emailNotifications: checked })
          }
        />
      </div>
    </div>
  );

  const renderCompleteStep = () => (
    <div className="text-center space-y-8">
      <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-200/50 to-blue-100/50 rounded-full flex items-center justify-center border border-blue-200">
        <CheckCircle className="w-12 h-12 text-blue-600" />
      </div>

      <div>
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Welcome to Mana!
        </h2>
        <p className="text-lg text-slate-600">
          {role === "maker"
            ? "You're all set to start accepting print orders from customers."
            : "You're ready to start uploading designs and ordering prints."}
        </p>
      </div>

      <div className="p-6 bg-blue-100 rounded-xl border border-blue-200">
        <p className="text-sm text-slate-600">
          💡 <strong>Next steps:</strong> Explore the platform and start your
          journey with Mana!
        </p>
      </div>
    </div>
  );

  // ========================================================================
  // STEP RENDERING LOGIC
  // ========================================================================

  const renderCurrentStep = () => {
    switch (currentStep.id) {
      case "profile":
        return renderProfileStep();
      case "business":
        return renderBusinessStep();
      case "equipment":
        return renderEquipmentStep();
      case "preferences":
        return renderPreferencesStep();
      case "shipping":
        return renderShippingStep();
      case "payment":
        return renderPaymentStep();
      case "terms":
        return renderTermsStep();
      case "complete":
        return renderCompleteStep();
      default:
        return <div>Unknown step: {currentStep.id}</div>;
    }
  };

  // ========================================================================
  // MAIN RENDER
  // ========================================================================

  if (!currentStep) {
    return (
      <div className="text-center p-8">
        <p className="text-slate-600">Invalid step configuration</p>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep.id}
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -300 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="w-full max-w-2xl mx-auto px-6"
        >
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
              <span>
                Step {state.progress.currentStep + 1} of{" "}
                {flowConfig.steps.length}
              </span>
              <span>{Math.round(state.progress.progressPercentage)}%</span>
            </div>
            <div className="w-full bg-blue-100 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-blue-600 to-blue-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${state.progress.progressPercentage}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-background/80 backdrop-blur-sm rounded-3xl border border-border p-8">
            {renderCurrentStep()}

            {/* Navigation */}
            <div className="flex justify-between items-center pt-8 mt-8 border-t border-border">
              <Button
                onClick={prevStep}
                variant="outline"
                disabled={state.progress.currentStep === 0}
                className="bg-transparent border-slate-200 text-slate-600 hover:border-blue-600 hover:text-blue-600"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>

              <div className="flex gap-3">
                {canSkipStep(role, currentStep.id) && (
                  <Button
                    onClick={skipStep}
                    variant="outline"
                    className="bg-transparent border-slate-200 text-slate-600 hover:border-blue-600 hover:text-blue-600"
                  >
                    Skip
                  </Button>
                )}

                <Button
                  onClick={nextStep}
                  disabled={state.isSubmitting}
                  className="font-semibold rounded-xl px-8 py-3 hover:bg-primary/90"
                >
                  {state.isSubmitting ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : currentStep.id === "complete" ? (
                    <CheckCircle className="w-4 h-4 mr-2" />
                  ) : (
                    <ArrowRight className="w-4 h-4 mr-2" />
                  )}
                  {currentStep.id === "complete"
                    ? "Complete Setup"
                    : "Continue"}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
