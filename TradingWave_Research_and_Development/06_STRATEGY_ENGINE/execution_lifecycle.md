# Execution Lifecycle & Worker Loop
**Classification:** `PROPOSED`

---

1. **Market Clock Synchronization:** Strict sync against NTP atomic time servers.
2. **Schedule Fencing:** Intraday strategies activate at 09:15:05 AM and auto-terminate at 15:25:00 PM IST.
3. **Tick Ingestion & Worker Dispatch:** BullMQ queue job dispatched every 1 second or upon bar close event.
