import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#8E9196",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#aaadb0",
          foreground: "#FFFFFF",
        },
        warning: {
          DEFAULT: "#F6F6F7",
          foreground: "#1A1F2C",
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
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "wave-slow": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-200px)" }
        },
        "wave-fast": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-100px)" }
        },
        progress: {
          '0%': { transform: 'rotate(-90deg) scale(0)' },
          '100%': { transform: 'rotate(-90deg) scale(1)' }
        },
        float: {
          '0%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-5px)' },
          '100%': { transform: 'translateY(0px)' }
        },
        flip: {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(360deg)' }
        },
        clouds: {
          '0%': { transform: 'translateX(15px)' },
          '50%': { transform: 'translateX(0px)' },
          '100%': { transform: 'translateX(15px)' }
        },
        sunshines: {
          '0%': { transform: 'scale(1)', opacity: '0.6' },
          '100%': { transform: 'scale(1.4)', opacity: '0' }
        }
      },
      animation: {
        "wave-slow": "wave-slow 7s linear infinite",
        "wave-fast": "wave-fast 5s linear infinite",
        progress: 'progress 1s ease-out forwards',
        float: 'float 3s ease-in-out infinite',
        flip: 'flip 0.6s ease-in-out',
        clouds: 'clouds 8s ease-in-out infinite',
        'clouds-slow': 'clouds 12s ease-in-out infinite',
        sunshine: 'sunshines 2s infinite'
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;