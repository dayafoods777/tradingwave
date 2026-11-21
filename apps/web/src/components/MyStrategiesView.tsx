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
    <div className="space-y-5 pb-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-surface border border-primary text-fg px-5 py-3 rounded-lg shadow-pop flex items-center gap-3 duration-150">
          <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Page header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-fg">My strategies</h1>
          <p className="mt-0.5 text-[13px] text-fg-muted">Everything you have built or subscribed to, ready to test and deploy.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleBulkDelete}
            disabled={selectedIds.length === 0}
            className="tw-btn-secondary text-loss hover:bg-loss-soft"
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete{selectedIds.length > 0 ? ` (${selectedIds.length})` : ''}
          </button>
          <button onClick={onCreateNew} className="tw-btn-primary">
            <Plus className="h-3.5 w-3.5" /> New strategy
          </button>
        </div>
      </div>

      {/* Counters */}
      <div className="grid grid-cols-2 overflow-hidden rounded-lg border border-border bg-surface sm:grid-cols-4">
        {[
          ['Private', strategies.filter(s => s.visibility === 'PRIVATE').length],
          ['Private link', strategies.filter(s => s.visibility === 'PRIVATE_LINK').length],
          ['Option wizard', strategies.filter(s => s.type === 'Option Wizard').length],
          ['Subscribed', 0],
        ].map(([label, n], i) => (
          <div key={label as string} className={`px-4 py-3 ${i % 2 ? 'border-l' : ''} ${i > 1 ? 'border-t sm:border-l sm:border-t-0' : ''} border-border`}>
            <div className="tw-label">{label}</div>
            <div className="mt-1 font-mono tnum text-[20px] font-medium text-fg">{n}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-start gap-5 lg:flex-row">
        {/* Filters */}
        <aside className="w-full shrink-0 space-y-5 lg:sticky lg:top-16 lg:w-56">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-fg-muted" />
            <input
              type="text"
              placeholder="Search strategies"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="tw-input pl-8"
            />
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="tw-label">Type</span>
              <button onClick={clearAllFilters} className="text-[12px] text-primary hover:underline">Clear</button>
            </div>
            <div className="flex flex-wrap gap-1 lg:flex-col lg:gap-px">
              {typeFilters.map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`flex h-7 items-center justify-between rounded-md px-2 text-left text-[13px] transition-colors lg:w-full ${
                    selectedType === type ? 'bg-surface font-medium text-fg shadow-hairline' : 'text-fg-secondary hover:bg-subtle hover:text-fg'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="tw-label mb-1.5">Visibility</div>
            <div className="flex flex-wrap gap-1.5">
              {([['Private', 'PRIVATE'], ['Private Link', 'PRIVATE_LINK']] as const).map(([label, key]) => (
                <button
                  key={label}
                  onClick={() => setSelectedVisibility(selectedVisibility === label ? 'All' : label)}
                  className={`tw-badge h-6 border px-2 text-[12px] ${
                    selectedVisibility === label ? 'border-primary/40 bg-primary-soft text-primary' : 'border-border text-fg-secondary hover:bg-subtle'
                  }`}
                >
                  {label} <span className="font-mono text-fg-muted">{strategies.filter(s => s.visibility === key).length}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="tw-label mb-1.5">Exchange</div>
            <div className="flex flex-wrap gap-1.5">
              {exchangeFilters.map(ex => (
                <button
                  key={ex}
                  onClick={() => setSelectedExchange(selectedExchange === ex ? 'All' : ex)}
                  className={`tw-badge h-6 border px-2 font-mono text-[11px] ${
                    selectedExchange === ex ? 'border-primary/40 bg-primary-soft text-primary' : 'border-border text-fg-secondary hover:bg-subtle'
                  }`}
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* List */}
        <div className="w-full min-w-0 flex-1 overflow-hidden rounded-lg border border-border bg-surface">
          <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2.5">
            <span className="text-[13px] text-fg-secondary">
              <span className="font-mono tnum text-fg">{filteredStrategies.length}</span> strategies
            </span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="tw-input h-7 w-auto cursor-pointer pr-7 text-[12px]"
              aria-label="Sort"
            >
              <option value="NEWEST">Newest first</option>
              <option value="OLDEST">Oldest first</option>
              <option value="NAME">Name (A–Z)</option>
              <option value="CAPITAL_ASC">Min capital: low to high</option>
              <option value="CAPITAL_DESC">Min capital: high to low</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="border-b border-border bg-subtle text-[11px] text-fg-muted">
                <tr>
                  <th className="w-10 px-4 py-2">
                    <input
                      type="checkbox"
                      aria-label="Select all"
                      className="accent-primary"
                      checked={filteredStrategies.length > 0 && filteredStrategies.every(s => selectedIds.includes(s.id))}
                      onChange={e => setSelectedIds(e.target.checked ? filteredStrategies.map(s => s.id) : [])}
                    />
                  </th>
                  <th className="px-2 py-2 font-medium">Strategy</th>
                  <th className="px-3 py-2 font-medium">Segment</th>
                  <th className="px-3 py-2 text-right font-medium">Min capital</th>
                  <th className="px-3 py-2 text-right font-medium">Live</th>
                  <th className="px-4 py-2 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredStrategies.map(strat => (
                  <tr key={strat.id} className={`group transition-colors hover:bg-subtle ${selectedIds.includes(strat.id) ? 'bg-primary-soft/40' : ''}`}>
                    <td className="px-4 py-2.5 align-top">
                      <input
                        type="checkbox"
                        aria-label={`Select ${strat.name}`}
                        className="mt-1 accent-primary"
                        checked={selectedIds.includes(strat.id)}
                        onChange={() =>
                          setSelectedIds(prev => (prev.includes(strat.id) ? prev.filter(x => x !== strat.id) : [...prev, strat.id]))
                        }
                      />
                    </td>
                    <td className="min-w-[240px] px-2 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="truncate font-medium text-fg">{strat.name}</span>
                      </div>
                      <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[11.5px] text-fg-muted">
                        <span className="tw-badge bg-primary-soft text-primary">{strat.type}</span>
                        <span className="tw-badge border border-border text-fg-muted">
                          <Lock className="h-2.5 w-2.5" /> {strat.visibility === 'PRIVATE_LINK' ? 'Link' : 'Private'}
                        </span>
                        <span>{strat.author} · {strat.createdAgo}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 font-mono text-[12px] text-fg-secondary">{strat.segment}</td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-right font-mono tnum text-fg">{strat.minCapitalDisplay}</td>
                    <td className="px-3 py-2.5 text-right font-mono tnum text-fg-secondary">{strat.liveDeploys}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center justify-end gap-0.5">
                        <button
                          onClick={() => toggleFavorite(strat.id)}
                          className={`tw-btn-ghost h-7 w-7 px-0 ${strat.isFavorite ? 'text-accent' : ''}`}
                          title="Favourite"
                          aria-label="Favourite"
                        >
                          <Heart className={`h-3.5 w-3.5 ${strat.isFavorite ? 'fill-current' : ''}`} />
                        </button>
                        <button onClick={() => handleDuplicate(strat)} className="tw-btn-ghost h-7 w-7 px-0" title="Duplicate" aria-label="Duplicate">
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => onEditStrategy(strat.name)} className="tw-btn-ghost h-7 w-7 px-0" title="Edit in builder" aria-label="Edit">
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => handleShare(strat)} className="tw-btn-ghost h-7 w-7 px-0" title="Copy private link" aria-label="Share">
                          <Share2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteSingle(strat.id, strat.name)}
                          className="tw-btn-ghost h-7 w-7 px-0 hover:bg-loss-soft hover:text-loss"
                          title="Delete"
                          aria-label="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => setApiModalStrategy(strat)} className="tw-btn-ghost h-7 px-2 font-mono text-[11px]" title="API webhooks">
                          API
                        </button>
                        <button onClick={() => onBacktestStrategy(strat.name)} className="tw-btn-secondary ml-1 h-7 px-2.5 text-[12px]">
                          Backtest
                        </button>
                        <button onClick={() => setDeployModalStrategy(strat)} className="tw-btn-primary ml-1 h-7 px-3 text-[12px]">
                          Deploy
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredStrategies.length === 0 && (
            <div className="flex flex-col items-center px-4 py-14 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-subtle">
                <Search className="h-4 w-4 text-fg-muted" />
              </div>
              <div className="mt-3 text-[14px] font-medium text-fg">No strategies match these filters</div>
              <p className="mt-1 text-[13px] text-fg-muted">Try a different type or exchange, or start a new strategy.</p>
              <div className="mt-4 flex gap-2">
                <button onClick={clearAllFilters} className="tw-btn-secondary">Clear filters</button>
                <button onClick={onCreateNew} className="tw-btn-primary">New strategy</button>
              </div>
            </div>
          )}
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
