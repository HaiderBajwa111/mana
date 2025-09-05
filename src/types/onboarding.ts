// ============================================================================
// BASE ONBOARDING TYPES
// ============================================================================

export type UserRole = "creator" | "maker" | "both" | null;

export interface BaseOnboardingData {
  // Shared profile fields
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  phone?: string;
  phoneVerified?: boolean;
  profilePicture?: File;

  // Shared business fields
  accountType?: "individual" | "business";
  businessName?: string;

  // Shared terms
  agreedToTerms?: boolean;

  // Role-specific data
  makerData?: MakerSpecificData;
  creatorData?: CreatorSpecificData;
}

// ============================================================================
// ROLE-SPECIFIC DATA TYPES
// ============================================================================

export interface MakerSpecificData {
  // Business profile
  portfolioLink?: string;
  samplePrints?: File[];
  bio?: string;

  // Equipment info
  hasEquipment?: boolean;
  printerTypes?: string[];
  printers?: Array<{
    printerModelId?: number;
    brand?: string;
    model?: string;
    type?: string; // e.g. FDM, SLA
    customName?: string;
    quantity?: number;
    notes?: string;
  }>;

  // UI-only helpers for selection
  printerSearch?: string;
  printerResults?: Array<{
    id: number;
    name: string;
    brand: string;
    type: string;
    buildVolume: string;
  }>;

  // Maker-specific terms
  agreedToManufacturingTerms?: boolean;
  contractsSigned?: boolean;

  // Optional setup flags
  equipmentSetupLater?: boolean;
  paymentSetupLater?: boolean;
  shippingSetupLater?: boolean;
}

export interface CreatorSpecificData {
  // Creator preferences
  useCase?: string;
  categoryInterests?: string[];

  // Creator-specific settings
  emailNotifications?: boolean;
  shippingSetupLater?: boolean;
  paymentSetupLater?: boolean;

  // Shipping information
  shippingAddress?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };

  // Payment information
  paymentMethodAdded?: boolean;

  // Added for unified onboarding
  portfolioLink?: string;
  bio?: string;

  // Added for unified onboarding (account type/business)
  accountType?: "individual" | "business";
  businessName?: string;
}

// ============================================================================
// FLOW CONFIGURATION TYPES
// ============================================================================

export interface OnboardingStep {
  id: string;
  title: string;
  description?: string;
  icon: React.ComponentType<any>;
  isRequired: boolean;
  canSkip?: boolean;
}

export interface OnboardingFlowConfig {
  role: UserRole;
  steps: OnboardingStep[];
  validationRules: Record<
    string,
    (data: BaseOnboardingData) => Record<string, string>
  >;
}

// ============================================================================
// VALIDATION TYPES
// ============================================================================

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface FieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export interface OnboardingProgress {
  currentStep: number;
  completedSteps: string[];
  totalSteps: number;
  progressPercentage: number;
}

export interface OnboardingState {
  data: BaseOnboardingData;
  progress: OnboardingProgress;
  errors: Record<string, string>;
  isSubmitting: boolean;
}
