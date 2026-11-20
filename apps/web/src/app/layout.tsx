import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TradingWave — Trade Bindas | Algo Trading Platform',
  description: 'Independent, enterprise-grade algorithmic trading SaaS and no-code strategy automation.',
  icons: {
    icon: '/logo-icon.png',
    apple: '/logo-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#F5F7FA] dark:bg-[#0B1220] text-[#0F172A] dark:text-[#F8FAFC] min-h-screen antialiased selection:bg-[#FF6B00] selection:text-white transition-colors duration-200 font-sans">
        {children}
      </body>
    </html>
  );
}
