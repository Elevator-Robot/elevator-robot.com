/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,css}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#082f49',
          DEFAULT: '#1A73E8',
        },
        accent: {
          light: '#FEDD00',
          DEFAULT: '#F9A826',
          dark: '#E38A1D',
        },
        gray: {
          light: '#F5F5F5',
          DEFAULT: '#E0E0E0',
          dark: '#333333',
        },
      },
    },
  },
  plugins: [],
}
