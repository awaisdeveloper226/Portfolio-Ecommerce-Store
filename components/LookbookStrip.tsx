"use client";
import Link from "next/link";
export default function LookbookStrip() {
  const looks = [
    { label: "The Office Edit", bg: "#e0d5c8" },
    { label: "Weekend Ease", bg: "#c8d5c8" },
    { label: "Evening Allure", bg: "#c8c8d5" },
    { label: "Resort Wear", bg: "#d5c8c0" },
  ];
  return (
    <section className="lookbook-section">
      <div className="lookbook-header">
        <h2 className="lookbook-title">Shop the Look</h2>
        <p className="lookbook-sub">
          Complete outfits, curated for every moment.
        </p>
      </div>
      <div className="lookbook-grid">
        {looks.map((look, i) => (
          <Link
            key={i}
            href="/collections/lookbook"
            className={`look-card look-card-${i}`}
          >
            <div className="look-img" style={{ background: look.bg }} />
            <div className="look-label">
              <span>{look.label}</span>
              <span className="look-arrow">→</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
