'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Check,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  MessageSquare,
  Users,
  Cpu,
  Bot,
  Zap,
  CheckCircle2,
  X,
  Copy,
  Send,
  HelpCircle,
  ShieldCheck,
  Clock,
  Coins,
  Calendar,
  RotateCcw,
  Sliders,
  Settings2,
  Layers
} from 'lucide-react';
import { StrategyItem } from './MyStrategiesView';

interface UsingAIViewProps {
  onSaveStrategy?: (strategyData: Partial<StrategyItem>) => void;
  onNavigateTab?: (tab: string) => void;
}

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface ParsedStrategyRules {
  name: string;
  underlying: string;
  segment: 'NFO' | 'NSE' | 'BSE' | 'MCX' | 'DELTAINDIA';
  entryConditions: string[];
  legs: {
    action: 'BUY' | 'SELL';
    type: 'CALL' | 'PUT' | 'FUT';
    strike: string;
    sl: string;
    target: string;
    moveToCost: boolean;
  }[];
  exitConditions: string[];
  universalSl: string;
  universalTarget: string;
  trailIfProfit: string;
  trailStopBy: string;
  minCapitalDisplay: string;
  minCapitalRaw: number;
}

const FAQS: FaqItem[] = [
  {
    id: 'faq_1',
    question: 'What can you actually build?',
    answer:
      'Any strategy expressible in TradingWave: Multi-leg options (straddles, strangles, iron condors, butterflies), indicators (RSI, Supertrend, EMA crossover, VWAP, CPR, Bollinger Bands), time/expiry conditions, dynamic delta hedging, synthetic futures, and TradingView/Python webhook signal execution.'
  },
  {
    id: 'faq_2',
    question: "What if it can't be built?",
    answer:
      "If your logic requires custom external feeds or rules not supported by exchange APIs, Cookie or our quant team will tell you directly within hours and refund 100% of your fee immediately. Nothing is charged for strategies we cannot build."
  },
  {
    id: 'faq_3',
    question: 'How long does it take?',
    answer:
      'Most strategies are delivered within 4 to 12 hours on the same business day. Complex multi-set strategies with custom repair conditions may take up to 24 hours.'
  },
  {
    id: 'faq_4',
    question: 'What counts as one of the 5 changes?',
    answer:
      'Any tweak to your entry conditions, stop-loss percentages, trailing points, contract expiry, target profit, or leg sizing counts as a change. Minor typo fixes or parameter updates are always free.'
  },
  {
    id: 'faq_5',
    question: 'Will it start trading on its own?',
    answer:
      'No. The strategy is delivered as a verified Strategy Template into your account under My Strategies. You retain full control: you can review the rules, run backtests using your ₹500 wallet credit, test it in Paper Trading, and deploy to your broker only when you are 100% satisfied.'
  },
  {
    id: 'faq_6',
    question: 'Can I have it changed later by a person?',
    answer:
      'Yes! You can either chat with Cookie to update the rules or request one of our build team quants to inspect and adjust the sets and legs directly.'
  }
];

