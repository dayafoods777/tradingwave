# Market Data Architecture & Resampling
**Classification:** `PROPOSED`

---

## 1. Ingestion & Storage Topology

1. **WebSocket Ingestors:** Connect to commercial market data feeds (TrueData, Global DataFeeds) and broker WebSocket streams.
2. **Candle Resampler:** In-memory high-throughput aggregator constructing 1-min, 3-min, 5-min, 15-min, and daily candles from raw ticks.
3. **TimescaleDB Store:** Compressed hypertable storing historical ticks and OHLCV bars with sub-millisecond query performance for backtesting.
