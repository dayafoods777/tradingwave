import React from 'react';

const WAVE = 'M6.5 12.5C8.6 12.5 9 21.5 11.25 21.5S13.9 14.5 16 14.5 18.65 21.5 20.75 21.5L25.5 9.5';

/** TradingWave mark: one continuous stroke — a wave that resolves into a rising tick. */
export function LogoMark({ size = 24, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      <rect width="32" height="32" rx="6.5" className="fill-primary" />
      <path
        d={WAVE}
        fill="none"
        className="stroke-primary-fg"
        strokeWidth="2.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Logo({ size = 22, className = '', showWord = true }: { size?: number; className?: string; showWord?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 select-none ${className}`} aria-label="TradingWave">
      <LogoMark size={size} />
      {showWord && (
        <span
          className="font-semibold text-fg tracking-[-0.03em] leading-none"
          style={{ fontSize: Math.round(size * 0.74) }}
        >
          tradingwave
        </span>
      )}
    </span>
  );
}
