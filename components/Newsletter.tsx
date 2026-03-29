"use client";
export default function Newsletter() {
  return (
    <section className="newsletter-section">
      <div className="newsletter-inner">
        <div className="newsletter-deco" />
        <span className="newsletter-eyebrow">Join the Circle</span>
        <h2 className="newsletter-title">First to know.<br />First to wear.</h2>
        <p className="newsletter-sub">Subscribe for early access to new collections, exclusive offers, and style notes from our editors.</p>
        <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
          <input type="email" placeholder="Your email address" className="newsletter-input" />
          <button type="submit" className="newsletter-btn">Subscribe</button>
        </form>
        <p className="newsletter-disclaimer">No spam. Unsubscribe at any time. We respect your privacy.</p>
      </div>
    </section>
  );
}