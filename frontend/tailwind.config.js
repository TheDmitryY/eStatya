/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0a0b0d',
        surface: '#161a1e',
        'surface-hover': '#1e2228',
        border: '#2a2e35',
        'text-primary': '#f0f0f2',
        'text-muted': '#9ca3af',
        accent: '#8b5cf6',
        'accent-hover': '#a78bfa',
        'accent-green': '#22c55e',
        error: '#ef4444',
        'error-bg': 'rgba(239, 68, 68, 0.1)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};

