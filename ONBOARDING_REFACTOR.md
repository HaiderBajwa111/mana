# Unified Onboarding System - Refactor Documentation

## Overview

The onboarding system has been refactored to follow best practices with a unified architecture that maintains clear separation of concerns while reducing code duplication and improving maintainability.

## Architecture

### 1. Unified Data Model (`src/types/onboarding.ts`)

```typescript
interface BaseOnboardingData {
  // Shared fields
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  phone?: string;
  phoneVerified?: boolean;
  accountType?: "individual" | "business";
  businessName?: string;
  agreedToTerms?: boolean;

  // Role-specific data
  makerData?: MakerSpecificData;
  creatorData?: CreatorSpecificData;
}
```

**Benefits:**

- Single source of truth for all onboarding data
- Clear separation between shared and role-specific fields
- Type safety across the entire system
- Easy to extend with new fields

### 2. Shared Form Components (`src/components/onboarding/shared/form-fields.tsx`)

Reusable form components that handle:

- Text inputs with validation
- Select dropdowns
- Radio groups
- Checkboxes
- Multi-select inputs
- Address forms
- Consistent styling and error handling

**Benefits:**

- Consistent UI/UX across all forms
- Centralized validation logic
- Easy to maintain and update styling
- Reduced code duplication

### 3. Unified Validation (`src/components/onboarding/shared/validation.ts`)

Centralized validation system with:

- Shared validation rules (email, phone, required fields)
- Role-specific validation functions
- Step-based validation
- Clear error messages

**Benefits:**

- Consistent validation across all flows
- Easy to add new validation rules
- Centralized error handling
- Type-safe validation

### 4. Flow Configuration (`src/components/onboarding/shared/flow-config.ts`)

Configuration-driven approach for:

- Step definitions
- Validation rules mapping
- Role-specific flows
- Navigation logic

**Benefits:**

- Easy to modify flow steps
- Clear separation of flow logic
- Reusable step configurations
- Flexible navigation

### 5. Custom Hook (`src/hooks/onboarding/use-unified-onboarding.ts`)

State management hook that provides:

- Data persistence
- Step navigation
- Validation
- Progress tracking
- Event callbacks

**Benefits:**

- Clean separation of concerns
- Reusable state logic
- Easy to test
- Consistent API

### 6. Unified Flow Component (`src/components/onboarding/unified-onboarding-flow.tsx`)

Main component that:

- Renders appropriate fields based on role
- Handles step navigation
- Manages form state
- Provides consistent UI

**Benefits:**

- Single component for all roles
- Role-based field rendering
- Consistent user experience
- Easy to maintain

## Key Improvements

### 1. **Reduced Code Duplication**

- Shared form components eliminate duplicate field implementations
- Unified validation system removes repeated validation logic
- Single flow component instead of separate maker/creator flows

### 2. **Better Type Safety**

- Comprehensive TypeScript interfaces
- Role-specific data types
- Validation function type safety

### 3. **Improved Maintainability**

- Configuration-driven approach
- Clear separation of concerns
- Modular architecture
- Easy to add new fields or steps

### 4. **Enhanced User Experience**

- Consistent UI across all flows
- Better error handling
- Progress tracking
- Smooth animations

### 5. **Flexible Architecture**

- Easy to add new roles
- Configurable steps
- Extensible validation
- Reusable components

## Usage

### Basic Usage

```typescript
import { OnboardingFlowV2 } from "@/components/onboarding/onboarding-flow-v2";

function MyOnboardingPage() {
  return (
    <OnboardingFlowV2
      initialRole="creator"
      onComplete={(role, data) => {
        console.log("Onboarding completed:", role, data);
      }}
    />
  );
}
```

### Using the Hook Directly

```typescript
import { useUnifiedOnboarding } from "@/hooks/onboarding/use-unified-onboarding";

function CustomOnboardingFlow() {
  const {
    data,
    currentStep,
    errors,
    updateData,
    nextStep,
    prevStep,
    validateCurrentStep,
  } = useUnifiedOnboarding({
    role: "maker",
    onComplete: async (data) => {
      // Handle completion
    },
  });

  return (
    <div>
      {/* Custom UI using the hook */}
    </div>
  );
}
```

### Adding New Fields

1. **Update the data model** in `src/types/onboarding.ts`
2. **Add validation rules** in `src/components/onboarding/shared/validation.ts`
3. **Update flow configuration** in `src/components/onboarding/shared/flow-config.ts`
4. **Render the field** in the appropriate step function

### Adding New Steps

1. **Define the step** in `src/components/onboarding/shared/flow-config.ts`
2. **Add validation** for the step
3. **Create render function** in `src/components/onboarding/unified-onboarding-flow.tsx`
4. **Add to step rendering logic**

## Migration Guide

### From Old System

The old system used separate components:

- `FixedMakerFlow`
- `FixedCreatorFlow`
- `HybridFlow`

The new system uses:

- `UnifiedOnboardingFlow` (main component)
- `OnboardingFlowV2` (wrapper with backend integration)

### Migration Steps

1. **Replace imports**:

   ```typescript
   // Old
   import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";

   // New
   import { OnboardingFlowV2 } from "@/components/onboarding/onboarding-flow-v2";
   ```

2. **Update props**:

   ```typescript
   // Old
   <OnboardingFlow initialRole="creator" onComplete={handleComplete} />

   // New
   <OnboardingFlowV2 initialRole="creator" onComplete={handleComplete} />
   ```

3. **Update data handling**:
   - Old system used separate data objects
   - New system uses unified `BaseOnboardingData`

## Benefits Summary

1. **Maintainability**: Single codebase for all onboarding flows
2. **Consistency**: Unified UI/UX across all roles
3. **Type Safety**: Comprehensive TypeScript support
4. **Flexibility**: Easy to add new roles, fields, or steps
5. **Performance**: Optimized rendering and state management
6. **Developer Experience**: Clear APIs and documentation
7. **Testing**: Easier to test with modular architecture

## Future Enhancements

1. **A/B Testing**: Easy to implement with configuration-driven approach
2. **Analytics**: Built-in tracking points for user behavior
3. **Internationalization**: Centralized text for easy translation
4. **Accessibility**: Consistent a11y features across all forms
5. **Mobile Optimization**: Responsive design patterns

## Conclusion

The new unified onboarding system provides a solid foundation for future development while maintaining backward compatibility. It follows React and TypeScript best practices, reduces code duplication, and improves the overall developer and user experience.
