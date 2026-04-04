"use client";

import { useState, useEffect, useRef, use } from "react";
import Link from "next/link";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ─── Category Config ──────────────────────────────────────────────────────────
const CATEGORY_META: Record<
  string,
  {
    label: string;
    headline: string;
    sub: string;
    accent: string;
    heroGradient: string;
    editorialNote: string;
  }
> = {
  dresses: {
    label: "Dresses",
    headline: "Draped in",
    sub: "86 silhouettes across silk, linen and fine jersey — each designed to move as you do.",
    accent: "#c9a96e",
    heroGradient: "linear-gradient(135deg,#e8ddd0 0%,#c9a96e22 100%)",
    editorialNote: "The dress as a complete statement.",
  },
  tops: {
    label: "Tops",
    headline: "Effortless",
    sub: "124 considered pieces — from structured blouses to fluid cami tops.",
    accent: "#b8c4bb",
    heroGradient: "linear-gradient(135deg,#dde8dd 0%,#b8c4bb33 100%)",
    editorialNote: "The foundation of every great outfit.",
  },
  trousers: {
    label: "Trousers",
    headline: "Tailored",
    sub: "67 cuts that redefine ease — wide leg, tapered, fluid and everything between.",
    accent: "#d4b5a0",
    heroGradient: "linear-gradient(135deg,#ecddd5 0%,#d4b5a044 100%)",
    editorialNote: "Cut with intention. Worn with confidence.",
  },
  outerwear: {
    label: "Outerwear",
    headline: "Layered",
    sub: "42 pieces built for every climate — from featherweight linens to structured wools.",
    accent: "#9aacb0",
    heroGradient: "linear-gradient(135deg,#d5e0e4 0%,#9aacb033 100%)",
    editorialNote: "The first thing the world sees.",
  },
  knitwear: {
    label: "Knitwear",
    headline: "Softly",
    sub: "58 knits in cashmere, merino and organic cotton — warm without weight.",
    accent: "#c4b5d4",
    heroGradient: "linear-gradient(135deg,#e4dded 0%,#c4b5d444 100%)",
    editorialNote: "Warmth as an art form.",
  },
  accessories: {
    label: "Accessories",
    headline: "Finished",
    sub: "93 objects of quiet luxury — scarves, belts, hats and more.",
    accent: "#d4c4a0",
    heroGradient: "linear-gradient(135deg,#ede8d5 0%,#d4c4a033 100%)",
    editorialNote: "The detail that defines the whole.",
  },
  "new-arrivals": {
    label: "New Arrivals",
    headline: "Just In",
    sub: "The latest from our ateliers — delivered to our shelves every Friday.",
    accent: "#c9a96e",
    heroGradient: "linear-gradient(135deg,#faf7f2 0%,#e8d5b044 100%)",
    editorialNote: "First to know. First to wear.",
  },
};

const DEFAULT_META = {
  label: "Collection",
  headline: "Curated",
  sub: "A considered selection of timeless pieces.",
  accent: "#c9a96e",
  heroGradient: "linear-gradient(135deg,#e8ddd0 0%,#d4c4b0 100%)",
  editorialNote: "Dressed with intention.",
};

