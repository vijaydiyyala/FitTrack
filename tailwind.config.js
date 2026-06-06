/**
 * Tailwind config for NativeWind v4. The color tokens here mirror `COLORS` in
 * src/constants so className styling and StyleSheet styling stay in sync — a
 * dark, near-black surface stack with an electric-lime accent.
 *
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Surfaces (cool-neutral dark → elevated)
        bg: "#0B0D10",
        surface: "#14171D",
        elevated: "#1C2027",
        border: "#292E38",
        // Text
        fg: "#F4F6F8",
        muted: "#99A1AE",
        faint: "#686F7C",
        // Electric-lime accent
        accent: "#A3E635",
        "accent-dark": "#8BC72E",
        "accent-fg": "#0B0D10",
        // Status
        danger: "#FB7185",
        success: "#4ADE80",
      },
      fontFamily: {
        sans: ["PlusJakartaSans_400Regular"],
        jakarta: ["PlusJakartaSans_400Regular"],
        "jakarta-medium": ["PlusJakartaSans_500Medium"],
        "jakarta-semibold": ["PlusJakartaSans_600SemiBold"],
        "jakarta-bold": ["PlusJakartaSans_700Bold"],
        "jakarta-extrabold": ["PlusJakartaSans_800ExtraBold"],
      },
    },
  },
  plugins: [],
};
