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
          dark: '#0A66C2',
          alt: '#e4e4e7',
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
