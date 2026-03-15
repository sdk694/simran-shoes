'use strict';

/* ── Config paths ── */
const CONFIGS = {
  about:         'env/config/about.json',
  flashsale:     'env/config/flashsale.json',
  categories:    'env/config/categories.json',
  testimonials:  'env/config/testimonials.json',
  brands:        'env/config/brands.json',
  heroCampaigns: 'env/config/heroCampaigns.json',
};

/* ── XSS-safe sanitize ── */
function sanitize(str) {
  if (typeof str !== 'string') return str ?? '';
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

/* ── Fetch JSON config ── */
async function fetchConfig(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    console.warn(`[SimranShoes] fetchConfig failed: ${path}`, e.message);
    return null;
  }
}

/* ── WhatsApp URL (used only as fallback / skip) ── */
function whatsappURL(number, productName, price, sku, campaignId) {
  const name = productName || 'a product';
  let msg = `Hi! I'm interested in *${name}*`;
  if (sku)   msg += ` (SKU: ${sku})`;
  if (price) msg += `. Price ₹${price}`;
  msg += `. Is it available?`;
  if (campaignId) msg += ` [ref:${campaignId}]`;
  return `https://wa.me/${number || ''}?text=${encodeURIComponent(msg)}`;
}

/* ── Open WA form (intercepts all WA clicks) ── */
function openWAForm(product, imgPath, waNumber) {
  if (typeof WAFormComponent !== 'undefined' && WAFormComponent.open) {
    WAFormComponent.open(product, imgPath, waNumber || window._waNumber || '');
  } else {
    // Fallback: direct link
    const url = whatsappURL(waNumber || window._waNumber || '', product?.productName, product?.productPrice || product?.price, product?.productId);
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

/* ── WhatsApp icon SVG ── */
function whatsappIconSVG(size = 16) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>`;
}

/* ── Discount % ── */
function calcDiscount(original, sale) {
  const o = parseFloat(original), s = parseFloat(sale);
  if (!o || !s || o <= s) return null;
  return Math.round(((o - s) / o) * 100);
}

/* ── Stars HTML ── */
function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  let html = '<span class="stars-wrap" aria-hidden="true">';
  for (let i = 0; i < full;  i++) html += '<span class="star full">★</span>';
  if (half)                        html += '<span class="star half">★</span>';
  for (let i = 0; i < empty; i++) html += '<span class="star empty">★</span>';
  html += `</span><span class="rating-num">${rating.toFixed(1)}</span>`;
  return html;
}

/* ── Tag badges HTML ── */
function renderTags(tags) {
  return (tags || []).map(t => {
    const cls = t === 'bestseller' ? 'tag-bestseller' : t === 'new' ? 'tag-new' : t === 'deal' ? 'tag-deal' : 'tag-default';
    return `<span class="tag ${cls}">${sanitize(t)}</span>`;
  }).join('');
}

/* ── Image loader with multi-ext fallback ── */
function loadProductImage(imgPath, altText, onFail) {
  const img = document.createElement('img');
  img.alt     = sanitize(altText);
  img.loading = 'lazy';
  img.decoding = 'async';
  img.style.cssText = 'width:100%;height:100%;object-fit:cover;transition:transform 0.5s ease;';
  const exts = ['jpg','png','webp','jpeg','svg'];
  let idx = 0;
  function tryNext() {
    if (idx >= exts.length) { if (onFail) onFail(); return; }
    img.src = `${imgPath}.${exts[idx++]}`;
  }
  img.onerror = tryNext;
  tryNext();
  return img;
}

/* ── Product Card Builder v6 ── */
/* All WA buttons now open WAFormComponent instead of direct link */
function buildProductCard(product, imgBasePath, waNumber, options = {}) {
  const { onQuickView = null, campaignId = '' } = options;

  const name      = sanitize(product.productName  || '');
  const brand     = sanitize(product.brand        || '');
  const price     = sanitize(String(product.productPrice || product.price || ''));
  const imgNum    = sanitize(String(product.productImageNumber || '1'));
  const origPrice = sanitize(String(product.originalPrice || product.msrp || ''));
  const discount  = origPrice ? calcDiscount(origPrice, price) : null;
  const rating    = product.rating    || 0;
  const tags      = product.tags      || [];
  const avail     = product.availability !== false;
  const imgPath   = `${imgBasePath}${imgNum}`;

  const card = document.createElement('article');
  card.className = 'product-card';
  card.setAttribute('role', 'listitem');
  if (!avail) card.classList.add('out-of-stock');
  card.addEventListener('mouseenter', () => _trackView(product.productId || name));

  /* image */
  const imgWrap = document.createElement('div');
  imgWrap.className = 'product-image-wrap';
  const imgEl = loadProductImage(imgPath, name, () => {
    imgWrap.innerHTML = `<div class="product-image-placeholder"><span class="placeholder-icon">👟</span><span>Coming Soon</span></div>`;
  });
  imgWrap.appendChild(imgEl);

  if (tags.length) { const tw = document.createElement('div'); tw.className = 'product-tags-overlay'; tw.innerHTML = renderTags(tags); imgWrap.appendChild(tw); }
  if (discount)    { const db = document.createElement('div'); db.className = 'discount-badge'; db.textContent = `−${discount}%`; imgWrap.appendChild(db); }

  const qv = document.createElement('button');
  qv.className = 'quick-view-btn'; qv.textContent = 'Quick View';
  qv.setAttribute('aria-label', `Quick view ${name}`);
  qv.addEventListener('click', e => { e.stopPropagation(); if (onQuickView) onQuickView(product, imgPath); });
  imgWrap.appendChild(qv);

  if (!avail) { const oos = document.createElement('div'); oos.className = 'oos-overlay'; oos.textContent = 'Out of Stock'; imgWrap.appendChild(oos); }

  /* body */
  const body = document.createElement('div');
  body.className = 'product-body';
  if (brand) { const b = document.createElement('p'); b.className = 'product-brand'; b.textContent = brand; body.appendChild(b); }
  const nameEl = document.createElement('h3'); nameEl.className = 'product-name'; nameEl.textContent = name; body.appendChild(nameEl);
  if (rating > 0) { const rEl = document.createElement('div'); rEl.className = 'product-rating'; rEl.innerHTML = renderStars(rating); body.appendChild(rEl); }
  const pEl = document.createElement('div'); pEl.className = 'product-pricing';
  pEl.innerHTML = `<span class="product-price">₹${price}</span>`;
  if (origPrice && discount) pEl.innerHTML += `<span class="product-original-price">₹${origPrice}</span><span class="product-discount-label">${discount}% off</span>`;
  body.appendChild(pEl);

  const acts = document.createElement('div');
  acts.className = 'product-actions';

  /* WA button → opens form instead of direct link */
  const waBtn = document.createElement('button');
  waBtn.className = `whatsapp-btn-product${avail ? '' : ' disabled'}`;
  waBtn.setAttribute('aria-label', `Buy ${name} on WhatsApp`);
  waBtn.innerHTML = `${whatsappIconSVG(14)} Buy on WhatsApp`;
  waBtn.addEventListener('click', e => {
    e.stopPropagation();
    if (!avail) return;
    _trackWA(product.productId || name, campaignId);
    openWAForm(product, imgPath, waNumber);
  });
  acts.appendChild(waBtn);
  body.appendChild(acts);
  card.appendChild(imgWrap);
  card.appendChild(body);

  /* mobile tap = quick view */
  card.addEventListener('click', e => {
    if (window.innerWidth <= 768 && onQuickView && !e.target.closest('button')) onQuickView(product, imgPath);
  });

  return card;
}

/* ── Telemetry ── */
function _trackView(id) { try { const v=JSON.parse(localStorage.getItem('ss_views')||'[]'); const i=v.indexOf(id); if(i>-1)v.splice(i,1); v.unshift(id); localStorage.setItem('ss_views',JSON.stringify(v.slice(0,24))); } catch{} }
function _trackWA(id,camp) { try { const ev=JSON.parse(localStorage.getItem('ss_wa')||'[]'); ev.push({id,camp,t:Date.now()}); localStorage.setItem('ss_wa',JSON.stringify(ev.slice(-50))); } catch{} }
function getRecentViews() { try { return JSON.parse(localStorage.getItem('ss_views')||'[]'); } catch { return []; } }
