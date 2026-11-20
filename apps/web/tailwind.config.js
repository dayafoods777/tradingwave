/** @type {import('tailwindcss').Config} */
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
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'Menlo', 'monospace'],
      },
      colors: {
        brand: {
          orange: '#FF6B00',
          'orange-hover': '#FF8A3D',
          'deep-navy': '#0B1220',
          'slate-navy': '#1F2937',
          'light-bg': '#F5F7FA',
        },
        surface: {
          card: '#FFFFFF',
          subtle: '#F8FAFC',
          border: '#E5E7EB',
          muted: '#EEF2F7',
          inverse: '#111827',
          'dark-card': '#1F2937',
          'dark-border': '#334155',
        },
        text: {
          primary: '#0F172A',
          secondary: '#475569',
          tertiary: '#94A3B8',
          disabled: '#CBD5E1',
          inverse: '#FFFFFF',
        },
        trade: {
          buy: '#10B981',
          sell: '#EF4444',
          'buy-light': '#DCFCE7',
          'sell-light': '#FEE2E2',
        },
        accent: {
          amber: '#F59E0B',
          blue: '#3B82F6',
          purple: '#8B5CF6',
          cyan: '#06B6D4',
        },
        status: {
          success: '#22C55E',
          warning: '#F59E0B',
          info: '#3B82F6',
          error: '#DC2626',
        }
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(135deg, #FF6B00 0%, #FF8A3D 100%)',
        'dark-surface-gradient': 'linear-gradient(180deg, #0B1220 0%, #1F2937 100%)',
      }
    },
  },
  plugins: [],
}
