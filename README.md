<div align="center">

# 🔐 Cryptonite

### *Your gateway to the crypto universe*

[![Next.js](https://img.shields.io/badge/Next.js-14.2.5-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES2024-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

A sleek, full-featured cryptocurrency market tracker and trading simulator — live prices, interactive charts, portfolio management, and a virtual wallet. Built for crypto enthusiasts who want real data without real risk.

</div>

---

## ✨ What Makes Cryptonite Special

| Feature | Details |
|---|---|
| 📡 **Live Market Data** | Real-time prices, market caps, and volume via CoinGecko API |
| 📊 **Dual Chart Libraries** | Recharts for market overviews + Chart.js for deep coin analysis |
| 💼 **Virtual Trading** | Start with ₹1,00,000 and practice buying crypto risk-free |
| 📈 **Portfolio Tracker** | Track holdings, average buy price, and live P&L |
| 🔍 **Smart Search** | Filter across hundreds of coins instantly |
| 🛡️ **Rate-Limit Resilient** | In-memory caching + JSON fallback so the app never goes dark |
| 📱 **Fully Responsive** | Mobile-first design that looks great on any screen |
| 🌙 **Glassmorphism UI** | Dark gradient theme with frosted-glass cards and glow effects |

---

## 🖥️ Pages at a Glance

```
/               → Market Dashboard   — Global stats, trending coins, top performers
/ProductsPage   → Full Market Table  — Sortable list with sparkline charts + pagination
/coins/[id]     → Coin Detail        — Price history charts, ATH/ATL, market metrics
/buy            → Buy Crypto         — Simulate purchases with your virtual wallet
/portfolio      → My Holdings        — Live P&L, cost basis, CSV export
/AboutPage      → About              — The story behind Cryptonite
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **npm** or **yarn**

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/harshcode1/Cryptonite.git
cd Cryptonite

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you're live.

### Production Build

```bash
npm run build
npm start
```

---

## 🏗️ Project Structure

```
Cryptonite/
├── app/
│   ├── layout.js                  # Root layout — Navbar + Footer wrapper
│   ├── page.js                    # Home dashboard
│   ├── globals.css                # Tailwind + custom glassmorphism styles
│   │
│   ├── components/
│   │   ├── Navbar.js              # Sticky nav with wallet balance display
│   │   ├── Footer.js              # Footer with links and branding
│   │   ├── Markettable.js         # Coin table with inline sparklines
│   │   ├── Sidebar.js             # Top performers sidebar
│   │   ├── Searchbar.js           # Live search/filter input
│   │   ├── Pagination.js          # Smart pagination component
│   │   ├── Chart.js               # Reusable chart wrapper
│   │   └── card.js                # Glassmorphism card primitives
│   │
│   ├── api/
│   │   ├── coins/route.js         # GET /api/coins — paginated market data (5min cache)
│   │   ├── price/route.js         # GET /api/price — current prices (5min cache)
│   │   ├── coin/[id]/route.js     # GET /api/coin/:id — full coin details
│   │   └── chart/[id]/route.js    # GET /api/chart/:id — historical price data
│   │
│   ├── ProductsPage/page.js       # Full market listing
│   ├── buy/page.js                # Virtual trading desk
│   ├── portfolio/page.js          # Holdings + P&L dashboard
│   ├── coins/[id]/page.js         # Individual coin deep-dive
│   ├── AboutPage/page.js          # About page
│   └── not-found.js               # Custom 404
│
├── data/
│   └── coins.json                 # API response cache (fallback on rate limit)
│
├── public/                        # Static assets
├── tailwind.config.js
├── next.config.mjs                # Image domains, standalone output
└── package.json
```

---

## 🔌 API Routes

All routes include **5-minute in-memory caching** keyed by query parameters. On CoinGecko rate limits (HTTP 429), responses fall back to `data/coins.json`.

| Endpoint | Description |
|---|---|
| `GET /api/coins?page=1&per_page=50` | Paginated market data with sparklines |
| `GET /api/price?ids=bitcoin,ethereum` | Current prices for specified coins |
| `GET /api/coin/:id` | Full details: description, links, ATH, supply |
| `GET /api/chart/:id?days=7` | OHLC price history for charting |

---

## 💡 Tech Stack Deep Dive

| Layer | Technology | Why |
|---|---|---|
| Framework | **Next.js 14** (App Router) | File-based routing, API routes, image optimization |
| UI | **React 18** | Component model, hooks for local state |
| Styling | **Tailwind CSS 3.4** | Utility-first, responsive, dark-mode friendly |
| Charts | **Recharts** + **Chart.js** | Area charts for overview; line charts for coin detail |
| HTTP | **Axios** | Clean promise API, easy interceptors |
| Icons | **Lucide React** | Consistent, tree-shakable SVG icons |
| UI Primitives | **Radix UI** | Accessible slot/portal components |
| Data Source | **CoinGecko API** (Free) | Comprehensive, no-auth global coin data |

---

## 💼 Virtual Portfolio System

Cryptonite ships with a fully simulated trading engine stored in **localStorage** — no backend, no real money.

- **Starting balance:** ₹1,00,000
- **Min purchase:** ₹100 &nbsp;|&nbsp; **Max purchase:** ₹1,00,00,000
- **Tracked per holding:** quantity · avg buy price · total spent (INR & USD) · purchase date
- **Live metrics:** current value · unrealized P&L · % return
- **Export:** one-click CSV download of all holdings

---

## 🎨 Design System

The entire UI is built around a **dark glassmorphism** aesthetic:

- **Background:** `slate-900 → purple-900 → slate-900` diagonal gradient
- **Cards:** `backdrop-blur` + semi-transparent backgrounds
- **Accent colors:** Blue `#3b82f6` · Purple `#a855f7` · Green `#10b981` · Red `#ef4444`
- **Text effects:** Animated gradient text, glow effects on key elements
- **Custom utilities:** `.glass-card`, `.btn-modern`, `.gradient-text`, `.glow-purple`

---

## 📦 Key Dependencies

```json
{
  "next": "14.2.5",
  "react": "^18",
  "recharts": "^2.13.0",
  "react-chartjs-2": "^5.2.0",
  "axios": "^1.7.2",
  "lucide-react": "^0.453.0",
  "@radix-ui/react-slot": "^1.1.0",
  "tailwindcss": "^3.4.1"
}
```

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m "Add amazing feature"`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<div align="center">

Built with ❤️ by [harshcode1](https://github.com/harshcode1)

*Powered by [CoinGecko API](https://www.coingecko.com/en/api)*

</div>
