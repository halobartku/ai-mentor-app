/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#007AFF',
          dark: '#0051A8'
        },
        background: {
          DEFAULT: '#FFFFFF',
          dark: '#000000'
        },
        surface: {
          DEFAULT: '#F2F2F7',
          dark: '#1C1C1E'
        },
        text: {
          DEFAULT: '#000000',
          dark: '#FFFFFF'
        },
        border: {
          DEFAULT: '#C6C6C8',
          dark: '#38383A'
        },
        success: '#34C759',
        warning: '#FF9500',
        error: '#FF3B30',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Inter', 'sans-serif'],
      },
      spacing: {
        '4.5': '1.125rem',
      },
    },
  },
  plugins: [],
}