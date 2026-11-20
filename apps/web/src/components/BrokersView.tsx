'use client';

import React, { useState } from 'react';
import { Search, ShieldCheck, CheckCircle2, Key, ExternalLink, Zap, Server } from 'lucide-react';

interface BrokerInfo {
  name: string;
  category: 'Discount' | 'Full Service' | 'Crypto & Global';
  apiName: string;
  status: 'CONNECTED' | 'READY_TO_CONNECT' | 'CONFIGURED';
  algoCharge: string;
  segments: string[];
}

export const ALL_BROKERS_BASE: Omit<BrokerInfo, 'status'>[] = [
  { name: 'Zerodha Kite', category: 'Discount', apiName: 'Kite Connect v3 REST & WebSocket', algoCharge: 'Free Official API', segments: ['NSE EQ', 'NSE F&O', 'BSE', 'MCX'] },
  { name: 'Dhan', category: 'Discount', apiName: 'DhanHQ v2 Fast REST API', algoCharge: 'Free Official API', segments: ['NSE EQ', 'NSE F&O', 'BSE', 'MCX', 'Currency'] },
  { name: 'Angel One', category: 'Full Service', apiName: 'SmartAPI REST v2', algoCharge: 'Free API', segments: ['NSE EQ', 'NSE F&O', 'BSE', 'MCX'] },
  { name: 'Groww', category: 'Discount', apiName: 'Groww Trading API v1', algoCharge: 'Free API', segments: ['NSE EQ', 'NSE F&O'] },
  { name: 'Fyers', category: 'Discount', apiName: 'Fyers API v3 WebSocket', algoCharge: 'Free API', segments: ['NSE EQ', 'NSE F&O', 'BSE', 'MCX'] },
  { name: 'Upstox', category: 'Discount', apiName: 'Upstox Pro API v2', algoCharge: 'Free API', segments: ['NSE EQ', 'NSE F&O', 'BSE', 'MCX'] },
  { name: 'Kotak Neo', category: 'Full Service', apiName: 'Neo Trade API v2', algoCharge: 'Free for Youth Plan', segments: ['NSE EQ', 'NSE F&O', 'BSE'] },
  { name: 'Finvasia', category: 'Discount', apiName: 'Shoonya API REST', algoCharge: 'Zero Brokerage & Free API', segments: ['NSE EQ', 'NSE F&O', 'MCX'] },
  { name: '5paisa', category: 'Discount', apiName: 'Open API 5paisa v2', algoCharge: 'Free API', segments: ['NSE EQ', 'NSE F&O', 'MCX'] },
  { name: 'AliceBlue', category: 'Discount', apiName: 'ANT Web API v2', algoCharge: 'Free API', segments: ['NSE EQ', 'NSE F&O', 'MCX'] },
  { name: 'FlatTrade', category: 'Discount', apiName: 'WallConnect Zero API', algoCharge: 'Zero Brokerage', segments: ['NSE EQ', 'NSE F&O'] },
  { name: 'Motilal Oswal', category: 'Full Service', apiName: 'MO Trading API', algoCharge: 'Free API', segments: ['NSE EQ', 'NSE F&O', 'BSE', 'MCX'] },
  { name: 'Paytm Money', category: 'Discount', apiName: 'Paytm Money Algo API', algoCharge: 'Free API', segments: ['NSE EQ', 'NSE F&O'] },
  { name: 'IIFL', category: 'Full Service', apiName: 'IIFL Blazr API', algoCharge: 'Free API', segments: ['NSE EQ', 'NSE F&O', 'BSE'] },
  { name: 'MStock', category: 'Discount', apiName: 'Mirae MStock API', algoCharge: 'Zero Brokerage Lifetime', segments: ['NSE EQ', 'NSE F&O'] },
  { name: 'Delta India', category: 'Crypto & Global', apiName: 'Delta Exchange API v2', algoCharge: 'Free API', segments: ['Crypto BTC/ETH Options'] },
  { name: 'CoinDCX', category: 'Crypto & Global', apiName: 'CoinDCX Pro API', algoCharge: 'Free API', segments: ['Crypto Futures'] },
  { name: 'Definedge', category: 'Discount', apiName: 'Definedge Securities API', algoCharge: 'Free API', segments: ['NSE EQ', 'NSE F&O'] },
  { name: 'Anand Rathi', category: 'Full Service', apiName: 'Trade Mobi API', algoCharge: 'Free API', segments: ['NSE EQ', 'NSE F&O'] },
  { name: 'Bigul', category: 'Discount', apiName: 'Bigul Speed API', algoCharge: 'Free API', segments: ['NSE EQ', 'NSE F&O'] },
  { name: 'Choice', category: 'Full Service', apiName: 'Jiffy Choice API', algoCharge: 'Free API', segments: ['NSE EQ', 'NSE F&O'] },
  { name: 'Firstock', category: 'Discount', apiName: 'TheFirstock API', algoCharge: 'Free API', segments: ['NSE EQ', 'NSE F&O'] },
  { name: 'Indira Securities', category: 'Full Service', apiName: 'Indira Trade API', algoCharge: 'Free API', segments: ['NSE EQ', 'NSE F&O'] },
  { name: 'Mastertrust', category: 'Discount', apiName: 'MasterConnect API', algoCharge: 'Free API', segments: ['NSE EQ', 'NSE F&O'] },
  { name: 'Nirmal Bang', category: 'Full Service', apiName: 'Beyond Trading API', algoCharge: 'Free API', segments: ['NSE EQ', 'NSE F&O'] },
  { name: 'Nuvama', category: 'Full Service', apiName: 'Nuvama Wealth API', algoCharge: 'Free API', segments: ['NSE EQ', 'NSE F&O'] },
  { name: 'ICICI Direct Breeze', category: 'Full Service', apiName: 'Breeze API v2', algoCharge: 'Free for Prime', segments: ['NSE EQ', 'NSE F&O'] },
  { name: 'HDFC Sky', category: 'Discount', apiName: 'Sky Algo API', algoCharge: 'Free API', segments: ['NSE EQ', 'NSE F&O'] },
  { name: 'Sharekhan', category: 'Full Service', apiName: 'Sharekhan Espresso API', algoCharge: 'Free API', segments: ['NSE EQ', 'NSE F&O'] },
  { name: 'Coinswitch', category: 'Crypto & Global', apiName: 'CoinSwitchX API', algoCharge: 'Free API', segments: ['Crypto Spot & Perps'] }
];

