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
        },
        surface: {
          DEFAULT: '#FFFFFF',
          dark: '#1e293b', // for dark mode
        },
        bg: {
          DEFAULT: '#F7F9FC',
          dark: '#0f172a', // deep charcoal
        },
        muted: '#64748b', // Gray-blue
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
