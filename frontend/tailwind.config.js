// c:\Users\matia\OneDrive\My GitHub\travel-planner\tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // <-- Esto es lo más importante
  ],
  theme: {
    extend: {
      colors: {
        nature: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          900: '#14532d',
        },
        ocean: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
        sand: {
          50: '#fdf8f6',
          100: '#f2e8e5',
          500: '#d6bcfa',
        }
      },
      boxShadow: {
        soft: '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        organic: '2rem',
      }
    },
  },
  plugins: [], // <-- Y esto también
}