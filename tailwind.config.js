/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        obsidian: "#08090D",
        surface: "#121317",
        raised: "#1A1B20",
        slate: "#292A2E",
        ink: "#E3E2E8",
        muted: "#B9CACB",
        quiet: "#849495",
        cyan: "#00DCE6",
        green: "#00E38E",
        coral: "#FF6B78",
        hairline: "#3A494B",
      },
      borderRadius: {
        panel: "2rem",
      },
    },
  },
  plugins: [],
};
