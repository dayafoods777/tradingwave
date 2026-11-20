export type OptionType = 'CE' | 'PE';

export interface Greeks {
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  rho: number;
}

export interface OptionContract {
  symbol: string;
  strike: number;
  optionType: OptionType;
  expiry: string;
  ltp: number;
  bidPrice: number;
  askPrice: number;
  volume: number;
  openInterest: number;
  impliedVolatility: number;
  greeks: Greeks;
}

export interface OptionChainStrike {
  strike: number;
  isAtm: boolean;
  call: OptionContract;
  put: OptionContract;
}

export interface OptionChainSnapshot {
  underlyingSymbol: string;
  underlyingPrice: number;
  expiry: string;
  timestamp: Date;
  strikes: OptionChainStrike[];
}

export interface InstrumentMetadata {
  symbol: string;
  name: string;
  exchange: 'NSE' | 'BSE' | 'MCX' | 'CRYPTO';
  segment: 'EQUITY' | 'FUTURES' | 'OPTIONS';
  lotSize: number;
  tickSize: number;
  strikeStep: number;
}

