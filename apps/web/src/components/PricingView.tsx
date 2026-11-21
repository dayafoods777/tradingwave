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
      monthlyPrice: '₹5,000',
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
      description: 'For algo creators and quant teams running high-capacity automated strategies.',
      badge: 'Creators Choice',
      highlight: false,
      features: [
        '32 Live Trading Bots',
        'Institutional API & Webhook Dispatch',
        'Automated multi-account execution',
        'Advanced Risk & Margin Governor',
        'Dedicated Execution Node'
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
        <span className="tw-label">
          Transparent & Simple Pricing
        </span>
        <h2 className="text-3xl sm:text-4xl font-semibold text-fg">
          Start Free. <span className="text-fg-muted">Pay only when you go live.</span>
        </h2>
        <p className="text-sm text-fg-secondary leading-relaxed">
          Build unlimited strategies and run in Live Offline / Paper Trading for ₹0 — Free for Life. Pick a plan only when you are ready to deploy real capital into your own broker account.
        </p>

        {/* Billing Switch */}
        <div className="pt-4 flex items-center justify-center gap-3">
          <div className="bg-muted p-1 rounded-lg border border-border flex items-center gap-1 transition-colors">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
                billingCycle === 'monthly' ? 'bg-primary text-primary-fg' : 'text-fg-secondary hover:text-fg'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                billingCycle === 'yearly' ? 'bg-primary text-primary-fg' : 'text-fg-secondary hover:text-fg'
              }`}
            >
              <span>Yearly Billing</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-profit text-fg font-semibold uppercase">
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
            className={`p-6 rounded-lg border flex flex-col justify-between transition relative ${
              plan.highlight
                ? 'bg-primary-soft border-primary'
                : 'bg-surface border-border'
            }`}
          >
            {plan.badge && (
              <span className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-primary text-primary-fg text-[10px] font-semibold uppercase tracking-wider shadow">
                {plan.badge}
              </span>
            )}
            <div>
              <h3 className="font-semibold text-lg text-fg mb-1">{plan.name}</h3>
              <p className="text-xs text-fg-secondary min-h-[36px]">{plan.description}</p>

              <div className="my-5 pb-5 border-b border-border">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-semibold text-fg">
                    {billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice}
                  </span>
                  <span className="text-xs text-fg-muted font-medium">{plan.period}</span>
                </div>
                {billingCycle === 'yearly' && plan.name !== 'Free' && (
                  <span className="text-[11px] text-profit font-medium mt-1 block">
                    Billed annually with 16% discount
                  </span>
                )}
              </div>

              <div className="space-y-2.5 mb-6 text-xs text-fg-secondary">
                {plan.features.map(f => (
                  <div key={f} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              className={`w-full py-2.5 px-4 rounded-lg text-xs font-semibold transition ${
                plan.highlight
                  ? 'bg-primary text-primary-fg hover:opacity-90'
                  : 'bg-muted hover:bg-muted text-fg'
              }`}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>

      {/* Advanced & Creator Plans Strip */}
      <div className="p-6 rounded-lg bg-surface border border-border space-y-4 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg text-fg">Advanced & Creator Tiers</h3>
            <p className="text-xs text-fg-secondary">For high-volume traders, quant hedge funds, and private wealth desks</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.slice(4).map(plan => (
            <div key={plan.name} className="p-4 rounded-lg bg-subtle border border-border flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-base text-fg">{plan.name}</h4>
                  <span className="text-xs font-semibold text-primary">
                    {billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice}
                    <span className="text-fg-muted text-[10px] font-normal">{plan.period}</span>
                  </span>
                </div>
                <p className="text-xs text-fg-secondary mb-3">{plan.description}</p>
                <div className="space-y-1.5 mb-4 text-xs text-fg-secondary">
                  {plan.features.map(f => (
                    <div key={f} className="flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-primary shrink-0" />
                      <span className="line-clamp-1">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button className="w-full py-2 rounded-lg bg-muted hover:bg-border-strong text-xs font-semibold text-fg transition">
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
