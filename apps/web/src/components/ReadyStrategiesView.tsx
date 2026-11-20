'use client';

import React, { useState } from 'react';
import DeployModal, { DeployConfig } from './DeployModal';
import {
  Sparkles,
  Plus,
  Play,
  RotateCcw,
  Cpu,
  Search,
  Filter,
  CheckCircle2,
  TrendingUp,
  Layers,
  ShieldCheck,
  Zap,
  ArrowRight,
  Clock,
  ArrowUpRight
} from 'lucide-react';

export interface ReadyStrategyItem {
  id: string;
  name: string;
  category: string;
  underlying: string;
  segment: 'NFO' | 'NSE' | 'MCX' | 'DELTAINDIA';
  minCapitalDisplay: string;
  frequency: string;
  badge: string;
  entryRule: string;
  legs: string;
  exitRule: string;
  description: string;
}

const READY_STRATEGIES_CATALOG: ReadyStrategyItem[] = [
  {
    id: 'ready_01',
    name: 'NIFTY 9:20 Intraday Short Straddle',
    category: 'Intraday Options Selling',
    underlying: 'NIFTY 50',
    segment: 'NFO',
    minCapitalDisplay: '₹ 1,50,000',
    frequency: 'Continuous (1-sec)',
    badge: 'Most Popular',
    entryRule: 'Time >= 09:20:00 AM on trading days',
    legs: 'SELL 1x ATM Call + SELL 1x ATM Put (Current Weekly)',
    exitRule: '25% SL on each leg or 15:15 PM auto square-off',
    description: 'Flagship non-directional theta decay strategy. Automatically enters at 09:20 AM and harvests intraday option premium with tight risk controls.'
  },
  {
    id: 'ready_02',
    name: 'BANKNIFTY Multi-Timeframe Supertrend Breakout',
    category: 'Momentum Trend',
    underlying: 'BANKNIFTY',
    segment: 'NFO',
    minCapitalDisplay: '₹ 85,000',
    frequency: '5-min Candle Close',
    badge: 'High Momentum',
    entryRule: 'Price crosses above 5m Supertrend (10, 3) + EMA 9 > 21',
    legs: 'BUY 1x ATM Call (or BUY ATM Put on bearish break)',
    exitRule: 'Opposite Supertrend flip or 1.5% target',
    description: 'Captures high-velocity intraday directional trends in BankNifty with confirmation from EMA ribbon and volatility-adjusted Supertrend bands.'
  },
  {
    id: 'ready_03',
    name: 'NIFTY Weekly Iron Condor',
    category: 'Defined Risk Condor',
    underlying: 'NIFTY 50',
    segment: 'NFO',
    minCapitalDisplay: '₹ 1,00,000',
    frequency: '1-min Check',
    badge: 'Defined Risk',
    entryRule: 'Thursday morning after 09:25 AM',
    legs: 'BUY +300 OTM PE, SELL -150 OTM PE, SELL +150 OTM CE, BUY +300 OTM CE',
    exitRule: 'Combined profit 60% of max premium or expiry settlement',
    description: 'Zero margin spike risk. Four-legged winged condor that thrives in range-bound market regimes with strictly capped maximum risk.'
  },
  {
    id: 'ready_04',
    name: 'FINNIFTY 0-DTE Theta Scalper',
    category: 'Intraday Options Selling',
    underlying: 'FINNIFTY',
    segment: 'NFO',
    minCapitalDisplay: '₹ 1,20,000',
    frequency: 'Continuous (1-sec)',
    badge: '0-DTE Theta Decay',
    entryRule: 'Tuesday Expiry session between 09:30 AM and 14:30 PM',
    legs: 'SELL ATM CE + SELL ATM PE with dynamic Delta Repair',
    exitRule: 'Stoploss 30% per leg or 15:10 PM hard exit',
    description: 'Exploits aggressive theta decay on FinNifty Tuesday expiry. Automatically initiates delta-neutral adjustments when spot moves away from ATM.'
  },
  {
    id: 'ready_05',
    name: 'TradingWave BTCUSD OHOL 5M',
    category: 'Crypto & Commodities',
    underlying: 'BTCUSD',
    segment: 'DELTAINDIA',
    minCapitalDisplay: '$ 500',
    frequency: '5-min Candle Close',
    badge: '24/7 Crypto',
    entryRule: '5m candle Open = High (Short) or Open = Low (Long)',
    legs: 'SELL / BUY Perpetual Futures (0.01 BTC)',
    exitRule: 'Trailing SL 1.2x ATR or 2.5% Target',
    description: 'Classic institutional Open-High Open-Low opening momentum breakout adapted for 24/7 Bitcoin perpetual futures on Delta Exchange.'
  },
  {
    id: 'ready_06',
    name: 'TradingWave CrudeoilM OHOL 3M',
    category: 'Crypto & Commodities',
    underlying: 'CRUDEOILM',
    segment: 'MCX',
    minCapitalDisplay: '₹ 7,000',
    frequency: '3-min Candle Close',
    badge: 'Commodities',
    entryRule: 'Evening session 17:00 PM opening range break',
    legs: 'BUY / SELL 1x Crude Oil Mini Futures',
    exitRule: '20 points SL or 50 points target',
    description: 'Capitalizes on US market open volatility in MCX Crude Oil Mini contracts. High liquidity and predictable evening session volume.'
  },
  {
    id: 'ready_07',
    name: 'EMA Ribbon 9/21/55 Trend Rider',
    category: 'Momentum Trend',
    underlying: 'NIFTY 50',
    segment: 'NFO',
    minCapitalDisplay: '₹ 1,00,000',
    frequency: '15-min Candle',
    badge: 'Price Action',
    entryRule: 'EMA(9) > EMA(21) > EMA(55) sequential trend alignment',
    legs: 'BUY ITM Call / SELL ITM Put Option',
    exitRule: 'Trailing SL at EMA(21) support',
    description: 'Triple moving average expansion system that enters along macroeconomic trends while eliminating consolidation whipsaws.'
  },
  {
    id: 'ready_08',
    name: 'CPR & Pivot Point Price Action Breakout',
    category: 'Price Action',
    underlying: 'BANKNIFTY',
    segment: 'NFO',
    minCapitalDisplay: '₹ 1,00,000',
    frequency: '5-min Candle Close',
    badge: 'Intraday Levels',
    entryRule: 'First 15m candle closes above Central Pivot Top (TC)',
    legs: 'BUY Momentum Call / Put',
    exitRule: 'Target at R1/S1 Pivot or SL at Pivot Center',
    description: 'Classic floor-trader Central Pivot Range (CPR) breakout. Evaluates daily pivot width and takes decisive momentum entries.'
  },
  {
    id: 'ready_09',
    name: 'Hedged Strangle with Wings',
    category: 'Defined Risk Condor',
    underlying: 'NIFTY 50',
    segment: 'NFO',
    minCapitalDisplay: '₹ 1,25,000',
    frequency: 'Continuous (1-sec)',
    badge: 'Overnight Hedged',
    entryRule: 'Sell 20-Delta OTM Call and 20-Delta OTM Put',
    legs: 'SELL 20 Delta CE/PE + BUY 5 Delta Far OTM Wings',
    exitRule: '50% max profit capture or roll untested side',
    description: 'Long-gamma protected strangle. Holds cheap deep OTM wing options to cap black-swan overnight gap risk while harvesting daily theta.'
  }
];

