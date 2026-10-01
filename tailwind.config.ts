import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/components/**/*.{vue,js,ts}',
    './app/layouts/**/*.vue',
    './app/pages/**/*.vue',
    './app/app.vue',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1769FF', // Primary Blue
          navy: '#0B1626',    // Deep Navy
          light: '#EEF5FF',   // Light Blue
          hover: '#0F5AE0',
          400: '#5A95FF',
          500: '#1769FF',
          600: '#0F5AE0',
          700: '#0B4BC0',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          dark: '#1e293b', // for dark mode
          alt: '#F8FAFC',
          50: '#F8FAFC',
          'dark-alt': '#243247',
          'dark-hover': '#273449',
        },
        text: {
          DEFAULT: '#0B1626',
          dark: '#FFFFFF',
          strong: '#0B1626',
          'strong-dark': '#FFFFFF',
          regular: '#334155',
          'regular-dark': '#CBD5E1',
          muted: '#64748b',
          'muted-dark': '#94A3B8',
        },
        bg: {
          DEFAULT: '#F7F9FC',
          dark: '#0f172a', // deep charcoal
        },
        muted: {
          DEFAULT: '#64748b', // Gray-blue
          dark: '#94A3B8',
        },
        success: '#10b981', // Restrained green
        warning: '#f59e0b', // Restrained amber
        danger: '#ef4444',  // Restrained red
        border: {
          light: '#e2e8f0', // Very subtle gray/blue
          dark: '#334155'
        }
      },
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
        ibm: ['"IBM Plex Sans Arabic"', 'sans-serif']
      }
    },
  },
  plugins: [],
} satisfies Config