// ─── Product Data ─────────────────────────────────────────────────────────────
const ALL_PRODUCTS = [
  { id: 1,  name: "Silk Slip Dress",         price: 285, originalPrice: null, category: "dresses",     tag: "Bestseller", color: "#e8d5c0", colors: ["#d4b5a0","#2d2d2d","#b8c4bb"], reviews: 142, sizes: ["XS","S","M","L"] },
  { id: 2,  name: "Linen Wide Trousers",     price: 195, originalPrice: 240, category: "trousers",    tag: "Sale",       color: "#c8d5c0", colors: ["#c8d5c0","#2d2d2d","#d4b5a0"], reviews: 87,  sizes: ["S","M","L","XL"] },
  { id: 3,  name: "Cashmere Turtleneck",     price: 320, originalPrice: null, category: "knitwear",    tag: "New",        color: "#d0c8d5", colors: ["#d0c8d5","#2d2d2d","#e8d5c0"], reviews: 53,  sizes: ["XS","S","M"] },
  { id: 4,  name: "Wrap Blazer",             price: 410, originalPrice: null, category: "outerwear",   tag: "New",        color: "#d5d0c0", colors: ["#d5d0c0","#2d2d2d"],           reviews: 29,  sizes: ["S","M","L"] },
  { id: 5,  name: "Fluid Midi Skirt",        price: 175, originalPrice: null, category: "dresses",     tag: null,         color: "#ddc5b5", colors: ["#ddc5b5","#b8c4bb","#c9a96e"], reviews: 142, sizes: ["XS","S","M","L","XL"] },
  { id: 6,  name: "Oversized Linen Shirt",   price: 145, originalPrice: null, category: "tops",        tag: null,         color: "#c5ddc5", colors: ["#c5ddc5","#f5f0e8","#2d2d2d"], reviews: 98,  sizes: ["S","M","L","XL","XXL"] },
  { id: 7,  name: "Cropped Wool Jacket",     price: 390, originalPrice: null, category: "outerwear",   tag: null,         color: "#c5c5dd", colors: ["#c5c5dd","#2d2d2d"],           reviews: 76,  sizes: ["XS","S","M"] },
  { id: 8,  name: "Satin Cami Top",          price: 95,  originalPrice: null, category: "tops",        tag: "Bestseller", color: "#ddd5c5", colors: ["#ddd5c5","#2d2d2d","#ddc5c5"], reviews: 203, sizes: ["XS","S","M","L"] },
  { id: 9,  name: "Tailored Shorts",         price: 160, originalPrice: null, category: "trousers",    tag: null,         color: "#c5ddd5", colors: ["#c5ddd5","#d4b5a0","#2d2d2d"], reviews: 55,  sizes: ["S","M","L"] },
  { id: 10, name: "Ribbed Maxi Dress",       price: 255, originalPrice: null, category: "dresses",     tag: "New",        color: "#ddc5d0", colors: ["#ddc5d0","#2d2d2d","#b8c4bb"], reviews: 187, sizes: ["XS","S","M","L","XL"] },
  { id: 11, name: "Silk Scarf",              price: 85,  originalPrice: null, category: "accessories", tag: null,         color: "#e8d5b0", colors: ["#e8d5b0","#ddc5c5","#b8c4bb"], reviews: 64,  sizes: [] },
  { id: 12, name: "Leather Belt",            price: 115, originalPrice: null, category: "accessories", tag: "New",        color: "#c0ae98", colors: ["#c0ae98","#2d2d2d"],           reviews: 38,  sizes: [] },
  { id: 13, name: "Wide-Brim Hat",           price: 135, originalPrice: null, category: "accessories", tag: null,         color: "#d4c4b0", colors: ["#d4c4b0","#2d2d2d"],           reviews: 47,  sizes: [] },
  { id: 14, name: "Pleated Midi Dress",      price: 310, originalPrice: null, category: "dresses",     tag: "New",        color: "#b8ccc4", colors: ["#b8ccc4","#ddc5d0","#2d2d2d"], reviews: 31,  sizes: ["XS","S","M","L"] },
  { id: 15, name: "Merino Cardigan",         price: 275, originalPrice: null, category: "knitwear",    tag: null,         color: "#c8d5e0", colors: ["#c8d5e0","#ddd5c5","#2d2d2d"], reviews: 112, sizes: ["XS","S","M","L","XL"] },
  { id: 16, name: "Linen Co-ord Set",        price: 320, originalPrice: null, category: "tops",        tag: "Bestseller", color: "#e0dac8", colors: ["#e0dac8","#c5ddc5","#ddc5c5"], reviews: 89,  sizes: ["S","M","L"] },
  { id: 17, name: "Silk Blouse",             price: 210, originalPrice: null, category: "tops",        tag: "New",        color: "#e8d5d5", colors: ["#e8d5d5","#2d2d2d","#c8d5e0"], reviews: 44,  sizes: ["XS","S","M","L"] },
  { id: 18, name: "Straight-Leg Trousers",   price: 220, originalPrice: 280, category: "trousers",    tag: "Sale",       color: "#d0d5c8", colors: ["#d0d5c8","#2d2d2d"],           reviews: 66,  sizes: ["XS","S","M","L","XL"] },
  { id: 19, name: "Double-Breasted Coat",    price: 590, originalPrice: null, category: "outerwear",   tag: "New",        color: "#c8c0b8", colors: ["#c8c0b8","#2d2d2d","#d4b5a0"], reviews: 18,  sizes: ["XS","S","M","L"] },
  { id: 20, name: "Alpaca Ribbed Pullover",  price: 340, originalPrice: null, category: "knitwear",    tag: null,         color: "#e0d8cc", colors: ["#e0d8cc","#c4b5d4","#2d2d2d"], reviews: 73,  sizes: ["XS","S","M","L"] },
];

