"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ─── All Products Pool ────────────────────────────────────────────────────────
const ALL_PRODUCTS = [
  { id: 1,  name: "Silk Slip Dress",         price: 285, originalPrice: null, category: "Dresses",     tag: "Bestseller", color: "#e8d5c0", colors: ["#d4b5a0","#2d2d2d","#b8c4bb"], reviews: 142, sizes: ["XS","S","M","L"] },
  { id: 2,  name: "Linen Wide Trousers",     price: 195, originalPrice: 240,  category: "Trousers",    tag: "Sale",       color: "#c8d5c0", colors: ["#c8d5c0","#2d2d2d","#d4b5a0"], reviews: 87,  sizes: ["S","M","L","XL"] },
  { id: 3,  name: "Cashmere Turtleneck",     price: 320, originalPrice: null, category: "Knitwear",    tag: "New",        color: "#d0c8d5", colors: ["#d0c8d5","#2d2d2d","#e8d5c0"], reviews: 53,  sizes: ["XS","S","M"] },
  { id: 4,  name: "Wrap Blazer",             price: 410, originalPrice: null, category: "Outerwear",   tag: "New",        color: "#d5d0c0", colors: ["#d5d0c0","#2d2d2d"],           reviews: 29,  sizes: ["S","M","L"] },
  { id: 5,  name: "Fluid Midi Skirt",        price: 175, originalPrice: null, category: "Dresses",     tag: null,         color: "#ddc5b5", colors: ["#ddc5b5","#b8c4bb","#c9a96e"], reviews: 142, sizes: ["XS","S","M","L","XL"] },
  { id: 6,  name: "Oversized Linen Shirt",   price: 145, originalPrice: null, category: "Tops",        tag: null,         color: "#c5ddc5", colors: ["#c5ddc5","#f5f0e8","#2d2d2d"], reviews: 98,  sizes: ["S","M","L","XL","XXL"] },
  { id: 7,  name: "Cropped Wool Jacket",     price: 390, originalPrice: null, category: "Outerwear",   tag: null,         color: "#c5c5dd", colors: ["#c5c5dd","#2d2d2d"],           reviews: 76,  sizes: ["XS","S","M"] },
  { id: 8,  name: "Satin Cami Top",          price: 95,  originalPrice: null, category: "Tops",        tag: "Bestseller", color: "#ddd5c5", colors: ["#ddd5c5","#2d2d2d","#ddc5c5"], reviews: 203, sizes: ["XS","S","M","L"] },
  { id: 9,  name: "Tailored Shorts",         price: 160, originalPrice: null, category: "Trousers",    tag: null,         color: "#c5ddd5", colors: ["#c5ddd5","#d4b5a0","#2d2d2d"], reviews: 55,  sizes: ["S","M","L"] },
  { id: 10, name: "Ribbed Maxi Dress",       price: 255, originalPrice: null, category: "Dresses",     tag: "New",        color: "#ddc5d0", colors: ["#ddc5d0","#2d2d2d","#b8c4bb"], reviews: 187, sizes: ["XS","S","M","L","XL"] },
  { id: 11, name: "Silk Scarf",              price: 85,  originalPrice: null, category: "Accessories", tag: null,         color: "#e8d5b0", colors: ["#e8d5b0","#ddc5c5","#b8c4bb"], reviews: 64,  sizes: [] },
  { id: 12, name: "Leather Belt",            price: 115, originalPrice: null, category: "Accessories", tag: "New",        color: "#c0ae98", colors: ["#c0ae98","#2d2d2d"],           reviews: 38,  sizes: [] },
  { id: 13, name: "Wide-Brim Hat",           price: 135, originalPrice: null, category: "Accessories", tag: null,         color: "#d4c4b0", colors: ["#d4c4b0","#2d2d2d"],           reviews: 47,  sizes: [] },
  { id: 14, name: "Pleated Midi Dress",      price: 310, originalPrice: null, category: "Dresses",     tag: "New",        color: "#b8ccc4", colors: ["#b8ccc4","#ddc5d0","#2d2d2d"], reviews: 31,  sizes: ["XS","S","M","L"] },
  { id: 15, name: "Merino Cardigan",         price: 275, originalPrice: null, category: "Knitwear",    tag: null,         color: "#c8d5e0", colors: ["#c8d5e0","#ddd5c5","#2d2d2d"], reviews: 112, sizes: ["XS","S","M","L","XL"] },
  { id: 16, name: "Linen Co-ord Set",        price: 320, originalPrice: null, category: "Tops",        tag: "Bestseller", color: "#e0dac8", colors: ["#e0dac8","#c5ddc5","#ddc5c5"], reviews: 89,  sizes: ["S","M","L"] },
  { id: 17, name: "Silk Blouse",             price: 210, originalPrice: null, category: "Tops",        tag: "New",        color: "#e8d5d5", colors: ["#e8d5d5","#2d2d2d","#c8d5e0"], reviews: 44,  sizes: ["XS","S","M","L"] },
  { id: 18, name: "Straight-Leg Trousers",   price: 220, originalPrice: 280,  category: "Trousers",    tag: "Sale",       color: "#d0d5c8", colors: ["#d0d5c8","#2d2d2d"],           reviews: 66,  sizes: ["XS","S","M","L","XL"] },
  { id: 19, name: "Double-Breasted Coat",    price: 590, originalPrice: null, category: "Outerwear",   tag: "New",        color: "#c8c0b8", colors: ["#c8c0b8","#2d2d2d","#d4b5a0"], reviews: 18,  sizes: ["XS","S","M","L"] },
  { id: 20, name: "Alpaca Ribbed Pullover",  price: 340, originalPrice: null, category: "Knitwear",    tag: null,         color: "#e0d8cc", colors: ["#e0d8cc","#c4b5d4","#2d2d2d"], reviews: 73,  sizes: ["XS","S","M","L"] },
];

