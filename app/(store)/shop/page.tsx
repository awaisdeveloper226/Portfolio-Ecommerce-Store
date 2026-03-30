"use client";
import { useState } from "react";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import ShopHero from "@/components/ShopHero";
import ShopToolbar from "@/components/ShopToolbar";
import Footer from "@/components/Footer";

// ─── Filter Sidebar ───────────────────────────────────────────────────────────
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const COLOURS = [
  { label: "Ivory", hex: "#f5f0e8" },
  { label: "Sand", hex: "#d4b5a0" },
  { label: "Sage", hex: "#b8c4bb" },
  { label: "Slate", hex: "#9aacb0" },
  { label: "Charcoal", hex: "#2d2d2d" },
  { label: "Gold", hex: "#c9a96e" },
  { label: "Lavender", hex: "#c4b5d4" },
  { label: "Blush", hex: "#ddc5c5" },
];
const PRICE_RANGES = [
  "Under $100",
  "$100 – $200",
  "$200 – $350",
  "$350 – $500",
  "Over $500",
];

function FilterSidebar({
  selectedSizes,
  toggleSize,
  selectedColors,
  toggleColor,
  selectedPrices,
  togglePrice,
  onClear,
}: {
  selectedSizes: string[];
  toggleSize: (s: string) => void;
  selectedColors: string[];
  toggleColor: (c: string) => void;
  selectedPrices: string[];
  togglePrice: (p: string) => void;
  onClear: () => void;
}) {
  const [openSections, setOpenSections] = useState({
    size: true,
    color: true,
    price: true,
    material: false,
  });
  const toggle = (key: keyof typeof openSections) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const totalActive =
    selectedSizes.length + selectedColors.length + selectedPrices.length;

  return (
    <aside className="filter-sidebar">
      <div className="filter-header">
        <h3 className="filter-title">Filter</h3>
        {totalActive > 0 && (
          <button className="filter-clear" onClick={onClear}>
            Clear all ({totalActive})
          </button>
        )}
      </div>

      {/* Size */}
      <div className="filter-group">
        <button className="filter-group-header" onClick={() => toggle("size")}>
          <span>Size</span>
          <span className={`filter-chevron ${openSections.size ? "open" : ""}`}>
            +
          </span>
        </button>
        {openSections.size && (
          <div className="size-grid">
            {SIZES.map((s) => (
              <button
                key={s}
                className={`size-btn ${selectedSizes.includes(s) ? "size-btn-active" : ""}`}
                onClick={() => toggleSize(s)}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Colour */}
      <div className="filter-group">
        <button className="filter-group-header" onClick={() => toggle("color")}>
          <span>Colour</span>
          <span
            className={`filter-chevron ${openSections.color ? "open" : ""}`}
          >
            +
          </span>
        </button>
        {openSections.color && (
          <div className="color-filter-grid">
            {COLOURS.map((c) => (
              <button
                key={c.label}
                className={`color-filter-item ${selectedColors.includes(c.label) ? "color-filter-active" : ""}`}
                onClick={() => toggleColor(c.label)}
                title={c.label}
              >
                <span className="color-swatch" style={{ background: c.hex }} />
                <span className="color-filter-label">{c.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Price */}
      <div className="filter-group">
        <button className="filter-group-header" onClick={() => toggle("price")}>
          <span>Price</span>
          <span
            className={`filter-chevron ${openSections.price ? "open" : ""}`}
          >
            +
          </span>
        </button>
        {openSections.price && (
          <div className="price-list">
            {PRICE_RANGES.map((p) => (
              <label key={p} className="price-option">
                <input
                  type="checkbox"
                  checked={selectedPrices.includes(p)}
                  onChange={() => togglePrice(p)}
                  className="price-checkbox"
                />
                <span className="price-label">{p}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Material */}
      <div className="filter-group">
        <button
          className="filter-group-header"
          onClick={() => toggle("material")}
        >
          <span>Material</span>
          <span
            className={`filter-chevron ${openSections.material ? "open" : ""}`}
          >
            +
          </span>
        </button>
        {openSections.material && (
          <div className="price-list">
            {["Linen", "Silk", "Cashmere", "Wool", "Cotton", "Satin"].map(
              (m) => (
                <label key={m} className="price-option">
                  <input type="checkbox" className="price-checkbox" />
                  <span className="price-label">{m}</span>
                </label>
              ),
            )}
          </div>
        )}
      </div>

      {/* Sustainable */}
      <div className="filter-sustainability">
        <span className="sustain-icon">✦</span>
        <span>Show only sustainable pieces</span>
        <div className="toggle-switch">
          <input type="checkbox" id="sustain-toggle" className="toggle-input" />
          <label htmlFor="sustain-toggle" className="toggle-label" />
        </div>
      </div>
    </aside>
  );
}

// ─── Products Data ────────────────────────────────────────────────────────────
const allProducts = [
  {
    id: 1,
    name: "Silk Slip Dress",
    price: 285,
    category: "Dresses",
    tag: "Bestseller",
    color: "#e8d5c0",
    colors: ["#d4b5a0", "#2d2d2d", "#b8c4bb"],
    reviews: 142,
    sizes: ["XS", "S", "M", "L"],
  },
  {
    id: 2,
    name: "Linen Wide Trousers",
    price: 195,
    originalPrice: 240,
    category: "Trousers",
    tag: "Sale",
    color: "#c8d5c0",
    colors: ["#c8d5c0", "#2d2d2d", "#d4b5a0"],
    reviews: 87,
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 3,
    name: "Cashmere Turtleneck",
    price: 320,
    category: "Knitwear",
    tag: "New",
    color: "#d0c8d5",
    colors: ["#d0c8d5", "#2d2d2d", "#e8d5c0"],
    reviews: 53,
    sizes: ["XS", "S", "M"],
  },
  {
    id: 4,
    name: "Wrap Blazer",
    price: 410,
    category: "Outerwear",
    tag: "New",
    color: "#d5d0c0",
    colors: ["#d5d0c0", "#2d2d2d"],
    reviews: 29,
    sizes: ["S", "M", "L"],
  },
  {
    id: 5,
    name: "Fluid Midi Skirt",
    price: 175,
    category: "Dresses",
    tag: null,
    color: "#ddc5b5",
    colors: ["#ddc5b5", "#b8c4bb", "#c9a96e"],
    reviews: 142,
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: 6,
    name: "Oversized Linen Shirt",
    price: 145,
    category: "Tops",
    tag: null,
    color: "#c5ddc5",
    colors: ["#c5ddc5", "#f5f0e8", "#2d2d2d"],
    reviews: 98,
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: 7,
    name: "Cropped Wool Jacket",
    price: 390,
    category: "Outerwear",
    tag: null,
    color: "#c5c5dd",
    colors: ["#c5c5dd", "#2d2d2d"],
    reviews: 76,
    sizes: ["XS", "S", "M"],
  },
  {
    id: 8,
    name: "Satin Cami Top",
    price: 95,
    category: "Tops",
    tag: "Bestseller",
    color: "#ddd5c5",
    colors: ["#ddd5c5", "#2d2d2d", "#ddc5c5"],
    reviews: 203,
    sizes: ["XS", "S", "M", "L"],
  },
  {
    id: 9,
    name: "Tailored Shorts",
    price: 160,
    category: "Trousers",
    tag: null,
    color: "#c5ddd5",
    colors: ["#c5ddd5", "#d4b5a0", "#2d2d2d"],
    reviews: 55,
    sizes: ["S", "M", "L"],
  },
  {
    id: 10,
    name: "Ribbed Maxi Dress",
    price: 255,
    category: "Dresses",
    tag: "New",
    color: "#ddc5d0",
    colors: ["#ddc5d0", "#2d2d2d", "#b8c4bb"],
    reviews: 187,
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: 11,
    name: "Silk Scarf",
    price: 85,
    category: "Accessories",
    tag: null,
    color: "#e8d5b0",
    colors: ["#e8d5b0", "#ddc5c5", "#b8c4bb"],
    reviews: 64,
    sizes: [],
  },
  {
    id: 12,
    name: "Leather Belt",
    price: 115,
    category: "Accessories",
    tag: "New",
    color: "#c0ae98",
    colors: ["#c0ae98", "#2d2d2d"],
    reviews: 38,
    sizes: [],
  },
  {
    id: 13,
    name: "Wide-Brim Hat",
    price: 135,
    category: "Accessories",
    tag: null,
    color: "#d4c4b0",
    colors: ["#d4c4b0", "#2d2d2d"],
    reviews: 47,
    sizes: [],
  },
  {
    id: 14,
    name: "Pleated Midi Dress",
    price: 310,
    category: "Dresses",
    tag: "New",
    color: "#b8ccc4",
    colors: ["#b8ccc4", "#ddc5d0", "#2d2d2d"],
    reviews: 31,
    sizes: ["XS", "S", "M", "L"],
  },
  {
    id: 15,
    name: "Merino Cardigan",
    price: 275,
    category: "Knitwear",
    tag: null,
    color: "#c8d5e0",
    colors: ["#c8d5e0", "#ddd5c5", "#2d2d2d"],
    reviews: 112,
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: 16,
    name: "Linen Co-ord Set",
    price: 320,
    category: "Tops",
    tag: "Bestseller",
    color: "#e0dac8",
    colors: ["#e0dac8", "#c5ddc5", "#ddc5c5"],
    reviews: 89,
    sizes: ["S", "M", "L"],
  },
];

// ─── Product Card ─────────────────────────────────────────────────────────────
type Product = (typeof allProducts)[0];

function ProductCard({
  product,
  listMode,
}: {
  product: Product;
  listMode: boolean;
}) {
  const [wishlisted, setWishlisted] = useState(false);

  if (listMode) {
    return (
      <div className="product-list-card">
        <div className="list-img" style={{ background: product.color }}>
          <span className="product-img-text">Product Image</span>
          {product.tag && (
            <span
              className={`product-tag ${product.tag === "Sale" ? "tag-sale" : product.tag === "Bestseller" ? "tag-best" : "tag-new"}`}
            >
              {product.tag}
            </span>
          )}
        </div>
        <div className="list-info">
          <div className="list-info-top">
            <span className="list-category">{product.category}</span>
            <h3 className="list-name">{product.name}</h3>
            <p className="list-meta">
              {product.sizes.length > 0 &&
                `Sizes: ${product.sizes.join(", ")} · `}
              ★ {product.reviews} reviews
            </p>
          </div>
          <div className="list-info-bottom">
            <div className="product-colors">
              {product.colors.map((c) => (
                <button
                  key={c}
                  className="color-dot"
                  style={{ background: c }}
                />
              ))}
            </div>
            <div className="list-price-row">
              <span className="product-price">${product.price}</span>
              {product.originalPrice && (
                <span className="product-original">
                  ${product.originalPrice}
                </span>
              )}
            </div>
            <div className="list-actions">
              <button
                className="list-wishlist"
                onClick={() => setWishlisted(!wishlisted)}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill={wishlisted ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
              <button className="list-add-to-cart">Add to Cart</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          <button
            className={`hover-action-btn ${wishlisted ? "wishlisted" : ""}`}
            aria-label="Add to wishlist"
            onClick={() => setWishlisted(!wishlisted)}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill={wishlisted ? "currentColor" : "none"}
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
        <div className="product-reviews-row">
          <span className="product-cat-label">{product.category}</span>
          <span className="product-reviews-small">★ {product.reviews}</span>
        </div>
        <h3 className="product-name">{product.name}</h3>
        <div className="product-price-row">
          <span className="product-price">${product.price}</span>
          {product.originalPrice && (
            <span className="product-original">${product.originalPrice}</span>
          )}
        </div>
        <div className="product-colors">
          {product.colors.map((c) => (
            <button
              key={c}
              className="color-dot"
              style={{ background: c }}
              aria-label={`Color`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">✦</div>
      <h3 className="empty-title">No pieces found</h3>
      <p className="empty-sub">
        Try adjusting your filters to find what you&apos;re looking for.
      </p>
      <button className="btn-primary" onClick={onClear}>
        Clear Filters
      </button>
    </div>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────
function Pagination({
  current,
  total,
  onChange,
}: {
  current: number;
  total: number;
  onChange: (p: number) => void;
}) {
  return (
    <div className="pagination">
      <button
        className="page-btn page-arrow"
        onClick={() => onChange(Math.max(1, current - 1))}
        disabled={current === 1}
      >
        ←
      </button>
      {Array.from({ length: total }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          className={`page-btn ${current === p ? "page-active" : ""}`}
          onClick={() => onChange(p)}
        >
          {p}
        </button>
      ))}
      <button
        className="page-btn page-arrow"
        onClick={() => onChange(Math.min(total, current + 1))}
        disabled={current === total}
      >
        →
      </button>
    </div>
  );
}

// ─── Recently Viewed Strip ────────────────────────────────────────────────────
function RecentlyViewed() {
  const recent = allProducts.slice(0, 4);
  return (
    <section className="recently-viewed">
      <div className="section-header" style={{ marginBottom: 32 }}>
        <div className="section-header-line" />
        <h2 className="section-title">Recently Viewed</h2>
        <div className="section-header-line" />
      </div>
      <div className="products-grid" style={{ padding: "0 60px" }}>
        {recent.map((p) => (
          <ProductCard key={p.id} product={p} listMode={false} />
        ))}
      </div>
    </section>
  );
}

// ─── Main Shop Page ───────────────────────────────────────────────────────────
export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeSort, setActiveSort] = useState("Newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const PER_PAGE = 8;

  const toggleSize = (s: string) =>
    setSelectedSizes((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );
  const toggleColor = (c: string) =>
    setSelectedColors((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
    );
  const togglePrice = (p: string) =>
    setSelectedPrices((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p],
    );

  const clearFilters = () => {
    setSelectedSizes([]);
    setSelectedColors([]);
    setSelectedPrices([]);
  };

  // Filter
  let filtered = allProducts.filter((p) => {
    if (activeCategory !== "All" && p.category !== activeCategory) return false;
    if (
      selectedSizes.length > 0 &&
      !selectedSizes.some((s) => p.sizes.includes(s))
    )
      return false;
    return true;
  });

  // Sort
  if (activeSort === "Price: Low–High")
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  else if (activeSort === "Price: High–Low")
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  else if (activeSort === "Bestselling")
    filtered = [...filtered].sort((a, b) => b.reviews - a.reviews);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE,
  );

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main>
        <ShopHero activeCategory={activeCategory} />
        <ShopToolbar
          activeCategory={activeCategory}
          setActiveCategory={(c) => {
            setActiveCategory(c);
            setCurrentPage(1);
          }}
          activeSort={activeSort}
          setActiveSort={setActiveSort}
          productCount={filtered.length}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />
        <div className="shop-layout">
          <FilterSidebar
            selectedSizes={selectedSizes}
            toggleSize={toggleSize}
            selectedColors={selectedColors}
            toggleColor={toggleColor}
            selectedPrices={selectedPrices}
            togglePrice={togglePrice}
            onClear={clearFilters}
          />
          <div className="shop-main">
            {paginated.length === 0 ? (
              <EmptyState onClear={clearFilters} />
            ) : (
              <div
                className={
                  viewMode === "grid" ? "products-grid" : "products-list"
                }
              >
                {paginated.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    listMode={viewMode === "list"}
                  />
                ))}
              </div>
            )}
            {totalPages > 1 && (
              <Pagination
                current={currentPage}
                total={totalPages}
                onChange={setCurrentPage}
              />
            )}
          </div>
        </div>
        <RecentlyViewed />
      </main>

      <Footer/>
    </>
  );
}
