# Integration Security & Signature Verification
**Classification:** `PROPOSED`

---

1. **Webhook Authentication:** HMAC SHA-256 signature header (`X-TradingWave-Signature`).
2. **Replay Protection:** Timestamp nonce verification within a 5-second sliding window.
3. **Rate Limiting:** Dedicated Redis Token Bucket per webhook endpoint (100 req/min).
