'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Check, Menu, Minus, Moon, Phone, Plus, Sun, X } from 'lucide-react';
import Logo from '../ui/Logo';
import { TickNumber } from '../ui/Ticker';
import { useIndexFeed, getMarketStatus } from '../../lib/market';
import { useTheme } from '../../lib/theme';
import { EquityCurve, PayoffChart, TerminalMock } from './mocks';
import { INDIAN_STOCKS } from '../DashboardView';
import { ALL_BROKERS_BASE } from '../BrokersView';

const PHONE_DISPLAY = '+91 901 908 8160';
const PHONE_HREF = 'tel:+919019088160';

/* ------------------------------------------------------------------ */
/* Nav                                                                 */
/* ------------------------------------------------------------------ */
function Nav() {
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const links = [
    ['Product', '#product'],
    ['How it works', '#how'],
    ['Safety', '#safety'],
    ['Pricing', '#pricing'],
    ['FAQ', '#faq'],
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/85 supports-[backdrop-filter]:backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[1200px] items-center gap-8 px-5">
        <Link href="/" aria-label="TradingWave home">
          <Logo size={22} />
        </Link>
        <nav className="hidden items-center gap-6 text-[13px] text-fg-secondary md:flex">
          {links.map(([l, h]) => (
            <a key={h} href={h} className="transition-colors hover:text-fg">
              {l}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1.5">
          <button onClick={toggleTheme} className="tw-btn-ghost h-8 w-8 px-0" aria-label="Toggle theme">
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <Link href="/app/" className="tw-btn-ghost hidden sm:inline-flex">
            Sign in
          </Link>
          <Link href="/app/" className="tw-btn-primary">
            Open terminal
          </Link>
          <button onClick={() => setOpen(o => !o)} className="tw-btn-ghost h-8 w-8 px-0 md:hidden" aria-label="Menu">
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="animate-fade-up border-t border-border px-5 py-2 md:hidden">
          {links.map(([l, h]) => (
            <a key={h} href={h} onClick={() => setOpen(false)} className="block py-2 text-[14px] text-fg-secondary">
              {l}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Ticker                                                              */
/* ------------------------------------------------------------------ */
function TickerStrip() {
  const quotes = useIndexFeed();
  const status = getMarketStatus();
  const items = [
    ...quotes.map(q => ({ s: q.symbol, p: q.price, c: (q.change / q.prev) * 100, live: true })),
    ...INDIAN_STOCKS.slice(0, 16).map(s => ({
      s: s.symbol,
      p: parseFloat(s.price.replace(/,/g, '')),
      c: parseFloat(s.change),
      live: false,
    })),
  ];
  const Row = ({ hidden }: { hidden?: boolean }) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden}>
      {items.map(i => (
        <span key={i.s} className="flex items-baseline gap-2 border-r border-border px-5 text-[12px]">
          <span className="font-medium text-fg-secondary">{i.s}</span>
          {i.live ? <TickNumber value={i.p} className="text-fg" /> : <span className="font-mono text-fg">{i.p.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>}
          <span className={`font-mono text-2xs ${i.c >= 0 ? 'text-profit' : 'text-loss'}`}>
            {i.c >= 0 ? '▲' : '▼'} {Math.abs(i.c).toFixed(2)}%
          </span>
        </span>
      ))}
    </div>
  );
  return (
    <div className="flex h-9 items-center overflow-hidden border-b border-border bg-surface">
      <div className="z-10 flex h-full shrink-0 items-center gap-2 border-r border-border bg-surface px-4 text-2xs font-medium uppercase tracking-[0.08em] text-fg-muted">
        <span className={`h-1.5 w-1.5 rounded-full ${status.open ? 'bg-profit' : 'bg-fg-muted'}`} />
        <span className="hidden sm:inline">NSE · </span>
        {status.open ? 'Live' : 'Delayed'}
      </div>
      <div className="relative min-w-0 flex-1 overflow-hidden">
        <div className="animate-marquee">
          <Row />
          <Row hidden />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sections                                                            */
/* ------------------------------------------------------------------ */
function SectionHead({ eyebrow, title, body, id }: { eyebrow: string; title: React.ReactNode; body?: React.ReactNode; id?: string }) {
  return (
    <div id={id} className="max-w-[640px] scroll-mt-24">
      <div className="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-primary">
        <span className="h-px w-5 bg-primary" />
        {eyebrow}
      </div>
      <h2 className="text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] text-fg sm:text-[36px]">{title}</h2>
      {body && <p className="mt-4 text-[15px] leading-relaxed text-fg-secondary">{body}</p>}
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="pointer-events-none absolute inset-0 h-grid-bg opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" />
      <div className="relative mx-auto max-w-[1200px] px-5 pb-16 pt-16 sm:pt-24">
        <div className="max-w-[820px]">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface py-1 pl-1 pr-3 text-[12px] text-fg-secondary">
            <span className="rounded-full bg-accent-soft px-2 py-0.5 font-medium text-accent-fg">New</span>
            Multi-leg adjustments for weekly expiries
          </div>
          <h1 className="text-[40px] font-semibold leading-[1.02] tracking-[-0.04em] text-fg sm:text-[60px] lg:text-[68px]">
            Options strategies,
            <br />
            automated to the rule.
            <br />
            <span className="text-fg-muted">Built for NSE &amp; BSE.</span>
          </h1>
          <p className="mt-6 max-w-[580px] text-[16px] leading-relaxed text-fg-secondary sm:text-[17px]">
            TradingWave turns your F&amp;O playbook into rule-based strategies — built without code, tested on historical NSE
            data, and executed through your own broker account. Your capital never leaves your broker.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/app/" className="tw-btn-primary h-10 px-4 text-[14px]">
              Start paper trading <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#how" className="tw-btn-secondary h-10 px-4 text-[14px]">
              See how it works
            </a>
          </div>
          <dl className="mt-10 grid max-w-[620px] grid-cols-3 gap-6 border-t border-border pt-6">
            {[
              ['38', 'Indian brokers'],
              ['0', 'code required'],
              ['1 key', 'to square off all'],
            ].map(([v, l]) => (
              <div key={l}>
                <dt className="font-mono text-[22px] font-medium tracking-tight text-fg">{v}</dt>
                <dd className="mt-0.5 text-[12px] text-fg-muted">{l}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative mt-14">
          <TerminalMock />
          <p className="mt-3 text-right text-2xs text-fg-muted">Illustrative interface. Prices are simulated.</p>
        </div>
      </div>
    </section>
  );
}

function BrokerStrip() {
  const names = ['Zerodha', 'Upstox', 'Angel One', 'Dhan', 'Fyers', 'Kotak Neo', 'ICICI Direct', '5paisa', 'Groww', 'Finvasia'];
  return (
    <section className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-5 px-5 py-8 lg:flex-row lg:items-center lg:gap-12">
        <p className="shrink-0 text-[13px] text-fg-muted">Executes through the broker you already use</p>
        <ul className="flex flex-wrap items-center gap-x-8 gap-y-3">
          {names.map(n => (
            <li key={n} className="text-[15px] font-semibold tracking-[-0.02em] text-fg-secondary">
              {n}
            </li>
          ))}
          <li className="font-mono text-[12px] text-fg-muted">+{ALL_BROKERS_BASE.length - names.length} more</li>
        </ul>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: '01',
      t: 'Build',
      d: 'Compose entries, exits and adjustments from 200+ keywords — time, price, indicators, Greeks, MTM. Multi-leg, multi-expiry, no code.',
      visual: (
        <div className="space-y-1.5 font-mono text-[11.5px] leading-relaxed">
          <div><span className="text-primary">WHEN</span> <span className="text-fg">time</span> <span className="text-fg-muted">≥</span> <span className="text-fg">09:20</span></div>
          <div><span className="text-primary">AND </span> <span className="text-fg">INDIAVIX</span> <span className="text-fg-muted">&lt;</span> <span className="text-fg">16</span></div>
          <div><span className="text-primary">DO  </span> <span className="text-loss">SELL</span> <span className="text-fg">ATM CE + PE</span> <span className="text-fg-muted">· weekly</span></div>
          <div><span className="text-primary">EXIT</span> <span className="text-fg">MTM ≤ −6,000</span> <span className="text-fg-muted">or</span> <span className="text-fg">15:15</span></div>
        </div>
      ),
    },
    {
      n: '02',
      t: 'Backtest',
      d: 'Replay the exact rules on historical NIFTY, BANKNIFTY and FINNIFTY data with slippage and charges modelled, then read the drawdowns — not just the returns.',
      visual: <EquityCurve height={96} />,
    },
    {
      n: '03',
      t: 'Deploy',
      d: 'Start in paper mode. When you are ready, switch to live on your broker with a multiplier, capital cap and daily loss limit.',
      visual: (
        <div className="space-y-2 text-[12px]">
          {[
            ['Paper', 'Sandbox', 'bg-accent-soft text-accent-fg'],
            ['Live · Zerodha', '1× · cap ₹2,00,000', 'bg-profit-soft text-profit'],
          ].map(([a, b, c]) => (
            <div key={a} className="flex items-center justify-between rounded-md border border-border bg-surface px-2.5 py-2">
              <span className={`tw-badge ${c}`}>{a}</span>
              <span className="font-mono text-2xs text-fg-muted">{b}</span>
            </div>
          ))}
        </div>
      ),
    },
  ];
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-[1200px] px-5 py-20 sm:py-24">
        <SectionHead
          id="how"
          eyebrow="How it works"
          title="From idea to live order in three deliberate steps."
          body="Every strategy moves through the same path. Nothing goes live without passing through a backtest and a paper run first, unless you choose otherwise."
        />
        <ol className="mt-12 grid grid-cols-1 border-l border-t border-border md:grid-cols-3">
          {steps.map(s => (
            <li key={s.n} className="flex flex-col border-b border-r border-border bg-surface p-6">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-[12px] text-fg-muted">{s.n}</span>
                <h3 className="text-[18px] font-semibold tracking-[-0.02em] text-fg">{s.t}</h3>
              </div>
              <p className="mt-2 text-[14px] leading-relaxed text-fg-secondary">{s.d}</p>
              <div className="mt-6 rounded-md border border-border bg-subtle p-3.5">{s.visual}</div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Showcase() {
  const tabs = [
    {
      id: 'builder',
      title: 'Strategy builder',
      body: 'Condition blocks for entries, exits and repairs. Reference any leg, any expiry, any index. Strategies are versioned so you can see exactly what changed before a bad week.',
      points: ['Time, price, indicator and Greek conditions', 'Per-leg stop loss, target and trailing', 'Re-entry and adjustment rules'],
    },
    {
      id: 'wizard',
      title: 'Option wizard',
      body: 'Pick a template — straddle, strangle, iron fly, calendar — and see payoff, breakevens and net Greeks update as you move strikes.',
      points: ['Live payoff at expiry and T+0', 'Net Δ, Γ, Θ, Vega per position', 'Margin estimate before you deploy'],
    },
    {
      id: 'backtest',
      title: 'Backtesting',
      body: 'Minute-level replays with brokerage, STT and slippage applied. Results report drawdown depth and duration alongside returns.',
      points: ['Charges and slippage modelled', 'Max drawdown and recovery time', 'Trade-by-trade ledger export'],
    },
    {
      id: 'brokers',
      title: '38 brokers',
      body: 'Connect via official broker APIs. Orders are placed in your own account; TradingWave never holds funds or securities.',
      points: ['Zerodha, Upstox, Angel One, Dhan, Fyers…', 'Static-IP ready API connections', 'Run one strategy across multiple accounts'],
    },
  ] as const;
  const [active, setActive] = useState<(typeof tabs)[number]['id']>('builder');
  const quotes = useIndexFeed();

  const panel = () => {
    switch (active) {
      case 'builder':
        return (
          <div className="space-y-2.5 p-5">
            {[
              ['Entry', 'Time ≥ 09:20 · Mon–Thu', 'AND', 'NIFTY ATM IV between 11 and 18'],
              ['Legs', 'SELL 1× ATM CE · SELL 1× ATM PE', 'HEDGE', 'BUY 1× ±300 wings'],
              ['Exit', 'Combined MTM ≤ −₹6,000', 'OR', 'Time ≥ 15:15'],
              ['Repair', 'Leg SL hit → shift to new ATM', 'MAX', '2 adjustments / day'],
            ].map(([k, a, op, b]) => (
              <div key={k} className="grid grid-cols-[64px_1fr] items-start gap-3 rounded-md border border-border bg-surface p-3 text-[12.5px]">
                <span className="tw-label pt-0.5">{k}</span>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="rounded border border-border bg-subtle px-1.5 py-0.5 font-mono text-[11.5px] text-fg">{a}</span>
                  <span className="font-mono text-2xs font-semibold text-primary">{op}</span>
                  <span className="rounded border border-border bg-subtle px-1.5 py-0.5 font-mono text-[11.5px] text-fg">{b}</span>
                </div>
              </div>
            ))}
          </div>
        );
      case 'wizard':
        return (
          <div className="p-5">
            <div className="mb-2 flex items-center justify-between text-[12px]">
              <span className="font-medium text-fg">Iron fly · NIFTY 28 NOV</span>
              <span className="font-mono text-fg-muted">Spot <TickNumber value={quotes[0].price} className="text-fg" /></span>
            </div>
            <PayoffChart spot={quotes[0].price} compact />
            <div className="mt-3 grid grid-cols-4 divide-x divide-border rounded-md border border-border bg-surface">
              {[
                ['Δ', '−0.04'],
                ['Γ', '−0.0011'],
                ['Θ', '+1,842'],
                ['Vega', '−3,120'],
              ].map(([k, v]) => (
                <div key={k} className="px-3 py-2">
                  <div className="text-2xs text-fg-muted">{k}</div>
                  <div className="font-mono text-[13px] text-fg">{v}</div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'backtest':
        return (
          <div className="p-5">
            <div className="mb-3 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-4">
              {[
                ['CAGR', '18.4%'],
                ['Max drawdown', '−11.2%'],
                ['Win rate', '61%'],
                ['Trades', '1,284'],
              ].map(([k, v]) => (
                <div key={k} className="bg-surface px-3 py-2">
                  <div className="text-2xs text-fg-muted">{k}</div>
                  <div className={`font-mono text-[14px] ${v.startsWith('−') ? 'text-loss' : 'text-fg'}`}>{v}</div>
                </div>
              ))}
            </div>
            <div className="rounded-md border border-border bg-surface p-2">
              <EquityCurve height={170} />
            </div>
            <p className="mt-2 text-2xs text-fg-muted">Illustrative backtest. Past performance does not indicate future results.</p>
          </div>
        );
      case 'brokers':
        return (
          <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-3">
            {ALL_BROKERS_BASE.slice(0, 15).map((b, i) => (
              <div key={b.name} className="flex items-center justify-between bg-surface px-4 py-3 text-[12.5px]">
                <span className="truncate text-fg">{b.name}</span>
                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${i < 3 ? 'bg-profit' : 'bg-border-strong'}`} />
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <section className="border-b border-border bg-surface">
      <div className="mx-auto max-w-[1200px] px-5 py-20 sm:py-24">
        <SectionHead
          id="product"
          eyebrow="Product"
          title="One terminal for the whole options workflow."
          body="The builder, the wizard, the backtester and your broker connections share one strategy model — what you test is what you deploy."
        />
        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
          <div role="tablist" aria-label="Product areas" className="flex flex-col">
            {tabs.map(t => {
              const on = active === t.id;
              return (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={on}
                  onClick={() => setActive(t.id)}
                  className={`border-l-2 py-4 pl-5 pr-3 text-left transition-colors duration-200 ${on ? 'border-primary' : 'border-border hover:border-border-strong'}`}
                >
                  <div className={`text-[15px] font-semibold tracking-[-0.01em] ${on ? 'text-fg' : 'text-fg-secondary'}`}>{t.title}</div>
                  {on && (
                    <div className="animate-fade-up">
                      <p className="mt-1.5 text-[13.5px] leading-relaxed text-fg-secondary">{t.body}</p>
                      <ul className="mt-3 space-y-1.5">
                        {t.points.map(p => (
                          <li key={p} className="flex items-start gap-2 text-[13px] text-fg-secondary">
                            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" /> {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          <div className="min-h-[360px] overflow-hidden rounded-lg border border-border bg-subtle">
            <div className="flex h-9 items-center justify-between border-b border-border bg-surface px-4 text-[12px]">
              <span className="font-medium text-fg">{tabs.find(t => t.id === active)?.title}</span>
              <Link href="/app/" className="flex items-center gap-1 text-fg-muted hover:text-fg">
                Open in terminal <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
            <div key={active} className="animate-fade-in">{panel()}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Safety() {
  const items = [
    ['Kill switch', 'One action cancels pending orders and squares off every open position, across every connected broker. Available from the top bar and ⌘K.'],
    ['Sandbox first', 'Every deployment can run in paper mode against live prices before it touches capital. Switching to live is an explicit step.'],
    ['Hard limits', 'Per-strategy max loss, daily MTM stop, capital cap and order-rate throttles are enforced before an order leaves TradingWave.'],
    ['Freeze-quantity slicing', 'Orders above exchange freeze limits are split automatically, so large lots do not get rejected mid-adjustment.'],
    ['Broker-side custody', 'Funds and holdings stay with your SEBI-registered broker. TradingWave only sends orders through the API you authorise.'],
    ['Full audit trail', 'Every signal, order, modification and rejection is logged with millisecond timestamps for your own records.'],
  ];
  return (
    <section className="border-b border-border bg-ink text-ink-fg">
      <div className="mx-auto max-w-[1200px] px-5 py-20 sm:py-24">
        <div id="safety" className="grid scroll-mt-24 grid-cols-1 gap-12 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <div className="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-accent">
              <span className="h-px w-5 bg-accent" /> Risk &amp; safety
            </div>
            <h2 className="text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[36px]">
              Built to stop
              <br />
              as well as start.
            </h2>
            <p className="mt-4 max-w-[420px] text-[15px] leading-relaxed text-ink-fg/70">
              Automation magnifies mistakes as easily as it magnifies discipline. The controls that end a trade get as much
              engineering as the ones that open it.
            </p>
            <div className="mt-8 inline-flex items-center gap-3 rounded-md border border-ink-line bg-ink-raised px-3 py-2.5">
              <span className="flex h-7 items-center gap-1.5 rounded-md border border-loss/50 px-2 text-[12px] text-loss">Kill switch</span>
              <span className="font-mono text-[11px] text-ink-fg/60">12 orders cancelled · 8 positions closed · 1.4s</span>
            </div>
          </div>
          <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-ink-line bg-ink-line sm:grid-cols-2">
            {items.map(([t, d]) => (
              <div key={t} className="bg-ink p-5">
                <dt className="text-[14px] font-semibold">{t}</dt>
                <dd className="mt-1.5 text-[13px] leading-relaxed text-ink-fg/65">{d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

function PricingTeaser() {
  const plans = [
    { n: 'Free', p: '₹0', s: 'forever', f: ['Unlimited strategies', '1 paper deployment', 'Backtests on daily data'], cta: 'Start free' },
    { n: 'Starter', p: '₹250', s: '/mo, billed yearly', f: ['1 live deployment', 'Unlimited paper deployments', 'Telegram & WhatsApp alerts'], cta: 'Choose Starter', hl: true },
    { n: 'Standard', p: '₹1,000', s: '/mo, billed yearly', f: ['4 live deployments', 'Sub-second execution', 'Multi-broker execution'], cta: 'Choose Standard' },
  ];
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-[1200px] px-5 py-20 sm:py-24">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHead id="pricing" eyebrow="Pricing" title="Pay for live capacity, not for features." body="Every plan includes the builder, the wizard and backtesting. Prices exclude GST." />
          <Link href="/app/#pricing" className="tw-btn-secondary shrink-0">
            Compare all plans <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="mt-12 grid grid-cols-1 overflow-hidden rounded-lg border border-border bg-surface md:grid-cols-3">
          {plans.map((pl, i) => (
            <div key={pl.n} className={`relative flex flex-col p-6 ${i > 0 ? 'border-t border-border md:border-l md:border-t-0' : ''}`}>
              {pl.hl && <span className="absolute inset-x-0 top-0 h-[2px] bg-primary" />}
              <div className="flex items-center justify-between">
                <h3 className="text-[15px] font-semibold text-fg">{pl.n}</h3>
                {pl.hl && <span className="tw-badge bg-primary-soft text-primary">Most chosen</span>}
              </div>
              <div className="mt-4 flex items-baseline gap-1.5">
                <span className="font-mono text-[32px] font-medium tracking-tight text-fg">{pl.p}</span>
                <span className="text-[12px] text-fg-muted">{pl.s}</span>
              </div>
              <ul className="mt-5 flex-1 space-y-2">
                {pl.f.map(f => (
                  <li key={f} className="flex items-center gap-2 text-[13px] text-fg-secondary">
                    <Check className="h-3.5 w-3.5 text-primary" /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/app/#pricing" className={`mt-6 ${pl.hl ? 'tw-btn-primary' : 'tw-btn-secondary'}`}>
                {pl.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const qs = [
    ['Is TradingWave a broker or an adviser?', 'Neither. TradingWave is execution software. We do not hold client funds, give tips or recommend trades, and we are not a SEBI-registered investment adviser or research analyst. Orders go through your own broker account.'],
    ['Do you guarantee returns?', 'No. No strategy, backtest or platform can guarantee profits. Derivatives trading carries substantial risk and most individual F&O traders lose money. Backtests are simulations and do not predict future results.'],
    ['Which instruments can I automate?', 'Index and stock options and futures on NSE and BSE — NIFTY, BANKNIFTY, FINNIFTY, MIDCPNIFTY and SENSEX among them — plus equity cash and MCX commodities where your broker supports them.'],
    ['What happens if my laptop or internet goes off?', 'Strategies run on TradingWave servers, not your browser. Your deployment keeps monitoring conditions and managing exits until it completes, you pause it, or you hit the kill switch.'],
    ['How do I connect my broker?', 'Create an API app with your broker, paste the key and secret into Brokers, and complete the broker’s own login. Most connections take under five minutes and can be revoked from either side.'],
    ['Can I try it without risking capital?', 'Yes. Paper trading uses live market prices with simulated fills and is free on every plan.'],
  ];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="border-b border-border bg-surface">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-12 px-5 py-20 sm:py-24 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <SectionHead id="faq" eyebrow="FAQ" title="Straight answers." />
          <p className="mt-4 text-[14px] text-fg-secondary">
            Still unsure? Call us on{' '}
            <a href={PHONE_HREF} className="font-mono text-fg underline decoration-border-strong underline-offset-4 hover:decoration-fg">
              {PHONE_DISPLAY}
            </a>
            , Monday to Friday, 9:00–18:00 IST.
          </p>
        </div>
        <ul className="border-t border-border">
          {qs.map(([q, a], i) => {
            const on = open === i;
            return (
              <li key={q} className="border-b border-border">
                <button onClick={() => setOpen(on ? null : i)} aria-expanded={on} className="flex w-full items-center justify-between gap-4 py-4 text-left">
                  <span className="text-[15px] font-medium text-fg">{q}</span>
                  {on ? <Minus className="h-4 w-4 shrink-0 text-fg-muted" /> : <Plus className="h-4 w-4 shrink-0 text-fg-muted" />}
                </button>
                <div className={`grid transition-[grid-template-rows] duration-200 ease-out ${on ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                  <p className="overflow-hidden pb-0 text-[14px] leading-relaxed text-fg-secondary">
                    <span className="block pb-5 pr-8">{a}</span>
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto flex max-w-[1200px] flex-col items-start justify-between gap-8 px-5 py-16 sm:py-20 lg:flex-row lg:items-center">
        <h2 className="max-w-[640px] text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] text-fg sm:text-[36px]">
          Paper-trade your first strategy before tomorrow’s open.
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/app/" className="tw-btn-primary h-10 px-4 text-[14px]">
            Open the terminal <ArrowRight className="h-4 w-4" />
          </Link>
          <a href={PHONE_HREF} className="tw-btn-secondary h-10 px-4 text-[14px]">
            <Phone className="h-3.5 w-3.5" /> {PHONE_DISPLAY}
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const cols = [
    ['Product', [['Strategy builder', '/app/#builder'], ['Option wizard', '/app/#wizard'], ['Backtesting', '/app/#backtest'], ['Option chain', '/app/#optionchain']]],
    ['Platform', [['Brokers', '/app/#brokers'], ['Marketplace', '/app/#readystrategies'], ['Pricing', '/app/#pricing'], ['Dashboard', '/app/']]],
    ['Company', [['FAQ', '#faq'], ['Safety', '#safety'], ['Contact', PHONE_HREF]]],
  ] as const;
  return (
    <footer className="bg-bg">
      <div className="mx-auto max-w-[1200px] px-5 py-14">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="col-span-2 md:col-span-1">
            <Logo size={22} />
            <p className="mt-4 max-w-[280px] text-[13px] leading-relaxed text-fg-muted">Rule-based execution software for Indian derivatives traders.</p>
            <a href={PHONE_HREF} className="mt-4 inline-flex items-center gap-2 font-mono text-[13px] text-fg hover:text-primary">
              <Phone className="h-3.5 w-3.5" /> {PHONE_DISPLAY}
            </a>
          </div>
          {cols.map(([h, links]) => (
            <div key={h}>
              <div className="tw-label mb-3">{h}</div>
              <ul className="space-y-2">
                {links.map(([l, href]) => (
                  <li key={l}>
                    {href.startsWith('/') ? (
                      <Link href={href} className="text-[13px] text-fg-secondary hover:text-fg">{l}</Link>
                    ) : (
                      <a href={href} className="text-[13px] text-fg-secondary hover:text-fg">{l}</a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t border-border pt-6 text-[11.5px] leading-relaxed text-fg-muted">
          <p>
            Investments in the securities market are subject to market risks; read all related documents carefully before investing.
            Trading in derivatives involves substantial risk of loss. TradingWave is a technology platform and does not provide investment advice,
            portfolio management or research recommendations. Backtested and simulated results have inherent limitations and are not indicative of future returns.
          </p>
          <div className="mt-4 flex flex-wrap justify-between gap-2">
            <span>© {new Date().getFullYear()} TradingWave. All rights reserved.</span>
            <span className="font-mono">Made in India · NSE · BSE · MCX</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-bg">
      <Nav />
      <TickerStrip />
      <main>
        <Hero />
        <BrokerStrip />
        <HowItWorks />
        <Showcase />
        <Safety />
        <PricingTeaser />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
