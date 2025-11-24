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
        // Brand colors using CSS variables for consistency
        brand: {
          primary: 'var(--color-primary)',
          'primary-hover': 'var(--color-primary-hover)',
          secondary: 'var(--color-secondary)',
          'secondary-hover': 'var(--color-secondary-hover)',
          'dark-red': '#470202', // Extracted from live site
          'pink': '#F5B6D3',     // Extracted from live site
          'cyan': '#30BBD8',     // Extracted from live site
        },
        // Turquoise (primary button color)
        turquoise: {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
        },
        // Pink (secondary button color)
        pink: {
          DEFAULT: 'var(--color-secondary)',
          hover: 'var(--color-secondary-hover)',
          light: '#F5B6D342',
        },
        // Legacy colors (keeping for backwards compatibility)
        primary: {
          DEFAULT: '#32373c',
          dark: '#000000',
        },
        aqua: {
          DEFAULT: '#30BBD8',
          light: '#80deea',
        },
        cyan: {
          DEFAULT: '#30BBD8',
          dark: '#001D46',
          light: '#30BBD870',
        },
        navy: {
          DEFAULT: '#001D46',
          dark: '#470202',
        },
        gray: {
          50: '#f9fafb',
          100: '#FFFFFF',
          200: '#A7A7A7',
          300: '#d1d5db',
          400: '#7A7A7A',
          600: '#4b5563',
          700: '#374151',
          900: '#111827',
        },
      },
      fontFamily: {
        sans: ['var(--font-lexend)', 'Arial', 'Helvetica', 'sans-serif'],
        leckerli: ['var(--font-leckerli)', 'cursive'],
        lexend: ['var(--font-lexend)', 'sans-serif'],
        'lexend-deca': ['var(--font-lexend-deca)', 'sans-serif'],
        roboto: ['var(--font-roboto)', 'sans-serif'],
        'roboto-slab': ['var(--font-roboto-slab)', 'serif'],
        lato: ['var(--font-lato)', 'sans-serif'],
        'open-sans': ['var(--font-open-sans)', 'sans-serif'],
        'ibm-plex': ['var(--font-ibm-plex)', 'sans-serif'],
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
