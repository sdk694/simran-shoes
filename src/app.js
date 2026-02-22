/**
 * SIMRAN SHOES v3 — App Bootstrap
 * Loads all configs from public/config/, initialises each component in order
 */

'use strict';

async function initApp() {
  // ── Back to top ──
  const backBtn = document.getElementById('back-to-top');
  if (backBtn) {
    window.addEventListener('scroll', () => {
      backBtn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    backBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // ── Load all configs in parallel ──
  const [aboutData, flashData, catData, testData] = await Promise.all([
    fetchConfig(CONFIGS.about),
    fetchConfig(CONFIGS.flashsale),
    fetchConfig(CONFIGS.categories),
    fetchConfig(CONFIGS.testimonials),
  ]);

  // ── Init modal first (singleton, needed by flashsale & categories) ──
  ModalComponent.init();

  // ── Render components in page order ──
  // AboutComponent.init() MUST run before flash/categories — it sets window._waNumber
  NavbarComponent.init(aboutData);
  HeroComponent.init();
  AboutComponent.init(aboutData);       // ← sets window._waNumber
  FlashSaleComponent.init(flashData);   // ← reads window._waNumber
  CategoriesComponent.init(catData);    // ← reads window._waNumber
  TestimonialsComponent.init(testData);
  FooterComponent.init(aboutData);

  // ── Set sticky WhatsApp CTA href ──
  const stickyWa = document.getElementById('sticky-wa');
  if (stickyWa && window._waNumber) {
    stickyWa.href = `https://wa.me/${window._waNumber}?text=${encodeURIComponent("Hi! I'd like to know more about your products.")}`;
  }

  // ── Scroll reveal ──
  initScrollReveal();
}

function initScrollReveal() {
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.section').forEach(el => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(28px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
