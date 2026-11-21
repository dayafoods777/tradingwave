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
    <div className="min-h-screen bg-subtle flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-surface border border-border rounded-lg p-6 sm:p-8 shadow-pop text-center space-y-4">
        <div className="w-14 h-14 rounded-lg bg-primary-soft text-primary flex items-center justify-center mx-auto">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <div>
          <h2 className="text-xl font-semibold text-fg">Application Refresh Required</h2>
          <p className="text-xs text-fg-muted mt-1.5 leading-relaxed">
            TradingWave updated with new trading modules. An old cache was detected in your browser session.
          </p>
        </div>

        {error?.message && (
          <div className="p-3 rounded-lg bg-subtle border border-border text-[11px] text-fg-secondary font-mono text-left break-words overflow-x-auto max-h-32">
            {error.message}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
          <button
            onClick={handleHardReload}
            className="w-full sm:flex-1 py-2.5 rounded-lg bg-primary text-primary-fg text-xs font-bold shadow-sm hover:brightness-110 flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reload Platform</span>
          </button>

          <button
            onClick={handleClearAndReload}
            className="w-full sm:flex-1 py-2.5 rounded-lg border border-border text-fg-secondary hover:bg-subtle text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Reset Cache</span>
          </button>
        </div>
      </div>
    </div>
  );
}
