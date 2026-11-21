/** @type {import('tailwindcss').Config} */
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        heading: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      colors: {
        // Semantic tokens — values live in globals.css (light + dark)
        bg: token('bg'),
        surface: token('surface'),
        subtle: token('subtle'),
        muted: token('muted'),
        border: {
          DEFAULT: token('border'),
          strong: token('border-strong'),
        },
        fg: {
          DEFAULT: token('fg'),
          secondary: token('fg-secondary'),
          muted: token('fg-muted'),
        },
        primary: {
          DEFAULT: token('primary'),
          hover: token('primary-hover'),
          soft: token('primary-soft'),
          fg: token('on-primary'),
        },
        accent: {
          DEFAULT: token('accent'),
          soft: token('accent-soft'),
          fg: token('accent-fg'),
        },
        profit: {
          DEFAULT: token('profit'),
          soft: token('profit-soft'),
        },
        loss: {
          DEFAULT: token('loss'),
          soft: token('loss-soft'),
        },
        ink: {
          DEFAULT: token('ink'),
          raised: token('ink-raised'),
          line: token('ink-line'),
          fg: token('on-ink'),
        },
      },
      fontSize: {
        '2xs': ['10.5px', { lineHeight: '14px', letterSpacing: '0.01em' }],
      },
      borderRadius: {
        DEFAULT: '6px',
      },
      boxShadow: {
        hairline: '0 0 0 1px rgb(var(--border))',
        pop: '0 1px 2px rgb(11 15 20 / 0.06), 0 8px 24px -6px rgb(11 15 20 / 0.14)',
        card: '0 1px 0 rgb(11 15 20 / 0.03)',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        'fade-up': { '0%': { opacity: 0, transform: 'translateY(4px)' }, '100%': { opacity: 1, transform: 'none' } },
        'fade-in': { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
      },
      animation: {
        'fade-up': 'fade-up 220ms cubic-bezier(0.22,1,0.36,1) both',
        'fade-in': 'fade-in 180ms ease-out both',
      },
    },
  },
  plugins: [],
};
