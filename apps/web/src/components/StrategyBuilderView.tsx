'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Layers,
  Plus,
  Trash2,
  Play,
  Save,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  Code,
  TrendingUp,
  Wand2,
  Zap,
  Search,
  Check,
  ChevronDown,
  BookOpen,
  Download,
  Upload,
  Bold,
  Italic,
  Strikethrough,
  Link2,
  Image,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Maximize2,
  Minimize2,
  X
} from 'lucide-react';

interface ConditionItem {
  id: number;
  text: string;
}

interface LegItem {
  id: number;
  action: 'BUY' | 'SELL';
  type: 'CALL' | 'PUT' | 'FUT' | 'EQ';
  underlying: string;
  expiry: string;
  strike: string;
  product: 'MIS' | 'NRML';
  lots: number;
  sl: string;
  target: string;
  moveToCost: boolean;
}

interface StrategyTemplate {
  id: string;
  name: string;
  badge: string;
  category: string;
  description: string;
  underlying: string;
  frequency: string;
  checkOnCandleClose: boolean;
  combinator: 'AND' | 'OR';
  entryConditions: string[];
  legs: Omit<LegItem, 'id'>[];
  hasRepair: boolean;
  repairCondition: string;
  repairLegAction: string;
  exitConditions: string[];
  universalSl: string;
  universalTarget: string;
  trailIfProfit: string;
  trailStopBy: string;
}

