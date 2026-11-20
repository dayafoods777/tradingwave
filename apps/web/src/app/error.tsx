'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('TradingWave Client-Side Error Boundary caught exception:', error);
    // Automatic silent recovery for chunk mismatch after server rebuild
    if (
      typeof window !== 'undefined' &&
      error?.message &&
      (error.message.includes('Loading chunk') || error.message.includes('failed to fetch'))
    ) {
      const lastAttempt = sessionStorage.getItem('tw_chunk_auto_reload');
      const now = Date.now();
      if (!lastAttempt || now - parseInt(lastAttempt, 10) > 10000) {
        sessionStorage.setItem('tw_chunk_auto_reload', String(now));
        window.location.reload();
      }
    }
  }, [error]);

  const handleHardReload = () => {
    try {
      if (typeof window !== 'undefined') {
        window.location.href = window.location.pathname + '?_t=' + Date.now();
      }
    } catch (_) {
      reset();
    }
  };

  const handleClearAndReload = () => {
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.clear();
        window.location.href = '/?_t=' + Date.now();
      }
    } catch (_) {
      reset();
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] dark:bg-[#0B1220] flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white dark:bg-[#1F2937] border border-slate-200 dark:border-[#334155] rounded-2xl p-6 sm:p-8 shadow-2xl text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-orange-500/10 text-[#FF6B00] flex items-center justify-center mx-auto">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">Application Refresh Required</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
            TradingWave updated with new trading modules. An old cache was detected in your browser session.
          </p>
        </div>

        {error?.message && (
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-[#334155] text-[11px] text-slate-600 dark:text-slate-400 font-mono text-left break-words overflow-x-auto max-h-32">
            {error.message}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
          <button
            onClick={handleHardReload}
            className="w-full sm:flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#FF8A3D] text-white text-xs font-bold shadow-md shadow-orange-500/20 hover:brightness-110 flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reload Platform</span>
          </button>

          <button
            onClick={handleClearAndReload}
            className="w-full sm:flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Reset Cache</span>
          </button>
        </div>
      </div>
    </div>
  );
}
