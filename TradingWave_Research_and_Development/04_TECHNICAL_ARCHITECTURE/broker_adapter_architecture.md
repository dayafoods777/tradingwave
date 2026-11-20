# Broker Adapter Architecture
**Classification:** `PROPOSED`

---

## 1. Unified Interface: `IBrokerAdapter`

All broker integrations implement a strictly typed TypeScript interface, completely isolating strategy logic from broker quirks:

```typescript
export interface IBrokerAdapter {
  getBrokerId(): string;
  authenticate(credentials: BrokerCredentials): Promise<AuthSession>;
  refreshToken(session: AuthSession): Promise<AuthSession>;
  getProfile(): Promise<UserProfile>;
  getFundsAndMargin(): Promise<AccountFunds>;
  placeOrder(order: OrderRequest): Promise<OrderResponse>;
  modifyOrder(orderId: string, modifications: OrderModification): Promise<OrderResponse>;
  cancelOrder(orderId: string): Promise<OrderResponse>;
  getOrderStatus(orderId: string): Promise<OrderState>;
  getPositions(): Promise<Position[]>;
  getTradeBook(): Promise<Trade[]>;
  subscribeMarketData(symbols: string[]): Promise<void>;
  emergencySquareOff(): Promise<SquareOffResult>;
}
```
