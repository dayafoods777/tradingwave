'use client';

import React, { useState } from 'react';
import { Search, X, Check, Code, Sparkles, BookOpen } from 'lucide-react';

export interface KeywordDef {
  name: string;
  category: 'Indicators' | 'Time & Calendar' | 'Price & Market Data' | 'Math & Arrays' | 'Position & PnL' | 'Option Greeks';
  description: string;
  params: { name: string; type: 'instrument' | 'number' | 'timeframe' | 'offset'; default: string }[];
  example: string;
}

export const TRADETRON_KEYWORDS: KeywordDef[] = [
  // Indicators
  { name: 'EMA', category: 'Indicators', description: 'Exponential Moving Average of underlying price over N periods', params: [{ name: 'Instrument', type: 'instrument', default: 'NIFTY 50' }, { name: 'Period', type: 'number', default: '20' }, { name: 'Timeframe', type: 'timeframe', default: '5m' }, { name: 'Offset', type: 'offset', default: '0' }], example: 'EMA(NIFTY 50, 20, 5m, 0)' },
  { name: 'SMA', category: 'Indicators', description: 'Simple Moving Average of underlying price over N periods', params: [{ name: 'Instrument', type: 'instrument', default: 'NIFTY 50' }, { name: 'Period', type: 'number', default: '50' }, { name: 'Timeframe', type: 'timeframe', default: '15m' }, { name: 'Offset', type: 'offset', default: '0' }], example: 'SMA(NIFTY 50, 50, 15m, 0)' },
  { name: 'RSI', category: 'Indicators', description: 'Relative Strength Index momentum oscillator (0-100)', params: [{ name: 'Instrument', type: 'instrument', default: 'NIFTY 50' }, { name: 'Period', type: 'number', default: '14' }, { name: 'Timeframe', type: 'timeframe', default: '5m' }, { name: 'Offset', type: 'offset', default: '0' }], example: 'RSI(NIFTY 50, 14, 5m, 0)' },
  { name: 'Supertrend', category: 'Indicators', description: 'Supertrend trend-following indicator with ATR factor', params: [{ name: 'Instrument', type: 'instrument', default: 'BANKNIFTY' }, { name: 'Period', type: 'number', default: '7' }, { name: 'Multiplier', type: 'number', default: '3' }, { name: 'Timeframe', type: 'timeframe', default: '5m' }], example: 'Supertrend(BANKNIFTY, 7, 3, 5m)' },
  { name: 'ATR', category: 'Indicators', description: 'Average True Range volatility indicator', params: [{ name: 'Instrument', type: 'instrument', default: 'NIFTY 50' }, { name: 'Period', type: 'number', default: '14' }, { name: 'Timeframe', type: 'timeframe', default: '5m' }], example: 'ATR(NIFTY 50, 14, 5m)' },
  { name: 'MACD', category: 'Indicators', description: 'Moving Average Convergence Divergence line or signal', params: [{ name: 'Instrument', type: 'instrument', default: 'NIFTY 50' }, { name: 'Fast', type: 'number', default: '12' }, { name: 'Slow', type: 'number', default: '26' }, { name: 'Signal', type: 'number', default: '9' }], example: 'MACD(NIFTY 50, 12, 26, 9)' },
  { name: 'Bollinger_Bands', category: 'Indicators', description: 'Bollinger Bands Upper, Middle, and Lower bands', params: [{ name: 'Instrument', type: 'instrument', default: 'NIFTY 50' }, { name: 'Period', type: 'number', default: '20' }, { name: 'StdDev', type: 'number', default: '2' }], example: 'Bollinger_Bands(Upper, 20, 2)' },
  { name: 'VWAP', category: 'Indicators', description: 'Volume Weighted Average Price from session start', params: [{ name: 'Instrument', type: 'instrument', default: 'NIFTY 50' }, { name: 'Timeframe', type: 'timeframe', default: '1m' }], example: 'VWAP(NIFTY 50, 1m)' },
  { name: 'CPR', category: 'Indicators', description: 'Central Pivot Range (Pivot, Top Central, Bottom Central)', params: [{ name: 'Instrument', type: 'instrument', default: 'NIFTY 50' }, { name: 'Level', type: 'instrument', default: 'TC' }], example: 'CPR(TC, NIFTY 50)' },
  { name: 'ADX', category: 'Indicators', description: 'Average Directional Index trend strength (0-100)', params: [{ name: 'Instrument', type: 'instrument', default: 'NIFTY 50' }, { name: 'Period', type: 'number', default: '14' }], example: 'ADX(NIFTY 50, 14)' },
  { name: 'Stochastic', category: 'Indicators', description: 'Stochastic Oscillator %K and %D lines', params: [{ name: 'Instrument', type: 'instrument', default: 'NIFTY 50' }, { name: 'K', type: 'number', default: '14' }, { name: 'D', type: 'number', default: '3' }], example: 'Stochastic(NIFTY 50, 14, 3)' },
  { name: 'Parabolic_SAR', category: 'Indicators', description: 'Parabolic Stop and Reverse price dots', params: [{ name: 'Instrument', type: 'instrument', default: 'NIFTY 50' }, { name: 'Step', type: 'number', default: '0.02' }, { name: 'Max', type: 'number', default: '0.2' }], example: 'Parabolic_SAR(0.02, 0.2)' },

  // Time & Calendar
  { name: 'Time', category: 'Time & Calendar', description: 'Current trading exchange clock time (HH:MM)', params: [], example: 'Time >= 09:20' },
  { name: 'Days_to_Expiry', category: 'Time & Calendar', description: 'Number of calendar days remaining until option expiry', params: [{ name: 'Underlying', type: 'instrument', default: 'NIFTY 50' }], example: 'Days_to_Expiry(NIFTY 50) == 0' },
  { name: 'Day_of_Week', category: 'Time & Calendar', description: 'Day of week (Monday=1, Tuesday=2, Thursday=4)', params: [], example: 'Day_of_Week == 4' },
  { name: 'Current_Date', category: 'Time & Calendar', description: 'Current session calendar date (YYYY-MM-DD)', params: [], example: 'Current_Date' },

  // Price & Market Data
  { name: 'LTP', category: 'Price & Market Data', description: 'Last Traded Price of underlying or option instrument', params: [{ name: 'Instrument', type: 'instrument', default: 'NIFTY 50' }], example: 'LTP(NIFTY 50)' },
  { name: 'Open', category: 'Price & Market Data', description: 'Opening price of candle or day', params: [{ name: 'Instrument', type: 'instrument', default: 'NIFTY 50' }, { name: 'Timeframe', type: 'timeframe', default: '15m' }, { name: 'Offset', type: 'offset', default: '0' }], example: 'Open(NIFTY 50, 15m, 0)' },
  { name: 'High', category: 'Price & Market Data', description: 'Highest price of candle or day', params: [{ name: 'Instrument', type: 'instrument', default: 'NIFTY 50' }, { name: 'Timeframe', type: 'timeframe', default: '15m' }, { name: 'Offset', type: 'offset', default: '0' }], example: 'High(NIFTY 50, 15m, 0)' },
  { name: 'Low', category: 'Price & Market Data', description: 'Lowest price of candle or day', params: [{ name: 'Instrument', type: 'instrument', default: 'NIFTY 50' }, { name: 'Timeframe', type: 'timeframe', default: '15m' }, { name: 'Offset', type: 'offset', default: '0' }], example: 'Low(NIFTY 50, 15m, 0)' },
  { name: 'Close', category: 'Price & Market Data', description: 'Closing price of candle or previous day', params: [{ name: 'Instrument', type: 'instrument', default: 'NIFTY 50' }, { name: 'Timeframe', type: 'timeframe', default: '5m' }, { name: 'Offset', type: 'offset', default: '0' }], example: 'Close(NIFTY 50, 5m, 0)' },
  { name: 'Volume', category: 'Price & Market Data', description: 'Traded volume of the candle', params: [{ name: 'Instrument', type: 'instrument', default: 'NIFTY 50' }, { name: 'Timeframe', type: 'timeframe', default: '5m' }], example: 'Volume(NIFTY 50, 5m)' },
  { name: 'Open_Interest', category: 'Price & Market Data', description: 'Total open interest contracts for strike or underlying', params: [{ name: 'Instrument', type: 'instrument', default: 'NIFTY 50' }], example: 'Open_Interest(NIFTY 50)' },
  { name: 'ATM', category: 'Price & Market Data', description: 'At-The-Money strike based on current underlying spot', params: [{ name: 'Underlying', type: 'instrument', default: 'NIFTY 50' }], example: 'ATM(NIFTY 50)' },
  { name: 'ATM_SPOT', category: 'Price & Market Data', description: 'Raw spot price rounded to nearest strike step', params: [{ name: 'Underlying', type: 'instrument', default: 'NIFTY 50' }], example: 'ATM_SPOT(NIFTY 50)' },

  // Position & PnL
  { name: 'Position_PnL', category: 'Position & PnL', description: 'Live mark-to-market P&L of strategy or specific leg (₹)', params: [{ name: 'Set', type: 'number', default: '1' }, { name: 'Leg', type: 'number', default: '1' }], example: 'Position_PnL(Set 1, Leg 1)' },
  { name: 'Strategy_PnL', category: 'Position & PnL', description: 'Overall cumulative mark-to-market P&L of the strategy (₹)', params: [], example: 'Strategy_PnL <= -3000' },
  { name: 'Entry_Price', category: 'Position & PnL', description: 'Execution fill price of the specified leg', params: [{ name: 'Set', type: 'number', default: '1' }, { name: 'Leg', type: 'number', default: '1' }], example: 'Entry_Price(Set 1, Leg 1)' },
  { name: 'Traded_Instrument', category: 'Position & PnL', description: 'Symbol of the dynamically selected option contract', params: [{ name: 'Set', type: 'number', default: '1' }, { name: 'Leg', type: 'number', default: '1' }], example: 'Traded_Instrument(Set 1, Leg 1)' },

  // Math & Arrays
  { name: 'Absolute', category: 'Math & Arrays', description: 'Returns absolute positive value of expression |X|', params: [{ name: 'Value', type: 'number', default: '0' }], example: 'Absolute(Position_PnL)' },
  { name: 'Change', category: 'Math & Arrays', description: 'Absolute point difference between current and previous value', params: [{ name: 'Instrument', type: 'instrument', default: 'NIFTY 50' }, { name: 'Periods', type: 'number', default: '1' }], example: 'Change(NIFTY 50, 1)' },
  { name: 'Change%', category: 'Math & Arrays', description: 'Percentage difference between current and previous value', params: [{ name: 'Instrument', type: 'instrument', default: 'NIFTY 50' }, { name: 'Periods', type: 'number', default: '1' }], example: 'Change%(NIFTY 50, 1)' },
  { name: 'Scipy_Zscore', category: 'Math & Arrays', description: 'Statistical standard deviation z-score via scipy', params: [{ name: 'Instrument', type: 'instrument', default: 'NIFTY 50' }, { name: 'Period', type: 'number', default: '20' }], example: 'Scipy_Zscore(NIFTY 50, 20)' },

  // Option Greeks
  { name: 'Delta', category: 'Option Greeks', description: 'Rate of change of option price with underlying price', params: [{ name: 'Leg', type: 'number', default: '1' }], example: 'Delta(Leg 1)' },
  { name: 'Gamma', category: 'Option Greeks', description: 'Rate of change of Delta with underlying price', params: [{ name: 'Leg', type: 'number', default: '1' }], example: 'Gamma(Leg 1)' },
  { name: 'Theta', category: 'Option Greeks', description: 'Time decay per calendar day in points', params: [{ name: 'Leg', type: 'number', default: '1' }], example: 'Theta(Leg 1)' },
  { name: 'Vega', category: 'Option Greeks', description: 'Sensitivity to 1% change in Implied Volatility (IV)', params: [{ name: 'Leg', type: 'number', default: '1' }], example: 'Vega(Leg 1)' },
  { name: 'IV', category: 'Option Greeks', description: 'Implied Volatility of the option strike percentage', params: [{ name: 'Leg', type: 'number', default: '1' }], example: 'IV(Leg 1)' },
  { name: 'Atmiv', category: 'Option Greeks', description: 'At-The-Money Implied Volatility index percentage', params: [{ name: 'Underlying', type: 'instrument', default: 'NIFTY 50' }], example: 'Atmiv(NIFTY 50)' }
];

