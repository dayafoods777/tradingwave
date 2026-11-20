import { DeployedBot, BotStatus } from './types.js';
import { ConditionEvaluator, ExecutionContext, PositionState } from '@tradingwave/dsl';
import { OrderRequest } from '@tradingwave/broker-adapters';
import { RiskController } from './risk-controller.js';

export class BotRunner {
  private riskController: RiskController;

  constructor(private bot: DeployedBot) {
    this.riskController = new RiskController(bot.riskLimits);
  }

  public async evaluateCycle(ctx: ExecutionContext): Promise<void> {
    if (this.bot.status !== 'ACTIVE') return;

    this.bot.lastCheckedAt = new Date();

    // 1. Check Universal Exit if configured
    if (this.bot.strategy.universalExit) {
      const shouldExit = ConditionEvaluator.evaluate(this.bot.strategy.universalExit.condition, ctx);
      if (shouldExit) {
        await this.squareOffAll('Universal Exit Condition Triggered');
        return;
      }
    }

    // 2. Evaluate Strategy Sets
    for (const set of this.bot.strategy.sets) {
      const hasPositionsInSet = this.bot.positions.some(p => p.setIndex === set.id && p.quantity !== 0);

      if (!hasPositionsInSet) {
        // Evaluate Entry Condition
        const entryTriggered = ConditionEvaluator.evaluate(set.entryCondition, ctx);
        if (entryTriggered) {
          await this.executeEntryLegs(set.id, set.legs, ctx);
        }
      } else {
        // Evaluate Set Exit Condition
        const exitTriggered = ConditionEvaluator.evaluate(set.exitCondition, ctx);
        if (exitTriggered) {
          await this.squareOffSet(set.id, 'Set Exit Condition Triggered');
        }
      }
    }

    // 3. Update PnL
    this.updatePnl(ctx);
  }

  private async executeEntryLegs(setId: number, legs: any[], ctx: ExecutionContext): Promise<void> {
    for (let i = 0; i < legs.length; i++) {
      const leg = legs[i];
      const strike = Math.round(ctx.underlyingPrice / 50) * 50; // simple ATM strike mapping
      const symbol = `${ctx.underlyingSymbol}${strike}${leg.instrumentType === 'CALL' ? 'CE' : 'PE'}`;
      const qty = leg.lots * 50 * this.bot.multiplier;
      const approxPrice = 120.0;

      // Pre-trade risk check
      const riskCheck = this.riskController.checkPreTrade(this.bot, approxPrice * qty, approxPrice, approxPrice);
      if (!riskCheck.allowed) {
        this.bot.errorMessage = riskCheck.reason;
        return;
      }

      const order: OrderRequest = {
        idempotencyKey: `${this.bot.id}_set${setId}_leg${i}_${Date.now()}`,
        strategyId: this.bot.strategy.id,
        symbol,
        exchange: 'NSE',
        action: leg.action,
        orderType: 'MARKET',
        productType: 'MIS',
        quantity: qty,
        price: approxPrice
      };

      const res = await this.bot.broker.placeOrder(order);
      if (res.status === 'FILLED') {
        const newPos: PositionState = {
          symbol,
          entryPrice: res.averagePrice,
          currentLtp: res.averagePrice,
          quantity: leg.action === 'BUY' ? qty : -qty,
          pnl: 0,
          legIndex: i,
          setIndex: setId
        };
        this.bot.positions.push(newPos);
      }
    }
  }

  public async squareOffSet(setId: number, reason: string): Promise<void> {
    const setPositions = this.bot.positions.filter(p => p.setIndex === setId && p.quantity !== 0);
    for (const pos of setPositions) {
      const action = pos.quantity > 0 ? 'SELL' : 'BUY';
      const order: OrderRequest = {
        idempotencyKey: `sqoff_${pos.symbol}_${Date.now()}`,
        strategyId: this.bot.strategy.id,
        symbol: pos.symbol,
        exchange: 'NSE',
        action,
        orderType: 'MARKET',
        productType: 'MIS',
        quantity: Math.abs(pos.quantity)
      };
      await this.bot.broker.placeOrder(order);
      pos.quantity = 0;
    }
  }

  public async squareOffAll(reason: string): Promise<void> {
    await this.bot.broker.emergencySquareOff();
    this.bot.positions.forEach(p => p.quantity = 0);
    this.bot.status = 'SQUARED_OFF';
    this.bot.errorMessage = reason;
  }

  private updatePnl(ctx: ExecutionContext): void {
    let totalPnl = 0;
    for (const pos of this.bot.positions) {
      if (pos.quantity !== 0) {
        const ltp = ctx.bars[pos.symbol]?.[ctx.bars[pos.symbol]?.length - 1]?.close || pos.entryPrice;
        pos.currentLtp = ltp;
        pos.pnl = (pos.currentLtp - pos.entryPrice) * pos.quantity;
        totalPnl += pos.pnl;
      }
    }
    this.bot.dailyPnl = totalPnl;
  }
}

