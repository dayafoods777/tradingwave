import { Greeks, OptionType } from './types.js';

export class BlackScholes {
  // Standard Normal Cumulative Distribution Function (CDF) approximation (Abramowitz and Stegun)
  public static cdf(x: number): number {
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    const sign = x < 0 ? -1 : 1;
    const absX = Math.abs(x) / Math.sqrt(2.0);

    const t = 1.0 / (1.0 + p * absX);
    const erf = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);

    return 0.5 * (1.0 + sign * erf);
  }

  // Standard Normal Probability Density Function (PDF)
  public static pdf(x: number): number {
    return (1.0 / Math.sqrt(2.0 * Math.PI)) * Math.exp(-0.5 * x * x);
  }

  public static calculatePriceAndGreeks(
    S: number, // Spot price
    K: number, // Strike price
    T: number, // Time to expiration in years (e.g. 7 days / 365)
    r: number, // Risk-free interest rate (e.g. 0.07 for 7%)
    sigma: number, // Implied volatility (e.g. 0.15 for 15%)
    type: OptionType
  ): { price: number; greeks: Greeks } {
    if (T <= 0.0001) {
      // Expiration intrinsic value
      const intrinsic = type === 'CE' ? Math.max(0, S - K) : Math.max(0, K - S);
      return {
        price: Number(intrinsic.toFixed(2)),
        greeks: { delta: type === 'CE' ? (S > K ? 1 : 0) : (S < K ? -1 : 0), gamma: 0, theta: 0, vega: 0, rho: 0 }
      };
    }

    const d1 = (Math.log(S / K) + (r + (sigma * sigma) / 2) * T) / (sigma * Math.sqrt(T));
    const d2 = d1 - sigma * Math.sqrt(T);

    const Nd1 = this.cdf(d1);
    const Nd2 = this.cdf(d2);
    const N_minus_d1 = this.cdf(-d1);
    const N_minus_d2 = this.cdf(-d2);
    const nd1 = this.pdf(d1);

    let price = 0;
    let delta = 0;
    let rho = 0;

    if (type === 'CE') {
      price = S * Nd1 - K * Math.exp(-r * T) * Nd2;
      delta = Nd1;
      rho = (K * T * Math.exp(-r * T) * Nd2) / 100;
    } else {
      price = K * Math.exp(-r * T) * N_minus_d2 - S * N_minus_d1;
      delta = Nd1 - 1;
      rho = (-K * T * Math.exp(-r * T) * N_minus_d2) / 100;
    }

    const gamma = nd1 / (S * sigma * Math.sqrt(T));
    const vega = (S * Math.sqrt(T) * nd1) / 100; // per 1% change in vol
    const thetaAnnual = -(S * nd1 * sigma) / (2 * Math.sqrt(T)) - (type === 'CE' ? r * K * Math.exp(-r * T) * Nd2 : -r * K * Math.exp(-r * T) * N_minus_d2);
    const thetaDaily = thetaAnnual / 365; // 1-day theta decay

    return {
      price: Math.max(0.05, Number(price.toFixed(2))),
      greeks: {
        delta: Number(delta.toFixed(4)),
        gamma: Number(gamma.toFixed(6)),
        theta: Number(thetaDaily.toFixed(2)),
        vega: Number(vega.toFixed(2)),
        rho: Number(rho.toFixed(4))
      }
    };
  }
}

