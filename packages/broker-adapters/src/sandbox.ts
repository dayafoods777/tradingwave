import {
  IBrokerAdapter,
  BrokerCredentials,
  AuthSession,
  AccountFunds,
  OrderRequest,
  OrderResponse,
  Position,
  OrderStatus
} from './types.js';
import { OrderStateMachine } from './state-machine.js';

export interface SandboxConfig {
  initialBalance?: number;
  simulatedLatencyMs?: number;
  shouldRejectOrders?: boolean;
  rejectReason?: string;
  simulatedSlippagePct?: number;
}

export class SandboxBrokerAdapter implements IBrokerAdapter {
  private brokerId = 'SANDBOX';
  private funds: AccountFunds;
  private orders: Map<string, OrderResponse> = new Map();
  private idempotencyStore: Map<string, string> = new Map(); // idempotencyKey -> brokerOrderId
  private positions: Map<string, Position> = new Map();
  private config: SandboxConfig;
  private session: AuthSession | null = null;

  constructor(config: SandboxConfig = {}) {
    this.config = {
      initialBalance: config.initialBalance ?? 1000000.0, // 10 Lakhs default
      simulatedLatencyMs: config.simulatedLatencyMs ?? 10,
      shouldRejectOrders: config.shouldRejectOrders ?? false,
      rejectReason: config.rejectReason ?? 'Simulated broker error',
      simulatedSlippagePct: config.simulatedSlippagePct ?? 0.05
    };

    this.funds = {
      totalBalance: this.config.initialBalance!,
      availableMargin: this.config.initialBalance!,
      usedMargin: 0.0,
      collateralValue: 0.0
    };
  }

  public getBrokerId(): string {
    return this.brokerId;
  }

