# Backend Architecture Specification
**Classification:** `PROPOSED`

---

## 1. Modular Monolith Architecture

Built with **Node.js 24 LTS and Fastify**, structured as domain modules:

```
src/
├── modules/
│   ├── identity/          # Auth, MFA, Organizations, API Keys
│   ├── strategies/        # Strategy CRUD, Versioning, DSL AST Compiler
│   ├── deployment/        # Deployments (Paper vs Live Auto), Bot Lifecycle
│   ├── market_data/       # Tick subscription, Candle resampling, Greeks
│   ├── broker_adapters/   # Provider-agnostic broker connectors
│   ├── execution/         # Order state machine, Position manager, OMS
│   ├── risk/              # Pre-trade checks, Kill-switch, Drawdown limiter
│   ├── backtesting/       # Deterministic historical simulation engine
│   └── marketplace/       # Public strategy discovery, Subscriptions, Royalties
└── shared/
    ├── dsl/               # Abstract Syntax Tree parser, typechecker, evaluator
    ├── database/          # Kysely / Drizzle query builder & migrations
    └── redis/             # Cache, distributed locks, BullMQ queues
```
