import os
import json
from build_dossier_helper import write_doc

# Load raw keywords
with open("TradingWave_Research_and_Development/03_REA_EVIDENCE/tradetron_raw_keywords.json", "r") as f:
    kw_data = json.load(f)

# ==========================================
# SECTION 05 — DATABASE DESIGN
# ==========================================

write_doc("05_DATABASE_DESIGN/entity_relationship_diagram.md", """# Database Entity-Relationship Diagram (ERD)
**Classification:** `PROPOSED`

---

## 1. Relational Entity Diagram

```mermaid
erDiagram
    TENANTS ||--o{ USERS : contains
    USERS ||--o{ BROKER_ACCOUNTS : owns
    USERS ||--o{ STRATEGIES : authors
    STRATEGIES ||--|{ STRATEGY_SETS : includes
    STRATEGY_SETS ||--|{ STRATEGY_LEGS : defines
    STRATEGY_SETS ||--|{ STRATEGY_CONDITIONS : contains
    STRATEGIES ||--o{ DEPLOYED_BOTS : deployed_as
    BROKER_ACCOUNTS ||--o{ DEPLOYED_BOTS : executes_on
    DEPLOYED_BOTS ||--o{ ORDERS : generates
    ORDERS ||--o{ TRADES : fulfills
    DEPLOYED_BOTS ||--o{ POSITIONS : holds
    DEPLOYED_BOTS ||--o{ BOT_LOGS : records
    USERS ||--o{ MARKETPLACE_SUBSCRIPTIONS : subscribes

    TENANTS {
        uuid id PK
        string name
        string plan_tier
        timestamp created_at
    }
    USERS {
        uuid id PK
        uuid tenant_id FK
        string email
        string password_hash
        string role
        string phone_number
    }
    STRATEGIES {
        uuid id PK
        uuid user_id FK
        string name
        string underlying
        jsonb dsl_ast
        int version
        boolean is_public
    }
    BROKER_ACCOUNTS {
        uuid id PK
        uuid user_id FK
        string broker_id
        text encrypted_credentials
        string status
        timestamp token_expires_at
    }
    DEPLOYED_BOTS {
        uuid id PK
        uuid strategy_id FK
        uuid broker_account_id FK
        string execution_mode
        string status
        decimal total_pnl
    }
    ORDERS {
        uuid id PK
        uuid deployed_bot_id FK
        string broker_order_id
        string symbol
        string action
        int quantity
        string order_type
        decimal price
        string status
    }
```
""")

write_doc("05_DATABASE_DESIGN/database_schema.md", """# PostgreSQL Database Schema Specification
**Classification:** `PROPOSED`

---

## 1. Schema Overview

The database is built on PostgreSQL 16 with TimescaleDB for market time-series. It enforces strict foreign keys, multi-tenant row-level security (RLS), and JSONB indexing for the Strategy DSL AST.
""")

write_doc("05_DATABASE_DESIGN/table_dictionary.md", """# Table Dictionary & Field Specifications
**Classification:** `PROPOSED`

---

### Core Domain Tables:
1. `tenants`: Multi-tenant organization isolation and SaaS billing tier boundaries.
2. `users`: Trader authentication, RBAC roles (Admin, Trader, Creator), 2FA state.
3. `strategies`: Versioned strategy definitions, root underlying symbol, and compiled JSONB AST.
4. `strategy_sets`: Independent sub-strategies containing Entry, Repair, and Exit rules.
5. `strategy_legs`: Multi-leg instrument templates with strike selection offsets and multipliers.
6. `broker_accounts`: Securely encrypted broker API credentials, access tokens, and connection state.
7. `deployed_bots`: Active execution instances in Paper or Live Auto modes.
8. `orders`: Full order lifecycle tracking with broker IDs, status codes, and error reasons.
9. `positions`: Real-time aggregated open positions and MTM PnL for deployed bots.
10. `trades`: Individual execution fill records with exact exchange timestamps and transaction fees.
11. `audit_logs`: Immutable security trail recording all user actions, logins, and order triggers.
""")

