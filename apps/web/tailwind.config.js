/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#FF6600',
          'orange-hover': '#E65C00',
          navy: '#0B0F19',
          surface: '#131B2E',
          border: '#1E293B',
          profit: '#10B981',
          loss: '#EF4444'
        }
      }
    },
  },
  plugins: [],
}

