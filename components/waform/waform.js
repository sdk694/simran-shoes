/**
 * WAFORM v6 — WhatsApp Pre-Enquiry Form
 * Intercepts every product WhatsApp button click.
 * Collects: Name, Mobile, Shoe Size, Address (optional)
 * Validates all required fields with inline errors.
 * Builds a fully-prefilled WhatsApp message with product + user details.
 */
const WaFormComponent = (() => {
  let _product  = {};
  let _backdrop = null;
  let _lastFocus = null;

  const SHOE_SIZES = [
    '3','4','5','6','7','8','9','10','11','12',
    '3 UK','4 UK','5 UK','6 UK','7 UK','8 UK','9 UK','10 UK','11 UK','12 UK',
    'S (Kids)','M (Kids)','L (Kids)','Free Size'
  ];

  /* ── Template ── */
  function getTemplate() {
    const opts = SHOE_SIZES.map(s => `<option value="${sanitize(s)}">${sanitize(s)}</option>`).join('');
    return `
      <div class="waform-backdrop" id="waf-backdrop" role="dialog" aria-modal="true" aria-labelledby="waf-title">
        <div class="waform-box" id="waf-box">

          <div class="waform-header">
            <div class="waform-header-top">
              <div class="waform-wa-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </div>
              <div>
                <div class="waform-title" id="waf-title">Quick Enquiry</div>
              </div>
            </div>
            <div class="waform-subtitle">Share your details and we'll have your order ready in minutes!</div>
            <div class="waform-product-strip">
              <div class="waform-product-thumb" id="waf-thumb">👟</div>
              <div>
                <div class="waform-product-name"  id="waf-prod-name">Product</div>
                <div class="waform-product-price" id="waf-prod-price"></div>
              </div>
            </div>
            <button class="waform-close" id="waf-close" aria-label="Close">✕</button>
          </div>

          <div class="waform-body" id="waf-body">
            <p class="waform-intro">Your Details</p>

            <div class="waform-field">
              <label class="waform-label" for="waf-name">Full Name <span class="req">*</span></label>
              <div class="waform-input-wrap">
                <span class="waform-input-icon">👤</span>
                <input type="text" id="waf-name" class="waform-input" placeholder="e.g. Priya Sharma" autocomplete="name" maxlength="60" />
              </div>
              <div class="waform-error" id="waf-name-err">Please enter your full name (minimum 2 characters)</div>
            </div>

            <div class="waform-field">
              <label class="waform-label" for="waf-mobile">Mobile Number <span class="req">*</span></label>
              <div class="waform-input-wrap">
                <span class="waform-input-icon">📱</span>
                <input type="tel" id="waf-mobile" class="waform-input" placeholder="e.g. 9876543210" autocomplete="tel" maxlength="15" inputmode="numeric" />
              </div>
              <div class="waform-error" id="waf-mobile-err">Please enter a valid 10-digit mobile number</div>
            </div>

            <div class="waform-row">
              <div class="waform-field">
                <label class="waform-label" for="waf-size">Shoe Size <span class="req">*</span></label>
                <div class="waform-select-wrap">
                  <select id="waf-size" class="waform-select" aria-label="Select shoe size">
                    <option value="">Select size…</option>
                    ${opts}
                  </select>
                </div>
                <div class="waform-error" id="waf-size-err">Please select your shoe size</div>
              </div>

              <div class="waform-field">
                <label class="waform-label" for="waf-address">Area / Locality <span style="opacity:0.55;font-weight:400;font-size:0.62rem">(optional)</span></label>
                <div class="waform-input-wrap">
                  <span class="waform-input-icon">📍</span>
                  <input type="text" id="waf-address" class="waform-input" placeholder="e.g. Napier Town" maxlength="80" />
                </div>
              </div>
            </div>

            <div class="waform-note">
              <span class="waform-note-icon">ℹ️</span>
              <span>Clicking <strong>Chat on WhatsApp</strong> opens WhatsApp with all your details and product info pre-filled. No data is stored by us.</span>
            </div>

            <div class="waform-actions">
              <button class="waform-submit" id="waf-submit" type="button">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                Chat on WhatsApp
              </button>
              <button class="waform-skip" id="waf-skip" type="button">Skip — Chat Directly →</button>
            </div>
          </div>

          <div class="waform-success" id="waf-success">
            <span class="waform-success-icon">✅</span>
            <div class="waform-success-title">Opening WhatsApp…</div>
            <p class="waform-success-sub">All your details have been added to the message. WhatsApp is opening now!</p>
          </div>

        </div>
      </div>`;
  }

  /* ── Validators ── */
  const rules = {
    name:   v => v.trim().length >= 2,
    mobile: v => /^\d{10,12}$/.test(v.replace(/\D/g, '')),
    size:   v => v !== '',
  };

  function setFieldError(inputId, errId, hasError) {
    document.getElementById(inputId)?.classList.toggle('error', hasError);
    document.getElementById(errId)?.classList.toggle('show', hasError);
  }

  function validateAll() {
    const n = document.getElementById('waf-name')?.value   || '';
    const m = document.getElementById('waf-mobile')?.value  || '';
    const s = document.getElementById('waf-size')?.value    || '';
    let ok = true;
    if (!rules.name(n))   { setFieldError('waf-name',  'waf-name-err',   true);  ok = false; }
    else                    setFieldError('waf-name',  'waf-name-err',   false);
    if (!rules.mobile(m)) { setFieldError('waf-mobile','waf-mobile-err', true);  ok = false; }
    else                    setFieldError('waf-mobile','waf-mobile-err', false);
    if (!rules.size(s))   { setFieldError('waf-size',  'waf-size-err',   true);  ok = false; }
    else                    setFieldError('waf-size',  'waf-size-err',   false);
    return ok;
  }

  /* ── Build WA message with product + user details ── */
  function buildMessage(name, mobile, size, address) {
    const p = _product;
    let msg = `Hi Simran Shoes! 👋 I'd like to enquire about a product.\n\n`;
    msg += `🛍️ *Product:* ${p.name || 'Product'}\n`;
    if (p.price) msg += `💰 *Price:* ₹${p.price}\n`;
    if (p.sku)   msg += `🏷️ *SKU:* ${p.sku}\n`;
    msg += `\n👤 *My Details:*\n`;
    msg += `• Name: *${name.trim()}*\n`;
    msg += `• Mobile: *${mobile.trim()}*\n`;
    msg += `• Shoe Size: *${size}*\n`;
    if (address?.trim()) msg += `• Area: *${address.trim()}*\n`;
    msg += `\nPlease confirm availability. Thank you!`;
    if (p.campaignId) msg += ` [src:${p.campaignId}]`;
    return msg;
  }

  /* ── Open / Close ── */
  function open(productInfo) {
    _product   = productInfo || {};
    _lastFocus = document.activeElement;

    // Reset
    ['waf-name','waf-mobile','waf-address'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    const sz = document.getElementById('waf-size'); if (sz) sz.value = '';
    ['waf-name','waf-mobile','waf-size'].forEach(id => { document.getElementById(id)?.classList.remove('error'); });
    ['waf-name-err','waf-mobile-err','waf-size-err'].forEach(id => { document.getElementById(id)?.classList.remove('show'); });
    document.getElementById('waf-success')?.classList.remove('show');
    const body = document.getElementById('waf-body'); if (body) body.style.display = '';

    // Populate product strip
    const nameEl  = document.getElementById('waf-prod-name');
    const priceEl = document.getElementById('waf-prod-price');
    const thumb   = document.getElementById('waf-thumb');
    if (nameEl)  nameEl.textContent  = _product.name  || '';
    if (priceEl) priceEl.textContent = _product.price ? `₹${_product.price}` : '';
    if (thumb) {
      if (_product.imgSrc) {
        const img = document.createElement('img');
        img.src = _product.imgSrc;
        img.alt = _product.name || '';
        img.onerror = () => { thumb.textContent = '👟'; };
        thumb.innerHTML = '';
        thumb.appendChild(img);
      } else {
        thumb.textContent = '👟';
      }
    }

    _backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', _escKey);
    setTimeout(() => document.getElementById('waf-name')?.focus(), 80);
  }

  function close() {
    if (!_backdrop) return;
    _backdrop.classList.remove('open');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', _escKey);
    if (_lastFocus) _lastFocus.focus();
  }

  function _escKey(e) { if (e.key === 'Escape') close(); }

  /* ── Submit ── */
  function handleSubmit() {
    if (!validateAll()) return;
    const name    = document.getElementById('waf-name').value;
    const mobile  = document.getElementById('waf-mobile').value;
    const size    = document.getElementById('waf-size').value;
    const address = document.getElementById('waf-address')?.value || '';

    document.getElementById('waf-body').style.display = 'none';
    document.getElementById('waf-success').classList.add('show');

    const msg = buildMessage(name, mobile, size, address);
    const num = window._waNumber || '';
    const url = `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
    setTimeout(() => { window.open(url, '_blank', 'noopener,noreferrer'); setTimeout(close, 600); }, 500);
  }

  /* ── Skip (direct WA without form) ── */
  function handleSkip() {
    const p   = _product;
    const num = window._waNumber || '';
    let msg   = `Hi! I'm interested in *${p.name || 'a product'}*`;
    if (p.price) msg += ` at ₹${p.price}`;
    if (p.sku)   msg += ` (SKU: ${p.sku})`;
    msg += `. Is it available?`;
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
    close();
  }

  /* ── Site-wide click interception ── */
  function interceptClicks() {
    document.body.addEventListener('click', (e) => {
      const btn = e.target.closest('.whatsapp-btn-product, .modal-wa-btn');
      if (!btn || btn.classList.contains('disabled')) return;
      e.preventDefault();
      e.stopImmediatePropagation();

      let info = {};

      // From product card
      const card = btn.closest('.product-card');
      if (card) {
        const imgEl = card.querySelector('.product-image-wrap img');
        info = {
          name:       card.querySelector('.product-name')?.textContent || '',
          price:      (card.querySelector('.product-price')?.textContent || '').replace('₹','').trim(),
          brand:      card.querySelector('.product-brand')?.textContent || '',
          sku:        '',
          imgSrc:     imgEl?.src || '',
          campaignId: 'card',
        };
      } else {
        // From Quick View modal
        const imgEl = document.querySelector('.modal-img-panel img');
        info = {
          name:       document.getElementById('modal-prod-name')?.textContent || '',
          price:      (document.querySelector('.modal-price')?.textContent || '').replace('₹','').trim(),
          sku:        (document.getElementById('modal-sku')?.textContent || '').replace('SKU:','').trim(),
          imgSrc:     imgEl?.src || '',
          campaignId: 'quickview',
        };
      }

      open(info);
    }, true); // capture = fires before default href
  }

  /* ── Init ── */
  function init() {
    const root = document.getElementById('waform-root');
    if (!root) return;
    root.innerHTML = getTemplate();
    _backdrop = document.getElementById('waf-backdrop');

    _backdrop.addEventListener('click', e => { if (e.target === _backdrop) close(); });
    document.getElementById('waf-close')?.addEventListener('click', close);
    document.getElementById('waf-submit')?.addEventListener('click', handleSubmit);
    document.getElementById('waf-skip')?.addEventListener('click', handleSkip);

    // Real-time inline validation on blur/change
    [['waf-name','waf-name-err','name'],['waf-mobile','waf-mobile-err','mobile'],['waf-size','waf-size-err','size']].forEach(([id, errId, rule]) => {
      const el = document.getElementById(id);
      if (!el) return;
      const validate = () => { if (el.value) setFieldError(id, errId, !rules[rule](el.value)); };
      el.addEventListener('blur',   validate);
      el.addEventListener('change', validate);
    });

    interceptClicks();
  }

  return { init, open, close };
})();
