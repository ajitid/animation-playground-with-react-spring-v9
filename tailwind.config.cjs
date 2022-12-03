const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{vue,js,ts,jsx,tsx,mdx}", "./index.html"],
  theme: {
    fontWeight: {
      normal: 400,
      // semibold: 600,
      // bold: 700,
    },
    fontFamily: {
      sans: ["Rubik", ...defaultTheme.fontFamily.sans],
    },
    extend: {
      // colors
    },
  },
  plugins: [],
};
