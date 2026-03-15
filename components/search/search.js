const SearchComponent = (() => {
  let _products = [];

  function buildIndex(catData, flashData) {
    const products = [];
    if (catData) {
      Object.entries(catData).forEach(([cat, items]) => {
        if (!items || typeof items !== 'object') return;
        Object.values(items).forEach(p => {
          if (p?.productName) products.push({ ...p, _cat: cat, _imgBase: `assets/categories/${cat}/` });
        });
      });
    }
    const flash = flashData?.flashsale;
    if (flash) Object.values(flash).forEach(p => {
      if (p?.productName) products.push({ ...p, _cat: 'flashsale', _imgBase: 'assets/flashsale/' });
    });
    return products;
  }

  function getTemplate() {
    return `
      <div class="search-overlay" id="search-overlay" role="dialog" aria-modal="true" aria-label="Search products">
        <div class="search-header">
          <div class="search-input-wrap">
            <input type="search" class="search-input" id="search-input"
              placeholder="Search shoes, brands, sandals…"
              autocomplete="off" autocorrect="off" spellcheck="false" aria-label="Search products" />
            <button class="search-close-btn" id="search-close-btn" aria-label="Close search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>
          <p class="search-hint">Press ESC to close · Click result to open Quick View</p>
        </div>
        <div class="search-results" id="search-results" role="listbox"></div>
      </div>`;
  }

  function renderResults(query) {
    const el = document.getElementById('search-results');
    if (!el) return;
    const q = query.trim().toLowerCase();
    if (!q) { el.innerHTML = ''; return; }

    const hits = _products.filter(p => {
      const name  = (p.productName || '').toLowerCase();
      const brand = (p.brand       || '').toLowerCase();
      const tags  = (p.tags        || []).join(' ').toLowerCase();
      const cat   = (p._cat        || '').toLowerCase();
      return name.includes(q) || brand.includes(q) || tags.includes(q) || cat.includes(q);
    }).slice(0, 12);

    if (!hits.length) {
      el.innerHTML = `<div class="search-no-results"><span class="icon">🔍</span><p>No results for "<strong>${sanitize(query)}</strong>"</p></div>`;
      return;
    }

    function hi(text) {
      if (!q || !text) return sanitize(text || '');
      const idx = text.toLowerCase().indexOf(q);
      if (idx === -1) return sanitize(text);
      return sanitize(text.slice(0,idx)) + `<span class="search-highlight">${sanitize(text.slice(idx, idx+q.length))}</span>` + sanitize(text.slice(idx+q.length));
    }

    el.innerHTML = `<p class="search-results-label">${hits.length} Result${hits.length !== 1 ? 's' : ''}</p>`;
    hits.forEach(p => {
      const imgSrc = `${p._imgBase}${p.productImageNumber || '1'}.jpg`;
      const price  = p.productPrice || p.price || '';
      const item   = document.createElement('div');
      item.className = 'search-result-item'; item.setAttribute('role', 'option');
      item.innerHTML = `
        <div class="search-result-thumb">
          <img src="${sanitize(imgSrc)}" alt="" loading="lazy" onerror="this.parentElement.innerHTML='👟'" />
        </div>
        <div class="search-result-info">
          <div class="search-result-name">${hi(p.productName)}</div>
          ${p.brand ? `<div class="search-result-brand">${sanitize(p.brand)}</div>` : ''}
          <div class="search-result-cat">${sanitize(p._cat)}</div>
        </div>
        ${price ? `<div class="search-result-price">₹${sanitize(String(price))}</div>` : ''}`;
      item.addEventListener('click', () => {
        close();
        setTimeout(() => ModalComponent.open(p, `${p._imgBase}${p.productImageNumber || '1'}`), 300);
      });
      el.appendChild(item);
    });
  }

  function open() {
    const ov = document.getElementById('search-overlay');
    if (!ov) return;
    ov.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => { const inp = document.getElementById('search-input'); if (inp) inp.focus(); }, 60);
  }

  function close() {
    const ov = document.getElementById('search-overlay');
    if (!ov) return;
    ov.classList.remove('open');
    document.body.style.overflow = '';
    const inp = document.getElementById('search-input');
    if (inp) { inp.value = ''; renderResults(''); }
  }

  function init(catData, flashData) {
    const root = document.getElementById('search-root');
    if (!root) return;
    root.innerHTML = getTemplate();
    _products = buildIndex(catData, flashData);

    document.addEventListener('ss:search:open', open);
    document.getElementById('search-close-btn')?.addEventListener('click', close);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
    document.getElementById('search-overlay')?.addEventListener('click', e => { if (e.target.id === 'search-overlay') close(); });

    let timer;
    document.getElementById('search-input')?.addEventListener('input', e => {
      clearTimeout(timer);
      timer = setTimeout(() => renderResults(e.target.value), 180);
    });
  }

  return { init, open, close };
})();
