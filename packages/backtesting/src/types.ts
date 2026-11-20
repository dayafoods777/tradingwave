import { MarketBar, StrategyDefinition } from '@tradingwave/dsl';

export interface BacktestConfig {
  strategy: StrategyDefinition;
  startDate: Date;
  endDate: Date;
  initialCapital: number;
  slippagePct: number;
  brokeragePerOrder: number;
  bars: MarketBar[]; // Sequential historical bars
}

export interface TradeRecord {
  id: string;
  symbol: string;
  action: 'BUY' | 'SELL';
  entryTime: Date;
  entryPrice: number;
  exitTime?: Date;
  exitPrice?: number;
  quantity: number;
  grossPnl: number;
  netPnl: number;
  charges: number;
  exitReason?: string;
}

export interface EquityPoint {
  timestamp: number;
  equity: number;
  drawdown: number;
  drawdownPct: number;
}

export interface BacktestResult {
  strategyId: string;
  initialCapital: number;
  finalCapital: number;
  totalPnl: number;
  totalPnlPct: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRatePct: number;
  maxDrawdown: number;
  maxDrawdownPct: number;
  profitFactor: number;
  sharpeRatio: number;
  totalCharges: number;
  equityCurve: EquityPoint[];
  trades: TradeRecord[];
}

