/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        crimson: {
          50: '#ffe5e5',
          100: '#ffcccc',
          500: '#dc143c',
          600: '#8b0000',
          700: '#6b0000',
          900: '#4a0e0e',
        },
        gold: {
          50: '#fff9e6',
          100: '#fef3cc',
          400: '#f4e5b8',
          500: '#d4af37',
          600: '#b8860b',
        },
        luxury: {
          black: '#000000',
          charcoal: '#1a1a1a',
          gray: '#2d2d2d',
          light: '#f4f4f4',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #8b0000 0%, #dc143c 100%)',
        'gradient-gold': 'linear-gradient(135deg, #d4af37 0%, #f4e5b8 100%)',
        'gradient-dark': 'linear-gradient(145deg, #1a1a1a 0%, #0f0f0f 100%)',
      },
      boxShadow: {
        luxury: '0 8px 32px rgba(0,0,0,0.4)',
        gold: '0 4px 15px rgba(212, 175, 55, 0.4)',
        crimson: '0 4px 15px rgba(139, 0, 0, 0.4)',
      },
      borderRadius: {
        luxury: '16px',
      },
    },
  },
  plugins: [],
};


