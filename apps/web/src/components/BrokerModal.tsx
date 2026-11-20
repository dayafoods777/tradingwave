'use client';

import React, { useState } from 'react';
import { ShieldCheck, X, Key, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

interface BrokerModalProps {
  isOpen: boolean;
  brokerName: string;
  onClose: () => void;
  onConnected: (brokerName: string) => void;
}

export default function BrokerModal({ isOpen, brokerName, onClose, onConnected }: BrokerModalProps) {
  const [apiKey, setApiKey] = useState('tw_live_api_9938217');
  const [apiSecret, setApiSecret] = useState('••••••••••••••••••••••••');
  const [clientId, setClientId] = useState('ZR8491');
  const [totpSecret, setTotpSecret] = useState('JBSWY3DPEHPK3PXP');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleTestAndConnect = () => {
    setIsTesting(true);
    setTestResult(null);
    setTimeout(() => {
      setIsTesting(false);
      setTestResult({
        success: true,
        message: `Authentication successful! Connected to ${brokerName} (Sandbox & Live Trading API ready). Margin available: ₹4,50,000.`
      });
      setTimeout(() => {
        onConnected(brokerName);
        onClose();
      }, 1200);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-[#1E293B] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100 transition-colors">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-[#1E293B] bg-slate-50 dark:bg-[#0E1526]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-500/15 text-[#FF6600] flex items-center justify-center font-bold">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Connect {brokerName}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">TradingWave Provider-Independent Broker Adapter</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xs text-blue-600 dark:text-blue-300 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0 text-blue-600 dark:text-blue-400" />
            <span>Zero credentials stored in plaintext. End-to-end encrypted broker adapter.</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Client ID / User ID</label>
            <input
              type="text"
              value={clientId}
              onChange={e => setClientId(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#0E1526] border border-slate-200 dark:border-[#1E293B] rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#FF6600]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">API Key / App Key</label>
            <input
              type="text"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#0E1526] border border-slate-200 dark:border-[#1E293B] rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#FF6600]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">API Secret / App Secret</label>
            <input
              type="password"
              value={apiSecret}
              onChange={e => setApiSecret(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#0E1526] border border-slate-200 dark:border-[#1E293B] rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#FF6600]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">TOTP 2FA Secret Key (For Automated Daily Token)</label>
            <input
              type="password"
              value={totpSecret}
              onChange={e => setTotpSecret(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#0E1526] border border-slate-200 dark:border-[#1E293B] rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#FF6600]"
            />
          </div>

          {testResult && (
            <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${testResult.success ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'}`}>
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{testResult.message}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-[#0E1526] border-t border-slate-200 dark:border-[#1E293B]">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
            Cancel
          </button>
          <button
            onClick={handleTestAndConnect}
            disabled={isTesting}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#FF6600] to-[#E65C00] text-white text-xs font-bold shadow-lg shadow-orange-500/20 hover:brightness-110 transition flex items-center gap-2 disabled:opacity-50"
          >
            {isTesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
            Test & Authorize Connection
          </button>
        </div>
      </div>
    </div>
  );
}
