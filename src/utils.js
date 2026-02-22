/**
 * SIMRAN SHOES v3 — Shared Utilities
 * Loaded before all component scripts
 */

'use strict';

// ─── Config paths (migrated to public/config/) ───────────────
const CONFIG_BASE = 'public/config/';
const ASSETS_BASE = 'assets/';

const CONFIGS = {
  about:        CONFIG_BASE + 'about.json',
  flashsale:    CONFIG_BASE + 'flashsale.json',
  categories:   CONFIG_BASE + 'categories.json',
  testimonials: CONFIG_BASE + 'testimonials.json',
};

// Global WhatsApp number — set by AboutComponent.init()
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
    `Hi, I'm interested in ${productName} priced at ₹${productPrice}. Is it available?`
  );
  return `https://wa.me/${number}?text=${msg}`;
}

// ─── Amazon search URL builder ───────────────────────────────
function amazonURL(productName) {
  const query = encodeURIComponent(productName);
  return `https://www.amazon.in/s?k=${query}`;
}

// ─── Star rating renderer ────────────────────────────────────
function renderStars(rating, showNumber = true) {
  const num    = parseFloat(rating) || 0;
  const full   = Math.floor(num);
  const half   = num % 1 >= 0.5;
  const empty  = 5 - full - (half ? 1 : 0);
  let html = '<span class="stars-wrap" aria-hidden="true">';
  for (let i = 0; i < full;  i++) html += '<span class="star full">★</span>';
  if (half)                        html += '<span class="star half">★</span>';
  for (let i = 0; i < empty; i++) html += '<span class="star empty">★</span>';
  html += '</span>';
  if (showNumber && num > 0) html += `<span class="rating-num">${num.toFixed(1)}</span>`;
  return html;
}

// ─── Discount calculator ─────────────────────────────────────
function calcDiscount(original, sale) {
  const orig = parseFloat(original);
  const curr = parseFloat(sale);
  if (!orig || !curr || orig <= curr) return null;
  return Math.round(((orig - curr) / orig) * 100);
}

// ─── Tag badge renderer ──────────────────────────────────────
function renderTags(tags = []) {
  if (!tags || tags.length === 0) return '';
  const map = {
    bestseller: { label: 'Bestseller', cls: 'tag-bestseller' },
    new:        { label: 'New',        cls: 'tag-new' },
    deal:       { label: 'Deal',       cls: 'tag-deal' },
  };
  return tags.map(t => {
    const cfg = map[t] || { label: t, cls: 'tag-default' };
    return `<span class="product-tag ${cfg.cls}">${cfg.label}</span>`;
  }).join('');
}

