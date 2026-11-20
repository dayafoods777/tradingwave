import os
from build_dossier_helper import write_doc

# ==========================================
# SECTION 02 — UI/UX RESEARCH
# ==========================================

write_doc("02_UI_UX_RESEARCH/design_system.md", """# TradingWave Design System & Visual Identity
**Classification:** `PROPOSED` (TradingWave Identity) & `VERIFIED` (Logo Reference)

---

## 1. Brand Tokens & Color Palette

Based on the official TradingWave logo (`tradingwave_logo.jpg`) with the brand motto **"TRADE BINDAS"**:

```mermaid
flowchart LR
    subgraph PrimaryColors["Primary Brand Colors"]
        C1["Trading Orange<br/>#FF6600<br/>RGB(255, 102, 0)"]
        C2["Deep Navy / Slate<br/>#0F172A<br/>RGB(15, 23, 42)"]
        C3["Dark Slate Surface<br/>#1E293B<br/>RGB(30, 41, 59)"]
    end
    subgraph AccentColors["Financial Accents"]
        G1["Profit Green<br/>#10B981<br/>Buy / Profit"]
        R1["Loss Red<br/>#EF4444<br/>Sell / Loss"]
        A1["Warning Amber<br/>#F59E0B<br/>Attention"]
    end
```

### Color Variables (Tailwind CSS / CSS Variables):
- `--primary`: `#FF6600` (TradingWave Vibrant Orange)
- `--primary-hover`: `#E65C00`
- `--background`: `#0B0F19` (Dark institutional backdrop)
- `--card`: `#131B2E` (High-contrast container)
- `--card-border`: `#1E293B`
- `--foreground`: `#F8FAFC`
- `--muted-foreground`: `#94A3B8`
- `--profit`: `#10B981` (Emergent green)
- `--loss`: `#EF4444` (Vibrant alert red)

---

## 2. Typography

- **Display & Headings:** `Plus Jakarta Sans` or `Inter` (Weights: 600 Semi-Bold, 700 Bold)
- **Data & Tables / Tickers:** `JetBrains Mono` or `Roboto Mono` (Tabular numbers for currency alignment)
- **Body & Prose:** `Inter` (Weights: 400 Regular, 500 Medium)
""")

write_doc("02_UI_UX_RESEARCH/page_layouts.md", """# Page Layouts & Wireframes
**Classification:** `PROPOSED`

---

## 1. Application Shell Layout

```
+-----------------------------------------------------------------------------------+
|  [W] TradingWave  |  Strategies  Deployments  Marketplace  Reports  | [₹ 12,450.00] (User) |
+-----------------------------------------------------------------------------------+
| Side Nav  |  Active Strategy: NIFTY Theta Scalper v2.1             [Deploy] [Save] |
|-----------+-----------------------------------------------------------------------|
| Dashboard | +-------------------------------------------------------------------+ |
| Strategies| | SET 1: Intraday 9:20 Straddle (Active)              [+ Add Set]   | |
| Deployed  | |-------------------------------------------------------------------| |
| Positions | | Entry Condition:                                                  | |
| Brokers   | | [Time >= 09:20] AND [Supertrend(10,3) == 1]                      | |
| Backtest  | |-------------------------------------------------------------------| |
| Settings  | | Position Legs:                                                    | |
|           | | 1. SELL NIFTY CE [Current Week] [ATM] [1 Lot] [SL: 25%]           | |
|           | | 2. SELL NIFTY PE [Current Week] [ATM] [1 Lot] [SL: 25%]           | |
|           | |-------------------------------------------------------------------| |
|           | | Set Exit Condition:                                               | |
|           | | [Time >= 15:15] OR [Set PnL <= -3000]                             | |
|           | +-------------------------------------------------------------------+ |
+-----------------------------------------------------------------------------------+
```
""")

