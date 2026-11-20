# Backtesting Engine Architecture
**Classification:** `PROPOSED`

---

## 1. Deterministic Simulation Principles

1. **Zero Lookahead Bias:** Candle timestamps strictly represent the end of the time interval. Calculations on bar `T` only access data `0 <= t <= T`.
2. **Realistic Fill Simulation:** Market orders fill at next bar's Open or Volume-Weighted Average Price (VWAP); Limit orders fill only if price trades through limit price with sufficient volume.
3. **Regulatory Fee Schedule:** Accurately models Indian STT (0.0625% on option sell), Exchange turnover (0.05% on options), GST (18%), and SEBI turnover charges.
