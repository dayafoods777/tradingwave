# Strategy Builder Deep Investigation
**Classification:** `VERIFIED` (Production Assets & DOM Analysis)

---

## 1. Structural Anatomy of a Strategy

In the reference architecture, a strategy is hierarchically composed of:
1. **Strategy Level Metadata:**
   - Strategy Name, Description, Tags, Category.
   - Default Underlying (e.g. NIFTY 50, BANKNIFTY, RELIANCE).
   - Execution Settings (Continuous check vs Candle close check, check frequency).
2. **Strategy Sets (1 to N):**
   - Each Set operates as an independent logical trading idea.
   - **Entry Condition Block:** Boolean expression tree determining when to initiate positions.
   - **Positions / Legs Block:** Instruments to Buy/Sell when Entry condition evaluates to True.
   - **Repair Condition Blocks:** Conditional logic to hedge, roll, or adjust active positions.
   - **Exit Condition Block:** Conditions to square off all positions belonging to this Set.
3. **Universal Exit Condition:**
   - Global failsafe condition evaluated across all sets (e.g. Total Strategy PnL <= -5000 OR Time >= 15:20).
4. **Universal Trailing Stop Loss (Universal Exit TSL):**
   - Activates trailing exit when strategy reaches target profit threshold.

```mermaid
classDiagram
    class Strategy {
        +UUID id
        +string name
        +string underlying
        +boolean is_active
        +UniversalExit universal_exit
        +List~StrategySet~ sets
    }
    class StrategySet {
        +int set_index
        +ConditionBlock entry_condition
        +List~PositionLeg~ entry_legs
        +List~RepairBlock~ repair_blocks
        +ConditionBlock exit_condition
    }
    class PositionLeg {
        +string action (BUY/SELL)
        +string instrument_type (OPT/FUT/EQ)
        +string expiry_type (WEEKLY/MONTHLY)
        +string strike_selection (ATM/OTM/ITM/DELTA)
        +int lot_multiplier
    }
    class ConditionBlock {
        +string logical_operator (AND/OR)
        +List~ConditionNode~ conditions
    }
    Strategy --> StrategySet
    StrategySet --> PositionLeg
    StrategySet --> ConditionBlock
```
