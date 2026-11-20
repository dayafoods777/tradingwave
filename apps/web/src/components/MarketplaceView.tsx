'use client';

import React, { useState } from 'react';
import { Search, ShoppingBag, TrendingUp, Users, ShieldCheck, ArrowUpRight, Copy, Check, Filter } from 'lucide-react';

interface StrategyItem {
  id: string;
  name: string;
  creator: string;
  verified: boolean;
  category: string;
  description: string;
  capital: string;
  pricing: string;
  roiMonthly: string;
  roiAllTime: string;
  drawdown: string;
  winRate: string;
  subscribers: number;
}

export default function MarketplaceView({ onDeploy, onClone }: { onDeploy: (name: string) => void; onClone: (name: string) => void }) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [clonedId, setClonedId] = useState<string | null>(null);

  const strategies: StrategyItem[] = [
    {
      id: 'st_01',
      name: 'NIFTY 9:20 Intraday Short Straddle',
      creator: 'AlphaQuant Labs',
      verified: true,
      category: 'Index Options',
      description: 'Delta-neutral short straddle on NIFTY 50 with 25% leg stop-loss and 15:10 auto square-off.',
      capital: '₹1,60,000',
      pricing: 'Free for Life',
      roiMonthly: '+8.4%',
      roiAllTime: '+142.6%',
      drawdown: '3.8%',
      winRate: '71.2%',
      subscribers: 2480
    },
    {
      id: 'st_02',
      name: 'BANKNIFTY Multi-Timeframe Supertrend',
      creator: 'Vedic Algo Capital',
      verified: true,
      category: 'Scalping',
      description: 'Directional options buying engine triggering on 5m and 15m Supertrend confluence with trailing SL.',
      capital: '₹85,000',
      pricing: '₹499/mo',
      roiMonthly: '+14.2%',
      roiAllTime: '+210.4%',
      drawdown: '5.2%',
      winRate: '64.8%',
      subscribers: 1840
    },
    {
      id: 'st_03',
      name: 'NIFTY Weekly Iron Condor (Low Beta)',
      creator: 'QuantMatrix Partners',
      verified: true,
      category: 'Index Options',
      description: 'Defined-risk 4-leg condor deployed every Thursday for the upcoming weekly expiry with dynamic repair wings.',
      capital: '₹95,000',
      pricing: 'Free for Life',
      roiMonthly: '+5.6%',
      roiAllTime: '+88.9%',
      drawdown: '2.4%',
      winRate: '82.5%',
      subscribers: 3120
    },
    {
      id: 'st_04',
      name: 'FINNIFTY Expiry Day Theta Scalper',
      creator: 'ZeroLoss Hedge',
      verified: false,
      category: 'Index Options',
      description: 'Specialized 0-DTE Tuesday expiry algo taking advantage of accelerated premium erosion after 12:30 PM.',
      capital: '₹1,20,000',
      pricing: '10% Profit Share',
      roiMonthly: '+11.8%',
      roiAllTime: '+164.2%',
      drawdown: '4.5%',
      winRate: '69.0%',
      subscribers: 940
    },
    {
      id: 'st_05',
      name: 'Bluechip Covered Call Income Machine',
      creator: 'Equities Yield Tech',
      verified: true,
      category: 'Stock Options',
      description: 'Systematically writes 30-delta OTM calls against high-delivery NIFTY 50 equity baskets for monthly cash yield.',
      capital: '₹5,00,000',
      pricing: 'Free for Life',
      roiMonthly: '+3.8%',
      roiAllTime: '+54.1%',
      drawdown: '1.8%',
      winRate: '89.4%',
      subscribers: 1420
    },
    {
      id: 'st_06',
      name: 'SENSEX Gamma Blast 0-DTE Scalper',
      creator: 'HedgeWave Prop',
      verified: true,
      category: 'Scalping',
      description: 'Captures afternoon momentum spikes on BSE SENSEX options with automated range-breakout entry.',
      capital: '₹60,000',
      pricing: '₹750/mo',
      roiMonthly: '+18.5%',
      roiAllTime: '+276.0%',
      drawdown: '7.8%',
      winRate: '58.2%',
      subscribers: 860
    }
  ];

  const categories = ['All', 'Index Options', 'Stock Options', 'Scalping'];

  const filtered = strategies.filter(st => {
    const matchCat = selectedCategory === 'All' || st.category === selectedCategory;
    const matchSearch = st.name.toLowerCase().includes(search.toLowerCase()) || st.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleCloneClick = (st: StrategyItem) => {
    setClonedId(st.id);
    onClone(st.name);
    setTimeout(() => setClonedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-orange-50/70 via-slate-50 to-orange-50/70 dark:from-[#131B2E] dark:via-[#162038] dark:to-[#131B2E] border border-slate-200 dark:border-[#1E293B] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#FF6600]">Algo Marketplace</span>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">Discover, Clone & Deploy 300+ Verified Algos</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Choose from automated options strategies, momentum scalpers, and hedged portfolios created by verified quant traders. One-click deploy to Live Auto or Paper Trading.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-white dark:bg-[#0E1526] border border-slate-200 dark:border-[#1E293B] text-center shadow-sm">
            <div className="text-lg font-bold text-slate-900 dark:text-white">324</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase">Public Algos</div>
          </div>
          <div className="px-4 py-2 rounded-xl bg-white dark:bg-[#0E1526] border border-slate-200 dark:border-[#1E293B] text-center shadow-sm">
            <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">₹42.8 Cr</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase">Live Capital</div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search strategies by name, index, or quant..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-[#1E293B] rounded-xl pl-9 pr-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#FF6600]"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto w-full sm:w-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat ? 'bg-[#FF6600] text-white shadow-sm' : 'bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-[#1E293B] text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Strategy Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(st => (
          <div
            key={st.id}
            className="p-5 rounded-2xl bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-[#1E293B] hover:border-[#FF6600]/50 transition-all flex flex-col justify-between shadow-sm dark:shadow-lg group"
          >
            <div>
              {/* Creator & Verified Badge */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{st.creator}</span>
                  {st.verified && (
                    <span title="Verified Quant Strategy">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                    </span>
                  )}
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold">
                  {st.pricing}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-[#FF6600] transition mb-1.5 line-clamp-1">
                {st.name}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                {st.description}
              </p>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 dark:bg-[#0E1526] rounded-xl border border-slate-200 dark:border-[#1E293B] mb-4 text-center">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase">Monthly ROI</div>
                  <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{st.roiMonthly}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase">Max Drawdown</div>
                  <div className="text-xs font-bold text-amber-600 dark:text-amber-400 mt-0.5">{st.drawdown}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase">Win Rate</div>
                  <div className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-0.5">{st.winRate}</div>
                </div>
              </div>

              {/* Capital & Subscribers */}
              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 mb-4 px-1">
                <div>
                  <span>Min Capital: </span>
                  <span className="font-semibold text-slate-900 dark:text-white">{st.capital}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                  <span>{st.subscribers} traders</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-3 border-t border-slate-200 dark:border-[#1E293B]">
              <button
                onClick={() => handleCloneClick(st)}
                className="flex-1 py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                {clonedId === st.id ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{clonedId === st.id ? 'Cloned!' : 'Clone Setup'}</span>
              </button>
              <button
                onClick={() => onDeploy(st.name)}
                className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-[#FF6600] to-[#E65C00] text-white text-xs font-bold shadow-md shadow-orange-500/20 hover:brightness-110 flex items-center justify-center gap-1 transition"
              >
                <span>Deploy 1-Click</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
