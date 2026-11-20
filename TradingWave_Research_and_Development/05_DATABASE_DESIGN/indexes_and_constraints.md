# Indexes, Constraints & Performance Tuning
**Classification:** `PROPOSED`

---

- `idx_strategies_user_id`: B-Tree index on `strategies(user_id)`.
- `idx_strategies_dsl_ast`: GIN index on `strategies USING gin (dsl_ast)` for querying keyword usage.
- `idx_deployed_bots_status`: Partial index on `deployed_bots(status) WHERE status = 'ACTIVE'`.
- `idx_orders_bot_status`: Composite index on `orders(deployed_bot_id, status)`.
- `idx_positions_bot`: Unique composite constraint on `positions(deployed_bot_id, symbol)`.
