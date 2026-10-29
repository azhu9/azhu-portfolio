/** @type {import('tailwindcss').Config} */
const token = (name) => `hsl(var(--${name}) / <alpha-value>)`;

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        fg: token("fg"),
        muted: token("muted"),
        line: token("line"),
        accent: { DEFAULT: token("accent"), fg: token("accent-fg") },
      },
      fontFamily: {
        sans: ['"DM Sans"', "sans-serif"],
        display: ['"Geist"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
