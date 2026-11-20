# Market Data Providers & Sourcing
**Classification:** `PROPOSED`

---

1. **Primary Tick Feed:** Direct Broker WebSockets (Zerodha, Dhan) for active trader symbols.
2. **Commercial Real-Time Feed:** TrueData or Global DataFeeds (GDFL) for whole-market NSE/BSE/MCX depth and options chains.
3. **Historical Data:** Stored in TimescaleDB hypertable partition from 2018 to present.
