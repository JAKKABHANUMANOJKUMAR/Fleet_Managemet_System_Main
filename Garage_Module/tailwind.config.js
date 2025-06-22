/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  safelist: [
    'bg-primary-bg',
    'text-primary-text',
    'bg-secondary-bg',
    'text-accent',
    'hover:text-hover-state',
    'text-success',
    'text-error',
    'text-links',
    'border-accent/20'
  ],
  theme: {
    extend: {
      fontFamily: {
        'urbanist': ['Urbanist', 'sans-serif'],
      },
      colors: {
        // Core Colors
        'primary-bg': '#FFFFFF',
        'primary-text': '#030303',
        'accent': '#718096',
        
        // Complementary Colors
        'secondary-bg': '#F7FAFC',
        'hover-state': '#4A5568',
        'success': '#48BB78',
        'error': '#F56565',
        'links': '#4299E1',
        
        // Dark mode colors
        gray: {
          750: '#374151',
          850: '#1F2937',
          950: '#111827',
        }
      },
      fontSize: {
        'h1': ['2.5rem', { lineHeight: '1.5' }],
        'h2': ['2rem', { lineHeight: '1.5' }],
        'h3': ['1.75rem', { lineHeight: '1.5' }],
        'h4': ['1.5rem', { lineHeight: '1.5' }],
        'body': ['1rem', { lineHeight: '1.5' }],
      },
      spacing: {
        'xs': '0.25rem',
        'sm': '0.5rem',
        'md': '1rem',
        'lg': '1.5rem',
        'xl': '2rem',
      }
    },
  },
  plugins: [],
};