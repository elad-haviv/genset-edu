import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: { 950: "#060b16", 900: "#0a1222", 800: "#0f1a30", 700: "#16243f", 600: "#1f3254" },
        graphite: { 900: "#121519", 800: "#1a1e24", 700: "#252a32", 600: "#343b46", 500: "#4a5361" },
        volt: { 300: "#7cc8ff", 400: "#3fb0ff", 500: "#1e90ff", 600: "#1670d6" },
        amber: { 400: "#ffb547", 500: "#ff9a1f", 600: "#e67e00" },
        ok: "#2fd47a",
        warn: "#ffc531",
        danger: "#ff4d4d",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      keyframes: {
        flow: { to: { strokeDashoffset: "-24" } },
        pulseRing: { "0%": { transform: "scale(.8)", opacity: ".9" }, "100%": { transform: "scale(2.2)", opacity: "0" } },
        blink: { "0%,49%": { opacity: "1" }, "50%,100%": { opacity: ".25" } },
        fadeUp: { from: { opacity: "0", transform: "translateY(8px)" }, to: { opacity: "1", transform: "none" } },
      },
      animation: {
        flow: "flow .8s linear infinite",
        "flow-slow": "flow 1.6s linear infinite",
        pulseRing: "pulseRing 1.6s ease-out infinite",
        blink: "blink 1s steps(1) infinite",
        fadeUp: "fadeUp .35s ease-out both",
      },
    },
  },
  plugins: [],
};
export default config;
