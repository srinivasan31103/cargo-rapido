/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // CargoRapido Custom Grayscale Palette
        primary: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',  // Light Gray from palette
          400: '#C4C4C4',
          500: '#B3B3B3',  // Medium Gray from palette
          600: '#8A8A8A',
          700: '#5A5A5A',
          800: '#3A3A3A',
          900: '#2B2B2B',  // Dark Gray/Black from palette
        },
        // Quick access to palette colors
        'cr-white': '#FFFFFF',
        'cr-light': '#D4D4D4',
        'cr-medium': '#B3B3B3',
        'cr-dark': '#2B2B2B',
        // Semantic colors
        accent: {
          DEFAULT: '#2B2B2B',
          hover: '#1a1a1a',
          light: '#3A3A3A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Poppins', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'elegant': '0 4px 6px -1px rgba(43, 43, 43, 0.1), 0 2px 4px -1px rgba(43, 43, 43, 0.06)',
        'elegant-lg': '0 10px 15px -3px rgba(43, 43, 43, 0.1), 0 4px 6px -2px rgba(43, 43, 43, 0.05)',
        'elegant-xl': '0 20px 25px -5px rgba(43, 43, 43, 0.1), 0 10px 10px -5px rgba(43, 43, 43, 0.04)',
      },
      backgroundImage: {
        'gradient-elegant': 'linear-gradient(135deg, #FFFFFF 0%, #D4D4D4 50%, #B3B3B3 100%)',
        'gradient-dark': 'linear-gradient(135deg, #3A3A3A 0%, #2B2B2B 100%)',
      },
    },
  },
  plugins: [],
}
