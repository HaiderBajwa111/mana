"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Upload, X } from "lucide-react";

// ============================================================================
// SHARED FORM FIELD COMPONENTS
// ============================================================================

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  className?: string;
}

interface TextInputProps extends FormFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "email" | "tel" | "password";
  disabled?: boolean;
}

export function TextInput({
  label,
  value,
  onChange,
  error,
  required = false,
  placeholder,
  type = "text",
  disabled = false,
  className,
}: TextInputProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-sm font-medium text-mana-text">
        {label}
        {required && <span className="text-mana-coral ml-1">*</span>}
      </Label>
      <Input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "bg-mana-gray/20 border-mana-gray-light/30 text-mana-text placeholder:text-mana-text-secondary focus:border-mana-lavender focus:ring-mana-lavender/20",
          error &&
            "border-mana-coral focus:border-mana-coral focus:ring-mana-coral/20"
        )}
      />
      {error && <p className="text-sm text-mana-coral">{error}</p>}
    </div>
  );
}

interface TextareaInputProps extends FormFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
}

export function TextareaInput({
  label,
  value,
  onChange,
  error,
  required = false,
  placeholder,
  rows = 4,
  disabled = false,
  className,
}: TextareaInputProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-sm font-medium text-mana-text">
        {label}
        {required && <span className="text-mana-coral ml-1">*</span>}
      </Label>
      <Textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className={cn(
          "bg-mana-gray/20 border-mana-gray-light/30 text-mana-text placeholder:text-mana-text-secondary focus:border-mana-lavender focus:ring-mana-lavender/20 resize-none",
          error &&
            "border-mana-coral focus:border-mana-coral focus:ring-mana-coral/20"
        )}
      />
      {error && <p className="text-sm text-mana-coral">{error}</p>}
    </div>
  );
}

interface SelectInputProps extends FormFieldProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  disabled?: boolean;
}

export function SelectInput({
  label,
  value,
  onChange,
  error,
  required = false,
  options,
  placeholder = "Select an option",
  disabled = false,
  className,
}: SelectInputProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-sm font-medium text-mana-text">
        {label}
        {required && <span className="text-mana-coral ml-1">*</span>}
      </Label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger
          className={cn(
            "bg-mana-gray/20 border-mana-gray-light/30 text-mana-text focus:border-mana-lavender focus:ring-mana-lavender/20",
            error &&
              "border-mana-coral focus:border-mana-coral focus:ring-mana-coral/20"
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="bg-mana-black border-mana-gray-light/30">
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="text-mana-text hover:bg-mana-gray/20 focus:bg-mana-lavender/10"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-mana-coral">{error}</p>}
    </div>
  );
}

interface RadioGroupInputProps extends FormFieldProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string; description?: string }[];
  disabled?: boolean;
}