write_doc("05_DATABASE_DESIGN/indexes_and_constraints.md", """# Indexes, Constraints & Performance Tuning
**Classification:** `PROPOSED`

---

- `idx_strategies_user_id`: B-Tree index on `strategies(user_id)`.
- `idx_strategies_dsl_ast`: GIN index on `strategies USING gin (dsl_ast)` for querying keyword usage.
- `idx_deployed_bots_status`: Partial index on `deployed_bots(status) WHERE status = 'ACTIVE'`.
- `idx_orders_bot_status`: Composite index on `orders(deployed_bot_id, status)`.
- `idx_positions_bot`: Unique composite constraint on `positions(deployed_bot_id, symbol)`.
""")

write_doc("05_DATABASE_DESIGN/migrations/001_initial_schema.sql", """-- Migration: 001_initial_schema.sql
-- Description: Core schema for TradingWave Algorithmic Trading Platform
-- Target: PostgreSQL 16+

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Tenants
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    plan_tier VARCHAR(50) NOT NULL DEFAULT 'FREE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone_number VARCHAR(20),
    role VARCHAR(50) NOT NULL DEFAULT 'TRADER',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Strategies
CREATE TABLE strategies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    underlying VARCHAR(50) NOT NULL,
    version INT NOT NULL DEFAULT 1,
    dsl_ast JSONB NOT NULL,
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Broker Accounts
CREATE TABLE broker_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    broker_id VARCHAR(50) NOT NULL,
    account_label VARCHAR(100) NOT NULL,
    encrypted_credentials TEXT NOT NULL,
    token_expires_at TIMESTAMPTZ,
    status VARCHAR(50) NOT NULL DEFAULT 'DISCONNECTED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Deployed Bots
CREATE TABLE deployed_bots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    strategy_id UUID NOT NULL REFERENCES strategies(id) ON DELETE RESTRICT,
    broker_account_id UUID REFERENCES broker_accounts(id) ON DELETE SET NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    execution_mode VARCHAR(50) NOT NULL DEFAULT 'PAPER', -- PAPER, LIVE_AUTO, LIVE_MANUAL
    lot_multiplier INT NOT NULL DEFAULT 1,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, PAUSED, SQUARED_OFF, ERROR
    total_pnl NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Orders
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    deployed_bot_id UUID NOT NULL REFERENCES deployed_bots(id) ON DELETE CASCADE,
    broker_order_id VARCHAR(100),
    symbol VARCHAR(100) NOT NULL,
    exchange VARCHAR(20) NOT NULL,
    action VARCHAR(10) NOT NULL, -- BUY, SELL
    order_type VARCHAR(20) NOT NULL, -- MARKET, LIMIT, SL, SL_M
    quantity INT NOT NULL,
    price NUMERIC(12, 2),
    trigger_price NUMERIC(12, 2),
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Positions
CREATE TABLE positions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    deployed_bot_id UUID NOT NULL REFERENCES deployed_bots(id) ON DELETE CASCADE,
    symbol VARCHAR(100) NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    average_entry_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    current_ltp NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    unrealized_pnl NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    realized_pnl NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_bot_symbol UNIQUE (deployed_bot_id, symbol)
);
""")

