# TradingWave Repository Structure (Turborepo Monorepo)
**Classification:** `PROPOSED`

---

```
tradingwave/
├── apps/
│   ├── web/                    # Next.js 15 Web Application
│   └── docs/                   # Developer Documentation & OpenAPI UI
├── packages/
│   ├── api/                    # Fastify Backend Modular Monolith
│   ├── dsl/                    # Strategy AST Schema, Parser, Evaluator
│   ├── broker-adapters/        # Zerodha, Dhan, Angel One connectors
│   ├── market-data/            # Ingestion, Resampling & Greeks engine
│   ├── execution-engine/       # BullMQ order processing workers
│   ├── database/               # Kysely schema, migrations, seeds
│   ├── ui/                     # Shared Tailwind / shadcn/ui components
│   └── tsconfig/               # Shared TypeScript configurations
├── docker/                     # Dockerfiles & docker-compose configurations
├── turbo.json                  # Turborepo pipeline configuration
└── package.json
```
