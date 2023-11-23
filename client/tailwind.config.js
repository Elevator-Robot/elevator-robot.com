/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: [
    "./src/pages/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: false,
  theme: {
    extend: {},
  },
  plugins: [],
  extend: {
    boxShadow: {
      'glow': '0 0 5px #0f0, 0 0 25px #0f0, 0 0 50px #0f0, 0 0 100px #0f0',
    },
  },
};