// 7 Tradetron Production Templates
const READY_TEMPLATES: StrategyTemplate[] = [
  {
    id: 'short_straddle',
    name: 'NIFTY 9:20 Intraday Short Straddle v2.0',
    badge: 'Popular',
    category: 'Delta Neutral Options',
    description: 'Delta-neutral automated options selling engine with continuous 1-second monitoring, 25% leg stop-loss, auto move-to-cost, and 15:10 auto square-off.',
    underlying: 'NIFTY 50',
    frequency: 'Continuous',
    checkOnCandleClose: false,
    combinator: 'AND',
    entryConditions: [
      'Time >= 09:20',
      'EMA(NIFTY 50, 9, 5m, 0) Crosses Above EMA(NIFTY 50, 21, 5m, 0)'
    ],
    legs: [
      { action: 'SELL', type: 'CALL', underlying: 'NIFTY 50', expiry: 'Current Week', strike: 'ATM', product: 'MIS', lots: 1, sl: '25%', target: '60%', moveToCost: true },
      { action: 'SELL', type: 'PUT', underlying: 'NIFTY 50', expiry: 'Current Week', strike: 'ATM', product: 'MIS', lots: 1, sl: '25%', target: '60%', moveToCost: true }
    ],
    hasRepair: true,
    repairCondition: 'Delta(Set 1, Leg 1) > 0.35 OR Position_PnL(Set 1, Leg 1) <= -2500',
    repairLegAction: 'BUY · NIFTY 50 · OTM 2 CE · Current Week · 1 lot',
    exitConditions: [
      'Time >= 15:10',
      'Strategy_PnL <= -4000 OR Strategy_PnL >= 8000'
    ],
    universalSl: '4000',
    universalTarget: '8000',
    trailIfProfit: '2000',
    trailStopBy: '1000'
  },
  {
    id: 'supertrend_breakout',
    name: 'BANKNIFTY Multi-Timeframe Supertrend Breakout',
    badge: 'Momentum',
    category: 'Trend Following',
    description: 'Directional options buying engine executing on 5-minute and 15-minute Supertrend confluence with automated ATR trailing stop.',
    underlying: 'BANKNIFTY',
    frequency: 'Continuous',
    checkOnCandleClose: true,
    combinator: 'AND',
    entryConditions: [
      'Time >= 09:25',
      'LTP(BANKNIFTY) Crosses Above Supertrend(BANKNIFTY, 7, 3, 5m)',
      'RSI(BANKNIFTY, 14, 5m, 0) > 55'
    ],
    legs: [
      { action: 'BUY', type: 'CALL', underlying: 'BANKNIFTY', expiry: 'Current Week', strike: 'ATM', product: 'MIS', lots: 1, sl: '20%', target: '45%', moveToCost: true }
    ],
    hasRepair: false,
    repairCondition: '',
    repairLegAction: '',
    exitConditions: [
      'LTP(BANKNIFTY) Crosses Below Supertrend(BANKNIFTY, 7, 3, 5m)',
      'Time >= 15:15'
    ],
    universalSl: '3500',
    universalTarget: '9000',
    trailIfProfit: '2500',
    trailStopBy: '1200'
  },
  {
    id: 'iron_condor',
    name: 'NIFTY Weekly Iron Condor (Defined Risk)',
    badge: 'Defined Risk',
    category: 'Hedged Non-Directional',
    description: 'Low-beta 4-leg condor collecting theta premium on Thursday expiry with outer wing protection and automated delta imbalance repair.',
    underlying: 'NIFTY 50',
    frequency: '15m',
    checkOnCandleClose: true,
    combinator: 'AND',
    entryConditions: [
      'Day_of_Week == 4',
      'Time >= 09:30',
      'Atmiv(NIFTY 50) <= 16.5'
    ],
    legs: [
      { action: 'BUY', type: 'PUT', underlying: 'NIFTY 50', expiry: 'Current Week', strike: 'OTM 4', product: 'NRML', lots: 1, sl: '50%', target: '80%', moveToCost: false },
      { action: 'SELL', type: 'PUT', underlying: 'NIFTY 50', expiry: 'Current Week', strike: 'OTM 2', product: 'NRML', lots: 1, sl: '40%', target: '70%', moveToCost: true },
      { action: 'SELL', type: 'CALL', underlying: 'NIFTY 50', expiry: 'Current Week', strike: 'OTM 2', product: 'NRML', lots: 1, sl: '40%', target: '70%', moveToCost: true },
      { action: 'BUY', type: 'CALL', underlying: 'NIFTY 50', expiry: 'Current Week', strike: 'OTM 4', product: 'NRML', lots: 1, sl: '50%', target: '80%', moveToCost: false }
    ],
    hasRepair: true,
    repairCondition: 'Absolute(Delta(Set 1, Leg 2) + Delta(Set 1, Leg 3)) > 0.30',
    repairLegAction: 'SELL · NIFTY 50 · OTM 1 CE · Current Week · 1 lot',
    exitConditions: [
      'Days_to_Expiry(NIFTY 50) == 0 AND Time >= 15:20',
      'Strategy_PnL >= 6500'
    ],
    universalSl: '4500',
    universalTarget: '6500',
    trailIfProfit: '1500',
    trailStopBy: '750'
  },
  {
    id: 'theta_scalper',
    name: 'FINNIFTY 0-DTE Expiry Theta Scalper',
    badge: '0-DTE High Yield',
    category: 'Expiry Day Scalping',
    description: 'Captures afternoon accelerated premium erosion on Tuesday expiry with VWAP crossover confirmation and tight 15% leg risk guard.',
    underlying: 'FINNIFTY',
    frequency: 'Continuous',
    checkOnCandleClose: false,
    combinator: 'AND',
    entryConditions: [
      'Days_to_Expiry(FINNIFTY) == 0',
      'Time >= 12:45',
      'LTP(FINNIFTY) >= VWAP(FINNIFTY, 1m)'
    ],
    legs: [
      { action: 'SELL', type: 'CALL', underlying: 'FINNIFTY', expiry: 'Current Week', strike: 'OTM 1', product: 'MIS', lots: 2, sl: '20%', target: '75%', moveToCost: true },
      { action: 'SELL', type: 'PUT', underlying: 'FINNIFTY', expiry: 'Current Week', strike: 'OTM 1', product: 'MIS', lots: 2, sl: '20%', target: '75%', moveToCost: true }
    ],
    hasRepair: false,
    repairCondition: '',
    repairLegAction: '',
    exitConditions: [
      'Time >= 15:20',
      'Strategy_PnL <= -3000 OR Strategy_PnL >= 5500'
    ],
    universalSl: '3000',
    universalTarget: '5500',
    trailIfProfit: '1500',
    trailStopBy: '800'
  },
  {
    id: 'ema_ribbon',
    name: 'EMA Ribbon (9/21/50) Momentum Trend Follower',
    badge: 'Multi-EMA',
    category: 'Momentum',
    description: 'Enters directional ATM options when short EMA(9) crosses medium EMA(21) above baseline EMA(50) with volume confirmation.',
    underlying: 'NIFTY 50',
    frequency: '5m',
    checkOnCandleClose: true,
    combinator: 'AND',
    entryConditions: [
      'Time >= 09:30',
      'EMA(NIFTY 50, 9, 5m, 0) Crosses Above EMA(NIFTY 50, 21, 5m, 0)',
      'EMA(NIFTY 50, 21, 5m, 0) > EMA(NIFTY 50, 50, 5m, 0)',
      'Volume(NIFTY 50, 5m) > 100000'
    ],
    legs: [
      { action: 'BUY', type: 'CALL', underlying: 'NIFTY 50', expiry: 'Current Week', strike: 'ATM', product: 'MIS', lots: 1, sl: '18%', target: '50%', moveToCost: true }
    ],
    hasRepair: false,
    repairCondition: '',
    repairLegAction: '',
    exitConditions: [
      'EMA(NIFTY 50, 9, 5m, 0) Crosses Below EMA(NIFTY 50, 21, 5m, 0)',
      'Time >= 15:15'
    ],
    universalSl: '2500',
    universalTarget: '7500',
    trailIfProfit: '2000',
    trailStopBy: '1000'
  },
  {
    id: 'cpr_breakout',
    name: 'CPR (Central Pivot Range) Intraday Breakout',
    badge: 'Price Action',
    category: 'Pivot Range Breakout',
    description: 'Trades High/Low breakouts outside the daily Central Pivot Range Top Central (TC) or Bottom Central (BC) levels.',
    underlying: 'SENSEX',
    frequency: 'Continuous',
    checkOnCandleClose: true,
    combinator: 'AND',
    entryConditions: [
      'Time >= 09:45',
      'LTP(SENSEX) Crosses Above CPR(TC, SENSEX)',
      'RSI(SENSEX, 14, 15m, 0) > 60'
    ],
    legs: [
      { action: 'BUY', type: 'CALL', underlying: 'SENSEX', expiry: 'Current Week', strike: 'ATM', product: 'MIS', lots: 1, sl: '22%', target: '55%', moveToCost: true }
    ],
    hasRepair: false,
    repairCondition: '',
    repairLegAction: '',
    exitConditions: [
      'Time >= 15:10',
      'Strategy_PnL <= -3500 OR Strategy_PnL >= 9000'
    ],
    universalSl: '3500',
    universalTarget: '9000',
    trailIfProfit: '3000',
    trailStopBy: '1500'
  },
  {
    id: 'hedged_strangle',
    name: 'Hedged Short Strangle with Dynamic Delta Repair',
    badge: 'Hedging',
    category: 'Delta Neutral Options',
    description: 'Writes 100-point OTM Call & Put contracts on NIFTY 50 with outer far-OTM protection and active delta rebalancing when leg delta exceeds 0.30.',
    underlying: 'NIFTY 50',
    frequency: 'Continuous',
    checkOnCandleClose: false,
    combinator: 'AND',
    entryConditions: [
      'Time >= 09:25',
      'Atmiv(NIFTY 50) >= 12.0'
    ],
    legs: [
      { action: 'BUY', type: 'PUT', underlying: 'NIFTY 50', expiry: 'Current Week', strike: 'OTM 3', product: 'MIS', lots: 1, sl: '50%', target: '80%', moveToCost: false },
      { action: 'SELL', type: 'PUT', underlying: 'NIFTY 50', expiry: 'Current Week', strike: 'OTM 1', product: 'MIS', lots: 1, sl: '25%', target: '65%', moveToCost: true },
      { action: 'SELL', type: 'CALL', underlying: 'NIFTY 50', expiry: 'Current Week', strike: 'OTM 1', product: 'MIS', lots: 1, sl: '25%', target: '65%', moveToCost: true },
      { action: 'BUY', type: 'CALL', underlying: 'NIFTY 50', expiry: 'Current Week', strike: 'OTM 3', product: 'MIS', lots: 1, sl: '50%', target: '80%', moveToCost: false }
    ],
    hasRepair: true,
    repairCondition: 'Delta(Set 1, Leg 2) > 0.32 OR Delta(Set 1, Leg 3) > 0.32',
    repairLegAction: 'BUY · NIFTY 50 · OTM 1 CE · Current Week · 1 lot',
    exitConditions: [
      'Time >= 15:15',
      'Strategy_PnL <= -4500 OR Strategy_PnL >= 7500'
    ],
    universalSl: '4500',
    universalTarget: '7500',
    trailIfProfit: '2000',
    trailStopBy: '1000'
  }
];

