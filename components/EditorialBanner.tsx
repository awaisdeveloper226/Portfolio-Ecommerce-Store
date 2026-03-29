"use client";
import Link from "next/link";

export default function EditorialBanner() {
  return (
    <section className="editorial-section">
      <div className="editorial-inner">
        <div className="editorial-img-block">
          <div className="editorial-img editorial-img-1" />
          <div className="editorial-img editorial-img-2" />
          <div className="editorial-quote-float">
            <p>
              &quot;Effortless sophistication
              <br />
              in every stitch.&quot;
            </p>
          </div>
        </div>
        <div className="editorial-content">
          <span className="editorial-eyebrow">The Story</span>
          <h2 className="editorial-heading">
            Crafted with
            <br />
            <em>conscious</em>
            <br />
            intention.
          </h2>
          <p className="editorial-body">
            Every piece in our collection is designed to transcend seasons —
            made from sustainably sourced fabrics by artisans who care as deeply
            as we do about the world we dress.
          </p>
          <div className="editorial-features">
            <div className="editorial-feat">
              <span className="feat-icon">✦</span> GOTS Certified Organic
            </div>
            <div className="editorial-feat">
              <span className="feat-icon">✦</span> Carbon Neutral Shipping
            </div>
            <div className="editorial-feat">
              <span className="feat-icon">✦</span> Ethical Manufacturing
            </div>
            <div className="editorial-feat">
              <span className="feat-icon">✦</span> 1% for the Planet
            </div>
          </div>
          <Link href="/about" className="btn-primary">
            Our Philosophy
          </Link>
        </div>
      </div>
    </section>
  );
}
