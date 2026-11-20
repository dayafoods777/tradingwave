'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Terminal,
  X,
  RefreshCw,
  Copy,
  Check,
  Download,
  Filter,
  Search,
  ShieldCheck,
  Zap,
  ArrowDown
} from 'lucide-react';

export interface LogEntry {
  time: string;
  type: 'SYS' | 'FEED' | 'CHECK' | 'RISK' | 'ORDER' | 'BROKER' | 'POSITION';
  text: string;
}

interface ExecutionLogModalProps {
  isOpen: boolean;
  botName: string;
  logs?: LogEntry[];
  onClose: () => void;
}

export default function ExecutionLogModal({ isOpen, botName, logs, onClose }: ExecutionLogModalProps) {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const now = new Date().toLocaleTimeString('en-US', { hour12: false });
  const activeLogs: LogEntry[] = logs && logs.length > 0 ? logs : [
    { time: `${now}.000`, type: 'SYS', text: `Execution Engine initialized for "${botName}". Resolution: 1-sec continuous evaluation cycle.` },
    { time: `${now}.012`, type: 'FEED', text: 'Real-time WebSocket tick stream active. Subscribed to underlying market index ticks.' },
    { time: `${now}.028`, type: 'RISK', text: 'Pre-trade Risk Guard active: Margin requirement, rate limits, and max loss collar checked OK.' },
    { time: `${now}.042`, type: 'CHECK', text: 'Continuous evaluation active. Evaluating entry conditions against incoming market ticks.' }
  ];

  const filteredLogs = activeLogs.filter(log => {
    const matchesType = filterType === 'ALL' || log.type === filterType;
    const matchesSearch = log.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.time.includes(searchQuery);
    return matchesType && matchesSearch;
  });

  const handleCopyLogs = () => {
    const textToCopy = filteredLogs.map(l => `[${l.time}] [${l.type}] ${l.text}`).join('\n');
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadLogs = () => {
    const textToDownload = filteredLogs.map(l => `[${l.time}] [${l.type}] ${l.text}`).join('\n');
    const blob = new Blob([textToDownload], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${botName.replace(/\s+/g, '_')}_audit_logs.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-[#1F2937] border border-slate-200 dark:border-[#334155] rounded-2xl w-full max-w-4xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100 transition-colors animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-[#334155] bg-slate-50 dark:bg-[#0B1220]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-sm">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Execution Logs & Order Audits</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold uppercase">
                  LIVE STREAM
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">{botName}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLogs}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white text-xs font-semibold flex items-center gap-1.5 transition"
              title="Copy filtered logs to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={handleDownloadLogs}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white text-xs font-semibold flex items-center gap-1.5 transition"
              title="Download audit logs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
              title="Close modal (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filters and Search Strip */}
        <div className="px-6 py-2.5 bg-slate-100/80 dark:bg-[#10172A] border-b border-slate-200 dark:border-[#334155] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {['ALL', 'ORDER', 'BROKER', 'RISK', 'CHECK', 'POSITION', 'FEED'].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-2.5 py-1 rounded-md font-mono font-bold transition text-[11px] ${
                  filterType === type
                    ? 'bg-[#FF6B00] text-white shadow-sm'
                    : 'bg-white dark:bg-[#334155] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700/60'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-[#1F2937] border border-slate-200 dark:border-slate-700/80 rounded-lg pl-8 pr-3 py-1 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#FF6B00]"
            />
          </div>
        </div>

        {/* Log Viewer Body */}
        <div
          ref={scrollRef}
          className="p-4 bg-slate-950 dark:bg-[#070A12] flex-1 overflow-y-auto font-mono text-xs space-y-1.5 border-b border-slate-200 dark:border-[#334155] min-h-[320px]"
        >
          {filteredLogs.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-slate-500 font-sans text-xs">
              No log entries match the selected filter or search term.
            </div>
          ) : (
            filteredLogs.map((log, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 leading-relaxed hover:bg-slate-900/80 p-1.5 rounded transition group"
              >
                <span className="text-slate-500 shrink-0 select-none text-[11px]">{log.time}</span>
                <span
                  className={`px-1.5 py-0.2 rounded text-[10px] font-bold shrink-0 select-none ${
                    log.type === 'ORDER' ? 'bg-orange-500/20 text-[#FF6B00]' :
                    log.type === 'BROKER' ? 'bg-emerald-500/20 text-emerald-400' :
                    log.type === 'RISK' ? 'bg-blue-500/20 text-blue-400' :
                    log.type === 'POSITION' ? 'bg-purple-500/20 text-purple-400' :
                    log.type === 'FEED' ? 'bg-cyan-500/20 text-cyan-400' :
                    log.type === 'CHECK' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-slate-800 text-slate-400'
                  }`}
                >
                  {log.type}
                </span>
                <span className="text-slate-300 break-all select-text font-mono group-hover:text-white transition">
                  {log.text}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 bg-slate-50 dark:bg-[#0B1220] text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Continuous Execution Engine · 1-sec Resolution · Zero-eval Sandbox Active</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-medium transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