export function RadioGroupInput({
  label,
  value,
  onChange,
  error,
  required = false,
  options,
  disabled = false,
  className,
}: RadioGroupInputProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <Label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <RadioGroup value={value} onValueChange={onChange} disabled={disabled}>
        {options.map((option) => (
          <div key={option.value} className="flex items-start space-x-3">
            <RadioGroupItem
              value={option.value}
              id={option.value}
              className="mt-1 text-blue-600 border-blue-600 focus:ring-blue-600/20"
            />
            <div className="flex-1">
              <Label
                htmlFor={option.value}
                className="text-sm font-medium text-foreground cursor-pointer"
              >
                {option.label}
              </Label>
              {option.description && (
                <p className="text-xs text-slate-600 mt-1">
                  {option.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </RadioGroup>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

interface BigButtonRadioGroupProps extends FormFieldProps {
  value: string;
  onChange: (value: string) => void;
  options: {
    value: string;
    label: string;
    description?: string;
    icon?: React.ComponentType<any>;
  }[];
  disabled?: boolean;
}

export function BigButtonRadioGroup({
  label,
  value,
  onChange,
  error,
  required = false,
  options,
  disabled = false,
  className,
}: BigButtonRadioGroupProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <Label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => !disabled && onChange(option.value)}
            disabled={disabled}
            className={cn(
              "group p-6 rounded-2xl border-2 text-left transition-all duration-300 relative overflow-hidden",
              value === option.value
                ? "border-primary bg-primary/10 scale-105"
                : "border-blue-100 bg-blue-50 hover:border-primary/50 hover:bg-primary/5",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            {/* Background glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Content */}
            <div className="relative z-10">
              {option.icon && (
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <option.icon className="w-6 h-6 text-blue-600" />
                </div>
              )}

              <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                {option.label}
              </h3>

              {option.description && (
                <p className="text-sm text-slate-600 leading-relaxed">
                  {option.description}
                </p>
              )}
            </div>

            {/* Selection indicator */}
            {value === option.value && (
              <div className="absolute top-4 right-4 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full" />
              </div>
            )}
          </button>
        ))}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

interface CheckboxInputProps extends FormFieldProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function CheckboxInput({
  label,
  checked,
  onChange,
  error,
  required = false,
  disabled = false,
  className,
}: CheckboxInputProps) {
  return (
    <div className={cn("flex items-start space-x-3", className)}>
      <Checkbox
        id={label.toLowerCase().replace(/\s+/g, "-")}
        checked={checked}
        onCheckedChange={onChange}
        disabled={disabled}
        className="mt-1 text-mana-lavender border-mana-gray-light/30 focus:ring-mana-lavender/20"
      />
      <div className="flex-1">
        <Label
          htmlFor={label.toLowerCase().replace(/\s+/g, "-")}
          className="text-sm text-mana-text cursor-pointer"
        >
          {label}
          {required && <span className="text-mana-coral ml-1">*</span>}
        </Label>
        {error && <p className="text-sm text-mana-coral mt-1">{error}</p>}
      </div>
    </div>
  );
}

interface MultiSelectInputProps extends FormFieldProps {
  value: string[];
  onChange: (value: string[]) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
}

export function MultiSelectInput({
  label,
  value = [],
  onChange,
  error,
  required = false,
  options,
  disabled = false,
  className,
}: MultiSelectInputProps) {
  const handleToggle = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };

  return (
    <div className={cn("space-y-3", className)}>
      <Label className="text-sm font-medium text-mana-text">
        {label}
        {required && <span className="text-mana-coral ml-1">*</span>}
      </Label>
      <div className="grid grid-cols-2 gap-3">
        {options.map((option) => (
          <div
            key={option.value}
            className={cn(
              "flex items-center space-x-3 p-3 rounded-xl border cursor-pointer transition-all",
              value.includes(option.value)
                ? "bg-mana-lavender/10 border-mana-lavender/30"
                : "bg-mana-gray/20 border-mana-gray-light/30 hover:border-mana-lavender/30"
            )}
            onClick={() => !disabled && handleToggle(option.value)}
          >
            <Checkbox
              checked={value.includes(option.value)}
              onCheckedChange={() => handleToggle(option.value)}
              disabled={disabled}
              className="text-mana-lavender border-mana-gray-light/30 focus:ring-mana-lavender/20"
            />
            <Label className="text-sm text-mana-text cursor-pointer flex-1">
              {option.label}
            </Label>
          </div>
        ))}
      </div>
      {error && <p className="text-sm text-mana-coral">{error}</p>}
    </div>
  );
}

interface FileUploadInputProps extends FormFieldProps {
  value?: File;
  onChange: (file: File | undefined) => void;
  accept?: string;
  maxSize?: number; // in MB
  disabled?: boolean;
}

export function FileUploadInput({
  label,
  value,
  onChange,
  error,
  required = false,
  accept = "image/*",
  maxSize = 5, // 5MB default
  disabled = false,
  className,
}: FileUploadInputProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > maxSize * 1024 * 1024) {
        alert(`File size must be less than ${maxSize}MB`);
        return;
      }
      onChange(file);
    }
  };

  const handleRemove = () => {
    onChange(undefined);
  };

  return (
    <div className={cn("space-y-3", className)}>
      <Label className="text-sm font-medium text-mana-text">
        {label}
        {required && <span className="text-mana-coral ml-1">*</span>}
      </Label>

      {!value ? (
        <div className="relative">
          <input
            type="file"
            accept={accept}
            onChange={handleFileChange}
            disabled={disabled}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          <div className="border-2 border-dashed border-mana-gray-light/30 rounded-xl p-8 text-center hover:border-mana-lavender/50 transition-colors">
            <Upload className="w-8 h-8 text-mana-text-secondary mx-auto mb-3" />
            <p className="text-mana-text-secondary mb-1">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-mana-text-secondary/60">
              {accept === "image/*" ? "PNG, JPG, GIF up to" : "Files up to"}{" "}
              {maxSize}MB
            </p>
          </div>
        </div>
      ) : (
        <div className="border border-mana-gray-light/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {value.type.startsWith("image/") && (
                <img
                  src={URL.createObjectURL(value)}
                  alt="Preview"
                  className="w-12 h-12 rounded-lg object-cover"
                />
              )}
              <div>
                <p className="text-sm font-medium text-mana-text">
                  {value.name}
                </p>
                <p className="text-xs text-mana-text-secondary">
                  {(value.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              disabled={disabled}
              className="p-1 text-mana-text-secondary hover:text-mana-coral transition-colors disabled:opacity-50"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {error && <p className="text-sm text-mana-coral">{error}</p>}
    </div>
  );
}

// ============================================================================
// SPECIALIZED FORM SECTIONS
// ============================================================================

interface AddressInputProps {
  value: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  onChange: (address: any) => void;
  errors?: Record<string, string>;
  required?: boolean;
}

export function AddressInput({
  value = {},
  onChange,
  errors = {},
  required = false,
}: AddressInputProps) {
  const handleFieldChange = (field: string, fieldValue: string) => {
    onChange({ ...value, [field]: fieldValue });
  };

  return (
    <div className="space-y-4">
      <TextInput
        label="Street Address"
        value={value.street || ""}
        onChange={(val) => handleFieldChange("street", val)}
        error={errors.street}
        required={required}
        placeholder="123 Main St"
      />
      <div className="grid grid-cols-2 gap-4">
        <TextInput
          label="City"
          value={value.city || ""}
          onChange={(val) => handleFieldChange("city", val)}
          error={errors.city}
          required={required}
          placeholder="City"
        />
        <TextInput
          label="State"
          value={value.state || ""}
          onChange={(val) => handleFieldChange("state", val)}
          error={errors.state}
          required={required}
          placeholder="State"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <TextInput
          label="ZIP Code"
          value={value.zip || ""}
          onChange={(val) => handleFieldChange("zip", val)}
          error={errors.zip}
          required={required}
          placeholder="12345"
        />
        <TextInput
          label="Country"
          value={value.country || ""}
          onChange={(val) => handleFieldChange("country", val)}
          error={errors.country}
          required={required}
          placeholder="United States"
        />
      </div>
    </div>
  );
}
