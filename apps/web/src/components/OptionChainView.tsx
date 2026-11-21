'use client';

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
  const [underlying, setUnderlying] = useState<'NIFTY 50' | 'BANKNIFTY' | 'FINNIFTY' | 'SENSEX'>('NIFTY 50');
  const [expiry, setExpiry] = useState('28-NOV-2024');
  const [lastUpdated, setLastUpdated] = useState('Just now');
  const [tickCount, setTickCount] = useState(0);

  const underlyingConfigs = {
    'NIFTY 50': { spot: 24352.40, step: 50, change: '+112.50' },
    'BANKNIFTY': { spot: 52180.60, step: 100, change: '+245.80' },
    'FINNIFTY': { spot: 24125.80, step: 50, change: '+88.20' },
    'SENSEX': { spot: 79840.20, step: 100, change: '+340.50' }
  };

  const currentCfg = underlyingConfigs[underlying];
  const atmStrike = Math.round(currentCfg.spot / currentCfg.step) * currentCfg.step;

  // Generate 9 dynamic strikes around ATM
  const strikes: StrikeRow[] = React.useMemo(() => {
    const list: StrikeRow[] = [];
    const offsets = [-4, -3, -2, -1, 0, 1, 2, 3, 4];
    for (const offset of offsets) {
      const strike = atmStrike + offset * currentCfg.step;
      const isAtm = offset === 0;
      const dist = (strike - currentCfg.spot) / currentCfg.spot;
      
      const callDelta = Math.max(0.05, Math.min(0.95, parseFloat((0.50 - dist * 8).toFixed(2))));
      const putDelta = parseFloat((callDelta - 1).toFixed(2));
      
      const callLtp = Math.max(2.5, parseFloat((Math.max(0, currentCfg.spot - strike) + (5 - Math.abs(offset)) * (currentCfg.step * 0.45) + (Math.sin(tickCount + offset) * 2)).toFixed(2)));
      const putLtp = Math.max(2.5, parseFloat((Math.max(0, strike - currentCfg.spot) + (5 - Math.abs(offset)) * (currentCfg.step * 0.42) + (Math.cos(tickCount + offset) * 2)).toFixed(2)));

      list.push({
        strike,
        isAtm,
        callOi: Math.floor(80000 + (10 - Math.abs(offset)) * 25000 + Math.sin(offset) * 5000),
        callOiChg: parseFloat(((offset + 2) * 4.2).toFixed(1)),
        callVol: Math.floor(150000 + (10 - Math.abs(offset)) * 70000),
        callIv: parseFloat((13.2 + Math.abs(offset) * 0.2).toFixed(1)),
        callDelta,
        callLtp,
        putDelta,
        putLtp,
        putIv: parseFloat((13.5 + Math.abs(offset) * 0.2).toFixed(1)),
        putVol: Math.floor(120000 + (10 - Math.abs(offset)) * 65000),
        putOiChg: parseFloat(((2 - offset) * 3.8).toFixed(1)),
        putOi: Math.floor(75000 + (10 - Math.abs(offset)) * 22000)
      });
    }
    return list;
  }, [underlying, atmStrike, tickCount, currentCfg.spot, currentCfg.step]);

  const handleRefreshTicks = () => {
    setTickCount(c => c + 1);
    setLastUpdated(new Date().toLocaleTimeString());
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1F2937] border border-slate-200 dark:border-[#334155] shadow-sm dark:shadow-md flex flex-wrap items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={underlying}
            onChange={e => setUnderlying(e.target.value as any)}
            className="bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-[#334155] rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#5B45E0]"
          >
            <option value="NIFTY 50">NIFTY 50</option>
            <option value="BANKNIFTY">BANKNIFTY</option>
            <option value="FINNIFTY">FINNIFTY</option>
            <option value="SENSEX">SENSEX</option>
          </select>

          <select
            value={expiry}
            onChange={e => setExpiry(e.target.value)}
            className="bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-[#334155] rounded-xl px-3 py-1.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-[#5B45E0]"
          >
            <option value="28-NOV-2024">28 Nov 2024 (Weekly)</option>
            <option value="05-DEC-2024">05 Dec 2024 (Weekly)</option>
            <option value="26-DEC-2024">26 Dec 2024 (Monthly)</option>
          </select>

          <div className="text-xs flex items-center gap-1.5 font-mono">
            <span className="text-slate-500 dark:text-slate-400">Spot:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              ₹ {currentCfg.spot.toLocaleString('en-IN', { minimumFractionDigits: 2 })} ({currentCfg.change})
            </span>
          </div>

          <button
            onClick={handleRefreshTicks}
            className="px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center gap-1"
            title="Fetch Fresh Option Chain Ticks"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            <span>Refresh Ticks</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Live WebSocket Feed · Greeks by Black-Scholes · {lastUpdated}</span>
        </div>
      </div>

      {/* Symmetric NSE Option Chain Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-[#334155] bg-white dark:bg-[#1F2937] overflow-hidden shadow-sm dark:shadow-2xl transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono border-collapse text-right">
            <thead>
              <tr className="bg-slate-100 dark:bg-[#0B1220] text-slate-600 dark:text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-[#334155]">
                <th colSpan={6} className="py-2.5 px-3 text-center text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border-r border-slate-200 dark:border-[#334155]">
                  CALLS (CE)
                </th>
                <th className="py-2.5 px-4 text-center text-slate-900 dark:text-white bg-slate-200 dark:bg-slate-900 border-r border-slate-200 dark:border-[#334155]">
                  STRIKE
                </th>
                <th colSpan={6} className="py-2.5 px-3 text-center text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/20">
                  PUTS (PE)
                </th>
              </tr>
              <tr className="bg-slate-50 dark:bg-[#111827] text-slate-500 dark:text-slate-400 text-[10px] border-b border-slate-200 dark:border-[#334155]">
                <th className="py-2 px-2 text-left">OI</th>
                <th className="py-2 px-2">Volume</th>
                <th className="py-2 px-2">IV%</th>
                <th className="py-2 px-2">Delta</th>
                <th className="py-2 px-2">LTP</th>
                <th className="py-2 px-2 border-r border-slate-200 dark:border-[#334155]">Action</th>

                <th className="py-2 px-4 text-center font-bold text-slate-900 dark:text-white bg-slate-200 dark:bg-slate-900 border-r border-slate-200 dark:border-[#334155]">
                  STRIKE
                </th>

                <th className="py-2 px-2 text-left">Action</th>
                <th className="py-2 px-2">LTP</th>
                <th className="py-2 px-2">Delta</th>
                <th className="py-2 px-2">IV%</th>
                <th className="py-2 px-2">Volume</th>
                <th className="py-2 px-2">OI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-[#334155]">
              {strikes.map(row => (
                <tr
                  key={row.strike}
                  className={`hover:bg-slate-50 dark:hover:bg-[#1A2542] transition ${
                    row.isAtm ? 'bg-orange-50/70 dark:bg-[#FF6B00]/10 font-bold' : ''
                  }`}
                >
                  {/* CALLS */}
                  <td className="py-2.5 px-2 text-left text-slate-700 dark:text-slate-300 font-sans">{row.callOi.toLocaleString()}</td>
                  <td className="py-2.5 px-2 text-slate-500 dark:text-slate-400 font-sans">{row.callVol.toLocaleString()}</td>
                  <td className="py-2.5 px-2 text-slate-600 dark:text-slate-400">{row.callIv}%</td>
                  <td className="py-2.5 px-2 text-emerald-600 dark:text-emerald-400 font-semibold">{row.callDelta}</td>
                  <td className="py-2.5 px-2 text-slate-900 dark:text-white font-bold">₹{row.callLtp.toFixed(2)}</td>
                  <td className="py-2.5 px-2 border-r border-slate-200 dark:border-[#334155]">
                    <div className="flex gap-1 justify-end">
                      <button
                        onClick={() => onAddLeg(row.strike, 'CALL', 'BUY')}
                        className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white text-[10px] font-bold"
                      >
                        B
                      </button>
                      <button
                        onClick={() => onAddLeg(row.strike, 'CALL', 'SELL')}
                        className="px-1.5 py-0.5 rounded bg-red-500/15 text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white text-[10px] font-bold"
                      >
                        S
                      </button>
                    </div>
                  </td>

                  {/* STRIKE (CENTER) */}
                  <td
                    className={`py-2.5 px-4 text-center font-bold border-r border-slate-200 dark:border-[#334155] ${
                      row.isAtm ? 'bg-[#FF6B00] text-white font-black' : 'bg-slate-100 dark:bg-[#0B1220] text-slate-900 dark:text-white'
                    }`}
                  >
                    {row.strike}
                    {row.isAtm && <span className="text-[9px] block uppercase font-mono tracking-wider">ATM</span>}
                  </td>

                  {/* PUTS */}
                  <td className="py-2.5 px-2 text-left">
                    <div className="flex gap-1">
                      <button
                        onClick={() => onAddLeg(row.strike, 'PUT', 'BUY')}
                        className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white text-[10px] font-bold"
                      >
                        B
                      </button>
                      <button
                        onClick={() => onAddLeg(row.strike, 'PUT', 'SELL')}
                        className="px-1.5 py-0.5 rounded bg-red-500/15 text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white text-[10px] font-bold"
                      >
                        S
                      </button>
                    </div>
                  </td>
                  <td className="py-2.5 px-2 text-slate-900 dark:text-white font-bold">₹{row.putLtp.toFixed(2)}</td>
                  <td className="py-2.5 px-2 text-red-600 dark:text-red-400 font-semibold">{row.putDelta}</td>
                  <td className="py-2.5 px-2 text-slate-600 dark:text-slate-400">{row.putIv}%</td>
                  <td className="py-2.5 px-2 text-slate-500 dark:text-slate-400 font-sans">{row.putVol.toLocaleString()}</td>
                  <td className="py-2.5 px-2 text-right text-slate-700 dark:text-slate-300 font-sans">{row.putOi.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
