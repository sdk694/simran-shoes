# 👟 Simran Shoes v5 — Digital Experience Platform

> **Jabalpur's Most Loved Footwear Store** | Est. 2005

Premium, brand-first digital storefront built to PRD v5.1 spec.
Dark editorial design system · Deep Maroon + Gold palette · Cinematic hero · WhatsApp commerce

---

## ⚡ Quick Start (VS Code Live Server)

> **You must serve this over HTTP — not `file://`** (JSON fetch will fail).

1. Open the `simran-shoes-v5/` folder in VS Code
2. Install **Live Server** extension by Ritwick Dey (if not installed)
3. Right-click `index.html` → **Open with Live Server**
4. Site opens at `http://127.0.0.1:5500`

### Other options
```bash
# Python
python3 -m http.server 3000

# Node
npx serve .
```

---

## 📁 Project Structure

```
simran-shoes-v5/
├── index.html                        ← Single entry point
├── netlify.toml                      ← Deployment caching headers
│
├── src/
│   ├── global.css                    ← Design tokens, resets, shared card styles
│   ├── utils.js                      ← Shared helpers: fetch, sanitize, card builder
│   └── app.js                        ← Bootstrap (runs last)
│
├── components/
│   ├── navbar/                       ← Sticky dark navbar + hamburger
│   ├── search/                       ← Global full-screen search (PRD upgrade)
│   ├── hero/                         ← Campaign hero (PRD Feature A)
│   ├── campaign/                     ← Editorial story microsite (Feature A)
│   ├── brands/                       ← Trusted brand strip
│   ├── about/                        ← Store story + stats
│   ├── flashsale/                    ← Flash sale + live countdown
│   ├── categories/                   ← Tabbed grid + search/sort/filter
│   ├── personalization/              ← Adaptive shelf (PRD Feature C)
│   ├── modal/                        ← Quick View + product story (Feature B)
│   ├── testimonials/                 ← Customer reviews
│   └── footer/                       ← Contact, hours, links
│
├── env/config/                       ← ALL content (edit here — no JS needed)
│   ├── about.json                    ← Store identity + WhatsApp number
│   ├── flashsale.json                ← Flash sale products + timer
│   ├── categories.json               ← All products by category
│   ├── testimonials.json             ← Customer reviews
│   ├── brands.json                   ← Brand strip
│   └── heroCampaigns.json            ← Hero campaign config (Feature A)
│
└── assets/
    ├── logo.png                      ← Store logo (replace with real)
    ├── flashsale/                    ← Flash sale images (1.jpg, 2.jpg…)
    └── categories/
        ├── shoes/    (1.jpg, 2.jpg…)
        ├── sandals/
        ├── traditional/
        ├── rainwear/
        ├── socks/
        ├── wallets/
        ├── belts/
        ├── chappals/
        └── others/
```

---

## 🎯 PRD v5.1 Features Implemented

### Feature A — Campaign-Driven Hero Microsite ✅
- JSON-driven campaigns from `heroCampaigns.json`
- Cinematic Unsplash placeholder hero images (swap for real assets)
- Auto-rotating campaigns with dot navigation
- Editorial story grid (5 immersive cards with hover reveals)

### Feature B — Editorial Product Story Pages ✅
- Every Quick View includes a curated micro-story based on product type
- Availability badge, full pricing with discount, ratings
- Full WhatsApp CTA with prefilled message including SKU + campaignId

### Feature C — Adaptive Personalization ✅
- "Trending in Jabalpur" shelf from `popularityScore`
- "For You" shelf boosted by localStorage `ss_views` (recent views)
- Zero server required — deterministic client signals only

### Global Search ✅
- Full-screen overlay instant search across all products + flash sale
- Debounced input, highlight matching text, click-to-open Quick View

---

## ⚙️ Configuration (edit JSON, never touch code)

### Update WhatsApp number
```json
// env/config/about.json
{ "whatsappNumber": "919876543210" }
```
Format: country code + number, no `+`, no spaces.

### Add a product
```json
// env/config/categories.json — add to any category
"7": {
  "productId": "SH007",
  "productName": "Your Product Name",
  "brand": "Brand Name",
  "productPrice": "699",
  "originalPrice": "999",
  "rating": 4.2,
  "tags": ["new"],
  "availability": true,
  "popularityScore": 80,
  "productImageNumber": "3"
}
```
Then add `assets/categories/shoes/3.jpg`.

### Add a hero campaign
```json
// env/config/heroCampaigns.json
{
  "campaignId": "camp-diwali",
  "label": "Diwali Collection",
  "line1": "Celebrate",
  "line2": "In",
  "line3": "Style.",
  "sub": "Festival footwear — traditional & elegant.",
  "heroImage": "your-image-url.jpg",
  "ctaPrimary": { "label": "Shop Now", "target": "#categories" }
}
```

---

## 🚀 Deployment

### Netlify (drag & drop — free)
1. Go to [netlify.com](https://netlify.com) → drag `simran-shoes-v5/` onto dashboard
2. Live in seconds. `netlify.toml` handles caching.

### Vercel
```bash
npx vercel
```

### GitHub Pages
Push to repo → Settings → Pages → Branch: main, Folder: / (root)

---

## 🖼️ Images

The site uses **Unsplash placeholder URLs** for heroes and story sections.
For products: add real images to `assets/categories/{category}/{number}.jpg`.

The app tries extensions in order: `.jpg → .png → .webp → .jpeg → .svg`

---

*Built to PRD v5.1 — Simran Shoes, Jabalpur — Est. 2005*
