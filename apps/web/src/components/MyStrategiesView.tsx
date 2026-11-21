'use client';

import React, { useState } from 'react';
import DeployModal, { DeployConfig } from './DeployModal';
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

export const TRADETRON_STRATEGIES: StrategyItem[] = [
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
  onDeployStrategy: (strategyName: string, deployConfig?: any) => void;
  onBacktestStrategy: (strategyName: string) => void;
  onNavigateTab?: (tab: any) => void;
  strategies?: StrategyItem[];
  setStrategies?: React.Dispatch<React.SetStateAction<StrategyItem[]>>;
}

export default function MyStrategiesView({
  onCreateNew,
  onEditStrategy,
  onDeployStrategy,
  onBacktestStrategy,
  onNavigateTab,
  strategies: propsStrategies,
  setStrategies: propsSetStrategies
}: MyStrategiesViewProps) {
  const [localStrategies, setLocalStrategies] = useState<StrategyItem[]>(TRADETRON_STRATEGIES);
  const strategies = propsStrategies ?? localStrategies;
  const setStrategies = propsSetStrategies ?? setLocalStrategies;
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedVisibility, setSelectedVisibility] = useState<string>('All');
  const [selectedExchange, setSelectedExchange] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'NEWEST' | 'OLDEST' | 'NAME' | 'CAPITAL_ASC' | 'CAPITAL_DESC'>('NEWEST');

  // Deploy Modal State
  const [deployModalStrategy, setDeployModalStrategy] = useState<StrategyItem | null>(null);

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
        <div className="fixed bottom-6 right-6 z-50 bg-surface border border-primary text-fg px-5 py-3 rounded-lg shadow-pop flex items-center gap-3 duration-150">
          <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* 1. TOP BANNER - Tradetron Signature Header */}
      <div className="relative p-6 sm:p-7 rounded-lg bg-subtle border-2 border-primary flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors">
        <div>
          {/* Eyebrow */}
          <div className="flex items-center gap-1.5 text-primary font-semibold text-[11px] tracking-widest uppercase mb-1">
            <span className="w-3.5 h-[2px] bg-primary inline-block rounded-full"></span>
            <span className="w-3.5 h-[2px] bg-primary inline-block rounded-full"></span>
            <span>STRATEGIES</span>
          </div>

          {/* Title */}
          <h2 className="text-2xl sm:text-3xl font-semibold text-fg tracking-tight">
            My Strategies
          </h2>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-fg-muted mt-1">
            Everything you&apos;ve built and subscribed to, ready to deploy.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleBulkDelete}
            disabled={selectedIds.length === 0}
            className={`px-4 py-2 rounded-full border text-xs font-semibold transition flex items-center gap-2 ${
              selectedIds.length > 0
                ? 'border-loss/30 bg-loss-soft text-loss hover:bg-loss-soft cursor-pointer'
                : 'border-border bg-surface text-loss/50 cursor-not-allowed'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Bulk delete {selectedIds.length > 0 ? `(${selectedIds.length})` : ''}</span>
          </button>

          <button
            onClick={onCreateNew}
            className="px-4 py-2 rounded-full border border-border bg-surface text-fg hover:bg-subtle text-xs font-semibold transition flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>New strategy</span>
          </button>
        </div>
      </div>

      {/* 2. SUB-NAVIGATION TABS STRIP (Ready Strategies after My Strategies - SS1) */}
      <div className="flex items-center gap-8 border-b border-border text-sm font-semibold">
        <button
          onClick={() => onNavigateTab && onNavigateTab('dashboard')}
          className="pb-3 text-fg-muted hover:text-fg transition"
        >
          Deployed
        </button>
        <button
          className="pb-3 text-primary border-b-2 border-primary font-semibold"
        >
          My Strategies
        </button>
        <button
          onClick={() => onNavigateTab && onNavigateTab('readystrategies')}
          className="pb-3 text-fg-muted hover:text-fg transition"
        >
          Ready Strategies
        </button>
        <button
          onClick={() => onNavigateTab && onNavigateTab('backtest')}
          className="pb-3 text-fg-muted hover:text-fg transition"
        >
          Backtest
        </button>
      </div>

      {/* 3. METRIC COUNTERS STRIP (Marketplace excluded) */}
      <div className="rounded-lg border border-border bg-surface overflow-hidden grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-border transition-colors">
        <div className="p-4 sm:p-5">
          <span className="text-[10px] font-semibold tracking-wider text-fg-muted uppercase">
            Private
          </span>
          <div className="text-2xl font-semibold text-fg font-mono mt-1">
            {strategies.filter(s => s.visibility === 'PRIVATE').length}
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <span className="text-[10px] font-semibold tracking-wider text-fg-muted uppercase">
            Private Link
          </span>
          <div className="text-2xl font-semibold text-fg font-mono mt-1">
            {strategies.filter(s => s.visibility === 'PRIVATE_LINK').length}
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <span className="text-[10px] font-semibold tracking-wider text-fg-muted uppercase">
            Option Wizard
          </span>
          <div className="text-2xl font-semibold text-fg font-mono mt-1">
            {strategies.filter(s => s.type === 'Option Wizard').length}
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <span className="text-[10px] font-semibold tracking-wider text-fg-muted uppercase">
            Subscribed
          </span>
          <div className="text-2xl font-semibold text-fg font-mono mt-1">
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
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-muted" />
            <input
              type="text"
              placeholder="Search name..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-surface border border-border rounded-lg pl-10 pr-4 py-2.5 text-xs text-fg placeholder:text-fg-muted focus:outline-none focus:border-primary transition"
            />
          </div>

          {/* TYPE Filters */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-fg-muted">
              <span>Type</span>
              <button
                onClick={clearAllFilters}
                className="text-primary hover:underline font-semibold capitalize tracking-normal text-xs"
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
                      ? 'bg-primary text-primary-fg'
                      : 'bg-surface border border-border text-fg-secondary hover:bg-subtle'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* VISIBILITY Filters */}
          <div className="space-y-2.5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-fg-muted">
              Visibility
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedVisibility(selectedVisibility === 'Private' ? 'All' : 'Private')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                  selectedVisibility === 'Private'
                    ? 'bg-primary text-primary-fg'
                    : 'bg-surface border border-border text-fg-secondary hover:bg-subtle'
                }`}
              >
                Private {strategies.filter(s => s.visibility === 'PRIVATE').length}
              </button>
              <button
                onClick={() => setSelectedVisibility(selectedVisibility === 'Private Link' ? 'All' : 'Private Link')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                  selectedVisibility === 'Private Link'
                    ? 'bg-primary text-primary-fg'
                    : 'bg-surface border border-border text-fg-secondary hover:bg-subtle'
                }`}
              >
                Private Link {strategies.filter(s => s.visibility === 'PRIVATE_LINK').length}
              </button>
            </div>
          </div>

          {/* EXCHANGES Filters */}
          <div className="space-y-2.5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-fg-muted">
              Exchanges
            </div>
            <div className="flex flex-wrap gap-1.5">
              {exchangeFilters.map(ex => (
                <button
                  key={ex}
                  onClick={() => setSelectedExchange(selectedExchange === ex ? 'All' : ex)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition ${
                    selectedExchange === ex
                      ? 'bg-primary text-primary-fg'
                      : 'bg-surface border border-border text-fg-secondary hover:bg-subtle'
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
            <span className="text-xs font-semibold text-fg-secondary font-mono">
              {filteredStrategies.length} strategies
            </span>

            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="bg-surface border border-border rounded-lg px-3 py-1.5 text-xs font-medium text-fg-secondary focus:outline-none focus:border-primary cursor-pointer"
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
                  className="p-4 sm:p-5 rounded-lg bg-surface border border-border hover:shadow-sm hover:border-border-strong transition flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4"
                >
                  {/* Left: Badges + Title + Metadata */}
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-soft text-primary text-[10px] font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                        <span>{strat.type}</span>
                      </span>

                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-border text-fg-muted text-[10px] font-semibold uppercase tracking-wider">
                        <Lock className="w-2.5 h-2.5" />
                        <span>{strat.visibility}</span>
                      </span>
                    </div>

                    <h3 className="text-base font-semibold text-fg truncate">
                      {strat.name}
                    </h3>

                    <div className="text-xs text-fg-muted flex items-center gap-2">
                      <span>by <strong className="text-fg-secondary">{strat.author}</strong></span>
                      <span>·</span>
                      <span>created {strat.createdAgo}</span>
                      <span>·</span>
                      <span>{strat.liveDeploys} live deploys</span>
                    </div>
                  </div>

                  {/* Middle: Segment & Min Capital */}
                  <div className="flex items-center gap-8 px-2 xl:px-6 shrink-0">
                    <div>
                      <span className="text-[10px] uppercase font-semibold tracking-wider text-fg-muted block mb-0.5">
                        Segment
                      </span>
                      <span className="text-xs font-semibold text-fg font-mono uppercase">
                        {strat.segment}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-semibold tracking-wider text-fg-muted block mb-0.5">
                        Min Capital
                      </span>
                      <span className="text-sm font-semibold text-fg font-mono">
                        {strat.minCapitalDisplay}
                      </span>
                    </div>
                  </div>

                  {/* Right Action Icons Strip & Deploy Button */}
                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 self-end xl:self-center">
                    {/* Favorite Button */}
                    <button
                      onClick={() => toggleFavorite(strat.id)}
                      className={`p-2 rounded-lg border transition ${
                        strat.isFavorite
                          ? 'border-loss/30 bg-loss-soft text-loss'
                          : 'border-border text-fg-muted hover:text-fg-secondary hover:bg-subtle'
                      }`}
                      title="Favorite"
                    >
                      <Heart className={`w-3.5 h-3.5 ${strat.isFavorite ? 'fill-loss' : ''}`} />
                    </button>

                    {/* Copy / Duplicate Button */}
                    <button
                      onClick={() => handleDuplicate(strat)}
                      className="p-2 rounded-lg border border-border text-fg-muted hover:text-fg-secondary hover:bg-subtle transition"
                      title="Duplicate Strategy"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    {/* Edit Button */}
                    <button
                      onClick={() => onEditStrategy(strat.name)}
                      className="p-2 rounded-lg border border-border text-fg-muted hover:text-fg-secondary hover:bg-subtle transition"
                      title="Edit in Strategy Builder"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>

                    {/* BackTest Button */}
                    <button
                      onClick={() => onBacktestStrategy(strat.name)}
                      className="px-3 py-1.5 rounded-lg border border-border text-xs font-semibold text-fg-secondary hover:bg-subtle transition"
                    >
                      BackTest
                    </button>

                    {/* Share Button */}
                    <button
                      onClick={() => handleShare(strat)}
                      className="p-2 rounded-lg border border-border text-fg-muted hover:text-fg-secondary hover:bg-subtle transition"
                      title="Share Private Link"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteSingle(strat.id, strat.name)}
                      className="p-2 rounded-lg border border-border text-fg-muted hover:text-loss hover:bg-loss-soft transition"
                      title="Delete Strategy"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    {/* API Pill Button */}
                    <button
                      onClick={() => setApiModalStrategy(strat)}
                      className="px-2.5 py-1.5 rounded-lg border border-border text-xs font-semibold text-fg-secondary hover:bg-subtle font-mono transition"
                      title="API Webhooks & PineBridge"
                    >
                      API
                    </button>

                    {/* Deploy Button */}
                    <button
                      onClick={() => setDeployModalStrategy(strat)}
                      className="px-5 py-1.5 rounded-lg bg-primary hover:bg-primary text-primary-fg text-xs font-semibold active:scale-95 transition flex items-center gap-1.5"
                    >
                      <span>Deploy</span>
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredStrategies.length === 0 && (
              <div className="p-12 text-center rounded-lg bg-surface border border-border">
                <p className="text-xs text-fg-muted">
                  No strategies match your filter criteria.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="mt-3 text-xs text-primary font-semibold hover:underline"
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
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="max-w-xl w-full bg-surface border border-border rounded-lg p-6 shadow-pop space-y-4 duration-150">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-primary" />
                <h3 className="text-base font-semibold text-fg">
                  API & Webhook Execution Endpoint
                </h3>
              </div>
              <button
                onClick={() => setApiModalStrategy(null)}
                className="p-1.5 rounded-lg text-fg-muted hover:text-fg-secondary"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-fg-muted font-semibold mb-1">
                  Strategy: <strong className="text-fg">{apiModalStrategy.name}</strong>
                </label>
              </div>

              <div>
                <label className="block text-fg-muted font-semibold mb-1">
                  Webhook Dispatch URL
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`https://api.tradingwave.tech/v1/webhook/${apiModalStrategy.id}`}
                    className="flex-1 bg-subtle border border-border rounded-lg px-3 py-2 font-mono text-fg text-xs"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`https://api.tradingwave.tech/v1/webhook/${apiModalStrategy.id}`);
                      setCopiedText(true);
                      setTimeout(() => setCopiedText(false), 2000);
                    }}
                    className="px-3 py-2 rounded-lg bg-primary text-primary-fg text-xs font-semibold hover:brightness-110 flex items-center gap-1 transition shrink-0"
                  >
                    {copiedText ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedText ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-fg-muted font-semibold mb-1">
                  TradingView PineScript Alert Message
                </label>
                <pre className="p-3 bg-ink text-profit rounded-lg font-mono text-[11px] overflow-x-auto">
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
                className="px-4 py-2 rounded-lg bg-muted text-fg-secondary text-xs font-semibold hover:bg-muted transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. TRADETRON DEPLOY MODAL */}
      <DeployModal
        isOpen={!!deployModalStrategy}
        strategy={deployModalStrategy}
        onClose={() => setDeployModalStrategy(null)}
        onDeploy={(config) => {
          onDeployStrategy(config.strategyName, config);
          setDeployModalStrategy(null);
        }}
        onAddBroker={() => {
          setDeployModalStrategy(null);
          onNavigateTab?.('brokers');
        }}
      />
    </div>
  );
}
