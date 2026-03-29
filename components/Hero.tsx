"use client";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-grid">
        {/* Left editorial block */}
        <div className="hero-text-block">
          <span className="hero-eyebrow">Spring / Summer 2025</span>
          <h1 className="hero-headline">
            Dressed
            <br />
            <em>in quiet</em>
            <br />
            luxury.
          </h1>
          <p className="hero-subtext">
            Timeless silhouettes for the woman who moves through the world with
            intention.
          </p>
          <div className="hero-actions">
            <Link href="/collections/ss25" className="btn-primary">
              Explore Collection
            </Link>
            <Link href="/shop" className="btn-ghost">
              All Pieces
            </Link>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-num">340+</span>
              <span className="stat-label">Pieces</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-num">48h</span>
              <span className="stat-label">Delivery</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-num">100%</span>
              <span className="stat-label">Sustainable</span>
            </div>
          </div>
        </div>

        {/* Main hero image */}
        <div className="hero-main-img">
          <div className="hero-img-placeholder main">
            <span>Campaign Image</span>
            <div className="hero-img-badge">New Collection</div>
          </div>
        </div>

        {/* Side image */}
        <div className="hero-side-img">
          <div className="hero-img-placeholder side">
            <span>Editorial</span>
          </div>
          <div className="hero-side-label">
            <p className="side-label-text">The Linen Edit</p>
            <Link href="/collections/linen" className="side-label-link">
              Discover →
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll ticker */}
      <div className="ticker-wrap">
        <div className="ticker">
          {Array(6)
            .fill(
              "NEW ARRIVALS · SUMMER EDIT · LINEN COLLECTION · SUSTAINABLE FASHION · ",
            )
            .map((t, i) => (
              <span key={i}>{t}</span>
            ))}
        </div>
      </div>
    </section>
  );
}
