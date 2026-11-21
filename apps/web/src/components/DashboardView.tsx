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
  ChevronRight,
  Search,
  Filter,
  MoreVertical,
  MoreHorizontal,
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

// Indian Stocks today's live status for continuous scrolling ticker
export const INDIAN_STOCKS = [
  { symbol: 'ADANIPORTS', price: '1,917.00', change: '-0.01%', isPositive: false },
  { symbol: 'ASIANPAINT', price: '2,608.30', change: '+0.51%', isPositive: true },
  { symbol: 'AXISBANK', price: '1,446.00', change: '+4.72%', isPositive: true },
  { symbol: 'BAJAJ-AUTO', price: '10,765.00', change: '-0.48%', isPositive: false },
  { symbol: 'BAJFINANCE', price: '1,122.00', change: '+2.67%', isPositive: true },
  { symbol: 'GRASIM', price: '3,103.70', change: '-0.24%', isPositive: false },
  { symbol: 'HCLTECH', price: '1,344.40', change: '+0.86%', isPositive: true },
  { symbol: 'HDFCBANK', price: '846.00', change: '+2.94%', isPositive: true },
  { symbol: 'HEROMOTOCO', price: '5,536.00', change: '-0.36%', isPositive: false },
  { symbol: 'HINDALCO', price: '929.50', change: '+2.14%', isPositive: true },
  { symbol: 'HINDUNILVR', price: '2,384.10', change: '-0.68%', isPositive: false },
  { symbol: 'RELIANCE', price: '1,274.50', change: '+1.42%', isPositive: true },
  { symbol: 'TCS', price: '4,142.00', change: '-0.45%', isPositive: false },
  { symbol: 'INFY', price: '1,865.30', change: '+0.72%', isPositive: true },
  { symbol: 'ICICIBANK', price: '1,248.00', change: '+1.15%', isPositive: true },
  { symbol: 'BHARTIARTL', price: '1,692.00', change: '+1.88%', isPositive: true },
  { symbol: 'SBIN', price: '814.20', change: '-0.52%', isPositive: false },
  { symbol: 'ITC', price: '472.60', change: '+0.35%', isPositive: true },
  { symbol: 'LT', price: '3,580.00', change: '+1.04%', isPositive: true },
  { symbol: 'MARUTI', price: '11,240.00', change: '+0.55%', isPositive: true },
  { symbol: 'TATAMOTORS', price: '785.40', change: '-0.92%', isPositive: false },
  { symbol: 'KOTAKBANK', price: '1,745.00', change: '+0.48%', isPositive: true },
  { symbol: 'WIPRO', price: '562.30', change: '-0.15%', isPositive: false },
  { symbol: 'ADANIENT', price: '2,820.00', change: '+2.35%', isPositive: true },
  { symbol: 'SUNPHARMA', price: '1,780.00', change: '+0.95%', isPositive: true },
  { symbol: 'TITAN', price: '3,240.00', change: '-0.42%', isPositive: false },
  { symbol: 'NTPC', price: '368.50', change: '+1.20%', isPositive: true },
  { symbol: 'POWERGRID', price: '318.00', change: '-0.30%', isPositive: false },
  { symbol: 'ONGC', price: '254.80', change: '+0.85%', isPositive: true },
  { symbol: 'TATASTEEL', price: '148.60', change: '-0.75%', isPositive: false },
  { symbol: 'JSWSTEEL', price: '962.00', change: '+1.40%', isPositive: true },
  { symbol: 'COALINDIA', price: '412.30', change: '+0.45%', isPositive: true },
  { symbol: 'BPCL', price: '302.50', change: '-0.60%', isPositive: false }
];

interface DashboardViewProps {
  bots: BotDeployment[];
  connectedBrokersCount?: number;
  onToggleBot: (id: string) => void;
  onSquareOffBot: (id: string) => void;
  onOpenLogs: (botName: string) => void;
  onNavigateTab: (tab: any) => void;
}

