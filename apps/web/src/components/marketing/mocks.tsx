'use client';

import React, { useMemo } from 'react';
import { OctagonX, Search } from 'lucide-react';
import { LogoMark } from '../ui/Logo';
import { TickNumber } from '../ui/Ticker';
import { useIndexFeed, fmtINR } from '../../lib/market';

/* ---------- Payoff geometry (short straddle, NIFTY, lot 75) ---------- */
const STRIKE = 24300;
const CE = 142.35;
const PE = 138.1;
const LOT = 75;
const LO = 23700;
const HI = 24900;

const WING_CE = 38.2;
const WING_PE = 41.6;
const CREDIT = CE + PE - WING_CE - WING_PE;

/** Iron fly: short 24300 straddle, long 24600 CE and 24000 PE wings. */
function payoffAt(spot: number) {
  return (
    (CREDIT - Math.abs(spot - STRIKE) + Math.max(spot - 24600, 0) + Math.max(24000 - spot, 0)) * LOT
  );
}

export function PayoffChart({ spot, className = '', compact = false }: { spot: number; className?: string; compact?: boolean }) {
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, '');
  const W = 560;
  const H = compact ? 150 : 190;
  const padX = 8;
  const maxP = payoffAt(STRIKE);
  const minP = payoffAt(LO) * 1.6;
  const x = (s: number) => padX + ((s - LO) / (HI - LO)) * (W - padX * 2);
  const y = (p: number) => 12 + ((maxP - p) / (maxP - minP)) * (H - 30);
  const zeroY = y(0);
  const pts = [LO, 24000, STRIKE, 24600, HI].map(s => `${x(s).toFixed(1)},${y(payoffAt(s)).toFixed(1)}`);
  const be1 = STRIKE - CREDIT;
  const be2 = STRIKE + CREDIT;
  const area = `${x(LO)},${zeroY} ${pts.join(' ')} ${x(HI)},${zeroY}`;
  const pnlNow = payoffAt(spot);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={`w-full ${className}`} role="img" aria-label="Payoff at expiry for a NIFTY short straddle">
      <defs>
        <clipPath id={`a${uid}`}>
          <rect x="0" y="0" width={W} height={zeroY} />
        </clipPath>
        <clipPath id={`b${uid}`}>
          <rect x="0" y={zeroY} width={W} height={H - zeroY} />
        </clipPath>
      </defs>
      {[0.25, 0.5, 0.75].map(f => (
        <line key={f} x1={padX + f * (W - 2 * padX)} x2={padX + f * (W - 2 * padX)} y1="6" y2={H - 18} className="stroke-border" strokeWidth="1" />
      ))}
      <polygon points={area} className="fill-profit/10" clipPath={`url(#a${uid})`} />
      <polygon points={area} className="fill-loss/10" clipPath={`url(#b${uid})`} />
      <line x1={padX} x2={W - padX} y1={zeroY} y2={zeroY} className="stroke-border-strong" strokeWidth="1" />
      <polyline points={pts.join(' ')} fill="none" className="stroke-loss" strokeWidth="1.5" strokeLinejoin="round" clipPath={`url(#b${uid})`} />
      <polyline points={pts.join(' ')} fill="none" className="stroke-profit" strokeWidth="1.75" strokeLinejoin="round" clipPath={`url(#a${uid})`} />
      {/* spot marker */}
      <line x1={x(spot)} x2={x(spot)} y1="6" y2={H - 18} className="stroke-accent" strokeWidth="1" strokeDasharray="3 3" />
      <circle cx={x(spot)} cy={y(pnlNow)} r="3.5" className="fill-accent stroke-surface" strokeWidth="1.5" />
      {[LO, 24000, STRIKE, 24600, HI].map(s => (
        <text key={s} x={x(s)} y={H - 4} textAnchor={s === LO ? 'start' : s === HI ? 'end' : 'middle'} className="fill-fg-muted font-mono" fontSize="10">
          {s.toLocaleString('en-IN')}
        </text>
      ))}
      <text x={x(be1) - 4} y={zeroY - 6} textAnchor="end" className="fill-fg-muted font-mono" fontSize="10">BE {fmtINR(be1, 0)}</text>
      <text x={x(be2) + 4} y={zeroY - 6} className="fill-fg-muted font-mono" fontSize="10">BE {fmtINR(be2, 0)}</text>
    </svg>
  );
}

