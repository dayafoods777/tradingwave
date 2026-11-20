# TradingWave Design System & Visual Identity
**Classification:** `PROPOSED` (TradingWave Identity) & `VERIFIED` (Logo Reference)

---

## 1. Brand Tokens & Color Palette

Based on the official TradingWave logo (`tradingwave_logo.jpg`) with the brand motto **"TRADE BINDAS"**:

```mermaid
flowchart LR
    subgraph PrimaryColors["Primary Brand Colors"]
        C1["Trading Orange<br/>#FF6600<br/>RGB(255, 102, 0)"]
        C2["Deep Navy / Slate<br/>#0F172A<br/>RGB(15, 23, 42)"]
        C3["Dark Slate Surface<br/>#1E293B<br/>RGB(30, 41, 59)"]
    end
    subgraph AccentColors["Financial Accents"]
        G1["Profit Green<br/>#10B981<br/>Buy / Profit"]
        R1["Loss Red<br/>#EF4444<br/>Sell / Loss"]
        A1["Warning Amber<br/>#F59E0B<br/>Attention"]
    end
```

### Color Variables (Tailwind CSS / CSS Variables):
- `--primary`: `#FF6600` (TradingWave Vibrant Orange)
- `--primary-hover`: `#E65C00`
- `--background`: `#0B0F19` (Dark institutional backdrop)
- `--card`: `#131B2E` (High-contrast container)
- `--card-border`: `#1E293B`
- `--foreground`: `#F8FAFC`
- `--muted-foreground`: `#94A3B8`
- `--profit`: `#10B981` (Emergent green)
- `--loss`: `#EF4444` (Vibrant alert red)

---

## 2. Typography

- **Display & Headings:** `Plus Jakarta Sans` or `Inter` (Weights: 600 Semi-Bold, 700 Bold)
- **Data & Tables / Tickers:** `JetBrains Mono` or `Roboto Mono` (Tabular numbers for currency alignment)
- **Body & Prose:** `Inter` (Weights: 400 Regular, 500 Medium)
