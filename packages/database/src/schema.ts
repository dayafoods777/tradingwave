export interface TenantRecord {
  id: string;
  name: string;
  planTier: 'FREE' | 'STARTER' | 'STARTER_PLUS' | 'RETAIL' | 'RETAIL_PLUS' | 'CREATOR' | 'CREATOR_PLUS';
  createdAt: Date;
}

export interface UserRecord {
  id: string;
  tenantId: string;
  email: string;
  passwordHash: string;
  role: 'SUPERADMIN' | 'TRADER' | 'CREATOR';
  isActive: boolean;
  createdAt: Date;
}

export interface StrategyRecord {
  id: string;
  tenantId: string;
  userId: string;
  name: string;
  underlying: string;
  version: number;
  dslAst: Record<string, any>;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DeployedBotRecord {
  id: string;
  tenantId: string;
  userId: string;
  strategyId: string;
  brokerAccountId?: string;
  executionMode: 'PAPER' | 'LIVE_AUTO';
  multiplier: number;
  status: 'ACTIVE' | 'PAUSED' | 'SQUARED_OFF' | 'ERROR';
  totalPnl: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderRecord {
  id: string;
  tenantId: string;
  deployedBotId: string;
  brokerOrderId?: string;
  symbol: string;
  exchange: string;
  action: 'BUY' | 'SELL';
  orderType: string;
  quantity: number;
  price?: number;
  status: string;
  errorMessage?: string;
  createdAt: Date;
}

