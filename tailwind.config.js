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
          light: '#0A66C2',
          DEFAULT: '#0A66C2',
          dark: '#042F2E',
        },
        secondary: {
          light: '#E4E4E7',
          DEFAULT: '#E1E1E1',
          dark: '#7C7C8B',
        },
        accent: {
          light: '#FFFFFF',
          DEFAULT: '#727272',
          dark: '#000000',
        },
        gray: {
          light: '#F5F5F5',
          DEFAULT: '#E0E0E0',
          dark: '#333333',
        },
        blue: {
          light: '#E3F2FD',
          DEFAULT: '#2196F3',
          dark: '#0D47A1',
        },
      },
    },
  },
  plugins: [],
}
