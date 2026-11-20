# Live Execution & Broker Connectivity Analysis
**Classification:** `VERIFIED` (Tradetron Models) & `PROPOSED` (TradingWave Engine)

---

## 1. Execution Modalities

1. **Live Offline (Paper Trading):** Evaluates live real-time market data ticks. Simulates fills against real-time LTP with virtual order books. Perfect for forward testing without capital risk.
2. **Live Auto (Automated Execution):** Fully autonomous order placement directly to client's connected broker account via REST APIs.
3. **Live Auto - One Click:** Sends real-time push alert requiring trader manual confirmation tap before dispatching order to broker.

### Order State Transitions:
```mermaid
stateDiagram-v2
    [*] --> PENDING_TRIGGER
    PENDING_TRIGGER --> CONDITION_SATISFIED: Strategy Rule True
    CONDITION_SATISFIED --> RISK_CHECK_PASSED: Pre-Trade Risk Ok
    CONDITION_SATISFIED --> REJECTED_BY_RISK: Margin / Loss Limit Exceeded
    RISK_CHECK_PASSED --> SUBMITTED_TO_BROKER: API Dispatch
    SUBMITTED_TO_BROKER --> OPEN_IN_BROKER: Broker ACK
    OPEN_IN_BROKER --> FILLED: Full Fill
    OPEN_IN_BROKER --> PARTIALLY_FILLED: Partial Fill
    PARTIALLY_FILLED --> FILLED: Remainder Filled
    OPEN_IN_BROKER --> CANCELLED: User / Engine Cancel
    SUBMITTED_TO_BROKER --> REJECTED: Broker Error / Margin Failure
    FILLED --> [*]
    REJECTED --> [*]
```
