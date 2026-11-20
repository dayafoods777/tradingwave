'use client';

import React from 'react';
import { Terminal, X, RefreshCw, CheckCircle, Clock } from 'lucide-react';

interface ExecutionLogModalProps {
  isOpen: boolean;
  botName: string;
  onClose: () => void;
}

export default function ExecutionLogModal({ isOpen, botName, onClose }: ExecutionLogModalProps) {
  if (!isOpen) return null;

  const logs = [
    { time: '09:15:00.012', type: 'SYS', text: `Engine initialized for bot: "${botName}". Broker: Zerodha Kite. Mode: LIVE_AUTO.` },
    { time: '09:15:01.045', type: 'FEED', text: 'Market WebSocket stream active. NIFTY 50 Spot tick: 24,342.80.' },
    { time: '09:19:59.998', type: 'CHECK', text: 'Evaluating Set 1 Entry Conditions: [Time >= 09:20: FALSE (09:19:59)].' },
    { time: '09:20:00.124', type: 'CHECK', text: 'Evaluating Set 1 Entry Conditions: [Time >= 09:20: TRUE, EMA(9) > EMA(21): TRUE]. ALL CONDITIONS MET.' },
    { time: '09:20:00.150', type: 'RISK', text: 'Pre-trade Risk Controller passed: Price within collar (0.05%), Rate limits OK (1 req/sec), Margin required: ₹1,42,000, Margin available: ₹3,50,000.' },
    { time: '09:20:00.180', type: 'ORDER', text: 'Dispatching basket order to Broker Adapter: [SELL 1x NIFTY24DEC24350CE MIS, SELL 1x NIFTY24DEC24350PE MIS].' },
    { time: '09:20:00.320', type: 'BROKER', text: 'Broker response received: Order ID #ORD_887411 (CE @ ₹125.40), Order ID #ORD_887412 (PE @ ₹118.20). Status: FILLED.' },
    { time: '09:20:05.000', type: 'POSITION', text: 'Position book updated: Net Delta: -0.02, Theta: +₹1,240/day, Unrealized PnL: +₹150.00.' },
    { time: '09:21:00.005', type: 'CHECK', text: 'Continuous check tick: Universal Exit Conditions: Stoploss (PnL <= -₹3000: FALSE), Target (PnL >= ₹6000: FALSE).' },
    { time: '09:25:00.010', type: 'CHECK', text: 'Continuous check tick: Set 1 Repair Condition: Delta divergence (> 0.25: FALSE). Maintaining active legs.' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#131B2E] border border-[#1E293B] rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E293B] bg-[#0E1526]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Execution Logs & Order Audits</h3>
              <p className="text-xs text-slate-400 font-mono">{botName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 bg-[#0A0D17] flex-1 overflow-y-auto font-mono text-xs space-y-2 border-b border-[#1E293B]">
          {logs.map((log, idx) => (
            <div key={idx} className="flex items-start gap-2.5 leading-relaxed hover:bg-[#111827] p-1.5 rounded transition">
              <span className="text-slate-500 shrink-0">{log.time}</span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold shrink-0 ${
                log.type === 'ORDER' ? 'bg-orange-500/20 text-[#FF6600]' :
                log.type === 'BROKER' ? 'bg-emerald-500/20 text-emerald-400' :
                log.type === 'RISK' ? 'bg-blue-500/20 text-blue-400' :
                'bg-slate-800 text-slate-400'
              }`}>
                {log.type}
              </span>
              <span className="text-slate-300 break-all">{log.text}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between px-6 py-3 bg-[#0E1526] text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Continuous Execution Engine · 1-sec Resolution</span>
          </div>
          <button onClick={onClose} className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
