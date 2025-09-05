"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" as const },
  },
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Returns a color between blue and purple in HSL
function randomBlueToPurple() {
  // Blue: h=217, s=96%, l=60% (#3b82f6)
  // Purple: h=282, s=81%, l=45% (#a21caf)
  const t = Math.random();
  const h = lerp(217, 282, t);
  const s = lerp(96, 81, t);
  const l = lerp(60, 45, t);
  return `hsl(${h}, ${s}%, ${l}%)`;
}

// Background particle component
const Particles = () => {
  const [particles, setParticles] = useState<
    Array<{ x: number; y: number; size: number; speed: number; color: string }>
  >([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 30 }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 8 + 2,
      speed: Math.random() * 0.4 + 0.1,
      color: randomBlueToPurple(),
    }));

    setParticles(newParticles);

    const interval = setInterval(() => {
      setParticles((prev) =>
        prev.map((particle) => ({
          ...particle,
          y:
            particle.y + particle.speed > 100 ? 0 : particle.y + particle.speed,
        }))
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none z-0">
      {particles.map((particle, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.size / 10,
            background: particle.color,
          }}
        />
      ))}
    </div>
  );
};

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-background">
      <Particles />

      <div className="mx-auto max-w-7xl px-6 py-20 md:py-32 relative z-10">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <motion.div
            variants={itemVariants}
            className="flex justify-center mb-8"
          >
            <Image src="/assets/logos/mana-logo.png" alt="Mana Logo" width={200} height={200} />
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl font-bold tracking-tight sm:text-6xl mb-6 bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent"
          >
            Get Anything 3D Printed, Anywhere
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mt-6 text-xl leading-8 text-slate-600 dark:text-slate-300 max-w-2xl mx-auto"
          >
            Mana connects you to a global network of 3D printers. Upload your
            design and get matched with the perfect local printer in minutes.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/auth">
              <Button
                size="lg"
                className="text-lg px-8 h-14 rounded-full shadow-lg flex items-center gap-2 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white border-0"
              >
                Start Printing
                <ArrowRight className="h-5 w-5 text-white" />
              </Button>
            </Link>
            <Link href="/auth">
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 h-14 rounded-full flex items-center gap-2 w-full sm:w-auto border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                <MapPin className="h-5 w-5 text-blue-600" />
                Explore Makers Near You
              </Button>
            </Link>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="mt-16 flex justify-center"
          >
            <div className="bg-muted rounded-xl p-4 flex items-center gap-4 max-w-md">
              <div className="bg-background rounded-full p-2 flex-shrink-0">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                <span className="font-medium text-blue-600">
                  325 active printers
                </span>{" "}
                available in your area right now
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Hero graphic at the bottom */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="relative h-32 sm:h-48 mt-4 overflow-hidden"
      >
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-muted to-transparent"></div>
        <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 w-5/6 max-w-4xl">
          <svg viewBox="0 0 1200 120" className="fill-muted">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
          </svg>
        </div>
      </motion.div>
    </div>
  );
}
