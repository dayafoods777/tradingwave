'use client';

import React, { useState } from 'react';
import {
  Layers,
  Activity,
  Zap,
  TrendingUp,
  ShieldAlert,
  Server,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Code2,
  ChevronRight,
  Sparkles,
  BarChart3,
  Globe
} from 'lucide-react';

export default function TradingWaveApp() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'builder' | 'wizard' | 'optionchain' | 'backtest' | 'brokers'>('dashboard');

  // Dashboard Live State
  const [livePnl, setLivePnl] = useState<number>(14250.0);
  const [isLiveActive, setIsLiveActive] = useState<boolean>(true);
  const [killSwitchTriggered, setKillSwitchTriggered] = useState<boolean>(false);

  // Deployed Bots
  const [deployedBots, setDeployedBots] = useState([
    {
      id: 'bot_01',
      name: 'NIFTY 9:20 Intraday Short Straddle',
      underlying: 'NIFTY 50',
      status: 'ACTIVE',
      mode: 'PAPER',
      multiplier: 2,
      dailyPnl: 8450.0,
      legs: 2,
      lastCheck: '10s ago'
    },
    {
      id: 'bot_02',
      name: 'BANKNIFTY Supertrend Momentum',
      underlying: 'BANKNIFTY',
      status: 'ACTIVE',
      mode: 'LIVE_AUTO',
      multiplier: 1,
      dailyPnl: 5800.0,
      legs: 1,
      lastCheck: '4s ago'
    }
  ]);

  // Strategy Builder State
  const [strategyName, setStrategyName] = useState('NIFTY Theta Scalper v1.0');
  const [underlying, setUnderlying] = useState('NIFTY 50');
  const [conditionOperator, setConditionOperator] = useState<'AND' | 'OR'>('AND');
  const [conditions, setConditions] = useState([
    { id: 1, left: 'Time', op: '>=', right: '09:20' },
    { id: 2, left: 'Close', op: '>', right: 'SMA(20)' }
  ]);
  const [legs, setLegs] = useState([
    { id: 1, action: 'SELL', type: 'CALL', strike: 'ATM', expiry: 'CURRENT_WEEK', lots: 1, sl: 25 },
    { id: 2, action: 'SELL', type: 'PUT', strike: 'ATM', expiry: 'CURRENT_WEEK', lots: 1, sl: 25 }
  ]);

  // Backtest State
  const [backtestRunning, setBacktestRunning] = useState(false);
  const [backtestResult, setBacktestResult] = useState<{
    totalPnl: number;
    winRate: number;
    maxDrawdown: number;
    trades: number;
    profitFactor: number;
  } | null>({
    totalPnl: 48650.0,
    winRate: 68.4,
    maxDrawdown: 4200.0,
    trades: 38,
    profitFactor: 2.14
  });

  const handleKillSwitch = () => {
    if (confirm('EMERGENCY ACTION: Are you sure you want to activate Universal Kill Switch? All open positions will be squared off immediately.')) {
      setKillSwitchTriggered(true);
      setDeployedBots(prev => prev.map(b => ({ ...b, status: 'SQUARED_OFF' })));
      alert('UNIVERSAL KILL SWITCH EXECUTED: All bot orders squared off.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col font-sans">
      {/* 1. TOP NAVIGATION BAR */}
      <header className="h-16 border-b border-[#1E293B] bg-[#0E1526] px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-6">
          {/* Logo Badge */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6600] to-[#E65C00] flex items-center justify-center font-black text-2xl text-white shadow-lg shadow-orange-500/20">
              W
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-bold text-xl text-white tracking-tight">Trading</span>
                <span className="font-bold text-xl text-[#FF6600] tracking-tight">Wave</span>
              </div>
              <div className="text-[10px] tracking-widest text-slate-400 font-semibold uppercase mt-0.5">
                Trade Bindas
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 ml-4 bg-[#131B2E] p-1 rounded-lg border border-[#1E293B]">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeTab === 'dashboard' ? 'bg-[#FF6600] text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('builder')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeTab === 'builder' ? 'bg-[#FF6600] text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Strategy Builder
            </button>
            <button
              onClick={() => setActiveTab('wizard')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeTab === 'wizard' ? 'bg-[#FF6600] text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Options Wizard
            </button>
            <button
              onClick={() => setActiveTab('optionchain')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeTab === 'optionchain' ? 'bg-[#FF6600] text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Option Chain
            </button>
            <button
              onClick={() => setActiveTab('backtest')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeTab === 'backtest' ? 'bg-[#FF6600] text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Backtest Studio
            </button>
            <button
              onClick={() => setActiveTab('brokers')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeTab === 'brokers' ? 'bg-[#FF6600] text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Brokers
            </button>
          </nav>
        </div>

        {/* Right Header Status & Controls */}
        <div className="flex items-center gap-4">
          {/* Live Market Pulse */}
          <div className="hidden lg:flex items-center gap-2 bg-[#131B2E] border border-[#1E293B] px-3 py-1.5 rounded-lg text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-slate-400">NSE Market:</span>
            <span className="font-semibold text-emerald-400">OPEN (24,532.40)</span>
          </div>

          {/* Daily PnL Ticker */}
          <div className="bg-[#131B2E] border border-[#1E293B] px-3.5 py-1.5 rounded-lg flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">MTM:</span>
            <span className={`text-sm font-bold font-mono ${livePnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {livePnl >= 0 ? '+' : ''}₹{livePnl.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>

          {/* Universal Emergency Kill Switch */}
          <button
            onClick={handleKillSwitch}
            disabled={killSwitchTriggered}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md ${
              killSwitchTriggered
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/30 animate-pulse'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>{killSwitchTriggered ? 'KILLED' : 'KILL SWITCH'}</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE CONTENT */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        {/* ========================================================= */}
        {/* TAB 1: DASHBOARD                                          */}
        {/* ========================================================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Top Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-[#131B2E] border border-[#1E293B] p-4 rounded-xl shadow-sm">
                <div className="text-xs text-slate-400 font-medium">Total Daily P&L</div>
                <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                  +₹{livePnl.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-xs text-emerald-500 flex items-center gap-1 mt-2">
                  <TrendingUp className="w-3.5 h-3.5" /> +2.85% return on capital
                </div>
              </div>
              <div className="bg-[#131B2E] border border-[#1E293B] p-4 rounded-xl shadow-sm">
                <div className="text-xs text-slate-400 font-medium">Active Strategy Bots</div>
                <div className="text-2xl font-bold font-mono text-white mt-1">
                  {deployedBots.filter(b => b.status === 'ACTIVE').length} / 5 Running
                </div>
                <div className="text-xs text-slate-400 mt-2">1 Live Auto · 1 Paper</div>
              </div>
              <div className="bg-[#131B2E] border border-[#1E293B] p-4 rounded-xl shadow-sm">
                <div className="text-xs text-slate-400 font-medium">Margin Utilization</div>
                <div className="text-2xl font-bold font-mono text-white mt-1">₹3,45,000</div>
                <div className="text-xs text-slate-400 mt-2">Available: ₹6,55,000</div>
              </div>
              <div className="bg-[#131B2E] border border-[#1E293B] p-4 rounded-xl shadow-sm">
                <div className="text-xs text-slate-400 font-medium">Broker Health</div>
                <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">Connected</div>
                <div className="text-xs text-slate-400 mt-2">Sandbox & Zerodha API</div>
              </div>
            </div>

            {/* Active Deployed Bots Table */}
            <div className="bg-[#131B2E] border border-[#1E293B] rounded-xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-[#1E293B] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[#FF6600]" />
                  <h2 className="font-semibold text-base text-white">Active Deployed Strategies</h2>
                </div>
                <button
                  onClick={() => setActiveTab('builder')}
                  className="bg-[#FF6600] hover:bg-[#E65C00] text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> New Deployment
                </button>
              </div>

              <div className="divide-y divide-[#1E293B]">
                {deployedBots.map((bot) => (
                  <div key={bot.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#162138] transition-colors">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{bot.name}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          bot.mode === 'LIVE_AUTO' ? 'bg-orange-500/20 text-[#FF6600] border border-orange-500/30' : 'bg-slate-700 text-slate-300'
                        }`}>
                          {bot.mode}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          bot.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {bot.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        Underlying: <span className="text-slate-300">{bot.underlying}</span> · Multiplier: {bot.multiplier}x · Legs: {bot.legs} · Checked: {bot.lastCheck}
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="text-xs text-slate-400">P&L</div>
                        <div className={`font-mono font-bold text-base ${bot.dailyPnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {bot.dailyPnl >= 0 ? '+' : ''}₹{bot.dailyPnl.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => alert(`Square off triggered for ${bot.name}`)}
                          className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 rounded-lg text-xs font-semibold"
                        >
                          Square Off
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: VISUAL STRATEGY BUILDER                            */}
        {/* ========================================================= */}
        {activeTab === 'builder' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-[#131B2E] border border-[#1E293B] p-4 rounded-xl">
              <div>
                <input
                  type="text"
                  value={strategyName}
                  onChange={(e) => setStrategyName(e.target.value)}
                  className="bg-transparent font-bold text-lg text-white border-b border-transparent hover:border-slate-600 focus:border-[#FF6600] outline-none"
                />
                <div className="text-xs text-slate-400 mt-0.5">Version 1.0 · Multi-Set Engine · Zero-Eval Safe AST</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert('Strategy AST successfully validated with 0 errors.')}
                  className="bg-[#1E293B] hover:bg-slate-700 text-slate-200 px-3.5 py-2 rounded-lg text-xs font-semibold"
                >
                  Validate AST
                </button>
                <button
                  onClick={() => alert(`Strategy "${strategyName}" saved and compiled.`)}
                  className="bg-[#FF6600] hover:bg-[#E65C00] text-white px-4 py-2 rounded-lg text-xs font-bold shadow-md shadow-orange-500/20"
                >
                  Save Strategy
                </button>
              </div>
            </div>

            {/* Set 1 Container */}
            <div className="bg-[#131B2E] border border-[#1E293B] rounded-xl overflow-hidden shadow-sm">
              <div className="bg-[#162138] p-3 px-4 border-b border-[#1E293B] flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-sm text-white">
                  <span className="w-5 h-5 rounded-full bg-[#FF6600] text-white text-[10px] flex items-center justify-center">1</span>
                  <span>SET 1: Entry, Legs & Exit Rules</span>
                </div>
                <div className="text-xs text-slate-400">
                  Underlying: <span className="font-semibold text-slate-200">{underlying}</span>
                </div>
              </div>

              <div className="p-5 space-y-6">
                {/* 1. Entry Condition Block */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Entry Conditions</span>
                    <div className="flex items-center gap-1 text-xs">
                      <span className="text-slate-400">Combine logic:</span>
                      <select
                        value={conditionOperator}
                        onChange={(e) => setConditionOperator(e.target.value as any)}
                        className="bg-[#0B0F19] text-[#FF6600] border border-[#1E293B] rounded px-2 py-0.5 font-bold"
                      >
                        <option value="AND">ALL (AND)</option>
                        <option value="OR">ANY (OR)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2 bg-[#0B0F19] p-3 rounded-lg border border-[#1E293B]">
                    {conditions.map((cond, idx) => (
                      <div key={cond.id} className="flex items-center gap-2 text-xs">
                        <span className="text-slate-500 font-mono w-4">{idx + 1}.</span>
                        <input
                          type="text"
                          value={cond.left}
                          onChange={(e) => {
                            const newConds = [...conditions];
                            newConds[idx].left = e.target.value;
                            setConditions(newConds);
                          }}
                          className="bg-[#131B2E] border border-[#1E293B] text-slate-200 px-2.5 py-1.5 rounded w-36 font-mono"
                        />
                        <select
                          value={cond.op}
                          onChange={(e) => {
                            const newConds = [...conditions];
                            newConds[idx].op = e.target.value;
                            setConditions(newConds);
                          }}
                          className="bg-[#131B2E] border border-[#1E293B] text-[#FF6600] px-2 py-1.5 rounded font-bold"
                        >
                          <option value=">=">&gt;=</option>
                          <option value="<=">&lt;=</option>
                          <option value=">">&gt;</option>
                          <option value="<">&lt;</option>
                          <option value="==">==</option>
                          <option value="CROSSES_ABOVE">Crosses Above</option>
                          <option value="CROSSES_BELOW">Crosses Below</option>
                        </select>
                        <input
                          type="text"
                          value={cond.right}
                          onChange={(e) => {
                            const newConds = [...conditions];
                            newConds[idx].right = e.target.value;
                            setConditions(newConds);
                          }}
                          className="bg-[#131B2E] border border-[#1E293B] text-slate-200 px-2.5 py-1.5 rounded flex-1 font-mono"
                        />
                        <button
                          onClick={() => setConditions(conditions.filter(c => c.id !== cond.id))}
                          className="text-slate-500 hover:text-red-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => setConditions([...conditions, { id: Date.now(), left: 'RSI(14)', op: '<', right: '30' }])}
                      className="text-xs text-[#FF6600] hover:underline flex items-center gap-1 font-semibold mt-2"
                    >
                      <Plus className="w-3 h-3" /> Add Condition
                    </button>
                  </div>
                </div>

                {/* 2. Position Legs Block */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Position Legs to Execute</span>
                    <button
                      onClick={() => setLegs([...legs, { id: Date.now(), action: 'BUY', type: 'CALL', strike: 'OTM_1', expiry: 'CURRENT_WEEK', lots: 1, sl: 20 }])}
                      className="text-xs text-[#FF6600] hover:underline flex items-center gap-1 font-semibold"
                    >
                      <Plus className="w-3 h-3" /> Add Leg
                    </button>
                  </div>

                  <div className="bg-[#0B0F19] rounded-lg border border-[#1E293B] overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#162138] text-slate-400 font-semibold border-b border-[#1E293B]">
                        <tr>
                          <th className="p-2.5 px-3">Action</th>
                          <th className="p-2.5">Type</th>
                          <th className="p-2.5">Expiry</th>
                          <th className="p-2.5">Strike</th>
                          <th className="p-2.5">Lots</th>
                          <th className="p-2.5">Stop Loss %</th>
                          <th className="p-2.5"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1E293B] font-mono">
                        {legs.map((leg) => (
                          <tr key={leg.id} className="hover:bg-[#131B2E]">
                            <td className="p-2.5 px-3 font-bold">
                              <span className={leg.action === 'BUY' ? 'text-emerald-400' : 'text-red-400'}>
                                {leg.action}
                              </span>
                            </td>
                            <td className="p-2.5 text-slate-300">{leg.type} OPTION</td>
                            <td className="p-2.5 text-slate-400">{leg.expiry}</td>
                            <td className="p-2.5 font-semibold text-slate-200">{leg.strike}</td>
                            <td className="p-2.5">{leg.lots} (50 Qty)</td>
                            <td className="p-2.5 text-orange-400">{leg.sl}%</td>
                            <td className="p-2.5 text-right">
                              <button
                                onClick={() => setLegs(legs.filter(l => l.id !== leg.id))}
                                className="text-slate-500 hover:text-red-400"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 3. Exit Condition */}
                <div>
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">Set Exit Condition</span>
                  <div className="bg-[#0B0F19] p-3 rounded-lg border border-[#1E293B] text-xs font-mono text-slate-300">
                    [ Time &gt;= 15:15 ] OR [ Set PnL &lt;= -3,000 ]
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: OPTIONS WIZARD                                     */}
        {/* ========================================================= */}
        {activeTab === 'wizard' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white">Options Strategy Wizard</h2>
              <p className="text-xs text-slate-400 mt-0.5">Quickly construct multi-leg option strategies with visual payoff curves.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {['Short Straddle', 'Short Strangle', 'Iron Condor', 'Calendar Spread'].map((preset) => (
                <div key={preset} className="bg-[#131B2E] border border-[#1E293B] hover:border-[#FF6600] p-4 rounded-xl cursor-pointer transition-all shadow-sm">
                  <div className="font-bold text-white text-base">{preset}</div>
                  <div className="text-xs text-slate-400 mt-1">Non-directional income with theta decay.</div>
                  <button className="mt-4 w-full bg-[#1E293B] hover:bg-[#FF6600] hover:text-white text-xs font-semibold py-2 rounded-lg transition-colors">
                    Load Setup
                  </button>
                </div>
              ))}
            </div>

            {/* Payoff Simulation Box */}
            <div className="bg-[#131B2E] border border-[#1E293B] p-5 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold text-sm text-white">Payoff Curve & Risk Metrics (NIFTY Short Straddle)</span>
                <span className="text-xs text-emerald-400 font-mono">Max Profit: ₹14,200 · Max Loss: Unlimited</span>
              </div>
              <div className="h-44 bg-[#0B0F19] rounded-lg border border-[#1E293B] flex items-center justify-center text-slate-500 font-mono text-xs">
                [ Interactive Payoff Canvas: Breakeven 24,216 — 24,784 ]
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: OPTION CHAIN                                       */}
        {/* ========================================================= */}
        {activeTab === 'optionchain' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">NIFTY Option Chain & Greeks</h2>
                <p className="text-xs text-slate-400">Live synthetic Black-Scholes Greeks and open interest distribution.</p>
              </div>
              <div className="text-xs font-mono bg-[#131B2E] border border-[#1E293B] px-3 py-1.5 rounded-lg">
                Spot: <span className="font-bold text-emerald-400">24,532.40</span>
              </div>
            </div>

            <div className="bg-[#131B2E] border border-[#1E293B] rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-center text-xs font-mono">
                <thead className="bg-[#162138] text-slate-400 border-b border-[#1E293B]">
                  <tr>
                    <th colSpan={4} className="p-2 border-r border-[#1E293B] text-emerald-400 font-bold">CALL OPTIONS (CE)</th>
                    <th className="p-2 bg-[#0E1526] text-white font-bold">STRIKE</th>
                    <th colSpan={4} className="p-2 border-l border-[#1E293B] text-red-400 font-bold">PUT OPTIONS (PE)</th>
                  </tr>
                  <tr className="border-t border-[#1E293B] text-[10px] text-slate-400">
                    <th className="p-1.5">OI</th>
                    <th className="p-1.5">IV</th>
                    <th className="p-1.5">Delta</th>
                    <th className="p-1.5 border-r border-[#1E293B]">LTP</th>
                    <th className="p-1.5 bg-[#0E1526]"></th>
                    <th className="p-1.5 border-l border-[#1E293B]">LTP</th>
                    <th className="p-1.5">Delta</th>
                    <th className="p-1.5">IV</th>
                    <th className="p-1.5">OI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E293B]">
                  {[
                    { strike: 24400, cLtp: 245.2, cDelta: 0.65, cIv: 13.8, cOi: '1.2M', pLtp: 42.1, pDelta: -0.35, pIv: 14.5, pOi: '2.8M' },
                    { strike: 24450, cLtp: 202.8, cDelta: 0.58, cIv: 13.9, cOi: '1.8M', pLtp: 58.5, pDelta: -0.42, pIv: 14.2, pOi: '2.1M' },
                    { strike: 24500, cLtp: 165.0, cDelta: 0.51, cIv: 14.0, cOi: '3.4M', pLtp: 81.0, pDelta: -0.49, pIv: 14.0, pOi: '3.1M', isAtm: true },
                    { strike: 24550, cLtp: 132.5, cDelta: 0.43, cIv: 14.1, cOi: '2.5M', pLtp: 108.4, pDelta: -0.57, pIv: 13.9, pOi: '1.4M' },
                    { strike: 24600, cLtp: 104.0, cDelta: 0.36, cIv: 14.2, cOi: '4.1M', pLtp: 140.2, pDelta: -0.64, pIv: 13.8, pOi: '980K' }
                  ].map((row) => (
                    <tr key={row.strike} className={row.isAtm ? 'bg-orange-500/10' : 'hover:bg-[#162138]'}>
                      <td className="p-2 text-slate-400">{row.cOi}</td>
                      <td className="p-2 text-slate-400">{row.cIv}%</td>
                      <td className="p-2 text-slate-300">{row.cDelta}</td>
                      <td className="p-2 font-bold text-emerald-400 border-r border-[#1E293B]">₹{row.cLtp}</td>
                      <td className={`p-2 font-black ${row.isAtm ? 'bg-[#FF6600] text-white shadow-md' : 'bg-[#0E1526] text-white'}`}>
                        {row.strike}
                      </td>
                      <td className="p-2 font-bold text-red-400 border-l border-[#1E293B]">₹{row.pLtp}</td>
                      <td className="p-2 text-slate-300">{row.pDelta}</td>
                      <td className="p-2 text-slate-400">{row.pIv}%</td>
                      <td className="p-2 text-slate-400">{row.pOi}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: BACKTEST STUDIO                                    */}
        {/* ========================================================= */}
        {activeTab === 'backtest' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Backtesting Studio</h2>
                <p className="text-xs text-slate-400">Zero-lookahead event simulation with Indian regulatory STT and turnover fee schedule.</p>
              </div>
              <button
                onClick={() => {
                  setBacktestRunning(true);
                  setTimeout(() => setBacktestRunning(false), 800);
                }}
                className="bg-[#FF6600] hover:bg-[#E65C00] text-white font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-md shadow-orange-500/20"
              >
                <Play className="w-3.5 h-3.5" /> {backtestRunning ? 'Running Simulation...' : 'Run Backtest'}
              </button>
            </div>

            {/* Backtest Results Summary Cards */}
            {backtestResult && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div className="bg-[#131B2E] border border-[#1E293B] p-3.5 rounded-xl">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Net Profit</div>
                  <div className="text-xl font-bold font-mono text-emerald-400 mt-1">+₹{backtestResult.totalPnl.toLocaleString()}</div>
                </div>
                <div className="bg-[#131B2E] border border-[#1E293B] p-3.5 rounded-xl">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Win Rate</div>
                  <div className="text-xl font-bold font-mono text-white mt-1">{backtestResult.winRate}%</div>
                </div>
                <div className="bg-[#131B2E] border border-[#1E293B] p-3.5 rounded-xl">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Profit Factor</div>
                  <div className="text-xl font-bold font-mono text-white mt-1">{backtestResult.profitFactor}</div>
                </div>
                <div className="bg-[#131B2E] border border-[#1E293B] p-3.5 rounded-xl">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Max Drawdown</div>
                  <div className="text-xl font-bold font-mono text-red-400 mt-1">-₹{backtestResult.maxDrawdown.toLocaleString()}</div>
                </div>
                <div className="bg-[#131B2E] border border-[#1E293B] p-3.5 rounded-xl">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Total Trades</div>
                  <div className="text-xl font-bold font-mono text-white mt-1">{backtestResult.trades}</div>
                </div>
              </div>
            )}

            {/* Equity Curve Visual Box */}
            <div className="bg-[#131B2E] border border-[#1E293B] p-5 rounded-xl">
              <span className="font-bold text-sm text-white block mb-4">Portfolio Equity Curve (Deterministic Event Simulation)</span>
              <div className="h-44 bg-[#0B0F19] rounded-lg border border-[#1E293B] flex items-center justify-center text-slate-500 font-mono text-xs">
                [ Equity Curve: Steadily compounding equity with max 2.1% drawdown ]
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: BROKERS MATRIX                                     */}
        {/* ========================================================= */}
        {activeTab === 'brokers' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white">Broker Connections</h2>
              <p className="text-xs text-slate-400">Provider-independent adapter connections with automated token management.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#131B2E] border border-emerald-500/40 p-4 rounded-xl shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Sandbox Simulator</span>
                  <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">CONNECTED</span>
                </div>
                <div className="text-xs text-slate-400 mt-2">In-memory virtual execution broker with deterministic fills.</div>
                <div className="mt-4 font-mono text-sm text-slate-200">
                  Available Margin: <span className="text-emerald-400 font-bold">₹10,00,000.00</span>
                </div>
              </div>

              <div className="bg-[#131B2E] border border-[#1E293B] p-4 rounded-xl shadow-sm opacity-80">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Zerodha Kite</span>
                  <span className="text-[10px] font-bold bg-slate-700 text-slate-400 px-2 py-0.5 rounded-full">DISCONNECTED</span>
                </div>
                <div className="text-xs text-slate-400 mt-2">Kite Connect REST API & WebSocket tick stream.</div>
                <button className="mt-4 w-full bg-[#1E293B] hover:bg-slate-700 text-xs font-semibold py-2 rounded-lg text-slate-200">
                  Connect Account
                </button>
              </div>

              <div className="bg-[#131B2E] border border-[#1E293B] p-4 rounded-xl shadow-sm opacity-80">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">DhanHQ</span>
                  <span className="text-[10px] font-bold bg-slate-700 text-slate-400 px-2 py-0.5 rounded-full">DISCONNECTED</span>
                </div>
                <div className="text-xs text-slate-400 mt-2">Direct API access with 30-day non-expiring token.</div>
                <button className="mt-4 w-full bg-[#1E293B] hover:bg-slate-700 text-xs font-semibold py-2 rounded-lg text-slate-200">
                  Connect Account
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 3. FOOTER */}
      <footer className="h-12 border-t border-[#1E293B] bg-[#0E1526] px-6 flex items-center justify-between text-xs text-slate-500">
        <div>TradingWave © 2026 · Trade Bindas</div>
        <div className="flex items-center gap-4">
          <span>Engine: Fastify / TypeScript / Node.js</span>
          <span>DSL: Zero-Eval AST</span>
          <span className="text-emerald-500 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Live Offline: Active
          </span>
        </div>
      </footer>
    </div>
  );
}

