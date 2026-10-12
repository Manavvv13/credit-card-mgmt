/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#060B08',
          900: '#0A130E',
          850: '#0E1B15',
          800: '#12241C',
          700: '#1A3326',
          600: '#234735',
          500: '#34634C',
        },
        emerald: {
          glow: '#00DF81',
          accent: '#10B981',
          dark: '#051C12',
        },
        fintech: {
          50: '#F4F9F1',
          100: '#E7F5E0',
          200: '#D1EBC2',
          300: '#B0DD98',
          400: '#00DF81',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#0A130E',
          950: '#060B08',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'emerald-glow': '0 0 35px -5px rgba(0, 223, 129, 0.3)',
        'card-glow': '0 15px 35px -10px rgba(0, 0, 0, 0.6), 0 0 20px -5px rgba(0, 223, 129, 0.08)',
        'subtle-dark': '0 10px 30px -5px rgba(0, 0, 0, 0.4)',
      }
    },
  },
  plugins: [],
}