write_doc("05_DATABASE_DESIGN/seed_strategy_examples.md", """# Seed Strategy Examples (AST Representation)
**Classification:** `PROPOSED`

---

## 1. Classic NIFTY 9:20 Intraday Short Straddle

```json
{
  "strategy_name": "NIFTY Intraday 9:20 Short Straddle",
  "underlying": "NIFTY 50",
  "execution_settings": {
    "check_frequency": "1_MINUTE",
    "market": "NSE_FO"
  },
  "sets": [
    {
      "set_id": 1,
      "entry_condition": {
        "operator": "AND",
        "rules": [
          { "type": "KEYWORD", "name": "Time", "operator": ">=", "value": "09:20" },
          { "type": "KEYWORD", "name": "Time", "operator": "<", "value": "14:30" }
        ]
      },
      "legs": [
        {
          "leg_id": 1,
          "action": "SELL",
          "instrument_type": "CALL_OPTION",
          "expiry": "CURRENT_WEEK",
          "strike": "ATM",
          "lots": 1,
          "stop_loss_pct": 25.0
        },
        {
          "leg_id": 2,
          "action": "SELL",
          "instrument_type": "PUT_OPTION",
          "expiry": "CURRENT_WEEK",
          "strike": "ATM",
          "lots": 1,
          "stop_loss_pct": 25.0
        }
      ],
      "exit_condition": {
        "operator": "OR",
        "rules": [
          { "type": "KEYWORD", "name": "Time", "operator": ">=", "value": "15:15" },
          { "type": "KEYWORD", "name": "PNL", "operator": "<=", "value": -2500 }
        ]
      }
    }
  ]
}
```
""")

# ==========================================
# SECTION 06 — STRATEGY ENGINE
# ==========================================

write_doc("06_STRATEGY_ENGINE/strategy_dsl_specification.md", """# Strategy DSL Specification (JSON AST Schema)
**Classification:** `PROPOSED`

---

## 1. Abstract Syntax Tree (AST) Type Schema

```typescript
export type NodeType = 'LOGICAL_GROUP' | 'COMPARISON' | 'KEYWORD_CALL' | 'LITERAL' | 'POSITION_REF';

export interface LogicalGroupNode {
  type: 'LOGICAL_GROUP';
  operator: 'AND' | 'OR';
  children: ASTNode[];
}

export interface ComparisonNode {
  type: 'COMPARISON';
  operator: '>' | '<' | '>=' | '<=' | '==' | '!=' | 'CROSSES_ABOVE' | 'CROSSES_BELOW';
  left: ASTNode;
  right: ASTNode;
}

export interface KeywordCallNode {
  type: 'KEYWORD_CALL';
  keyword: string;
  arguments: Record<string, ASTNode | string | number>;
  timeframe?: '1_MIN' | '3_MIN' | '5_MIN' | '15_MIN' | 'DAY';
  instrument?: string;
  offset?: number; // e.g. -1 for previous candle
}

export interface LiteralNode {
  type: 'LITERAL';
  dataType: 'NUMBER' | 'STRING' | 'TIME' | 'BOOLEAN';
  value: number | string | boolean;
}

export type ASTNode = LogicalGroupNode | ComparisonNode | KeywordCallNode | LiteralNode;
```
""")

# Build keyword_catalogue.md dynamically from the 214 keywords!
kw_cat_lines = [
    "# TradingWave Keyword Catalogue (214 Verified Keywords + Extensions)",
    "**Classification:** `VERIFIED` (Reference Inventory) & `PROPOSED` (TradingWave Engine)",
    "",
    "This catalogue covers all **214 production keywords** reverse-engineered directly from Tradetron's production runtime bundle `keyword-data.js`.",
    "",
    "| Keyword Name | Category | Return Type | Description Summary | Calculation Semantics |",
    "|---|---|---|---|---|"
]

