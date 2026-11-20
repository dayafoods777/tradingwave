# Tradetron Feature Inventory
**Classification:** `VERIFIED` (Direct Observation & Runtime Analysis)

---

## 1. Comprehensive Feature Matrix

```mermaid
graph TD
    subgraph StrategyCreation["Strategy Creation"]
        SB["Advanced Strategy Builder"]
        OW["Options Wizard"]
        AW["Advanced Multi-Leg Wizard"]
        PB["PineBridge (TradingView)"]
        SBR["Signal Bridge (HTTP/Excel)"]
        SBAG["StockBag (Equity Baskets)"]
    end

    subgraph SimulationModes["Simulation & Testing"]
        BT["Backtesting Engine"]
        OS["Option Chain Replay Simulator"]
        PO["Payoff Diagram Calculator"]
    end

    subgraph ExecutionModes["Execution Modes"]
        LO["Live Offline (Paper Trading)"]
        LA["Live Auto (Fully Automated)"]
        LMO["Live Manual / One-Click"]
    end

    subgraph Operations["Operations & Marketplace"]
        BRK["Broker Adapter Engine (38+ Brokers)"]
        MP["Strategy Marketplace & Subscriptions"]
        NOTIF["Multi-Channel Alerts (WhatsApp/SMS/Call/App)"]
        RECON["Broker Order Reconciliation"]
    end

    StrategyCreation --> SimulationModes
    SimulationModes --> ExecutionModes
    ExecutionModes --> Operations
```

### Feature Categories:
1. **Rule-Based Engine:** Multi-set architecture with independent Entry, Repair (Set Repair & Leg Repair), and Exit condition blocks.
2. **Options Leg Engine:** Strike calculation offsets based on ATM, ATM Spot, Points offset, Delta offset, and Fixed strikes.
3. **Multi-Timeframe Evaluation:** Support for tick-level, 1-min, 3-min, 5-min, 15-min, 30-min, 60-min, and Daily candle intervals.
4. **Broker Token Handling:** Daily auto-login triggers, TOTP authenticators, and manual session renewal alerts.
