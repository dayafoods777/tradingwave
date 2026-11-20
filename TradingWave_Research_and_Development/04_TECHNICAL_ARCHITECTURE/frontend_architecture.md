# Frontend Architecture Specification
**Classification:** `PROPOSED`

---

## 1. Technology Choices & Rationale

- **Framework:** Next.js 15 (App Router) + React 19 + TypeScript.
  - *Rationale:* Next.js provides unmatched hybrid rendering (SSR for marketplace SEO, SPA client-side rendering for real-time strategy builder and dashboards).
- **Styling:** Tailwind CSS + shadcn/ui.
  - *Rationale:* Zero runtime overhead, rapid atomic styling, accessible Radix UI primitives.
- **Visual Strategy Canvas:** React Flow (`@xyflow/react`).
  - *Rationale:* High-performance node-based visual workflow editor for building complex condition trees and multi-leg strategies visually.
- **Financial Charting:** TradingView Lightweight Charts (`lightweight-charts`).
  - *Rationale:* Ultra-fast Canvas rendering, Apache 2.0 open-source license, lightweight footprint for multi-timeframe candle and payoff rendering.
- **State Management:** TanStack Query v5 (Server state caching) + Zustand (Client UI & Canvas state).
- **Real-Time Client:** Centrifuge-JS WebSocket client with automatic reconnection and channel subscription multiplexing.