for name, item in sorted(kw_data.items()):
    clean_html = item.get("body_html", "").replace("<p>", " ").replace("</p>", " ").replace("<br>", " ")
    # remove tags
    import re
    clean_desc = re.sub(r'<[^>]+>', '', clean_html).strip()
    clean_desc = " ".join(clean_desc.split())[:120].replace("|", "/")
    
    # Inferred category
    n_lower = name.lower()
    if any(x in n_lower for x in ["atm", "strike", "expiry", "delta", "gamma", "theta", "vega", "iv"]):
        cat = "Options & Greeks"
        ret = "Numeric / Strike"
        calc = "Black-Scholes / Option Chain Lookup"
    elif any(x in n_lower for x in ["time", "date", "day", "week", "year", "hour", "minute"]):
        cat = "Time & Calendar"
        ret = "Time / Integer"
        calc = "System Clock / Exchange Trading Calendar"
    elif any(x in n_lower for x in ["pnl", "position", "traded", "entry", "exit", "quantity"]):
        cat = "Position & PnL"
        ret = "Numeric / Decimal"
        calc = "Order Book / Position Aggregator"
    elif any(x in n_lower for x in ["array", "absolute", "round", "math", "sqrt", "power"]):
        cat = "Math Operations"
        ret = "Numeric / Array"
        calc = "Vectorized Math"
    elif any(x in n_lower for x in ["open", "high", "low", "close", "ltp", "bid", "ask", "volume", "oi"]):
        cat = "Price & Quote"
        ret = "Decimal (Price)"
        calc = "Tick Stream / Resampled Candle"
    else:
        cat = "Technical Indicators"
        ret = "Numeric / Oscillator"
        calc = "Timescale Resampled TA Engine"

    kw_cat_lines.append(f"| **{name}** | {cat} | {ret} | {clean_desc} | {calc} |")

# Add TradingWave Extensions
kw_cat_lines.extend([
    "",
    "## TradingWave Proposed Extensions (Beyond Tradetron)",
    "",
    "| Keyword Name | Category | Return Type | Description | Rationale |",
    "|---|---|---|---|---|",
    "| **Tw_Vwap_Bands** | Technical Indicators | Array (Upper/Lower) | Standard deviation bands anchored to VWAP | High-frequency mean reversion |",
    "| **Tw_Expected_Move** | Options & Greeks | Numeric (Points) | Straddle-implied market expected move | Dynamic iron condor wing placement |",
    "| **Tw_Order_Flow_Imbalance** | Market Microstructure | Decimal (-1 to +1) | Real-time bid/ask depth volume delta | Institutional liquidity detection |",
    "| **Tw_Max_Pain** | Options & Greeks | Numeric (Strike) | Expiry strike with minimal option writer payout | Expiry day positioning |"
])

write_doc("06_STRATEGY_ENGINE/keyword_catalogue.md", "\n".join(kw_cat_lines))

write_doc("06_STRATEGY_ENGINE/condition_evaluator.md", """# Condition Evaluator Architecture
**Classification:** `PROPOSED`

---

## 1. Sandboxed AST Evaluator

The Condition Evaluator recursively evaluates AST condition trees in pure TypeScript without dynamic code execution:

```typescript
export class ConditionEvaluator {
  public evaluate(node: ASTNode, context: ExecutionContext): boolean | number | string {
    switch (node.type) {
      case 'LITERAL':
        return node.value;
      case 'KEYWORD_CALL':
        return this.evaluateKeyword(node.keyword, node.arguments, context);
      case 'COMPARISON':
        return this.evaluateComparison(node.operator, node.left, node.right, context);
      case 'LOGICAL_GROUP':
        return this.evaluateLogicalGroup(node.operator, node.children, context);
      default:
        throw new Error(`Unsupported AST Node Type`);
    }
  }
}
```
""")

write_doc("06_STRATEGY_ENGINE/options_leg_model.md", """# Options Leg Model & Strike Selection Engine
**Classification:** `PROPOSED`

---

## 1. Strike Offset Resolution Logic

```mermaid
flowchart TD
    UnderlyingPrice["Underlying Price (LTP)"] --> RoundATM["Round to Nearest Strike (ATM)"]
    RoundATM --> ModeCheck{"Strike Selection Mode"}
    
    ModeCheck -- "ATM" --> SelectedStrike["Target Strike = ATM"]
    ModeCheck -- "Step Offset" --> StepCalc["Target Strike = ATM +/- (N * Strike Step)"]
    ModeCheck -- "Delta" --> DeltaScan["Scan Option Chain for Closest Delta"]
    ModeCheck -- "Premium" --> PremiumScan["Scan Option Chain for Closest Target Premium"]
    
    StepCalc --> SelectedStrike
    DeltaScan --> SelectedStrike
    PremiumScan --> SelectedStrike
    SelectedStrike --> ContractLookup["Map to Exchange Instrument Token"]
```
""")

