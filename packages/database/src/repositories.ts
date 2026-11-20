import {
  TenantRecord,
  UserRecord,
  StrategyRecord,
  DeployedBotRecord,
  OrderRecord
} from './schema.js';

export class MemoryDatabase {
  public tenants: Map<string, TenantRecord> = new Map();
  public users: Map<string, UserRecord> = new Map();
  public strategies: Map<string, StrategyRecord> = new Map();
  public deployedBots: Map<string, DeployedBotRecord> = new Map();
  public orders: Map<string, OrderRecord> = new Map();

  constructor() {
    this.seedDefaultData();
  }

  private seedDefaultData(): void {
    const defaultTenant: TenantRecord = {
      id: 'tenant_default',
      name: 'Default Workspace',
      planTier: 'RETAIL',
      createdAt: new Date()
    };
    this.tenants.set(defaultTenant.id, defaultTenant);

    const defaultUser: UserRecord = {
      id: 'user_default',
      tenantId: defaultTenant.id,
      email: 'trader@tradingwave.internal',
      passwordHash: 'argon2id_mock_hash',
      role: 'TRADER',
      isActive: true,
      createdAt: new Date()
    };
    this.users.set(defaultUser.id, defaultUser);
  }

  // Strategies Repository with Tenant Isolation
  public findStrategiesByTenant(tenantId: string): StrategyRecord[] {
    return Array.from(this.strategies.values()).filter(s => s.tenantId === tenantId);
  }

  public saveStrategy(strategy: StrategyRecord): StrategyRecord {
    this.strategies.set(strategy.id, strategy);
    return strategy;
  }

  public getStrategyById(id: string, tenantId: string): StrategyRecord | null {
    const s = this.strategies.get(id);
    if (!s || s.tenantId !== tenantId) return null;
    return s;
  }

  // Deployed Bots Repository
  public findBotsByTenant(tenantId: string): DeployedBotRecord[] {
    return Array.from(this.deployedBots.values()).filter(b => b.tenantId === tenantId);
  }

  public saveBot(bot: DeployedBotRecord): DeployedBotRecord {
    this.deployedBots.set(bot.id, bot);
    return bot;
  }

  public getBotById(id: string, tenantId: string): DeployedBotRecord | null {
    const b = this.deployedBots.get(id);
    if (!b || b.tenantId !== tenantId) return null;
    return b;
  }
}

