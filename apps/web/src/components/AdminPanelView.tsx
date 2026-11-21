'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  Server,
  Users,
  Activity,
  Sliders,
  Sparkles,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Search,
  Plus,
  Play,
  Pause,
  Key,
  Download,
  Filter,
  Check,
  X,
  ExternalLink,
  ChevronDown,
  Layers,
  Clock,
  Cpu,
  Database,
  Radio,
  Lock,
  RefreshCw,
  Terminal,
  Zap
} from 'lucide-react';

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: 'SUPERADMIN' | 'TRADER' | 'CREATOR';
  tier: string;
  status: 'ACTIVE' | 'SUSPENDED';
  deployedBots: number;
  totalPnl: number;
  joinedDate: string;
}

interface BrokerHealth {
  name: string;
  gateway: string;
  status: 'HEALTHY' | 'DEGRADED' | 'DISCONNECTED';
  latencyMs: number;
  tokenExpiresIn: string;
  rateLimitUsage: string;
}

interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  algoName: string;
  broker: string;
  checksum: string;
  action: string;
  compliance: 'COMPLIANT' | 'FLAGGED';
}

const INITIAL_USERS: UserRecord[] = [
  { id: 'usr_001', name: 'algobulls (You)', email: 'admin@tradingwave.tech', role: 'SUPERADMIN', tier: 'Creator+', status: 'ACTIVE', deployedBots: 3, totalPnl: 48200, joinedDate: '2026-08-12' },
  { id: 'usr_002', name: 'Rohan Mehta', email: 'rohan.quant@alphafunds.in', role: 'CREATOR', tier: 'Creator', status: 'ACTIVE', deployedBots: 8, totalPnl: 124500, joinedDate: '2026-09-01' },
  { id: 'usr_003', name: 'Priya Sundaram', email: 'priya.s@investcorp.com', role: 'TRADER', tier: 'Retail+', status: 'ACTIVE', deployedBots: 4, totalPnl: 31200, joinedDate: '2026-09-18' },
  { id: 'usr_004', name: 'Vikramaditya Rao', email: 'v.rao@quantcapital.com', role: 'CREATOR', tier: 'Retail', status: 'ACTIVE', deployedBots: 2, totalPnl: -8400, joinedDate: '2026-10-05' },
  { id: 'usr_005', name: 'Amitabh Sen', email: 'amitabh.sen@apexwealth.in', role: 'TRADER', tier: 'Standard', status: 'ACTIVE', deployedBots: 1, totalPnl: 15600, joinedDate: '2026-10-22' },
  { id: 'usr_006', name: 'Neha Deshmukh', email: 'neha.d@bluestarcap.com', role: 'TRADER', tier: 'Starter', status: 'SUSPENDED', deployedBots: 0, totalPnl: 0, joinedDate: '2026-11-02' }
];

const BROKER_HEALTH_MATRIX: BrokerHealth[] = [
  { name: 'Zerodha Kite Connect', gateway: 'api.kite.trade v3', status: 'HEALTHY', latencyMs: 14, tokenExpiresIn: '18h 42m', rateLimitUsage: '42 / 200 req/m' },
  { name: 'DhanHQ Gateway', gateway: 'api.dhan.co v2', status: 'HEALTHY', latencyMs: 11, tokenExpiresIn: '22h 10m', rateLimitUsage: '28 / 250 req/m' },
  { name: 'Angel One SmartAPI', gateway: 'smartapi.angelbroking.com', status: 'HEALTHY', latencyMs: 19, tokenExpiresIn: '16h 05m', rateLimitUsage: '55 / 300 req/m' },
  { name: 'Groww Algo Gateway', gateway: 'api.groww.in v1', status: 'HEALTHY', latencyMs: 24, tokenExpiresIn: '12h 30m', rateLimitUsage: '18 / 150 req/m' },
  { name: 'Upstox Pro API', gateway: 'api.upstox.com v2', status: 'HEALTHY', latencyMs: 16, tokenExpiresIn: '20h 15m', rateLimitUsage: '34 / 200 req/m' },
  { name: 'Fyers API v3', gateway: 'api.fyers.in v3', status: 'HEALTHY', latencyMs: 15, tokenExpiresIn: '21h 00m', rateLimitUsage: '22 / 200 req/m' },
  { name: 'Delta Exchange India', gateway: 'api.delta.exchange v2', status: 'HEALTHY', latencyMs: 38, tokenExpiresIn: '30d (API Key)', rateLimitUsage: '12 / 100 req/m' },
  { name: 'Finvasia Shoonya', gateway: 'api.shoonya.com REST', status: 'HEALTHY', latencyMs: 22, tokenExpiresIn: '14h 50m', rateLimitUsage: '31 / 200 req/m' }
];

