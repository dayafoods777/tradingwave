# Backtesting & Simulation Analysis
**Classification:** `VERIFIED` (Reference Behavior) & `PROPOSED` (TradingWave Engine)

---

## 1. Simulation Mechanics & Assumptions

Tradetron's backtester simulates strategy execution on historical 1-minute OHLCV candles with basic tick interpolation:

| Backtesting Parameter | Tradetron Reference `[VERIFIED]` | TradingWave Target `[PROPOSED]` |
|---|---|---|
| **Data Resolution** | 1-minute OHLCV | Tick-level data (1-second resampled) + 1-min fallback |
| **Slippage Model** | Fixed percentage or point deduction | Dynamic bid-ask spread expansion + volume participation |
| **Transaction Taxes & Charges** | Approximate brokerage deduction | Full Indian regulatory schedule (STT, Exchange turnover, GST, Stamp duty) |
| **Execution Sequencing** | Sequential leg evaluation | Simultaneous leg matching with partial fill simulation |
| **Lookahead Prevention** | Evaluated on bar completion | Strict timestamp fencing; future bars structurally unreachable |
