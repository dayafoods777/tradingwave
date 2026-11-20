import { describe, it, expect } from 'vitest';
import { ZerodhaKiteAdapter } from '../src/zerodha.js';
import { DhanAdapter } from '../src/dhan.js';
import { OrderRequest } from '../src/types.js';

describe('Indian Broker Direct Adapters (Zerodha Kite & DhanHQ)', () => {
  it('Zerodha Kite Adapter: should generate SHA-256 login checksum and authenticate', async () => {
    const kite = new ZerodhaKiteAdapter({
      apiKey: 'test_kite_key',
      apiSecret: 'test_kite_secret'
    });

    const loginUrl = kite.getLoginUrl();
    expect(loginUrl).toContain('https://kite.zerodha.com/connect/login');
    expect(loginUrl).toContain('api_key=test_kite_key');

    const checksum = kite.generateChecksum('mock_request_token_123');
    expect(checksum).toHaveLength(64); // SHA-256 hex string

    const session = await kite.authenticate({ apiKey: 'test_kite_key', userId: 'ZR1234' });
    expect(session.status).toBe('CONNECTED');
    expect(session.brokerId).toBe('ZERODHA');

    const funds = await kite.getFundsAndMargin();
    expect(funds.availableMargin).toBeGreaterThan(0);
  });

  it('Zerodha Kite Adapter: should place and square off orders', async () => {
    const kite = new ZerodhaKiteAdapter();
    const order: OrderRequest = {
      idempotencyKey: 'kite-ord-1',
      strategyId: 'strat-1',
      symbol: 'NIFTY24500CE',
      exchange: 'NSE',
      action: 'BUY',
      orderType: 'MARKET',
      productType: 'MIS',
      quantity: 50
    };

    const res = await kite.placeOrder(order);
    expect(res.status).toBe('SUBMITTED');
    expect(res.brokerOrderId).toContain('241120');

    const positions = await kite.getPositions();
    expect(positions).toHaveLength(1);
    expect(positions[0].symbol).toBe('NIFTY26NOV24500CE');
  });

  it('DhanHQ Adapter: should authenticate with 30-day token and execute orders', async () => {
    const dhan = new DhanAdapter();
    const session = await dhan.authenticate({ apiKey: 'dhan_key', userId: '100023485' });

    expect(session.status).toBe('CONNECTED');
    expect(session.brokerId).toBe('DHAN');
    // Token valid for 30 days
    const daysValid = (session.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    expect(daysValid).toBeGreaterThan(28);

    const res = await dhan.placeOrder({
      idempotencyKey: 'dhan-ord-1',
      strategyId: 'strat-1',
      symbol: 'BANKNIFTY52000PE',
      exchange: 'NSE',
      action: 'SELL',
      orderType: 'MARKET',
      productType: 'NRML',
      quantity: 15
    });

    expect(res.status).toBe('FILLED');
    expect(res.brokerOrderId).toContain('DHAN_');
  });
});

