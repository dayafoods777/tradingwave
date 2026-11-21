'use client';

import { useEffect, useRef, useState } from 'react';

export interface IndexQuote {
  symbol: string;
  price: number;
  change: number; // absolute
  prev: number;
}

const BASE: IndexQuote[] = [
  { symbol: 'NIFTY 50', price: 24_312.65, change: 0, prev: 24_198.4 },
  { symbol: 'BANKNIFTY', price: 52_184.3, change: 0, prev: 51_920.15 },
  { symbol: 'FINNIFTY', price: 23_871.9, change: 0, prev: 23_902.55 },
  { symbol: 'SENSEX', price: 80_116.45, change: 0, prev: 79_802.1 },
  { symbol: 'MIDCPNIFTY', price: 12_640.2, change: 0, prev: 12_598.75 },
  { symbol: 'INDIA VIX', price: 13.42, change: 0, prev: 13.88 },
];

/** Simulated index feed for previews — small random walk, deterministic start. */
export function useIndexFeed(intervalMs = 2200) {
  const [quotes, setQuotes] = useState<IndexQuote[]>(() =>
    BASE.map(q => ({ ...q, change: q.price - q.prev }))
  );
  const reduce = useRef(false);
  useEffect(() => {
    reduce.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const id = setInterval(() => {
      setQuotes(prev =>
        prev.map(q => {
          const step = q.price * (Math.random() - 0.5) * 0.0006;
          const price = Math.round((q.price + step) * 100) / 100;
          return { ...q, price, change: price - q.prev };
        })
      );
    }, reduce.current ? intervalMs * 3 : intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return quotes;
}

export const fmtINR = (n: number, digits = 2) =>
  n.toLocaleString('en-IN', { minimumFractionDigits: digits, maximumFractionDigits: digits });

export const fmtPct = (n: number) => `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`;

/** NSE cash/F&O session: 09:15–15:30 IST, Mon–Fri (holidays not modelled). */
export function getMarketStatus(now = new Date()): { open: boolean; label: string } {
  const ist = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  const day = ist.getDay();
  const mins = ist.getHours() * 60 + ist.getMinutes();
  if (day === 0 || day === 6) return { open: false, label: 'Market closed' };
  if (mins >= 555 && mins < 930) return { open: true, label: 'Market open' };
  if (mins >= 540 && mins < 555) return { open: false, label: 'Pre-open' };
  return { open: false, label: 'Market closed' };
}