/* ---------- Equity curve (deterministic, illustrative) ---------- */
export function EquityCurve({ className = '', height = 160 }: { className?: string; height?: number }) {
  const W = 560;
  const H = height;
  const series = useMemo(() => {
    let v = 100;
    let seed = 7;
    const rnd = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    return Array.from({ length: 120 }, (_, i) => {
      v *= 1 + (rnd() - 0.43) * 0.022 - (i > 58 && i < 70 ? 0.006 : 0);
      return v;
    });
  }, []);
  const min = Math.min(...series);
  const max = Math.max(...series);
  const pts = series.map((v, i) => [ (i / (series.length - 1)) * W, 8 + ((max - v) / (max - min)) * (H - 16) ]);
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className={`w-full ${className}`} style={{ height }} role="img" aria-label="Illustrative backtest equity curve">
      {[0.25, 0.5, 0.75].map(f => (
        <line key={f} x1="0" x2={W} y1={H * f} y2={H * f} className="stroke-border" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      ))}
      <path d={`${d} L${W} ${H} L0 ${H} Z`} className="fill-primary/[0.07]" />
      <path d={d} fill="none" className="stroke-primary" strokeWidth="1.75" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
    </svg>
  );
}

/* ---------- Hero terminal mock ---------- */
const POSITIONS = [
  { sym: 'NIFTY 24300 CE', side: 'S', qty: -75, avg: 142.35, ltp: 118.4 },
  { sym: 'NIFTY 24300 PE', side: 'S', qty: -75, avg: 138.1, ltp: 129.85 },
  { sym: 'NIFTY 24600 CE', side: 'B', qty: 75, avg: 38.2, ltp: 29.1 },
  { sym: 'NIFTY 24000 PE', side: 'B', qty: 75, avg: 41.6, ltp: 36.75 },
];

const LOG = [
  ['09:20:00.412', 'SELL', 'NIFTY 24300 CE', '75 @ 142.35', 'FILLED'],
  ['09:20:00.418', 'SELL', 'NIFTY 24300 PE', '75 @ 138.10', 'FILLED'],
  ['09:20:00.431', 'BUY', 'NIFTY 24600 CE', '75 @ 38.20', 'FILLED'],
  ['09:20:00.436', 'BUY', 'NIFTY 24000 PE', '75 @ 41.60', 'FILLED'],
  ['11:42:15.002', 'CHECK', 'MTM stop −₹6,000', 'not hit', 'OK'],
];

