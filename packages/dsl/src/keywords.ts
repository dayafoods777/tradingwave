import { ExecutionContext, MarketBar } from './types.js';

export interface BollingerBandsResult {
  middle: number;
  upper: number;
  lower: number;
  bandwidth: number;
  percentageB: number;
}

export interface MACDResult {
  macd: number;
  signal: number;
  histogram: number;
}

export interface StochasticResult {
  k: number;
  d: number;
}

export interface CPRResult {
  pivot: number;
  bottomCentral: number;
  topCentral: number;
}

export class KeywordEngine {
  public static evaluateKeyword(
    keyword: string,
    args: Record<string, any> = {},
    ctx: ExecutionContext,
    instrument?: string,
    offset: number = 0
  ): number | string | boolean {
    const sym = instrument || ctx.underlyingSymbol;
    const bars = ctx.bars[sym] || [];
    const targetIdx = bars.length - 1 + offset;

    switch (keyword.toUpperCase()) {
      // 1. Time & Clock
      case 'TIME':
        return ctx.currentTimeString;
      case 'HOUR':
        return ctx.now.getUTCHours();
      case 'MINUTE':
        return ctx.now.getUTCMinutes();
      case 'DAY':
      case 'WEEK_DAY':
        return ctx.now.getUTCDay();

      // 2. Price Quotes
      case 'LTP':
      case 'CLOSE':
        if (targetIdx >= 0 && targetIdx < bars.length) {
          return bars[targetIdx].close;
        }
        return ctx.underlyingPrice;

      case 'OPEN':
        return (targetIdx >= 0 && targetIdx < bars.length) ? bars[targetIdx].open : ctx.underlyingPrice;

      case 'HIGH':
        return (targetIdx >= 0 && targetIdx < bars.length) ? bars[targetIdx].high : ctx.underlyingPrice;

      case 'LOW':
        return (targetIdx >= 0 && targetIdx < bars.length) ? bars[targetIdx].low : ctx.underlyingPrice;

      case 'VOLUME':
        return (targetIdx >= 0 && targetIdx < bars.length) ? bars[targetIdx].volume : 0;

      // 3. Moving Averages
      case 'SMA': {
        const period = Number(args.period || 14);
        return this.calculateSMA(bars, period, offset);
      }

      case 'EMA': {
        const period = Number(args.period || 20);
        return this.calculateEMA(bars, period, offset);
      }

      case 'WMA': {
        const period = Number(args.period || 14);
        return this.calculateWMA(bars, period, offset);
      }

      // 4. Oscillators & Indicators
      case 'RSI': {
        const period = Number(args.period || 14);
        return this.calculateRSI(bars, period, offset);
      }

      case 'ATR': {
        const period = Number(args.period || 14);
        return this.calculateATR(bars, period, offset);
      }

      case 'SUPERTREND': {
        const period = Number(args.period || 10);
        const multiplier = Number(args.multiplier || 3);
        return this.calculateSupertrend(bars, period, multiplier, offset);
      }

      case 'MACD': {
        const fast = Number(args.fast || 12);
        const slow = Number(args.slow || 26);
        const signal = Number(args.signal || 9);
        return this.calculateMACD(bars, fast, slow, signal, offset).macd;
      }

      case 'MACDSIGNAL': {
        const fast = Number(args.fast || 12);
        const slow = Number(args.slow || 26);
        const signal = Number(args.signal || 9);
        return this.calculateMACD(bars, fast, slow, signal, offset).signal;
      }

      case 'MACDHIST': {
        const fast = Number(args.fast || 12);
        const slow = Number(args.slow || 26);
        const signal = Number(args.signal || 9);
        return this.calculateMACD(bars, fast, slow, signal, offset).histogram;
      }

      case 'BOLLINGER_UPPER':
      case 'UPPER_BOLINGER': {
        const period = Number(args.period || 20);
        const stdDev = Number(args.stdDev || 2);
        return this.calculateBollingerBands(bars, period, stdDev, offset).upper;
      }

      case 'BOLLINGER_LOWER':
      case 'LOWER_BOLINGER': {
        const period = Number(args.period || 20);
        const stdDev = Number(args.stdDev || 2);
        return this.calculateBollingerBands(bars, period, stdDev, offset).lower;
      }

      case 'BBPERCENTAGE': {
        const period = Number(args.period || 20);
        const stdDev = Number(args.stdDev || 2);
        return this.calculateBollingerBands(bars, period, stdDev, offset).percentageB;
      }

      case 'VWAP': {
        return this.calculateVWAP(bars, offset);
      }

      case 'STOCHK': {
        const period = Number(args.period || 14);
        return this.calculateStochastic(bars, period, offset).k;
      }

      case 'STOCHD': {
        const period = Number(args.period || 14);
        return this.calculateStochastic(bars, period, offset).d;
      }

      // 5. Pivot Points & Central Pivot Range (CPR)
      case 'CPR_PIVOT': {
        return this.calculateCPR(bars, offset).pivot;
      }

      case 'CPR_TC': {
        return this.calculateCPR(bars, offset).topCentral;
      }

      case 'CPR_BC': {
        return this.calculateCPR(bars, offset).bottomCentral;
      }

      // 6. Quantitative & Statistical (Scipy Equivalents)
      case 'STDEV': {
        const period = Number(args.period || 20);
        return this.calculateStandardDeviation(bars, period, offset);
      }

      case 'ZSCORE': {
        const period = Number(args.period || 20);
        return this.calculateZScore(bars, period, offset);
      }

      // 7. Math Transforms
      case 'ABSOLUTE': {
        const val = Number(args.value || 0);
        return Math.abs(val);
      }

      case 'ROUND': {
        const val = Number(args.value || 0);
        const decimals = Number(args.decimals || 0);
        return Number(val.toFixed(decimals));
      }

      case 'SQRT': {
        const val = Number(args.value || 0);
        return Math.sqrt(Math.max(0, val));
      }

      case 'POWER': {
        const base = Number(args.base || 0);
        const exp = Number(args.exp || 1);
        return Math.pow(base, exp);
      }

      case 'MIN': {
        const a = Number(args.a || 0);
        const b = Number(args.b || 0);
        return Math.min(a, b);
      }

      case 'MAX': {
        const a = Number(args.a || 0);
        const b = Number(args.b || 0);
        return Math.max(a, b);
      }

      // 8. Positions & Strategy State
      case 'PNL':
        return ctx.strategyPnl;

      case 'OPEN_POSITIONS':
        return ctx.positions.filter(p => p.quantity !== 0).length;

      case 'NET_QUANTITY':
        return ctx.positions.reduce((acc, p) => acc + p.quantity, 0);

      default:
        if (ctx.runtimeVariables[keyword] !== undefined) {
          return ctx.runtimeVariables[keyword];
        }
        return 0;
    }
  }

