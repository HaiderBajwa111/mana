import Image from "next/image";
import Link from "next/link";
import { StickyNav } from "@/components/splash/sticky-nav";
import { Button } from "@/components/ui/button";
import { ScrollAnimatedContent } from "@/components/splash/scroll-animated-content";
import { SiteFooter } from "@/components/splash/site-footer";
import { Users, Lightbulb, Handshake, Gem, Palette } from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      icon: Users,
      title: "Community First",
      description:
        "We believe in the power of collaboration. Mana is built by and for a diverse community of creators, fostering an environment of shared learning and mutual support.",
      accent: "mint",
    },
    {
      icon: Lightbulb,
      title: "Innovation Driven",
      description:
        "Pushing the boundaries of what's possible is in our DNA. We champion new ideas, technologies, and creative approaches to 3D printing and making.",
      accent: "lavender",
    },
    {
      icon: Handshake,
      title: "Accessibility for All",
      description:
        "We're committed to making 3D printing resources and opportunities available to everyone, regardless of skill level or background, simplifying the journey from digital to physical.",
      accent: "coral",
    },
    {
      icon: Gem,
      title: "Quality & Precision",
      description:
        "From verified Makers to curated designs, we uphold a standard of excellence, ensuring reliability and satisfaction throughout the Mana ecosystem.",
      accent: "sky",
    },
    {
      icon: Palette,
      title: "Unleashing Creativity",
      description:
        "Mana is a canvas for imagination. We provide the tools and connections to help creators at all levels bring their most ambitious visions to life.",
      accent: "mana-mint", // Using a direct color from config
    },
  ];

  return (
    <div className="bg-mana-black text-mana-text min-h-screen font-sans">
      <StickyNav />

      {/* About Page Hero Section */}
      <section className="relative py-32 md:py-48 min-h-[60vh] flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <Image
            src="/assets/images/backgrounds/glowing-particle-network.png"
            alt="Abstract network background"
            layout="fill"
            objectFit="cover"
            className="animate-pulse"
            style={{ animationDuration: "10s" }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-mana-black/70 via-mana-black/90 to-mana-black z-0"></div>

        <ScrollAnimatedContent
          initialClassName="initial-hidden-fade-up"
          animationClassName="animate-fade-in-up"
          className="container mx-auto px-6 relative z-10"
        >
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-br from-white via-slate-300 to-mana-lavender">
            Shaping the Future of Making, Together.
          </h1>
          <p className="text-lg sm:text-xl text-mana-text-secondary max-w-3xl mx-auto">
            Mana is more than a platform; it's a movement. Discover the story,
            vision, and values that drive us to democratize creativity and
            empower makers worldwide.
          </p>
        </ScrollAnimatedContent>
      </section>

      {/* Our Mission Section */}
      <section className="py-20 md:py-32 bg-mana-gray/30">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <ScrollAnimatedContent
              initialClassName="initial-hidden-fade-right"
              animationClassName="animate-fade-in-right"
            >
              <h2 className="text-4xl font-bold tracking-tight mb-6 text-mana-mint">
                Our Mission: Democratizing Creation
              </h2>
              <p className="text-lg text-mana-text-secondary mb-4 leading-relaxed">
                At Mana, our core mission is to break down the barriers to 3D
                printing and digital fabrication. We aim to connect students,
                hobbyists, and small-scale innovators with the tools, resources,
                and skilled Makers they need to turn their brilliant ideas into
                tangible realities.
              </p>
              <p className="text-lg text-mana-text-secondary leading-relaxed">
                We envision a world where anyone, anywhere, can access the power
                of additive manufacturing, fostering a global community of
                creators who collaborate, learn, and inspire one another. Mana
                is the bridge between imagination and manifestation.
              </p>
            </ScrollAnimatedContent>
            <ScrollAnimatedContent
              initialClassName="initial-hidden-fade-left"
              animationClassName="animate-fade-in-left"
              className="rounded-3xl overflow-hidden shadow-2xl"
            >
              <Image
                src="/assets/images/illustrations/collaborative-blueprint.png"
                alt="Collaborative creation process"
                width={600}
                height={450}
                className="object-cover w-full h-full"
              />
            </ScrollAnimatedContent>
          </div>
        </div>
      </section>

      {/* The Mana Story Section */}
      <section className="py-20 md:py-32 bg-mana-black">
        <div className="container mx-auto px-6">
          <ScrollAnimatedContent
            initialClassName="initial-hidden-fade-up"
            animationClassName="animate-fade-in-up"
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <h2 className="text-4xl font-bold tracking-tight mb-6 text-mana-lavender">
              From Idea to Ecosystem
            </h2>
            <p className="text-lg text-mana-text-secondary leading-relaxed">
              Mana was born from a simple observation: incredible creative
              potential often remains untapped due to lack of access or
              know-how. We saw brilliant students with groundbreaking designs,
              hobbyists with unique visions, and small businesses needing
              prototypes, all facing hurdles in the 3D printing landscape.
            </p>
            <p className="text-lg text-mana-text-secondary mt-4 leading-relaxed">
              Driven by a passion for making and a belief in community, we set
              out to build an intuitive, inclusive platform. One that not only
              simplifies the printing process but also cultivates a vibrant
              ecosystem where Uploaders find reliable Makers, and Makers find
              meaningful projects. Mana is the culmination of that dream – a
              space where technology meets artistry, and community fuels
              innovation.
            </p>
          </ScrollAnimatedContent>
          <ScrollAnimatedContent
            initialClassName="initial-hidden-scale-sm"
            animationClassName="animate-scale-in"
            className="rounded-3xl overflow-hidden shadow-2xl max-w-4xl mx-auto"
          >
            <Image
              src="/assets/images/illustrations/mana-platform-timeline.png"
              alt="Mana platform evolution concept"
              width={1000}
              height={500}
              className="object-cover w-full"
            />
          </ScrollAnimatedContent>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-20 md:py-32 bg-mana-gray/30">
        <div className="container mx-auto px-6">
          <ScrollAnimatedContent
            initialClassName="initial-hidden-fade-up"
            animationClassName="animate-fade-in-up"
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold tracking-tight mb-6 text-mana-coral">
              Guided by Our Values
            </h2>
            <p className="text-lg text-mana-text-secondary max-w-2xl mx-auto">
              These principles are the bedrock of Mana, shaping our platform,
              our community, and our future.
            </p>
          </ScrollAnimatedContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <ScrollAnimatedContent
                key={value.title}
                initialClassName="initial-hidden-fade-up"
                animationClassName="animate-fade-in-up"
                delay={`delay-${index * 100}ms`}
                className="h-full"
              >
                <div
                  className={`bg-mana-gray p-8 rounded-3xl shadow-xl h-full border border-transparent hover:border-mana-${value.accent}/50 transition-colors duration-300 group`}
                >
                  <div
                    className={`w-16 h-16 rounded-2xl bg-mana-${value.accent}/10 flex items-center justify-center mb-6 border border-mana-${value.accent}/20 shadow-inner group-hover:scale-110 transition-transform duration-300`}
                  >
                    <value.icon
                      className={`w-8 h-8 text-mana-${value.accent}`}
                    />
                  </div>
                  <h3
                    className={`text-2xl font-semibold mb-3 text-mana-${value.accent}`}
                  >
                    {value.title}
                  </h3>
                  <p className="text-mana-text-secondary text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </ScrollAnimatedContent>
            ))}
          </div>
        </div>
      </section>

      {/* The Mana Collective Section */}
      <section className="py-20 md:py-32 bg-mana-black">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <ScrollAnimatedContent
              initialClassName="initial-hidden-fade-left"
              animationClassName="animate-fade-in-left"
              className="rounded-3xl overflow-hidden shadow-2xl"
            >
              <Image
                src="/assets/images/illustrations/futuristic-workshop-collaboration.png"
                alt="The Mana Collective - a diverse community"
                width={600}
                height={450}
                className="object-cover w-full h-full"
              />
            </ScrollAnimatedContent>
            <ScrollAnimatedContent
              initialClassName="initial-hidden-fade-right"
              animationClassName="animate-fade-in-right"
            >
              <h2 className="text-4xl font-bold tracking-tight mb-6 text-mana-sky">
                The Mana Collective
              </h2>
              <p className="text-lg text-mana-text-secondary mb-4 leading-relaxed">
                Mana isn't just software; it's a thriving ecosystem powered by
                people. Our "team" is a global collective of passionate
                designers, visionary engineers, skilled Makers, curious
                students, and dedicated hobbyists.
              </p>
              <p className="text-lg text-mana-text-secondary leading-relaxed">
                Every user, every contribution, and every shared idea
                strengthens the Mana network. We are united by a shared
                enthusiasm for creation and a commitment to building an open,
                supportive, and innovative future for digital fabrication.
              </p>
            </ScrollAnimatedContent>
          </div>
        </div>
      </section>

      {/* Join Us CTA Section */}
      <section className="py-20 md:py-32 bg-mana-gray/30">
        <div className="container mx-auto px-6 text-center">
          <ScrollAnimatedContent
            initialClassName="initial-hidden-fade-up"
            animationClassName="animate-fade-in-up"
          >
            <h2 className="text-4xl font-bold tracking-tight mb-6 text-mana-mint">
              Become Part of the Manaverse
            </h2>
            <p className="text-lg text-mana-text-secondary max-w-2xl mx-auto mb-10">
              Whether you're looking to bring your designs to life, offer your
              printing expertise, or simply explore the cutting edge of 3D
              creation, there's a place for you in the Mana community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-mana-mint text-mana-black font-semibold rounded-xl px-8 py-3
                           shadow-glow-mint-sm hover:bg-mana-mint/90 hover:shadow-glow-mint-md transition-all duration-300
                           transform hover:scale-105 text-base"
                asChild
              >
                <Link href="/#marketplace">Explore Marketplace</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-2 border-mana-lavender text-mana-lavender font-semibold rounded-xl px-8 py-3
                           hover:bg-mana-lavender/10 hover:shadow-glow-lavender-sm transition-all duration-300
                           transform hover:scale-105 text-base"
                asChild
              >
                <Link href="/become-maker">Become a Maker</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-2 border-mana-coral text-mana-coral font-semibold rounded-xl px-8 py-3
                           hover:bg-mana-coral/10 hover:shadow-glow-coral-sm transition-all duration-300
                           transform hover:scale-105 text-base"
                asChild
              >
                <Link href="/upload">Start Printing</Link>
              </Button>
            </div>
          </ScrollAnimatedContent>
        </div>
      </section>

      {/* Use the new SiteFooter component with current page highlighting */}
      <SiteFooter currentPage="/about" />
    </div>
  );
}
