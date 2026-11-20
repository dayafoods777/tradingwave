'use client';

import React, { useState } from 'react';
import {
  LayoutGrid,
  Plus,
  Play,
  RotateCcw,
  Cpu,
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  Layers,
  Wand2,
  CheckCircle2,
  Sliders,
  Copy,
  ExternalLink,
  ChevronRight,
  Trash2,
  CheckSquare,
  Square,
  Heart,
  Pencil,
  Share2,
  Lock,
  X,
  Code,
  Check
} from 'lucide-react';

export interface StrategyItem {
  id: string;
  name: string;
  author: string;
  createdAgo: string;
  liveDeploys: number;
  segment: 'DELTAINDIA' | 'MCX' | 'NFO' | 'NSE' | 'BSE';
  minCapitalDisplay: string;
  minCapitalRaw: number;
  type: 'ASB' | 'Option Wizard' | 'Advanced Wizard' | 'API' | 'Stock Bag';
  visibility: 'PRIVATE' | 'PRIVATE_LINK';
  isFavorite?: boolean;
  description: string;
}

const TRADETRON_STRATEGIES: StrategyItem[] = [
  {
    id: 'strat_btcusd_01',
    name: 'TradingWave BTCUSD OHOL 5M',
    author: 'algobulls',
    createdAgo: '3 months ago',
    liveDeploys: 0,
    segment: 'DELTAINDIA',
    minCapitalDisplay: '$ 500',
    minCapitalRaw: 500,
    type: 'ASB',
    visibility: 'PRIVATE',
    description: 'Open High Open Low breakout strategy on BTCUSD 5-minute candle with dynamic ATR stop-loss.'
  },
  {
    id: 'strat_btcusd_02',
    name: 'TradingWave BTCUSD O1M 2',
    author: 'algobulls',
    createdAgo: '3 months ago',
    liveDeploys: 0,
    segment: 'DELTAINDIA',
    minCapitalDisplay: '$ 50',
    minCapitalRaw: 50,
    type: 'ASB',
    visibility: 'PRIVATE',
    description: '1-minute high frequency momentum scalp on Bitcoin perpetual contracts.'
  },
  {
    id: 'strat_crude_01',
    name: 'TradingWave CrudeoilM OHOL 3M',
    author: 'algobulls',
    createdAgo: '3 months ago',
    liveDeploys: 0,
    segment: 'MCX',
    minCapitalDisplay: '₹ 7,000',
    minCapitalRaw: 7000,
    type: 'ASB',
    visibility: 'PRIVATE',
    description: 'MCX Crude Oil Mini 3-minute OHOL opening range breakout with trailing stoploss.'
  },
  {
    id: 'strat_nifty_01',
    name: 'TradingWave Nifty OHOL 3M',
    author: 'algobulls',
    createdAgo: '3 months ago',
    liveDeploys: 0,
    segment: 'NFO',
    minCapitalDisplay: '₹ 1,00,000',
    minCapitalRaw: 100000,
    type: 'ASB',
    visibility: 'PRIVATE',
    description: 'NIFTY Index 3m opening candle range break with ATM Call & Put momentum filters.'
  },
  {
    id: 'strat_btcusd_03',
    name: 'TradingWave BTCUSD R1P 1M',
    author: 'algobulls',
    createdAgo: '3 months ago',
    liveDeploys: 0,
    segment: 'DELTAINDIA',
    minCapitalDisplay: '$ 250',
    minCapitalRaw: 250,
    type: 'ASB',
    visibility: 'PRIVATE',
    description: 'Mean-reversion relative price range pullback on BTCUSD 1-minute timeframe.'
  },
  {
    id: 'strat_crude_02',
    name: 'TradingWave CrudeoilM D37 3M',
    author: 'algobulls',
    createdAgo: '3 months ago',
    liveDeploys: 0,
    segment: 'MCX',
    minCapitalDisplay: '₹ 1,00,000',
    minCapitalRaw: 100000,
    type: 'ASB',
    visibility: 'PRIVATE',
    description: '3-minute directional momentum trend-following on MCX Crude Oil futures with delta hedging.'
  },
  {
    id: 'strat_crude_03',
    name: 'TradingWave Crudeoil M R10P 3M',
    author: 'algobulls',
    createdAgo: '4 months ago',
    liveDeploys: 0,
    segment: 'MCX',
    minCapitalDisplay: '₹ 1,00,000',
    minCapitalRaw: 100000,
    type: 'ASB',
    visibility: 'PRIVATE',
    description: 'Reversal 10-period pivot breakout on MCX Crude Oil Mini contracts.'
  },
  {
    id: 'strat_indices_01',
    name: 'TradingWave Dev Indices O3M',
    author: 'algobulls',
    createdAgo: '4 months ago',
    liveDeploys: 0,
    segment: 'NFO',
    minCapitalDisplay: '₹ 2,00,000',
    minCapitalRaw: 200000,
    type: 'ASB',
    visibility: 'PRIVATE',
    description: 'Multi-index sector divergence pair-trading between NIFTY and BANKNIFTY.'
  },
  {
    id: 'strat_straddle_01',
    name: 'TradingWave 9:20 Intraday Short Straddle',
    author: 'algobulls',
    createdAgo: '4 months ago',
    liveDeploys: 0,
    segment: 'NFO',
    minCapitalDisplay: '₹ 1,50,000',
    minCapitalRaw: 150000,
    type: 'ASB',
    visibility: 'PRIVATE',
    description: 'Flagship intraday delta-neutral theta decay selling ATM CE and PE at 09:20 AM.'
  },
  {
    id: 'strat_condor_01',
    name: 'TradingWave Weekly Iron Condor',
    author: 'algobulls',
    createdAgo: '5 months ago',
    liveDeploys: 0,
    segment: 'NFO',
    minCapitalDisplay: '₹ 1,00,000',
    minCapitalRaw: 100000,
    type: 'Option Wizard',
    visibility: 'PRIVATE',
    description: 'Defined-risk 4-legged range bound condor with protective wings on NIFTY index.'
  }
];

