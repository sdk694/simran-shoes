'use strict';

async function initApp() {
  initUI();

  const [aboutData, flashData, catData, testData, brandsData, campaignData] = await Promise.all([
    fetchConfig(CONFIGS.about),
    fetchConfig(CONFIGS.flashsale),
    fetchConfig(CONFIGS.categories),
    fetchConfig(CONFIGS.testimonials),
    fetchConfig(CONFIGS.brands),
    fetchConfig(CONFIGS.heroCampaigns),
  ]);

  // Init singletons first
  ModalComponent.init();
  WAFormComponent.init();
  WaFormComponent.init();   // intercepts all WA button clicks site-wide

  // Render components in page order
  NavbarComponent.init(aboutData);
  SearchComponent.init(catData, flashData);
  HeroComponent.init(campaignData);
  CampaignComponent.init(campaignData);
  BrandsComponent.init(brandsData);
  AboutComponent.init(aboutData);           // sets window._waNumber
  FlashSaleComponent.init(flashData);
  PersonalizationComponent.init(catData);
  CategoriesComponent.init(catData);
  TestimonialsComponent.init(testData);
  FooterComponent.init(aboutData);

  const stickyWa = document.getElementById('sticky-wa');
  if (stickyWa && window._waNumber) {
    stickyWa.href = `https://wa.me/${window._waNumber}?text=${encodeURIComponent("Hi! I'd like to explore your collection at Simran Shoes, Jabalpur.")}`;
  }

  initScrollReveal();
}

function initUI() {
  const btn = document.getElementById('back-to-top');
  if (btn) {
    window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 500), { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }
}

function initScrollReveal() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in-view'));
    return;
  }
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in-view'); obs.unobserve(e.target); } });
  }, { threshold: 0.07, rootMargin: '0px 0px -30px 0px' });
  setTimeout(() => document.querySelectorAll('.reveal').forEach(el => obs.observe(el)), 120);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initApp);
else initApp();