const TRENDING = ["Silk Slip Dress", "Linen", "Cashmere", "New Arrivals", "Sale", "Wrap Blazer"];
const RECENT_SEARCHES_KEY = "me_recent_searches";

type Product = typeof ALL_PRODUCTS[0];

// ─── Search Logic ─────────────────────────────────────────────────────────────
function searchProducts(query: string): Product[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  return ALL_PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.tag && p.tag.toLowerCase().includes(q))
  ).sort((a, b) => {
    // Exact name match first
    const aExact = a.name.toLowerCase().startsWith(q) ? 0 : 1;
    const bExact = b.name.toLowerCase().startsWith(q) ? 0 : 1;
    return aExact - bExact || b.reviews - a.reviews;
  });
}

// ─── Highlight matching text ──────────────────────────────────────────────────
function Highlight({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="srch-highlight">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ product, query, index }: { product: Product; query: string; index: number }) {
  const [wishlisted, setWishlisted] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="srch-product-card"
      style={{ animationDelay: `${index * 0.06}s` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="srch-card-img-wrap">
        <div
          className="srch-card-img"
          style={{
            background: product.color,
            transform: hovered ? "scale(1.05)" : "scale(1)",
          }}
        >
          <span className="srch-card-img-label">Product Image</span>
        </div>

        {product.tag && (
          <span
            className={`product-tag ${
              product.tag === "Sale" ? "tag-sale" :
              product.tag === "Bestseller" ? "tag-best" : "tag-new"
            }`}
          >
            {product.tag}
          </span>
        )}

        <div className="srch-card-overlay" style={{ opacity: hovered ? 1 : 0 }}>
          <button
            className="srch-wish-btn"
            onClick={() => setWishlisted(!wishlisted)}
            style={wishlisted ? { background: "var(--charcoal)", color: "white" } : {}}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill={wishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>

        <button
          className="srch-add-btn"
          style={{ transform: hovered ? "translateY(0)" : "translateY(100%)" }}
        >
          Add to Cart
        </button>
      </div>

      <div className="srch-card-info">
        <div className="srch-card-meta">
          <span className="srch-card-cat">{product.category}</span>
          {product.reviews > 0 && <span className="srch-card-stars">★ {product.reviews}</span>}
        </div>
        <h3 className="srch-card-name">
          <Highlight text={product.name} query={query} />
        </h3>
        <div className="srch-card-price-row">
          <span className="srch-card-price">${product.price}</span>
          {product.originalPrice && (
            <span className="srch-card-orig">${product.originalPrice}</span>
          )}
        </div>
        <div className="srch-card-colors">
          {product.colors.map((c) => (
            <button key={c} className="color-dot" style={{ background: c }} aria-label="colour" />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Autocomplete Dropdown ────────────────────────────────────────────────────
function Autocomplete({
  query,
  results,
  onSelect,
  visible,
}: {
  query: string;
  results: Product[];
  onSelect: (name: string) => void;
  visible: boolean;
}) {
  if (!visible || !query.trim()) return null;

  const preview = results.slice(0, 5);

  return (
    <div className="srch-autocomplete">
      {preview.length === 0 ? (
        <div className="srch-auto-empty">
          <span>No results for &ldquo;{query}&rdquo;</span>
        </div>
      ) : (
        <>
          <div className="srch-auto-label">Products</div>
          {preview.map((p) => (
            <button
              key={p.id}
              className="srch-auto-item"
              onClick={() => onSelect(p.name)}
            >
              <div className="srch-auto-swatch" style={{ background: p.color }} />
              <div className="srch-auto-text">
                <span className="srch-auto-name">
                  <Highlight text={p.name} query={query} />
                </span>
                <span className="srch-auto-cat">{p.category} · ${p.price}</span>
              </div>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          ))}
          {results.length > 5 && (
            <div className="srch-auto-more">
              +{results.length - 5} more results
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── Empty / Zero State ───────────────────────────────────────────────────────
function NoResults({ query }: { query: string }) {
  return (
    <div className="srch-no-results">
      <div className="srch-no-results-ornament">✦</div>
      <h2 className="srch-no-results-title">
        No results for <em>&ldquo;{query}&rdquo;</em>
      </h2>
      <p className="srch-no-results-sub">
        Try a different spelling, a broader term, or browse our collections below.
      </p>
      <div className="srch-no-results-actions">
        <Link href="/shop" className="btn-primary">Browse All Pieces</Link>
        <Link href="/collections/new-arrivals" className="btn-ghost">New Arrivals</Link>
      </div>
    </div>
  );
}

// ─── Landing / Idle State ─────────────────────────────────────────────────────
function SearchLanding({
  recentSearches,
  onSearch,
  clearRecent,
}: {
  recentSearches: string[];
  onSearch: (q: string) => void;
  clearRecent: () => void;
}) {
  return (
    <div className="srch-landing">
      {/* Trending */}
      <div className="srch-landing-section">
        <h3 className="srch-landing-label">Trending Now</h3>
        <div className="srch-pill-row">
          {TRENDING.map((t) => (
            <button key={t} className="srch-pill" onClick={() => onSearch(t)}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Recent */}
      {recentSearches.length > 0 && (
        <div className="srch-landing-section">
          <div className="srch-landing-header">
            <h3 className="srch-landing-label">Recent Searches</h3>
            <button className="srch-clear-recent" onClick={clearRecent}>
              Clear
            </button>
          </div>
          <div className="srch-recent-list">
            {recentSearches.map((s) => (
              <button key={s} className="srch-recent-item" onClick={() => onSearch(s)}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
                {s}
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="srch-recent-arrow">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Category quick links */}
      <div className="srch-landing-section">
        <h3 className="srch-landing-label">Browse Categories</h3>
        <div className="srch-cat-grid">
          {[
            { label: "Dresses", accent: "#c9a96e", href: "/category/dresses" },
            { label: "Tops", accent: "#b8c4bb", href: "/category/tops" },
            { label: "Trousers", accent: "#d4b5a0", href: "/category/trousers" },
            { label: "Outerwear", accent: "#9aacb0", href: "/category/outerwear" },
            { label: "Knitwear", accent: "#c4b5d4", href: "/category/knitwear" },
            { label: "Accessories", accent: "#d4c4a0", href: "/category/accessories" },
          ].map((cat) => (
            <Link key={cat.label} href={cat.href} className="srch-cat-card">
              <div className="srch-cat-swatch" style={{ background: `${cat.accent}33` }}>
                <div className="srch-cat-swatch-inner" style={{ background: `${cat.accent}55` }} />
              </div>
              <span className="srch-cat-name">{cat.label}</span>
              <span className="srch-cat-arrow" style={{ color: cat.accent }}>→</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Filter bar ───────────────────────────────────────────────────────────────
const FILTER_CATEGORIES = ["All", "Dresses", "Tops", "Trousers", "Outerwear", "Knitwear", "Accessories"];
const SORT_OPTIONS = ["Relevance", "Bestselling", "Price: Low–High", "Price: High–Low", "Newest"];

function FilterBar({
  category,
  setCategory,
  sort,
  setSort,
  count,
}: {
  category: string;
  setCategory: (c: string) => void;
  sort: string;
  setSort: (s: string) => void;
  count: number;
}) {
  return (
    <div className="srch-filter-bar">
      <div className="srch-filter-left">
        {FILTER_CATEGORIES.map((c) => (
          <button
            key={c}
            className={`srch-filter-pill ${category === c ? "srch-filter-active" : ""}`}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="srch-filter-right">
        <span className="srch-result-count">{count} {count === 1 ? "result" : "results"}</span>
        <div className="srch-sort-wrap">
          <select
            className="srch-sort-select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            {SORT_OPTIONS.map((o) => <option key={o}>{o}</option>)}
          </select>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="srch-sort-chevron">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("Relevance");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent searches from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) setRecentSearches(JSON.parse(stored));
    } catch {}
  }, []);

  const saveSearch = useCallback((q: string) => {
    if (!q.trim()) return;
    setRecentSearches((prev) => {
      const updated = [q, ...prev.filter((s) => s !== q)].slice(0, 6);
      try { localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated)); } catch {}
      return updated;
    });
  }, []);

  const handleSubmit = useCallback((q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    setSubmittedQuery(trimmed);
    setCategory("All");
    setSort("Relevance");
    saveSearch(trimmed);
    setFocused(false);
    inputRef.current?.blur();
  }, [saveSearch]);

  const handleSearchClick = (q: string) => {
    setQuery(q);
    handleSubmit(q);
  };

  const clearRecent = () => {
    setRecentSearches([]);
    try { localStorage.removeItem(RECENT_SEARCHES_KEY); } catch {}
  };

  // Raw results
  const rawResults = searchProducts(submittedQuery);

  // Apply category filter
  let filtered = category === "All"
    ? rawResults
    : rawResults.filter((p) => p.category === category);

  // Apply sort
  if (sort === "Price: Low–High") filtered = [...filtered].sort((a, b) => a.price - b.price);
  else if (sort === "Price: High–Low") filtered = [...filtered].sort((a, b) => b.price - a.price);
  else if (sort === "Bestselling") filtered = [...filtered].sort((a, b) => b.reviews - a.reviews);
  else if (sort === "Newest") filtered = [...filtered].filter((p) => p.tag === "New").concat(filtered.filter((p) => p.tag !== "New"));

  // Autocomplete (always from raw, not filtered)
  const autoResults = searchProducts(query);

  const showResults = submittedQuery.length > 0;
  const showLanding = !showResults;

  return (
    <>
      <AnnouncementBar />
      <Navbar />

      <main className="srch-page">
        {/* ── Search Hero ── */}
        <section className="srch-hero">
          <div className="srch-hero-inner">
            <div className="srch-breadcrumb">
              <Link href="/">Home</Link>
              <span className="srch-sep">·</span>
              <span>Search</span>
            </div>

            <h1 className="srch-hero-title">
              {showResults ? (
                <>
                  Results for <em>&ldquo;{submittedQuery}&rdquo;</em>
                </>
              ) : (
                <>
                  What are you <em>looking for?</em>
                </>
              )}
            </h1>

            {/* Search Input */}
            <div className="srch-input-wrap" style={{ zIndex: focused ? 101 : 10 }}>
              <div className={`srch-input-box ${focused ? "srch-input-focused" : ""}`}>
                <svg className="srch-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  className="srch-input"
                  placeholder="Search pieces, categories, materials…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setTimeout(() => setFocused(false), 200)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSubmit(query);
                    if (e.key === "Escape") { setFocused(false); inputRef.current?.blur(); }
                  }}
                  autoComplete="off"
                  spellCheck={false}
                />
                {query && (
                  <button
                    className="srch-clear-btn"
                    onClick={() => { setQuery(""); setSubmittedQuery(""); inputRef.current?.focus(); }}
                    aria-label="Clear search"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                )}
                <button className="srch-submit-btn" onClick={() => handleSubmit(query)}>
                  Search
                </button>
              </div>

              {/* Autocomplete */}
              {focused && (
                <Autocomplete
                  query={query}
                  results={autoResults}
                  onSelect={handleSearchClick}
                  visible={focused && query.length > 0}
                />
              )}
            </div>

            {/* Backdrop for autocomplete */}
            {focused && <div className="srch-backdrop" onClick={() => setFocused(false)} />}
          </div>
        </section>

        {/* ── Content ── */}
        <div className="srch-content">
          {showLanding && (
            <SearchLanding
              recentSearches={recentSearches}
              onSearch={handleSearchClick}
              clearRecent={clearRecent}
            />
          )}

          {showResults && rawResults.length === 0 && (
            <NoResults query={submittedQuery} />
          )}

          {showResults && rawResults.length > 0 && (
            <>
              <FilterBar
                category={category}
                setCategory={setCategory}
                sort={sort}
                setSort={setSort}
                count={filtered.length}
              />

              {filtered.length === 0 ? (
                <div className="srch-cat-empty">
                  <p>No {category} results for &ldquo;{submittedQuery}&rdquo;.</p>
                  <button className="btn-ghost" onClick={() => setCategory("All")}>
                    Show all {rawResults.length} results
                  </button>
                </div>
              ) : (
                <div className="srch-results-grid">
                  {filtered.map((p, i) => (
                    <ProductCard key={p.id} product={p} query={submittedQuery} index={i} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />

      <style>{`
        /* ── Page ── */
        .srch-page {
          background: var(--cream);
          min-height: 80vh;
        }

        /* ── Hero ── */
        .srch-hero {
          background: var(--cream-dark);
          border-bottom: 1px solid var(--border);
          padding: 56px 60px 52px;
          position: relative;
        }
        .srch-hero-inner {
          max-width: 820px;
        }
        .srch-breadcrumb {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 24px;
        }
        .srch-breadcrumb a:hover { color: var(--gold); transition: color 0.2s; }
        .srch-sep { color: var(--border); }

        .srch-hero-title {
          font-family: var(--font-display);
          font-size: clamp(36px, 4.5vw, 60px);
          font-weight: 400;
          color: var(--charcoal);
          line-height: 1.08;
          margin-bottom: 36px;
          animation: fadeUp 0.6s ease both;
        }
        .srch-hero-title em {
          font-style: italic;
          color: var(--gold);
        }

        /* ── Input ── */
        .srch-input-wrap {
          position: relative;
          max-width: 720px;
        }
        .srch-input-box {
          display: flex;
          align-items: center;
          gap: 0;
          border: 1px solid var(--border);
          background: var(--white);
          transition: border-color 0.2s, box-shadow 0.2s;
          animation: fadeUp 0.6s 0.1s ease both;
        }
        .srch-input-focused {
          border-color: var(--charcoal);
          box-shadow: 0 4px 24px rgba(26,26,26,0.08);
        }
        .srch-input-icon {
          flex-shrink: 0;
          margin-left: 18px;
          color: var(--muted);
        }
        .srch-input {
          flex: 1;
          padding: 18px 14px;
          border: none;
          background: transparent;
          font-size: 16px;
          color: var(--charcoal);
          font-family: var(--font-body);
          outline: none;
          min-width: 0;
        }
        .srch-input::placeholder { color: var(--muted); }
        .srch-clear-btn {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--muted);
          flex-shrink: 0;
          transition: color 0.2s;
          margin-right: 4px;
        }
        .srch-clear-btn:hover { color: var(--charcoal); }
        .srch-submit-btn {
          padding: 18px 28px;
          background: var(--charcoal);
          color: var(--cream);
          font-size: 12px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-family: var(--font-body);
          flex-shrink: 0;
          transition: background 0.2s;
          cursor: pointer;
          border: none;
        }
        .srch-submit-btn:hover { background: var(--gold); }

        /* ── Autocomplete ── */
        .srch-autocomplete {
          position: absolute;
          top: calc(100% + 4px);
          left: 0;
          right: 0;
          background: var(--white);
          border: 1px solid var(--border);
          box-shadow: 0 12px 40px rgba(26,26,26,0.12);
          z-index: 200;
          animation: fadeUp 0.2s ease both;
        }
        .srch-auto-label {
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--muted);
          padding: 12px 16px 8px;
          border-bottom: 1px solid var(--border);
        }
        .srch-auto-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          width: 100%;
          text-align: left;
          border-bottom: 1px solid var(--border);
          transition: background 0.15s;
          cursor: pointer;
          background: transparent;
          font-family: var(--font-body);
          border-left: none;
          border-right: none;
          border-top: none;
        }
        .srch-auto-item:last-of-type { border-bottom: none; }
        .srch-auto-item:hover { background: var(--cream-dark); }
        .srch-auto-swatch {
          width: 36px;
          height: 44px;
          flex-shrink: 0;
          border-radius: 1px;
        }
        .srch-auto-text {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .srch-auto-name {
          font-size: 14px;
          color: var(--charcoal);
        }
        .srch-auto-cat {
          font-size: 12px;
          color: var(--muted);
        }
        .srch-auto-empty {
          padding: 20px 16px;
          font-size: 14px;
          color: var(--muted);
          font-family: var(--font-editorial);
          font-style: italic;
        }
        .srch-auto-more {
          padding: 10px 16px;
          font-size: 12px;
          color: var(--muted);
          letter-spacing: 0.04em;
          background: var(--cream-dark);
          border-top: 1px solid var(--border);
        }

        /* ── Backdrop ── */
        .srch-backdrop {
          position: fixed;
          inset: 0;
          z-index: 100;
        }

        /* ── Highlight ── */
        .srch-highlight {
          background: transparent;
          color: var(--gold);
          font-style: normal;
        }

        /* ── Content ── */
        .srch-content {
          padding: 48px 60px 80px;
        }

        /* ── Landing ── */
        .srch-landing {
          display: flex;
          flex-direction: column;
          gap: 48px;
          max-width: 900px;
        }
        .srch-landing-section {}
        .srch-landing-label {
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 16px;
        }
        .srch-landing-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        .srch-clear-recent {
          font-size: 12px;
          color: var(--gold);
          text-decoration: underline;
          background: none;
          border: none;
          cursor: pointer;
          font-family: var(--font-body);
          transition: color 0.2s;
        }
        .srch-clear-recent:hover { color: var(--charcoal); }

        /* Trending pills */
        .srch-pill-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .srch-pill {
          padding: 9px 20px;
          border: 1px solid var(--border);
          font-size: 13px;
          color: var(--charcoal-light);
          background: var(--cream);
          font-family: var(--font-body);
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: 0.04em;
        }
        .srch-pill:hover {
          border-color: var(--charcoal);
          color: var(--charcoal);
          background: var(--cream-dark);
        }

        /* Recent list */
        .srch-recent-list {
          display: flex;
          flex-direction: column;
          border: 1px solid var(--border);
        }
        .srch-recent-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 13px 16px;
          border-bottom: 1px solid var(--border);
          font-size: 14px;
          color: var(--charcoal-light);
          background: var(--cream);
          font-family: var(--font-body);
          cursor: pointer;
          transition: background 0.15s;
          text-align: left;
          border-left: none;
          border-right: none;
          border-top: none;
        }
        .srch-recent-item:last-child { border-bottom: none; }
        .srch-recent-item:hover { background: var(--cream-dark); color: var(--charcoal); }
        .srch-recent-item svg:first-child { color: var(--muted); flex-shrink: 0; }
        .srch-recent-arrow {
          margin-left: auto;
          color: var(--muted);
          flex-shrink: 0;
        }

        /* Category quick links */
        .srch-cat-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 12px;
        }
        .srch-cat-card {
          display: flex;
          flex-direction: column;
          gap: 0;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .srch-cat-card:hover { transform: translateY(-3px); }
        .srch-cat-swatch {
          height: 140px;
          border-radius: 2px;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .srch-cat-swatch-inner {
          width: 50%;
          height: 50%;
          border-radius: 2px;
        }
        .srch-cat-name {
          font-family: var(--font-display);
          font-size: 15px;
          font-weight: 400;
          color: var(--charcoal);
          margin-bottom: 4px;
        }
        .srch-cat-arrow {
          font-size: 16px;
          transition: transform 0.2s;
        }
        .srch-cat-card:hover .srch-cat-arrow { transform: translateX(4px); }

        /* ── Filter Bar ── */
        .srch-filter-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 24px;
          border-bottom: 1px solid var(--border);
          margin-bottom: 40px;
          gap: 16px;
          flex-wrap: wrap;
        }
        .srch-filter-left {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }
        .srch-filter-pill {
          padding: 8px 18px;
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          border: 1px solid var(--border);
          color: var(--charcoal-light);
          background: transparent;
          font-family: var(--font-body);
          cursor: pointer;
          transition: all 0.18s;
        }
        .srch-filter-pill:hover { border-color: var(--charcoal); color: var(--charcoal); }
        .srch-filter-active {
          background: var(--charcoal);
          color: var(--cream);
          border-color: var(--charcoal);
        }
        .srch-filter-right {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-shrink: 0;
        }
        .srch-result-count {
          font-size: 13px;
          color: var(--muted);
          white-space: nowrap;
        }
        .srch-sort-wrap { position: relative; }
        .srch-sort-select {
          appearance: none;
          border: 1px solid var(--border);
          background: transparent;
          padding: 8px 28px 8px 12px;
          font-size: 13px;
          color: var(--charcoal);
          font-family: var(--font-body);
          cursor: pointer;
          outline: none;
          transition: border-color 0.2s;
        }
        .srch-sort-select:hover { border-color: var(--charcoal); }
        .srch-sort-chevron {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: var(--muted);
        }

        /* ── Results Grid ── */
        .srch-results-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 28px 20px;
        }

        /* ── Product Card ── */
        .srch-product-card {
          cursor: pointer;
          animation: fadeUp 0.5s ease both;
        }
        .srch-card-img-wrap {
          position: relative;
          overflow: hidden;
          margin-bottom: 14px;
        }
        .srch-card-img {
          height: 320px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.55s ease;
        }
        .srch-card-img-label {
          font-family: var(--font-editorial);
          font-size: 12px;
          color: rgba(0,0,0,0.25);
          letter-spacing: 0.1em;
        }
        .srch-card-overlay {
          position: absolute;
          top: 12px;
          right: 12px;
          transition: opacity 0.25s;
        }
        .srch-wish-btn {
          width: 34px;
          height: 34px;
          background: white;
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          cursor: pointer;
        }
        .srch-wish-btn:hover { background: var(--charcoal); color: white; border-color: var(--charcoal); }
        .srch-add-btn {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: var(--charcoal);
          color: var(--cream);
          padding: 13px;
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          transition: transform 0.3s ease;
          border: none;
          cursor: pointer;
          font-family: var(--font-body);
        }
        .srch-card-info {}
        .srch-card-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }
        .srch-card-cat {
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--gold);
        }
        .srch-card-stars { font-size: 12px; color: var(--gold); }
        .srch-card-name {
          font-family: var(--font-display);
          font-size: 15px;
          font-weight: 400;
          color: var(--charcoal);
          margin-bottom: 6px;
          line-height: 1.3;
        }
        .srch-card-price-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }
        .srch-card-price { font-size: 14px; color: var(--charcoal); }
        .srch-card-orig { font-size: 12px; color: var(--muted); text-decoration: line-through; }
        .srch-card-colors { display: flex; gap: 6px; }

        /* ── No Results ── */
        .srch-no-results {
          text-align: center;
          padding: 80px 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }
        .srch-no-results-ornament {
          font-size: 24px;
          color: var(--gold);
          opacity: 0.5;
          margin-bottom: 8px;
        }
        .srch-no-results-title {
          font-family: var(--font-display);
          font-size: 28px;
          font-weight: 400;
          color: var(--charcoal);
        }
        .srch-no-results-title em { font-style: italic; color: var(--gold); }
        .srch-no-results-sub {
          font-family: var(--font-editorial);
          font-size: 16px;
          color: var(--muted);
          font-weight: 300;
          max-width: 400px;
          margin-bottom: 8px;
        }
        .srch-no-results-actions {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          justify-content: center;
          margin-top: 8px;
        }

        /* ── Category empty ── */
        .srch-cat-empty {
          text-align: center;
          padding: 60px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          font-family: var(--font-editorial);
          font-size: 16px;
          color: var(--muted);
          font-style: italic;
        }

        /* ── Responsive ── */
        @media (max-width: 1200px) {
          .srch-results-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 900px) {
          .srch-hero { padding: 40px 20px 44px; }
          .srch-content { padding: 32px 20px 60px; }
          .srch-results-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
          .srch-cat-grid { grid-template-columns: repeat(3, 1fr); }
          .srch-filter-left { gap: 4px; }
          .srch-filter-pill { padding: 7px 12px; font-size: 10px; }
        }
        @media (max-width: 600px) {
          .srch-results-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .srch-card-img { height: 220px; }
          .srch-cat-grid { grid-template-columns: repeat(2, 1fr); }
          .srch-filter-bar { flex-direction: column; align-items: flex-start; }
          .srch-submit-btn { padding: 18px 20px; font-size: 11px; }
        }
      `}</style>
    </>
  );
}