export type OrderAction = 'BUY' | 'SELL';
export type OrderType = 'MARKET' | 'LIMIT' | 'SL' | 'SL_M';
export type ProductType = 'MIS' | 'NRML' | 'CNC';
export type OrderStatus = 'PENDING' | 'SUBMITTED' | 'OPEN' | 'PARTIALLY_FILLED' | 'FILLED' | 'CANCELLED' | 'REJECTED';

export interface BrokerCredentials {
  apiKey: string;
  apiSecret?: string;
  accessToken?: string;
  userId?: string;
  totpSecret?: string;
}

export interface AuthSession {
  brokerId: string;
  userId: string;
  accessToken: string;
  expiresAt: Date;
  status: 'CONNECTED' | 'DISCONNECTED' | 'EXPIRED';
}

export interface AccountFunds {
  availableMargin: number;
  usedMargin: number;
  totalBalance: number;
  collateralValue: number;
}

export interface OrderRequest {
  idempotencyKey: string;
  strategyId: string;
  symbol: string;
  exchange: 'NSE' | 'BSE' | 'MCX' | 'CRYPTO';
  action: OrderAction;
  orderType: OrderType;
  productType: ProductType;
  quantity: number;
  price?: number;
  triggerPrice?: number;
  tag?: string;
}

export interface OrderResponse {
  brokerOrderId: string;
  idempotencyKey: string;
  status: OrderStatus;
  filledQuantity: number;
  averagePrice: number;
  placedAt: Date;
  message?: string;
}

export interface Position {
  symbol: string;
  exchange: string;
  productType: ProductType;
  quantity: number;
  averagePrice: number;
  currentLtp: number;
  unrealizedPnl: number;
  realizedPnl: number;
}

export interface IBrokerAdapter {
  getBrokerId(): string;
  authenticate(credentials: BrokerCredentials): Promise<AuthSession>;
  refreshToken(session: AuthSession): Promise<AuthSession>;
  getFundsAndMargin(): Promise<AccountFunds>;
  placeOrder(order: OrderRequest): Promise<OrderResponse>;
  modifyOrder(brokerOrderId: string, newPrice?: number, newQuantity?: number): Promise<OrderResponse>;
  cancelOrder(brokerOrderId: string): Promise<OrderResponse>;
  getOrderStatus(brokerOrderId: string): Promise<OrderResponse>;
  getPositions(): Promise<Position[]>;
  emergencySquareOff(): Promise<OrderResponse[]>;
}

