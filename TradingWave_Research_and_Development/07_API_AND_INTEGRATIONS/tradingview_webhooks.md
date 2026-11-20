# TradingView Webhooks (PineBridge Equivalent)
**Classification:** `PROPOSED`

---

## 1. Webhook Payload Schema

```json
{
  "secret_token": "tw_live_9f82d1c8...",
  "strategy_id": "b1a2c3d4-...",
  "symbol": "NSE:NIFTY",
  "action": "BUY",
  "order_type": "MARKET",
  "quantity": 50,
  "comment": "Supertrend bullish crossover"
}
```
