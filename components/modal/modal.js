/**
 * MODAL COMPONENT — Quick View
 * Singleton modal with focus trap, ESC key, accessibility
 */

const ModalComponent = (() => {
  let _backdrop   = null;
  let _lastFocus  = null;
  let _escHandler = null;

  // All focusable selectors inside modal
  const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

  function getTemplate() {
    return `
      <div class="modal-backdrop" id="modal-backdrop" role="dialog"
           aria-modal="true" aria-labelledby="modal-product-name">
        <div class="modal-box" id="modal-box">
          <button class="modal-close" id="modal-close" aria-label="Close quick view">✕</button>

          <div class="modal-image-panel" id="modal-image-panel">
            <div class="modal-tags" id="modal-tags"></div>
          </div>

          <div class="modal-details-panel">
            <p class="modal-brand"    id="modal-brand"></p>
            <h2 class="modal-name"   id="modal-product-name"></h2>
            <div class="modal-rating" id="modal-rating"></div>
            <div class="modal-pricing" id="modal-pricing"></div>
            <div class="modal-availability" id="modal-availability"></div>
            <hr class="modal-divider" />
            <a class="modal-wa-btn" id="modal-wa-btn" target="_blank"
               rel="noopener noreferrer">
              ${whatsappIconSVG(20)} Enquire on WhatsApp
            </a>
            <p class="modal-trust">💬 We'll reply within minutes during store hours</p>
          </div>
        </div>
      </div>`;
  }

  function init() {
    const root = document.getElementById('modal-root');
    if (!root) return;
    root.innerHTML = getTemplate();
    _backdrop = document.getElementById('modal-backdrop');

    // Close on backdrop click
    _backdrop.addEventListener('click', (e) => {
      if (e.target === _backdrop) close();
    });

    // Close button
    document.getElementById('modal-close').addEventListener('click', close);
  }

  function open(product, imgPath) {
    if (!_backdrop) return;
    _lastFocus = document.activeElement;

    const name      = product.productName || '';
    const brand     = product.brand       || '';
    const price     = String(product.productPrice || product.price || '');
    const origPrice = String(product.originalPrice || '');
    const discount  = origPrice ? calcDiscount(origPrice, price) : null;
    const rating    = product.rating      || 0;
    const tags      = product.tags        || [];
    const avail     = product.availability !== false;

    // Brand
    document.getElementById('modal-brand').textContent = brand;

    // Name
    document.getElementById('modal-product-name').textContent = name;

    // Rating
    const ratingEl = document.getElementById('modal-rating');
    ratingEl.innerHTML = rating > 0
      ? renderStars(rating, true)
      : '<span style="color:var(--clr-text-light);font-size:0.8rem;">No ratings yet</span>';

    // Pricing
    const pricingEl = document.getElementById('modal-pricing');
    pricingEl.innerHTML = `<span class="modal-price">₹${sanitize(price)}</span>`;
    if (origPrice && discount) {
      pricingEl.innerHTML += `
        <span class="modal-original-price">₹${sanitize(origPrice)}</span>
        <span class="modal-discount">${discount}% off</span>`;
    }

    // Availability
    const availEl = document.getElementById('modal-availability');
    availEl.className = `modal-availability ${avail ? 'in-stock' : 'out-stock'}`;
    availEl.innerHTML = `<span class="avail-dot"></span>${avail ? 'In Stock' : 'Out of Stock'}`;

    // Tags
    const tagsEl = document.getElementById('modal-tags');
    tagsEl.innerHTML = renderTags(tags);

    // Image
    const imagePanel = document.getElementById('modal-image-panel');
    // Remove old image if present
    const oldImg = imagePanel.querySelector('img, .modal-image-placeholder');
    if (oldImg) oldImg.remove();

    const img = loadProductImage(imgPath, name, () => {
      const placeholder = document.createElement('div');
      placeholder.className = 'modal-image-placeholder';
      placeholder.innerHTML = '<span>👟</span><span>Image coming soon</span>';
      imagePanel.insertBefore(placeholder, imagePanel.firstChild);
    });
    imagePanel.insertBefore(img, imagePanel.firstChild);

    // WhatsApp CTA
    const waBtn = document.getElementById('modal-wa-btn');
    waBtn.href = whatsappURL(window._waNumber, name, price);
    waBtn.className = `modal-wa-btn${avail ? '' : ' disabled'}`;

    // Show
    _backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Focus trap — focus first focusable element
    requestAnimationFrame(() => {
      const focusable = _backdrop.querySelectorAll(FOCUSABLE);
      if (focusable.length) focusable[0].focus();
    });

    // ESC to close
    _escHandler = (e) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', _escHandler);

    // Tab focus trap
    _backdrop.addEventListener('keydown', trapFocus);
  }

  function trapFocus(e) {
    if (e.key !== 'Tab') return;
    const focusable = Array.from(_backdrop.querySelectorAll(FOCUSABLE));
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
    }
  }

  function close() {
    if (!_backdrop) return;
    _backdrop.classList.remove('open');
    document.body.style.overflow = '';
    if (_escHandler) document.removeEventListener('keydown', _escHandler);
    _backdrop.removeEventListener('keydown', trapFocus);
    if (_lastFocus) _lastFocus.focus();
  }

  return { init, open, close };
})();