write_doc("02_UI_UX_RESEARCH/component_inventory.md", """# Component Inventory
**Classification:** `PROPOSED`

---

## 1. Core UI Components (shadcn/ui + Radix UI)

1. **ConditionBuilderCard:** Grouped container supporting recursive Boolean branches (AND / OR) with keyword pickers.
2. **OptionsLegGrid:** Structured data table with dropdowns for Segment, Instrument, Strike Offset, Action (Buy/Sell), Product Type (MIS/NRML), and Quantity Multiplier.
3. **PayoffGraphWidget:** Interactive SVG/Canvas visualizer calculating strategy expiration P&L curves across underlying price points.
4. **BrokerConnectionCard:** Secure modal and status badge displaying broker connection health, token expiry countdown, and re-login triggers.
5. **RealtimePnLBadge:** Ticker-style numeric display flashing green/red on price update events via WebSockets.
""")

write_doc("02_UI_UX_RESEARCH/interaction_specifications.md", """# Interaction Specifications & Behavioral States
**Classification:** `PROPOSED`

---

## 1. Key User Interactions

- **Keyword Search & Autocomplete:** Typing in condition fields triggers an intelligent popover searching all 214 keywords categorized by type.
- **Drag-and-Drop Reordering:** Sets and legs can be re-ordered dynamically with automatic recalculation of leg indexes.
- **Instant AST Validation:** Visual cues (red underline, tooltip warning) appear in real-time when an expression is incomplete or types mismatch.
""")

write_doc("02_UI_UX_RESEARCH/responsive_behavior.md", """# Responsive Behavior & Mobile Breakpoints
**Classification:** `PROPOSED`

---

## 1. Breakpoint Strategy

- **Desktop (>= 1280px):** Full dual-column workspace with sidebar navigation, strategy canvas, and persistent execution status panel.
- **Tablet (768px - 1279px):** Collapsible sidebar, horizontal scrolling for complex condition trees.
- **Mobile (< 768px):** Bottom navigation bar, tabbed single-column view (Summary / Conditions / Legs / Logs) optimized for quick monitoring and manual emergency square-off.
""")

# ==========================================
# SECTION 03 — REA EVIDENCE
# ==========================================

write_doc("03_REA_EVIDENCE/rea_setup.md", """# REA Setup & Verification Report
**Classification:** `VERIFIED`

---

## 1. REA Server Diagnostics

- **REA Package Version:** `rea-agents@6.9.0`
- **MCP Protocol Negotiation:** `2026-07-28`
- **Total Tools Catalogued:** 255 tools
- **Registered CLI Commands:** 196 commands
- **Host Environment:** macOS Darwin (Apple Silicon / arm64)
- **Active Engine Binding:** macOS native utilities + Hopper Disassembler available
""")

write_doc("03_REA_EVIDENCE/rea_capability_inventory.md", """# REA Capability Inventory
**Classification:** `VERIFIED`

---

## 1. Active vs Unavailable Capability Groups

| Capability Group | Status | Available Tools / Modules | Host / Provider Notes |
|---|---|---|---|
| **Web & JavaScript Analysis** | `AVAILABLE` | `inspect_web_page`, `analyze_web_bundle`, `capture_browser_scenario`, `export_web_scripts` | Native CDP & bundle parser active |
| **Artifact & Archive Graph** | `AVAILABLE` | `inspect_artifact`, `extract_artifact`, `trace_dylib_resolution` | macOS safe artifact provider active |
| **Managed .NET Static** | `AVAILABLE` | `inspect_managed_artifact`, `inspect_managed_members` | CLI/PE metadata decoders active |
| **Native Disassembly** | `AVAILABLE` | Hopper Disassembler bound; macOS native inspection utilities | Hopper available on macOS |
| **Ghidra Engine** | `UNAVAILABLE` | Requires `GHIDRA_INSTALL_DIR` configuration | Target is web SaaS; Ghidra not required |
| **Android APK (JADX)** | `UNAVAILABLE` | Requires `REA_JADX_MCP_JAR` | Target is web SaaS; Android reverse engineering not required |
""")

