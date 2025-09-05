import Link from "next/link";
import { Twitter, Linkedin, Instagram } from "lucide-react";
import { ScrollAnimatedContent } from "@/components/splash/scroll-animated-content";

interface SiteFooterProps {
  currentPage?: string; // Optional prop to highlight the current page
}

export function SiteFooter({ currentPage }: SiteFooterProps) {
  const footerLinks = [
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/privacy", label: "Privacy Policy" },
  ];

  return (
    <footer className="relative py-16 bg-slate-100 border-t border-slate-200 overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        {/* Social Icons - Top Row */}
        <div className="flex justify-center items-center gap-x-6 mb-10 pt-4">
          <ScrollAnimatedContent
            initialClassName="initial-hidden-fade-up"
            animationClassName="animate-fade-in-up"
            delay="delay-100ms"
          >
            <Link
              href="https://x.com/yourprofile" // Replace with actual X profile URL
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Mana on X"
              className="w-10 h-10 rounded-full bg-blue-100 hover:bg-blue-200
                         flex items-center justify-center transition-all duration-300 ease-in-out
                         shadow-sm hover:shadow-md group transform hover:scale-110"
            >
              <Twitter className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform duration-300 ease-in-out" />
            </Link>
          </ScrollAnimatedContent>
          <ScrollAnimatedContent
            initialClassName="initial-hidden-fade-up"
            animationClassName="animate-fade-in-up"
            delay="delay-200ms"
          >
            <Link
              href="https://linkedin.com/company/yourprofile" // Replace with actual LinkedIn profile URL
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Mana on LinkedIn"
              className="w-10 h-10 rounded-full bg-blue-100 hover:bg-blue-200
                         flex items-center justify-center transition-all duration-300 ease-in-out
                         shadow-sm hover:shadow-md group transform hover:scale-110"
            >
              <Linkedin className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform duration-300 ease-in-out" />
            </Link>
          </ScrollAnimatedContent>
          <ScrollAnimatedContent
            initialClassName="initial-hidden-fade-up"
            animationClassName="animate-fade-in-up"
            delay="delay-300ms"
          >
            <Link
              href="https://instagram.com/yourprofile" // Replace with actual Instagram profile URL
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Mana on Instagram"
              className="w-10 h-10 rounded-full bg-blue-100 hover:bg-blue-200
                         flex items-center justify-center transition-all duration-300 ease-in-out
                         shadow-sm hover:shadow-md group transform hover:scale-110"
            >
              <Instagram className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform duration-300 ease-in-out" />
            </Link>
          </ScrollAnimatedContent>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center items-center gap-x-6 sm:gap-x-8 gap-y-4 mb-10">
          {footerLinks.map((link, index) => (
            <ScrollAnimatedContent
              key={link.href}
              initialClassName="initial-hidden-fade-up"
              animationClassName="animate-fade-in-up"
              delay={`delay-${(index + 1) * 100 + 300}ms`}
            >
              <Link
                href={link.href}
                className={`text-sm transition-all duration-300 ease-in-out relative group ${
                  currentPage === link.href
                    ? "text-blue-600 hover:text-blue-700"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>{link.label}</span>
                <span
                  className={`absolute bottom-0 left-0 h-0.5 transition-all duration-300 ease-out ${
                    currentPage === link.href
                      ? "w-full bg-blue-600"
                      : "w-0 bg-blue-600 group-hover:w-full"
                  }`}
                ></span>
              </Link>
            </ScrollAnimatedContent>
          ))}
        </div>

        {/* Logo and Tagline */}
        <ScrollAnimatedContent
          initialClassName="initial-hidden-fade-up"
          animationClassName="animate-fade-in-up"
          delay="delay-500ms"
          className="text-center mb-10"
        >
          <Link href="/" className="inline-flex items-center gap-2">
            <img src="/assets/logos/logo.png?v=1" alt="Mana" width={40} height={40} />
            <span className="text-4xl font-bold tracking-extra-wide text-slate-900">MANA</span>
          </Link>
          <p className="text-slate-600 mt-3 text-sm">
            Bringing your digital creations to life.
          </p>
        </ScrollAnimatedContent>

        {/* Copyright */}
        <ScrollAnimatedContent
          initialClassName="initial-hidden-fade-up"
          animationClassName="animate-fade-in-up"
          delay="delay-600ms"
          className="pt-8 border-t border-slate-200 text-center"
        >
          <p className="text-sm text-slate-600">
            &copy; {new Date().getFullYear()} Mana. All rights reserved.
          </p>
        </ScrollAnimatedContent>
      </div>
    </footer>
  );
}