// ─── WhatsApp SVG icon ───────────────────────────────────────
function whatsappIconSVG(size = 16) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.558 4.112 1.529 5.836L.038 23.485a.5.5 0 0 0 .65.65l5.524-1.557A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.013-1.374l-.36-.214-3.727 1.05 1.002-3.667-.234-.376A9.818 9.818 0 1 1 12 21.818z"/>
  </svg>`;
}

// ─── Image loader with multi-extension fallback ───────────────
function loadProductImage(imgPath, altText, onFail) {
  const img  = document.createElement('img');
  img.alt    = sanitize(altText);
  img.loading = 'lazy';
  img.decoding = 'async';
  img.style.cssText = 'width:100%;height:100%;object-fit:cover;transition:transform 0.5s ease;';

  const exts  = ['jpg', 'png', 'webp', 'jpeg', 'svg'];
  let extIdx  = 0;

  function tryNext() {
    if (extIdx >= exts.length) { if (onFail) onFail(); return; }
    img.src = `${imgPath}.${exts[extIdx++]}`;
  }
  img.onerror = tryNext;
  tryNext();
  return img;
}

// ─── Enhanced Product Card Builder (v3) ──────────────────────
function buildProductCard(product, imgBasePath, waNumber, options = {}) {
  const { isFlash = false, onQuickView = null } = options;

  const name     = sanitize(product.productName  || '');
  const brand    = sanitize(product.brand         || '');
  const price    = sanitize(String(product.productPrice || product.price || ''));
  const imgNum   = sanitize(String(product.productImageNumber || '1'));
  const origPrice = sanitize(String(product.originalPrice || ''));
  const discount  = origPrice ? calcDiscount(origPrice, price) : null;
  const rating    = product.rating || 0;
  const tags      = product.tags  || [];
  const avail     = product.availability !== false;
  const imgPath   = `${imgBasePath}${imgNum}`;

  const card = document.createElement('article');
  card.className = 'product-card';
  card.setAttribute('role', 'listitem');
  if (!avail) card.classList.add('out-of-stock');

  // ── Image wrapper
  const imgWrap = document.createElement('div');
  imgWrap.className = 'product-image-wrap';

  const img = loadProductImage(imgPath, name, () => {
    imgWrap.innerHTML = `
      <div class="product-image-placeholder">
        <span class="placeholder-icon">👟</span>
        <span>Image coming soon</span>
      </div>`;
  });
  imgWrap.appendChild(img);

  // Tags overlay
  if (tags.length > 0) {
    const tagWrap = document.createElement('div');
    tagWrap.className = 'product-tags-overlay';
    tagWrap.innerHTML = renderTags(tags);
    imgWrap.appendChild(tagWrap);
  }

  if (isFlash && discount) {
    const badge = document.createElement('div');
    badge.className   = 'flash-badge';
    badge.textContent = `${discount}% OFF`;
    imgWrap.appendChild(badge);
  }

  // Quick View button (desktop hover)
  const qvBtn = document.createElement('button');
  qvBtn.className   = 'quick-view-btn';
  qvBtn.textContent = 'Quick View';
  qvBtn.setAttribute('aria-label', `Quick view ${name}`);
  qvBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (onQuickView) onQuickView(product, imgPath);
  });
  imgWrap.appendChild(qvBtn);

  // Out of stock overlay
  if (!avail) {
    const oos = document.createElement('div');
    oos.className   = 'oos-overlay';
    oos.textContent = 'Out of Stock';
    imgWrap.appendChild(oos);
  }

  // ── Card body
  const body = document.createElement('div');
  body.className = 'product-body';

  // Brand
  if (brand) {
    const brandEl = document.createElement('p');
    brandEl.className   = 'product-brand';
    brandEl.textContent = brand;
    body.appendChild(brandEl);
  }

  // Name
  const nameEl = document.createElement('h3');
  nameEl.className   = 'product-name';
  nameEl.textContent = name;
  body.appendChild(nameEl);

  // Rating
  if (rating > 0) {
    const ratingEl = document.createElement('div');
    ratingEl.className = 'product-rating';
    ratingEl.innerHTML = renderStars(rating);
    body.appendChild(ratingEl);
  }

  // Pricing
  const pricingEl = document.createElement('div');
  pricingEl.className = 'product-pricing';
  pricingEl.innerHTML = `<span class="product-price">₹${price}</span>`;
  if (origPrice && discount) {
    pricingEl.innerHTML += `
      <span class="product-original-price">₹${origPrice}</span>
      <span class="product-discount">${discount}% off</span>`;
  }
  body.appendChild(pricingEl);

  // Actions
  const actions = document.createElement('div');
  actions.className = 'product-actions';

  const waBtn = document.createElement('a');
  waBtn.className = 'whatsapp-btn-product';
  waBtn.href      = whatsappURL(waNumber, name, price);
  waBtn.target    = '_blank';
  waBtn.rel       = 'noopener noreferrer';
  waBtn.setAttribute('aria-label', `Buy ${name} on WhatsApp`);
  waBtn.innerHTML = `${whatsappIconSVG()} Buy on WhatsApp`;
  if (!avail) waBtn.classList.add('disabled');
  actions.appendChild(waBtn);

  body.appendChild(actions);
  card.appendChild(imgWrap);
  card.appendChild(body);

  // Mobile: tap card to open Quick View
  card.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && onQuickView && !e.target.closest('a')) {
      onQuickView(product, imgPath);
    }
  });

  return card;
}
