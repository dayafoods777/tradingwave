import { RiskLimits, DeployedBot } from './types.js';

export class RiskController {
  private orderTimestamps: number[] = [];

  constructor(private limits: RiskLimits) {}

  public checkPreTrade(bot: DeployedBot, estimatedTradeValue: number, triggerPrice: number, currentLtp: number): { allowed: boolean; reason?: string } {
    // 1. Max Daily Loss check
    if (bot.dailyPnl <= -this.limits.maxDailyLoss) {
      return {
        allowed: false,
        reason: `Max Daily Loss Limit Breached (PnL: ₹${bot.dailyPnl.toFixed(2)}, Limit: -₹${this.limits.maxDailyLoss})`
      };
    }

    // 2. Capital Limit per Strategy
    if (estimatedTradeValue > this.limits.maxCapitalPerStrategy) {
      return {
        allowed: false,
        reason: `Capital allocation exceeded (Required: ₹${estimatedTradeValue.toFixed(2)}, Max: ₹${this.limits.maxCapitalPerStrategy})`
      };
    }

    // 3. Price Collar Check (Avoid runaway market slippage)
    if (triggerPrice > 0 && currentLtp > 0) {
      const priceDriftPct = Math.abs(currentLtp - triggerPrice) / triggerPrice * 100;
      if (priceDriftPct > this.limits.maxPriceCollarPct) {
        return {
          allowed: false,
          reason: `Price collar violated (Drift: ${priceDriftPct.toFixed(2)}%, Allowed: ${this.limits.maxPriceCollarPct}%)`
        };
      }
    }

    // 4. Rate Limiter (Token bucket sliding window)
    const now = Date.now();
    this.orderTimestamps = this.orderTimestamps.filter(t => now - t < 60000);
    if (this.orderTimestamps.length >= this.limits.maxOrderRatePerMinute) {
      return {
        allowed: false,
        reason: `Order rate limit exceeded (${this.limits.maxOrderRatePerMinute} orders/min)`
      };
    }

    this.orderTimestamps.push(now);
    return { allowed: true };
  }
}

