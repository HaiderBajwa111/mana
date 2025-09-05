import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],

  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Light theme semantic colors
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        // MANA BRAND COLORS (light theme compatible)
        "mana-blue": {
          DEFAULT: "#2563eb", // blue-600
          light: "#3b82f6", // blue-500
          dark: "#1d4ed8", // blue-700
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        "mana-mint": "#6EE7B7", // emerald-300
        "mana-lavender": "#C4B5FD", // violet-300
        "mana-coral": "#FDBA74", // orange-300
        "mana-sky": "#7DD3FC", // sky-300
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        "glow-mint-sm": "0 0 8px 0px theme(colors.mana-mint)",
        "glow-mint-md": "0 0 15px 2px theme(colors.mana-mint)",
        "glow-mint-lg": "0 0 25px 5px theme(colors.mana-mint)",
        "glow-lavender-sm": "0 0 8px 0px theme(colors.mana-lavender)",
        "glow-lavender-md": "0 0 15px 2px theme(colors.mana-lavender)",
        "glow-lavender-lg": "0 0 25px 5px theme(colors.mana-lavender)",
        "glow-coral-sm": "0 0 8px 0px theme(colors.mana-coral)",
        "glow-coral-md": "0 0 15px 2px theme(colors.mana-coral)",
        "glow-sky-sm": "0 0 8px 0px theme(colors.mana-sky)",
        "glow-sky-md": "0 0 15px 2px theme(colors.mana-sky)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        float: "float 6s ease-in-out infinite",
        fadeIn: "fadeIn 1s ease-out forwards",
      },
      spacing: {
        "128": "32rem",
        "144": "36rem",
      },
      letterSpacing: {
        "extra-wide": "0.15em",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
