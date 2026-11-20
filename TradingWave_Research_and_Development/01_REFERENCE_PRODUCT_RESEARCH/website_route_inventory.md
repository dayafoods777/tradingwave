# Tradetron Website & Application Route Inventory
**Classification:** `VERIFIED` & `INFERRED`
**Source of Evidence:** `tradetron.tech/robots.txt`, sitemaps, HTTP headers, DOM examination.

---

## 1. Route Discovery & Access Classification

| Route Path | Category | Access Gate | Observable Functionality | Evidence Source |
|---|---|---|---|---|
| `/` | Marketing | Public | Landing page, feature overview, CTA, stats counter | `VERIFIED` (curl / DOM) |
| `/strategy-builder` | Product | Public | Visual explanation of Strategy Builder, Set/Leg architecture | `VERIFIED` (curl) |
| `/advanced-wizard` | Product | Public | Multi-leg option builder overview, rules, payoff guide | `VERIFIED` (curl) |
| `/option-simulator` | Product | Public | Historical option chain replay & strategy backtesting preview | `VERIFIED` (curl) |
| `/pinebridge` | Integration | Public | TradingView Pine Script webhook bridge onboarding | `VERIFIED` (curl) |
| `/signal-bridge` | Integration | Public | External HTTP/Excel webhook signal bridge onboarding | `VERIFIED` (curl) |
| `/stock-bag` | Product | Public | Equity basket & weighted portfolio builder overview | `VERIFIED` (curl) |
| `/covered-calls` | Wizard | Public | Guided wizard for automated covered call execution | `VERIFIED` (sitemap) |
| `/cash-secured-puts` | Wizard | Public | Guided wizard for cash-secured put option writing | `VERIFIED` (sitemap) |
| `/brokers` | Ecosystem | Public | 38+ supported broker directory and partner offers | `VERIFIED` (curl) |
| `/broker/{slug}` | Ecosystem | Public | Individual broker setup guides, API keys, TOTP instructions | `VERIFIED` (sitemap) |
| `/pages/pricing` | Commercial | Public | 7 pricing plans (Free to Creator+), feature comparison matrix | `VERIFIED` (curl) |
| `/market-place` | Marketplace | Public | Strategy catalog, creator profiles, filters, performance cards | `VERIFIED` (robots.txt) |
| `/strategies` | Marketplace | Public | Strategy search, filter by exchange, tag, instrument | `VERIFIED` (robots.txt) |
| `/strategy/{id}` | Marketplace | Public | Public strategy performance detail, subscription button | `VERIFIED` (robots.txt) |
| `/strategy-templates` | Onboarding | Public | Library of pre-built templates (Straddles, Condors, MACD) | `VERIFIED` (curl) |
| `/keyword-documentation` | Docs | Public | Interactive documentation for 214 keywords | `VERIFIED` (curl / bundle) |
| `/login` | Identity | Public | Authentication endpoint (Email, Google OAuth) | `VERIFIED` (robots.txt) |
| `/signup` | Identity | Public | New user registration flow | `VERIFIED` (robots.txt) |
| `/my-strategies` | App Core | Authenticated | List of user's authored strategies, status, edit buttons | `VERIFIED` (robots.txt) |
| `/strategies/{id}/edit`| App Core | Authenticated | Strategy Builder editor (sets, legs, conditions, keywords) | `VERIFIED` (robots.txt) |
| `/deployed` | App Core | Authenticated | Live and Paper deployed strategies, PnL monitoring, controls | `VERIFIED` (robots.txt) |
| `/deployed-strategies` | App Core | Authenticated | Deployment management, broker assignments, multipliers | `VERIFIED` (robots.txt) |
| `/backtest/list` | App Core | Authenticated | Historical backtest run queues, equity curves, trade logs | `VERIFIED` (robots.txt) |
| `/user-profile` | Identity | Authenticated | User account details, phone verification, KYC, preferences | `VERIFIED` (robots.txt) |
| `/ai-tokens` | AI Core | Authenticated | Token balance for AI strategy generation (ChatGPT/Claude MCP)| `VERIFIED` (robots.txt) |
