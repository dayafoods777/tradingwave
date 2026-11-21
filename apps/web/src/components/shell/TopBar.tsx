'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Bell,
  ChevronDown,
  CreditCard,
  Globe,
  Languages,
  Menu,
  Moon,
  OctagonX,
  PlugZap,
  Search,
  ShieldCheck,
  Sun,
  LogOut,
} from 'lucide-react';
import { navLabel, type AppTab } from '../../lib/nav';
import { getMarketStatus, useIndexFeed } from '../../lib/market';
import { TickNumber } from '../ui/Ticker';
import CommandPalette from './CommandPalette';

interface TopBarProps {
  active: AppTab;
  onSelect: (tab: AppTab) => void;
  onOpenMobileNav: () => void;
  onKillSwitch: () => void;
  isKillSwitchTriggered: boolean;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

const NOTIFICATIONS = [
  { title: 'TradingWave Nifty OHOL 3M', body: 'Continuous live check completed with 0 errors.', ago: '1m' },
  { title: 'Angel One API', body: 'Static IP 13.235.122.84 active and verified.', ago: '5m' },
  { title: 'Paper order filled', body: 'HDFCBANK filled at ₹846.00.', ago: '12m' },
];

function useClickOutside(ref: React.RefObject<HTMLElement | null>, onOut: () => void) {
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onOut();
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [ref, onOut]);
}

