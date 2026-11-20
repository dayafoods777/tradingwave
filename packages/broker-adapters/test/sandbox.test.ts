import { describe, it, expect, beforeEach } from 'vitest';
import { SandboxBrokerAdapter } from '../src/sandbox.js';
import { OrderStateMachine } from '../src/state-machine.js';
import { OrderRequest } from '../src/types.js';

describe('Sandbox Broker Adapter & Order State Machine', () => {
  let broker: SandboxBrokerAdapter;

  beforeEach(() => {
    broker = new SandboxBrokerAdapter({ initialBalance: 500000 });
  });

  it('should authenticate successfully with API key', async () => {
    const session = await broker.authenticate({ apiKey: 'mock_key', userId: 'USER_1' });
    expect(session.status).toBe('CONNECTED');
    expect(session.brokerId).toBe('SANDBOX');
  });

  it('should place an order and update positions and margin', async () => {
    const order: OrderRequest = {
      idempotencyKey: 'idemp-1',
      strategyId: 'strat-1',
      symbol: 'NIFTY26NOV24500CE',
      exchange: 'NSE',
      action: 'BUY',
      orderType: 'MARKET',
      productType: 'MIS',
      quantity: 50,
      price: 120.0
    };

    const res = await broker.placeOrder(order);
    expect(res.status).toBe('FILLED');
    expect(res.filledQuantity).toBe(50);
    expect(res.averagePrice).toBeGreaterThan(0);

    const positions = await broker.getPositions();
    expect(positions).toHaveLength(1);
    expect(positions[0].symbol).toBe('NIFTY26NOV24500CE');
    expect(positions[0].quantity).toBe(50);

    const funds = await broker.getFundsAndMargin();
    expect(funds.usedMargin).toBeGreaterThan(0);
    expect(funds.availableMargin).toBeLessThan(500000);
  });

  it('should be idempotent and return identical response on duplicate order request', async () => {
    const order: OrderRequest = {
      idempotencyKey: 'idemp-dup-test',
      strategyId: 'strat-1',
      symbol: 'BANKNIFTY52000CE',
      exchange: 'NSE',
      action: 'SELL',
      orderType: 'MARKET',
      productType: 'MIS',
      quantity: 15,
      price: 250.0
    };

    const res1 = await broker.placeOrder(order);
    const res2 = await broker.placeOrder(order);

    expect(res1.brokerOrderId).toBe(res2.brokerOrderId);
    expect(res1.averagePrice).toBe(res2.averagePrice);

    // Verify position was not doubled
    const positions = await broker.getPositions();
    expect(positions.find(p => p.symbol === 'BANKNIFTY52000CE')?.quantity).toBe(-15);
  });

  it('should reject order if insufficient margin is available', async () => {
    const smallBroker = new SandboxBrokerAdapter({ initialBalance: 100 });
    const order: OrderRequest = {
      idempotencyKey: 'idemp-margin-fail',
      strategyId: 'strat-1',
      symbol: 'RELIANCE',
      exchange: 'NSE',
      action: 'BUY',
      orderType: 'MARKET',
      productType: 'CNC',
      quantity: 1000,
      price: 3000.0
    };

    const res = await smallBroker.placeOrder(order);
    expect(res.status).toBe('REJECTED');
    expect(res.message).toContain('Insufficient margin');
  });

  it('should execute emergency square-off correctly', async () => {
    // Open two positions
    await broker.placeOrder({
      idempotencyKey: 'buy-1',
      strategyId: 'strat-1',
      symbol: 'TCS',
      exchange: 'NSE',
      action: 'BUY',
      orderType: 'MARKET',
      productType: 'MIS',
      quantity: 10
    });

    await broker.placeOrder({
      idempotencyKey: 'sell-1',
      strategyId: 'strat-1',
      symbol: 'INFY',
      exchange: 'NSE',
      action: 'SELL',
      orderType: 'MARKET',
      productType: 'MIS',
      quantity: 20
    });

    const squareOffOrders = await broker.emergencySquareOff();
    expect(squareOffOrders).toHaveLength(2);

    const positions = await broker.getPositions();
    expect(positions.find(p => p.symbol === 'TCS')?.quantity).toBe(0);
    expect(positions.find(p => p.symbol === 'INFY')?.quantity).toBe(0);
  });

  it('should validate order state machine transitions strictly', () => {
    expect(OrderStateMachine.canTransition('PENDING', 'SUBMITTED')).toBe(true);
    expect(OrderStateMachine.canTransition('SUBMITTED', 'FILLED')).toBe(true);
    expect(OrderStateMachine.canTransition('FILLED', 'CANCELLED')).toBe(false);
    expect(() => OrderStateMachine.validateTransition('FILLED', 'SUBMITTED')).toThrow();
  });
});

