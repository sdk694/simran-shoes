const BrandsComponent = (() => {
  const FALLBACK = ['Campus','Bata','Paragon','VKC','Relaxo','Khadim\'s','Flite','Liberty','Sparx','Bonjour','Killer','Scholl'];

  function init(data) {
    const root = document.getElementById('brands-root');
    if (!root) return;
    const list = data?.brands?.map(b => b.name || b) || FALLBACK;
    root.innerHTML = `
      <div class="brands-section" aria-label="Brand partners">
        <div class="brands-inner">
          <span class="brands-label">Trusted Brands</span>
          <div class="brands-divider"></div>
          <div class="brands-list">
            ${list.map(b => `<span class="brand-pill">${sanitize(String(b))}</span>`).join('')}
          </div>
        </div>
      </div>`;
  }
  return { init };
})();
