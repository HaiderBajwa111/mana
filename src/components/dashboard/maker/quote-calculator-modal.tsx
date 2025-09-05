"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calculator, Loader2, DollarSign } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { type AvailableProject } from "@/types/maker";

interface QuoteCalculatorModalProps {
  project: AvailableProject | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onQuoteSent?: () => void;
}

function calculate3DPrintingPricing(params: any) {
  const {
    printerCost,
    additionalUpfrontCost,
    annualMaintenance,
    lifeYears,
    uptimePercent,
    powerConsumptionW,
    electricityCostPerKWh,
    bufferFactor,

    filamentCostPerKg,
    filamentRequiredGrams,
    efficiencyFactor = 1,

    printTimeHours,
    laborMinutes,
    laborRatePerHour,

    extraMaterials = [],
    postage = { quantity: 1, unitCost: 0 },

    qualityLevel = 'Silver',
    postProcessingType = 'Basic',

    margins = [0.5, 0.6, 0.7],
  } = params;

  const totalInvestment = printerCost + additionalUpfrontCost;
  const lifetimeCost = totalInvestment + annualMaintenance * lifeYears;
  const annualUptimeHrs = (uptimePercent / 100) * 365 * 24;
  const totalLifetimeHrs = annualUptimeHrs * lifeYears;
  const capitalCostPerHr = lifetimeCost / totalLifetimeHrs;
  const electricalCostPerHr = (powerConsumptionW / 1000) * electricityCostPerKWh;
  const printerCostPerHr = (capitalCostPerHr + electricalCostPerHr) * bufferFactor;
  const machineCost = printerCostPerHr * printTimeHours;

  const printedPartCost =
    (filamentRequiredGrams / 1000) * filamentCostPerKg * efficiencyFactor;
  const extrasCost = extraMaterials.reduce((sum: number, m: any) => sum + m.quantity * m.unitCost, 0);
  const totalMaterialsCost = printedPartCost + extrasCost;

  const laborCost = (laborMinutes / 60) * laborRatePerHour;

  const qualityMultipliers: Record<string, number> = {
    Silver: 1,
    Gold: 1.2,
    Platinum: 1.5,
  };

  const postProcessingBaseCost = postProcessingType === 'Basic' ? 2 : 5;
  const postProcessingCost = postProcessingBaseCost * qualityMultipliers[qualityLevel];

  const packagingCost = postage.quantity * postage.unitCost;

  const totalLandedCost =
    totalMaterialsCost + laborCost + packagingCost + machineCost + postProcessingCost;

  const marginPrices: Record<string, number> = {};
  margins.forEach((m: number) => {
    marginPrices[`${Math.round(m * 100)}%`] = totalLandedCost / (1 - m);
  });

  return {
    machineCost,
    totalMaterialsCost,
    laborCost,
    postProcessingCost,
    packagingCost,
    totalLandedCost,
    marginPrices,
  };
}

