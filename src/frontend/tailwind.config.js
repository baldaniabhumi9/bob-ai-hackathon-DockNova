/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Design Tokens mapped to CSS variables for dynamic Dark/Light theme switching
        'background-base': 'var(--color-background-base, #050B14)',
        'surface-1': 'var(--color-surface-1, #0E1525)',
        'surface-2': 'var(--color-surface-2, #141D2E)',
        'surface-3': 'var(--color-surface-3, #1C2840)',
        surface: {
          1: 'var(--color-surface-1, #0E1525)',
          2: 'var(--color-surface-2, #141D2E)',
          3: 'var(--color-surface-3, #1C2840)',
        },
        border: 'var(--color-border, #243447)',
        primary: 'var(--color-primary, #38BDF8)',
        secondary: 'var(--color-secondary, #818CF8)',
        accent: 'var(--color-accent, #F472B6)',
        success: 'var(--color-success, #34D399)',
        warning: 'var(--color-warning, #FBBF24)',
        danger: 'var(--color-danger, #F87171)',
        'text-primary': 'var(--color-text-primary, #F0F4F8)',
        'text-secondary': 'var(--color-text-secondary, #94A3B8)',
        'text-muted': 'var(--color-text-muted, #64748B)',
        text: {
          primary: 'var(--color-text-primary, #F0F4F8)',
          secondary: 'var(--color-text-secondary, #94A3B8)',
          muted: 'var(--color-text-muted, #64748B)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['"Space Grotesk"', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        data: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'glow-primary': '0 0 20px -2px rgba(56, 189, 248, 0.35), 0 0 8px 0 rgba(56, 189, 248, 0.25)',
        'glow-danger': '0 0 20px -2px rgba(248, 113, 113, 0.35), 0 0 8px 0 rgba(248, 113, 113, 0.25)',
        'glow-success': '0 0 20px -2px rgba(52, 211, 153, 0.35), 0 0 8px 0 rgba(52, 211, 153, 0.25)',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-glow': {
          '0%, 100%': {
            opacity: '1',
            boxShadow: '0 0 20px -2px rgba(56, 189, 248, 0.4), 0 0 8px 0 rgba(56, 189, 248, 0.25)',
          },
          '50%': {
            opacity: '0.6',
            boxShadow: '0 0 8px -2px rgba(56, 189, 248, 0.2)',
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s linear infinite',
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        float: 'float 3s ease-in-out infinite',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #38BDF8 0%, #818CF8 100%)',
        'gradient-admin': 'linear-gradient(135deg, #818CF8 0%, #F472B6 100%)',
        'gradient-danger': 'linear-gradient(135deg, #F87171 0%, #EF4444 100%)',
        'gradient-success': 'linear-gradient(135deg, #34D399 0%, #059669 100%)',
      },
    },
  },
  plugins: [],
};
