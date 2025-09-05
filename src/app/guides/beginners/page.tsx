"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import MainNav from "@/components/splash/main-nav";
import { SiteFooter } from "@/components/splash/site-footer";
import {
  Upload,
  FileText,
  Settings,
  Printer,
  Package,
  CheckCircle,
  ArrowRight,
  Download,
  Layers,
  Palette,
  Ruler,
} from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Choose Your Design",
    description: "Start with a 3D model file in STL, OBJ, or 3MF format",
    icon: FileText,
    details: [
      "Download free models from Thingiverse, MyMiniFactory, or Printables",
      "Create your own using Fusion 360, Blender, or Tinkercad",
      "Ensure your model is manifold (watertight) and printable",
    ],
    tips: "New to 3D modeling? Start with Tinkercad - it's free and browser-based!",
  },
  {
    id: 2,
    title: "Upload Your Model",
    description: "Simply drag and drop your file or click to browse",
    icon: Upload,
    details: [
      "Supported formats: STL, OBJ, 3MF",
      "Maximum file size: 50MB",
      "Our system will automatically analyze your model",
    ],
    tips: "Larger files may take longer to process. Compress if possible while maintaining quality.",
  },
  {
    id: 3,
    title: "Configure Print Settings",
    description: "Choose material, quality, and finishing options",
    icon: Settings,
    details: [
      "Select material: PLA (beginner-friendly), ABS, PETG, or specialty filaments",
      "Choose quality: Draft (fast), Standard (balanced), or High Detail (best quality)",
      "Add finishing options like sanding or post-processing",
    ],
    tips: "PLA is perfect for beginners - it's easy to print and environmentally friendly!",
  },
  {
    id: 4,
    title: "Get Matched with a Maker",
    description: "Our platform connects you with skilled local makers",
    icon: Printer,
    details: [
      "View maker profiles, ratings, and sample work",
      "Compare pricing and delivery times",
      "Communicate directly with your chosen maker",
    ],
    tips: "Check maker reviews and previous work to ensure quality matches your needs.",
  },
  {
    id: 5,
    title: "Track Your Print",
    description: "Monitor progress and communicate with your maker",
    icon: Package,
    details: [
      "Receive real-time updates on your print status",
      "Ask questions and request progress photos",
      "Get notified when your print is ready for pickup or shipping",
    ],
    tips: "Good communication with your maker ensures the best results!",
  },
];

const materials = [
  {
    name: "PLA",
    description: "Perfect for beginners",
    properties: ["Biodegradable", "Low temperature", "Easy to print"],
    color: "bg-green-100 text-green-800",
  },
  {
    name: "ABS",
    description: "Strong and durable",
    properties: ["Heat resistant", "Impact resistant", "Automotive grade"],
    color: "bg-blue-100 text-blue-800",
  },
  {
    name: "PETG",
    description: "Best of both worlds",
    properties: ["Chemical resistant", "Crystal clear", "Food safe"],
    color: "bg-purple-100 text-purple-800",
  },
];

const designTips = [
  {
    icon: Layers,
    title: "Wall Thickness",
    description: "Keep walls at least 0.8mm thick for structural integrity",
  },
  {
    icon: Ruler,
    title: "Overhangs",
    description: "Avoid overhangs greater than 45° or use support material",
  },
  {
    icon: Palette,
    title: "Detail Size",
    description: "Features smaller than 0.2mm may not print clearly",
  },
];

// Skeleton Components
const HeaderSkeleton = () => (
  <div className="text-center mb-16">
    <Skeleton className="h-8 w-32 mx-auto mb-4" />
    <Skeleton className="h-12 w-96 mx-auto mb-6" />
    <Skeleton className="h-6 w-full max-w-3xl mx-auto mb-2" />
    <Skeleton className="h-6 w-2/3 mx-auto mb-8" />
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Skeleton className="h-12 w-40" />
      <Skeleton className="h-12 w-48" />
    </div>
  </div>
);

const StepCardSkeleton = () => (
  <Card className="overflow-hidden">
    <CardContent className="p-8">
      <div className="flex flex-col md:flex-row items-start gap-6">
        <Skeleton className="w-16 h-16 rounded-full flex-shrink-0" />
        <div className="flex-1 w-full">
          <div className="flex items-center gap-3 mb-3">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-8 w-48" />
          </div>
          <Skeleton className="h-6 w-full mb-4" />
          <div className="space-y-2 mb-4">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-4/5" />
            <Skeleton className="h-5 w-3/4" />
          </div>
          <Skeleton className="h-16 w-full rounded-lg" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const MaterialCardSkeleton = () => (
  <Card className="h-full">
    <CardHeader>
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </CardContent>
  </Card>
);

const DesignTipCardSkeleton = () => (
  <Card className="text-center p-6">
    <Skeleton className="w-12 h-12 mx-auto mb-4 rounded-full" />
    <Skeleton className="h-6 w-24 mx-auto mb-2" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-3/4 mx-auto mt-1" />
  </Card>
);

export default function BeginnersGuidePage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Content loads immediately, no artificial delay
    setIsLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <MainNav />

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <FileText className="w-4 h-4" />
            Beginner's Guide
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Your First 3D Print
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Everything you need to know to get started with 3D printing on Mana.
            From choosing your first model to receiving your finished print.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/auth">
                Get Started Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a
                href="https://www.thingiverse.com/thing:763622"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Sample File
              </a>
            </Button>
          </div>
        </motion.div>

        {/* Step-by-Step Guide */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="space-y-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row items-start gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                          <step.icon className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge
                            variant="outline"
                            className="text-blue-600 border-blue-600"
                          >
                            Step {step.id}
                          </Badge>
                          <h3 className="text-2xl font-semibold">
                            {step.title}
                          </h3>
                        </div>
                        <p className="text-lg text-muted-foreground mb-4">
                          {step.description}
                        </p>
                        <ul className="space-y-2 mb-4">
                          {step.details.map((detail, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-600">{detail}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                          <p className="text-blue-800 font-medium">
                            💡 Pro Tip: {step.tips}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Materials Guide */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12">
            Choose Your Material
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {materials.map((material, index) => (
              <motion.div
                key={material.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">{material.name}</CardTitle>
                      <Badge className={material.color}>
                        {material.description}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {material.properties.map((property, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-600">
                            {property}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Design Tips */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12">
            Design for 3D Printing
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {designTips.map((tip, index) => (
              <motion.div
                key={tip.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="text-center p-6 hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <tip.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{tip.title}</h3>
                  <p className="text-gray-600 text-sm">{tip.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Call to Action */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-0 p-8">
            <CardContent className="space-y-6">
              <h2 className="text-3xl font-bold">Ready to Start Printing?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join thousands of creators who are bringing their ideas to life
                with Mana's network of skilled makers and cutting-edge 3D
                printing technology.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  asChild
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Link href="/auth">
                    Start Your First Print
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/discover">Browse Examples</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </main>

      <SiteFooter />
    </div>
  );
}
