# Event-Driven Architecture & Real-Time Message Bus
**Classification:** `PROPOSED`

---

## 1. Message Topologies

- **High-Velocity Market Data:** Redis Pub/Sub channels (sub-millisecond pub/sub routing).
- **Reliable Order & Execution Events:** BullMQ persistent queues backed by Redis with automatic retry and dead-letter queues.
- **Client Push Notifications:** Centrifugo WebSocket channels partitioned by user ID (`user_{id}:pnl`, `user_{id}:orders`).
