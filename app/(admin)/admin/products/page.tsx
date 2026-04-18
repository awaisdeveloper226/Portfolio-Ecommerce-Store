"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

// ─── Mock data ────────────────────────────────────────────────────────────────
const PRODUCTS_DATA = [
  { id: 1,  name: "Silk Slip Dress",        slug: "silk-slip-dress",        category: "dresses",     tag: "Bestseller", price: 285, compareAt: null, stock: 42, status: "Active",   sku: "SSD-xxx", colors: 3, sizes: 4, image: "#e8d5c0" },
  { id: 2,  name: "Linen Wide Trousers",    slug: "linen-wide-trousers",    category: "trousers",    tag: "Sale",       price: 195, compareAt: 240,  stock: 18, status: "Active",   sku: "LWT-xxx", colors: 3, sizes: 4, image: "#c8d5c0" },
  { id: 3,  name: "Cashmere Turtleneck",    slug: "cashmere-turtleneck",    category: "knitwear",    tag: "New",        price: 320, compareAt: null, stock: 2,  status: "Active",   sku: "CTN-xxx", colors: 3, sizes: 3, image: "#d0c8d5" },
  { id: 4,  name: "Wrap Blazer",            slug: "wrap-blazer",            category: "outerwear",   tag: "New",        price: 410, compareAt: null, stock: 1,  status: "Active",   sku: "WBL-xxx", colors: 2, sizes: 3, image: "#d5d0c0" },
  { id: 5,  name: "Fluid Midi Skirt",       slug: "fluid-midi-skirt",       category: "dresses",     tag: null,         price: 175, compareAt: null, stock: 56, status: "Active",   sku: "FMS-xxx", colors: 3, sizes: 5, image: "#ddc5b5" },
  { id: 6,  name: "Oversized Linen Shirt",  slug: "oversized-linen-shirt",  category: "tops",        tag: null,         price: 145, compareAt: null, stock: 89, status: "Active",   sku: "OLS-xxx", colors: 3, sizes: 5, image: "#c5ddc5" },
  { id: 7,  name: "Cropped Wool Jacket",    slug: "cropped-wool-jacket",    category: "outerwear",   tag: null,         price: 390, compareAt: null, stock: 14, status: "Active",   sku: "CWJ-xxx", colors: 2, sizes: 3, image: "#c5c5dd" },
  { id: 8,  name: "Satin Cami Top",         slug: "satin-cami-top",         category: "tops",        tag: "Bestseller", price: 95,  compareAt: null, stock: 67, status: "Active",   sku: "SCT-xxx", colors: 3, sizes: 4, image: "#ddd5c5" },
  { id: 9,  name: "Tailored Shorts",        slug: "tailored-shorts",        category: "trousers",    tag: null,         price: 160, compareAt: null, stock: 23, status: "Active",   sku: "TSH-xxx", colors: 3, sizes: 3, image: "#c5ddd5" },
  { id: 10, name: "Ribbed Maxi Dress",      slug: "ribbed-maxi-dress",      category: "dresses",     tag: "New",        price: 255, compareAt: null, stock: 31, status: "Active",   sku: "RMD-xxx", colors: 3, sizes: 5, image: "#ddc5d0" },
  { id: 11, name: "Silk Scarf",             slug: "silk-scarf",             category: "accessories", tag: null,         price: 85,  compareAt: null, stock: 44, status: "Active",   sku: "SSL-xxx", colors: 3, sizes: 0, image: "#e8d5b0" },
  { id: 12, name: "Leather Belt",           slug: "leather-belt",           category: "accessories", tag: "New",        price: 115, compareAt: null, stock: 28, status: "Active",   sku: "LBT-xxx", colors: 2, sizes: 0, image: "#c0ae98" },
  { id: 13, name: "Wide-Brim Hat",          slug: "wide-brim-hat",          category: "accessories", tag: null,         price: 135, compareAt: null, stock: 19, status: "Active",   sku: "WBH-xxx", colors: 2, sizes: 0, image: "#d4c4b0" },
  { id: 14, name: "Pleated Midi Dress",     slug: "pleated-midi-dress",     category: "dresses",     tag: "New",        price: 310, compareAt: null, stock: 3,  status: "Active",   sku: "PMD-xxx", colors: 3, sizes: 4, image: "#b8ccc4" },
  { id: 15, name: "Merino Cardigan",        slug: "merino-cardigan",        category: "knitwear",    tag: null,         price: 275, compareAt: null, stock: 37, status: "Active",   sku: "MCG-xxx", colors: 3, sizes: 5, image: "#c8d5e0" },
  { id: 16, name: "Linen Co-ord Set",       slug: "linen-co-ord-set",       category: "tops",        tag: "Bestseller", price: 320, compareAt: null, stock: 24, status: "Active",   sku: "LCS-xxx", colors: 3, sizes: 3, image: "#e0dac8" },
  { id: 17, name: "Silk Blouse",            slug: "silk-blouse",            category: "tops",        tag: "New",        price: 210, compareAt: null, stock: 0,  status: "Draft",    sku: "SBL-xxx", colors: 3, sizes: 4, image: "#e8d5d5" },
  { id: 18, name: "Straight-Leg Trousers",  slug: "straight-leg-trousers",  category: "trousers",    tag: "Sale",       price: 220, compareAt: 280,  stock: 12, status: "Active",   sku: "SLT-xxx", colors: 2, sizes: 5, image: "#d0d5c8" },
  { id: 19, name: "Double-Breasted Coat",   slug: "double-breasted-coat",   category: "outerwear",   tag: "New",        price: 590, compareAt: null, stock: 3,  status: "Active",   sku: "DBC-xxx", colors: 3, sizes: 4, image: "#c8c0b8" },
  { id: 20, name: "Alpaca Ribbed Pullover", slug: "alpaca-ribbed-pullover", category: "knitwear",    tag: null,         price: 340, compareAt: null, stock: 16, status: "Archived", sku: "ARP-xxx", colors: 3, sizes: 4, image: "#e0d8cc" },
];

