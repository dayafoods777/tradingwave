'use client';

import React, { useState } from 'react';
import { Check, Zap, Sparkles, HelpCircle } from 'lucide-react';

export default function PricingView() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  const plans = [
    {
      name: 'Free',
      monthlyPrice: '₹0',
      yearlyPrice: '₹0',
      period: 'forever',
      description: 'Ideal for learning and testing strategies in Live Offline / Paper Trading.',
      badge: 'Free for Life',
      highlight: false,
      features: [
        'Unlimited Strategies creation',
        '1 Paper Trading Bot',
        '1-minute continuous check',
        'Community Forum & Helpdesk',
        'Standard execution queue'
      ],
      cta: 'Start Free →'
    },
    {
      name: 'Starter',
      monthlyPrice: '₹300',
      yearlyPrice: '₹250',
      period: '/month',
      description: 'Perfect for retail traders taking their first automated strategy live with real capital.',
      badge: 'Most Popular',
      highlight: true,
      features: [
        '1 Live Trading Bot (Real Capital)',
        'Unlimited Paper Trading Bots',
        '1-minute continuous check',
        'WhatsApp & Telegram notifications',
        'Standard broker adapter priority'
      ],
      cta: 'Choose Starter'
    },
    {
      name: 'Standard',
      monthlyPrice: '₹1,200',
      yearlyPrice: '₹1,000',
      period: '/month',
      description: 'Designed for active traders running multiple non-correlated strategies.',
      badge: 'Value',
      highlight: false,
      features: [
        '4 Live Trading Bots',
        'Continuous execution (sub-second)',
        'Multi-broker parallel execution',
        'Priority email & ticket support',
        'Advanced Options Wizard & Greeks'
      ],
      cta: 'Choose Standard'
    },
    {
      name: 'Retail',
      monthlyPrice: '₹2,500',
      yearlyPrice: '₹2,100',
      period: '/month',
      description: 'For full-time quantitative traders managing diverse intraday & positional books.',
      badge: null,
      highlight: false,
      features: [
        '8 Live Trading Bots',
        'Continuous execution (sub-second)',
        'TradingView PineBridge Webhooks',
        'Custom condition alerts',
        'Priority execution lane'
      ],
      cta: 'Choose Retail'
    },
    {
      name: 'Retail+',
      monthlyPrice: '₹5,00,0',
      yearlyPrice: '₹4,200',
      period: '/month',
      description: 'High-frequency and large-margin portfolios demanding zero throttling.',
      badge: null,
      highlight: false,
      features: [
        '16 Live Trading Bots',
        'Ultra-low latency dedicated worker',
        'Direct phone & desk support',
        'Custom slippage modeling',
        'Full historical backtest credits'
      ],
      cta: 'Choose Retail+'
    },
    {
      name: 'Creator',
      monthlyPrice: '₹10,000',
      yearlyPrice: '₹8,300',
      period: '/month',
      description: 'For algo creators and quant influencers publishing strategies on Marketplace.',
      badge: 'Creators Choice',
      highlight: false,
      features: [
        '32 Live Trading Bots',
        'Publish on TradingWave Marketplace',
        'Automated subscriber billing',
        'Creator revenue share (85%)',
        'Public performance verification badge'
      ],
      cta: 'Choose Creator'
    },
    {
      name: 'Creator+',
      monthlyPrice: '₹25,000',
      yearlyPrice: '₹20,800',
      period: '/month',
      description: 'For hedge funds, registered RIAs, and professional quantitative trading firms.',
      badge: 'Enterprise',
      highlight: false,
      features: [
        'Unlimited Live Trading Bots',
        'White-label portal with custom domain',
        'Dedicated quantitative engineer',
        'Private broker API gateways',
        'Custom OMS & EMS routing'
      ],
      cta: 'Contact Enterprise'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Pricing Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#FF6600]">
          Transparent & Simple Pricing
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-white">
          Start Free. <span className="text-[#FF6600]">Pay only when you go live.</span>
        </h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          Build unlimited strategies and run in Live Offline / Paper Trading for ₹0 — Free for Life. Pick a plan only when you are ready to deploy real capital into your own broker account.
        </p>

        {/* Billing Switch */}
        <div className="pt-4 flex items-center justify-center gap-3">
          <div className="bg-[#131B2E] p-1 rounded-xl border border-[#1E293B] flex items-center gap-1">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
                billingCycle === 'monthly' ? 'bg-[#FF6600] text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                billingCycle === 'yearly' ? 'bg-[#FF6600] text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Yearly Billing</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500 text-slate-950 font-bold uppercase">
                Save 16%
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {plans.slice(0, 4).map(plan => (
          <div
            key={plan.name}
            className={`p-6 rounded-2xl border flex flex-col justify-between transition relative ${
              plan.highlight
                ? 'bg-[#15233E] border-[#FF6600] shadow-xl shadow-orange-500/10'
                : 'bg-[#131B2E] border-[#1E293B]'
            }`}
          >
            {plan.badge && (
              <span className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-[#FF6600] text-white text-[10px] font-bold uppercase tracking-wider shadow">
                {plan.badge}
              </span>
            )}
            <div>
              <h3 className="font-bold text-lg text-white mb-1">{plan.name}</h3>
              <p className="text-xs text-slate-400 min-h-[36px]">{plan.description}</p>

              <div className="my-5 pb-5 border-b border-[#1E293B]">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white">
                    {billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{plan.period}</span>
                </div>
                {billingCycle === 'yearly' && plan.name !== 'Free' && (
                  <span className="text-[11px] text-emerald-400 font-medium mt-1 block">
                    Billed annually with 16% discount
                  </span>
                )}
              </div>

              <div className="space-y-2.5 mb-6 text-xs text-slate-300">
                {plan.features.map(f => (
                  <div key={f} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-[#FF6600] shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition ${
                plan.highlight
                  ? 'bg-gradient-to-r from-[#FF6600] to-[#E65C00] text-white shadow-md shadow-orange-500/20 hover:brightness-110'
                  : 'bg-slate-800 hover:bg-slate-700 text-white'
              }`}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>

      {/* Advanced & Creator Plans Strip */}
      <div className="p-6 rounded-2xl bg-[#131B2E] border border-[#1E293B] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg text-white">Advanced & Creator Tiers</h3>
            <p className="text-xs text-slate-400">For high-volume traders, quant hedge funds, and marketplace creators</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.slice(4).map(plan => (
            <div key={plan.name} className="p-4 rounded-xl bg-[#0E1526] border border-[#1E293B] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-base text-white">{plan.name}</h4>
                  <span className="text-xs font-bold text-[#FF6600]">
                    {billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice}
                    <span className="text-slate-400 text-[10px] font-normal">{plan.period}</span>
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-3">{plan.description}</p>
                <div className="space-y-1.5 mb-4 text-xs text-slate-300">
                  {plan.features.map(f => (
                    <div key={f} className="flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-[#FF6600] shrink-0" />
                      <span className="line-clamp-1">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition">
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
