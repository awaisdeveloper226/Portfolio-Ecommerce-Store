"use client";
const CATEGORIES = [
  "All",
  "Dresses",
  "Tops",
  "Trousers",
  "Outerwear",
  "Knitwear",
  "Accessories",
];
const SORT_OPTIONS = [
  "Newest",
  "Bestselling",
  "Price: Low–High",
  "Price: High–Low",
];

export default function ShopToolbar({
  activeCategory,
  setActiveCategory,
  activeSort,
  setActiveSort,
  productCount,
  viewMode,
  setViewMode,
}: {
  activeCategory: string;
  setActiveCategory: (c: string) => void;
  activeSort: string;
  setActiveSort: (s: string) => void;
  productCount: number;
  viewMode: "grid" | "list";
  setViewMode: (v: "grid" | "list") => void;
}) {
  return (
    <div className="shop-toolbar">
      {/* Category Pills */}
      <div className="category-pills">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`cat-pill ${activeCategory === cat ? "cat-pill-active" : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Right side controls */}
      <div className="toolbar-right">
        <span className="product-count">{productCount} pieces</span>

        {/* Sort */}
        <div className="sort-wrap">
          <label className="sort-label">Sort:</label>
          <select
            className="sort-select"
            value={activeSort}
            onChange={(e) => setActiveSort(e.target.value)}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="sort-chevron"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>

        {/* View toggles */}
        <div className="view-toggles">
          <button
            className={`view-btn ${viewMode === "grid" ? "view-btn-active" : ""}`}
            onClick={() => setViewMode("grid")}
            aria-label="Grid view"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
            </svg>
          </button>
          <button
            className={`view-btn ${viewMode === "list" ? "view-btn-active" : ""}`}
            onClick={() => setViewMode("list")}
            aria-label="List view"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
