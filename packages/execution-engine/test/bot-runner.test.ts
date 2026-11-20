import { describe, it, expect, beforeEach } from 'vitest';
import { BotRunner } from '../src/bot-runner.js';
import { DeployedBot } from '../src/types.js';
import { SandboxBrokerAdapter } from '@tradingwave/broker-adapters';
import { ExecutionContext, StrategyDefinition } from '@tradingwave/dsl';

describe('Execution Engine & Bot Runner', () => {
  let bot: DeployedBot;
  let broker: SandboxBrokerAdapter;
  let runner: BotRunner;

  beforeEach(() => {
    broker = new SandboxBrokerAdapter({ initialBalance: 1000000 });
    const strategy: StrategyDefinition = {
      id: 'strat-runner-1',
      name: 'Test Intraday Bot',
      underlying: 'NIFTY 50',
      version: 1,
      executionSettings: {
        checkFrequencySeconds: 1,
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
              id: 'leg-ce',
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

    bot = {
      id: 'bot-101',
      strategy,
      broker,
      mode: 'PAPER',
      status: 'ACTIVE',
      multiplier: 1,
      positions: [],
      dailyPnl: 0,
      riskLimits: {
        maxDailyLoss: 5000,
        maxCapitalPerStrategy: 200000,
        maxOrderRatePerMinute: 20,
        maxPriceCollarPct: 3.0
      }
    };

    runner = new BotRunner(bot);
  });

  it('should not enter position before 09:20', async () => {
    const ctxEarly: ExecutionContext = {
      now: new Date('2026-11-20T09:15:00Z'),
      currentTimeString: '09:15',
      underlyingSymbol: 'NIFTY 50',
      underlyingPrice: 24500,
      bars: {},
      positions: bot.positions,
      setPositions: {},
      strategyPnl: 0,
      runtimeVariables: {}
    };

    await runner.evaluateCycle(ctxEarly);
    expect(bot.positions).toHaveLength(0);
  });

  it('should trigger entry when time reaches 09:20', async () => {
    const ctxTrigger: ExecutionContext = {
      now: new Date('2026-11-20T09:20:00Z'),
      currentTimeString: '09:20',
      underlyingSymbol: 'NIFTY 50',
      underlyingPrice: 24500,
      bars: {},
      positions: bot.positions,
      setPositions: {},
      strategyPnl: 0,
      runtimeVariables: {}
    };

    await runner.evaluateCycle(ctxTrigger);
    expect(bot.positions).toHaveLength(1);
    expect(bot.positions[0].quantity).toBe(-50); // 1 lot short Call
  });

  it('should trigger exit condition at 15:15', async () => {
    // First trigger entry
    const ctxTrigger: ExecutionContext = {
      now: new Date('2026-11-20T09:20:00Z'),
      currentTimeString: '09:20',
      underlyingSymbol: 'NIFTY 50',
      underlyingPrice: 24500,
      bars: {},
      positions: bot.positions,
      setPositions: {},
      strategyPnl: 0,
      runtimeVariables: {}
    };
    await runner.evaluateCycle(ctxTrigger);
    expect(bot.positions[0].quantity).toBe(-50);

    // Now evaluate at 15:15
    const ctxExit: ExecutionContext = {
      now: new Date('2026-11-20T15:15:00Z'),
      currentTimeString: '15:15',
      underlyingSymbol: 'NIFTY 50',
      underlyingPrice: 24500,
      bars: {},
      positions: bot.positions,
      setPositions: {},
      strategyPnl: 0,
      runtimeVariables: {}
    };
    await runner.evaluateCycle(ctxExit);
    expect(bot.positions[0].quantity).toBe(0);
  });
});

