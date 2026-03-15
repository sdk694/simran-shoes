const FlashSaleComponent = (() => {
  let _timer = null;

  function getShell(hoursLeft) {
    return `
      <section class="section flashsale-section reveal" id="flashsale" aria-label="Flash Sale">
        <div class="container">
          <div class="section-header center">
            <span class="section-eyebrow">Limited Time</span>
            <h2 class="section-title">⚡ Flash <span class="accent">Sale</span></h2>
            <p class="section-sub">Prices drop, deals fly. Grab yours before the clock runs out.</p>
          </div>
          <div class="flash-timer-wrap" aria-live="polite">
            <span class="flash-timer-label">Ends in</span>
            <div class="countdown-units">
              <div class="countdown-unit"><span class="cd-num" id="cd-h">00</span><span class="cd-lbl">Hrs</span></div>
              <span class="countdown-sep" aria-hidden="true">:</span>
              <div class="countdown-unit"><span class="cd-num" id="cd-m">00</span><span class="cd-lbl">Min</span></div>
              <span class="countdown-sep" aria-hidden="true">:</span>
              <div class="countdown-unit"><span class="cd-num" id="cd-s">00</span><span class="cd-lbl">Sec</span></div>
            </div>
          </div>
          <div class="products-grid" id="flashsale-grid" role="list"></div>
        </div>
      </section>`;
  }

  function startTimer(hoursLeft) {
    let rem = Math.max(0, hoursLeft) * 3600;
    function tick() {
      const h = Math.floor(rem / 3600), m = Math.floor((rem % 3600) / 60), s = rem % 60;
      const hEl = document.getElementById('cd-h');
      if (!hEl) { clearInterval(_timer); return; }
      hEl.textContent = String(h).padStart(2,'0');
      document.getElementById('cd-m').textContent = String(m).padStart(2,'0');
      document.getElementById('cd-s').textContent = String(s).padStart(2,'0');
      if (rem-- <= 0) clearInterval(_timer);
    }
    tick();
    if (_timer) clearInterval(_timer);
    _timer = setInterval(tick, 1000);
  }

  function init(data) {
    const root = document.getElementById('flashsale-root');
    if (!root) return;
    const hoursLeft = data?.hoursLeft || 12;
    root.innerHTML = getShell(hoursLeft);
    startTimer(hoursLeft);

    const grid    = document.getElementById('flashsale-grid');
    const items   = data?.flashsale;
    const waNum   = window._waNumber || '';
    const imgBase = 'assets/flashsale/';

    if (!items || !Object.keys(items).length) {
      grid.innerHTML = '<div class="empty-state"><p>Check back soon for flash deals!</p></div>';
      return;
    }

    Object.values(items).forEach(p => {
      const card = buildProductCard(p, imgBase, waNum, {
        isFlash: true,
        onQuickView: (prod, imgPath) => ModalComponent.open(prod, imgPath),
        campaignId: 'flash-sale',
      });
      grid.appendChild(card);
    });
  }

  return { init };
})();
