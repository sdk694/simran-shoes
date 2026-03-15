const HeroComponent = (() => {
  // Indian footwear & retail store images — no Nike/Adidas branding
  const FALLBACK = [
    {
      campaignId: 'camp-main', label: 'New Arrivals — 2025',
      line1: 'Walk', line2: 'With', line3: 'Confidence.',
      sub: "Jabalpur's most loved footwear store. 21+ years of trust, comfort and style.",
      img: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=1600&q=80&auto=format&fit=crop',
      ctaPrimary: { label: 'Shop Collection', target: '#categories' },
      ctaSecondary: { label: 'Flash Sale', target: '#flashsale' },
    },
    {
      campaignId: 'camp-summer', label: 'Summer Collection',
      line1: 'Born', line2: 'For The', line3: 'Streets.',
      sub: "Sandals, chappals and open-toe comfort — made for MP summers.",
      img: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=1600&q=80&auto=format&fit=crop',
      ctaPrimary: { label: 'Shop Sandals', target: '#categories' },
      ctaSecondary: { label: 'View All', target: '#categories' },
    },
    {
      campaignId: 'camp-tradition', label: 'Traditional Footwear',
      line1: 'Roots', line2: '&', line3: 'Routes.',
      sub: "Authentic traditional footwear for every occasion — puja to pandal.",
      img: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1600&q=80&auto=format&fit=crop',
      ctaPrimary: { label: 'Shop Traditional', target: '#categories' },
      ctaSecondary: { label: 'Our Story', target: '#about' },
    },
  ];

  let _campaigns = [], _idx = 0, _timer = null;

  function buildCampaigns(data) {
    if (data?.campaigns?.length) {
      return data.campaigns.map((c, i) => ({
        ...FALLBACK[i % FALLBACK.length], ...c,
        img: c.heroImage || FALLBACK[i % FALLBACK.length].img,
      }));
    }
    return FALLBACK;
  }

  function getShell() {
    return `
      <section class="hero" id="home" aria-label="Hero campaign">
        <div class="hero-img-bg" id="hero-img-bg"><img id="hero-bg-img" src="" alt="" aria-hidden="true" /></div>
        <div class="hero-overlay" aria-hidden="true"></div>
        <div class="hero-accent-bar" aria-hidden="true"></div>
        <div class="hero-content" id="hero-content"></div>
        <div class="hero-scroll" aria-hidden="true"><span>Scroll</span><div class="hero-scroll-line"></div></div>
        <div class="hero-dots" id="hero-dots" aria-hidden="true"></div>
      </section>`;
  }

  function renderCampaign(c) {
    const bgImg = document.getElementById('hero-bg-img');
    if (bgImg) bgImg.src = c.img;
    const content = document.getElementById('hero-content');
    if (!content) return;
    content.innerHTML = `
      <div class="hero-campaign-label">${sanitize(c.label || '')}</div>
      <h1 class="hero-headline">
        <span class="red">${sanitize(c.line1)}</span>
        ${c.line2 ? ` <span class="outline">${sanitize(c.line2)}</span>` : ''}
        ${c.line3 ? `<br><span>${sanitize(c.line3)}</span>` : ''}
      </h1>
      ${c.sub ? `<p class="hero-sub">${sanitize(c.sub)}</p>` : ''}
      <div class="hero-cta-group">
        ${c.ctaPrimary?.label  ? `<a href="${sanitize(c.ctaPrimary.target  || '#')}" class="btn btn-primary btn-lg">${sanitize(c.ctaPrimary.label)}</a>` : ''}
        ${c.ctaSecondary?.label ? `<a href="${sanitize(c.ctaSecondary.target || '#')}" class="btn btn-outline btn-lg" style="border-color:rgba(255,255,255,0.5);color:#fff;">${sanitize(c.ctaSecondary.label)}</a>` : ''}
      </div>
      <div class="hero-stats">
        <div><div class="hero-stat-num">21<em>+</em></div><div class="hero-stat-label">Years Trusted</div></div>
        <div><div class="hero-stat-num">5K<em>+</em></div><div class="hero-stat-label">Happy Customers</div></div>
        <div><div class="hero-stat-num">500<em>+</em></div><div class="hero-stat-label">SKUs In Store</div></div>
      </div>`;
  }

  function renderDots() {
    const el = document.getElementById('hero-dots');
    if (!el || _campaigns.length <= 1) return;
    el.innerHTML = _campaigns.map((_, i) =>
      `<button class="hero-dot${i === _idx ? ' active' : ''}" data-i="${i}" aria-label="Campaign ${i+1}"></button>`
    ).join('');
    el.querySelectorAll('.hero-dot').forEach(b => b.addEventListener('click', () => { goTo(+b.dataset.i); stopAuto(); }));
  }

  function goTo(i) { _idx = (i + _campaigns.length) % _campaigns.length; renderCampaign(_campaigns[_idx]); renderDots(); }
  function startAuto() { if (_campaigns.length <= 1) return; _timer = setInterval(() => goTo(_idx + 1), 6500); }
  function stopAuto() { clearInterval(_timer); }

  function init(data) {
    const root = document.getElementById('hero-root');
    if (!root) return;
    root.innerHTML = getShell();
    _campaigns = buildCampaigns(data);
    renderCampaign(_campaigns[0]);
    if (_campaigns.length > 1) { renderDots(); startAuto(); }
  }
  return { init };
})();
