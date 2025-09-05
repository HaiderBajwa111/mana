import Image from "next/image";
import Link from "next/link";
import { StickyNav } from "@/components/splash/sticky-nav";
import { ScrollAnimatedContent } from "@/components/splash/scroll-animated-content";
import { SiteFooter } from "@/components/splash/site-footer";
import { ContactForm } from "@/components/splash/contact-form";
import { Mail, MapPin, Twitter, Linkedin, Instagram } from "lucide-react";

export default function ContactPage() {
  const contactEmail = "contact@manalabs3d.com";

  return (
    <div className="bg-mana-black text-mana-text min-h-screen font-sans">
      <StickyNav />

      {/* Contact Page Hero Section */}
      <section className="relative py-32 md:py-48 min-h-[50vh] flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/assets/images/backgrounds/abstract-contact-background.png"
            alt="Abstract contact background"
            layout="fill"
            objectFit="cover"
            className="animate-pulse"
            style={{ animationDuration: "12s" }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-mana-black/70 via-mana-black/90 to-mana-black z-0"></div>

        <ScrollAnimatedContent
          initialClassName="initial-hidden-fade-up"
          animationClassName="animate-fade-in-up"
          className="container mx-auto px-6 relative z-10"
        >
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-br from-white via-slate-300 to-mana-sky">
            Get In Touch
          </h1>
          <p className="text-lg sm:text-xl text-mana-text-secondary max-w-2xl mx-auto">
            Have questions, ideas, or just want to say hello? We're here to
            listen and connect. Reach out and let's shape the future of making
            together.
          </p>
        </ScrollAnimatedContent>
      </section>

      {/* Contact Form & Info Section */}
      <section className="py-20 md:py-32 bg-mana-gray/10">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-5 gap-12 md:gap-16">
            {/* Contact Form */}
            <div className="lg:col-span-3">
              <ScrollAnimatedContent
                initialClassName="initial-hidden-fade-right"
                animationClassName="animate-fade-in-right"
              >
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-8 text-mana-mint">
                  Send Us a Message
                </h2>
                <ContactForm />
              </ScrollAnimatedContent>
            </div>

            {/* Contact Info & Socials */}
            <div className="lg:col-span-2">
              <ScrollAnimatedContent
                initialClassName="initial-hidden-fade-left"
                animationClassName="animate-fade-in-left"
                delay="delay-200ms"
              >
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-8 text-mana-lavender">
                  Contact Directly
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4 group">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-mana-sky/10 group-hover:bg-mana-sky/20 transition-colors duration-300 flex items-center justify-center">
                      <Mail className="w-6 h-6 text-mana-sky" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-mana-text">
                        Email Us
                      </h3>
                      <a
                        href={`mailto:${contactEmail}`}
                        className="text-mana-sky hover:underline break-all"
                      >
                        {contactEmail}
                      </a>
                      <p className="text-sm text-mana-text-secondary mt-1">
                        We typically respond within 24-48 hours.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 group">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-mana-coral/10 group-hover:bg-mana-coral/20 transition-colors duration-300 flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-mana-coral" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-mana-text">
                        Our Hub (Conceptual)
                      </h3>
                      <p className="text-mana-text-secondary">
                        ManaLabs, Innovation District
                      </p>
                      <p className="text-sm text-mana-text-secondary mt-1">
                        While we're globally distributed, our spirit is centered
                        on innovation.
                      </p>
                    </div>
                  </div>
                </div>

                <h3 className="text-2xl font-semibold mt-12 mb-6 text-mana-lavender">
                  Connect on Social
                </h3>
                <div className="flex space-x-4">
                  <Link
                    href="https://x.com/yourprofile"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Mana on X"
                    className="w-12 h-12 rounded-xl bg-mana-sky/10 hover:bg-mana-sky/20 flex items-center justify-center transition-all duration-300 ease-in-out shadow-glow-sky-sm hover:shadow-glow-sky-md group transform hover:scale-110"
                  >
                    <Twitter className="w-6 h-6 text-mana-sky group-hover:scale-110 transition-transform duration-300 ease-in-out" />
                  </Link>
                  <Link
                    href="https://linkedin.com/company/yourprofile"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Mana on LinkedIn"
                    className="w-12 h-12 rounded-xl bg-mana-sky/10 hover:bg-mana-sky/20 flex items-center justify-center transition-all duration-300 ease-in-out shadow-glow-sky-sm hover:shadow-glow-sky-md group transform hover:scale-110"
                  >
                    <Linkedin className="w-6 h-6 text-mana-sky group-hover:scale-110 transition-transform duration-300 ease-in-out" />
                  </Link>
                  <Link
                    href="https://instagram.com/yourprofile"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Mana on Instagram"
                    className="w-12 h-12 rounded-xl bg-mana-lavender/10 hover:bg-mana-lavender/20 flex items-center justify-center transition-all duration-300 ease-in-out shadow-glow-lavender-sm hover:shadow-glow-lavender-md group transform hover:scale-110"
                  >
                    <Instagram className="w-6 h-6 text-mana-lavender group-hover:scale-110 transition-transform duration-300 ease-in-out" />
                  </Link>
                </div>
              </ScrollAnimatedContent>
            </div>
          </div>
        </div>
      </section>

      {/* Use the new SiteFooter component with current page highlighting */}
      <SiteFooter currentPage="/contact" />
    </div>
  );
}
