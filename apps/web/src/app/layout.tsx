import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TradingWave — Trade Bindas | Algo Trading Platform',
  description: 'Independent, enterprise-grade algorithmic trading SaaS and no-code strategy automation.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0B0F19] text-slate-100 min-h-screen antialiased selection:bg-[#FF6600] selection:text-white">
        {children}
      </body>
    </html>
  );
}

