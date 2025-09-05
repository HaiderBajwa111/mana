import {
  User,
  Building,
  Printer,
  FileText,
  CheckCircle,
  Sparkles,
  MapPin,
  CreditCard,
} from "lucide-react";
import type {
  OnboardingFlowConfig,
  OnboardingStep,
  UserRole,
} from "@/types/onboarding";
import { validateMakerFlow, validateCreatorFlow } from "./validation";

// ============================================================================
// STEP DEFINITIONS
// ============================================================================

export const MAKER_STEPS: OnboardingStep[] = [
  {
    id: "profile",
    title: "Seller Profile",
    description: "Tell us about yourself and your business",
    icon: User,
    isRequired: true,
  },
  {
    id: "equipment",
    title: "Add your printer(s)",
    description: "List the printers you'll use to fulfill orders",
    icon: Printer,
    isRequired: true,
  },
  {
    id: "terms",
    title: "Legal Agreements",
    description: "Review and accept our terms",
    icon: FileText,
    isRequired: true,
  },
  {
    id: "complete",
    title: "Welcome Aboard!",
    description: "You're all set to start accepting orders",
    icon: CheckCircle,
    isRequired: true,
  },
];

export const CREATOR_STEPS: OnboardingStep[] = [
  {
    id: "profile",
    title: "Complete Your Profile",
    description: "Tell us about yourself",
    icon: User,
    isRequired: true,
  },
  {
    id: "preferences",
    title: "Quick Preferences",
    description: "Help us personalize your experience",
    icon: Sparkles,
    isRequired: true,
  },
  {
    id: "shipping",
    title: "Set Delivery Address",
    description: "Where should we deliver your prints?",
    icon: MapPin,
    isRequired: false,
    canSkip: true,
  },
  {
    id: "payment",
    title: "Add Payment Method",
    description: "Set up payment for your orders",
    icon: CreditCard,
    isRequired: false,
    canSkip: true,
  },
  {
    id: "terms",
    title: "Final Touches",
    description: "Review and complete your setup",
    icon: CheckCircle,
    isRequired: true,
  },
];

// ============================================================================
// FLOW CONFIGURATIONS
// ============================================================================

export const MAKER_FLOW_CONFIG: OnboardingFlowConfig = {
  role: "maker",
  steps: MAKER_STEPS,
  validationRules: {
    profile: (data) => validateMakerFlow(data, "profile"),
    equipment: (data) => validateMakerFlow(data, "equipment"),
    terms: (data) => validateMakerFlow(data, "terms"),
  },
};

export const CREATOR_FLOW_CONFIG: OnboardingFlowConfig = {
  role: "creator",
  steps: CREATOR_STEPS,
  validationRules: {
    profile: (data) => validateCreatorFlow(data, "profile"),
    preferences: (data) => validateCreatorFlow(data, "preferences"),
    shipping: (data) => validateCreatorFlow(data, "shipping"),
    payment: (data) => validateCreatorFlow(data, "payment"),
    terms: (data) => validateCreatorFlow(data, "terms"),
  },
};

// ============================================================================
// HYBRID FLOW CONFIGURATION
// ============================================================================

export const HYBRID_FLOW_CONFIG: OnboardingFlowConfig = {
  role: "both",
  steps: [
    ...MAKER_STEPS,
    ...CREATOR_STEPS.filter((step) => step.id !== "profile"), // Avoid duplicate profile step
  ],
  validationRules: {
    ...MAKER_FLOW_CONFIG.validationRules,
    ...CREATOR_FLOW_CONFIG.validationRules,
  },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function getFlowConfig(role: UserRole): OnboardingFlowConfig {
  switch (role) {
    case "maker":
      return MAKER_FLOW_CONFIG;
    case "creator":
      return CREATOR_FLOW_CONFIG;
    case "both":
      return HYBRID_FLOW_CONFIG;
    default:
      throw new Error(`Invalid role: ${role}`);
  }
}

export function getStepIndex(role: UserRole, stepId: string): number {
  const config = getFlowConfig(role);
  return config.steps.findIndex((step) => step.id === stepId);
}

export function getStepById(
  role: UserRole,
  stepId: string
): OnboardingStep | undefined {
  const config = getFlowConfig(role);
  return config.steps.find((step) => step.id === stepId);
}

export function getNextStep(
  role: UserRole,
  currentStepId: string
): OnboardingStep | null {
  const config = getFlowConfig(role);
  const currentIndex = getStepIndex(role, currentStepId);

  if (currentIndex === -1 || currentIndex === config.steps.length - 1) {
    return null;
  }

  return config.steps[currentIndex + 1];
}

export function getPreviousStep(
  role: UserRole,
  currentStepId: string
): OnboardingStep | null {
  const config = getFlowConfig(role);
  const currentIndex = getStepIndex(role, currentStepId);

  if (currentIndex <= 0) {
    return null;
  }

  return config.steps[currentIndex - 1];
}

export function canSkipStep(role: UserRole, stepId: string): boolean {
  const step = getStepById(role, stepId);
  return step?.canSkip || false;
}

export function isStepRequired(role: UserRole, stepId: string): boolean {
  const step = getStepById(role, stepId);
  return step?.isRequired || false;
}
