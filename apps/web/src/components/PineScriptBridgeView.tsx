'use client';

import React, { useState } from 'react';
import {
  Code,
  Copy,
  Check,
  Play,
  RotateCcw,
  Zap,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Radio,
  FileCode,
  Terminal,
  Activity,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface InboundSignal {
  id: string;
  timestamp: string;
  symbol: string;
  action: 'BUY' | 'SELL';
  price: string;
  orderStatus: 'FILLED' | 'PENDING' | 'REJECTED';
  broker: string;
}

const DEFAULT_PINE_SCRIPT = `//@version=5
strategy("TradingWave BankNifty Supertrend Breakout", overlay=true, margin_long=100, margin_short=100)

// Supertrend Inputs
atrPeriod = input.int(10, "ATR Length")
factor = input.float(3.0, "Factor")

[supertrend, direction] = ta.supertrend(factor, atrPeriod)

// EMA Ribbon
emaFast = ta.ema(close, 9)
emaSlow = ta.ema(close, 21)

// Entry Conditions
longCondition = ta.crossover(close, supertrend) and emaFast > emaSlow
shortCondition = ta.crossunder(close, supertrend) and emaFast < emaSlow

if (longCondition)
    strategy.entry("Long Call", strategy.long)
    alert('{"action":"BUY","symbol":"BANKNIFTY","type":"CE","strike":"ATM","sl":"20%"}', alert.freq_once_per_bar_close)

if (shortCondition)
    strategy.entry("Short Put", strategy.short)
    alert('{"action":"BUY","symbol":"BANKNIFTY","type":"PE","strike":"ATM","sl":"20%"}', alert.freq_once_per_bar_close)
`;

export default function PineScriptBridgeView({
  onLoadStrategyToBuilder
}: {
  onLoadStrategyToBuilder?: (stratData: any) => void;
}) {
  const [pineCode, setPineCode] = useState(DEFAULT_PINE_SCRIPT);
  const [webhookUrl] = useState('https://api.tradingwave.tech/v1/webhooks/pinebridge?secret=tw_wh_984f2e71c');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [isTranspiling, setIsTranspiling] = useState(false);
  const [transpiledResult, setTranspiledResult] = useState<any | null>(null);

  const [inboundSignals, setInboundSignals] = useState<InboundSignal[]>([
    { id: 'sig_101', timestamp: '12:49:12', symbol: 'BANKNIFTY 52000 CE', action: 'BUY', price: '₹ 284.50', orderStatus: 'FILLED', broker: 'Zerodha Kite' },
    { id: 'sig_100', timestamp: '11:15:00', symbol: 'NIFTY 24400 PE', action: 'SELL', price: '₹ 112.20', orderStatus: 'FILLED', broker: 'DhanHQ' },
    { id: 'sig_099', timestamp: '09:30:45', symbol: 'BANKNIFTY 51800 CE', action: 'BUY', price: '₹ 310.00', orderStatus: 'FILLED', broker: 'Angel One' }
  ]);

  const alertPayloadJson = `{
  "secret": "tw_wh_984f2e71c",
  "strategy": "TradingWave PineBridge",
  "action": "{{strategy.order.action}}",
  "symbol": "{{ticker}}",
  "price": {{close}},
  "time": "{{time}}"
}`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(alertPayloadJson);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  const handleTranspile = () => {
    setIsTranspiling(true);
    setTranspiledResult(null);

    setTimeout(() => {
      setIsTranspiling(false);
      const isBankNifty = pineCode.includes('BankNifty') || pineCode.includes('BANKNIFTY');
      const strat = {
        name: isBankNifty ? 'PineScript BankNifty Supertrend Breakout' : 'PineScript TV Custom Strategy',
        underlying: isBankNifty ? 'BANKNIFTY' : 'NIFTY 50',
        entryConditions: [
          'LTP(Underlying) Crosses Above Supertrend(Underlying, 10, 3, 5m)',
          'EMA(Underlying, 9, 5m, 0) > EMA(Underlying, 21, 5m, 0)'
        ],
        legs: [
          { action: 'BUY', type: 'CALL', strike: 'ATM', product: 'MIS', lots: 1, sl: '20%', target: '45%', moveToCost: true }
        ],
        exitConditions: [
          'LTP(Underlying) Crosses Below Supertrend(Underlying, 10, 3, 5m)',
          'Time >= 15:15:00'
        ]
      };
      setTranspiledResult(strat);
    }, 600);
  };

  const handleSimulateWebhook = () => {
    const symbols = ['BANKNIFTY 52200 CE', 'NIFTY 24350 PE', 'BANKNIFTY 52000 PE'];
    const actions: ('BUY' | 'SELL')[] = ['BUY', 'SELL'];
    const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
    const randomAction = actions[Math.floor(Math.random() * actions.length)];
    const randomPrice = (Math.random() * 200 + 80).toFixed(2);
    const now = new Date().toLocaleTimeString('en-US', { hour12: false });

    const newSignal: InboundSignal = {
      id: `sig_${Date.now().toString().slice(-3)}`,
      timestamp: now,
      symbol: randomSymbol,
      action: randomAction,
      price: `₹ ${randomPrice}`,
      orderStatus: 'FILLED',
      broker: 'TradingWave Sandbox'
    };

    setInboundSignals(prev => [newSignal, ...prev]);
  };

  return (
    <div className="space-y-8 font-sans pb-16">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#1E1B4B] via-[#0F172A] to-[#1E1B4B] border border-indigo-900/40 text-white shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/20 text-[#818CF8] border border-indigo-500/30 flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-[#818CF8] animate-pulse" />
                TRADINGVIEW WEBHOOK BRIDGE
              </span>
              <span className="text-xs text-slate-400 font-mono">Zero Latency Alert Listener</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Pine Script Bridge &amp; Webhook Dispatcher
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Connect your TradingView Pine Script indicators and alerts directly to Indian &amp; Global brokers with zero-latency execution.
            </p>
          </div>

          <button
            onClick={handleSimulateWebhook}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#FF8A3D] text-white text-xs font-bold shadow-lg shadow-orange-500/20 hover:brightness-110 flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>Simulate Inbound TV Alert</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Pine Script Editor & Transpiler, Right Webhook Config & Signals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Code Editor & Transpiler (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#1F2937] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-[#5B45E0]" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Pine Script v5 Source Code
                </h3>
              </div>
              <button
                onClick={handleTranspile}
                disabled={isTranspiling}
                className="px-4 py-1.5 rounded-xl bg-[#5B45E0] hover:bg-[#4935C7] text-white text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                {isTranspiling ? <RotateCcw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>Transpile to TradingWave DSL</span>
              </button>
            </div>

            <textarea
              rows={14}
              value={pineCode}
              onChange={e => setPineCode(e.target.value)}
              className="w-full p-4 rounded-xl font-mono text-xs leading-relaxed bg-slate-950 text-emerald-400 border border-slate-800 focus:outline-none focus:border-[#5B45E0] selection:bg-[#5B45E0]"
            />

            {/* Transpiled Output */}
            {transpiledResult && (
              <div className="p-4 rounded-xl bg-[#EEF2FF] dark:bg-[#1E1B4B]/50 border border-[#5B45E0]/30 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#5B45E0] dark:text-[#818CF8] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Transpiled Strategy Structure Ready:</span>
                  </span>
                  {onLoadStrategyToBuilder && (
                    <button
                      onClick={() => onLoadStrategyToBuilder(transpiledResult)}
                      className="px-3 py-1 rounded-lg bg-[#5B45E0] text-white text-[11px] font-bold hover:bg-[#4935C7] transition"
                    >
                      Open in Builder →
                    </button>
                  )}
                </div>

                <div className="text-xs font-mono space-y-1 text-slate-800 dark:text-slate-200">
                  <div><strong>Name:</strong> {transpiledResult.name}</div>
                  <div><strong>Underlying:</strong> {transpiledResult.underlying}</div>
                  <div><strong>Entry Rules:</strong> {transpiledResult.entryConditions.join(' AND ')}</div>
                  <div><strong>Leg:</strong> {transpiledResult.legs[0].action} {transpiledResult.legs[0].type} {transpiledResult.legs[0].strike} (SL: {transpiledResult.legs[0].sl})</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Webhook Credentials & Signal Stream (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Webhook Configuration Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#1F2937] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Radio className="w-4 h-4 text-[#5B45E0]" />
              <span>TradingView Alert Setup</span>
            </h3>

            {/* Step 1: Webhook URL */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                1. Webhook URL (Paste into TradingView Alert Webhook URL)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={webhookUrl}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0B1220] font-mono text-[11px] text-slate-900 dark:text-white"
                />
                <button
                  onClick={handleCopyUrl}
                  className="px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer shrink-0"
                >
                  {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedUrl ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Step 2: Message Payload */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  2. Alert Message Body
                </label>
                <button
                  onClick={handleCopyPayload}
                  className="text-[11px] text-[#5B45E0] dark:text-[#818CF8] font-bold flex items-center gap-1 hover:underline cursor-pointer"
                >
                  {copiedPayload ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedPayload ? 'Copied' : 'Copy Payload'}</span>
                </button>
              </div>
              <pre className="p-3 rounded-xl bg-slate-950 text-emerald-400 font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800">
                {alertPayloadJson}
              </pre>
            </div>
          </div>

          {/* Inbound Signals Log */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#1F2937] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-500" />
                <span>Live Signal Dispatch Feed</span>
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 uppercase">
                LISTENING
              </span>
            </div>

            <div className="space-y-2">
              {inboundSignals.map(sig => (
                <div key={sig.id} className="p-3 rounded-xl bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 text-xs font-mono">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`px-1.5 py-0.2 rounded font-bold text-[10px] ${sig.action === 'BUY' ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/20 text-red-600 dark:text-red-400'}`}>
                        {sig.action}
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white font-sans">{sig.symbol}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 font-sans">
                      {sig.timestamp} · via {sig.broker}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-bold text-slate-900 dark:text-white">{sig.price}</span>
                    <span className="block text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase font-sans">
                      {sig.orderStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

