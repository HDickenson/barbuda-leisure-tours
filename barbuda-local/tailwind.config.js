/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#32373c',
          dark: '#000000',
        },
        gray: {
          50: '#f9fafb',
          300: '#d1d5db',
          600: '#4b5563',
          700: '#374151',
          900: '#111827',
        },
      },
      fontSize: {
        'xs': '0.8125rem',    // 13px
        'base': '1rem',       // 16px
        'lg': '1.25rem',      // 20px
        '4xl': '2.25rem',     // 36px
        '5xl': '2.625rem',    // 42px
      },
      spacing: {
        'gap': '1.5rem',      // 24px - --wp--style--block-gap
      },
      maxWidth: {
        'constrained': '1200px',
        'content': '800px',
      },
    },
  },
  plugins: [],
}
