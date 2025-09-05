"use client";

import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type PricingParams = {
  printerCost: number;
  additionalUpfrontCost: number;
  annualMaintenance: number;
  lifeYears: number;
  uptimePercent: number;
  powerConsumptionW: number;
  electricityCostPerKWh: number;
  bufferFactor: number;

  filamentCostPerKg: number;
  filamentRequiredGrams: number;
  efficiencyFactor: number;

  printTimeHours: number;
  laborMinutes: number;
  laborRatePerHour: number;

  extraMaterials?: Array<{ quantity: number; unitCost: number }>;
  postage: { quantity: number; unitCost: number };

  qualityLevel: "Silver" | "Gold" | "Platinum";
  postProcessingType: "Basic" | "Elite";

  margins?: number[]; // e.g., [0.5, 0.6, 0.7]
};

type PricingResults = {
  machineCost: number;
  totalMaterialsCost: number;
  laborCost: number;
  postProcessingCost: number;
  totalLandedCost: number;
  marginPrices: Record<string, number>;
};

export function calculate3DPrintingPricing(params: PricingParams): PricingResults {
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

    qualityLevel = "Silver",
    postProcessingType = "Basic",

    margins = [0.5, 0.6, 0.7],
  } = params;

  const totalInvestment = printerCost + additionalUpfrontCost;
  const lifetimeCost = totalInvestment + annualMaintenance * lifeYears;
  const annualUptimeHrs = (uptimePercent / 100) * 365 * 24;
  const totalLifetimeHrs = annualUptimeHrs * lifeYears;
  const capitalCostPerHr = lifetimeCost / Math.max(totalLifetimeHrs, 1);
  const electricalCostPerHr = (powerConsumptionW / 1000) * electricityCostPerKWh;
  const printerCostPerHr = (capitalCostPerHr + electricalCostPerHr) * bufferFactor;
  const machineCost = printerCostPerHr * printTimeHours;

  const printedPartCost =
    (filamentRequiredGrams / 1000) * filamentCostPerKg * efficiencyFactor;
  const extrasCost = extraMaterials.reduce(
    (sum, m) => sum + m.quantity * m.unitCost,
    0,
  );
  const totalMaterialsCost = printedPartCost + extrasCost;

  const laborCost = (laborMinutes / 60) * laborRatePerHour;

  const qualityMultipliers = {
    Silver: 1,
    Gold: 1.2,
    Platinum: 1.5,
  } as const;

  const postProcessingBaseCost = postProcessingType === "Basic" ? 2 : 5;
  const postProcessingCost = postProcessingBaseCost * qualityMultipliers[qualityLevel];

  const packagingCost = postage.quantity * postage.unitCost;

  const totalLandedCost =
    totalMaterialsCost + laborCost + packagingCost + machineCost + postProcessingCost;

  const marginPrices: Record<string, number> = {};
  margins.forEach((m) => {
    marginPrices[`${Math.round(m * 100)}%`] = totalLandedCost / (1 - m);
  });

  return {
    machineCost,
    totalMaterialsCost,
    laborCost,
    postProcessingCost,
    totalLandedCost,
    marginPrices,
  };
}

interface PricingCalculatorProps {
  onConfirm: (price: number) => void;
}

