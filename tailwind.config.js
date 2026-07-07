/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Engineer-grade palette. One deliberate accent (cyan), one supporting
        // (indigo). Everything else is neutral slate so hardware, plots, and
        // photography read as the subject — not the chrome.
        brand: {
          50:  '#e6fbff',
          100: '#c7f2ff',
          200: '#8ee4fb',
          300: '#57d3f2',
          400: '#22bfe0',
          500: '#0aa5c7',   // primary accent
          600: '#0b86a3',
          700: '#0e6a82',
          800: '#124f61',
          900: '#0f3745',
        },
        accent: {
          400: '#818cf8',
          500: '#6366f1',   // supporting accent (used sparingly)
          600: '#4f46e5',
        },
        surface: {
          0:   '#05070d',   // deepest bg
          1:   '#0a0f1a',   // page bg
          2:   '#0f1523',   // card bg
          3:   '#141b2c',   // elevated bg
        },
        line: {
          soft:   'rgba(255,255,255,0.06)',
          DEFAULT:'rgba(255,255,255,0.10)',
          strong: 'rgba(255,255,255,0.16)',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card':      '0 1px 0 rgba(255,255,255,0.04) inset, 0 20px 40px -20px rgba(0,0,0,0.6)',
        'card-hover':'0 1px 0 rgba(255,255,255,0.06) inset, 0 24px 60px -20px rgba(10,165,199,0.25)',
        'ring-brand':'0 0 0 1px rgba(34,191,224,0.35), 0 0 24px rgba(34,191,224,0.15)',
      },
    },
  },
  plugins: [],
}
