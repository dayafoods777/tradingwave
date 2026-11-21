'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/shell/Sidebar';
import TopBar from '../../components/shell/TopBar';
import { useTheme } from '../../lib/theme';
import type { AppTab } from '../../lib/nav';
import { Check, X } from 'lucide-react';
import DashboardView, { BotDeployment } from '../../components/DashboardView';
import MyStrategiesView, { StrategyItem, TRADETRON_STRATEGIES } from '../../components/MyStrategiesView';
import ReadyStrategiesView from '../../components/ReadyStrategiesView';
import StrategyBuilderView from '../../components/StrategyBuilderView';
import UsingAIView from '../../components/UsingAIView';
import OptionWizardView from '../../components/OptionWizardView';
import OptionChainView from '../../components/OptionChainView';
import BrokersView, { ALL_BROKERS_BASE } from '../../components/BrokersView';
import BacktestView from '../../components/BacktestView';
import PricingView from '../../components/PricingView';
import KeywordModal from '../../components/KeywordModal';
import ExecutionLogModal from '../../components/ExecutionLogModal';
import BrokerModal from '../../components/BrokerModal';

export default function TradingWaveApp() {
  const [activeTab, setActiveTabState] = useState<AppTab>('dashboard');
  const setActiveTab = (tab: AppTab) => {
    setActiveTabState(tab);
    try {
      window.history.replaceState(null, '', `#${tab}`);
      document.getElementById('tw-main')?.scrollTo({ top: 0 });
      window.scrollTo({ top: 0 });
    } catch (_) {}
  };
  const { theme, toggleTheme } = useTheme();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
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

    showToast(`Saved “${finalName}” to My strategies`);
    setActiveTab('mystrategies');
  };

  // Deep link (#builder) + persisted sidebar state
  useEffect(() => {
    const h = window.location.hash.replace('#', '') as AppTab;
    const valid: AppTab[] = ['dashboard', 'mystrategies', 'readystrategies', 'builder', 'usingai', 'wizard', 'optionchain', 'brokers', 'backtest', 'pricing'];
    if (valid.includes(h)) setActiveTabState(h);
    try {
      setSidebarCollapsed(localStorage.getItem('tw_sidebar') === 'collapsed');
    } catch (_) {}
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(c => {
      try {
        localStorage.setItem('tw_sidebar', c ? 'expanded' : 'collapsed');
      } catch (_) {}
      return !c;
    });
  };

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
    if (confirm('Activate the kill switch? This will cancel all open orders and square off all live positions across all connected brokers immediately.')) {
      setIsKillSwitchTriggered(true);
      setDeployedBots(prev => prev.map(b => ({ ...b, status: 'SQUARED_OFF' })));
      showToast('Kill switch executed. All positions squared off.');
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
    setDeployedBots(prev => [newBot, ...prev]);
    setActiveTab('dashboard');
    showToast(`Deployed “${strategyName}” · ${execType}`);
  };

  const handleAddLegFromChain = (strike: number, type: 'CALL' | 'PUT', action: 'BUY' | 'SELL') => {
    showToast(`Added ${action} ${strike} ${type === 'CALL' ? 'CE' : 'PE'} to the builder`);
    setActiveTab('builder');
  };

  const liveBots = deployedBots.filter(b => b.status === 'ACTIVE').length;

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar
        active={activeTab}
        onSelect={setActiveTab}
        collapsed={sidebarCollapsed}
        onToggleCollapsed={toggleSidebar}
        mobileOpen={mobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
        connectedBrokers={connectedBrokers.length}
        liveBots={liveBots}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar
          active={activeTab}
          onSelect={setActiveTab}
          onOpenMobileNav={() => setMobileNavOpen(true)}
          onKillSwitch={handleUniversalKillSwitch}
          isKillSwitchTriggered={isKillSwitchTriggered}
          theme={theme}
          toggleTheme={toggleTheme}
        />

        {isKillSwitchTriggered && (
          <div className="flex items-center gap-2 border-b border-loss/20 bg-loss-soft px-4 py-2 text-[12px] text-loss">
            <span className="h-1.5 w-1.5 rounded-full bg-loss" />
            Kill switch is active. New orders are blocked and every deployment has been squared off.
          </div>
        )}

        <main id="tw-main" key={activeTab} className="mx-auto w-full max-w-[1440px] flex-1 animate-fade-up px-3 py-4 sm:px-6 sm:py-6">
          {activeTab === 'dashboard' && (
            <DashboardView
              bots={deployedBots}
              connectedBrokersCount={connectedBrokers.length}
              onToggleBot={handleToggleBot}
              onSquareOffBot={handleSquareOffBot}
              onOpenLogs={botName => setLogModalBot(botName)}
              onNavigateTab={tab => setActiveTab(tab as AppTab)}
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
              onNavigateTab={tab => setActiveTab(tab as AppTab)}
            />
          )}

          {activeTab === 'readystrategies' && (
            <ReadyStrategiesView
              onDeploy={(name, config) => handleDeployNew(name, config)}
              onEdit={_name => setActiveTab('builder')}
              onBacktest={_name => setActiveTab('backtest')}
              onNavigateTab={tab => setActiveTab(tab as AppTab)}
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
              onNavigateTab={tab => setActiveTab(tab as AppTab)}
              initialStrategyName={editingStrategyName}
            />
          )}

          {activeTab === 'usingai' && (
            <UsingAIView onSaveStrategy={handleSaveStrategy} onNavigateTab={tab => setActiveTab(tab as AppTab)} />
          )}

          {activeTab === 'wizard' && <OptionWizardView onDeployToLive={handleDeployNew} />}

          {activeTab === 'optionchain' && <OptionChainView onAddLeg={handleAddLegFromChain} />}

          {activeTab === 'brokers' && (
            <BrokersView connectedBrokers={connectedBrokers} onConfigure={brokerName => setBrokerModalName(brokerName)} />
          )}

          {activeTab === 'backtest' && <BacktestView />}

          {activeTab === 'pricing' && <PricingView />}
        </main>

        <footer className="border-t border-border px-4 py-3 text-[12px] text-fg-muted sm:px-6">
          <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-x-6 gap-y-1">
            <span>© {new Date().getFullYear()} TradingWave · Algo execution tools. Not investment advice. F&amp;O trading carries substantial risk.</span>
            <span className="flex items-center gap-4">
              <button onClick={() => setActiveTab('brokers')} className="hover:text-fg">{ALL_BROKERS_BASE.length} brokers</button>
              <button onClick={() => setActiveTab('pricing')} className="hover:text-fg">Plans</button>
              <a href="tel:+919019088160" className="font-mono hover:text-fg">+91 901 908 8160</a>
            </span>
          </div>
        </footer>
      </div>

      {/* Toast */}
      <div aria-live="polite" className="pointer-events-none fixed bottom-4 right-4 z-[70] max-w-[calc(100vw-32px)]">
        {toastMessage && (
          <div className="pointer-events-auto flex animate-fade-up items-center gap-2.5 rounded-md border border-border bg-surface py-2 pl-3 pr-2 text-[13px] text-fg shadow-pop">
            <Check className="h-4 w-4 text-profit" />
            <span>{toastMessage}</span>
            <button onClick={() => setToastMessage(null)} className="ml-1 rounded p-0.5 text-fg-muted hover:text-fg" aria-label="Dismiss">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      <KeywordModal
        isOpen={keywordModalOpen}
        onClose={() => setKeywordModalOpen(false)}
        onSelect={expr => {
          if (keywordCallback) keywordCallback(expr);
        }}
      />

      <ExecutionLogModal isOpen={!!logModalBot} botName={logModalBot || ''} onClose={() => setLogModalBot(null)} />

      <BrokerModal
        isOpen={!!brokerModalName}
        brokerName={brokerModalName || ''}
        onClose={() => setBrokerModalName(null)}
        onConnected={name => {
          setConnectedBrokers(prev => (prev.includes(name) ? prev : [...prev, name]));
          showToast(`${name} connected`);
        }}
      />
    </div>
  );
}
