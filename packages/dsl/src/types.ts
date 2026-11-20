export type LogicalOperator = 'AND' | 'OR';
export type ComparisonOperator = '>' | '<' | '>=' | '<=' | '==' | '!=' | 'CROSSES_ABOVE' | 'CROSSES_BELOW';
export type Timeframe = '1_MIN' | '3_MIN' | '5_MIN' | '15_MIN' | '30_MIN' | 'HOUR' | 'DAY';

export interface LiteralNode {
  type: 'LITERAL';
  dataType: 'NUMBER' | 'STRING' | 'BOOLEAN' | 'TIME';
  value: number | string | boolean;
}

export interface KeywordCallNode {
  type: 'KEYWORD_CALL';
  keyword: string;
  arguments?: Record<string, ASTNode | number | string | boolean>;
  instrument?: string;
  timeframe?: Timeframe;
  offset?: number; // e.g. -1 for previous bar, -2 for 2 bars back
}

export interface PositionRefNode {
  type: 'POSITION_REF';
  field: 'PNL' | 'ENTRY_PRICE' | 'NET_QUANTITY' | 'CURRENT_LTP';
  legIndex?: number;
  setIndex?: number;
}

export interface ComparisonNode {
  type: 'COMPARISON';
  operator: ComparisonOperator;
  left: ASTNode;
  right: ASTNode;
}

export interface LogicalGroupNode {
  type: 'LOGICAL_GROUP';
  operator: LogicalOperator;
  children: ASTNode[];
}

export type ASTNode = LiteralNode | KeywordCallNode | PositionRefNode | ComparisonNode | LogicalGroupNode;

export type ActionType = 'BUY' | 'SELL';
export type InstrumentType = 'CALL' | 'PUT' | 'FUT' | 'EQ';
export type ExpiryType = 'CURRENT_WEEK' | 'NEXT_WEEK' | 'CURRENT_MONTH' | 'NEXT_MONTH';
export type StrikeSelection = 'ATM' | 'ITM_1' | 'ITM_2' | 'OTM_1' | 'OTM_2' | 'OTM_3' | 'DELTA' | 'PREMIUM';

export interface PositionLeg {
  id: string;
  action: ActionType;
  instrumentType: InstrumentType;
  expiryType: ExpiryType;
  strikeSelection: StrikeSelection;
  strikeOffset?: number;
  targetDelta?: number;
  lots: number;
  stopLossPct?: number;
  targetProfitPct?: number;
  trailingStopPct?: number;
}

export interface RepairBlock {
  id: string;
  condition: ASTNode;
  actions: PositionLeg[];
}

export interface StrategySet {
  id: number;
  name: string;
  entryCondition: ASTNode;
  legs: PositionLeg[];
  repairBlocks?: RepairBlock[];
  exitCondition: ASTNode;
}

export interface UniversalExit {
  condition: ASTNode;
  trailingStopLoss?: {
    activateProfit: number;
    trailingStep: number;
  };
}

export interface StrategyDefinition {
  id: string;
  name: string;
  description?: string;
  underlying: string;
  version: number;
  executionSettings: {
    checkFrequencySeconds: number;
    candleInterval: Timeframe;
    market: 'NSE_EQ' | 'NSE_FO' | 'BSE_FO' | 'MCX' | 'CRYPTO';
    exchange: string;
  };
  sets: StrategySet[];
  universalExit?: UniversalExit;
}

export interface MarketBar {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  oi?: number;
}

export interface PositionState {
  symbol: string;
  entryPrice: number;
  currentLtp: number;
  quantity: number;
  pnl: number;
  legIndex: number;
  setIndex: number;
}

export interface ExecutionContext {
  now: Date;
  currentTimeString: string; // HH:MM e.g. "09:20"
  underlyingSymbol: string;
  underlyingPrice: number;
  bars: Record<string, MarketBar[]>; // symbol -> history
  positions: PositionState[];
  setPositions: Record<number, PositionState[]>;
  strategyPnl: number;
  runtimeVariables: Record<string, number | string | boolean>;
}

