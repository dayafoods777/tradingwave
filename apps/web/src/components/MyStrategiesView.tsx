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
  ChevronRight
} from 'lucide-react';

interface StrategyRecord {
  id: string;
  name: string;
  category: string;
  underlying: string;
  badge: string;
  frequency: string;
  description: string;
  legsSummary: string;
  status: 'READY' | 'ACTIVE';
}

const DEFAULT_STRATEGIES: StrategyRecord[] = [
  {
    id: 'strat_01',
    name: 'NIFTY 9:20 Intraday Short Straddle',
    category: 'Multi-Leg Options',
    underlying: 'NIFTY 50',
    badge: 'Flagship Non-Directional',
    frequency: 'Continuous (1-sec)',
    description: 'Sells ATM Call and Put at 09:20 AM. 25% individual stop-loss on each leg with hard square-off at 15:15 PM.',
    legsSummary: 'SELL ATM CE (1x) + SELL ATM PE (1x)',
    status: 'READY'
  },
  {
    id: 'strat_02',
    name: 'BANKNIFTY Multi-Timeframe Supertrend Breakout',
    category: 'Momentum Trend',
    underlying: 'BANKNIFTY',
    badge: 'High Momentum',
    frequency: '5-min Candle Close',
    description: 'Enters directional ATM Calls or Puts when 5m Supertrend (10, 3) crosses above price, confirmed with EMA 9/21.',
    legsSummary: 'BUY ATM CE / PE on signal',
    status: 'READY'
  },
  {
    id: 'strat_03',
    name: 'NIFTY Weekly Iron Condor',
    category: 'Defined Risk',
    underlying: 'NIFTY 50',
    badge: 'Weekly Expiry',
    frequency: '1-min Check',
    description: 'Sells OTM Strangle (150 pts away) and buys protective wings (300 pts away). Zero margin spike risk.',
    legsSummary: '4 Legs: +300 PE, -150 PE, -150 CE, +300 CE',
    status: 'READY'
  },
  {
    id: 'strat_04',
    name: 'FINNIFTY 0-DTE Theta Scalper',
    category: 'Expiry Day Scalping',
    underlying: 'FINNIFTY',
    badge: '0-DTE Theta Decay',
    frequency: 'Continuous (1-sec)',
    description: 'Exploits high theta acceleration on Tuesday FINNIFTY expiry by selling ATM premium with dynamic repair rules.',
    legsSummary: 'SELL ATM CE + SELL ATM PE (Dynamic Repair)',
    status: 'READY'
  },
  {
    id: 'strat_05',
    name: 'EMA Ribbon 9/21/55 Trend Rider',
    category: 'Trend Following',
    underlying: 'NIFTY 50',
    badge: 'Price Action',
    frequency: '15-min Candle',
    description: 'Classic EMA crossover sequence. Enters along high-probability macro trends with trailing stop-loss.',
    legsSummary: 'BUY ATM Futures / ITM Call',
    status: 'READY'
  },
  {
    id: 'strat_06',
    name: 'CPR & Pivot Point Price Action Breakout',
    category: 'Price Action Breakout',
    underlying: 'BANKNIFTY',
    badge: 'Intraday Levels',
    frequency: '5-min Candle Close',
    description: 'Triggers long when first 15m candle closes above Central Pivot Range Top (TC), short below Bottom (BC).',
    legsSummary: 'BUY Momentum Call/Put on CPR breakout',
    status: 'READY'
  },
  {
    id: 'strat_07',
    name: 'Hedged Strangle with Wings',
    category: 'Defined Risk Options',
    underlying: 'NIFTY 50',
    badge: 'Overnight Hedged',
    frequency: 'Continuous (1-sec)',
    description: 'Sells delta 20 OTM Call & Put while holding delta 5 protective wings to ensure overnight gap protection.',
    legsSummary: 'SELL 20 Delta CE/PE + BUY 5 Delta Wings',
    status: 'READY'
  }
];

interface MyStrategiesViewProps {
  onCreateNew: () => void;
  onEditStrategy: (strategyName: string) => void;
  onDeployStrategy: (strategyName: string) => void;
  onBacktestStrategy: (strategyName: string) => void;
}

export default function MyStrategiesView({
  onCreateNew,
  onEditStrategy,
  onDeployStrategy,
  onBacktestStrategy
}: MyStrategiesViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = ['ALL', 'Multi-Leg Options', 'Momentum Trend', 'Defined Risk', 'Expiry Day Scalping', 'Trend Following'];

  const filteredStrategies = DEFAULT_STRATEGIES.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.underlying.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-orange-50/70 via-slate-50 to-orange-50/70 dark:from-[#131B2E] dark:via-[#17223D] dark:to-[#131B2E] border border-slate-200 dark:border-[#1E293B] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#EEF2FF] dark:bg-[#1E1B4B] text-[#4F46E5] dark:text-[#818CF8] flex items-center justify-center shrink-0">
            <LayoutGrid className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">My Strategies</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Everything you have built, customized, and configured. Ready for 1-click Paper or Live execution.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onCreateNew}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6600] to-[#E65C00] text-white text-xs font-bold shadow-lg shadow-orange-500/20 hover:brightness-110 flex items-center gap-2 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create Strategy</span>
          </button>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-[#1E293B] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 transition-colors">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search strategy name, index, or description..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#0E1526] border border-slate-200 dark:border-[#1E293B] rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#FF6600]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-[#FF6600] text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-[#0E1526] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat === 'ALL' ? 'All Strategies' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Strategies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStrategies.map(strat => (
          <div
            key={strat.id}
            className="p-5 rounded-2xl bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-[#1E293B] hover:border-[#FF6600]/50 transition-all flex flex-col justify-between shadow-sm hover:shadow-md"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-orange-500/10 text-[#FF6600]">
                  {strat.underlying}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#0E1526] text-slate-500 dark:text-slate-400">
                  {strat.category}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">
                {strat.name}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {strat.description}
              </p>

              <div className="mt-4 p-2.5 rounded-xl bg-slate-50 dark:bg-[#0E1526] border border-slate-100 dark:border-[#1E293B] text-[11px] font-mono text-slate-700 dark:text-slate-300">
                <span className="text-slate-500 block text-[9px] uppercase font-sans font-bold">Leg Structure</span>
                {strat.legsSummary}
              </div>

              <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>Check Frequency:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300 font-mono">{strat.frequency}</span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-[#1E293B] flex items-center gap-2">
              <button
                onClick={() => onDeployStrategy(strat.name)}
                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-[#FF6600] to-[#E65C00] text-white text-xs font-bold shadow-md shadow-orange-500/20 hover:brightness-110 flex items-center justify-center gap-1.5 transition"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Deploy</span>
              </button>

              <button
                onClick={() => onEditStrategy(strat.name)}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1 transition"
                title="Edit in Advanced Strategy Builder"
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>

              <button
                onClick={() => onBacktestStrategy(strat.name)}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1 transition"
                title="Test against historical ticks in Backtest Studio"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Backtest</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredStrategies.length === 0 && (
        <div className="p-12 rounded-2xl bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-[#1E293B] text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">No strategies found matching &ldquo;{searchTerm}&rdquo;.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('ALL');
            }}
            className="mt-3 text-xs text-[#FF6600] font-bold hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}