interface BrokersViewProps {
  onConfigure: (brokerName: string) => void;
  connectedBrokers?: string[];
}

export default function BrokersView({ onConfigure, connectedBrokers = [] }: BrokersViewProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<'All' | 'Discount' | 'Full Service' | 'Crypto & Global'>('All');

  const brokersList: BrokerInfo[] = ALL_BROKERS_BASE.map(b => ({
    ...b,
    status: connectedBrokers.includes(b.name) ? 'CONNECTED' : 'READY_TO_CONNECT'
  }));

  const filtered = brokersList.filter(b => {
    const matchCat = category === 'All' || b.category === category;
    const matchSearch = b.name.toLowerCase().includes(search.toLowerCase()) || b.apiName.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-orange-50/70 via-slate-50 to-orange-50/70 dark:from-[#131B2E] dark:via-[#15233E] dark:to-[#131B2E] border border-slate-200 dark:border-[#1E293B] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#FF6600]">Broker Adapters</span>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">38+ Supported Indian & Global Brokers</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Execute orders directly into your personal broker trading account with zero latency markup. TradingWave provides standardized order reconciliation, automatic token refresh, and universal pre-trade risk checks.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-white dark:bg-[#0E1526] border border-slate-200 dark:border-[#1E293B] text-center shadow-sm">
            <div className={`text-lg font-bold ${connectedBrokers.length > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}`}>
              {connectedBrokers.length} Active
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase">Connected</div>
          </div>
          <div className="px-4 py-2 rounded-xl bg-white dark:bg-[#0E1526] border border-slate-200 dark:border-[#1E293B] text-center shadow-sm">
            <div className="text-lg font-bold text-slate-900 dark:text-white">{ALL_BROKERS_BASE.length} Total</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase">Available</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search brokers (Zerodha, Dhan, Angel One, Groww)..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-[#1E293B] rounded-xl pl-9 pr-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#FF6600]"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto w-full sm:w-auto">
          {(['All', 'Discount', 'Full Service', 'Crypto & Global'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${category === cat ? 'bg-[#FF6600] text-white shadow-sm' : 'bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-[#1E293B] text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Brokers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(broker => (
          <div
            key={broker.name}
            className="p-5 rounded-2xl bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-[#1E293B] flex flex-col justify-between hover:border-[#FF6600]/40 transition shadow-sm dark:shadow-md"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {broker.category}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${broker.status === 'CONNECTED'
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}>
                  {broker.status === 'CONNECTED' ? '● Connected' : 'Ready to Connect'}
                </span>
              </div>

              <h3 className="font-bold text-base text-slate-900 dark:text-white">{broker.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">{broker.apiName}</p>

              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-500">API Cost:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">{broker.algoCharge}</span>
              </div>

              <div className="mt-2 flex flex-wrap gap-1">
                {broker.segments.map(s => (
                  <span key={s} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-50 dark:bg-[#0E1526] border border-slate-200 dark:border-[#1E293B] text-slate-600 dark:text-slate-400 font-mono">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2">
              <button
                onClick={() => onConfigure(broker.name)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${broker.status === 'CONNECTED'
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white hover:bg-slate-200'
                  : 'bg-gradient-to-r from-[#FF6600] to-[#E65C00] text-white shadow-md shadow-orange-500/20 hover:brightness-110'
                  }`}
              >
                <Key className="w-3.5 h-3.5" />
                <span>{broker.status === 'CONNECTED' ? 'Edit Credentials' : 'Connect Account'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
