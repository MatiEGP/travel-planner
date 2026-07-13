// c:\Users\matia\OneDrive\My GitHub\travel-planner\tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // <-- Esto es lo más importante
  ],
  theme: {
    extend: {}, // <-- Es normal que esto esté vacío
  },
  plugins: [], // <-- Y esto también
}