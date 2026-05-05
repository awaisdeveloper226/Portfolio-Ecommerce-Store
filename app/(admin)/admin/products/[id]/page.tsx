"use client";

import { use, useState } from "react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────
type ProductStatus = "Active" | "Draft" | "Archived";
type Category = "dresses" | "tops" | "trousers" | "outerwear" | "knitwear" | "accessories";

type Variant = {
  id: string;
  color: string;
  colorLabel: string;
  colorHex: string;
  size: string;
  sku: string;
  stock: number;
  price?: number;
};

type Product = {
  id: number;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: Category;
  price: number;
  compareAtPrice: number | null;
  tag: "New" | "Bestseller" | "Sale" | null;
  status: ProductStatus;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestseller: boolean;
  isSustainable: boolean;
  materials: string[];
  careInstructions: string;
  sustainability: string;
  collections: string[];
  variants: Variant[];
  images: { url: string; alt: string; position: number; color: string }[];
  reviewCount: number;
  averageRating: number;
  totalStock: number;
  metaTitle: string;
  metaDescription: string;
  weight: number;
  updatedAt: string;
};

// ─── Mock Product Data ────────────────────────────────────────────────────────
const MOCK_PRODUCTS: Record<string, Product> = {
  "1": {
    id: 1,
    name: "Silk Slip Dress",
    slug: "silk-slip-dress",
    description: "A fluid slip dress in pure mulberry silk, designed to move with the body. The bias cut follows natural curves without constraining them. Adjustable straps, a subtle V-neckline, and a back slit that opens below the knee. Fully lined.",
    shortDescription: "Pure mulberry silk slip dress with adjustable straps.",
    category: "dresses",
    price: 285,
    compareAtPrice: null,
    tag: "Bestseller",
    status: "Active",
    isFeatured: true,
    isNewArrival: false,
    isBestseller: true,
    isSustainable: true,
    materials: ["100% Mulberry Silk", "Silk Charmeuse Lining"],
    careInstructions: "Dry clean only. Store hanging. Keep away from direct sunlight.",
    sustainability: "Certified OEKO-TEX 100. Sourced from a single family-run silk farm in Como, Italy.",
    collections: ["ss25", "bestselling"],
    variants: [
      { id: "v1", color: "Sand", colorLabel: "Sand", colorHex: "#e8d5c0", size: "XS", sku: "SSD-SND-XS", stock: 8, price: undefined },
      { id: "v2", color: "Sand", colorLabel: "Sand", colorHex: "#e8d5c0", size: "S",  sku: "SSD-SND-S",  stock: 12, price: undefined },
      { id: "v3", color: "Sand", colorLabel: "Sand", colorHex: "#e8d5c0", size: "M",  sku: "SSD-SND-M",  stock: 10, price: undefined },
      { id: "v4", color: "Sand", colorLabel: "Sand", colorHex: "#e8d5c0", size: "L",  sku: "SSD-SND-L",  stock: 5,  price: undefined },
      { id: "v5", color: "Charcoal", colorLabel: "Charcoal", colorHex: "#2d2d2d", size: "XS", sku: "SSD-CHR-XS", stock: 4, price: undefined },
      { id: "v6", color: "Charcoal", colorLabel: "Charcoal", colorHex: "#2d2d2d", size: "S",  sku: "SSD-CHR-S",  stock: 7, price: undefined },
      { id: "v7", color: "Sage", colorLabel: "Sage", colorHex: "#b8c4bb", size: "S",  sku: "SSD-SGE-S",  stock: 0, price: undefined },
      { id: "v8", color: "Sage", colorLabel: "Sage", colorHex: "#b8c4bb", size: "M",  sku: "SSD-SGE-M",  stock: 3, price: undefined },
    ],
    images: [
      { url: "/images/silk-slip-dress-sand-1.jpg", alt: "Silk Slip Dress in Sand, front view", position: 0, color: "#e8d5c0" },
      { url: "/images/silk-slip-dress-sand-2.jpg", alt: "Silk Slip Dress in Sand, back view",  position: 1, color: "#dcc8b0" },
      { url: "/images/silk-slip-dress-charcoal-1.jpg", alt: "Silk Slip Dress in Charcoal",     position: 2, color: "#2d2d2d" },
    ],
    reviewCount: 142,
    averageRating: 4.8,
    totalStock: 49,
    metaTitle: "Silk Slip Dress | Maison Elara",
    metaDescription: "A fluid slip dress in pure mulberry silk. Available in Sand, Charcoal, and Sage.",
    weight: 280,
    updatedAt: "2 hours ago",
  },
  "2": {
    id: 2,
    name: "Linen Wide Trousers",
    slug: "linen-wide-trousers",
    description: "Relaxed wide-leg trousers in certified organic Irish linen. A high waist, side zip closure, and deep side pockets. The fabric softens further with each wash.",
    shortDescription: "Organic Irish linen wide-leg trousers with deep pockets.",
    category: "trousers",
    price: 195,
    compareAtPrice: 240,
    tag: "Sale",
    status: "Active",
    isFeatured: false,
    isNewArrival: false,
    isBestseller: false,
    isSustainable: true,
    materials: ["100% Certified Organic Irish Linen"],
    careInstructions: "Machine wash cold, gentle cycle. Line dry. Iron while damp.",
    sustainability: "GOTS-certified organic linen. Woven by Ó Murchadha Linen, Donegal.",
    collections: ["linen-edit", "sale"],
    variants: [
      { id: "v9",  color: "Sage",  colorLabel: "Sage",  colorHex: "#c8d5c0", size: "S",  sku: "LWT-SGE-S",  stock: 6, price: undefined },
      { id: "v10", color: "Sage",  colorLabel: "Sage",  colorHex: "#c8d5c0", size: "M",  sku: "LWT-SGE-M",  stock: 8, price: undefined },
      { id: "v11", color: "Sage",  colorLabel: "Sage",  colorHex: "#c8d5c0", size: "L",  sku: "LWT-SGE-L",  stock: 4, price: undefined },
      { id: "v12", color: "Charcoal", colorLabel: "Charcoal", colorHex: "#2d2d2d", size: "S", sku: "LWT-CHR-S", stock: 0, price: undefined },
    ],
    images: [
      { url: "/images/linen-trousers-1.jpg", alt: "Linen Wide Trousers in Sage", position: 0, color: "#c8d5c0" },
    ],
    reviewCount: 87,
    averageRating: 4.6,
    totalStock: 18,
    metaTitle: "Linen Wide Trousers | Maison Elara",
    metaDescription: "Relaxed wide-leg trousers in certified organic Irish linen.",
    weight: 320,
    updatedAt: "1 day ago",
  },
};

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const CATEGORIES: { value: Category; label: string }[] = [
  { value: "dresses",    label: "Dresses"     },
  { value: "tops",       label: "Tops"        },
  { value: "trousers",   label: "Trousers"    },
  { value: "outerwear",  label: "Outerwear"   },
  { value: "knitwear",   label: "Knitwear"    },
  { value: "accessories",label: "Accessories" },
];
const COLLECTIONS = ["ss25", "linen-edit", "sale", "lookbook", "bestselling", "new-arrivals"];

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="adm-section-header">
      <div>
        <h3 className="adm-section-title">{title}</h3>
        {sub && <p className="adm-section-sub">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Form Field ───────────────────────────────────────────────────────────────
function Field({ label, required, children, hint }: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="adm-field">
      <label className="adm-label">
        {label}
        {required && <span className="adm-required"> *</span>}
      </label>
      {children}
      {hint && <p className="adm-hint">{hint}</p>}
    </div>
  );
}

