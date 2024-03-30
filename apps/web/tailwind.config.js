/** @type {import('tailwindcss').Config} */

// eslint-disable-line global-require
const daisyui = require("daisyui");
const typography = require("@tailwindcss/typography");

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  plugins: [typography, daisyui],
  daisyui: {
    themes: ["bumblebee", "halloween"],
    darkTheme: "halloween",
  },
  darkMode: ["class", '[data-theme="halloween"]'],
};