write_doc("03_REA_EVIDENCE/browser_observations.md", """# Browser Observations & DOM Analysis
**Classification:** `VERIFIED`

---

## 1. Observed DOM & Client State Evidence

1. **CSRF & Security Tokens:** Laravel standard `XSRF-TOKEN` cookie and `<meta name="csrf-token">` present on all HTML pages.
2. **Session Cookies:** `tradetron_session` cookie with encrypted Laravel payload structure (`iv`, `value`, `mac`).
3. **Real-time WebSockets:** Centrifugo client script loaded (`/js/centrifuge.js?v=1795022413`).
4. **Theme Handling:** Client localStorage key `tradetron.theme` with dark mode class toggle on root `<html>`.
5. **Acquisition & Attribution:** Custom script tracking ad clicks, AI referrals (ChatGPT, Claude, Perplexity), and UTM tags.
""")

write_doc("03_REA_EVIDENCE/javascript_analysis.md", """# JavaScript Bundle & Client-Side Architecture Analysis
**Classification:** `VERIFIED`

---

## 1. Production Bundle Inventory

| Script URL | Size | Purpose & Technical Evidence |
|---|---|---|
| `/js/atp-ai/keyword-data.js?v=59b9c32d7fe6` | 171 KB | Full dictionary of 214 keywords, HTML descriptions, and examples |
| `/js/atp-ai/keyword-documentation.js` | 42 KB | Client-side keyword search, filtering, and modal rendering logic |
| `/js/centrifuge.js?v=1795022413` | 28 KB | Centrifugo WebSocket client for live order status and PnL push updates |
| `/js/atp-ai/home.js` | 85 KB | Landing page animations, quote calculators, interactive widgets |
| `/js/atp-ai/theme.js` | 6 KB | Day/Night dark mode toggle handler |
""")

write_doc("03_REA_EVIDENCE/network_inventory.md", """# Network Request Inventory & API Surface
**Classification:** `VERIFIED` & `INFERRED`

---

## 1. Observed Public Network Endpoints

- `GET /keyword-documentation` -> Serves keyword documentation UI and loads `keyword-data.js`
- `GET /sitemaps/sitemap-*.xml` -> Public index of pages, products, strategies, and brokers
- `POST /api/...` -> Protected JSON API endpoints (gated behind session/token authentication)
- `WSS wss://push.tradetron.tech/connection/websocket` -> Inferred Centrifugo real-time streaming endpoint
""")

write_doc("03_REA_EVIDENCE/evidence_register.md", """# Technical Evidence Register
**Classification:** `VERIFIED`

---

| ID | Finding | Concrete Evidence Source | Classification | Confidence | Notes |
|---|---|---|---|---|---|
| EV-01 | Tradetron Backend Architecture | Cookies (`tradetron_session`, `XSRF-TOKEN`), comments (`StripIndexPhp`, `ListingStatus::filtered`) | `VERIFIED` | 100% | PHP / Laravel Monolith |
| EV-02 | Keyword Grammar Scope | `window.KW_DATA` in `keyword-data.js` | `VERIFIED` | 100% | Exactly 214 keywords catalogued |
| EV-03 | Math & Indicator Backend | Documentation note under `Zscore`: "part of SCIPY library" | `VERIFIED` | 100% | Python Scipy microservices for numerical calculations |
| EV-04 | Real-time Streaming Engine | Client script `centrifuge.js` loaded on application pages | `VERIFIED` | 100% | Centrifugo WebSocket broker |
| EV-05 | Supported Broker Ecosystem | 38 broker pages in `sitemap-brokers.xml` and `/brokers` page | `VERIFIED` | 100% | All major Indian + Crypto brokers supported |
| EV-06 | Commercial Pricing Matrix | Scraped and parsed from `/pages/pricing` | `VERIFIED` | 100% | 7 distinct tiers from Free to Creator+ |
""")

write_doc("03_REA_EVIDENCE/limitations.md", """# Reverse-Engineering Limitations & Non-Invasive Boundaries
**Classification:** `VERIFIED`

---

1. **No Proprietary Code Decompilation:** In accordance with non-negotiable instructions, private server-side source code was not accessed or reverse engineered through invasive methods.
2. **Authorized Public Probing Only:** All evidence was gathered from publicly exposed endpoints, sitemaps, robots.txt, and client-side bundles delivered to the browser.
3. **No Account Bypass:** Gated creator dashboards and proprietary strategy logic were investigated through official documentation, tutorials, and public feature overviews without compromising credentials.
""")