// ─── Variants Table ───────────────────────────────────────────────────────────
function VariantsTable({
  variants,
  onStockChange,
  onDeleteVariant,
}: {
  variants: Variant[];
  onStockChange: (id: string, stock: number) => void;
  onDeleteVariant: (id: string) => void;
}) {
  // Group by color
  const byColor = variants.reduce<Record<string, Variant[]>>((acc, v) => {
    if (!acc[v.color]) acc[v.color] = [];
    acc[v.color].push(v);
    return acc;
  }, {});

  const totalStock = variants.reduce((s, v) => s + v.stock, 0);
  const outOfStock = variants.filter((v) => v.stock === 0).length;

  return (
    <div className="adm-variants-wrap">
      {/* Summary row */}
      <div className="adm-variants-summary">
        <div className="adm-vs-item">
          <span className="adm-vs-num">{variants.length}</span>
          <span className="adm-vs-label">Variants</span>
        </div>
        <div className="adm-vs-div" />
        <div className="adm-vs-item">
          <span className="adm-vs-num">{totalStock}</span>
          <span className="adm-vs-label">Total Stock</span>
        </div>
        <div className="adm-vs-div" />
        <div className="adm-vs-item">
          <span className="adm-vs-num" style={{ color: outOfStock > 0 ? "#e05c5c" : "#4caf7d" }}>
            {outOfStock}
          </span>
          <span className="adm-vs-label">Out of Stock</span>
        </div>
        <div className="adm-vs-div" />
        <div className="adm-vs-item">
          <span className="adm-vs-num">{Object.keys(byColor).length}</span>
          <span className="adm-vs-label">Colours</span>
        </div>
      </div>

      <div className="adm-variants-table-wrap">
        <table className="adm-variants-table">
          <thead>
            <tr>
              <th>Colour</th>
              <th>Size</th>
              <th>SKU</th>
              <th>Stock</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(byColor).map(([color, colorVariants]) =>
              colorVariants.map((v, i) => (
                <tr key={v.id} className={`adm-v-row ${v.stock === 0 ? "adm-v-oos" : ""}`}>
                  {i === 0 && (
                    <td rowSpan={colorVariants.length} className="adm-v-color-cell">
                      <div className="adm-v-color-wrap">
                        <div className="adm-v-swatch" style={{ background: v.colorHex }} />
                        <span className="adm-v-color-name">{v.colorLabel}</span>
                      </div>
                    </td>
                  )}
                  <td className="adm-v-size">{v.size}</td>
                  <td className="adm-v-sku">{v.sku}</td>
                  <td className="adm-v-stock-cell">
                    <input
                      type="number"
                      className="adm-v-stock-input"
                      value={v.stock}
                      min={0}
                      onChange={(e) => onStockChange(v.id, parseInt(e.target.value) || 0)}
                    />
                  </td>
                  <td>
                    <span
                      className="adm-v-status"
                      style={{
                        color: v.stock === 0 ? "#e05c5c" : v.stock <= 3 ? "#f59e0b" : "#4caf7d",
                        background: v.stock === 0 ? "rgba(224,92,92,0.1)" : v.stock <= 3 ? "rgba(245,158,11,0.1)" : "rgba(76,175,125,0.1)",
                      }}
                    >
                      {v.stock === 0 ? "Out of Stock" : v.stock <= 3 ? "Low Stock" : "In Stock"}
                    </span>
                  </td>
                  <td>
                    <button
                      className="adm-v-del"
                      onClick={() => onDeleteVariant(v.id)}
                      title="Remove variant"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Image Gallery ────────────────────────────────────────────────────────────
function ImageGallery({ images }: { images: Product["images"] }) {
  return (
    <div className="adm-img-gallery">
      {images.map((img, i) => (
        <div key={i} className="adm-img-card">
          <div className="adm-img-preview" style={{ background: img.color }}>
            <span className="adm-img-preview-label">Image {i + 1}</span>
            {i === 0 && <span className="adm-img-primary-badge">Primary</span>}
          </div>
          <div className="adm-img-info">
            <p className="adm-img-alt" title={img.alt}>{img.alt}</p>
          </div>
          <div className="adm-img-actions">
            <button className="adm-img-action-btn" title="Move up" disabled={i === 0}>↑</button>
            <button className="adm-img-action-btn" title="Move down" disabled={i === images.length - 1}>↓</button>
            <button className="adm-img-action-btn adm-img-del-btn" title="Delete">×</button>
          </div>
        </div>
      ))}
      <label className="adm-img-upload">
        <input type="file" accept="image/*" multiple style={{ display: "none" }} />
        <div className="adm-img-upload-inner">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <span>Upload Images</span>
          <span className="adm-img-upload-sub">JPEG, PNG, WebP · Max 5MB</span>
        </div>
      </label>
    </div>
  );
}

// ─── Add Variant Modal ────────────────────────────────────────────────────────
function AddVariantModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (variant: Omit<Variant, "id">) => void;
}) {
  const [form, setForm] = useState({
    color: "", colorLabel: "", colorHex: "#c9a96e",
    size: "S", sku: "", stock: 0,
  });

  const handleAdd = () => {
    if (!form.colorLabel || !form.size || !form.sku) return;
    onAdd({ ...form, color: form.colorLabel });
    onClose();
  };

  return (
    <div className="adm-modal-backdrop" onClick={onClose}>
      <div className="adm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="adm-modal-header">
          <div>
            <p className="adm-modal-eyebrow">Inventory</p>
            <h2 className="adm-modal-title">Add Variant</h2>
          </div>
          <button className="adm-modal-close" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="adm-modal-body">
          <div className="adm-form-row">
            <div className="adm-field">
              <label className="adm-label">Colour Label <span className="adm-required">*</span></label>
              <input className="adm-input" placeholder="e.g. Sage" value={form.colorLabel}
                onChange={(e) => setForm((p) => ({ ...p, colorLabel: e.target.value }))} />
            </div>
            <div className="adm-field">
              <label className="adm-label">Colour Hex</label>
              <div className="adm-color-row">
                <input type="color" className="adm-color-picker" value={form.colorHex}
                  onChange={(e) => setForm((p) => ({ ...p, colorHex: e.target.value }))} />
                <input className="adm-input adm-input-mono" value={form.colorHex}
                  onChange={(e) => setForm((p) => ({ ...p, colorHex: e.target.value }))} />
              </div>
            </div>
          </div>
          <div className="adm-form-row">
            <div className="adm-field">
              <label className="adm-label">Size <span className="adm-required">*</span></label>
              <div className="adm-select-wrap">
                <select className="adm-input adm-select" value={form.size}
                  onChange={(e) => setForm((p) => ({ ...p, size: e.target.value }))}>
                  {SIZES.map((s) => <option key={s}>{s}</option>)}
                </select>
                <svg className="adm-select-chevron" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            </div>
            <div className="adm-field">
              <label className="adm-label">SKU <span className="adm-required">*</span></label>
              <input className="adm-input adm-input-mono" placeholder="e.g. SSD-SGE-S" value={form.sku}
                onChange={(e) => setForm((p) => ({ ...p, sku: e.target.value.toUpperCase() }))} />
            </div>
          </div>
          <div className="adm-field">
            <label className="adm-label">Initial Stock</label>
            <input type="number" className="adm-input" value={form.stock} min={0}
              onChange={(e) => setForm((p) => ({ ...p, stock: parseInt(e.target.value) || 0 }))} />
          </div>
        </div>
        <div className="adm-modal-footer">
          <button className="adm-btn-ghost" onClick={onClose}>Cancel</button>
          <button
            className="adm-btn-primary"
            onClick={handleAdd}
            disabled={!form.colorLabel || !form.sku}
            style={{ opacity: !form.colorLabel || !form.sku ? 0.45 : 1 }}
          >
            Add Variant
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminProductEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const original = MOCK_PRODUCTS[id];

  const [product, setProduct] = useState<Product | null>(original ?? null);
  const [activeTab, setActiveTab] = useState<"details" | "variants" | "media" | "seo">("details");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [showAddVariant, setShowAddVariant] = useState(false);
  const [materialInput, setMaterialInput] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  if (!product) {
    return (
      <div className="adm-page">
        <div className="adm-not-found">
          <div className="adm-nf-ornament">✦</div>
          <h2 className="adm-nf-title">Product Not Found</h2>
          <p className="adm-nf-sub">No product with ID <strong>{id}</strong> exists.</p>
          <Link href="/admin/products" className="adm-btn-primary">← Back to Products</Link>
        </div>
        <style>{pageStyles}</style>
      </div>
    );
  }

  const set = <K extends keyof Product>(key: K, value: Product[K]) =>
    setProduct((p) => p ? ({ ...p, [key]: value }) : p);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 900));
    setSaving(false);
    setSaved(true);
    showToast("Product saved successfully");
    setTimeout(() => setSaved(false), 2500);
  };

  const handleStockChange = (variantId: string, stock: number) => {
    setProduct((p) => p ? ({
      ...p,
      variants: p.variants.map((v) => v.id === variantId ? { ...v, stock } : v),
      totalStock: p.variants.reduce((s, v) => s + (v.id === variantId ? stock : v.stock), 0),
    }) : p);
  };

  const handleDeleteVariant = (variantId: string) => {
    setProduct((p) => p ? ({
      ...p,
      variants: p.variants.filter((v) => v.id !== variantId),
    }) : p);
    showToast("Variant removed");
  };

  const handleAddVariant = (variant: Omit<Variant, "id">) => {
    const newVariant = { ...variant, id: `v${Date.now()}` };
    setProduct((p) => p ? ({ ...p, variants: [...p.variants, newVariant] }) : p);
    showToast("Variant added");
  };

  const handleToggleMaterial = (mat: string) => {
    const exists = product.materials.includes(mat);
    set("materials", exists ? product.materials.filter((m) => m !== mat) : [...product.materials, mat]);
  };

  const handleAddMaterial = () => {
    if (!materialInput.trim()) return;
    if (!product.materials.includes(materialInput.trim())) {
      set("materials", [...product.materials, materialInput.trim()]);
    }
    setMaterialInput("");
  };

  const handleToggleCollection = (col: string) => {
    const exists = product.collections.includes(col);
    set("collections", exists ? product.collections.filter((c) => c !== col) : [...product.collections, col]);
  };

  const stockPct = product.totalStock > 0
    ? Math.min(100, Math.round((product.totalStock / (product.variants.length * 10)) * 100))
    : 0;

  const TABS = [
    { key: "details",  label: "Details"  },
    { key: "variants", label: "Variants" },
    { key: "media",    label: "Media"    },
    { key: "seo",      label: "SEO"      },
  ] as const;

  return (
    <div className="adm-page">

      {/* ── Page Header ── */}
      <div className="adm-page-header">
        <div>
          <div className="adm-breadcrumb">
            <Link href="/admin">Admin</Link>
            <span className="adm-bc-sep">›</span>
            <Link href="/admin/products">Products</Link>
            <span className="adm-bc-sep">›</span>
            <span>{product.name}</span>
          </div>
          <div className="adm-title-row">
            <h1 className="adm-page-title">{product.name}</h1>
            <span
              className="adm-status-badge"
              style={{
                color: product.status === "Active" ? "#4caf7d" : product.status === "Draft" ? "#c9a96e" : "#6b6560",
                background: product.status === "Active" ? "rgba(76,175,125,0.1)" : product.status === "Draft" ? "rgba(201,169,110,0.1)" : "rgba(107,101,96,0.1)",
                borderColor: product.status === "Active" ? "rgba(76,175,125,0.3)" : product.status === "Draft" ? "rgba(201,169,110,0.3)" : "rgba(107,101,96,0.3)",
              }}
            >
              <span className="adm-status-dot" style={{ background: product.status === "Active" ? "#4caf7d" : product.status === "Draft" ? "#c9a96e" : "#6b6560" }} />
              {product.status}
            </span>
          </div>
          <p className="adm-page-sub">/{product.slug} · Last updated {product.updatedAt}</p>
        </div>
        <div className="adm-header-actions">
          <Link
            href={`/products/${product.slug}`}
            target="_blank"
            className="adm-btn-ghost"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            View on Storefront
          </Link>
          <button
            className={`adm-btn-primary ${saved ? "adm-btn-saved" : ""}`}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <span className="adm-spinner" />
            ) : saved ? (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                Saved
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>

      {/* ── Stats Strip ── */}
      <div className="adm-stats-strip">
        <div className="adm-strip-stat">
          <span className="adm-strip-num">{product.totalStock}</span>
          <span className="adm-strip-label">Total Stock</span>
          <div className="adm-strip-bar">
            <div className="adm-strip-fill" style={{
              width: `${stockPct}%`,
              background: product.totalStock === 0 ? "#e05c5c" : product.totalStock < 10 ? "#f59e0b" : "#4caf7d",
            }} />
          </div>
        </div>
        <div className="adm-strip-div" />
        <div className="adm-strip-stat">
          <span className="adm-strip-num">{product.reviewCount}</span>
          <span className="adm-strip-label">Reviews</span>
        </div>
        <div className="adm-strip-div" />
        <div className="adm-strip-stat">
          <span className="adm-strip-num" style={{ color: "#c9a96e" }}>★ {product.averageRating}</span>
          <span className="adm-strip-label">Avg Rating</span>
        </div>
        <div className="adm-strip-div" />
        <div className="adm-strip-stat">
          <span className="adm-strip-num">{product.variants.length}</span>
          <span className="adm-strip-label">Variants</span>
        </div>
        <div className="adm-strip-div" />
        <div className="adm-strip-stat">
          <span className="adm-strip-num">${product.price}</span>
          <span className="adm-strip-label">Price</span>
        </div>
      </div>

      {/* ── Tab Nav ── */}
      <div className="adm-tab-nav">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`adm-tab-btn ${activeTab === tab.key ? "adm-tab-active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab Content ── */}
      <div className="adm-tab-content">

        {/* ─── DETAILS TAB ─── */}
        {activeTab === "details" && (
          <div className="adm-layout">
            {/* Left column */}
            <div className="adm-main-col">

              {/* Basic Info */}
              <div className="adm-card">
                <SectionHeader title="Product Information" />
                <div className="adm-card-body">
                  <Field label="Product Name" required>
                    <input
                      className="adm-input"
                      value={product.name}
                      onChange={(e) => set("name", e.target.value)}
                    />
                  </Field>

                  <Field label="Short Description" hint="Appears under the product name on listing pages.">
                    <input
                      className="adm-input"
                      value={product.shortDescription}
                      onChange={(e) => set("shortDescription", e.target.value)}
                    />
                  </Field>

                  <Field label="Full Description" required>
                    <textarea
                      className="adm-input adm-textarea"
                      rows={6}
                      value={product.description}
                      onChange={(e) => set("description", e.target.value)}
                    />
                  </Field>
                </div>
              </div>

              {/* Pricing */}
              <div className="adm-card">
                <SectionHeader title="Pricing" sub="All prices in USD" />
                <div className="adm-card-body">
                  <div className="adm-form-row">
                    <Field label="Price" required>
                      <div className="adm-input-prefix-wrap">
                        <span className="adm-input-prefix">$</span>
                        <input
                          type="number"
                          className="adm-input adm-input-prefixed"
                          value={product.price}
                          min={0}
                          step={0.01}
                          onChange={(e) => set("price", parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </Field>
                    <Field label="Compare-at Price" hint="Original price shown as strikethrough.">
                      <div className="adm-input-prefix-wrap">
                        <span className="adm-input-prefix">$</span>
                        <input
                          type="number"
                          className="adm-input adm-input-prefixed"
                          value={product.compareAtPrice ?? ""}
                          min={0}
                          step={0.01}
                          placeholder="—"
                          onChange={(e) => set("compareAtPrice", e.target.value ? parseFloat(e.target.value) : null)}
                        />
                      </div>
                    </Field>
                  </div>
                  {product.compareAtPrice && product.compareAtPrice > product.price && (
                    <div className="adm-sale-preview">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                        <circle cx="7" cy="7" r="1" fill="currentColor" />
                      </svg>
                      Discount: {Math.round((1 - product.price / product.compareAtPrice) * 100)}% off
                    </div>
                  )}
                </div>
              </div>

              {/* Product Details */}
              <div className="adm-card">
                <SectionHeader title="Product Details" />
                <div className="adm-card-body">
                  <Field label="Materials">
                    <div className="adm-tags-input">
                      <div className="adm-tags-list">
                        {product.materials.map((mat) => (
                          <span key={mat} className="adm-tag">
                            {mat}
                            <button onClick={() => handleToggleMaterial(mat)} className="adm-tag-remove">×</button>
                          </span>
                        ))}
                      </div>
                      <div className="adm-tags-add-row">
                        <input
                          className="adm-input"
                          placeholder="Add material…"
                          value={materialInput}
                          onChange={(e) => setMaterialInput(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleAddMaterial()}
                        />
                        <button className="adm-tags-add-btn" onClick={handleAddMaterial}>Add</button>
                      </div>
                    </div>
                  </Field>

                  <Field label="Care Instructions">
                    <textarea
                      className="adm-input adm-textarea"
                      rows={3}
                      value={product.careInstructions}
                      onChange={(e) => set("careInstructions", e.target.value)}
                    />
                  </Field>

                  <Field label="Sustainability Note">
                    <textarea
                      className="adm-input adm-textarea"
                      rows={3}
                      value={product.sustainability}
                      onChange={(e) => set("sustainability", e.target.value)}
                    />
                  </Field>

                  <div className="adm-form-row">
                    <Field label="Weight (grams)" hint="Used for shipping cost calculation.">
                      <input
                        type="number"
                        className="adm-input"
                        value={product.weight}
                        min={0}
                        onChange={(e) => set("weight", parseInt(e.target.value) || 0)}
                      />
                    </Field>
                    <Field label="Slug" hint="URL-friendly identifier. Changes affect existing links.">
                      <div className="adm-input-prefix-wrap">
                        <span className="adm-input-prefix">/products/</span>
                        <input
                          className="adm-input adm-input-mono adm-input-prefixed-lg"
                          value={product.slug}
                          onChange={(e) => set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                        />
                      </div>
                    </Field>
                  </div>
                </div>
              </div>

              {/* Collections */}
              <div className="adm-card">
                <SectionHeader title="Collections" sub="Assign this product to one or more storefront collections." />
                <div className="adm-card-body">
                  <div className="adm-collections-grid">
                    {COLLECTIONS.map((col) => (
                      <label key={col} className={`adm-col-chip ${product.collections.includes(col) ? "adm-col-chip-active" : ""}`}>
                        <input
                          type="checkbox"
                          checked={product.collections.includes(col)}
                          onChange={() => handleToggleCollection(col)}
                          style={{ display: "none" }}
                        />
                        {product.collections.includes(col) && (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        )}
                        {col}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="adm-side-col">

              {/* Status & Visibility */}
              <div className="adm-card">
                <SectionHeader title="Status" />
                <div className="adm-card-body">
                  <Field label="Visibility">
                    <div className="adm-select-wrap">
                      <select
                        className="adm-input adm-select"
                        value={product.status}
                        onChange={(e) => set("status", e.target.value as ProductStatus)}
                      >
                        <option value="Active">Active — visible in shop</option>
                        <option value="Draft">Draft — not visible</option>
                        <option value="Archived">Archived — hidden</option>
                      </select>
                      <svg className="adm-select-chevron" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </div>
                  </Field>
                  <div className="adm-toggle-list">
                    {[
                      { key: "isFeatured" as const, label: "Featured on Homepage" },
                      { key: "isNewArrival" as const, label: "New Arrival" },
                      { key: "isBestseller" as const, label: "Bestseller" },
                      { key: "isSustainable" as const, label: "Sustainable Piece" },
                    ].map((toggle) => (
                      <label key={toggle.key} className="adm-toggle-row">
                        <input
                          type="checkbox"
                          className="adm-toggle-input"
                          checked={product[toggle.key] as boolean}
                          onChange={(e) => set(toggle.key, e.target.checked)}
                        />
                        <span className="adm-toggle-track" />
                        <span className="adm-toggle-text">{toggle.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Category & Tag */}
              <div className="adm-card">
                <SectionHeader title="Organisation" />
                <div className="adm-card-body">
                  <Field label="Category" required>
                    <div className="adm-select-wrap">
                      <select
                        className="adm-input adm-select"
                        value={product.category}
                        onChange={(e) => set("category", e.target.value as Category)}
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c.value} value={c.value}>{c.label}</option>
                        ))}
                      </select>
                      <svg className="adm-select-chevron" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </div>
                  </Field>
                  <Field label="Product Tag" hint="Shown as a badge on product listings.">
                    <div className="adm-tag-options">
                      {[null, "New", "Bestseller", "Sale"].map((tag) => (
                        <button
                          key={String(tag)}
                          className={`adm-tag-option ${product.tag === tag ? "adm-tag-option-active" : ""}`}
                          onClick={() => set("tag", tag as Product["tag"])}
                          style={product.tag === tag && tag !== null ? {
                            color: tag === "Sale" ? "#e05c5c" : tag === "Bestseller" ? "#c9a96e" : "#4caf7d",
                            borderColor: tag === "Sale" ? "rgba(224,92,92,0.4)" : tag === "Bestseller" ? "rgba(201,169,110,0.4)" : "rgba(76,175,125,0.4)",
                            background: tag === "Sale" ? "rgba(224,92,92,0.08)" : tag === "Bestseller" ? "rgba(201,169,110,0.08)" : "rgba(76,175,125,0.08)",
                          } : {}}
                        >
                          {tag ?? "None"}
                        </button>
                      ))}
                    </div>
                  </Field>
                </div>
              </div>

              {/* Danger zone */}
              <div className="adm-card adm-card-danger">
                <SectionHeader title="Danger Zone" />
                <div className="adm-card-body">
                  <p className="adm-danger-desc">
                    Archiving hides the product from all storefront pages. Deleting permanently removes it and cannot be undone.
                  </p>
                  <div className="adm-danger-actions">
                    <button className="adm-danger-btn" onClick={() => set("status", "Archived")}>
                      Archive Product
                    </button>
                    <button className="adm-danger-btn adm-danger-btn-del">
                      Delete Product
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── VARIANTS TAB ─── */}
        {activeTab === "variants" && (
          <div className="adm-variants-page">
            <div className="adm-variants-header">
              <div>
                <h2 className="adm-section-title">Variants & Inventory</h2>
                <p className="adm-section-sub">Manage stock levels across all colour and size combinations.</p>
              </div>
              <button className="adm-btn-primary" onClick={() => setShowAddVariant(true)}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add Variant
              </button>
            </div>
            <VariantsTable
              variants={product.variants}
              onStockChange={handleStockChange}
              onDeleteVariant={handleDeleteVariant}
            />
          </div>
        )}

        {/* ─── MEDIA TAB ─── */}
        {activeTab === "media" && (
          <div className="adm-media-page">
            <div className="adm-variants-header">
              <div>
                <h2 className="adm-section-title">Product Media</h2>
                <p className="adm-section-sub">Manage product images. The first image is the primary listing image.</p>
              </div>
            </div>
            <ImageGallery images={product.images} />
            <div className="adm-media-tip">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              Recommended: 1200×1600px (3:4 portrait), JPEG or WebP, max 5MB per file. Use consistent backgrounds across all images.
            </div>
          </div>
        )}

        {/* ─── SEO TAB ─── */}
        {activeTab === "seo" && (
          <div className="adm-seo-page">
            <div className="adm-card">
              <SectionHeader title="Search Engine Optimisation" sub="Control how this product appears in search results." />
              <div className="adm-card-body">
                <Field label="Meta Title" hint={`${product.metaTitle.length}/60 characters. Appears as the browser tab and search result title.`}>
                  <input
                    className="adm-input"
                    value={product.metaTitle}
                    maxLength={70}
                    onChange={(e) => set("metaTitle", e.target.value)}
                  />
                  <div className="adm-char-bar">
                    <div
                      className="adm-char-fill"
                      style={{
                        width: `${Math.min(100, (product.metaTitle.length / 60) * 100)}%`,
                        background: product.metaTitle.length > 60 ? "#e05c5c" : "#4caf7d",
                      }}
                    />
                  </div>
                </Field>
                <Field label="Meta Description" hint={`${product.metaDescription.length}/160 characters. Appears below the title in search results.`}>
                  <textarea
                    className="adm-input adm-textarea"
                    rows={3}
                    value={product.metaDescription}
                    maxLength={180}
                    onChange={(e) => set("metaDescription", e.target.value)}
                  />
                  <div className="adm-char-bar">
                    <div
                      className="adm-char-fill"
                      style={{
                        width: `${Math.min(100, (product.metaDescription.length / 160) * 100)}%`,
                        background: product.metaDescription.length > 160 ? "#e05c5c" : "#4caf7d",
                      }}
                    />
                  </div>
                </Field>

                {/* SERP Preview */}
                <div className="adm-serp-preview">
                  <p className="adm-serp-label">Search Result Preview</p>
                  <div className="adm-serp-card">
                    <p className="adm-serp-url">maisonelara.com › products › {product.slug}</p>
                    <p className="adm-serp-title">{product.metaTitle || product.name}</p>
                    <p className="adm-serp-desc">{product.metaDescription || product.shortDescription}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Add Variant Modal ── */}
      {showAddVariant && (
        <AddVariantModal
          onClose={() => setShowAddVariant(false)}
          onAdd={handleAddVariant}
        />
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className="adm-toast">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M20 6L9 17l-5-5" />
          </svg>
          {toast}
        </div>
      )}

      <style>{pageStyles}</style>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const pageStyles = `
  .adm-page {
    --adm-bg:           #111111;
    --adm-surface:      #1a1a1a;
    --adm-surface-2:    #222222;
    --adm-border:       #2a2a2a;
    --adm-border-light: #333333;
    --adm-text:         #f0ece4;
    --adm-text-sec:     #8a8478;
    --adm-muted:        #5a5650;
    --adm-gold:         #c9a96e;
    --adm-gold-dim:     rgba(201,169,110,0.12);
    background: var(--adm-bg);
    color: var(--adm-text);
    font-family: "DM Sans", system-ui, sans-serif;
    min-height: 100vh;
    padding: 28px 36px 80px;
  }

  /* ── Header ── */
  .adm-page-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }
  .adm-breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    letter-spacing: 0.06em;
    color: var(--adm-muted);
    margin-bottom: 8px;
  }
  .adm-breadcrumb a { color: rgba(240,236,228,0.45); transition: color 0.2s; text-decoration: none; }
  .adm-breadcrumb a:hover { color: var(--adm-text); }
  .adm-bc-sep { color: var(--adm-border-light); }
  .adm-title-row { display: flex; align-items: center; gap: 12px; margin-bottom: 4px; }
  .adm-page-title {
    font-family: "Playfair Display", Georgia, serif;
    font-size: 26px;
    font-weight: 400;
    color: var(--adm-text);
    line-height: 1.1;
  }
  .adm-status-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    border: 1px solid;
    padding: 4px 10px;
  }
  .adm-status-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
  .adm-page-sub { font-size: 12px; color: var(--adm-muted); letter-spacing: 0.04em; }
  .adm-header-actions { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }

  /* ── Buttons ── */
  .adm-btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 10px 20px;
    background: var(--adm-gold);
    color: #111;
    font-size: 12px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    border: 1px solid var(--adm-gold);
    cursor: pointer;
    font-family: "DM Sans", sans-serif;
    font-weight: 500;
    transition: all 0.2s;
    text-decoration: none;
    white-space: nowrap;
    min-height: 38px;
    justify-content: center;
  }
  .adm-btn-primary:hover { background: #d4b87a; border-color: #d4b87a; }
  .adm-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
  .adm-btn-saved { background: #4a9a6a !important; border-color: #4a9a6a !important; color: white !important; }
  .adm-btn-ghost {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 10px 18px;
    background: transparent;
    color: var(--adm-text-sec);
    font-size: 12px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    border: 1px solid var(--adm-border-light);
    cursor: pointer;
    font-family: "DM Sans", sans-serif;
    transition: all 0.2s;
    text-decoration: none;
    white-space: nowrap;
  }
  .adm-btn-ghost:hover { border-color: var(--adm-text-sec); color: var(--adm-text); }

  /* Spinner */
  .adm-spinner {
    width: 14px; height: 14px;
    border: 2px solid rgba(17,17,17,0.3);
    border-top-color: #111;
    border-radius: 50%;
    animation: adm-spin 0.6s linear infinite;
  }
  @keyframes adm-spin { to { transform: rotate(360deg); } }

  /* ── Stats Strip ── */
  .adm-stats-strip {
    display: flex;
    align-items: center;
    gap: 0;
    border: 1px solid var(--adm-border);
    background: var(--adm-surface);
    margin-bottom: 20px;
    padding: 16px 24px;
    gap: 20px;
    flex-wrap: wrap;
  }
  .adm-strip-stat { display: flex; flex-direction: column; gap: 4px; }
  .adm-strip-num { font-family: "Playfair Display", serif; font-size: 22px; font-weight: 400; color: var(--adm-text); line-height: 1; }
  .adm-strip-label { font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--adm-muted); }
  .adm-strip-bar { width: 80px; height: 2px; background: var(--adm-border-light); margin-top: 4px; }
  .adm-strip-fill { height: 100%; transition: width 0.5s ease; }
  .adm-strip-div { width: 1px; height: 36px; background: var(--adm-border); flex-shrink: 0; }

  /* ── Tabs ── */
  .adm-tab-nav {
    display: flex;
    border-bottom: 1px solid var(--adm-border);
    margin-bottom: 24px;
    gap: 0;
  }
  .adm-tab-btn {
    padding: 12px 20px;
    font-size: 12px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--adm-muted);
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    font-family: "DM Sans", sans-serif;
    transition: all 0.18s;
    margin-bottom: -1px;
  }
  .adm-tab-btn:hover { color: var(--adm-text); }
  .adm-tab-active { color: var(--adm-gold) !important; border-bottom-color: var(--adm-gold) !important; }

  /* ── Layout ── */
  .adm-layout {
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: 20px;
    align-items: start;
  }
  .adm-main-col { display: flex; flex-direction: column; gap: 20px; }
  .adm-side-col { display: flex; flex-direction: column; gap: 20px; }

  /* ── Card ── */
  .adm-card {
    background: var(--adm-surface);
    border: 1px solid var(--adm-border);
  }
  .adm-card-danger { border-color: rgba(224,92,92,0.2); }
  .adm-section-header {
    padding: 18px 20px;
    border-bottom: 1px solid var(--adm-border);
    background: var(--adm-surface-2);
  }
  .adm-section-title {
    font-family: "Playfair Display", Georgia, serif;
    font-size: 16px;
    font-weight: 400;
    color: var(--adm-text);
    margin-bottom: 2px;
  }
  .adm-section-sub { font-size: 12px; color: var(--adm-muted); }
  .adm-card-body { padding: 20px; display: flex; flex-direction: column; gap: 16px; }

  /* ── Form Elements ── */
  .adm-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .adm-field { display: flex; flex-direction: column; gap: 6px; }
  .adm-label {
    font-size: 11px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--adm-text-sec);
  }
  .adm-required { color: var(--adm-gold); }
  .adm-hint { font-size: 11px; color: var(--adm-muted); margin-top: 2px; }
  .adm-input {
    padding: 9px 12px;
    background: var(--adm-surface-2);
    border: 1px solid var(--adm-border-light);
    color: var(--adm-text);
    font-size: 13px;
    font-family: "DM Sans", sans-serif;
    outline: none;
    transition: border-color 0.2s;
    width: 100%;
  }
  .adm-input:focus { border-color: var(--adm-gold); }
  .adm-input::placeholder { color: var(--adm-muted); }
  .adm-input-mono { font-family: "DM Mono", "Courier New", monospace; font-size: 12px; }
  .adm-textarea { resize: vertical; min-height: 80px; }
  .adm-input-prefix-wrap { position: relative; display: flex; align-items: center; }
  .adm-input-prefix {
    position: absolute;
    left: 10px;
    font-size: 12px;
    color: var(--adm-muted);
    pointer-events: none;
    font-family: "DM Mono", monospace;
    white-space: nowrap;
  }
  .adm-input-prefixed { padding-left: 26px; }
  .adm-input-prefixed-lg { padding-left: 90px; }

  .adm-select-wrap { position: relative; }
  .adm-select { appearance: none; cursor: pointer; padding-right: 28px; }
  .adm-select-chevron {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: var(--adm-muted);
  }
  .adm-color-row { display: flex; align-items: center; gap: 8px; }
  .adm-color-picker {
    width: 36px; height: 36px;
    border: 1px solid var(--adm-border-light);
    background: var(--adm-surface-2);
    padding: 2px;
    cursor: pointer;
    flex-shrink: 0;
  }

  /* Sale preview */
  .adm-sale-preview {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 12px;
    color: #e05c5c;
    padding: 8px 12px;
    background: rgba(224,92,92,0.08);
    border: 1px solid rgba(224,92,92,0.2);
    margin-top: -4px;
  }

  /* Tags input */
  .adm-tags-input { display: flex; flex-direction: column; gap: 10px; }
  .adm-tags-list { display: flex; flex-wrap: wrap; gap: 6px; }
  .adm-tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: var(--adm-text-sec);
    background: var(--adm-surface-2);
    border: 1px solid var(--adm-border-light);
    padding: 4px 10px;
  }
  .adm-tag-remove {
    font-size: 14px;
    color: var(--adm-muted);
    background: none;
    border: none;
    cursor: pointer;
    transition: color 0.15s;
    padding: 0;
    line-height: 1;
  }
  .adm-tag-remove:hover { color: #e05c5c; }
  .adm-tags-add-row { display: flex; gap: 8px; }
  .adm-tags-add-btn {
    padding: 9px 16px;
    background: var(--adm-surface-2);
    border: 1px solid var(--adm-border-light);
    color: var(--adm-text-sec);
    font-size: 12px;
    cursor: pointer;
    font-family: "DM Sans", sans-serif;
    transition: all 0.15s;
    white-space: nowrap;
  }
  .adm-tags-add-btn:hover { border-color: var(--adm-gold); color: var(--adm-gold); }

  /* Collections */
  .adm-collections-grid { display: flex; flex-wrap: wrap; gap: 6px; }
  .adm-col-chip {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 6px 14px;
    font-size: 12px;
    letter-spacing: 0.06em;
    color: var(--adm-muted);
    background: var(--adm-surface-2);
    border: 1px solid var(--adm-border-light);
    cursor: pointer;
    font-family: "DM Mono", monospace;
    transition: all 0.15s;
    user-select: none;
  }
  .adm-col-chip:hover { border-color: var(--adm-text-sec); color: var(--adm-text); }
  .adm-col-chip-active { border-color: var(--adm-gold) !important; color: var(--adm-gold) !important; background: var(--adm-gold-dim) !important; }

  /* Toggles */
  .adm-toggle-list { display: flex; flex-direction: column; gap: 12px; }
  .adm-toggle-row {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
  }
  .adm-toggle-input { display: none; }
  .adm-toggle-track {
    width: 36px; height: 18px;
    background: var(--adm-border-light);
    border-radius: 9px;
    position: relative;
    transition: background 0.2s;
    flex-shrink: 0;
  }
  .adm-toggle-track::after {
    content: "";
    position: absolute;
    width: 12px; height: 12px;
    background: white;
    border-radius: 50%;
    top: 3px; left: 3px;
    transition: transform 0.2s;
  }
  .adm-toggle-input:checked + .adm-toggle-track { background: var(--adm-gold); }
  .adm-toggle-input:checked + .adm-toggle-track::after { transform: translateX(18px); }
  .adm-toggle-text { font-size: 13px; color: var(--adm-text-sec); }

  /* Tag options */
  .adm-tag-options { display: flex; gap: 6px; flex-wrap: wrap; }
  .adm-tag-option {
    padding: 6px 14px;
    font-size: 12px;
    letter-spacing: 0.08em;
    color: var(--adm-muted);
    background: var(--adm-surface-2);
    border: 1px solid var(--adm-border-light);
    cursor: pointer;
    font-family: "DM Sans", sans-serif;
    transition: all 0.15s;
  }
  .adm-tag-option:hover { border-color: var(--adm-text-sec); color: var(--adm-text); }
  .adm-tag-option-active { font-weight: 500; }

  /* Danger */
  .adm-danger-desc { font-size: 12px; color: var(--adm-muted); line-height: 1.6; margin-bottom: 14px; }
  .adm-danger-actions { display: flex; flex-direction: column; gap: 8px; }
  .adm-danger-btn {
    padding: 10px 16px;
    background: transparent;
    color: var(--adm-text-sec);
    font-size: 12px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    border: 1px solid var(--adm-border-light);
    cursor: pointer;
    font-family: "DM Sans", sans-serif;
    transition: all 0.18s;
    text-align: center;
  }
  .adm-danger-btn:hover { border-color: #e05c5c; color: #e05c5c; }
  .adm-danger-btn-del:hover { background: #e05c5c; color: white; }

  /* ── Variants ── */
  .adm-variants-page { display: flex; flex-direction: column; gap: 20px; }
  .adm-variants-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
  }
  .adm-variants-wrap {
    border: 1px solid var(--adm-border);
    background: var(--adm-surface);
    overflow: hidden;
  }
  .adm-variants-summary {
    display: flex;
    align-items: center;
    gap: 0;
    padding: 16px 20px;
    background: var(--adm-surface-2);
    border-bottom: 1px solid var(--adm-border);
    gap: 24px;
    flex-wrap: wrap;
  }
  .adm-vs-item { display: flex; flex-direction: column; gap: 3px; }
  .adm-vs-num { font-family: "Playfair Display", serif; font-size: 22px; font-weight: 400; color: var(--adm-text); }
  .adm-vs-label { font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--adm-muted); }
  .adm-vs-div { width: 1px; height: 36px; background: var(--adm-border); flex-shrink: 0; }
  .adm-variants-table-wrap { overflow-x: auto; }
  .adm-variants-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }
  .adm-variants-table thead tr { border-bottom: 1px solid var(--adm-border); }
  .adm-variants-table th {
    padding: 11px 16px;
    font-size: 10px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--adm-muted);
    font-weight: 400;
    text-align: left;
    background: rgba(255,255,255,0.02);
  }
  .adm-v-row {
    border-bottom: 1px solid var(--adm-border);
    transition: background 0.15s;
  }
  .adm-v-row:last-child { border-bottom: none; }
  .adm-v-row:hover { background: rgba(255,255,255,0.02); }
  .adm-v-oos { opacity: 0.6; }
  .adm-v-row td { padding: 12px 16px; vertical-align: middle; }
  .adm-v-color-cell { border-right: 1px solid var(--adm-border); }
  .adm-v-color-wrap { display: flex; align-items: center; gap: 10px; }
  .adm-v-swatch { width: 18px; height: 22px; border-radius: 2px; flex-shrink: 0; border: 1px solid rgba(255,255,255,0.1); }
  .adm-v-color-name { font-size: 13px; color: var(--adm-text); }
  .adm-v-size { font-size: 13px; color: var(--adm-text-sec); }
  .adm-v-sku { font-family: "DM Mono", monospace; font-size: 11px; color: var(--adm-muted); }
  .adm-v-stock-cell {}
  .adm-v-stock-input {
    width: 72px;
    padding: 6px 10px;
    background: var(--adm-surface-2);
    border: 1px solid var(--adm-border-light);
    color: var(--adm-text);
    font-size: 13px;
    font-family: "DM Mono", monospace;
    outline: none;
    transition: border-color 0.2s;
    text-align: center;
  }
  .adm-v-stock-input:focus { border-color: var(--adm-gold); }
  .adm-v-status {
    font-size: 10px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 3px 8px;
    white-space: nowrap;
  }
  .adm-v-del {
    width: 26px; height: 26px;
    display: flex; align-items: center; justify-content: center;
    background: transparent;
    border: 1px solid transparent;
    color: var(--adm-muted);
    cursor: pointer;
    transition: all 0.15s;
  }
  .adm-v-del:hover { border-color: #e05c5c; color: #e05c5c; }

  /* ── Media ── */
  .adm-media-page { display: flex; flex-direction: column; gap: 20px; }
  .adm-img-gallery {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 2px;
    background: var(--adm-border);
    border: 1px solid var(--adm-border);
  }
  .adm-img-card { background: var(--adm-surface); display: flex; flex-direction: column; }
  .adm-img-preview {
    height: 200px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .adm-img-preview-label {
    font-size: 10px;
    letter-spacing: 0.1em;
    color: rgba(0,0,0,0.25);
    text-transform: uppercase;
  }
  .adm-img-primary-badge {
    position: absolute;
    top: 8px;
    left: 8px;
    font-size: 9px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    background: var(--adm-gold);
    color: #111;
    padding: 2px 7px;
  }
  .adm-img-info { padding: 10px 12px; flex: 1; }
  .adm-img-alt {
    font-size: 11px;
    color: var(--adm-muted);
    line-height: 1.4;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .adm-img-actions {
    display: flex;
    border-top: 1px solid var(--adm-border);
  }
  .adm-img-action-btn {
    flex: 1;
    padding: 8px;
    background: transparent;
    border: none;
    border-right: 1px solid var(--adm-border);
    color: var(--adm-muted);
    cursor: pointer;
    font-size: 14px;
    transition: all 0.15s;
  }
  .adm-img-action-btn:last-child { border-right: none; }
  .adm-img-action-btn:hover:not(:disabled) { background: var(--adm-surface-2); color: var(--adm-text); }
  .adm-img-action-btn:disabled { opacity: 0.2; cursor: not-allowed; }
  .adm-img-del-btn:hover { color: #e05c5c !important; }
  .adm-img-upload {
    background: var(--adm-surface);
    cursor: pointer;
    display: flex;
    min-height: 200px;
  }
  .adm-img-upload-inner {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border: 2px dashed var(--adm-border-light);
    margin: 8px;
    transition: all 0.2s;
    color: var(--adm-muted);
    font-size: 13px;
  }
  .adm-img-upload:hover .adm-img-upload-inner {
    border-color: var(--adm-gold);
    color: var(--adm-gold);
  }
  .adm-img-upload-sub { font-size: 11px; color: var(--adm-muted); }
  .adm-media-tip {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    font-size: 12px;
    color: var(--adm-muted);
    padding: 12px 14px;
    background: var(--adm-surface);
    border: 1px solid var(--adm-border);
  }
  .adm-media-tip svg { flex-shrink: 0; margin-top: 1px; color: var(--adm-gold); }

  /* ── SEO ── */
  .adm-seo-page { display: flex; flex-direction: column; gap: 20px; }
  .adm-char-bar {
    height: 2px;
    background: var(--adm-border-light);
    margin-top: 6px;
  }
  .adm-char-fill { height: 100%; transition: width 0.3s ease; }
  .adm-serp-preview { margin-top: 8px; }
  .adm-serp-label {
    font-size: 10px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--adm-muted);
    margin-bottom: 12px;
  }
  .adm-serp-card {
    padding: 16px 20px;
    background: var(--adm-surface-2);
    border: 1px solid var(--adm-border-light);
  }
  .adm-serp-url { font-size: 12px; color: #4caf7d; margin-bottom: 4px; font-family: "DM Mono", monospace; }
  .adm-serp-title { font-size: 15px; color: #7cb9e8; margin-bottom: 4px; font-weight: 400; }
  .adm-serp-desc { font-size: 12px; color: var(--adm-text-sec); line-height: 1.5; }

  /* ── Modal ── */
  .adm-modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.72);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 200;
    backdrop-filter: blur(4px);
    padding: 20px;
    animation: adm-fade-in 0.2s ease both;
  }
  @keyframes adm-fade-in { from { opacity: 0; } to { opacity: 1; } }
  .adm-modal {
    background: var(--adm-surface);
    border: 1px solid var(--adm-border-light);
    width: 100%;
    max-width: 520px;
    max-height: 90vh;
    overflow-y: auto;
    animation: adm-slide-up 0.25s ease both;
  }
  @keyframes adm-slide-up {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .adm-modal-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 22px 24px 18px;
    border-bottom: 1px solid var(--adm-border);
    background: var(--adm-surface-2);
  }
  .adm-modal-eyebrow {
    font-size: 10px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--adm-gold);
    margin-bottom: 5px;
  }
  .adm-modal-title {
    font-family: "Playfair Display", Georgia, serif;
    font-size: 20px;
    font-weight: 400;
    color: var(--adm-text);
  }
  .adm-modal-close {
    width: 28px; height: 28px;
    display: flex; align-items: center; justify-content: center;
    background: transparent;
    border: 1px solid var(--adm-border-light);
    color: var(--adm-muted);
    cursor: pointer;
    transition: all 0.15s;
  }
  .adm-modal-close:hover { border-color: var(--adm-text-sec); color: var(--adm-text); }
  .adm-modal-body { padding: 20px 24px; display: flex; flex-direction: column; gap: 14px; }
  .adm-modal-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
    padding: 18px 24px;
    border-top: 1px solid var(--adm-border);
    background: var(--adm-surface-2);
  }

  /* ── Toast ── */
  .adm-toast {
    position: fixed;
    bottom: 28px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--adm-surface-2);
    border: 1px solid var(--adm-border-light);
    color: var(--adm-text);
    padding: 12px 20px;
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 9px;
    z-index: 300;
    white-space: nowrap;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    animation: adm-toast-in 0.25s ease;
  }
  .adm-toast svg { color: #4caf7d; flex-shrink: 0; }
  @keyframes adm-toast-in {
    from { opacity: 0; transform: translateX(-50%) translateY(10px); }
    to   { opacity: 1; transform: translateX(-50%) translateY(0); }
  }

  /* ── Not Found ── */
  .adm-not-found {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    gap: 14px;
    text-align: center;
  }
  .adm-nf-ornament { font-size: 24px; color: var(--adm-gold); opacity: 0.5; }
  .adm-nf-title {
    font-family: "Playfair Display", Georgia, serif;
    font-size: 28px;
    font-weight: 400;
    color: var(--adm-text);
  }
  .adm-nf-sub { font-size: 14px; color: var(--adm-muted); margin-bottom: 8px; }
  .adm-nf-sub strong { color: var(--adm-text-sec); }

  /* ── Responsive ── */
  @media (max-width: 1100px) {
    .adm-layout { grid-template-columns: 1fr; }
    .adm-side-col { display: grid; grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 768px) {
    .adm-page { padding: 20px 16px 60px; }
    .adm-form-row { grid-template-columns: 1fr; }
    .adm-side-col { grid-template-columns: 1fr; }
    .adm-page-header { flex-direction: column; }
    .adm-header-actions { flex-direction: row; flex-wrap: wrap; }
    .adm-stats-strip { gap: 12px; }
  }
`;