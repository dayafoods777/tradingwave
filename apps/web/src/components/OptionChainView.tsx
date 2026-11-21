'use client';

import PageHeader from './ui/PageHeader';
import React, { useState } from 'react';
import { RefreshCw, Filter, Layers, ArrowUpRight } from 'lucide-react';

interface StrikeRow {
  callOi: number;
  callOiChg: number;
  callVol: number;
  callIv: number;
  callLtp: number;
  callDelta: number;
  strike: number;
  putDelta: number;
  putLtp: number;
  putIv: number;
  putVol: number;
  putOiChg: number;
  putOi: number;
  isAtm?: boolean;
}

export default function OptionChainView({ onAddLeg }: { onAddLeg: (strike: number, type: 'CALL' | 'PUT', action: 'BUY' | 'SELL') => void }) {
  const [underlying, setUnderlying] = useState('NIFTY 50');
  const [expiry, setExpiry] = useState('28-NOV-2024');
  const [spotPrice, setSpotPrice] = useState(24350);

  const strikes: StrikeRow[] = [
    { callOi: 42100, callOiChg: 12.4, callVol: 182000, callIv: 13.8, callLtp: 312.40, callDelta: 0.78, strike: 24150, putDelta: -0.22, putLtp: 42.10, putIv: 14.1, putVol: 98000, putOiChg: -4.2, putOi: 92400 },
    { callOi: 68500, callOiChg: 8.5, callVol: 245000, callIv: 13.6, callLtp: 248.80, callDelta: 0.71, strike: 24200, putDelta: -0.29, putLtp: 58.40, putIv: 13.9, putVol: 142000, putOiChg: 2.5, putOi: 115000 },
    { callOi: 89400, callOiChg: 15.2, callVol: 310000, callIv: 13.5, callLtp: 194.20, callDelta: 0.62, strike: 24250, putDelta: -0.38, putLtp: 79.50, putIv: 13.7, putVol: 195000, putOiChg: 8.1, putOi: 134000 },
    { callOi: 142000, callOiChg: 22.0, callVol: 520000, callIv: 13.4, callLtp: 152.00, callDelta: 0.54, strike: 24300, putDelta: -0.46, putLtp: 104.20, putIv: 13.6, putVol: 340000, putOiChg: 14.8, putOi: 168000 },
    { callOi: 198000, callOiChg: 31.4, callVol: 890000, callIv: 13.2, callLtp: 125.40, callDelta: 0.50, strike: 24350, putDelta: -0.50, putLtp: 118.20, putIv: 13.5, putVol: 820000, putOiChg: 28.5, putOi: 215000, isAtm: true },
    { callOi: 245000, callOiChg: 28.9, callVol: 780000, callIv: 13.3, callLtp: 88.60, callDelta: 0.42, strike: 24400, putDelta: -0.58, putLtp: 148.50, putIv: 13.7, putVol: 410000, putOiChg: 11.2, putOi: 148000 },
    { callOi: 182000, callOiChg: 14.5, callVol: 490000, callIv: 13.5, callLtp: 62.40, callDelta: 0.33, strike: 24450, putDelta: -0.67, putLtp: 192.10, putIv: 13.8, putVol: 280000, putOiChg: 5.4, putOi: 98000 },
    { callOi: 310000, callOiChg: 45.2, callVol: 920000, callIv: 13.7, callLtp: 44.50, callDelta: 0.25, strike: 24500, putDelta: -0.75, putLtp: 245.00, putIv: 14.0, putVol: 180000, putOiChg: -2.1, putOi: 82000 },
    { callOi: 145000, callOiChg: 9.8, callVol: 310000, callIv: 14.0, callLtp: 28.20, callDelta: 0.18, strike: 24550, putDelta: -0.82, putLtp: 308.20, putIv: 14.2, putVol: 95000, putOiChg: -6.4, putOi: 64000 }
  ];

  const maxOi = Math.max(...strikes.flatMap(r => [r.callOi, r.putOi]));
  const pcr = strikes.reduce((a, r) => a + r.putOi, 0) / strikes.reduce((a, r) => a + r.callOi, 0);
  const fmt = (n: number) => n.toLocaleString('en-IN');

  const LegButtons = ({ strike, type }: { strike: number; type: 'CALL' | 'PUT' }) => (
    <div className={`flex gap-1 ${type === 'CALL' ? 'justify-end' : ''}`}>
      <button
        onClick={() => onAddLeg(strike, type, 'BUY')}
        className="h-5 w-5 rounded border border-profit/30 text-[10px] font-semibold text-profit transition-colors hover:bg-profit hover:text-white"
        aria-label={`Buy ${strike} ${type === 'CALL' ? 'CE' : 'PE'}`}
      >
        B
      </button>
      <button
        onClick={() => onAddLeg(strike, type, 'SELL')}
        className="h-5 w-5 rounded border border-loss/30 text-[10px] font-semibold text-loss transition-colors hover:bg-loss hover:text-white"
        aria-label={`Sell ${strike} ${type === 'CALL' ? 'CE' : 'PE'}`}
      >
        S
      </button>
    </div>
  );

  const OiCell = ({ value, side }: { value: number; side: 'call' | 'put' }) => (
    <td className={`relative px-3 py-2 ${side === 'call' ? 'text-left' : 'text-right'}`}>
      <span
        className={`absolute inset-y-1.5 ${side === 'call' ? 'left-0 rounded-r-sm bg-profit/10' : 'right-0 rounded-l-sm bg-loss/10'}`}
        style={{ width: `${(value / maxOi) * 100}%` }}
      />
      <span className="relative text-fg-secondary">{fmt(value)}</span>
    </td>
  );

  return (
    <div className="space-y-5 pb-8">
      <PageHeader
        title="Option chain"
        description="Strikes around the money with OI, IV and delta. Add a leg to the builder straight from the chain."
        actions={
          <>
            <select value={underlying} onChange={e => setUnderlying(e.target.value)} className="tw-input w-auto font-medium" aria-label="Underlying">
              <option value="NIFTY 50">NIFTY 50</option>
              <option value="BANKNIFTY">BANKNIFTY</option>
              <option value="FINNIFTY">FINNIFTY</option>
              <option value="SENSEX">SENSEX</option>
            </select>
            <select value={expiry} onChange={e => setExpiry(e.target.value)} className="tw-input w-auto" aria-label="Expiry">
              <option value="28-NOV-2024">28 Nov · weekly</option>
              <option value="05-DEC-2024">05 Dec · weekly</option>
              <option value="26-DEC-2024">26 Dec · monthly</option>
            </select>
            <button className="tw-btn-secondary h-8 w-8 px-0" aria-label="Refresh"><RefreshCw className="h-3.5 w-3.5" /></button>
          </>
        }
      />

      <div className="grid grid-cols-2 overflow-hidden rounded-lg border border-border bg-surface sm:grid-cols-4">
        {[
          ['Spot', <span key="s" className="text-fg">{fmt(24352.4)}<span className="ml-1.5 text-[12px] text-profit">+112.50</span></span>],
          ['ATM strike', <span key="a">{fmt(spotPrice)}</span>],
          ['PCR (OI)', <span key="p">{pcr.toFixed(2)}</span>],
          ['Feed', <span key="f" className="flex items-center gap-1.5 font-sans text-[13px] text-fg-secondary"><span className="h-1.5 w-1.5 rounded-full bg-profit" /> Live · Black-Scholes</span>],
        ].map(([k, v], i) => (
          <div key={k as string} className={`px-4 py-3 ${i % 2 ? 'border-l' : ''} ${i > 1 ? 'border-t sm:border-l sm:border-t-0' : ''} border-border`}>
            <div className="tw-label">{k}</div>
            <div className="mt-1 font-mono tnum text-[16px] font-medium text-fg">{v}</div>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] border-collapse font-mono tnum text-[12.5px]">
            <thead>
              <tr className="border-b border-border text-[11px]">
                <th colSpan={6} className="px-3 py-2 text-left font-sans font-medium text-fg-secondary">
                  <span className="mr-1.5 inline-block h-2 w-2 rounded-sm bg-profit/60" />Calls
                </th>
                <th className="border-x border-border px-3 py-2 font-sans font-medium text-fg">{expiry.slice(0, 6).replace('-', ' ')}</th>
                <th colSpan={6} className="px-3 py-2 text-right font-sans font-medium text-fg-secondary">
                  Puts<span className="ml-1.5 inline-block h-2 w-2 rounded-sm bg-loss/60" />
                </th>
              </tr>
              <tr className="border-b border-border bg-subtle font-sans text-[11px] text-fg-muted">
                <th className="px-3 py-1.5 text-left font-medium">OI</th>
                <th className="px-3 py-1.5 text-right font-medium">Volume</th>
                <th className="px-3 py-1.5 text-right font-medium">IV</th>
                <th className="px-3 py-1.5 text-right font-medium">Δ</th>
                <th className="px-3 py-1.5 text-right font-medium">LTP</th>
                <th className="px-3 py-1.5 font-medium" />
                <th className="border-x border-border px-3 py-1.5 text-center font-medium">Strike</th>
                <th className="px-3 py-1.5 font-medium" />
                <th className="px-3 py-1.5 text-right font-medium">LTP</th>
                <th className="px-3 py-1.5 text-right font-medium">Δ</th>
                <th className="px-3 py-1.5 text-right font-medium">IV</th>
                <th className="px-3 py-1.5 text-right font-medium">Volume</th>
                <th className="px-3 py-1.5 text-right font-medium">OI</th>
              </tr>
            </thead>
            <tbody>
              {strikes.map(row => {
                const callItm = row.strike < spotPrice;
                const putItm = row.strike > spotPrice;
                return (
                  <tr key={row.strike} className={`group border-b border-border last:border-0 transition-colors hover:bg-subtle ${row.isAtm ? 'bg-accent-soft/50' : ''}`}>
                    <OiCell value={row.callOi} side="call" />
                    <td className={`px-3 py-2 text-right text-fg-muted ${callItm ? 'bg-subtle/70' : ''}`}>{fmt(row.callVol)}</td>
                    <td className={`px-3 py-2 text-right text-fg-secondary ${callItm ? 'bg-subtle/70' : ''}`}>{row.callIv.toFixed(1)}</td>
                    <td className={`px-3 py-2 text-right text-fg-secondary ${callItm ? 'bg-subtle/70' : ''}`}>{row.callDelta.toFixed(2)}</td>
                    <td className={`px-3 py-2 text-right font-medium text-fg ${callItm ? 'bg-subtle/70' : ''}`}>{row.callLtp.toFixed(2)}</td>
                    <td className={`px-2 py-2 ${callItm ? 'bg-subtle/70' : ''}`}><LegButtons strike={row.strike} type="CALL" /></td>
                    <td className={`relative border-x border-border px-4 py-2 text-center font-medium ${row.isAtm ? 'text-fg' : 'text-fg-secondary'}`}>
                      {row.isAtm && <span className="absolute inset-y-0 left-0 w-[2px] bg-accent" />}
                      {fmt(row.strike)}
                      {row.isAtm && <span className="ml-1.5 align-middle font-sans text-[9.5px] font-semibold uppercase tracking-wider text-accent-fg">ATM</span>}
                    </td>
                    <td className={`px-2 py-2 ${putItm ? 'bg-subtle/70' : ''}`}><LegButtons strike={row.strike} type="PUT" /></td>
                    <td className={`px-3 py-2 text-right font-medium text-fg ${putItm ? 'bg-subtle/70' : ''}`}>{row.putLtp.toFixed(2)}</td>
                    <td className={`px-3 py-2 text-right text-fg-secondary ${putItm ? 'bg-subtle/70' : ''}`}>{row.putDelta.toFixed(2)}</td>
                    <td className={`px-3 py-2 text-right text-fg-secondary ${putItm ? 'bg-subtle/70' : ''}`}>{row.putIv.toFixed(1)}</td>
                    <td className={`px-3 py-2 text-right text-fg-muted ${putItm ? 'bg-subtle/70' : ''}`}>{fmt(row.putVol)}</td>
                    <OiCell value={row.putOi} side="put" />
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-4 py-2 text-[11.5px] text-fg-muted">
          <span>Shaded cells are in the money. Bars show open interest relative to the largest strike.</span>
          <span className="font-mono">Lot size 75 · Prices in ₹</span>
        </div>
      </div>
    </div>
  );
}
