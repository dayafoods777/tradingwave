# Docker & Container Architecture
**Classification:** `PROPOSED`

---

A multi-stage `docker-compose.yml` orchestrates:
- `api`: Fastify backend gateway
- `web`: Next.js frontend
- `workers`: BullMQ execution workers
- `postgres`: PostgreSQL 16 with TimescaleDB
- `redis`: Redis 7
- `centrifugo`: Centrifugo real-time WebSocket server
