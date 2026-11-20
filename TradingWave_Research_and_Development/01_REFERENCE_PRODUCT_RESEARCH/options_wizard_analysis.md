# Options Wizard & Advanced Wizard Analysis
**Classification:** `VERIFIED`

---

## 1. Supported Strategy Archetypes

The reference product supports automated guided construction for:
1. **Short Straddle:** ATM Call Sell + ATM Put Sell (Intraday theta decay).
2. **Short Strangle:** OTM Call Sell + OTM Put Sell with configurable strike gaps.
3. **Iron Condor:** 4-leg defined risk strategy (Strangle sell + outer wing OTM buys).
4. **Iron Butterfly:** 4-leg defined risk strategy (Straddle sell + outer wing OTM buys).
5. **Calendar Spread:** Near-month short option + far-month long option.
6. **Ratio Spread:** Unequal long/short leg combinations for directional bias.

### Dynamic Strike Selection Modalities:
- **ATM Spot / ATM Futures:** Strike nearest to underlying market price.
- **Delta-Based Strike:** Selects strike having closest Delta (e.g. 0.20 Delta wings).
- **Straddle Width Percentage:** Strike offset based on combined ATM straddle premium.
- **Step Offset:** Numerical step away from ATM (e.g. ATM + 2 strikes OTM).