export default function PricingCalculator({ onConfirm }: PricingCalculatorProps) {
  const [inputs, setInputs] = useState<PricingParams>({
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

    qualityLevel: "Silver",
    postProcessingType: "Basic",
  });

  const results = useMemo(() => calculate3DPrintingPricing(inputs), [inputs]);
  const defaultPrice = results.marginPrices["60%"] ?? results.totalLandedCost * 2.5;
  const [customPrice, setCustomPrice] = useState<string>(defaultPrice.toFixed(2));

  const handleChange = (key: keyof PricingParams) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setInputs((prev) => ({ ...prev, [key]: isNaN(value) ? ("" as unknown as number) : value }));
  };

  const handleSelectChange = (key: keyof PricingParams) => (value: any) => {
    setInputs((prev) => ({ ...prev, [key]: value } as PricingParams));
  };

  const setFromMargin = (label: string) => {
    const price = results.marginPrices[label];
    if (price) setCustomPrice(price.toFixed(2));
  };

  const confirm = () => {
    const priceNum = parseFloat(customPrice || "0");
    onConfirm(isNaN(priceNum) ? defaultPrice : priceNum);
  };

  const summary = (
    <div className="sticky top-0 z-10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="p-4 flex items-center justify-between">
        <div>
          <div className="text-xs text-muted-foreground">Suggested (60% margin)</div>
          <div className="text-2xl font-semibold">${defaultPrice.toFixed(2)}</div>
        </div>
        <Button onClick={confirm} className="bg-blue-600 hover:bg-blue-700">
          Accept ${parseFloat(customPrice || "0").toFixed(2)}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="p-0 grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="lg:col-span-2">{summary}</div>
      <Card>
        <CardHeader>
          <CardTitle>Inputs</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(
            [
              ["Printer Cost", "printerCost"],
              ["Upfront Cost", "additionalUpfrontCost"],
              ["Annual Maintenance", "annualMaintenance"],
              ["Lifetime (yrs)", "lifeYears"],
              ["Uptime (%)", "uptimePercent"],
              ["Power (W)", "powerConsumptionW"],
              ["$/kWh", "electricityCostPerKWh"],
              ["Buffer Factor", "bufferFactor"],
              ["Filament $/kg", "filamentCostPerKg"],
              ["Filament g", "filamentRequiredGrams"],
              ["Waste Factor", "efficiencyFactor"],
              ["Print Time (hr)", "printTimeHours"],
              ["Labor (min)", "laborMinutes"],
              ["Labor $/hr", "laborRatePerHour"],
              ["Postage $", "postage.unitCost"],
            ] as Array<[string, string]>
          ).map(([label, key]) => (
            <div key={key}>
              <Label className="mb-1 block text-sm font-medium">{label}</Label>
              <Input
                type="number"
                value={key.includes(".") ? (inputs.postage?.unitCost ?? 0) : (inputs as any)[key]}
                onChange={
                  key.includes(".")
                    ? (e) =>
                        setInputs((prev) => ({
                          ...prev,
                          postage: {
                            ...prev.postage,
                            unitCost: parseFloat(e.target.value) || 0,
                          },
                        }))
                    : handleChange(key as keyof PricingParams)
                }
              />
            </div>
          ))}

          <div>
            <Label>Mana Quality</Label>
            <Select value={inputs.qualityLevel} onValueChange={handleSelectChange("qualityLevel")}>
              <SelectTrigger>
                <SelectValue placeholder="Select Quality" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Silver">Mana Silver</SelectItem>
                <SelectItem value="Gold">Mana Gold</SelectItem>
                <SelectItem value="Platinum">Mana Platinum</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Post-Processing</Label>
            <Select
              value={inputs.postProcessingType}
              onValueChange={handleSelectChange("postProcessingType")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Basic">Mana Basic (Sanding/Supports)</SelectItem>
                <SelectItem value="Elite">Mana Elite</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="font-mono">Machine Cost: ${results.machineCost.toFixed(2)}</p>
          <p className="font-mono">Materials Cost: ${results.totalMaterialsCost.toFixed(2)}</p>
          <p className="font-mono">Labor Cost: ${results.laborCost.toFixed(2)}</p>
          <p className="font-mono">Post-Processing Cost: ${results.postProcessingCost.toFixed(2)}</p>
          <hr />
          <p className="font-mono">
            <strong>Total Landed Cost: </strong>${results.totalLandedCost.toFixed(2)}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
            {Object.entries(results.marginPrices).map(([m, price]) => (
              <Button key={m} variant="outline" className="w-full font-mono" onClick={() => setFromMargin(m)}>
                {m}: ${price.toFixed(2)}
              </Button>
            ))}
          </div>

          <div className="pt-4">
            <Label className="mb-1 block">Set Your Price</Label>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                type="number"
                value={customPrice}
                onChange={(e) => setCustomPrice(e.target.value)}
              />
              <Button onClick={confirm} className="bg-blue-600 hover:bg-blue-700">Confirm</Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Tip: Buttons above are suggested prices. You can always set your own.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


