# Network Request Inventory & API Surface
**Classification:** `VERIFIED` & `INFERRED`

---

## 1. Observed Public Network Endpoints

- `GET /keyword-documentation` -> Serves keyword documentation UI and loads `keyword-data.js`
- `GET /sitemaps/sitemap-*.xml` -> Public index of pages, products, strategies, and brokers
- `POST /api/...` -> Protected JSON API endpoints (gated behind session/token authentication)
- `WSS wss://push.tradetron.tech/connection/websocket` -> Inferred Centrifugo real-time streaming endpoint
