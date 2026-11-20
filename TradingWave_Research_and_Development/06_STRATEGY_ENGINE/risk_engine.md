# Risk Engine & Guardrails Specification
**Classification:** `PROPOSED`

---

## 1. Multi-Tiered Risk Gates

1. **Account-Level Max Loss (Daily MTM Kill-Switch):** Immediate square-off of all active bots if daily net loss crosses threshold.
2. **Per-Strategy Capital Limit:** Restricts total margin utilization of any single strategy.
3. **Price Collar Checks:** Prevents executing orders if live market price has drifted >2% from trigger price (avoids runaway slippage on illiquid strikes).
4. **Order Rate Limiter (Throttler):** Maximum 10 orders per second per broker account to avoid exchange bans.