  // --- Calculations ---

  public static calculateSMA(bars: MarketBar[], period: number, offset: number = 0): number {
    const end = bars.length + offset;
    const start = end - period;
    if (start < 0 || end <= 0) return bars[bars.length - 1]?.close || 0;

    let sum = 0;
    for (let i = start; i < end; i++) {
      sum += bars[i].close;
    }
    return Number((sum / period).toFixed(2));
  }

  public static calculateEMA(bars: MarketBar[], period: number, offset: number = 0): number {
    if (bars.length < period) return bars[bars.length - 1]?.close || 0;
    const k = 2 / (period + 1);
    const end = bars.length + offset;
    let ema = bars[0].close;
    for (let i = 1; i < end; i++) {
      ema = (bars[i].close * k) + (ema * (1 - k));
    }
    return Number(ema.toFixed(2));
  }

  public static calculateWMA(bars: MarketBar[], period: number, offset: number = 0): number {
    const end = bars.length + offset;
    const start = end - period;
    if (start < 0 || end <= 0) return bars[bars.length - 1]?.close || 0;

    let weightedSum = 0;
    let weightSum = 0;
    for (let i = 0; i < period; i++) {
      const weight = i + 1;
      weightedSum += bars[start + i].close * weight;
      weightSum += weight;
    }
    return Number((weightedSum / weightSum).toFixed(2));
  }

  public static calculateRSI(bars: MarketBar[], period: number = 14, offset: number = 0): number {
    const end = bars.length + offset;
    if (end <= period) return 50;

    let gains = 0;
    let losses = 0;
    for (let i = end - period; i < end; i++) {
      const diff = bars[i].close - bars[i - 1].close;
      if (diff >= 0) gains += diff;
      else losses += Math.abs(diff);
    }

    const avgGain = gains / period;
    const avgLoss = losses / period;
    if (avgLoss === 0) return 100;
    const rs = avgGain / avgLoss;
    return Number((100 - (100 / (1 + rs))).toFixed(2));
  }

  public static calculateATR(bars: MarketBar[], period: number = 14, offset: number = 0): number {
    const end = bars.length + offset;
    if (end <= period) return 0;

    let trSum = 0;
    for (let i = end - period; i < end; i++) {
      const h = bars[i].high;
      const l = bars[i].low;
      const prevClose = bars[i - 1]?.close || bars[i].open;
      const tr = Math.max(h - l, Math.abs(h - prevClose), Math.abs(l - prevClose));
      trSum += tr;
    }
    return Number((trSum / period).toFixed(2));
  }

  public static calculateSupertrend(bars: MarketBar[], period: number = 10, multiplier: number = 3, offset: number = 0): number {
    const atr = this.calculateATR(bars, period, offset);
    const end = bars.length + offset - 1;
    if (end < 0) return 1;

    const close = bars[end].close;
    const hl2 = (bars[end].high + bars[end].low) / 2;
    const upperBand = hl2 + (multiplier * atr);
    const lowerBand = hl2 - (multiplier * atr);

    return close > upperBand ? 1 : (close < lowerBand ? -1 : 1);
  }

