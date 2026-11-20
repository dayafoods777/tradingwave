# Browser Observations & DOM Analysis
**Classification:** `VERIFIED`

---

## 1. Observed DOM & Client State Evidence

1. **CSRF & Security Tokens:** Laravel standard `XSRF-TOKEN` cookie and `<meta name="csrf-token">` present on all HTML pages.
2. **Session Cookies:** `tradetron_session` cookie with encrypted Laravel payload structure (`iv`, `value`, `mac`).
3. **Real-time WebSockets:** Centrifugo client script loaded (`/js/centrifuge.js?v=1795022413`).
4. **Theme Handling:** Client localStorage key `tradetron.theme` with dark mode class toggle on root `<html>`.
5. **Acquisition & Attribution:** Custom script tracking ad clicks, AI referrals (ChatGPT, Claude, Perplexity), and UTM tags.
