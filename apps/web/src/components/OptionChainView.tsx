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

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1F2937] border border-slate-200 dark:border-[#334155] shadow-sm dark:shadow-md flex flex-wrap items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-3">
          <select
            value={underlying}
            onChange={e => setUnderlying(e.target.value)}
            className="bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-[#334155] rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#FF6B00]"
          >
            <option value="NIFTY 50">NIFTY 50</option>
            <option value="BANKNIFTY">BANKNIFTY</option>
            <option value="FINNIFTY">FINNIFTY</option>
            <option value="SENSEX">SENSEX</option>
          </select>

          <select
            value={expiry}
            onChange={e => setExpiry(e.target.value)}
            className="bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-[#334155] rounded-xl px-3 py-1.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-[#FF6B00]"
          >
            <option value="28-NOV-2024">28 Nov 2024 (Weekly)</option>
            <option value="05-DEC-2024">05 Dec 2024 (Weekly)</option>
            <option value="26-DEC-2024">26 Dec 2024 (Monthly)</option>
          </select>

          <div className="text-xs">
            <span className="text-slate-500 dark:text-slate-400">Spot: </span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">24,352.40 (+112.50)</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Live WebSocket Feed · Greeks by Black-Scholes</span>
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
