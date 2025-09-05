"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, PackageCheck } from "lucide-react";
import { ThreeDPrinterIcon } from "@/components/icons/three-d-printer-icon";

const steps = [
  {
    id: 1,
    title: "Upload Your Design",
    description:
      "Upload your 3D model in any format. We support STL, OBJ, STEP and more.",
    icon: Upload,
    color: "bg-primary",
  },
  {
    id: 2,
    title: "Get Matched to a Printer",
    description:
      "Our algorithm matches you with the perfect local 3D printer for your needs.",
    icon: () => <img src="/assets/logos/logo.png?v=1" alt="Mana" width={24} height={24} className="text-white" />,
    color: "bg-primary",
  },
  {
    id: 3,
    title: "Receive Your Print",
    description:
      "Pick up your print locally or have it shipped to your doorstep.",
    icon: PackageCheck,
    color: "bg-primary",
  },
];

export default function ManufacturingSteps() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
            How Mana Works
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Get your designs 3D printed in three simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line - positioned behind cards */}
          <div
            className="hidden md:block absolute top-32 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-blue-600 to-blue-400 -z-10"
            style={{ width: "100%" }}
          />

          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.2,
              }}
              className="relative z-20"
            >
              <Card className="border-2 relative h-full rounded-xl">
                <CardContent className="pt-6 flex flex-col items-center text-center h-full">
                  <div className="rounded-full w-16 h-16 flex items-center justify-center mb-6 bg-blue-600 border-2 border-transparent relative z-10">
                    <step.icon className="h-8 w-8 text-white" />
                    <div className="absolute -top-3 -left-3 bg-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold text-white">
                      {step.id}
                    </div>
                  </div>
                  <h3 className="font-bold text-xl mb-3 text-slate-900">
                    {step.title}
                  </h3>
                  <p className="text-slate-600">{step.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
