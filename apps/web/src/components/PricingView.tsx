'use client';

import React, { useState, useEffect } from 'react';
import { Check, Zap, Sparkles, HelpCircle, CheckCircle2, ShieldCheck, X, CreditCard, ArrowRight, RotateCcw } from 'lucide-react';

export default function PricingView({
  onPlanSelected
}: {
  onPlanSelected?: (planName: string) => void;
}) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [currentPlan, setCurrentPlan] = useState<string>('Starter');
  const [checkoutModalPlan, setCheckoutModalPlan] = useState<any | null>(null);
  const [isActivating, setIsActivating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('tw_user_plan');
      if (saved) setCurrentPlan(saved);
    } catch (_) {}
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenCheckout = (plan: any) => {
    if (plan.name === currentPlan) {
      showToast(`You are already subscribed to the ${plan.name} plan.`);
      return;
    }
    setCheckoutModalPlan(plan);
  };

  const handleConfirmSubscription = () => {
    if (!checkoutModalPlan) return;
    setIsActivating(true);

    setTimeout(() => {
      setIsActivating(false);
      setCurrentPlan(checkoutModalPlan.name);
      try {
        localStorage.setItem('tw_user_plan', checkoutModalPlan.name);
      } catch (_) {}
      if (onPlanSelected) onPlanSelected(checkoutModalPlan.name);
      showToast(`🎉 Upgraded to ${checkoutModalPlan.name} plan successfully!`);
      setCheckoutModalPlan(null);
    }, 900);
  };

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
    <div className="space-y-8 font-sans pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-white dark:bg-[#1F2937] border-2 border-[#FF6B00] text-slate-900 dark:text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B00] animate-pulse"></span>
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Pricing Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B00]">
          Transparent &amp; Simple Pricing
        </span>
        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Start Free. <span className="text-[#FF6B00] animate-shimmer">Pay only when you go live.</span>
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
          Build unlimited strategies and run in Live Offline / Paper Trading for ₹0 — Free for Life. Pick a plan only when you are ready to deploy real capital into your own broker account.
        </p>

        {/* Current Active Plan Pill */}
        <div className="pt-2">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EEF2FF] dark:bg-[#1E1B4B] text-[#5B45E0] dark:text-[#818CF8] text-xs font-bold border border-indigo-200 dark:border-indigo-900">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Your Current Plan: <strong>{currentPlan}</strong></span>
          </span>
        </div>

        {/* Billing Switch */}
        <div className="pt-4 flex items-center justify-center gap-3">
          <div className="bg-slate-100 dark:bg-[#1F2937] p-1 rounded-xl border border-slate-200 dark:border-[#334155] flex items-center gap-1 transition-colors">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                billingCycle === 'monthly' ? 'bg-[#FF6B00] text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                billingCycle === 'yearly' ? 'bg-[#FF6B00] text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>Yearly Billing</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950 font-bold uppercase">
                Save 16%
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {plans.slice(0, 4).map(plan => {
          const isCurrent = plan.name === currentPlan;
          return (
            <div
              key={plan.name}
              className={`p-6 rounded-2xl border flex flex-col justify-between transition relative card-institutional ${
                isCurrent
                  ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-500 shadow-md'
                  : plan.highlight
                  ? 'bg-orange-50/50 dark:bg-[#15233E] border-[#FF6B00] shadow-md dark:shadow-xl shadow-orange-500/10'
                  : 'bg-white dark:bg-[#1F2937] border-slate-200 dark:border-[#334155] shadow-sm dark:shadow-md'
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-[#FF6B00] text-white text-[10px] font-bold uppercase tracking-wider shadow">
                  {plan.badge}
                </span>
              )}

              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">{plan.name}</h3>
                  {isCurrent && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                      ACTIVE
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 min-h-[36px]">{plan.description}</p>

                <div className="my-5 pb-5 border-b border-slate-200 dark:border-[#334155]">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">
                      {billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{plan.period}</span>
                  </div>
                  {billingCycle === 'yearly' && plan.name !== 'Free' && (
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1 block">
                      Billed annually with 16% discount
                    </span>
                  )}
                </div>

                <div className="space-y-2.5 mb-6 text-xs text-slate-700 dark:text-slate-300">
                  {plan.features.map(f => (
                    <div key={f} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#FF6B00] shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleOpenCheckout(plan)}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  isCurrent
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : plan.highlight
                    ? 'bg-gradient-to-r from-[#FF6B00] to-[#FF8A3D] text-white shadow-md shadow-orange-500/20 hover:brightness-110'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white'
                }`}
              >
                {isCurrent ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Current Active Plan</span>
                  </>
                ) : (
                  <span>{plan.cta}</span>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Advanced & Creator Plans Strip */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#1F2937] border border-slate-200 dark:border-[#334155] shadow-sm dark:shadow-md space-y-4 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Advanced &amp; Creator Tiers</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">For high-volume traders, quant hedge funds, and private wealth desks</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.slice(4).map(plan => {
            const isCurrent = plan.name === currentPlan;
            return (
              <div key={plan.name} className={`p-5 rounded-xl border flex flex-col justify-between ${
                isCurrent
                  ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-500'
                  : 'bg-slate-50 dark:bg-[#0B1220] border-slate-200 dark:border-[#334155]'
              }`}>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-base text-slate-900 dark:text-white">{plan.name}</h4>
                    <span className="text-xs font-bold text-[#FF6B00] font-mono">
                      {billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice}
                      <span className="text-slate-500 dark:text-slate-400 text-[10px] font-normal">{plan.period}</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">{plan.description}</p>
                  <div className="space-y-1.5 mb-4 text-xs text-slate-700 dark:text-slate-300">
                    {plan.features.map(f => (
                      <div key={f} className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-[#FF6B00] shrink-0" />
                        <span className="line-clamp-1">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => handleOpenCheckout(plan)}
                  className={`w-full py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                    isCurrent
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white'
                  }`}
                >
                  {isCurrent ? 'Current Plan' : plan.cta}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Checkout Modal */}
      {checkoutModalPlan && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1F2937] border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#5B45E0]" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Confirm Subscription Tier
                </h3>
              </div>
              <button onClick={() => setCheckoutModalPlan(null)} className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex justify-between items-center text-sm font-bold">
                  <span className="text-slate-900 dark:text-white">{checkoutModalPlan.name} Plan</span>
                  <span className="text-[#FF6B00] font-mono">
                    {billingCycle === 'yearly' ? checkoutModalPlan.yearlyPrice : checkoutModalPlan.monthlyPrice} {checkoutModalPlan.period}
                  </span>
                </div>
                <p className="text-slate-500 text-[11px]">{checkoutModalPlan.description}</p>
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold pt-1">
                  ✓ Instant activation · Unlimited paper trading · 38 Indian &amp; Global brokers
                </div>
              </div>

              <div className="space-y-1.5 text-slate-600 dark:text-slate-300">
                <div className="flex justify-between">
                  <span>Billing Frequency:</span>
                  <strong className="capitalize">{billingCycle} (with 16% discount)</strong>
                </div>
                <div className="flex justify-between">
                  <span>Included Wallet Credits:</span>
                  <strong className="text-emerald-600">₹500 for backtests</strong>
                </div>
                <div className="flex justify-between">
                  <span>Safety Guard:</span>
                  <strong>SEBI &amp; Broker API Sandboxed</strong>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  onClick={() => setCheckoutModalPlan(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmSubscription}
                  disabled={isActivating}
                  className="px-5 py-2 rounded-xl bg-[#5B45E0] hover:bg-[#4935C7] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-500/20 disabled:opacity-50 cursor-pointer"
                >
                  {isActivating ? <RotateCcw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>{isActivating ? 'Activating...' : `Activate ${checkoutModalPlan.name}`}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