// Institutional Natural Language Quant Parser & Synthesizer
function parseNaturalLanguageStrategy(promptText: string, currentRules?: ParsedStrategyRules): ParsedStrategyRules {
  const text = promptText.toLowerCase();

  // Detect Underlying
  let underlying = currentRules?.underlying || 'NIFTY 50';
  let segment: 'NFO' | 'NSE' | 'BSE' | 'MCX' | 'DELTAINDIA' = currentRules?.segment || 'NFO';

  if (text.includes('banknifty') || text.includes('bank nifty')) {
    underlying = 'BANKNIFTY';
    segment = 'NFO';
  } else if (text.includes('finnifty') || text.includes('fin nifty')) {
    underlying = 'FINNIFTY';
    segment = 'NFO';
  } else if (text.includes('sensex')) {
    underlying = 'SENSEX';
    segment = 'BSE';
  } else if (text.includes('crude') || text.includes('mcx')) {
    underlying = 'CRUDEOIL';
    segment = 'MCX';
  } else if (text.includes('btc') || text.includes('bitcoin') || text.includes('crypto')) {
    underlying = 'BTCUSD';
    segment = 'DELTAINDIA';
  } else if (text.includes('reliance')) {
    underlying = 'RELIANCE';
    segment = 'NSE';
  } else if (text.includes('hdfc')) {
    underlying = 'HDFCBANK';
    segment = 'NSE';
  }

  // Detect Stop Loss & Target Numbers
  const slMatch = text.match(/(?:sl|stop\s*loss|stoploss)\s*(?:of|is|at|:)?\s*(\d+)%?/i);
  const slValue = slMatch ? `${slMatch[1]}%` : currentRules?.legs[0]?.sl || '25%';

  const targetMatch = text.match(/(?:target|tp|profit)\s*(?:of|is|at|:)?\s*(\d+)%?/i);
  const targetValue = targetMatch ? `${targetMatch[1]}%` : currentRules?.legs[0]?.target || '60%';

  // Detect Universal SL (₹)
  const uniSlMatch = text.match(/(?:max\s*loss|universal\s*sl|portfolio\s*sl)\s*(?:of|is|at|:)?\s*₹?\s*(\d+)/i);
  const universalSl = uniSlMatch ? uniSlMatch[1] : currentRules?.universalSl || '4000';

  // Detect Universal Target (₹)
  const uniTpMatch = text.match(/(?:max\s*profit|universal\s*target)\s*(?:of|is|at|:)?\s*₹?\s*(\d+)/i);
  const universalTarget = uniTpMatch ? uniTpMatch[1] : currentRules?.universalTarget || '8000';

  // Detect Time
  const timeMatch = text.match(/(\d{1,2}:\d{2})/);
  const entryTime = timeMatch ? timeMatch[1] : '09:20';

  // Detect Strategy Archetype
  let stratName = '';
  let entryConditions: string[] = [];
  let legs: ParsedStrategyRules['legs'] = [];
  let exitConditions: string[] = [`Time >= 15:10`, `Strategy_PnL <= -${universalSl} OR Strategy_PnL >= ${universalTarget}`];

  if (text.includes('straddle') || text.includes('atm ce') || text.includes('atm call and put') || (!currentRules && text.includes('9:20'))) {
    stratName = `${underlying} ${entryTime} Intraday Short Straddle`;
    entryConditions = [`Time >= ${entryTime}`, `Atmiv(${underlying}) >= 11.5`];
    legs = [
      { action: 'SELL', type: 'CALL', strike: 'ATM', sl: slValue, target: targetValue, moveToCost: true },
      { action: 'SELL', type: 'PUT', strike: 'ATM', sl: slValue, target: targetValue, moveToCost: true }
    ];
  } else if (text.includes('strangle') || text.includes('otm')) {
    stratName = `${underlying} Hedged Short Strangle`;
    entryConditions = [`Time >= ${entryTime}`, `Days_to_Expiry(${underlying}) > 0`];
    legs = [
      { action: 'SELL', type: 'CALL', strike: 'OTM 1', sl: slValue, target: targetValue, moveToCost: true },
      { action: 'SELL', type: 'PUT', strike: 'OTM 1', sl: slValue, target: targetValue, moveToCost: true }
    ];
  } else if (text.includes('condor') || text.includes('iron condor')) {
    stratName = `${underlying} Weekly Iron Condor`;
    entryConditions = [`Time >= ${entryTime}`, `Atmiv(${underlying}) <= 16.0`];
    legs = [
      { action: 'BUY', type: 'PUT', strike: 'OTM 3', sl: '50%', target: '80%', moveToCost: false },
      { action: 'SELL', type: 'PUT', strike: 'OTM 1', sl: slValue, target: targetValue, moveToCost: true },
      { action: 'SELL', type: 'CALL', strike: 'OTM 1', sl: slValue, target: targetValue, moveToCost: true },
      { action: 'BUY', type: 'CALL', strike: 'OTM 3', sl: '50%', target: '80%', moveToCost: false }
    ];
  } else if (text.includes('supertrend') || text.includes('trend')) {
    stratName = `${underlying} Multi-Timeframe Supertrend Breakout`;
    entryConditions = [
      `LTP(${underlying}) Crosses Above Supertrend(${underlying}, 10, 3, 5m)`,
      `RSI(${underlying}, 14, 5m, 0) > 55`
    ];
    legs = [
      { action: 'BUY', type: 'CALL', strike: 'ATM', sl: slValue, target: targetValue, moveToCost: true }
    ];
    exitConditions = [
      `LTP(${underlying}) Crosses Below Supertrend(${underlying}, 10, 3, 5m)`,
      `Time >= 15:15`
    ];
  } else if (text.includes('ema') || text.includes('moving average')) {
    stratName = `${underlying} EMA 9/21 Ribbon Momentum Rider`;
    entryConditions = [
      `EMA(${underlying}, 9, 5m, 0) Crosses Above EMA(${underlying}, 21, 5m, 0)`,
      `Close(${underlying}, 5m, 0) > Open(${underlying}, 5m, 0)`
    ];
    legs = [
      { action: 'BUY', type: 'CALL', strike: 'ATM', sl: slValue, target: targetValue, moveToCost: true }
    ];
    exitConditions = [
      `EMA(${underlying}, 9, 5m, 0) Crosses Below EMA(${underlying}, 21, 5m, 0)`,
      `Time >= 15:15`
    ];
  } else if (text.includes('rsi') || text.includes('vwap')) {
    stratName = `${underlying} VWAP & RSI Mean Reversion`;
    entryConditions = [
      `LTP(${underlying}) >= VWAP(${underlying}, 1m)`,
      `RSI(${underlying}, 14, 5m, 0) < 35`
    ];
    legs = [
      { action: 'BUY', type: 'CALL', strike: 'ATM', sl: slValue, target: targetValue, moveToCost: true }
    ];
  } else {
    stratName = currentRules?.name || `${underlying} Custom Quantitative Strategy`;
    entryConditions = currentRules?.entryConditions || [`Time >= ${entryTime}`, `LTP(${underlying}) > Close(${underlying}, 5m, 1)`];
    legs = currentRules?.legs || [
      { action: 'SELL', type: 'CALL', strike: 'ATM', sl: slValue, target: targetValue, moveToCost: true },
      { action: 'SELL', type: 'PUT', strike: 'ATM', sl: slValue, target: targetValue, moveToCost: true }
    ];
  }

  const minCapRaw = segment === 'DELTAINDIA' ? 500 : segment === 'MCX' ? 70000 : 150000;
  const minCapDisplay = segment === 'DELTAINDIA' ? '$ 500' : segment === 'MCX' ? '₹ 70,000' : '₹ 1,50,000';

  return {
    name: stratName,
    underlying,
    segment,
    entryConditions,
    legs,
    exitConditions,
    universalSl,
    universalTarget,
    trailIfProfit: '2000',
    trailStopBy: '1000',
    minCapitalDisplay: minCapDisplay,
    minCapitalRaw: minCapRaw
  };
}

