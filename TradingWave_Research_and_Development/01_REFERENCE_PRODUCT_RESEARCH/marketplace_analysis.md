# Strategy Marketplace & Social Trading Analysis
**Classification:** `VERIFIED`

---

## 1. Commercial & Operational Architecture

Tradetron's Marketplace operates as a two-sided network:
- **Strategy Creators (Sellers):** Quantitative traders and signal providers who publish strategies publicly.
- **Subscribers (Buyers):** Retail traders who subscribe to strategies and deploy them into their personal broker accounts.

### Key Rules Observed:
1. **Non-Custodial Guarantee:** Capital never leaves the subscriber's broker account. Tradetron only routes orders.
2. **Pricing Models:** Free public, Fixed monthly subscription fee, or Profit-sharing model.
3. **Execution Synchronization:** High-priority webhook distribution ensuring all subscribers receive order signals concurrently.
4. **Creator Limits:** Free/Retail plans cannot publish to marketplace. Creator plans allow 5 to 10 marketplace listings.
