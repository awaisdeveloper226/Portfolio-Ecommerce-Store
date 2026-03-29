"use client";
import Link from "next/link";

// ─── Featured Products ─────────────────────────────────────────────────────────
const featured = [
  {
    id: 1,
    name: "Silk Slip Dress",
    price: "$285",
    originalPrice: null,
    tag: "Bestseller",
    color: "#e8d5c0",
  },
  {
    id: 2,
    name: "Linen Wide Trousers",
    price: "$195",
    originalPrice: "$240",
    tag: "Sale",
    color: "#c8d5c0",
  },
  {
    id: 3,
    name: "Cashmere Turtleneck",
    price: "$320",
    originalPrice: null,
    tag: "New",
    color: "#d0c8d5",
  },
  {
    id: 4,
    name: "Wrap Blazer",
    price: "$410",
    originalPrice: null,
    tag: "New",
    color: "#d5d0c0",
  },
];

function ProductCard({ product }: { product: (typeof featured)[0] }) {
  return (
    <div className="product-card">
      <div className="product-img-wrap">
        <div className="product-img" style={{ background: product.color }}>
          <span className="product-img-text">Product Image</span>
        </div>
        {product.tag && (
          <span
            className={`product-tag ${product.tag === "Sale" ? "tag-sale" : product.tag === "Bestseller" ? "tag-best" : "tag-new"}`}
          >
            {product.tag}
          </span>
        )}
        <div className="product-hover-actions">
          <button className="hover-action-btn" aria-label="Add to wishlist">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
          <button
            className="hover-action-btn quick-view"
            aria-label="Quick view"
          >
            Quick View
          </button>
        </div>
        <button className="add-to-cart-overlay">Add to Cart</button>
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <div className="product-price-row">
          <span className="product-price">{product.price}</span>
          {product.originalPrice && (
            <span className="product-original">{product.originalPrice}</span>
          )}
        </div>
        <div className="product-colors">
          {["#d4b5a0", "#2d2d2d", "#b8c4bb", "#c9a96e"].map((c) => (
            <button
              key={c}
              className="color-dot"
              style={{ background: c }}
              aria-label={`Color ${c}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function FeaturedProducts() {
  return (
    <section className="featured-section">
      <div className="featured-header">
        <div>
          <span className="featured-eyebrow">Hand-picked for you</span>
          <h2 className="featured-title">New Arrivals</h2>
        </div>
        <Link href="/shop?sort=newest" className="view-all-link">
          View All New In →
        </Link>
      </div>
      <div className="products-grid">
        {featured.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
