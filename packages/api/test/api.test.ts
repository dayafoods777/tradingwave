import { describe, it, expect } from 'vitest';
import { buildServer } from '../src/server.js';

describe('TradingWave Fastify API Gateway', () => {
  const server = buildServer();

  it('GET /api/v1/health should return UP status', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/api/v1/health'
    });
    expect(res.statusCode).toBe(200);
    const json = res.json();
    expect(json.status).toBe('UP');
    expect(json.service).toBe('TradingWave API Gateway');
  });

  it('GET /api/v1/strategies should return seeded strategies', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/api/v1/strategies'
    });
    expect(res.statusCode).toBe(200);
    const strats = res.json();
    expect(strats.length).toBeGreaterThanOrEqual(1);
    expect(strats[0].underlying).toBe('NIFTY 50');
  });

  it('GET /api/v1/market-data/option-chain should return options chain with Greeks', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/api/v1/market-data/option-chain?symbol=NIFTY&spot=24500'
    });
    expect(res.statusCode).toBe(200);
    const chain = res.json();
    expect(chain.underlyingSymbol).toBe('NIFTY');
    expect(chain.strikes.length).toBeGreaterThan(5);
  });

  it('POST /api/v1/deployments should deploy a strategy to Sandbox', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/api/v1/deployments',
      payload: {
        strategyId: 'strat_seed_straddle',
        mode: 'PAPER',
        multiplier: 2
      }
    });
    expect(res.statusCode).toBe(201);
    const bot = res.json();
    expect(bot.status).toBe('ACTIVE');
    expect(bot.mode).toBe('PAPER');
  });

  it('POST /api/v1/risk/kill-switch should trigger emergency stop', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/api/v1/risk/kill-switch'
    });
    expect(res.statusCode).toBe(200);
    expect(res.json().activated).toBe(true);
  });
});

