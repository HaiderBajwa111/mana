"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Users,
  Globe,
  Leaf,
  Zap,
  Sparkles,
  Clock,
  BadgeCheck,
  HandCoins,
} from "lucide-react";

const features = [
  {
    title: "Decentralized Network",
    description:
      "Access 3D printers owned by real people in your community, not big corporate facilities.",
    icon: Users,
    delay: 0,
  },
  {
    title: "Local Production",
    description:
      "Reduce carbon footprint by printing locally instead of shipping from across the world.",
    icon: Globe,
    delay: 0.1,
  },
  {
    title: "Eco-Friendly",
    description:
      "Support sustainable printing practices and reduce waste with on-demand production.",
    icon: Leaf,
    delay: 0.2,
  },
  {
    title: "Empowering Makers",
    description:
      "Help local makers earn income by utilizing their printer capacity.",
    icon: Sparkles,
    delay: 0.3,
  },
  {
    title: "Lightning Fast",
    description:
      "Get your prints quickly - often same day or next day depending on complexity.",
    icon: Zap,
    delay: 0.4,
  },
  {
    title: "Flexible Materials",
    description:
      "Choose from a wide variety of materials based on your specific needs.",
    icon: BadgeCheck,
    delay: 0.5,
  },
  {
    title: "24/7 Availability",
    description:
      "Find available printers any time of day across our global network.",
    icon: Clock,
    delay: 0.6,
  },
  {
    title: "Cost Effective",
    description:
      "Competitive pricing with no middlemen markup or excessive shipping costs.",
    icon: HandCoins,
    delay: 0.7,
  },
];

export default function Features() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
            Why Choose Mana?
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Join the community revolutionizing how things are made
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: feature.delay,
              }}
            >
              <Card className="h-full border border-slate-200 hover:border-blue-300 hover:shadow-md hover:bg-blue-50/50 transition-all duration-300 rounded-xl">
                <CardContent className="pt-6">
                  <div className="rounded-full w-12 h-12 flex items-center justify-center mb-4 bg-blue-100">
                    <feature.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-slate-900">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
