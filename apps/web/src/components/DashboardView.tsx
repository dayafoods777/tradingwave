'use client';

import React, { useState } from 'react';
import {
  CreditCard,
  TrendingUp,
  TrendingDown,
  Layers,
  Megaphone,
  Maximize2,
  ChevronDown,
  Search,
  Filter,
  MoreVertical,
  Pause,
  Play,
  X,
  Copy,
  Check,
  RotateCcw,
  ShieldCheck,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  LineChart,
  List,
  Bell,
  Scale,
  FileSpreadsheet,
  Activity
} from 'lucide-react';

export interface BotDeployment {
  id: string;
  name: string;
  underlying: string;
  status: 'ACTIVE' | 'PAUSED' | 'SQUARED_OFF';
  mode: 'LIVE_AUTO' | 'LIVE_OFFLINE' | 'PAPER';
  broker: string;
  multiplier: number;
  dailyPnl: number;
  capital: number;
  legs: string[];
  lastCheck: string;
  frequency: string;
  sid?: string;
  author?: string;
  statusLabel?: string;
  openPositionsCount?: number;
  totalPositionsCount?: number;
  pnlPercent?: number;
  runCount?: number;
}

interface DashboardViewProps {
  bots: BotDeployment[];
  connectedBrokersCount?: number;
  onToggleBot: (id: string) => void;
  onSquareOffBot: (id: string) => void;
  onOpenLogs: (botName: string) => void;
  onNavigateTab: (tab: any) => void;
}

// Default initial deployment from Tradetron screenshot
const DEFAULT_TRADETRON_DEPLOYMENT: BotDeployment = {
  id: 'bot_nifty_ohol_01',
  name: 'TradingWave Nifty OHOL 3M',
  underlying: 'NIFTY 50',
  status: 'ACTIVE',
  mode: 'PAPER',
  broker: 'TT Paper Trading',
  multiplier: 1,
  dailyPnl: -935080,
  capital: 100000,
  legs: ['SELL 1x ATM CE', 'SELL 1x ATM PE'],
  lastCheck: 'Just now',
  frequency: 'Continuous',
  sid: '30844042',
  author: 'algobulls',
  statusLabel: 'Live-Entered',
  openPositionsCount: 0,
  totalPositionsCount: 126,
  pnlPercent: -935.08,
  runCount: 5
};

