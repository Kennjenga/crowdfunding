
const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "media",
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
        // Brand Colors
        primary: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
          950: "#2e1065",
        },
        secondary: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
          950: "#431407",
        },
        // Semantic Colors
        success: {
          DEFAULT: "#10B981",
          50: "#ECFDF5",
          600: "#059669",
        },
        error: {
          DEFAULT: "#EF4444",
          50: "#FEF2F2",
          600: "#DC2626",
        },
        warning: {
          DEFAULT: "#F59E0B",
          50: "#FFFBEB",
          600: "#D97706",
        },
        info: {
          DEFAULT: "#3B82F6",
          50: "#EFF6FF",
          600: "#2563EB",
        },
        // UI Colors
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        card: {
          DEFAULT: "rgb(var(--card-background) / <alpha-value>)",
          foreground: "rgb(var(--card-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "rgb(var(--muted) / <alpha-value>)",
          foreground: "rgb(var(--muted-foreground) / <alpha-value>)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        shimmer: "shimmer 1.5s infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
        "screen-10": "10vh",
        "screen-80": "80vh",
      },
      height: {
        "screen-90": "90vh",
      },
      maxWidth: {
        "8xl": "88rem",
      },
      boxShadow: {
        glow: "0 0 4px rgb(0 0 0 / 0.1)",
        "glow-lg": "0 0 8px rgb(0 0 0 / 0.1)",
      },
      opacity: {
        15: "0.15",
        85: "0.85",
      },
    },
  },
  plugins: [import('@tailwindcss/typography')],
};

export default config;
