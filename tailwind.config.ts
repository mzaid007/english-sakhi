import type { Config } from "tailwindcss";

/**
 * Modern Indian Warmth — design tokens for English Sakhi.
 * Mirrored in `src/app/globals.css` `@theme` for Tailwind v4 runtime utilities.
 */
export const sakhiTokens = {
  colors: {
    cream: "#FAF8F5",
    surface: "#F5F2EB",
    emerald: "#059669",
    "emerald-soft": "#D1FAE5",
    amber: "#D97706",
    "amber-soft": "#FEF3C7",
    coral: "#E11D48",
    ink: "#292524",
    muted: "#78716C",
    who: "#FBBF24",
    "who-soft": "#FEF3C7",
    action: "#059669",
    "action-soft": "#D1FAE5",
    where: "#3B82F6",
    "where-soft": "#DBEAFE",
  },
  touchMin: "48px",
} as const;

const { colors, touchMin } = sakhiTokens;

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        cream: colors.cream,
        surface: colors.surface,
        sakhi: {
          emerald: colors.emerald,
          "emerald-soft": colors["emerald-soft"],
          amber: colors.amber,
          "amber-soft": colors["amber-soft"],
          coral: colors.coral,
          ink: colors.ink,
          muted: colors.muted,
        },
        who: colors.who,
        "who-soft": colors["who-soft"],
        action: colors.action,
        "action-soft": colors["action-soft"],
        where: colors.where,
        "where-soft": colors["where-soft"],
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-nunito)", "system-ui", "sans-serif"],
        hindi: [
          "var(--font-noto-devanagari)",
          "Noto Sans Devanagari",
          "sans-serif",
        ],
      },
      minHeight: { touch: touchMin },
      minWidth: { touch: touchMin },
      boxShadow: {
        soft: "0 8px 24px -8px rgb(41 37 36 / 0.12)",
        pill: "0 2px 8px -2px rgb(5 150 105 / 0.25)",
      },
    },
  },
};

export default config;
