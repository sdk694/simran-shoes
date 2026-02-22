/**
 * SIMRAN SHOES — App Bootstrap
 * Loads all configs in parallel, initialises each component in correct order
 */

'use strict';

async function initApp() {
  // Back-to-top button
  const backBtn = document.getElementById('back-to-top');
  if (backBtn) {
    window.addEventListener('scroll', () => {
      backBtn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    backBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Load all configs in parallel for speed
  const [aboutData, flashData, catData, testData] = await Promise.all([
    fetchConfig(CONFIGS.about),
    fetchConfig(CONFIGS.flashsale),
    fetchConfig(CONFIGS.categories),
    fetchConfig(CONFIGS.testimonials),
  ]);

  // IMPORTANT: AboutComponent.init() sets window._waNumber.
  // It must run before FlashSaleComponent and CategoriesComponent.
  NavbarComponent.init(aboutData);
  HeroComponent.init();
  AboutComponent.init(aboutData);       // ← sets window._waNumber
  FlashSaleComponent.init(flashData);   // ← reads window._waNumber
  CategoriesComponent.init(catData);    // ← reads window._waNumber
  TestimonialsComponent.init(testData);
  FooterComponent.init(aboutData);

  // Scroll reveal — runs after all DOM is painted
  initScrollReveal();
}

function initScrollReveal() {
  if (!('IntersectionObserver' in window)) return; // graceful fallback

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.section').forEach(el => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(28px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

// Kick off once DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
