/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#FF5A00', // Energetic Spiking Orange
          blue: '#1E3A8A',   // Deep Court Blue
          yellow: '#FBBF24', // Accent Yellow
          white: '#F8FAFC',
          dark: '#0F172A',
          gray: '#334155'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
