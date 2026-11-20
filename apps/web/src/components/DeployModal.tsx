'use client';

import React, { useState, useEffect } from 'react';
import { X, Info } from 'lucide-react';

export interface DeployConfig {
  strategyName: string;
  segment: string;
  multiplier: string;
  capitalRecommended: string;
  executionType: 'Paper Trading' | 'Live Offline' | 'Live Auto One Click' | 'Live Auto';
  stopLooping: string;
  broker: string;
  exitOnError: boolean;
}

interface DeployModalProps {
  isOpen: boolean;
  onClose: () => void;
  strategy: {
    name: string;
    segment?: string;
    minCapitalDisplay?: string;
    minCapitalRaw?: number;
  } | null;
  connectedBrokers?: string[];
  onDeploy: (config: DeployConfig) => void;
  onAddBroker?: () => void;
}

export default function DeployModal({
  isOpen,
  onClose,
  strategy,
  connectedBrokers = [],
  onDeploy,
  onAddBroker
}: DeployModalProps) {
  const [multiplier, setMultiplier] = useState<string>('1x');
  const [capitalRecommended, setCapitalRecommended] = useState<string>('₹500');
  const [executionType, setExecutionType] = useState<
    'Paper Trading' | 'Live Offline' | 'Live Auto One Click' | 'Live Auto'
  >('Paper Trading');
  const [stopLooping, setStopLooping] = useState<string>('5');
  const [broker, setBroker] = useState<string>('TT Paper Trading');
  const [exitOnError, setExitOnError] = useState<boolean>(false);

  useEffect(() => {
    if (strategy) {
      setMultiplier('1x');
      const rec = strategy.minCapitalDisplay ? strategy.minCapitalDisplay.replace(/\s+/g, '') : '₹500';
      setCapitalRecommended(rec);
      setExecutionType('Paper Trading');
      setStopLooping('5');
      setBroker('TT Paper Trading');
      setExitOnError(false);
    }
  }, [strategy]);

  // Adjust broker default when execution type changes
  const handleExecutionTypeChange = (
    type: 'Paper Trading' | 'Live Offline' | 'Live Auto One Click' | 'Live Auto'
  ) => {
    setExecutionType(type);
    if (type === 'Paper Trading') {
      setBroker('TT Paper Trading');
    } else if (broker === 'TT Paper Trading') {
      setBroker(connectedBrokers.length > 0 ? connectedBrokers[0] : 'Select broker');
    }
  };

  if (!isOpen || !strategy) return null;

  const segmentLabel = (strategy.segment || 'DELTAINDIA').toUpperCase();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onDeploy({
      strategyName: strategy.name,
      segment: strategy.segment || 'NFO',
      multiplier,
      capitalRecommended,
      executionType,
      stopLooping,
      broker: executionType === 'Paper Trading' ? 'TT Paper Trading' : broker,
      exitOnError
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white dark:bg-[#1F2937] w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-900 dark:text-white transition-all"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white truncate pr-2">
            {strategy.name}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Row 1: Multiplier & Capital Recommended */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Multiplier
              </label>
              <select
                value={multiplier}
                onChange={e => setMultiplier(e.target.value)}
                className="w-full bg-white dark:bg-[#0B1220] border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-[#5B45E0] cursor-pointer"
              >
                <option value="0.5x">0.5x</option>
                <option value="1x">1x</option>
                <option value="2x">2x</option>
                <option value="3x">3x</option>
                <option value="5x">5x</option>
                <option value="10x">10x</option>
                <option value="20x">20x</option>
                <option value="50x">50x</option>
                <option value="100x">100x</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Capital Recommended
              </label>
              <input
                type="text"
                value={capitalRecommended}
                onChange={e => setCapitalRecommended(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#0B1220]/50 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:border-[#5B45E0]"
              />
            </div>
          </div>

          {/* Row 2: Execution Type & Stop Looping */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Execution Type
              </label>
              <select
                value={executionType}
                onChange={e => handleExecutionTypeChange(e.target.value as any)}
                className="w-full bg-white dark:bg-[#0B1220] border border-[#5B45E0] ring-1 ring-[#5B45E0]/30 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-[#5B45E0] cursor-pointer"
              >
                <option value="Paper Trading">Paper Trading</option>
                <option value="Live Offline">Live Offline</option>
                <option value="Live Auto One Click">Live Auto One Click</option>
                <option value="Live Auto">Live Auto</option>
              </select>
            </div>

            <div>
              <div className="flex items-center gap-1 mb-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Stop Looping
                </label>
                <span title="Stop strategy execution after reaching this many loops in a single day">
                  <Info className="w-3.5 h-3.5 text-slate-400 cursor-pointer" />
                </span>
              </div>
              <select
                value={stopLooping}
                onChange={e => setStopLooping(e.target.value)}
                className="w-full bg-white dark:bg-[#0B1220] border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-[#5B45E0] cursor-pointer"
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="Continuous">Continuous</option>
              </select>
            </div>
          </div>

          {/* Row 3: Broker Selection */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              {segmentLabel} BROKER
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                {executionType === 'Paper Trading' ? (
                  <div className="w-full bg-slate-50 dark:bg-[#0B1220]/60 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>TT Paper Trading</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400">
                      VIRTUAL
                    </span>
                  </div>
                ) : (
                  <select
                    value={broker}
                    onChange={e => setBroker(e.target.value)}
                    className="w-full bg-white dark:bg-[#0B1220] border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-[#5B45E0] cursor-pointer"
                  >
                    <option value="Select broker">Select broker</option>
                    {connectedBrokers.length > 0 ? (
                      connectedBrokers.map(b => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="TT Paper Trading">TT Paper Trading</option>
                        <option value="Zerodha Kite">Zerodha Kite</option>
                        <option value="Angel One">Angel One</option>
                        <option value="Groww">Groww</option>
                        <option value="Dhan">Dhan</option>
                        <option value="Upstox">Upstox</option>
                        <option value="Fyers">Fyers</option>
                        <option value="Delta Exchange India">Delta Exchange India</option>
                      </>
                    )}
                  </select>
                )}
              </div>

              <button
                type="button"
                onClick={onAddBroker}
                className="px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition whitespace-nowrap"
              >
                + Add broker
              </button>
            </div>
          </div>

          {/* Row 4: Exit strategy on error checkbox */}
          <div className="pt-1 flex items-center gap-2">
            <input
              type="checkbox"
              id="exitOnError"
              checked={exitOnError}
              onChange={e => setExitOnError(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-[#5B45E0] focus:ring-[#5B45E0] cursor-pointer"
            />
            <label
              htmlFor="exitOnError"
              className="text-xs text-slate-600 dark:text-slate-300 cursor-pointer select-none flex items-center gap-1"
            >
              <span>Exit strategy on error</span>
              <span title="Automatically exit all open positions and pause strategy if a broker or order execution error occurs">
                <Info className="w-3.5 h-3.5 text-slate-400" />
              </span>
            </label>
          </div>

          {/* Row 5: Deploy Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold shadow-lg shadow-indigo-500/25 active:scale-[0.99] transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Deploy</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
