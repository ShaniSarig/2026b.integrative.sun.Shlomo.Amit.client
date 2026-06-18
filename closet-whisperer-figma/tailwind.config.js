/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#F5F0EB',
        elevated: '#F8F7FB',
        cream: { 50: '#FAF7F3', 100: '#F5F0EB', 200: '#EDE5DC' },
        taupe: { 300: '#C9BFB0', 500: '#A89080', 700: '#6F6353' },
        ink: {
          DEFAULT: '#1A1A1A',
          primary: '#1A1A1A',
          secondary: '#2C2C2C',
          muted: '#827F7E',
          inverse: '#FFFFFF',
        },
        border: {
          strong: '#C9BFB0',
          subtle: '#E8DED1',
        },
        brand: {
          primary: '#C9BFB0',
          accent: '#A89080',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Lato', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(26,26,26,0.04), 0 4px 16px rgba(111,99,83,0.06)',
      },
    },
  },
  plugins: [],
};
