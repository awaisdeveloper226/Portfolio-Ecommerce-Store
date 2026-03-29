const testimonials = [
  {
    quote:
      "The quality is unlike anything I've found at this price point. I've been wearing the linen dress non-stop all summer.",
    author: "Sophie R.",
    location: "London",
  },
  {
    quote:
      "Finally a brand that understands how women actually want to dress — effortless, elegant, and completely real.",
    author: "Amara K.",
    location: "New York",
  },
  {
    quote:
      "From the packaging to the fabric, everything feels considered. This is luxury without the guilt.",
    author: "Léa M.",
    location: "Paris",
  },
];

export default function Testimonials() {
  return (
    <section className="testimonials-section">
      <span className="testimonials-eyebrow">What our community says</span>
      <div className="testimonials-grid">
        {testimonials.map((t, i) => (
          <div key={i} className="testimonial-card">
            <div className="testimonial-stars">★★★★★</div>
            <blockquote className="testimonial-quote">
              &quot;{t.quote}&quot;
            </blockquote>
            <div className="testimonial-author">
              <span className="author-name">{t.author}</span>
              <span className="author-location">{t.location}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
