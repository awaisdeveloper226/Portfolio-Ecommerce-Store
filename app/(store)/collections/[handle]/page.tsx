"use client";

import { useState, useEffect, useRef, use } from "react";
import Link from "next/link";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ─── Collection Config ────────────────────────────────────────────────────────
type CollectionMeta = {
  title: string;
  subtitle: string;
  eyebrow: string;
  description: string;
  mood: string;           // short italic tagline
  heroStyle: "split" | "full" | "asymmetric" | "dark";
  palette: {
    accent: string;
    heroGrad: string;
    heroBg: string;
    img1: string;
    img2: string;
    img3?: string;
  };
  productHandles: number[];  // which product ids to show
  featureIndex?: number;     // which grid index gets the large feature card (masonry feel)
};

const COLLECTION_CONFIG: Record<string, CollectionMeta> = {
  ss25: {
    title: "Spring / Summer",
    subtitle: "2025",
    eyebrow: "New Collection",
    description:
      "The SS25 collection is a study in restraint — sun-bleached linens, whisper-weight silks and considered cuts that belong to no single season. Pieces built for a life lived thoughtfully.",
    mood: "Light. Fluid. Effortless.",
    heroStyle: "split",
    palette: {
      accent: "#c9a96e",
      heroGrad: "linear-gradient(150deg,#faf7f2 0%,#e8d5b022 100%)",
      heroBg: "#faf7f2",
      img1: "linear-gradient(155deg,#e8ddd0 0%,#d4c4b0 100%)",
      img2: "linear-gradient(155deg,#d0e8d8 0%,#b4ccbc 100%)",
      img3: "linear-gradient(155deg,#e8e0d0 0%,#ccc0b0 100%)",
    },
    productHandles: [1, 5, 6, 10, 15, 14, 3, 16],
    featureIndex: 0,
  },
  "linen-edit": {
    title: "The Linen",
    subtitle: "Edit",
    eyebrow: "Fabric Story",
    description:
      "Certified organic Irish linen — woven on traditional looms, pre-washed for softness, and cut into silhouettes that soften with every wear. Our most celebrated fabric, in its fullest expression.",
    mood: "Breathe. Move. Live.",
    heroStyle: "asymmetric",
    palette: {
      accent: "#b8a882",
      heroGrad: "linear-gradient(135deg,#f0ebe0 0%,#e0d5c0 100%)",
      heroBg: "#f0ebe0",
      img1: "linear-gradient(155deg,#e0d5b8 0%,#ccc0a0 100%)",
      img2: "linear-gradient(155deg,#c8d8c0 0%,#b0c4a8 100%)",
    },
    productHandles: [6, 2, 9, 5, 16, 1],
    featureIndex: 2,
  },
  sale: {
    title: "The",
    subtitle: "Sale",
    eyebrow: "Final Reductions",
    description:
      "Considered pieces at considered prices. Each item in our sale is offered once — when it's gone, it's gone. No restocks, no compromises on quality.",
    mood: "Last chance. First quality.",
    heroStyle: "dark",
    palette: {
      accent: "#c0392b",
      heroGrad: "linear-gradient(160deg,#1a1a1a 0%,#2d2020 100%)",
      heroBg: "#1a1a1a",
      img1: "linear-gradient(155deg,#3a2a2a 0%,#2d1a1a 100%)",
      img2: "linear-gradient(155deg,#c8d5c0 0%,#b4c4b0 100%)",
    },
    productHandles: [2, 18],
    featureIndex: 0,
  },
  lookbook: {
    title: "Shop the",
    subtitle: "Look",
    eyebrow: "Styled for You",
    description:
      "Complete outfits, curated for four distinct moments in a woman's week. Every item is available individually — or wear the full look as shown.",
    mood: "Dressed. Always.",
    heroStyle: "full",
    palette: {
      accent: "#9aacb0",
      heroGrad: "linear-gradient(160deg,#d5e0e4 0%,#c0d0d8 100%)",
      heroBg: "#d5e0e4",
      img1: "linear-gradient(155deg,#c0d4d8 0%,#a8bcc4 100%)",
      img2: "linear-gradient(155deg,#d8c8d0 0%,#c0b0b8 100%)",
      img3: "linear-gradient(155deg,#d0d8c0 0%,#b8c4a8 100%)",
    },
    productHandles: [1, 6, 15, 5, 4, 8, 7, 16],
    featureIndex: 4,
  },
  bestselling: {
    title: "Customer",
    subtitle: "Favourites",
    eyebrow: "Most Loved",
    description:
      "The pieces our community returns to season after season. Sorted by love, not algorithm — these are the styles that have earned their place in thousands of wardrobes.",
    mood: "Beloved. Proven. Yours.",
    heroStyle: "split",
    palette: {
      accent: "#c9a96e",
      heroGrad: "linear-gradient(150deg,#faf7f2 0%,#f0e8d800 100%)",
      heroBg: "#faf7f2",
      img1: "linear-gradient(155deg,#e8d5c0 0%,#d4c0a8 100%)",
      img2: "linear-gradient(155deg,#c5ddc5 0%,#b0ccb0 100%)",
    },
    productHandles: [8, 1, 16, 5, 6, 15, 10, 3],
    featureIndex: 1,
  },
  "new-arrivals": {
    title: "New",
    subtitle: "Arrivals",
    eyebrow: "Just Landed",
    description:
      "Fresh from our ateliers — new pieces land every Friday. Be the first to discover the latest additions to the Maison Elara wardrobe.",
    mood: "First to know. First to wear.",
    heroStyle: "asymmetric",
    palette: {
      accent: "#c9a96e",
      heroGrad: "linear-gradient(135deg,#f5f0e8 0%,#ecddc833 100%)",
      heroBg: "#f5f0e8",
      img1: "linear-gradient(155deg,#e8ddd0 0%,#d4c4b0 100%)",
      img2: "linear-gradient(155deg,#d0c8d5 0%,#b8b0c4 100%)",
    },
    productHandles: [3, 4, 10, 12, 14, 17, 19, 20],
    featureIndex: 3,
  },
};