  public static calculateBollingerBands(
    bars: MarketBar[],
    period: number = 20,
    stdDevMultiplier: number = 2,
    offset: number = 0
  ): BollingerBandsResult {
    const middle = this.calculateSMA(bars, period, offset);
    const stdDev = this.calculateStandardDeviation(bars, period, offset);
    const upper = Number((middle + (stdDevMultiplier * stdDev)).toFixed(2));
    const lower = Number((middle - (stdDevMultiplier * stdDev)).toFixed(2));
    const bandwidth = middle > 0 ? Number(((upper - lower) / middle * 100).toFixed(2)) : 0;
    
    const targetIdx = bars.length - 1 + offset;
    const close = targetIdx >= 0 && targetIdx < bars.length ? bars[targetIdx].close : middle;
    const percentageB = (upper - lower) > 0 ? Number(((close - lower) / (upper - lower)).toFixed(2)) : 0.5;

    return { middle, upper, lower, bandwidth, percentageB };
  }

  public static calculateMACD(
    bars: MarketBar[],
    fastPeriod: number = 12,
    slowPeriod: number = 26,
    signalPeriod: number = 9,
    offset: number = 0
  ): MACDResult {
    const fastEMA = this.calculateEMA(bars, fastPeriod, offset);
    const slowEMA = this.calculateEMA(bars, slowPeriod, offset);
    const macd = Number((fastEMA - slowEMA).toFixed(2));
    // Approximate signal line
    const signal = Number((macd * 0.85).toFixed(2));
    const histogram = Number((macd - signal).toFixed(2));

    return { macd, signal, histogram };
  }

  public static calculateVWAP(bars: MarketBar[], offset: number = 0): number {
    const end = bars.length + offset;
    if (end <= 0) return bars[bars.length - 1]?.close || 0;

    let cumulativeTypicalVol = 0;
    let cumulativeVol = 0;
    for (let i = 0; i < end; i++) {
      const typicalPrice = (bars[i].high + bars[i].low + bars[i].close) / 3;
      cumulativeTypicalVol += typicalPrice * bars[i].volume;
      cumulativeVol += bars[i].volume;
    }

    if (cumulativeVol === 0) return bars[end - 1].close;
    return Number((cumulativeTypicalVol / cumulativeVol).toFixed(2));
  }

  public static calculateStochastic(bars: MarketBar[], period: number = 14, offset: number = 0): StochasticResult {
    const end = bars.length + offset;
    if (end < period) return { k: 50, d: 50 };

    let highestHigh = -Infinity;
    let lowestLow = Infinity;
    for (let i = end - period; i < end; i++) {
      if (bars[i].high > highestHigh) highestHigh = bars[i].high;
      if (bars[i].low < lowestLow) lowestLow = bars[i].low;
    }

    const currentClose = bars[end - 1].close;
    const range = highestHigh - lowestLow;
    const k = range > 0 ? Number((((currentClose - lowestLow) / range) * 100).toFixed(2)) : 50;
    const d = k; // simplified 1-bar smoothing

    return { k, d };
  }

  public static calculateCPR(bars: MarketBar[], offset: number = 0): CPRResult {
    const prevIdx = bars.length - 2 + offset;
    if (prevIdx < 0) {
      const curr = bars[bars.length - 1] || { high: 24500, low: 24500, close: 24500 };
      return { pivot: curr.close, bottomCentral: curr.close, topCentral: curr.close };
    }

    const prev = bars[prevIdx];
    const pivot = (prev.high + prev.low + prev.close) / 3;
    const bottomCentral = (prev.high + prev.low) / 2;
    const topCentral = (pivot - bottomCentral) + pivot;

    return {
      pivot: Number(pivot.toFixed(2)),
      bottomCentral: Number(bottomCentral.toFixed(2)),
      topCentral: Number(topCentral.toFixed(2))
    };
  }

  public static calculateStandardDeviation(bars: MarketBar[], period: number, offset: number = 0): number {
    const end = bars.length + offset;
    const start = end - period;
    if (start < 0 || end <= 0) return 0;

    const mean = this.calculateSMA(bars, period, offset);
    let varianceSum = 0;
    for (let i = start; i < end; i++) {
      varianceSum += Math.pow(bars[i].close - mean, 2);
    }
    return Number(Math.sqrt(varianceSum / period).toFixed(2));
  }

  public static calculateZScore(bars: MarketBar[], period: number, offset: number = 0): number {
    const targetIdx = bars.length - 1 + offset;
    if (targetIdx < 0 || targetIdx >= bars.length) return 0;

    const mean = this.calculateSMA(bars, period, offset);
    const stdDev = this.calculateStandardDeviation(bars, period, offset);
    if (stdDev === 0) return 0;

    const close = bars[targetIdx].close;
    return Number(((close - mean) / stdDev).toFixed(2));
  }
}
