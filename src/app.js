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

  ModalComponent.init();
  NavbarComponent.init(aboutData);
  SearchComponent.init(catData, flashData);
  HeroComponent.init(campaignData);
  CampaignComponent.init(campaignData);
  BrandsComponent.init(brandsData);
  AboutComponent.init(aboutData);          // sets window._waNumber
  FlashSaleComponent.init(flashData);      // reads window._waNumber
  PersonalizationComponent.init(catData);  // reads window._waNumber
  CategoriesComponent.init(catData);       // reads window._waNumber
  TestimonialsComponent.init(testData);
  FooterComponent.init(aboutData);

  const stickyWa = document.getElementById('sticky-wa');
  if (stickyWa && window._waNumber) {
    stickyWa.href = whatsappURL(window._waNumber, null, null, null, 'sticky-cta');
    stickyWa.href = `https://wa.me/${window._waNumber}?text=${encodeURIComponent("Hi! I'd like to explore your latest collection at Simran Shoes, Jabalpur.")}`;
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
