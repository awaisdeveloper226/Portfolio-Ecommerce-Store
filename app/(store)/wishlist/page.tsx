"use client";
import { useState } from "react";
import Link from "next/link";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ─── Types ────────────────────────────────────────────────────────────────────
type WishlistItem = {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  color: string;
  colors: string[];
  tag?: string | null;
  reviews: number;
  sizes: string[];
  inStock: boolean;
  addedDate: string;
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const initialItems: WishlistItem[] = [
  {
    id: 1,
    name: "Silk Slip Dress",
    category: "Dresses",
    price: 285,
    color: "#e8d5c0",
    colors: ["#d4b5a0", "#2d2d2d", "#b8c4bb"],
    tag: "Bestseller",
    reviews: 142,
    sizes: ["XS", "S", "M", "L"],
    inStock: true,
    addedDate: "2 days ago",
  },
  {
    id: 2,
    name: "Cashmere Turtleneck",
    category: "Knitwear",
    price: 320,
    color: "#d0c8d5",
    colors: ["#d0c8d5", "#2d2d2d", "#e8d5c0"],
    tag: "New",
    reviews: 53,
    sizes: ["XS", "S", "M"],
    inStock: true,
    addedDate: "5 days ago",
  },
  {
    id: 3,
    name: "Linen Wide Trousers",
    category: "Trousers",
    price: 195,
    originalPrice: 240,
    color: "#c8d5c0",
    colors: ["#c8d5c0", "#2d2d2d", "#d4b5a0"],
    tag: "Sale",
    reviews: 87,
    sizes: ["S", "M", "L", "XL"],
    inStock: false,
    addedDate: "1 week ago",
  },
  {
    id: 4,
    name: "Wrap Blazer",
    category: "Outerwear",
    price: 410,
    color: "#d5d0c0",
    colors: ["#d5d0c0", "#2d2d2d"],
    tag: "New",
    reviews: 29,
    sizes: ["S", "M", "L"],
    inStock: true,
    addedDate: "1 week ago",
  },
  {
    id: 5,
    name: "Pleated Midi Dress",
    category: "Dresses",
    price: 310,
    color: "#b8ccc4",
    colors: ["#b8ccc4", "#ddc5d0", "#2d2d2d"],
    tag: "New",
    reviews: 31,
    sizes: ["XS", "S", "M", "L"],
    inStock: true,
    addedDate: "2 weeks ago",
  },
  {
    id: 6,
    name: "Merino Cardigan",
    category: "Knitwear",
    price: 275,
    color: "#c8d5e0",
    colors: ["#c8d5e0", "#ddd5c5", "#2d2d2d"],
    tag: null,
    reviews: 112,
    sizes: ["XS", "S", "M", "L", "XL"],
    inStock: true,
    addedDate: "3 weeks ago",
  },
];

// ─── Suggested Items ──────────────────────────────────────────────────────────
const suggested = [
  { id: 10, name: "Ribbed Maxi Dress", price: 255, color: "#ddc5d0", tag: "New", reviews: 187 },
  { id: 11, name: "Silk Scarf", price: 85, color: "#e8d5b0", tag: null, reviews: 64 },
  { id: 12, name: "Linen Co-ord Set", price: 320, color: "#e0dac8", tag: "Bestseller", reviews: 89 },
  { id: 13, name: "Satin Cami Top", price: 95, color: "#ddd5c5", tag: "Bestseller", reviews: 203 },
];

// ─── Single Wishlist Card ─────────────────────────────────────────────────────
function WishlistCard({
  item,
  onRemove,
  onMoveToCart,
}: {
  item: WishlistItem;
  onRemove: (id: number) => void;
  onMoveToCart: (id: number) => void;
}) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showSizes, setShowSizes] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = () => {
    if (item.sizes.length > 0 && !selectedSize) {
      setShowSizes(true);
      return;
    }
    setAddedToCart(true);
    setTimeout(() => {
      onMoveToCart(item.id);
    }, 900);
  };

  return (
    <div className={`wl-card ${!item.inStock ? "wl-card-oos" : ""}`}>
      {/* Image */}
      <div className="wl-img-wrap">
        <div className="wl-img" style={{ background: item.color }}>
          <span className="wl-img-label">Product Image</span>
        </div>

        {item.tag && (
          <span className={`product-tag ${item.tag === "Sale" ? "tag-sale" : item.tag === "Bestseller" ? "tag-best" : "tag-new"}`}>
            {item.tag}
          </span>
        )}

        {!item.inStock && (
          <div className="wl-oos-overlay">
            <span>Out of Stock</span>
          </div>
        )}

        {/* Remove button */}
        <button
          className="wl-remove-btn"
          onClick={() => onRemove(item.id)}
          aria-label="Remove from wishlist"
          title="Remove"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Info */}
      <div className="wl-info">
        <div className="wl-meta-row">
          <span className="wl-category">{item.category}</span>
          <span className="wl-reviews">★ {item.reviews}</span>
        </div>
        <h3 className="wl-name">{item.name}</h3>

        <div className="wl-price-row">
          <span className="wl-price">${item.price}</span>
          {item.originalPrice && (
            <span className="wl-original">${item.originalPrice}</span>
          )}
        </div>

        <div className="wl-colors">
          {item.colors.map((c) => (
            <button key={c} className="color-dot" style={{ background: c }} aria-label="Color" />
          ))}
        </div>

        {/* Size selector */}
        {item.sizes.length > 0 && (
          <div className={`wl-sizes ${showSizes ? "wl-sizes-open" : ""}`}>
            {item.sizes.map((s) => (
              <button
                key={s}
                className={`wl-size-btn ${selectedSize === s ? "wl-size-active" : ""}`}
                onClick={() => {
                  setSelectedSize(s);
                  setShowSizes(false);
                }}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {showSizes && !selectedSize && (
          <p className="wl-size-hint">Please select a size</p>
        )}

        <div className="wl-actions">
          {item.inStock ? (
            <button
              className={`wl-add-btn ${addedToCart ? "wl-add-btn-done" : ""}`}
              onClick={handleAddToCart}
              disabled={addedToCart}
            >
              {addedToCart ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  Added to Cart
                </>
              ) : (
                "Add to Cart"
              )}
            </button>
          ) : (
            <button className="wl-notify-btn">Notify When Available</button>
          )}
        </div>

        <span className="wl-added-date">Added {item.addedDate}</span>
      </div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyWishlist() {
  return (
    <div className="wl-empty">
      <div className="wl-empty-icon">
        <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.9">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </div>
      <h2 className="wl-empty-title">Your wishlist is empty</h2>
      <p className="wl-empty-sub">
        Save pieces you love and come back to them whenever you&apos;re ready.
      </p>
      <Link href="/shop" className="btn-primary">
        Explore All Pieces
      </Link>
    </div>
  );
}

// ─── Suggested Strip ──────────────────────────────────────────────────────────
function SuggestedStrip({ onAdd }: { onAdd: (id: number) => void }) {
  return (
    <section className="wl-suggested">
      <div className="section-header" style={{ marginBottom: 32 }}>
        <div className="section-header-line" />
        <h2 className="section-title">You May Also Love</h2>
        <div className="section-header-line" />
      </div>
      <div className="wl-suggested-grid">
        {suggested.map((p) => (
          <div key={p.id} className="product-card">
            <div className="product-img-wrap">
              <div className="product-img" style={{ background: p.color }}>
                <span className="product-img-text">Product Image</span>
              </div>
              {p.tag && (
                <span className={`product-tag ${p.tag === "Sale" ? "tag-sale" : p.tag === "Bestseller" ? "tag-best" : "tag-new"}`}>
                  {p.tag}
                </span>
              )}
              <div className="product-hover-actions">
                <button
                  className="hover-action-btn"
                  aria-label="Add to wishlist"
                  onClick={() => onAdd(p.id)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
                <button className="hover-action-btn quick-view">Quick View</button>
              </div>
              <button className="add-to-cart-overlay">Add to Cart</button>
            </div>
            <div className="product-info">
              <div className="product-reviews-row">
                <span className="product-cat-label" />
                <span className="product-reviews-small">★ {p.reviews}</span>
              </div>
              <h3 className="product-name">{p.name}</h3>
              <div className="product-price-row">
                <span className="product-price">${p.price}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Share Modal ──────────────────────────────────────────────────────────────
function ShareModal({ onClose }: { onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const url = "https://maisonelara.com/wishlist/share/abc123";

  const copy = () => {
    navigator.clipboard.writeText(url).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
        <div className="modal-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </div>
        <h3 className="modal-title">Share Your Wishlist</h3>
        <p className="modal-sub">Let friends and family know what you love.</p>

        <div className="modal-share-row">
          <input
            type="text"
            className="modal-url-input"
            value={url}
            readOnly
          />
          <button className="modal-copy-btn" onClick={copy}>
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        <div className="modal-socials">
          <button className="modal-social-btn">Share via Email</button>
          <button className="modal-social-btn">Share on WhatsApp</button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>(initialItems);
  const [showShare, setShowShare] = useState(false);
  const [filter, setFilter] = useState<"all" | "inStock" | "sale">("all");
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

  const removeItem = (id: number) => {
    setItems((p) => p.filter((i) => i.id !== id));
    showToast("Item removed from wishlist");
  };

  const moveToCart = (id: number) => {
    setItems((p) => p.filter((i) => i.id !== id));
    showToast("Item moved to your cart");
  };

  const addAll = () => {
    const available = items.filter((i) => i.inStock);
    if (available.length === 0) return;
    setItems([]);
    showToast(`${available.length} items added to your cart`);
  };

  const filtered = items.filter((i) => {
    if (filter === "inStock") return i.inStock;
    if (filter === "sale") return !!i.originalPrice;
    return true;
  });

  const inStockCount = items.filter((i) => i.inStock).length;

  return (
    <>
      <AnnouncementBar />
      <Navbar />

      <main>
        {/* ── Page Header ── */}
        <section className="wl-hero">
          <div className="wl-hero-inner">
            <div className="wl-breadcrumb">
              <Link href="/">Home</Link>
              <span className="breadcrumb-sep">·</span>
              <span>Wishlist</span>
            </div>
            <div className="wl-hero-row">
              <div>
                <h1 className="wl-hero-title">
                  My <em>Wishlist</em>
                </h1>
                <p className="wl-hero-sub">
                  {items.length === 0
                    ? "Your saved pieces will appear here."
                    : `${items.length} saved ${items.length === 1 ? "piece" : "pieces"} · ${inStockCount} in stock`}
                </p>
              </div>
              {items.length > 0 && (
                <div className="wl-hero-actions">
                  <button className="wl-share-btn" onClick={() => setShowShare(true)}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="18" cy="5" r="3" />
                      <circle cx="6" cy="12" r="3" />
                      <circle cx="18" cy="19" r="3" />
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                    </svg>
                    Share Wishlist
                  </button>
                  <button
                    className="btn-primary wl-add-all-btn"
                    onClick={addAll}
                    disabled={inStockCount === 0}
                  >
                    Add All to Cart ({inStockCount})
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {items.length === 0 ? (
          <EmptyWishlist />
        ) : (
          <>
            {/* ── Filter bar ── */}
            <div className="wl-filter-bar">
              {(["all", "inStock", "sale"] as const).map((f) => (
                <button
                  key={f}
                  className={`wl-filter-pill ${filter === f ? "wl-filter-active" : ""}`}
                  onClick={() => setFilter(f)}
                >
                  {f === "all"
                    ? `All (${items.length})`
                    : f === "inStock"
                    ? `In Stock (${items.filter((i) => i.inStock).length})`
                    : `On Sale (${items.filter((i) => i.originalPrice).length})`}
                </button>
              ))}
            </div>

            {/* ── Grid ── */}
            <div className="wl-grid-wrap">
              {filtered.length === 0 ? (
                <div className="wl-filter-empty">
                  <p>No items match this filter.</p>
                  <button className="btn-ghost" onClick={() => setFilter("all")}>
                    Show All
                  </button>
                </div>
              ) : (
                <div className="wl-grid">
                  {filtered.map((item) => (
                    <WishlistCard
                      key={item.id}
                      item={item}
                      onRemove={removeItem}
                      onMoveToCart={moveToCart}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* ── Suggested ── */}
            <SuggestedStrip onAdd={() => showToast("Added to wishlist")} />
          </>
        )}
      </main>

      <Footer />

      {/* ── Share Modal ── */}
      {showShare && <ShareModal onClose={() => setShowShare(false)} />}

      {/* ── Toast ── */}
      {toast && (
        <div className="wl-toast">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M20 6L9 17l-5-5" />
          </svg>
          {toast}
        </div>
      )}

      <style>{`
        /* ── Hero ── */
        .wl-hero {
          background: var(--cream-dark);
          border-bottom: 1px solid var(--border);
          padding: 56px 60px 48px;
        }
        .wl-breadcrumb {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 12px;
          letter-spacing: 0.08em;
          color: var(--muted);
          text-transform: uppercase;
          margin-bottom: 20px;
        }
        .wl-breadcrumb a { transition: color 0.2s; }
        .wl-breadcrumb a:hover { color: var(--gold); }
        .breadcrumb-sep { color: var(--border); }
        .wl-hero-inner { max-width: 100%; }
        .wl-hero-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
          flex-wrap: wrap;
        }
        .wl-hero-title {
          font-family: var(--font-display);
          font-size: clamp(40px, 5vw, 60px);
          font-weight: 400;
          color: var(--charcoal);
          line-height: 1.05;
          margin-bottom: 10px;
          animation: fadeUp 0.6s ease both;
        }
        .wl-hero-title em { font-style: italic; color: var(--gold); }
        .wl-hero-sub {
          font-family: var(--font-editorial);
          font-size: 16px;
          color: var(--muted);
          font-weight: 300;
          animation: fadeUp 0.6s 0.1s ease both;
        }
        .wl-hero-actions {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
          animation: fadeUp 0.6s 0.15s ease both;
        }
        .wl-share-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 13px 22px;
          border: 1px solid var(--border);
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--charcoal-light);
          background: transparent;
          transition: all 0.2s;
          font-family: var(--font-body);
          cursor: pointer;
        }
        .wl-share-btn:hover { border-color: var(--charcoal); color: var(--charcoal); }
        .wl-add-all-btn { white-space: nowrap; cursor: pointer; }
        .wl-add-all-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        /* ── Filter Bar ── */
        .wl-filter-bar {
          display: flex;
          gap: 8px;
          padding: 20px 60px;
          border-bottom: 1px solid var(--border);
          background: var(--cream);
        }
        .wl-filter-pill {
          padding: 8px 20px;
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          border: 1px solid var(--border);
          color: var(--charcoal-light);
          background: transparent;
          transition: all 0.2s;
          font-family: var(--font-body);
          cursor: pointer;
        }
        .wl-filter-pill:hover { border-color: var(--charcoal); color: var(--charcoal); }
        .wl-filter-active { background: var(--charcoal); color: var(--cream); border-color: var(--charcoal); }

        /* ── Grid ── */
        .wl-grid-wrap { padding: 48px 60px; }
        .wl-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 28px;
        }
        .wl-filter-empty {
          text-align: center;
          padding: 60px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          color: var(--muted);
          font-family: var(--font-editorial);
          font-size: 16px;
        }

        /* ── Wishlist Card ── */
        .wl-card { position: relative; }
        .wl-card-oos { opacity: 0.72; }

        .wl-img-wrap {
          position: relative;
          overflow: hidden;
          margin-bottom: 14px;
        }
        .wl-img {
          height: 340px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.5s ease;
        }
        .wl-card:hover .wl-img { transform: scale(1.04); }
        .wl-img-label {
          font-family: var(--font-editorial);
          font-size: 13px;
          color: rgba(0,0,0,0.25);
          letter-spacing: 0.1em;
        }
        .wl-oos-overlay {
          position: absolute;
          inset: 0;
          background: rgba(250,247,242,0.72);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .wl-oos-overlay span {
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--charcoal-light);
          background: var(--cream);
          padding: 8px 16px;
          border: 1px solid var(--border);
        }

        .wl-remove-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 30px;
          height: 30px;
          background: white;
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--muted);
          opacity: 0;
          transform: translateY(-4px);
          transition: all 0.2s;
          cursor: pointer;
          z-index: 2;
        }
        .wl-card:hover .wl-remove-btn { opacity: 1; transform: translateY(0); }
        .wl-remove-btn:hover { background: var(--charcoal); color: var(--cream); border-color: var(--charcoal); }

        /* Info */
        .wl-info { padding: 0 2px; }
        .wl-meta-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }
        .wl-category {
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--muted);
        }
        .wl-reviews { font-size: 12px; color: var(--gold); }
        .wl-name {
          font-family: var(--font-display);
          font-size: 16px;
          font-weight: 400;
          color: var(--charcoal);
          margin-bottom: 6px;
        }
        .wl-price-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
        }
        .wl-price { font-size: 15px; color: var(--charcoal); }
        .wl-original { font-size: 13px; color: var(--muted); text-decoration: line-through; }
        .wl-colors { display: flex; gap: 6px; margin-bottom: 12px; }

        /* Sizes */
        .wl-sizes {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          margin-bottom: 12px;
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease;
        }
        .wl-sizes-open { max-height: 80px; }
        .wl-size-btn {
          padding: 5px 10px;
          border: 1px solid var(--border);
          font-size: 11px;
          color: var(--charcoal-light);
          transition: all 0.18s;
          font-family: var(--font-body);
          cursor: pointer;
          background: transparent;
        }
        .wl-size-btn:hover { border-color: var(--charcoal); color: var(--charcoal); }
        .wl-size-active { background: var(--charcoal); color: var(--cream); border-color: var(--charcoal); }
        .wl-size-hint { font-size: 11px; color: #c0392b; margin-bottom: 10px; }

        /* Actions */
        .wl-actions { margin-bottom: 8px; }
        .wl-add-btn {
          width: 100%;
          padding: 11px;
          background: var(--charcoal);
          color: var(--cream);
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          border: 1px solid var(--charcoal);
          transition: all 0.22s;
          font-family: var(--font-body);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
        }
        .wl-add-btn:hover:not(:disabled) { background: var(--gold); border-color: var(--gold); }
        .wl-add-btn-done { background: #2a7a4a !important; border-color: #2a7a4a !important; cursor: default; }
        .wl-notify-btn {
          width: 100%;
          padding: 11px;
          background: transparent;
          color: var(--charcoal-light);
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          border: 1px solid var(--border);
          transition: all 0.2s;
          font-family: var(--font-body);
          cursor: pointer;
        }
        .wl-notify-btn:hover { border-color: var(--charcoal); color: var(--charcoal); }
        .wl-added-date { display: block; font-size: 11px; color: var(--muted); letter-spacing: 0.03em; }

        /* ── Empty ── */
        .wl-empty {
          text-align: center;
          padding: 120px 40px 100px;
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: fadeUp 0.6s ease both;
        }
        .wl-empty-icon { color: var(--gold); margin-bottom: 28px; opacity: 0.65; }
        .wl-empty-title {
          font-family: var(--font-display);
          font-size: 30px;
          font-weight: 400;
          color: var(--charcoal);
          margin-bottom: 12px;
        }
        .wl-empty-sub {
          font-family: var(--font-editorial);
          font-size: 17px;
          color: var(--muted);
          font-weight: 300;
          margin-bottom: 36px;
          max-width: 380px;
        }

        /* ── Suggested ── */
        .wl-suggested {
          padding: 60px 0 80px;
          border-top: 1px solid var(--border);
          background: var(--cream-dark);
        }
        .wl-suggested-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          padding: 0 60px;
        }

        /* ── Share Modal ── */
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(26,26,26,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 200;
          backdrop-filter: blur(4px);
          animation: fadeIn 0.2s ease both;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .modal-box {
          background: var(--cream);
          width: 100%;
          max-width: 460px;
          padding: 48px 40px 40px;
          position: relative;
          animation: slideUp 0.3s ease both;
          margin: 20px;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .modal-close {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--muted);
          transition: color 0.2s;
          background: none;
          border: none;
          cursor: pointer;
        }
        .modal-close:hover { color: var(--charcoal); }
        .modal-icon { color: var(--gold); margin-bottom: 16px; }
        .modal-title {
          font-family: var(--font-display);
          font-size: 24px;
          font-weight: 400;
          color: var(--charcoal);
          margin-bottom: 8px;
        }
        .modal-sub {
          font-family: var(--font-editorial);
          font-size: 15px;
          color: var(--muted);
          font-weight: 300;
          margin-bottom: 28px;
        }
        .modal-share-row {
          display: flex;
          border: 1px solid var(--border);
          overflow: hidden;
          margin-bottom: 16px;
        }
        .modal-url-input {
          flex: 1;
          padding: 12px 14px;
          border: none;
          background: var(--cream-dark);
          font-size: 12px;
          color: var(--charcoal-light);
          font-family: var(--font-body);
          outline: none;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          min-width: 0;
        }
        .modal-copy-btn {
          padding: 12px 20px;
          background: var(--charcoal);
          color: var(--cream);
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          font-family: var(--font-body);
          cursor: pointer;
          border: none;
          transition: background 0.2s;
          white-space: nowrap;
        }
        .modal-copy-btn:hover { background: var(--gold); }
        .modal-socials { display: flex; flex-direction: column; gap: 10px; }
        .modal-social-btn {
          padding: 12px;
          border: 1px solid var(--border);
          font-size: 13px;
          color: var(--charcoal-light);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          background: transparent;
          font-family: var(--font-body);
          cursor: pointer;
          transition: all 0.2s;
        }
        .modal-social-btn:hover { border-color: var(--charcoal); color: var(--charcoal); }

        /* ── Toast ── */
        .wl-toast {
          position: fixed;
          bottom: 32px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--charcoal);
          color: var(--cream);
          padding: 14px 24px;
          font-size: 13px;
          letter-spacing: 0.06em;
          display: flex;
          align-items: center;
          gap: 10px;
          z-index: 300;
          box-shadow: 0 8px 32px rgba(0,0,0,0.18);
          animation: toastIn 0.3s ease both;
          white-space: nowrap;
        }
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(-50%) translateY(10px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }

        /* ── Responsive ── */
        @media (max-width: 1200px) {
          .wl-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 900px) {
          .wl-hero { padding: 40px 20px 36px; }
          .wl-filter-bar { padding: 16px 20px; }
          .wl-grid-wrap { padding: 32px 20px; }
          .wl-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
          .wl-suggested-grid { padding: 0 20px; grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .wl-hero-row { flex-direction: column; align-items: flex-start; }
          .wl-hero-actions { width: 100%; }
          .wl-add-all-btn { flex: 1; text-align: center; }
          .wl-img { height: 240px; }
          .wl-toast { font-size: 12px; padding: 12px 18px; }
        }
      `}</style>
    </>
  );
}