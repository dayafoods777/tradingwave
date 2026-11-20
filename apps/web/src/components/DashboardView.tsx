'use client';

import React, { useState } from 'react';
import {
  Activity,
  Play,
  Pause,
  RotateCcw,
  ShieldAlert,
  Server,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  FileText,
  Search,
  ArrowUpRight,
  Filter
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
}

interface DashboardViewProps {
  bots: BotDeployment[];
  onToggleBot: (id: string) => void;
  onSquareOffBot: (id: string) => void;
  onOpenLogs: (botName: string) => void;
  onNavigateTab: (tab: any) => void;
}

export default function DashboardView({
  bots,
  onToggleBot,
  onSquareOffBot,
  onOpenLogs,
  onNavigateTab
}: DashboardViewProps) {
  const [filterMode, setFilterMode] = useState<'ALL' | 'LIVE_AUTO' | 'LIVE_OFFLINE' | 'PAPER'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBots = bots.filter(b => {
    const matchMode = filterMode === 'ALL' || b.mode === filterMode;
    const matchSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) || b.underlying.toLowerCase().includes(searchTerm.toLowerCase());
    return matchMode && matchSearch;
  });

  const totalPnl = bots.reduce((acc, b) => acc + (b.status !== 'SQUARED_OFF' ? b.dailyPnl : 0), 0);
  const totalCapital = bots.reduce((acc, b) => acc + b.capital, 0);
  const activeBotsCount = bots.filter(b => b.status === 'ACTIVE').length;

  return (
    <div className="space-y-6">
      {/* 1. TOP METRICS STRIP */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Live MTM P&L */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-[#1E293B] shadow-sm dark:shadow-xl relative overflow-hidden transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-semibold mb-2">
            <span>Today&#39;s Combined MTM P&amp;L</span>
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Feed
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-black font-mono tracking-tight ${totalPnl >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
              {totalPnl >= 0 ? `+₹${totalPnl.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : `-₹${Math.abs(totalPnl).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
              (+{( (totalPnl / totalCapital) * 100 ).toFixed(2)}%)
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2 font-mono">
            Across {bots.length} deployed strategies (Realized + Unrealized)
          </div>
        </div>

        {/* Metric 2: Active Deployments */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-[#1E293B] shadow-sm dark:shadow-xl transition-colors">
          <div className="text-xs text-slate-600 dark:text-slate-400 font-semibold mb-2">Active Trading Bots</div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">{activeBotsCount}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">/ {bots.length} Deployed</span>
          </div>
          <div className="flex items-center gap-2 mt-2 text-[11px]">
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold">
              {bots.filter(b => b.mode === 'LIVE_AUTO').length} Live Auto
            </span>
            <span className="px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-600 dark:text-blue-400 font-bold">
              {bots.filter(b => b.mode === 'PAPER').length} Paper Trading
            </span>
          </div>
        </div>

        {/* Metric 3: Total Margin Deployed */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-[#1E293B] shadow-sm dark:shadow-xl transition-colors">
          <div className="text-xs text-slate-600 dark:text-slate-400 font-semibold mb-2">Total Capital Deployed</div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">
              ₹{(totalCapital / 100000).toFixed(2)}L
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium font-mono">₹{totalCapital.toLocaleString('en-IN')}</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2">
            Available Broker Margin: ₹3,45,000.00
          </div>
        </div>

        {/* Metric 4: Broker Connectivity */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-[#1E293B] shadow-sm dark:shadow-xl transition-colors">
          <div className="text-xs text-slate-600 dark:text-slate-400 font-semibold mb-2">Broker Connectivity</div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-base font-bold text-slate-900 dark:text-white">2 Brokers Online</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 flex items-center justify-between">
            <span>Zerodha Kite · DhanHQ</span>
            <button
              onClick={() => onNavigateTab('brokers')}
              className="text-[#FF6600] hover:underline font-semibold"
            >
              Configure →
            </button>
          </div>
        </div>
      </div>

      {/* 2. FILTER & ACTION BAR */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-[#1E293B] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm dark:shadow-lg transition-colors">
        <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto">
          {[
            { id: 'ALL', label: 'All Bots' },
            { id: 'LIVE_AUTO', label: 'Live Auto' },
            { id: 'LIVE_OFFLINE', label: 'Live Offline' },
            { id: 'PAPER', label: 'Paper Trading' }
          ].map(m => (
            <button
              key={m.id}
              onClick={() => setFilterMode(m.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                filterMode === m.id
                  ? 'bg-[#FF6600] text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-[#0E1526] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search deployed bots..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#0E1526] border border-slate-200 dark:border-[#1E293B] rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#FF6600]"
            />
          </div>

          <button
            onClick={() => onNavigateTab('builder')}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#FF6600] to-[#E65C00] text-white text-xs font-bold whitespace-nowrap shadow-md shadow-orange-500/20 hover:brightness-110 flex items-center gap-1.5 transition"
          >
            <span>+ New Bot</span>
          </button>
        </div>
      </div>

      {/* 3. DEPLOYED BOTS LIST */}
      <div className="space-y-4">
        {filteredBots.map(bot => (
          <div
            key={bot.id}
            className={`p-5 rounded-2xl border transition shadow-sm dark:shadow-lg ${
              bot.status === 'SQUARED_OFF'
                ? 'bg-slate-100/50 dark:bg-[#111827]/40 border-slate-200 dark:border-slate-800 opacity-60'
                : 'bg-white dark:bg-[#131B2E] border-slate-200 dark:border-[#1E293B] hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              {/* Bot Info */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white hover:text-[#FF6600] cursor-pointer transition">
                    {bot.name}
                  </h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    bot.mode === 'LIVE_AUTO' ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' :
                    bot.mode === 'LIVE_OFFLINE' ? 'bg-purple-500/15 text-purple-600 dark:text-purple-400' :
                    'bg-blue-500/15 text-blue-600 dark:text-blue-400'
                  }`}>
                    {bot.mode.replace('_', ' ')}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                    Broker: {bot.broker}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                    {bot.multiplier}x Multiplier
                  </span>
                </div>

                {/* Open Legs Details */}
                <div className="flex items-center gap-2 flex-wrap text-xs font-mono text-slate-700 dark:text-slate-300 pt-1">
                  <span className="text-slate-500 dark:text-slate-500 uppercase text-[10px]">Open Positions:</span>
                  {bot.legs.map((leg, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-slate-50 dark:bg-[#0E1526] border border-slate-200 dark:border-[#1E293B]">
                      {leg}
                    </span>
                  ))}
                </div>
              </div>

              {/* PnL & Check Heartbeat */}
              <div className="flex items-center gap-6 lg:text-right">
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold block">Live Bot MTM</span>
                  <div className={`text-xl font-black font-mono mt-0.5 ${bot.dailyPnl >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                    {bot.dailyPnl >= 0 ? `+₹${bot.dailyPnl.toFixed(2)}` : `-₹${Math.abs(bot.dailyPnl).toFixed(2)}`}
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-mono">
                    {bot.frequency} · Last check {bot.lastCheck}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onToggleBot(bot.id)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-[#0E1526] border border-slate-200 dark:border-[#1E293B] hover:border-slate-400 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition"
                    title={bot.status === 'ACTIVE' ? 'Pause Execution' : 'Resume Execution'}
                  >
                    {bot.status === 'ACTIVE' ? <Pause className="w-4 h-4 text-amber-500" /> : <Play className="w-4 h-4 text-emerald-600 dark:text-emerald-400 fill-emerald-500" />}
                  </button>

                  <button
                    onClick={() => onOpenLogs(bot.name)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-[#0E1526] border border-slate-200 dark:border-[#1E293B] hover:border-slate-400 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition"
                    title="View Execution Logs & Audit Trail"
                  >
                    <FileText className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                  </button>

                  <button
                    onClick={() => onSquareOffBot(bot.id)}
                    disabled={bot.status === 'SQUARED_OFF'}
                    className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-600 dark:bg-red-600/20 dark:hover:bg-red-600 text-red-600 hover:text-white dark:text-red-400 dark:hover:text-white text-xs font-bold border border-red-500/30 transition disabled:opacity-40"
                    title="Square off positions immediately"
                  >
                    {bot.status === 'SQUARED_OFF' ? 'Exited' : 'Square Off'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 4. REAL-TIME ACTIVITY LOG STRIP */}
      <div className="p-4 rounded-2xl bg-slate-100 dark:bg-[#0E1526] border border-slate-200 dark:border-[#1E293B] flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-mono transition-colors">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Centrifugo WebSocket Stream Connected · Continuous Bot Monitoring · Latency: 12ms</span>
        </div>
        <button
          onClick={() => onOpenLogs('All Strategies Combined')}
          className="text-[#FF6600] hover:underline font-bold font-sans"
        >
          View Full Audit Log →
        </button>
      </div>
    </div>
  );
}
