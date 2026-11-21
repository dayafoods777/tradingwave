'use client';

import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import DashboardView, { BotDeployment } from '../components/DashboardView';
import MyStrategiesView, { StrategyItem, TRADETRON_STRATEGIES } from '../components/MyStrategiesView';
import ReadyStrategiesView from '../components/ReadyStrategiesView';
import StrategyBuilderView from '../components/StrategyBuilderView';
import UsingAIView from '../components/UsingAIView';
import OptionWizardView from '../components/OptionWizardView';
import OptionChainView from '../components/OptionChainView';
import BrokersView, { ALL_BROKERS_BASE } from '../components/BrokersView';
import BacktestView from '../components/BacktestView';
import PricingView from '../components/PricingView';
import AdminPanelView from '../components/AdminPanelView';
import PineScriptBridgeView from '../components/PineScriptBridgeView';
import KeywordModal from '../components/KeywordModal';
import ExecutionLogModal from '../components/ExecutionLogModal';
import BrokerModal from '../components/BrokerModal';

export default function TradingWaveApp() {
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'mystrategies' | 'readystrategies' | 'builder' | 'usingai' | 'wizard' | 'optionchain' | 'brokers' | 'backtest' | 'pricing' | 'admin' | 'pinebridge'
  >('dashboard');

  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [market, setMarket] = useState<'IND' | 'USA'>('IND');
  const [isKillSwitchTriggered, setIsKillSwitchTriggered] = useState(false);

  // Modals state
  const [keywordModalOpen, setKeywordModalOpen] = useState(false);
  const [keywordCallback, setKeywordCallback] = useState<((expr: string) => void) | null>(null);
  const [logModalBot, setLogModalBot] = useState<string | null>(null);
  const [brokerModalName, setBrokerModalName] = useState<string | null>(null);

  // Connected Brokers state with localStorage persistence
  const [connectedBrokers, setConnectedBrokers] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('twave_connected_brokers');
        if (saved) return JSON.parse(saved);
      } catch (_) {}
    }
    return ['Zerodha Kite', 'Dhan'];
  });

  // Global Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Deployed Bots State with localStorage persistence
  const [deployedBots, setDeployedBots] = useState<BotDeployment[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('twave_deployed_bots');
        if (saved) return JSON.parse(saved);
      } catch (_) {}
    }
    return [
      {
        id: 'bot_init_1',
        name: 'NIFTY 9:20 Intraday Short Straddle v2.0',
        underlying: 'NIFTY 50',
        status: 'ACTIVE',
        mode: 'PAPER',
        broker: 'TT Paper Trading',
        multiplier: 1,
        dailyPnl: -14200,
        pnlPercent: -1.42,
        capital: 1000000,
        legs: ['SELL 1x NIFTY 24350 CE', 'SELL 1x NIFTY 24350 PE'],
        lastCheck: '1 sec ago',
        frequency: 'Continuous',
        sid: '98412034',
        author: 'algobulls',
        statusLabel: 'Live-Entered',
        openPositionsCount: 2,
        totalPositionsCount: 4,
        runCount: 5
      }
    ];
  });

  // Strategies State with localStorage persistence
  const [strategies, setStrategies] = useState<StrategyItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('twave_my_strategies');
        if (saved) return JSON.parse(saved);
      } catch (_) {}
    }
    return TRADETRON_STRATEGIES;
  });

  const [editingStrategyName, setEditingStrategyName] = useState<string>('');

  const handleSaveStrategy = (strategyData: Partial<StrategyItem>) => {
    const finalName = strategyData.name || 'Custom Strategy';
    const newStrategy: StrategyItem = {
      id: 'strat_' + Date.now(),
      name: finalName,
      author: 'algobulls',
      createdAgo: 'Just now',
      liveDeploys: 0,
      segment: (strategyData.segment as any) || 'NFO',
      minCapitalDisplay: strategyData.minCapitalDisplay || '₹ 1,00,000',
      minCapitalRaw: strategyData.minCapitalRaw || 100000,
      type: 'ASB',
      visibility: 'PRIVATE',
      description: strategyData.description || 'Custom multi-leg algorithmic strategy.',
      ...strategyData
    };

    setStrategies(prev => {
      const existingIdx = prev.findIndex(s => s.name === finalName);
      let updated: StrategyItem[];
      if (existingIdx >= 0) {
        updated = [...prev];
        updated[existingIdx] = { ...updated[existingIdx], ...newStrategy };
      } else {
        updated = [newStrategy, ...prev];
      }
      try {
        localStorage.setItem('twave_my_strategies', JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });

    showToast(`Strategy "${finalName}" created & saved to My Strategies!`);
    setActiveTab('mystrategies');
  };

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
    setDeployedBots(prev => {
      const updated: BotDeployment[] = prev.map(b =>
        b.id === id ? { ...b, status: b.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE' } : b
      );
      try {
        localStorage.setItem('twave_deployed_bots', JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });
  };

  const handleSquareOffBot = (id: string) => {
    const bot = deployedBots.find(b => b.id === id);
    if (confirm(`Confirm immediate square-off for ${bot?.name}? All open broker positions will be closed at market price.`)) {
      setDeployedBots(prev => {
        const updated: BotDeployment[] = prev.map(b => (b.id === id ? { ...b, status: 'SQUARED_OFF' } : b));
        try {
          localStorage.setItem('twave_deployed_bots', JSON.stringify(updated));
        } catch (_) {}
        return updated;
      });
      showToast(`Position squared off successfully for ${bot?.name}.`);
    }
  };

  const handleUniversalKillSwitch = () => {
    if (confirm('🚨 EMERGENCY WARNING: Activate Universal Kill Switch? This will cancel all open orders and square off all live positions across all connected brokers immediately.')) {
      setIsKillSwitchTriggered(true);
      setDeployedBots(prev => {
        const updated: BotDeployment[] = prev.map(b => ({ ...b, status: 'SQUARED_OFF' }));
        try {
          localStorage.setItem('twave_deployed_bots', JSON.stringify(updated));
        } catch (_) {}
        return updated;
      });
      showToast('UNIVERSAL KILL SWITCH EXECUTED: All bot positions squared off.');
    }
  };

  const handleDeployNew = (strategyName: string, deployConfig?: any) => {
    const execType = deployConfig?.executionType || 'Paper Trading';
    const mode =
      execType === 'Live Auto' || execType === 'Live Auto One Click'
        ? 'LIVE_AUTO'
        : execType === 'Live Offline'
        ? 'LIVE_OFFLINE'
        : 'PAPER';

    const broker =
      deployConfig?.broker && deployConfig.broker !== 'Select broker'
        ? deployConfig.broker
        : mode === 'PAPER'
        ? 'TT Paper Trading'
        : connectedBrokers.length > 0
        ? connectedBrokers[0]
        : 'TT Paper Trading';

    const multNum = deployConfig?.multiplier ? parseFloat(deployConfig.multiplier) || 1 : 1;
    const capNum = deployConfig?.capitalRecommended
      ? parseInt(deployConfig.capitalRecommended.replace(/[^0-9]/g, '')) || 100000
      : 100000;

    const newBot: BotDeployment = {
      id: `bot_${Date.now()}`,
      name: strategyName,
      underlying: strategyName.includes('BANKNIFTY')
        ? 'BANKNIFTY'
        : strategyName.includes('BTC')
        ? 'BTCUSD'
        : strategyName.includes('CRUDE')
        ? 'CRUDEOIL'
        : 'NIFTY 50',
      status: 'ACTIVE',
      mode,
      broker,
      multiplier: multNum,
      dailyPnl: 0,
      capital: capNum,
      legs: ['SELL 1x ATM CE', 'SELL 1x ATM PE'],
      lastCheck: 'Just now',
      frequency: 'Continuous',
      sid: String(Math.floor(10000000 + Math.random() * 90000000)),
      author: 'algobulls',
      statusLabel: 'Live-Entered',
      openPositionsCount: 0,
      totalPositionsCount: 1,
      runCount: deployConfig?.stopLooping ? parseInt(deployConfig.stopLooping) || 5 : 5
    };
    setDeployedBots(prev => {
      const updated = [newBot, ...prev];
      try {
        localStorage.setItem('twave_deployed_bots', JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });
    setActiveTab('dashboard');
    showToast(`Deployed "${strategyName}" in ${execType} mode successfully!`);
  };

  const handleAddLegFromChain = (strike: number, type: 'CALL' | 'PUT', action: 'BUY' | 'SELL') => {
    showToast(`Added ${action} ${strike} ${type} leg to Strategy Builder!`);
    setActiveTab('builder');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-[#FF6B00] selection:text-white transition-colors duration-200">
      {/* 1. Tradetron Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onKillSwitch={handleUniversalKillSwitch}
        isKillSwitchTriggered={isKillSwitchTriggered}
        theme={theme}
        toggleTheme={toggleTheme}
        market={market}
        onMarketChange={setMarket}
      />

      {/* 2. Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-white dark:bg-[#1F2937] border border-slate-300 dark:border-[#FF6B00] text-slate-900 dark:text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200 transition-colors">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B00] animate-pulse"></span>
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* 3. Main Workspace Content Area */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
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
            strategies={strategies}
            setStrategies={setStrategies}
            onCreateNew={() => {
              setEditingStrategyName('');
              setActiveTab('builder');
            }}
            onEditStrategy={name => {
              setEditingStrategyName(name);
              setActiveTab('builder');
            }}
            onDeployStrategy={(name, config) => handleDeployNew(name, config)}
            onBacktestStrategy={_name => setActiveTab('backtest')}
            onNavigateTab={tab => setActiveTab(tab as any)}
          />
        )}

        {activeTab === 'readystrategies' && (
          <ReadyStrategiesView
            onDeploy={(name, config) => handleDeployNew(name, config)}
            onEdit={_name => setActiveTab('builder')}
            onBacktest={_name => setActiveTab('backtest')}
            onNavigateTab={tab => setActiveTab(tab as any)}
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
            onSaveStrategy={handleSaveStrategy}
            onNavigateTab={tab => setActiveTab(tab as any)}
            initialStrategyName={editingStrategyName}
          />
        )}

        {activeTab === 'usingai' && (
          <UsingAIView
            onSaveStrategy={handleSaveStrategy}
            onNavigateTab={tab => setActiveTab(tab as any)}
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

        {activeTab === 'pinebridge' && (
          <PineScriptBridgeView
            onLoadStrategyToBuilder={handleSaveStrategy}
          />
        )}

        {activeTab === 'admin' && (
          <AdminPanelView />
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
          setConnectedBrokers(prev => {
            const updated = prev.includes(name) ? prev : [...prev, name];
            try {
              localStorage.setItem('twave_connected_brokers', JSON.stringify(updated));
            } catch (_) {}
            return updated;
          });
          showToast(`Successfully connected and authenticated ${name} API!`);
        }}
      />

      {/* 5. Tradetron-Style Clean Footer */}
      <footer className="border-t border-slate-200 dark:border-[#334155] bg-slate-100 dark:bg-[#0B1220] text-slate-600 dark:text-slate-400 text-xs py-8 px-6 mt-12 transition-colors">
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

          <div className="flex items-center gap-5 text-slate-600 dark:text-slate-400 flex-wrap">
            <button onClick={() => setActiveTab('pricing')} className="hover:text-slate-900 dark:hover:text-white transition">Pricing</button>
            <button onClick={() => setActiveTab('brokers')} className="hover:text-slate-900 dark:hover:text-white transition">{ALL_BROKERS_BASE.length} Brokers</button>
            <button onClick={() => setActiveTab('pinebridge')} className="hover:text-slate-900 dark:hover:text-white transition">Pine Script Bridge</button>
            <button onClick={() => setActiveTab('admin')} className="hover:text-slate-900 dark:hover:text-white transition text-[#5B45E0] dark:text-[#818CF8] font-semibold">Admin Panel</button>
            <button onClick={() => setActiveTab('backtest')} className="hover:text-slate-900 dark:hover:text-white transition">Backtest Studio</button>
            <span className="text-slate-300 dark:text-slate-600 hidden sm:inline">|</span>
            <span className="hidden sm:inline">Zero-Eval DSL</span>
            <span className="hidden sm:inline">SEBI & FinTech Compliant</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
