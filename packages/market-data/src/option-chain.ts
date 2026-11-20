import { BlackScholes } from './black-scholes.js';
import { OptionChainSnapshot, OptionChainStrike, OptionContract } from './types.js';

export class OptionChainGenerator {
  public static generateOptionChain(
    underlyingSymbol: string,
    spotPrice: number,
    strikeStep: number,
    numStrikesEachSide: number = 7,
    daysToExpiry: number = 5,
    baseIV: number = 0.14
  ): OptionChainSnapshot {
    const atmStrike = Math.round(spotPrice / strikeStep) * strikeStep;
    const T = Math.max(0.001, daysToExpiry / 365.0);
    const r = 0.07; // 7% RBI risk-free rate assumption

    const strikes: OptionChainStrike[] = [];

    for (let i = -numStrikesEachSide; i <= numStrikesEachSide; i++) {
      const strike = atmStrike + (i * strikeStep);
      const isAtm = strike === atmStrike;

      // Volatility skew: OTM puts slightly higher IV, OTM calls slightly lower IV
      const skew = 1.0 + (atmStrike - strike) * 0.00005;
      const iv = Math.max(0.08, baseIV * skew);

      const callResult = BlackScholes.calculatePriceAndGreeks(spotPrice, strike, T, r, iv, 'CE');
      const putResult = BlackScholes.calculatePriceAndGreeks(spotPrice, strike, T, r, iv, 'PE');

      const callContract: OptionContract = {
        symbol: `${underlyingSymbol}${strike}CE`,
        strike,
        optionType: 'CE',
        expiry: `${daysToExpiry}D_EXP`,
        ltp: callResult.price,
        bidPrice: Number((callResult.price * 0.998).toFixed(2)),
        askPrice: Number((callResult.price * 1.002).toFixed(2)),
        volume: Math.floor(Math.random() * 50000) + 5000,
        openInterest: Math.floor(Math.random() * 200000) + 20000,
        impliedVolatility: Number((iv * 100).toFixed(2)),
        greeks: callResult.greeks
      };

      const putContract: OptionContract = {
        symbol: `${underlyingSymbol}${strike}PE`,
        strike,
        optionType: 'PE',
        expiry: `${daysToExpiry}D_EXP`,
        ltp: putResult.price,
        bidPrice: Number((putResult.price * 0.998).toFixed(2)),
        askPrice: Number((putResult.price * 1.002).toFixed(2)),
        volume: Math.floor(Math.random() * 50000) + 5000,
        openInterest: Math.floor(Math.random() * 200000) + 20000,
        impliedVolatility: Number((iv * 100).toFixed(2)),
        greeks: putResult.greeks
      };

      strikes.push({
        strike,
        isAtm,
        call: callContract,
        put: putContract
      });
    }

    return {
      underlyingSymbol,
      underlyingPrice: spotPrice,
      expiry: `${daysToExpiry} Days Remaining`,
      timestamp: new Date(),
      strikes
    };
  }
}

