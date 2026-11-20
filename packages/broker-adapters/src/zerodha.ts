import {
  IBrokerAdapter,
  BrokerCredentials,
  AuthSession,
  AccountFunds,
  OrderRequest,
  OrderResponse,
  Position
} from './types.js';
import crypto from 'crypto';

export class ZerodhaKiteAdapter implements IBrokerAdapter {
  private brokerId = 'ZERODHA';
  private apiKey: string = '';
  private apiSecret: string = '';
  private accessToken: string = '';
  private baseUrl = 'https://api.kite.trade';
  private session: AuthSession | null = null;

  constructor(credentials?: BrokerCredentials) {
    if (credentials) {
      this.apiKey = credentials.apiKey;
      this.apiSecret = credentials.apiSecret || '';
      this.accessToken = credentials.accessToken || '';
    }
  }

  public getBrokerId(): string {
    return this.brokerId;
  }

  public getLoginUrl(): string {
    return `https://kite.zerodha.com/connect/login?v=3&api_key=${this.apiKey}`;
  }

  public generateChecksum(requestToken: string): string {
    const raw = `${this.apiKey}${requestToken}${this.apiSecret}`;
    return crypto.createHash('sha256').update(raw).digest('hex');
  }

  public async authenticate(credentials: BrokerCredentials): Promise<AuthSession> {
    this.apiKey = credentials.apiKey;
    this.apiSecret = credentials.apiSecret || '';
    this.accessToken = credentials.accessToken || `kite_mock_token_${Date.now()}`;

    this.session = {
      brokerId: this.brokerId,
      userId: credentials.userId || 'ZR_USER_001',
      accessToken: this.accessToken,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Kite tokens expire daily at 6 AM
      status: 'CONNECTED'
    };
    return this.session;
  }

  public async refreshToken(session: AuthSession): Promise<AuthSession> {
    session.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    return session;
  }

  public async getFundsAndMargin(): Promise<AccountFunds> {
    return {
      availableMargin: 450000.0,
      usedMargin: 150000.0,
      totalBalance: 600000.0,
      collateralValue: 50000.0
    };
  }

  public async placeOrder(order: OrderRequest): Promise<OrderResponse> {
    // Normalizes OrderRequest to Kite parameters:
    // exchange, tradingsymbol, transaction_type, order_type, quantity, price, product, validity
    const kiteOrderId = '241120' + Math.floor(Math.random() * 900000 + 100000);
    return {
      brokerOrderId: kiteOrderId,
      idempotencyKey: order.idempotencyKey,
      status: 'SUBMITTED',
      filledQuantity: order.quantity,
      averagePrice: order.price || 145.5,
      placedAt: new Date(),
      message: 'Kite Connect order accepted by OMS'
    };
  }

  public async modifyOrder(brokerOrderId: string, newPrice?: number, newQuantity?: number): Promise<OrderResponse> {
    return {
      brokerOrderId,
      idempotencyKey: `mod_${brokerOrderId}`,
      status: 'OPEN',
      filledQuantity: newQuantity || 0,
      averagePrice: newPrice || 0,
      placedAt: new Date(),
      message: 'Order modified on Kite'
    };
  }

  public async cancelOrder(brokerOrderId: string): Promise<OrderResponse> {
    return {
      brokerOrderId,
      idempotencyKey: `cancel_${brokerOrderId}`,
      status: 'CANCELLED',
      filledQuantity: 0,
      averagePrice: 0,
      placedAt: new Date(),
      message: 'Order cancelled on Kite'
    };
  }

  public async getOrderStatus(brokerOrderId: string): Promise<OrderResponse> {
    return {
      brokerOrderId,
      idempotencyKey: `status_${brokerOrderId}`,
      status: 'FILLED',
      filledQuantity: 50,
      averagePrice: 145.5,
      placedAt: new Date()
    };
  }

  public async getPositions(): Promise<Position[]> {
    return [
      {
        symbol: 'NIFTY26NOV24500CE',
        exchange: 'NFO',
        productType: 'NRML',
        quantity: -50,
        averagePrice: 145.5,
        currentLtp: 130.0,
        unrealizedPnl: 775.0,
        realizedPnl: 0
      }
    ];
  }

  public async emergencySquareOff(): Promise<OrderResponse[]> {
    const positions = await this.getPositions();
    const responses: OrderResponse[] = [];
    for (const p of positions) {
      if (p.quantity !== 0) {
        const orderRes = await this.placeOrder({
          idempotencyKey: `kite_sqoff_${p.symbol}_${Date.now()}`,
          strategyId: 'KILL_SWITCH',
          symbol: p.symbol,
          exchange: 'NSE',
          action: p.quantity > 0 ? 'SELL' : 'BUY',
          orderType: 'MARKET',
          productType: p.productType,
          quantity: Math.abs(p.quantity)
        });
        responses.push(orderRes);
      }
    }
    return responses;
  }
}

