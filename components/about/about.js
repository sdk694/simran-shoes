const AboutComponent = (() => {
  function getTemplate(data) {
    const name    = sanitize(data?.name           || 'Simran Shoes');
    const tagline = sanitize(data?.tagline        || "Jabalpur's most loved footwear store");
    const desc    = sanitize(data?.description    || 'Serving Jabalpur since 2005 with the finest footwear for every occasion, every family, every budget.');
    const address = sanitize(data?.address        || 'Napier Town, Jabalpur, Madhya Pradesh — 482001');
    const insta   = sanitize(data?.instagram      || '#');
    const maps    = sanitize(data?.googleMapsLink || 'https://maps.google.com/?q=Jabalpur');
    const waNum   = sanitize(data?.whatsappNumber || '9340970624');
    const hours   = sanitize(data?.storeHours     || 'Mon–Sat: 9:30 AM – 9:00 PM · Sun: 10:00 AM – 8:00 PM');

    // set global WA number for other components
    if (waNum) window._waNumber = waNum;

    const waHref = waNum ? `https://wa.me/${waNum}?text=${encodeURIComponent("Hi! I'd like to visit Simran Shoes, Jabalpur.")}` : '#';

    return `
      <section class="section about-section reveal" id="about" aria-label="About Simran Shoes">
        <div class="container">
          <div class="about-grid">

            <!-- Visual block -->
            <div class="about-visual">
              <div class="about-hero-img">
                <img
                  src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=800&q=80&auto=format&fit=crop"
                  alt="Inside Simran Shoes store, Jabalpur"
                  loading="lazy"
                  onerror="this.src='https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80'"
                />
                <div class="about-img-overlay" aria-hidden="true"></div>
              </div>
              <div class="about-stat-float" aria-hidden="true">
                <div class="stat-big">21<em style="color:var(--clr-gold);font-style:normal;">+</em></div>
                <div class="stat-lbl">Years of Trust</div>
              </div>
              <div class="about-est-badge" aria-hidden="true">
                <span class="est-yr">2005</span>
                <span class="est-lbl">Est.</span>
              </div>
            </div>

            <!-- Text block -->
            <div class="about-right">
              <div>
                <span class="section-eyebrow">Our Story</span>
                <h2 class="section-title">${name}<br><span class="accent">Since 2005</span></h2>
              </div>
              <p class="about-tagline">${tagline}</p>
              <p class="about-desc">${desc}</p>

              <!-- Stats -->
              <div class="about-stats">
                <div class="about-stat">
                  <div class="about-stat-num">21<em>+</em></div>
                  <div class="about-stat-label">Years</div>
                </div>
                <div class="about-stat">
                  <div class="about-stat-num">5K<em>+</em></div>
                  <div class="about-stat-label">Customers</div>
                </div>
                <div class="about-stat">
                  <div class="about-stat-num">500<em>+</em></div>
                  <div class="about-stat-label">SKUs</div>
                </div>
              </div>

              <!-- Hours -->
              <div class="hours-badge">
                <span class="hours-dot"></span>
                ${hours}
              </div>

              <!-- Address -->
              <div class="about-address-block">
                <span class="addr-icon">📍</span>
                <div class="about-address">
                  <strong>${name}</strong><br>${address}
                </div>
              </div>

              <!-- CTAs -->
              <div class="about-links">
                <a href="${waHref}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp">
                  ${whatsappIconSVG(16)} Chat on WhatsApp
                </a>
                <a href="${maps}" target="_blank" rel="noopener noreferrer" class="btn btn-outline">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  Get Directions
                </a>
                ${insta !== '#' ? `<a href="${insta}" target="_blank" rel="noopener noreferrer" class="btn btn-gold">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                  Instagram
                </a>` : ''}
              </div>
            </div>
          </div>
        </div>
      </section>`;
  }

  function init(data) {
    const root = document.getElementById('about-root');
    if (!root) return;
    // Set waNumber early even if data is null
    if (data?.whatsappNumber) window._waNumber = data.whatsappNumber;
    root.innerHTML = getTemplate(data || {});
  }
  return { init };
})();
