import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core backgrounds
        background: {
          DEFAULT: "#050507",
          secondary: "#0a0a0f",
        },
        surface: {
          DEFAULT: "#0f0f14",
          secondary: "#141419",
          elevated: "#1a1a22",
          hover: "#1f1f28",
        },
        // Borders
        border: {
          DEFAULT: "rgba(255, 255, 255, 0.06)",
          light: "rgba(255, 255, 255, 0.1)",
          focus: "rgba(99, 102, 241, 0.5)",
        },
        // Primary colors
        primary: {
          DEFAULT: "#6366f1",
          light: "#818cf8",
          dark: "#4f46e5",
          foreground: "#ffffff",
        },
        // Secondary colors
        secondary: {
          DEFAULT: "#a855f7",
          light: "#c084fc",
          dark: "#9333ea",
          foreground: "#ffffff",
        },
        // Accent
        accent: {
          DEFAULT: "#06b6d4",
          light: "#22d3ee",
        },
        // Status colors
        success: {
          DEFAULT: "#10b981",
          light: "#34d399",
        },
        error: "#ef4444",
        warning: "#f59e0b",
        // Text colors
        "text-primary": "#fafafa",
        "text-secondary": "#a1a1aa",
        "text-muted": "#71717a",
        "text-subtle": "#52525b",
        // Karma tier colors
        karma: {
          newcomer: "#71717a",
          contributor: "#6366f1",
          established: "#a855f7",
          trusted: "#f59e0b",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        mono: ["JetBrains Mono", "SF Mono", "Fira Code", "monospace"],
      },
      fontSize: {
        "display-xl": ["5rem", { lineHeight: "1", letterSpacing: "-0.02em" }],
        "display-lg": ["4rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display": ["3rem", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
        "heading-lg": ["2rem", { lineHeight: "1.3", letterSpacing: "-0.01em" }],
        "heading": ["1.5rem", { lineHeight: "1.4", letterSpacing: "-0.01em" }],
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "30": "7.5rem",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "fade-down": "fadeDown 0.6s ease-out forwards",
        "scale-in": "scaleIn 0.4s ease-out forwards",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "vote-bounce": "voteBounce 0.3s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeDown: {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        voteBounce: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.2)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        glow: {
          "0%": { opacity: "0.5" },
          "100%": { opacity: "1" },
        },
      },
      boxShadow: {
        "glow-sm": "0 0 20px rgba(99, 102, 241, 0.15)",
        "glow": "0 0 40px rgba(99, 102, 241, 0.2)",
        "glow-lg": "0 0 60px rgba(99, 102, 241, 0.3)",
        "card": "0 0 0 1px rgba(255, 255, 255, 0.06), 0 4px 6px -1px rgba(0, 0, 0, 0.3)",
        "card-hover": "0 0 0 1px rgba(255, 255, 255, 0.1), 0 20px 40px -15px rgba(0, 0, 0, 0.5)",
        "elevated": "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
      },
      backdropBlur: {
        "xs": "2px",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-primary": "linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)",
        "gradient-subtle": "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)",
        "gradient-card": "linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0) 100%)",
        "gradient-border": "linear-gradient(135deg, rgba(99, 102, 241, 0.5), rgba(168, 85, 247, 0.5))",
      },
    },
  },
  plugins: [],
};

export default config;
