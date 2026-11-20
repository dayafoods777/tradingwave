# Trading Risk Controls & Circuit Breakers
**Classification:** `PROPOSED`

---

1. **Max Loss Kill-Switch:** Instantly cancels open orders and issues market square-offs if daily loss limit breached.
2. **Order Volume Collar:** Enforces exchange lot size minimums and freeze quantity slicing (e.g. NIFTY 1800 quantity freeze limits).
3. **Stale Data Protection:** Trading halts if market feed is interrupted for >3 seconds.
