/** @type {import('tailwindcss').Config} */
const { fontFamily } = require("tailwindcss/defaultTheme");
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      poppins: ["Poppins", ...fontFamily.sans],
      oswald: ["Oswald", ...fontFamily.sans],
    },
    extend: {},
  },
  plugins: [],
};
