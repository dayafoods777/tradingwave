# Local Development Setup Guide
**Classification:** `PROPOSED`

---

```bash
# Clone repository
git clone https://github.com/tradingwave/tradingwave.git
cd tradingwave

# Copy environment variables
cp .env.example .env

# Start local infrastructure (Postgres, Timescale, Redis, Centrifugo)
docker compose up -d

# Install dependencies and run database migrations
pnpm install
pnpm db:migrate
pnpm db:seed

# Start development servers
pnpm dev
```