export function QuoteCalculatorModal({
  project,
  open,
  onOpenChange,
  onQuoteSent,
}: QuoteCalculatorModalProps) {
  const [loading, setLoading] = useState(false);
  const [selectedMargin, setSelectedMargin] = useState("60%");
  const [notes, setNotes] = useState("");
  const [estimatedDays, setEstimatedDays] = useState(3);
  const [useCustomPrice, setUseCustomPrice] = useState(true); // Default to custom price
  const [customPrice, setCustomPrice] = useState("");
  
  const [inputs, setInputs] = useState({
    printerCost: 1000,
    additionalUpfrontCost: 0,
    annualMaintenance: 75,
    lifeYears: 3,
    uptimePercent: 50,
    powerConsumptionW: 150,
    electricityCostPerKWh: 0.14,
    bufferFactor: 1.3,

    filamentCostPerKg: 20,
    filamentRequiredGrams: 100,
    efficiencyFactor: 1,

    printTimeHours: 3.5,
    laborMinutes: 10,
    laborRatePerHour: 20,

    extraMaterials: [],
    postage: { quantity: 1, unitCost: 0 },

    qualityLevel: 'Silver',
    postProcessingType: 'Basic',
  });

  const results = useMemo(
    () => calculate3DPrintingPricing(inputs),
    [inputs]
  );

  // Auto-populate custom price with 60% margin recommendation
  useEffect(() => {
    if (results.marginPrices["60%"] && !customPrice) {
      setCustomPrice(results.marginPrices["60%"].toFixed(2));
    }
  }, [results.marginPrices]);

  const handleChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setInputs((prev) => ({ ...prev, [key]: isNaN(value) ? 0 : value }));
  };

  const handleSelectChange = (key: string) => (value: string) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!project) return;

    const finalPrice = useCustomPrice 
      ? parseFloat(customPrice)
      : results.marginPrices[selectedMargin];
      
    if (!finalPrice || finalPrice <= 0 || isNaN(finalPrice)) {
      toast({
        title: "Invalid Quote",
        description: "Please enter a valid quote price.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    console.log("💰 [QuoteCalculator] Starting quote submission");
    console.log("💰 [QuoteCalculator] Project ID:", project.id);
    console.log("💰 [QuoteCalculator] Final Price:", finalPrice);
    console.log("💰 [QuoteCalculator] Custom Price:", useCustomPrice);

    try {
      const requestBody = {
        projectId: project.id,
        materialCost: results.totalMaterialsCost || 0,
        machineCost: results.machineCost || 0,
        laborCost: results.laborCost || 0,
        postProcessingCost: results.postProcessingCost || 0,
        packagingCost: results.packagingCost || 0,
        total: finalPrice,
        margin: useCustomPrice ? "custom" : selectedMargin,
        notes: notes || "",
        estimatedDeliveryDays: estimatedDays || 3,
        calculatorInputs: inputs,
      };
      
      console.log("💰 [QuoteCalculator] Request body:", requestBody);
      
      let response;
      try {
        console.log("💰 [QuoteCalculator] About to fetch to /api/maker/send-quote");
        const url = `${window.location.origin}/api/maker/send-quote`;
        console.log("💰 [QuoteCalculator] Full URL:", url);
        
        response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          credentials: "same-origin", // Changed from "include" to "same-origin"
          body: JSON.stringify(requestBody),
        });
        console.log("💰 [QuoteCalculator] Fetch completed, status:", response?.status);
      } catch (fetchError) {
        console.error("💰 [QuoteCalculator] Network error during fetch:", fetchError);
        console.error("💰 [QuoteCalculator] Error details:", {
          message: fetchError instanceof Error ? fetchError.message : "Unknown error",
          stack: fetchError instanceof Error ? fetchError.stack : undefined,
        });
        throw new Error("Network error - please check your internet connection and try again");
      }

      let data;
      try {
        data = await response.json();
      } catch (e) {
        console.error("💰 [QuoteCalculator] Failed to parse response:", e);
        data = { error: "Failed to parse server response" };
      }
      
      console.log("💰 [QuoteCalculator] Response status:", response.status);
      console.log("💰 [QuoteCalculator] Response data:", data);
      
      if (!response.ok) {
        console.error("💰 [QuoteCalculator] Request failed:", data);
        throw new Error(data.message || data.error || `Request failed with status ${response.status}`);
      }

      if (data.success) {
        toast({
          title: "✅ Quote Sent Successfully",
          description: `Your quote of $${finalPrice.toFixed(2)} has been sent to ${project.creator.firstName || 'the creator'}.`,
        });

        // Reset form for next quote
        setCustomPrice(results.marginPrices["60%"]?.toFixed(2) || "");
        setNotes("");
        setEstimatedDays(3);
        
        onOpenChange(false);
        onQuoteSent?.();
      } else {
        throw new Error(data.message || "Quote was not sent successfully");
      }
    } catch (error) {
      console.error("❌ Error sending quote:", error);
      toast({
        title: "❌ Failed to Send Quote",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-purple-600" />
            3D Printing Quote Calculator
          </DialogTitle>
          <DialogDescription>
            Calculate pricing for: <span className="font-semibold">{project.title}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-4">
          <Card>
            <CardHeader>
              <CardTitle>Inputs</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              {[
                ['Printer Cost ($)', 'printerCost'],
                ['Upfront Cost ($)', 'additionalUpfrontCost'],
                ['Annual Maint. ($)', 'annualMaintenance'],
                ['Lifetime (yrs)', 'lifeYears'],
                ['Uptime (%)', 'uptimePercent'],
                ['Power (W)', 'powerConsumptionW'],
                ['$/kWh', 'electricityCostPerKWh'],
                ['Buffer Factor', 'bufferFactor'],
                ['Filament $/kg', 'filamentCostPerKg'],
                ['Filament (g)', 'filamentRequiredGrams'],
                ['Waste Factor', 'efficiencyFactor'],
                ['Print Time (hr)', 'printTimeHours'],
                ['Labor (min)', 'laborMinutes'],
                ['Labor $/hr', 'laborRatePerHour'],
              ].map(([label, key]) => (
                <div key={key}>
                  <Label className="mb-1 block text-sm font-medium">{label}</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={inputs[key as keyof typeof inputs] as number}
                    onChange={handleChange(key)}
                  />
                </div>
              ))}

              <div>
                <Label className="mb-1 block text-sm font-medium">Postage ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={inputs.postage.unitCost}
                  onChange={(e) => setInputs(prev => ({
                    ...prev,
                    postage: {
                      ...prev.postage,
                      unitCost: parseFloat(e.target.value) || 0
                    }
                  }))}
                />
              </div>

              <div>
                <Label>Mana Quality</Label>
                <Select value={inputs.qualityLevel} onValueChange={handleSelectChange('qualityLevel')}>
                  <SelectTrigger><SelectValue placeholder="Select Quality" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Silver">Mana Silver</SelectItem>
                    <SelectItem value="Gold">Mana Gold</SelectItem>
                    <SelectItem value="Platinum">Mana Platinum</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Post-Processing</Label>
                <Select value={inputs.postProcessingType} onValueChange={handleSelectChange('postProcessingType')}>
                  <SelectTrigger><SelectValue placeholder="Select Type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Basic">Mana Basic (Sanding/Supports)</SelectItem>
                    <SelectItem value="Elite">Mana Elite</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2">
                <Label>Estimated Delivery (Days)</Label>
                <Input
                  type="number"
                  min="1"
                  max="30"
                  value={estimatedDays}
                  onChange={(e) => setEstimatedDays(parseInt(e.target.value) || 3)}
                />
              </div>

              <div className="col-span-2">
                <Label>Additional Notes (Optional)</Label>
                <Textarea
                  placeholder="Any additional information..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cost Breakdown & Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Machine Cost:</span>
                  <span className="font-medium">${results.machineCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Materials Cost:</span>
                  <span className="font-medium">${results.totalMaterialsCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Labor Cost:</span>
                  <span className="font-medium">${results.laborCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Post-Processing:</span>
                  <span className="font-medium">${results.postProcessingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Packaging:</span>
                  <span className="font-medium">${results.packagingCost.toFixed(2)}</span>
                </div>
              </div>
              
              <hr className="my-4" />
              
              <div className="flex justify-between font-semibold">
                <span>Total Landed Cost:</span>
                <span className="text-purple-600">${results.totalLandedCost.toFixed(2)}</span>
              </div>

              <div className="mt-6 space-y-4">
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Calculator Suggested Prices:</Label>
                  <div className="grid grid-cols-1 gap-2 p-3 bg-gray-50 rounded-lg">
                    {Object.entries(results.marginPrices).map(([margin, price]) => (
                      <div
                        key={margin}
                        className={`p-2 rounded-md border cursor-pointer transition-colors ${
                          !useCustomPrice && selectedMargin === margin
                            ? 'bg-purple-50 border-purple-400'
                            : 'hover:bg-white border-gray-200'
                        }`}
                        onClick={() => {
                          setUseCustomPrice(false);
                          setSelectedMargin(margin);
                        }}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-sm">{margin} Margin</span>
                          <span className="font-semibold">
                            ${(price as number).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-muted-foreground">OR</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-purple-600">
                    Enter Your Own Price (Recommended)
                  </Label>
                  <div className="p-4 border-2 border-purple-200 rounded-lg bg-purple-50/50">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-semibold text-purple-600">$</span>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="Enter your custom price"
                        className="pl-10 text-lg font-semibold border-purple-300 focus:border-purple-500"
                        value={customPrice}
                        onChange={(e) => {
                          setCustomPrice(e.target.value);
                          setUseCustomPrice(true);
                        }}
                        onFocus={() => setUseCustomPrice(true)}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      💡 Use the calculator above as reference. Recommended: ${(results.marginPrices["60%"] || 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-purple-50 to-purple-100 border-2 border-purple-300">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-lg">Final Quote Price:</span>
                    <p className="text-xs text-muted-foreground mt-1">
                      {useCustomPrice 
                        ? "✅ Using your custom price"
                        : `Using calculator price (${selectedMargin} margin)`
                      }
                    </p>
                  </div>
                  <span className="text-3xl font-bold text-purple-600">
                    ${useCustomPrice 
                      ? (parseFloat(customPrice) || 0).toFixed(2)
                      : (results.marginPrices[selectedMargin] || 0).toFixed(2)
                    }
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={loading || (!useCustomPrice && !results.marginPrices[selectedMargin]) || (useCustomPrice && !customPrice)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <DollarSign className="w-4 h-4 mr-2" />
                Send Quote (${
                  useCustomPrice 
                    ? (parseFloat(customPrice) || 0).toFixed(2)
                    : (results.marginPrices[selectedMargin] || 0).toFixed(2)
                })
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}