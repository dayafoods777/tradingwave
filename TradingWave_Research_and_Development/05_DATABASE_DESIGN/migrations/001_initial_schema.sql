-- Migration: 001_initial_schema.sql
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