interface MyStrategiesViewProps {
  onCreateNew: () => void;
  onEditStrategy: (strategyName: string) => void;
  onDeployStrategy: (strategyName: string) => void;
  onBacktestStrategy: (strategyName: string) => void;
  onNavigateTab?: (tab: any) => void;
}

export default function MyStrategiesView({
  onCreateNew,
  onEditStrategy,
  onDeployStrategy,
  onBacktestStrategy,
  onNavigateTab
}: MyStrategiesViewProps) {
  const [strategies, setStrategies] = useState<StrategyItem[]>(TRADETRON_STRATEGIES);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedVisibility, setSelectedVisibility] = useState<string>('All');
  const [selectedExchange, setSelectedExchange] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'NEWEST' | 'OLDEST' | 'NAME' | 'CAPITAL_ASC' | 'CAPITAL_DESC'>('NEWEST');

  // API Modal State
  const [apiModalStrategy, setApiModalStrategy] = useState<StrategyItem | null>(null);
  const [copiedText, setCopiedText] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filter types list matching Tradetron
  const typeFilters = [
    'All',
    'Favourites',
    'Created',
    'Subscribed',
    'Option Wizard',
    'Advanced Wizard',
    'ASB',
    'API',
    'Stock Bag'
  ];

  // Exchanges list matching Tradetron
  const exchangeFilters = ['DELTAINDIA', 'MCX', 'NFO', 'NSE', 'BSE'];

  // Toggle favorite
  const toggleFavorite = (id: string) => {
    setStrategies(prev =>
      prev.map(s => (s.id === id ? { ...s, isFavorite: !s.isFavorite } : s))
    );
  };

  // Duplicate strategy
  const handleDuplicate = (strat: StrategyItem) => {
    const copy: StrategyItem = {
      ...strat,
      id: `strat_${Date.now()}`,
      name: `${strat.name} (Copy)`
    };
    setStrategies(prev => [copy, ...prev]);
    showToast(`Duplicated "${strat.name}" successfully!`);
  };

  // Delete single strategy
  const handleDeleteSingle = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      setStrategies(prev => prev.filter(s => s.id !== id));
      setSelectedIds(prev => prev.filter(x => x !== id));
      showToast(`Deleted "${name}"`);
    }
  };

  // Bulk delete
  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    if (confirm(`Are you sure you want to delete ${selectedIds.length} selected strategy(ies)?`)) {
      setStrategies(prev => prev.filter(s => !selectedIds.includes(s.id)));
      setSelectedIds([]);
      showToast(`Deleted ${selectedIds.length} strategy(ies).`);
    }
  };

  // Filter logic
  const filteredStrategies = strategies
    .filter(s => {
      const matchSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.segment.toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchType = true;
      if (selectedType === 'Favourites') matchType = !!s.isFavorite;
      else if (selectedType === 'Option Wizard') matchType = s.type === 'Option Wizard';
      else if (selectedType === 'ASB') matchType = s.type === 'ASB';
      else if (selectedType === 'Advanced Wizard') matchType = s.type === 'Advanced Wizard';
      else if (selectedType === 'API') matchType = s.type === 'API';
      else if (selectedType === 'Stock Bag') matchType = s.type === 'Stock Bag';

      let matchVis = true;
      if (selectedVisibility === 'Private') matchVis = s.visibility === 'PRIVATE';
      else if (selectedVisibility === 'Private Link') matchVis = s.visibility === 'PRIVATE_LINK';

      let matchExchange = true;
      if (selectedExchange !== 'All') matchExchange = s.segment === selectedExchange;

      return matchSearch && matchType && matchVis && matchExchange;
    })
    .sort((a, b) => {
      if (sortBy === 'NAME') return a.name.localeCompare(b.name);
      if (sortBy === 'CAPITAL_ASC') return a.minCapitalRaw - b.minCapitalRaw;
      if (sortBy === 'CAPITAL_DESC') return b.minCapitalRaw - a.minCapitalRaw;
      return 0;
    });

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedType('All');
    setSelectedVisibility('All');
    setSelectedExchange('All');
  };

  const handleShare = (strat: StrategyItem) => {
    const url = `https://tradingwave.tech/strategy/${strat.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      showToast(`Copied private link for "${strat.name}" to clipboard!`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-white dark:bg-[#131B2E] border border-[#5B45E0] text-slate-900 dark:text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in duration-150">
          <span className="w-2.5 h-2.5 rounded-full bg-[#5B45E0] animate-pulse"></span>
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* 1. TOP BANNER - Tradetron Signature Header */}
      <div className="relative p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-[#F8F7FF] via-white to-white dark:from-[#131B2E] dark:via-[#131B2E] dark:to-[#0E1526] border-2 border-[#5B45E0] dark:border-[#6366F1] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors">
        <div>
          {/* Eyebrow */}
          <div className="flex items-center gap-1.5 text-[#5B45E0] dark:text-[#818CF8] font-bold text-[11px] tracking-widest uppercase mb-1">
            <span className="w-3.5 h-[2px] bg-[#5B45E0] dark:bg-[#818CF8] inline-block rounded-full"></span>
            <span className="w-3.5 h-[2px] bg-[#5B45E0] dark:bg-[#818CF8] inline-block rounded-full"></span>
            <span>STRATEGIES</span>
          </div>

          {/* Title */}
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            My Strategies
          </h2>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Everything you&apos;ve built and subscribed to, ready to deploy.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleBulkDelete}
            disabled={selectedIds.length === 0}
            className={`px-4 py-2 rounded-full border text-xs font-bold shadow-sm transition flex items-center gap-2 ${
              selectedIds.length > 0
                ? 'border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 hover:bg-red-100 cursor-pointer'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0E1526] text-red-600/50 dark:text-red-400/50 cursor-not-allowed'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Bulk delete {selectedIds.length > 0 ? `(${selectedIds.length})` : ''}</span>
          </button>

          <button
            onClick={onCreateNew}
            className="px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0E1526] text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold shadow-sm transition flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>New strategy</span>
          </button>
        </div>
      </div>

      {/* 2. SUB-NAVIGATION TABS STRIP (Marketplace excluded) */}
      <div className="flex items-center gap-8 border-b border-slate-200 dark:border-[#1E293B] text-sm font-semibold">
        <button
          onClick={() => onNavigateTab && onNavigateTab('dashboard')}
          className="pb-3 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition"
        >
          Deployed
        </button>
        <button
          className="pb-3 text-[#5B45E0] dark:text-[#818CF8] border-b-2 border-[#5B45E0] dark:border-[#818CF8] font-bold"
        >
          My Strategies
        </button>
        <button
          onClick={() => onNavigateTab && onNavigateTab('backtest')}
          className="pb-3 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition"
        >
          Backtest
        </button>
      </div>

      {/* 3. METRIC COUNTERS STRIP (Marketplace excluded) */}
      <div className="rounded-2xl border border-slate-200 dark:border-[#1E293B] bg-white dark:bg-[#131B2E] overflow-hidden shadow-sm grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 dark:divide-[#1E293B] transition-colors">
        <div className="p-4 sm:p-5">
          <span className="text-[10px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
            Private
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-1">
            {strategies.filter(s => s.visibility === 'PRIVATE').length}
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <span className="text-[10px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
            Private Link
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-1">
            {strategies.filter(s => s.visibility === 'PRIVATE_LINK').length}
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <span className="text-[10px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
            Option Wizard
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-1">
            {strategies.filter(s => s.type === 'Option Wizard').length}
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <span className="text-[10px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
            Subscribed
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-1">
            0
          </div>
        </div>
      </div>

      {/* 4. MAIN SPLIT LAYOUT: LEFT SIDEBAR FILTERS + RIGHT STRATEGIES LIST */}
      <div className="flex flex-col lg:flex-row items-start gap-6">
        {/* LEFT SIDEBAR: FILTERS */}
        <aside className="w-full lg:w-72 shrink-0 space-y-6">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search name..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-[#1E293B] rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#5B45E0] shadow-sm transition"
            />
          </div>

          {/* TYPE Filters */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <span>Type</span>
              <button
                onClick={clearAllFilters}
                className="text-[#5B45E0] dark:text-[#818CF8] hover:underline font-semibold capitalize tracking-normal text-xs"
              >
                Clear all
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {typeFilters.map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                    selectedType === type
                      ? 'bg-[#5B45E0] text-white shadow-sm'
                      : 'bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-[#1E293B] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* VISIBILITY Filters */}
          <div className="space-y-2.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Visibility
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedVisibility(selectedVisibility === 'Private' ? 'All' : 'Private')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                  selectedVisibility === 'Private'
                    ? 'bg-[#5B45E0] text-white shadow-sm'
                    : 'bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-[#1E293B] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                Private {strategies.filter(s => s.visibility === 'PRIVATE').length}
              </button>
              <button
                onClick={() => setSelectedVisibility(selectedVisibility === 'Private Link' ? 'All' : 'Private Link')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                  selectedVisibility === 'Private Link'
                    ? 'bg-[#5B45E0] text-white shadow-sm'
                    : 'bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-[#1E293B] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                Private Link {strategies.filter(s => s.visibility === 'PRIVATE_LINK').length}
              </button>
            </div>
          </div>

          {/* EXCHANGES Filters */}
          <div className="space-y-2.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Exchanges
            </div>
            <div className="flex flex-wrap gap-1.5">
              {exchangeFilters.map(ex => (
                <button
                  key={ex}
                  onClick={() => setSelectedExchange(selectedExchange === ex ? 'All' : ex)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition ${
                    selectedExchange === ex
                      ? 'bg-[#5B45E0] text-white shadow-sm'
                      : 'bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-[#1E293B] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* RIGHT MAIN AREA: STRATEGIES LIST */}
        <div className="flex-1 w-full space-y-4">
          {/* Header Bar: Count + Sort */}
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">
              {filteredStrategies.length} strategies
            </span>

            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-[#1E293B] rounded-xl px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:border-[#5B45E0] shadow-sm cursor-pointer"
            >
              <option value="NEWEST">Newest first</option>
              <option value="OLDEST">Oldest first</option>
              <option value="NAME">Name (A-Z)</option>
              <option value="CAPITAL_ASC">Min Capital: Low to High</option>
              <option value="CAPITAL_DESC">Min Capital: High to Low</option>
            </select>
          </div>

          {/* Strategies Rows matching Tradetron Card Strip */}
          <div className="space-y-3">
            {filteredStrategies.map(strat => {
              return (
                <div
                  key={strat.id}
                  className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-[#1E293B] shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4"
                >
                  {/* Left: Badges + Title + Metadata */}
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F0EDFF] dark:bg-[#1E1B4B] text-[#5B45E0] dark:text-[#818CF8] text-[10px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#5B45E0] dark:bg-[#818CF8]"></span>
                        <span>{strat.type}</span>
                      </span>

                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700 text-slate-500 text-[10px] font-semibold uppercase tracking-wider">
                        <Lock className="w-2.5 h-2.5" />
                        <span>{strat.visibility}</span>
                      </span>
                    </div>

                    <h3 className="text-base font-black text-slate-900 dark:text-white truncate">
                      {strat.name}
                    </h3>

                    <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                      <span>by <strong className="text-slate-700 dark:text-slate-300">{strat.author}</strong></span>
                      <span>·</span>
                      <span>created {strat.createdAgo}</span>
                      <span>·</span>
                      <span>{strat.liveDeploys} live deploys</span>
                    </div>
                  </div>

                  {/* Middle: Segment & Min Capital */}
                  <div className="flex items-center gap-8 px-2 xl:px-6 shrink-0">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-0.5">
                        Segment
                      </span>
                      <span className="text-xs font-black text-slate-800 dark:text-slate-200 font-mono uppercase">
                        {strat.segment}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-0.5">
                        Min Capital
                      </span>
                      <span className="text-sm font-black text-slate-900 dark:text-white font-mono">
                        {strat.minCapitalDisplay}
                      </span>
                    </div>
                  </div>

                  {/* Right Action Icons Strip & Deploy Button */}
                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 self-end xl:self-center">
                    {/* Favorite Button */}
                    <button
                      onClick={() => toggleFavorite(strat.id)}
                      className={`p-2 rounded-xl border transition ${
                        strat.isFavorite
                          ? 'border-red-300 bg-red-50 text-red-600 dark:bg-red-950/40 dark:border-red-900'
                          : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                      title="Favorite"
                    >
                      <Heart className={`w-3.5 h-3.5 ${strat.isFavorite ? 'fill-red-600' : ''}`} />
                    </button>

                    {/* Copy / Duplicate Button */}
                    <button
                      onClick={() => handleDuplicate(strat)}
                      className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                      title="Duplicate Strategy"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    {/* Edit Button */}
                    <button
                      onClick={() => onEditStrategy(strat.name)}
                      className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                      title="Edit in Strategy Builder"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>

                    {/* BackTest Button */}
                    <button
                      onClick={() => onBacktestStrategy(strat.name)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                    >
                      BackTest
                    </button>

                    {/* Share Button */}
                    <button
                      onClick={() => handleShare(strat)}
                      className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                      title="Share Private Link"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteSingle(strat.id, strat.name)}
                      className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition"
                      title="Delete Strategy"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    {/* API Pill Button */}
                    <button
                      onClick={() => setApiModalStrategy(strat)}
                      className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-mono transition"
                      title="API Webhooks & PineBridge"
                    >
                      API
                    </button>

                    {/* Deploy Button */}
                    <button
                      onClick={() => onDeployStrategy(strat.name)}
                      className="px-5 py-1.5 rounded-xl bg-[#5B45E0] hover:bg-[#4E38D0] text-white text-xs font-bold shadow-md shadow-indigo-500/20 active:scale-95 transition flex items-center gap-1.5"
                    >
                      <span>Deploy</span>
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredStrategies.length === 0 && (
              <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-[#1E293B]">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  No strategies match your filter criteria.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="mt-3 text-xs text-[#5B45E0] font-bold hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5. API WEBHOOK MODAL */}
      {apiModalStrategy && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-xl w-full bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-[#1E293B] rounded-2xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1E293B] pb-3">
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-[#5B45E0]" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  API & Webhook Execution Endpoint
                </h3>
              </div>
              <button
                onClick={() => setApiModalStrategy(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-1">
                  Strategy: <strong className="text-slate-800 dark:text-slate-200">{apiModalStrategy.name}</strong>
                </label>
              </div>

              <div>
                <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-1">
                  Webhook Dispatch URL
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`https://api.tradingwave.tech/v1/webhook/${apiModalStrategy.id}`}
                    className="flex-1 bg-slate-50 dark:bg-[#0E1526] border border-slate-200 dark:border-[#1E293B] rounded-xl px-3 py-2 font-mono text-slate-800 dark:text-slate-200 text-xs"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`https://api.tradingwave.tech/v1/webhook/${apiModalStrategy.id}`);
                      setCopiedText(true);
                      setTimeout(() => setCopiedText(false), 2000);
                    }}
                    className="px-3 py-2 rounded-xl bg-[#5B45E0] text-white text-xs font-bold hover:brightness-110 flex items-center gap-1 transition shrink-0"
                  >
                    {copiedText ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedText ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-500 dark:text-slate-400 font-semibold mb-1">
                  TradingView PineScript Alert Message
                </label>
                <pre className="p-3 bg-slate-900 text-emerald-400 rounded-xl font-mono text-[11px] overflow-x-auto">
{`{
  "strategy": "${apiModalStrategy.name}",
  "action": "{{strategy.order.action}}",
  "contracts": {{strategy.order.contracts}},
  "price": {{close}},
  "token": "tw_live_wh_${apiModalStrategy.id.slice(0, 10)}"
}`}
                </pre>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setApiModalStrategy(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 transition"
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
