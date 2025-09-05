"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import MainNav from "@/components/splash/main-nav";
import Hero from "@/components/splash/hero";
import Features from "@/components/splash/features";
import ManufacturingSteps from "@/components/splash/manufacturing-steps";

export default function ManaHomePage() {
  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <main>
        <Hero />
        <ManufacturingSteps />
        <Features />

        {/* Call to action section */}
        <motion.section
          className="py-24 bg-slate-50"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
              Ready to start 3D printing?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
              Join Mana today and connect with local makers to bring your
              designs to life
            </p>
            <Link href="/auth">
              <Button
                size="lg"
                className="text-lg px-8 h-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 text-white border-0"
              >
                Get Started Now
              </Button>
            </Link>
          </div>
        </motion.section>

        {/* Footer */}
        <footer className="bg-slate-100 py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-bold text-lg mb-4 text-slate-900">Mana</h3>
                <p className="text-slate-600">
                  The decentralized 3D printing network that connects people
                  with local makers.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-4 text-slate-900">
                  Company
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/about"
                      className="text-slate-600 hover:text-blue-600"
                    >
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/auth"
                      className="text-slate-600 hover:text-blue-600"
                    >
                      Careers
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      className="text-slate-600 hover:text-blue-600"
                    >
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-4 text-slate-900">Legal</h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/terms"
                      className="text-slate-600 hover:text-blue-600"
                    >
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/privacy"
                      className="text-slate-600 hover:text-blue-600"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/auth"
                      className="text-slate-600 hover:text-blue-600"
                    >
                      Copyright
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-slate-200 mt-12 pt-8 text-center text-slate-600">
              <p className="mb-2">
                © {new Date().getFullYear()} Mana. All rights reserved.
              </p>
              <p>
                Contact us:{" "}
                <a
                  href="mailto:contact@manalabs3d.com"
                  className="text-blue-600 hover:underline"
                >
                  contact@manalabs3d.com
                </a>
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
