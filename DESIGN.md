# TradingWave Design System

The TradingWave interface should feel like a calm, precise instrument: dense where traders need data, quiet everywhere else. It takes its cues from Linear's restraint, Stripe and Mercury's typographic clarity, and the data density of Bloomberg and Zerodha Kite. It avoids decorative gradients, glass, glow, emoji and generic marketing patterns.

Everything below lives in code:

| Concern | Source of truth |
| --- | --- |
| Colour tokens (light + dark) | `apps/web/src/app/globals.css` (`:root`, `html.dark`) |
| Tailwind mapping | `apps/web/tailwind.config.js` |
| Component primitives | `@layer components` in `globals.css` (`tw-btn-*`, `tw-input`, `tw-card`, `tw-label`, `tw-badge`, `tw-kbd`) |
| Logo | `apps/web/public/logo-*.svg`, `favicon.svg`, React: `src/components/ui/Logo.tsx` |
| App shell | `src/components/shell/{Sidebar,TopBar,CommandPalette}.tsx` |

---

## 1. Logo

**Concept.** One continuous stroke. It starts as a soft wave on the left (two rounded troughs) and resolves into a straight, rising stroke on the right: a wave that becomes a tick, which also reads as a lowercase "w". It sits inside a square container with a 6.5/32 corner radius, so it holds up as a 16px favicon.

| File | Use |
| --- | --- |
| `logo-mark.svg` | The mark on its own (Deep Tide square, paper stroke) for avatars and app icons |
| `favicon.svg` / `src/app/icon.svg` | Browser favicon |
| `logo-light.svg` | Mark and wordmark for light backgrounds (ink wordmark) |
| `logo-dark.svg` | Mark and wordmark for dark backgrounds (Tide-light square, ink stroke, paper wordmark) |

**Wordmark.** `tradingwave` is always lowercase, in Geist SemiBold with −0.025em tracking. In the SVG files it is converted to outlines, so no font is needed.

**Rules**
- Keep clear space of at least half the mark's width on every side.
- The smallest mark is 16px; the smallest lockup is 18px tall.
- Never recolour the mark outside the token pair (`fill-primary` + `stroke-primary-fg`). In React, `<LogoMark/>` switches with the theme by itself.
- Never add effects (shadow, gradient, outline) and never stretch it.
- In running text the product name is written "TradingWave". Use the lowercase form only for the wordmark.

---

## 2. Colour

Tokens are RGB triplets so Tailwind can apply alpha (`bg-primary/10`). Components use only semantic class names. A hex value in a component is a bug.

### Neutrals

| Token | Tailwind | Light | Dark | Use |
| --- | --- | --- | --- | --- |
| `--bg` | `bg-bg` | `#F7F6F2` Paper | `#0A0B0D` | Page background |
| `--surface` | `bg-surface` | `#FFFFFF` | `#111316` | Cards, tables, popovers |
| `--subtle` | `bg-subtle` | `#F2F1EC` | `#16191D` | Table heads, hovers, wells |
| `--muted` | `bg-muted` | `#E9E7E0` | `#1E2227` | Chips, tracks |
| `--border` | `border-border` | `#E4E2DB` | `#24282E` | Hairlines (1px everywhere) |
| `--border-strong` | `border-border-strong` | `#CECBC1` | `#343941` | Hover borders, chart axes |
| `--fg` | `text-fg` | `#0B0F14` Ink | `#ECEBE6` | Primary text (text-primary) |
| `--fg-secondary` | `text-fg-secondary` | `#484E57` | `#A8ACB2` | Body and secondary text |
| `--fg-muted` | `text-fg-muted` | `#757A82` | `#747981` | Labels, meta, placeholders |

### Brand and market

| Token | Tailwind | Light | Dark | Use |
| --- | --- | --- | --- | --- |
| `--primary` | `bg-primary` / `text-primary` | `#0B5A55` Deep Tide | `#3AB8A8` Tide light | Primary actions, active nav, links |
| `--primary-hover` | `bg-primary-hover` | `#084844` | `#56C9BA` | Hover state of primary |
| `--primary-soft` | `bg-primary-soft` | `#E4EFED` | `#112A28` | Selected rows, soft badges |
| `--on-primary` | `text-primary-fg` | `#FFFFFF` | `#041210` | Text on primary |
| `--accent` | `bg-accent` | `#E0A133` Signal Amber | `#E8B04A` | Use sparingly: unread dots, ATM marker, spot line, "New" |
| `--accent-fg` | `text-accent-fg` | `#8A5A06` | `#E8B04A` | Amber text that passes contrast |
| `--profit` | `text-profit` | `#1F9D6B` | `#34C488` | Buy, profit, up ticks |
| `--loss` | `text-loss` | `#D64545` | `#F06767` | Sell, loss, down ticks, kill switch |
| `--ink` | `bg-ink` | `#0B0F14` | `#060709` | Always-dark panels: logs, code, the Safety section |

