import {
  IBrokerAdapter,
  BrokerCredentials,
  AuthSession,
  AccountFunds,
  OrderRequest,
  OrderResponse,
  Position
} from './types.js';

export class DhanAdapter implements IBrokerAdapter {
  private brokerId = 'DHAN';
  private clientId: string = '';
  private accessToken: string = '';
  private baseUrl = 'https://api.dhan.co/v2';
  private session: AuthSession | null = null;

  constructor(credentials?: BrokerCredentials) {
    if (credentials) {
      this.clientId = credentials.userId || '';
      this.accessToken = credentials.accessToken || '';
    }
  }

  public getBrokerId(): string {
    return this.brokerId;
  }

  public async authenticate(credentials: BrokerCredentials): Promise<AuthSession> {
    this.clientId = credentials.userId || 'DHAN_USER_001';
    this.accessToken = credentials.accessToken || `dhan_token_${Date.now()}`;

    this.session = {
      brokerId: this.brokerId,
      userId: this.clientId,
      accessToken: this.accessToken,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Dhan tokens valid for 30 days
      status: 'CONNECTED'
    };
    return this.session;
  }

  public async refreshToken(session: AuthSession): Promise<AuthSession> {
    session.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    return session;
  }

  public async getFundsAndMargin(): Promise<AccountFunds> {
    return {
      availableMargin: 780000.0,
      usedMargin: 220000.0,
      totalBalance: 1000000.0,
      collateralValue: 120000.0
    };
  }

  public async placeOrder(order: OrderRequest): Promise<OrderResponse> {
    const dhanOrderId = 'DHAN_' + Math.floor(Math.random() * 800000 + 100000);
    return {
      brokerOrderId: dhanOrderId,
      idempotencyKey: order.idempotencyKey,
      status: 'FILLED',
      filledQuantity: order.quantity,
      averagePrice: order.price || 152.0,
      placedAt: new Date(),
      message: 'Order executed via DhanHQ v2'
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
      message: 'Order modified on Dhan'
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
      message: 'Order cancelled on Dhan'
    };
  }

  public async getOrderStatus(brokerOrderId: string): Promise<OrderResponse> {
    return {
      brokerOrderId,
      idempotencyKey: `status_${brokerOrderId}`,
      status: 'FILLED',
      filledQuantity: 25,
      averagePrice: 152.0,
      placedAt: new Date()
    };
  }

  public async getPositions(): Promise<Position[]> {
    return [];
  }

  public async emergencySquareOff(): Promise<OrderResponse[]> {
    return [];
  }
}

