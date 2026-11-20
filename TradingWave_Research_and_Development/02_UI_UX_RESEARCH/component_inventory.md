# Component Inventory
**Classification:** `PROPOSED`

---

## 1. Core UI Components (shadcn/ui + Radix UI)

1. **ConditionBuilderCard:** Grouped container supporting recursive Boolean branches (AND / OR) with keyword pickers.
2. **OptionsLegGrid:** Structured data table with dropdowns for Segment, Instrument, Strike Offset, Action (Buy/Sell), Product Type (MIS/NRML), and Quantity Multiplier.
3. **PayoffGraphWidget:** Interactive SVG/Canvas visualizer calculating strategy expiration P&L curves across underlying price points.
4. **BrokerConnectionCard:** Secure modal and status badge displaying broker connection health, token expiry countdown, and re-login triggers.
5. **RealtimePnLBadge:** Ticker-style numeric display flashing green/red on price update events via WebSockets.
