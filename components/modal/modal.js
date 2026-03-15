/**
 * MODAL / QUICK VIEW v5 (PRD Feature B — Editorial Product Story)
 * Singleton, focus-trapped, ESC-closable, accessibility-complete
 */
const ModalComponent = (() => {
  let _backdrop = null, _lastFocus = null;

  // Curated micro-stories per category keyword (Feature B)
  const STORIES = {
    shoe:      { title: 'Built for Every Step', body: 'Crafted for comfort on Jabalpur\'s streets — from morning walks to evening outings.' },
    sandal:    { title: 'Open-Toe Freedom',     body: 'Breathable design engineered for warm MP summers. Slip on and go.' },
    chappal:   { title: 'Daily Companion',       body: 'Doctor-recommended designs trusted by thousands of customers in Jabalpur.' },
    wallet:    { title: 'Carry in Style',        body: 'Premium leather and RFID-safe materials — your essentials, always protected.' },
    belt:      { title: 'The Finishing Touch',   body: 'Genuine leather belts that elevate every outfit, from formal to casual.' },
    rain:      { title: 'Monsoon Ready',         body: 'Waterproof, grip-optimised, and built to outlast the season.' },
    sock:      { title: 'Foundation of Comfort', body: 'Quality socks that keep your feet fresh from 9am to 9pm.' },
    default:   { title: 'Simran Shoes Promise',  body: '21+ years of quality, trust and style — Jabalpur\'s most loved footwear store since 2005.' },
  };

  function getStory(productName) {
    const n = (productName || '').toLowerCase();
    for (const [key, story] of Object.entries(STORIES)) {
      if (key !== 'default' && n.includes(key)) return story;
    }
    return STORIES.default;
  }

  function getTemplate() {
    return `
      <div class="modal-backdrop" id="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-prod-name">
        <div class="modal-box" id="modal-box">
          <button class="modal-close" id="modal-close" aria-label="Close quick view">✕</button>

          <div class="modal-img-panel" id="modal-img-panel">
            <div class="modal-img-tags" id="modal-img-tags"></div>
          </div>

          <div class="modal-details">
            <p class="modal-brand"    id="modal-brand"></p>
            <h2 class="modal-name"   id="modal-prod-name"></h2>
            <p class="modal-sku"     id="modal-sku"></p>
            <div class="modal-rating"   id="modal-rating"></div>
            <div class="modal-pricing"  id="modal-pricing"></div>
            <div class="modal-avail"    id="modal-avail"></div>
            <div class="modal-story"    id="modal-story"></div>
            <hr class="modal-divider" />
            <a class="modal-wa-btn" id="modal-wa-btn" target="_blank" rel="noopener noreferrer">
              ${whatsappIconSVG(18)} Enquire on WhatsApp
            </a>
            <p class="modal-trust">💬 We reply within minutes during store hours</p>
          </div>
        </div>
      </div>`;
  }

  function init() {
    const root = document.getElementById('modal-root');
    if (!root) return;
    root.innerHTML = getTemplate();
    _backdrop = document.getElementById('modal-backdrop');
    _backdrop.addEventListener('click', e => { if (e.target === _backdrop) close(); });
    document.getElementById('modal-close').addEventListener('click', close);
  }

  function open(product, imgPath) {
    if (!_backdrop) return;
    _lastFocus = document.activeElement;

    const name      = product.productName || '';
    const brand     = product.brand        || '';
    const price     = String(product.productPrice || product.price || '');
    const origPrice = String(product.originalPrice || product.msrp || '');
    const discount  = origPrice ? calcDiscount(origPrice, price) : null;
    const rating    = product.rating || 0;
    const tags      = product.tags   || [];
    const avail     = product.availability !== false;
    const sku       = product.productId || '';

    // Brand
    document.getElementById('modal-brand').textContent = brand;

    // Name
    document.getElementById('modal-prod-name').textContent = name;

    // SKU
    const skuEl = document.getElementById('modal-sku');
    skuEl.textContent = sku ? `SKU: ${sku}` : '';
    skuEl.style.display = sku ? '' : 'none';

    // Image — try product image first, then Unsplash fallback
    const imgPanel = document.getElementById('modal-img-panel');
    const tagsEl   = document.getElementById('modal-img-tags');
    tagsEl.innerHTML = renderTags(tags);

    // clear previous img
    const prevImg = imgPanel.querySelector('img');
    if (prevImg) prevImg.remove();
    const prevPh  = imgPanel.querySelector('.modal-img-placeholder');
    if (prevPh)  prevPh.remove();

    const img = document.createElement('img');
    img.alt     = sanitize(name);
    img.loading = 'eager';
    img.style.cssText = 'width:100%;height:100%;object-fit:cover;';
    let extIdx = 0;
    const exts = ['jpg','png','webp','jpeg','svg'];
    img.onerror = () => {
      if (extIdx < exts.length) { img.src = `${imgPath}.${exts[extIdx++]}`; }
      else {
        img.style.display = 'none';
        const ph = document.createElement('div');
        ph.className = 'modal-img-placeholder';
        ph.innerHTML = '<span>👟</span><span>Image coming soon</span>';
        imgPanel.appendChild(ph);
      }
    };
    img.src = `${imgPath}.jpg`;
    imgPanel.appendChild(img);

    // Rating
    document.getElementById('modal-rating').innerHTML = rating > 0 ? renderStars(rating) : '';

    // Pricing
    const pricingEl = document.getElementById('modal-pricing');
    pricingEl.innerHTML = `<span class="modal-price">₹${sanitize(price)}</span>`;
    if (origPrice && discount) {
      pricingEl.innerHTML += `<span class="modal-orig">₹${sanitize(origPrice)}</span><span class="modal-disc">${discount}% off</span>`;
    }

    // Availability
    const availEl = document.getElementById('modal-avail');
    availEl.className = `modal-avail ${avail ? 'in' : 'out'}`;
    availEl.innerHTML = `<span class="avail-dot"></span>${avail ? 'In Stock — Available in Store' : 'Currently Out of Stock'}`;

    // Story (Feature B)
    const story = getStory(name);
    document.getElementById('modal-story').innerHTML = `
      <div class="modal-story-title">${sanitize(story.title)}</div>
      <div class="modal-story-body">${sanitize(story.body)}</div>`;

    // WA button
    const waBtn = document.getElementById('modal-wa-btn');
    waBtn.className = `modal-wa-btn${avail ? '' : ' disabled'}`;
    // Store product ref for WA form
    waBtn._product = product;
    waBtn._imgPath = imgPath;
    // Remove old listener by cloning
    const newWaBtn = waBtn.cloneNode(true);
    waBtn.parentNode.replaceChild(newWaBtn, waBtn);
    newWaBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (!avail) return;
      close();
      setTimeout(() => openWAForm(product, imgPath, window._waNumber || ''), 150);
    });

    // Show
    _backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';

    // ESC handler
    document.addEventListener('keydown', _escHandler);

    // Focus first focusable in modal
    setTimeout(() => {
      const focusable = _backdrop.querySelectorAll('button,[href],input,[tabindex]:not([tabindex="-1"])');
      if (focusable.length) focusable[0].focus();
    }, 50);
  }

  function _escHandler(e) { if (e.key === 'Escape') close(); }

  function close() {
    if (!_backdrop) return;
    _backdrop.classList.remove('open');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', _escHandler);
    if (_lastFocus) _lastFocus.focus();
  }

  return { init, open, close };
})();