write_doc("06_STRATEGY_ENGINE/order_state_machine.md", """# Order State Machine & Lifecycle
**Classification:** `PROPOSED`

---

## 1. Deterministic State Transitions

```mermaid
stateDiagram-v2
    [*] --> CREATED
    CREATED --> VALIDATED: Schema & Risk Passed
    CREATED --> CANCELLED: Pre-Validation Failed
    VALIDATED --> SUBMITTED: Sent to Broker
    SUBMITTED --> ACKNOWLEDGED: Broker Received
    SUBMITTED --> REJECTED: Broker Rejection
    ACKNOWLEDGED --> PARTIALLY_FILLED: Partial Execution
    PARTIALLY_FILLED --> FILLED: Remainder Executed
    ACKNOWLEDGED --> FILLED: Full Execution
    ACKNOWLEDGED --> CANCELLED: User/Timeout Cancel
    FILLED --> [*]
    REJECTED --> [*]
    CANCELLED --> [*]
```
""")

write_doc("06_STRATEGY_ENGINE/risk_engine.md", """# Risk Engine & Guardrails Specification
**Classification:** `PROPOSED`

---

## 1. Multi-Tiered Risk Gates

1. **Account-Level Max Loss (Daily MTM Kill-Switch):** Immediate square-off of all active bots if daily net loss crosses threshold.
2. **Per-Strategy Capital Limit:** Restricts total margin utilization of any single strategy.
3. **Price Collar Checks:** Prevents executing orders if live market price has drifted >2% from trigger price (avoids runaway slippage on illiquid strikes).
4. **Order Rate Limiter (Throttler):** Maximum 10 orders per second per broker account to avoid exchange bans.
""")

write_doc("06_STRATEGY_ENGINE/execution_lifecycle.md", """# Execution Lifecycle & Worker Loop
**Classification:** `PROPOSED`

---

1. **Market Clock Synchronization:** Strict sync against NTP atomic time servers.
2. **Schedule Fencing:** Intraday strategies activate at 09:15:05 AM and auto-terminate at 15:25:00 PM IST.
3. **Tick Ingestion & Worker Dispatch:** BullMQ queue job dispatched every 1 second or upon bar close event.
""")

# ==========================================
# SECTION 07 — API & INTEGRATIONS
# ==========================================

write_doc("07_API_AND_INTEGRATIONS/openapi.yaml", """openapi: 3.1.0
info:
  title: TradingWave Algorithmic Trading API
  version: 1.0.0
  description: Comprehensive REST API for TradingWave algo trading platform.
paths:
  /api/v1/auth/login:
    post:
      summary: Authenticate user
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                email: { type: string }
                password: { type: string }
      responses:
        '200':
          description: Login successful
  /api/v1/strategies:
    get:
      summary: List user strategies
      responses:
        '200': { description: Success }
    post:
      summary: Create new strategy
      responses:
        '201': { description: Strategy created }
  /api/v1/deployments:
    post:
      summary: Deploy strategy (Paper or Live Auto)
      responses:
        '201': { description: Strategy deployed }
  /api/v1/webhooks/tradingview:
    post:
      summary: Ingest TradingView PineBridge webhook alert
      responses:
        '200': { description: Signal processed }
""")

