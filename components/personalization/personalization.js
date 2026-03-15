/**
 * PERSONALIZATION COMPONENT v5 (PRD Feature C)
 * - "Trending in Jabalpur" from popularityScore
 * - "Because you viewed…" from localStorage recentViews
 * No server required — deterministic client signals only
 */
const PersonalizationComponent = (() => {
  let _allProducts = [];
  let _activeTab = 'trending';

  function buildIndex(catData) {
    const out = [];
    if (!catData) return out;
    Object.entries(catData).forEach(([cat, items]) => {
      if (!items || typeof items !== 'object') return;
      Object.values(items).forEach(p => {
        if (p?.productName) out.push({ ...p, _cat: cat, _imgBase: `assets/categories/${cat}/` });
      });
    });
    return out;
  }

  function getTrending() {
    return [..._allProducts]
      .filter(p => p.popularityScore)
      .sort((a, b) => (b.popularityScore || 0) - (a.popularityScore || 0))
      .slice(0, 10);
  }

  function getForYou() {
    const views = getRecentViews(); // from utils.js
    if (!views.length) return getTrending().slice(0, 8);
    // Boost recently-viewed brands + high popularity
    const viewedBrands = new Set(
      _allProducts.filter(p => views.includes(p.productId)).map(p => p.brand).filter(Boolean)
    );
    return [..._allProducts]
      .map(p => ({
        ...p,
        _score: (p.popularityScore || 0)
          + (views.includes(p.productId) ? 30 : 0)
          + (viewedBrands.has(p.brand) ? 15 : 0),
      }))
      .sort((a, b) => b._score - a._score)
      .slice(0, 10);
  }

  function getShell() {
    const recentViews = getRecentViews();
    const reason = recentViews.length
      ? `Because you've been browsing`
      : `Trending in Jabalpur`;
    return `
      <section class="section personalization-section reveal" id="personalization" aria-label="Personalised picks">
        <div class="container">
          <div class="shelf-header">
            <div>
              <span class="section-eyebrow">Curated For You</span>
              <h2 class="section-title">Your <span class="accent">Picks</span></h2>
            </div>
            <a href="#categories" class="shelf-view-all">
              View All
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          </div>
          <div class="shelf-tabs">
            <button class="shelf-tab active" data-tab="trending">🔥 Trending in Jabalpur</button>
            <button class="shelf-tab" data-tab="foryou">✨ For You</button>
          </div>
          <div class="shelf-reason" id="shelf-reason">
            <span class="shelf-reason-dot"></span>
            <span id="shelf-reason-text">${sanitize(reason)}</span>
          </div>
          <div class="shelf-scroll-wrap">
            <div class="shelf-track products-grid" id="shelf-track" role="list" style="grid-template-columns:none;display:flex;"></div>
          </div>
        </div>
      </section>`;
  }

  function renderShelf(tab) {
    _activeTab = tab;
    const track = document.getElementById('shelf-track');
    const reasonEl = document.getElementById('shelf-reason-text');
    if (!track) return;
    track.innerHTML = '';

    const products = tab === 'trending' ? getTrending() : getForYou();
    if (reasonEl) {
      reasonEl.textContent = tab === 'trending'
        ? 'Trending in Jabalpur'
        : (getRecentViews().length ? 'Based on your recent browsing' : 'Most popular picks for you');
    }

    const waNum = window._waNumber || '';
    products.forEach(p => {
      const card = buildProductCard(p, p._imgBase, waNum, {
        onQuickView: (prod, imgPath) => ModalComponent.open(prod, imgPath),
        campaignId: `shelf-${tab}`,
      });
      card.style.width = '210px';
      card.style.flexShrink = '0';
      track.appendChild(card);
    });
  }

  function bindEvents() {
    document.querySelectorAll('.shelf-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.shelf-tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderShelf(btn.dataset.tab);
      });
    });
  }

  function init(catData) {
    const root = document.getElementById('personalization-root');
    if (!root || !catData) return;
    _allProducts = buildIndex(catData);
    if (!_allProducts.length) return;
    root.innerHTML = getShell();
    renderShelf('trending');
    bindEvents();
  }

  return { init };
})();
