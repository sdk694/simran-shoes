/**
 * ABOUT COMPONENT
 * Renders store identity: logo, description, address, social links
 */

const AboutComponent = (() => {

  function getTemplate(data) {
    const name      = sanitize(data?.name          || 'Simran Shoes');
    const tagline   = sanitize(data?.tagline        || '');
    const desc      = sanitize(data?.description    || '');
    const address   = sanitize(data?.address        || '');
    const years     = sanitize(data?.yearsOfLegacy  || '21+');
    const instaHref = sanitize(data?.instagram      || '#');
    const waNum     = sanitize(data?.whatsappNumber || '');
    const waHref    = waNum ? `https://wa.me/${waNum}` : '#';

    return `
      <section class="section about-section" id="about" aria-label="About ${name}">
        <div class="container">
          <div class="about-grid">

            <div class="about-left">
              <div class="about-logo-block">
                <div class="about-logo-wrapper">
                  <div class="about-logo-ring" aria-hidden="true"></div>
                  <div class="about-logo-circle">
                    <img
                      src="assets/logo.png"
                      alt="${name} Logo"
                      class="about-logo-img"
                      id="about-logo-img"
                      onerror="this.style.display='none'; document.getElementById('about-logo-fallback').style.display='flex';"
                    />
                    <span class="about-logo-fallback" id="about-logo-fallback" style="display:none;">SS</span>
                  </div>
                </div>
                <div class="about-stats">
                  <div class="stat-item">
                    <span class="stat-num">${years}</span>
                    <span class="stat-label">Years of Trust</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-num">5000+</span>
                    <span class="stat-label">Happy Customers</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-num">500+</span>
                    <span class="stat-label">Products</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="about-right">
              <div class="section-label">Our Story</div>
              <h2 class="section-title">${name}</h2>
              <p class="about-tagline-text">${tagline}</p>
              <p class="about-desc">${desc}</p>
              <div class="about-address-block">
                <div class="addr-icon" aria-hidden="true">📍</div>
                <p class="about-address">${address}</p>
              </div>
              <div class="about-links">
                <a href="${instaHref}" target="_blank" rel="noopener noreferrer"
                   class="social-btn instagram-btn" aria-label="Follow us on Instagram">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                  Instagram
                </a>
                <a href="${waHref}" target="_blank" rel="noopener noreferrer"
                   class="social-btn whatsapp-btn" aria-label="Contact us on WhatsApp">
                  ${whatsappIconSVG(20)}
                  WhatsApp Us
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>`;
  }

  function init(data) {
    const root = document.getElementById('about-root');
    if (!root) return;

    // Set global WA number HERE before flash/categories render
    window._waNumber = sanitize(data?.whatsappNumber || '');

    root.innerHTML = getTemplate(data);
  }

  return { init };
})();
