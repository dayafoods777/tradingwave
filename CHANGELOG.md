# Changelog — TradingWave

All notable changes to the TradingWave project will be documented in this file.

## [0.4.0] - 2026-11-20
### Added
- **Full Tradetron Look, Feel, UX & Architecture Replication** under the TradingWave brand identity ("TRADE BINDAS"):
  - **Tradetron Two-Tier Navigation Header**: TradingWave logo asset with Trade Bindas slogan, "Create" mega dropdown (Build: Using AI, Advanced Strategy Builder, Option Wizard, Advanced Wizard, StockBag, Pine Script, Scalper, Signal Bridge; Ready-made: Pin the Range, Covered Calls, Cash Secured Puts), Marketplace (300+), Brokers (38), Pricing, Regional switch (IND · NSE/MCX vs USA · CBOE), Language switch (English vs हिन्दी), Day/Night theme toggle, and Emergency Universal Kill Switch.
  - **Tradetron Keyword Catalogue Modal**: Full modal browsing across all 214 keywords categorized by Indicators, Time & Calendar, Price & Market Data, Math & Arrays, Position & PnL, Option Greeks with real-time parameter binding, comparator selection, and AST syntax preview.
  - **Advanced Strategy Builder**: Full sets hierarchy (Set 1, Set 2), Entry Conditions block with keyword modal integration, Position Legs table (Action, CE/PE/FUT/EQ, Underlying, Expiry, Strike Formula, MIS/NRML, Lots, SL %, Target %, Move SL to Cost), Repair Conditions block (trigger and repair position leg), Set Exit Conditions block, and Universal Exit / Trailing Stop Loss rules.
  - **Option Wizard & Greek Simulator**: Mathematical SVG Payoff diagram with dynamic breakeven points, Max Profit/Loss, Net Greeks (Delta, Theta, Gamma, Vega), interactive Spot Price slider (±600 pts), and Days to Expiry (DTE 0-7) slider.
  - **Live Symmetric Option Chain**: NSE-style symmetrical Calls vs Strikes vs Puts table with real-time Greeks, Open Interest, Volume, IV, and 1-click "Add Leg" to builder.
  - **Marketplace (300+ Verified Strategies)**: Quant strategy discovery cards with verified badges, 1-Month / All-Time ROI, Max Drawdown, Win Rate %, subscriber counters, 1-click clone and deployment.
  - **38+ Brokers & Exchanges Integration Matrix**: Full grid covering Zerodha Kite, Dhan, Angel One, Groww, Fyers, Upstox, Kotak Neo, 5paisa, AliceBlue, FlatTrade, Finvasia, Motilal Oswal, Paytm Money, CoinDCX, Delta India, etc., with API version details and credentials configuration modal.
  - **Event-Driven Backtest Studio**: Zero-lookahead bias backtesting with custom slippage, regulatory tax schedule (STT, GST, Stamp Duty), interactive Equity Curve SVG chart, and trade-by-trade ledger table.
  - **Pricing Matrix (All 7 Tradetron Tiers)**: Free (₹0), Starter (₹300/mo), Standard (₹1,200/mo), Retail (₹2,500/mo), Retail+ (₹5,000/mo), Creator (₹10,000/mo), and Creator+ (₹25,000/mo) with monthly/yearly billing toggle and 16% discount calculations.
  - **Real-Time Execution Logs Modal & Bot Audit Trail**: Continuous monitoring heartbeat, condition evaluations, risk guard checks, and broker order IDs.
  - **Clean Build & Verification**: 29/29 automated tests passing across 8 test suites; Next.js 15 production build compiled and verified.