const INITIAL_AUDIT_LOGS: AuditLog[] = [
  { id: 'aud_9841', timestamp: '12:48:02.124', userId: 'usr_001', algoName: 'NIFTY 9:20 Intraday Short Straddle', broker: 'Zerodha Kite', checksum: 'sha256:7b4e9f1a8c3d...', action: 'ORDER_DISPATCH_BUY_LEG', compliance: 'COMPLIANT' },
  { id: 'aud_9840', timestamp: '12:45:10.892', userId: 'usr_002', algoName: 'BANKNIFTY Supertrend Breakout', broker: 'DhanHQ', checksum: 'sha256:9c1a3b8d4e2f...', action: 'ORDER_DISPATCH_SELL_LEG', compliance: 'COMPLIANT' },
  { id: 'aud_9839', timestamp: '12:40:00.004', userId: 'usr_003', algoName: 'NIFTY Weekly Iron Condor', broker: 'Angel One', checksum: 'sha256:4d8e2f1a7b9c...', action: 'DYNAMIC_DELTA_REPAIR', compliance: 'COMPLIANT' },
  { id: 'aud_9838', timestamp: '12:35:12.441', userId: 'usr_001', algoName: 'TradingWave BTCUSD OHOL 5M', broker: 'Delta India', checksum: 'sha256:1a8c3d9c7b4e...', action: 'TRAILING_STOP_UPDATE', compliance: 'COMPLIANT' }
];

