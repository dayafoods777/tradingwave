import { describe, it, expect } from 'vitest';
import { MemoryDatabase } from '../src/repositories.js';
import { StrategyRecord, DeployedBotRecord } from '../src/schema.js';

describe('Database Repositories & Tenant Isolation', () => {
  it('should enforce tenant isolation when querying strategies', () => {
    const db = new MemoryDatabase();

    const stratA: StrategyRecord = {
      id: 'strat-A',
      tenantId: 'tenant-1',
      userId: 'user-1',
      name: 'Tenant 1 Strategy',
      underlying: 'NIFTY 50',
      version: 1,
      dslAst: { type: 'AST' },
      isPublic: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const stratB: StrategyRecord = {
      id: 'strat-B',
      tenantId: 'tenant-2',
      userId: 'user-2',
      name: 'Tenant 2 Strategy',
      underlying: 'BANKNIFTY',
      version: 1,
      dslAst: { type: 'AST' },
      isPublic: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    db.saveStrategy(stratA);
    db.saveStrategy(stratB);

    const tenant1Strats = db.findStrategiesByTenant('tenant-1');
    expect(tenant1Strats).toHaveLength(1);
    expect(tenant1Strats[0].name).toBe('Tenant 1 Strategy');

    // Cross-tenant access must return null
    expect(db.getStrategyById('strat-A', 'tenant-2')).toBeNull();
    expect(db.getStrategyById('strat-B', 'tenant-2')).not.toBeNull();
  });

  it('should store and retrieve deployed bots correctly', () => {
    const db = new MemoryDatabase();
    const bot: DeployedBotRecord = {
      id: 'bot-1',
      tenantId: 'tenant-1',
      userId: 'user-1',
      strategyId: 'strat-A',
      executionMode: 'PAPER',
      multiplier: 1,
      status: 'ACTIVE',
      totalPnl: 1250.0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    db.saveBot(bot);
    const retrieved = db.getBotById('bot-1', 'tenant-1');
    expect(retrieved).toBeDefined();
    expect(retrieved?.status).toBe('ACTIVE');
    expect(retrieved?.totalPnl).toBe(1250.0);
  });
});

