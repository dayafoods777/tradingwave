# Seed Strategy Examples (AST Representation)
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
