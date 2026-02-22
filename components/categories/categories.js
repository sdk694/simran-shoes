/**
 * CATEGORIES COMPONENT v3
 * Tabbed categories with live search, sort (4 options),
 * and filters (brand chips, price range, rating, availability)
 * All state is per-category and resets on tab switch.
 */

const CategoriesComponent = (() => {

  // ── Per-category filter state ──────────────────────────────
  const _state = {}; // keyed by category name

  function defaultState(products) {
    const prices = Object.values(products)
      .map(p => parseFloat(p.productPrice || p.price || 0))
      .filter(Boolean);
    const maxPrice = prices.length ? Math.max(...prices) : 5000;

    return {
      search:       '',
      sortBy:       'default',
      brand:        'all',
      maxPrice:     maxPrice,
      _absMax:      maxPrice,
      minRating:    0,
      onlyInStock:  false,
    };
  }

  // ── Shell HTML ─────────────────────────────────────────────
  function getShell() {
    return `
      <section class="section categories-section" id="categories" aria-label="Product Categories">
        <div class="container">
          <div class="section-header">
            <div class="section-label">Browse All</div>
            <h2 class="section-title">Our Collection</h2>
            <p class="section-sub">Find the perfect pair for every occasion</p>
          </div>
          <div class="tabs-scroll">
            <div class="tabs" id="category-tabs" role="tablist" aria-label="Product categories"></div>
          </div>
          <div id="category-panels"></div>
        </div>
      </section>`;
  }

  // ── Panel HTML for a category ──────────────────────────────
  function buildPanelHTML(cat) {
    return `
      <div class="tab-panel" id="panel-${cat}" role="tabpanel" aria-labelledby="tab-${cat}">
        <div class="category-controls">
          <div class="search-wrap">
            <span class="search-icon">🔍</span>
            <input
              type="search"
              class="category-search"
              id="search-${cat}"
              placeholder="Search in ${cat}..."
              aria-label="Search ${cat} products"
              autocomplete="off"
            />
          </div>
          <div class="sort-wrap">
            <select class="sort-select" id="sort-${cat}" aria-label="Sort products">
              <option value="default">Sort: Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Rating</option>
              <option value="popularity">Popularity</option>
            </select>
            <span class="sort-chevron" aria-hidden="true">▼</span>
          </div>
        </div>

        <div class="filter-bar" id="filter-bar-${cat}">
          <!-- Populated dynamically from product data -->
        </div>

        <p class="results-count" id="count-${cat}" aria-live="polite"></p>

        <div class="products-grid" id="grid-${cat}" role="list"></div>
      </div>`;
  }

  // ── Build filter bar for a category ───────────────────────
  function buildFilterBar(cat, products) {
    const bar = document.getElementById(`filter-bar-${cat}`);
    if (!bar) return;

    const state   = _state[cat];
    const brands  = ['all', ...new Set(
      Object.values(products).map(p => p.brand).filter(Boolean)
    )];

    bar.innerHTML = '';

    // Brand chips
    const brandGroup = document.createElement('div');
    brandGroup.className = 'filter-group';
    brandGroup.innerHTML = `<span class="filter-label">Brand</span>`;
    brands.forEach(b => {
      const chip = document.createElement('button');
      chip.className   = `brand-chip${state.brand === b ? ' active' : ''}`;
      chip.textContent = b === 'all' ? 'All' : b;
      chip.setAttribute('aria-pressed', String(state.brand === b));
      chip.addEventListener('click', () => {
        state.brand = b;
        buildFilterBar(cat, products);
        renderGrid(cat, products);
      });
      brandGroup.appendChild(chip);
    });
    bar.appendChild(brandGroup);

    // Divider
    bar.insertAdjacentHTML('beforeend', '<span class="filter-divider" aria-hidden="true"></span>');

    // Price range
    const priceGroup = document.createElement('div');
    priceGroup.className = 'filter-group';
    priceGroup.innerHTML = `
      <span class="filter-label">Max Price</span>
      <div class="price-range-wrap">
        <input type="range"
          class="price-range-input"
          id="price-${cat}"
          min="0"
          max="${state._absMax}"
          value="${state.maxPrice}"
          step="50"
          aria-label="Maximum price filter"
        />
        <span class="price-range-val" id="price-val-${cat}">₹${state.maxPrice}</span>
      </div>`;
    bar.appendChild(priceGroup);

    document.getElementById(`price-${cat}`)?.addEventListener('input', (e) => {
      state.maxPrice = parseInt(e.target.value);
      document.getElementById(`price-val-${cat}`).textContent = `₹${state.maxPrice}`;
      renderGrid(cat, products);
    });

    // Divider
    bar.insertAdjacentHTML('beforeend', '<span class="filter-divider" aria-hidden="true"></span>');

    // Rating filter
    const ratingGroup = document.createElement('div');
    ratingGroup.className = 'filter-group';
    ratingGroup.innerHTML = `<span class="filter-label">Min Rating</span>`;
    const ratingWrap = document.createElement('div');
    ratingWrap.className = 'rating-filter-wrap';
    [0, 3, 4, 4.5].forEach(r => {
      const chip = document.createElement('button');
      chip.className   = `rating-chip${state.minRating === r ? ' active' : ''}`;
      chip.textContent = r === 0 ? 'All' : `${r}★+`;
      chip.setAttribute('aria-pressed', String(state.minRating === r));
      chip.addEventListener('click', () => {
        state.minRating = r;
        buildFilterBar(cat, products);
        renderGrid(cat, products);
      });
      ratingWrap.appendChild(chip);
    });
    ratingGroup.appendChild(ratingWrap);
    bar.appendChild(ratingGroup);

    // Divider
    bar.insertAdjacentHTML('beforeend', '<span class="filter-divider" aria-hidden="true"></span>');

    // Availability toggle
    const availGroup = document.createElement('div');
    availGroup.className = 'filter-group';
    const toggleBtn = document.createElement('button');
    toggleBtn.className = `avail-toggle${state.onlyInStock ? ' on' : ''}`;
    toggleBtn.setAttribute('role', 'switch');
    toggleBtn.setAttribute('aria-checked', String(state.onlyInStock));
    toggleBtn.setAttribute('aria-label', 'Show in-stock only');
    toggleBtn.addEventListener('click', () => {
      state.onlyInStock = !state.onlyInStock;
      buildFilterBar(cat, products);
      renderGrid(cat, products);
    });
    const availLabel = document.createElement('span');
    availLabel.className   = 'avail-toggle-label';
    availLabel.textContent = 'In Stock Only';
    availGroup.appendChild(toggleBtn);
    availGroup.appendChild(availLabel);
    bar.appendChild(availGroup);

    // Clear filters button
    const clearBtn = document.createElement('button');
    clearBtn.className   = 'clear-filters-btn';
    clearBtn.textContent = 'Clear filters';
    clearBtn.addEventListener('click', () => {
      _state[cat] = defaultState(products);
      // Reset search and sort UI
      const searchEl = document.getElementById(`search-${cat}`);
      const sortEl   = document.getElementById(`sort-${cat}`);
      if (searchEl) searchEl.value = '';
      if (sortEl)   sortEl.value   = 'default';
      buildFilterBar(cat, products);
      renderGrid(cat, products);
    });
    bar.appendChild(clearBtn);
  }

  // ── Filter + Sort logic ────────────────────────────────────
  function getFilteredSorted(cat, products) {
    const state = _state[cat];
    const q     = state.search.toLowerCase().trim();

    let items = Object.values(products).map(p => ({
      ...p,
      _price:   parseFloat(p.productPrice || p.price || 0),
      _rating:  parseFloat(p.rating)      || 0,
      _popular: parseInt(p.popularityScore) || 0,
    }));

    // Search
    if (q) {
      items = items.filter(p =>
        (p.productName || '').toLowerCase().includes(q) ||
        (p.brand       || '').toLowerCase().includes(q) ||
        (p.tags        || []).some(t => t.toLowerCase().includes(q))
      );
    }

    // Brand
    if (state.brand && state.brand !== 'all') {
      items = items.filter(p => p.brand === state.brand);
    }

    // Max price
    items = items.filter(p => p._price <= state.maxPrice);

    // Min rating
    if (state.minRating > 0) {
      items = items.filter(p => p._rating >= state.minRating);
    }

    // Availability
    if (state.onlyInStock) {
      items = items.filter(p => p.availability !== false);
    }

    // Sort
    switch (state.sortBy) {
      case 'price-asc':   items.sort((a, b) => a._price   - b._price);   break;
      case 'price-desc':  items.sort((a, b) => b._price   - a._price);   break;
      case 'rating':      items.sort((a, b) => b._rating  - a._rating);  break;
      case 'popularity':  items.sort((a, b) => b._popular - a._popular); break;
    }

    return items;
  }

  // ── Render product grid ────────────────────────────────────
  function renderGrid(cat, products) {
    const grid    = document.getElementById(`grid-${cat}`);
    const countEl = document.getElementById(`count-${cat}`);
    if (!grid) return;

    grid.innerHTML = '';
    const items = getFilteredSorted(cat, products);

    if (countEl) {
      countEl.textContent = items.length === 0
        ? 'No products match your filters'
        : `${items.length} product${items.length !== 1 ? 's' : ''} found`;
    }

    if (items.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <p>😔 No products match your search or filters.</p>
          <p style="margin-top:0.5rem;font-size:0.85rem;">Try adjusting your filters or search term.</p>
        </div>`;
      return;
    }

    items.forEach(product => {
      const card = buildProductCard(
        product,
        `${ASSETS_BASE}categories/${cat}/`,
        window._waNumber,
        { onQuickView: (p, imgPath) => ModalComponent.open(p, imgPath) }
      );
      grid.appendChild(card);
    });
  }

  // ── Bind search and sort events for a tab ─────────────────
  function bindControls(cat, products) {
    let debounceTimer;
    document.getElementById(`search-${cat}`)?.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        _state[cat].search = e.target.value;
        renderGrid(cat, products);
      }, 200);
    });

    document.getElementById(`sort-${cat}`)?.addEventListener('change', (e) => {
      _state[cat].sortBy = e.target.value;
      renderGrid(cat, products);
    });
  }

  // ── Tab switching ──────────────────────────────────────────
  function switchTab(activeCat, allCats) {
    allCats.forEach(cat => {
      const btn   = document.getElementById(`tab-${cat}`);
      const panel = document.getElementById(`panel-${cat}`);
      if (!btn || !panel) return;
      const isActive = cat === activeCat;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', String(isActive));
      panel.classList.toggle('active', isActive);
    });
  }

  // ── Main render ────────────────────────────────────────────
  function renderAll(data) {
    const tabsEl   = document.getElementById('category-tabs');
    const panelsEl = document.getElementById('category-panels');
    if (!tabsEl || !panelsEl) return;

    if (!data || Object.keys(data).length === 0) {
      panelsEl.innerHTML = `<div class="empty-state"><p>Products coming soon!</p></div>`;
      return;
    }

    const categories = Object.keys(data);

    categories.forEach((cat, index) => {
      const isActive = index === 0;
      const label    = cat.charAt(0).toUpperCase() + cat.slice(1);
      const products = data[cat];

      // Init state
      _state[cat] = defaultState(products);

      // Tab button
      const btn = document.createElement('button');
      btn.className = `tab-btn${isActive ? ' active' : ''}`;
      btn.id        = `tab-${cat}`;
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', String(isActive));
      btn.setAttribute('aria-controls', `panel-${cat}`);
      btn.textContent = label;
      btn.addEventListener('click', () => switchTab(cat, categories));
      tabsEl.appendChild(btn);

      // Panel
      panelsEl.insertAdjacentHTML('beforeend', buildPanelHTML(cat));

      // Populate filter bar + grid
      buildFilterBar(cat, products);
      renderGrid(cat, products);
      bindControls(cat, products);

      // Only active panel is visible
      const panel = document.getElementById(`panel-${cat}`);
      if (panel && isActive) panel.classList.add('active');
    });
  }

  function init(data) {
    const root = document.getElementById('categories-root');
    if (!root) return;
    root.innerHTML = getShell();
    renderAll(data);
  }

  return { init };
})();
