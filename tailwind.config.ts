import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    {
      pattern: /bg-gradient-to-(r|br|b|l|t)/,
    },
    {
      pattern: /(from|via|to)-(orange|amber|yellow|indigo|purple|emerald|teal|fuchsia|pink|cyan|blue|rose|red|violet|sky|slate|gray)-(50|100|200|300|400|500|600|700|800|900)/,
    },
    {
      pattern: /border-(orange|amber|yellow|indigo|purple|emerald|teal|fuchsia|pink|cyan|blue|rose|red|violet|sky)-(100|200|300|400|500)\/?\d*/,
    },
    {
      pattern: /shadow-(orange|amber|yellow|indigo|purple|emerald|teal|fuchsia|pink|cyan|blue|rose|red|violet|sky)-(400|500|600)\/?\d*/,
    },
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#8B5CF6", // Vibrant purple
          light: "#A78BFA",
          dark: "#7C3AED",
        },
        secondary: {
          DEFAULT: "#F97316", // Vibrant orange
          light: "#FB923C",
          dark: "#EA580C",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#F3F4F6",
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 10px 40px -10px rgba(0,0,0,0.08)',
        'float': '0 20px 40px -10px rgba(0,0,0,0.12)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
export default config;
