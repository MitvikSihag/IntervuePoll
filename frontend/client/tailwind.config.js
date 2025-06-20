/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#7765DA",
          DEFAULT: "#5767D0",
          dark: "#4F0DCE",
        },
        grayish: {
          light: "#F2F2F2",
          DEFAULT: "#6E6E6E",
          dark: "#373737",
        },
      },
    },
  },
  plugins: [],
};
