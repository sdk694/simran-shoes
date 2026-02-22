/**
 * SIMRAN SHOES — Shared Utilities
 * Loaded before all component scripts
 */

'use strict';

// ─── Config paths ────────────────────────────────────────────
const CONFIG_BASE = 'env/config/';
const ASSETS_BASE = 'assets/';

const CONFIGS = {
  about:        CONFIG_BASE + 'about.json',
  flashsale:    CONFIG_BASE + 'flashsale.json',
  categories:   CONFIG_BASE + 'categories.json',
  testimonials: CONFIG_BASE + 'testimonials.json',
};

// Global store for WhatsApp number (set after about.json loads)
window._waNumber = '';

// ─── Fetch helper ────────────────────────────────────────────
async function fetchConfig(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(`[Config] Failed to load ${url}:`, err.message);
    return null;
  }
}

// ─── Sanitize to prevent XSS ─────────────────────────────────
function sanitize(str) {
  if (typeof str !== 'string') return String(str || '');
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ─── WhatsApp URL builder ────────────────────────────────────
function whatsappURL(number, productName, productPrice) {
  const msg = encodeURIComponent(
    `Hi, I'm interested in ${productName} priced at ₹${productPrice}`
  );
  return `https://wa.me/${number}?text=${msg}`;
}

// ─── Amazon search URL builder ───────────────────────────────
function amazonURL(productName) {
  const query = encodeURIComponent(productName);
  return `https://www.amazon.in/s?k=${query}`;
}

// ─── Star rating renderer ────────────────────────────────────
function renderStars(ratingStr) {
  const parts = String(ratingStr || '5/5').split('/');
  const filled = parseInt(parts[0]) || 5;
  const total  = parseInt(parts[1]) || 5;
  let html = '';
  for (let i = 1; i <= total; i++) {
    html += `<span class="star ${i <= filled ? 'filled' : ''}" aria-hidden="true">★</span>`;
  }
  return html;
}

// ─── Discount calculator ─────────────────────────────────────
function calcDiscount(original, sale) {
  const orig = parseFloat(original);
  const curr = parseFloat(sale);
  if (!orig || !curr || orig <= curr) return null;
  return Math.round(((orig - curr) / orig) * 100);
}

// ─── WhatsApp SVG icon ───────────────────────────────────────
function whatsappIconSVG(size = 16) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.558 4.112 1.529 5.836L.038 23.485a.5.5 0 0 0 .65.65l5.524-1.557A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.013-1.374l-.36-.214-3.727 1.05 1.002-3.667-.234-.376A9.818 9.818 0 1 1 12 21.818z"/>
  </svg>`;
}

// ─── Amazon SVG icon ─────────────────────────────────────────
function amazonIconSVG(size = 16) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M13.958 10.09c0 1.232.029 2.256-.591 3.351-.502.891-1.301 1.438-2.186 1.438-1.214 0-1.922-.924-1.922-2.292 0-2.692 2.415-3.182 4.699-3.182v.685zm3.186 7.705c-.209.189-.512.201-.745.074-1.047-.872-1.234-1.276-1.814-2.106-1.734 1.767-2.962 2.297-5.209 2.297-2.66 0-4.731-1.641-4.731-4.925 0-2.565 1.391-4.309 3.37-5.164 1.715-.754 4.11-.891 5.942-1.099v-.41c0-.753.06-1.642-.384-2.294-.385-.579-1.124-.819-1.776-.819-1.205 0-2.277.618-2.541 1.897-.054.285-.261.567-.549.582l-3.061-.333c-.259-.056-.548-.266-.472-.66.705-3.716 4.06-4.836 7.065-4.836 1.537 0 3.544.41 4.756 1.574 1.537 1.437 1.389 3.353 1.389 5.443v4.925c0 1.48.616 2.13 1.194 2.929.204.287.249.631-.009.845l-2.416 2.08h.001z"/>
    <path d="M20.16 17.928c-2.184 1.637-5.352 2.508-8.08 2.508-3.823 0-7.268-1.414-9.876-3.762-.205-.185-.021-.438.224-.295 2.812 1.636 6.292 2.619 9.883 2.619 2.423 0 5.088-.502 7.543-1.543.37-.158.681.242.306.473z"/>
    <path d="M21.069 16.899c-.279-.358-1.845-.169-2.549-.085-.214.025-.247-.161-.054-.296 1.249-.878 3.297-.625 3.535-.331.238.295-.063 2.344-1.235 3.322-.18.151-.351.07-.271-.128.264-.659.854-2.124.574-2.482z"/>
  </svg>`;
}