// Autocomplete Keyword Suggestions Database
interface SuggestionKeyword {
  name: string;
  category: string;
  template: string;
  description: string;
}

const AUTOCOMPLETE_KEYWORDS: SuggestionKeyword[] = [
  { name: 'Time', category: 'Time & Calendar', template: 'Time >= 09:20', description: 'Exchange trading clock time (HH:MM)' },
  { name: 'Days_to_Expiry', category: 'Time & Calendar', template: 'Days_to_Expiry(NIFTY 50) == 0', description: 'Days remaining until option expiry' },
  { name: 'Day_of_Week', category: 'Time & Calendar', template: 'Day_of_Week == 4', description: 'Day of week (1=Mon, 4=Thu)' },
  { name: 'EMA', category: 'Indicators', template: 'EMA(NIFTY 50, 9, 5m, 0) Crosses Above EMA(NIFTY 50, 21, 5m, 0)', description: 'Exponential Moving Average' },
  { name: 'SMA', category: 'Indicators', template: 'SMA(NIFTY 50, 50, 15m, 0) > SMA(NIFTY 50, 200, 15m, 0)', description: 'Simple Moving Average' },
  { name: 'RSI', category: 'Indicators', template: 'RSI(NIFTY 50, 14, 5m, 0) > 60', description: 'Relative Strength Index momentum (0-100)' },
  { name: 'Supertrend', category: 'Indicators', template: 'LTP(NIFTY 50) Crosses Above Supertrend(NIFTY 50, 7, 3, 5m)', description: 'Supertrend trend direction' },
  { name: 'VWAP', category: 'Indicators', template: 'LTP(NIFTY 50) >= VWAP(NIFTY 50, 1m)', description: 'Volume Weighted Average Price' },
  { name: 'CPR', category: 'Indicators', template: 'LTP(NIFTY 50) Crosses Above CPR(TC, NIFTY 50)', description: 'Central Pivot Range (TC, Pivot, BC)' },
  { name: 'LTP', category: 'Market Data', template: 'LTP(NIFTY 50) > Close(NIFTY 50, 5m, 1)', description: 'Last Traded Price of symbol' },
  { name: 'Open', category: 'Market Data', template: 'Close(NIFTY 50, 15m, 0) > Open(NIFTY 50, 15m, 0)', description: 'Candle open price' },
  { name: 'High', category: 'Market Data', template: 'LTP(NIFTY 50) > High(NIFTY 50, 15m, 1)', description: 'Previous candle high price' },
  { name: 'Low', category: 'Market Data', template: 'LTP(NIFTY 50) < Low(NIFTY 50, 15m, 1)', description: 'Previous candle low price' },
  { name: 'Volume', category: 'Market Data', template: 'Volume(NIFTY 50, 5m) > 150000', description: 'Traded volume of candle' },
  { name: 'Open_Interest', category: 'Market Data', template: 'Open_Interest(NIFTY 50) > 500000', description: 'Option open interest contracts' },
  { name: 'Position_PnL', category: 'Position', template: 'Position_PnL(Set 1, Leg 1) <= -2500', description: 'Live mark-to-market P&L of leg (₹)' },
  { name: 'Strategy_PnL', category: 'Position', template: 'Strategy_PnL <= -4000 OR Strategy_PnL >= 8000', description: 'Overall strategy P&L (₹)' },
  { name: 'Delta', category: 'Option Greeks', template: 'Delta(Set 1, Leg 1) > 0.35', description: 'Option Greek delta exposure' },
  { name: 'Theta', category: 'Option Greeks', template: 'Theta(Set 1, Leg 1) >= 15.0', description: 'Daily time decay in points' },
  { name: 'Atmiv', category: 'Option Greeks', template: 'Atmiv(NIFTY 50) <= 15.0', description: 'At-The-Money Implied Volatility %' }
];

const POPULAR_SNIPPETS = [
  'Time >= 09:20',
  'EMA(NIFTY 50, 9, 5m, 0) Crosses Above EMA(NIFTY 50, 21, 5m, 0)',
  'RSI(NIFTY 50, 14, 5m, 0) > 60',
  'LTP(NIFTY 50) >= VWAP(NIFTY 50, 1m)',
  'Position_PnL(Set 1, Leg 1) <= -2500',
  'Strategy_PnL <= -4000',
  'Time >= 15:10'
];

const AVAILABLE_TAGS = ['NFO', 'NSE', 'BSE', 'MCX', 'Intraday', 'Positional', 'Options', 'Straddle', 'Scalping', 'Momentum', 'Hedging'];

interface StrategyBuilderViewProps {
  onOpenKeywordModal: (onSelect: (expr: string) => void) => void;
  onDeploy: (name: string) => void;
  onBacktest: (name: string) => void;
  onSaveStrategy?: (strategyData: any) => void;
  onNavigateTab?: (tab: string) => void;
  initialStrategyName?: string;
}