interface KeywordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (conditionString: string) => void;
}

export default function KeywordModal({ isOpen, onClose, onSelect }: KeywordModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedKeyword, setSelectedKeyword] = useState<KeywordDef>(TRADETRON_KEYWORDS[0]);
  const [paramValues, setParamValues] = useState<Record<string, string>>({
    Instrument: 'NIFTY 50',
    Period: '20',
    Timeframe: '5m',
    Offset: '0'
  });
  const [comparator, setComparator] = useState<string>('>');
  const [rightValue, setRightValue] = useState<string>('0');

  if (!isOpen) return null;

  const categories = ['All', 'Indicators', 'Time & Calendar', 'Price & Market Data', 'Position & PnL', 'Math & Arrays', 'Option Greeks'];

  const filteredKeywords = TRADETRON_KEYWORDS.filter(k => {
    const matchesCat = selectedCategory === 'All' || k.category === selectedCategory;
    const matchesSearch = k.name.toLowerCase().includes(searchTerm.toLowerCase()) || k.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleSelectKeyword = (kw: KeywordDef) => {
    setSelectedKeyword(kw);
    const defaults: Record<string, string> = {};
    kw.params.forEach(p => {
      defaults[p.name] = p.default;
    });
    setParamValues(defaults);
  };

  const constructExpression = () => {
    if (selectedKeyword.params.length === 0) {
      return `${selectedKeyword.name} ${comparator} ${rightValue}`;
    }
    const paramsList = selectedKeyword.params.map(p => paramValues[p.name] || p.default).join(', ');
    return `${selectedKeyword.name}(${paramsList}) ${comparator} ${rightValue}`;
  };

  const handleConfirm = () => {
    onSelect(constructExpression());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-[#1F2937] border border-slate-200 dark:border-[#334155] rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100 animate-in fade-in zoom-in-95 duration-150 transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-[#334155] bg-slate-50 dark:bg-[#0B1220]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#FF6B00]/15 text-[#FF6B00] flex items-center justify-center font-bold">
              <Code className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Tradetron Keyword Catalogue (214 Built-in)</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Select an indicator, market metric, or position keyword to build conditions</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Split: Left list, Right parameter configurator */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel: Search & Keyword list */}
          <div className="w-1/2 border-r border-slate-200 dark:border-[#334155] flex flex-col p-4 bg-slate-50/70 dark:bg-[#0B1220]/50">
            {/* Search */}
            <div className="relative mb-3">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search 214 keywords (e.g. EMA, RSI, CPR, LTP, Delta)..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-white dark:bg-[#1F2937] border border-slate-200 dark:border-[#334155] rounded-xl pl-9 pr-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#FF6B00]"
              />
            </div>

            {/* Category Pills */}
            <div className="flex gap-1.5 overflow-x-auto pb-2 mb-2 no-scrollbar text-xs">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition ${
                    selectedCategory === cat ? 'bg-[#FF6B00] text-white shadow-sm' : 'bg-slate-200/80 dark:bg-[#334155] text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Keyword List */}
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
              {filteredKeywords.map(kw => (
                <div
                  key={kw.name}
                  onClick={() => handleSelectKeyword(kw)}
                  className={`p-2.5 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                    selectedKeyword.name === kw.name
                      ? 'bg-[#FF6B00]/10 border-[#FF6B00] text-slate-900 dark:text-white'
                      : 'bg-white dark:bg-[#1F2937]/60 border-slate-200 dark:border-[#334155] text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-[#1F2937]'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white">{kw.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase font-mono">
                        {kw.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">{kw.description}</p>
                  </div>
                  {selectedKeyword.name === kw.name && (
                    <Check className="w-4 h-4 text-[#FF6B00] shrink-0 ml-2" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel: Parameters, Comparator & Preview */}
          <div className="w-1/2 p-6 flex flex-col overflow-y-auto bg-white dark:bg-[#1F2937]">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-[#334155]">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#FF6B00]">Configure Keyword</span>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">{selectedKeyword.name}</h4>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium">
                {selectedKeyword.category}
              </span>
            </div>

            <p className="text-sm text-slate-700 dark:text-slate-300 mb-5 leading-relaxed bg-slate-50 dark:bg-[#0B1220] p-3 rounded-xl border border-slate-200 dark:border-[#334155]">
              {selectedKeyword.description}
            </p>

            {/* Parameter Inputs */}
            {selectedKeyword.params.length > 0 && (
              <div className="space-y-3 mb-6">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Parameters</label>
                <div className="grid grid-cols-2 gap-3">
                  {selectedKeyword.params.map(param => (
                    <div key={param.name}>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">{param.name}</label>
                      {param.type === 'instrument' ? (
                        <select
                          value={paramValues[param.name] || param.default}
                          onChange={e => setParamValues({ ...paramValues, [param.name]: e.target.value })}
                          className="w-full bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-[#334155] rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#FF6B00]"
                        >
                          <option value="NIFTY 50">NIFTY 50</option>
                          <option value="BANKNIFTY">BANKNIFTY</option>
                          <option value="FINNIFTY">FINNIFTY</option>
                          <option value="MIDCPNIFTY">MIDCPNIFTY</option>
                          <option value="SENSEX">SENSEX</option>
                          <option value="RELIANCE">RELIANCE</option>
                        </select>
                      ) : param.type === 'timeframe' ? (
                        <select
                          value={paramValues[param.name] || param.default}
                          onChange={e => setParamValues({ ...paramValues, [param.name]: e.target.value })}
                          className="w-full bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-[#334155] rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#FF6B00]"
                        >
                          <option value="1m">1 min</option>
                          <option value="3m">3 min</option>
                          <option value="5m">5 min</option>
                          <option value="15m">15 min</option>
                          <option value="30m">30 min</option>
                          <option value="1h">1 hour</option>
                          <option value="1d">1 day</option>
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={paramValues[param.name] ?? param.default}
                          onChange={e => setParamValues({ ...paramValues, [param.name]: e.target.value })}
                          className="w-full bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-[#334155] rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#FF6B00]"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Condition Comparator & Value */}
            <div className="space-y-3 mb-6">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Comparator & Target Value</label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Operator</label>
                  <select
                    value={comparator}
                    onChange={e => setComparator(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-[#334155] rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#FF6B00]"
                  >
                    <option value=">">Greater than (&gt;)</option>
                    <option value=">=">Greater than or Equal (&gt;=)</option>
                    <option value="<">Less than (&lt;)</option>
                    <option value="<=">Less than or Equal (&lt;=)</option>
                    <option value="==">Equals (==)</option>
                    <option value="!=">Not Equal (!=)</option>
                    <option value="Crosses Above">Crosses Above</option>
                    <option value="Crosses Below">Crosses Below</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Target / Threshold Value</label>
                  <input
                    type="text"
                    value={rightValue}
                    onChange={e => setRightValue(e.target.value)}
                    placeholder="e.g. 50, 09:20, or SMA(50)"
                    className="w-full bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-[#334155] rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#FF6B00]"
                  />
                </div>
              </div>
            </div>

            {/* Preview Box */}
            <div className="mt-auto pt-4 border-t border-slate-200 dark:border-[#334155]">
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Calculated Condition Expression
              </span>
              <div className="p-3 bg-slate-100 dark:bg-[#0B1220] border border-[#FF6B00]/40 rounded-xl font-mono text-sm text-[#FF6B00] font-semibold overflow-x-auto whitespace-nowrap shadow-inner">
                {constructExpression()}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-[#334155] bg-slate-50 dark:bg-[#0B1220]">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            Tradetron AST Engine · Zero-Eval Safe
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 text-xs font-semibold transition"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#FF8A3D] text-white text-xs font-bold shadow-lg shadow-orange-500/20 hover:brightness-110 transition flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" /> Add Condition to Strategy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
