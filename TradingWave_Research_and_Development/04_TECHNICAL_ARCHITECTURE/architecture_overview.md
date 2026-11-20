# TradingWave Technical Architecture Overview
**Classification:** `PROPOSED`

---

## 1. Architecture Paradigm

TradingWave adopts a **High-Performance Modular Monolith** for operational simplicity, paired with **Independently Scalable Distributed Execution Workers** for market data streaming and strategy condition evaluation.

```mermaid
flowchart TB
    subgraph Clients["Frontend Clients"]
        Web["Next.js 15 Web App (React 19 / TypeScript)"]
        Mobile["Mobile Web / PWA Client"]
        ExtAPI["External TradingView / Python SDK Clients"]
    end

    subgraph Edge["Edge & Load Balancing"]
        CF["Cloudflare Edge (WAF / DDoS / SSL)"]
        Nginx["Nginx Reverse Proxy & SSL Termination"]
    end

    subgraph Application["Core Application Cluster"]
        FastifyApp["Fastify Modular Monolith API Gateway"]
        AuthModule["Auth & RBAC Module (JWT / Session)"]
        StrategyModule["Strategy Management & DSL Compiler"]
        MarketplaceModule["Marketplace & Creator Royalties"]
        BillingModule["Stripe / Razorpay Billing Engine"]
    end

    subgraph ExecutionSubsystem["Distributed Execution Engine"]
        Queue["BullMQ / Redis Distributed Job Queues"]
        Worker1["Execution Worker (NIFTY/BANKNIFTY)"]
        Worker2["Execution Worker (Equities & StockBags)"]
        Worker3["Execution Worker (Commodities & Crypto)"]
    end

    subgraph DataPlane["Data & Storage Infrastructure"]
        Postgres[(PostgreSQL 16 Multi-Tenant DB)]
        Timescale[(TimescaleDB Tick & Candle Store)]
        RedisCache[(Redis Cluster - Memory State & L1 Cache)]
        Centrifugo["Centrifugo WebSocket Cluster"]
    end

    subgraph ExternalEcosystem["Broker & Market Feeds"]
        MktVendors["Market Data WebSocket Ingestion (TrueData / GDFL)"]
        Brokers["Broker Open Adapters (Zerodha, Dhan, Angel One, etc.)"]
    end

    Clients --> CF --> Nginx --> FastifyApp
    FastifyApp --> Postgres
    FastifyApp --> RedisCache
    FastifyApp --> Queue
    Queue --> Worker1 & Worker2 & Worker3
    Worker1 & Worker2 & Worker3 --> Timescale
    Worker1 & Worker2 & Worker3 --> RedisCache
    Worker1 & Worker2 & Worker3 --> Centrifugo
    Worker1 & Worker2 & Worker3 --> Brokers
    MktVendors --> Worker1 & Worker2 & Worker3
    Centrifugo --> Clients