# ==========================================
# SECTION 04 — TECHNICAL ARCHITECTURE
# ==========================================

write_doc("04_TECHNICAL_ARCHITECTURE/architecture_overview.md", """# TradingWave Technical Architecture Overview
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
""")

write_doc("04_TECHNICAL_ARCHITECTURE/frontend_architecture.md", """# Frontend Architecture Specification
**Classification:** `PROPOSED`

---

## 1. Technology Choices & Rationale

- **Framework:** Next.js 15 (App Router) + React 19 + TypeScript.
  - *Rationale:* Next.js provides unmatched hybrid rendering (SSR for marketplace SEO, SPA client-side rendering for real-time strategy builder and dashboards).
- **Styling:** Tailwind CSS + shadcn/ui.
  - *Rationale:* Zero runtime overhead, rapid atomic styling, accessible Radix UI primitives.
- **Visual Strategy Canvas:** React Flow (`@xyflow/react`).
  - *Rationale:* High-performance node-based visual workflow editor for building complex condition trees and multi-leg strategies visually.
- **Financial Charting:** TradingView Lightweight Charts (`lightweight-charts`).
  - *Rationale:* Ultra-fast Canvas rendering, Apache 2.0 open-source license, lightweight footprint for multi-timeframe candle and payoff rendering.
- **State Management:** TanStack Query v5 (Server state caching) + Zustand (Client UI & Canvas state).
- **Real-Time Client:** Centrifuge-JS WebSocket client with automatic reconnection and channel subscription multiplexing.
""")

write_doc("04_TECHNICAL_ARCHITECTURE/backend_architecture.md", """# Backend Architecture Specification
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
""")

write_doc("04_TECHNICAL_ARCHITECTURE/strategy_execution_engine.md", """# Strategy Execution Engine Specification
**Classification:** `PROPOSED`

---

## 1. Condition Evaluation Loop

The Execution Engine continuously processes deployed strategy bots through an event-driven worker loop:

```mermaid
flowchart TD
    TickArrival["Live Market Tick Arrives (WebSocket)"] --> CheckFreq{"Bot Check Interval Triggered?"}
    CheckFreq -- No --> Ignore["Await Next Tick"]
    CheckFreq -- Yes --> FetchContext["Fetch Bot State & Open Positions from Redis"]
    FetchContext --> EvalEntry{"Are Positions Open?"}
    
    EvalEntry -- No --> EvalEntryCond["Evaluate Set Entry Conditions (AST)"]
    EvalEntryCond -- True --> RiskCheck["Execute Pre-Trade Risk Engine"]
    RiskCheck -- Passed --> PlaceOrders["Dispatch Multi-Leg Orders via Broker Adapter"]
    RiskCheck -- Failed --> AlertRisk["Send Risk Violation Notification"]
    
    EvalEntry -- Yes --> EvalRepair{"Evaluate Repair Conditions (AST)?"}
    EvalRepair -- True --> ExecRepair["Execute Repair Legs & Adjust Positions"]
    EvalRepair -- False --> EvalExit{"Evaluate Exit Conditions (AST)?"}
    EvalExit -- True --> SquareOff["Square Off Active Legs via Broker Adapter"]
    EvalExit -- False --> UpdatePnL["Calculate Mark-to-Market PnL & Publish to WebSocket"]
```
""")

write_doc("04_TECHNICAL_ARCHITECTURE/market_data_architecture.md", """# Market Data Architecture & Resampling
**Classification:** `PROPOSED`

---

## 1. Ingestion & Storage Topology

1. **WebSocket Ingestors:** Connect to commercial market data feeds (TrueData, Global DataFeeds) and broker WebSocket streams.
2. **Candle Resampler:** In-memory high-throughput aggregator constructing 1-min, 3-min, 5-min, 15-min, and daily candles from raw ticks.
3. **TimescaleDB Store:** Compressed hypertable storing historical ticks and OHLCV bars with sub-millisecond query performance for backtesting.
""")