export default function StrategyBuilderView({
  onOpenKeywordModal,
  onDeploy,
  onBacktest,
  onSaveStrategy,
  onNavigateTab,
  initialStrategyName
}: StrategyBuilderViewProps) {
  // Strategy Header State matching Tradetron Create Strategy
  const [strategyName, setStrategyName] = useState(initialStrategyName || '');
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['NFO', 'Intraday']);
  const [tagsDropdownOpen, setTagsDropdownOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (initialStrategyName) {
      setStrategyName(initialStrategyName);
    }
  }, [initialStrategyName]);
  const [underlying, setUnderlying] = useState('NIFTY 50');
  const [checkFrequency, setCheckFrequency] = useState('Continuous');
  const [checkOnCandleClose, setCheckOnCandleClose] = useState(false);
  const [conditionCombinator, setConditionCombinator] = useState<'AND' | 'OR'>('AND');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('short_straddle');

  // Set 1 Entry Conditions
  const [entryConditions, setEntryConditions] = useState<ConditionItem[]>([
    { id: 1, text: 'Time >= 09:20' },
    { id: 2, text: 'EMA(NIFTY 50, 9, 5m, 0) Crosses Above EMA(NIFTY 50, 21, 5m, 0)' }
  ]);

  // Set 1 Legs
  const [legs, setLegs] = useState<LegItem[]>([
    { id: 1, action: 'SELL', type: 'CALL', underlying: 'NIFTY 50', expiry: 'Current Week', strike: 'ATM', product: 'MIS', lots: 1, sl: '25%', target: '60%', moveToCost: true },
    { id: 2, action: 'SELL', type: 'PUT', underlying: 'NIFTY 50', expiry: 'Current Week', strike: 'ATM', product: 'MIS', lots: 1, sl: '25%', target: '60%', moveToCost: true }
  ]);

  // Set 1 Repair Conditions & Legs
  const [hasRepair, setHasRepair] = useState(true);
  const [repairCondition, setRepairCondition] = useState('Delta(Set 1, Leg 1) > 0.35 OR Position_PnL(Set 1, Leg 1) <= -2500');
  const [repairLegAction, setRepairLegAction] = useState('BUY · NIFTY 50 · OTM 2 CE · Current Week · 1 lot');

  // Set 1 Exit Conditions
  const [exitConditions, setExitConditions] = useState<ConditionItem[]>([
    { id: 1, text: 'Time >= 15:10' },
    { id: 2, text: 'Strategy_PnL <= -4000 OR Strategy_PnL >= 8000' }
  ]);

  // Universal Stop Loss & Trailing
  const [universalSl, setUniversalSl] = useState('4000');
  const [universalTarget, setUniversalTarget] = useState('8000');
  const [trailIfProfit, setTrailIfProfit] = useState('2000');
  const [trailStopBy, setTrailStopBy] = useState('1000');

  // Notifications
  const [savedBanner, setSavedBanner] = useState(false);
  const [templateBanner, setTemplateBanner] = useState<string | null>(null);

  // Autocomplete typing state for entry conditions
  const [typingInput, setTypingInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered autocomplete suggestions based on typing
  const filteredSuggestions = AUTOCOMPLETE_KEYWORDS.filter(kw =>
    kw.name.toLowerCase().includes(typingInput.toLowerCase()) ||
    kw.category.toLowerCase().includes(typingInput.toLowerCase()) ||
    kw.description.toLowerCase().includes(typingInput.toLowerCase())
  );

  // Apply Ready Template
  const handleApplyTemplate = (tpl: StrategyTemplate) => {
    setSelectedTemplateId(tpl.id);
    setStrategyName(tpl.name);
    setDescription(tpl.description);
    setUnderlying(tpl.underlying);
    setCheckFrequency(tpl.frequency);
    setCheckOnCandleClose(tpl.checkOnCandleClose);
    setConditionCombinator(tpl.combinator);

    setEntryConditions(tpl.entryConditions.map((c, i) => ({ id: Date.now() + i, text: c })));
    setLegs(tpl.legs.map((l, i) => ({ id: Date.now() + 100 + i, ...l })));

    setHasRepair(tpl.hasRepair);
    setRepairCondition(tpl.repairCondition);
    setRepairLegAction(tpl.repairLegAction);

    setExitConditions(tpl.exitConditions.map((c, i) => ({ id: Date.now() + 200 + i, text: c })));

    setUniversalSl(tpl.universalSl);
    setUniversalTarget(tpl.universalTarget);
    setTrailIfProfit(tpl.trailIfProfit);
    setTrailStopBy(tpl.trailStopBy);

    setTemplateBanner(`Loaded "${tpl.name}" template with all legs, conditions & risk controls!`);
    setTimeout(() => setTemplateBanner(null), 3500);
  };

  // Add condition from typing autocomplete or snippet
  const handleAddCustomCondition = (expr: string) => {
    if (!expr.trim()) return;
    setEntryConditions(prev => [...prev, { id: Date.now(), text: expr.trim() }]);
    setTypingInput('');
    setShowSuggestions(false);
  };

  const handleAddConditionFromModal = () => {
    onOpenKeywordModal((newExpr: string) => {
      setEntryConditions(prev => [...prev, { id: Date.now(), text: newExpr }]);
    });
  };

  const handleAddExitConditionFromModal = () => {
    onOpenKeywordModal((newExpr: string) => {
      setExitConditions(prev => [...prev, { id: Date.now(), text: newExpr }]);
    });
  };

  const handleAddLeg = () => {
    setLegs(prev => [
      ...prev,
      {
        id: Date.now(),
        action: 'BUY',
        type: 'CALL',
        underlying: underlying,
        expiry: 'Current Week',
        strike: 'OTM 1',
        product: 'MIS',
        lots: 1,
        sl: '20%',
        target: '40%',
        moveToCost: false
      }
    ]);
  };

  const handleSave = () => {
    handleSaveAndRedirect();
  };

  const handleSaveAndRedirect = () => {
    const finalName = strategyName.trim() || 'Custom Strategy ' + new Date().toLocaleDateString('en-GB');
    setSavedBanner(true);
    if (onSaveStrategy) {
      onSaveStrategy({
        name: finalName,
        description: description || 'Custom multi-leg algorithmic strategy.',
        segment: underlying === 'SENSEX' ? 'BSE' : underlying === 'CRUDEOIL' ? 'MCX' : 'NFO',
        minCapitalDisplay: '₹ ' + Number(universalTarget || 100000).toLocaleString('en-IN'),
        minCapitalRaw: Number(universalTarget || 100000),
        type: 'ASB',
        visibility: 'PRIVATE'
      });
    } else {
      setTimeout(() => {
        setSavedBanner(false);
        if (onNavigateTab) onNavigateTab('mystrategies');
      }, 600);
    }
  };

  const handleExportStrategy = () => {
    const exportData = {
      name: strategyName || 'TradingWave_Strategy',
      description,
      tags: selectedTags,
      underlying,
      checkFrequency,
      checkOnCandleClose,
      conditionCombinator,
      entryConditions,
      legs,
      hasRepair,
      repairCondition,
      repairLegAction,
      exitConditions,
      universalSl,
      universalTarget,
      trailIfProfit,
      trailStopBy,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (strategyName || 'strategy').toLowerCase().replace(/\s+/g, '_') + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportStrategy = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = e => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = event => {
        try {
          const imported = JSON.parse(event.target?.result as string);
          if (imported.name) setStrategyName(imported.name);
          if (imported.description) setDescription(imported.description);
          if (imported.tags && Array.isArray(imported.tags)) setSelectedTags(imported.tags);
          if (imported.underlying) setUnderlying(imported.underlying);
          if (imported.checkFrequency) setCheckFrequency(imported.checkFrequency);
          if (imported.entryConditions) setEntryConditions(imported.entryConditions);
          if (imported.legs) setLegs(imported.legs);
          if (imported.exitConditions) setExitConditions(imported.exitConditions);
          if (imported.universalSl) setUniversalSl(imported.universalSl);
          if (imported.universalTarget) setUniversalTarget(imported.universalTarget);
          setTemplateBanner(`Successfully imported "${imported.name || 'strategy'}"!`);
          setTimeout(() => setTemplateBanner(null), 3500);
        } catch (err) {
          alert('Invalid strategy JSON file.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const applyFormatting = (format: string) => {
    switch (format) {
      case 'bold':
        setDescription(prev => prev + ' **bold text**');
        break;
      case 'italic':
        setDescription(prev => prev + ' *italic text*');
        break;
      case 'strikethrough':
        setDescription(prev => prev + ' ~~strikethrough~~');
        break;
      case 'link':
        setDescription(prev => prev + ' [link text](https://)');
        break;
      case 'image':
        setDescription(prev => prev + ' ![image alt](https://)');
        break;
      case 'bullet':
        setDescription(prev => prev ? prev + '\n- List item' : '- List item');
        break;
      case 'numbered':
        setDescription(prev => prev ? prev + '\n1. List item' : '1. List item');
        break;
      default:
        break;
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="space-y-5 pb-8">
            {/* 1. TOP HEADER: Create Strategy & Import / Export */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-fg">Create strategy</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleImportStrategy}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-border bg-surface text-fg-secondary text-xs font-semibold hover:bg-subtle transition"
          >
            <Download className="w-3.5 h-3.5 text-fg-muted" />
            <span>Import</span>
          </button>
          <button
            onClick={handleExportStrategy}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-border bg-surface text-fg-secondary text-xs font-semibold hover:bg-subtle transition"
          >
            <Upload className="w-3.5 h-3.5 text-fg-muted" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Feedback Banners */}
      {savedBanner && (
        <div className="p-3 bg-profit-soft border border-profit/30 rounded-lg text-xs text-profit flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Strategy saved successfully and added to My Strategies.</span>
        </div>
      )}

      {templateBanner && (
        <div className="p-3 bg-primary-soft border border-primary/30 rounded-lg text-xs text-primary font-medium flex items-center gap-2">
          <Zap className="w-4 h-4 shrink-0" />
          <span>{templateBanner}</span>
        </div>
      )}

      {/* 2. STRATEGY INFO CARD (Exact Tradetron Layout from Screenshot) */}
      <div className="p-6 rounded-lg bg-surface border border-border transition-colors">
        <h2 className="text-base font-semibold text-fg mb-4">Strategy info</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Strategy name */}
          <div>
            <label className="block text-xs font-semibold text-fg-secondary mb-1.5">
              Strategy name
            </label>
            <input
              type="text"
              value={strategyName}
              onChange={e => setStrategyName(e.target.value)}
              placeholder=""
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-fg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
            />
          </div>

          {/* Tags */}
          <div className="relative">
            <label className="block text-xs font-semibold text-fg-secondary mb-1.5">
              Tags
            </label>
            <div
              onClick={() => setTagsDropdownOpen(!tagsDropdownOpen)}
              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-fg-secondary cursor-pointer flex items-center justify-between"
            >
              <span className={selectedTags.length ? 'text-fg' : 'text-fg-muted'}>
                {selectedTags.length ? selectedTags.join(', ') : 'Tags...'}
              </span>
              <ChevronDown className="w-4 h-4 text-fg-muted" />
            </div>
            {tagsDropdownOpen && (
              <div className="absolute top-full mt-1 left-0 right-0 z-30 bg-surface border border-border rounded-lg p-2.5 shadow-pop flex flex-wrap gap-1.5">
                {AVAILABLE_TAGS.map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleTag(t)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
                      selectedTags.includes(t)
                        ? 'bg-primary text-primary-fg'
                        : 'bg-muted text-fg-secondary hover:bg-muted'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Description with Full Rich Text Toolbar */}
        <div className="mt-4">
          <label className="block text-xs font-semibold text-fg-secondary mb-1.5">
            Description
          </label>
          <div className="border border-border rounded-lg overflow-hidden focus-within:border-primary transition">
            {/* Toolbar */}
            <div className="bg-subtle border-b border-border px-3 py-1.5 flex items-center gap-1 flex-wrap text-fg-secondary">
              {/* Paragraph format dropdown */}
              <div className="flex items-center gap-0.5 px-2 py-1 rounded hover:bg-muted cursor-pointer text-xs font-semibold">
                <span>¶</span>
                <ChevronDown className="w-3 h-3 text-fg-muted" />
              </div>

              {/* Bold */}
              <button
                type="button"
                onClick={() => applyFormatting('bold')}
                className="p-1.5 rounded hover:bg-muted transition font-semibold"
                title="Bold"
              >
                <Bold className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>

              {/* Italic */}
              <button
                type="button"
                onClick={() => applyFormatting('italic')}
                className="p-1.5 rounded hover:bg-muted transition italic"
                title="Italic"
              >
                <Italic className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>

              {/* Strikethrough */}
              <button
                type="button"
                onClick={() => applyFormatting('strikethrough')}
                className="p-1.5 rounded hover:bg-muted transition line-through"
                title="Strikethrough"
              >
                <Strikethrough className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>

              {/* Divider */}
              <div className="w-[1px] h-4 bg-border-strong mx-1" />

              {/* Link */}
              <button
                type="button"
                onClick={() => applyFormatting('link')}
                className="flex items-center gap-0.5 p-1.5 rounded hover:bg-muted transition"
                title="Link"
              >
                <Link2 className="w-3.5 h-3.5" />
                <ChevronDown className="w-2.5 h-2.5 text-fg-muted" />
              </button>

              {/* Image */}
              <button
                type="button"
                onClick={() => applyFormatting('image')}
                className="p-1.5 rounded hover:bg-muted transition"
                title="Image"
              >
                <Image className="w-3.5 h-3.5" />
              </button>

              {/* Divider */}
              <div className="w-[1px] h-4 bg-border-strong mx-1" />

              {/* Alignments */}
              <button
                type="button"
                onClick={() => applyFormatting('align-left')}
                className="p-1.5 rounded hover:bg-muted transition"
                title="Align Left"
              >
                <AlignLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => applyFormatting('align-center')}
                className="p-1.5 rounded hover:bg-muted transition"
                title="Align Center"
              >
                <AlignCenter className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => applyFormatting('align-right')}
                className="p-1.5 rounded hover:bg-muted transition"
                title="Align Right"
              >
                <AlignRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => applyFormatting('align-justify')}
                className="p-1.5 rounded hover:bg-muted transition"
                title="Justify"
              >
                <AlignJustify className="w-3.5 h-3.5" />
              </button>

              {/* Divider */}
              <div className="w-[1px] h-4 bg-border-strong mx-1" />

              {/* Lists */}
              <button
                type="button"
                onClick={() => applyFormatting('bullet')}
                className="p-1.5 rounded hover:bg-muted transition"
                title="Bullet List"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => applyFormatting('numbered')}
                className="p-1.5 rounded hover:bg-muted transition"
                title="Numbered List"
              >
                <ListOrdered className="w-3.5 h-3.5" />
              </button>

              {/* Fullscreen Expand */}
              <button
                type="button"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-1.5 rounded hover:bg-muted transition ml-auto"
                title="Fullscreen"
              >
                {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Content Textarea */}
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Description"
              className={`w-full p-4 text-sm text-fg placeholder:text-fg-muted bg-transparent focus:outline-none resize-y ${
                isFullscreen ? 'fixed inset-0 z-50 !m-0 bg-surface p-6' : 'min-h-[160px]'
              }`}
            />
          </div>
        </div>
      </div>

      {/* 3. STRATEGY ENGINE PARAMETERS */}
      <div className="p-6 rounded-lg bg-surface border border-border transition-colors">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-base text-fg">Engine & Execution Parameters</h3>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary-soft text-primary border border-primary/30">
            Execution Frequency
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-3 border-t border-border text-xs">
          <div>
            <label className="block text-[12px] text-fg-secondary font-medium mb-1">Default Underlying</label>
            <select
              value={underlying}
              onChange={e => setUnderlying(e.target.value)}
              className="w-full bg-subtle border border-border rounded-lg px-3 py-1.5 text-fg font-medium focus:outline-none focus:border-primary"
            >
              <option value="NIFTY 50">NIFTY 50</option>
              <option value="BANKNIFTY">BANKNIFTY</option>
              <option value="FINNIFTY">FINNIFTY</option>
              <option value="MIDCPNIFTY">MIDCPNIFTY</option>
              <option value="SENSEX">SENSEX</option>
            </select>
          </div>

          <div>
            <label className="block text-[12px] text-fg-secondary font-medium mb-1">Continuous Check Frequency</label>
            <select
              value={checkFrequency}
              onChange={e => setCheckFrequency(e.target.value)}
              className="w-full bg-subtle border border-border rounded-lg px-3 py-1.5 text-fg font-medium focus:outline-none focus:border-primary"
            >
              <option value="Continuous">Continuous (1-second tick)</option>
              <option value="1m">1 minute candle</option>
              <option value="2m">2 minute candle</option>
              <option value="3m">3 minute candle</option>
              <option value="5m">5 minute candle</option>
              <option value="15m">15 minute candle</option>
            </select>
          </div>

          <div>
            <label className="block text-[12px] text-fg-secondary font-medium mb-1">Execution Rule</label>
            <label className="flex items-center gap-2 mt-2 cursor-pointer text-fg-secondary">
              <input
                type="checkbox"
                checked={checkOnCandleClose}
                onChange={e => setCheckOnCandleClose(e.target.checked)}
                className="accent-primary w-4 h-4 rounded cursor-pointer"
              />
              <span>Check on candle close only</span>
            </label>
          </div>

          <div>
            <label className="block text-[12px] text-fg-secondary font-medium mb-1">Pre-trade Risk Guard</label>
            <div className="flex items-center gap-1.5 text-profit font-semibold mt-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Active · Margin & Collar Guard</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. SET 1 CONTAINER */}
      <div className="rounded-lg bg-surface border border-border overflow-hidden transition-colors">
        {/* Set Header Bar */}
        <div className="px-6 py-4 bg-subtle border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-lg bg-primary-soft text-primary font-semibold text-xs flex items-center justify-center">
              1
            </span>
            <h3 className="font-semibold text-base text-fg">Strategy Set 1</h3>
            <span className="text-xs px-2 py-0.5 rounded bg-muted text-fg-secondary font-mono">
              Primary Execution Loop
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-fg-secondary">Condition Combinator:</span>
            <button
              onClick={() => setConditionCombinator(conditionCombinator === 'AND' ? 'OR' : 'AND')}
              className="px-2.5 py-1 rounded bg-primary text-primary-fg text-xs font-semibold"
              title="Toggle between AND / OR logic"
            >
              {conditionCombinator}
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* ENTRY CONDITIONS BLOCK */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-fg-secondary">
                Entry Conditions (When all true, take positions below)
              </label>
              <button
                onClick={handleAddConditionFromModal}
                className="text-xs px-3 py-1.5 rounded-lg bg-primary-soft border border-primary/40 text-primary hover:bg-primary hover:text-white font-semibold flex items-center gap-1.5 transition"
              >
                <Code className="w-3.5 h-3.5" />
                <span>Open 214 Keyword Catalogue</span>
              </button>
            </div>

            {/* Live Autocomplete Typing Bar */}
            <div className="relative mb-3" ref={suggestionsRef}>
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-fg-muted absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Type a keyword, indicator, or condition (e.g. Time, EMA, RSI, LTP, Supertrend, CPR)..."
                  value={typingInput}
                  onChange={e => {
                    setTypingInput(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && typingInput.trim()) {
                      handleAddCustomCondition(typingInput);
                    }
                  }}
                  className="w-full bg-subtle border border-border rounded-lg pl-9 pr-24 py-2.5 text-xs text-fg placeholder:text-fg-muted focus:outline-none focus:border-primary font-mono shadow-inner"
                />
                <button
                  onClick={() => handleAddCustomCondition(typingInput)}
                  disabled={!typingInput.trim()}
                  className="absolute right-2 px-3 py-1 rounded-lg bg-primary text-primary-fg text-xs font-semibold disabled:opacity-40 transition hover:opacity-90"
                >
                  Add Condition
                </button>
              </div>

              {/* Floating Autocomplete Dropdown */}
              {showSuggestions && typingInput.trim().length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1.5 z-40 bg-surface border border-border rounded-lg shadow-pop overflow-hidden max-h-64 overflow-y-auto font-mono text-xs duration-100">
                  <div className="p-2 bg-subtle border-b border-border text-[11px] text-fg-muted font-sans flex items-center justify-between">
                    <span>Keyword & Expression Suggestions ({filteredSuggestions.length} matches)</span>
                    <span className="text-[10px]">Click or press Enter to insert</span>
                  </div>
                  {filteredSuggestions.length === 0 ? (
                    <div className="p-3 text-fg-muted text-center font-sans">
                      No exact keyword matches found. Press Enter to add custom condition &quot;{typingInput}&quot;.
                    </div>
                  ) : (
                    filteredSuggestions.map(kw => (
                      <div
                        key={kw.name}
                        onClick={() => handleAddCustomCondition(kw.template)}
                        className="p-2.5 hover:bg-muted border-b border-border cursor-pointer flex items-center justify-between transition"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-fg">{kw.name}</span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-muted text-fg-secondary font-sans uppercase">
                              {kw.category}
                            </span>
                          </div>
                          <div className="text-[11px] text-primary mt-0.5">{kw.template}</div>
                          <div className="text-[10px] text-fg-muted font-sans mt-0.5">{kw.description}</div>
                        </div>
                        <span className="text-[10px] px-2 py-1 rounded bg-primary-soft text-primary font-sans font-semibold shrink-0">
                          Insert →
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Quick-Insert Suggestions Strip */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 text-[11px] no-scrollbar">
              <span className="text-fg-muted font-semibold shrink-0">Quick Add:</span>
              {POPULAR_SNIPPETS.map(snip => (
                <button
                  key={snip}
                  onClick={() => handleAddCustomCondition(snip)}
                  className="px-2.5 py-1 rounded-lg bg-muted hover:bg-primary-soft hover:text-primary border border-border text-fg-secondary font-mono whitespace-nowrap transition"
                >
                  + {snip}
                </button>
              ))}
            </div>

            {/* Active Entry Conditions List */}
            <div className="space-y-2">
              {entryConditions.map((cond, idx) => (
                <div
                  key={cond.id}
                  className="p-3 bg-subtle rounded-lg border border-border flex items-center justify-between gap-3 text-xs font-mono group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-fg-muted font-semibold">{idx + 1}.</span>
                    <span className="text-fg font-semibold">{cond.text}</span>
                  </div>
                  <button
                    onClick={() => setEntryConditions(entryConditions.filter(c => c.id !== cond.id))}
                    className="p-1 text-fg-muted hover:text-loss transition"
                    title="Remove condition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* POSITION LEGS TABLE */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-fg-secondary">
                Positions to Take ({legs.length} Legs)
              </label>
              <button
                onClick={handleAddLeg}
                className="text-xs px-3 py-1.5 rounded-lg bg-muted border border-border-strong text-fg-secondary hover:border-primary hover:text-primary font-semibold flex items-center gap-1.5 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Position Leg</span>
              </button>
            </div>

            <div className="rounded-lg border border-border overflow-x-auto bg-subtle">
              <table className="w-full text-xs font-mono text-left">
                <thead>
                  <tr className="bg-muted text-fg-secondary text-[10px] uppercase border-b border-border">
                    <th className="py-2.5 px-3">Leg</th>
                    <th className="py-2.5 px-3">Action</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Underlying</th>
                    <th className="py-2.5 px-3">Expiry</th>
                    <th className="py-2.5 px-3">Strike Formula</th>
                    <th className="py-2.5 px-3">Product</th>
                    <th className="py-2.5 px-3">Lots</th>
                    <th className="py-2.5 px-3">Leg SL</th>
                    <th className="py-2.5 px-3">Target</th>
                    <th className="py-2.5 px-3">Move SL to Cost</th>
                    <th className="py-2.5 px-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {legs.map((leg, idx) => (
                    <tr key={leg.id} className="hover:bg-muted/70 transition">
                      <td className="py-2.5 px-3 text-fg-muted">{idx + 1}</td>
                      <td className="py-2.5 px-3">
                        <select
                          value={leg.action}
                          onChange={e => {
                            const newLegs = [...legs];
                            newLegs[idx].action = e.target.value as any;
                            setLegs(newLegs);
                          }}
                          className={`bg-surface border border-border rounded px-2 py-1 font-semibold ${
                            leg.action === 'BUY' ? 'text-profit' : 'text-loss'
                          }`}
                        >
                          <option value="BUY">BUY</option>
                          <option value="SELL">SELL</option>
                        </select>
                      </td>
                      <td className="py-2.5 px-3">
                        <select
                          value={leg.type}
                          onChange={e => {
                            const newLegs = [...legs];
                            newLegs[idx].type = e.target.value as any;
                            setLegs(newLegs);
                          }}
                          className="bg-surface border border-border rounded px-2 py-1 text-fg"
                        >
                          <option value="CALL">CE (Call)</option>
                          <option value="PUT">PE (Put)</option>
                          <option value="FUT">FUT (Futures)</option>
                          <option value="EQ">EQ (Equity)</option>
                        </select>
                      </td>
                      <td className="py-2.5 px-3 text-fg-secondary font-sans">{leg.underlying}</td>
                      <td className="py-2.5 px-3">
                        <select
                          value={leg.expiry}
                          onChange={e => {
                            const newLegs = [...legs];
                            newLegs[idx].expiry = e.target.value;
                            setLegs(newLegs);
                          }}
                          className="bg-surface border border-border rounded px-2 py-1 text-fg-secondary font-sans"
                        >
                          <option value="Current Week">Current Week</option>
                          <option value="Next Week">Next Week</option>
                          <option value="Current Month">Current Month</option>
                        </select>
                      </td>
                      <td className="py-2.5 px-3">
                        <input
                          type="text"
                          value={leg.strike}
                          onChange={e => {
                            const newLegs = [...legs];
                            newLegs[idx].strike = e.target.value;
                            setLegs(newLegs);
                          }}
                          className="bg-surface border border-border rounded px-2 py-1 text-fg w-24"
                        />
                      </td>
                      <td className="py-2.5 px-3 text-fg-secondary">{leg.product}</td>
                      <td className="py-2.5 px-3">
                        <input
                          type="number"
                          value={leg.lots}
                          onChange={e => {
                            const newLegs = [...legs];
                            newLegs[idx].lots = Number(e.target.value);
                            setLegs(newLegs);
                          }}
                          className="bg-surface border border-border rounded px-2 py-1 text-fg w-14"
                        />
                      </td>
                      <td className="py-2.5 px-3">
                        <input
                          type="text"
                          value={leg.sl}
                          onChange={e => {
                            const newLegs = [...legs];
                            newLegs[idx].sl = e.target.value;
                            setLegs(newLegs);
                          }}
                          className="bg-surface border border-border rounded px-2 py-1 text-loss w-16"
                        />
                      </td>
                      <td className="py-2.5 px-3">
                        <input
                          type="text"
                          value={leg.target}
                          onChange={e => {
                            const newLegs = [...legs];
                            newLegs[idx].target = e.target.value;
                            setLegs(newLegs);
                          }}
                          className="bg-surface border border-border rounded px-2 py-1 text-profit w-16"
                        />
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={leg.moveToCost}
                          onChange={e => {
                            const newLegs = [...legs];
                            newLegs[idx].moveToCost = e.target.checked;
                            setLegs(newLegs);
                          }}
                          className="accent-primary w-4 h-4 rounded cursor-pointer"
                        />
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => setLegs(legs.filter(l => l.id !== leg.id))}
                          className="p-1 text-fg-muted hover:text-loss transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* REPAIR CONDITIONS BLOCK */}
          <div className="p-4 rounded-lg bg-subtle border border-border space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-fg-secondary flex items-center gap-2">
                <span>Set Repair Logic (Hedges or Strike Adjustments)</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer text-xs text-fg-secondary">
                <input
                  type="checkbox"
                  checked={hasRepair}
                  onChange={e => setHasRepair(e.target.checked)}
                  className="accent-primary w-3.5 h-3.5 rounded"
                />
                <span>Enable Repair Condition</span>
              </label>
            </div>

            {hasRepair && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                <div>
                  <span className="font-sans text-fg-secondary text-[12px] block mb-1">Repair Trigger Condition:</span>
                  <input
                    type="text"
                    value={repairCondition}
                    onChange={e => setRepairCondition(e.target.value)}
                    className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-fg focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <span className="font-sans text-fg-secondary text-[12px] block mb-1">Action when Repair Triggers:</span>
                  <input
                    type="text"
                    value={repairLegAction}
                    onChange={e => setRepairLegAction(e.target.value)}
                    className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-fg focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            )}
          </div>

          {/* SET EXIT CONDITIONS BLOCK */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-fg-secondary">
                Set Exit Conditions (Square off all Set 1 legs)
              </label>
              <button
                onClick={handleAddExitConditionFromModal}
                className="text-xs px-3 py-1.5 rounded-lg bg-muted border border-border-strong text-fg-secondary hover:border-primary hover:text-primary font-semibold flex items-center gap-1.5 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Exit Condition</span>
              </button>
            </div>

            <div className="space-y-2">
              {exitConditions.map((cond, idx) => (
                <div
                  key={cond.id}
                  className="p-3 bg-subtle rounded-lg border border-border flex items-center justify-between gap-3 text-xs font-mono group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-fg-muted font-semibold">{idx + 1}.</span>
                    <span className="text-fg font-semibold">{cond.text}</span>
                  </div>
                  <button
                    onClick={() => setExitConditions(exitConditions.filter(c => c.id !== cond.id))}
                    className="p-1 text-fg-muted hover:text-loss transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. UNIVERSAL EXIT & TRAILING STOP LOSS BLOCK */}
      <div className="p-6 rounded-lg bg-surface border border-border space-y-4 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-base text-fg">Universal Exit & Trailing Stop Loss</h3>
            <p className="text-xs text-fg-secondary">Guarantees portfolio protection regardless of set-level conditions</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-profit-soft text-profit border border-profit/30">
            Global Risk Layer
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 text-xs">
          <div>
            <label className="block text-[12px] text-fg-secondary font-medium mb-1">Universal Stop Loss (₹)</label>
            <input
              type="text"
              value={universalSl}
              onChange={e => setUniversalSl(e.target.value)}
              className="w-full bg-subtle border border-border rounded-lg px-3 py-2 text-loss font-semibold focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-[12px] text-fg-secondary font-medium mb-1">Universal Target (₹)</label>
            <input
              type="text"
              value={universalTarget}
              onChange={e => setUniversalTarget(e.target.value)}
              className="w-full bg-subtle border border-border rounded-lg px-3 py-2 text-profit font-semibold focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-[12px] text-fg-secondary font-medium mb-1">Trail If Profit Increases By (₹)</label>
            <input
              type="text"
              value={trailIfProfit}
              onChange={e => setTrailIfProfit(e.target.value)}
              className="w-full bg-subtle border border-border rounded-lg px-3 py-2 text-fg focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-[12px] text-fg-secondary font-medium mb-1">Trail Stop-Loss By (₹)</label>
            <input
              type="text"
              value={trailStopBy}
              onChange={e => setTrailStopBy(e.target.value)}
              className="w-full bg-subtle border border-border rounded-lg px-3 py-2 text-fg focus:outline-none focus:border-primary"
            />
          </div>
        </div>
      </div>

      {/* 5. BOTTOM ACTION BAR: Save / Cancel / Backtest / Deploy */}
      <div className="p-4 rounded-lg bg-surface border border-border flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-4 z-20">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigateTab ? onNavigateTab('mystrategies') : null}
            className="px-4 py-2.5 rounded-lg border border-border hover:bg-muted text-fg-secondary text-xs font-semibold transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveAndRedirect}
            className="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-primary-fg text-xs font-semibold flex items-center gap-2 transition"
          >
            <Save className="w-4 h-4" />
            <span>Save Strategy</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onBacktest(strategyName || 'My Strategy')}
            className="px-4 py-2.5 rounded-lg border border-border-strong hover:border-border-strong text-fg-secondary text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <TrendingUp className="w-3.5 h-3.5 text-profit" />
            <span>Backtest</span>
          </button>
          <button
            type="button"
            onClick={() => onDeploy(strategyName || 'My Strategy')}
            className="px-5 py-2.5 rounded-lg bg-primary text-primary-fg text-xs font-semibold shadow-pop hover:opacity-90 flex items-center gap-1.5 transition"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Deploy 1-Click</span>
          </button>
        </div>
      </div>
    </div>
  );
}
