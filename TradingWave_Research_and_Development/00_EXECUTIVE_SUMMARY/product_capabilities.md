# TradingWave — Product Capabilities Inventory
**Classification:** `PROPOSED` & `VERIFIED`

---

## 1. Capabilities Matrix

TradingWave delivers end-to-end capabilities across 6 operational domains:

```mermaid
mindmap
  root((TradingWave))
    Strategy Construction
      Visual Canvas Builder
      Options Wizard
      Advanced Multi-Leg Wizard
      StockBag Basket Creator
      TradingView PineBridge
      HTTP Signal Bridge
    Simulation & Analysis
      Deterministic Backtesting
      Multi-Asset Option Simulator
      Greeks & Payoff Visualizer
      Monte Carlo Robustness
    Execution Modes
      Paper Trading / Live Offline
      One-Click Manual Approval
      Fully Autonomous Live Auto
      Multi-Account Mirroring
    Risk & Compliance
      Universal Kill Switch
      Account Max Drawdown
      Strategy Capital Allocation
      SEBI Algorithmic Guardrails
    Broker Ecosystem
      Direct WebSocket Feeds
      Provider-Agnostic Adapter
      Automated Token Refresh
      Orphan Order Reconciler
    Social & Marketplace
      Creator Royalty Engine
      Verified Track Records
      Sub-second Signal Distribution
      Granular Permission Grants
```

---

## 2. Detailed Capability Breakdown

### A. Strategy Creation
- **Visual Strategy Canvas:** Drag-and-drop rule assembly with nested AND/OR logic groups.
- **214+ Math & Market Keywords:** Full functional compatibility with Tradetron keyword grammar including technical indicators, option Greeks, positional MTM, time/calendar triggers, and math transforms.
- **Options Leg Model:** Dynamic strike selection (ATM offsets, Delta targeting, IV targeting, Premium range targeting) across weekly and monthly expiries.
- **Repair Conditions:** Leg-level and set-level adjustment rules (e.g., rolling untested spreads, hedging delta divergence).

### B. Execution Engines
- **Paper Trading (Live Offline):** Simulated order fills against live WebSocket tick feeds with configurable latency and slippage models.
- **Live Auto Execution:** Direct broker routing via authenticated REST/WebSocket adapters with sub-second execution latency.
- **Execution Safeguards:** Automated re-quote on partial fills, strike rounding verification, lot size enforcement, and freeze-quantity slicing.
