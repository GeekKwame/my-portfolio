/** @type {import('tailwindcss').Config} */

/** Colors resolve to CSS variables (space-separated RGB) defined per theme in index.css. */
const themed = (name) => `rgb(var(--${name}) / <alpha-value>)`;

module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Cal Sans"', '"Inter Variable"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['"Inter Variable"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', 'monospace'],
      },
      colors: {
        paper: {
          DEFAULT: themed('paper'),
          raised: themed('paper-raised'),
          sunk: themed('paper-sunk'),
        },
        ink: {
          DEFAULT: themed('ink'),
          soft: themed('ink-soft'),
          muted: themed('ink-muted'),
          // Decorative glyphs only — fails AA as text.
          faint: themed('ink-faint'),
        },
        rule: {
          DEFAULT: themed('rule'),
          strong: themed('rule-strong'),
          dark: themed('rule-dark'),
        },
        accent: {
          DEFAULT: themed('accent'),
          strong: themed('accent-strong'),
          soft: 'rgb(var(--accent) / 0.10)',
          // For text and focus rings on ink backgrounds.
          light: themed('accent-light'),
        },
        signal: {
          DEFAULT: themed('signal'),
        },
      },
      maxWidth: {
        content: '76rem',
        prose: '40rem',
      },
      fontSize: {
        meta: ['0.8125rem', { lineHeight: '1.4' }],
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        'slide-in': 'slideIn 0.3s ease-out',
      },
    },
  },
  plugins: [],
}