write_doc("04_TECHNICAL_ARCHITECTURE/broker_adapter_architecture.md", """# Broker Adapter Architecture
**Classification:** `PROPOSED`

---

## 1. Unified Interface: `IBrokerAdapter`

All broker integrations implement a strictly typed TypeScript interface, completely isolating strategy logic from broker quirks:

```typescript
export interface IBrokerAdapter {
  getBrokerId(): string;
  authenticate(credentials: BrokerCredentials): Promise<AuthSession>;
  refreshToken(session: AuthSession): Promise<AuthSession>;
  getProfile(): Promise<UserProfile>;
  getFundsAndMargin(): Promise<AccountFunds>;
  placeOrder(order: OrderRequest): Promise<OrderResponse>;
  modifyOrder(orderId: string, modifications: OrderModification): Promise<OrderResponse>;
  cancelOrder(orderId: string): Promise<OrderResponse>;
  getOrderStatus(orderId: string): Promise<OrderState>;
  getPositions(): Promise<Position[]>;
  getTradeBook(): Promise<Trade[]>;
  subscribeMarketData(symbols: string[]): Promise<void>;
  emergencySquareOff(): Promise<SquareOffResult>;
}
```
""")

write_doc("04_TECHNICAL_ARCHITECTURE/backtesting_engine.md", """# Backtesting Engine Architecture
**Classification:** `PROPOSED`

---

## 1. Deterministic Simulation Principles

1. **Zero Lookahead Bias:** Candle timestamps strictly represent the end of the time interval. Calculations on bar `T` only access data `0 <= t <= T`.
2. **Realistic Fill Simulation:** Market orders fill at next bar's Open or Volume-Weighted Average Price (VWAP); Limit orders fill only if price trades through limit price with sufficient volume.
3. **Regulatory Fee Schedule:** Accurately models Indian STT (0.0625% on option sell), Exchange turnover (0.05% on options), GST (18%), and SEBI turnover charges.
""")

write_doc("04_TECHNICAL_ARCHITECTURE/event_driven_architecture.md", """# Event-Driven Architecture & Real-Time Message Bus
**Classification:** `PROPOSED`

---

## 1. Message Topologies

- **High-Velocity Market Data:** Redis Pub/Sub channels (sub-millisecond pub/sub routing).
- **Reliable Order & Execution Events:** BullMQ persistent queues backed by Redis with automatic retry and dead-letter queues.
- **Client Push Notifications:** Centrifugo WebSocket channels partitioned by user ID (`user_{id}:pnl`, `user_{id}:orders`).
""")

write_doc("04_TECHNICAL_ARCHITECTURE/infrastructure.md", """# Infrastructure & Deployment Topology
**Classification:** `PROPOSED`

---

## 1. Production Cloud Topology

- **Compute:** Kubernetes Cluster (EKS / GKE) running containerized Fastify API pods and scalable BullMQ worker pods.
- **Database:** Managed PostgreSQL 16 (AWS RDS Aurora) + TimescaleDB extension.
- **Caching & Queues:** AWS ElastiCache for Redis (Cluster Mode enabled).
- **Object Storage:** AWS S3 for historical backtest report archives and strategy version snapshots.
""")

write_doc("04_TECHNICAL_ARCHITECTURE/architecture_decisions.md", """# Architecture Decision Records (ADR)
**Classification:** `PROPOSED`

---

## ADR 001: Selection of Fastify over NestJS
- **Status:** Accepted
- **Context:** High throughput required for handling thousands of concurrent webhook signals and real-time execution worker tasks.
- **Decision:** Fastify provides 2x throughput compared to Express/NestJS, low memory overhead, native JSON schema validation, and modular encapsulation plugins.

## ADR 002: Zero-Eval Strategy Representation via Typed JSON AST
- **Status:** Accepted
- **Context:** User-submitted strategy conditions must execute safely without risk of Remote Code Execution (RCE) or arbitrary JavaScript execution.
- **Decision:** Strategies are represented and stored as strictly typed JSON Abstract Syntax Trees. No `eval()`, `new Function()`, or un-sandboxed interpreters are permitted.
""")

print("Completed writing 02_UI_UX_RESEARCH, 03_REA_EVIDENCE, and 04_TECHNICAL_ARCHITECTURE files.")

