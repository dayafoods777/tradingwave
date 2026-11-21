'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CornerDownLeft, Moon, OctagonX, Search } from 'lucide-react';
import { NAV_ITEMS, type AppTab } from '../../lib/nav';

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (tab: AppTab) => void;
  onToggleTheme: () => void;
  onKillSwitch: () => void;
}

type Entry = { key: string; label: string; hint?: string; group: string; icon: React.ComponentType<{ className?: string }>; run: () => void };

export default function CommandPalette({ open, onClose, onSelect, onToggleTheme, onKillSwitch }: Props) {
  const [q, setQ] = useState('');
  const [idx, setIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const entries: Entry[] = useMemo(
    () => [
      ...NAV_ITEMS.map(i => ({ key: i.id, label: i.label, hint: i.hint, group: 'Go to', icon: i.icon, run: () => onSelect(i.id) })),
      { key: 'theme', label: 'Toggle light / dark', group: 'Actions', icon: Moon, run: onToggleTheme },
      { key: 'kill', label: 'Kill switch — square off everything', group: 'Actions', icon: OctagonX, run: onKillSwitch },
    ],
    [onSelect, onToggleTheme, onKillSwitch]
  );

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return entries;
    return entries.filter(e => (e.label + ' ' + (e.hint || '')).toLowerCase().includes(s));
  }, [q, entries]);

  useEffect(() => {
    if (open) {
      setQ('');
      setIdx(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  useEffect(() => setIdx(0), [q]);

  if (!open) return null;

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIdx(i => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setIdx(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      filtered[idx]?.run();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  let lastGroup = '';
  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center px-3 pt-[12vh]" role="dialog" aria-modal="true" aria-label="Command menu">
      <div className="absolute inset-0 bg-ink/40 animate-fade-in" onClick={onClose} />
      <div className="relative w-full max-w-[560px] animate-fade-up overflow-hidden rounded-lg border border-border bg-surface shadow-pop" onKeyDown={onKey}>
        <div className="flex h-11 items-center gap-2 border-b border-border px-3">
          <Search className="h-4 w-4 text-fg-muted" />
          <input
            ref={inputRef}
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search views and actions…"
            className="h-full flex-1 bg-transparent text-[14px] text-fg outline-none placeholder:text-fg-muted"
          />
          <span className="tw-kbd">esc</span>
        </div>
        <ul className="max-h-[50vh] overflow-y-auto p-1">
          {filtered.length === 0 && <li className="px-3 py-6 text-center text-[13px] text-fg-muted">No matches for “{q}”.</li>}
          {filtered.map((e, i) => {
            const header = e.group !== lastGroup ? e.group : null;
            lastGroup = e.group;
            const Icon = e.icon;
            return (
              <React.Fragment key={e.key}>
                {header && <li className="tw-label px-2.5 pb-1 pt-2">{header}</li>}
                <li>
                  <button
                    onMouseEnter={() => setIdx(i)}
                    onClick={e.run}
                    className={`flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-[13px] ${
                      i === idx ? 'bg-subtle text-fg' : 'text-fg-secondary'
                    }`}
                  >
                    <Icon className="h-4 w-4 text-fg-muted" />
                    <span>{e.label}</span>
                    {e.hint && <span className="truncate text-[12px] text-fg-muted">{e.hint}</span>}
                    {i === idx && <CornerDownLeft className="ml-auto h-3.5 w-3.5 text-fg-muted" />}
                  </button>
                </li>
              </React.Fragment>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
