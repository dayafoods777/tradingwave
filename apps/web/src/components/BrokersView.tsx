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

export const ALL_BROKERS: BrokerInfo[] = [
  { name: 'Zerodha Kite', category: 'Discount', apiName: 'Kite Connect v3 REST & WebSocket', status: 'CONNECTED', algoCharge: '₹0 (Free on TradingWave)', segments: ['NSE EQ', 'NSE F&O', 'BSE', 'MCX'] },
  { name: 'Dhan', category: 'Discount', apiName: 'DhanHQ v2 Fast REST API', status: 'CONNECTED', algoCharge: 'Free Official API', segments: ['NSE EQ', 'NSE F&O', 'BSE', 'MCX', 'Currency'] },
  { name: 'Angel One', category: 'Full Service', apiName: 'SmartAPI REST v2', status: 'READY_TO_CONNECT', algoCharge: 'Free API', segments: ['NSE EQ', 'NSE F&O', 'BSE', 'MCX'] },
  { name: 'Groww', category: 'Discount', apiName: 'Groww Trading API v1', status: 'READY_TO_CONNECT', algoCharge: 'Free API', segments: ['NSE EQ', 'NSE F&O'] },
  { name: 'Fyers', category: 'Discount', apiName: 'Fyers API v3 WebSocket', status: 'READY_TO_CONNECT', algoCharge: 'Free API', segments: ['NSE EQ', 'NSE F&O', 'BSE', 'MCX'] },
  { name: 'Upstox', category: 'Discount', apiName: 'Upstox Pro API v2', status: 'READY_TO_CONNECT', algoCharge: 'Free API', segments: ['NSE EQ', 'NSE F&O', 'BSE', 'MCX'] },
  { name: 'Kotak Neo', category: 'Full Service', apiName: 'Neo Trade API v2', status: 'READY_TO_CONNECT', algoCharge: 'Free for Youth Plan', segments: ['NSE EQ', 'NSE F&O', 'BSE'] },
  { name: 'Finvasia', category: 'Discount', apiName: 'Shoonya API REST', status: 'READY_TO_CONNECT', algoCharge: 'Zero Brokerage & Free API', segments: ['NSE EQ', 'NSE F&O', 'MCX'] },
  { name: '5paisa', category: 'Discount', apiName: 'Open API 5paisa v2', status: 'READY_TO_CONNECT', algoCharge: 'Free API', segments: ['NSE EQ', 'NSE F&O', 'MCX'] },
  { name: 'AliceBlue', category: 'Discount', apiName: 'ANT Web API v2', status: 'READY_TO_CONNECT', algoCharge: 'Free API', segments: ['NSE EQ', 'NSE F&O', 'MCX'] },
  { name: 'FlatTrade', category: 'Discount', apiName: 'WallConnect Zero API', status: 'READY_TO_CONNECT', algoCharge: 'Zero Brokerage', segments: ['NSE EQ', 'NSE F&O'] },
  { name: 'Motilal Oswal', category: 'Full Service', apiName: 'MO Trading API', status: 'READY_TO_CONNECT', algoCharge: 'Free API', segments: ['NSE EQ', 'NSE F&O', 'BSE', 'MCX'] },
  { name: 'Paytm Money', category: 'Discount', apiName: 'Paytm Money Algo API', status: 'READY_TO_CONNECT', algoCharge: 'Free API', segments: ['NSE EQ', 'NSE F&O'] },
  { name: 'IIFL', category: 'Full Service', apiName: 'IIFL Blazr API', status: 'READY_TO_CONNECT', algoCharge: 'Free API', segments: ['NSE EQ', 'NSE F&O', 'BSE'] },
  { name: 'MStock', category: 'Discount', apiName: 'Mirae MStock API', status: 'READY_TO_CONNECT', algoCharge: 'Zero Brokerage Lifetime', segments: ['NSE EQ', 'NSE F&O'] },
  { name: 'Delta India', category: 'Crypto & Global', apiName: 'Delta Exchange API v2', status: 'READY_TO_CONNECT', algoCharge: 'Free API', segments: ['Crypto BTC/ETH Options'] },
  { name: 'CoinDCX', category: 'Crypto & Global', apiName: 'CoinDCX Pro API', status: 'READY_TO_CONNECT', algoCharge: 'Free API', segments: ['Crypto Futures'] },
  { name: 'Definedge', category: 'Discount', apiName: 'Definedge Securities API', status: 'READY_TO_CONNECT', algoCharge: 'Free API', segments: ['NSE EQ', 'NSE F&O'] },
  { name: 'Anand Rathi', category: 'Full Service', apiName: 'Trade Mobi API', status: 'READY_TO_CONNECT', algoCharge: 'Free API', segments: ['NSE EQ', 'NSE F&O'] },
  { name: 'Bigul', category: 'Discount', apiName: 'Bigul Speed API', status: 'READY_TO_CONNECT', algoCharge: 'Free API', segments: ['NSE EQ', 'NSE F&O'] },
  { name: 'Choice', category: 'Full Service', apiName: 'Jiffy Choice API', status: 'READY_TO_CONNECT', algoCharge: 'Free API', segments: ['NSE EQ', 'NSE F&O'] },
  { name: 'Firstock', category: 'Discount', apiName: 'TheFirstock API', status: 'READY_TO_CONNECT', algoCharge: 'Free API', segments: ['NSE EQ', 'NSE F&O'] },
  { name: 'Indira Securities', category: 'Full Service', apiName: 'Indira Trade API', status: 'READY_TO_CONNECT', algoCharge: 'Free API', segments: ['NSE EQ', 'NSE F&O'] },
  { name: 'Mastertrust', category: 'Discount', apiName: 'MasterConnect API', status: 'READY_TO_CONNECT', algoCharge: 'Free API', segments: ['NSE EQ', 'NSE F&O'] },
  { name: 'Nirmal Bang', category: 'Full Service', apiName: 'Beyond Trading API', status: 'READY_TO_CONNECT', algoCharge: 'Free API', segments: ['NSE EQ', 'NSE F&O'] },
  { name: 'Nuvama', category: 'Full Service', apiName: 'Nuvama Wealth API', status: 'READY_TO_CONNECT', algoCharge: 'Free API', segments: ['NSE EQ', 'NSE F&O'] },
  { name: 'ICICI Direct Breeze', category: 'Full Service', apiName: 'Breeze API v2', status: 'READY_TO_CONNECT', algoCharge: 'Free for Prime', segments: ['NSE EQ', 'NSE F&O'] },
  { name: 'HDFC Sky', category: 'Discount', apiName: 'Sky Algo API', status: 'READY_TO_CONNECT', algoCharge: 'Free API', segments: ['NSE EQ', 'NSE F&O'] },
  { name: 'Sharekhan', category: 'Full Service', apiName: 'Sharekhan Espresso API', status: 'READY_TO_CONNECT', algoCharge: 'Free API', segments: ['NSE EQ', 'NSE F&O'] },
  { name: 'Coinswitch', category: 'Crypto & Global', apiName: 'CoinSwitchX API', status: 'READY_TO_CONNECT', algoCharge: 'Free API', segments: ['Crypto Spot & Perps'] }
];

