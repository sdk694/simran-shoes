const CampaignComponent = (() => {

  const STORIES = [
    {
      eyebrow: 'Everyday Comfort',
      title: 'Made for the City',
      body: 'Shoes engineered for long walks, local bazaars, and everything in between.',
      img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&q=75&auto=format&fit=crop',
      cta: 'Shop Shoes', target: '#categories',
      class: '',
    },
    {
      eyebrow: 'Summer Essentials',
      title: 'Open Toe Freedom',
      body: 'Breathable sandals and chappals for the heat of Jabalpur summers.',
      img: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=900&q=75&auto=format&fit=crop',
      cta: 'Shop Sandals', target: '#categories',
      class: '',
    },
    {
      eyebrow: 'Heritage Craft',
      title: 'Traditional Roots, Modern Soul',
      body: 'Authentic traditional footwear honoring craft and culture — from Jabalpur to every occasion.',
      img: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=1200&q=75&auto=format&fit=crop',
      cta: 'Discover', target: '#categories',
      class: 'wide',
    },
    {
      eyebrow: 'Premium Collection',
      title: 'Walk with Confidence',
      body: 'Premium-quality formal and casual footwear for every step in life.',
      img: 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=900&q=75&auto=format&fit=crop',
      cta: 'Shop Now', target: '#categories',
      class: '',
    },
    {
      eyebrow: 'Monsoon Ready',
      title: 'Rain or Shine',
      body: 'Waterproof gumboots and rain footwear to keep you stepping through the monsoon.',
      img: 'https://images.unsplash.com/photo-1589363349959-15c3e7bcf5f4?w=900&q=75&auto=format&fit=crop',
      cta: 'Shop Rainwear', target: '#categories',
      class: '',
    },
  ];

  function renderStory(s) {
    return `
      <div class="story-block ${sanitize(s.class || '')}" role="article">
        <img class="story-img" src="${sanitize(s.img)}" alt="${sanitize(s.title)}" loading="lazy"
          onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" />
        <div class="story-placeholder" style="display:none;">🛍️</div>
        <div class="story-overlay" aria-hidden="true"></div>
        <div class="story-content">
          <div class="story-eyebrow">${sanitize(s.eyebrow)}</div>
          <div class="story-title">${sanitize(s.title)}</div>
          <div class="story-body">${sanitize(s.body)}</div>
          <a href="${sanitize(s.target || '#')}" class="story-cta">
            ${sanitize(s.cta || 'Explore')}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
      </div>`;
  }

  function getTemplate(data) {
    const stories = data?.campaigns
      ? data.campaigns.flatMap(c => c.sections || []).map(s => ({
          eyebrow: s.eyebrow || 'Collection', title: s.title || '', body: s.copy || '',
          img: s.image || STORIES[0].img, cta: s.cta || 'Explore', target: s.target || '#categories', class: s.class || '',
        }))
      : STORIES;

    const displayStories = stories.length ? stories : STORIES;

    return `
      <section class="campaign-section section reveal" id="campaign" aria-label="Collections">
        <div class="container">
          <div class="section-header center">
            <span class="section-eyebrow">Collections</span>
            <h2 class="section-title">Shop Our <span class="accent">Stories</span></h2>
            <p class="section-sub">Every pair has a story. Find yours.</p>
          </div>
        </div>
        <div class="campaign-stories">
          <div class="stories-grid">
            ${displayStories.map(s => renderStory(s)).join('')}
          </div>
        </div>
        <div class="campaign-cta-band">
          <p class="band-title">New Arrivals Every Week</p>
          <div class="band-actions">
            <a href="#categories" class="btn btn-outline btn-lg">Browse All Products</a>
            <a href="#flashsale"  class="btn btn-gold btn-lg">⚡ Flash Sale</a>
          </div>
        </div>
      </section>`;
  }

  function init(data) {
    const root = document.getElementById('campaign-root');
    if (!root) return;
    root.innerHTML = getTemplate(data);
  }
  return { init };
})();