**Rules**
- Teal is the only brand colour. Amber is a signal, not decoration: at most one or two amber marks per screen.
- Green and red mean buy/profit and sell/loss only. Never use them for generic success or error styling of unrelated UI.
- Dark mode is near-black and neutral, never navy.
- Don't use gradients, except the chart area fill (a single hue at ≤10% alpha).

---

## 3. Type

| Role | Font | Notes |
| --- | --- | --- |
| UI and display | **Geist Sans** (`geist` package, self-hosted via `next/font`) | `--font-geist-sans` |
| Numbers and code | **Geist Mono** | `font-mono` gives tabular figures automatically (`tnum`) |

**Scale (app)**: page title 22/−0.02em semibold · section title 15 semibold · body 13 · secondary 12 · labels 10.5 uppercase +0.08em (`tw-label`).
**Scale (marketing)**: hero 40 → 68 at −0.04em · H2 28 → 36 at −0.03em · lead 16–17.

**Rules**
- Every price, P&L figure, quantity, Greek, strike and timestamp is `font-mono` (tabular).
- Headings are sentence case. Use uppercase only for `tw-label`.
- Use weights 400, 500 and 600. Don't use 700 or heavier in the product.

---

## 4. Spacing, radius, elevation

- Base unit 4px. App page padding is 24px on desktop and 12px on mobile. Gaps between page sections are 20px (`space-y-5`).
- Control height 32px (`h-8`), compact 28px (`h-7`). Table rows are about 40px with `py-2.5`.
- Radius: 6px for controls and badges (`rounded-md`) and 8px for cards and tables (`rounded-lg`). Larger radii are reserved for the marketing terminal frame (12px).
- Elevation: hairline borders do the work. `shadow-pop` is reserved for floating layers (menus, modals, toasts, command palette). Cards have no shadow.

---

## 5. Motion

- Durations are 150–250ms with easing `cubic-bezier(0.22, 1, 0.36, 1)` (`ease-out`).
- `animate-fade-up` (4px rise, 220ms) for view changes, menus and panel reveals. `animate-fade-in` for overlays.
- **Number ticks**: `<TickNumber/>` briefly tints a value with profit or loss colour when it changes (600ms).
- **Ticker**: `.animate-marquee` is a 70s linear loop that pauses on hover.
- Everything respects `prefers-reduced-motion`. Animations collapse to ~0ms and the marquee stops.
- Don't use bouncing, scaling buttons or parallax.

---

## 6. Components

| Primitive | Class / file | Notes |
| --- | --- | --- |
| Primary button | `tw-btn-primary` | One per view region |
| Secondary button | `tw-btn-secondary` | Bordered, surface background |
| Ghost / icon button | `tw-btn-ghost` (`h-7 w-7 px-0` for icons) | Row actions, top bar |
| Danger | `tw-btn-danger`, or `border-loss/30 text-loss` outline | Kill switch, square off |
| Input / select | `tw-input` | 32px, focus ring `primary/15` |
| Segmented tabs | `rounded-md border bg-subtle p-0.5`, active `bg-surface shadow-hairline` | Filters, presets |
| Underline tabs | 2px `bg-primary` indicator | Console tabs |
| Badge | `tw-badge` with a soft token background | Paper = accent-soft, Live = profit-soft |
| Label | `tw-label` | KPI and filter group labels |
| Page header | `ui/PageHeader.tsx` | Title, description, actions |
| KPI strip | One bordered container split by hairlines | Never separate floating cards |
| Data table | `bg-subtle` head at 11px, `divide-border` rows, mono numerics right-aligned | Wrap in `overflow-x-auto` |
| Empty state | 40px icon tile, one-line title, one sentence, 1–2 actions | Never a bare "No data" |
| Charts | SVG with `stroke-*` and `fill-*` token classes; profit above zero, loss below via clip paths; amber dashed spot line | `PayoffChart`, `EquityCurve` in `marketing/mocks.tsx` |

### App shell
- **Sidebar** (232px, collapses to 56px, becomes a drawer below `lg`): groups are Workspace, Build, Market and Account. The active item gets a surface pill and a 2px teal rail.
- **Top bar** (48px): breadcrumb, ⌘K command palette, NSE market status and NIFTY/BANKNIFTY, kill switch, notifications, theme, account (market region and language live here).
- Views deep-link through the URL hash (`/app/#builder`).

---

## 7. Voice

- Concise, specific to Indian markets (NSE, BSE, F&O, NIFTY, lot sizes, STT).
- SEBI-aware: never promise returns. Label simulated data as illustrative. State that TradingWave is execution software, not an adviser or a broker.
- Avoid "Unlock", "Supercharge", "Revolutionise", "Bindas" and exclamation marks.
