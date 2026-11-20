# PostgreSQL Database Schema Specification
**Classification:** `PROPOSED`

---

## 1. Schema Overview

The database is built on PostgreSQL 16 with TimescaleDB for market time-series. It enforces strict foreign keys, multi-tenant row-level security (RLS), and JSONB indexing for the Strategy DSL AST.
