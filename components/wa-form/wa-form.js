/**
 * WA-FORM COMPONENT v6
 * Pre-enquiry modal before any WhatsApp redirect.
 * Collects: Name, Mobile, Shoe Size, Address
 * On submit: builds a rich WhatsApp message with all product + customer details.
 * Skip link: goes directly to WhatsApp with just the product info.
 *
 * PRD: Every WhatsApp CTA must pass through this gate.
 */
const WAFormComponent = (() => {

  let _backdrop = null;
  let _pendingURL = '';   // fallback WA URL (used by skip)
  let _product   = null;  // { name, price, sku, brand }
  let _waNumber  = '';

  /* ── Shoe size options ── */
  const SHOE_SIZES = [
    '3', '4', '5', '6', '7', '8', '9', '10', '11', '12',
    'Kids 1', 'Kids 2', 'Kids 3', 'Kids 4', 'Kids 5',
    'Not sure / Need help',
  ];

  /* ── Template ── */
  function getTemplate() {
    const sizeOpts = SHOE_SIZES.map(s => `<option value="${s}">${s}</option>`).join('');
    return `
      <div class="waf-backdrop" id="waf-backdrop" role="dialog" aria-modal="true" aria-labelledby="waf-title">
        <div class="waf-box" id="waf-box">
          <button class="waf-close" id="waf-close" aria-label="Close">✕</button>

          <!-- Header -->
          <div class="waf-header">
            <div class="waf-header-top">
              <div class="waf-wa-icon" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              </div>
              <div>
                <div class="waf-title" id="waf-title">Almost There!</div>
                <div class="waf-subtitle">Share a few details so we can serve you better on WhatsApp.</div>
              </div>
            </div>
            <!-- Product chip -->
            <div class="waf-product-chip" id="waf-product-chip" style="display:none;">
              <div class="waf-product-thumb" id="waf-product-thumb">🛍️</div>
              <div class="waf-product-info">
                <div class="waf-product-name" id="waf-product-name"></div>
                <div class="waf-product-price" id="waf-product-price"></div>
              </div>
            </div>
          </div>

          <!-- Form -->
          <form class="waf-form" id="waf-form" novalidate>

            <!-- Name -->
            <div class="waf-field">
              <label class="waf-label" for="waf-name">
                Full Name <span class="required">*</span>
              </label>
              <input
                type="text" id="waf-name" name="name"
                class="waf-input" placeholder="e.g. Priya Sharma"
                autocomplete="name" maxlength="60"
              />
              <span class="waf-error-msg" id="waf-name-err">Please enter your full name (at least 2 characters).</span>
            </div>

            <!-- Mobile -->
            <div class="waf-field">
              <label class="waf-label" for="waf-mobile">
                Mobile Number <span class="required">*</span>
              </label>
              <input
                type="tel" id="waf-mobile" name="mobile"
                class="waf-input" placeholder="e.g. 9876543210"
                autocomplete="tel" maxlength="15" inputmode="numeric"
              />
              <span class="waf-hint">10-digit Indian mobile number</span>
              <span class="waf-error-msg" id="waf-mobile-err">Please enter a valid 10-digit mobile number.</span>
            </div>

            <!-- Size + (optional label row) -->
            <div class="waf-field-row">
              <!-- Shoe Size -->
              <div class="waf-field">
                <label class="waf-label" for="waf-size">
                  Shoe Size <span class="required">*</span>
                </label>
                <div class="waf-select-wrap">
                  <select id="waf-size" name="size" class="waf-select">
                    <option value="">— Select size —</option>
                    ${sizeOpts}
                  </select>
                </div>
                <span class="waf-error-msg" id="waf-size-err">Please select a shoe size.</span>
              </div>

              <!-- Gender (optional helper for size) -->
              <div class="waf-field">
                <label class="waf-label" for="waf-gender">For</label>
                <div class="waf-select-wrap">
                  <select id="waf-gender" name="gender" class="waf-select">
                    <option value="">— Optional —</option>
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Kids">Kids</option>
                    <option value="Unisex">Unisex</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Address -->
            <div class="waf-field">
              <label class="waf-label" for="waf-address">
                Address / Area <span class="required">*</span>
              </label>
              <input
                type="text" id="waf-address" name="address"
                class="waf-input" placeholder="e.g. Napier Town, Jabalpur"
                autocomplete="street-address" maxlength="120"
              />
              <span class="waf-hint">Locality or full address for delivery enquiries</span>
              <span class="waf-error-msg" id="waf-address-err">Please enter your area or address.</span>
            </div>

            <!-- Privacy -->
            <div class="waf-privacy">
              <span class="waf-privacy-icon">🔒</span>
              <span>Your details are only used to personalise your WhatsApp message. We never store or share them.</span>
            </div>

          </form>

          <!-- Actions -->
          <div class="waf-actions">
            <button class="waf-submit" id="waf-submit" type="button">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              Chat with Us on WhatsApp
            </button>
            <button class="waf-skip" id="waf-skip" type="button">
              Skip &amp; go directly to WhatsApp →
            </button>
          </div>

          <!-- Success (shown after submit) -->
          <div class="waf-success" id="waf-success">
            <span class="waf-success-icon">🎉</span>
            <div class="waf-success-title">Opening WhatsApp…</div>
            <p class="waf-success-msg">Your details have been added to the message automatically. Our team will get back to you within minutes!</p>
          </div>

        </div>
      </div>`;
  }

  /* ── Validation helpers ── */
  function validateName(v) {
    return v.trim().length >= 2;
  }

  function validateMobile(v) {
    const cleaned = v.replace(/\D/g, '');
    return cleaned.length === 10 && /^[6-9]/.test(cleaned);
  }

  function validateSize(v) {
    return v !== '';
  }

  function validateAddress(v) {
    return v.trim().length >= 3;
  }

  function setError(inputId, errId, show) {
    const inp = document.getElementById(inputId);
    const err = document.getElementById(errId);
    if (!inp || !err) return;
    inp.classList.toggle('error', show);
    err.classList.toggle('show', show);
  }

  function clearErrors() {
    ['waf-name', 'waf-mobile', 'waf-size', 'waf-address'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('error');
    });
    ['waf-name-err', 'waf-mobile-err', 'waf-size-err', 'waf-address-err'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('show');
    });
  }

  function validateForm() {
    clearErrors();
    const name    = document.getElementById('waf-name')?.value    || '';
    const mobile  = document.getElementById('waf-mobile')?.value  || '';
    const size    = document.getElementById('waf-size')?.value    || '';
    const address = document.getElementById('waf-address')?.value || '';

    let valid = true;
    if (!validateName(name))    { setError('waf-name',    'waf-name-err',    true); valid = false; }
    if (!validateMobile(mobile)){ setError('waf-mobile',  'waf-mobile-err',  true); valid = false; }
    if (!validateSize(size))    { setError('waf-size',    'waf-size-err',    true); valid = false; }
    if (!validateAddress(address)){ setError('waf-address', 'waf-address-err', true); valid = false; }

    if (!valid) {
      // Scroll to first error
      const firstErr = document.querySelector('.waf-input.error, .waf-select.error');
      if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return valid;
  }

  /* ── Build WhatsApp message ── */
  function buildWAMessage(formData) {
    const { name, mobile, size, gender, address } = formData;
    const prod = _product || {};

    let msg = `Hi! I'd like to enquire about a product at Simran Shoes, Jabalpur.\n\n`;
    msg += `📦 *Product Details*\n`;
    if (prod.name)  msg += `Product: *${prod.name}*\n`;
    if (prod.brand) msg += `Brand: ${prod.brand}\n`;
    if (prod.price) msg += `Price: *₹${prod.price}*\n`;
    if (prod.sku)   msg += `SKU: ${prod.sku}\n`;
    msg += `\n👤 *My Details*\n`;
    msg += `Name: *${name.trim()}*\n`;
    msg += `Mobile: ${mobile.trim()}\n`;
    msg += `Shoe Size: *${size}*${gender ? ` (${gender})` : ''}\n`;
    msg += `Address/Area: ${address.trim()}\n`;
    msg += `\nIs this product available? Looking forward to your reply!`;

    return msg;
  }

  /* ── Populate product chip ── */
  function showProductChip(product, imgPath) {
    const chip  = document.getElementById('waf-product-chip');
    const thumb = document.getElementById('waf-product-thumb');
    const name  = document.getElementById('waf-product-name');
    const price = document.getElementById('waf-product-price');
    if (!chip) return;

    if (product) {
      chip.style.display = 'flex';
      if (name)  name.textContent  = product.productName || '';
      if (price) price.textContent = product.productPrice ? `₹${product.productPrice}` : '';
      if (thumb && imgPath) {
        const img = document.createElement('img');
        img.src    = `${imgPath}.jpg`;
        img.alt    = product.productName || '';
        img.style.cssText = 'width:100%;height:100%;object-fit:cover;';
        img.onerror = () => { thumb.textContent = '👟'; };
        thumb.innerHTML = '';
        thumb.appendChild(img);
      }
    } else {
      chip.style.display = 'none';
    }
  }

  /* ── Live validation (clear error on fix) ── */
  function bindLiveValidation() {
    const nameEl    = document.getElementById('waf-name');
    const mobileEl  = document.getElementById('waf-mobile');
    const sizeEl    = document.getElementById('waf-size');
    const addressEl = document.getElementById('waf-address');

    nameEl?.addEventListener('input', () => {
      if (validateName(nameEl.value)) setError('waf-name', 'waf-name-err', false);
    });
    mobileEl?.addEventListener('input', () => {
      // Only allow digits
      mobileEl.value = mobileEl.value.replace(/\D/g, '').slice(0, 10);
      if (validateMobile(mobileEl.value)) setError('waf-mobile', 'waf-mobile-err', false);
    });
    sizeEl?.addEventListener('change', () => {
      if (validateSize(sizeEl.value)) setError('waf-size', 'waf-size-err', false);
    });
    addressEl?.addEventListener('input', () => {
      if (validateAddress(addressEl.value)) setError('waf-address', 'waf-address-err', false);
    });
  }

  /* ── Open / Close ── */
  function open(product, imgPath, waNumber) {
    if (!_backdrop) return;
    _product  = product;
    _waNumber = waNumber || window._waNumber || '';
    // Fallback URL (for skip)
    const name  = product?.productName || '';
    const price = product?.productPrice || product?.price || '';
    const sku   = product?.productId || '';
    _pendingURL = `https://wa.me/${_waNumber}?text=${encodeURIComponent(
      `Hi! I'm interested in *${name}*${sku ? ` (SKU: ${sku})` : ''}${price ? `. Price ₹${price}` : ''}. Is it available?`
    )}`;

    // Reset form state
    clearErrors();
    const form = document.getElementById('waf-form');
    if (form) form.reset();
    const success = document.getElementById('waf-success');
    if (success) success.classList.remove('show');
    const formEl  = document.getElementById('waf-form');
    const actions = document.getElementById('waf-box')?.querySelector('.waf-actions');
    if (formEl)  formEl.style.display = '';
    if (actions) actions.style.display = '';

    showProductChip(product, imgPath);

    _backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Focus first input
    setTimeout(() => {
      document.getElementById('waf-name')?.focus();
    }, 60);
  }

  function close() {
    if (!_backdrop) return;
    _backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* ── Submit ── */
  function handleSubmit() {
    if (!validateForm()) return;

    const formData = {
      name:    document.getElementById('waf-name')?.value    || '',
      mobile:  document.getElementById('waf-mobile')?.value  || '',
      size:    document.getElementById('waf-size')?.value    || '',
      gender:  document.getElementById('waf-gender')?.value  || '',
      address: document.getElementById('waf-address')?.value || '',
    };

    const msg    = buildWAMessage(formData);
    const waURL  = `https://wa.me/${_waNumber}?text=${encodeURIComponent(msg)}`;

    // Show success state
    const formEl  = document.getElementById('waf-form');
    const actions = document.getElementById('waf-box')?.querySelector('.waf-actions');
    const success = document.getElementById('waf-success');
    if (formEl)  formEl.style.display  = 'none';
    if (actions) actions.style.display = 'none';
    if (success) success.classList.add('show');

    // Open WhatsApp after brief delay (let user see success msg)
    setTimeout(() => {
      window.open(waURL, '_blank', 'noopener,noreferrer');
      close();
    }, 900);
  }

  /* ── Init ── */
  function init() {
    const root = document.getElementById('wa-form-root');
    if (!root) return;
    root.innerHTML = getTemplate();
    _backdrop = document.getElementById('waf-backdrop');

    // Close on backdrop click
    _backdrop.addEventListener('click', e => { if (e.target === _backdrop) close(); });

    // Close button
    document.getElementById('waf-close')?.addEventListener('click', close);

    // ESC key
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && _backdrop?.classList.contains('open')) close(); });

    // Submit
    document.getElementById('waf-submit')?.addEventListener('click', handleSubmit);

    // Enter key on form
    document.getElementById('waf-form')?.addEventListener('keydown', e => {
      if (e.key === 'Enter' && e.target.tagName !== 'SELECT') handleSubmit();
    });

    // Skip
    document.getElementById('waf-skip')?.addEventListener('click', () => {
      close();
      if (_pendingURL) window.open(_pendingURL, '_blank', 'noopener,noreferrer');
    });

    // Live validation
    bindLiveValidation();
  }

  return { init, open, close };
})();
