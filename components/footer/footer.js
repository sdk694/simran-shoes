const FooterComponent = (() => {
  function getTemplate(data) {
    const name    = sanitize(data?.name          || 'Simran Shoes');
    const desc    = sanitize(data?.description   || 'Jabalpur\'s most trusted footwear store since 2005.');
    const address = sanitize(data?.address       || 'Napier Town, Jabalpur, MP — 482001');
    const insta   = sanitize(data?.instagram     || '#');
    const maps    = sanitize(data?.googleMapsLink || '#');
    const waNum   = sanitize(data?.whatsappNumber || '9340970624');
    const hours   = sanitize(data?.storeHours    || 'Mon–Sat: 9:30 AM – 9:00 PM · Sun: 10:00 AM – 8:00 PM');
    const year    = new Date().getFullYear();
    const waHref  = waNum ? `https://wa.me/${waNum}` : '#';

    return `
      <footer class="footer" id="footer" role="contentinfo">
        <div class="footer-top">
          <div class="container footer-grid">

            <!-- Brand -->
            <div class="footer-brand">
              <div class="footer-logo">
                <img src="assets/logo.png" alt="${name}" class="footer-logo-img" id="ft-logo"
                  onerror="this.style.display='none';document.getElementById('ft-logo-fb').style.display='flex';" />
                <div class="footer-logo-fallback" id="ft-logo-fb" style="display:none;">SS</div>
                <div>
                  <div class="footer-brand-name">${name}</div>
                  <div class="footer-brand-since">Est. 2005</div>
                </div>
              </div>
              <p class="footer-desc">${desc}</p>
              <div class="footer-trust">
                <span class="trust-icon">🏆</span>
                <div>
                  <div class="trust-title">Trusted in Jabalpur</div>
                  <div class="trust-sub">21+ Years · 5,000+ Happy Customers</div>
                </div>
              </div>
            </div>

            <!-- Quick Links -->
            <div>
              <h3 class="footer-col-title">Quick Links</h3>
              <div class="footer-links">
                <a href="#campaign"     class="footer-link">Collections</a>
                <a href="#flashsale"    class="footer-link">⚡ Flash Sale</a>
                <a href="#categories"   class="footer-link">Shop All</a>
                <a href="#about"        class="footer-link">Our Story</a>
                <a href="#testimonials" class="footer-link">Customer Reviews</a>
              </div>
            </div>

            <!-- Contact -->
            <div>
              <h3 class="footer-col-title">Visit Us</h3>
              <div class="footer-contact-items">
                <div class="footer-contact-item">
                  <span class="icon">📍</span>
                  <span>${address}</span>
                </div>
                ${maps !== '#' ? `<div class="footer-contact-item">
                  <span class="icon">🗺️</span>
                  <span><a href="${maps}" target="_blank" rel="noopener noreferrer">View on Google Maps →</a></span>
                </div>` : ''}
                ${waNum ? `<div class="footer-contact-item">
                  <span class="icon">💬</span>
                  <span><a href="${waHref}" target="_blank" rel="noopener noreferrer">WhatsApp: +${waNum}</a></span>
                </div>` : ''}
                ${insta !== '#' ? `<div class="footer-contact-item">
                  <span class="icon">📸</span>
                  <span><a href="${insta}" target="_blank" rel="noopener noreferrer">Follow on Instagram</a></span>
                </div>` : ''}
              </div>
              <div class="footer-hours">
                <div class="footer-hours-title">Store Hours</div>
                <div class="footer-hours-text">${hours}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom bar -->
        <div class="footer-bottom">
          <div class="container footer-bottom-inner">
            <p class="footer-copy">© ${year} ${name}, Jabalpur. All rights reserved.</p>
            <div class="footer-socials">
              ${waNum ? `<a href="${waHref}" target="_blank" rel="noopener noreferrer" class="footer-social" aria-label="WhatsApp">
                ${whatsappIconSVG(16)}
              </a>` : ''}
              ${insta !== '#' ? `<a href="${insta}" target="_blank" rel="noopener noreferrer" class="footer-social" aria-label="Instagram">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>` : ''}
              <a href="${maps}" target="_blank" rel="noopener noreferrer" class="footer-social" aria-label="Google Maps">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>`;
  }

  function init(data) {
    const root = document.getElementById('footer-root');
    if (!root) return;
    root.innerHTML = getTemplate(data || {});
  }
  return { init };
})();