// ─── Product card builder (shared across flashsale & categories) ──
function buildProductCard(product, imgBasePath, waNumber, options = {}) {
  const { isFlash = false } = options;
  const name          = sanitize(product.productName  || '');
  const price         = sanitize(String(product.productPrice || ''));
  const imgNum        = sanitize(String(product.productImageNumber || '1'));
  const originalPrice = sanitize(String(product.originalPrice || ''));
  const discount      = originalPrice ? calcDiscount(originalPrice, price) : null;

  const card = document.createElement('article');
  card.className = 'product-card';
  card.setAttribute('role', 'listitem');

  // ── Image wrapper
  const imgWrap = document.createElement('div');
  imgWrap.className = 'product-image-wrap';

  const imgPath = `${imgBasePath}${imgNum}`;
  const img     = document.createElement('img');
  img.alt       = name;
  img.loading   = 'lazy';
  img.decoding  = 'async';
  img.style.cssText = 'width:100%;height:100%;object-fit:cover;transition:transform 0.5s ease;';

  const exts  = ['jpg', 'png', 'webp', 'jpeg', 'svg'];
  let extIdx  = 0;

  function tryNext() {
    if (extIdx >= exts.length) {
      imgWrap.innerHTML = `
        <div class="product-image-placeholder">
          <span class="placeholder-icon">👟</span>
          <span>Image coming soon</span>
        </div>`;
      return;
    }
    img.src = `${imgPath}.${exts[extIdx++]}`;
  }

  img.onerror = tryNext;
  tryNext();
  imgWrap.appendChild(img);

  if (isFlash) {
    const badge = document.createElement('div');
    badge.className   = 'flash-badge';
    badge.textContent = '⚡ Sale';
    imgWrap.appendChild(badge);
  }

  // ── Card body
  const body = document.createElement('div');
  body.className = 'product-body';

  const nameEl = document.createElement('h3');
  nameEl.className   = 'product-name';
  nameEl.textContent = name;

  const pricingEl = document.createElement('div');
  pricingEl.className = 'product-pricing';
  pricingEl.innerHTML = `<span class="product-price">₹${price}</span>`;
  if (originalPrice && discount) {
    pricingEl.innerHTML += `
      <span class="product-original-price">₹${originalPrice}</span>
      <span class="product-discount">${discount}% off</span>`;
  }

  // ── Action buttons wrapper
  const actions = document.createElement('div');
  actions.className = 'product-actions';

  // WhatsApp button
  const waBtn = document.createElement('a');
  waBtn.className  = 'whatsapp-btn-product';
  waBtn.href       = whatsappURL(waNumber, name, price);
  waBtn.target     = '_blank';
  waBtn.rel        = 'noopener noreferrer';
  waBtn.setAttribute('aria-label', `Buy ${name} on WhatsApp`);
  waBtn.innerHTML  = `${whatsappIconSVG()} Buy on WhatsApp`;

  // Amazon button
  const amzBtn = document.createElement('a');
  amzBtn.className = 'amazon-btn-product';
  amzBtn.href      = amazonURL(name);
  amzBtn.target    = '_blank';
  amzBtn.rel       = 'noopener noreferrer';
  amzBtn.setAttribute('aria-label', `Search ${name} on Amazon`);
  amzBtn.innerHTML = `${amazonIconSVG()} Buy on Amazon`;

  actions.appendChild(waBtn);
  actions.appendChild(amzBtn);

  body.appendChild(nameEl);
  body.appendChild(pricingEl);
  body.appendChild(actions);

  card.appendChild(imgWrap);
  card.appendChild(body);

  return card;
}
