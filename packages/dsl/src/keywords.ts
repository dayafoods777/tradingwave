import { ExecutionContext, MarketBar } from './types.js';

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
      case 'TIME':
        return ctx.currentTimeString;

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

      case 'SMA': {
        const period = Number(args.period || 14);
        return this.calculateSMA(bars, period, offset);
      }

      case 'EMA': {
        const period = Number(args.period || 20);
        return this.calculateEMA(bars, period, offset);
      }

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

      case 'ABSOLUTE': {
        const val = Number(args.value || 0);
        return Math.abs(val);
      }

      case 'ROUND': {
        const val = Number(args.value || 0);
        const decimals = Number(args.decimals || 0);
        return Number(val.toFixed(decimals));
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

      case 'PNL':
        return ctx.strategyPnl;

      default:
        if (ctx.runtimeVariables[keyword] !== undefined) {
          return ctx.runtimeVariables[keyword];
        }
        return 0;
    }
  }

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

    // Return 1 for Bullish, -1 for Bearish
    return close > upperBand ? 1 : (close < lowerBand ? -1 : 1);
  }
}

