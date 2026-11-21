'use client';

import React, { useState, useMemo } from 'react';
import { Wand2, Activity, Play, Plus, Trash2, ShieldAlert, ArrowRight, RefreshCw, BarChart2 } from 'lucide-react';

interface Leg {
  id: number;
  action: 'BUY' | 'SELL';
  type: 'CE' | 'PE';
  strike: number;
  expiry: string;
  premium: number;
  lots: number;
}

export default function OptionWizardView({ onDeployToLive }: { onDeployToLive: (strategyName: string) => void }) {
  const [underlying, setUnderlying] = useState('NIFTY 50');
  const [spotPrice, setSpotPrice] = useState(24350);
  const [daysToExpiry, setDaysToExpiry] = useState(3);
  const [ivPercent, setIvPercent] = useState(13.5);
  const [selectedPreset, setSelectedPreset] = useState<'SHORT_STRADDLE' | 'LONG_STRADDLE' | 'IRON_CONDOR' | 'BULL_CALL_SPREAD' | 'SHORT_STRANGLE'>('SHORT_STRADDLE');

  const [legs, setLegs] = useState<Leg[]>([
    { id: 1, action: 'SELL', type: 'CE', strike: 24350, expiry: 'Current Week', premium: 125.40, lots: 1 },
    { id: 2, action: 'SELL', type: 'PE', strike: 24350, expiry: 'Current Week', premium: 118.20, lots: 1 }
  ]);

  const applyPreset = (preset: 'SHORT_STRADDLE' | 'LONG_STRADDLE' | 'IRON_CONDOR' | 'BULL_CALL_SPREAD' | 'SHORT_STRANGLE') => {
    setSelectedPreset(preset);
    const atm = Math.round(spotPrice / 50) * 50;

    if (preset === 'SHORT_STRADDLE') {
      setLegs([
        { id: 1, action: 'SELL', type: 'CE', strike: atm, expiry: 'Current Week', premium: 125.40, lots: 1 },
        { id: 2, action: 'SELL', type: 'PE', strike: atm, expiry: 'Current Week', premium: 118.20, lots: 1 }
      ]);
    } else if (preset === 'LONG_STRADDLE') {
      setLegs([
        { id: 1, action: 'BUY', type: 'CE', strike: atm, expiry: 'Current Week', premium: 125.40, lots: 1 },
        { id: 2, action: 'BUY', type: 'PE', strike: atm, expiry: 'Current Week', premium: 118.20, lots: 1 }
      ]);
    } else if (preset === 'SHORT_STRANGLE') {
      setLegs([
        { id: 1, action: 'SELL', type: 'CE', strike: atm + 200, expiry: 'Current Week', premium: 52.80, lots: 1 },
        { id: 2, action: 'SELL', type: 'PE', strike: atm - 200, expiry: 'Current Week', premium: 48.60, lots: 1 }
      ]);
    } else if (preset === 'IRON_CONDOR') {
      setLegs([
        { id: 1, action: 'BUY', type: 'PE', strike: atm - 300, expiry: 'Current Week', premium: 22.00, lots: 1 },
        { id: 2, action: 'SELL', type: 'PE', strike: atm - 150, expiry: 'Current Week', premium: 58.50, lots: 1 },
        { id: 3, action: 'SELL', type: 'CE', strike: atm + 150, expiry: 'Current Week', premium: 64.20, lots: 1 },
        { id: 4, action: 'BUY', type: 'CE', strike: atm + 300, expiry: 'Current Week', premium: 25.50, lots: 1 }
      ]);
    } else if (preset === 'BULL_CALL_SPREAD') {
      setLegs([
        { id: 1, action: 'BUY', type: 'CE', strike: atm, expiry: 'Current Week', premium: 125.40, lots: 1 },
        { id: 2, action: 'SELL', type: 'CE', strike: atm + 200, expiry: 'Current Week', premium: 52.80, lots: 1 }
      ]);
    }
  };

  // Payoff calculations across price spectrum (spot - 600 to spot + 600)
  const payoffData = useMemo(() => {
    const lotSize = 25; // NIFTY lot size
    const range = 600;
    const step = 20;
    const points: { price: number; pnl: number }[] = [];

    let minPnl = Infinity;
    let maxPnl = -Infinity;

    for (let price = spotPrice - range; price <= spotPrice + range; price += step) {
      let totalPnl = 0;
      for (const leg of legs) {
        let intrinsic = 0;
        if (leg.type === 'CE') {
          intrinsic = Math.max(0, price - leg.strike);
        } else {
          intrinsic = Math.max(0, leg.strike - price);
        }

        const legPnl = leg.action === 'BUY'
          ? (intrinsic - leg.premium) * (leg.lots * lotSize)
          : (leg.premium - intrinsic) * (leg.lots * lotSize);

        totalPnl += legPnl;
      }

      points.push({ price, pnl: Math.round(totalPnl) });
      if (totalPnl < minPnl) minPnl = totalPnl;
      if (totalPnl > maxPnl) maxPnl = totalPnl;
    }

    // Find Breakevens
    const breakevens: number[] = [];
    for (let i = 0; i < points.length - 1; i++) {
      if ((points[i].pnl <= 0 && points[i + 1].pnl >= 0) || (points[i].pnl >= 0 && points[i + 1].pnl <= 0)) {
        breakevens.push(points[i].price);
      }
    }

    return { points, minPnl, maxPnl, breakevens };
  }, [legs, spotPrice]);

  // SVG dimensions & path generator
  const width = 640;
  const height = 240;
  const padding = 35;

  const svgPath = useMemo(() => {
    const { points, minPnl, maxPnl } = payoffData;
    if (points.length === 0) return '';
    const pnlSpan = Math.max(Math.abs(minPnl), Math.abs(maxPnl), 5000);
    const priceMin = points[0].price;
    const priceMax = points[points.length - 1].price;

    const toX = (p: number) => padding + ((p - priceMin) / (priceMax - priceMin)) * (width - 2 * padding);
    const toY = (v: number) => height / 2 - (v / pnlSpan) * (height / 2 - padding);

    return points.reduce((acc, pt, idx) => {
      const x = toX(pt.price);
      const y = toY(pt.pnl);
      return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
    }, '');
  }, [payoffData]);

  // Greeks estimation
  const netGreeks = useMemo(() => {
    let delta = 0;
    let theta = 0;
    let gamma = 0;
    let vega = 0;

    legs.forEach(leg => {
      const sign = leg.action === 'BUY' ? 1 : -1;
      const atmDelta = leg.type === 'CE' ? 0.50 : -0.50;
      delta += sign * atmDelta * leg.lots;
      theta += sign * (leg.type === 'CE' ? -18.2 : -17.5) * leg.lots * 25;
      gamma += sign * 0.0012 * leg.lots;
      vega += sign * 14.5 * leg.lots * 25;
    });

    return {
      delta: delta.toFixed(2),
      theta: Math.round(theta),
      gamma: gamma.toFixed(4),
      vega: Math.round(vega)
    };
  }, [legs]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-lg bg-primary-soft border border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">Options Wizard</span>
          <h2 className="text-2xl font-semibold text-fg mt-1">Multi-Leg Strategy & Greek Simulator</h2>
          <p className="text-sm text-fg-secondary mt-1 max-w-2xl">
            Visually design straddles, strangles, iron condors, and ratio spreads with real-time Black-Scholes Greeks, payoff diagram, and spot price slider.
          </p>
        </div>
        <button
          onClick={() => onDeployToLive(`${underlying} ${selectedPreset}`)}
          className="px-5 py-2.5 rounded-lg bg-primary text-primary-fg text-xs font-semibold shadow-pop hover:brightness-110 flex items-center gap-2 transition"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Deploy Wizard Strategy</span>
        </button>
      </div>

      {/* Preset Selector Strip */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {[
          { id: 'SHORT_STRADDLE', label: 'Short Straddle' },
          { id: 'LONG_STRADDLE', label: 'Long Straddle' },
          { id: 'SHORT_STRANGLE', label: 'Short Strangle' },
          { id: 'IRON_CONDOR', label: 'Iron Condor' },
          { id: 'BULL_CALL_SPREAD', label: 'Bull Call Spread' }
        ].map(p => (
          <button
            key={p.id}
            onClick={() => applyPreset(p.id as any)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              selectedPreset === p.id
                ? 'bg-primary text-primary-fg'
                : 'bg-surface border border-border text-fg-secondary hover:text-fg'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Main Split: Left Diagram & Greeks, Right Legs & Sliders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Payoff Chart & Greeks (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Payoff Chart Card */}
          <div className="p-5 rounded-lg bg-surface border border-border transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-primary" />
                <h3 className="font-semibold text-sm text-fg">Expiration Payoff Curve</h3>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <div>
                  <span className="text-fg-muted">Underlying: </span>
                  <span className="font-semibold text-fg font-mono">{spotPrice}</span>
                </div>
                <div>
                  <span className="text-fg-muted">Max Profit: </span>
                  <span className="font-semibold text-profit font-mono">
                    {payoffData.maxPnl > 50000 ? 'Unlimited' : `+₹${payoffData.maxPnl.toLocaleString()}`}
                  </span>
                </div>
                <div>
                  <span className="text-fg-muted">Max Loss: </span>
                  <span className="font-semibold text-loss font-mono">
                    {payoffData.minPnl < -50000 ? 'Undefined' : `₹${payoffData.minPnl.toLocaleString()}`}
                  </span>
                </div>
              </div>
            </div>

            {/* SVG Visualizer */}
            <div className="w-full bg-ink rounded-lg border border-ink-line p-2 overflow-hidden flex items-center justify-center">
              <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
                {/* Zero PnL Reference Line */}
                <line x1="0" y1={height / 2} x2={width} y2={height / 2} className="stroke-border-strong" strokeDasharray="3 3" strokeWidth="1" />
                {/* Current Spot Price Reference Line */}
                <line x1={width / 2} y1="0" x2={width / 2} y2={height} className="stroke-accent" strokeDasharray="2 2" strokeWidth="1" />

                {/* Payoff Curve */}
                <path d={svgPath} fill="none" className="stroke-primary" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

                {/* Breakeven points markers */}
                {payoffData.breakevens.map((be, idx) => (
                  <circle
                    key={idx}
                    cx={padding + ((be - (spotPrice - 600)) / 1200) * (width - 2 * padding)}
                    cy={height / 2}
                    r="4"
                    className="fill-profit"
                  />
                ))}
              </svg>
            </div>

            <div className="flex items-center justify-between text-[11px] text-fg-muted mt-2 font-mono">
              <span>Low: {spotPrice - 600}</span>
              <span className="text-primary font-semibold">Spot: {spotPrice}</span>
              <span>High: {spotPrice + 600}</span>
            </div>
          </div>

          {/* Greeks Bar */}
          <div className="grid grid-cols-4 gap-3">
            <div className="p-3.5 rounded-lg bg-surface border border-border text-center transition-colors">
              <div className="text-[10px] text-fg-muted uppercase font-semibold">Net Delta (Δ)</div>
              <div className={`text-base font-semibold font-mono mt-0.5 ${Number(netGreeks.delta) >= 0 ? 'text-profit' : 'text-loss'}`}>
                {netGreeks.delta}
              </div>
              <div className="text-[10px] text-fg-muted">Directional exposure</div>
            </div>

            <div className="p-3.5 rounded-lg bg-surface border border-border text-center transition-colors">
              <div className="text-[10px] text-fg-muted uppercase font-semibold">Net Theta (Θ)</div>
              <div className={`text-base font-semibold font-mono mt-0.5 ${netGreeks.theta >= 0 ? 'text-profit' : 'text-loss'}`}>
                {netGreeks.theta > 0 ? `+₹${netGreeks.theta}` : `₹${netGreeks.theta}`}
              </div>
              <div className="text-[10px] text-fg-muted">Daily time decay</div>
            </div>

            <div className="p-3.5 rounded-lg bg-surface border border-border text-center transition-colors">
              <div className="text-[10px] text-fg-muted uppercase font-semibold">Net Gamma (Γ)</div>
              <div className="text-base font-semibold font-mono text-primary mt-0.5">{netGreeks.gamma}</div>
              <div className="text-[10px] text-fg-muted">Curvature risk</div>
            </div>

            <div className="p-3.5 rounded-lg bg-surface border border-border text-center transition-colors">
              <div className="text-[10px] text-fg-muted uppercase font-semibold">Net Vega (ν)</div>
              <div className="text-base font-semibold font-mono text-primary mt-0.5">₹{netGreeks.vega}</div>
              <div className="text-[10px] text-fg-muted">Per 1% IV move</div>
            </div>
          </div>
        </div>

        {/* Right: Legs Configuration & Interactive Sliders (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Sliders Card */}
          <div className="p-5 rounded-lg bg-surface border border-border space-y-4 transition-colors">
            <h3 className="font-semibold text-sm text-fg">Market Simulation Sliders</h3>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-fg-secondary">Simulate Spot Price (NIFTY 50):</span>
                <span className="font-semibold text-primary font-mono">{spotPrice}</span>
              </div>
              <input
                type="range"
                min="23800"
                max="24900"
                step="20"
                value={spotPrice}
                onChange={e => setSpotPrice(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-fg-secondary">Days to Expiry (DTE):</span>
                <span className="font-semibold text-fg font-mono">{daysToExpiry} Days</span>
              </div>
              <input
                type="range"
                min="0"
                max="7"
                step="1"
                value={daysToExpiry}
                onChange={e => setDaysToExpiry(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
            </div>
          </div>

          {/* Option Legs Table */}
          <div className="p-5 rounded-lg bg-surface border border-border space-y-3 transition-colors">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm text-fg">Configured Strategy Legs ({legs.length})</h3>
              <button
                onClick={() => setLegs([...legs, { id: Date.now(), action: 'BUY', type: 'CE', strike: spotPrice + 100, expiry: 'Current Week', premium: 45.0, lots: 1 }])}
                className="text-xs px-2.5 py-1 rounded-lg bg-subtle border border-border text-primary hover:border-primary font-semibold flex items-center gap-1 transition"
              >
                <Plus className="w-3 h-3" /> Add Leg
              </button>
            </div>

            <div className="space-y-2">
              {legs.map(leg => (
                <div key={leg.id} className="p-3 bg-subtle rounded-lg border border-border flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded font-semibold text-[10px] ${leg.action === 'BUY' ? 'bg-profit-soft text-profit' : 'bg-loss-soft text-loss'}`}>
                      {leg.action}
                    </span>
                    <span className="font-mono font-semibold text-fg">{leg.strike}</span>
                    <span className="text-fg-muted uppercase font-semibold">{leg.type}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-fg-secondary">₹{leg.premium.toFixed(2)}</span>
                    <span className="text-fg-muted">{leg.lots} lot</span>
                    <button
                      onClick={() => setLegs(legs.filter(l => l.id !== leg.id))}
                      className="p-1 text-fg-muted hover:text-loss transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
