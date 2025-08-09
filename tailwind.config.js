/** @type {import('tailwindcss').Config} */
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,css}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#3B82F6', // Bright blue
          DEFAULT: '#1E40AF', // Deep blue
          dark: '#1E3A8A', // Darker blue
        },
        secondary: {
          light: '#E0F2FE', // Very light cyan
          DEFAULT: '#0891B2', // Cyan
          dark: '#164E63', // Dark cyan
        },
        accent: {
          light: '#F0F9FF', // Almost white with blue tint
          DEFAULT: '#0EA5E9', // Sky blue
          dark: '#0C4A6E', // Dark sky blue
        },
        gray: {
          light: '#F8FAFC',
          DEFAULT: '#64748B',
          dark: '#1E293B',
        },
        blue: {
          light: '#DBEAFE', // Light blue
          DEFAULT: '#3B82F6', // Blue
          dark: '#1D4ED8', // Dark blue
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'blue-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'ocean-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        'sky-gradient': 'linear-gradient(135deg, #74b9ff 0%, #0984e3 50%, #74b9ff 100%)',
      },
    },
  },
  plugins: [],
}