interface ReadyStrategiesViewProps {
  onDeploy: (strategyName: string, deployConfig?: any) => void;
  onEdit: (strategyName: string) => void;
  onBacktest: (strategyName: string) => void;
  onNavigateTab: (tab: any) => void;
}

export default function ReadyStrategiesView({
  onDeploy,
  onEdit,
  onBacktest,
  onNavigateTab
}: ReadyStrategiesViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [deployModalStrategy, setDeployModalStrategy] = useState<ReadyStrategyItem | null>(null);

  const categories = [
    'ALL',
    'Intraday Options Selling',
    'Momentum Trend',
    'Defined Risk Condor',
    'Crypto & Commodities',
    'Price Action'
  ];

  const filteredStrategies = READY_STRATEGIES_CATALOG.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        s.underlying.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        s.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === 'ALL' || s.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="space-y-6">
      {/* 1. TOP BANNER - Exact Tradetron Signature Header */}
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
            Ready Strategies
          </h2>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Pre-built quantitative strategies with proven backtested rules, ready for 1-click Live or Paper deployment.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigateTab('builder')}
            className="px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0E1526] text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold shadow-sm transition flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Custom Strategy</span>
          </button>
        </div>
      </div>

      {/* 2. SUB-NAVIGATION TABS STRIP (Ready Strategies after My Strategies - SS1) */}
      <div className="flex items-center gap-8 border-b border-slate-200 dark:border-[#1E293B] text-sm font-semibold">
        <button
          onClick={() => onNavigateTab('dashboard')}
          className="pb-3 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition"
        >
          Deployed
        </button>
        <button
          onClick={() => onNavigateTab('mystrategies')}
          className="pb-3 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition"
        >
          My Strategies
        </button>
        <button
          className="pb-3 text-[#5B45E0] dark:text-[#818CF8] border-b-2 border-[#5B45E0] dark:border-[#818CF8] font-bold"
        >
          Ready Strategies
        </button>
        <button
          onClick={() => onNavigateTab('backtest')}
          className="pb-3 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition"
        >
          Backtest
        </button>
      </div>

      {/* 3. METRIC COUNTERS STRIP */}
      <div className="rounded-2xl border border-slate-200 dark:border-[#1E293B] bg-white dark:bg-[#131B2E] overflow-hidden shadow-sm grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 dark:divide-[#1E293B] transition-colors">
        <div className="p-4 sm:p-5">
          <span className="text-[10px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
            Ready Setups
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-1">
            {READY_STRATEGIES_CATALOG.length}
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <span className="text-[10px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
            Asset Classes
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-1">
            5 Markets
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <span className="text-[10px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
            Execution Latency
          </span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-1">
            &lt; 50ms
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <span className="text-[10px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
            Compliance
          </span>
          <div className="text-2xl font-black text-[#5B45E0] dark:text-[#818CF8] font-mono mt-1">
            100% Safe
          </div>
        </div>
      </div>

      {/* 4. SEARCH & CATEGORY FILTER BAR */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-[#1E293B] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 transition-colors">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search ready strategy name, index, or rules..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#0E1526] border border-slate-200 dark:border-[#1E293B] rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#5B45E0]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-[#5B45E0] text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-[#0E1526] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat === 'ALL' ? 'All Setups' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* 5. STRATEGIES CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredStrategies.map(strat => (
          <div
            key={strat.id}
            className="p-5 rounded-2xl bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-[#1E293B] hover:border-[#5B45E0]/60 transition-all flex flex-col justify-between shadow-sm hover:shadow-lg space-y-4"
          >
            <div>
              {/* Badges */}
              <div className="flex items-start justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-[#F0EDFF] dark:bg-[#1E1B4B] text-[#5B45E0] dark:text-[#818CF8]">
                    {strat.underlying}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#0E1526] text-slate-600 dark:text-slate-400 font-mono uppercase">
                    {strat.segment}
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  {strat.badge}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="text-base font-black text-slate-900 dark:text-white line-clamp-1">
                {strat.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2">
                {strat.description}
              </p>

              {/* Quantitative Rules Box */}
              <div className="mt-3.5 p-3 rounded-xl bg-slate-50 dark:bg-[#0E1526] border border-slate-100 dark:border-[#1E293B] space-y-2 text-[11px] font-mono">
                <div>
                  <span className="text-[9px] uppercase font-sans font-bold text-slate-400 block">Entry Condition</span>
                  <span className="text-slate-800 dark:text-slate-200 font-medium">{strat.entryRule}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-sans font-bold text-slate-400 block">Leg Structure</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-medium">{strat.legs}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-sans font-bold text-slate-400 block">Exit &amp; Stoploss</span>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">{strat.exitRule}</span>
                </div>
              </div>

              {/* Capital & Frequency */}
              <div className="mt-3 flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-[#1E293B]">
                <span className="text-slate-500 dark:text-slate-400">Min Capital:</span>
                <span className="font-black text-slate-900 dark:text-white font-mono">{strat.minCapitalDisplay}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => setDeployModalStrategy(strat)}
                className="flex-1 py-2.5 rounded-xl bg-[#5B45E0] hover:bg-[#4E38D0] text-white text-xs font-bold shadow-md shadow-indigo-500/20 active:scale-95 transition flex items-center justify-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Deploy 1-Click</span>
              </button>

              <button
                onClick={() => onEdit(strat.name)}
                className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1 transition"
                title="Inspect rules in Strategy Builder"
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>Inspect</span>
              </button>

              <button
                onClick={() => onBacktest(strat.name)}
                className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1 transition"
                title="Backtest against historical ticks"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Backtest</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* TRADETRON DEPLOY MODAL */}
      <DeployModal
        isOpen={!!deployModalStrategy}
        strategy={deployModalStrategy}
        onClose={() => setDeployModalStrategy(null)}
        onDeploy={(config) => {
          onDeploy(config.strategyName, config);
          setDeployModalStrategy(null);
        }}
        onAddBroker={() => {
          setDeployModalStrategy(null);
          onNavigateTab('brokers');
        }}
      />
    </div>
  );
}