## [0.3.0] - 2026-11-20
### Added
- Expanded `@tradingwave/dsl` with quantitative indicators: MACD (MACD, Signal, Hist), Bollinger Bands (Upper, Lower, Bandwidth, %B), VWAP, Stochastic Oscillator (%K, %D), Central Pivot Range (CPR: Pivot, TC, BC), and Scipy-equivalent ZScore statistical indicator.
- Added direct Indian broker adapters in `@tradingwave/broker-adapters`: `ZerodhaKiteAdapter` (SHA-256 checksum generation, Kite Connect v3 orders, 24h token) and `DhanAdapter` (DhanHQ v2 API, 30-day token support).
- Implemented `@tradingwave/database` with multi-tenant repository pattern, schema types, and strict tenant boundary isolation.
- Enhanced `@tradingwave/web` Options Wizard with an interactive dynamic SVG Payoff Visualizer (Max Profit, Max Loss, Breakevens, Greeks breakdown).
- Automated test suite expanded to 29/29 passing tests across 8 test suites.

## [0.2.0] - 2026-11-20
### Added
- Monorepo configured with pnpm workspaces, `docker-compose.yml` (Postgres, TimescaleDB, Redis, Centrifugo), and TypeScript base.
- `@tradingwave/dsl`: Zero-Eval Abstract Syntax Tree (JSON AST) schema, Zod/static validation, keyword engine (SMA, EMA, RSI, ATR, Supertrend), and sandboxed condition evaluator with 5 passing unit tests.
- `@tradingwave/broker-adapters`: `IBrokerAdapter` normalized interface, strict `OrderStateMachine`, and in-memory `SandboxBrokerAdapter` with margin checks, slippage, and emergency square-off with 6 passing unit tests.
- `@tradingwave/market-data`: Black-Scholes pricing & Greeks formula (Delta, Gamma, Theta, Vega, Rho) and symmetric Option Chain generator with 2 passing unit tests.
- `@tradingwave/execution-engine`: Order Management System (OMS), multi-tier `RiskController`, and `BotRunner` strategy evaluator with 3 passing unit tests.
- `@tradingwave/backtesting`: Deterministic event-driven backtesting engine with zero lookahead bias, Indian regulatory fee schedule (STT, GST, turnover, stamp duty), and equity curve tracker with 1 passing unit test.
- `@tradingwave/api`: Fastify modular monolith REST API gateway with CORS and endpoints for health, strategies, deployments, option chain, backtests, sandbox brokers, and kill-switch with 5 passing integration tests.
- `@tradingwave/web`: Next.js 15 + React 19 + Tailwind CSS trading dashboard application with brand identity (`#FF6600` Trading Orange, `#0B0F19` Slate), compiled and static page generation verified.
- Full automated test suite passes 22/22 tests across 6 test suites.

## [0.1.0] - 2026-11-20
### Added
- Established REA reverse engineering framework connection with 255 available MCP tools and verified capability inventory.
- Created `TradingWave_Research_and_Development/` structured dossier with 13 dedicated subsystems.
- Reverse engineered Tradetron's production web application, robots.txt, sitemaps, and runtime JavaScript bundles (`keyword-data.js`, `centrifuge.js`, etc.).
- Extracted and catalogued all 214 production strategy keywords with full HTML documentation, parameters, data requirements, and calculation semantics.
- Designed TradingWave brand identity and UI/UX design system incorporating the uploaded brand logo (`tradingwave_logo.jpg`), vibrant trading orange (`#FF6600`), deep dark slate (`#0F172A`), and clean high-contrast data visualization.
- Formulated the complete TradingWave Technical Architecture: Fastify + TypeScript backend, Next.js / Tailwind / shadcn/ui frontend, PostgreSQL + TimescaleDB, Redis + BullMQ distributed task queue, and Centrifugo real-time WebSocket bus.
- Authored the Safe Strategy DSL Specification (JSON AST) with strict static typing, sandboxed evaluation, and zero-eval execution guarantees.
- Designed the full Entity-Relationship Diagram (ERD), PostgreSQL schema dictionary, constraints, and migration scripts.
- Developed the complete OpenAPI 3.1 specification (`openapi.yaml`) covering strategy management, deployment, broker accounts, webhooks, and risk controls.
- Defined the Provider-Independent Broker Adapter Matrix and sandbox execution environment.
- Formulated SEBI algorithmic trading compliance review checklist and enterprise cybersecurity threat model.
- Generated the comprehensive `TradingWave_Master_Dossier.md` and packaged the complete research and architecture repository into `TradingWave_Research_and_Development.zip`.

