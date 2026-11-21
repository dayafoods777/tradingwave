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
  X,
  ShieldCheck,
  FileCode,
  Radio,
  ExternalLink,
  Menu,
  Activity
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  onKillSwitch: () => void;
  isKillSwitchTriggered: boolean;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  market?: 'IND' | 'USA';
  onMarketChange?: (m: 'IND' | 'USA') => void;
  userRole?: string;
}

export default function Header({
  activeTab,
  setActiveTab,
  onKillSwitch,
  isKillSwitchTriggered,
  theme,
  toggleTheme,
  market = 'IND',
  onMarketChange,
  userRole = 'SUPERADMIN'
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [activeMarket, setActiveMarket] = useState<'IND' | 'USA'>(market);
  const [lang, setLang] = useState<'English' | 'हिन्दी'>('English');
  const [unreadNotifsCount, setUnreadNotifsCount] = useState(18);

  // Notifications List
  const [notifications, setNotifications] = useState([
    { id: '1', title: 'TradingWave Nifty OHOL 3M', desc: 'Continuous live check completed (0 error).', time: '1 min ago', unread: true },
    { id: '2', title: 'Angel One Broker API', desc: 'Static IP 13.235.122.84 active and verified.', time: '5 mins ago', unread: true },
    { id: '3', title: 'Paper Trading Filled', desc: 'Order filled at ₹846.00 for HDFCBANK.', time: '12 mins ago', unread: true },
    { id: '4', title: 'Black-Scholes Greek Engine', desc: 'Real-time IV curve recalculated for 28-NOV expiry.', time: '18 mins ago', unread: true },
    { id: '5', title: 'Zero-Eval AST Sandbox', desc: 'Pre-trade risk audit passed for all 18 active rules.', time: '25 mins ago', unread: true }
  ]);

  // Search Results
  const SEARCH_ITEMS = [
    { title: 'Dashboard', category: 'Navigation', tab: 'dashboard' },
    { title: 'Strategy Builder', category: 'Create', tab: 'builder' },
    { title: 'Using AI (Cookie Quant)', category: 'Create', tab: 'usingai' },
    { title: 'Option Wizard & Greeks', category: 'Create', tab: 'wizard' },
    { title: 'Pine Script Bridge (TradingView)', category: 'Create', tab: 'pinebridge' },
    { title: 'My Strategies', category: 'Strategies', tab: 'mystrategies' },
    { title: 'Ready Strategies (Marketplace)', category: 'Strategies', tab: 'readystrategies' },
    { title: 'Live Option Chain', category: 'Strategies', tab: 'optionchain' },
    { title: 'Backtest Studio (Zero-Lookahead)', category: 'Reports', tab: 'backtest' },
    { title: '38 Connected Brokers', category: 'Settings', tab: 'brokers' },
    { title: 'Subscription Plans & Pricing', category: 'Account', tab: 'pricing' },
    { title: 'SuperAdmin Control Panel', category: 'Admin', tab: 'admin' },
    { title: 'Zerodha Kite Connect', category: 'Brokers', tab: 'brokers' },
    { title: 'DhanHQ Gateway', category: 'Brokers', tab: 'brokers' },
    { title: 'NIFTY 9:20 Intraday Short Straddle', category: 'Strategies', tab: 'readystrategies' },
    { title: 'BANKNIFTY Supertrend Breakout', category: 'Strategies', tab: 'readystrategies' }
  ];

  const searchResults = searchQuery.trim()
    ? SEARCH_ITEMS.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

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

  const handleMarketSelect = (m: 'IND' | 'USA') => {
    setActiveMarket(m);
    if (onMarketChange) onMarketChange(m);
    closeAllMenus();
  };

  const handleMarkAllNotifsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    setUnreadNotifsCount(0);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-[#334155] bg-white/95 dark:bg-[#0B1220]/95 backdrop-blur-md text-slate-800 dark:text-slate-100 transition-colors">
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

          {/* Tradetron Clean Nav: Dashboard | Create ▾ | Strategies ▾ | Reports | Admin */}
          <nav className="hidden lg:flex items-center gap-1 sm:gap-2">
            {/* 1. Dashboard */}
            <button
              onClick={() => handleSelectTab('dashboard')}
              className={`px-3.5 py-1.5 rounded-xl text-sm font-semibold transition cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-[#EEF2FF] text-[#5B45E0] dark:bg-[#1E1B4B] dark:text-[#818CF8] shadow-sm'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1F2937]'
              }`}
            >
              {lang === 'हिन्दी' ? 'डैशबोर्ड' : 'Dashboard'}
            </button>

            {/* 2. Create ▾ */}
            <div className="relative" ref={createRef}>
              <button
                onClick={() => {
                  const state = !createMenuOpen;
                  closeAllMenus();
                  setCreateMenuOpen(state);
                }}
                className={`px-3 py-1.5 rounded-xl text-sm font-semibold flex items-center gap-1 transition cursor-pointer ${
                  createMenuOpen || ['builder', 'usingai', 'wizard', 'pinebridge'].includes(activeTab)
                    ? 'text-[#5B45E0] dark:text-[#818CF8] bg-slate-100 dark:bg-[#1F2937]'
                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1F2937]'
                }`}
              >
                <span>{lang === 'हिन्दी' ? 'बनाएं' : 'Create'}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${createMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {createMenuOpen && (
                <div className="absolute left-0 top-full mt-2 w-72 bg-white dark:bg-[#1F2937] border border-slate-200 dark:border-[#334155] rounded-2xl p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <button
                    onClick={() => handleSelectTab('usingai')}
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-[#0B1220] flex items-center gap-3 transition group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#EEF2FF] dark:bg-[#1E1B4B] text-[#5B45E0] dark:text-[#818CF8] flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#5B45E0] dark:group-hover:text-[#818CF8]">
                        Using AI (Cookie Quant)
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Connect Claude, ChatGPT and free AI tools
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleSelectTab('builder')}
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-[#0B1220] flex items-center gap-3 transition group cursor-pointer"
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
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-[#0B1220] flex items-center gap-3 transition group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#EEF2FF] dark:bg-[#1E1B4B] text-[#5B45E0] dark:text-[#818CF8] flex items-center justify-center shrink-0">
                      <Wand2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#5B45E0] dark:group-hover:text-[#818CF8]">
                        Option Wizard &amp; Greeks
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Straddles, strangles, spreads &amp; Greeks
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleSelectTab('pinebridge')}
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-[#0B1220] flex items-center gap-3 transition group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#EEF2FF] dark:bg-[#1E1B4B] text-[#5B45E0] dark:text-[#818CF8] flex items-center justify-center shrink-0">
                      <Radio className="w-4 h-4" />
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
                className={`px-3 py-1.5 rounded-xl text-sm font-semibold flex items-center gap-1 transition cursor-pointer ${
                  strategiesMenuOpen || ['mystrategies', 'readystrategies', 'optionchain'].includes(activeTab)
                    ? 'text-[#5B45E0] dark:text-[#818CF8] bg-slate-100 dark:bg-[#1F2937]'
                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1F2937]'
                }`}
              >
                <span>{lang === 'हिन्दी' ? 'रणनीतियां' : 'Strategies'}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${strategiesMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {strategiesMenuOpen && (
                <div className="absolute left-0 top-full mt-2 w-72 bg-white dark:bg-[#1F2937] border border-slate-200 dark:border-[#334155] rounded-2xl p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <button
                    onClick={() => handleSelectTab('dashboard')}
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-[#0B1220] flex items-center gap-3 transition group cursor-pointer"
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
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-[#0B1220] flex items-center gap-3 transition group cursor-pointer"
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
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-[#0B1220] flex items-center gap-3 transition group cursor-pointer"
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
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-[#0B1220] flex items-center gap-3 transition group cursor-pointer"
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

            {/* 4. Reports (Backtest) */}
            <button
              onClick={() => handleSelectTab('backtest')}
              className={`px-3 py-1.5 rounded-xl text-sm font-semibold transition cursor-pointer ${
                activeTab === 'backtest'
                  ? 'bg-[#EEF2FF] text-[#5B45E0] dark:bg-[#1E1B4B] dark:text-[#818CF8] shadow-sm'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1F2937]'
              }`}
            >
              {lang === 'हिन्दी' ? 'रिपोर्ट्स' : 'Reports'}
            </button>

            {/* 5. Admin Panel (Dedicated Direct Tab) */}
            <button
              onClick={() => handleSelectTab('admin')}
              className={`px-3 py-1.5 rounded-xl text-sm font-bold flex items-center gap-1.5 transition cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-[#FF6B00]/15 text-[#FF6B00] border border-[#FF6B00]/30 shadow-sm'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1F2937]'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-[#FF6B00]" />
              <span>Admin</span>
            </button>
          </nav>
        </div>

        {/* Right Side: Bell, Search, IND, Lang, Profile, Theme */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* 1. Notification Bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => {
                const state = !notificationsOpen;
                closeAllMenus();
                setNotificationsOpen(state);
              }}
              className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-5 h-5 stroke-[1.8]" />
              {unreadNotifsCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-[#E11D48] text-white font-bold text-[9px] min-w-4 h-4 px-1 rounded-full flex items-center justify-center leading-none shadow-sm">
                  {unreadNotifsCount}
                </span>
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-[#1F2937] border border-slate-200 dark:border-[#334155] rounded-2xl shadow-2xl z-50 p-3 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">Notifications ({unreadNotifsCount})</span>
                  <button
                    onClick={handleMarkAllNotifsRead}
                    className="text-[10px] text-[#5B45E0] dark:text-[#818CF8] font-semibold cursor-pointer hover:underline"
                  >
                    Mark all as read
                  </button>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-64 overflow-y-auto no-scrollbar text-xs">
                  {notifications.map(n => (
                    <div key={n.id} className="py-2.5">
                      <div className="font-semibold text-slate-900 dark:text-white flex items-center justify-between">
                        <span>{n.title}</span>
                        {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00]"></span>}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{n.desc}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{n.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 2. Global Search Button & Working Search Drawer */}
          <div className="relative" ref={searchRef}>
            <button
              onClick={() => {
                const state = !searchOpen;
                closeAllMenus();
                setSearchOpen(state);
              }}
              className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition cursor-pointer"
              title="Search everything"
            >
              <Search className="w-4 h-4" />
            </button>

            {searchOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white dark:bg-[#1F2937] border border-slate-200 dark:border-[#334155] rounded-2xl p-3 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="relative mb-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search strategy, broker, tool, or admin..."
                    autoFocus
                    className="w-full bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-[#5B45E0]"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {searchQuery.trim() ? (
                  <div className="max-h-60 overflow-y-auto space-y-1">
                    {searchResults.length === 0 ? (
                      <div className="text-xs text-slate-400 text-center py-4">No matching results found.</div>
                    ) : (
                      searchResults.map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleSelectTab(item.tab)}
                          className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-[#0B1220] cursor-pointer flex items-center justify-between transition"
                        >
                          <div>
                            <div className="text-xs font-bold text-slate-900 dark:text-white">{item.title}</div>
                            <div className="text-[10px] text-slate-400">{item.category}</div>
                          </div>
                          <span className="text-[10px] text-[#5B45E0] dark:text-[#818CF8] font-bold">Open →</span>
                        </div>
                      ))
                    )}
                  </div>
                ) : (
                  <div className="p-2 text-[11px] text-slate-400">
                    Quick suggestions: Option Wizard, Backtest Studio, 38 Brokers, Admin Panel, NIFTY 9:20
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 3. Market Dropdown (Desktop / Tablet) */}
          <div className="relative hidden sm:block" ref={marketRef}>
            <button
              onClick={() => {
                const state = !marketMenuOpen;
                closeAllMenus();
                setMarketMenuOpen(state);
              }}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              title="Market Region"
            >
              <span>🌐 {activeMarket}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {marketMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#1F2937] border border-slate-200 dark:border-[#334155] rounded-2xl p-1.5 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <button
                  onClick={() => handleMarketSelect('IND')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                    activeMarket === 'IND' ? 'text-[#5B45E0] dark:text-[#818CF8] bg-slate-50 dark:bg-[#0B1220]' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#0B1220]'
                  }`}
                >
                  <span>🇮🇳 India (NSE/BSE/MCX)</span>
                  {activeMarket === 'IND' && <Check className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => handleMarketSelect('USA')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                    activeMarket === 'USA' ? 'text-[#5B45E0] dark:text-[#818CF8] bg-slate-50 dark:bg-[#0B1220]' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#0B1220]'
                  }`}
                >
                  <span>🇺🇸 USA (CBOE/NYSE)</span>
                  {activeMarket === 'USA' && <Check className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}
          </div>

          {/* 4. Language Dropdown (Desktop / Tablet) */}
          <div className="relative hidden sm:block" ref={langRef}>
            <button
              onClick={() => {
                const state = !langMenuOpen;
                closeAllMenus();
                setLangMenuOpen(state);
              }}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
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
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
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
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                    lang === 'हिन्दी' ? 'text-[#5B45E0] dark:text-[#818CF8] bg-slate-50 dark:bg-[#0B1220]' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#0B1220]'
                  }`}
                >
                  <span>हिन्दी</span>
                  {lang === 'हिन्दी' && <Check className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}
          </div>

          {/* 5. User Profile Dropdown (With Admin Panel & Account links) */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => {
                const state = !profileOpen;
                closeAllMenus();
                setProfileOpen(state);
              }}
              className="flex items-center gap-2 px-2 py-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
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
              <div className="absolute right-0 top-full mt-2 w-60 bg-white dark:bg-[#1F2937] border border-slate-200 dark:border-[#334155] rounded-2xl p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">algobulls</span>
                    <span className="px-1.5 py-0.2 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold text-[9px] uppercase border border-purple-500/20">
                      SUPERADMIN
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">ID: 83794997 · Live Institutional</div>
                </div>

                <div className="pt-1.5 space-y-0.5">
                  <button
                    onClick={() => handleSelectTab('admin')}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-950/20 text-xs font-bold text-[#FF6B00] flex items-center gap-2 transition cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#FF6B00]" />
                    <span>Admin Panel</span>
                  </button>
                  <button
                    onClick={() => handleSelectTab('dashboard')}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-[#0B1220] text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2 transition cursor-pointer"
                  >
                    <TrendingUp className="w-4 h-4 text-slate-400" />
                    <span>My Dashboard</span>
                  </button>
                  <button
                    onClick={() => handleSelectTab('mystrategies')}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-[#0B1220] text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2 transition cursor-pointer"
                  >
                    <LayoutGrid className="w-4 h-4 text-slate-400" />
                    <span>My Strategies</span>
                  </button>
                  <button
                    onClick={() => handleSelectTab('brokers')}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-[#0B1220] text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2 transition cursor-pointer"
                  >
                    <Key className="w-4 h-4 text-slate-400" />
                    <span>Connected Brokers (38)</span>
                  </button>
                  <button
                    onClick={() => handleSelectTab('pricing')}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-[#0B1220] text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2 transition cursor-pointer"
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
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/40 text-xs font-semibold text-red-600 dark:text-red-400 flex items-center gap-2 transition cursor-pointer"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    <span>Universal Kill Switch</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 6. Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition cursor-pointer"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* 7. Mobile Menu Hamburger Toggle (lg:hidden) */}
          <button
            onClick={() => {
              closeAllMenus();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition cursor-pointer lg:hidden"
            title="Toggle Mobile Navigation"
          >
            {mobileMenuOpen ? <X className="w-4 h-4 text-[#FF6B00]" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 8. Mobile Slide-down Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-[#334155] bg-white/98 dark:bg-[#0B1220]/98 backdrop-blur-xl px-4 py-4 space-y-4 max-h-[calc(100vh-4.5rem)] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-150 shadow-2xl">
          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            <button
              onClick={() => {
                handleSelectTab('dashboard');
                setMobileMenuOpen(false);
              }}
              className={`p-3 rounded-2xl flex items-center gap-2.5 transition ${
                activeTab === 'dashboard'
                  ? 'bg-[#EEF2FF] text-[#5B45E0] dark:bg-[#1E1B4B] dark:text-[#818CF8] font-bold shadow-sm'
                  : 'bg-slate-50 dark:bg-[#1F2937] text-slate-700 dark:text-slate-300'
              }`}
            >
              <TrendingUp className="w-4 h-4 text-[#5B45E0]" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => {
                handleSelectTab('admin');
                setMobileMenuOpen(false);
              }}
              className={`p-3 rounded-2xl flex items-center gap-2.5 transition ${
                activeTab === 'admin'
                  ? 'bg-orange-500/15 text-[#FF6B00] border border-orange-500/30 font-bold shadow-sm'
                  : 'bg-slate-50 dark:bg-[#1F2937] text-slate-700 dark:text-slate-300'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-[#FF6B00]" />
              <span>Admin Panel</span>
            </button>
          </div>

          {/* Section: Create */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
              Create Algorithms
            </div>
            <div className="space-y-1">
              {[
                { id: 'usingai', label: 'Using AI (Cookie Quant)', icon: Sparkles, desc: 'Natural language quant synthesizer' },
                { id: 'builder', label: 'Strategy Builder', icon: LayoutGrid, desc: 'Multi-leg rule sets & keywords' },
                { id: 'wizard', label: 'Option Wizard & Greeks', icon: Wand2, desc: 'Black-Scholes Greek payoffs' },
                { id: 'pinebridge', label: 'Pine Script Bridge', icon: Radio, desc: 'TradingView webhook alert listener' }
              ].map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      handleSelectTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl flex items-center gap-3 transition ${
                      activeTab === item.id
                        ? 'bg-[#EEF2FF] dark:bg-[#1E1B4B] text-[#5B45E0] dark:text-[#818CF8] font-bold'
                        : 'hover:bg-slate-50 dark:hover:bg-[#1F2937] text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-[#5B45E0] dark:text-[#818CF8] flex items-center justify-center shrink-0">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">{item.label}</div>
                      <div className="text-[10px] text-slate-400">{item.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: Strategies & Execution */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
              Strategies &amp; Execution
            </div>
            <div className="space-y-1">
              {[
                { id: 'mystrategies', label: 'My Strategies', icon: LayoutGrid },
                { id: 'readystrategies', label: 'Ready Strategies (Marketplace)', icon: Sparkles },
                { id: 'optionchain', label: 'Live Option Chain', icon: Layers },
                { id: 'backtest', label: 'Backtest Studio', icon: LineChart },
                { id: 'brokers', label: 'Connected Brokers (38)', icon: Key },
                { id: 'pricing', label: 'Plans & Pricing', icon: CreditCard }
              ].map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      handleSelectTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition ${
                      activeTab === item.id
                        ? 'bg-[#EEF2FF] dark:bg-[#1E1B4B] text-[#5B45E0] dark:text-[#818CF8] font-bold'
                        : 'hover:bg-slate-50 dark:hover:bg-[#1F2937] text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: Settings & Emergency */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold px-1">
              <span className="text-slate-400">Market Region:</span>
              <div className="flex gap-1">
                <button
                  onClick={() => handleMarketSelect('IND')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${activeMarket === 'IND' ? 'bg-[#5B45E0] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
                >
                  🇮🇳 IND
                </button>
                <button
                  onClick={() => handleMarketSelect('USA')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${activeMarket === 'USA' ? 'bg-[#5B45E0] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
                >
                  🇺🇸 USA
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onKillSwitch();
              }}
              className="w-full py-2.5 rounded-xl bg-red-600/10 text-red-600 dark:text-red-400 border border-red-500/20 text-xs font-bold flex items-center justify-center gap-2 hover:bg-red-600/20 transition"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Universal Kill Switch</span>
            </button>
          </div>
        </div>
      )}

      {/* 9. Mobile Bottom Navigation Bar (Fixed for phones & small tablets) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0B1220]/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 lg:hidden flex items-center justify-around py-2 px-1 safe-area-pb shadow-lg">
        <button
          onClick={() => {
            handleSelectTab('dashboard');
            setMobileMenuOpen(false);
          }}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
            activeTab === 'dashboard'
              ? 'text-[#5B45E0] dark:text-[#818CF8] font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span className="text-[10px] leading-none">Dashboard</span>
        </button>

        <button
          onClick={() => {
            handleSelectTab('mystrategies');
            setMobileMenuOpen(false);
          }}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
            activeTab === 'mystrategies' || activeTab === 'readystrategies'
              ? 'text-[#5B45E0] dark:text-[#818CF8] font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span className="text-[10px] leading-none">Strategies</span>
        </button>

        <button
          onClick={() => {
            handleSelectTab('usingai');
            setMobileMenuOpen(false);
          }}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
            activeTab === 'usingai'
              ? 'text-[#5B45E0] dark:text-[#818CF8] font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#FF6B00]" />
          <span className="text-[10px] leading-none">AI Quant</span>
        </button>

        <button
          onClick={() => {
            handleSelectTab('optionchain');
            setMobileMenuOpen(false);
          }}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
            activeTab === 'optionchain'
              ? 'text-[#5B45E0] dark:text-[#818CF8] font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span className="text-[10px] leading-none">Options</span>
        </button>

        <button
          onClick={() => {
            handleSelectTab('admin');
            setMobileMenuOpen(false);
          }}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
            activeTab === 'admin'
              ? 'text-[#FF6B00] font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-[#FF6B00]" />
          <span className="text-[10px] leading-none">Admin</span>
        </button>
      </nav>
    </header>
  );
}
