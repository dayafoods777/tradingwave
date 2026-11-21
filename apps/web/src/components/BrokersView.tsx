'use client';

import PageHeader from './ui/PageHeader';
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
  { name: 'Coinswitch', category: 'Crypto & Global', apiName: 'CoinSwitchX API', algoCharge: 'Free API', segments: ['Crypto Spot & Perps'] },
  { name: 'Tradejini', category: 'Discount', apiName: 'CubePlus API v2', algoCharge: 'Free API', segments: ['NSE EQ', 'NSE F&O', 'MCX'] },
  { name: 'SAS Online', category: 'Discount', apiName: 'Alpha API REST', algoCharge: 'Free API', segments: ['NSE EQ', 'NSE F&O', 'MCX'] },
  { name: 'Swastika', category: 'Full Service', apiName: 'Justrade Open API', algoCharge: 'Free API', segments: ['NSE EQ', 'NSE F&O', 'BSE'] },
  { name: 'Trustline', category: 'Full Service', apiName: 'TrustTrade API v2', algoCharge: 'Free API', segments: ['NSE EQ', 'NSE F&O', 'MCX'] },
  { name: 'SMC Global', category: 'Full Service', apiName: 'SMC Easy Trade API', algoCharge: 'Free API', segments: ['NSE EQ', 'NSE F&O', 'BSE', 'MCX'] },
  { name: 'Profitmart', category: 'Discount', apiName: 'Profitmart Open API', algoCharge: 'Zero Brokerage / Free API', segments: ['NSE EQ', 'NSE F&O'] },
  { name: 'Axis Direct', category: 'Full Service', apiName: 'Axis Direct Ring API', algoCharge: 'Free API', segments: ['NSE EQ', 'NSE F&O', 'BSE'] },
  { name: 'Geojit', category: 'Full Service', apiName: 'Geojit Selfie API', algoCharge: 'Free API', segments: ['NSE EQ', 'NSE F&O'] }
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
    <div className="space-y-5 pb-8">
      <PageHeader
        title="Brokers"
        description="Orders go straight into your own broker account through its official API. Token refresh, reconciliation and pre-trade risk checks are handled for every adapter."
        actions={
          <div className="flex items-center gap-4 rounded-md border border-border bg-surface px-3 py-1.5 text-[12px]">
            <span className="text-fg-muted">Connected <span className={`ml-1 font-mono tnum ${connectedBrokers.length ? 'text-profit' : 'text-fg'}`}>{connectedBrokers.length}</span></span>
            <span className="h-3 w-px bg-border" />
            <span className="text-fg-muted">Available <span className="ml-1 font-mono tnum text-fg">{ALL_BROKERS_BASE.length}</span></span>
          </div>
        }
      />

      <div className="overflow-hidden rounded-lg border border-border bg-surface">
        <div className="flex flex-col gap-3 border-b border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-fg-muted" />
            <input
              type="text"
              placeholder="Search brokers or APIs"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="tw-input pl-8"
            />
          </div>
          <div className="no-scrollbar flex overflow-x-auto rounded-md border border-border bg-subtle p-0.5">
            {(['All', 'Discount', 'Full Service', 'Crypto & Global'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`h-6 whitespace-nowrap rounded px-2.5 text-[12px] font-medium transition-colors ${
                  category === cat ? 'bg-surface text-fg shadow-hairline' : 'text-fg-muted hover:text-fg'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-[13px]">
            <thead className="border-b border-border bg-subtle text-[11px] text-fg-muted">
              <tr>
                <th className="px-4 py-2 font-medium">Broker</th>
                <th className="px-3 py-2 font-medium">Type</th>
                <th className="px-3 py-2 font-medium">Segments</th>
                <th className="px-3 py-2 font-medium">API cost</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-4 py-2 text-right font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(broker => {
                const connected = broker.status === 'CONNECTED';
                return (
                  <tr key={broker.name} className="transition-colors hover:bg-subtle">
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border bg-subtle text-[11px] font-semibold text-fg-secondary">
                          {broker.name.replace(/[^A-Za-z0-9]/g, '').slice(0, 2).toUpperCase()}
                        </span>
                        <div className="min-w-0">
                          <div className="font-medium text-fg">{broker.name}</div>
                          <div className="truncate font-mono text-[11px] text-fg-muted">{broker.apiName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-[12px] text-fg-secondary">{broker.category}</td>
                    <td className="px-3 py-2.5">
                      <div className="flex flex-wrap gap-1">
                        {broker.segments.map(s => (
                          <span key={s} className="rounded border border-border px-1 font-mono text-[10.5px] leading-4 text-fg-secondary">{s}</span>
                        ))}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-[12px] text-fg-secondary">{broker.algoCharge}</td>
                    <td className="whitespace-nowrap px-3 py-2.5">
                      <span className={`inline-flex items-center gap-1.5 text-[12px] ${connected ? 'text-profit' : 'text-fg-muted'}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${connected ? 'bg-profit' : 'bg-border-strong'}`} />
                        {connected ? 'Connected' : 'Not connected'}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <button onClick={() => onConfigure(broker.name)} className={connected ? 'tw-btn-ghost h-7 text-[12px]' : 'tw-btn-secondary h-7 text-[12px]'}>
                        <Key className="h-3 w-3" /> {connected ? 'Edit keys' : 'Connect'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="px-4 py-12 text-center text-[13px] text-fg-muted">No brokers match “{search}”.</div>
          )}
        </div>
      </div>
    </div>
  );
}
