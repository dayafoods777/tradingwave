import { StrategyDefinition, PositionState } from '@tradingwave/dsl';
import { IBrokerAdapter } from '@tradingwave/broker-adapters';

export type BotStatus = 'ACTIVE' | 'PAUSED' | 'SQUARED_OFF' | 'ERROR';
export type ExecutionMode = 'PAPER' | 'LIVE_AUTO';

export interface RiskLimits {
  maxDailyLoss: number;
  maxCapitalPerStrategy: number;
  maxOrderRatePerMinute: number;
  maxPriceCollarPct: number;
}

export interface DeployedBot {
  id: string;
  strategy: StrategyDefinition;
  broker: IBrokerAdapter;
  mode: ExecutionMode;
  status: BotStatus;
  multiplier: number;
  positions: PositionState[];
  dailyPnl: number;
  riskLimits: RiskLimits;
  lastCheckedAt?: Date;
  errorMessage?: string;
}

