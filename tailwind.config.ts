import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: "#0b0f19",
        card: "#151b2b",
        neon: {
          blue: "#00f0ff",
          purple: "#b026ff"
        }
      },
    },
  },
  plugins: [],
};
export default config;
