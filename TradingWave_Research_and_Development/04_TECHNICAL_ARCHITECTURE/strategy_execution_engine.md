# Strategy Execution Engine Specification
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
