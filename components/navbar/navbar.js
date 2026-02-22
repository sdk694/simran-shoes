/**
 * NAVBAR COMPONENT
 * Renders sticky navbar with logo, nav links, mobile hamburger
 */

const NavbarComponent = (() => {

  function getTemplate(data) {
    const name = sanitize(data?.name || 'Simran Shoes');
    return `
      <header class="navbar" role="banner" id="navbar">
        <div class="navbar-inner">
          <a href="#home" class="brand" aria-label="${name} Home">
            <img
              src="assets/logo.png"
              alt="${name} Logo"
              class="brand-logo"
              id="navbar-logo-img"
              onerror="this.style.display='none'; document.getElementById('navbar-logo-fallback').style.display='flex';"
            />
            <div class="brand-logo-fallback" id="navbar-logo-fallback" style="display:none;">SS</div>
            <div class="brand-text">
              <span class="brand-name">${name}</span>
              <span class="brand-tagline">Since 2005</span>
            </div>
          </a>

          <nav class="nav-links" role="navigation" aria-label="Main navigation">
            <a href="#about">About</a>
            <a href="#flashsale">Flash Sale</a>
            <a href="#categories">Shop</a>
            <a href="#testimonials">Reviews</a>
            <a href="#footer">Contact</a>
          </nav>

          <button class="hamburger" id="hamburger" aria-label="Toggle menu" aria-expanded="false">
            <span></span><span></span><span></span>
          </button>
        </div>

        <nav class="mobile-nav" id="mobile-nav" aria-hidden="true">
          <a href="#about"         class="mobile-link">About</a>
          <a href="#flashsale"     class="mobile-link">Flash Sale</a>
          <a href="#categories"    class="mobile-link">Shop</a>
          <a href="#testimonials"  class="mobile-link">Reviews</a>
          <a href="#footer"        class="mobile-link">Contact</a>
        </nav>
      </header>`;
  }

  function bindEvents() {
    const navbar    = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobile-nav');

    // Scroll shadow
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 30);
    }, { passive: true });

    // Hamburger toggle
    hamburger?.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      mobileNav.setAttribute('aria-hidden', String(!isOpen));
    });

    // Close mobile nav on link click
    document.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
      });
    });
  }

  function init(data) {
    const root = document.getElementById('navbar-root');
    if (!root) return;
    root.innerHTML = getTemplate(data);
    bindEvents();
  }

  return { init };
})();
