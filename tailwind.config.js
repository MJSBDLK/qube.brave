/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Your existing color palette
        indigo: {
          100: '#e8e9f3',
          300: '#b4b8db', 
          500: '#6b73a3',
          700: '#4a5178',
          900: '#2d3251',
        },
        teal: {
          100: '#e0f2f1',
          300: '#a5d6d0',
          500: '#5a9b94', 
          700: '#3d6b66',
          900: '#254240',
        },
        sky: {
          100: '#e3f2fd',
          300: '#a8d4f0',
          500: '#5ba3d4',
          700: '#3c7099', 
          900: '#24455f',
        },
        magenta: {
          100: '#f3e5f5',
          300: '#d4a8da',
          500: '#a366a8',
          700: '#734575',
          900: '#462a48',
        },
        jungle: {
          100: '#e8f5e8',
          300: '#b8d4b8', 
          500: '#6b9b6b',
          700: '#4a6b4a',
          900: '#2d4a2d',
        },
        charcoal: {
          50: '#f8f9fa',
          100: '#e9ecef',
          200: '#dee2e6', 
          300: '#ced4da',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#0a0e1a',
        },
        gold: {
          100: '#fef3e2',
          300: '#f6d186',
          500: '#d4af37',
          700: '#b8941f', 
          900: '#8b6914',
        },
        silver: {
          100: '#f1f5f9',
          300: '#cbd5e1',
          500: '#94a3b8',
          700: '#64748b',
          900: '#334155',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'monospace'],
      },
      spacing: {
        'xs': '0.25rem',
        'sm': '0.5rem', 
        'md': '1rem',
        'lg': '1.5rem',
        'xl': '2rem',
        '2xl': '3rem',
        '3xl': '4rem',
      }
    },
  },
  plugins: [],
}