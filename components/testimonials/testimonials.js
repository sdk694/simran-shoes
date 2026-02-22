/**
 * TESTIMONIALS COMPONENT
 * Renders customer review cards from testimonials.json
 */

const TestimonialsComponent = (() => {

  function getShell() {
    return `
      <section class="section testimonials-section" id="testimonials" aria-label="Customer Testimonials">
        <div class="container">
          <div class="section-header">
            <div class="section-label">What People Say</div>
            <h2 class="section-title">Customer Reviews</h2>
            <p class="section-sub">Words from our happy Jabalpur family</p>
          </div>
          <div class="testimonials-grid" id="testimonials-grid" role="list"></div>
        </div>
      </section>`;
  }

  function buildCard(testimonial) {
    const name     = sanitize(testimonial.customerName     || 'Anonymous');
    const feedback = sanitize(testimonial.customerFeedback || '');
    const rating   = testimonial.customerRating || '5/5';
    const initial  = name.charAt(0).toUpperCase();
    const parts    = rating.split('/');
    const ratingNum = parts[0];
    const totalNum  = parts[1] || '5';

    const card = document.createElement('article');
    card.className = 'testimonial-card';
    card.setAttribute('role', 'listitem');

    card.innerHTML = `
      <div class="testimonial-stars" aria-label="Rating: ${ratingNum} out of ${totalNum} stars">
        ${renderStars(rating)}
      </div>
      <p class="testimonial-feedback">${feedback}</p>
      <div class="testimonial-author">
        <div class="author-avatar" aria-hidden="true">${initial}</div>
        <div>
          <p class="author-name">${name}</p>
          <p class="author-location">Jabalpur</p>
        </div>
      </div>`;

    return card;
  }

  function renderCards(data) {
    const grid = document.getElementById('testimonials-grid');
    if (!grid) return;

    if (!data?.testimonials || Object.keys(data.testimonials).length === 0) {
      grid.innerHTML = `<div class="empty-state"><p>Be the first to share your experience!</p></div>`;
      return;
    }

    const keys = Object.keys(data.testimonials).sort((a, b) => parseInt(a) - parseInt(b));
    keys.forEach(key => {
      grid.appendChild(buildCard(data.testimonials[key]));
    });
  }

  function init(data) {
    const root = document.getElementById('testimonials-root');
    if (!root) return;
    root.innerHTML = getShell();
    renderCards(data);
  }

  return { init };
})();
