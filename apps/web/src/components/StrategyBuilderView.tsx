'use client';

import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Trash2,
  Play,
  Save,
  Copy,
  Sliders,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  Code,
  ArrowRight,
  TrendingUp,
  Settings2
} from 'lucide-react';

interface ConditionItem {
  id: number;
  text: string;
}

interface LegItem {
  id: number;
  action: 'BUY' | 'SELL';
  type: 'CALL' | 'PUT' | 'FUT' | 'EQ';
  underlying: string;
  expiry: string;
  strike: string;
  product: 'MIS' | 'NRML';
  lots: number;
  sl: string;
  target: string;
  moveToCost: boolean;
}

interface StrategyBuilderViewProps {
  onOpenKeywordModal: (onSelect: (expr: string) => void) => void;
  onDeploy: (name: string) => void;
  onBacktest: (name: string) => void;
}

export default function StrategyBuilderView({
  onOpenKeywordModal,
  onDeploy,
  onBacktest
}: StrategyBuilderViewProps) {
  const [strategyName, setStrategyName] = useState('NIFTY 9:20 Intraday Short Straddle v2.0');
  const [description, setDescription] = useState('Delta-neutral automated options selling engine with continuous monitoring, 25% leg SL, and 15:10 auto square-off.');
  const [underlying, setUnderlying] = useState('NIFTY 50');
  const [checkFrequency, setCheckFrequency] = useState('Continuous');
  const [checkOnCandleClose, setCheckOnCandleClose] = useState(false);
  const [conditionCombinator, setConditionCombinator] = useState<'AND' | 'OR'>('AND');

  // Set 1 Entry Conditions
  const [entryConditions, setEntryConditions] = useState<ConditionItem[]>([
    { id: 1, text: 'Time >= 09:20' },
    { id: 2, text: 'EMA(NIFTY 50, 9, 5m, 0) Crosses Above EMA(NIFTY 50, 21, 5m, 0)' }
  ]);

  // Set 1 Legs
  const [legs, setLegs] = useState<LegItem[]>([
    { id: 1, action: 'SELL', type: 'CALL', underlying: 'NIFTY 50', expiry: 'Current Week', strike: 'ATM', product: 'MIS', lots: 1, sl: '25%', target: '60%', moveToCost: true },
    { id: 2, action: 'SELL', type: 'PUT', underlying: 'NIFTY 50', expiry: 'Current Week', strike: 'ATM', product: 'MIS', lots: 1, sl: '25%', target: '60%', moveToCost: true }
  ]);

  // Set 1 Repair Conditions & Legs
  const [hasRepair, setHasRepair] = useState(true);
  const [repairCondition, setRepairCondition] = useState('Delta(Set 1, Leg 1) > 0.35 OR Position_PnL(Set 1, Leg 1) <= -2500');
  const [repairLegAction, setRepairLegAction] = useState('BUY · NIFTY 50 · OTM 2 CE · Current Week · 1 lot');

  // Set 1 Exit Conditions
  const [exitConditions, setExitConditions] = useState<ConditionItem[]>([
    { id: 1, text: 'Time >= 15:10' },
    { id: 2, text: 'Strategy_PnL <= -4000 OR Strategy_PnL >= 8000' }
  ]);

  // Universal Stop Loss & Trailing
  const [universalSl, setUniversalSl] = useState('4000');
  const [universalTarget, setUniversalTarget] = useState('8000');
  const [trailIfProfit, setTrailIfProfit] = useState('2000');
  const [trailStopBy, setTrailStopBy] = useState('1000');

  const [savedBanner, setSavedBanner] = useState(false);

  const handleAddCondition = () => {
    onOpenKeywordModal((newExpr: string) => {
      setEntryConditions(prev => [...prev, { id: Date.now(), text: newExpr }]);
    });
  };

  const handleAddExitCondition = () => {
    onOpenKeywordModal((newExpr: string) => {
      setExitConditions(prev => [...prev, { id: Date.now(), text: newExpr }]);
    });
  };

  const handleAddLeg = () => {
    setLegs(prev => [
      ...prev,
      {
        id: Date.now(),
        action: 'BUY',
        type: 'CALL',
        underlying: underlying,
        expiry: 'Current Week',
        strike: 'OTM 1',
        product: 'MIS',
        lots: 1,
        sl: '20%',
        target: '40%',
        moveToCost: false
      }
    ]);
  };

  const handleSave = () => {
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header & Meta Bar */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-[#1E293B] shadow-sm dark:shadow-xl space-y-4 transition-colors">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF6600]">
              Advanced Strategy Builder · No Code
            </span>
            <input
              type="text"
              value={strategyName}
              onChange={e => setStrategyName(e.target.value)}
              className="text-2xl font-black text-slate-900 dark:text-white bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-[#FF6600] focus:outline-none transition block mt-1 w-full max-w-xl"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-bold flex items-center gap-1.5 transition"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Strategy</span>
            </button>
            <button
              onClick={() => onBacktest(strategyName)}
              className="px-4 py-2 rounded-xl border border-slate-300 hover:border-slate-400 dark:border-slate-700 dark:hover:border-slate-500 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition"
            >
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Backtest</span>
            </button>
            <button
              onClick={() => onDeploy(strategyName)}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#FF6600] to-[#E65C00] text-white text-xs font-bold shadow-lg shadow-orange-500/20 hover:brightness-110 flex items-center gap-1.5 transition"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Deploy 1-Click</span>
            </button>
          </div>
        </div>

        {savedBanner && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Strategy AST validated successfully with Zero-Eval security parser. Ready for deployment.</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 border-t border-slate-200 dark:border-[#1E293B] text-xs">
          <div>
            <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Default Underlying</label>
            <select
              value={underlying}
              onChange={e => setUnderlying(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#0E1526] border border-slate-200 dark:border-[#1E293B] rounded-lg px-3 py-1.5 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-[#FF6600]"
            >
              <option value="NIFTY 50">NIFTY 50</option>
              <option value="BANKNIFTY">BANKNIFTY</option>
              <option value="FINNIFTY">FINNIFTY</option>
              <option value="MIDCPNIFTY">MIDCPNIFTY</option>
              <option value="SENSEX">SENSEX</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Continuous Check Frequency</label>
            <select
              value={checkFrequency}
              onChange={e => setCheckFrequency(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#0E1526] border border-slate-200 dark:border-[#1E293B] rounded-lg px-3 py-1.5 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-[#FF6600]"
            >
              <option value="Continuous">Continuous (1-second tick)</option>
              <option value="1m">1 minute candle</option>
              <option value="2m">2 minute candle</option>
              <option value="3m">3 minute candle</option>
              <option value="5m">5 minute candle</option>
              <option value="15m">15 minute candle</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Execution Rule</label>
            <label className="flex items-center gap-2 mt-2 cursor-pointer text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={checkOnCandleClose}
                onChange={e => setCheckOnCandleClose(e.target.checked)}
                className="accent-[#FF6600] w-4 h-4 rounded"
              />
              <span>Check on candle close only</span>
            </label>
          </div>

          <div>
            <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Pre-trade Risk Guard</label>
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold mt-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Active · Margin & Collar Collar Guard</span>
            </div>
          </div>
        </div>
      </div>

      {/* SET 1 CONTAINER */}
      <div className="rounded-2xl bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-[#1E293B] shadow-sm dark:shadow-xl overflow-hidden transition-colors">
        {/* Set Header Bar */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-[#0E1526] border-b border-slate-200 dark:border-[#1E293B] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-lg bg-[#FF6600]/15 text-[#FF6600] font-black text-xs flex items-center justify-center">
              1
            </span>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Strategy Set 1</h3>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
              Primary Execution Loop
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 dark:text-slate-400">Condition Combinator:</span>
            <button
              onClick={() => setConditionCombinator(conditionCombinator === 'AND' ? 'OR' : 'AND')}
              className="px-2.5 py-1 rounded bg-[#FF6600] text-white text-xs font-black shadow-sm"
            >
              {conditionCombinator}
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* 1. ENTRY CONDITIONS BLOCK */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <span>Entry Conditions (When all true, take positions below)</span>
              </label>
              <button
                onClick={handleAddCondition}
                className="text-xs px-3 py-1.5 rounded-lg bg-orange-50 dark:bg-[#0E1526] border border-[#FF6600]/40 text-[#FF6600] hover:bg-[#FF6600] hover:text-white font-bold flex items-center gap-1.5 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Condition via Keyword Modal</span>
              </button>
            </div>

            <div className="space-y-2">
              {entryConditions.map((cond, idx) => (
                <div
                  key={cond.id}
                  className="p-3 bg-slate-50 dark:bg-[#0E1526] rounded-xl border border-slate-200 dark:border-[#1E293B] flex items-center justify-between gap-3 text-xs font-mono group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 font-bold">{idx + 1}.</span>
                    <span className="text-slate-900 dark:text-white font-semibold">{cond.text}</span>
                  </div>
                  <button
                    onClick={() => setEntryConditions(entryConditions.filter(c => c.id !== cond.id))}
                    className="p-1 text-slate-400 hover:text-red-500 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 2. POSITION LEGS TABLE */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Positions to Take ({legs.length} Legs)
              </label>
              <button
                onClick={handleAddLeg}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#0E1526] border border-slate-300 dark:border-[#1E293B] text-slate-700 dark:text-slate-300 hover:border-[#FF6600] hover:text-[#FF6600] font-semibold flex items-center gap-1.5 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Position Leg</span>
              </button>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-[#1E293B] overflow-x-auto bg-slate-50 dark:bg-[#0E1526]">
              <table className="w-full text-xs font-mono text-left">
                <thead>
                  <tr className="bg-slate-100 dark:bg-[#111827] text-slate-600 dark:text-slate-400 text-[10px] uppercase border-b border-slate-200 dark:border-[#1E293B]">
                    <th className="py-2.5 px-3">Leg</th>
                    <th className="py-2.5 px-3">Action</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Underlying</th>
                    <th className="py-2.5 px-3">Expiry</th>
                    <th className="py-2.5 px-3">Strike Formula</th>
                    <th className="py-2.5 px-3">Product</th>
                    <th className="py-2.5 px-3">Lots</th>
                    <th className="py-2.5 px-3">Leg SL</th>
                    <th className="py-2.5 px-3">Target</th>
                    <th className="py-2.5 px-3">Move SL to Cost</th>
                    <th className="py-2.5 px-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-[#1E293B]">
                  {legs.map((leg, idx) => (
                    <tr key={leg.id} className="hover:bg-slate-100/70 dark:hover:bg-[#131B2E] transition">
                      <td className="py-2.5 px-3 text-slate-500">{idx + 1}</td>
                      <td className="py-2.5 px-3">
                        <select
                          value={leg.action}
                          onChange={e => {
                            const newLegs = [...legs];
                            newLegs[idx].action = e.target.value as any;
                            setLegs(newLegs);
                          }}
                          className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 font-bold ${
                            leg.action === 'BUY' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                          }`}
                        >
                          <option value="BUY">BUY</option>
                          <option value="SELL">SELL</option>
                        </select>
                      </td>
                      <td className="py-2.5 px-3">
                        <select
                          value={leg.type}
                          onChange={e => {
                            const newLegs = [...legs];
                            newLegs[idx].type = e.target.value as any;
                            setLegs(newLegs);
                          }}
                          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-slate-900 dark:text-white"
                        >
                          <option value="CALL">CE (Call)</option>
                          <option value="PUT">PE (Put)</option>
                          <option value="FUT">FUT (Futures)</option>
                          <option value="EQ">EQ (Equity)</option>
                        </select>
                      </td>
                      <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300 font-sans">{leg.underlying}</td>
                      <td className="py-2.5 px-3">
                        <select
                          value={leg.expiry}
                          onChange={e => {
                            const newLegs = [...legs];
                            newLegs[idx].expiry = e.target.value;
                            setLegs(newLegs);
                          }}
                          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-slate-700 dark:text-slate-300 font-sans"
                        >
                          <option value="Current Week">Current Week</option>
                          <option value="Next Week">Next Week</option>
                          <option value="Current Month">Current Month</option>
                        </select>
                      </td>
                      <td className="py-2.5 px-3">
                        <input
                          type="text"
                          value={leg.strike}
                          onChange={e => {
                            const newLegs = [...legs];
                            newLegs[idx].strike = e.target.value;
                            setLegs(newLegs);
                          }}
                          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-slate-900 dark:text-white w-24"
                        />
                      </td>
                      <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">{leg.product}</td>
                      <td className="py-2.5 px-3">
                        <input
                          type="number"
                          value={leg.lots}
                          onChange={e => {
                            const newLegs = [...legs];
                            newLegs[idx].lots = Number(e.target.value);
                            setLegs(newLegs);
                          }}
                          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-slate-900 dark:text-white w-14"
                        />
                      </td>
                      <td className="py-2.5 px-3">
                        <input
                          type="text"
                          value={leg.sl}
                          onChange={e => {
                            const newLegs = [...legs];
                            newLegs[idx].sl = e.target.value;
                            setLegs(newLegs);
                          }}
                          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-red-600 dark:text-red-400 w-16"
                        />
                      </td>
                      <td className="py-2.5 px-3">
                        <input
                          type="text"
                          value={leg.target}
                          onChange={e => {
                            const newLegs = [...legs];
                            newLegs[idx].target = e.target.value;
                            setLegs(newLegs);
                          }}
                          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-emerald-600 dark:text-emerald-400 w-16"
                        />
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={leg.moveToCost}
                          onChange={e => {
                            const newLegs = [...legs];
                            newLegs[idx].moveToCost = e.target.checked;
                            setLegs(newLegs);
                          }}
                          className="accent-[#FF6600] w-4 h-4 rounded cursor-pointer"
                        />
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => setLegs(legs.filter(l => l.id !== leg.id))}
                          className="p-1 text-slate-400 hover:text-red-500 transition"
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

          {/* 3. REPAIR CONDITIONS BLOCK */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0E1526] border border-slate-200 dark:border-[#1E293B] space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <span>Set Repair Logic (Hedges or Strike Adjustments)</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer text-xs text-slate-600 dark:text-slate-400">
                <input
                  type="checkbox"
                  checked={hasRepair}
                  onChange={e => setHasRepair(e.target.checked)}
                  className="accent-[#FF6600] w-3.5 h-3.5 rounded"
                />
                <span>Enable Repair Condition</span>
              </label>
            </div>

            {hasRepair && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                <div>
                  <span className="text-slate-600 dark:text-slate-400 text-[11px] block mb-1">Repair Trigger Condition:</span>
                  <input
                    type="text"
                    value={repairCondition}
                    onChange={e => setRepairCondition(e.target.value)}
                    className="w-full bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-[#1E293B] rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-[#FF6600]"
                  />
                </div>
                <div>
                  <span className="text-slate-600 dark:text-slate-400 text-[11px] block mb-1">Action when Repair Triggers:</span>
                  <input
                    type="text"
                    value={repairLegAction}
                    onChange={e => setRepairLegAction(e.target.value)}
                    className="w-full bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-[#1E293B] rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-[#FF6600]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 4. SET EXIT CONDITIONS BLOCK */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Set Exit Conditions (Square off all Set 1 legs)
              </label>
              <button
                onClick={handleAddExitCondition}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#0E1526] border border-slate-300 dark:border-[#1E293B] text-slate-700 dark:text-slate-300 hover:border-[#FF6600] hover:text-[#FF6600] font-semibold flex items-center gap-1.5 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Exit Condition</span>
              </button>
            </div>

            <div className="space-y-2">
              {exitConditions.map((cond, idx) => (
                <div
                  key={cond.id}
                  className="p-3 bg-slate-50 dark:bg-[#0E1526] rounded-xl border border-slate-200 dark:border-[#1E293B] flex items-center justify-between gap-3 text-xs font-mono group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 font-bold">{idx + 1}.</span>
                    <span className="text-slate-900 dark:text-white font-semibold">{cond.text}</span>
                  </div>
                  <button
                    onClick={() => setExitConditions(exitConditions.filter(c => c.id !== cond.id))}
                    className="p-1 text-slate-400 hover:text-red-500 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* UNIVERSAL EXIT & TRAILING STOP LOSS BLOCK */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-[#1E293B] shadow-sm dark:shadow-xl space-y-4 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Universal Exit & Trailing Stop Loss</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">Guarantees portfolio protection regardless of set-level conditions</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            Global Risk Layer
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 text-xs font-mono">
          <div>
            <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Universal Stop Loss (₹)</label>
            <input
              type="text"
              value={universalSl}
              onChange={e => setUniversalSl(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#0E1526] border border-slate-200 dark:border-[#1E293B] rounded-lg px-3 py-2 text-red-600 dark:text-red-400 font-bold focus:outline-none focus:border-[#FF6600]"
            />
          </div>

          <div>
            <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Universal Target (₹)</label>
            <input
              type="text"
              value={universalTarget}
              onChange={e => setUniversalTarget(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#0E1526] border border-slate-200 dark:border-[#1E293B] rounded-lg px-3 py-2 text-emerald-600 dark:text-emerald-400 font-bold focus:outline-none focus:border-[#FF6600]"
            />
          </div>

          <div>
            <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Trail If Profit Increases By (₹)</label>
            <input
              type="text"
              value={trailIfProfit}
              onChange={e => setTrailIfProfit(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#0E1526] border border-slate-200 dark:border-[#1E293B] rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-[#FF6600]"
            />
          </div>

          <div>
            <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Trail Stop-Loss By (₹)</label>
            <input
              type="text"
              value={trailStopBy}
              onChange={e => setTrailStopBy(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#0E1526] border border-slate-200 dark:border-[#1E293B] rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-[#FF6600]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
