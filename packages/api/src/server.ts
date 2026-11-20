import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import { StrategyDefinition, StrategyValidator } from '@tradingwave/dsl';
import { SandboxBrokerAdapter } from '@tradingwave/broker-adapters';
import { OptionChainGenerator } from '@tradingwave/market-data';
import { DeployedBot, BotRunner } from '@tradingwave/execution-engine';
import { BacktestEngine, BacktestConfig } from '@tradingwave/backtesting';

export function buildServer(): FastifyInstance {
  const server = Fastify({ logger: false });

  server.register(cors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  });

  // In-memory data store for the modular prototype
  const strategies: Map<string, StrategyDefinition> = new Map();
  const deployedBots: Map<string, DeployedBot> = new Map();
  const sandboxBroker = new SandboxBrokerAdapter({ initialBalance: 1000000 });

  // Seed with standard NIFTY Short Straddle
  const seedStrategy: StrategyDefinition = {
    id: 'strat_seed_straddle',
    name: 'NIFTY 9:20 Intraday Short Straddle',
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
        name: 'Set 1: Straddle Sell',
        entryCondition: {
          type: 'COMPARISON',
          operator: '>=',
          left: { type: 'KEYWORD_CALL', keyword: 'Time' },
          right: { type: 'LITERAL', dataType: 'TIME', value: '09:20' }
        },
        legs: [
          {
            id: 'leg_ce',
            action: 'SELL',
            instrumentType: 'CALL',
            expiryType: 'CURRENT_WEEK',
            strikeSelection: 'ATM',
            lots: 1,
            stopLossPct: 25.0
          },
          {
            id: 'leg_pe',
            action: 'SELL',
            instrumentType: 'PUT',
            expiryType: 'CURRENT_WEEK',
            strikeSelection: 'ATM',
            lots: 1,
            stopLossPct: 25.0
          }
        ],
        exitCondition: {
          type: 'LOGICAL_GROUP',
          operator: 'OR',
          children: [
            {
              type: 'COMPARISON',
              operator: '>=',
              left: { type: 'KEYWORD_CALL', keyword: 'Time' },
              right: { type: 'LITERAL', dataType: 'TIME', value: '15:15' }
            },
            {
              type: 'COMPARISON',
              operator: '<=',
              left: { type: 'KEYWORD_CALL', keyword: 'PNL' },
              right: { type: 'LITERAL', dataType: 'NUMBER', value: -3000 }
            }
          ]
        }
      }
    ],
    universalExit: {
      condition: {
        type: 'COMPARISON',
        operator: '<=',
        left: { type: 'KEYWORD_CALL', keyword: 'PNL' },
        right: { type: 'LITERAL', dataType: 'NUMBER', value: -5000 }
      }
    }
  };
  strategies.set(seedStrategy.id, seedStrategy);

  // 1. Health Endpoint
  server.get('/api/v1/health', async () => {
    return {
      status: 'UP',
      service: 'TradingWave API Gateway',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    };
  });

  // 2. Strategy Routes
  server.get('/api/v1/strategies', async () => {
    return Array.from(strategies.values());
  });

  server.get('/api/v1/strategies/:id', async (req, reply) => {
    const { id } = req.params as { id: string };
    const strat = strategies.get(id);
    if (!strat) return reply.status(404).send({ error: 'Strategy not found' });
    return strat;
  });

  server.post('/api/v1/strategies', async (req, reply) => {
    const body = req.body as StrategyDefinition;
    const errors = StrategyValidator.validateStrategy(body);
    if (errors.length > 0) {
      return reply.status(400).send({ error: 'Validation Failed', details: errors });
    }
    strategies.set(body.id, body);
    return reply.status(201).send(body);
  });

  server.post('/api/v1/strategies/validate', async (req) => {
    const body = req.body as StrategyDefinition;
    const errors = StrategyValidator.validateStrategy(body);
    return { valid: errors.length === 0, errors };
  });

  // 3. Option Chain Route
  server.get('/api/v1/market-data/option-chain', async (req) => {
    const query = req.query as { symbol?: string; spot?: string; step?: string; days?: string };
    const symbol = query.symbol || 'NIFTY';
    const spot = Number(query.spot || 24530);
    const step = Number(query.step || 50);
    const days = Number(query.days || 5);

    const chain = OptionChainGenerator.generateOptionChain(symbol, spot, step, 7, days, 0.14);
    return chain;
  });

  // 4. Backtesting Route
  server.post('/api/v1/backtest/run', async (req, reply) => {
    const body = req.body as { strategyId: string; initialCapital?: number; slippagePct?: number };
    const strat = strategies.get(body.strategyId);
    if (!strat) return reply.status(404).send({ error: 'Strategy not found' });

    // Generate simulated 1-day 1-min bars (375 candles)
    const bars: any[] = [];
    let price = 24500;
    const baseTime = new Date('2026-11-20T09:15:00Z').getTime();
    for (let i = 0; i < 375; i++) {
      price += Math.round((Math.random() - 0.49) * 12);
      bars.push({
        timestamp: baseTime + (i * 60000),
        open: price - 3,
        high: price + 6,
        low: price - 6,
        close: price,
        volume: 2500
      });
    }

    const config: BacktestConfig = {
      strategy: strat,
      startDate: new Date(bars[0].timestamp),
      endDate: new Date(bars[bars.length - 1].timestamp),
      initialCapital: body.initialCapital || 200000,
      slippagePct: body.slippagePct || 0.05,
      brokeragePerOrder: 20,
      bars
    };

    const result = BacktestEngine.run(config);
    return result;
  });

  // 5. Deployments Routes
  server.get('/api/v1/deployments', async () => {
    return Array.from(deployedBots.values()).map(bot => ({
      id: bot.id,
      strategyId: bot.strategy.id,
      strategyName: bot.strategy.name,
      mode: bot.mode,
      status: bot.status,
      multiplier: bot.multiplier,
      dailyPnl: bot.dailyPnl,
      openPositions: bot.positions.length,
      lastCheckedAt: bot.lastCheckedAt
    }));
  });

  server.post('/api/v1/deployments', async (req, reply) => {
    const body = req.body as { strategyId: string; mode?: 'PAPER' | 'LIVE_AUTO'; multiplier?: number };
    const strat = strategies.get(body.strategyId);
    if (!strat) return reply.status(404).send({ error: 'Strategy not found' });

    const botId = `bot_${Date.now()}`;
    const bot: DeployedBot = {
      id: botId,
      strategy: strat,
      broker: sandboxBroker,
      mode: body.mode || 'PAPER',
      status: 'ACTIVE',
      multiplier: body.multiplier || 1,
      positions: [],
      dailyPnl: 0,
      riskLimits: {
        maxDailyLoss: 10000,
        maxCapitalPerStrategy: 500000,
        maxOrderRatePerMinute: 30,
        maxPriceCollarPct: 3.0
      }
    };

    deployedBots.set(botId, bot);
    return reply.status(201).send({
      id: bot.id,
      status: bot.status,
      strategyName: strat.name,
      mode: bot.mode
    });
  });

  server.post('/api/v1/deployments/:id/square-off', async (req, reply) => {
    const { id } = req.params as { id: string };
    const bot = deployedBots.get(id);
    if (!bot) return reply.status(404).send({ error: 'Bot not found' });

    const runner = new BotRunner(bot);
    await runner.squareOffAll('Manual Square-Off Triggered from Dashboard');
    return { success: true, botId: id, status: bot.status };
  });

  // 6. Broker Routes
  server.get('/api/v1/brokers', async () => {
    const funds = await sandboxBroker.getFundsAndMargin();
    return [
      {
        brokerId: 'SANDBOX',
        name: 'TradingWave Sandbox Simulator',
        status: 'CONNECTED',
        funds
      },
      {
        brokerId: 'ZERODHA',
        name: 'Zerodha Kite Connect',
        status: 'DISCONNECTED',
        funds: null
      },
      {
        brokerId: 'DHAN',
        name: 'DhanHQ API',
        status: 'DISCONNECTED',
        funds: null
      }
    ];
  });

  // 7. TradingView Webhook Ingestion (PineBridge)
  server.post('/api/v1/webhooks/pinebridge', async (req) => {
    const body = req.body as any;
    // Process external signal
    return {
      received: true,
      signal: body.action || 'BUY',
      symbol: body.symbol || 'NSE:NIFTY',
      timestamp: new Date().toISOString()
    };
  });

  // 8. Universal Kill Switch
  server.post('/api/v1/risk/kill-switch', async () => {
    for (const bot of deployedBots.values()) {
      const runner = new BotRunner(bot);
      await runner.squareOffAll('UNIVERSAL KILL SWITCH ACTIVATED');
    }
    return {
      activated: true,
      message: 'Emergency square-off dispatched to all deployed trading bots.',
      timestamp: new Date().toISOString()
    };
  });

  return server;
}