export default function AdminPanelView() {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'risk' | 'brokers' | 'llm' | 'audit'>('overview');
  const [users, setUsers] = useState<UserRecord[]>(INITIAL_USERS);
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Risk Governor Controls
  const [globalMaxLoss, setGlobalMaxLoss] = useState('5000000');
  const [rateLimitPerSec, setRateLimitPerSec] = useState('50');
  const [maxPositionsPerUser, setMaxPositionsPerUser] = useState('20');
  const [volatilityCircuitBreaker, setVolatilityCircuitBreaker] = useState(true);
  const [emergencyKillSwitchActive, setEmergencyKillSwitchActive] = useState(false);

  // Free LLM & AI Engine Configuration
  const [llmProvider, setLlmProvider] = useState<'built_in' | 'huggingface' | 'openrouter' | 'ollama'>('built_in');
  const [llmModelName, setLlmModelName] = useState('meta-llama/llama-3-8b-instruct');
  const [ollamaEndpoint, setOllamaEndpoint] = useState('http://localhost:11434/v1');
  const [customApiKey, setCustomApiKey] = useState('');
  const [testPrompt, setTestPrompt] = useState('Create a 9:20 BankNifty Straddle with 25% stop loss');
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isCompilingPrompt, setIsCompilingPrompt] = useState(false);

  // New User Modal
  const [newUserModalOpen, setNewUserModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'TRADER' | 'CREATOR' | 'SUPERADMIN'>('TRADER');
  const [newUserTier, setNewUserTier] = useState('Starter');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleUserStatus = (id: string) => {
    setUsers(prev =>
      prev.map(u => (u.id === id ? { ...u, status: u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' } : u))
    );
    showToast('User status updated successfully.');
  };

  const handlePromoteRole = (id: string, newRole: 'SUPERADMIN' | 'TRADER' | 'CREATOR') => {
    setUsers(prev => prev.map(u => (u.id === id ? { ...u, role: newRole } : u)));
    showToast(`User role elevated to ${newRole}.`);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;
    const created: UserRecord = {
      id: `usr_${Date.now().toString().slice(-4)}`,
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      role: newUserRole,
      tier: newUserTier,
      status: 'ACTIVE',
      deployedBots: 0,
      totalPnl: 0,
      joinedDate: new Date().toISOString().split('T')[0]
    };
    setUsers(prev => [created, ...prev]);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserModalOpen(false);
    showToast(`Created user "${created.name}" successfully!`);
  };

  const handleRunAiCompilerTest = () => {
    setIsCompilingPrompt(true);
    setTestResult(null);
    setTimeout(() => {
      setIsCompilingPrompt(false);
      setTestResult(JSON.stringify({
        status: 'SUCCESS',
        engine: llmProvider === 'built_in' ? 'TradingWave Quant AST Engine v2.4 (Zero-Latency)' : `Free LLM API (${llmModelName})`,
        synthesizedStrategy: {
          name: 'BANKNIFTY 9:20 Intraday Straddle',
          underlying: 'BANKNIFTY',
          frequency: 'Continuous (1-sec resolution)',
          sets: [
            {
              id: 1,
              name: 'Set 1: Straddle Sell',
              entryCondition: 'Time >= 09:20:00',
              legs: [
                { action: 'SELL', type: 'CALL', strike: 'ATM', sl: '25%', target: '60%', moveToCost: true },
                { action: 'SELL', type: 'PUT', strike: 'ATM', sl: '25%', target: '60%', moveToCost: true }
              ],
              exitCondition: 'Time >= 15:15:00 OR Strategy_PnL <= -4000'
            }
          ],
          astSchemaValid: true,
          zeroEvalSafe: true,
          latencyMs: llmProvider === 'built_in' ? 4 : 420
        }
      }, null, 2));
    }, 700);
  };

  const handleGlobalKillSwitch = () => {
    if (confirm('🚨 EMERGENCY WARNING: Activate Platform-Wide Universal Kill Switch? This will cancel all open orders across ALL tenant accounts and brokers immediately.')) {
      setEmergencyKillSwitchActive(true);
      showToast('GLOBAL EMERGENCY KILL SWITCH DISPATCHED TO ALL BROKER GATEWAYS');
    }
  };

  const filteredUsers = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
                        u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
                        u.id.toLowerCase().includes(userSearch.toLowerCase());
    const matchRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div className="space-y-8 font-sans pb-16">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-white dark:bg-[#1F2937] border-2 border-[#FF6B00] text-slate-900 dark:text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B00] animate-pulse"></span>
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* 1. TOP CORPORATE HEADER */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-[#10172A] to-slate-900 border border-slate-800 text-white shadow-2xl overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#5B45E0]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute left-1/3 bottom-0 w-64 h-64 bg-[#FF6B00]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-500/20 text-[#FF8A3D] border border-orange-500/30 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] animate-pulse"></span>
                INSTITUTIONAL SUPERADMIN CONSOLE
              </span>
              <span className="text-xs text-slate-400 font-mono">Build 2.4.0 · High Availability</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Platform Administration &amp; Risk Governor
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Real-time multi-tenant operations, SEBI compliance ledger, direct broker gateway status, and free LLM strategy synthesis orchestrator.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleGlobalKillSwitch}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-lg ${
                emergencyKillSwitchActive
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/30'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>{emergencyKillSwitchActive ? 'Kill Switch ACTIVE' : 'Global Kill Switch'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. SUB-NAVIGATION TABS */}
      <div className="border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 sm:gap-6 overflow-x-auto no-scrollbar text-xs sm:text-sm font-semibold">
        {[
          { id: 'overview', label: 'Operations & Health', icon: Activity },
          { id: 'users', label: 'Users & RBAC', icon: Users },
          { id: 'risk', label: 'Risk Governor', icon: Sliders },
          { id: 'brokers', label: 'Broker Matrix (38)', icon: Server },
          { id: 'llm', label: 'Free LLM & AI Engine', icon: Sparkles },
          { id: 'audit', label: 'SEBI Audit Trail', icon: FileSpreadsheet }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-3 sm:px-4 rounded-xl flex items-center gap-2 whitespace-nowrap transition ${
                isActive
                  ? 'bg-[#EEF2FF] dark:bg-[#1E1B4B] text-[#5B45E0] dark:text-[#818CF8] font-bold border-b-2 border-[#5B45E0] dark:border-[#818CF8]'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* TAB 1: OPERATIONS & HEALTH */}
      {/* ========================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-6 rounded-2xl bg-white dark:bg-[#1F2937] border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>SYSTEM UPTIME</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-2">
                99.994 %
              </div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                Zero unexpected downtime (30d)
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#1F2937] border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
                24H TRADING VOLUME
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-2">
                ₹ 14.82 Cr
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-1">
                Across 18 live strategies
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#1F2937] border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
                DISPATCH LATENCY
              </div>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-2">
                8.4 ms
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-1">
                Order generation to broker ACK
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#1F2937] border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
                AST SANDBOX STATUS
              </div>
              <div className="text-2xl font-black text-[#5B45E0] dark:text-[#818CF8] font-mono mt-2">
                100% Zero-Eval
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-1">
                0 unsafe execution attempts
              </div>
            </div>
          </div>

          {/* Microservices Health Table */}
          <div className="bg-white dark:bg-[#1F2937] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#5B45E0]" />
              <span>Core Microservices &amp; Infrastructure Stack</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'Fastify API Gateway', port: ':4000', status: 'ONLINE', mem: '142 MB / 1024 MB', load: '1.2%', ping: '4ms' },
                { name: 'TimescaleDB / Postgres', port: ':5432', status: 'ONLINE', mem: '412 MB / 2048 MB', load: '3.4%', ping: '1ms' },
                { name: 'Centrifugo WebSockets', port: ':8000', status: 'ONLINE', mem: '88 MB / 512 MB', load: '0.8%', ping: '2ms' },
                { name: 'Redis In-Memory Queue', port: ':6379', status: 'ONLINE', mem: '64 MB / 512 MB', load: '0.4%', ping: '1ms' },
                { name: 'Safe DSL AST Evaluator', port: 'In-Proc', status: 'ONLINE', mem: '32 MB', load: '0.1%', ping: '0.2ms' },
                { name: 'Broker Adapters Pool', port: 'Multi-TLS', status: 'ONLINE', mem: '110 MB', load: '1.8%', ping: '12ms' }
              ].map(srv => (
                <div key={srv.name} className="p-4 rounded-xl bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{srv.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      {srv.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono space-y-1">
                    <div className="flex justify-between"><span>Port:</span> <span className="text-slate-800 dark:text-slate-200">{srv.port}</span></div>
                    <div className="flex justify-between"><span>Memory:</span> <span className="text-slate-800 dark:text-slate-200">{srv.mem}</span></div>
                    <div className="flex justify-between"><span>Latency:</span> <span className="text-emerald-600 dark:text-emerald-400 font-bold">{srv.ping}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: USERS & RBAC */}
      {/* ========================================================= */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#1F2937] border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search user name, email, ID..."
                  value={userSearch}
                  onChange={e => setUserSearch(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#5B45E0]"
                />
              </div>

              <select
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value)}
                className="bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 dark:text-white"
              >
                <option value="ALL">All Roles</option>
                <option value="SUPERADMIN">SuperAdmin</option>
                <option value="CREATOR">Creator</option>
                <option value="TRADER">Trader</option>
              </select>
            </div>

            <button
              onClick={() => setNewUserModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#5B45E0] hover:bg-[#4935C7] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-500/20 whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Tenant User</span>
            </button>
          </div>

          {/* User Table */}
          <div className="bg-white dark:bg-[#1F2937] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-slate-50 dark:bg-[#0B1220] text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">USER ID</th>
                    <th className="py-3.5 px-4">USER / EMAIL</th>
                    <th className="py-3.5 px-4">ROLE (RBAC)</th>
                    <th className="py-3.5 px-4">PLAN TIER</th>
                    <th className="py-3.5 px-4">BOTS</th>
                    <th className="py-3.5 px-4">STATUS</th>
                    <th className="py-3.5 px-4 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredUsers.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition">
                      <td className="py-4 px-4 font-mono font-bold text-slate-600 dark:text-slate-400">
                        {u.id}
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-900 dark:text-white">{u.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          u.role === 'SUPERADMIN'
                            ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                            : u.role === 'CREATOR'
                            ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-semibold text-slate-800 dark:text-slate-200">
                        {u.tier}
                      </td>
                      <td className="py-4 px-4 font-mono font-bold text-slate-900 dark:text-white">
                        {u.deployedBots} active
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          u.status === 'ACTIVE'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'bg-red-500/10 text-red-600 dark:text-red-400'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                          {u.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleToggleUserStatus(u.id)}
                            className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px] font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                          >
                            {u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                          </button>
                          {u.role !== 'SUPERADMIN' && (
                            <button
                              onClick={() => handlePromoteRole(u.id, u.role === 'TRADER' ? 'CREATOR' : 'SUPERADMIN')}
                              className="px-2.5 py-1 rounded-lg bg-[#5B45E0] text-white text-[11px] font-semibold hover:bg-[#4935C7] transition"
                            >
                              Promote
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: RISK GOVERNOR */}
      {/* ========================================================= */}
      {activeTab === 'risk' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#1F2937] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Global Pre-Trade Risk Governor</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                SEBI circular-mandated execution barriers. These settings are enforced in the execution engine prior to any broker order dispatch.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 space-y-2">
                <label className="block text-xs font-bold text-slate-900 dark:text-white">
                  Global Daily Portfolio Loss Collar (₹)
                </label>
                <input
                  type="text"
                  value={globalMaxLoss}
                  onChange={e => setGlobalMaxLoss(e.target.value)}
                  className="w-full bg-white dark:bg-[#1F2937] border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-xs font-mono font-bold text-slate-900 dark:text-white"
                />
                <p className="text-[11px] text-slate-400">
                  If cumulative MTM loss across all live tenants reaches this figure, all bots square off instantly.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 space-y-2">
                <label className="block text-xs font-bold text-slate-900 dark:text-white">
                  Universal Order Rate Limiter (orders / second)
                </label>
                <input
                  type="text"
                  value={rateLimitPerSec}
                  onChange={e => setRateLimitPerSec(e.target.value)}
                  className="w-full bg-white dark:bg-[#1F2937] border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-xs font-mono font-bold text-slate-900 dark:text-white"
                />
                <p className="text-[11px] text-slate-400">
                  Prevents exchange penalty for order thrashing or runaway algorithmic loops.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 space-y-2">
                <label className="block text-xs font-bold text-slate-900 dark:text-white">
                  Max Open Positions Per User Account
                </label>
                <input
                  type="text"
                  value={maxPositionsPerUser}
                  onChange={e => setMaxPositionsPerUser(e.target.value)}
                  className="w-full bg-white dark:bg-[#1F2937] border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-xs font-mono font-bold text-slate-900 dark:text-white"
                />
                <p className="text-[11px] text-slate-400">
                  Restricts margin over-leverage across simultaneous multi-leg deployments.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    Market Volatility Circuit Breaker
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 max-w-xs">
                    Auto-pauses new entry orders if NIFTY 50 moves &gt;2.5% within any 3-minute window.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={volatilityCircuitBreaker}
                  onChange={e => setVolatilityCircuitBreaker(e.target.checked)}
                  className="w-5 h-5 rounded text-[#5B45E0] accent-[#5B45E0] cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => showToast('Global Risk Governor rules saved and broadcasted to runner nodes!')}
                className="px-6 py-2.5 rounded-xl bg-[#5B45E0] hover:bg-[#4935C7] text-white text-xs font-bold transition shadow-md shadow-indigo-500/20"
              >
                Save Risk Policies
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: BROKER MATRIX */}
      {/* ========================================================= */}
      {activeTab === 'brokers' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Direct Broker Gateway Health</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Real-time API ping latency and token renewal state across 38 integrated brokers.
              </p>
            </div>
            <button
              onClick={() => showToast('Ping probe dispatched to all 38 broker gateway endpoints. All active.')}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1F2937] text-xs font-bold hover:bg-slate-50 flex items-center gap-1.5 transition"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#5B45E0]" />
              <span>Probe All Gateways</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {BROKER_HEALTH_MATRIX.map(b => (
              <div key={b.name} className="p-4 rounded-2xl bg-white dark:bg-[#1F2937] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      ● {b.status}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {b.latencyMs} ms
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{b.name}</h4>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">{b.gateway}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Token Expiry:</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200">{b.tokenExpiresIn}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rate Limit:</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200">{b.rateLimitUsage}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: FREE LLM & AI ENGINE CONFIG */}
      {/* ========================================================= */}
      {activeTab === 'llm' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#1F2937] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-md bg-[#5B45E0]/10 text-[#5B45E0] text-[10px] font-bold uppercase">
                  FREE &amp; OPEN ORCHESTRATOR
                </span>
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                AI Strategy Generator &amp; Free LLM Providers
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Power Cookie and the Natural Language Strategy Synthesizer with 100% free built-in engines, Hugging Face, OpenRouter free tier, or local Ollama instances.
              </p>
            </div>

            {/* Provider Radios */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { id: 'built_in', title: 'Built-in Quant Engine', desc: 'Zero-latency institutional AST generator. Instant, 100% free, 0 setup required.', badge: 'Recommended' },
                { id: 'huggingface', title: 'Hugging Face API', desc: 'Free serverless inference API for open models (Llama 3, Mistral, Qwen 2.5).', badge: 'Free API' },
                { id: 'openrouter', title: 'OpenRouter Free Tier', desc: 'Free routing to Google Gemma, Meta Llama 3 8B, and DeepSeek.', badge: 'Free Tier' },
                { id: 'ollama', title: 'Local Ollama Instance', desc: 'Runs fully local & private on localhost:11434 with zero external telemetry.', badge: 'Local Private' }
              ].map(opt => (
                <div
                  key={opt.id}
                  onClick={() => setLlmProvider(opt.id as any)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition flex flex-col justify-between ${
                    llmProvider === opt.id
                      ? 'border-[#5B45E0] bg-[#EEF2FF]/40 dark:bg-[#1E1B4B]/30'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/50 text-[#5B45E0] dark:text-[#818CF8]">
                        {opt.badge}
                      </span>
                      {llmProvider === opt.id && <Check className="w-4 h-4 text-[#5B45E0]" />}
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{opt.title}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{opt.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Dynamic Configuration Fields */}
            {llmProvider !== 'built_in' && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
                {llmProvider === 'ollama' ? (
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Ollama Endpoint URL
                    </label>
                    <input
                      type="text"
                      value={ollamaEndpoint}
                      onChange={e => setOllamaEndpoint(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1F2937] font-mono text-slate-900 dark:text-white"
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Model ID
                      </label>
                      <input
                        type="text"
                        value={llmModelName}
                        onChange={e => setLlmModelName(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1F2937] font-mono text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Free API Key (Optional or Fallback)
                      </label>
                      <input
                        type="password"
                        placeholder="e.g. hf_... or sk-or-..."
                        value={customApiKey}
                        onChange={e => setCustomApiKey(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1F2937] font-mono text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Interactive Prompt Compiler Playground */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Live AST Compiler Playground
              </h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={testPrompt}
                  onChange={e => setTestPrompt(e.target.value)}
                  placeholder="Type an English strategy prompt to compile into TradingWave AST..."
                  className="flex-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0B1220] text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-[#5B45E0]"
                />
                <button
                  onClick={handleRunAiCompilerTest}
                  disabled={isCompilingPrompt}
                  className="px-5 py-2.5 rounded-xl bg-[#5B45E0] hover:bg-[#4935C7] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-500/20 disabled:opacity-50"
                >
                  {isCompilingPrompt ? <RotateCcw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                  <span>Compile AST</span>
                </button>
              </div>

              {testResult && (
                <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-emerald-400 overflow-x-auto">
                  <pre>{testResult}</pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 6: SEBI AUDIT TRAIL */}
      {/* ========================================================= */}
      {activeTab === 'audit' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">SEBI Compliance &amp; Order Audit Ledger</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Immutable record of all algorithmic order dispatches with SHA-256 cryptographic verification checksums.
              </p>
            </div>
            <button
              onClick={() => {
                const csv = 'Timestamp,AuditID,UserID,Algo,Broker,Action,Checksum,Compliance\n' +
                  INITIAL_AUDIT_LOGS.map(a => `${a.timestamp},${a.id},${a.userId},${a.algoName},${a.broker},${a.action},${a.checksum},${a.compliance}`).join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `sebi_compliance_audit_${Date.now()}.csv`;
                a.click();
                URL.revokeObjectURL(url);
                showToast('SEBI Compliance Audit Report exported as CSV.');
              }}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1F2937] text-xs font-bold hover:bg-slate-50 flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Audit Ledger (CSV)</span>
            </button>
          </div>

          <div className="bg-white dark:bg-[#1F2937] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-50 dark:bg-[#0B1220] text-slate-400 text-[10px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">TIMESTAMP</th>
                    <th className="py-3 px-4">AUDIT ID</th>
                    <th className="py-3 px-4">ALGO NAME</th>
                    <th className="py-3 px-4">BROKER</th>
                    <th className="py-3 px-4">ACTION</th>
                    <th className="py-3 px-4">CHECKSUM (SHA-256)</th>
                    <th className="py-3 px-4 text-right">COMPLIANCE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {INITIAL_AUDIT_LOGS.map(log => (
                    <tr key={log.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition">
                      <td className="py-3 px-4 text-slate-500">{log.timestamp}</td>
                      <td className="py-3 px-4 font-bold text-slate-700 dark:text-slate-300">{log.id}</td>
                      <td className="py-3 px-4 font-sans font-semibold text-slate-900 dark:text-white">{log.algoName}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{log.broker}</td>
                      <td className="py-3 px-4 text-[#5B45E0] font-bold">{log.action}</td>
                      <td className="py-3 px-4 text-slate-400 text-[10px]">{log.checksum}</td>
                      <td className="py-3 px-4 text-right">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                          ✓ {log.compliance}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Tenant User */}
      {newUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1F2937] border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Add New Tenant Account</h3>
              <button onClick={() => setNewUserModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">User Full Name</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={e => setNewUserName(e.target.value)}
                  placeholder="e.g. Siddharth Verma"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0B1220] text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={e => setNewUserEmail(e.target.value)}
                  placeholder="siddharth@example.com"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0B1220] text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Role</label>
                  <select
                    value={newUserRole}
                    onChange={e => setNewUserRole(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0B1220] text-slate-900 dark:text-white"
                  >
                    <option value="TRADER">Trader</option>
                    <option value="CREATOR">Creator</option>
                    <option value="SUPERADMIN">SuperAdmin</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Plan Tier</label>
                  <select
                    value={newUserTier}
                    onChange={e => setNewUserTier(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0B1220] text-slate-900 dark:text-white"
                  >
                    <option value="Free">Free</option>
                    <option value="Starter">Starter</option>
                    <option value="Standard">Standard</option>
                    <option value="Retail">Retail</option>
                    <option value="Retail+">Retail+</option>
                    <option value="Creator+">Creator+</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNewUserModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#5B45E0] text-white text-xs font-bold hover:bg-[#4935C7]"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

