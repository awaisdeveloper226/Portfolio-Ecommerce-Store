"use client";
import Link from "next/link";

// ─── Categories ───────────────────────────────────────────────────────────────
const categories = [
  {
    name: "Dresses",
    count: "86 styles",
    href: "/category/dresses",
    accent: "#c9a96e",
  },
  {
    name: "Tops",
    count: "124 styles",
    href: "/category/tops",
    accent: "#b8c4bb",
  },
  {
    name: "Trousers",
    count: "67 styles",
    href: "/category/trousers",
    accent: "#d4b5a0",
  },
  {
    name: "Outerwear",
    count: "42 styles",
    href: "/category/outerwear",
    accent: "#9aacb0",
  },
  {
    name: "Knitwear",
    count: "58 styles",
    href: "/category/knitwear",
    accent: "#c4b5d4",
  },
  {
    name: "Accessories",
    count: "93 styles",
    href: "/category/accessories",
    accent: "#d4c4a0",
  },
];

export default function Categories() {
  return (
    <section className="categories-section">
      <div className="section-header">
        <div className="section-header-line" />
        <h2 className="section-title">Shop by Category</h2>
        <div className="section-header-line" />
      </div>
      <div className="categories-grid">
        {categories.map((cat) => (
          <Link key={cat.name} href={cat.href} className="category-card">
            <div
              className="category-img"
              style={{ background: `${cat.accent}22` }}
            >
              <div
                className="category-img-inner"
                style={{ background: `${cat.accent}44` }}
              />
            </div>
            <div className="category-info">
              <span className="category-name">{cat.name}</span>
              <span className="category-count">{cat.count}</span>
            </div>
            <span className="category-arrow">→</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
