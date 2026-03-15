const CategoriesComponent = (() => {
  let _catData = {}, _currentCat = '', _currentProducts = [], _brandFilter = 'all', _sortBy = 'default';

  function getShell() {
    return `
      <section class="section categories-section reveal" id="categories" aria-label="Product categories">
        <div class="container">
          <div class="section-header">
            <span class="section-eyebrow">The Full Range</span>
            <h2 class="section-title">Shop Our <span class="gold">Collection</span></h2>
            <p class="section-sub">From everyday comfort to special occasions — find your perfect pair.</p>
          </div>
          <div class="tabs-scroll" role="tablist" aria-label="Product categories"><div class="tabs" id="cat-tabs"></div></div>
          <div class="cat-controls">
            <div class="cat-search-wrap">
              <span class="cat-search-icon">🔍</span>
              <input type="search" class="cat-search" id="cat-search" placeholder="Search in this category…" aria-label="Search products" />
            </div>
            <div class="sort-wrap">
              <select class="sort-select" id="cat-sort" aria-label="Sort products">
                <option value="default">Featured</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
                <option value="rating">Best Rated</option>
                <option value="popularity">Most Popular</option>
              </select>
              <span class="sort-chevron">▼</span>
            </div>
          </div>
          <div class="filter-bar" id="cat-filters" aria-label="Filter by brand"></div>
          <p class="cat-count" id="cat-count"></p>
          <div class="products-grid" id="cat-grid" role="list"></div>
        </div>
      </section>`;
  }

  function buildTabs(cats) {
    const tabsEl = document.getElementById('cat-tabs');
    if (!tabsEl) return;
    tabsEl.innerHTML = cats.map((c, i) => `
      <button class="tab-btn${i === 0 ? ' active' : ''}" role="tab"
        aria-selected="${i === 0}" data-cat="${sanitize(c)}">${sanitize(c)}</button>
    `).join('');
    tabsEl.querySelectorAll('.tab-btn').forEach(b => b.addEventListener('click', () => switchCat(b.dataset.cat)));
  }

  function switchCat(cat) {
    _currentCat = cat;
    _brandFilter = 'all';
    _sortBy = document.getElementById('cat-sort')?.value || 'default';
    document.getElementById('cat-search').value = '';
    document.querySelectorAll('.tab-btn').forEach(b => {
      const active = b.dataset.cat === cat;
      b.classList.toggle('active', active);
      b.setAttribute('aria-selected', String(active));
    });
    const items = _catData[cat] || {};
    _currentProducts = Object.values(items);
    buildFilters();
    renderGrid(_currentProducts);
  }

  function buildFilters() {
    const brands = [...new Set(_currentProducts.map(p => p.brand).filter(Boolean))];
    const bar = document.getElementById('cat-filters');
    if (!bar) return;
    if (!brands.length) { bar.style.display = 'none'; return; }
    bar.style.display = 'flex';
    bar.innerHTML = `
      <span class="filter-label">Brand</span>
      <div class="filter-chips">
        <button class="filter-chip active" data-brand="all">All</button>
        ${brands.map(b => `<button class="filter-chip" data-brand="${sanitize(b)}">${sanitize(b)}</button>`).join('')}
      </div>`;
    bar.querySelectorAll('.filter-chip').forEach(c => c.addEventListener('click', () => {
      _brandFilter = c.dataset.brand;
      bar.querySelectorAll('.filter-chip').forEach(x => x.classList.toggle('active', x.dataset.brand === _brandFilter));
      applyFilters();
    }));
  }

  function applyFilters(search = '') {
    let list = [..._currentProducts];
    if (_brandFilter !== 'all') list = list.filter(p => p.brand === _brandFilter);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p => (p.productName || '').toLowerCase().includes(q) || (p.brand || '').toLowerCase().includes(q));
    }
    list = sortProducts(list, _sortBy);
    renderGrid(list);
  }

  function sortProducts(list, by) {
    if (by === 'price-asc')   return [...list].sort((a,b) => parseFloat(a.productPrice||0) - parseFloat(b.productPrice||0));
    if (by === 'price-desc')  return [...list].sort((a,b) => parseFloat(b.productPrice||0) - parseFloat(a.productPrice||0));
    if (by === 'rating')      return [...list].sort((a,b) => (b.rating||0) - (a.rating||0));
    if (by === 'popularity')  return [...list].sort((a,b) => (b.popularityScore||0) - (a.popularityScore||0));
    return list;
  }

  function renderGrid(products) {
    const grid  = document.getElementById('cat-grid');
    const count = document.getElementById('cat-count');
    if (!grid) return;
    if (count) count.textContent = `${products.length} product${products.length !== 1 ? 's' : ''}`;
    grid.innerHTML = '';
    if (!products.length) {
      grid.innerHTML = '<div class="empty-state"><p>No products match your filters.</p></div>';
      return;
    }
    const waNum = window._waNumber || '';
    products.forEach(p => {
      const imgBase = `assets/categories/${_currentCat}/`;
      grid.appendChild(buildProductCard(p, imgBase, waNum, {
        onQuickView: (prod, imgPath) => ModalComponent.open(prod, imgPath),
        campaignId: `cat-${_currentCat}`,
      }));
    });
  }

  function bindEvents() {
    document.getElementById('cat-sort')?.addEventListener('change', e => {
      _sortBy = e.target.value;
      applyFilters(document.getElementById('cat-search')?.value || '');
    });
    let searchTimer;
    document.getElementById('cat-search')?.addEventListener('input', e => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => applyFilters(e.target.value), 200);
    });
  }

  function init(data) {
    const root = document.getElementById('categories-root');
    if (!root || !data) return;
    _catData = data;
    root.innerHTML = getShell();
    const cats = Object.keys(data);
    buildTabs(cats);
    bindEvents();
    if (cats.length) switchCat(cats[0]);
  }
  return { init };
})();
