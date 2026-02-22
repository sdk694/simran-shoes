/**
 * FOOTER COMPONENT
 * Renders store footer with address, social links, maps & copyright
 */

const FooterComponent = (() => {

  function getTemplate(data) {
    const name      = sanitize(data?.name          || 'Simran Shoes');
    const desc      = sanitize(data?.description    || '');
    const address   = sanitize(data?.address        || '');
    const instaHref = sanitize(data?.instagram      || '#');
    const mapsHref  = sanitize(data?.googleMapsLink || '#');
    const waNum     = sanitize(data?.whatsappNumber  || '');
    const waHref    = waNum ? `https://wa.me/${waNum}` : '#';
    const year      = new Date().getFullYear();

    return `
      <footer class="footer" id="footer" role="contentinfo">
        <div class="footer-top">
          <div class="container footer-grid">

            <div class="footer-brand">
              <div class="footer-logo">
                <img
                  src="assets/logo.png"
                  alt="${name} Logo"
                  class="footer-logo-img"
                  id="footer-logo-img"
                  onerror="this.style.display='none'; document.getElementById('footer-logo-fallback').style.display='flex';"
                />
                <div class="footer-logo-fallback" id="footer-logo-fallback" style="display:none;">SS</div>
                <div>
                  <p class="footer-brand-name">${name}</p>
                  <p class="footer-brand-since">Established 2005</p>
                </div>
              </div>
              <p class="footer-desc">${desc}</p>
            </div>

            <div class="footer-contact">
              <h3 class="footer-heading">Find Us</h3>
              <p class="footer-address">${address}</p>
              <a href="${mapsHref}" target="_blank" rel="noopener noreferrer" class="maps-link">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                View on Google Maps
              </a>
            </div>

            <div class="footer-social-col">
              <h3 class="footer-heading">Connect With Us</h3>
              <div class="footer-socials">
                <a href="${instaHref}" target="_blank" rel="noopener noreferrer"
                   class="footer-social-link" aria-label="Instagram">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                  Instagram
                </a>
                <a href="${waHref}" target="_blank" rel="noopener noreferrer"
                   class="footer-social-link" aria-label="WhatsApp">
                  ${whatsappIconSVG(22)}
                  WhatsApp
                </a>
              </div>
            </div>

          </div>
        </div>
        <div class="footer-bottom">
          <div class="container">
            <p class="footer-copy">
              © ${year} ${name}, Jabalpur. All rights reserved. | Built with ❤️ for Jabalpur
            </p>
          </div>
        </div>
      </footer>`;
  }

  function init(data) {
    const root = document.getElementById('footer-root');
    if (!root) return;
    root.innerHTML = getTemplate(data);
  }

  return { init };
})();