export default function BrokersView({ onConfigure }: { onConfigure: (brokerName: string) => void }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<'All' | 'Discount' | 'Full Service' | 'Crypto & Global'>('All');

  const filtered = ALL_BROKERS.filter(b => {
    const matchCat = category === 'All' || b.category === category;
    const matchSearch = b.name.toLowerCase().includes(search.toLowerCase()) || b.apiName.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#131B2E] via-[#15233E] to-[#131B2E] border border-[#1E293B] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#FF6600]">Broker Adapters</span>
          <h2 className="text-2xl font-black text-white mt-1">38+ Supported Indian & Global Brokers</h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Execute orders directly into your personal broker trading account with zero latency markup. TradingWave provides standardized order reconciliation, automatic token refresh, and universal pre-trade risk checks.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-[#0E1526] border border-[#1E293B] text-center">
            <div className="text-lg font-bold text-emerald-400">2 Active</div>
            <div className="text-[10px] text-slate-400 uppercase">Connected</div>
          </div>
          <div className="px-4 py-2 rounded-xl bg-[#0E1526] border border-[#1E293B] text-center">
            <div className="text-lg font-bold text-white">38 Total</div>
            <div className="text-[10px] text-slate-400 uppercase">Available</div>
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
            className="w-full bg-[#131B2E] border border-[#1E293B] rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#FF6600]"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto w-full sm:w-auto">
          {(['All', 'Discount', 'Full Service', 'Crypto & Global'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                category === cat ? 'bg-[#FF6600] text-white shadow-sm' : 'bg-[#131B2E] border border-[#1E293B] text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Brokers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(broker => (
          <div
            key={broker.name}
            className="p-5 rounded-2xl bg-[#131B2E] border border-[#1E293B] hover:border-slate-700 transition flex flex-col justify-between shadow-lg"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0E1526] border border-[#1E293B] flex items-center justify-center font-bold text-white text-sm shadow-inner">
                    {broker.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">{broker.name}</h3>
                    <span className="text-[10px] text-slate-400">{broker.category}</span>
                  </div>
                </div>

                {broker.status === 'CONNECTED' ? (
                  <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Connected
                  </span>
                ) : (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-medium">
                    Ready
                  </span>
                )}
              </div>

              <div className="p-3 bg-[#0E1526] rounded-xl border border-[#1E293B] space-y-1.5 mb-4 text-xs font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>API Protocol:</span>
                  <span className="text-white font-sans text-[11px]">{broker.apiName}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Algo Fees:</span>
                  <span className="text-emerald-400 font-sans text-[11px] font-semibold">{broker.algoCharge}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {broker.segments.map(seg => (
                  <span key={seg} className="text-[10px] px-2 py-0.5 rounded bg-slate-800/80 text-slate-400 font-semibold">
                    {seg}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => onConfigure(broker.name)}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${
                broker.status === 'CONNECTED'
                  ? 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                  : 'bg-gradient-to-r from-[#FF6600] to-[#E65C00] text-white shadow-md shadow-orange-500/20 hover:brightness-110'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span>{broker.status === 'CONNECTED' ? 'Manage Credentials & Token' : 'Connect Broker API'}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