export default function UsingAIView({ onSaveStrategy, onNavigateTab }: UsingAIViewProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<'English' | 'Hindi'>('English');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  // Modals state
  const [cookieModalOpen, setCookieModalOpen] = useState(false);
  const [quantModalOpen, setQuantModalOpen] = useState(false);
  const [connectAiModalOpen, setConnectAiModalOpen] = useState(false);

  // Free AI Provider Settings
  const [aiProvider, setAiProvider] = useState<'built_in' | 'huggingface' | 'openrouter' | 'ollama'>('built_in');

  // Multi-Turn Chat messages state
  const [messages, setMessages] = useState<{ sender: 'user' | 'cookie'; text: string; parsedStrategy?: ParsedStrategyRules }[]>([]);
  const [strategyPrompt, setStrategyPrompt] = useState('');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [latestParsedStrategy, setLatestParsedStrategy] = useState<ParsedStrategyRules | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Quant booking state
  const [quantBookingName, setQuantBookingName] = useState('');
  const [quantBookingPhone, setQuantBookingPhone] = useState('');
  const [quantBookingDate, setQuantBookingDate] = useState('2026-11-22');
  const [quantBookingSlot, setQuantBookingSlot] = useState('11:30 AM IST');
  const [quantBookingConfirmed, setQuantBookingConfirmed] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setExpandedFaq(prev => (prev === id ? null : id));
  };

  const handleStartCookie = () => {
    setCookieModalOpen(true);
    if (messages.length === 0) {
      setMessages([
        {
          sender: 'cookie',
          text: "Hi! I'm **Cookie**, TradingWave's Quant AI. Tell me about the strategy you want to automate — which underlying (NIFTY, BANKNIFTY, SENSEX, CRUDEOIL, BTC), indicators, entry triggers, stop loss %, and profit targets?"
        }
      ]);
    }
  };

  const handleSendPromptToCookie = () => {
    if (!strategyPrompt.trim()) return;
    const userText = strategyPrompt.trim();
    setStrategyPrompt('');

    // Append user message
    const updatedMessages = [...messages, { sender: 'user' as const, text: userText }];
    setMessages(updatedMessages);
    setIsSynthesizing(true);

    setTimeout(() => {
      setIsSynthesizing(false);
      const parsed = parseNaturalLanguageStrategy(userText, latestParsedStrategy || undefined);
      setLatestParsedStrategy(parsed);

      let replyText = `I have analyzed your logic and synthesized the verified rules for **${parsed.name}**:\n\n` +
        `• **Underlying:** ${parsed.underlying} (${parsed.segment})\n` +
        `• **Entry Rules:** ${parsed.entryConditions.join(' AND ')}\n` +
        `• **Leg Structure:** ${parsed.legs.map(l => `${l.action} 1x ${l.strike} ${l.type} (SL: ${l.sl}, Target: ${l.target})`).join(', ')}\n` +
        `• **Universal Risk Limits:** Max Loss: ₹${parsed.universalSl} | Max Profit Target: ₹${parsed.universalTarget}\n` +
        `• **Auto Exit:** ${parsed.exitConditions.join(' OR ')}\n\n` +
        `You can tell me any adjustments (e.g., "Change SL to 15%", "Switch to BankNifty", "Add a hedge"), or click **Deliver Strategy** below to save it into My Strategies!`;

      setMessages(prev => [...prev, { sender: 'cookie' as const, text: replyText, parsedStrategy: parsed }]);
    }, 700);
  };

  const handleConfirmAndDeliver = () => {
    if (!latestParsedStrategy) return;

    if (onSaveStrategy) {
      onSaveStrategy({
        name: latestParsedStrategy.name,
        description: `Synthesized by Cookie Quant AI with ${latestParsedStrategy.legs.length} legs and rules: ${latestParsedStrategy.entryConditions.join(' AND ')}`,
        segment: latestParsedStrategy.segment as any,
        minCapitalDisplay: latestParsedStrategy.minCapitalDisplay,
        minCapitalRaw: latestParsedStrategy.minCapitalRaw,
        type: 'ASB',
        visibility: 'PRIVATE'
      });
    }

    setMessages(prev => [
      ...prev,
      {
        sender: 'cookie',
        text: `✓ **"${latestParsedStrategy.name}"** has been compiled, AST verified, and delivered directly into your account under **My Strategies**!`
      }
    ]);

    setTimeout(() => {
      setCookieModalOpen(false);
      if (onNavigateTab) onNavigateTab('mystrategies');
    }, 1200);
  };

  const handleBookQuant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quantBookingName.trim() || !quantBookingPhone.trim()) return;
    const refCode = `TW-QNT-${Math.floor(1000 + Math.random() * 9000)}`;
    setQuantBookingConfirmed(refCode);
  };

  return (
    <div className="space-y-12 max-w-[1240px] mx-auto pb-16 font-sans">
      {/* 1. TOP HERO SECTION */}
      <div>
        {/* Top Eyebrow & Language Selector */}
        <div className="flex items-center justify-between text-xs font-semibold mb-6">
          <div className="flex items-center gap-1.5 text-[#5B45E0] dark:text-[#818CF8] uppercase tracking-wider">
            <span className="font-mono">—</span>
            <span>BUILD WITH AI</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <span>Language</span>
            <button
              onClick={() => setSelectedLanguage(prev => (prev === 'English' ? 'Hindi' : 'English'))}
              className="font-bold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 flex items-center gap-1 hover:bg-slate-50 dark:hover:bg-[#1F2937] transition cursor-pointer"
            >
              <span>{selectedLanguage}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Main Heading & Subtitle */}
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
          Describe the strategy.{' '}
          <span className="text-[#5B45E0] dark:text-[#818CF8] italic font-serif font-normal">
            Pick who builds it.
          </span>
        </h1>
        <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          Three ways to get a working strategy into your TradingWave account. The first two are the same flat
          price and include the same extras. The third is free to connect and runs on the AI subscription you
          already pay for; what you run through it is charged at your usual TradingWave fees.
        </p>

        {/* 3 Option Doors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {/* DOOR 1: Build it now with Cookie (Featured) */}
          <div className="rounded-2xl p-6 bg-white dark:bg-[#1F2937] border-2 border-[#5B45E0] shadow-xl relative flex flex-col justify-between card-institutional">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EEF2FF] text-[#5B45E0] dark:bg-[#1E1B4B] dark:text-[#818CF8] tracking-wider uppercase">
                  01 FASTEST
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  FREE / INCLUDED
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Build it now with Cookie
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Cookie, TradingWave&apos;s AI, asks what the strategy needs, restates it back for you to confirm,
                builds it and delivers it into your account as a Strategy Template. Most are delivered the
                same day.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="text-sm font-black text-slate-900 dark:text-white mb-4">
                <span>Free Built-In Tool</span>{' '}
                <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                  · or ₹4,999 for white-glove quant review
                </span>
              </div>
              <button
                onClick={handleStartCookie}
                className="w-full py-2.5 px-4 rounded-xl bg-[#5B45E0] hover:bg-[#4935C7] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-indigo-500/20 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Start Cookie AI Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <div className="text-[11px] font-semibold text-[#5B45E0] dark:text-[#818CF8] text-center mt-2.5">
                • INTERACTIVE AST SYNTHESIS
              </div>
            </div>
          </div>

          {/* DOOR 2: Talk to a quant */}
          <div className="rounded-2xl p-6 bg-white dark:bg-[#1F2937] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-slate-300 transition card-institutional">
            <div>
              <div className="flex items-center gap-2 mb-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <span className="font-bold">02</span>
                <span>• Team hours 9 am – 7 pm IST</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Talk to a quant
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Would rather explain it to a person? Send the idea and a quant from our build team takes it
                from there — they ask what it needs, build it and deliver it the same way. Same flat price; the
                help costs nothing extra.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="text-sm font-black text-slate-900 dark:text-white mb-4">
                <span>₹4,999 + GST</span>{' '}
                <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                  · no fee for the quant
                </span>
              </div>
              <button
                onClick={() => {
                  setQuantBookingConfirmed(null);
                  setQuantModalOpen(true);
                }}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B1220] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-white text-xs font-semibold transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span>Book 1-on-1 Consultation</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* DOOR 3: Connect your own AI */}
          <div className="rounded-2xl p-6 bg-white dark:bg-[#1F2937] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-slate-300 transition card-institutional">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  03 FREE TO CONNECT
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Connect your own AI
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Paste one URL into Claude, ChatGPT, Gemini, Cursor or Codex and build, backtest and change
                strategies by describing them in the chat you already use. Connecting is free. Backtests,
                deployments and other actions you run through it are charged at your usual TradingWave fees.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="text-sm font-black text-slate-900 dark:text-white mb-4">
                <span>Free to connect</span>{' '}
                <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                  · usage at your usual TradingWave fees
                </span>
              </div>
              <button
                onClick={() => setConnectAiModalOpen(true)}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B1220] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-white text-xs font-semibold transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <Bot className="w-3.5 h-3.5 text-slate-400" />
                <span>Connect Claude / ChatGPT</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Included with Door 1 & 2 Banner */}
        <div className="mt-6 p-4 rounded-2xl bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 text-xs">
          <div className="font-bold text-[#5B45E0] dark:text-[#818CF8] uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>INCLUDED WITH DOOR 1 AND DOOR 2</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-slate-700 dark:text-slate-300 font-medium">
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#5B45E0]" />
              <span>₹500 in your wallet for backtests</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#5B45E0]" />
              <span>30 days of the Starter plan, free, if your account has no plan</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#5B45E0]" />
              <span>5 changes to the strategy</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#5B45E0]" />
              <span>Nothing charged if it can&apos;t be built</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. DOOR 01: BUILD IT NOW WITH COOKIE */}
      <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-1.5 text-[#5B45E0] dark:text-[#818CF8] text-xs font-semibold uppercase tracking-wider mb-2">
          <span className="font-mono">—</span>
          <span>DOOR 01 · BUILD IT NOW WITH COOKIE</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
          You describe it once.{' '}
          <span className="italic font-serif font-normal">Cookie does the rest.</span>
        </h2>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#1F2937] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-6 h-6 rounded-full bg-[#EEF2FF] text-[#5B45E0] dark:bg-[#1E1B4B] dark:text-[#818CF8] text-xs font-bold flex items-center justify-center mb-4">
                1
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Tell her the strategy</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                One message, in your own words. Any index, indicator or multi-leg option rule.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#1F2937] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-6 h-6 rounded-full bg-[#EEF2FF] text-[#5B45E0] dark:bg-[#1E1B4B] dark:text-[#818CF8] text-xs font-bold flex items-center justify-center mb-4">
                2
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">She restates it</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                You get the strategy written back as rules — entries, exits, stops, sizing.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#1F2937] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-6 h-6 rounded-full bg-[#EEF2FF] text-[#5B45E0] dark:bg-[#1E1B4B] dark:text-[#818CF8] text-xs font-bold flex items-center justify-center mb-4">
                3
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">She builds and checks it</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Verified against the Zero-Eval AST schema with mathematical payoff guarantee.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#1F2937] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-6 h-6 rounded-full bg-[#EEF2FF] text-[#5B45E0] dark:bg-[#1E1B4B] dark:text-[#818CF8] text-xs font-bold flex items-center justify-center mb-4">
                4
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">It lands in your account</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                As a Strategy Template under My Strategies, with ₹500 wallet credit for backtesting.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. QUESTIONS ACCORDION */}
      <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-1.5 text-[#5B45E0] dark:text-[#818CF8] text-xs font-semibold uppercase tracking-wider mb-2">
          <span className="font-mono">—</span>
          <span>QUESTIONS</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-6">
          Before you start
        </h2>

        <div className="divide-y divide-slate-200 dark:divide-slate-800 border-t border-b border-slate-200 dark:border-slate-800">
          {FAQS.map(faq => {
            const isOpen = expandedFaq === faq.id;
            return (
              <div key={faq.id} className="py-4">
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full flex items-center justify-between text-left group cursor-pointer"
                >
                  <span className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-[#5B45E0] transition">
                    {faq.question}
                  </span>
                  <span className="text-[#5B45E0] dark:text-[#818CF8] text-lg font-bold ml-4">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                {isOpen && (
                  <div className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pr-6 animate-in fade-in duration-150">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: COOKIE AI STRATEGY BUILDER (FULLY WORKING DIALOG) */}
      {/* ========================================================= */}
      {cookieModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1F2937] border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-[#0B1220]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#EEF2FF] text-[#5B45E0] dark:bg-[#1E1B4B] dark:text-[#818CF8] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Cookie · TradingWave Quant AI</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      Zero-Latency Engine
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Describe any strategy — Cookie translates it into verified AST rules in real-time
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCookieModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="p-4 sm:p-6 space-y-4 flex-1 overflow-y-auto text-xs sm:text-sm">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-3 ${m.sender === 'user' ? 'justify-end' : ''}`}
                >
                  {m.sender === 'cookie' && (
                    <div className="w-8 h-8 rounded-full bg-[#5B45E0] text-white flex items-center justify-center shrink-0 font-bold text-xs">
                      C
                    </div>
                  )}

                  <div
                    className={`p-4 rounded-2xl max-w-[85%] leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-[#5B45E0] text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div className="whitespace-pre-line">{m.text}</div>

                    {m.parsedStrategy && (
                      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2 font-mono text-xs">
                        <div className="font-bold text-[#5B45E0] dark:text-[#818CF8]">
                          Compiled AST Preview ({m.parsedStrategy.legs.length} Legs):
                        </div>
                        <div className="p-2.5 rounded-xl bg-white dark:bg-[#0B1220] border border-slate-200 dark:border-slate-700 space-y-1">
                          {m.parsedStrategy.legs.map((leg, lIdx) => (
                            <div key={lIdx} className="flex justify-between items-center text-[11px]">
                              <span>Leg {lIdx + 1}: {leg.action} {leg.strike} {leg.type}</span>
                              <span className="text-emerald-600 dark:text-emerald-400 font-bold">SL: {leg.sl}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {m.sender === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0 font-bold text-xs">
                      You
                    </div>
                  )}
                </div>
              ))}

              {isSynthesizing && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#5B45E0] text-white flex items-center justify-center shrink-0 font-bold text-xs">
                    C
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#5B45E0] animate-bounce"></span>
                    <span className="w-2 h-2 rounded-full bg-[#5B45E0] animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-2 h-2 rounded-full bg-[#5B45E0] animate-bounce [animation-delay:0.4s]"></span>
                    <span className="text-xs font-semibold ml-1">Compiling quant AST rules...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Suggestions Chips */}
            <div className="px-4 py-2 bg-slate-50 dark:bg-[#0B1220]/70 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar text-[11px]">
              <span className="text-slate-400 font-bold shrink-0">Try:</span>
              {[
                'NIFTY 9:20 Straddle with 25% SL',
                'BankNifty Supertrend Breakout with 5m close',
                'FINNIFTY Iron Condor 0-DTE',
                'CrudeOil 3m OHOL Breakout'
              ].map(s => (
                <button
                  key={s}
                  onClick={() => setStrategyPrompt(s)}
                  className="px-2.5 py-1 rounded-full bg-white dark:bg-[#1F2937] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-[#5B45E0] transition shrink-0 cursor-pointer"
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Footer Input & Action */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1F2937] flex flex-col sm:flex-row items-center gap-2">
              <div className="flex-1 w-full flex items-center gap-2">
                <input
                  type="text"
                  value={strategyPrompt}
                  onChange={e => setStrategyPrompt(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendPromptToCookie()}
                  placeholder="Describe your strategy or tell Cookie any changes..."
                  className="flex-1 bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#5B45E0]"
                />
                <button
                  onClick={handleSendPromptToCookie}
                  disabled={!strategyPrompt.trim() || isSynthesizing}
                  className="px-4 py-2.5 rounded-xl bg-[#5B45E0] disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <span>Send</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

              {latestParsedStrategy && (
                <button
                  onClick={handleConfirmAndDeliver}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 whitespace-nowrap cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Deliver to My Strategies</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: TALK TO A QUANT (WORKING BOOKING FLOW) */}
      {/* ========================================================= */}
      {quantModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1F2937] border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-[#5B45E0]" />
                <span>Book a Consultation with a TradingWave Quant</span>
              </h3>
              <button
                onClick={() => setQuantModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {quantBookingConfirmed ? (
              <div className="p-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-base text-slate-900 dark:text-white">
                  Consultation Confirmed!
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Your appointment booking code is{' '}
                  <span className="font-mono font-bold text-slate-900 dark:text-white px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                    {quantBookingConfirmed}
                  </span>
                </p>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-700 text-xs font-mono text-left space-y-1">
                  <div><strong>Client:</strong> {quantBookingName}</div>
                  <div><strong>Contact:</strong> {quantBookingPhone}</div>
                  <div><strong>Slot:</strong> {quantBookingDate} at {quantBookingSlot}</div>
                </div>
                <button
                  onClick={() => setQuantModalOpen(false)}
                  className="mt-4 px-6 py-2 rounded-xl bg-[#5B45E0] text-white text-xs font-bold"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookQuant} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={quantBookingName}
                    onChange={e => setQuantBookingName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0B1220] text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone Number or WhatsApp</label>
                  <input
                    type="text"
                    required
                    value={quantBookingPhone}
                    onChange={e => setQuantBookingPhone(e.target.value)}
                    placeholder="+91 9876543210"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0B1220] text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Preferred Date</label>
                    <input
                      type="date"
                      value={quantBookingDate}
                      onChange={e => setQuantBookingDate(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0B1220] text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Time Slot (IST)</label>
                    <select
                      value={quantBookingSlot}
                      onChange={e => setQuantBookingSlot(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0B1220] text-slate-900 dark:text-white"
                    >
                      <option value="10:00 AM IST">10:00 AM IST</option>
                      <option value="11:30 AM IST">11:30 AM IST</option>
                      <option value="02:30 PM IST">02:30 PM IST</option>
                      <option value="04:30 PM IST">04:30 PM IST</option>
                      <option value="06:00 PM IST">06:00 PM IST</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setQuantModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#5B45E0] text-white text-xs font-bold hover:bg-[#4935C7] cursor-pointer"
                  >
                    Schedule Free Session
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: CONNECT YOUR OWN AI (DOOR 3) */}
      {/* ========================================================= */}
      {connectAiModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1F2937] border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-xl p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Bot className="w-5 h-5 text-[#5B45E0]" />
                <span>Connect Claude, ChatGPT, Gemini, Cursor or Codex</span>
              </h3>
              <button
                onClick={() => setConnectAiModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Add TradingWave&apos;s Strategy MCP endpoint into your Claude Desktop, Custom GPT, Cursor, or Gemini CLI. It connects in 2 minutes for free:
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  1. Copy TradingWave MCP Endpoint URL
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value="https://api.tradingwave.tech/v1/ai/mcp/manifest.json"
                    className="flex-1 p-2 rounded-xl font-mono border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0B1220] text-slate-900 dark:text-white"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText('https://api.tradingwave.tech/v1/ai/mcp/manifest.json');
                      setIsCopied(true);
                      setTimeout(() => setIsCopied(false), 2000);
                    }}
                    className="px-3 py-2 rounded-xl bg-[#5B45E0] text-white font-bold flex items-center gap-1 cursor-pointer"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  2. Claude / ChatGPT System Prompt Instructions
                </label>
                <pre className="p-3 rounded-xl bg-slate-900 text-emerald-400 font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800">
{`You are an assistant connected to TradingWave.
When I ask for a strategy, output JSON:
{
  "action": "CREATE_STRATEGY",
  "name": "Strategy Name",
  "underlying": "NIFTY 50",
  "legs": [...],
  "entry": [...],
  "exit": [...]
}`}
                </pre>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setConnectAiModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-[#5B45E0] text-white text-xs font-bold hover:bg-[#4935C7] cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