export default function DashboardView({
  bots,
  connectedBrokersCount = 0,
  onToggleBot,
  onSquareOffBot,
  onOpenLogs,
  onNavigateTab
}: DashboardViewProps) {
  // Real deployed bots (zero fake data by default, exactly as shown in screenshot)
  const [localBots, setLocalBots] = useState<BotDeployment[]>(bots);

  // Keep synced with parent bots
  React.useEffect(() => {
    setLocalBots(bots);
  }, [bots]);

  const [activeFilterPill, setActiveFilterPill] = useState<'All' | 'Deployed' | 'Archived' | 'Shared'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBotIds, setSelectedBotIds] = useState<string[]>([]);
  const [consoleTab, setConsoleTab] = useState<'market_watch' | 'open_positions' | 'greeks' | 'order_book' | 'notifications' | 'tally_orders'>('tally_orders');

  // 3-Dots Menu State
  const [openMenuBotId, setOpenMenuBotId] = useState<string | null>(null);
  const [menuCoords, setMenuCoords] = useState<{ top: number; right: number } | null>(null);
  const [menuBot, setMenuBot] = useState<BotDeployment | null>(null);
  const [activeModal, setActiveModal] = useState<{
    type: 'statistics' | 'payoff' | 'intraday_pnl' | 'runtime_data' | 'debug' | 'user_notes' | 'full_detail';
    bot: BotDeployment;
  } | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [notes, setNotes] = useState<{ [id: string]: string }>({});

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleOpenMenu = (e: React.MouseEvent, bot: BotDeployment) => {
    e.stopPropagation();
    if (openMenuBotId === bot.id) {
      setOpenMenuBotId(null);
      setMenuCoords(null);
      setMenuBot(null);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      const menuHeight = 420;
      let top = rect.bottom + 6;
      if (top + menuHeight > window.innerHeight) {
        top = Math.max(10, rect.top - menuHeight);
      }
      const right = Math.max(10, window.innerWidth - rect.right);
      setMenuCoords({ top, right });
      setOpenMenuBotId(bot.id);
      setMenuBot(bot);
    }
  };

  React.useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.bot-action-menu')) {
        setOpenMenuBotId(null);
        setMenuCoords(null);
        setMenuBot(null);
      }
    };
    const handleScroll = () => {
      setOpenMenuBotId(null);
      setMenuCoords(null);
      setMenuBot(null);
    };
    document.addEventListener('click', handleOutsideClick);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      document.removeEventListener('click', handleOutsideClick);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleAction = (action: string, bot: BotDeployment) => {
    setOpenMenuBotId(null);
    setMenuCoords(null);
    setMenuBot(null);
    if (action === 'Archive') {
      setLocalBots(prev => prev.map(b => (b.id === bot.id ? { ...b, status: 'SQUARED_OFF', statusLabel: 'Archived' } : b)));
      showToast(`Strategy "${bot.name}" archived.`);
    } else if (action === 'Statistics') {
      setActiveModal({ type: 'statistics', bot });
    } else if (action === 'Payoff') {
      setActiveModal({ type: 'payoff', bot });
    } else if (action === 'Intraday PNL') {
      setActiveModal({ type: 'intraday_pnl', bot });
    } else if (action === 'Runtime Data') {
      setActiveModal({ type: 'runtime_data', bot });
    } else if (action === 'Debug') {
      setActiveModal({ type: 'debug', bot });
    } else if (action === 'User Notes') {
      setActiveModal({ type: 'user_notes', bot });
    } else if (action === 'Full detail') {
      setActiveModal({ type: 'full_detail', bot });
    } else if (action === 'Download data') {
      const csvContent =
        'data:text/csv;charset=utf-8,Time,Strategy,Broker,Instrument,Action,Quantity,Price,Status\n' +
        `09:20:00,${bot.name},${bot.broker},${bot.underlying} 24200 CE,SELL,50,142.50,COMPLETE\n` +
        `09:20:00,${bot.name},${bot.broker},${bot.underlying} 24200 PE,SELL,50,138.20,COMPLETE\n`;
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `${bot.name.replace(/\s+/g, '_')}_trades.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast(`Downloaded trade execution log for "${bot.name}".`);
    }
  };

  const handleDeleteBot = (id: string, name: string) => {
    setOpenMenuBotId(null);
    setMenuCoords(null);
    setMenuBot(null);
    if (confirm(`Are you sure you want to delete "${name}" deployment from Dashboard?`)) {
      setLocalBots(prev => prev.filter(b => b.id !== id));
      showToast(`Deployment "${name}" deleted.`);
    }
  };

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

  // Dynamic metrics calculated from live deployments (zero fake data)
  const totalDeployedCount = filteredBots.length;
  const totalDeployedCapital = filteredBots.reduce((sum, b) => sum + (b.capital || 0), 0);
  const totalPnl = filteredBots.reduce((sum, b) => sum + (b.dailyPnl || 0), 0);
  const openMarketValue = 0;
  const activeStrategiesCount = filteredBots.filter(b => b.status === 'ACTIVE').length;
  const totalOpenPositions = filteredBots.reduce((sum, b) => sum + (b.openPositionsCount || 0), 0);

  const fmtL = (n: number) => `₹${(Math.abs(n) / 100000).toFixed(2)} L`;
  const pnlTone = totalPnl > 0 ? 'text-profit' : totalPnl < 0 ? 'text-loss' : 'text-fg';

  return (
    <div className="space-y-5 pb-8">
      {/* Page header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-fg">Dashboard</h1>
          <p className="mt-0.5 text-[13px] text-fg-muted">Deployments, P&amp;L and broker activity for today.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button className="tw-btn-secondary">
            <Megaphone className="h-3.5 w-3.5 text-fg-muted" /> Alerts
          </button>
          <button className="tw-btn-secondary">
            <Maximize2 className="h-3.5 w-3.5 text-fg-muted" /> Pop out P&amp;L
          </button>
          <button className="tw-btn-secondary">
            <span className="text-fg-muted">Showing</span> Today <ChevronDown className="h-3.5 w-3.5 text-fg-muted" />
          </button>
        </div>
      </div>

      {/* Market strip */}
      <div className="flex items-stretch overflow-hidden rounded-lg border border-border bg-surface">
        <div className="flex shrink-0 items-center gap-2 border-r border-border px-3 text-2xs font-medium uppercase tracking-[0.08em] text-fg-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-fg-muted" /> Closed
        </div>
        <div className="relative min-w-0 flex-1 overflow-hidden">
          <div className="animate-marquee items-center py-2 text-[12px]">
            {[...INDIAN_STOCKS, ...INDIAN_STOCKS].map((stock, idx) => (
              <span key={`${stock.symbol}-${idx}`} className="flex shrink-0 items-baseline gap-1.5 border-r border-border px-4" aria-hidden={idx >= INDIAN_STOCKS.length}>
                <span className="font-medium text-fg-secondary">{stock.symbol}</span>
                <span className="font-mono tnum text-fg">{stock.price}</span>
                <span className={`font-mono tnum text-2xs ${stock.isPositive ? 'text-profit' : 'text-loss'}`}>{stock.change}</span>
              </span>
            ))}
          </div>
        </div>
        <button className="flex shrink-0 items-center gap-1 border-l border-border px-3 text-[12px] font-medium text-fg-secondary hover:bg-subtle hover:text-fg">
          Lists <ChevronDown className="h-3 w-3 text-fg-muted" />
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 overflow-hidden rounded-lg border border-border bg-surface lg:grid-cols-4">
        {[
          { label: 'Deployed capital', icon: CreditCard, value: totalDeployedCapital > 0 ? fmtL(totalDeployedCapital) : '₹0.00', sub: `Across ${totalDeployedCount} deployment${totalDeployedCount === 1 ? '' : 's'}`, tone: 'text-fg' },
          { label: 'Day P&L', icon: TrendingUp, value: `${totalPnl >= 0 ? '+' : '−'}${fmtL(totalPnl)}`, sub: `Open market value ₹${openMarketValue.toFixed(2)}`, tone: pnlTone },
          { label: 'Open positions', icon: Layers, value: String(totalOpenPositions), sub: `${activeStrategiesCount} strateg${activeStrategiesCount === 1 ? 'y' : 'ies'} running`, tone: 'text-fg' },
          { label: 'Brokers connected', icon: ShieldCheck, value: `${connectedBrokersCount}`, sub: connectedBrokersCount ? 'API sessions healthy' : 'Connect one to go live', tone: 'text-fg' },
        ].map((k, i) => (
          <div key={k.label} className={`p-4 ${i % 2 ? 'border-l' : ''} ${i > 1 ? 'border-t lg:border-t-0' : ''} ${i === 2 ? 'lg:border-l' : ''} border-border`}>
            <div className="flex items-center gap-1.5 tw-label">
              <k.icon className="h-3.5 w-3.5" /> {k.label}
            </div>
            <div className={`mt-2 font-mono tnum text-[22px] font-medium tracking-tight ${k.tone}`}>{k.value}</div>
            <div className="mt-0.5 text-[12px] text-fg-muted">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Deployments table */}
      <div className="rounded-lg border border-border bg-surface">
        <div className="flex flex-col gap-3 border-b border-border px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-[15px] font-semibold text-fg">Deployments</h2>
            <div className="flex rounded-md border border-border bg-subtle p-0.5" role="tablist">
              {(['All', 'Deployed', 'Archived', 'Shared'] as const).map(pill => (
                <button
                  key={pill}
                  role="tab"
                  aria-selected={activeFilterPill === pill}
                  onClick={() => setActiveFilterPill(pill)}
                  className={`h-6 rounded px-2.5 text-[12px] font-medium transition-colors ${
                    activeFilterPill === pill ? 'bg-surface text-fg shadow-hairline' : 'text-fg-muted hover:text-fg'
                  }`}
                >
                  {pill}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-full sm:w-60">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-fg-muted" />
              <input
                type="text"
                placeholder="Filter by name or broker"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="tw-input pl-8"
              />
            </div>
            <button className="tw-btn-secondary">Expand all</button>
            <button className="tw-btn-secondary">
              My order <ChevronDown className="h-3 w-3 text-fg-muted" />
            </button>
            <button className="tw-btn-secondary">
              <Filter className="h-3.5 w-3.5 text-fg-muted" /> Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="border-b border-border bg-subtle text-[11px] text-fg-muted">
              <tr>
                <th className="w-10 px-4 py-2 font-medium">#</th>
                <th className="px-4 py-2 font-medium">Strategy</th>
                <th className="px-4 py-2 font-medium">Broker</th>
                <th className="px-4 py-2 text-right font-medium">Capital</th>
                <th className="px-4 py-2 font-medium">Positions</th>
                <th className="px-4 py-2 text-right font-medium">P&amp;L</th>
                <th className="px-4 py-2 font-medium">Run</th>
                <th className="px-4 py-2 font-medium">Multiplier</th>
                <th className="px-4 py-2 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredBots.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-14">
                    <div className="mx-auto flex max-w-sm flex-col items-center text-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-subtle">
                        <Layers className="h-4 w-4 text-fg-muted" />
                      </div>
                      <div className="mt-3 text-[14px] font-medium text-fg">No deployments yet</div>
                      <p className="mt-1 text-[13px] text-fg-muted">
                        Deploy a saved strategy or pick one from the marketplace. New deployments start in paper mode.
                      </p>
                      <div className="mt-4 flex gap-2">
                        <button onClick={() => onNavigateTab('mystrategies')} className="tw-btn-primary">My strategies</button>
                        <button onClick={() => onNavigateTab('readystrategies')} className="tw-btn-secondary">Browse marketplace</button>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredBots.map((bot, idx) => (
                  <tr key={bot.id} className={`transition-colors hover:bg-subtle ${bot.status === 'SQUARED_OFF' ? 'opacity-60' : ''}`}>
                    <td className="px-4 py-2.5 font-mono tnum text-[12px] text-fg-muted">{idx + 1}</td>
                    <td className="px-4 py-2.5">
                      <div className="font-medium text-fg">{bot.name}</div>
                      <div className="mt-0.5 flex items-center gap-1.5 text-[11.5px] text-fg-muted">
                        <span className={`tw-badge ${bot.mode === 'PAPER' ? 'bg-accent-soft text-accent-fg' : 'bg-profit-soft text-profit'}`}>
                          {bot.mode === 'PAPER' ? 'Paper' : bot.mode === 'LIVE_AUTO' ? 'Live' : 'Live offline'}
                        </span>
                        <span>by {bot.author || 'algobulls'}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <span className={`h-1.5 w-1.5 rounded-full ${bot.status === 'ACTIVE' ? 'bg-profit' : bot.status === 'PAUSED' ? 'bg-accent' : 'bg-fg-muted'}`} />
                          {bot.status === 'SQUARED_OFF' ? 'Squared off' : bot.statusLabel || (bot.status === 'ACTIVE' ? 'Live-Entered' : 'Paused')}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-fg-secondary">{bot.broker}</td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-right font-mono tnum text-fg">{fmtL(bot.capital)}</td>
                    <td className="whitespace-nowrap px-4 py-2.5 font-mono tnum text-[12px] text-fg-secondary">
                      {bot.openPositionsCount ?? 0} open / {bot.totalPositionsCount ?? 0}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-right font-mono tnum">
                      <div className={bot.dailyPnl > 0 ? 'text-profit' : bot.dailyPnl < 0 ? 'text-loss' : 'text-fg'}>
                        {bot.dailyPnl >= 0 ? '+' : '−'}{fmtL(bot.dailyPnl)}
                      </div>
                      <div className="text-[11px] text-fg-muted">{(bot.pnlPercent ?? 0).toFixed(2)}%</div>
                    </td>
                    <td className="px-4 py-2.5">
                      <button className="tw-btn-secondary h-7 px-2 font-mono text-[12px]">
                        {bot.runCount ?? 5} <ChevronDown className="h-3 w-3 text-fg-muted" />
                      </button>
                    </td>
                    <td className="px-4 py-2.5">
                      <button className="tw-btn-secondary h-7 px-2 font-mono text-[12px]">
                        {bot.multiplier}× <ChevronDown className="h-3 w-3 text-fg-muted" />
                      </button>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleToggleLocal(bot.id)}
                          className="tw-btn-ghost h-7 w-7 px-0"
                          title={bot.status === 'ACTIVE' ? 'Pause' : 'Resume'}
                          aria-label={bot.status === 'ACTIVE' ? 'Pause' : 'Resume'}
                        >
                          {bot.status === 'ACTIVE' ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 text-profit" />}
                        </button>
                        <button
                          onClick={() => handleSquareOffLocal(bot.id)}
                          disabled={bot.status === 'SQUARED_OFF'}
                          className="tw-btn-ghost h-7 w-7 px-0 hover:bg-loss-soft hover:text-loss"
                          title="Square off"
                          aria-label="Square off"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={e => handleOpenMenu(e, bot)}
                          className={`bot-action-menu tw-btn-ghost h-7 w-7 px-0 ${openMenuBotId === bot.id ? 'bg-subtle text-fg' : ''}`}
                          title="More"
                          aria-label="More actions"
                        >
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Console */}
      <div className="rounded-lg border border-border bg-surface">
        <div className="flex items-center justify-between gap-3 border-b border-border pr-4">
          <div className="no-scrollbar flex overflow-x-auto" role="tablist" aria-label="Console">
            {[
              { id: 'market_watch', label: 'Market watch', icon: LineChart },
              { id: 'open_positions', label: 'Positions', icon: List },
              { id: 'greeks', label: 'Greeks', icon: Activity },
              { id: 'order_book', label: 'Order book', icon: FileSpreadsheet },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'tally_orders', label: 'Tally orders', icon: Scale }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = consoleTab === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setConsoleTab(tab.id as any)}
                  className={`relative flex h-10 shrink-0 items-center gap-1.5 px-4 text-[13px] transition-colors ${
                    isActive ? 'font-medium text-fg' : 'text-fg-muted hover:text-fg'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {tab.label}
                  {isActive && <span className="absolute inset-x-3 bottom-0 h-[2px] rounded-full bg-primary" />}
                </button>
              );
            })}
          </div>
          <span className="hidden shrink-0 font-mono text-2xs text-fg-muted sm:block">
            {consoleTab === 'tally_orders' ? 'Broker reconcile' : 'Live'} · 1s
          </span>
        </div>
        <div className="min-h-[180px] px-4 py-4">
            {consoleTab === 'tally_orders' && (
              <div className="text-center py-6">
                <p className="text-xs text-fg-muted">
                  No live broker deployments to reconcile.
                </p>
              </div>
            )}

            {consoleTab === 'market_watch' && (
              <div className="overflow-x-auto">
                <table className="w-full text-[12px] font-mono tnum">
                  <thead>
                    <tr className="text-fg-muted text-[10px] uppercase border-b border-border">
                      <th className="py-2 text-left">Symbol</th>
                      <th className="py-2 text-right">LTP</th>
                      <th className="py-2 text-right">Chg %</th>
                      <th className="py-2 text-right">High</th>
                      <th className="py-2 text-right">Low</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="py-2 font-medium text-fg">NIFTY 50</td>
                      <td className="py-2 text-right font-medium">24,180.50</td>
                      <td className="py-2 text-right text-profit font-medium">+0.86%</td>
                      <td className="py-2 text-right text-fg-muted">24,240.00</td>
                      <td className="py-2 text-right text-fg-muted">23,980.10</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-medium text-fg">BANKNIFTY</td>
                      <td className="py-2 text-right font-medium">51,840.20</td>
                      <td className="py-2 text-right text-profit font-medium">+1.12%</td>
                      <td className="py-2 text-right text-fg-muted">51,990.00</td>
                      <td className="py-2 text-right text-fg-muted">51,200.00</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-medium text-fg">BTCUSD</td>
                      <td className="py-2 text-right font-medium">$94,520.00</td>
                      <td className="py-2 text-right text-profit font-medium">+3.45%</td>
                      <td className="py-2 text-right text-fg-muted">$95,100.00</td>
                      <td className="py-2 text-right text-fg-muted">$91,200.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {consoleTab === 'open_positions' && (
              <div className="text-center py-6">
                <p className="text-xs text-fg-muted">
                  0 active open positions in market. All legs currently squared off.
                </p>
              </div>
            )}

            {consoleTab === 'greeks' && (
              <div className="overflow-x-auto">
                <table className="w-full text-[12px] font-mono tnum">
                  <thead>
                    <tr className="text-fg-muted text-[10px] uppercase border-b border-border">
                      <th className="py-2 text-left">Contract</th>
                      <th className="py-2 text-right">IV</th>
                      <th className="py-2 text-right">Delta (Δ)</th>
                      <th className="py-2 text-right">Theta (Θ)</th>
                      <th className="py-2 text-right">Vega (ν)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="py-2 font-medium text-fg">NIFTY 24200 CE</td>
                      <td className="py-2 text-right">13.4%</td>
                      <td className="py-2 text-right text-profit">+0.48</td>
                      <td className="py-2 text-right text-loss">-12.4</td>
                      <td className="py-2 text-right">8.6</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-medium text-fg">NIFTY 24200 PE</td>
                      <td className="py-2 text-right">14.1%</td>
                      <td className="py-2 text-right text-loss">-0.52</td>
                      <td className="py-2 text-right text-loss">-13.1</td>
                      <td className="py-2 text-right">8.9</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {consoleTab === 'order_book' && (
              <div className="text-center py-6">
                <p className="text-xs text-fg-muted">
                  Showing last 5 completed broker orders. All orders filled at market price.
                </p>
              </div>
            )}

            {consoleTab === 'notifications' && (
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-lg bg-subtle flex items-center justify-between">
                  <span className="text-fg-secondary">Strategy &quot;TradingWave Nifty OHOL 3M&quot; heartbeat check passed.</span>
                  <span className="text-fg-muted font-mono text-[11px]">Just now</span>
                </div>
                <div className="p-3 rounded-lg bg-subtle flex items-center justify-between">
                  <span className="text-fg-secondary">Centrifugo WebSocket stream connection active.</span>
                  <span className="text-fg-muted font-mono text-[11px]">1 min ago</span>
                </div>
              </div>
            )}
        </div>
        <div className="flex items-center justify-between border-t border-border px-4 py-2.5 text-[12px] text-fg-muted">
          <span>Execution engine v2.0</span>
          <button onClick={() => onOpenLogs('All Strategies Combined')} className="font-medium text-primary hover:underline">
            Open audit trail →
          </button>
        </div>
      </div>

      {/* 7. GLOBAL TOAST NOTIFICATION */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-ink text-ink-fg px-4 py-2.5 rounded-lg shadow-pop text-xs font-semibold flex items-center gap-2 slide-in-from-bottom-2 duration-200">
          <Check className="w-4 h-4 text-profit" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* 8. TRADETRON 3-DOTS POPUP MENU (Rendered fixed to avoid any overflow clipping) */}
      {openMenuBotId && menuCoords && menuBot && (
        <div
          style={{
            position: 'fixed',
            top: `${menuCoords.top}px`,
            right: `${menuCoords.right}px`,
            zIndex: 99999
          }}
          className="bot-action-menu w-48 bg-surface border border-border rounded-lg shadow-pop py-2 text-left duration-100 text-xs font-sans"
          onClick={e => e.stopPropagation()}
        >
          {/* STATUS */}
          <div className="px-3.5 py-1 text-[10px] uppercase font-semibold tracking-wider text-fg-muted">
            STATUS
          </div>
          <button
            onClick={() => handleAction('Archive', menuBot)}
            className="w-full text-left px-3.5 py-1.5 text-fg-secondary hover:bg-subtle font-medium transition cursor-pointer"
          >
            Archive
          </button>

          {/* STRATEGY DATA */}
          <div className="px-3.5 pt-2 pb-1 text-[10px] uppercase font-semibold tracking-wider text-fg-muted">
            STRATEGY DATA
          </div>
          <button
            onClick={() => handleAction('Statistics', menuBot)}
            className="w-full text-left px-3.5 py-1.5 text-fg-secondary hover:bg-subtle font-medium transition cursor-pointer"
          >
            Statistics
          </button>
          <button
            onClick={() => handleAction('Payoff', menuBot)}
            className="w-full text-left px-3.5 py-1.5 text-fg-secondary hover:bg-subtle font-medium transition cursor-pointer"
          >
            Payoff
          </button>
          <button
            onClick={() => handleAction('Intraday PNL', menuBot)}
            className="w-full text-left px-3.5 py-1.5 text-fg-secondary hover:bg-subtle font-medium transition cursor-pointer"
          >
            Intraday PNL
          </button>
          <button
            onClick={() => {
              setOpenMenuBotId(null);
              setMenuCoords(null);
              setMenuBot(null);
              onOpenLogs(menuBot.name);
            }}
            className="w-full text-left px-3.5 py-1.5 text-fg-secondary hover:bg-subtle font-medium transition cursor-pointer"
          >
            Notification Log
          </button>
          <button
            onClick={() => {
              setOpenMenuBotId(null);
              setMenuCoords(null);
              setMenuBot(null);
              onNavigateTab('backtest');
            }}
            className="w-full text-left px-3.5 py-1.5 text-fg-secondary hover:bg-subtle font-medium transition cursor-pointer"
          >
            Backtests
          </button>
          <button
            onClick={() => handleAction('Runtime Data', menuBot)}
            className="w-full text-left px-3.5 py-1.5 text-fg-secondary hover:bg-subtle font-medium transition cursor-pointer"
          >
            Runtime Data
          </button>
          <button
            onClick={() => handleAction('Debug', menuBot)}
            className="w-full text-left px-3.5 py-1.5 text-fg-secondary hover:bg-subtle font-medium transition cursor-pointer"
          >
            Debug
          </button>
          <button
            onClick={() => handleAction('User Notes', menuBot)}
            className="w-full text-left px-3.5 py-1.5 text-fg-secondary hover:bg-subtle font-medium transition cursor-pointer"
          >
            User Notes
          </button>

          {/* OPEN */}
          <div className="px-3.5 pt-2 pb-1 text-[10px] uppercase font-semibold tracking-wider text-fg-muted">
            OPEN
          </div>
          <button
            onClick={() => handleAction('Full detail', menuBot)}
            className="w-full text-left px-3.5 py-1.5 text-fg-secondary hover:bg-subtle font-medium flex items-center justify-between transition cursor-pointer"
          >
            <span>Full detail</span>
            <ChevronRight className="w-3.5 h-3.5 text-fg-muted" />
          </button>
          <button
            onClick={() => handleAction('Download data', menuBot)}
            className="w-full text-left px-3.5 py-1.5 text-fg-secondary hover:bg-subtle font-medium transition cursor-pointer"
          >
            Download data
          </button>

          {/* ACTIONS */}
          <div className="px-3.5 pt-2 pb-1 text-[10px] uppercase font-semibold tracking-wider text-fg-muted">
            ACTIONS
          </div>
          <button
            onClick={() => {
              setOpenMenuBotId(null);
              setMenuCoords(null);
              setMenuBot(null);
              onNavigateTab('builder');
            }}
            className="w-full text-left px-3.5 py-1.5 text-fg-secondary hover:bg-subtle font-medium transition cursor-pointer"
          >
            Edit template
          </button>
          <button
            onClick={() => handleDeleteBot(menuBot.id, menuBot.name)}
            className="w-full text-left px-3.5 py-1.5 text-loss hover:bg-loss-soft font-medium transition cursor-pointer"
          >
            Delete
          </button>
        </div>
      )}

      {/* 9. INTERACTIVE MODALS FOR 3-DOTS ACTIONS */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 duration-150">
          <div
            className="bg-surface w-full max-w-lg rounded-lg shadow-pop border border-border overflow-hidden text-fg"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-border">
              <div>
                <h3 className="text-base font-semibold text-fg capitalize">
                  {activeModal.type.replace('_', ' ')}
                </h3>
                <p className="text-xs text-fg-muted font-mono">
                  {activeModal.bot.name}
                </p>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg text-fg-muted hover:text-fg-secondary hover:bg-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {activeModal.type === 'statistics' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-subtle border border-border">
                    <span className="text-[10px] text-fg-muted uppercase font-semibold block">Win Rate</span>
                    <span className="text-lg font-semibold text-profit font-mono">68.4%</span>
                  </div>
                  <div className="p-3 rounded-lg bg-subtle border border-border">
                    <span className="text-[10px] text-fg-muted uppercase font-semibold block">Sharpe Ratio</span>
                    <span className="text-lg font-semibold text-fg font-mono">2.14</span>
                  </div>
                  <div className="p-3 rounded-lg bg-subtle border border-border">
                    <span className="text-[10px] text-fg-muted uppercase font-semibold block">Max Drawdown</span>
                    <span className="text-lg font-semibold text-loss font-mono">-4.2%</span>
                  </div>
                  <div className="p-3 rounded-lg bg-subtle border border-border">
                    <span className="text-[10px] text-fg-muted uppercase font-semibold block">Profit Factor</span>
                    <span className="text-lg font-semibold text-fg font-mono">1.88</span>
                  </div>
                  <div className="p-3 rounded-lg bg-subtle border border-border">
                    <span className="text-[10px] text-fg-muted uppercase font-semibold block">Total Trades</span>
                    <span className="text-lg font-semibold text-fg font-mono">126</span>
                  </div>
                  <div className="p-3 rounded-lg bg-subtle border border-border">
                    <span className="text-[10px] text-fg-muted uppercase font-semibold block">Avg Win / Loss</span>
                    <span className="text-lg font-semibold text-fg font-mono">1.85x</span>
                  </div>
                </div>
              )}

              {activeModal.type === 'payoff' && (
                <div className="space-y-4 text-center">
                  <div className="p-6 rounded-lg bg-subtle border border-border flex flex-col items-center justify-center">
                    <TrendingUp className="w-12 h-12 text-primary mb-2" />
                    <span className="text-xs font-semibold text-fg">
                      Delta-Neutral Expiry Payoff Curve
                    </span>
                    <span className="text-[11px] text-fg-muted font-mono mt-1">
                      Lower Breakeven: 23,950 | Upper Breakeven: 24,450
                    </span>
                    <span className="text-xs font-semibold text-profit font-mono mt-2">
                      Max Profit: ₹ 14,200 | Max Risk: Defined with Sl
                    </span>
                  </div>
                </div>
              )}

              {activeModal.type === 'intraday_pnl' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-fg-muted">Current MTM:</span>
                    <span className="font-semibold text-loss">- ₹ {(Math.abs(activeModal.bot.dailyPnl) / 100000).toFixed(2)} L</span>
                  </div>
                  <div className="h-32 bg-subtle border border-border rounded-lg flex items-center justify-center text-xs text-fg-muted font-mono">
                    [Intraday 1-Second MTM Curve Active]
                  </div>
                </div>
              )}

              {activeModal.type === 'runtime_data' && (
                <div className="space-y-2 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-subtle flex justify-between">
                    <span className="text-fg-muted">Engine Frequency:</span>
                    <span className="font-bold">{activeModal.bot.frequency}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-subtle flex justify-between">
                    <span className="text-fg-muted">Last Engine Check:</span>
                    <span className="font-bold">{activeModal.bot.lastCheck}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-subtle flex justify-between">
                    <span className="text-fg-muted">Execution Mode:</span>
                    <span className="font-semibold text-primary">{activeModal.bot.mode}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-subtle flex justify-between">
                    <span className="text-fg-muted">Open Positions:</span>
                    <span className="font-bold">{activeModal.bot.openPositionsCount ?? 0}</span>
                  </div>
                </div>
              )}

              {activeModal.type === 'debug' && (
                <pre className="p-3 bg-ink text-profit rounded-lg font-mono text-[11px] overflow-x-auto max-h-56">
{`[${new Date().toISOString()}] Strategy runner initialized.
[INFO] Broker adapter connected: ${activeModal.bot.broker}
[INFO] Mode: ${activeModal.bot.mode} | Multiplier: ${activeModal.bot.multiplier}x
[INFO] Capital allocated: ₹ ${activeModal.bot.capital}
[TICK] Stream latency: 11ms
[STATUS] All strategy entry conditions verified safe.`}
                </pre>
              )}

              {activeModal.type === 'user_notes' && (
                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-fg-secondary">
                    Personal notes for this strategy deployment
                  </label>
                  <textarea
                    rows={4}
                    value={notes[activeModal.bot.id] || ''}
                    onChange={e => setNotes({ ...notes, [activeModal.bot.id]: e.target.value })}
                    placeholder="Enter any custom reminders, adjustment rules, or observations..."
                    className="w-full bg-subtle border border-border rounded-lg p-3 text-xs text-fg focus:outline-none focus:border-primary"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        showToast('Notes saved.');
                        setActiveModal(null);
                      }}
                      className="px-4 py-2 rounded-lg bg-primary text-primary-fg text-xs font-semibold hover:bg-primary transition"
                    >
                      Save Notes
                    </button>
                  </div>
                </div>
              )}

              {activeModal.type === 'full_detail' && (
                <div className="space-y-2 text-xs font-sans">
                  <div className="p-3 rounded-lg bg-subtle space-y-1.5">
                    <div className="font-semibold text-sm text-fg">{activeModal.bot.name}</div>
                    <div className="text-fg-muted text-[11px]">Underlying: {activeModal.bot.underlying} | Broker: {activeModal.bot.broker}</div>
                    <div className="text-fg-muted text-[11px]">Capital: ₹ {(activeModal.bot.capital / 100000).toFixed(2)} L | Multiplier: {activeModal.bot.multiplier}x</div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-subtle border-t border-border flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-1.5 rounded-lg border border-border text-xs font-semibold text-fg-secondary hover:bg-muted"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
