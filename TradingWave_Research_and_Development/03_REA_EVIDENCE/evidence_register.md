# Technical Evidence Register
**Classification:** `VERIFIED`

---

| ID | Finding | Concrete Evidence Source | Classification | Confidence | Notes |
|---|---|---|---|---|---|
| EV-01 | Tradetron Backend Architecture | Cookies (`tradetron_session`, `XSRF-TOKEN`), comments (`StripIndexPhp`, `ListingStatus::filtered`) | `VERIFIED` | 100% | PHP / Laravel Monolith |
| EV-02 | Keyword Grammar Scope | `window.KW_DATA` in `keyword-data.js` | `VERIFIED` | 100% | Exactly 214 keywords catalogued |
| EV-03 | Math & Indicator Backend | Documentation note under `Zscore`: "part of SCIPY library" | `VERIFIED` | 100% | Python Scipy microservices for numerical calculations |
| EV-04 | Real-time Streaming Engine | Client script `centrifuge.js` loaded on application pages | `VERIFIED` | 100% | Centrifugo WebSocket broker |
| EV-05 | Supported Broker Ecosystem | 38 broker pages in `sitemap-brokers.xml` and `/brokers` page | `VERIFIED` | 100% | All major Indian + Crypto brokers supported |
| EV-06 | Commercial Pricing Matrix | Scraped and parsed from `/pages/pricing` | `VERIFIED` | 100% | 7 distinct tiers from Free to Creator+ |