export function TerminalMock() {
  const quotes = useIndexFeed(1800);
  const spot = quotes[0].price;
  const drift = (spot - 24312.65) * 0.5;
  const rows = POSITIONS.map((p, i) => {
    const sign = i % 2 === 0 ? 1 : -1;
    const ltp = Math.max(0.05, p.ltp + (p.sym.includes('CE') ? drift : -drift) * 0.02 * sign);
    const pnl = (ltp - p.avg) * p.qty;
    return { ...p, ltp, pnl };
  });
  const total = rows.reduce((a, r) => a + r.pnl, 0);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-pop">
      {/* chrome */}
      <div className="flex h-10 items-center gap-3 border-b border-border px-3">
        <LogoMark size={18} />
        <div className="flex min-w-0 items-center gap-1.5 text-[12px]">
          <span className="text-fg-muted">Deployments</span>
          <span className="text-fg-muted">/</span>
          <span className="truncate font-medium text-fg">Iron Fly · 09:20 entry</span>
        </div>
        <span className="tw-badge ml-1 hidden bg-profit-soft text-profit sm:inline-flex">
          <span className="h-1.5 w-1.5 rounded-full bg-profit" /> Live · Zerodha
        </span>
        <div className="ml-auto hidden h-6 w-48 items-center gap-1.5 rounded-md border border-border px-2 text-[11px] text-fg-muted md:flex">
          <Search className="h-3 w-3" /> Jump to… <span className="ml-auto font-mono">⌘K</span>
        </div>
        <span className="flex h-6 items-center gap-1 rounded-md border border-loss/30 px-2 text-[11px] text-loss">
          <OctagonX className="h-3 w-3" /> <span className="hidden sm:inline">Kill switch</span>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px]">
        <div className="border-border lg:border-r">
          {/* KPIs */}
          <div className="grid grid-cols-2 border-b border-border sm:grid-cols-4">
            {[
              { k: 'MTM', v: <span className={total >= 0 ? 'text-profit' : 'text-loss'}>{total >= 0 ? '+' : '−'}₹<TickNumber value={Math.abs(total)} /></span> },
              { k: 'NIFTY spot', v: <TickNumber value={spot} /> },
              { k: 'Margin used', v: <span className="font-mono">₹1,08,420</span> },
              { k: 'Net Δ', v: <span className="font-mono">{(-0.04 - drift * 0.0004).toFixed(2)}</span> },
            ].map((m, i) => (
              <div key={m.k} className={`px-4 py-3 ${i > 0 ? 'sm:border-l' : ''} ${i % 2 ? 'border-l' : ''} border-border ${i > 1 ? 'border-t sm:border-t-0' : ''}`}>
                <div className="tw-label">{m.k}</div>
                <div className="mt-1 font-mono text-[15px] font-medium text-fg">{m.v}</div>
              </div>
            ))}
          </div>
          {/* chart */}
          <div className="px-4 pb-2 pt-3">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-[12px] font-medium text-fg">Payoff at expiry</span>
              <span className="font-mono text-2xs text-fg-muted">28 NOV · 4 legs</span>
            </div>
            <PayoffChart spot={spot} />
          </div>
        </div>

        {/* Positions + log */}
        <div className="hidden flex-col sm:flex">
          <div className="border-b border-border px-4 py-2.5 text-[12px] font-medium text-fg">Positions</div>
          <table className="w-full text-[12px]">
            <thead>
              <tr className="text-left text-fg-muted">
                <th className="px-4 py-1.5 font-normal">Instrument</th>
                <th className="px-2 py-1.5 text-right font-normal">LTP</th>
                <th className="px-4 py-1.5 text-right font-normal">P&amp;L</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              {rows.map(r => (
                <tr key={r.sym} className="border-t border-border">
                  <td className="px-4 py-1.5 font-sans text-fg">
                    <span className={`mr-1.5 inline-block w-3 text-2xs font-semibold ${r.side === 'S' ? 'text-loss' : 'text-profit'}`}>{r.side}</span>
                    {r.sym.replace('NIFTY ', '')}
                  </td>
                  <td className="px-2 py-1.5 text-right text-fg-secondary">{fmtINR(r.ltp)}</td>
                  <td className={`px-4 py-1.5 text-right ${r.pnl >= 0 ? 'text-profit' : 'text-loss'}`}>
                    {r.pnl >= 0 ? '+' : '−'}{fmtINR(Math.abs(r.pnl), 0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-auto border-t border-border bg-subtle px-4 py-2.5">
            <div className="tw-label mb-1.5">Order log</div>
            <ul className="space-y-1 font-mono text-[10.5px] leading-tight">
              {LOG.map(l => (
                <li key={l[0]} className="flex gap-2 whitespace-nowrap">
                  <span className="text-fg-muted">{l[0]}</span>
                  <span className={l[1] === 'SELL' ? 'text-loss' : l[1] === 'BUY' ? 'text-profit' : 'text-fg-secondary'}>{l[1]}</span>
                  <span className="truncate text-fg-secondary">{l[2]}</span>
                  <span className="ml-auto text-fg-muted">{l[4]}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
