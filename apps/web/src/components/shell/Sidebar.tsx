'use client';

import React from 'react';
import Link from 'next/link';
import { PanelLeftClose, PanelLeftOpen, X } from 'lucide-react';
import Logo, { LogoMark } from '../ui/Logo';
import { NAV_GROUPS, type AppTab } from '../../lib/nav';

interface SidebarProps {
  active: AppTab;
  onSelect: (tab: AppTab) => void;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  connectedBrokers: number;
  liveBots: number;
}

export default function Sidebar({
  active,
  onSelect,
  collapsed,
  onToggleCollapsed,
  mobileOpen,
  onCloseMobile,
  connectedBrokers,
  liveBots,
}: SidebarProps) {
  const content = (isMobile: boolean) => {
    const narrow = collapsed && !isMobile;
    return (
      <div className="flex h-full flex-col">
        <div className={`flex h-12 items-center border-b border-border ${narrow ? 'justify-center px-0' : 'justify-between px-3.5'}`}>
          <Link href="/" className="rounded-md" aria-label="TradingWave home">
            {narrow ? <LogoMark size={22} /> : <Logo size={22} />}
          </Link>
          {isMobile && (
            <button onClick={onCloseMobile} className="tw-btn-ghost h-7 w-7 px-0" aria-label="Close navigation">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto no-scrollbar px-2 py-3" aria-label="Primary">
          {NAV_GROUPS.map(group => (
            <div key={group.label} className="mb-4 last:mb-0">
              {!narrow && <div className="tw-label px-2 pb-1.5">{group.label}</div>}
              {narrow && <div className="mx-auto mb-1.5 h-px w-5 bg-border first:hidden" />}
              <ul className="space-y-px">
                {group.items.map(item => {
                  const Icon = item.icon;
                  const isActive = active === item.id;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => {
                          onSelect(item.id);
                          if (isMobile) onCloseMobile();
                        }}
                        title={narrow ? item.label : undefined}
                        aria-current={isActive ? 'page' : undefined}
                        className={`group relative flex w-full items-center gap-2.5 rounded-md text-[13px] transition-colors duration-150 ${
                          narrow ? 'h-9 justify-center' : 'h-8 px-2'
                        } ${
                          isActive
                            ? 'bg-surface text-fg font-medium shadow-hairline'
                            : 'text-fg-secondary hover:bg-subtle hover:text-fg'
                        }`}
                      >
                        {isActive && <span className="absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-full bg-primary" />}
                        <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-primary' : 'text-fg-muted group-hover:text-fg-secondary'}`} strokeWidth={1.75} />
                        {!narrow && <span className="truncate">{item.label}</span>}
                        {!narrow && item.id === 'dashboard' && liveBots > 0 && (
                          <span className="ml-auto font-mono text-2xs text-profit">{liveBots} live</span>
                        )}
                        {!narrow && item.id === 'brokers' && (
                          <span className="ml-auto font-mono text-2xs text-fg-muted">{connectedBrokers}/38</span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className={`border-t border-border p-2 ${narrow ? 'flex justify-center' : ''}`}>
          {!narrow && (
            <div className="mb-2 rounded-md border border-border bg-surface px-2.5 py-2">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-medium text-fg">Paper trading</span>
                <span className="tw-badge bg-accent-soft text-accent-fg">Sandbox</span>
              </div>
              <p className="mt-1 text-2xs text-fg-muted leading-snug">New deployments start in paper mode until you switch them to live.</p>
            </div>
          )}
          {!isMobile && (
            <button
              onClick={onToggleCollapsed}
              className={`tw-btn-ghost ${narrow ? 'h-8 w-8 px-0' : 'w-full justify-start px-2'}`}
              aria-label={narrow ? 'Expand sidebar' : 'Collapse sidebar'}
              title={narrow ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {narrow ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
              {!narrow && <span>Collapse</span>}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <aside
        className={`sticky top-0 hidden h-screen shrink-0 border-r border-border bg-bg transition-[width] duration-200 ease-out lg:block ${
          collapsed ? 'w-[56px]' : 'w-[232px]'
        }`}
      >
        {content(false)}
      </aside>

      {/* Mobile drawer */}
      <div className={`fixed inset-0 z-50 lg:hidden ${mobileOpen ? '' : 'pointer-events-none'}`} aria-hidden={!mobileOpen}>
        <div
          onClick={onCloseMobile}
          className={`absolute inset-0 bg-ink/40 transition-opacity duration-200 ${mobileOpen ? 'opacity-100' : 'opacity-0'}`}
        />
        <aside
          className={`absolute inset-y-0 left-0 w-[264px] max-w-[85vw] border-r border-border bg-bg shadow-pop transition-transform duration-200 ease-out ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {content(true)}
        </aside>
      </div>
    </>
  );
}