const CATEGORIES = ["All", "dresses", "tops", "trousers", "outerwear", "knitwear", "accessories"];
const STATUSES   = ["All", "Active", "Draft", "Archived"];
const TAGS       = ["All", "New", "Bestseller", "Sale"];

type SortKey = "name" | "price" | "stock" | "category";
type SortDir = "asc" | "desc";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) return <span className="prd-stock prd-stock-out">Out of stock</span>;
  if (stock <= 3)  return <span className="prd-stock prd-stock-low">{stock} left</span>;
  return <span className="prd-stock prd-stock-ok">{stock}</span>;
}

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Active: "#4caf7d",
    Draft: "#c9a96e",
    Archived: "#6b6560",
  };
  return (
    <span className="prd-status-dot-wrap">
      <span className="prd-status-dot" style={{ background: colors[status] ?? "#6b6560" }} />
      <span className="prd-status-text">{status}</span>
    </span>
  );
}

function TagChip({ tag }: { tag: string | null }) {
  if (!tag) return <span className="prd-tag-none">—</span>;
  const colors: Record<string, string> = {
    New: "#5c8ee0",
    Bestseller: "#c9a96e",
    Sale: "#e05c5c",
  };
  return (
    <span className="prd-tag" style={{ color: colors[tag], borderColor: `${colors[tag]}40`, background: `${colors[tag]}12` }}>
      {tag}
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminProductsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [tag, setTag] = useState("All");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [selected, setSelected] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  // Filter & sort
  const filtered = useMemo(() => {
    let data = [...PRODUCTS_DATA];
    if (search)             data = data.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()));
    if (category !== "All") data = data.filter(p => p.category === category);
    if (status !== "All")   data = data.filter(p => p.status === status);
    if (tag !== "All")      data = data.filter(p => p.tag === tag);
    data.sort((a, b) => {
      const av = a[sortKey] ?? 0;
      const bv = b[sortKey] ?? 0;
      if (typeof av === "string") return sortDir === "asc" ? av.localeCompare(bv as string) : (bv as string).localeCompare(av);
      return sortDir === "asc" ? (av as number) - (bv as number) : (bv as number) - (av as number);
    });
    return data;
  }, [search, category, status, tag, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const allSelected = paginated.length > 0 && paginated.every(p => selected.includes(p.id));
  const toggleAll   = () => setSelected(allSelected ? selected.filter(id => !paginated.map(p => p.id).includes(id)) : [...new Set([...selected, ...paginated.map(p => p.id)])]);
  const toggleOne   = (id: number) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  const sortBy = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
    setPage(1);
  };

  const SortIcon = ({ col }: { col: SortKey }) => (
    <span className="prd-sort-icon">
      {sortKey === col ? (sortDir === "asc" ? " ↑" : " ↓") : " ↕"}
    </span>
  );

  return (
    <div className="prd-page">

      {/* ── Header ── */}
      <div className="prd-header">
        <div>
          <h1 className="prd-title">Products</h1>
          <p className="prd-sub">{PRODUCTS_DATA.length} total · {PRODUCTS_DATA.filter(p => p.status === "Active").length} active</p>
        </div>
        <div className="prd-header-actions">
          <button className="prd-btn-ghost">↓ Export CSV</button>
          <button className="prd-btn-ghost">↑ Import</button>
          <Link href="/admin/products/new" className="prd-btn-primary">
            + Add Product
          </Link>
        </div>
      </div>

      {/* ── Filters row ── */}
      <div className="prd-filters">
        {/* Search */}
        <div className="prd-search-wrap">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            className="prd-search"
            placeholder="Search products or SKU…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
          {search && (
            <button className="prd-search-clear" onClick={() => setSearch("")}>×</button>
          )}
        </div>

        <div className="prd-filter-row">
          {/* Category */}
          <div className="prd-select-wrap">
            <select className="prd-select" value={category} onChange={e => { setCategory(e.target.value); setPage(1); }}>
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c === "All" ? "All Categories" : c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="prd-select-chevron">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>

          {/* Status */}
          <div className="prd-select-wrap">
            <select className="prd-select" value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}>
              {STATUSES.map(s => <option key={s} value={s}>{s === "All" ? "All Statuses" : s}</option>)}
            </select>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="prd-select-chevron">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>

          {/* Tag */}
          <div className="prd-select-wrap">
            <select className="prd-select" value={tag} onChange={e => { setTag(e.target.value); setPage(1); }}>
              {TAGS.map(t => <option key={t} value={t}>{t === "All" ? "All Tags" : t}</option>)}
            </select>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="prd-select-chevron">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>

          {/* Active filter count */}
          {(category !== "All" || status !== "All" || tag !== "All" || search) && (
            <button
              className="prd-clear-filters"
              onClick={() => { setSearch(""); setCategory("All"); setStatus("All"); setTag("All"); setPage(1); }}
            >
              Clear filters ×
            </button>
          )}
        </div>
      </div>

      {/* ── Bulk actions bar ── */}
      {selected.length > 0 && (
        <div className="prd-bulk-bar">
          <span className="prd-bulk-count">{selected.length} selected</span>
          <div className="prd-bulk-actions">
            <button className="prd-bulk-btn">Set Active</button>
            <button className="prd-bulk-btn">Set Draft</button>
            <button className="prd-bulk-btn">Archive</button>
            <button className="prd-bulk-btn prd-bulk-danger">Delete</button>
          </div>
          <button className="prd-bulk-clear" onClick={() => setSelected([])}>Deselect all</button>
        </div>
      )}

      {/* ── Table ── */}
      <div className="prd-table-card">
        <div className="prd-table-wrap">
          <table className="prd-table">
            <thead>
              <tr>
                <th className="prd-th-check">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="prd-checkbox"
                  />
                </th>
                <th>Product</th>
                <th className="prd-th-sort" onClick={() => sortBy("category")}>
                  Category <SortIcon col="category" />
                </th>
                <th>Tag</th>
                <th className="prd-th-sort" onClick={() => sortBy("price")}>
                  Price <SortIcon col="price" />
                </th>
                <th className="prd-th-sort" onClick={() => sortBy("stock")}>
                  Stock <SortIcon col="stock" />
                </th>
                <th>Variants</th>
                <th>Status</th>
                <th className="prd-th-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={9} className="prd-empty-row">
                    <div className="prd-empty">
                      <span className="prd-empty-icon">◈</span>
                      <p>No products match your filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((p) => (
                  <tr key={p.id} className={`prd-row ${selected.includes(p.id) ? "prd-row-selected" : ""}`}>
                    <td className="prd-td-check">
                      <input
                        type="checkbox"
                        checked={selected.includes(p.id)}
                        onChange={() => toggleOne(p.id)}
                        className="prd-checkbox"
                      />
                    </td>
                    <td className="prd-td-product">
                      <div className="prd-product-cell">
                        <div className="prd-thumb" style={{ background: p.image }} />
                        <div className="prd-product-info">
                          <Link href={`/admin/products/${p.id}`} className="prd-product-name">
                            {p.name}
                          </Link>
                          <p className="prd-product-slug">{p.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="prd-category-chip">
                        {p.category.charAt(0).toUpperCase() + p.category.slice(1)}
                      </span>
                    </td>
                    <td><TagChip tag={p.tag} /></td>
                    <td className="prd-td-price">
                      <span className="prd-price">${p.price}</span>
                      {p.compareAt && (
                        <span className="prd-compare">${p.compareAt}</span>
                      )}
                    </td>
                    <td><StockBadge stock={p.stock} /></td>
                    <td className="prd-td-variants">
                      <span className="prd-variants">{p.colors} colors</span>
                      {p.sizes > 0 && <span className="prd-variants"> · {p.sizes} sizes</span>}
                    </td>
                    <td><StatusDot status={p.status} /></td>
                    <td className="prd-td-actions">
                      <div className="prd-actions">
                        <Link href={`/admin/products/${p.id}`} className="prd-action-btn" title="Edit">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </Link>
                        <Link href={`/products/${p.slug}`} target="_blank" className="prd-action-btn" title="View on store">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                          </svg>
                        </Link>
                        <button className="prd-action-btn prd-action-danger" title="Delete">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                            <path d="M10 11v6M14 11v6" />
                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        <div className="prd-pagination">
          <p className="prd-pagination-info">
            Showing {Math.min((page - 1) * PER_PAGE + 1, filtered.length)}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length} products
          </p>
          <div className="prd-pagination-btns">
            <button
              className="prd-page-btn"
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
            >
              ← Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .reduce<(number | "…")[]>((acc, p, i, arr) => {
                if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("…");
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === "…" ? (
                  <span key={`ellipsis-${i}`} className="prd-page-ellipsis">…</span>
                ) : (
                  <button
                    key={p}
                    className={`prd-page-btn prd-page-num ${page === p ? "prd-page-active" : ""}`}
                    onClick={() => setPage(p as number)}
                  >
                    {p}
                  </button>
                )
              )}
            <button
              className="prd-page-btn"
              disabled={page === totalPages || totalPages === 0}
              onClick={() => setPage(p => p + 1)}
            >
              Next →
            </button>
          </div>
        </div>
      </div>

      <style>{`
        /* ── Products page ── */
        .prd-page { display: flex; flex-direction: column; gap: 20px; }

        /* Header */
        .prd-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }
        .prd-title {
          font-family: var(--font-display);
          font-size: 26px;
          font-weight: 400;
          color: var(--adm-text);
          margin-bottom: 4px;
        }
        .prd-sub { font-size: 13px; color: var(--adm-muted); }
        .prd-header-actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .prd-btn-ghost {
          padding: 8px 14px;
          font-size: 12px;
          letter-spacing: 0.04em;
          color: var(--adm-muted);
          border: 1px solid var(--adm-border);
          background: transparent;
          cursor: pointer;
          font-family: var(--font-body);
          transition: all 0.15s;
        }
        .prd-btn-ghost:hover { color: var(--adm-text); border-color: var(--adm-border2); }
        .prd-btn-primary {
          padding: 8px 18px;
          background: var(--adm-gold);
          color: #0f0f0f;
          font-size: 12px;
          letter-spacing: 0.06em;
          font-family: var(--font-body);
          text-decoration: none;
          display: inline-block;
          transition: opacity 0.15s;
        }
        .prd-btn-primary:hover { opacity: 0.88; }

        /* Filters */
        .prd-filters {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .prd-search-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 9px 14px;
          border: 1px solid var(--adm-border);
          background: var(--adm-surface);
          color: var(--adm-muted);
          max-width: 360px;
          position: relative;
        }
        .prd-search {
          border: none;
          background: transparent;
          font-size: 13px;
          color: var(--adm-text);
          font-family: var(--font-body);
          outline: none;
          flex: 1;
          min-width: 0;
        }
        .prd-search::placeholder { color: var(--adm-muted); }
        .prd-search-clear {
          font-size: 16px;
          color: var(--adm-muted);
          background: none;
          border: none;
          cursor: pointer;
          line-height: 1;
          padding: 0 2px;
          transition: color 0.15s;
        }
        .prd-search-clear:hover { color: var(--adm-text); }

        .prd-filter-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .prd-select-wrap { position: relative; }
        .prd-select {
          appearance: none;
          border: 1px solid var(--adm-border);
          background: var(--adm-surface);
          padding: 7px 28px 7px 12px;
          font-size: 12px;
          color: var(--adm-text);
          font-family: var(--font-body);
          cursor: pointer;
          outline: none;
          transition: border-color 0.15s;
        }
        .prd-select:hover { border-color: var(--adm-border2); }
        .prd-select-chevron {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: var(--adm-muted);
        }
        .prd-clear-filters {
          font-size: 12px;
          color: var(--adm-gold);
          background: none;
          border: none;
          cursor: pointer;
          font-family: var(--font-body);
          letter-spacing: 0.04em;
          padding: 6px 0;
          transition: opacity 0.15s;
        }
        .prd-clear-filters:hover { opacity: 0.75; }

        /* Bulk bar */
        .prd-bulk-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 16px;
          background: var(--adm-gold-dim);
          border: 1px solid rgba(201,169,110,0.25);
          flex-wrap: wrap;
          animation: prd-bar-in 0.2s ease both;
        }
        @keyframes prd-bar-in {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .prd-bulk-count {
          font-size: 12px;
          color: var(--adm-gold);
          font-weight: 500;
          letter-spacing: 0.04em;
        }
        .prd-bulk-actions { display: flex; gap: 6px; flex: 1; flex-wrap: wrap; }
        .prd-bulk-btn {
          padding: 5px 12px;
          font-size: 11px;
          letter-spacing: 0.06em;
          color: var(--adm-text);
          border: 1px solid var(--adm-border2);
          background: var(--adm-surface2);
          cursor: pointer;
          font-family: var(--font-body);
          transition: all 0.15s;
        }
        .prd-bulk-btn:hover { border-color: var(--adm-text); }
        .prd-bulk-danger { color: #e05c5c !important; border-color: rgba(224,92,92,0.3) !important; }
        .prd-bulk-danger:hover { background: rgba(224,92,92,0.1) !important; }
        .prd-bulk-clear {
          font-size: 11px;
          color: var(--adm-muted);
          background: none;
          border: none;
          cursor: pointer;
          font-family: var(--font-body);
          transition: color 0.15s;
          margin-left: auto;
        }
        .prd-bulk-clear:hover { color: var(--adm-text); }

        /* Table card */
        .prd-table-card {
          background: var(--adm-surface);
          border: 1px solid var(--adm-border);
          overflow: hidden;
        }
        .prd-table-wrap { overflow-x: auto; }
        .prd-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }
        .prd-table thead tr {
          border-bottom: 1px solid var(--adm-border);
          background: var(--adm-surface2);
        }
        .prd-table th {
          padding: 11px 14px;
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--adm-muted);
          font-weight: 400;
          text-align: left;
          white-space: nowrap;
        }
        .prd-th-check { width: 40px; padding-right: 0; }
        .prd-th-sort { cursor: pointer; user-select: none; }
        .prd-th-sort:hover { color: var(--adm-text); }
        .prd-th-actions { text-align: right; }
        .prd-sort-icon { font-size: 10px; color: var(--adm-muted2); }

        /* Rows */
        .prd-row {
          border-bottom: 1px solid var(--adm-border);
          transition: background 0.12s;
        }
        .prd-row:last-child { border-bottom: none; }
        .prd-row:hover { background: var(--adm-surface2); }
        .prd-row-selected { background: var(--adm-gold-dim) !important; }
        .prd-table td { padding: 12px 14px; vertical-align: middle; }
        .prd-td-check { width: 40px; padding-right: 0; }
        .prd-checkbox { accent-color: var(--adm-gold); cursor: pointer; width: 14px; height: 14px; }

        /* Product cell */
        .prd-product-cell { display: flex; align-items: center; gap: 12px; }
        .prd-thumb {
          width: 40px;
          height: 50px;
          flex-shrink: 0;
          border-radius: 1px;
          border: 1px solid var(--adm-border);
        }
        .prd-product-name {
          font-size: 13px;
          color: var(--adm-text);
          text-decoration: none;
          font-weight: 500;
          display: block;
          margin-bottom: 2px;
          transition: color 0.15s;
          white-space: nowrap;
        }
        .prd-product-name:hover { color: var(--adm-gold); }
        .prd-product-slug { font-size: 11px; color: var(--adm-muted); letter-spacing: 0.02em; }

        /* Misc cells */
        .prd-category-chip {
          font-size: 11px;
          letter-spacing: 0.06em;
          color: var(--adm-muted);
          border: 1px solid var(--adm-border);
          padding: 2px 8px;
          white-space: nowrap;
        }
        .prd-tag {
          font-size: 10px;
          letter-spacing: 0.08em;
          border: 1px solid;
          padding: 2px 7px;
          white-space: nowrap;
        }
        .prd-tag-none { color: var(--adm-muted2); font-size: 13px; }
        .prd-td-price { white-space: nowrap; }
        .prd-price { font-size: 13px; color: var(--adm-text); }
        .prd-compare {
          font-size: 11px;
          color: var(--adm-muted);
          text-decoration: line-through;
          margin-left: 6px;
        }
        .prd-stock {
          font-size: 11px;
          letter-spacing: 0.06em;
          padding: 2px 8px;
          display: inline-block;
        }
        .prd-stock-ok   { color: #4caf7d; background: rgba(76,175,125,0.1); }
        .prd-stock-low  { color: #c9a96e; background: rgba(201,169,110,0.1); }
        .prd-stock-out  { color: #e05c5c; background: rgba(224,92,92,0.1); }
        .prd-td-variants { white-space: nowrap; }
        .prd-variants { font-size: 12px; color: var(--adm-muted); }
        .prd-status-dot-wrap { display: flex; align-items: center; gap: 7px; }
        .prd-status-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
        .prd-status-text { font-size: 12px; color: var(--adm-muted); }

        /* Actions */
        .prd-td-actions { text-align: right; }
        .prd-actions { display: flex; align-items: center; gap: 4px; justify-content: flex-end; }
        .prd-action-btn {
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid transparent;
          background: transparent;
          color: var(--adm-muted);
          cursor: pointer;
          transition: all 0.15s;
          text-decoration: none;
        }
        .prd-action-btn:hover { border-color: var(--adm-border2); color: var(--adm-text); background: var(--adm-surface2); }
        .prd-action-danger:hover { color: #e05c5c !important; border-color: rgba(224,92,92,0.4) !important; }

        /* Empty */
        .prd-empty-row { padding: 0 !important; }
        .prd-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          padding: 56px 20px;
          color: var(--adm-muted);
          font-size: 14px;
        }
        .prd-empty-icon { font-size: 28px; color: var(--adm-muted2); }

        /* Pagination */
        .prd-pagination {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 18px;
          border-top: 1px solid var(--adm-border);
          gap: 16px;
          flex-wrap: wrap;
        }
        .prd-pagination-info { font-size: 12px; color: var(--adm-muted); }
        .prd-pagination-btns { display: flex; align-items: center; gap: 4px; }
        .prd-page-btn {
          padding: 5px 12px;
          font-size: 12px;
          border: 1px solid var(--adm-border);
          background: transparent;
          color: var(--adm-muted);
          cursor: pointer;
          font-family: var(--font-body);
          transition: all 0.15s;
        }
        .prd-page-btn:hover:not(:disabled) { border-color: var(--adm-border2); color: var(--adm-text); }
        .prd-page-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        .prd-page-num { width: 32px; padding: 5px 0; text-align: center; }
        .prd-page-active { background: var(--adm-gold-dim); border-color: rgba(201,169,110,0.4) !important; color: var(--adm-gold) !important; }
        .prd-page-ellipsis { padding: 5px 6px; font-size: 12px; color: var(--adm-muted2); }

        /* Responsive */
        @media (max-width: 900px) {
          .prd-table th:nth-child(7), .prd-table td:nth-child(7) { display: none; }
          .prd-table th:nth-child(4), .prd-table td:nth-child(4) { display: none; }
        }
        @media (max-width: 640px) {
          .prd-header { flex-direction: column; }
          .prd-table th:nth-child(6), .prd-table td:nth-child(6) { display: none; }
        }
      `}</style>
    </div>
  );
}