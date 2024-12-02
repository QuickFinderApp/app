import type { Config } from "tailwindcss";

function getAlpha(color: string, alphaKey: number) {
  return `color-mix(in srgb, ${color} ${alphaKey}%, transparent)`;
}

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: getAlpha("var(--background)", 40),
          full: "color-mix(in srgb, var(--background) 100%, #ffffff)"
        },
        backgroundSecondary: {
          DEFAULT: getAlpha("var(--backgroundSecondary)", 40),
          full: "color-mix(in srgb, var(--backgroundSecondary) 100%, #ffffff)"
        },
        border: {
          DEFAULT: getAlpha("var(--text)", 40),
          soft: getAlpha("var(--text)", 10)
        },
        text: {
          DEFAULT: "var(--text)",
          100: getAlpha("var(--text)", 10),
          400: getAlpha("var(--text)", 40),
          600: getAlpha("var(--text)", 60)
        },
        loader: "var(--loader)",
        selection: {
          DEFAULT: "var(--selection)",
          200: getAlpha("var(--selection)", 20),
          100: getAlpha("var(--selection)", 10)
        },
        green: {
          DEFAULT: "var(--green)",
          100: getAlpha("var(--green)", 15)
        },
        yellow: {
          DEFAULT: "var(--yellow)",
          100: getAlpha("var(--yellow)", 15)
        },
        red: {
          DEFAULT: "var(--red)",
          100: getAlpha("var(--red)", 15)
        },
        orange: {
          DEFAULT: "var(--orange)",
          100: getAlpha("var(--orange)", 15)
        },
        blue: {
          DEFAULT: "var(--blue)",
          100: getAlpha("var(--blue)", 15)
        },
        purple: {
          DEFAULT: "var(--purple)",
          100: getAlpha("var(--purple)", 15)
        },
        magenta: {
          DEFAULT: "var(--magenta)",
          100: getAlpha("var(--magenta)", 15)
        },

        foreground: "var(--text)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)"
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)"
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)"
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)"
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)"
        },
        accent: {
          DEFAULT: getAlpha("var(--selection)", 10),
          foreground: "var(--accent-foreground)"
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)"
        },
        input: "var(--input)",
        ring: "var(--ring)",
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)"
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)"
      },
      dropShadow: {
        glow: ["0 0px 20px rgba(255,255, 255, 0.35)", "0 0px 65px rgba(255, 255,255, 0.2)"]
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
} satisfies Config;
