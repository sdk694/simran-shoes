/**
 * FLASH SALE COMPONENT
 * Products grid with live countdown timer (hours/mins/secs)
 * Timer is seeded from hoursLeft in flashsale.json
 */

const FlashSaleComponent = (() => {
  let _timerInterval = null;

  function getShell(hoursLeft) {
    return `
      <section class="section flashsale-section" id="flashsale" aria-label="Flash Sale">
        <div class="container">
          <div class="section-header">
            <div class="section-label">Limited Time Only</div>
            <h2 class="section-title">⚡ Flash Sale</h2>
            <p class="section-sub">Prices drop, deals fly. Grab yours before time runs out.</p>
          </div>

          <div class="flash-countdown" aria-live="polite" aria-label="Sale countdown timer">
            <span class="flash-countdown-label">Ends in</span>
            <div class="countdown-units">
              <div class="countdown-unit">
                <span class="countdown-num" id="cd-hours">00</span>
                <span class="countdown-lbl">Hrs</span>
              </div>
              <span class="countdown-sep" aria-hidden="true">:</span>
              <div class="countdown-unit">
                <span class="countdown-num" id="cd-mins">00</span>
                <span class="countdown-lbl">Min</span>
              </div>
              <span class="countdown-sep" aria-hidden="true">:</span>
              <div class="countdown-unit">
                <span class="countdown-num" id="cd-secs">00</span>
                <span class="countdown-lbl">Sec</span>
              </div>
            </div>
          </div>

          <div class="products-grid" id="flashsale-grid" role="list"></div>
        </div>
      </section>`;
  }

  function startCountdown(hoursLeft) {
    // Total seconds from hoursLeft
    let remaining = Math.max(0, hoursLeft) * 3600;

    function tick() {
      const h = Math.floor(remaining / 3600);
      const m = Math.floor((remaining % 3600) / 60);
      const s = remaining % 60;

      const hEl = document.getElementById('cd-hours');
      const mEl = document.getElementById('cd-mins');
      const sEl = document.getElementById('cd-secs');

      if (!hEl) { clearInterval(_timerInterval); return; }

      hEl.textContent = String(h).padStart(2, '0');
      mEl.textContent = String(m).padStart(2, '0');
      sEl.textContent = String(s).padStart(2, '0');

      if (remaining <= 0) {
        clearInterval(_timerInterval);
        return;
      }
      remaining--;
    }

    tick(); // run immediately
    if (_timerInterval) clearInterval(_timerInterval);
    _timerInterval = setInterval(tick, 1000);
  }

  function renderProducts(data) {
    const grid = document.getElementById('flashsale-grid');
    if (!grid) return;

    const products = data?.flashsale;
    if (!products || Object.keys(products).length === 0) {
      grid.innerHTML = `<div class="empty-state"><p>No flash sale items right now. Check back soon!</p></div>`;
      return;
    }

    const keys = Object.keys(products).sort((a, b) => parseInt(a) - parseInt(b));
    keys.forEach(key => {
      const card = buildProductCard(
        products[key],
        `${ASSETS_BASE}flashsale/`,
        window._waNumber,
        {
          isFlash:     true,
          onQuickView: (product, imgPath) => ModalComponent.open(product, imgPath),
        }
      );
      grid.appendChild(card);
    });
  }

  function init(data) {
    const root = document.getElementById('flashsale-root');
    if (!root) return;

    const hoursLeft = data?.hoursLeft ?? 18;
    root.innerHTML = getShell(hoursLeft);
    renderProducts(data);
    startCountdown(hoursLeft);
  }

  return { init };
})();
