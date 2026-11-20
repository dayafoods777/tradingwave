# Security Threat Model (STRIDE)
**Classification:** `PROPOSED`

---

| Threat Category | Potential Attack Vector | TradingWave Mitigation |
|---|---|---|
| **Spoofing** | Forged webhook signals or broker callbacks | HMAC SHA-256 signatures and strict IP allowlisting |
| **Tampering** | Modification of strategy AST in transit | End-to-end TLS 1.3, JSON schema cryptographic verification |
| **Repudiation** | Denying an order dispatch instruction | Tamper-evident append-only audit log with nanosecond timestamps |
| **Information Disclosure** | Leakage of broker API keys and access tokens | Envelope encryption with AWS KMS / AES-256-GCM |
| **Denial of Service** | Webhook flooding during market volatility | Redis token-bucket rate limiters & Cloudflare DDoS shield |
| **Elevation of Privilege** | Tenant cross-access or role escalation | Strict PostgreSQL Row-Level Security (RLS) + JWT claims |
