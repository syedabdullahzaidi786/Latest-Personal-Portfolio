/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#000000',
        foreground: '#ffffff',
        accent: '#3b82f6',
        'accent-soft': 'rgba(59, 130, 246, 0.15)',
        'accent-subtle': 'rgba(59, 130, 246, 0.06)',
        surface: {
          base: '#000000',
          raised: '#08080c',
          overlay: '#0f0f16',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        'caption': ['0.75rem', { lineHeight: '1rem' }],
        'body-sm': ['0.8125rem', { lineHeight: '1.25rem' }],
        'body': ['0.9375rem', { lineHeight: '1.5rem' }],
        'lead': ['1.0625rem', { lineHeight: '1.625rem' }],
      },
      maxWidth: {
        content: '1200px',
        'content-wide': '1400px',
      },
    },
  },
  plugins: [],
}
