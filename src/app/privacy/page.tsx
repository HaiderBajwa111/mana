import Link from "next/link";
import { StickyNav } from "@/components/splash/sticky-nav";
import { ScrollAnimatedContent } from "@/components/splash/scroll-animated-content";
import { SiteFooter } from "@/components/splash/site-footer";
import { ArrowLeft, Shield, Eye, Database, Lock, Mail } from "lucide-react";

export default function PrivacyPage() {
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
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-br from-white via-slate-300 to-mana-lavender">
            Privacy Policy
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

      {/* Privacy Content */}
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
                  <Shield className="w-6 h-6 text-mana-mint mr-3" />
                  <h2 className="text-2xl font-bold text-mana-text">
                    1. Introduction
                  </h2>
                </div>
                <p className="text-mana-text-secondary leading-relaxed">
                  At Mana Labs Inc. ("we," "us," or "our"), we are committed to
                  protecting your privacy and personal information. This Privacy
                  Policy explains how we collect, use, disclose, and safeguard
                  your information when you use our 3D printing marketplace
                  platform.
                </p>
                <p className="text-mana-text-secondary leading-relaxed mt-4">
                  By using our Service, you consent to the data practices
                  described in this policy.
                </p>
              </div>

              {/* Information We Collect */}
              <div className="p-6 bg-mana-gray/30 rounded-xl border border-mana-gray-light/20">
                <div className="flex items-center mb-4">
                  <Database className="w-6 h-6 text-mana-lavender mr-3" />
                  <h2 className="text-2xl font-bold text-mana-text">
                    2. Information We Collect
                  </h2>
                </div>
                <div className="space-y-4 text-mana-text-secondary">
                  <div>
                    <h4 className="font-semibold text-mana-text mb-2">
                      Personal Information:
                    </h4>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Name, email address, phone number</li>
                      <li>Shipping and billing addresses</li>
                      <li>
                        Payment information (processed securely by Stripe)
                      </li>
                      <li>Government ID for seller verification</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-mana-text mb-2">
                      Technical Information:
                    </h4>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>3D model files and project specifications</li>
                      <li>Device information and IP address</li>
                      <li>Usage data and platform interactions</li>
                      <li>Cookies and similar tracking technologies</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* How We Use Information */}
              <div className="p-6 bg-mana-gray/30 rounded-xl border border-mana-gray-light/20">
                <div className="flex items-center mb-4">
                  <Eye className="w-6 h-6 text-mana-coral mr-3" />
                  <h2 className="text-2xl font-bold text-mana-text">
                    3. How We Use Your Information
                  </h2>
                </div>
                <div className="space-y-4 text-mana-text-secondary">
                  <p>
                    <strong>Service Provision:</strong> To facilitate 3D
                    printing transactions between buyers and sellers, process
                    payments, and provide customer support.
                  </p>
                  <p>
                    <strong>Account Management:</strong> To create and manage
                    user accounts, verify identities, and maintain platform
                    security.
                  </p>
                  <p>
                    <strong>Communication:</strong> To send service-related
                    notifications, project updates, and marketing communications
                    (with your consent).
                  </p>
                  <p>
                    <strong>Platform Improvement:</strong> To analyze usage
                    patterns, improve our services, and develop new features.
                  </p>
                  <p>
                    <strong>Legal Compliance:</strong> To comply with applicable
                    laws, regulations, and legal processes.
                  </p>
                </div>
              </div>

              {/* Data Security */}
              <div className="p-6 bg-mana-gray/30 rounded-xl border border-mana-gray-light/20">
                <div className="flex items-center mb-4">
                  <Lock className="w-6 h-6 text-mana-sky mr-3" />
                  <h2 className="text-2xl font-bold text-mana-text">
                    4. Data Security
                  </h2>
                </div>
                <div className="space-y-4 text-mana-text-secondary">
                  <p>
                    <strong>Encryption:</strong> We use industry-standard
                    encryption to protect data in transit and at rest.
                  </p>
                  <p>
                    <strong>Payment Security:</strong> All payment information
                    is processed securely by Stripe and is not stored on our
                    servers.
                  </p>
                  <p>
                    <strong>Access Controls:</strong> We implement strict access
                    controls and regularly audit our security practices.
                  </p>
                  <p>
                    <strong>Data Retention:</strong> We retain personal
                    information only as long as necessary to provide our
                    services and comply with legal obligations.
                  </p>
                </div>
              </div>

              {/* Your Rights */}
              <div className="p-6 bg-mana-gray/30 rounded-xl border border-mana-gray-light/20">
                <div className="flex items-center mb-4">
                  <Shield className="w-6 h-6 text-mana-mint mr-3" />
                  <h2 className="text-2xl font-bold text-mana-text">
                    5. Your Privacy Rights
                  </h2>
                </div>
                <div className="space-y-4 text-mana-text-secondary">
                  <p>
                    <strong>Access:</strong> You can request access to the
                    personal information we hold about you.
                  </p>
                  <p>
                    <strong>Correction:</strong> You can request correction of
                    inaccurate or incomplete information.
                  </p>
                  <p>
                    <strong>Deletion:</strong> You can request deletion of your
                    personal information, subject to legal and contractual
                    obligations.
                  </p>
                  <p>
                    <strong>Portability:</strong> You can request a copy of your
                    data in a structured, machine-readable format.
                  </p>
                  <p>
                    <strong>Opt-out:</strong> You can opt out of marketing
                    communications at any time.
                  </p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="p-6 bg-mana-lavender/10 rounded-xl border border-mana-lavender/20">
                <div className="flex items-center mb-4">
                  <Mail className="w-6 h-6 text-mana-lavender mr-3" />
                  <h3 className="text-xl font-bold text-mana-lavender">
                    Privacy Questions?
                  </h3>
                </div>
                <p className="text-mana-text-secondary mb-4">
                  If you have any questions about this Privacy Policy or our
                  data practices, please contact us:
                </p>
                <div className="space-y-2 text-mana-text-secondary">
                  <p>
                    Email:{" "}
                    <a
                      href="mailto:privacy@manalabs3d.com"
                      className="text-mana-lavender hover:underline"
                    >
                      privacy@manalabs3d.com
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

      <SiteFooter currentPage="/privacy" />
    </div>
  );
}
