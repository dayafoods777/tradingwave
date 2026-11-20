import { describe, it, expect } from 'vitest';
import { ConditionEvaluator } from '../src/evaluator.js';
import { StrategyValidator } from '../src/validator.js';
import { ASTNode, ExecutionContext, StrategyDefinition } from '../src/types.js';

describe('TradingWave DSL Evaluator', () => {
  const mockContext: ExecutionContext = {
    now: new Date('2026-11-20T09:20:00Z'),
    currentTimeString: '09:20',
    underlyingSymbol: 'NIFTY 50',
    underlyingPrice: 24500.0,
    bars: {
      'NIFTY 50': [
        { timestamp: 1, open: 24450, high: 24490, low: 24430, close: 24480, volume: 1000 },
        { timestamp: 2, open: 24480, high: 24510, low: 24460, close: 24500, volume: 1500 }
      ]
    },
    positions: [
      { symbol: 'NIFTY26NOV24500CE', entryPrice: 150, currentLtp: 130, quantity: -50, pnl: 1000, legIndex: 0, setIndex: 1 },
      { symbol: 'NIFTY26NOV24500PE', entryPrice: 140, currentLtp: 160, quantity: -50, pnl: -1000, legIndex: 1, setIndex: 1 }
    ],
    setPositions: {},
    strategyPnl: 0,
    runtimeVariables: {}
  };

  it('should evaluate Time >= 09:20 correctly', () => {
    const node: ASTNode = {
      type: 'COMPARISON',
      operator: '>=',
      left: { type: 'KEYWORD_CALL', keyword: 'Time' },
      right: { type: 'LITERAL', dataType: 'TIME', value: '09:20' }
    };
    expect(ConditionEvaluator.evaluate(node, mockContext)).toBe(true);
  });

  it('should evaluate nested AND condition with Time and Close price', () => {
    const node: ASTNode = {
      type: 'LOGICAL_GROUP',
      operator: 'AND',
      children: [
        {
          type: 'COMPARISON',
          operator: '>=',
          left: { type: 'KEYWORD_CALL', keyword: 'Time' },
          right: { type: 'LITERAL', dataType: 'TIME', value: '09:20' }
        },
        {
          type: 'COMPARISON',
          operator: '>',
          left: { type: 'KEYWORD_CALL', keyword: 'Close' },
          right: { type: 'LITERAL', dataType: 'NUMBER', value: 24000 }
        }
      ]
    };
    expect(ConditionEvaluator.evaluate(node, mockContext)).toBe(true);
  });

  it('should evaluate Stop Loss condition on leg PnL', () => {
    const slNode: ASTNode = {
      type: 'COMPARISON',
      operator: '<=',
      left: { type: 'POSITION_REF', field: 'PNL', legIndex: 1 },
      right: { type: 'LITERAL', dataType: 'NUMBER', value: -800 }
    };
    // Leg 1 PnL is -1000, which is <= -800
    expect(ConditionEvaluator.evaluate(slNode, mockContext)).toBe(true);
  });

  it('should detect crossing above event', () => {
    // Current bar: close 24500 > 24490, Previous bar: close 24480 <= 24490
    const crossNode: ASTNode = {
      type: 'COMPARISON',
      operator: 'CROSSES_ABOVE',
      left: { type: 'KEYWORD_CALL', keyword: 'Close' },
      right: { type: 'LITERAL', dataType: 'NUMBER', value: 24490 }
    };
    expect(ConditionEvaluator.evaluate(crossNode, mockContext)).toBe(true);
  });

  it('should validate complete strategy definition with no errors', () => {
    const strategy: StrategyDefinition = {
      id: 'strat-101',
      name: 'NIFTY Short Straddle 9:20',
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
            operator: '>=',
            left: { type: 'KEYWORD_CALL', keyword: 'Time' },
            right: { type: 'LITERAL', dataType: 'TIME', value: '09:20' }
          },
          legs: [
            {
              id: 'leg-1',
              action: 'SELL',
              instrumentType: 'CALL',
              expiryType: 'CURRENT_WEEK',
              strikeSelection: 'ATM',
              lots: 1
            }
          ],
          exitCondition: {
            type: 'COMPARISON',
            operator: '>=',
            left: { type: 'KEYWORD_CALL', keyword: 'Time' },
            right: { type: 'LITERAL', dataType: 'TIME', value: '15:15' }
          }
        }
      ]
    };

    const errors = StrategyValidator.validateStrategy(strategy);
    expect(errors).toHaveLength(0);
  });
});

