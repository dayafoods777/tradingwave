import { describe, it, expect } from 'vitest';
import { BacktestEngine } from '../src/backtester.js';
import { BacktestConfig } from '../src/types.js';
import { MarketBar, StrategyDefinition } from '@tradingwave/dsl';

describe('Deterministic Backtest Engine', () => {
  const generateMockBars = (count: number): MarketBar[] => {
    const bars: MarketBar[] = [];
    let price = 24000;
    const baseTime = new Date('2026-11-20T09:15:00Z').getTime();

    for (let i = 0; i < count; i++) {
      price += (i % 2 === 0 ? 15 : -10);
      bars.push({
        timestamp: baseTime + (i * 60000), // 1-minute steps
        open: price - 5,
        high: price + 10,
        low: price - 10,
        close: price,
        volume: 2000
      });
    }
    return bars;
  };

  const strategy: StrategyDefinition = {
    id: 'backtest-strat-1',
    name: 'Simple Moving Average Cross',
    underlying: 'NIFTY 50',
    version: 1,
    executionSettings: {
      checkFrequencySeconds: 60,
      candleInterval: '1_MIN',
      market: 'NSE_FO',
      exchange: 'NSE'
    },
    sets: [
      {
        id: 1,
        name: 'Set 1',
        entryCondition: {
          type: 'COMPARISON',
          operator: '>',
          left: { type: 'KEYWORD_CALL', keyword: 'Close' },
          right: { type: 'KEYWORD_CALL', keyword: 'SMA', arguments: { period: 5 } }
        },
        legs: [
          {
            id: 'leg-1',
            action: 'BUY',
            instrumentType: 'FUT',
            expiryType: 'CURRENT_MONTH',
            strikeSelection: 'ATM',
            lots: 1
          }
        ],
        exitCondition: {
          type: 'COMPARISON',
          operator: '<',
          left: { type: 'KEYWORD_CALL', keyword: 'Close' },
          right: { type: 'KEYWORD_CALL', keyword: 'SMA', arguments: { period: 5 } }
        }
      }
    ]
  };

  it('should run a deterministic backtest and generate equity curve & trades', () => {
    const bars = generateMockBars(60);
    const config: BacktestConfig = {
      strategy,
      startDate: new Date(bars[0].timestamp),
      endDate: new Date(bars[bars.length - 1].timestamp),
      initialCapital: 200000,
      slippagePct: 0.05,
      brokeragePerOrder: 20,
      bars
    };

    const res1 = BacktestEngine.run(config);
    const res2 = BacktestEngine.run(config);

    // Strict Determinism: Byte-identical results on repeated runs
    expect(res1.totalPnl).toBe(res2.totalPnl);
    expect(res1.totalTrades).toBe(res2.totalTrades);
    expect(res1.equityCurve.length).toBe(res2.equityCurve.length);
    expect(res1.totalCharges).toBeGreaterThan(0);
    expect(res1.finalCapital).toBe(res1.initialCapital + res1.totalPnl);
  });
});

