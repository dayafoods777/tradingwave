'use client';

import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import DashboardView, { BotDeployment } from '../components/DashboardView';
import MyStrategiesView from '../components/MyStrategiesView';
import StrategyBuilderView from '../components/StrategyBuilderView';
import OptionWizardView from '../components/OptionWizardView';
import OptionChainView from '../components/OptionChainView';
import BrokersView from '../components/BrokersView';
import BacktestView from '../components/BacktestView';
import PricingView from '../components/PricingView';
import KeywordModal from '../components/KeywordModal';
import ExecutionLogModal from '../components/ExecutionLogModal';
import BrokerModal from '../components/BrokerModal';

export default function TradingWaveApp() {
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'mystrategies' | 'builder' | 'wizard' | 'optionchain' | 'brokers' | 'backtest' | 'pricing'
  >('dashboard');

  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [isKillSwitchTriggered, setIsKillSwitchTriggered] = useState(false);

  // Modals state
  const [keywordModalOpen, setKeywordModalOpen] = useState(false);
  const [keywordCallback, setKeywordCallback] = useState<((expr: string) => void) | null>(null);
  const [logModalBot, setLogModalBot] = useState<string | null>(null);
  const [brokerModalName, setBrokerModalName] = useState<string | null>(null);

  // Connected Brokers state (starts empty, user connects via BrokerModal)
  const [connectedBrokers, setConnectedBrokers] = useState<string[]>([]);

  // Global Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Deployed Bots State - Starts empty with 0 fake/dummy bots
  const [deployedBots, setDeployedBots] = useState<BotDeployment[]>([]);

  // Theme synchronization (Default: Light Mode)
  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('tw_theme', nextTheme);
      }
    } catch (_) {}
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  useEffect(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('tw_theme') : null;
      if (saved === 'dark') {
        setTheme('dark');
        document.documentElement.classList.add('dark');
      } else {
        setTheme('light');
        document.documentElement.classList.remove('dark');
      }
    } catch (_) {}
  }, []);

  // Bot actions
  const handleToggleBot = (id: string) => {
    setDeployedBots(prev =>
      prev.map(b => (b.id === id ? { ...b, status: b.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE' } : b))
    );
  };

  const handleSquareOffBot = (id: string) => {
    const bot = deployedBots.find(b => b.id === id);
    if (confirm(`Confirm immediate square-off for ${bot?.name}? All open broker positions will be closed at market price.`)) {
      setDeployedBots(prev =>
        prev.map(b => (b.id === id ? { ...b, status: 'SQUARED_OFF' } : b))
      );
      showToast(`Position squared off successfully for ${bot?.name}.`);
    }
  };

  const handleUniversalKillSwitch = () => {
    if (confirm('🚨 EMERGENCY WARNING: Activate Universal Kill Switch? This will cancel all open orders and square off all live positions across all connected brokers immediately.')) {
      setIsKillSwitchTriggered(true);
      setDeployedBots(prev => prev.map(b => ({ ...b, status: 'SQUARED_OFF' })));
      showToast('UNIVERSAL KILL SWITCH EXECUTED: All bot positions squared off.');
    }
  };

  const handleDeployNew = (strategyName: string) => {
    const newBot: BotDeployment = {
      id: `bot_${Date.now()}`,
      name: strategyName,
      underlying: strategyName.includes('BANKNIFTY') ? 'BANKNIFTY' : 'NIFTY 50',
      status: 'ACTIVE',
      mode: 'PAPER',
      broker: connectedBrokers.length > 0 ? connectedBrokers[0] : 'Paper Sandbox',
      multiplier: 1,
      dailyPnl: 0,
      capital: 100000,
      legs: ['SELL 1x ATM CE', 'SELL 1x ATM PE'],
      lastCheck: 'Just now',
      frequency: 'Continuous'
    };
    setDeployedBots(prev => [newBot, ...prev]);
    setActiveTab('dashboard');
    showToast(`Deployed "${strategyName}" to Paper Trading successfully!`);
  };

  const handleAddLegFromChain = (strike: number, type: 'CALL' | 'PUT', action: 'BUY' | 'SELL') => {
    showToast(`Added ${action} ${strike} ${type} leg to Strategy Builder!`);
    setActiveTab('builder');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-[#FF6600] selection:text-white transition-colors duration-200">
      {/* 1. Tradetron Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onKillSwitch={handleUniversalKillSwitch}
        isKillSwitchTriggered={isKillSwitchTriggered}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* 2. Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-white dark:bg-[#131B2E] border border-slate-300 dark:border-[#FF6600] text-slate-900 dark:text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200 transition-colors">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF6600] animate-pulse"></span>
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* 3. Main Workspace Content Area */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            bots={deployedBots}
            connectedBrokersCount={connectedBrokers.length}
            onToggleBot={handleToggleBot}
            onSquareOffBot={handleSquareOffBot}
            onOpenLogs={botName => setLogModalBot(botName)}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'mystrategies' && (
          <MyStrategiesView
            onCreateNew={() => setActiveTab('builder')}
            onEditStrategy={_name => setActiveTab('builder')}
            onDeployStrategy={name => handleDeployNew(name)}
            onBacktestStrategy={_name => setActiveTab('backtest')}
            onNavigateTab={tab => setActiveTab(tab)}
          />
        )}

        {activeTab === 'builder' && (
          <StrategyBuilderView
            onOpenKeywordModal={cb => {
              setKeywordCallback(() => cb);
              setKeywordModalOpen(true);
            }}
            onDeploy={handleDeployNew}
            onBacktest={() => setActiveTab('backtest')}
          />
        )}

        {activeTab === 'wizard' && (
          <OptionWizardView onDeployToLive={handleDeployNew} />
        )}

        {activeTab === 'optionchain' && (
          <OptionChainView onAddLeg={handleAddLegFromChain} />
        )}

        {activeTab === 'brokers' && (
          <BrokersView
            connectedBrokers={connectedBrokers}
            onConfigure={brokerName => setBrokerModalName(brokerName)}
          />
        )}

        {activeTab === 'backtest' && (
          <BacktestView />
        )}

        {activeTab === 'pricing' && (
          <PricingView />
        )}
      </main>

      {/* 4. Global Modals */}
      <KeywordModal
        isOpen={keywordModalOpen}
        onClose={() => setKeywordModalOpen(false)}
        onSelect={expr => {
          if (keywordCallback) keywordCallback(expr);
        }}
      />

      <ExecutionLogModal
        isOpen={!!logModalBot}
        botName={logModalBot || ''}
        onClose={() => setLogModalBot(null)}
      />

      <BrokerModal
        isOpen={!!brokerModalName}
        brokerName={brokerModalName || ''}
        onClose={() => setBrokerModalName(null)}
        onConnected={name => {
          setConnectedBrokers(prev => (prev.includes(name) ? prev : [...prev, name]));
          showToast(`Successfully connected and authenticated ${name} API!`);
        }}
      />

      {/* 5. Tradetron-Style Clean Footer */}
      <footer className="border-t border-slate-200 dark:border-[#1E293B] bg-slate-100 dark:bg-[#0E1526] text-slate-600 dark:text-slate-400 text-xs py-8 px-6 mt-12 transition-colors">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/logo-dark.png"
              alt="TradingWave — Trade Bindas"
              className="h-7 w-auto object-contain hidden dark:block"
            />
            <img
              src="/logo-light.png"
              alt="TradingWave — Trade Bindas"
              className="h-7 w-auto object-contain block dark:hidden"
            />
            <span className="text-[10px] text-slate-500 ml-1 font-mono hidden md:inline">
              High-Performance Algo SaaS
            </span>
          </div>

          <div className="flex items-center gap-6 text-slate-600 dark:text-slate-400">
            <button onClick={() => setActiveTab('pricing')} className="hover:text-slate-900 dark:hover:text-white transition">Pricing</button>
            <button onClick={() => setActiveTab('brokers')} className="hover:text-slate-900 dark:hover:text-white transition">38+ Brokers</button>
            <button onClick={() => setActiveTab('backtest')} className="hover:text-slate-900 dark:hover:text-white transition">Backtest Studio</button>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <span>Zero-Eval DSL</span>
            <span>SEBI & FinTech Compliant</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
