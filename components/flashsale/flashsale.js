/**
 * FLASH SALE COMPONENT
 * Renders discounted products grid from flashsale.json
 */

const FlashSaleComponent = (() => {

  function getShell() {
    return `
      <section class="section flashsale-section" id="flashsale" aria-label="Flash Sale">
        <div class="container">
          <div class="section-header">
            <div class="section-label">Limited Time</div>
            <h2 class="section-title">⚡ Flash Sale</h2>
            <p class="section-sub">Grab the best deals before they're gone!</p>
          </div>
          <div class="products-grid" id="flashsale-grid" role="list"></div>
        </div>
      </section>`;
  }

  function renderProducts(data) {
    const grid = document.getElementById('flashsale-grid');
    if (!grid) return;

    if (!data?.flashsale || Object.keys(data.flashsale).length === 0) {
      grid.innerHTML = `<div class="empty-state"><p>No flash sale items right now. Check back soon!</p></div>`;
      return;
    }

    const keys = Object.keys(data.flashsale).sort((a, b) => parseInt(a) - parseInt(b));
    keys.forEach(key => {
      const card = buildProductCard(
        data.flashsale[key],
        `${ASSETS_BASE}flashsale/`,
        window._waNumber,
        { isFlash: true }
      );
      grid.appendChild(card);
    });
  }

  function init(data) {
    const root = document.getElementById('flashsale-root');
    if (!root) return;
    root.innerHTML = getShell();
    renderProducts(data);
  }

  return { init };
})();
