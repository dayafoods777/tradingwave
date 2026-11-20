'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  Wand2,
  Cpu,
  ShoppingBag,
  LineChart,
  Bot,
  Zap,
  Globe,
  Sun,
  Moon,
  ShieldAlert,
  ChevronDown,
  ArrowRight
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  onKillSwitch: () => void;
  isKillSwitchTriggered: boolean;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

export default function Header({
  activeTab,
  setActiveTab,
  onKillSwitch,
  isKillSwitchTriggered,
  theme,
  toggleTheme
}: HeaderProps) {
  const [createMenuOpen, setCreateMenuOpen] = useState(false);
  const [market, setMarket] = useState<'IND' | 'USA'>('IND');
  const [lang, setLang] = useState<'EN' | 'HI'>('EN');

  const handleSelectCreateItem = (tabTarget: string) => {
    setActiveTab(tabTarget);
    setCreateMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-[#1E293B] bg-white/95 dark:bg-[#0E1526]/95 backdrop-blur-md text-slate-800 dark:text-slate-100 transition-colors">
      {/* ROW 1: Brand, Mega-Menu, Global Controls, Kill Switch */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Logo & Slogan */}
        <div className="flex items-center gap-6">
          <div
            className="flex items-center gap-3 cursor-pointer select-none group"
            onClick={() => setActiveTab('dashboard')}
          >
            {/* Visual Logo Container with Trade Bindas Identity */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6600] to-[#E65C00] flex items-center justify-center font-black text-2xl text-white shadow-lg shadow-orange-500/20 group-hover:scale-105 transition transform">
              W
            </div>
            <div>
              <div className="flex items-center gap-1 leading-none">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">Trading</span>
                <span className="font-extrabold text-xl tracking-tight text-[#FF6600]">Wave</span>
              </div>
              <div className="text-[9.5px] tracking-[0.2em] text-slate-500 dark:text-slate-400 font-bold uppercase mt-0.5">
                Trade Bindas
              </div>
            </div>
          </div>

          {/* Tradetron Mega Menu: "Create" Dropdown */}
          <div className="relative">
            <button
              onClick={() => setCreateMenuOpen(!createMenuOpen)}
              onMouseEnter={() => setCreateMenuOpen(true)}
              className="px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700/80 bg-slate-100 dark:bg-[#131B2E] hover:border-[#FF6600]/60 text-sm font-semibold text-slate-800 dark:text-white flex items-center gap-2 transition"
            >
              <span>Create</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-500 dark:text-slate-400 transition-transform ${createMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {createMenuOpen && (
              <div
                onMouseLeave={() => setCreateMenuOpen(false)}
                className="absolute left-0 top-full mt-2 w-[540px] bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-[#1E293B] rounded-2xl p-4 shadow-2xl z-50 grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-150"
              >
                {/* Column 1: Build */}
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#FF6600] mb-2 px-2">
                    Build Strategy
                  </div>
                  <div className="space-y-1">
                    <button
                      onClick={() => handleSelectCreateItem('builder')}
                      className="w-full text-left p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#0E1526] transition flex items-start gap-2.5 group"
                    >
                      <div className="p-1.5 rounded-lg bg-orange-500/10 text-[#FF6600] group-hover:bg-[#FF6600] group-hover:text-white transition">
                        <Cpu className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">Advanced Strategy Builder</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">Full control — sets, legs & conditions</div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleSelectCreateItem('wizard')}
                      className="w-full text-left p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#0E1526] transition flex items-start gap-2.5 group"
                    >
                      <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition">
                        <Wand2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">Option Wizard</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">Guided multi-leg straddles & spreads</div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleSelectCreateItem('builder')}
                      className="w-full text-left p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#0E1526] transition flex items-start gap-2.5 group"
                    >
                      <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-500 dark:text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">Using AI (Claude / GPT)</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">Natural language prompt to algo</div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleSelectCreateItem('wizard')}
                      className="w-full text-left p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#0E1526] transition flex items-start gap-2.5 group"
                    >
                      <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition">
                        <LineChart className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">Pine Script Bridge</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">Webhook alerts from TradingView</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Column 2: Ready-Made Algos */}
                <div className="border-l border-slate-200 dark:border-[#1E293B] pl-4">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 px-2">
                    Ready-Made Setups
                  </div>
                  <div className="space-y-1">
                    <button
                      onClick={() => handleSelectCreateItem('wizard')}
                      className="w-full text-left p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#0E1526] transition flex items-start gap-2.5 group"
                    >
                      <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">Pin the Range (NIFTY)</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">One-click delta neutral condor</div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleSelectCreateItem('wizard')}
                      className="w-full text-left p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#0E1526] transition flex items-start gap-2.5 group"
                    >
                      <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-500 dark:text-cyan-400 group-hover:bg-cyan-600 group-hover:text-white transition">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">Covered Calls Screen</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">Yield generation on equity holdings</div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleSelectCreateItem('marketplace')}
                      className="w-full text-left p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#0E1526] transition flex items-start gap-2.5 group"
                    >
                      <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500 dark:text-amber-400 group-hover:bg-amber-600 group-hover:text-white transition">
                        <ShoppingBag className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">Clone from Marketplace</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">300+ profitable quants to duplicate</div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Primary Top Nav Links */}
          <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-slate-600 dark:text-slate-300">
            <button
              onClick={() => setActiveTab('marketplace')}
              className={`hover:text-slate-900 dark:hover:text-white transition flex items-center gap-1.5 ${activeTab === 'marketplace' ? 'text-[#FF6600] font-bold' : ''}`}
            >
              <span>Marketplace</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-orange-500/15 text-[#FF6600] font-bold">
                300+
              </span>
            </button>

            <button
              onClick={() => setActiveTab('brokers')}
              className={`hover:text-slate-900 dark:hover:text-white transition flex items-center gap-1.5 ${activeTab === 'brokers' ? 'text-[#FF6600] font-bold' : ''}`}
            >
              <span>Brokers</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                38 Integrations
              </span>
            </button>

            <button
              onClick={() => setActiveTab('pricing')}
              className={`hover:text-slate-900 dark:hover:text-white transition flex items-center gap-1.5 ${activeTab === 'pricing' ? 'text-[#FF6600] font-bold' : ''}`}
            >
              <span>Pricing</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold">
                Save 16%
              </span>
            </button>
          </nav>
        </div>

        {/* Right: Regional Controls, Theme, Emergency Kill Switch */}
        <div className="flex items-center gap-3">
          {/* Market Switcher */}
          <button
            onClick={() => setMarket(market === 'IND' ? 'USA' : 'IND')}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#131B2E] border border-slate-200 dark:border-[#1E293B] text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition"
            title="Switch Market Region"
          >
            <span>{market === 'IND' ? '🇮🇳 IND · NSE/MCX' : '🇺🇸 USA · CBOE'}</span>
          </button>

          {/* Language Switcher */}
          <button
            onClick={() => setLang(lang === 'EN' ? 'HI' : 'EN')}
            className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 dark:bg-[#131B2E] border border-slate-200 dark:border-[#1E293B] text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition"
            title="Switch Language"
          >
            <span>{lang === 'EN' ? 'English' : 'हिन्दी'}</span>
          </button>

          {/* Theme Toggle (Day/Night) */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-slate-100 dark:bg-[#131B2E] border border-slate-200 dark:border-[#1E293B] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
            title={`Switch to ${theme === 'dark' ? 'Day' : 'Night'} Mode`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Universal Emergency Kill Switch */}
          <button
            onClick={onKillSwitch}
            disabled={isKillSwitchTriggered}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
              isKillSwitchTriggered
                ? 'bg-red-950/60 text-red-400 border border-red-800 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30 active:scale-95 animate-pulse'
            }`}
            title="Emergency square-off for all active live orders across all connected brokers"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{isKillSwitchTriggered ? 'KILLED' : 'KILL SWITCH'}</span>
          </button>

          {/* User Profile CTA */}
          <button
            onClick={() => setActiveTab('pricing')}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#FF6600] to-[#E65C00] text-white text-xs font-bold shadow-md shadow-orange-500/20 hover:brightness-110 transition flex items-center gap-1"
          >
            <span>Start Free</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ROW 2: Primary Feature Tabs Bar (Tradetron Navigation Ribbon) */}
      <div className="border-t border-slate-200 dark:border-[#1E293B]/80 bg-slate-100/90 dark:bg-[#0B0F19]/90 px-4 sm:px-6">
        <div className="max-w-[1440px] mx-auto flex items-center gap-2 overflow-x-auto py-2 no-scrollbar text-xs font-semibold">
          {[
            { id: 'dashboard', label: '⚡ Deployed Bots & Live PnL' },
            { id: 'builder', label: '🛠️ Advanced Strategy Builder' },
            { id: 'wizard', label: '🧙 Option Wizard & Greeks' },
            { id: 'optionchain', label: '📊 Live Option Chain' },
            { id: 'marketplace', label: '🏪 Strategy Marketplace' },
            { id: 'brokers', label: '🔌 38+ Brokers & APIs' },
            { id: 'backtest', label: '📈 Backtest Studio' },
            { id: 'pricing', label: '💳 Plans & Pricing (7 Tiers)' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap transition flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-[#FF6600] text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/70 dark:hover:bg-[#131B2E]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
