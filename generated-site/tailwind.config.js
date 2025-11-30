/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Exact brand colors from original site
        'brand-cyan': '#30BBD8',
        'brand-teal': '#4DD0E1',
        'brand-teal-dark': '#00ACC1',
        'brand-teal-darker': '#0097A7',
        'brand-pink': '#F5B6D3',
        'brand-dark': '#263238',
      },
      fontFamily: {
        'leckerli': ['"Leckerli One"', 'cursive'],
        'lexend': ['"Lexend Deca"', 'sans-serif'],
        'montserrat': ['"Montserrat"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}