const DEFAULT_COLLECTION: CollectionMeta = {
  title: "Curated",
  subtitle: "Collection",
  eyebrow: "Maison Elara",
  description: "A considered selection of timeless pieces, curated with intention.",
  mood: "Dressed with purpose.",
  heroStyle: "split",
  palette: {
    accent: "#c9a96e",
    heroGrad: "linear-gradient(150deg,#faf7f2 0%,#e8d5b022 100%)",
    heroBg: "#faf7f2",
    img1: "linear-gradient(155deg,#e8ddd0 0%,#d4c4b0 100%)",
    img2: "linear-gradient(155deg,#c8d5c8 0%,#b0c4b4 100%)",
  },
  productHandles: [1, 2, 3, 4, 5, 6, 7, 8],
  featureIndex: 0,
};

// ─── All Products Pool ────────────────────────────────────────────────────────
const PRODUCTS: Record<number, {
  id: number; name: string; price: number; originalPrice: number | null;
  category: string; tag: string | null; color: string;
  colors: string[]; reviews: number; sizes: string[];
}> = {
  1:  { id: 1,  name: "Silk Slip Dress",        price: 285, originalPrice: null, category: "Dresses",     tag: "Bestseller", color: "#e8d5c0", colors: ["#d4b5a0","#2d2d2d","#b8c4bb"], reviews: 142, sizes: ["XS","S","M","L"] },
  2:  { id: 2,  name: "Linen Wide Trousers",    price: 195, originalPrice: 240,  category: "Trousers",    tag: "Sale",       color: "#c8d5c0", colors: ["#c8d5c0","#2d2d2d","#d4b5a0"], reviews: 87,  sizes: ["S","M","L","XL"] },
  3:  { id: 3,  name: "Cashmere Turtleneck",    price: 320, originalPrice: null, category: "Knitwear",    tag: "New",        color: "#d0c8d5", colors: ["#d0c8d5","#2d2d2d","#e8d5c0"], reviews: 53,  sizes: ["XS","S","M"] },
  4:  { id: 4,  name: "Wrap Blazer",            price: 410, originalPrice: null, category: "Outerwear",   tag: "New",        color: "#d5d0c0", colors: ["#d5d0c0","#2d2d2d"],           reviews: 29,  sizes: ["S","M","L"] },
  5:  { id: 5,  name: "Fluid Midi Skirt",       price: 175, originalPrice: null, category: "Dresses",     tag: null,         color: "#ddc5b5", colors: ["#ddc5b5","#b8c4bb","#c9a96e"], reviews: 142, sizes: ["XS","S","M","L","XL"] },
  6:  { id: 6,  name: "Oversized Linen Shirt",  price: 145, originalPrice: null, category: "Tops",        tag: null,         color: "#c5ddc5", colors: ["#c5ddc5","#f5f0e8","#2d2d2d"], reviews: 98,  sizes: ["S","M","L","XL","XXL"] },
  7:  { id: 7,  name: "Cropped Wool Jacket",    price: 390, originalPrice: null, category: "Outerwear",   tag: null,         color: "#c5c5dd", colors: ["#c5c5dd","#2d2d2d"],           reviews: 76,  sizes: ["XS","S","M"] },
  8:  { id: 8,  name: "Satin Cami Top",         price: 95,  originalPrice: null, category: "Tops",        tag: "Bestseller", color: "#ddd5c5", colors: ["#ddd5c5","#2d2d2d","#ddc5c5"], reviews: 203, sizes: ["XS","S","M","L"] },
  9:  { id: 9,  name: "Tailored Shorts",        price: 160, originalPrice: null, category: "Trousers",    tag: null,         color: "#c5ddd5", colors: ["#c5ddd5","#d4b5a0","#2d2d2d"], reviews: 55,  sizes: ["S","M","L"] },
  10: { id: 10, name: "Ribbed Maxi Dress",      price: 255, originalPrice: null, category: "Dresses",     tag: "New",        color: "#ddc5d0", colors: ["#ddc5d0","#2d2d2d","#b8c4bb"], reviews: 187, sizes: ["XS","S","M","L","XL"] },
  12: { id: 12, name: "Leather Belt",           price: 115, originalPrice: null, category: "Accessories", tag: "New",        color: "#c0ae98", colors: ["#c0ae98","#2d2d2d"],           reviews: 38,  sizes: [] },
  14: { id: 14, name: "Pleated Midi Dress",     price: 310, originalPrice: null, category: "Dresses",     tag: "New",        color: "#b8ccc4", colors: ["#b8ccc4","#ddc5d0","#2d2d2d"], reviews: 31,  sizes: ["XS","S","M","L"] },
  15: { id: 15, name: "Merino Cardigan",        price: 275, originalPrice: null, category: "Knitwear",    tag: null,         color: "#c8d5e0", colors: ["#c8d5e0","#ddd5c5","#2d2d2d"], reviews: 112, sizes: ["XS","S","M","L","XL"] },
  16: { id: 16, name: "Linen Co-ord Set",       price: 320, originalPrice: null, category: "Tops",        tag: "Bestseller", color: "#e0dac8", colors: ["#e0dac8","#c5ddc5","#ddc5c5"], reviews: 89,  sizes: ["S","M","L"] },
  17: { id: 17, name: "Silk Blouse",            price: 210, originalPrice: null, category: "Tops",        tag: "New",        color: "#e8d5d5", colors: ["#e8d5d5","#2d2d2d","#c8d5e0"], reviews: 44,  sizes: ["XS","S","M","L"] },
  18: { id: 18, name: "Straight-Leg Trousers",  price: 220, originalPrice: 280,  category: "Trousers",    tag: "Sale",       color: "#d0d5c8", colors: ["#d0d5c8","#2d2d2d"],           reviews: 66,  sizes: ["XS","S","M","L","XL"] },
  19: { id: 19, name: "Double-Breasted Coat",   price: 590, originalPrice: null, category: "Outerwear",   tag: "New",        color: "#c8c0b8", colors: ["#c8c0b8","#2d2d2d","#d4b5a0"], reviews: 18,  sizes: ["XS","S","M","L"] },
  20: { id: 20, name: "Alpaca Ribbed Pullover", price: 340, originalPrice: null, category: "Knitwear",    tag: null,         color: "#e0d8cc", colors: ["#e0d8cc","#c4b5d4","#2d2d2d"], reviews: 73,  sizes: ["XS","S","M","L"] },
};

