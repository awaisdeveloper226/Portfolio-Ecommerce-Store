"use client";

import { useState, useRef } from "react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────
type Category = "dresses" | "tops" | "trousers" | "outerwear" | "knitwear" | "accessories";
type Tag = "New" | "Bestseller" | "Sale" | "";
type Size = "XS" | "S" | "M" | "L" | "XL" | "XXL";

interface Variant {
  id: string;
  color: string;
  colorLabel: string;
  colorHex: string;
  size: Size;
  sku: string;
  stock: number;
  price: string;
}

interface ImageItem {
  id: string;
  name: string;
  url: string;
  position: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const CATEGORIES: { value: Category; label: string }[] = [
  { value: "dresses",     label: "Dresses"     },
  { value: "tops",        label: "Tops"        },
  { value: "trousers",    label: "Trousers"    },
  { value: "outerwear",   label: "Outerwear"   },
  { value: "knitwear",    label: "Knitwear"    },
  { value: "accessories", label: "Accessories" },
];

const SIZES: Size[] = ["XS", "S", "M", "L", "XL", "XXL"];

const COLLECTIONS = [
  { value: "ss25",         label: "Spring / Summer 2025" },
  { value: "linen-edit",   label: "The Linen Edit"       },
  { value: "new-arrivals", label: "New Arrivals"         },
  { value: "bestselling",  label: "Customer Favourites"  },
  { value: "lookbook",     label: "Shop the Look"        },
  { value: "sale",         label: "The Sale"             },
];

const MATERIALS = [
  "100% Organic Linen", "100% Silk", "100% Cashmere", "100% Merino Wool",
  "100% Organic Cotton", "Satin Weave", "Alpaca Blend", "Deadstock Fabric",
];

const PRESET_COLORS = [
  { label: "Sand",      hex: "#e8d5c0" },
  { label: "Sage",      hex: "#c8d5c0" },
  { label: "Lavender",  hex: "#d0c8d5" },
  { label: "Stone",     hex: "#d5d0c0" },
  { label: "Slate",     hex: "#c8d5e0" },
  { label: "Charcoal",  hex: "#2d2d2d" },
  { label: "Ivory",     hex: "#f5f0e8" },
  { label: "Blush",     hex: "#ddc5c5" },
  { label: "Dusk",      hex: "#ddc5b5" },
  { label: "Gold",      hex: "#c9a96e" },
];

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ num, title, sub }: { num: string; title: string; sub?: string }) {
  return (
    <div className="sec-header">
      <div className="sec-num">{num}</div>
      <div>
        <h2 className="sec-title">{title}</h2>
        {sub && <p className="sec-sub">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Field wrapper ────────────────────────────────────────────────────────────
function Field({ label, required, children, hint }: {
  label: string; required?: boolean; children: React.ReactNode; hint?: string;
}) {
  return (
    <div className="field">
      <label className="field-label">
        {label}
        {required && <span className="field-req">*</span>}
      </label>
      {children}
      {hint && <p className="field-hint">{hint}</p>}
    </div>
  );
}

// ─── Toggle ───────────────────────────────────────────────────────────────────
function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="toggle-row">
      <span className="toggle-label-text">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        className={`toggle-track ${checked ? "toggle-on" : ""}`}
        onClick={() => onChange(!checked)}
      />
    </label>
  );
}

// ─── Image Upload Area ────────────────────────────────────────────────────────
function ImageUploadArea({
  images,
  onAdd,
  onRemove,
  onReorder,
}: {
  images: ImageItem[];
  onAdd: (items: ImageItem[]) => void;
  onRemove: (id: string) => void;
  onReorder: (id: string, dir: "up" | "down") => void;
}) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/"));
    addFiles(files);
  };

  const addFiles = (files: File[]) => {
    const newItems: ImageItem[] = files.map((f, i) => ({
      id: `img-${Date.now()}-${i}`,
      name: f.name,
      url: URL.createObjectURL(f),
      position: images.length + i,
    }));
    onAdd(newItems);
  };

  return (
    <div className="img-upload-section">
      {/* Drop zone */}
      <div
        className={`img-drop-zone ${dragging ? "img-drop-active" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/avif"
          style={{ display: "none" }}
          onChange={(e) => addFiles(Array.from(e.target.files ?? []))}
        />
        <div className="img-drop-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </div>
        <p className="img-drop-title">Drop images here or <span>browse files</span></p>
        <p className="img-drop-sub">JPEG, PNG, WebP, AVIF · Max 5 MB per file · First image = cover</p>
      </div>

      {/* Uploaded images */}
      {images.length > 0 && (
        <div className="img-grid">
          {images.map((img, i) => (
            <div key={img.id} className={`img-item ${i === 0 ? "img-item-primary" : ""}`}>
              <div
                className="img-thumb"
                style={{
                  backgroundImage: img.url.startsWith("blob:") ? `url(${img.url})` : undefined,
                  background: img.url.startsWith("blob:") ? undefined : "#2a2a2a",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {i === 0 && <span className="img-primary-badge">Cover</span>}
              </div>
              <div className="img-item-info">
                <span className="img-filename">{img.name}</span>
                <div className="img-item-actions">
                  <button
                    type="button"
                    className="img-action-btn"
                    onClick={() => onReorder(img.id, "up")}
                    disabled={i === 0}
                    title="Move up"
                  >↑</button>
                  <button
                    type="button"
                    className="img-action-btn"
                    onClick={() => onReorder(img.id, "down")}
                    disabled={i === images.length - 1}
                    title="Move down"
                  >↓</button>
                  <button
                    type="button"
                    className="img-action-btn img-remove-btn"
                    onClick={() => onRemove(img.id)}
                    title="Remove"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Variant Row ──────────────────────────────────────────────────────────────
function VariantRow({
  variant,
  onChange,
  onRemove,
  isOnly,
}: {
  variant: Variant;
  onChange: (v: Variant) => void;
  onRemove: () => void;
  isOnly: boolean;
}) {
  const set = (k: keyof Variant, val: string | number) =>
    onChange({ ...variant, [k]: val });

  return (
    <div className="variant-row">
      {/* Color preset */}
      <div className="variant-colors-row">
        {PRESET_COLORS.map((c) => (
          <button
            key={c.hex}
            type="button"
            className={`variant-preset-dot ${variant.colorHex === c.hex ? "variant-preset-active" : ""}`}
            style={{ background: c.hex }}
            title={c.label}
            onClick={() => onChange({ ...variant, colorHex: c.hex, colorLabel: c.label, color: c.label.toLowerCase() })}
          />
        ))}
        <input
          type="color"
          className="variant-color-picker"
          value={variant.colorHex || "#c9a96e"}
          onChange={(e) => set("colorHex", e.target.value)}
          title="Custom colour"
        />
      </div>

      <div className="variant-fields">
        <div className="variant-field-sm">
          <label className="variant-field-label">Colour Label</label>
          <input
            className="variant-input"
            placeholder="e.g. Sand"
            value={variant.colorLabel}
            onChange={(e) => set("colorLabel", e.target.value)}
          />
        </div>

        <div className="variant-field-sm">
          <label className="variant-field-label">Size</label>
          <div className="variant-select-wrap">
            <select
              className="variant-select"
              value={variant.size}
              onChange={(e) => set("size", e.target.value)}
            >
              {SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <svg className="variant-chevron" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
        </div>

        <div className="variant-field-md">
          <label className="variant-field-label">SKU</label>
          <input
            className="variant-input variant-input-mono"
            placeholder="e.g. SSD-SND-S"
            value={variant.sku}
            onChange={(e) => set("sku", e.target.value)}
          />
        </div>

        <div className="variant-field-sm">
          <label className="variant-field-label">Stock</label>
          <input
            type="number"
            className="variant-input"
            min={0}
            placeholder="0"
            value={variant.stock}
            onChange={(e) => set("stock", parseInt(e.target.value) || 0)}
          />
        </div>

        <div className="variant-field-sm">
          <label className="variant-field-label">Price Override</label>
          <input
            className="variant-input"
            placeholder="— (use base)"
            value={variant.price}
            onChange={(e) => set("price", e.target.value)}
          />
        </div>

        <button
          type="button"
          className={`variant-remove ${isOnly ? "variant-remove-disabled" : ""}`}
          disabled={isOnly}
          onClick={onRemove}
          title="Remove variant"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
        </button>
      </div>

      {/* Colour preview */}
      {variant.colorHex && (
        <div className="variant-preview">
          <div className="variant-swatch" style={{ background: variant.colorHex }} />
          <span className="variant-swatch-label">{variant.colorLabel || "Unnamed"}</span>
        </div>
      )}
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ msg, type }: { msg: string; type: "success" | "error" }) {
  return (
    <div className={`np-toast ${type === "error" ? "np-toast-error" : ""}`}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        {type === "error"
          ? <><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></>
          : <path d="M20 6L9 17l-5-5" />
        }
      </svg>
      {msg}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function NewProductPage() {
  // Core fields
  const [name, setName]               = useState("");
  const [slug, setSlug]               = useState("");
  const [slugManual, setSlugManual]   = useState(false);
  const [description, setDescription] = useState("");
  const [shortDesc, setShortDesc]     = useState("");
  const [category, setCategory]       = useState<Category>("dresses");
  const [tag, setTag]                 = useState<Tag>("");
  const [price, setPrice]             = useState("");
  const [compareAt, setCompareAt]     = useState("");
  const [cost, setCost]               = useState("");

  // Collections & metadata
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials]     = useState<string[]>([]);
  const [customMaterial, setCustomMaterial]           = useState("");
  const [careInstructions, setCareInstructions]       = useState("");
  const [sustainability, setSustainability]           = useState("");
  const [metaTitle, setMetaTitle]                     = useState("");
  const [metaDesc, setMetaDesc]                       = useState("");

  // Toggles
  const [isActive,     setIsActive]     = useState(true);
  const [isFeatured,   setIsFeatured]   = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(true);
  const [isBestseller, setIsBestseller] = useState(false);
  const [isSustainable,setIsSustainable]= useState(true);

  // Images
  const [images, setImages] = useState<ImageItem[]>([]);

  // Variants
  const [variants, setVariants] = useState<Variant[]>([
    { id: "v1", color: "", colorLabel: "", colorHex: "", size: "S", sku: "", stock: 0, price: "" },
  ]);

  // UI state
  const [saving,  setSaving]  = useState(false);
  const [toast,   setToast]   = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [preview, setPreview] = useState(false);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Auto-generate slug from name
  const handleNameChange = (val: string) => {
    setName(val);
    if (!slugManual) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""));
    }
  };

  // Variant helpers
  const addVariant = () => {
    setVariants(p => [...p, {
      id: `v${Date.now()}`,
      color: "", colorLabel: "", colorHex: "",
      size: "M", sku: "", stock: 0, price: "",
    }]);
  };

  const updateVariant = (id: string, v: Variant) =>
    setVariants(p => p.map(x => x.id === id ? v : x));

  const removeVariant = (id: string) =>
    setVariants(p => p.filter(x => x.id !== id));

  // Bulk generate SKUs
  const generateSKUs = () => {
    if (!slug) { showToast("Set a product name first to generate SKUs.", "error"); return; }
    const base = slug.replace(/-/g, "").slice(0, 3).toUpperCase();
    setVariants(p => p.map((v, i) => ({
      ...v,
      sku: v.sku || `${base}-${v.colorLabel ? v.colorLabel.slice(0, 3).toUpperCase() : "CLR"}-${v.size}`,
    })));
  };

  // Image handlers
  const handleAddImages  = (items: ImageItem[]) => setImages(p => [...p, ...items]);
  const handleRemoveImg  = (id: string) => setImages(p => p.filter(x => x.id !== id));
  const handleReorderImg = (id: string, dir: "up" | "down") => {
    setImages(p => {
      const arr = [...p];
      const i = arr.findIndex(x => x.id === id);
      const j = dir === "up" ? i - 1 : i + 1;
      if (j < 0 || j >= arr.length) return p;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      return arr.map((x, idx) => ({ ...x, position: idx }));
    });
  };

  // Collection toggle
  const toggleCollection = (val: string) =>
    setSelectedCollections(p => p.includes(val) ? p.filter(x => x !== val) : [...p, val]);

  // Material toggle
  const toggleMaterial = (val: string) =>
    setSelectedMaterials(p => p.includes(val) ? p.filter(x => x !== val) : [...p, val]);

  // Validation
  const validate = (): string | null => {
    if (!name.trim()) return "Product name is required.";
    if (!slug.trim()) return "Slug is required.";
    if (!price || isNaN(parseFloat(price))) return "A valid price is required.";
    if (!description.trim()) return "Description is required.";
    for (const v of variants) {
      if (!v.sku.trim()) return `SKU is required for all variants (${v.colorLabel || "unnamed"} · ${v.size}).`;
    }
    return null;
  };

  const handleSave = async (status: "draft" | "active") => {
    const err = validate();
    if (err) { showToast(err, "error"); return; }

    setSaving(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1400));
    setSaving(false);
    showToast(status === "active" ? "Product published successfully." : "Saved as draft.");
  };

  // Character counts
  const metaDescLen = metaDesc.length;
  const metaTitleLen = metaTitle.length;

  return (
    <div className="np-page">

      {/* ── Sticky top bar ── */}
      <div className="np-topbar">
        <div className="np-topbar-left">
          <nav className="np-breadcrumb">
            <Link href="/admin">Dashboard</Link>
            <span className="np-bc-sep">›</span>
            <Link href="/admin/products">Products</Link>
            <span className="np-bc-sep">›</span>
            <span className="np-bc-current">New Product</span>
          </nav>
        </div>
        <div className="np-topbar-right">
          <button
            className="np-btn np-btn-ghost"
            onClick={() => setPreview(!preview)}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            {preview ? "Edit Mode" : "Preview"}
          </button>
          <button
            className="np-btn np-btn-ghost"
            onClick={() => handleSave("draft")}
            disabled={saving}
          >
            Save Draft
          </button>
          <button
            className="np-btn np-btn-primary"
            onClick={() => handleSave("active")}
            disabled={saving}
          >
            {saving ? (
              <span className="np-spinner" />
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                Publish Product
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Two-column layout ── */}
      <div className="np-layout">

        {/* ── Left (main) ── */}
        <div className="np-main">

          {/* 01 — Basic Info */}
          <div className="np-card">
            <SectionHeader num="01" title="Product Details" sub="Name, description, and core attributes" />

            <div className="np-fields">
              <Field label="Product Name" required hint="Will be displayed on storefront and used to generate the URL slug.">
                <input
                  className="np-input"
                  placeholder="e.g. Silk Slip Dress"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                />
              </Field>

              <Field label="URL Slug" required hint="Auto-generated from name. Edit manually to override.">
                <div className="np-slug-row">
                  <span className="np-slug-prefix">/products/</span>
                  <input
                    className="np-input np-input-mono np-input-flex"
                    placeholder="silk-slip-dress"
                    value={slug}
                    onChange={(e) => { setSlug(e.target.value); setSlugManual(true); }}
                  />
                  {slugManual && (
                    <button
                      type="button"
                      className="np-slug-reset"
                      onClick={() => {
                        setSlugManual(false);
                        setSlug(name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""));
                      }}
                    >
                      Reset
                    </button>
                  )}
                </div>
              </Field>

              <Field label="Short Description" hint="Shown in category listings and quick-view. Max 200 characters.">
                <textarea
                  className="np-input np-textarea np-textarea-sm"
                  placeholder="Brief, compelling description for listings and cards…"
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  maxLength={200}
                  rows={2}
                />
                <span className="np-char-count">{shortDesc.length}/200</span>
              </Field>

              <Field label="Full Description" required hint="Detailed editorial copy shown on the product page.">
                <textarea
                  className="np-input np-textarea"
                  placeholder="Rich editorial description — fabric, feel, fit. Write for the Maison Elara woman…"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                />
              </Field>
            </div>
          </div>

          {/* 02 — Media */}
          <div className="np-card">
            <SectionHeader num="02" title="Product Media" sub="Add images in order — the first will be the cover image" />
            <ImageUploadArea
              images={images}
              onAdd={handleAddImages}
              onRemove={handleRemoveImg}
              onReorder={handleReorderImg}
            />
          </div>

          {/* 03 — Variants */}
          <div className="np-card">
            <div className="np-card-header-row">
              <SectionHeader num="03" title="Variants" sub="Colours, sizes, SKUs and stock levels" />
              <div className="np-card-header-actions">
                <button type="button" className="np-btn np-btn-ghost np-btn-sm" onClick={generateSKUs}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <polyline points="23 4 23 10 17 10"/>
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                  </svg>
                  Auto-fill SKUs
                </button>
                <button type="button" className="np-btn np-btn-ghost np-btn-sm" onClick={addVariant}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  Add Variant
                </button>
              </div>
            </div>

            {/* Column headers */}
            <div className="variant-headers">
              <span>Colour</span>
              <span>Colour Label</span>
              <span>Size</span>
              <span>SKU</span>
              <span>Stock</span>
              <span>Price Override</span>
              <span />
            </div>

            <div className="variant-list">
              {variants.map((v) => (
                <VariantRow
                  key={v.id}
                  variant={v}
                  onChange={(updated) => updateVariant(v.id, updated)}
                  onRemove={() => removeVariant(v.id)}
                  isOnly={variants.length === 1}
                />
              ))}
            </div>

            <div className="variant-summary">
              <span className="variant-summary-text">
                {variants.length} variant{variants.length !== 1 ? "s" : ""} ·{" "}
                {variants.reduce((s, v) => s + v.stock, 0)} total units
              </span>
            </div>
          </div>

          {/* 04 — Materials & Care */}
          <div className="np-card">
            <SectionHeader num="04" title="Materials & Care" sub="Fabric composition, care instructions and sustainability" />

            <div className="np-fields">
              <Field label="Materials" hint="Select all that apply, or add a custom material below.">
                <div className="material-chips">
                  {MATERIALS.map((m) => (
                    <button
                      key={m}
                      type="button"
                      className={`material-chip ${selectedMaterials.includes(m) ? "material-chip-active" : ""}`}
                      onClick={() => toggleMaterial(m)}
                    >
                      {m}
                    </button>
                  ))}
                </div>
                <div className="custom-material-row">
                  <input
                    className="np-input"
                    placeholder="Add custom material…"
                    value={customMaterial}
                    onChange={(e) => setCustomMaterial(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && customMaterial.trim()) {
                        toggleMaterial(customMaterial.trim());
                        setCustomMaterial("");
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="np-btn np-btn-ghost np-btn-sm"
                    disabled={!customMaterial.trim()}
                    onClick={() => {
                      if (customMaterial.trim()) {
                        toggleMaterial(customMaterial.trim());
                        setCustomMaterial("");
                      }
                    }}
                  >
                    Add
                  </button>
                </div>
                {selectedMaterials.length > 0 && (
                  <div className="selected-materials">
                    {selectedMaterials.map((m) => (
                      <span key={m} className="selected-material-tag">
                        {m}
                        <button onClick={() => toggleMaterial(m)}>×</button>
                      </span>
                    ))}
                  </div>
                )}
              </Field>

              <Field label="Care Instructions" hint="Washing, drying and storage guidance.">
                <textarea
                  className="np-input np-textarea np-textarea-sm"
                  placeholder="e.g. Cold machine wash, 30°C. Lay flat to dry. Do not tumble dry. Steam only…"
                  value={careInstructions}
                  onChange={(e) => setCareInstructions(e.target.value)}
                  rows={3}
                />
              </Field>

              <Field label="Sustainability Note" hint="Certification, sourcing, or ethical manufacturing detail.">
                <textarea
                  className="np-input np-textarea np-textarea-sm"
                  placeholder="e.g. Woven from GOTS-certified organic Irish linen at a family-run atelier in Porto…"
                  value={sustainability}
                  onChange={(e) => setSustainability(e.target.value)}
                  rows={2}
                />
              </Field>
            </div>
          </div>

          {/* 05 — SEO */}
          <div className="np-card">
            <SectionHeader num="05" title="SEO & Metadata" sub="How this product appears in search engines" />

            <div className="np-fields">
              <Field label="Meta Title" hint={`${metaTitleLen}/70 characters. Defaults to product name if empty.`}>
                <input
                  className={`np-input ${metaTitleLen > 70 ? "np-input-warn" : ""}`}
                  placeholder={name || "Product name"}
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  maxLength={100}
                />
              </Field>

              <Field label="Meta Description" hint={`${metaDescLen}/160 characters. Shown in search results.`}>
                <textarea
                  className={`np-input np-textarea np-textarea-sm ${metaDescLen > 160 ? "np-input-warn" : ""}`}
                  placeholder={shortDesc || "Product description…"}
                  value={metaDesc}
                  onChange={(e) => setMetaDesc(e.target.value)}
                  maxLength={200}
                  rows={3}
                />
              </Field>

              {/* Google preview */}
              {(metaTitle || name) && (
                <div className="np-google-preview">
                  <p className="np-google-label">Search Preview</p>
                  <div className="np-google-card">
                    <p className="np-google-url">maisonelara.com › products › {slug || "product-slug"}</p>
                    <p className="np-google-title">{metaTitle || name} | Maison Elara</p>
                    <p className="np-google-desc">{metaDesc || shortDesc || description || "Product description will appear here…"}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Right sidebar ── */}
        <aside className="np-sidebar">

          {/* Pricing */}
          <div className="np-card">
            <h3 className="np-card-title">Pricing</h3>
            <div className="np-fields">
              <Field label="Price (USD)" required>
                <div className="np-price-wrap">
                  <span className="np-price-symbol">$</span>
                  <input
                    className="np-input np-input-price"
                    type="number"
                    placeholder="0.00"
                    min={0}
                    step={0.01}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </Field>
              <Field label="Compare-at Price" hint="Original price — shown as crossed out when set.">
                <div className="np-price-wrap">
                  <span className="np-price-symbol">$</span>
                  <input
                    className="np-input np-input-price"
                    type="number"
                    placeholder="0.00"
                    min={0}
                    step={0.01}
                    value={compareAt}
                    onChange={(e) => setCompareAt(e.target.value)}
                  />
                </div>
              </Field>
              <Field label="Cost per Unit" hint="Used for margin reporting. Not shown publicly.">
                <div className="np-price-wrap">
                  <span className="np-price-symbol">$</span>
                  <input
                    className="np-input np-input-price"
                    type="number"
                    placeholder="0.00"
                    min={0}
                    step={0.01}
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                  />
                </div>
              </Field>
              {price && cost && parseFloat(cost) > 0 && (
                <div className="np-margin-pill">
                  <span>Margin</span>
                  <span className="np-margin-val">
                    {Math.round(((parseFloat(price) - parseFloat(cost)) / parseFloat(price)) * 100)}%
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Classification */}
          <div className="np-card">
            <h3 className="np-card-title">Classification</h3>
            <div className="np-fields">
              <Field label="Category" required>
                <div className="np-select-wrap">
                  <select
                    className="np-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                  <svg className="np-select-chevron" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
              </Field>

              <Field label="Tag" hint="Displayed as a badge on the product card.">
                <div className="np-tag-pills">
                  {(["", "New", "Bestseller", "Sale"] as Tag[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      className={`np-tag-pill ${tag === t ? "np-tag-active" : ""} ${
                        t === "Sale" ? "np-tag-sale" :
                        t === "Bestseller" ? "np-tag-best" :
                        t === "New" ? "np-tag-new" : ""
                      }`}
                      onClick={() => setTag(t)}
                    >
                      {t === "" ? "None" : t}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Collections" hint="Add to one or more storefront collections.">
                <div className="np-collection-list">
                  {COLLECTIONS.map((c) => (
                    <label key={c.value} className="np-check-item">
                      <input
                        type="checkbox"
                        className="np-checkbox"
                        checked={selectedCollections.includes(c.value)}
                        onChange={() => toggleCollection(c.value)}
                      />
                      <span>{c.label}</span>
                    </label>
                  ))}
                </div>
              </Field>
            </div>
          </div>

          {/* Status & Flags */}
          <div className="np-card">
            <h3 className="np-card-title">Status & Visibility</h3>
            <div className="np-toggles">
              <Toggle checked={isActive}     onChange={setIsActive}     label="Active (live on storefront)" />
              <Toggle checked={isFeatured}   onChange={setIsFeatured}   label="Featured on homepage"        />
              <Toggle checked={isNewArrival} onChange={setIsNewArrival} label="New Arrival"                 />
              <Toggle checked={isBestseller} onChange={setIsBestseller} label="Bestseller"                  />
              <Toggle checked={isSustainable}onChange={setIsSustainable}label="Sustainably made"            />
            </div>
          </div>

          {/* Actions summary */}
          <div className="np-actions-card">
            <div className="np-actions-row">
              <button
                type="button"
                className="np-btn np-btn-ghost np-btn-full"
                onClick={() => handleSave("draft")}
                disabled={saving}
              >
                Save as Draft
              </button>
              <button
                type="button"
                className="np-btn np-btn-primary np-btn-full"
                onClick={() => handleSave("active")}
                disabled={saving}
              >
                {saving ? <span className="np-spinner" /> : "Publish Product"}
              </button>
            </div>
            <p className="np-discard-hint">
              <Link href="/admin/products" className="np-discard-link">
                ← Discard and return to products
              </Link>
            </p>
          </div>
        </aside>
      </div>

      {/* ── Toast ── */}
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      <style>{`
        /* ── Variables ── */
        .np-page {
          --bg:       #0f0f0f;
          --surface:  #171717;
          --surface2: #1e1e1e;
          --border:   #2a2a2a;
          --border2:  #333;
          --text:     rgba(255,255,255,0.88);
          --text2:    rgba(255,255,255,0.45);
          --muted:    rgba(255,255,255,0.28);
          --gold:     #c9a96e;
          --gold-dim: rgba(201,169,110,0.12);
          --red:      #f87171;
          --green:    #4ade80;
          --font:     "DM Sans", system-ui, sans-serif;
          --display:  "Playfair Display", Georgia, serif;
          --mono:     "DM Mono", "Courier New", monospace;

          min-height: 100vh;
          background: var(--bg);
          color: var(--text);
          font-family: var(--font);
          font-size: 14px;
          padding-bottom: 80px;
        }

        /* ── Topbar ── */
        .np-topbar {
          position: sticky;
          top: 0;
          z-index: 80;
          background: var(--surface);
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 28px;
          gap: 20px;
          flex-wrap: wrap;
          backdrop-filter: blur(8px);
        }
        .np-breadcrumb {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: var(--muted);
          letter-spacing: 0.04em;
        }
        .np-breadcrumb a { color: var(--text2); transition: color 0.2s; text-decoration: none; }
        .np-breadcrumb a:hover { color: var(--text); }
        .np-bc-sep { color: var(--border2); }
        .np-bc-current { color: var(--text); font-weight: 500; }
        .np-topbar-right { display: flex; align-items: center; gap: 8px; }

        /* ── Buttons ── */
        .np-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 9px 18px;
          font-size: 12px;
          letter-spacing: 0.06em;
          font-family: var(--font);
          cursor: pointer;
          border: none;
          transition: all 0.18s;
          white-space: nowrap;
        }
        .np-btn:disabled { opacity: 0.45; cursor: not-allowed; }
        .np-btn-primary { background: var(--gold); color: #0f0f0f; font-weight: 500; }
        .np-btn-primary:hover:not(:disabled) { background: #d4b87e; }
        .np-btn-ghost {
          background: rgba(255,255,255,0.06);
          color: var(--text2);
          border: 1px solid var(--border2);
        }
        .np-btn-ghost:hover:not(:disabled) { background: rgba(255,255,255,0.1); color: var(--text); }
        .np-btn-sm { padding: 7px 12px; font-size: 11px; }
        .np-btn-full { width: 100%; }

        .np-spinner {
          width: 15px; height: 15px;
          border: 2px solid rgba(0,0,0,0.2);
          border-top-color: #111;
          border-radius: 50%;
          animation: np-spin 0.6s linear infinite;
        }
        @keyframes np-spin { to { transform: rotate(360deg); } }

        /* ── Layout ── */
        .np-layout {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 20px;
          padding: 24px 28px;
          align-items: start;
        }

        /* ── Cards ── */
        .np-card {
          background: var(--surface);
          border: 1px solid var(--border);
          padding: 24px;
          margin-bottom: 16px;
          animation: np-in 0.4s ease both;
        }
        @keyframes np-in {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .np-card-title {
          font-family: var(--display);
          font-size: 15px;
          font-weight: 400;
          color: var(--text);
          margin-bottom: 18px;
          padding-bottom: 14px;
          border-bottom: 1px solid var(--border);
        }
        .np-card-header-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        .np-card-header-actions {
          display: flex;
          gap: 8px;
          flex-shrink: 0;
        }

        /* Section header */
        .sec-header { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 20px; }
        .sec-num {
          font-family: var(--display);
          font-size: 11px;
          font-weight: 400;
          color: var(--gold);
          letter-spacing: 0.14em;
          background: var(--gold-dim);
          padding: 3px 8px;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .sec-title {
          font-family: var(--display);
          font-size: 17px;
          font-weight: 400;
          color: var(--text);
          margin-bottom: 3px;
        }
        .sec-sub { font-size: 12px; color: var(--text2); }

        /* Fields */
        .np-fields { display: flex; flex-direction: column; gap: 16px; }
        .field { display: flex; flex-direction: column; gap: 6px; position: relative; }
        .field-label {
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text2);
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .field-req { color: var(--gold); }
        .field-hint { font-size: 11px; color: var(--muted); line-height: 1.5; }

        /* Inputs */
        .np-input {
          background: var(--surface2);
          border: 1px solid var(--border2);
          color: var(--text);
          padding: 10px 12px;
          font-size: 13px;
          font-family: var(--font);
          outline: none;
          transition: border-color 0.2s;
          width: 100%;
        }
        .np-input:focus { border-color: var(--gold); }
        .np-input::placeholder { color: var(--muted); }
        .np-input-warn { border-color: var(--red) !important; }
        .np-textarea { resize: vertical; min-height: 80px; line-height: 1.6; }
        .np-textarea-sm { min-height: 60px; }
        .np-input-mono { font-family: var(--mono); font-size: 12px; letter-spacing: 0.04em; }
        .np-input-flex { flex: 1; }
        .np-char-count { font-size: 10px; color: var(--muted); align-self: flex-end; margin-top: -4px; }

        /* Slug row */
        .np-slug-row { display: flex; align-items: stretch; border: 1px solid var(--border2); overflow: hidden; }
        .np-slug-row .np-input { border: none; flex: 1; }
        .np-slug-row .np-input:focus { border-left: 1px solid var(--gold); }
        .np-slug-prefix {
          display: flex;
          align-items: center;
          padding: 10px 12px;
          background: rgba(255,255,255,0.04);
          font-family: var(--mono);
          font-size: 11px;
          color: var(--muted);
          border-right: 1px solid var(--border2);
          white-space: nowrap;
          flex-shrink: 0;
        }
        .np-slug-reset {
          padding: 10px 14px;
          font-size: 11px;
          color: var(--gold);
          background: none;
          border: none;
          border-left: 1px solid var(--border2);
          cursor: pointer;
          font-family: var(--font);
          letter-spacing: 0.06em;
          transition: opacity 0.2s;
          flex-shrink: 0;
        }
        .np-slug-reset:hover { opacity: 0.75; }

        /* Price */
        .np-price-wrap { display: flex; align-items: stretch; border: 1px solid var(--border2); overflow: hidden; }
        .np-price-wrap .np-input-price { border: none; flex: 1; }
        .np-price-symbol {
          display: flex;
          align-items: center;
          padding: 10px 12px;
          background: rgba(255,255,255,0.04);
          font-size: 13px;
          color: var(--text2);
          border-right: 1px solid var(--border2);
          flex-shrink: 0;
        }
        .np-margin-pill {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 12px;
          background: var(--gold-dim);
          border: 1px solid rgba(201,169,110,0.2);
          font-size: 12px;
          color: var(--text2);
        }
        .np-margin-val { color: var(--gold); font-weight: 500; }

        /* Select */
        .np-select-wrap { position: relative; }
        .np-select {
          width: 100%;
          appearance: none;
          background: var(--surface2);
          border: 1px solid var(--border2);
          color: var(--text);
          padding: 10px 32px 10px 12px;
          font-size: 13px;
          font-family: var(--font);
          outline: none;
          cursor: pointer;
          transition: border-color 0.2s;
        }
        .np-select:focus { border-color: var(--gold); }
        .np-select-chevron {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: var(--text2);
        }

        /* Tags */
        .np-tag-pills { display: flex; gap: 6px; flex-wrap: wrap; }
        .np-tag-pill {
          padding: 6px 14px;
          font-size: 11px;
          letter-spacing: 0.08em;
          border: 1px solid var(--border2);
          background: transparent;
          color: var(--text2);
          cursor: pointer;
          font-family: var(--font);
          transition: all 0.15s;
        }
        .np-tag-pill:hover { color: var(--text); border-color: var(--text2); }
        .np-tag-active { background: rgba(255,255,255,0.1) !important; color: var(--text) !important; border-color: rgba(255,255,255,0.25) !important; }
        .np-tag-sale.np-tag-active { background: rgba(239,68,68,0.15) !important; color: #f87171 !important; border-color: rgba(239,68,68,0.3) !important; }
        .np-tag-best.np-tag-active { background: var(--gold-dim) !important; color: var(--gold) !important; border-color: rgba(201,169,110,0.3) !important; }
        .np-tag-new.np-tag-active { background: rgba(255,255,255,0.08) !important; color: var(--text) !important; border-color: rgba(255,255,255,0.2) !important; }

        /* Collections */
        .np-collection-list { display: flex; flex-direction: column; gap: 0; border: 1px solid var(--border); }
        .np-check-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-bottom: 1px solid var(--border);
          cursor: pointer;
          font-size: 13px;
          color: var(--text2);
          transition: background 0.15s;
        }
        .np-check-item:last-child { border-bottom: none; }
        .np-check-item:hover { background: rgba(255,255,255,0.04); color: var(--text); }
        .np-checkbox { accent-color: var(--gold); cursor: pointer; width: 14px; height: 14px; }

        /* Toggles */
        .np-toggles { display: flex; flex-direction: column; gap: 0; }
        .toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 11px 0;
          border-bottom: 1px solid var(--border);
          cursor: pointer;
        }
        .toggle-row:last-child { border-bottom: none; }
        .toggle-label-text { font-size: 13px; color: var(--text2); }
        .toggle-track {
          width: 36px; height: 20px;
          background: var(--border2);
          border-radius: 10px;
          position: relative;
          flex-shrink: 0;
          transition: background 0.2s;
          border: none;
          cursor: pointer;
        }
        .toggle-track::after {
          content: "";
          position: absolute;
          width: 14px; height: 14px;
          background: white;
          border-radius: 50%;
          top: 3px; left: 3px;
          transition: transform 0.2s;
        }
        .toggle-on { background: var(--gold); }
        .toggle-on::after { transform: translateX(16px); }

        /* Image upload */
        .img-drop-zone {
          border: 1px dashed var(--border2);
          background: rgba(255,255,255,0.02);
          padding: 40px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: 16px;
        }
        .img-drop-zone:hover { border-color: var(--gold); background: var(--gold-dim); }
        .img-drop-active { border-color: var(--gold) !important; background: rgba(201,169,110,0.14) !important; }
        .img-drop-icon { color: var(--gold); opacity: 0.7; margin-bottom: 4px; }
        .img-drop-title { font-size: 14px; color: var(--text2); }
        .img-drop-title span { color: var(--gold); text-decoration: underline; text-underline-offset: 2px; }
        .img-drop-sub { font-size: 11px; color: var(--muted); letter-spacing: 0.04em; }

        .img-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 8px; }
        .img-item {
          border: 1px solid var(--border);
          background: var(--surface2);
          overflow: hidden;
        }
        .img-item-primary { border-color: rgba(201,169,110,0.4); }
        .img-thumb {
          height: 120px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .img-primary-badge {
          position: absolute;
          top: 6px; left: 6px;
          background: var(--gold);
          color: #0f0f0f;
          font-size: 9px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 2px 7px;
          font-weight: 500;
        }
        .img-item-info {
          padding: 8px 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 4px;
          border-top: 1px solid var(--border);
        }
        .img-filename {
          font-size: 10px;
          color: var(--text2);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          flex: 1;
          font-family: var(--mono);
        }
        .img-item-actions { display: flex; gap: 2px; flex-shrink: 0; }
        .img-action-btn {
          width: 22px; height: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: 1px solid var(--border);
          color: var(--text2);
          cursor: pointer;
          font-size: 10px;
          transition: all 0.15s;
        }
        .img-action-btn:hover:not(:disabled) { border-color: var(--text2); color: var(--text); }
        .img-action-btn:disabled { opacity: 0.2; cursor: not-allowed; }
        .img-remove-btn:hover { border-color: var(--red) !important; color: var(--red) !important; }

        /* Variants */
        .variant-headers {
          display: grid;
          grid-template-columns: 180px 1fr 80px 1fr 80px 100px 36px;
          gap: 8px;
          padding: 0 0 8px 0;
          border-bottom: 1px solid var(--border);
          margin-bottom: 4px;
        }
        .variant-headers span {
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted);
        }

        .variant-list { display: flex; flex-direction: column; gap: 0; }
        .variant-row {
          border-bottom: 1px solid var(--border);
          padding: 14px 0;
        }
        .variant-row:last-child { border-bottom: none; }

        .variant-colors-row {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 10px;
        }
        .variant-preset-dot {
          width: 20px; height: 20px;
          border-radius: 50%;
          border: 2px solid transparent;
          cursor: pointer;
          flex-shrink: 0;
          box-shadow: 0 0 0 1px rgba(255,255,255,0.1);
          transition: transform 0.15s;
        }
        .variant-preset-dot:hover { transform: scale(1.2); }
        .variant-preset-active { box-shadow: 0 0 0 2px var(--gold) !important; }
        .variant-color-picker {
          width: 24px; height: 24px;
          border: 1px solid var(--border2);
          background: var(--surface2);
          padding: 1px;
          cursor: pointer;
          border-radius: 50%;
        }

        .variant-fields {
          display: grid;
          grid-template-columns: 1fr 80px 1fr 80px 100px 36px;
          gap: 8px;
          align-items: end;
        }
        .variant-field-sm { display: flex; flex-direction: column; gap: 5px; }
        .variant-field-md { display: flex; flex-direction: column; gap: 5px; }
        .variant-field-label { font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); }
        .variant-input {
          background: var(--surface2);
          border: 1px solid var(--border);
          color: var(--text);
          padding: 8px 10px;
          font-size: 12px;
          font-family: var(--font);
          outline: none;
          transition: border-color 0.2s;
          width: 100%;
        }
        .variant-input:focus { border-color: var(--gold); }
        .variant-input::placeholder { color: var(--muted); }
        .variant-input-mono { font-family: var(--mono); }

        .variant-select-wrap { position: relative; }
        .variant-select {
          width: 100%;
          appearance: none;
          background: var(--surface2);
          border: 1px solid var(--border);
          color: var(--text);
          padding: 8px 26px 8px 10px;
          font-size: 12px;
          font-family: var(--font);
          outline: none;
          cursor: pointer;
          transition: border-color 0.2s;
        }
        .variant-select:focus { border-color: var(--gold); }
        .variant-chevron {
          position: absolute;
          right: 8px; top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: var(--muted);
        }

        .variant-remove {
          width: 36px; height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: 1px solid var(--border);
          color: var(--muted);
          cursor: pointer;
          transition: all 0.15s;
          align-self: flex-end;
        }
        .variant-remove:hover:not(:disabled) { border-color: var(--red); color: var(--red); }
        .variant-remove-disabled { opacity: 0.2 !important; cursor: not-allowed !important; }

        .variant-preview {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 8px;
        }
        .variant-swatch {
          width: 14px; height: 14px;
          border-radius: 50%;
          box-shadow: 0 0 0 1px rgba(255,255,255,0.15);
          flex-shrink: 0;
        }
        .variant-swatch-label { font-size: 11px; color: var(--muted); }

        .variant-summary {
          padding-top: 12px;
          border-top: 1px solid var(--border);
          margin-top: 12px;
        }
        .variant-summary-text { font-size: 12px; color: var(--text2); }

        /* Materials */
        .material-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px; }
        .material-chip {
          padding: 6px 12px;
          font-size: 11px;
          letter-spacing: 0.04em;
          border: 1px solid var(--border2);
          background: transparent;
          color: var(--text2);
          cursor: pointer;
          font-family: var(--font);
          transition: all 0.15s;
        }
        .material-chip:hover { color: var(--text); border-color: var(--text2); }
        .material-chip-active { background: var(--gold-dim); color: var(--gold); border-color: rgba(201,169,110,0.3); }

        .custom-material-row { display: flex; gap: 8px; }
        .custom-material-row .np-input { flex: 1; }

        .selected-materials { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
        .selected-material-tag {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          background: var(--gold-dim);
          border: 1px solid rgba(201,169,110,0.2);
          font-size: 11px;
          color: var(--gold);
        }
        .selected-material-tag button {
          background: none;
          border: none;
          color: var(--gold);
          cursor: pointer;
          font-size: 13px;
          line-height: 1;
          opacity: 0.7;
          transition: opacity 0.15s;
        }
        .selected-material-tag button:hover { opacity: 1; }

        /* SEO preview */
        .np-google-preview { margin-top: 4px; }
        .np-google-label {
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 8px;
        }
        .np-google-card {
          background: var(--surface2);
          border: 1px solid var(--border);
          padding: 14px 16px;
        }
        .np-google-url { font-size: 12px; color: #86efac; font-family: var(--mono); margin-bottom: 3px; }
        .np-google-title { font-size: 16px; color: #93c5fd; margin-bottom: 4px; }
        .np-google-desc {
          font-size: 12px;
          color: var(--text2);
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Sidebar actions */
        .np-actions-card {
          background: var(--surface);
          border: 1px solid var(--border);
          padding: 20px;
        }
        .np-actions-row { display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px; }
        .np-discard-hint { text-align: center; }
        .np-discard-link {
          font-size: 11px;
          color: var(--muted);
          text-decoration: none;
          transition: color 0.2s;
          letter-spacing: 0.04em;
        }
        .np-discard-link:hover { color: var(--red); }

        /* Toast */
        .np-toast {
          position: fixed;
          bottom: 28px;
          left: 50%;
          transform: translateX(-50%);
          background: #252525;
          border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.9);
          padding: 12px 20px;
          font-size: 13px;
          display: flex;
          align-items: center;
          gap: 9px;
          z-index: 400;
          white-space: nowrap;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
          animation: np-toast-in 0.25s ease;
        }
        .np-toast svg { color: #4ade80; }
        .np-toast-error svg { color: #f87171; }
        @keyframes np-toast-in {
          from { opacity: 0; transform: translateX(-50%) translateY(10px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }

        /* Responsive */
        @media (max-width: 1100px) {
          .np-layout { grid-template-columns: 1fr 280px; padding: 20px; }
        }
        @media (max-width: 900px) {
          .np-layout { grid-template-columns: 1fr; }
          .np-sidebar { position: static; }
          .variant-headers { display: none; }
          .variant-fields { grid-template-columns: 1fr 1fr; }
          .np-topbar { padding: 12px 16px; }
          .np-layout { padding: 16px; }
        }
        @media (max-width: 600px) {
          .np-topbar-right .np-btn:not(.np-btn-primary):not(:last-child) { display: none; }
          .variant-fields { grid-template-columns: 1fr; }
          .img-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>
    </div>
  );
}