const SIZES = ["XS","S","M","L","XL","XXL"];
const SORT_OPTIONS = ["Newest","Bestselling","Price: Low–High","Price: High–Low"];

type Product = typeof ALL_PRODUCTS[0];

// ─── Hooks ────────────────────────────────────────────────────────────────────
function useInView(ref: React.RefObject<Element | null>, threshold = 0.15) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); observer.disconnect(); } },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, threshold]);
  return inView;
}

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ product, index, accent }: { product: Product; index: number; accent: string }) {
  const [wishlisted, setWishlisted] = useState(false);
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);

  return (
    <div
      ref={ref}
      className="cat-product-card"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.55s ${index * 0.07}s ease, transform 0.55s ${index * 0.07}s ease`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="cat-card-img-wrap">
        <div
          className="cat-card-img"
          style={{ background: product.color, transform: hovered ? "scale(1.05)" : "scale(1)" }}
        >
          <span className="cat-card-img-placeholder">Product Image</span>
        </div>

        {/* Tag */}
        {product.tag && (
          <span
            className={`cat-card-tag ${
              product.tag === "Sale" ? "tag-sale" :
              product.tag === "Bestseller" ? "tag-best" : "tag-new"
            }`}
          >
            {product.tag}
          </span>
        )}

        {/* Hover overlay */}
        <div className="cat-card-overlay" style={{ opacity: hovered ? 1 : 0 }}>
          <button
            className="cat-wishlist-btn"
            onClick={() => setWishlisted(!wishlisted)}
            aria-label="Wishlist"
            style={{ color: wishlisted ? accent : undefined, borderColor: wishlisted ? accent : undefined }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill={wishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
          <button className="cat-quick-view-btn">Quick View</button>
        </div>

        {/* Add to cart bar */}
        <button
          className="cat-add-btn"
          style={{
            transform: hovered ? "translateY(0)" : "translateY(100%)",
            background: accent === "#c9a96e" ? "var(--charcoal)" : "var(--charcoal)",
          }}
        >
          Add to Cart
        </button>
      </div>

      {/* Info */}
      <div className="cat-card-info">
        <div className="cat-card-meta-row">
          <div className="cat-card-colors">
            {product.colors.map((c) => (
              <button
                key={c}
                className="cat-color-dot"
                style={{ background: c }}
                aria-label="colour"
              />
            ))}
          </div>
          {product.reviews > 0 && (
            <span className="cat-card-reviews" style={{ color: accent }}>
              ★ {product.reviews}
            </span>
          )}
        </div>
        <h3 className="cat-card-name">{product.name}</h3>
        <div className="cat-card-price-row">
          <span className="cat-card-price">${product.price}</span>
          {product.originalPrice && (
            <span className="cat-card-original">${product.originalPrice}</span>
          )}
        </div>
        {product.sizes.length > 0 && (
          <div className="cat-card-sizes">
            {product.sizes.map((s) => (
              <span key={s} className="cat-size-chip">{s}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Filter Panel ─────────────────────────────────────────────────────────────
function FilterPanel({
  accent,
  selectedSizes,
  toggleSize,
  selectedPrices,
  togglePrice,
  onClear,
  activeCount,
}: {
  accent: string;
  selectedSizes: string[];
  toggleSize: (s: string) => void;
  selectedPrices: string[];
  togglePrice: (p: string) => void;
  onClear: () => void;
  activeCount: number;
}) {
  const [open, setOpen] = useState({ size: true, price: true });

  return (
    <aside className="cat-filter-panel">
      <div className="cat-filter-head">
        <h3 className="cat-filter-title">Refine</h3>
        {activeCount > 0 && (
          <button className="cat-filter-clear" style={{ color: accent }} onClick={onClear}>
            Clear ({activeCount})
          </button>
        )}
      </div>

      {/* Size */}
      <div className="cat-filter-group">
        <button className="cat-filter-group-btn" onClick={() => setOpen(p => ({ ...p, size: !p.size }))}>
          <span>Size</span>
          <span className="cat-chevron">{open.size ? "−" : "+"}</span>
        </button>
        {open.size && (
          <div className="cat-size-grid">
            {SIZES.map((s) => (
              <button
                key={s}
                className="cat-size-btn"
                onClick={() => toggleSize(s)}
                style={
                  selectedSizes.includes(s)
                    ? { background: accent, color: "#fff", borderColor: accent }
                    : {}
                }
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Price */}
      <div className="cat-filter-group">
        <button className="cat-filter-group-btn" onClick={() => setOpen(p => ({ ...p, price: !p.price }))}>
          <span>Price</span>
          <span className="cat-chevron">{open.price ? "−" : "+"}</span>
        </button>
        {open.price && (
          <div className="cat-price-list">
            {["Under $100","$100–$200","$200–$350","$350–$500","Over $500"].map((p) => (
              <label key={p} className="cat-price-option">
                <input
                  type="checkbox"
                  checked={selectedPrices.includes(p)}
                  onChange={() => togglePrice(p)}
                  style={{ accentColor: accent }}
                />
                <span>{p}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Sustainability toggle */}
      <div className="cat-sustain-row">
        <span style={{ color: accent }}>✦</span>
        <span>Sustainable only</span>
        <label className="cat-toggle">
          <input type="checkbox" />
          <span className="cat-toggle-track" style={{ "--tog-accent": accent } as React.CSSProperties} />
        </label>
      </div>
    </aside>
  );
}

// ─── Editorial Interlude ──────────────────────────────────────────────────────
function EditorialInterlude({
  note,
  accent,
  gradient,
}: {
  note: string;
  accent: string;
  gradient: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  return (
    <div
      ref={ref}
      className="cat-editorial-interlude"
      style={{
        background: gradient,
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
      }}
    >
      <div className="interlude-line" style={{ background: accent }} />
      <p className="interlude-text" style={{ color: accent }}>{note}</p>
      <div className="interlude-line" style={{ background: accent }} />
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const meta = CATEGORY_META[slug] ?? DEFAULT_META;

  const [sort, setSort] = useState("Newest");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const toggleSize = (s: string) =>
    setSelectedSizes((p) => p.includes(s) ? p.filter((x) => x !== s) : [...p, s]);
  const togglePrice = (p: string) =>
    setSelectedPrices((prev) => prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]);
  const clearFilters = () => { setSelectedSizes([]); setSelectedPrices([]); };
  const activeFilterCount = selectedSizes.length + selectedPrices.length;

  // Filter products
  let products = ALL_PRODUCTS.filter((p) => {
    if (slug === "new-arrivals") return p.tag === "New";
    if (slug !== "all" && p.category !== slug) return false;
    if (selectedSizes.length > 0 && !selectedSizes.some((s) => p.sizes.includes(s))) return false;
    return true;
  });

  // Sort
  if (sort === "Price: Low–High") products = [...products].sort((a, b) => a.price - b.price);
  else if (sort === "Price: High–Low") products = [...products].sort((a, b) => b.price - a.price);
  else if (sort === "Bestselling") products = [...products].sort((a, b) => b.reviews - a.reviews);

  // Split for editorial break (insert after 6 products)
  const firstBatch = products.slice(0, 6);
  const secondBatch = products.slice(6);

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="cat-page">

        {/* ── Hero ── */}
        <section className="cat-hero" style={{ background: meta.heroGradient }}>
          <div className="cat-hero-inner">
            {/* Breadcrumb */}
            <nav className="cat-breadcrumb">
              <Link href="/">Home</Link>
              <span className="cat-sep">·</span>
              <Link href="/shop">Shop</Link>
              <span className="cat-sep">·</span>
              <span>{meta.label}</span>
            </nav>

            {/* Headline */}
            <div className="cat-hero-text">
              <h1 className="cat-hero-title">
                <span className="cat-hero-title-plain">{meta.headline}</span>
                <em className="cat-hero-title-em" style={{ color: meta.accent }}>
                  {" "}{meta.label}
                </em>
              </h1>
              <p className="cat-hero-sub">{meta.sub}</p>
            </div>

            {/* Deco */}
            <div className="cat-hero-deco">
              {[0.8, 1, 0.6, 0.9, 0.7].map((h, i) => (
                <div
                  key={i}
                  className="cat-deco-bar"
                  style={{
                    height: `${h * 80}px`,
                    background: meta.accent,
                    opacity: 0.18 + i * 0.04,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ── Toolbar ── */}
        <div className="cat-toolbar">
          <div className="cat-toolbar-left">
            <span className="cat-count">{products.length} pieces</span>
            {activeFilterCount > 0 && (
              <button className="cat-active-badge" style={{ background: meta.accent }} onClick={clearFilters}>
                {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""} ×
              </button>
            )}
          </div>
          <div className="cat-toolbar-right">
            {/* Mobile filter toggle */}
            <button
              className="cat-mobile-filter-btn"
              onClick={() => setShowMobileFilter(!showMobileFilter)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="4" y1="6" x2="20" y2="6"/>
                <line x1="8" y1="12" x2="20" y2="12"/>
                <line x1="12" y1="18" x2="20" y2="18"/>
              </svg>
              Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </button>

            {/* Sort */}
            <div className="cat-sort-wrap">
              <label className="cat-sort-label">Sort</label>
              <div className="cat-sort-select-wrap">
                <select
                  className="cat-sort-select"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  {SORT_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                </select>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="cat-sort-chevron">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* ── Mobile Filter Drawer ── */}
        {showMobileFilter && (
          <div className="cat-mobile-filter-drawer">
            <FilterPanel
              accent={meta.accent}
              selectedSizes={selectedSizes}
              toggleSize={toggleSize}
              selectedPrices={selectedPrices}
              togglePrice={togglePrice}
              onClear={clearFilters}
              activeCount={activeFilterCount}
            />
          </div>
        )}

        {/* ── Main Layout ── */}
        <div className="cat-layout">
          {/* Desktop filter sidebar */}
          <div className="cat-sidebar-wrap">
            <FilterPanel
              accent={meta.accent}
              selectedSizes={selectedSizes}
              toggleSize={toggleSize}
              selectedPrices={selectedPrices}
              togglePrice={togglePrice}
              onClear={clearFilters}
              activeCount={activeFilterCount}
            />
          </div>

          {/* Product area */}
          <div className="cat-products-area">
            {products.length === 0 ? (
              <div className="cat-empty">
                <div className="cat-empty-icon" style={{ color: meta.accent }}>✦</div>
                <h3 className="cat-empty-title">No pieces found</h3>
                <p className="cat-empty-sub">Try adjusting your filters.</p>
                <button className="btn-primary" onClick={clearFilters}>Clear Filters</button>
              </div>
            ) : (
              <>
                {/* First batch */}
                <div className="cat-grid">
                  {firstBatch.map((p, i) => (
                    <ProductCard key={p.id} product={p} index={i} accent={meta.accent} />
                  ))}
                </div>

                {/* Editorial interlude between batches */}
                {secondBatch.length > 0 && (
                  <EditorialInterlude
                    note={meta.editorialNote}
                    accent={meta.accent}
                    gradient={meta.heroGradient}
                  />
                )}

                {/* Second batch */}
                {secondBatch.length > 0 && (
                  <div className="cat-grid">
                    {secondBatch.map((p, i) => (
                      <ProductCard key={p.id} product={p} index={i} accent={meta.accent} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* ── Related Categories ── */}
        <section className="cat-related">
          <div className="cat-related-header">
            <div className="cat-related-line" />
            <h2 className="cat-related-title">Explore More</h2>
            <div className="cat-related-line" />
          </div>
          <div className="cat-related-grid">
            {Object.entries(CATEGORY_META)
              .filter(([k]) => k !== slug && k !== "new-arrivals")
              .slice(0, 4)
              .map(([k, v]) => (
                <Link key={k} href={`/category/${k}`} className="cat-related-card">
                  <div
                    className="cat-related-img"
                    style={{ background: v.heroGradient }}
                  />
                  <div className="cat-related-info">
                    <span className="cat-related-name">{v.label}</span>
                    <span className="cat-related-arrow" style={{ color: v.accent }}>→</span>
                  </div>
                </Link>
              ))}
          </div>
        </section>
      </main>

      <Footer />

      <style>{`
        /* ── Category Page ── */
        .cat-page { overflow-x: hidden; }

        /* ── Hero ── */
        .cat-hero {
          padding: 60px 60px 52px;
          position: relative;
          overflow: hidden;
          border-bottom: 1px solid var(--border);
        }
        .cat-hero-inner {
          position: relative;
          z-index: 1;
        }
        .cat-breadcrumb {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 28px;
        }
        .cat-breadcrumb a:hover { color: var(--charcoal); }
        .cat-sep { color: var(--border); }

        .cat-hero-text { max-width: 640px; }
        .cat-hero-title {
          font-family: var(--font-display);
          font-size: clamp(48px, 6vw, 80px);
          font-weight: 400;
          line-height: 1.0;
          color: var(--charcoal);
          margin-bottom: 16px;
          animation: fadeUp 0.7s ease both;
        }
        .cat-hero-title-plain { font-style: normal; }
        .cat-hero-title-em   { font-style: italic; }
        .cat-hero-sub {
          font-family: var(--font-editorial);
          font-size: 17px;
          font-weight: 300;
          color: var(--muted);
          line-height: 1.7;
          animation: fadeUp 0.7s 0.12s ease both;
        }

        /* Deco bars */
        .cat-hero-deco {
          position: absolute;
          right: 60px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          align-items: flex-end;
          gap: 10px;
        }
        .cat-deco-bar {
          width: 3px;
          border-radius: 2px;
          animation: growBar 0.9s ease both;
          transform-origin: bottom;
        }
        @keyframes growBar {
          from { transform: scaleY(0); }
          to   { transform: scaleY(1); }
        }

        /* ── Toolbar ── */
        .cat-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 60px;
          border-bottom: 1px solid var(--border);
          background: var(--cream);
          position: sticky;
          top: 65px;
          z-index: 90;
          gap: 16px;
          flex-wrap: wrap;
        }
        .cat-toolbar-left { display: flex; align-items: center; gap: 12px; }
        .cat-count {
          font-size: 13px;
          color: var(--muted);
        }
        .cat-active-badge {
          font-size: 11px;
          color: white;
          padding: 4px 10px;
          border-radius: 20px;
          letter-spacing: 0.06em;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        .cat-active-badge:hover { opacity: 0.8; }

        .cat-toolbar-right { display: flex; align-items: center; gap: 20px; }
        .cat-mobile-filter-btn {
          display: none;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--charcoal-light);
          border: 1px solid var(--border);
          padding: 8px 14px;
          transition: all 0.2s;
        }
        .cat-mobile-filter-btn:hover { border-color: var(--charcoal); color: var(--charcoal); }

        .cat-sort-wrap { display: flex; align-items: center; gap: 8px; }
        .cat-sort-label {
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted);
        }
        .cat-sort-select-wrap { position: relative; }
        .cat-sort-select {
          appearance: none;
          border: 1px solid var(--border);
          background: transparent;
          padding: 8px 28px 8px 12px;
          font-size: 13px;
          color: var(--charcoal);
          font-family: var(--font-body);
          cursor: pointer;
          outline: none;
        }
        .cat-sort-select:hover { border-color: var(--charcoal); }
        .cat-sort-chevron {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: var(--muted);
        }

        /* ── Mobile Filter Drawer ── */
        .cat-mobile-filter-drawer {
          display: none;
          padding: 20px 20px;
          border-bottom: 1px solid var(--border);
          background: var(--cream-dark);
        }

        /* ── Layout ── */
        .cat-layout {
          display: grid;
          grid-template-columns: 220px 1fr;
          gap: 0;
          padding: 48px 60px;
          align-items: start;
        }

        /* ── Sidebar ── */
        .cat-sidebar-wrap {
          border-right: 1px solid var(--border);
          padding-right: 36px;
          position: sticky;
          top: 120px;
        }
        .cat-filter-panel {}
        .cat-filter-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .cat-filter-title {
          font-family: var(--font-display);
          font-size: 18px;
          font-weight: 400;
          color: var(--charcoal);
        }
        .cat-filter-clear {
          font-size: 12px;
          text-decoration: underline;
          cursor: pointer;
          letter-spacing: 0.04em;
        }
        .cat-filter-group {
          border-top: 1px solid var(--border);
          padding: 16px 0;
        }
        .cat-filter-group-btn {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--charcoal);
          padding-bottom: 12px;
        }
        .cat-chevron { font-size: 16px; color: var(--muted); }
        .cat-size-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 6px;
        }
        .cat-size-btn {
          padding: 8px 4px;
          border: 1px solid var(--border);
          font-size: 11px;
          color: var(--charcoal-light);
          letter-spacing: 0.06em;
          transition: all 0.18s;
        }
        .cat-size-btn:hover { border-color: var(--charcoal); color: var(--charcoal); }
        .cat-price-list { display: flex; flex-direction: column; gap: 10px; }
        .cat-price-option {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: var(--charcoal-light);
          cursor: pointer;
        }
        .cat-price-option input { cursor: pointer; }
        .cat-sustain-row {
          border-top: 1px solid var(--border);
          padding-top: 16px;
          margin-top: 4px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: var(--muted);
        }
        .cat-toggle { margin-left: auto; }
        .cat-toggle input { display: none; }
        .cat-toggle-track {
          display: block;
          width: 34px;
          height: 18px;
          background: var(--border);
          border-radius: 9px;
          cursor: pointer;
          position: relative;
          transition: background 0.2s;
        }
        .cat-toggle-track::after {
          content: "";
          position: absolute;
          width: 12px;
          height: 12px;
          background: white;
          border-radius: 50%;
          top: 3px;
          left: 3px;
          transition: transform 0.2s;
        }
        .cat-toggle input:checked + .cat-toggle-track {
          background: var(--tog-accent, var(--charcoal));
        }
        .cat-toggle input:checked + .cat-toggle-track::after {
          transform: translateX(16px);
        }

        /* ── Products Area ── */
        .cat-products-area { padding-left: 44px; }
        .cat-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px 20px;
          margin-bottom: 48px;
        }

        /* ── Product Card ── */
        .cat-product-card { cursor: pointer; }
        .cat-card-img-wrap {
          position: relative;
          overflow: hidden;
          margin-bottom: 14px;
        }
        .cat-card-img {
          height: 360px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.55s ease;
        }
        .cat-card-img-placeholder {
          font-family: var(--font-editorial);
          font-size: 12px;
          color: rgba(0,0,0,0.25);
          letter-spacing: 0.1em;
        }
        .cat-card-tag {
          position: absolute;
          top: 12px;
          left: 12px;
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 4px 10px;
          font-weight: 500;
        }
        .cat-card-overlay {
          position: absolute;
          top: 12px;
          right: 12px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          transition: opacity 0.25s;
        }
        .cat-wishlist-btn {
          width: 34px;
          height: 34px;
          background: white;
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .cat-wishlist-btn:hover { background: var(--charcoal); color: white; border-color: var(--charcoal); }
        .cat-quick-view-btn {
          background: white;
          border: 1px solid var(--border);
          padding: 6px 10px;
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          white-space: nowrap;
          transition: all 0.2s;
        }
        .cat-quick-view-btn:hover { background: var(--charcoal); color: white; border-color: var(--charcoal); }
        .cat-add-btn {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          color: var(--cream);
          padding: 13px;
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          transition: transform 0.3s ease;
        }

        .cat-card-info {}
        .cat-card-meta-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 5px;
        }
        .cat-card-colors { display: flex; gap: 6px; }
        .cat-color-dot {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 2px solid transparent;
          box-shadow: 0 0 0 1px rgba(0,0,0,0.12);
          cursor: pointer;
          transition: transform 0.15s;
        }
        .cat-color-dot:hover { transform: scale(1.2); }
        .cat-card-reviews { font-size: 12px; }
        .cat-card-name {
          font-family: var(--font-display);
          font-size: 15px;
          font-weight: 400;
          color: var(--charcoal);
          margin-bottom: 5px;
        }
        .cat-card-price-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }
        .cat-card-price { font-size: 14px; color: var(--charcoal); }
        .cat-card-original { font-size: 12px; color: var(--muted); text-decoration: line-through; }
        .cat-card-sizes { display: flex; gap: 4px; flex-wrap: wrap; }
        .cat-size-chip {
          font-size: 10px;
          letter-spacing: 0.06em;
          color: var(--muted);
          border: 1px solid var(--border);
          padding: 2px 6px;
        }

        /* ── Editorial Interlude ── */
        .cat-editorial-interlude {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 28px;
          padding: 40px 0 48px;
          margin-bottom: 0;
        }
        .interlude-line { flex: 1; height: 1px; max-width: 80px; }
        .interlude-text {
          font-family: var(--font-editorial);
          font-size: 18px;
          font-style: italic;
          font-weight: 300;
          letter-spacing: 0.04em;
          white-space: nowrap;
        }

        /* ── Empty ── */
        .cat-empty {
          text-align: center;
          padding: 80px 40px;
        }
        .cat-empty-icon { font-size: 28px; margin-bottom: 16px; }
        .cat-empty-title {
          font-family: var(--font-display);
          font-size: 22px;
          font-weight: 400;
          color: var(--charcoal);
          margin-bottom: 8px;
        }
        .cat-empty-sub {
          font-family: var(--font-editorial);
          font-size: 15px;
          color: var(--muted);
          margin-bottom: 28px;
        }

        /* ── Related Categories ── */
        .cat-related { padding: 60px 60px 80px; border-top: 1px solid var(--border); }
        .cat-related-header {
          display: flex;
          align-items: center;
          gap: 24px;
          margin-bottom: 40px;
        }
        .cat-related-line { flex: 1; height: 1px; background: var(--border); }
        .cat-related-title {
          font-family: var(--font-display);
          font-size: 26px;
          font-weight: 400;
          color: var(--charcoal);
          white-space: nowrap;
        }
        .cat-related-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        .cat-related-card {
          display: block;
          cursor: pointer;
          transition: transform 0.25s;
        }
        .cat-related-card:hover { transform: translateY(-4px); }
        .cat-related-img {
          height: 200px;
          border-radius: 2px;
          margin-bottom: 12px;
          transition: filter 0.25s;
        }
        .cat-related-card:hover .cat-related-img { filter: brightness(0.96); }
        .cat-related-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .cat-related-name {
          font-family: var(--font-display);
          font-size: 15px;
          font-weight: 400;
          color: var(--charcoal);
        }
        .cat-related-arrow {
          font-size: 18px;
          transition: transform 0.2s;
        }
        .cat-related-card:hover .cat-related-arrow { transform: translateX(4px); }

        /* ── Tag Colours ── */
        .tag-sale { background: #c0392b; color: white; }
        .tag-best { background: var(--gold); color: white; }
        .tag-new  { background: var(--charcoal); color: var(--cream); }

        /* ── Responsive ── */
        @media (max-width: 1100px) {
          .cat-layout { grid-template-columns: 200px 1fr; padding: 40px 40px; }
          .cat-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 900px) {
          .cat-hero { padding: 48px 40px 44px; }
          .cat-hero-deco { display: none; }
          .cat-toolbar { padding: 14px 40px; }
          .cat-layout { grid-template-columns: 1fr; padding: 0 20px 40px; }
          .cat-sidebar-wrap { display: none; }
          .cat-products-area { padding-left: 0; padding-top: 24px; }
          .cat-mobile-filter-btn { display: flex; }
          .cat-mobile-filter-drawer { display: block; }
          .cat-related { padding: 48px 40px 60px; }
          .cat-related-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .cat-hero { padding: 40px 20px 36px; }
          .cat-toolbar { padding: 12px 20px; }
          .cat-grid { grid-template-columns: repeat(2, 1fr); gap: 16px 10px; }
          .cat-card-img { height: 260px; }
          .cat-related { padding: 40px 20px 56px; }
          .cat-related-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .cat-related-img { height: 140px; }
          .interlude-text { font-size: 15px; }
        }
      `}</style>
    </>
  );
}