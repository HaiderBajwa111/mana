import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Truck, MapPin, Package, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DeliverySettings {
  method: "shipping" | "pickup" | null;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  pickupInstructions?: string;
}

interface DeliveryMethodStepProps {
  settings: DeliverySettings;
  onSettingsChange: (settings: DeliverySettings) => void;
}

const DELIVERY_OPTIONS = [
  {
    id: "shipping",
    title: "Ship to Me",
    description: "Have your printed item shipped directly to your address",
    icon: Truck,
    features: [
      "Door-to-door delivery",
      "Tracking provided",
      "Secure packaging",
    ],
  },
  {
    id: "pickup",
    title: "Local Pickup",
    description: "Pick up your item directly from the maker's location",
    icon: MapPin,
    features: ["No shipping fees", "Meet the maker", "Immediate pickup"],
  },
];

export default function DeliveryMethodStep({
  settings,
  onSettingsChange,
}: DeliveryMethodStepProps) {
  const updateSetting = (key: keyof DeliverySettings, value: any) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  const updateShippingAddress = (field: string, value: string) => {
    const currentAddress = settings.shippingAddress || {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
    };

    updateSetting("shippingAddress", {
      ...currentAddress,
      [field]: value,
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <Package className="w-8 h-8 text-blue-600 mr-3" />
          <h2 className="text-2xl font-bold">Delivery Method</h2>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Choose how you'd like to receive your 3D printed item. You can either
          have it shipped to your address or arrange for local pickup.
        </p>
      </div>

      {/* Delivery Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {DELIVERY_OPTIONS.map((option) => {
          const IconComponent = option.icon;
          const isSelected = settings.method === option.id;

          return (
            <Card
              key={option.id}
              className={cn(
                "cursor-pointer transition-all duration-200 hover:shadow-md",
                isSelected
                  ? "border-blue-500 ring-2 ring-blue-500/20 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300"
              )}
              onClick={() => updateSetting("method", option.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div
                    className={cn(
                      "p-3 rounded-lg",
                      isSelected
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-600"
                    )}
                  >
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">
                      {option.title}
                    </h3>
                    <p className="text-muted-foreground mb-3">
                      {option.description}
                    </p>
                    <ul className="space-y-1">
                      {option.features.map((feature, index) => (
                        <li
                          key={index}
                          className="text-sm text-muted-foreground flex items-center"
                        >
                          <div className="w-1 h-1 bg-blue-500 rounded-full mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Shipping Address Form */}
      {settings.method === "shipping" && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Truck className="w-5 h-5 text-blue-600" />
            Shipping Address
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">
                Street Address <span className="text-red-500">*</span>
              </label>
              <Input
                value={settings.shippingAddress?.street || ""}
                onChange={(e) =>
                  updateShippingAddress("street", e.target.value)
                }
                placeholder="123 Main Street"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                City <span className="text-red-500">*</span>
              </label>
              <Input
                value={settings.shippingAddress?.city || ""}
                onChange={(e) => updateShippingAddress("city", e.target.value)}
                placeholder="New York"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                State <span className="text-red-500">*</span>
              </label>
              <Input
                value={settings.shippingAddress?.state || ""}
                onChange={(e) => updateShippingAddress("state", e.target.value)}
                placeholder="NY"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                ZIP Code <span className="text-red-500">*</span>
              </label>
              <Input
                value={settings.shippingAddress?.zipCode || ""}
                onChange={(e) =>
                  updateShippingAddress("zipCode", e.target.value)
                }
                placeholder="10001"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Country <span className="text-red-500">*</span>
              </label>
              <Input
                value={settings.shippingAddress?.country || "United States"}
                onChange={(e) =>
                  updateShippingAddress("country", e.target.value)
                }
                placeholder="United States"
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}

      {/* Pickup Instructions */}
      {settings.method === "pickup" && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-green-600" />
            Pickup Instructions
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-green-200">
              <Info className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-green-900 mb-1">
                  Pickup Coordination
                </p>
                <p className="text-green-700">
                  The maker will contact you directly to arrange pickup details
                  including location, timing, and any specific instructions once
                  your item is ready.
                </p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Special Instructions (Optional)
              </label>
              <Textarea
                value={settings.pickupInstructions || ""}
                onChange={(e) =>
                  updateSetting("pickupInstructions", e.target.value)
                }
                placeholder="Any special instructions for pickup (e.g., preferred times, parking notes, etc.)"
                className="w-full h-24"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
