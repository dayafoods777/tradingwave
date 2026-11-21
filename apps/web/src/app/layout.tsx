import type { Metadata, Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { THEME_INIT_SCRIPT } from '../lib/theme';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'TradingWave — Automate options strategies on NSE & BSE',
    template: '%s · TradingWave',
  },
  description:
    'Build, backtest and deploy rule-based F&O strategies for NIFTY, BANKNIFTY and SENSEX. No-code builder, option wizard, tick-level backtests and 38 Indian brokers.',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F7F6F2' },
    { media: '(prefers-color-scheme: dark)', color: '#0A0B0D' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-screen bg-bg text-fg antialiased font-sans">{children}</body>
    </html>
  );
}