export default function TopBar({
  active,
  onSelect,
  onOpenMobileNav,
  onKillSwitch,
  isKillSwitchTriggered,
  theme,
  toggleTheme,
}: TopBarProps) {
  const [menu, setMenu] = useState<null | 'notif' | 'account'>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [market, setMarket] = useState<'IND' | 'USA'>('IND');
  const [lang, setLang] = useState<'English' | 'हिन्दी'>('English');
  const [unread, setUnread] = useState(NOTIFICATIONS.length);
  const [status, setStatus] = useState<{ open: boolean; label: string }>({ open: false, label: 'Market closed' });
  const quotes = useIndexFeed();
  const nifty = quotes[0];
  const bank = quotes[1];

  const notifRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const close = React.useCallback(() => setMenu(m => (m === 'notif' ? null : m)), []);
  const closeAcc = React.useCallback(() => setMenu(m => (m === 'account' ? null : m)), []);
  useClickOutside(notifRef, close);
  useClickOutside(accountRef, closeAcc);

  useEffect(() => {
    setStatus(getMarketStatus());
    const id = setInterval(() => setStatus(getMarketStatus()), 30_000);
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen(o => !o);
      }
      if (e.key === 'Escape') setMenu(null);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      clearInterval(id);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 flex h-12 items-center gap-2 border-b border-border bg-bg/90 px-3 sm:px-4 supports-[backdrop-filter]:bg-bg/80 supports-[backdrop-filter]:backdrop-blur">
        <button onClick={onOpenMobileNav} className="tw-btn-ghost h-8 w-8 px-0 lg:hidden" aria-label="Open navigation">
          <Menu className="h-4 w-4" />
        </button>

        <div className="min-w-0 flex items-center gap-1.5 text-[13px]">
          <span className="hidden text-fg-muted sm:inline">algobulls</span>
          <span className="hidden text-fg-muted sm:inline">/</span>
          <span className="truncate font-medium text-fg">{navLabel(active)}</span>
        </div>

        <button
          onClick={() => setPaletteOpen(true)}
          className="ml-3 hidden h-8 w-[260px] items-center gap-2 rounded-md border border-border bg-surface px-2.5 text-[13px] text-fg-muted transition-colors hover:border-border-strong md:flex"
        >
          <Search className="h-3.5 w-3.5" />
          <span>Search or jump to…</span>
          <span className="ml-auto tw-kbd">⌘K</span>
        </button>

        <div className="ml-auto flex items-center gap-1 sm:gap-1.5">
          {/* Market status + index */}
          <div className="hidden items-center gap-3 rounded-md px-2 text-[12px] xl:flex">
            <span className="flex items-center gap-1.5 text-fg-secondary">
              <span className={`h-1.5 w-1.5 rounded-full ${status.open ? 'bg-profit' : 'bg-fg-muted'}`} />
              NSE · {status.label}
            </span>
            {[nifty, bank].map(q => (
              <span key={q.symbol} className="flex items-baseline gap-1.5">
                <span className="text-fg-muted">{q.symbol === 'NIFTY 50' ? 'NIFTY' : q.symbol}</span>
                <TickNumber value={q.price} className="text-fg" />
                <span className={`font-mono text-2xs ${q.change >= 0 ? 'text-profit' : 'text-loss'}`}>
                  {q.change >= 0 ? '+' : '−'}
                  {Math.abs((q.change / q.prev) * 100).toFixed(2)}%
                </span>
              </span>
            ))}
          </div>

          <button onClick={() => setPaletteOpen(true)} className="tw-btn-ghost h-8 w-8 px-0 md:hidden" aria-label="Search">
            <Search className="h-4 w-4" />
          </button>

          {/* Kill switch */}
          <button
            onClick={onKillSwitch}
            disabled={isKillSwitchTriggered}
            className={`tw-btn h-8 border text-[12px] ${
              isKillSwitchTriggered
                ? 'border-loss/40 bg-loss-soft text-loss disabled:opacity-100'
                : 'border-loss/30 bg-surface text-loss hover:bg-loss-soft'
            }`}
            title="Cancel all open orders and square off every live position"
          >
            <OctagonX className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{isKillSwitchTriggered ? 'Kill switch active' : 'Kill switch'}</span>
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setMenu(m => (m === 'notif' ? null : 'notif'))}
              className="tw-btn-ghost relative h-8 w-8 px-0"
              aria-label={`Notifications (${unread} unread)`}
            >
              <Bell className="h-4 w-4" />
              {unread > 0 && <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-accent" />}
            </button>
            {menu === 'notif' && (
              <div className="absolute right-0 top-full z-50 mt-1.5 w-80 max-w-[calc(100vw-24px)] animate-fade-up rounded-lg border border-border bg-surface shadow-pop">
                <div className="flex items-center justify-between border-b border-border px-3 py-2">
                  <span className="text-[13px] font-medium text-fg">Notifications</span>
                  <button onClick={() => setUnread(0)} className="text-[12px] text-primary hover:underline">
                    Mark all read
                  </button>
                </div>
                <ul className="divide-y divide-border">
                  {NOTIFICATIONS.map((n, i) => (
                    <li key={n.title} className="flex gap-2.5 px-3 py-2.5">
                      <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${i < unread ? 'bg-accent' : 'bg-transparent'}`} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="truncate text-[13px] font-medium text-fg">{n.title}</span>
                          <span className="font-mono text-2xs text-fg-muted">{n.ago}</span>
                        </div>
                        <p className="text-[12px] text-fg-secondary">{n.body}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <button
            onClick={toggleTheme}
            className="tw-btn-ghost h-8 w-8 px-0"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Account */}
          <div className="relative" ref={accountRef}>
            <button
              onClick={() => setMenu(m => (m === 'account' ? null : 'account'))}
              className="flex h-8 items-center gap-1.5 rounded-md pl-1 pr-1.5 transition-colors hover:bg-subtle"
              aria-label="Account"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-fg">A</span>
              <ChevronDown className="hidden h-3.5 w-3.5 text-fg-muted sm:block" />
            </button>
            {menu === 'account' && (
              <div className="absolute right-0 top-full z-50 mt-1.5 w-64 animate-fade-up rounded-lg border border-border bg-surface p-1 shadow-pop">
                <div className="px-2.5 py-2">
                  <div className="text-[13px] font-medium text-fg">algobulls</div>
                  <div className="font-mono text-2xs text-fg-muted">ID 83794997</div>
                </div>
                <div className="my-1 h-px bg-border" />
                <div className="flex items-center justify-between px-2.5 py-1.5 text-[13px] text-fg-secondary">
                  <span className="flex items-center gap-2"><Globe className="h-3.5 w-3.5" /> Market</span>
                  <div className="flex rounded-md border border-border p-0.5">
                    {(['IND', 'USA'] as const).map(m => (
                      <button
                        key={m}
                        onClick={() => setMarket(m)}
                        className={`h-5 rounded px-1.5 text-2xs font-medium ${market === m ? 'bg-muted text-fg' : 'text-fg-muted'}`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between px-2.5 py-1.5 text-[13px] text-fg-secondary">
                  <span className="flex items-center gap-2"><Languages className="h-3.5 w-3.5" /> Language</span>
                  <div className="flex rounded-md border border-border p-0.5">
                    {(['English', 'हिन्दी'] as const).map(l => (
                      <button
                        key={l}
                        onClick={() => setLang(l)}
                        className={`h-5 rounded px-1.5 text-2xs font-medium ${lang === l ? 'bg-muted text-fg' : 'text-fg-muted'}`}
                      >
                        {l === 'English' ? 'EN' : 'हि'}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="my-1 h-px bg-border" />
                {[
                  { id: 'brokers' as AppTab, label: 'Connected brokers', icon: PlugZap },
                  { id: 'pricing' as AppTab, label: 'Plans & billing', icon: CreditCard },
                ].map(i => (
                  <button
                    key={i.id}
                    onClick={() => {
                      onSelect(i.id);
                      setMenu(null);
                    }}
                    className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-[13px] text-fg-secondary hover:bg-subtle hover:text-fg"
                  >
                    <i.icon className="h-3.5 w-3.5" /> {i.label}
                  </button>
                ))}
                <div className="flex items-center gap-2 px-2.5 py-1.5 text-[12px] text-fg-muted">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" /> 2FA enabled
                </div>
                <div className="my-1 h-px bg-border" />
                <button
                  onClick={() => {
                    setMenu(null);
                    onKillSwitch();
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-[13px] text-loss hover:bg-loss-soft"
                >
                  <OctagonX className="h-3.5 w-3.5" /> Kill switch
                </button>
                <button className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-[13px] text-fg-secondary hover:bg-subtle hover:text-fg">
                  <LogOut className="h-3.5 w-3.5" /> Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onSelect={tab => {
          onSelect(tab);
          setPaletteOpen(false);
        }}
        onToggleTheme={() => {
          toggleTheme();
          setPaletteOpen(false);
        }}
        onKillSwitch={() => {
          setPaletteOpen(false);
          onKillSwitch();
        }}
      />
    </>
  );
}
