'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Layers,
  Wand2,
  LineChart,
  ChevronDown,
  Search,
  Bell,
  Sun,
  Moon,
  ShieldAlert,
  LayoutGrid,
  TrendingUp,
  CreditCard,
  Key,
  LogOut,
  User,
  Check,
  X
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
  // Dropdown states
  const [createMenuOpen, setCreateMenuOpen] = useState(false);
  const [strategiesMenuOpen, setStrategiesMenuOpen] = useState(false);
  const [marketMenuOpen, setMarketMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [market, setMarket] = useState<'IND' | 'USA'>('IND');
  const [lang, setLang] = useState<'English' | 'हिन्दी'>('English');

  // Refs for outside click handling
  const createRef = useRef<HTMLDivElement>(null);
  const strategiesRef = useRef<HTMLDivElement>(null);
  const marketRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const closeAllMenus = () => {
    setCreateMenuOpen(false);
    setStrategiesMenuOpen(false);
    setMarketMenuOpen(false);
    setLangMenuOpen(false);
    setNotificationsOpen(false);
    setProfileOpen(false);
    setSearchOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        createRef.current && !createRef.current.contains(target) &&
        strategiesRef.current && !strategiesRef.current.contains(target) &&
        marketRef.current && !marketRef.current.contains(target) &&
        langRef.current && !langRef.current.contains(target) &&
        notifRef.current && !notifRef.current.contains(target) &&
        profileRef.current && !profileRef.current.contains(target) &&
        searchRef.current && !searchRef.current.contains(target)
      ) {
        closeAllMenus();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectTab = (tab: string) => {
    setActiveTab(tab);
    closeAllMenus();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-[#334155] bg-white/95 dark:bg-[#0B1220]/95 backdrop-blur-md text-slate-800 dark:text-slate-100 transition-colors">
      {/* Clean Single Row Tradetron Header (SS1 Parity) */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Logo + Navigation Links */}
        <div className="flex items-center gap-4 lg:gap-7">
          {/* Logo */}
          <div
            className="flex items-center cursor-pointer select-none group shrink-0"
            onClick={() => handleSelectTab('dashboard')}
          >
            <img
              src="/logo-dark.png"
              alt="TradingWave — Trade Bindas"
              className="h-9 sm:h-10 w-auto object-contain hidden dark:block transition transform group-hover:scale-105"
            />
            <img
              src="/logo-light.png"
              alt="TradingWave — Trade Bindas"
              className="h-9 sm:h-10 w-auto object-contain block dark:hidden transition transform group-hover:scale-105"
            />
          </div>

          {/* Tradetron Clean Nav: Dashboard | Create ▾ | Strategies ▾ | Reports | Creator Hub ▾ | Services ▾ */}
          <nav className="flex items-center gap-1 sm:gap-2">
            {/* 1. Dashboard (Active Purple Pill) */}
            <button
              onClick={() => handleSelectTab('dashboard')}
              className={`px-3.5 py-1.5 rounded-xl text-sm font-semibold transition ${
                activeTab === 'dashboard'
                  ? 'bg-[#EEF2FF] text-[#5B45E0] dark:bg-[#1E1B4B] dark:text-[#818CF8] shadow-sm'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1F2937]'
              }`}
            >
              Dashboard
            </button>

            {/* 2. Create ▾ */}
            <div className="relative" ref={createRef}>
              <button
                onClick={() => {
                  const state = !createMenuOpen;
                  closeAllMenus();
                  setCreateMenuOpen(state);
                }}
                className={`px-3 py-1.5 rounded-xl text-sm font-semibold flex items-center gap-1 transition ${
                  createMenuOpen || ['builder', 'usingai', 'wizard'].includes(activeTab)
                    ? 'text-[#5B45E0] dark:text-[#818CF8] bg-slate-100 dark:bg-[#1F2937]'
                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1F2937]'
                }`}
              >
                <span>Create</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${createMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {createMenuOpen && (
                <div className="absolute left-0 top-full mt-2 w-72 bg-white dark:bg-[#1F2937] border border-slate-200 dark:border-[#334155] rounded-2xl p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <button
                    onClick={() => handleSelectTab('usingai')}
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-[#0B1220] flex items-center gap-3 transition group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#EEF2FF] dark:bg-[#1E1B4B] text-[#5B45E0] dark:text-[#818CF8] flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#5B45E0] dark:group-hover:text-[#818CF8]">
                        Using AI
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Connect Claude, ChatGPT and AI tools
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleSelectTab('builder')}
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-[#0B1220] flex items-center gap-3 transition group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#EEF2FF] dark:bg-[#1E1B4B] text-[#5B45E0] dark:text-[#818CF8] flex items-center justify-center shrink-0">
                      <LayoutGrid className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#5B45E0] dark:group-hover:text-[#818CF8]">
                        Strategy Builder
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Multi-leg rules, sets and keywords
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleSelectTab('wizard')}
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-[#0B1220] flex items-center gap-3 transition group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#EEF2FF] dark:bg-[#1E1B4B] text-[#5B45E0] dark:text-[#818CF8] flex items-center justify-center shrink-0">
                      <Wand2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#5B45E0] dark:group-hover:text-[#818CF8]">
                        Option Wizard & Greeks
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Straddles, strangles, spreads & Greeks
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleSelectTab('builder')}
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-[#0B1220] flex items-center gap-3 transition group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#EEF2FF] dark:bg-[#1E1B4B] text-[#5B45E0] dark:text-[#818CF8] flex items-center justify-center shrink-0">
                      <LineChart className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#5B45E0] dark:group-hover:text-[#818CF8]">
                        Pine Script Bridge
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        TradingView webhook alert listener
                      </div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* 3. Strategies ▾ */}
            <div className="relative" ref={strategiesRef}>
              <button
                onClick={() => {
                  const state = !strategiesMenuOpen;
                  closeAllMenus();
                  setStrategiesMenuOpen(state);
                }}
                className={`px-3 py-1.5 rounded-xl text-sm font-semibold flex items-center gap-1 transition ${
                  strategiesMenuOpen || ['mystrategies', 'readystrategies', 'optionchain'].includes(activeTab)
                    ? 'text-[#5B45E0] dark:text-[#818CF8] bg-slate-100 dark:bg-[#1F2937]'
                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1F2937]'
                }`}
              >
                <span>Strategies</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${strategiesMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {strategiesMenuOpen && (
                <div className="absolute left-0 top-full mt-2 w-72 bg-white dark:bg-[#1F2937] border border-slate-200 dark:border-[#334155] rounded-2xl p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <button
                    onClick={() => handleSelectTab('dashboard')}
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-[#0B1220] flex items-center gap-3 transition group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#EEF2FF] dark:bg-[#1E1B4B] text-[#5B45E0] dark:text-[#818CF8] flex items-center justify-center shrink-0">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#5B45E0] dark:group-hover:text-[#818CF8]">
                        Deployed Strategies
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Live executions, P&amp;L and positions
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleSelectTab('mystrategies')}
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-[#0B1220] flex items-center gap-3 transition group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#EEF2FF] dark:bg-[#1E1B4B] text-[#5B45E0] dark:text-[#818CF8] flex items-center justify-center shrink-0">
                      <LayoutGrid className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#5B45E0] dark:group-hover:text-[#818CF8]">
                        My Strategies
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Created strategies, private &amp; shared
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleSelectTab('readystrategies')}
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-[#0B1220] flex items-center gap-3 transition group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#EEF2FF] dark:bg-[#1E1B4B] text-[#5B45E0] dark:text-[#818CF8] flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#5B45E0] dark:group-hover:text-[#818CF8]">
                        Ready Strategies
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Marketplace verified quant strategies
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleSelectTab('optionchain')}
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-[#0B1220] flex items-center gap-3 transition group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#EEF2FF] dark:bg-[#1E1B4B] text-[#5B45E0] dark:text-[#818CF8] flex items-center justify-center shrink-0">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#5B45E0] dark:group-hover:text-[#818CF8]">
                        Live Option Chain
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Real-time strikes, Greeks &amp; open interest
                      </div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* 4. Reports */}
            <button
              onClick={() => handleSelectTab('backtest')}
              className={`px-3 py-1.5 rounded-xl text-sm font-semibold transition ${
                activeTab === 'backtest'
                  ? 'bg-[#EEF2FF] text-[#5B45E0] dark:bg-[#1E1B4B] dark:text-[#818CF8] shadow-sm'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1F2937]'
              }`}
            >
              Reports
            </button>
          </nav>
        </div>

        {/* Right Side: Exact SS1 Parity (Bell with '18' badge, Search, IND, Lang, algobulls, Moon) */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* 1. Notification Bell with '18' Badge */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => {
                const state = !notificationsOpen;
                closeAllMenus();
                setNotificationsOpen(state);
              }}
              className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Notifications"
            >
              <Bell className="w-5 h-5 stroke-[1.8]" />
              <span className="absolute top-0.5 right-0.5 bg-[#E11D48] text-white font-bold text-[9px] min-w-4 h-4 px-1 rounded-full flex items-center justify-center leading-none shadow-sm">
                18
              </span>
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-[#1F2937] border border-slate-200 dark:border-[#334155] rounded-2xl shadow-2xl z-50 p-3 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">Notifications (18)</span>
                  <span className="text-[10px] text-[#5B45E0] dark:text-[#818CF8] font-semibold cursor-pointer">Mark all as read</span>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-64 overflow-y-auto no-scrollbar text-xs">
                  <div className="py-2.5">
                    <div className="font-semibold text-slate-900 dark:text-white">TradingWave Nifty OHOL 3M</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Continuous live check completed (0 error).</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">1 min ago</div>
                  </div>
                  <div className="py-2.5">
                    <div className="font-semibold text-slate-900 dark:text-white">Angel One Broker API</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Static IP 13.235.122.84 active and verified.</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">5 mins ago</div>
                  </div>
                  <div className="py-2.5">
                    <div className="font-semibold text-slate-900 dark:text-white">Paper Trading Filled</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Order filled at ₹846.00 for HDFCBANK.</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">12 mins ago</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 2. Search Icon Button */}
          <div className="relative" ref={searchRef}>
            <button
              onClick={() => {
                const state = !searchOpen;
                closeAllMenus();
                setSearchOpen(state);
              }}
              className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {searchOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-[#1F2937] border border-slate-200 dark:border-[#334155] rounded-2xl p-2.5 shadow-2xl z-50">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search strategy, stock, broker..."
                    autoFocus
                    className="w-full bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#5B45E0]"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 3. Market Dropdown (🌐 IND ▾) */}
          <div className="relative" ref={marketRef}>
            <button
              onClick={() => {
                const state = !marketMenuOpen;
                closeAllMenus();
                setMarketMenuOpen(state);
              }}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
              title="Market Region"
            >
              <span>🌐 {market}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {marketMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#1F2937] border border-slate-200 dark:border-[#334155] rounded-2xl p-1.5 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <button
                  onClick={() => {
                    setMarket('IND');
                    closeAllMenus();
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition ${
                    market === 'IND' ? 'text-[#5B45E0] dark:text-[#818CF8] bg-slate-50 dark:bg-[#0B1220]' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#0B1220]'
                  }`}
                >
                  <span>🇮🇳 India (NSE/BSE)</span>
                  {market === 'IND' && <Check className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => {
                    setMarket('USA');
                    closeAllMenus();
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition ${
                    market === 'USA' ? 'text-[#5B45E0] dark:text-[#818CF8] bg-slate-50 dark:bg-[#0B1220]' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#0B1220]'
                  }`}
                >
                  <span>🇺🇸 USA (CBOE/NYSE)</span>
                  {market === 'USA' && <Check className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}
          </div>

          {/* 4. Language Dropdown (अ/A English ▾) */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => {
                const state = !langMenuOpen;
                closeAllMenus();
                setLangMenuOpen(state);
              }}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
              title="Language"
            >
              <span>अ/A {lang}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-36 bg-white dark:bg-[#1F2937] border border-slate-200 dark:border-[#334155] rounded-2xl p-1.5 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <button
                  onClick={() => {
                    setLang('English');
                    closeAllMenus();
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition ${
                    lang === 'English' ? 'text-[#5B45E0] dark:text-[#818CF8] bg-slate-50 dark:bg-[#0B1220]' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#0B1220]'
                  }`}
                >
                  <span>English</span>
                  {lang === 'English' && <Check className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => {
                    setLang('हिन्दी');
                    closeAllMenus();
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition ${
                    lang === 'हिन्दी' ? 'text-[#5B45E0] dark:text-[#818CF8] bg-slate-50 dark:bg-[#0B1220]' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#0B1220]'
                  }`}
                >
                  <span>हिन्दी</span>
                  {lang === 'हिन्दी' && <Check className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}
          </div>

          {/* 5. User Profile (A algobulls ▾) */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => {
                const state = !profileOpen;
                closeAllMenus();
                setProfileOpen(state);
              }}
              className="flex items-center gap-2 px-2 py-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="User Account"
            >
              <div className="w-7 h-7 rounded-full bg-[#EEF2FF] text-[#5B45E0] dark:bg-[#1E1B4B] dark:text-[#818CF8] font-bold text-xs flex items-center justify-center border border-indigo-200 dark:border-indigo-900">
                A
              </div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 hidden md:inline">
                algobulls
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-[#1F2937] border border-slate-200 dark:border-[#334155] rounded-2xl p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="text-xs font-bold text-slate-900 dark:text-white">algobulls</div>
                  <div className="text-[10px] text-slate-400 font-mono">ID: 83794997 · Live Quant</div>
                </div>

                <div className="pt-1.5 space-y-0.5">
                  <button
                    onClick={() => handleSelectTab('dashboard')}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-[#0B1220] text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2"
                  >
                    <TrendingUp className="w-4 h-4 text-slate-400" />
                    <span>My Dashboard</span>
                  </button>
                  <button
                    onClick={() => handleSelectTab('mystrategies')}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-[#0B1220] text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2"
                  >
                    <LayoutGrid className="w-4 h-4 text-slate-400" />
                    <span>My Strategies</span>
                  </button>
                  <button
                    onClick={() => handleSelectTab('brokers')}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-[#0B1220] text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2"
                  >
                    <Key className="w-4 h-4 text-slate-400" />
                    <span>Connected Brokers</span>
                  </button>
                  <button
                    onClick={() => handleSelectTab('pricing')}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-[#0B1220] text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2"
                  >
                    <CreditCard className="w-4 h-4 text-slate-400" />
                    <span>Subscription Plan</span>
                  </button>
                  <div className="my-1 border-t border-slate-100 dark:border-slate-800"></div>
                  <button
                    onClick={() => {
                      closeAllMenus();
                      onKillSwitch();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/40 text-xs font-semibold text-red-600 dark:text-red-400 flex items-center gap-2"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    <span>Kill Switch</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 6. Theme Toggle (Moon / Sun) */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
