import Link from "next/link";
import { StickyNav } from "@/components/splash/sticky-nav";
import { ScrollAnimatedContent } from "@/components/splash/scroll-animated-content";
import { SiteFooter } from "@/components/splash/site-footer";
import {
  ArrowLeft,
  FileText,
  Shield,
  Users,
  AlertTriangle,
} from "lucide-react";

export default function TermsPage() {
  return (
    <div className="bg-mana-black text-mana-text min-h-screen font-sans">
      <StickyNav />

      {/* Header */}
      <section className="relative py-20 md:py-32 min-h-[40vh] flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-mana-black/70 via-mana-black/90 to-mana-black z-0"></div>

        <ScrollAnimatedContent
          initialClassName="initial-hidden-fade-up"
          animationClassName="animate-fade-in-up"
          className="container mx-auto px-6 relative z-10"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-br from-white via-slate-300 to-mana-sky">
            Terms of Service
          </h1>
          <p className="text-lg sm:text-xl text-mana-text-secondary max-w-2xl mx-auto">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </ScrollAnimatedContent>
      </section>

      {/* Back to Home Link */}
      <div className="container mx-auto px-6 mb-8">
        <Link
          href="/"
          className="inline-flex items-center text-mana-mint hover:text-mana-mint/80 transition-colors duration-300 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
          Back to Homepage
        </Link>
      </div>

      {/* Terms Content */}
      <section className="py-8 md:py-16 bg-mana-gray/10">
        <div className="container mx-auto px-6 max-w-4xl">
          <ScrollAnimatedContent
            initialClassName="initial-hidden-fade-up"
            animationClassName="animate-fade-in-up"
            className="prose prose-invert prose-lg max-w-none"
          >
            <div className="space-y-12">
              {/* Introduction */}
              <div className="p-6 bg-mana-gray/30 rounded-xl border border-mana-gray-light/20">
                <div className="flex items-center mb-4">
                  <FileText className="w-6 h-6 text-mana-mint mr-3" />
                  <h2 className="text-2xl font-bold text-mana-text">
                    1. Introduction
                  </h2>
                </div>
                <p className="text-mana-text-secondary leading-relaxed">
                  Welcome to Mana, a 3D printing marketplace platform operated
                  by Mana Labs Inc. ("we," "us," or "our"). These Terms of
                  Service ("Terms") govern your use of our website, mobile
                  application, and services (collectively, the "Service")
                  operated by Mana Labs Inc.
                </p>
                <p className="text-mana-text-secondary leading-relaxed mt-4">
                  By accessing or using our Service, you agree to be bound by
                  these Terms. If you disagree with any part of these terms,
                  then you may not access the Service.
                </p>
              </div>

              {/* User Accounts */}
              <div className="p-6 bg-mana-gray/30 rounded-xl border border-mana-gray-light/20">
                <div className="flex items-center mb-4">
                  <Users className="w-6 h-6 text-mana-lavender mr-3" />
                  <h2 className="text-2xl font-bold text-mana-text">
                    2. User Accounts
                  </h2>
                </div>
                <div className="space-y-4 text-mana-text-secondary">
                  <p>
                    <strong>Account Creation:</strong> You must create an
                    account to use certain features of our Service. You are
                    responsible for maintaining the confidentiality of your
                    account credentials.
                  </p>
                  <p>
                    <strong>Buyer Accounts:</strong> Buyers may upload 3D
                    models, request printing services, and make payments through
                    our platform.
                  </p>
                  <p>
                    <strong>Seller Accounts:</strong> Sellers may offer 3D
                    printing services, register equipment, and receive payments
                    through Stripe Connect.
                  </p>
                  <p>
                    <strong>Account Verification:</strong> We may require
                    identity verification, including phone number verification
                    and government ID upload for sellers.
                  </p>
                </div>
              </div>

              {/* Platform Rules */}
              <div className="p-6 bg-mana-gray/30 rounded-xl border border-mana-gray-light/20">
                <div className="flex items-center mb-4">
                  <Shield className="w-6 h-6 text-mana-coral mr-3" />
                  <h2 className="text-2xl font-bold text-mana-text">
                    3. Platform Rules
                  </h2>
                </div>
                <div className="space-y-4 text-mana-text-secondary">
                  <p>
                    <strong>Prohibited Content:</strong> Users may not upload,
                    share, or request printing of content that is illegal,
                    harmful, threatening, abusive, defamatory, or infringes on
                    intellectual property rights.
                  </p>
                  <p>
                    <strong>Quality Standards:</strong> Sellers must maintain
                    high-quality printing standards and communicate clearly with
                    buyers about project requirements and timelines.
                  </p>
                  <p>
                    <strong>Payment Terms:</strong> All payments are processed
                    through Stripe. Buyers agree to pay for completed work, and
                    sellers agree to deliver work as specified.
                  </p>
                  <p>
                    <strong>Dispute Resolution:</strong> We provide a dispute
                    resolution process for issues between buyers and sellers,
                    but we are not responsible for the outcome of transactions.
                  </p>
                </div>
              </div>

              {/* Liability and Disclaimers */}
              <div className="p-6 bg-mana-gray/30 rounded-xl border border-mana-gray-light/20">
                <div className="flex items-center mb-4">
                  <AlertTriangle className="w-6 h-6 text-mana-sky mr-3" />
                  <h2 className="text-2xl font-bold text-mana-text">
                    4. Liability and Disclaimers
                  </h2>
                </div>
                <div className="space-y-4 text-mana-text-secondary">
                  <p>
                    <strong>Service Availability:</strong> We strive to maintain
                    service availability but do not guarantee uninterrupted
                    access to the platform.
                  </p>
                  <p>
                    <strong>Third-Party Services:</strong> We use third-party
                    services including Stripe for payments. Your use of these
                    services is subject to their respective terms.
                  </p>
                  <p>
                    <strong>Limitation of Liability:</strong> To the maximum
                    extent permitted by law, Mana Labs Inc. shall not be liable
                    for any indirect, incidental, special, consequential, or
                    punitive damages.
                  </p>
                  <p>
                    <strong>Manufacturing Liability:</strong> Sellers are
                    responsible for the quality and safety of their printed
                    products. Mana Labs Inc. is not liable for defects or issues
                    with printed items.
                  </p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="p-6 bg-mana-mint/10 rounded-xl border border-mana-mint/20">
                <h3 className="text-xl font-bold text-mana-mint mb-4">
                  Questions About These Terms?
                </h3>
                <p className="text-mana-text-secondary mb-4">
                  If you have any questions about these Terms of Service, please
                  contact us:
                </p>
                <div className="space-y-2 text-mana-text-secondary">
                  <p>
                    Email:{" "}
                    <a
                      href="mailto:legal@manalabs3d.com"
                      className="text-mana-mint hover:underline"
                    >
                      legal@manalabs3d.com
                    </a>
                  </p>
                  <p>
                    Address: ManaLabs Inc., Innovation District (Conceptual)
                  </p>
                </div>
              </div>
            </div>
          </ScrollAnimatedContent>
        </div>
      </section>

      <SiteFooter currentPage="/terms" />
    </div>
  );
}
