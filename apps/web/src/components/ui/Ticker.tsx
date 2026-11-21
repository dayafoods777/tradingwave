'use client';

import React, { useEffect, useRef, useState } from 'react';
import { fmtINR } from '../../lib/market';

/** Number that briefly tints profit/loss when it changes. */
export function TickNumber({ value, digits = 2, className = '' }: { value: number; digits?: number; className?: string }) {
  const prev = useRef(value);
  const [dir, setDir] = useState<'' | 'tick-up' | 'tick-down'>('');
  useEffect(() => {
    if (value !== prev.current) {
      setDir(value > prev.current ? 'tick-up' : 'tick-down');
      prev.current = value;
      const t = setTimeout(() => setDir(''), 650);
      return () => clearTimeout(t);
    }
  }, [value]);
  return <span className={`font-mono tnum ${dir} ${className}`}>{fmtINR(value, digits)}</span>;
}

export function ChangeText({ change, prev, className = '' }: { change: number; prev: number; className?: string }) {
  const pct = (change / prev) * 100;
  const up = change >= 0;
  return (
    <span className={`font-mono tnum ${up ? 'text-profit' : 'text-loss'} ${className}`}>
      {up ? '+' : '−'}{fmtINR(Math.abs(change))} ({up ? '+' : '−'}{Math.abs(pct).toFixed(2)}%)
    </span>
  );
}