  public async authenticate(credentials: BrokerCredentials): Promise<AuthSession> {
    if (!credentials.apiKey) {
      throw new Error('API Key required for sandbox authentication.');
    }
    this.session = {
      brokerId: this.brokerId,
      userId: credentials.userId || 'SBX_USER_001',
      accessToken: 'sbx_access_token_' + Date.now(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      status: 'CONNECTED'
    };
    return this.session;
  }

  public async refreshToken(session: AuthSession): Promise<AuthSession> {
    session.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    return session;
  }

  public async getFundsAndMargin(): Promise<AccountFunds> {
    return { ...this.funds };
  }

  public async placeOrder(order: OrderRequest): Promise<OrderResponse> {
    // Idempotency check: prevent duplicate order submission
    if (this.idempotencyStore.has(order.idempotencyKey)) {
      const existingOrderId = this.idempotencyStore.get(order.idempotencyKey)!;
      return this.orders.get(existingOrderId)!;
    }

    if (this.config.shouldRejectOrders) {
      const rejectedOrder: OrderResponse = {
        brokerOrderId: 'SBX_ORD_' + Math.floor(Math.random() * 1000000),
        idempotencyKey: order.idempotencyKey,
        status: 'REJECTED',
        filledQuantity: 0,
        averagePrice: 0,
        placedAt: new Date(),
        message: this.config.rejectReason
      };
      this.orders.set(rejectedOrder.brokerOrderId, rejectedOrder);
      this.idempotencyStore.set(order.idempotencyKey, rejectedOrder.brokerOrderId);
      return rejectedOrder;
    }

    // Required margin estimation (e.g. 15% of trade value for F&O, 100% for Cash)
    const basePrice = order.price || 150.0;
    const slippageMultiplier = order.action === 'BUY' ? (1 + (this.config.simulatedSlippagePct! / 100)) : (1 - (this.config.simulatedSlippagePct! / 100));
    const executionPrice = Number((basePrice * slippageMultiplier).toFixed(2));
    const tradeValue = executionPrice * order.quantity;
    const requiredMargin = tradeValue * 0.2; // 20% margin requirement

    if (this.funds.availableMargin < requiredMargin) {
      const marginReject: OrderResponse = {
        brokerOrderId: 'SBX_ORD_' + Math.floor(Math.random() * 1000000),
        idempotencyKey: order.idempotencyKey,
        status: 'REJECTED',
        filledQuantity: 0,
        averagePrice: 0,
        placedAt: new Date(),
        message: `Insufficient margin. Required: ₹${requiredMargin.toFixed(2)}, Available: ₹${this.funds.availableMargin.toFixed(2)}`
      };
      this.orders.set(marginReject.brokerOrderId, marginReject);
      this.idempotencyStore.set(order.idempotencyKey, marginReject.brokerOrderId);
      return marginReject;
    }

    // Execute order fill in sandbox
    const brokerOrderId = 'SBX_ORD_' + Math.floor(Math.random() * 1000000);
    const orderResponse: OrderResponse = {
      brokerOrderId,
      idempotencyKey: order.idempotencyKey,
      status: 'FILLED',
      filledQuantity: order.quantity,
      averagePrice: executionPrice,
      placedAt: new Date(),
      message: 'Order executed successfully in Sandbox'
    };

    // Update Sandbox Ledger
    this.funds.availableMargin -= requiredMargin;
    this.funds.usedMargin += requiredMargin;
    this.orders.set(brokerOrderId, orderResponse);
    this.idempotencyStore.set(order.idempotencyKey, brokerOrderId);

    // Update Positions
    this.updatePosition(order, executionPrice);

    return orderResponse;
  }

  public async modifyOrder(brokerOrderId: string, newPrice?: number, newQuantity?: number): Promise<OrderResponse> {
    const existing = this.orders.get(brokerOrderId);
    if (!existing) throw new Error(`Order ${brokerOrderId} not found.`);
    if (OrderStateMachine.isFinalState(existing.status)) {
      throw new Error(`Cannot modify order in final status: ${existing.status}`);
    }
    if (newPrice) existing.averagePrice = newPrice;
    if (newQuantity) existing.filledQuantity = newQuantity;
    return existing;
  }

  public async cancelOrder(brokerOrderId: string): Promise<OrderResponse> {
    const existing = this.orders.get(brokerOrderId);
    if (!existing) throw new Error(`Order ${brokerOrderId} not found.`);
    OrderStateMachine.validateTransition(existing.status, 'CANCELLED');
    existing.status = 'CANCELLED';
    return existing;
  }

  public async getOrderStatus(brokerOrderId: string): Promise<OrderResponse> {
    const existing = this.orders.get(brokerOrderId);
    if (!existing) throw new Error(`Order ${brokerOrderId} not found.`);
    return existing;
  }

  public async getPositions(): Promise<Position[]> {
    return Array.from(this.positions.values());
  }

  public async emergencySquareOff(): Promise<OrderResponse[]> {
    const results: OrderResponse[] = [];
    for (const pos of this.positions.values()) {
      if (pos.quantity !== 0) {
        const action = pos.quantity > 0 ? 'SELL' : 'BUY';
        const squareOffOrder: OrderRequest = {
          idempotencyKey: `sqoff_${pos.symbol}_${Date.now()}`,
          strategyId: 'EMERGENCY_KILL_SWITCH',
          symbol: pos.symbol,
          exchange: 'NSE',
          action,
          orderType: 'MARKET',
          productType: pos.productType,
          quantity: Math.abs(pos.quantity)
        };
        const res = await this.placeOrder(squareOffOrder);
        results.push(res);
      }
    }
    return results;
  }

  private updatePosition(order: OrderRequest, fillPrice: number): void {
    const deltaQty = order.action === 'BUY' ? order.quantity : -order.quantity;
    let pos = this.positions.get(order.symbol);

    if (!pos) {
      pos = {
        symbol: order.symbol,
        exchange: order.exchange,
        productType: order.productType,
        quantity: deltaQty,
        averagePrice: fillPrice,
        currentLtp: fillPrice,
        unrealizedPnl: 0,
        realizedPnl: 0
      };
      this.positions.set(order.symbol, pos);
    } else {
      const prevQty = pos.quantity;
      const newQty = prevQty + deltaQty;

      if ((prevQty > 0 && deltaQty > 0) || (prevQty < 0 && deltaQty < 0)) {
        // Adding to position
        const totalCost = (Math.abs(prevQty) * pos.averagePrice) + (Math.abs(deltaQty) * fillPrice);
        pos.averagePrice = Number((totalCost / Math.abs(newQty)).toFixed(2));
      } else {
        // Reducing or reversing position
        const closingQty = Math.min(Math.abs(prevQty), Math.abs(deltaQty));
        const realized = (fillPrice - pos.averagePrice) * (prevQty > 0 ? 1 : -1) * closingQty;
        pos.realizedPnl += Number(realized.toFixed(2));
      }

      pos.quantity = newQty;
      pos.currentLtp = fillPrice;
    }
  }
}