write_doc("07_API_AND_INTEGRATIONS/api_inventory.md", """# API Inventory & Route Catalog
**Classification:** `PROPOSED`

---

- `/api/v1/auth/*`: Registration, login, MFA, API keys, password reset.
- `/api/v1/strategies/*`: CRUD operations, version history, validation, and JSON AST export.
- `/api/v1/deployments/*`: Deploy, pause, restart, and emergency square-off deployed bots.
- `/api/v1/brokers/*`: Broker account connection, token refresh, and funds inquiry.
- `/api/v1/backtest/*`: Submit historical backtests, query progress, and download equity curves.
- `/api/v1/webhooks/*`: Ingest external alerts from TradingView, Chartink, and Python scripts.
""")

write_doc("07_API_AND_INTEGRATIONS/broker_matrix.md", """# Broker Matrix & Capability Profile
**Classification:** `PROPOSED` & `VERIFIED`

---

| Broker | REST API | WebSocket Feeds | Order Modifications | Bracket Orders | Auto-Login Support |
|---|---|---|---|---|---|
| **Zerodha Kite** | ✅ Yes | ✅ Yes | ✅ Yes | ❌ Blocked by Broker | ⚠️ Manual TOTP flow |
| **DhanHQ** | ✅ Yes | ✅ Yes | ✅ Yes | ⚠️ Limited | ✅ Long-lived Token |
| **Angel One** | ✅ Yes | ✅ Yes | ✅ Yes | ⚠️ Normal/GTT | ✅ TOTP Auto-login |
| **Groww** | ✅ Yes | ⚠️ REST only | ✅ Yes | ❌ No | ⚠️ Daily login |
| **Fyers** | ✅ Yes | ✅ Yes | ✅ Yes | ⚠️ Cover orders | ⚠️ Daily login |
| **Upstox** | ✅ Yes | ✅ Yes | ✅ Yes | ⚠️ GTT | ⚠️ Daily login |
| **Delta Exchange** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Permanent API Keys |
""")

write_doc("07_API_AND_INTEGRATIONS/market_data_providers.md", """# Market Data Providers & Sourcing
**Classification:** `PROPOSED`

---

1. **Primary Tick Feed:** Direct Broker WebSockets (Zerodha, Dhan) for active trader symbols.
2. **Commercial Real-Time Feed:** TrueData or Global DataFeeds (GDFL) for whole-market NSE/BSE/MCX depth and options chains.
3. **Historical Data:** Stored in TimescaleDB hypertable partition from 2018 to present.
""")

write_doc("07_API_AND_INTEGRATIONS/tradingview_webhooks.md", """# TradingView Webhooks (PineBridge Equivalent)
**Classification:** `PROPOSED`

---

## 1. Webhook Payload Schema

```json
{
  "secret_token": "tw_live_9f82d1c8...",
  "strategy_id": "b1a2c3d4-...",
  "symbol": "NSE:NIFTY",
  "action": "BUY",
  "order_type": "MARKET",
  "quantity": 50,
  "comment": "Supertrend bullish crossover"
}
```
""")

write_doc("07_API_AND_INTEGRATIONS/notifications.md", """# Notifications & Alerting Dispatcher
**Classification:** `PROPOSED`

---

- **Channels:** WhatsApp Business API (Twilio / Gupshup), Telegram Bot, Push Notifications (Firebase), SMS, and Automated Voice Call.
- **Critical Alerts:** Disconnect warnings, Margin calls, Execution failures, Strategy Target/Stop-loss triggers.
""")

write_doc("07_API_AND_INTEGRATIONS/integration_security.md", """# Integration Security & Signature Verification
**Classification:** `PROPOSED`

---

1. **Webhook Authentication:** HMAC SHA-256 signature header (`X-TradingWave-Signature`).
2. **Replay Protection:** Timestamp nonce verification within a 5-second sliding window.
3. **Rate Limiting:** Dedicated Redis Token Bucket per webhook endpoint (100 req/min).
""")

print("Completed writing 05_DATABASE_DESIGN, 06_STRATEGY_ENGINE, and 07_API_AND_INTEGRATIONS files.")

