# 👟 Simran Shoes — Web Application

> **Jabalpur's Most Loved Footwear Store** | Est. 2005

A production-ready, config-driven Single Page Application built with pure HTML, CSS and JavaScript — no frameworks, no build tools, no npm. Just unzip and run.

---

## Table of Contents

- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
- [Configuration Guide](#configuration-guide)
- [Adding Products](#adding-products)
- [Adding a New Category](#adding-a-new-category)
- [Image Guidelines](#image-guidelines)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## Quick Start

> ⚠️ You **must** use a local server. Opening `index.html` directly via `file://` will block the JSON config requests (CORS). Pick any option below.

### Option 1 — VS Code Live Server (Recommended)
1. Install the **Live Server** extension by Ritwick Dey in VS Code
2. Open the `simran-shoes-v2/` folder in VS Code
3. Right-click `index.html` → **Open with Live Server**
4. App opens at `http://127.0.0.1:5500`

### Option 2 — Python (built into Mac/Linux)
```bash
cd simran-shoes-v2
python3 -m http.server 3000
# Open http://localhost:3000
```

### Option 3 — Node.js (via npx, no install needed)
```bash
cd simran-shoes-v2
npx serve .
```

---

## Project Structure

```
simran-shoes-v2/
│
├── index.html                        ← Single entry point, loads everything
│
├── src/
│   ├── global.css                    ← CSS variables, resets, shared card styles
│   ├── utils.js                      ← Shared helpers: fetch, sanitize, card builder
│   └── app.js                        ← Bootstrap: loads JSON, calls each component
│
├── components/                       ← Each section is a self-contained component
│   ├── navbar/
│   │   ├── navbar.css
│   │   └── navbar.js
│   ├── hero/
│   │   ├── hero.css
│   │   └── hero.js
│   ├── about/
│   │   ├── about.css
│   │   └── about.js
│   ├── flashsale/
│   │   ├── flashsale.css
│   │   └── flashsale.js
│   ├── categories/
│   │   ├── categories.css
│   │   └── categories.js
│   ├── testimonials/
│   │   ├── testimonials.css
│   │   └── testimonials.js
│   └── footer/
│       ├── footer.css
│       └── footer.js
│
├── env/
│   └── config/                       ← All content lives here as JSON
│       ├── about.json
│       ├── flashsale.json
│       ├── categories.json
│       └── testimonials.json
│
└── assets/
    ├── logo.png                      ← Store logo
    ├── flashsale/                    ← Flash sale product images
    │   ├── 1.jpg
    │   ├── 2.jpg
    │   └── ...
    └── categories/                   ← Category product images
        ├── shoes/
        │   ├── 1.jpg
        │   └── 2.jpg
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

## How It Works

The app loads all four JSON config files when the page opens, then each component reads its data and renders itself into a `<div>` placeholder in `index.html`. No page reloads. No server required to run the business logic.

**Script load order matters and is fixed in `index.html`:**
1. `src/utils.js` — shared functions available to all components
2. Component scripts (`navbar.js`, `hero.js`, etc.)
3. `src/app.js` — runs last, fetches configs and calls each component

**WhatsApp number flow:**
The WhatsApp number from `about.json` is set as a global variable by `AboutComponent` before `FlashSaleComponent` and `CategoriesComponent` run — so every product Buy button automatically gets the right number.

---

## Configuration Guide

You never need to touch any `.html`, `.css`, or `.js` file to update content. Everything is controlled by the four JSON files in `env/config/`.

---

### `about.json` — Store Identity

```json
{
  "name": "Simran Shoes",
  "tagline": "Jabalpur's most loved footwear store",
  "established": "2005",
  "yearsOfLegacy": "21+ Years",
  "description": "Your store description here...",
  "address": "Your full store address here",
  "instagram": "https://www.instagram.com/your-handle/",
  "whatsappNumber": "919876543210",
  "googleMapsLink": "https://maps.google.com/?q=Your+Store+Name+Jabalpur",
  "logoText": "SS"
}
```

| Field | Description |
|---|---|
| `whatsappNumber` | Country code + number, no spaces, no `+`. Example: `919876543210` |
| `googleMapsLink` | Paste your Google Maps share link here |
| `instagram` | Full Instagram profile URL |
| `logoText` | 2-letter fallback shown if logo image fails to load |

---

### `flashsale.json` — Flash Sale Products

```json
{
  "flashsale": {
    "1": {
      "productName": "Campus Running Shoes",
      "productPrice": "599",
      "originalPrice": "999",
      "productImageNumber": "1"
    },
    "2": {
      "productName": "Flite Comfort Clogs",
      "productPrice": "299",
      "originalPrice": "499",
      "productImageNumber": "2"
    }
  }
}
```

| Field | Description |
|---|---|
| `productName` | Shown on the card and in the WhatsApp message |
| `productPrice` | Sale price in ₹ |
| `originalPrice` | Optional. If provided, shows strikethrough price and discount % |
| `productImageNumber` | Maps to `assets/flashsale/1.jpg` (or .png / .webp) |

---

### `categories.json` — All Product Categories

```json
{
  "shoes": {
    "1": {
      "productName": "Campus Neo Running Shoes",
      "productPrice": "699",
      "productImageNumber": "1"
    }
  },
  "sandals": {
    "1": {
      "productName": "Flite Casual Sandals",
      "productPrice": "349",
      "productImageNumber": "1"
    }
  }
}
```

Each top-level key (`shoes`, `sandals`, etc.) becomes a tab automatically. Products within each category are displayed in numeric key order.

Image path for category products: `assets/categories/{categoryname}/{productImageNumber}.jpg`

---

### `testimonials.json` — Customer Reviews

```json
{
  "testimonials": {
    "1": {
      "customerName": "Shreyas Kulkarni",
      "customerFeedback": "Amazing variety and great staff!",
      "customerRating": "5/5"
    }
  }
}
```

`customerRating` must be in `X/5` format. The app converts this to visual star icons automatically.

---

## Adding Products

### To add a product to the Flash Sale:
1. Add the product image to `assets/flashsale/` — name it the next number (e.g. `5.jpg`)
2. Add a new entry to `env/config/flashsale.json`:
```json
"5": {
  "productName": "New Product Name",
  "productPrice": "499",
  "originalPrice": "799",
  "productImageNumber": "5"
}
```
3. Save. Refresh the page. Done.

### To add a product to a category:
1. Add the image to `assets/categories/shoes/` — name it the next number (e.g. `4.jpg`)
2. Add a new entry in `env/config/categories.json` under the `shoes` key:
```json
"4": {
  "productName": "New Shoe Name",
  "productPrice": "899",
  "productImageNumber": "4"
}
```
3. Save. Refresh. Done.

---

## Adding a New Category

1. Add a new folder: `assets/categories/yourcategory/`
2. Add product images: `1.jpg`, `2.jpg`, etc.
3. Add a new key in `env/config/categories.json`:
```json
{
  "shoes": { ... },
  "yourcategory": {
    "1": {
      "productName": "Product Name",
      "productPrice": "299",
      "productImageNumber": "1"
    }
  }
}
```
4. A new tab appears automatically. No code changes needed.

---

## Image Guidelines

| Location | Folder | Naming |
|---|---|---|
| Store logo | `assets/` | `logo.png` |
| Flash sale images | `assets/flashsale/` | `1.jpg`, `2.jpg`, ... |
| Category images | `assets/categories/{name}/` | `1.jpg`, `2.jpg`, ... |

**Supported formats:** `.jpg`, `.jpeg`, `.png`, `.webp`, `.svg`
The app tries each extension automatically in that order, so you can mix formats freely.

**Recommended image size:** 600×600px (square crops work best)

**File size:** Keep under 200KB per image for fast loading. Use [Squoosh](https://squoosh.app) to compress images for free.

**Replacing a placeholder:** The `.svg` placeholders included in the zip are just stand-ins. Simply drop your real image with the same number into the same folder and it will be used instead (`.jpg` takes priority over `.svg`).

---

## Deployment

### Netlify — Drag & Drop (Free, Recommended)
1. Go to [netlify.com](https://www.netlify.com) and create a free account
2. From the dashboard, drag the entire `simran-shoes-v2/` folder onto the page
3. Your site is live instantly with a free URL

A `netlify.toml` is already included with correct caching headers configured.

### Vercel (Free)
```bash
npm install -g vercel
cd simran-shoes-v2
vercel
```

### GitHub Pages (Free)
1. Push the `simran-shoes-v2/` folder contents to a GitHub repository
2. Go to **Settings → Pages → Branch: main, Folder: / (root)**
3. Visit `https://yourusername.github.io/your-repo-name/`

### AWS S3 + CloudFront
1. Create an S3 bucket, enable **Static website hosting**
2. Upload all files, set `index.html` as the index document
3. Make the bucket public or attach a CloudFront distribution

---

## Troubleshooting

**Products not showing / page is blank**
→ You are opening `index.html` directly via `file://`. Use a local server (see [Quick Start](#quick-start)).

**Images not loading**
→ Check that the image file name matches `productImageNumber` in the JSON exactly, and that it lives in the correct folder. The app tries `.jpg`, `.png`, `.webp`, `.jpeg`, `.svg` in that order.

**WhatsApp button opens wrong number**
→ Update `whatsappNumber` in `env/config/about.json`. Format: country code + number, no spaces, no `+` symbol. Example: `919876543210`.

**New category tab not appearing**
→ Make sure the key you added in `categories.json` has at least one product entry inside it.

**Changes not reflecting after editing JSON**
→ Hard refresh the browser: `Ctrl + Shift + R` (Windows/Linux) or `Cmd + Shift + R` (Mac).

---

## WhatsApp Message Format

Every Buy on WhatsApp button generates this message automatically:

```
Hi, I'm interested in {Product Name} priced at ₹{Price}
```

No configuration needed — it pulls the product name and price from the JSON.

---

*Built for Simran Shoes, Jabalpur — Est. 2005*
