const TestimonialsComponent = (() => {
  const FALLBACK = [
    { customerName: 'Priya Sharma',    customerFeedback: 'Best footwear store in Jabalpur! Great variety and the staff helped me find the perfect sandals.', rating: 5, location: 'Napier Town' },
    { customerName: 'Rahul Gupta',     customerFeedback: 'Been shopping here for 10 years. Never disappointed. The quality is consistently excellent.',         rating: 5, location: 'Adhartal' },
    { customerName: 'Sunita Patel',    customerFeedback: 'The traditional footwear collection is stunning. Bought juttis for my daughter\'s wedding here.',      rating: 5, location: 'Civil Lines' },
    { customerName: 'Amit Joshi',      customerFeedback: 'Great prices and amazing variety of brands. WhatsApp ordering is so convenient — will shop again!',    rating: 4, location: 'Vijay Nagar' },
    { customerName: 'Kavita Tiwari',   customerFeedback: 'The rain boots I got here have lasted three monsoon seasons. Excellent quality and friendly service.',   rating: 5, location: 'Madan Mahal' },
    { customerName: 'Deepak Mishra',   customerFeedback: 'Huge selection of campus shoes for kids. My go-to store every school season. Highly recommend!',        rating: 4, location: 'Gorakhpur' },
  ];

  function renderStars(n) {
    let html = '';
    for (let i = 1; i <= 5; i++) html += `<span class="star${i <= n ? ' filled' : ''}">★</span>`;
    return html;
  }

  function renderCard(t) {
    const name     = sanitize(t.customerName     || 'Customer');
    const feedback = sanitize(t.customerFeedback || '');
    const rating   = Math.min(5, Math.max(1, parseInt(t.rating || 5)));
    const location = sanitize(t.location || t.customerLocation || 'Jabalpur');
    const initial  = name.charAt(0).toUpperCase();
    return `
      <div class="testimonial-card reveal">
        <div class="testimonial-stars">${renderStars(rating)}</div>
        <p class="testimonial-text">${feedback}</p>
        <div class="testimonial-author">
          <div class="author-avatar">${initial}</div>
          <div>
            <div class="author-name">${name}</div>
            <div class="author-location">📍 ${location}</div>
          </div>
        </div>
      </div>`;
  }

  function init(data) {
    const root = document.getElementById('testimonials-root');
    if (!root) return;
    const items = data?.testimonials ? Object.values(data.testimonials) : FALLBACK;
    root.innerHTML = `
      <section class="section testimonials-section" id="testimonials" aria-label="Customer reviews">
        <div class="container">
          <div class="section-header center">
            <span class="section-eyebrow">Customer Love</span>
            <h2 class="section-title">What Jabalpur <span class="accent">Says</span></h2>
            <p class="section-sub">5,000+ happy customers trust Simran Shoes for every occasion.</p>
          </div>
          <div class="testimonials-grid">
            ${items.map(t => renderCard(t)).join('')}
          </div>
        </div>
      </section>`;
  }
  return { init };
})();
