/**
 * HERO COMPONENT
 * Static hero section — no config data needed
 */

const HeroComponent = (() => {

  function getTemplate() {
    return `
      <section class="hero" aria-label="Hero banner">
        <div class="hero-bg" aria-hidden="true"></div>
        <div class="hero-content">
          <h1 class="hero-title">
            <span class="hero-line1">Step Into</span>
            <span class="hero-line2">Comfort &amp;</span>
            <span class="hero-line3">Style</span>
          </h1>
          <div class="hero-badge">21+ Years of Trust ✦</div>
          <p class="hero-sub">Jabalpur's most loved footwear destination</p>
          <div class="hero-actions">
            <a href="#flashsale" class="btn-primary">View Flash Sale</a>
            <a href="#categories" class="btn-secondary">Browse Collection</a>
          </div>
        </div>
        <div class="hero-scroll-indicator" aria-hidden="true">
          <span>Scroll</span>
          <div class="scroll-line"></div>
        </div>
      </section>`;
  }

  function init() {
    const root = document.getElementById('hero-root');
    if (!root) return;
    root.innerHTML = getTemplate();
  }

  return { init };
})();
