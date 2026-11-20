import { describe, it, expect } from 'vitest';
import { BlackScholes } from '../src/black-scholes.js';
import { OptionChainGenerator } from '../src/option-chain.js';

describe('Black-Scholes & Option Chain Engine', () => {
  it('should accurately compute European Call & Put option prices', () => {
    const spot = 24500;
    const strike = 24500;
    const T = 7 / 365; // 7 days
    const r = 0.07;
    const iv = 0.15; // 15% IV

    const call = BlackScholes.calculatePriceAndGreeks(spot, strike, T, r, iv, 'CE');
    const put = BlackScholes.calculatePriceAndGreeks(spot, strike, T, r, iv, 'PE');

    expect(call.price).toBeGreaterThan(100);
    expect(call.price).toBeLessThan(300);
    expect(put.price).toBeGreaterThan(100);
    expect(put.price).toBeLessThan(300);

    // ATM Call Delta should be ~0.5, Put Delta should be ~ -0.5
    expect(call.greeks.delta).toBeGreaterThan(0.48);
    expect(call.greeks.delta).toBeLessThan(0.55);
    expect(put.greeks.delta).toBeLessThan(-0.45);
    expect(put.greeks.delta).toBeGreaterThan(-0.52);

    // Theta should be negative (time decay)
    expect(call.greeks.theta).toBeLessThan(0);
    expect(put.greeks.theta).toBeLessThan(0);
  });

  it('should generate a symmetric Option Chain around ATM strike', () => {
    const chain = OptionChainGenerator.generateOptionChain('NIFTY', 24530, 50, 5, 4, 0.14);

    expect(chain.underlyingSymbol).toBe('NIFTY');
    expect(chain.underlyingPrice).toBe(24530);
    expect(chain.strikes).toHaveLength(11); // 5 OTM, 1 ATM, 5 ITM

    const atm = chain.strikes.find(s => s.isAtm);
    expect(atm).toBeDefined();
    expect(atm?.strike).toBe(24550); // nearest 50 step to 24530
    expect(atm?.call.ltp).toBeGreaterThan(0);
    expect(atm?.put.ltp).toBeGreaterThan(0);
  });
});

