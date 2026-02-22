/**
 * CATEGORIES COMPONENT
 * Dynamically renders tabbed product categories from categories.json
 * Tabs are generated from JSON keys — no hardcoding
 */

const CategoriesComponent = (() => {

  function getShell() {
    return `
      <section class="section categories-section" id="categories" aria-label="Product Categories">
        <div class="container">
          <div class="section-header">
            <div class="section-label">Browse All</div>
            <h2 class="section-title">Our Collection</h2>
            <p class="section-sub">Find the perfect pair for every occasion</p>
          </div>
          <div class="tabs-wrapper">
            <div class="tabs-scroll">
              <div class="tabs" id="category-tabs" role="tablist" aria-label="Product categories"></div>
            </div>
            <div id="category-panels"></div>
          </div>
        </div>
      </section>`;
  }

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

  function renderTabs(data) {
    const tabsEl  = document.getElementById('category-tabs');
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

      // Tab panel
      const panel = document.createElement('div');
      panel.className = `tab-panel${isActive ? ' active' : ''}`;
      panel.id        = `panel-${cat}`;
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', `tab-${cat}`);

      const grid = document.createElement('div');
      grid.className = 'products-grid';
      grid.setAttribute('role', 'list');

      const products = data[cat];
      const keys = Object.keys(products).sort((a, b) => parseInt(a) - parseInt(b));

      if (keys.length === 0) {
        grid.innerHTML = `<div class="empty-state"><p>No products in this category yet.</p></div>`;
      } else {
        keys.forEach(key => {
          const card = buildProductCard(
            products[key],
            `${ASSETS_BASE}categories/${cat}/`,
            window._waNumber
          );
          grid.appendChild(card);
        });
      }

      panel.appendChild(grid);
      panelsEl.appendChild(panel);
    });
  }

  function init(data) {
    const root = document.getElementById('categories-root');
    if (!root) return;
    root.innerHTML = getShell();
    renderTabs(data);
  }

  return { init };
})();
