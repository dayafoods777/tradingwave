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
  Coins
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

export default function UsingAIView({ onSaveStrategy, onNavigateTab }: UsingAIViewProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<'English' | 'Hindi'>('English');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  // Modals state
  const [cookieModalOpen, setCookieModalOpen] = useState(false);
  const [quantModalOpen, setQuantModalOpen] = useState(false);
  const [connectAiModalOpen, setConnectAiModalOpen] = useState(false);

  // Cookie chat state
  const [strategyPrompt, setStrategyPrompt] = useState('');
  const [chatStep, setChatStep] = useState<'input' | 'restating' | 'confirmed' | 'delivered'>('input');
  const [isCopied, setIsCopied] = useState(false);

  const toggleFaq = (id: string) => {
    setExpandedFaq(prev => (prev === id ? null : id));
  };

  const handleStartCookie = () => {
    setCookieModalOpen(true);
    setChatStep('input');
  };

  const handleSendPromptToCookie = () => {
    if (!strategyPrompt.trim()) return;
    setChatStep('restating');
    setTimeout(() => {
      setChatStep('confirmed');
    }, 1800);
  };

  const handleConfirmAndDeliver = () => {
    setChatStep('delivered');
    const stratName = strategyPrompt.length > 30 ? strategyPrompt.slice(0, 30) + '...' : strategyPrompt;
    setTimeout(() => {
      if (onSaveStrategy) {
        onSaveStrategy({
          name: stratName || 'Cookie AI Strategy',
          description: strategyPrompt,
          segment: 'NFO',
          minCapitalDisplay: '₹ 1,00,000',
          minCapitalRaw: 100000,
          type: 'ASB',
          visibility: 'PRIVATE'
        });
      }
      setCookieModalOpen(false);
    }, 1200);
  };

  return (
    <div className="space-y-12 max-w-[1240px] mx-auto pb-16 font-sans">
      {/* ========================================================= */}
      {/* 1. TOP HERO SECTION (Image 1 Parity) */}
      {/* ========================================================= */}
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
              className="font-bold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 flex items-center gap-1 hover:bg-slate-50 dark:hover:bg-[#1F2937] transition"
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
          <div className="rounded-2xl p-6 bg-white dark:bg-[#1F2937] border-2 border-[#5B45E0] shadow-xl relative flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EEF2FF] text-[#5B45E0] dark:bg-[#1E1B4B] dark:text-[#818CF8] tracking-wider uppercase">
                  01 FASTEST
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
                <span>₹4,999 + GST</span>{' '}
                <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                  · flat, any strategy TradingWave can build
                </span>
              </div>
              <button
                onClick={handleStartCookie}
                className="w-full py-2.5 px-4 rounded-xl bg-[#5B45E0] hover:bg-[#4935C7] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-indigo-500/20"
              >
                <span>Start now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <div className="text-[11px] font-semibold text-[#5B45E0] dark:text-[#818CF8] text-center mt-2.5">
                • SHOWN BELOW
              </div>
            </div>
          </div>

          {/* DOOR 2: Talk to a quant */}
          <div className="rounded-2xl p-6 bg-white dark:bg-[#1F2937] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-slate-300 transition">
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
                onClick={() => setQuantModalOpen(true)}
                className="w-full py-2 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B1220] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-white text-xs font-semibold transition flex items-center justify-center gap-1"
              >
                <span>Talk to a quant</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById('what-it-costs');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full py-2 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B1220] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-white text-xs font-semibold transition flex items-center justify-center gap-1 mt-2"
              >
                <span>How it works</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* DOOR 3: Connect your own AI */}
          <div className="rounded-2xl p-6 bg-white dark:bg-[#1F2937] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-slate-300 transition">
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
                deployments and other actions you run through it are charged at your usual TradingWave fees,
                and your AI subscription still applies.
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
                className="w-full py-2 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B1220] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-white text-xs font-semibold transition flex items-center justify-center gap-1"
              >
                <span>Connect it in two minutes</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <button
                onClick={() => setConnectAiModalOpen(true)}
                className="w-full py-2 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B1220] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-white text-xs font-semibold transition flex items-center justify-center gap-1 mt-2"
              >
                <span>How it works</span>
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

      {/* ========================================================= */}
      {/* 2. DOOR 01: BUILD IT NOW WITH COOKIE (Image 2 Parity) */}
      {/* ========================================================= */}
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
          {/* Step 1 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#1F2937] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-6 h-6 rounded-full bg-[#EEF2FF] text-[#5B45E0] dark:bg-[#1E1B4B] dark:text-[#818CF8] text-xs font-bold flex items-center justify-center mb-4">
                1
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                Tell her the strategy
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                One message, in your own words. Screenshots and files are welcome. There is no form to fight
                with.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#1F2937] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-6 h-6 rounded-full bg-[#EEF2FF] text-[#5B45E0] dark:bg-[#1E1B4B] dark:text-[#818CF8] text-xs font-bold flex items-center justify-center mb-4">
                2
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                She restates it
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                You get the strategy written back as rules — entries, exits, stops, sizing. You confirm it or
                correct it. Nothing is built from a guess.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#1F2937] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-6 h-6 rounded-full bg-[#EEF2FF] text-[#5B45E0] dark:bg-[#1E1B4B] dark:text-[#818CF8] text-xs font-bold flex items-center justify-center mb-4">
                3
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                She builds and checks it
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                It is built in TradingWave&apos;s own Strategy Builder and checked, field by field, against the
                words you confirmed.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#1F2937] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-6 h-6 rounded-full bg-[#EEF2FF] text-[#5B45E0] dark:bg-[#1E1B4B] dark:text-[#818CF8] text-xs font-bold flex items-center justify-center mb-4">
                4
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                It lands in your account
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                As a Strategy Template under My Strategies, with the ₹500 in your wallet so you can backtest it
                the same day.
              </p>
            </div>
          </div>
        </div>

        {/* What it costs block */}
        <div id="what-it-costs" className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-1.5 text-[#5B45E0] dark:text-[#818CF8] text-xs font-semibold uppercase tracking-wider mb-4">
            <span className="font-mono">—</span>
            <span>WHAT IT COSTS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white">
                  ₹4,999
                </span>
                <span className="text-base font-semibold text-slate-500 dark:text-slate-400">+ GST</span>
              </div>
              <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                One flat price for any strategy TradingWave can build — Python and TradingView-signal
                strategies included.{' '}
                <strong className="text-slate-900 dark:text-white">
                  If it can&apos;t be built, you are told plainly and nothing is charged.
                </strong>
              </p>
            </div>

            <div className="space-y-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#5B45E0] shrink-0" />
                <span>₹500 in your TradingWave wallet for backtests</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#5B45E0] shrink-0" />
                <span>30 days of the Starter plan, free, if your account has no plan</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#5B45E0] shrink-0" />
                <span>5 changes to the strategy after it is delivered</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#5B45E0] shrink-0" />
                <span>Delivered into your own account — it is yours</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. QUESTIONS / BEFORE YOU START ACCORDION (Image 3 Parity) */}
      {/* ========================================================= */}
      <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-1.5 text-[#5B45E0] dark:text-[#818CF8] text-xs font-semibold uppercase tracking-wider mb-2">
          <span className="font-mono">—</span>
          <span>QUESTIONS</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-6">
          Before you start
        </h2>

        {/* Accordions */}
        <div className="divide-y divide-slate-200 dark:divide-slate-800 border-t border-b border-slate-200 dark:border-slate-800">
          {FAQS.map(faq => {
            const isOpen = expandedFaq === faq.id;
            return (
              <div key={faq.id} className="py-4">
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full flex items-center justify-between text-left group"
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

        {/* Bottom Start Now CTA */}
        <div className="mt-8">
          <button
            onClick={handleStartCookie}
            className="px-8 py-3 rounded-xl bg-[#5B45E0] hover:bg-[#4935C7] text-white text-sm font-bold transition flex items-center gap-2 shadow-lg shadow-indigo-500/20"
          >
            <span>Start now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: COOKIE AI STRATEGY BUILDER DIALOG */}
      {/* ========================================================= */}
      {cookieModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1F2937] border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-[#0B1220]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#EEF2FF] text-[#5B45E0] dark:bg-[#1E1B4B] dark:text-[#818CF8] flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Cookie · TradingWave AI</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      Online
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Describe your strategy in plain words — Cookie will translate it into verified rules
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCookieModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto text-xs sm:text-sm">
              {/* Bot Greeting */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#5B45E0] text-white flex items-center justify-center shrink-0 font-bold text-xs">
                  C
                </div>
                <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 max-w-[85%] leading-relaxed">
                  Hi! I&apos;m <strong>Cookie</strong>. Tell me about your strategy — what instruments do you trade (e.g. NIFTY, BANKNIFTY), what are your entry signals (time, indicators), your stop loss, targets, and when should it exit?
                </div>
              </div>

              {/* User Prompt (if submitted) */}
              {chatStep !== 'input' && (
                <div className="flex items-start gap-3 justify-end">
                  <div className="p-4 rounded-2xl bg-[#5B45E0] text-white max-w-[85%] leading-relaxed">
                    {strategyPrompt}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0 font-bold text-xs">
                    You
                  </div>
                </div>
              )}

              {/* Restating Animation */}
              {chatStep === 'restating' && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#5B45E0] text-white flex items-center justify-center shrink-0 font-bold text-xs">
                    C
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#5B45E0] animate-bounce"></span>
                    <span className="w-2 h-2 rounded-full bg-[#5B45E0] animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-2 h-2 rounded-full bg-[#5B45E0] animate-bounce [animation-delay:0.4s]"></span>
                    <span className="text-xs font-semibold ml-1">Analyzing rules & syntax...</span>
                  </div>
                </div>
              )}

              {/* Confirmed Rule Breakdown */}
              {(chatStep === 'confirmed' || chatStep === 'delivered') && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#5B45E0] text-white flex items-center justify-center shrink-0 font-bold text-xs">
                    C
                  </div>
                  <div className="p-4 rounded-2xl bg-[#EEF2FF] dark:bg-[#1E1B4B]/50 border border-[#5B45E0]/30 text-slate-800 dark:text-slate-200 max-w-[90%] space-y-2">
                    <div className="font-bold text-[#5B45E0] dark:text-[#818CF8] flex items-center gap-1.5 text-xs">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Here is how I restate your strategy:</span>
                    </div>
                    <ul className="space-y-1 text-xs list-disc list-inside text-slate-700 dark:text-slate-300 font-mono">
                      <li><strong>Underlying:</strong> NIFTY 50 / BANKNIFTY Options</li>
                      <li><strong>Entry Condition:</strong> Time &gt;= 09:20 AND Candle Close confirmation</li>
                      <li><strong>Leg 1:</strong> SELL 1x ATM CALL (SL: 25%, Target: 60%)</li>
                      <li><strong>Leg 2:</strong> SELL 1x ATM PUT (SL: 25%, Target: 60%)</li>
                      <li><strong>Universal SL:</strong> ₹4,000 | <strong>Target:</strong> ₹8,000</li>
                      <li><strong>Exit:</strong> Time &gt;= 15:10 auto square-off</li>
                    </ul>
                    {chatStep === 'delivered' ? (
                      <div className="pt-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center gap-1.5">
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>Delivered to My Strategies! Redirecting...</span>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 dark:text-slate-400 pt-1">
                        Does this match what you want? Click below to confirm and deliver into your account.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Input Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B1220]">
              {chatStep === 'input' && (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={strategyPrompt}
                    onChange={e => setStrategyPrompt(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSendPromptToCookie()}
                    placeholder="e.g. 9:20 NIFTY short straddle with 25% SL and 15:10 square-off..."
                    className="flex-1 bg-white dark:bg-[#1F2937] border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#5B45E0]"
                  />
                  <button
                    onClick={handleSendPromptToCookie}
                    disabled={!strategyPrompt.trim()}
                    className="px-4 py-2.5 rounded-xl bg-[#5B45E0] disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 transition"
                  >
                    <span>Send</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {chatStep === 'confirmed' && (
                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={() => setChatStep('input')}
                    className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100"
                  >
                    Edit Words
                  </button>
                  <button
                    onClick={handleConfirmAndDeliver}
                    className="px-6 py-2 rounded-xl bg-[#5B45E0] hover:bg-[#4935C7] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-500/20"
                  >
                    <Check className="w-4 h-4" />
                    <span>Confirm & Deliver Strategy</span>
                  </button>
                </div>
              )}

              {chatStep === 'delivered' && (
                <div className="text-center text-xs font-bold text-emerald-600 dark:text-emerald-400 py-1">
                  ✓ Strategy delivered to your account as a Strategy Template!
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: TALK TO A QUANT */}
      {/* ========================================================= */}
      {quantModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1F2937] border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-[#5B45E0]" />
                <span>Talk to a TradingWave Quant</span>
              </h3>
              <button
                onClick={() => setQuantModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Our quant build team is available <strong>9 am – 7 pm IST</strong>. Describe your strategy idea below, or leave your phone/email and a quant will get in touch directly.
            </p>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Your Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0B1220] text-slate-900 dark:text-white focus:outline-none focus:border-[#5B45E0]"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Email / Phone</label>
                <input
                  type="text"
                  placeholder="name@example.com or +91 9876543210"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0B1220] text-slate-900 dark:text-white focus:outline-none focus:border-[#5B45E0]"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Strategy Notes</label>
                <textarea
                  rows={3}
                  placeholder="Describe your rules, indicators, and instruments..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0B1220] text-slate-900 dark:text-white focus:outline-none focus:border-[#5B45E0]"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setQuantModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Thank you! A TradingWave quant will reach out to you within 2 hours.');
                  setQuantModalOpen(false);
                }}
                className="px-5 py-2 rounded-xl bg-[#5B45E0] text-white text-xs font-bold hover:bg-[#4935C7]"
              >
                Submit Request
              </button>
            </div>
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
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
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
                    className="px-3 py-2 rounded-xl bg-[#5B45E0] text-white font-bold flex items-center gap-1"
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
                <pre className="p-3 rounded-xl bg-slate-900 text-emerald-400 font-mono text-[11px] overflow-x-auto leading-relaxed">
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
                className="px-5 py-2 rounded-xl bg-[#5B45E0] text-white text-xs font-bold hover:bg-[#4935C7]"
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