type Product = typeof PRODUCTS[1];

// ─── Utility Hook ─────────────────────────────────────────────────────────────
function useInView(ref: React.RefObject<Element | null>, threshold = 0.12) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return inView;
}

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({
  product, index, accent, featured = false, darkMode = false,
}: {
  product: Product; index: number; accent: string; featured?: boolean; darkMode?: boolean;
}) {
  const [wishlisted, setWishlisted] = useState(false);
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);

  const textColor = darkMode ? "rgba(250,247,242,0.9)" : "var(--charcoal)";
  const mutedColor = darkMode ? "rgba(250,247,242,0.45)" : "var(--muted)";
  const cardBg = darkMode ? "rgba(255,255,255,0.04)" : "transparent";
  const borderColor = darkMode ? "rgba(255,255,255,0.1)" : "var(--border)";

  return (
    <div
      ref={ref}
      className={`col-card ${featured ? "col-card-featured" : ""}`}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.6s ${index * 0.08}s ease, transform 0.6s ${index * 0.08}s ease`,
        background: cardBg,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="col-card-img-wrap">
        <div
          className="col-card-img"
          style={{
            background: product.color,
            transform: hovered ? "scale(1.05)" : "scale(1)",
            height: featured ? "520px" : "340px",
          }}
        >
          <span className="col-card-img-label">Product Image</span>
        </div>

        {/* Tag */}
        {product.tag && (
          <span
            className="col-tag"
            style={
              product.tag === "Sale"
                ? { background: "#c0392b", color: "#fff" }
                : product.tag === "Bestseller"
                ? { background: accent, color: "#fff" }
                : { background: darkMode ? "rgba(250,247,242,0.12)" : "var(--charcoal)", color: darkMode ? "rgba(250,247,242,0.9)" : "var(--cream)" }
            }
          >
            {product.tag}
          </span>
        )}

        {/* Hover actions */}
        <div className="col-hover-actions" style={{ opacity: hovered ? 1 : 0 }}>
          <button
            className="col-action-btn"
            onClick={() => setWishlisted(!wishlisted)}
            style={{
              background: wishlisted ? accent : "white",
              color: wishlisted ? "white" : "var(--charcoal)",
              borderColor: wishlisted ? accent : borderColor,
            }}
            aria-label="Wishlist"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill={wishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
          <button
            className="col-action-btn col-action-qv"
            style={{ background: "white", borderColor: borderColor }}
          >
            Quick View
          </button>
        </div>

        {/* Add to cart */}
        <button
          className="col-add-btn"
          style={{
            transform: hovered ? "translateY(0)" : "translateY(100%)",
            background: "var(--charcoal)",
          }}
        >
          Add to Cart
        </button>
      </div>

      {/* Info */}
      <div className="col-card-info">
        <div className="col-card-top-row">
          <span className="col-card-cat" style={{ color: accent }}>{product.category}</span>
          {product.reviews > 0 && (
            <span className="col-card-stars" style={{ color: accent }}>★ {product.reviews}</span>
          )}
        </div>
        <h3 className="col-card-name" style={{ color: textColor, fontSize: featured ? "18px" : "15px" }}>
          {product.name}
        </h3>
        <div className="col-card-price-row">
          <span className="col-card-price" style={{ color: textColor }}>${product.price}</span>
          {product.originalPrice && (
            <span className="col-card-original" style={{ color: mutedColor }}>${product.originalPrice}</span>
          )}
        </div>
        <div className="col-card-colors">
          {product.colors.map((c) => (
            <button
              key={c}
              className="col-color-dot"
              style={{
                background: c,
                boxShadow: darkMode ? "0 0 0 1px rgba(255,255,255,0.2)" : "0 0 0 1px rgba(0,0,0,0.12)",
              }}
              aria-label="colour"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Hero: Split ──────────────────────────────────────────────────────────────
function HeroSplit({ col, handle }: { col: CollectionMeta; handle: string }) {
  return (
    <section className="col-hero col-hero-split" style={{ background: col.palette.heroBg }}>
      <div className="col-hero-split-inner">
        <div className="col-hero-text-col">
          <nav className="col-breadcrumb">
            <Link href="/">Home</Link><span className="col-sep">·</span>
            <Link href="/shop">Shop</Link><span className="col-sep">·</span>
            <span>Collections</span><span className="col-sep">·</span>
            <span style={{ color: col.palette.accent }}>{col.eyebrow}</span>
          </nav>
          <span className="col-eyebrow" style={{ color: col.palette.accent }}>{col.eyebrow}</span>
          <h1 className="col-hero-title">
            {col.title}<br />
            <em style={{ color: col.palette.accent }}>{col.subtitle}</em>
          </h1>
          <p className="col-hero-desc">{col.description}</p>
          <div className="col-hero-mood">
            <div className="col-mood-line" style={{ background: col.palette.accent }} />
            <span className="col-mood-text" style={{ color: col.palette.accent }}>{col.mood}</span>
          </div>
          <div className="col-hero-actions">
            <a href="#collection-grid" className="btn-primary">Explore the Edit</a>
            <Link href="/shop" className="btn-ghost">All Pieces</Link>
          </div>
        </div>
        <div className="col-hero-img-col">
          <div className="col-hero-img-stack">
            <div className="col-hero-img col-hero-img-main" style={{ background: col.palette.img1 }}>
              <span className="col-hero-img-label">Campaign Image</span>
            </div>
            <div className="col-hero-img col-hero-img-secondary" style={{ background: col.palette.img2 }} />
            {col.palette.img3 && (
              <div className="col-hero-img col-hero-img-tertiary" style={{ background: col.palette.img3 }} />
            )}
            <div className="col-hero-img-badge" style={{ borderColor: col.palette.accent }}>
              <span style={{ color: col.palette.accent }}>{col.eyebrow}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Hero: Asymmetric ─────────────────────────────────────────────────────────
function HeroAsymmetric({ col }: { col: CollectionMeta }) {
  return (
    <section className="col-hero col-hero-asym" style={{ background: col.palette.heroBg }}>
      <div className="col-hero-asym-inner">
        {/* Large image left */}
        <div className="col-asym-imagery">
          <div className="col-asym-img-main" style={{ background: col.palette.img1 }}>
            <div className="col-asym-overlay-text">
              <span className="col-asym-num">01</span>
            </div>
          </div>
          <div className="col-asym-img-sm" style={{ background: col.palette.img2 }} />
        </div>
        {/* Stacked text right */}
        <div className="col-asym-text">
          <nav className="col-breadcrumb">
            <Link href="/">Home</Link><span className="col-sep">·</span>
            <Link href="/shop">Shop</Link><span className="col-sep">·</span>
            <span style={{ color: col.palette.accent }}>{col.eyebrow}</span>
          </nav>
          <span className="col-eyebrow" style={{ color: col.palette.accent }}>{col.eyebrow}</span>
          <h1 className="col-hero-title col-hero-title-lg">
            {col.title}
            <br />
            <em style={{ color: col.palette.accent }}>{col.subtitle}</em>
          </h1>
          <blockquote className="col-asym-quote" style={{ borderLeftColor: col.palette.accent }}>
            {col.mood}
          </blockquote>
          <p className="col-hero-desc">{col.description}</p>
          <a href="#collection-grid" className="btn-primary">Shop the Edit</a>
        </div>
      </div>
    </section>
  );
}

// ─── Hero: Full Width ─────────────────────────────────────────────────────────
function HeroFull({ col }: { col: CollectionMeta }) {
  return (
    <section className="col-hero col-hero-full" style={{ background: col.palette.img1 }}>
      {/* Three image panels */}
      <div className="col-hero-full-panels">
        <div className="col-full-panel" style={{ background: col.palette.img1 }} />
        {col.palette.img3 && <div className="col-full-panel col-full-panel-mid" style={{ background: col.palette.img3 }} />}
        <div className="col-full-panel" style={{ background: col.palette.img2 }} />
      </div>
      {/* Centred overlay text */}
      <div className="col-hero-full-overlay">
        <nav className="col-breadcrumb col-breadcrumb-light">
          <Link href="/">Home</Link><span className="col-sep">·</span>
          <Link href="/shop">Shop</Link><span className="col-sep">·</span>
          <span style={{ color: col.palette.accent }}>{col.eyebrow}</span>
        </nav>
        <span className="col-eyebrow" style={{ color: col.palette.accent }}>{col.eyebrow}</span>
        <h1 className="col-hero-title col-hero-title-full">
          {col.title}<br />
          <em style={{ color: col.palette.accent }}>{col.subtitle}</em>
        </h1>
        <p className="col-hero-full-sub">{col.mood}</p>
        <a href="#collection-grid" className="btn-ghost col-full-cta">Explore ↓</a>
      </div>
    </section>
  );
}

// ─── Hero: Dark ───────────────────────────────────────────────────────────────
function HeroDark({ col }: { col: CollectionMeta }) {
  return (
    <section className="col-hero col-hero-dark" style={{ background: col.palette.heroBg }}>
      <div className="col-hero-dark-inner">
        <div className="col-dark-text">
          <nav className="col-breadcrumb col-breadcrumb-light">
            <Link href="/">Home</Link><span className="col-sep-light">·</span>
            <Link href="/shop">Shop</Link><span className="col-sep-light">·</span>
            <span style={{ color: col.palette.accent }}>{col.eyebrow}</span>
          </nav>
          <span className="col-eyebrow" style={{ color: col.palette.accent }}>{col.eyebrow}</span>
          <h1 className="col-hero-title col-hero-title-dark">
            {col.title}<br />
            <em style={{ color: col.palette.accent }}>{col.subtitle}</em>
          </h1>
          <p className="col-hero-desc col-hero-desc-dark">{col.description}</p>
          <div className="col-dark-mood">
            <span style={{ color: col.palette.accent, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase" as const }}>
              {col.mood}
            </span>
          </div>
          <a href="#collection-grid" className="col-dark-cta" style={{ borderColor: col.palette.accent, color: col.palette.accent }}>
            Shop the Sale →
          </a>
        </div>
        <div className="col-dark-imagery">
          <div className="col-dark-img-main" style={{ background: col.palette.img2 }} />
          <div className="col-dark-badge" style={{ border: `1px solid ${col.palette.accent}` }}>
            <span style={{ color: col.palette.accent, fontFamily: "var(--font-display)", fontSize: 28 }}>Up to</span>
            <span style={{ color: col.palette.accent, fontFamily: "var(--font-display)", fontSize: 56, lineHeight: 1 }}>40%</span>
            <span style={{ color: "rgba(250,247,242,0.5)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase" as const }}>Off select styles</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Collection Stats Bar ─────────────────────────────────────────────────────
function StatsBar({ col, count, darkMode }: { col: CollectionMeta; count: number; darkMode: boolean }) {
  const bg = darkMode ? "rgba(255,255,255,0.04)" : "var(--cream-dark)";
  const border = darkMode ? "rgba(255,255,255,0.08)" : "var(--border)";
  const text = darkMode ? "rgba(250,247,242,0.5)" : "var(--muted)";
  const bold = darkMode ? "rgba(250,247,242,0.9)" : "var(--charcoal)";

  return (
    <div className="col-stats-bar" style={{ background: bg, borderColor: border }}>
      <div className="col-stats-inner">
        <div className="col-stat">
          <span className="col-stat-num" style={{ color: bold }}>{count}</span>
          <span className="col-stat-label" style={{ color: text }}>Pieces</span>
        </div>
        <div className="col-stat-div" style={{ background: border }} />
        <div className="col-stat">
          <span className="col-stat-num" style={{ color: bold }}>2025</span>
          <span className="col-stat-label" style={{ color: text }}>Season</span>
        </div>
        <div className="col-stat-div" style={{ background: border }} />
        <div className="col-stat">
          <span className="col-stat-num" style={{ color: bold }}>100%</span>
          <span className="col-stat-label" style={{ color: text }}>Sustainable</span>
        </div>
        <div className="col-stat-div" style={{ background: border }} />
        <div className="col-stat">
          <span className="col-stat-num" style={{ color: bold }}>48h</span>
          <span className="col-stat-label" style={{ color: text }}>Delivery</span>
        </div>
        {/* Right: mood quote */}
        <div className="col-stats-mood" style={{ marginLeft: "auto" }}>
          <span style={{ color: col.palette.accent, fontFamily: "var(--font-editorial)", fontStyle: "italic", fontSize: 14 }}>
            {col.mood}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Masonry-feel Grid ────────────────────────────────────────────────────────
function CollectionGrid({
  products, accent, featureIndex, darkMode,
}: {
  products: Product[]; accent: string; featureIndex: number; darkMode: boolean;
}) {
  // We render a 3-col grid where one card spans a double row (featured)
  return (
    <div className="col-masonry-grid">
      {products.map((p, i) => (
        <div
          key={p.id}
          className={`col-masonry-item ${i === featureIndex ? "col-masonry-featured" : ""}`}
        >
          <ProductCard
            product={p}
            index={i}
            accent={accent}
            featured={i === featureIndex}
            darkMode={darkMode}
          />
        </div>
      ))}
    </div>
  );
}

// ─── Other Collections Strip ──────────────────────────────────────────────────
function OtherCollections({ handle, darkMode }: { handle: string; darkMode: boolean }) {
  const others = Object.entries(COLLECTION_CONFIG)
    .filter(([k]) => k !== handle)
    .slice(0, 4);

  const bg = darkMode ? "rgba(255,255,255,0.03)" : "var(--cream-dark)";
  const border = darkMode ? "rgba(255,255,255,0.08)" : "var(--border)";
  const titleColor = darkMode ? "rgba(250,247,242,0.9)" : "var(--charcoal)";
  const lineColor = darkMode ? "rgba(255,255,255,0.08)" : "var(--border)";

  return (
    <section className="col-others" style={{ background: bg, borderTop: `1px solid ${border}` }}>
      <div className="col-others-header">
        <div style={{ flex: 1, height: 1, background: lineColor }} />
        <h2 className="col-others-title" style={{ color: titleColor }}>More Collections</h2>
        <div style={{ flex: 1, height: 1, background: lineColor }} />
      </div>
      <div className="col-others-grid">
        {others.map(([k, c]) => (
          <Link key={k} href={`/collections/${k}`} className="col-other-card">
            <div className="col-other-img" style={{ background: c.palette.img1 }}>
              <div className="col-other-img-overlay" />
              <div className="col-other-img-text">
                <span className="col-other-eyebrow" style={{ color: c.palette.accent }}>{c.eyebrow}</span>
                <h3 className="col-other-title" style={{ color: "rgba(250,247,242,0.95)" }}>
                  {c.title} <em style={{ color: c.palette.accent }}>{c.subtitle}</em>
                </h3>
              </div>
            </div>
            <div
              className="col-other-foot"
              style={{
                background: darkMode ? "#222" : "white",
                borderColor: border,
              }}
            >
              <span style={{ fontSize: 13, color: titleColor, fontFamily: "var(--font-display)" }}>
                {c.title} {c.subtitle}
              </span>
              <span style={{ color: c.palette.accent, fontSize: 16 }}>→</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CollectionPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = use(params);
  const col = COLLECTION_CONFIG[handle] ?? DEFAULT_COLLECTION;
  const darkMode = col.heroStyle === "dark";

  const products = col.productHandles
    .map((id) => PRODUCTS[id])
    .filter(Boolean);

  const featureIndex = col.featureIndex ?? 0;

  const pageBg = darkMode ? "#1a1a1a" : "var(--cream)";
  const textColor = darkMode ? "rgba(250,247,242,0.88)" : "var(--charcoal)";

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main style={{ background: pageBg, color: textColor }}>

        {/* ── Dynamic Hero ── */}
        {col.heroStyle === "split"      && <HeroSplit      col={col} handle={handle} />}
        {col.heroStyle === "asymmetric" && <HeroAsymmetric col={col} />}
        {col.heroStyle === "full"       && <HeroFull       col={col} />}
        {col.heroStyle === "dark"       && <HeroDark       col={col} />}

        {/* ── Stats Bar ── */}
        <StatsBar col={col} count={products.length} darkMode={darkMode} />

        {/* ── Collection Grid ── */}
        <section id="collection-grid" className="col-grid-section" style={{ background: pageBg }}>
          <CollectionGrid
            products={products}
            accent={col.palette.accent}
            featureIndex={featureIndex}
            darkMode={darkMode}
          />
        </section>

        {/* ── Editorial Pull Quote ── */}
        <section
          className="col-pull-quote-section"
          style={{
            background: darkMode ? "rgba(255,255,255,0.03)" : col.palette.heroGrad,
            borderTop: `1px solid ${darkMode ? "rgba(255,255,255,0.07)" : "var(--border)"}`,
            borderBottom: `1px solid ${darkMode ? "rgba(255,255,255,0.07)" : "var(--border)"}`,
          }}
        >
          <div className="col-pull-quote-inner">
            <span className="col-pull-ornament" style={{ color: col.palette.accent }}>✦</span>
            <blockquote className="col-pull-quote" style={{ color: darkMode ? "rgba(250,247,242,0.75)" : "var(--charcoal-light)" }}>
              &ldquo;{col.description}&rdquo;
            </blockquote>
            <Link href="/about" className="col-pull-link" style={{ color: col.palette.accent }}>
              Our Philosophy →
            </Link>
          </div>
        </section>

        {/* ── Other Collections ── */}
        <OtherCollections handle={handle} darkMode={darkMode} />
      </main>

      <Footer />

      <style>{`
        /* ══ Collection Page Global ══ */
        .col-breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 20px;
        }
        .col-breadcrumb a:hover { color: var(--charcoal); }
        .col-breadcrumb-light { color: rgba(250,247,242,0.45); }
        .col-breadcrumb-light a:hover { color: rgba(250,247,242,0.9); }
        .col-sep { color: var(--border); }
        .col-sep-light { color: rgba(255,255,255,0.2); }

        .col-eyebrow {
          display: block;
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          margin-bottom: 14px;
          font-weight: 400;
        }
        .col-hero-title {
          font-family: var(--font-display);
          font-size: clamp(44px, 5.5vw, 76px);
          font-weight: 400;
          line-height: 1.02;
          color: var(--charcoal);
          margin-bottom: 20px;
          animation: fadeUp 0.7s ease both;
        }
        .col-hero-title em { font-style: italic; }
        .col-hero-title-lg { font-size: clamp(48px, 6vw, 84px); }
        .col-hero-title-full {
          font-size: clamp(52px, 7vw, 96px);
          color: rgba(250,247,242,0.95);
          text-shadow: 0 2px 40px rgba(0,0,0,0.18);
        }
        .col-hero-title-dark { color: rgba(250,247,242,0.95); }
        .col-hero-desc {
          font-family: var(--font-editorial);
          font-size: 17px;
          font-weight: 300;
          color: var(--muted);
          line-height: 1.8;
          max-width: 440px;
          margin-bottom: 28px;
          animation: fadeUp 0.7s 0.12s ease both;
        }
        .col-hero-desc-dark { color: rgba(250,247,242,0.5); }
        .col-hero-mood {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 32px;
          animation: fadeUp 0.7s 0.2s ease both;
        }
        .col-mood-line { width: 32px; height: 1px; }
        .col-mood-text {
          font-family: var(--font-editorial);
          font-style: italic;
          font-size: 15px;
          letter-spacing: 0.04em;
        }
        .col-hero-actions {
          display: flex;
          gap: 14px;
          animation: fadeUp 0.7s 0.25s ease both;
        }

        /* ── Split Hero ── */
        .col-hero-split {
          padding: 64px 60px 56px;
          border-bottom: 1px solid var(--border);
          overflow: hidden;
        }
        .col-hero-split-inner {
          display: grid;
          grid-template-columns: 1fr 1.1fr;
          gap: 60px;
          align-items: center;
          max-width: 1400px;
          margin: 0 auto;
        }
        .col-hero-img-col {}
        .col-hero-img-stack {
          position: relative;
          height: 620px;
        }
        .col-hero-img { position: absolute; border-radius: 2px; overflow: hidden; }
        .col-hero-img-main {
          width: 76%;
          height: 86%;
          top: 0; right: 0;
          display: flex;
          align-items: flex-end;
          padding: 20px;
        }
        .col-hero-img-label {
          font-family: var(--font-editorial);
          font-size: 12px;
          color: rgba(0,0,0,0.25);
          letter-spacing: 0.1em;
        }
        .col-hero-img-secondary {
          width: 48%;
          height: 46%;
          bottom: 0; left: 0;
          border: 8px solid var(--cream);
        }
        .col-hero-img-tertiary {
          width: 28%;
          height: 30%;
          top: 58%;
          right: 2%;
          border: 6px solid var(--cream);
          z-index: 2;
        }
        .col-hero-img-badge {
          position: absolute;
          bottom: 50%;
          left: 38%;
          background: white;
          padding: 10px 16px;
          border-left: 2px solid;
          z-index: 3;
          box-shadow: 0 4px 24px rgba(0,0,0,0.08);
        }
        .col-hero-img-badge span {
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          font-weight: 500;
        }

        /* ── Asymmetric Hero ── */
        .col-hero-asym {
          padding: 0;
          min-height: 88vh;
          display: grid;
          grid-template-columns: 1fr;
          overflow: hidden;
          border-bottom: 1px solid var(--border);
        }
        .col-hero-asym-inner {
          display: grid;
          grid-template-columns: 1.15fr 1fr;
          min-height: 88vh;
        }
        .col-asym-imagery {
          position: relative;
          overflow: hidden;
        }
        .col-asym-img-main {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: flex-end;
          padding: 40px;
        }
        .col-asym-overlay-text {
          font-family: var(--font-display);
        }
        .col-asym-num {
          font-size: 11px;
          letter-spacing: 0.2em;
          color: rgba(0,0,0,0.22);
        }
        .col-asym-img-sm {
          position: absolute;
          width: 44%;
          height: 38%;
          bottom: 40px;
          right: -8%;
          border: 8px solid white;
          border-radius: 2px;
          z-index: 2;
        }
        .col-asym-text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 80px 64px 80px 56px;
        }
        .col-asym-quote {
          font-family: var(--font-editorial);
          font-size: 19px;
          font-style: italic;
          font-weight: 300;
          color: var(--charcoal-light);
          border-left: 2px solid;
          padding-left: 20px;
          margin: 0 0 24px;
          line-height: 1.6;
        }

        /* ── Full Hero ── */
        .col-hero-full {
          position: relative;
          min-height: 85vh;
          overflow: hidden;
          border-bottom: 1px solid var(--border);
        }
        .col-hero-full-panels {
          position: absolute;
          inset: 0;
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr;
        }
        .col-full-panel {}
        .col-full-panel-mid { filter: brightness(0.92); }
        .col-hero-full-overlay {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 85vh;
          text-align: center;
          background: linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.32) 100%);
          padding: 60px;
        }
        .col-hero-full-sub {
          font-family: var(--font-editorial);
          font-size: 20px;
          font-style: italic;
          font-weight: 300;
          color: rgba(250,247,242,0.75);
          margin: 0 0 32px;
        }
        .col-full-cta {
          color: rgba(250,247,242,0.9) !important;
          border-color: rgba(250,247,242,0.5) !important;
        }
        .col-full-cta:hover {
          background: rgba(250,247,242,0.12) !important;
        }

        /* ── Dark Hero ── */
        .col-hero-dark {
          padding: 0;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          overflow: hidden;
        }
        .col-hero-dark-inner {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 78vh;
          align-items: center;
        }
        .col-dark-text {
          padding: 80px 60px;
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .col-dark-mood { margin-bottom: 32px; }
        .col-dark-cta {
          display: inline-block;
          padding: 14px 32px;
          border: 1px solid;
          font-size: 12px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          transition: all 0.25s;
          cursor: pointer;
          align-self: flex-start;
        }
        .col-dark-cta:hover {
          background: rgba(255,255,255,0.06);
        }
        .col-dark-imagery {
          position: relative;
          height: 78vh;
          overflow: hidden;
        }
        .col-dark-img-main {
          position: absolute;
          inset: 0;
        }
        .col-dark-badge {
          position: absolute;
          bottom: 48px;
          left: -24px;
          background: #1a1a1a;
          padding: 28px 36px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          z-index: 2;
        }

        /* ── Stats Bar ── */
        .col-stats-bar {
          border-bottom: 1px solid;
          padding: 20px 60px;
        }
        .col-stats-inner {
          display: flex;
          align-items: center;
          gap: 36px;
          flex-wrap: wrap;
        }
        .col-stat { display: flex; flex-direction: column; align-items: center; gap: 3px; }
        .col-stat-num {
          font-family: var(--font-display);
          font-size: 22px;
          font-weight: 400;
        }
        .col-stat-label {
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .col-stat-div { width: 1px; height: 36px; }
        .col-stats-mood { display: flex; align-items: center; }

        /* ── Grid Section ── */
        .col-grid-section { padding: 56px 60px 64px; }
        .col-masonry-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px 20px;
        }
        .col-masonry-featured { grid-row: span 2; }

        /* ── Product Card ── */
        .col-card { cursor: pointer; }
        .col-card-img-wrap {
          position: relative;
          overflow: hidden;
          margin-bottom: 14px;
        }
        .col-card-img {
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.55s ease;
        }
        .col-card-img-label {
          font-family: var(--font-editorial);
          font-size: 12px;
          color: rgba(0,0,0,0.22);
          letter-spacing: 0.1em;
        }
        .col-tag {
          position: absolute;
          top: 12px; left: 12px;
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 4px 10px;
          font-weight: 500;
        }
        .col-hover-actions {
          position: absolute;
          top: 12px; right: 12px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          transition: opacity 0.25s;
        }
        .col-action-btn {
          width: 34px; height: 34px;
          border: 1px solid;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .col-action-qv {
          width: auto;
          padding: 0 10px;
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          white-space: nowrap;
        }
        .col-add-btn {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          color: var(--cream);
          padding: 13px;
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          transition: transform 0.3s ease;
        }
        .col-card-info {}
        .col-card-top-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }
        .col-card-cat {
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .col-card-stars { font-size: 11px; }
        .col-card-name {
          font-family: var(--font-display);
          font-weight: 400;
          margin-bottom: 5px;
          line-height: 1.25;
        }
        .col-card-price-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }
        .col-card-price { font-size: 14px; }
        .col-card-original { font-size: 12px; text-decoration: line-through; }
        .col-card-colors { display: flex; gap: 6px; }
        .col-color-dot {
          width: 13px; height: 13px;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid transparent;
          transition: transform 0.15s;
        }
        .col-color-dot:hover { transform: scale(1.2); }

        /* ── Pull Quote ── */
        .col-pull-quote-section { padding: 60px 60px; }
        .col-pull-quote-inner {
          max-width: 680px;
          margin: 0 auto;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }
        .col-pull-ornament { font-size: 18px; }
        .col-pull-quote {
          font-family: var(--font-editorial);
          font-size: 19px;
          font-style: italic;
          font-weight: 300;
          line-height: 1.7;
        }
        .col-pull-link {
          font-size: 12px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          border-bottom: 1px solid currentColor;
          padding-bottom: 2px;
          transition: opacity 0.2s;
        }
        .col-pull-link:hover { opacity: 0.7; }

        /* ── Other Collections ── */
        .col-others { padding: 64px 60px 80px; }
        .col-others-header {
          display: flex;
          align-items: center;
          gap: 24px;
          margin-bottom: 40px;
        }
        .col-others-title {
          font-family: var(--font-display);
          font-size: 26px;
          font-weight: 400;
          white-space: nowrap;
        }
        .col-others-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        .col-other-card { display: block; cursor: pointer; }
        .col-other-card:hover .col-other-img { filter: brightness(0.92); }
        .col-other-card:hover .col-other-img-overlay { opacity: 0.15; }
        .col-other-img {
          height: 220px;
          position: relative;
          overflow: hidden;
          transition: filter 0.3s;
        }
        .col-other-img-overlay {
          position: absolute;
          inset: 0;
          background: #000;
          opacity: 0;
          transition: opacity 0.3s;
        }
        .col-other-img-text {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          padding: 20px 16px 16px;
          background: linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%);
        }
        .col-other-eyebrow {
          display: block;
          font-size: 9px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          margin-bottom: 4px;
        }
        .col-other-title {
          font-family: var(--font-display);
          font-size: 15px;
          font-weight: 400;
        }
        .col-other-title em { font-style: italic; }
        .col-other-foot {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 14px;
          border: 1px solid;
          border-top: none;
          transition: border-color 0.2s;
        }
        .col-other-card:hover .col-other-foot { border-color: var(--charcoal) !important; }

        /* ── Responsive ── */
        @media (max-width: 1100px) {
          .col-hero-split-inner { grid-template-columns: 1fr 1fr; gap: 40px; }
          .col-hero-img-stack { height: 520px; }
          .col-masonry-grid { grid-template-columns: repeat(2, 1fr); }
          .col-masonry-featured { grid-row: span 1; }
          .col-others-grid { grid-template-columns: repeat(2, 1fr); }
          .col-hero-asym-inner { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 900px) {
          .col-hero-split,
          .col-grid-section,
          .col-pull-quote-section,
          .col-others { padding-left: 40px; padding-right: 40px; }
          .col-stats-bar { padding: 16px 40px; }
          .col-hero-split-inner { grid-template-columns: 1fr; }
          .col-hero-img-col { display: none; }
          .col-hero-asym-inner { grid-template-columns: 1fr; }
          .col-asym-imagery { height: 52vw; }
          .col-asym-img-sm { right: 0; }
          .col-asym-text { padding: 48px 40px; }
          .col-hero-full-overlay { padding: 40px; }
          .col-hero-dark-inner { grid-template-columns: 1fr; }
          .col-dark-imagery { display: none; }
          .col-dark-text { padding: 56px 40px; }
          .col-stats-mood { display: none; }
        }
        @media (max-width: 640px) {
          .col-hero-split,
          .col-grid-section,
          .col-pull-quote-section,
          .col-others { padding-left: 20px; padding-right: 20px; }
          .col-stats-bar { padding: 14px 20px; }
          .col-masonry-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .col-card-img { height: 240px !important; }
          .col-card-featured .col-card-img { height: 240px !important; }
          .col-others-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .col-other-img { height: 160px; }
          .col-asym-text { padding: 40px 20px; }
          .col-dark-text { padding: 48px 20px; }
          .col-hero-full-overlay { padding: 24px 20px; }
          .col-stats-inner { gap: 20px; }
          .col-stat-num { font-size: 18px; }
        }
      `}</style>
    </>
  );
}