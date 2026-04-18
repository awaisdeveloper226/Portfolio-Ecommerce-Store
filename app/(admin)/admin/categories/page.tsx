"use client";

import { useState } from "react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────
type CategoryStatus = "active" | "inactive";

type Category = {
  id: string;
  slug: string;
  label: string;
  description: string;
  heroGradient: string;
  accent: string;
  productCount: number;
  inStockCount: number;
  order: number;
  status: CategoryStatus;
  isFeatured: boolean;
  editorialNote: string;
  updatedAt: string;
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const INITIAL_CATEGORIES: Category[] = [
  {
    id: "cat-1",
    slug: "dresses",
    label: "Dresses",
    description: "Silhouettes across silk, linen and fine jersey — each designed to move as you do.",
    heroGradient: "linear-gradient(135deg,#e8ddd0 0%,#c9a96e22 100%)",
    accent: "#c9a96e",
    productCount: 86,
    inStockCount: 74,
    order: 1,
    status: "active",
    isFeatured: true,
    editorialNote: "The dress as a complete statement.",
    updatedAt: "2 hours ago",
  },
  {
    id: "cat-2",
    slug: "tops",
    label: "Tops",
    description: "From structured blouses to fluid cami tops — the foundation of every great outfit.",
    heroGradient: "linear-gradient(135deg,#dde8dd 0%,#b8c4bb33 100%)",
    accent: "#b8c4bb",
    productCount: 124,
    inStockCount: 110,
    order: 2,
    status: "active",
    isFeatured: true,
    editorialNote: "The foundation of every great outfit.",
    updatedAt: "1 day ago",
  },
  {
    id: "cat-3",
    slug: "trousers",
    label: "Trousers",
    description: "Wide leg, tapered, fluid and everything between. Cut with intention.",
    heroGradient: "linear-gradient(135deg,#ecddd5 0%,#d4b5a044 100%)",
    accent: "#d4b5a0",
    productCount: 67,
    inStockCount: 58,
    order: 3,
    status: "active",
    isFeatured: false,
    editorialNote: "Cut with intention. Worn with confidence.",
    updatedAt: "3 days ago",
  },
  {
    id: "cat-4",
    slug: "outerwear",
    label: "Outerwear",
    description: "Pieces built for every climate — from featherweight linens to structured wools.",
    heroGradient: "linear-gradient(135deg,#d5e0e4 0%,#9aacb033 100%)",
    accent: "#9aacb0",
    productCount: 42,
    inStockCount: 35,
    order: 4,
    status: "active",
    isFeatured: false,
    editorialNote: "The first thing the world sees.",
    updatedAt: "5 days ago",
  },
  {
    id: "cat-5",
    slug: "knitwear",
    label: "Knitwear",
    description: "Cashmere, merino and organic cotton — warm without weight.",
    heroGradient: "linear-gradient(135deg,#e4dded 0%,#c4b5d444 100%)",
    accent: "#c4b5d4",
    productCount: 58,
    inStockCount: 49,
    order: 5,
    status: "active",
    isFeatured: true,
    editorialNote: "Warmth as an art form.",
    updatedAt: "1 week ago",
  },
  {
    id: "cat-6",
    slug: "accessories",
    label: "Accessories",
    description: "Objects of quiet luxury — scarves, belts, hats and more.",
    heroGradient: "linear-gradient(135deg,#ede8d5 0%,#d4c4a033 100%)",
    accent: "#d4c4a0",
    productCount: 93,
    inStockCount: 86,
    order: 6,
    status: "active",
    isFeatured: false,
    editorialNote: "The detail that defines the whole.",
    updatedAt: "2 weeks ago",
  },
];

// ─── Edit Modal ───────────────────────────────────────────────────────────────
function EditModal({
  category,
  onClose,
  onSave,
}: {
  category: Category;
  onClose: () => void;
  onSave: (cat: Category) => void;
}) {
  const [form, setForm] = useState({ ...category });
  const [saved, setSaved] = useState(false);

  const set = (k: keyof Category) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSave = () => {
    onSave({ ...form, updatedAt: "Just now" });
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 900);
  };

  return (
    <div className="adm-modal-backdrop" onClick={onClose}>
      <div className="adm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="adm-modal-header">
          <div>
            <p className="adm-modal-eyebrow">Edit Category</p>
            <h2 className="adm-modal-title">{category.label}</h2>
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
              <label className="adm-label">Display Label</label>
              <input className="adm-input" value={form.label} onChange={set("label")} />
            </div>
            <div className="adm-field">
              <label className="adm-label">Slug</label>
              <input className="adm-input adm-input-mono" value={form.slug} onChange={set("slug")} />
            </div>
          </div>

          <div className="adm-field">
            <label className="adm-label">Description</label>
            <textarea
              className="adm-input adm-textarea"
              value={form.description}
              onChange={set("description")}
              rows={3}
            />
          </div>

          <div className="adm-field">
            <label className="adm-label">Editorial Note</label>
            <input
              className="adm-input"
              value={form.editorialNote}
              onChange={set("editorialNote")}
              placeholder="Short italic tagline shown on category hero"
            />
          </div>

          <div className="adm-form-row">
            <div className="adm-field">
              <label className="adm-label">Accent Colour</label>
              <div className="adm-color-row">
                <input
                  type="color"
                  className="adm-color-picker"
                  value={form.accent}
                  onChange={set("accent")}
                />
                <input
                  className="adm-input adm-input-mono"
                  value={form.accent}
                  onChange={set("accent")}
                />
              </div>
            </div>
            <div className="adm-field">
              <label className="adm-label">Display Order</label>
              <input
                type="number"
                className="adm-input"
                value={form.order}
                onChange={(e) => setForm((p) => ({ ...p, order: parseInt(e.target.value) || 1 }))}
                min={1}
                max={99}
              />
            </div>
          </div>

          <div className="adm-form-row">
            <div className="adm-field">
              <label className="adm-label">Status</label>
              <div className="adm-select-wrap">
                <select className="adm-input adm-select" value={form.status} onChange={set("status") as any}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <svg className="adm-select-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            </div>
            <div className="adm-field">
              <label className="adm-label">Featured on Homepage</label>
              <label className="adm-toggle-label">
                <input
                  type="checkbox"
                  className="adm-toggle-input"
                  checked={form.isFeatured}
                  onChange={(e) => setForm((p) => ({ ...p, isFeatured: e.target.checked }))}
                />
                <span className="adm-toggle-track" />
                <span className="adm-toggle-text">{form.isFeatured ? "Featured" : "Not featured"}</span>
              </label>
            </div>
          </div>
        </div>

        <div className="adm-modal-footer">
          <button className="adm-btn-ghost" onClick={onClose}>Cancel</button>
          <button
            className={`adm-btn-primary ${saved ? "adm-btn-saved" : ""}`}
            onClick={handleSave}
          >
            {saved ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
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
    </div>
  );
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
function DeleteModal({
  category,
  onClose,
  onConfirm,
}: {
  category: Category;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const [typed, setTyped] = useState("");
  return (
    <div className="adm-modal-backdrop" onClick={onClose}>
      <div className="adm-modal adm-modal-sm" onClick={(e) => e.stopPropagation()}>
        <div className="adm-modal-header">
          <h2 className="adm-modal-title" style={{ color: "#e05c5c" }}>Delete Category</h2>
          <button className="adm-modal-close" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="adm-modal-body">
          <div className="adm-delete-warning">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <div>
              <p className="adm-delete-warning-title">This action cannot be undone.</p>
              <p className="adm-delete-warning-body">
                Deleting <strong>{category.label}</strong> will remove the category and affect {category.productCount} products currently assigned to it.
              </p>
            </div>
          </div>
          <div className="adm-field" style={{ marginTop: 20 }}>
            <label className="adm-label">Type <strong>{category.slug}</strong> to confirm</label>
            <input
              className="adm-input"
              placeholder={category.slug}
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
            />
          </div>
        </div>
        <div className="adm-modal-footer">
          <button className="adm-btn-ghost" onClick={onClose}>Cancel</button>
          <button
            className="adm-btn-danger"
            onClick={onConfirm}
            disabled={typed !== category.slug}
            style={{ opacity: typed !== category.slug ? 0.4 : 1 }}
          >
            Delete Category
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── New Category Modal ───────────────────────────────────────────────────────
function NewCategoryModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (cat: Category) => void;
}) {
  const [form, setForm] = useState({
    label: "",
    slug: "",
    description: "",
    editorialNote: "",
    accent: "#c9a96e",
    order: 7,
    isFeatured: false,
  });
  const [saved, setSaved] = useState(false);

  const set = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const val = e.target.value;
    setForm((p) => ({
      ...p,
      [k]: val,
      ...(k === "label" ? { slug: val.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") } : {}),
    }));
  };

  const canSave = form.label.trim() && form.slug.trim();

  const handleSave = () => {
    if (!canSave) return;
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      slug: form.slug,
      label: form.label,
      description: form.description,
      editorialNote: form.editorialNote,
      accent: form.accent,
      heroGradient: `linear-gradient(135deg,${form.accent}33 0%,${form.accent}11 100%)`,
      productCount: 0,
      inStockCount: 0,
      order: form.order,
      status: "active",
      isFeatured: form.isFeatured,
      updatedAt: "Just now",
    };
    onSave(newCat);
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 900);
  };

  return (
    <div className="adm-modal-backdrop" onClick={onClose}>
      <div className="adm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="adm-modal-header">
          <div>
            <p className="adm-modal-eyebrow">New Category</p>
            <h2 className="adm-modal-title">Create Category</h2>
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
              <label className="adm-label">Display Label <span className="adm-required">*</span></label>
              <input className="adm-input" placeholder="e.g. Swimwear" value={form.label} onChange={set("label")} />
            </div>
            <div className="adm-field">
              <label className="adm-label">Slug <span className="adm-required">*</span></label>
              <input className="adm-input adm-input-mono" placeholder="e.g. swimwear" value={form.slug} onChange={set("slug")} />
            </div>
          </div>

          <div className="adm-field">
            <label className="adm-label">Description</label>
            <textarea
              className="adm-input adm-textarea"
              placeholder="Short description shown on category pages…"
              value={form.description}
              onChange={set("description")}
              rows={3}
            />
          </div>

          <div className="adm-field">
            <label className="adm-label">Editorial Note</label>
            <input
              className="adm-input"
              placeholder="Short italic tagline for the hero section"
              value={form.editorialNote}
              onChange={set("editorialNote")}
            />
          </div>

          <div className="adm-form-row">
            <div className="adm-field">
              <label className="adm-label">Accent Colour</label>
              <div className="adm-color-row">
                <input type="color" className="adm-color-picker" value={form.accent} onChange={set("accent")} />
                <input className="adm-input adm-input-mono" value={form.accent} onChange={set("accent")} />
              </div>
            </div>
            <div className="adm-field">
              <label className="adm-label">Display Order</label>
              <input
                type="number"
                className="adm-input"
                value={form.order}
                onChange={(e) => setForm((p) => ({ ...p, order: parseInt(e.target.value) || 1 }))}
                min={1}
              />
            </div>
          </div>

          <div className="adm-field">
            <label className="adm-toggle-label">
              <input
                type="checkbox"
                className="adm-toggle-input"
                checked={form.isFeatured}
                onChange={(e) => setForm((p) => ({ ...p, isFeatured: e.target.checked }))}
              />
              <span className="adm-toggle-track" />
              <span className="adm-toggle-text">Feature on homepage</span>
            </label>
          </div>
        </div>

        <div className="adm-modal-footer">
          <button className="adm-btn-ghost" onClick={onClose}>Cancel</button>
          <button
            className={`adm-btn-primary ${saved ? "adm-btn-saved" : ""}`}
            onClick={handleSave}
            disabled={!canSave}
            style={{ opacity: canSave ? 1 : 0.45 }}
          >
            {saved ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                Created
              </>
            ) : (
              "Create Category"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Category Row ─────────────────────────────────────────────────────────────
function CategoryRow({
  category,
  onEdit,
  onDelete,
  onToggleStatus,
  onToggleFeatured,
  onReorder,
  isFirst,
  isLast,
}: {
  category: Category;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
  onToggleFeatured: () => void;
  onReorder: (dir: "up" | "down") => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  const stockPct = category.productCount > 0
    ? Math.round((category.inStockCount / category.productCount) * 100)
    : 0;

  return (
    <div className={`adm-cat-row ${category.status === "inactive" ? "adm-cat-row-inactive" : ""}`}>
      {/* Drag / reorder */}
      <div className="adm-cat-order-cell">
        <div className="adm-order-btns">
          <button
            className="adm-order-btn"
            onClick={() => onReorder("up")}
            disabled={isFirst}
            aria-label="Move up"
          >
            ↑
          </button>
          <span className="adm-order-num">{category.order}</span>
          <button
            className="adm-order-btn"
            onClick={() => onReorder("down")}
            disabled={isLast}
            aria-label="Move down"
          >
            ↓
          </button>
        </div>
      </div>

      {/* Swatch + name */}
      <div className="adm-cat-identity">
        <div
          className="adm-cat-swatch"
          style={{ background: category.heroGradient, borderColor: `${category.accent}44` }}
        >
          <div className="adm-cat-swatch-dot" style={{ background: category.accent }} />
        </div>
        <div>
          <div className="adm-cat-name-row">
            <span className="adm-cat-name">{category.label}</span>
            {category.isFeatured && (
              <span className="adm-cat-featured-badge">✦ Featured</span>
            )}
          </div>
          <span className="adm-cat-slug">/{category.slug}</span>
          {category.editorialNote && (
            <p className="adm-cat-note">&ldquo;{category.editorialNote}&rdquo;</p>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="adm-cat-desc-cell">
        <p className="adm-cat-desc">{category.description}</p>
      </div>

      {/* Stock stats */}
      <div className="adm-cat-stats-cell">
        <div className="adm-stat-row">
          <span className="adm-stat-num">{category.productCount}</span>
          <span className="adm-stat-label">products</span>
        </div>
        <div className="adm-stock-bar-wrap">
          <div className="adm-stock-bar">
            <div
              className="adm-stock-fill"
              style={{
                width: `${stockPct}%`,
                background: stockPct > 70 ? "#4a9a6a" : stockPct > 40 ? "#b87333" : "#e05c5c",
              }}
            />
          </div>
          <span className="adm-stock-pct">{stockPct}% in stock</span>
        </div>
      </div>

      {/* Status */}
      <div className="adm-cat-status-cell">
        <button
          className={`adm-status-pill ${category.status === "active" ? "adm-status-active" : "adm-status-inactive"}`}
          onClick={onToggleStatus}
          title="Click to toggle"
        >
          <span className="adm-status-dot" />
          {category.status === "active" ? "Active" : "Inactive"}
        </button>
        <span className="adm-cat-updated">{category.updatedAt}</span>
      </div>

      {/* Actions */}
      <div className="adm-cat-actions-cell">
        <Link
          href={`/category/${category.slug}`}
          target="_blank"
          className="adm-action-icon-btn"
          title="View on storefront"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </Link>
        <button
          className="adm-action-icon-btn"
          onClick={onToggleFeatured}
          title={category.isFeatured ? "Remove from featured" : "Add to featured"}
          style={{ color: category.isFeatured ? "var(--adm-gold)" : undefined }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill={category.isFeatured ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>
        <button
          className="adm-action-icon-btn adm-action-edit"
          onClick={onEdit}
          title="Edit category"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
        <button
          className="adm-action-icon-btn adm-action-delete"
          onClick={onDelete}
          title="Delete category"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = categories
    .filter((c) => {
      if (filterStatus !== "all" && c.status !== filterStatus) return false;
      if (search && !c.label.toLowerCase().includes(search.toLowerCase()) && !c.slug.includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => a.order - b.order);

  const handleSaveEdit = (updated: Category) => {
    setCategories((p) => p.map((c) => (c.id === updated.id ? updated : c)));
    showToast(`"${updated.label}" updated successfully`);
  };

  const handleCreate = (newCat: Category) => {
    setCategories((p) => [...p, newCat]);
    showToast(`"${newCat.label}" created successfully`);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setCategories((p) => p.filter((c) => c.id !== deleteTarget.id));
    showToast(`"${deleteTarget.label}" deleted`, "error");
    setDeleteTarget(null);
  };

  const toggleStatus = (id: string) => {
    setCategories((p) =>
      p.map((c) =>
        c.id === id
          ? { ...c, status: c.status === "active" ? "inactive" : "active", updatedAt: "Just now" }
          : c
      )
    );
  };

  const toggleFeatured = (id: string) => {
    setCategories((p) =>
      p.map((c) =>
        c.id === id ? { ...c, isFeatured: !c.isFeatured, updatedAt: "Just now" } : c
      )
    );
  };

  const reorder = (id: string, dir: "up" | "down") => {
    setCategories((prev) => {
      const sorted = [...prev].sort((a, b) => a.order - b.order);
      const idx = sorted.findIndex((c) => c.id === id);
      const swapIdx = dir === "up" ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= sorted.length) return prev;
      const newArr = [...sorted];
      const tmpOrder = newArr[idx].order;
      newArr[idx] = { ...newArr[idx], order: newArr[swapIdx].order };
      newArr[swapIdx] = { ...newArr[swapIdx], order: tmpOrder };
      return newArr;
    });
  };

  const activeCount = categories.filter((c) => c.status === "active").length;
  const featuredCount = categories.filter((c) => c.isFeatured).length;
  const totalProducts = categories.reduce((s, c) => s + c.productCount, 0);

  return (
    <div className="adm-page">
      {/* ── Page Header ── */}
      <div className="adm-page-header">
        <div>
          <div className="adm-breadcrumb">
            <span>Admin</span>
            <span className="adm-bc-sep">›</span>
            <span>Categories</span>
          </div>
          <h1 className="adm-page-title">Categories</h1>
          <p className="adm-page-sub">Manage store categories, ordering, and homepage featuring.</p>
        </div>
        <button className="adm-btn-primary" onClick={() => setShowNew(true)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Category
        </button>
      </div>

      {/* ── Stats Row ── */}
      <div className="adm-stats-row">
        {[
          { label: "Total Categories", value: categories.length, icon: "◈" },
          { label: "Active", value: activeCount, icon: "○", accent: "#4a9a6a" },
          { label: "Featured on Homepage", value: featuredCount, icon: "✦", accent: "var(--adm-gold)" },
          { label: "Total Products", value: totalProducts.toLocaleString(), icon: "△" },
        ].map((s) => (
          <div key={s.label} className="adm-stat-card">
            <div className="adm-stat-card-icon" style={{ color: s.accent || "var(--adm-muted)" }}>
              {s.icon}
            </div>
            <div className="adm-stat-card-val">{s.value}</div>
            <div className="adm-stat-card-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div className="adm-toolbar">
        <div className="adm-search-wrap">
          <svg className="adm-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            className="adm-search-input"
            placeholder="Search categories…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="adm-search-clear" onClick={() => setSearch("")}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className="adm-filter-tabs">
          {(["all", "active", "inactive"] as const).map((f) => (
            <button
              key={f}
              className={`adm-filter-tab ${filterStatus === f ? "adm-filter-active" : ""}`}
              onClick={() => setFilterStatus(f)}
            >
              {f === "all" ? `All (${categories.length})` : f === "active" ? `Active (${activeCount})` : `Inactive (${categories.length - activeCount})`}
            </button>
          ))}
        </div>

        <div className="adm-toolbar-right">
          <span className="adm-result-count">{filtered.length} showing</span>
          <Link href="/shop" target="_blank" className="adm-btn-outline">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            View Storefront
          </Link>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="adm-table-wrap">
        {/* Column headers */}
        <div className="adm-table-head">
          <div className="adm-col-order">Order</div>
          <div className="adm-col-name">Category</div>
          <div className="adm-col-desc">Description</div>
          <div className="adm-col-stats">Products</div>
          <div className="adm-col-status">Status</div>
          <div className="adm-col-actions">Actions</div>
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div className="adm-empty">
            <div className="adm-empty-icon">✦</div>
            <p className="adm-empty-title">No categories found</p>
            <p className="adm-empty-sub">
              {search ? `No results for "${search}"` : "Create your first category to get started."}
            </p>
            {!search && (
              <button className="adm-btn-primary" onClick={() => setShowNew(true)}>
                Create Category
              </button>
            )}
          </div>
        ) : (
          filtered.map((cat) => (
            <CategoryRow
              key={cat.id}
              category={cat}
              onEdit={() => setEditTarget(cat)}
              onDelete={() => setDeleteTarget(cat)}
              onToggleStatus={() => toggleStatus(cat.id)}
              onToggleFeatured={() => toggleFeatured(cat.id)}
              onReorder={(dir) => reorder(cat.id, dir)}
              isFirst={cat.order === Math.min(...categories.map((c) => c.order))}
              isLast={cat.order === Math.max(...categories.map((c) => c.order))}
            />
          ))
        )}
      </div>

      {/* ── Featured preview strip ── */}
      <div className="adm-featured-section">
        <div className="adm-featured-header">
          <h2 className="adm-section-title">Homepage Featured Order</h2>
          <p className="adm-section-sub">
            {featuredCount} of {categories.length} categories are featured on the homepage.
          </p>
        </div>
        <div className="adm-featured-grid">
          {categories
            .filter((c) => c.isFeatured)
            .sort((a, b) => a.order - b.order)
            .map((cat) => (
              <div key={cat.id} className="adm-featured-card">
                <div
                  className="adm-featured-card-bg"
                  style={{ background: cat.heroGradient, borderColor: `${cat.accent}33` }}
                >
                  <div className="adm-featured-card-dot" style={{ background: cat.accent }} />
                </div>
                <div className="adm-featured-card-info">
                  <span className="adm-featured-card-name">{cat.label}</span>
                  <span className="adm-featured-card-count">{cat.productCount} products</span>
                </div>
                <button
                  className="adm-featured-card-remove"
                  onClick={() => toggleFeatured(cat.id)}
                  title="Remove from featured"
                >
                  ×
                </button>
              </div>
            ))}
          {categories.filter((c) => !c.isFeatured).length > 0 && (
            <div className="adm-featured-add-hint">
              <span>✦</span>
              <span>Click ☆ on any category to feature it</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Modals ── */}
      {editTarget && (
        <EditModal
          category={editTarget}
          onClose={() => setEditTarget(null)}
          onSave={(updated) => { handleSaveEdit(updated); setEditTarget(null); }}
        />
      )}
      {deleteTarget && (
        <DeleteModal
          category={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
      {showNew && (
        <NewCategoryModal
          onClose={() => setShowNew(false)}
          onSave={(cat) => { handleCreate(cat); setShowNew(false); }}
        />
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className={`adm-toast ${toast.type === "error" ? "adm-toast-error" : ""}`}>
          {toast.type === "success" ? (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          ) : (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          )}
          {toast.msg}
        </div>
      )}

      <style>{`
        /* ── Admin CSS Variables (dark theme) ── */
        .adm-page {
          --adm-bg: #111111;
          --adm-surface: #1a1a1a;
          --adm-surface-2: #222222;
          --adm-border: #2a2a2a;
          --adm-border-light: #333333;
          --adm-text: #f0ece4;
          --adm-text-secondary: #8a8478;
          --adm-muted: #5a5650;
          --adm-gold: #c9a96e;
          --adm-gold-dim: rgba(201,169,110,0.15);

          background: var(--adm-bg);
          color: var(--adm-text);
          font-family: "DM Sans", system-ui, sans-serif;
          min-height: 100vh;
          padding: 36px 48px 80px;
        }

        /* ── Page Header ── */
        .adm-page-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 32px;
          gap: 20px;
        }
        .adm-breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--adm-muted);
          margin-bottom: 8px;
        }
        .adm-bc-sep { color: var(--adm-border-light); }
        .adm-page-title {
          font-family: "Playfair Display", Georgia, serif;
          font-size: 32px;
          font-weight: 400;
          color: var(--adm-text);
          margin-bottom: 4px;
          line-height: 1.1;
        }
        .adm-page-sub {
          font-size: 13px;
          color: var(--adm-text-secondary);
        }

        /* ── Buttons ── */
        .adm-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 11px 22px;
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
          white-space: nowrap;
        }
        .adm-btn-primary:hover { background: #d4b87a; border-color: #d4b87a; }
        .adm-btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }
        .adm-btn-saved { background: #4a9a6a !important; border-color: #4a9a6a !important; color: white !important; }

        .adm-btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 11px 22px;
          background: transparent;
          color: var(--adm-text-secondary);
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          border: 1px solid var(--adm-border-light);
          cursor: pointer;
          font-family: "DM Sans", sans-serif;
          transition: all 0.2s;
        }
        .adm-btn-ghost:hover { border-color: var(--adm-text-secondary); color: var(--adm-text); }

        .adm-btn-danger {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 11px 22px;
          background: transparent;
          color: #e05c5c;
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          border: 1px solid #e05c5c;
          cursor: pointer;
          font-family: "DM Sans", sans-serif;
          transition: all 0.2s;
        }
        .adm-btn-danger:hover:not(:disabled) { background: #e05c5c; color: white; }
        .adm-btn-danger:disabled { opacity: 0.4; cursor: not-allowed; }

        .adm-btn-outline {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 18px;
          background: transparent;
          color: var(--adm-text-secondary);
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          border: 1px solid var(--adm-border-light);
          cursor: pointer;
          font-family: "DM Sans", sans-serif;
          transition: all 0.2s;
          text-decoration: none;
        }
        .adm-btn-outline:hover { border-color: var(--adm-gold); color: var(--adm-gold); }

        /* ── Stats Row ── */
        .adm-stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1px;
          background: var(--adm-border);
          border: 1px solid var(--adm-border);
          margin-bottom: 28px;
        }
        .adm-stat-card {
          background: var(--adm-surface);
          padding: 20px 24px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          transition: background 0.2s;
        }
        .adm-stat-card:hover { background: var(--adm-surface-2); }
        .adm-stat-card-icon { font-size: 12px; margin-bottom: 6px; color: var(--adm-muted); }
        .adm-stat-card-val {
          font-family: "Playfair Display", Georgia, serif;
          font-size: 28px;
          font-weight: 400;
          color: var(--adm-text);
          line-height: 1;
        }
        .adm-stat-card-label {
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--adm-muted);
        }

        /* ── Toolbar ── */
        .adm-toolbar {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 2px;
          flex-wrap: wrap;
        }

        .adm-search-wrap {
          position: relative;
          flex: 1;
          min-width: 200px;
          max-width: 340px;
        }
        .adm-search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--adm-muted);
          pointer-events: none;
        }
        .adm-search-input {
          width: 100%;
          padding: 10px 36px 10px 34px;
          background: var(--adm-surface);
          border: 1px solid var(--adm-border-light);
          color: var(--adm-text);
          font-size: 13px;
          font-family: "DM Sans", sans-serif;
          outline: none;
          transition: border-color 0.2s;
        }
        .adm-search-input:focus { border-color: var(--adm-gold); }
        .adm-search-input::placeholder { color: var(--adm-muted); }
        .adm-search-clear {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--adm-muted);
          transition: color 0.2s;
        }
        .adm-search-clear:hover { color: var(--adm-text); }

        .adm-filter-tabs {
          display: flex;
          border: 1px solid var(--adm-border-light);
          overflow: hidden;
        }
        .adm-filter-tab {
          padding: 10px 18px;
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--adm-muted);
          background: var(--adm-surface);
          border-right: 1px solid var(--adm-border-light);
          cursor: pointer;
          font-family: "DM Sans", sans-serif;
          transition: all 0.18s;
        }
        .adm-filter-tab:last-child { border-right: none; }
        .adm-filter-tab:hover { color: var(--adm-text); background: var(--adm-surface-2); }
        .adm-filter-active { background: var(--adm-gold-dim) !important; color: var(--adm-gold) !important; }

        .adm-toolbar-right {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }
        .adm-result-count { font-size: 12px; color: var(--adm-muted); }

        /* ── Table ── */
        .adm-table-wrap {
          border: 1px solid var(--adm-border);
          margin-bottom: 40px;
        }
        .adm-table-head {
          display: grid;
          grid-template-columns: 72px 280px 1fr 160px 140px 148px;
          padding: 12px 20px;
          background: var(--adm-surface-2);
          border-bottom: 1px solid var(--adm-border);
          gap: 16px;
        }
        .adm-table-head > div {
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--adm-muted);
        }

        /* Category Row */
        .adm-cat-row {
          display: grid;
          grid-template-columns: 72px 280px 1fr 160px 140px 148px;
          padding: 20px 20px;
          border-bottom: 1px solid var(--adm-border);
          background: var(--adm-surface);
          gap: 16px;
          align-items: center;
          transition: background 0.15s;
        }
        .adm-cat-row:last-child { border-bottom: none; }
        .adm-cat-row:hover { background: var(--adm-surface-2); }
        .adm-cat-row-inactive { opacity: 0.6; }

        /* Order cell */
        .adm-order-btns {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }
        .adm-order-btn {
          width: 22px;
          height: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: 1px solid var(--adm-border-light);
          color: var(--adm-muted);
          font-size: 11px;
          cursor: pointer;
          transition: all 0.15s;
          line-height: 1;
        }
        .adm-order-btn:hover:not(:disabled) { border-color: var(--adm-gold); color: var(--adm-gold); }
        .adm-order-btn:disabled { opacity: 0.2; cursor: not-allowed; }
        .adm-order-num {
          font-size: 13px;
          color: var(--adm-text-secondary);
          font-feature-settings: "tnum";
        }

        /* Identity cell */
        .adm-cat-identity {
          display: flex;
          align-items: flex-start;
          gap: 14px;
        }
        .adm-cat-swatch {
          width: 44px;
          height: 52px;
          flex-shrink: 0;
          border-radius: 2px;
          border: 1px solid;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .adm-cat-swatch-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        .adm-cat-name-row { display: flex; align-items: center; gap: 8px; margin-bottom: 2px; }
        .adm-cat-name {
          font-family: "Playfair Display", Georgia, serif;
          font-size: 15px;
          font-weight: 400;
          color: var(--adm-text);
        }
        .adm-cat-featured-badge {
          font-size: 10px;
          letter-spacing: 0.1em;
          color: var(--adm-gold);
          background: var(--adm-gold-dim);
          padding: 2px 7px;
          white-space: nowrap;
        }
        .adm-cat-slug {
          font-family: "DM Mono", "Courier New", monospace;
          font-size: 11px;
          color: var(--adm-muted);
          display: block;
          margin-bottom: 4px;
        }
        .adm-cat-note {
          font-size: 11px;
          color: var(--adm-muted);
          font-style: italic;
          line-height: 1.4;
        }

        /* Description cell */
        .adm-cat-desc {
          font-size: 12px;
          color: var(--adm-text-secondary);
          line-height: 1.6;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Stats cell */
        .adm-stat-row {
          display: flex;
          align-items: baseline;
          gap: 5px;
          margin-bottom: 8px;
        }
        .adm-stat-num {
          font-family: "Playfair Display", Georgia, serif;
          font-size: 20px;
          font-weight: 400;
          color: var(--adm-text);
        }
        .adm-stat-label { font-size: 11px; color: var(--adm-muted); }
        .adm-stock-bar-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .adm-stock-bar {
          flex: 1;
          height: 3px;
          background: var(--adm-border-light);
        }
        .adm-stock-fill { height: 100%; transition: width 0.5s ease; }
        .adm-stock-pct { font-size: 10px; color: var(--adm-muted); white-space: nowrap; }

        /* Status cell */
        .adm-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 5px 12px;
          border: 1px solid;
          cursor: pointer;
          font-family: "DM Sans", sans-serif;
          transition: all 0.18s;
          margin-bottom: 6px;
          display: flex;
        }
        .adm-status-active {
          color: #4a9a6a;
          border-color: #4a9a6a33;
          background: #4a9a6a11;
        }
        .adm-status-active:hover { background: #4a9a6a22; }
        .adm-status-inactive {
          color: var(--adm-muted);
          border-color: var(--adm-border-light);
          background: transparent;
        }
        .adm-status-inactive:hover { background: var(--adm-surface-2); }
        .adm-status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: currentColor;
          flex-shrink: 0;
        }
        .adm-cat-updated { font-size: 11px; color: var(--adm-muted); }

        /* Actions cell */
        .adm-cat-actions-cell {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .adm-action-icon-btn {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: 1px solid var(--adm-border);
          color: var(--adm-muted);
          cursor: pointer;
          transition: all 0.18s;
          text-decoration: none;
          flex-shrink: 0;
        }
        .adm-action-icon-btn:hover { border-color: var(--adm-text-secondary); color: var(--adm-text); }
        .adm-action-edit:hover { border-color: var(--adm-gold); color: var(--adm-gold); }
        .adm-action-delete:hover { border-color: #e05c5c; color: #e05c5c; }

        /* ── Empty State ── */
        .adm-empty {
          text-align: center;
          padding: 72px 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          background: var(--adm-surface);
        }
        .adm-empty-icon { font-size: 24px; color: var(--adm-gold); opacity: 0.5; margin-bottom: 6px; }
        .adm-empty-title {
          font-family: "Playfair Display", Georgia, serif;
          font-size: 20px;
          font-weight: 400;
          color: var(--adm-text);
        }
        .adm-empty-sub { font-size: 13px; color: var(--adm-muted); margin-bottom: 8px; }

        /* ── Featured Section ── */
        .adm-featured-section {
          border: 1px solid var(--adm-border);
          background: var(--adm-surface);
          padding: 24px;
          margin-bottom: 40px;
        }
        .adm-featured-header { margin-bottom: 16px; }
        .adm-section-title {
          font-family: "Playfair Display", Georgia, serif;
          font-size: 18px;
          font-weight: 400;
          color: var(--adm-text);
          margin-bottom: 4px;
        }
        .adm-section-sub { font-size: 12px; color: var(--adm-muted); }
        .adm-featured-grid {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          align-items: center;
        }
        .adm-featured-card {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px 8px 8px;
          border: 1px solid var(--adm-border-light);
          background: var(--adm-surface-2);
          position: relative;
        }
        .adm-featured-card-bg {
          width: 32px;
          height: 40px;
          flex-shrink: 0;
          border-radius: 1px;
          border: 1px solid;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .adm-featured-card-dot { width: 6px; height: 6px; border-radius: 50%; }
        .adm-featured-card-info { display: flex; flex-direction: column; gap: 2px; }
        .adm-featured-card-name { font-size: 13px; color: var(--adm-text); }
        .adm-featured-card-count { font-size: 11px; color: var(--adm-muted); }
        .adm-featured-card-remove {
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: 1px solid var(--adm-border);
          color: var(--adm-muted);
          font-size: 14px;
          cursor: pointer;
          transition: all 0.15s;
          line-height: 1;
          flex-shrink: 0;
        }
        .adm-featured-card-remove:hover { border-color: #e05c5c; color: #e05c5c; }
        .adm-featured-add-hint {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: var(--adm-muted);
          padding: 8px 16px;
          border: 1px dashed var(--adm-border-light);
          font-style: italic;
        }
        .adm-featured-add-hint span:first-child { color: var(--adm-gold); font-style: normal; }

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
          max-width: 580px;
          max-height: 90vh;
          overflow-y: auto;
          animation: adm-slide-up 0.25s ease both;
        }
        .adm-modal-sm { max-width: 440px; }
        @keyframes adm-slide-up {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .adm-modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 24px 28px 20px;
          border-bottom: 1px solid var(--adm-border);
          background: var(--adm-surface-2);
        }
        .adm-modal-eyebrow {
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--adm-gold);
          margin-bottom: 6px;
        }
        .adm-modal-title {
          font-family: "Playfair Display", Georgia, serif;
          font-size: 22px;
          font-weight: 400;
          color: var(--adm-text);
        }
        .adm-modal-close {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: 1px solid var(--adm-border-light);
          color: var(--adm-muted);
          cursor: pointer;
          transition: all 0.15s;
          flex-shrink: 0;
        }
        .adm-modal-close:hover { border-color: var(--adm-text-secondary); color: var(--adm-text); }
        .adm-modal-body { padding: 24px 28px; display: flex; flex-direction: column; gap: 16px; }
        .adm-modal-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
          padding: 20px 28px;
          border-top: 1px solid var(--adm-border);
          background: var(--adm-surface-2);
        }

        /* Form elements */
        .adm-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .adm-field { display: flex; flex-direction: column; gap: 7px; }
        .adm-label {
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--adm-text-secondary);
          font-weight: 400;
        }
        .adm-required { color: var(--adm-gold); }
        .adm-input {
          padding: 10px 12px;
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

        .adm-color-row { display: flex; align-items: center; gap: 8px; }
        .adm-color-picker {
          width: 40px;
          height: 40px;
          border: 1px solid var(--adm-border-light);
          background: var(--adm-surface-2);
          padding: 2px;
          cursor: pointer;
          flex-shrink: 0;
        }

        .adm-select-wrap { position: relative; }
        .adm-select {
          appearance: none;
          cursor: pointer;
          padding-right: 32px;
        }
        .adm-select-chevron {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: var(--adm-muted);
        }

        /* Toggle */
        .adm-toggle-label {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }
        .adm-toggle-input { display: none; }
        .adm-toggle-track {
          width: 38px;
          height: 20px;
          background: var(--adm-border-light);
          border-radius: 10px;
          position: relative;
          transition: background 0.2s;
          flex-shrink: 0;
        }
        .adm-toggle-track::after {
          content: "";
          position: absolute;
          width: 14px;
          height: 14px;
          background: white;
          border-radius: 50%;
          top: 3px;
          left: 3px;
          transition: transform 0.2s;
        }
        .adm-toggle-input:checked + .adm-toggle-track { background: var(--adm-gold); }
        .adm-toggle-input:checked + .adm-toggle-track::after { transform: translateX(18px); }
        .adm-toggle-text { font-size: 13px; color: var(--adm-text-secondary); }

        /* Delete warning */
        .adm-delete-warning {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 16px;
          background: rgba(224,92,92,0.08);
          border: 1px solid rgba(224,92,92,0.2);
        }
        .adm-delete-warning svg { color: #e05c5c; flex-shrink: 0; margin-top: 2px; }
        .adm-delete-warning-title {
          font-size: 14px;
          color: #e05c5c;
          font-weight: 500;
          margin-bottom: 4px;
        }
        .adm-delete-warning-body { font-size: 13px; color: var(--adm-text-secondary); line-height: 1.5; }
        .adm-delete-warning-body strong { color: var(--adm-text); }

        /* ── Toast ── */
        .adm-toast {
          position: fixed;
          bottom: 32px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--adm-surface-2);
          border: 1px solid var(--adm-border-light);
          color: var(--adm-text);
          padding: 12px 22px;
          font-size: 13px;
          display: flex;
          align-items: center;
          gap: 9px;
          z-index: 300;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
          animation: adm-toast-in 0.3s ease both;
          white-space: nowrap;
        }
        .adm-toast svg { color: #4a9a6a; flex-shrink: 0; }
        .adm-toast-error svg { color: #e05c5c; }
        @keyframes adm-toast-in {
          from { opacity: 0; transform: translateX(-50%) translateY(10px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }

        /* ── Responsive ── */
        @media (max-width: 1300px) {
          .adm-table-head,
          .adm-cat-row {
            grid-template-columns: 72px 240px 1fr 140px 130px 140px;
          }
        }
        @media (max-width: 1100px) {
          .adm-page { padding: 28px 24px 60px; }
          .adm-table-head { display: none; }
          .adm-cat-row {
            grid-template-columns: 1fr;
            gap: 12px;
          }
          .adm-cat-order-cell { display: none; }
          .adm-cat-desc-cell { display: none; }
          .adm-stats-row { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .adm-form-row { grid-template-columns: 1fr; }
          .adm-toolbar { flex-direction: column; align-items: flex-start; }
          .adm-toolbar-right { margin-left: 0; }
          .adm-search-wrap { max-width: 100%; }
          .adm-page-header { flex-direction: column; }
          .adm-stats-row { grid-template-columns: 1fr 1fr; }
        }
      `}</style>
    </div>
  );
}