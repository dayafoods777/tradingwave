'use client';

import React, { useState } from 'react';
import { Play, RotateCcw, Calendar, TrendingUp, ShieldCheck, Download, BarChart2, CheckCircle2 } from 'lucide-react';

export default function BacktestView() {
  const [strategy, setStrategy] = useState('NIFTY 9:20 Intraday Short Straddle');
  const [underlying, setUnderlying] = useState('NIFTY 50');
  const [capital, setCapital] = useState('150000');
  const [slippage, setSlippage] = useState('0.5');
  const [includeCharges, setIncludeCharges] = useState(true);
  const [isRunning, setIsRunning] = useState(false);

  const [metrics, setMetrics] = useState({
    netPnl: 48650,
    roi: 32.4,
    winRate: 68.4,
    profitFactor: 2.14,
    maxDrawdown: 4200,
    maxDrawdownPct: 2.8,
    totalTrades: 38,
    winningTrades: 26,
    losingTrades: 12,
    sharpe: 2.42,
    sttCharges: 1840
  });

  const trades = [
    { id: 1, date: '2024-11-18', symbol: 'NIFTY 24350 CE/PE', entryTime: '09:20', exitTime: '15:10', entryPrice: '₹243.60', exitPrice: '₹188.20', pnl: +2770, charges: '₹98', result: 'WIN' },
    { id: 2, date: '2024-11-19', symbol: 'NIFTY 24400 CE/PE', entryTime: '09:20', exitTime: '11:45', entryPrice: '₹238.00', exitPrice: '₹262.50', pnl: -1225, charges: '₹94', result: 'LOSS' },
    { id: 3, date: '2024-11-20', symbol: 'NIFTY 24350 CE/PE', entryTime: '09:20', exitTime: '15:10', entryPrice: '₹245.50', exitPrice: '₹174.00', pnl: +3575, charges: '₹102', result: 'WIN' },
    { id: 4, date: '2024-11-21', symbol: 'NIFTY 24450 CE/PE', entryTime: '09:20', exitTime: '15:10', entryPrice: '₹252.00', exitPrice: '₹195.40', pnl: +2830, charges: '₹104', result: 'WIN' }
  ];

  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setMetrics(prev => ({
        ...prev,
        netPnl: prev.netPnl + Math.round((Math.random() - 0.2) * 5000),
        totalTrades: prev.totalTrades + 1
      }));
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-orange-50/70 via-slate-50 to-orange-50/70 dark:from-[#131B2E] dark:via-[#17223D] dark:to-[#131B2E] border border-slate-200 dark:border-[#1E293B] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#FF6600]">Quantitative Backtesting</span>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">Zero-Lookahead Event-Driven Engine</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Simulate every second tick against historical NSE tick data. Accurately accounts for bid-ask slippage, lot-size changes, and Indian regulatory charges (STT, GST, Stamp Duty).
          </p>
        </div>
        <button
          onClick={handleRun}
          disabled={isRunning}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6600] to-[#E65C00] text-white text-xs font-bold shadow-lg shadow-orange-500/20 hover:brightness-110 flex items-center gap-2 transition disabled:opacity-50"
        >
          {isRunning ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
          <span>{isRunning ? 'Simulating Ticks...' : 'Execute Backtest'}</span>
        </button>
      </div>

      {/* Configuration Grid */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-[#1E293B] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs shadow-sm dark:shadow-xl transition-colors">
        <div>
          <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Target Strategy</label>
          <select
            value={strategy}
            onChange={e => setStrategy(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#0E1526] border border-slate-200 dark:border-[#1E293B] rounded-lg px-3 py-2 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-[#FF6600]"
          >
            <option value="NIFTY 9:20 Intraday Short Straddle">NIFTY 9:20 Short Straddle</option>
            <option value="BANKNIFTY Supertrend Momentum">BANKNIFTY Supertrend</option>
            <option value="NIFTY Weekly Iron Condor">NIFTY Weekly Iron Condor</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Underlying Instrument</label>
          <select
            value={underlying}
            onChange={e => setUnderlying(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#0E1526] border border-slate-200 dark:border-[#1E293B] rounded-lg px-3 py-2 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-[#FF6600]"
          >
            <option value="NIFTY 50">NIFTY 50</option>
            <option value="BANKNIFTY">BANKNIFTY</option>
            <option value="FINNIFTY">FINNIFTY</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Capital Allocated (₹)</label>
          <input
            type="text"
            value={capital}
            onChange={e => setCapital(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#0E1526] border border-slate-200 dark:border-[#1E293B] rounded-lg px-3 py-2 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-[#FF6600]"
          />
        </div>

        <div>
          <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Slippage Tolerance (%)</label>
          <input
            type="text"
            value={slippage}
            onChange={e => setSlippage(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#0E1526] border border-slate-200 dark:border-[#1E293B] rounded-lg px-3 py-2 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-[#FF6600]"
          />
        </div>

        <div>
          <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Regulatory Deductions</label>
          <label className="flex items-center gap-2 mt-2 cursor-pointer text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={includeCharges}
              onChange={e => setIncludeCharges(e.target.checked)}
              className="accent-[#FF6600] w-4 h-4 rounded"
            />
            <span>STT + GST + Stamp Duty</span>
          </label>
        </div>
      </div>

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-[#1E293B] text-center shadow-sm dark:shadow-md transition-colors">
          <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Net P&L</div>
          <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
            +₹{metrics.netPnl.toLocaleString()}
          </div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400/80 font-bold">+{metrics.roi}% Return</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-[#1E293B] text-center shadow-sm dark:shadow-md transition-colors">
          <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Win Rate</div>
          <div className="text-xl font-black text-slate-900 dark:text-white font-mono mt-0.5">{metrics.winRate}%</div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400">{metrics.winningTrades}W · {metrics.losingTrades}L</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-[#1E293B] text-center shadow-sm dark:shadow-md transition-colors">
          <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Profit Factor</div>
          <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">{metrics.profitFactor}</div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400">Gross Win / Gross Loss</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-[#1E293B] text-center shadow-sm dark:shadow-md transition-colors">
          <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Max Drawdown</div>
          <div className="text-xl font-black text-red-600 dark:text-red-400 font-mono mt-0.5">-₹{metrics.maxDrawdown}</div>
          <div className="text-[10px] text-red-600 dark:text-red-400 font-bold">-{metrics.maxDrawdownPct}% Peak-to-Trough</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-[#1E293B] text-center shadow-sm dark:shadow-md transition-colors">
          <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Sharpe Ratio</div>
          <div className="text-xl font-black text-blue-600 dark:text-blue-400 font-mono mt-0.5">{metrics.sharpe}</div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400">Risk-Adjusted Return</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-[#1E293B] text-center shadow-sm dark:shadow-md transition-colors">
          <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">STT / Taxes Deducted</div>
          <div className="text-xl font-black text-slate-700 dark:text-slate-300 font-mono mt-0.5">₹{metrics.sttCharges}</div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400">Real net after fees</div>
        </div>
      </div>

      {/* Equity Curve SVG */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-[#1E293B] shadow-sm dark:shadow-xl transition-colors">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Cumulative Backtest Equity Curve</span>
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">38 Trades · 2024 Session</span>
        </div>

        <div className="h-44 w-full bg-slate-900 dark:bg-[#0A0D17] rounded-xl border border-slate-200 dark:border-[#1E293B] p-3 flex items-center justify-center">
          <svg width="100%" height="100%" viewBox="0 0 600 120" className="overflow-visible">
            <line x1="0" y1="100" x2="600" y2="100" stroke="#334155" strokeWidth="1" />
            <path
              d="M 10 100 Q 80 90, 150 75 T 280 60 T 400 40 T 520 25 T 590 15"
              fill="none"
              stroke="#10B981"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M 10 100 Q 80 90, 150 75 T 280 60 T 400 40 T 520 25 T 590 15 L 590 100 L 10 100 Z"
              fill="url(#equityGrad)"
              opacity="0.15"
            />
            <defs>
              <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Trade Ledger Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-[#1E293B] bg-white dark:bg-[#131B2E] overflow-hidden shadow-sm dark:shadow-xl transition-colors">
        <div className="px-5 py-3.5 bg-slate-50 dark:bg-[#0E1526] border-b border-slate-200 dark:border-[#1E293B] flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Trade-by-Trade Execution Ledger</h3>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">STT, Exchange GST & Slippage Included</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="bg-slate-100 dark:bg-[#111827] text-slate-600 dark:text-slate-400 text-left border-b border-slate-200 dark:border-[#1E293B]">
                <th className="py-2.5 px-4">Date</th>
                <th className="py-2.5 px-4">Contract</th>
                <th className="py-2.5 px-4">Entry</th>
                <th className="py-2.5 px-4">Exit</th>
                <th className="py-2.5 px-4">Entry Px</th>
                <th className="py-2.5 px-4">Exit Px</th>
                <th className="py-2.5 px-4">Charges</th>
                <th className="py-2.5 px-4 text-right">Net P&L</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-[#1E293B]">
              {trades.map(t => (
                <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-[#1A2542] transition">
                  <td className="py-2.5 px-4 text-slate-700 dark:text-slate-300 font-sans">{t.date}</td>
                  <td className="py-2.5 px-4 text-slate-900 dark:text-white font-bold">{t.symbol}</td>
                  <td className="py-2.5 px-4 text-slate-500 dark:text-slate-400">{t.entryTime}</td>
                  <td className="py-2.5 px-4 text-slate-500 dark:text-slate-400">{t.exitTime}</td>
                  <td className="py-2.5 px-4 text-slate-700 dark:text-slate-300">{t.entryPrice}</td>
                  <td className="py-2.5 px-4 text-slate-700 dark:text-slate-300">{t.exitPrice}</td>
                  <td className="py-2.5 px-4 text-slate-500 dark:text-slate-400">{t.charges}</td>
                  <td className={`py-2.5 px-4 text-right font-bold ${t.pnl >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                    {t.pnl >= 0 ? `+₹${t.pnl}` : `-₹${Math.abs(t.pnl)}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
