/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00FFE7',
          dark: '#00CCBA',
          light: '#33FFED',
        },
        accent: {
          DEFAULT: '#8B5CF6',
          dark: '#7C3AED',
          light: '#A78BFA',
        },
        surface: {
          DEFAULT: '#0A0F1C',
          light: '#141B2D',
          dark: '#05070E',
        },
        border: {
          DEFAULT: '#1B2333',
          light: '#2A3347',
          dark: '#0F1420',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}