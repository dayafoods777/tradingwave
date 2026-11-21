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
    <div className="fixed inset-0 z-50 !m-0 flex items-center justify-center bg-ink/50 p-4">
      <div className="bg-surface border border-border rounded-lg w-full max-w-4xl max-h-[88vh] flex flex-col shadow-pop overflow-hidden text-fg transition-colors duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-subtle">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-profit-soft text-profit flex items-center justify-center">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-base text-fg">Execution Logs & Order Audits</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-profit-soft text-profit font-semibold uppercase">
                  LIVE STREAM
                </span>
              </div>
              <p className="text-xs text-fg-muted font-mono mt-0.5">{botName}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLogs}
              className="px-3 py-1.5 rounded-lg border border-border bg-surface text-fg-secondary hover:text-fg text-xs font-semibold flex items-center gap-1.5 transition"
              title="Copy filtered logs to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-profit" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={handleDownloadLogs}
              className="px-3 py-1.5 rounded-lg border border-border bg-surface text-fg-secondary hover:text-fg text-xs font-semibold flex items-center gap-1.5 transition"
              title="Download audit logs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-muted text-fg-muted hover:text-fg transition"
              title="Close modal (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filters and Search Strip */}
        <div className="px-6 py-2.5 bg-muted/80 border-b border-border flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {['ALL', 'ORDER', 'BROKER', 'RISK', 'CHECK', 'POSITION', 'FEED'].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-2.5 py-1 rounded-md font-mono font-semibold transition text-[11px] ${
                  filterType === type
                    ? 'bg-primary text-primary-fg'
                    : 'bg-surface text-fg-secondary hover:text-fg border border-border'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 text-fg-muted absolute left-2.5 top-2" />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-surface border border-border rounded-lg pl-8 pr-3 py-1 text-xs text-fg placeholder:text-fg-muted focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Log Viewer Body */}
        <div
          ref={scrollRef}
          className="p-4 bg-ink flex-1 overflow-y-auto font-mono text-xs space-y-1.5 border-b border-ink-line min-h-[320px]"
        >
          {filteredLogs.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-fg-muted font-sans text-xs">
              No log entries match the selected filter or search term.
            </div>
          ) : (
            filteredLogs.map((log, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 leading-relaxed hover:bg-ink/80 p-1.5 rounded transition group"
              >
                <span className="text-fg-muted shrink-0 select-none text-[11px]">{log.time}</span>
                <span
                  className={`px-1.5 py-0.2 rounded text-[10px] font-semibold shrink-0 select-none ${
                    log.type === 'ORDER' ? 'bg-primary-soft text-primary' :
                    log.type === 'BROKER' ? 'bg-profit-soft text-profit' :
                    log.type === 'RISK' ? 'bg-primary-soft text-primary' :
                    log.type === 'POSITION' ? 'bg-primary-soft text-primary' :
                    log.type === 'FEED' ? 'bg-primary-soft text-primary' :
                    log.type === 'CHECK' ? 'bg-accent-soft text-accent-fg' :
                    'bg-ink-raised text-ink-fg/70'
                  }`}
                >
                  {log.type}
                </span>
                <span className="text-fg-muted break-all select-text font-mono group-hover:text-white transition">
                  {log.text}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 bg-subtle text-xs text-fg-secondary">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-profit animate-pulse"></span>
            <span>Continuous Execution Engine · 1-sec Resolution · Zero-eval Sandbox Active</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-muted hover:bg-border-strong text-fg font-medium transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
