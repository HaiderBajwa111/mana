import type {
  BaseOnboardingData,
  MakerSpecificData,
  CreatorSpecificData,
} from "@/types/onboarding";

// ============================================================================
// SHARED VALIDATION RULES
// ============================================================================

export function validateRequired(value: any, fieldName: string): string | null {
  if (!value || (typeof value === "string" && !value.trim())) {
    return `${fieldName} is required`;
  }
  return null;
}

export function validateEmail(email: string): string | null {
  if (!email) return "Email is required";

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Please enter a valid email address";
  }
  return null;
}

export function validatePhone(phone: string): string | null {
  if (!phone) return "Phone number is required";

  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  if (!phoneRegex.test(phone.replace(/\s/g, ""))) {
    return "Please enter a valid phone number";
  }
  return null;
}

export function validateMinLength(
  value: string,
  minLength: number,
  fieldName: string
): string | null {
  if (value && value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters`;
  }
  return null;
}

export function validateMaxLength(
  value: string,
  maxLength: number,
  fieldName: string
): string | null {
  if (value && value.length > maxLength) {
    return `${fieldName} must be no more than ${maxLength} characters`;
  }
  return null;
}

// ============================================================================
// BASE ONBOARDING VALIDATION
// ============================================================================

export function validateBaseProfile(
  data: BaseOnboardingData
): Record<string, string> {
  const errors: Record<string, string> = {};

  // Business fields
  if (data.accountType === "business" && !data.businessName?.trim()) {
    errors.businessName = "Business name is required for business accounts";
  }

  return errors;
}

export function validateBaseTerms(
  data: BaseOnboardingData
): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!data.agreedToTerms) {
    errors.agreedToTerms = "You must agree to the terms and conditions";
  }

  return errors;
}

// ============================================================================
// MAKER-SPECIFIC VALIDATION
// ============================================================================

export function validateMakerProfile(
  data: BaseOnboardingData
): Record<string, string> {
  const errors = validateBaseProfile(data);
  const makerData = data.makerData;

  if (!makerData) return errors;

  // Business name validation for business accounts
  if (data.accountType === "business" && !data.businessName?.trim()) {
    errors.businessName = "Business name is required for business accounts";
  }

  // Bio validation
  const bioError = validateRequired(makerData.bio, "Bio");
  if (bioError) errors.bio = bioError;

  const bioLengthError = validateMinLength(makerData.bio || "", 10, "Bio");
  if (bioLengthError) errors.bio = bioLengthError;

  return errors;
}

export function validateMakerEquipment(
  data: BaseOnboardingData
): Record<string, string> {
  const errors: Record<string, string> = {};
  const makerData = data.makerData;

  if (!makerData) return errors;

  // Require at least one printer unless user opted to set up later
  const printers = makerData.printers || [];
  if (!makerData.equipmentSetupLater && printers.length === 0) {
    errors.printers = "Please add at least one printer or choose to add later";
  }
  // Basic validation per printer
  printers.forEach((p, idx) => {
    if (!p.brand || !p.brand.trim()) {
      errors[`printers[${idx}].brand`] = "Brand is required";
    }
    if (!p.model || !p.model.trim()) {
      errors[`printers[${idx}].model`] = "Model is required";
    }
    if (!p.type || !p.type.trim()) {
      errors[`printers[${idx}].type`] = "Type is required";
    }
  });

  return errors;
}

export function validateMakerTerms(
  data: BaseOnboardingData
): Record<string, string> {
  const errors = validateBaseTerms(data);
  const makerData = data.makerData;

  if (!makerData) return errors;

  // Maker-specific terms
  if (!makerData.agreedToManufacturingTerms) {
    errors.agreedToManufacturingTerms =
      "You must agree to the manufacturing terms";
  }

  return errors;
}

// ============================================================================
// CREATOR-SPECIFIC VALIDATION
// ============================================================================

export function validateCreatorProfile(
  data: BaseOnboardingData
): Record<string, string> {
  const errors = validateBaseProfile(data);
  const creatorData = data.creatorData;

  if (!creatorData) return errors;

  // Account type validation
  if (!data.accountType) {
    errors.accountType = "Please select account type";
  }

  // Business name validation for business accounts
  if (data.accountType === "business" && !data.businessName?.trim()) {
    errors.businessName = "Business name is required for business accounts";
  }

  return errors;
}

export function validateCreatorPreferences(
  data: BaseOnboardingData
): Record<string, string> {
  const errors: Record<string, string> = {};
  const creatorData = data.creatorData;

  if (!creatorData) return errors;

  // Use case validation
  if (!creatorData.useCase) {
    errors.useCase = "Please select your primary use case";
  }

  // Category interests validation
  if (
    !creatorData.categoryInterests ||
    creatorData.categoryInterests.length === 0
  ) {
    errors.categoryInterests =
      "Please select at least one category of interest";
  }

  return errors;
}

export function validateCreatorShipping(
  data: BaseOnboardingData
): Record<string, string> {
  const errors: Record<string, string> = {};
  const creatorData = data.creatorData;

  if (!creatorData) return errors;

  // Only validate if not skipping shipping setup
  if (!creatorData.shippingSetupLater) {
    const address = creatorData.shippingAddress || {};

    if (!address.street?.trim()) {
      errors.street = "Street address is required";
    }

    if (!address.city?.trim()) {
      errors.city = "City is required";
    }

    if (!address.zip?.trim()) {
      errors.zip = "ZIP code is required";
    }
  }

  return errors;
}

export function validateCreatorPayment(
  data: BaseOnboardingData
): Record<string, string> {
  const errors: Record<string, string> = {};
  const creatorData = data.creatorData;

  if (!creatorData) return errors;

  // Only validate if not skipping payment setup
  if (!creatorData.paymentSetupLater && !creatorData.paymentMethodAdded) {
    errors.paymentMethodAdded = "Please add a payment method or skip for later";
  }

  return errors;
}

// ============================================================================
// FLOW-SPECIFIC VALIDATION
// ============================================================================

export function validateMakerFlow(
  data: BaseOnboardingData,
  step: string
): Record<string, string> {
  switch (step) {
    case "profile":
      return validateMakerProfile(data);
    case "equipment":
      return validateMakerEquipment(data);
    case "terms":
      return validateMakerTerms(data);
    default:
      return {};
  }
}

export function validateCreatorFlow(
  data: BaseOnboardingData,
  step: string
): Record<string, string> {
  switch (step) {
    case "profile":
      return validateCreatorProfile(data);
    case "preferences":
      return validateCreatorPreferences(data);
    case "shipping":
      return validateCreatorShipping(data);
    case "payment":
      return validateCreatorPayment(data);
    case "terms":
      return validateBaseTerms(data);
    default:
      return {};
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function validateOnboardingData(
  data: BaseOnboardingData,
  role: "maker" | "creator" | "both",
  step: string
): Record<string, string> {
  if (role === "maker" || role === "both") {
    return validateMakerFlow(data, step);
  } else if (role === "creator" || role === "both") {
    return validateCreatorFlow(data, step);
  }

  return {};
}

export function isStepValid(
  data: BaseOnboardingData,
  role: "maker" | "creator" | "both",
  step: string
): boolean {
  const errors = validateOnboardingData(data, role, step);
  return Object.keys(errors).length === 0;
}

export function getFieldError(
  errors: Record<string, string>,
  field: string
): string | undefined {
  return errors[field];
}
