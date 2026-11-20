# Page Layouts & Wireframes
**Classification:** `PROPOSED`

---

## 1. Application Shell Layout

```
+-----------------------------------------------------------------------------------+
|  [W] TradingWave  |  Strategies  Deployments  Marketplace  Reports  | [₹ 12,450.00] (User) |
+-----------------------------------------------------------------------------------+
| Side Nav  |  Active Strategy: NIFTY Theta Scalper v2.1             [Deploy] [Save] |
|-----------+-----------------------------------------------------------------------|
| Dashboard | +-------------------------------------------------------------------+ |
| Strategies| | SET 1: Intraday 9:20 Straddle (Active)              [+ Add Set]   | |
| Deployed  | |-------------------------------------------------------------------| |
| Positions | | Entry Condition:                                                  | |
| Brokers   | | [Time >= 09:20] AND [Supertrend(10,3) == 1]                      | |
| Backtest  | |-------------------------------------------------------------------| |
| Settings  | | Position Legs:                                                    | |
|           | | 1. SELL NIFTY CE [Current Week] [ATM] [1 Lot] [SL: 25%]           | |
|           | | 2. SELL NIFTY PE [Current Week] [ATM] [1 Lot] [SL: 25%]           | |
|           | |-------------------------------------------------------------------| |
|           | | Set Exit Condition:                                               | |
|           | | [Time >= 15:15] OR [Set PnL <= -3000]                             | |
|           | +-------------------------------------------------------------------+ |
+-----------------------------------------------------------------------------------+
```
