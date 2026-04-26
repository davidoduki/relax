/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        crimson: {
          900: '#4A0A0A',
          800: '#6B1111',
          700: '#8B1A1A',
          600: '#A82222',
          500: '#C52D2D',
        },
        gold: {
          900: '#5C4308',
          800: '#8A6410',
          700: '#B08A1A',
          600: '#C9A227',
          500: '#E0BC3F',
          400: '#EDD068',
          300: '#F5E499',
        },
        navy: {
          950: '#060D16',
          900: '#0D1B2A',
          800: '#152233',
          700: '#1E3045',
          600: '#284060',
        },
        ivory: {
          50: '#FDFAF4',
          100: '#F5ECD7',
          200: '#EDD9B3',
          300: '#E0C48A',
        },
      },
      fontFamily: {
        cormorant: ['Cormorant Garamond', 'Georgia', 'serif'],
        vazirmatn: ['Vazirmatn', 'Arial', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'wave': 'wave 1.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGold: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        wave: {
          '0%, 100%': { transform: 'scaleY(1)' },
          '50%': { transform: 'scaleY(2)' },
        },
      },
    },
  },
  plugins: [],
};
