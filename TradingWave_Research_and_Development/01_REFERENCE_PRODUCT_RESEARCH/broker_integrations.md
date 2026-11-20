# Broker Integrations & Authentication Matrix
**Classification:** `VERIFIED` (Broker Directory) & `PROPOSED` (TradingWave Architecture)

---

## 1. Supported Broker Matrix (India & Crypto)

From Tradetron's public sitemap and broker directories, 38+ brokers are identified:

| Broker Name | Protocol / API | Auth Mechanism | Token Validity | Segments Supported |
|---|---|---|---|---|
| **Zerodha** | Kite Connect REST | API Key + Secret + Request Token | 24 Hours (Daily login) | Equity, F&O, Commodity, Currency |
| **Dhan** | DhanHQ REST & WS | Access Token + Client ID | 30 Days (Direct API) | Equity, F&O, Commodity, Currency |
| **Angel One** | SmartAPI REST & WS | API Key + Client Code + TOTP | 24 Hours (Daily login) | Equity, F&O, Commodity, Currency |
| **Groww** | Groww Trade API | OAuth 2.0 / API Keys | 24 Hours | Equity, F&O |
| **Fyers** | Fyers API v3 | App ID + Secret + Auth Code | 24 Hours | Equity, F&O, Commodity |
| **Upstox** | Upstox API v2 | API Key + Secret + OAuth Redirect | 24 Hours | Equity, F&O, Commodity |
| **Kotak Neo** | Neo Trade API | Consumer Key + Secret + Mobile + MPIN | 24 Hours | Equity, F&O, Commodity |
| **Finvasia (Shoonya)** | Shoonya REST API | User ID + Password + TOTP + Vendor Key | 24 Hours | Equity, F&O, Commodity |
| **Alice Blue** | ANT API | User ID + API Key | 24 Hours | Equity, F&O, Commodity |
| **IIFL Securities** | IIFL Blazr API | User Key + App Secret | 24 Hours | Equity, F&O, Commodity |
| **Nuvama** | Nuvama API | App Key + Secret | 24 Hours | Equity, F&O |
| **Motilal Oswal** | MOSL API | API Key + Client Code | 24 Hours | Equity, F&O |
| **5Paisa** | 5Paisa Open API | App Key + Encryption Key + User ID | 24 Hours | Equity, F&O |
| **Paytm Money** | PM API | API Key + Secret + Access Token | 24 Hours | Equity, F&O |
| **Delta Exchange** | Delta REST & WS | API Key + HMAC SHA256 Signature | Permanent (Non-expiring key) | Crypto Futures & Options |
| **CoinDCX** | CoinDCX REST | API Key + Secret | Permanent | Crypto Spot & Futures |