export default function DashboardView({
  bots,
  connectedBrokersCount = 0,
  onToggleBot,
  onSquareOffBot,
  onOpenLogs,
  onNavigateTab
}: DashboardViewProps) {
  // Combine passed bots with default screenshot bot if bots is empty or append
  const [localBots, setLocalBots] = useState<BotDeployment[]>([
    DEFAULT_TRADETRON_DEPLOYMENT,
    ...bots.filter(b => b.name !== DEFAULT_TRADETRON_DEPLOYMENT.name)
  ]);

  // Keep synced with parent bots
  React.useEffect(() => {
    if (bots.length > 0) {
      setLocalBots(prev => {
        const custom = bots.filter(b => b.id !== DEFAULT_TRADETRON_DEPLOYMENT.id);
        return [DEFAULT_TRADETRON_DEPLOYMENT, ...custom];
      });
    }
  }, [bots]);

  const [activeFilterPill, setActiveFilterPill] = useState<'All' | 'Deployed' | 'Archived' | 'Shared'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBotIds, setSelectedBotIds] = useState<string[]>([]);
  const [consoleTab, setConsoleTab] = useState<'market_watch' | 'open_positions' | 'greeks' | 'order_book' | 'notifications' | 'tally_orders'>('tally_orders');

  const handleToggleLocal = (id: string) => {
    setLocalBots(prev =>
      prev.map(b => (b.id === id ? { ...b, status: b.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE' } : b))
    );
    onToggleBot(id);
  };

  const handleSquareOffLocal = (id: string) => {
    setLocalBots(prev =>
      prev.map(b => (b.id === id ? { ...b, status: 'SQUARED_OFF' } : b))
    );
    onSquareOffBot(id);
  };

  const filteredBots = localBots.filter(b => {
    if (activeFilterPill === 'Deployed') return b.status === 'ACTIVE';
    if (activeFilterPill === 'Archived') return b.status === 'SQUARED_OFF';
    return true;
  }).filter(b => {
    return (
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.broker.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6 pb-12">
      {/* 1. TOP TICKER STRIP (Tradetron Live Ticker) */}
      <div className="bg-slate-50 dark:bg-[#0E1526] border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-2.5 flex items-center justify-between text-xs font-mono transition-colors">
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-0.5">
          {/* Market Status Badge */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[10px] tracking-wide">
              <span className="w-2 h-2 rounded-full bg-slate-400"></span>
              CLOSED
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xs">+0.86%</span>
          </div>

          {/* Real-time Tickers */}
          <div className="flex items-center gap-5 text-[11px] whitespace-nowrap text-slate-700 dark:text-slate-300">
            <span className="flex items-center gap-1">
              <span className="font-semibold text-slate-900 dark:text-white">HDFCBANK</span>
              <span>₹ 846.00</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">+2.94%</span>
            </span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="flex items-center gap-1">
              <span className="font-semibold text-slate-900 dark:text-white">HEROMOTOCO</span>
              <span>₹ 5,536.00</span>
              <span className="text-red-600 dark:text-red-400 font-bold">-0.36%</span>
            </span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="flex items-center gap-1">
              <span className="font-semibold text-slate-900 dark:text-white">HINDALCO</span>
              <span>₹ 929.50</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">+2.14%</span>
            </span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="flex items-center gap-1">
              <span className="font-semibold text-slate-900 dark:text-white">HINDUNILVR</span>
              <span>₹ 2,052.50</span>
              <span className="text-red-600 dark:text-red-400 font-bold">-1.05%</span>
            </span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="flex items-center gap-1">
              <span className="font-semibold text-slate-900 dark:text-white">ITC</span>
              <span>₹ 299.10</span>
              <span className="text-red-600 dark:text-red-400 font-bold">-0.63%</span>
            </span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="flex items-center gap-1">
              <span className="font-semibold text-slate-900 dark:text-white">ICICIBANK</span>
              <span>₹ 1,248.00</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">+1.15%</span>
            </span>
          </div>
        </div>

        {/* Lists dropdown button */}
        <button className="px-3 py-1 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-sans font-semibold flex items-center gap-1.5 shrink-0 ml-3 transition">
          <span>Lists</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </button>
      </div>

      {/* 2. SUB-NAVIGATION TABS (Deployed | My Strategies | Ready Strategies | Backtest) */}
      <div className="border-b border-slate-200 dark:border-slate-800 flex items-center gap-8 px-2 text-sm font-semibold">
        <button className="py-2.5 text-[#5B45E0] dark:text-[#818CF8] border-b-2 border-[#5B45E0] dark:border-[#818CF8] font-bold">
          Deployed
        </button>
        <button
          onClick={() => onNavigateTab('mystrategies')}
          className="py-2.5 text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
        >
          My Strategies
        </button>
        <button
          onClick={() => onNavigateTab('readystrategies')}
          className="py-2.5 text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
        >
          Ready Strategies
        </button>
        <button
          onClick={() => onNavigateTab('backtest')}
          className="py-2.5 text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
        >
          Backtest
        </button>
      </div>

      {/* 3. DASHBOARD TITLE & ACTION CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Live overview of your deployed algo strategies
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition">
            <Megaphone className="w-3.5 h-3.5 text-slate-400" />
            <span>Alerts</span>
          </button>
          <button className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition">
            <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
            <span>Pop out P&amp;L</span>
          </button>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">SHOWING</span>
            <button className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131B2E] text-slate-800 dark:text-slate-200 font-semibold flex items-center gap-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
              <span>Today</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. THREE TOP METRIC CARDS (Exact match to screenshot) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: DEPLOYED CAPITAL */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
            <CreditCard className="w-4 h-4 text-slate-400" />
            <span>DEPLOYED CAPITAL</span>
          </div>
          <div className="my-4">
            <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">
              ₹ 1.00 L
            </span>
          </div>
          <div className="text-xs text-slate-400 font-medium">
            Across {filteredBots.length} deployed strateg{filteredBots.length === 1 ? 'y' : 'ies'}
          </div>
        </div>

        {/* Card 2: P&L (With subtle rounded highlight border) */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#131B2E] border-2 border-indigo-100 dark:border-indigo-950/60 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                <TrendingUp className="w-4 h-4 text-slate-400" />
                <span>P&amp;L</span>
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-mono">
                - ₹ 1.16 L booked today · +₹ 0.00 open
              </div>
              <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                Market value of open positions: ₹ 0.00
              </div>
            </div>

            {/* Red MTM Negative Value */}
            <div className="text-right">
              <div className="flex items-center justify-end gap-1 text-red-600 dark:text-red-400 font-black text-2xl font-mono">
                <span>▼</span>
                <span>-₹ 1.16 L</span>
              </div>
              <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 text-xs font-bold font-mono">
                -116.12%
              </span>
            </div>
          </div>

          <div className="text-right text-[11px] text-slate-400 font-medium mt-3">
            Live Offline only
          </div>
        </div>

        {/* Card 3: OPEN POSITIONS */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
            <Layers className="w-4 h-4 text-slate-400" />
            <span>OPEN POSITIONS</span>
          </div>
          <div className="my-4">
            <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">
              0
            </span>
          </div>
          <div className="text-xs text-slate-400 font-medium">
            {filteredBots.filter(b => b.status === 'ACTIVE').length} strategy running
          </div>
        </div>
      </div>

      {/* 5. DEPLOYED STRATEGIES TABLE SECTION */}
      <div className="bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        {/* Table Controls Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left: Title & Filter Pills */}
          <div className="flex items-center gap-4 flex-wrap">
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              Deployed <span className="text-[#5B45E0] dark:text-[#818CF8]">strategies</span>
            </h2>

            <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#0E1526] p-1 rounded-xl">
              {(['All', 'Deployed', 'Archived', 'Shared'] as const).map(pill => (
                <button
                  key={pill}
                  onClick={() => setActiveFilterPill(pill)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    activeFilterPill === pill
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {pill}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Search & Actions */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Filter name / broker / status..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#0E1526] border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#5B45E0]"
              />
            </div>

            <button className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
              Expand all
            </button>

            <button className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center gap-1">
              <span>My order</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            <button className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Table Header & Rows */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-[#0E1526] text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4">STRATEGY</th>
                <th className="py-3 px-4">BROKER</th>
                <th className="py-3 px-4">CAPITAL</th>
                <th className="py-3 px-4">POSITIONS</th>
                <th className="py-3 px-4">P&amp;L (SNAPSHOT)</th>
                <th className="py-3 px-4">RUN</th>
                <th className="py-3 px-4">MULTIPLIER</th>
                <th className="py-3 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-sans">
              {filteredBots.map((bot, idx) => (
                <tr
                  key={bot.id}
                  className={`hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition ${
                    bot.status === 'SQUARED_OFF' ? 'opacity-60 bg-slate-50/30' : ''
                  }`}
                >
                  {/* # Index / Drag */}
                  <td className="py-4 px-4 text-center text-slate-400 font-mono text-[11px]">
                    <div className="flex items-center justify-center gap-1">
                      <span>{idx + 1}</span>
                      <span className="text-slate-300 dark:text-slate-600 font-bold">::</span>
                    </div>
                  </td>

                  {/* Strategy Info */}
                  <td className="py-4 px-4">
                    <div className="space-y-1">
                      <div className="font-bold text-sm text-slate-900 dark:text-white hover:text-[#5B45E0] cursor-pointer transition">
                        {bot.name}
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                        <span className="px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-[10px] font-mono font-bold uppercase text-slate-700 dark:text-slate-300">
                          {bot.mode === 'PAPER' ? 'PAPER' : bot.mode}
                        </span>
                        <span>·</span>
                        <span>by {bot.author || 'algobulls'}</span>
                        <span>·</span>
                        <span className="text-slate-400">{bot.statusLabel || (bot.status === 'ACTIVE' ? 'Live-Entered' : 'Paused')}</span>
                      </div>
                    </div>
                  </td>

                  {/* Broker */}
                  <td className="py-4 px-4">
                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {bot.broker}
                    </div>
                  </td>

                  {/* Capital */}
                  <td className="py-4 px-4 font-mono font-bold text-slate-900 dark:text-white">
                    ₹ {(bot.capital / 100000).toFixed(2)} L
                  </td>

                  {/* Positions */}
                  <td className="py-4 px-4 font-mono">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500 font-bold">•</span>
                      <span className="border-b border-dotted border-slate-400 cursor-pointer text-slate-700 dark:text-slate-300">
                        {bot.openPositionsCount ?? 0} open / {bot.totalPositionsCount ?? 126}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold text-[9px] uppercase border border-slate-200 dark:border-slate-700">
                        ALGO
                      </span>
                    </div>
                  </td>

                  {/* P&L (Snapshot) */}
                  <td className="py-4 px-4 font-mono">
                    <div className="space-y-0.5">
                      <div className="font-bold text-red-600 dark:text-red-400">
                        - ₹ {(Math.abs(bot.dailyPnl) / 100000).toFixed(2)} L
                      </div>
                      <div className="text-[11px] text-red-600 dark:text-red-400">
                        {bot.pnlPercent ? `${bot.pnlPercent.toFixed(2)}%` : '-935.08%'}
                      </div>
                    </div>
                  </td>

                  {/* Run Count Dropdown */}
                  <td className="py-4 px-4">
                    <button className="px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                      <span>{bot.runCount ?? 5} (- ₹ {(Math.abs(bot.dailyPnl) / 100000).toFixed(2)} L)</span>
                      <ChevronDown className="w-3 h-3 text-slate-400" />
                    </button>
                  </td>

                  {/* Multiplier Dropdown */}
                  <td className="py-4 px-4">
                    <button className="px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                      <span>{bot.multiplier}x</span>
                      <ChevronDown className="w-3 h-3 text-slate-400" />
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleToggleLocal(bot.id)}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
                        title={bot.status === 'ACTIVE' ? 'Pause Strategy' : 'Resume Strategy'}
                      >
                        {bot.status === 'ACTIVE' ? (
                          <Pause className="w-3.5 h-3.5" />
                        ) : (
                          <Play className="w-3.5 h-3.5 fill-current text-emerald-500" />
                        )}
                      </button>

                      <button
                        onClick={() => handleSquareOffLocal(bot.id)}
                        disabled={bot.status === 'SQUARED_OFF'}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20 text-slate-600 dark:text-slate-300 transition disabled:opacity-40"
                        title="Square Off Strategy"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onOpenLogs(bot.name)}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
                        title="More Options & Logs"
                      >
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. BOTTOM CONSOLE SECTION (Split View matching screenshot media_1795188402398_176d78f2.png) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
        {/* Left Console Sidebar (vertical tabs) */}
        <div className="md:col-span-3 space-y-1">
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-3 mb-2">
            CONSOLE
          </div>

          {[
            { id: 'market_watch', label: 'Market Watch', icon: LineChart },
            { id: 'open_positions', label: 'Open Positions', icon: List },
            { id: 'greeks', label: 'Greeks', icon: Activity },
            { id: 'order_book', label: 'Order Book', icon: FileSpreadsheet },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'tally_orders', label: 'Tally Orders', icon: Scale }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = consoleTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setConsoleTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition text-left ${
                  isActive
                    ? 'bg-slate-100 dark:bg-[#1E293B] text-[#5B45E0] dark:text-[#818CF8] font-bold border-l-4 border-[#5B45E0] dark:border-[#818CF8]'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#5B45E0] dark:text-[#818CF8]' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Console Detail Panel */}
        <div className="md:col-span-9 bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 min-h-[260px] flex flex-col justify-between">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white capitalize">
                {consoleTab.replace('_', ' ')}
              </h3>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-2 py-0.5 rounded bg-slate-100 dark:bg-[#0E1526]">
                {consoleTab === 'tally_orders' ? 'BROKER RECONCILE' : 'LIVE FEED'}
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              Auto-refresh 1s
            </span>
          </div>

          {/* Body Content */}
          <div className="py-8">
            {consoleTab === 'tally_orders' && (
              <div className="text-center py-6">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  No live broker deployments to reconcile.
                </p>
              </div>
            )}

            {consoleTab === 'market_watch' && (
              <div className="overflow-x-auto">
                <table className="w-full text-xs font-mono">
                  <thead>
                    <tr className="text-slate-400 text-[10px] uppercase border-b border-slate-100 dark:border-slate-800">
                      <th className="py-2 text-left">Symbol</th>
                      <th className="py-2 text-right">LTP</th>
                      <th className="py-2 text-right">Chg %</th>
                      <th className="py-2 text-right">High</th>
                      <th className="py-2 text-right">Low</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    <tr>
                      <td className="py-2.5 font-bold text-slate-900 dark:text-white">NIFTY 50</td>
                      <td className="py-2.5 text-right font-bold">24,180.50</td>
                      <td className="py-2.5 text-right text-emerald-600 font-bold">+0.86%</td>
                      <td className="py-2.5 text-right text-slate-500">24,240.00</td>
                      <td className="py-2.5 text-right text-slate-500">23,980.10</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-bold text-slate-900 dark:text-white">BANKNIFTY</td>
                      <td className="py-2.5 text-right font-bold">51,840.20</td>
                      <td className="py-2.5 text-right text-emerald-600 font-bold">+1.12%</td>
                      <td className="py-2.5 text-right text-slate-500">51,990.00</td>
                      <td className="py-2.5 text-right text-slate-500">51,200.00</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-bold text-slate-900 dark:text-white">BTCUSD</td>
                      <td className="py-2.5 text-right font-bold">$94,520.00</td>
                      <td className="py-2.5 text-right text-emerald-600 font-bold">+3.45%</td>
                      <td className="py-2.5 text-right text-slate-500">$95,100.00</td>
                      <td className="py-2.5 text-right text-slate-500">$91,200.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {consoleTab === 'open_positions' && (
              <div className="text-center py-6">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  0 active open positions in market. All legs currently squared off.
                </p>
              </div>
            )}

            {consoleTab === 'greeks' && (
              <div className="overflow-x-auto">
                <table className="w-full text-xs font-mono">
                  <thead>
                    <tr className="text-slate-400 text-[10px] uppercase border-b border-slate-100 dark:border-slate-800">
                      <th className="py-2 text-left">Contract</th>
                      <th className="py-2 text-right">IV</th>
                      <th className="py-2 text-right">Delta (Δ)</th>
                      <th className="py-2 text-right">Theta (Θ)</th>
                      <th className="py-2 text-right">Vega (ν)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    <tr>
                      <td className="py-2 font-bold text-slate-900 dark:text-white">NIFTY 24200 CE</td>
                      <td className="py-2 text-right">13.4%</td>
                      <td className="py-2 text-right text-emerald-600">+0.48</td>
                      <td className="py-2 text-right text-red-600">-12.4</td>
                      <td className="py-2 text-right">8.6</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-bold text-slate-900 dark:text-white">NIFTY 24200 PE</td>
                      <td className="py-2 text-right">14.1%</td>
                      <td className="py-2 text-right text-red-600">-0.52</td>
                      <td className="py-2 text-right text-red-600">-13.1</td>
                      <td className="py-2 text-right">8.9</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {consoleTab === 'order_book' && (
              <div className="text-center py-6">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Showing last 5 completed broker orders. All orders filled at market price.
                </p>
              </div>
            )}

            {consoleTab === 'notifications' && (
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0E1526] flex items-center justify-between">
                  <span className="text-slate-700 dark:text-slate-300">Strategy &quot;TradingWave Nifty OHOL 3M&quot; heartbeat check passed.</span>
                  <span className="text-slate-400 font-mono text-[11px]">Just now</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0E1526] flex items-center justify-between">
                  <span className="text-slate-700 dark:text-slate-300">Centrifugo WebSocket stream connection active.</span>
                  <span className="text-slate-400 font-mono text-[11px]">1 min ago</span>
                </div>
              </div>
            )}
          </div>

          {/* Footer note */}
          <div className="text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
            <span>TradingWave Multi-Broker Execution Engine v2.0</span>
            <button
              onClick={() => onOpenLogs('All Strategies Combined')}
              className="text-[#5B45E0] dark:text-[#818CF8] hover:underline font-semibold"
            >
              Open Complete Audit Trail →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
