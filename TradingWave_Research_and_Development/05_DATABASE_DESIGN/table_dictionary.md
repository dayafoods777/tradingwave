# Table Dictionary & Field Specifications
**Classification:** `PROPOSED`

---

### Core Domain Tables:
1. `tenants`: Multi-tenant organization isolation and SaaS billing tier boundaries.
2. `users`: Trader authentication, RBAC roles (Admin, Trader, Creator), 2FA state.
3. `strategies`: Versioned strategy definitions, root underlying symbol, and compiled JSONB AST.
4. `strategy_sets`: Independent sub-strategies containing Entry, Repair, and Exit rules.
5. `strategy_legs`: Multi-leg instrument templates with strike selection offsets and multipliers.
6. `broker_accounts`: Securely encrypted broker API credentials, access tokens, and connection state.
7. `deployed_bots`: Active execution instances in Paper or Live Auto modes.
8. `orders`: Full order lifecycle tracking with broker IDs, status codes, and error reasons.
9. `positions`: Real-time aggregated open positions and MTM PnL for deployed bots.
10. `trades`: Individual execution fill records with exact exchange timestamps and transaction fees.
11. `audit_logs`: Immutable security trail recording all user actions, logins, and order triggers.
