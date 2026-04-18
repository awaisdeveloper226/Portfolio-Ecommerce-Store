"use client";

import { useState } from "react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────
type CollectionStatus = "active" | "draft" | "scheduled" | "archived";

type Collection = {
  id: string;
  handle: string;
  title: string;
  subtitle: string;
  eyebrow: string;
  description: string;
  heroStyle: "split" | "full" | "asymmetric" | "dark";
  status: CollectionStatus;
  productCount: number;
  featuredProductIds: string[];
  palette: {
    accent: string;
    heroGrad: string;
  };
  publishedAt: string | null;
  scheduledFor: string | null;
  createdAt: string;
  updatedAt: string;
  pageViews: number;
  revenue: number;
  isFeatured: boolean;
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const COLLECTIONS: Collection[] = [
  {
    id: "col_001",
    handle: "ss25",
    title: "Spring / Summer",
    subtitle: "2025",
    eyebrow: "New Collection",
    description: "The SS25 collection is a study in restraint — sun-bleached linens, whisper-weight silks and considered cuts.",
    heroStyle: "split",
    status: "active",
    productCount: 8,
    featuredProductIds: ["1", "5", "6", "10"],
    palette: { accent: "#c9a96e", heroGrad: "linear-gradient(150deg,#faf7f2 0%,#e8d5b022 100%)" },
    publishedAt: "2025-01-15T09:00:00Z",
    scheduledFor: null,
    createdAt: "2025-01-10T10:00:00Z",
    updatedAt: "2025-03-28T14:22:00Z",
    pageViews: 12480,
    revenue: 84200,
    isFeatured: true,
  },
  {
    id: "col_002",
    handle: "linen-edit",
    title: "The Linen",
    subtitle: "Edit",
    eyebrow: "Fabric Story",
    description: "Certified organic Irish linen — woven on traditional looms, pre-washed for softness.",
    heroStyle: "asymmetric",
    status: "active",
    productCount: 6,
    featuredProductIds: ["6", "2", "9"],
    palette: { accent: "#b8a882", heroGrad: "linear-gradient(135deg,#f0ebe0 0%,#e0d5c0 100%)" },
    publishedAt: "2025-02-01T09:00:00Z",
    scheduledFor: null,
    createdAt: "2025-01-22T11:30:00Z",
    updatedAt: "2025-03-15T09:10:00Z",
    pageViews: 8320,
    revenue: 42100,
    isFeatured: false,
  },
  {
    id: "col_003",
    handle: "sale",
    title: "The",
    subtitle: "Sale",
    eyebrow: "Final Reductions",
    description: "Considered pieces at considered prices. Each item offered once — when it's gone, it's gone.",
    heroStyle: "dark",
    status: "active",
    productCount: 2,
    featuredProductIds: ["2", "18"],
    palette: { accent: "#c0392b", heroGrad: "linear-gradient(160deg,#1a1a1a 0%,#2d2020 100%)" },
    publishedAt: "2025-03-01T09:00:00Z",
    scheduledFor: null,
    createdAt: "2025-02-25T08:00:00Z",
    updatedAt: "2025-04-01T10:05:00Z",
    pageViews: 19640,
    revenue: 18900,
    isFeatured: true,
  },
  {
    id: "col_004",
    handle: "lookbook",
    title: "Shop the",
    subtitle: "Look",
    eyebrow: "Styled for You",
    description: "Complete outfits, curated for four distinct moments in a woman's week.",
    heroStyle: "full",
    status: "active",
    productCount: 8,
    featuredProductIds: ["1", "6", "15", "5"],
    palette: { accent: "#9aacb0", heroGrad: "linear-gradient(160deg,#d5e0e4 0%,#c0d0d8 100%)" },
    publishedAt: "2025-02-14T09:00:00Z",
    scheduledFor: null,
    createdAt: "2025-02-08T13:00:00Z",
    updatedAt: "2025-03-20T16:40:00Z",
    pageViews: 6150,
    revenue: 31400,
    isFeatured: false,
  },
  {
    id: "col_005",
    handle: "bestselling",
    title: "Customer",
    subtitle: "Favourites",
    eyebrow: "Most Loved",
    description: "The pieces our community returns to season after season.",
    heroStyle: "split",
    status: "active",
    productCount: 8,
    featuredProductIds: ["8", "1", "16", "5"],
    palette: { accent: "#c9a96e", heroGrad: "linear-gradient(150deg,#faf7f2 0%,#f0e8d800 100%)" },
    publishedAt: "2024-12-01T09:00:00Z",
    scheduledFor: null,
    createdAt: "2024-11-28T10:00:00Z",
    updatedAt: "2025-04-02T08:30:00Z",
    pageViews: 22300,
    revenue: 96800,
    isFeatured: true,
  },
  {
    id: "col_006",
    handle: "new-arrivals",
    title: "New",
    subtitle: "Arrivals",
    eyebrow: "Just Landed",
    description: "Fresh from our ateliers — new pieces land every Friday.",
    heroStyle: "asymmetric",
    status: "active",
    productCount: 8,
    featuredProductIds: ["3", "4", "10", "12"],
    palette: { accent: "#c9a96e", heroGrad: "linear-gradient(135deg,#f5f0e8 0%,#ecddc833 100%)" },
    publishedAt: "2025-04-01T09:00:00Z",
    scheduledFor: null,
    createdAt: "2025-03-28T11:00:00Z",
    updatedAt: "2025-04-03T07:00:00Z",
    pageViews: 4210,
    revenue: 12400,
    isFeatured: false,
  },
  {
    id: "col_007",
    handle: "resort-25",
    title: "Resort",
    subtitle: "2025",
    eyebrow: "Capsule Collection",
    description: "A sun-drenched capsule of resort-ready pieces — lightweight, luminous, and made to travel.",
    heroStyle: "full",
    status: "draft",
    productCount: 0,
    featuredProductIds: [],
    palette: { accent: "#9aacb0", heroGrad: "linear-gradient(160deg,#e8f0ec 0%,#d0e0d8 100%)" },
    publishedAt: null,
    scheduledFor: "2025-05-15T09:00:00Z",
    createdAt: "2025-03-30T14:00:00Z",
    updatedAt: "2025-04-02T11:20:00Z",
    pageViews: 0,
    revenue: 0,
    isFeatured: false,
  },
  {
    id: "col_008",
    handle: "aw24-archive",
    title: "Autumn / Winter",
    subtitle: "2024 Archive",
    eyebrow: "Archive",
    description: "The complete AW24 collection — available while stocks last.",
    heroStyle: "split",
    status: "archived",
    productCount: 12,
    featuredProductIds: [],
    palette: { accent: "#8a8478", heroGrad: "linear-gradient(150deg,#f0ede8 0%,#e0d8d0 100%)" },
    publishedAt: "2024-09-01T09:00:00Z",
    scheduledFor: null,
    createdAt: "2024-08-20T10:00:00Z",
    updatedAt: "2025-01-10T08:00:00Z",
    pageViews: 31200,
    revenue: 142000,
    isFeatured: false,
  },
];

// ─── Status Config ────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<CollectionStatus, { label: string; color: string; bg: string; dot: string }> = {
  active:    { label: "Active",    color: "#4ade80", bg: "rgba(74,222,128,0.1)",  dot: "#4ade80" },
  draft:     { label: "Draft",     color: "#94a3b8", bg: "rgba(148,163,184,0.1)", dot: "#94a3b8" },
  scheduled: { label: "Scheduled", color: "#f59e0b", bg: "rgba(245,158,11,0.1)",  dot: "#f59e0b" },
  archived:  { label: "Archived",  color: "#64748b", bg: "rgba(100,116,139,0.1)", dot: "#64748b" },
};

const HERO_STYLE_LABELS: Record<string, string> = {
  split: "Split",
  full: "Full-width",
  asymmetric: "Asymmetric",
  dark: "Dark",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}
function formatRevenue(n: number) {
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}k`;
  return `$${n}`;
}
function formatViews(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
function DeleteModal({
  collection,
  onConfirm,
  onCancel,
}: {
  collection: Collection;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="adm-modal-backdrop" onClick={onCancel}>
      <div className="adm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="adm-modal-icon adm-modal-icon-danger">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
            <path d="M10 11v6M14 11v6" />
          </svg>
        </div>
        <h3 className="adm-modal-title">Delete Collection</h3>
        <p className="adm-modal-body">
          Are you sure you want to delete <strong>&quot;{collection.title} {collection.subtitle}&quot;</strong>?
          This action cannot be undone. The collection will be removed from all storefront pages.
        </p>
        <div className="adm-modal-actions">
          <button className="adm-btn adm-btn-ghost" onClick={onCancel}>Cancel</button>
          <button className="adm-btn adm-btn-danger" onClick={onConfirm}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
            </svg>
            Delete Collection
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── New Collection Modal (simplified) ───────────────────────────────────────
function NewCollectionModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    eyebrow: "",
    handle: "",
    heroStyle: "split",
    description: "",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  const autoHandle = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

  return (
    <div className="adm-modal-backdrop" onClick={onClose}>
      <div className="adm-modal adm-modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="adm-modal-header">
          <div>
            <h3 className="adm-modal-title">New Collection</h3>
            <p className="adm-modal-subtitle">Create a new storefront collection</p>
          </div>
          <button className="adm-modal-close" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="adm-modal-form">
          <div className="adm-form-row">
            <div className="adm-form-field">
              <label className="adm-form-label">Title</label>
              <input
                className="adm-form-input"
                placeholder="e.g. Spring / Summer"
                value={form.title}
                onChange={(e) => {
                  set("title")(e);
                  if (!form.handle || form.handle === autoHandle(form.title)) {
                    setForm((p) => ({ ...p, title: e.target.value, handle: autoHandle(e.target.value + " " + p.subtitle) }));
                  }
                }}
              />
            </div>
            <div className="adm-form-field">
              <label className="adm-form-label">Subtitle</label>
              <input
                className="adm-form-input"
                placeholder="e.g. 2025"
                value={form.subtitle}
                onChange={set("subtitle")}
              />
            </div>
          </div>

          <div className="adm-form-row">
            <div className="adm-form-field">
              <label className="adm-form-label">Eyebrow</label>
              <input
                className="adm-form-input"
                placeholder="e.g. New Collection"
                value={form.eyebrow}
                onChange={set("eyebrow")}
              />
            </div>
            <div className="adm-form-field">
              <label className="adm-form-label">URL Handle</label>
              <div className="adm-input-prefix-wrap">
                <span className="adm-input-prefix">/collections/</span>
                <input
                  className="adm-form-input adm-form-input-prefixed"
                  placeholder="my-collection"
                  value={form.handle}
                  onChange={set("handle")}
                />
              </div>
            </div>
          </div>

          <div className="adm-form-field">
            <label className="adm-form-label">Hero Style</label>
            <div className="adm-hero-style-grid">
              {(["split", "asymmetric", "full", "dark"] as const).map((style) => (
                <button
                  key={style}
                  type="button"
                  className={`adm-hero-style-btn ${form.heroStyle === style ? "adm-hero-style-active" : ""}`}
                  onClick={() => setForm((p) => ({ ...p, heroStyle: style }))}
                >
                  <div className={`adm-hero-preview adm-hero-preview-${style}`}>
                    {style === "split" && (
                      <>
                        <div className="adm-preview-col adm-preview-text-col" />
                        <div className="adm-preview-col adm-preview-img-col" />
                      </>
                    )}
                    {style === "asymmetric" && (
                      <>
                        <div className="adm-preview-col adm-preview-img-col adm-preview-wide" />
                        <div className="adm-preview-col adm-preview-text-col adm-preview-narrow" />
                      </>
                    )}
                    {style === "full" && (
                      <div className="adm-preview-full" />
                    )}
                    {style === "dark" && (
                      <div className="adm-preview-dark">
                        <div className="adm-preview-dark-text" />
                        <div className="adm-preview-dark-img" />
                      </div>
                    )}
                  </div>
                  <span>{HERO_STYLE_LABELS[style]}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="adm-form-field">
            <label className="adm-form-label">Description</label>
            <textarea
              className="adm-form-input adm-form-textarea"
              placeholder="Brief editorial description shown in the hero section…"
              value={form.description}
              onChange={set("description")}
              rows={3}
            />
          </div>
        </div>

        <div className="adm-modal-actions adm-modal-actions-border">
          <button className="adm-btn adm-btn-ghost" onClick={onClose}>Cancel</button>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="adm-btn adm-btn-ghost" onClick={onClose}>Save as Draft</button>
            <button className="adm-btn adm-btn-primary" onClick={onClose}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              Create Collection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Collection Row ───────────────────────────────────────────────────────────
function CollectionRow({
  collection,
  onDelete,
  onToggleFeatured,
}: {
  collection: Collection;
  onDelete: (c: Collection) => void;
  onToggleFeatured: (id: string) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const status = STATUS_CONFIG[collection.status];

  return (
    <tr className="adm-tr">
      {/* Title / Handle */}
      <td className="adm-td adm-td-main">
        <div className="adm-col-title-wrap">
          <div
            className="adm-col-palette-swatch"
            style={{ background: collection.palette.accent }}
          />
          <div className="adm-col-title-block">
            <div className="adm-col-name">
              {collection.title}{" "}
              <span className="adm-col-name-sub">{collection.subtitle}</span>
            </div>
            <div className="adm-col-handle">
              <span className="adm-col-eyebrow-badge">{collection.eyebrow}</span>
              <span className="adm-col-handle-text">/collections/{collection.handle}</span>
            </div>
          </div>
          {collection.isFeatured && (
            <span className="adm-featured-badge">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              Featured
            </span>
          )}
        </div>
      </td>

      {/* Status */}
      <td className="adm-td">
        <span
          className="adm-status-pill"
          style={{ color: status.color, background: status.bg }}
        >
          <span className="adm-status-dot" style={{ background: status.dot }} />
          {status.label}
          {collection.scheduledFor && (
            <span className="adm-scheduled-hint">· {formatDate(collection.scheduledFor)}</span>
          )}
        </span>
      </td>

      {/* Hero Style */}
      <td className="adm-td adm-td-muted">
        <span className="adm-hero-style-tag">{HERO_STYLE_LABELS[collection.heroStyle]}</span>
      </td>

      {/* Products */}
      <td className="adm-td adm-td-center">
        <span className="adm-num-badge">{collection.productCount}</span>
      </td>

      {/* Page Views */}
      <td className="adm-td adm-td-center">
        <span className="adm-td-stat">{formatViews(collection.pageViews)}</span>
      </td>

      {/* Revenue */}
      <td className="adm-td adm-td-center">
        <span className="adm-td-stat">{formatRevenue(collection.revenue)}</span>
      </td>

      {/* Updated */}
      <td className="adm-td adm-td-muted adm-td-date">
        {formatDate(collection.updatedAt)}
      </td>

      {/* Actions */}
      <td className="adm-td adm-td-actions">
        <div className="adm-row-actions">
          <Link
            href={`/collections/${collection.handle}`}
            target="_blank"
            className="adm-icon-btn"
            title="View on storefront"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </Link>
          <Link href={`/admin/collections/${collection.id}`} className="adm-icon-btn" title="Edit">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </Link>
          <div className="adm-menu-wrap">
            <button
              className="adm-icon-btn"
              title="More"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="5" r="1" fill="currentColor" />
                <circle cx="12" cy="12" r="1" fill="currentColor" />
                <circle cx="12" cy="19" r="1" fill="currentColor" />
              </svg>
            </button>
            {menuOpen && (
              <>
                <div className="adm-menu-backdrop" onClick={() => setMenuOpen(false)} />
                <div className="adm-menu">
                  <button className="adm-menu-item" onClick={() => { onToggleFeatured(collection.id); setMenuOpen(false); }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill={collection.isFeatured ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    {collection.isFeatured ? "Unfeature" : "Mark as Featured"}
                  </button>
                  <button className="adm-menu-item">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    Duplicate
                  </button>
                  <button className="adm-menu-item">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                    View Storefront
                  </button>
                  <div className="adm-menu-divider" />
                  <button
                    className="adm-menu-item adm-menu-item-danger"
                    onClick={() => { onDelete(collection); setMenuOpen(false); }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                    </svg>
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>(COLLECTIONS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | CollectionStatus>("all");
  const [sortBy, setSortBy] = useState<"updatedAt" | "revenue" | "pageViews" | "productCount">("updatedAt");
  const [sortDir, setSortDir] = useState<"desc" | "asc">("desc");
  const [deleteTarget, setDeleteTarget] = useState<Collection | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = (c: Collection) => setDeleteTarget(c);
  const confirmDelete = () => {
    if (!deleteTarget) return;
    setCollections((p) => p.filter((c) => c.id !== deleteTarget.id));
    showToast(`"${deleteTarget.title} ${deleteTarget.subtitle}" deleted`);
    setDeleteTarget(null);
  };
  const toggleFeatured = (id: string) => {
    setCollections((p) => p.map((c) => c.id === id ? { ...c, isFeatured: !c.isFeatured } : c));
    const c = collections.find((x) => x.id === id);
    if (c) showToast(c.isFeatured ? "Removed from featured" : "Marked as featured");
  };

  const toggleSort = (col: typeof sortBy) => {
    if (sortBy === col) setSortDir((d) => d === "desc" ? "asc" : "desc");
    else { setSortBy(col); setSortDir("desc"); }
  };

  // Filter & sort
  let filtered = collections.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch = !q || c.title.toLowerCase().includes(q) || c.subtitle.toLowerCase().includes(q) ||
      c.handle.includes(q) || c.eyebrow.toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });
  filtered = [...filtered].sort((a, b) => {
    const mult = sortDir === "desc" ? -1 : 1;
    if (sortBy === "updatedAt") return mult * (new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
    return mult * (a[sortBy] - b[sortBy]);
  });

  // Summary stats
  const totalActive = collections.filter((c) => c.status === "active").length;
  const totalRevenue = collections.reduce((s, c) => s + c.revenue, 0);
  const totalViews = collections.reduce((s, c) => s + c.pageViews, 0);
  const totalFeatured = collections.filter((c) => c.isFeatured).length;

  const SortIcon = ({ col }: { col: typeof sortBy }) => (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      style={{
        opacity: sortBy === col ? 1 : 0.3,
        transform: sortBy === col && sortDir === "asc" ? "rotate(180deg)" : "none",
        transition: "transform 0.2s",
      }}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );

  return (
    <div className="adm-page">

      {/* ── Header ── */}
      <div className="adm-header">
        <div className="adm-header-left">
          <nav className="adm-breadcrumb">
            <Link href="/admin">Dashboard</Link>
            <span className="adm-bc-sep">›</span>
            <span>Collections</span>
          </nav>
          <h1 className="adm-page-title">Collections</h1>
          <p className="adm-page-sub">Manage storefront collection pages and hero configurations</p>
        </div>
        <div className="adm-header-right">
          <Link href="/admin/collections/sort" className="adm-btn adm-btn-ghost">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="4" y1="6" x2="20" y2="6"/>
              <line x1="8" y1="12" x2="20" y2="12"/>
              <line x1="12" y1="18" x2="20" y2="18"/>
            </svg>
            Manage Order
          </Link>
          <button className="adm-btn adm-btn-primary" onClick={() => setShowNewModal(true)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
            New Collection
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="adm-stats-row">
        {[
          {
            label: "Total Collections",
            value: collections.length,
            icon: (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <path d="M8 21h8M12 17v4" />
              </svg>
            ),
            accent: "#c9a96e",
          },
          {
            label: "Active",
            value: totalActive,
            icon: (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M20 6L9 17l-5-5" />
              </svg>
            ),
            accent: "#4ade80",
          },
          {
            label: "Total Revenue",
            value: formatRevenue(totalRevenue),
            icon: (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            ),
            accent: "#60a5fa",
          },
          {
            label: "Total Page Views",
            value: formatViews(totalViews),
            icon: (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            ),
            accent: "#a78bfa",
          },
        ].map((stat) => (
          <div key={stat.label} className="adm-stat-card">
            <div className="adm-stat-icon" style={{ color: stat.accent, background: `${stat.accent}18` }}>
              {stat.icon}
            </div>
            <div className="adm-stat-body">
              <div className="adm-stat-value">{stat.value}</div>
              <div className="adm-stat-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div className="adm-toolbar">
        <div className="adm-toolbar-left">
          <div className="adm-search-wrap">
            <svg className="adm-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              className="adm-search"
              placeholder="Search collections…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className="adm-search-clear" onClick={() => setSearch("")}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          <div className="adm-filter-pills">
            {(["all", "active", "draft", "scheduled", "archived"] as const).map((f) => (
              <button
                key={f}
                className={`adm-filter-pill ${statusFilter === f ? "adm-filter-pill-active" : ""}`}
                onClick={() => setStatusFilter(f)}
              >
                {f === "all" ? `All (${collections.length})` : (
                  <>
                    <span
                      className="adm-filter-dot"
                      style={{ background: STATUS_CONFIG[f].dot }}
                    />
                    {STATUS_CONFIG[f].label} ({collections.filter((c) => c.status === f).length})
                  </>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="adm-toolbar-right">
          <span className="adm-result-count">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="adm-table-wrap">
        {filtered.length === 0 ? (
          <div className="adm-empty">
            <div className="adm-empty-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.9">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <path d="M8 21h8M12 17v4" />
              </svg>
            </div>
            <p className="adm-empty-title">No collections found</p>
            <p className="adm-empty-sub">
              {search ? `No results for "${search}"` : "Create your first collection to get started."}
            </p>
            {!search && (
              <button className="adm-btn adm-btn-primary" onClick={() => setShowNewModal(true)}>
                New Collection
              </button>
            )}
          </div>
        ) : (
          <table className="adm-table">
            <thead>
              <tr className="adm-thead-tr">
                <th className="adm-th adm-th-main">Collection</th>
                <th className="adm-th">Status</th>
                <th className="adm-th">Hero Style</th>
                <th
                  className="adm-th adm-th-sortable adm-th-center"
                  onClick={() => toggleSort("productCount")}
                >
                  Products <SortIcon col="productCount" />
                </th>
                <th
                  className="adm-th adm-th-sortable adm-th-center"
                  onClick={() => toggleSort("pageViews")}
                >
                  Views <SortIcon col="pageViews" />
                </th>
                <th
                  className="adm-th adm-th-sortable adm-th-center"
                  onClick={() => toggleSort("revenue")}
                >
                  Revenue <SortIcon col="revenue" />
                </th>
                <th
                  className="adm-th adm-th-sortable"
                  onClick={() => toggleSort("updatedAt")}
                >
                  Updated <SortIcon col="updatedAt" />
                </th>
                <th className="adm-th adm-th-actions"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <CollectionRow
                  key={c.id}
                  collection={c}
                  onDelete={handleDelete}
                  onToggleFeatured={toggleFeatured}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Featured Banner ── */}
      {totalFeatured > 0 && (
        <div className="adm-featured-info">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <span>
            {totalFeatured} featured collection{totalFeatured !== 1 ? "s" : ""} displayed on the homepage.
            <Link href="/admin/homepage" className="adm-featured-link"> Manage homepage →</Link>
          </span>
        </div>
      )}

      {/* ── Modals ── */}
      {deleteTarget && (
        <DeleteModal
          collection={deleteTarget}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
      {showNewModal && <NewCollectionModal onClose={() => setShowNewModal(false)} />}

      {/* ── Toast ── */}
      {toast && (
        <div className={`adm-toast ${toast.type === "error" ? "adm-toast-error" : ""}`}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            {toast.type === "error"
              ? <><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></>
              : <path d="M20 6L9 17l-5-5" />
            }
          </svg>
          {toast.msg}
        </div>
      )}

      <style>{`
        /* ── Admin Dark System ── */
        * { box-sizing: border-box; }
        .adm-page {
          min-height: 100vh;
          background: #0f0f0f;
          color: rgba(255,255,255,0.88);
          font-family: "DM Sans", system-ui, sans-serif;
          font-size: 14px;
          padding: 32px;
        }

        /* ── Header ── */
        .adm-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 28px;
          flex-wrap: wrap;
        }
        .adm-breadcrumb {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: rgba(255,255,255,0.35);
          margin-bottom: 8px;
          letter-spacing: 0.04em;
        }
        .adm-breadcrumb a { color: rgba(255,255,255,0.45); transition: color 0.2s; }
        .adm-breadcrumb a:hover { color: rgba(255,255,255,0.8); }
        .adm-bc-sep { color: rgba(255,255,255,0.2); }
        .adm-page-title {
          font-family: "Playfair Display", Georgia, serif;
          font-size: 28px;
          font-weight: 400;
          color: rgba(255,255,255,0.95);
          margin-bottom: 4px;
          line-height: 1.1;
        }
        .adm-page-sub { font-size: 13px; color: rgba(255,255,255,0.38); }
        .adm-header-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }

        /* ── Buttons ── */
        .adm-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 18px;
          font-size: 12px;
          letter-spacing: 0.06em;
          font-family: inherit;
          font-weight: 400;
          cursor: pointer;
          border: none;
          transition: all 0.18s;
          white-space: nowrap;
        }
        .adm-btn-primary {
          background: #c9a96e;
          color: #0f0f0f;
          font-weight: 500;
        }
        .adm-btn-primary:hover { background: #d4b87e; }
        .adm-btn-ghost {
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.65);
          border: 1px solid rgba(255,255,255,0.1);
        }
        .adm-btn-ghost:hover { background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.9); }
        .adm-btn-danger {
          background: rgba(239,68,68,0.15);
          color: #f87171;
          border: 1px solid rgba(239,68,68,0.2);
        }
        .adm-btn-danger:hover { background: rgba(239,68,68,0.25); }

        /* ── Stats ── */
        .adm-stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-bottom: 24px;
        }
        .adm-stat-card {
          background: #171717;
          border: 1px solid rgba(255,255,255,0.07);
          padding: 18px 20px;
          display: flex;
          align-items: center;
          gap: 14px;
          transition: border-color 0.2s;
        }
        .adm-stat-card:hover { border-color: rgba(255,255,255,0.13); }
        .adm-stat-icon {
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          flex-shrink: 0;
        }
        .adm-stat-value {
          font-size: 22px;
          font-weight: 500;
          color: rgba(255,255,255,0.92);
          line-height: 1;
          margin-bottom: 3px;
          font-family: "Playfair Display", serif;
        }
        .adm-stat-label { font-size: 11px; color: rgba(255,255,255,0.38); letter-spacing: 0.06em; text-transform: uppercase; }

        /* ── Toolbar ── */
        .adm-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }
        .adm-toolbar-left { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .adm-search-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }
        .adm-search-icon {
          position: absolute;
          left: 12px;
          color: rgba(255,255,255,0.3);
          pointer-events: none;
        }
        .adm-search {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.88);
          padding: 9px 36px 9px 34px;
          font-size: 13px;
          font-family: inherit;
          outline: none;
          width: 220px;
          transition: border-color 0.2s, background 0.2s;
        }
        .adm-search:focus { border-color: rgba(255,255,255,0.25); background: rgba(255,255,255,0.07); }
        .adm-search::placeholder { color: rgba(255,255,255,0.25); }
        .adm-search-clear {
          position: absolute;
          right: 10px;
          color: rgba(255,255,255,0.3);
          display: flex;
          align-items: center;
          background: none;
          border: none;
          cursor: pointer;
          padding: 2px;
          transition: color 0.2s;
        }
        .adm-search-clear:hover { color: rgba(255,255,255,0.7); }
        .adm-filter-pills { display: flex; gap: 4px; flex-wrap: wrap; }
        .adm-filter-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          font-size: 11px;
          letter-spacing: 0.06em;
          color: rgba(255,255,255,0.45);
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          cursor: pointer;
          transition: all 0.15s;
          font-family: inherit;
          white-space: nowrap;
        }
        .adm-filter-pill:hover { color: rgba(255,255,255,0.75); border-color: rgba(255,255,255,0.15); }
        .adm-filter-pill-active {
          color: rgba(255,255,255,0.92) !important;
          background: rgba(255,255,255,0.1) !important;
          border-color: rgba(255,255,255,0.2) !important;
        }
        .adm-filter-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
        .adm-result-count { font-size: 12px; color: rgba(255,255,255,0.3); }
        .adm-toolbar-right { flex-shrink: 0; }

        /* ── Table ── */
        .adm-table-wrap {
          background: #141414;
          border: 1px solid rgba(255,255,255,0.07);
          overflow-x: auto;
          margin-bottom: 16px;
        }
        .adm-table { width: 100%; border-collapse: collapse; }
        .adm-thead-tr { border-bottom: 1px solid rgba(255,255,255,0.08); }
        .adm-th {
          padding: 12px 16px;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          font-weight: 400;
          text-align: left;
          white-space: nowrap;
          background: rgba(255,255,255,0.02);
        }
        .adm-th-sortable { cursor: pointer; user-select: none; }
        .adm-th-sortable:hover { color: rgba(255,255,255,0.6); }
        .adm-th-sortable { display: table-cell; gap: 6px; }
        .adm-th-center { text-align: center; }
        .adm-th-actions { width: 100px; }
        .adm-th-main { min-width: 280px; }

        .adm-tr {
          border-bottom: 1px solid rgba(255,255,255,0.05);
          transition: background 0.15s;
        }
        .adm-tr:last-child { border-bottom: none; }
        .adm-tr:hover { background: rgba(255,255,255,0.03); }
        .adm-td {
          padding: 14px 16px;
          vertical-align: middle;
          font-size: 13px;
          color: rgba(255,255,255,0.7);
        }
        .adm-td-main { padding: 12px 16px; }
        .adm-td-muted { color: rgba(255,255,255,0.38); }
        .adm-td-center { text-align: center; }
        .adm-td-date { white-space: nowrap; font-size: 12px; }
        .adm-td-stat { font-size: 13px; color: rgba(255,255,255,0.65); }
        .adm-td-actions { text-align: right; }

        /* Collection cell */
        .adm-col-title-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .adm-col-palette-swatch {
          width: 4px;
          height: 40px;
          border-radius: 2px;
          flex-shrink: 0;
        }
        .adm-col-title-block { flex: 1; min-width: 0; }
        .adm-col-name {
          font-size: 14px;
          font-weight: 500;
          color: rgba(255,255,255,0.9);
          margin-bottom: 4px;
          white-space: nowrap;
        }
        .adm-col-name-sub { color: rgba(255,255,255,0.45); font-weight: 400; }
        .adm-col-handle {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .adm-col-eyebrow-badge {
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #c9a96e;
          background: rgba(201,169,110,0.1);
          padding: 2px 6px;
          white-space: nowrap;
        }
        .adm-col-handle-text {
          font-size: 11px;
          color: rgba(255,255,255,0.28);
          font-family: "DM Mono", monospace;
        }
        .adm-featured-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 10px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #c9a96e;
          background: rgba(201,169,110,0.1);
          border: 1px solid rgba(201,169,110,0.2);
          padding: 3px 8px;
          white-space: nowrap;
          flex-shrink: 0;
        }

        /* Status pill */
        .adm-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          letter-spacing: 0.06em;
          padding: 4px 10px;
          white-space: nowrap;
        }
        .adm-status-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
        .adm-scheduled-hint { font-size: 10px; opacity: 0.6; }

        /* Hero style tag */
        .adm-hero-style-tag {
          font-size: 11px;
          color: rgba(255,255,255,0.38);
          letter-spacing: 0.04em;
        }

        /* Num badge */
        .adm-num-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 28px;
          height: 22px;
          padding: 0 6px;
          background: rgba(255,255,255,0.07);
          font-size: 12px;
          color: rgba(255,255,255,0.6);
        }

        /* Row actions */
        .adm-row-actions { display: flex; align-items: center; gap: 4px; justify-content: flex-end; }
        .adm-icon-btn {
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255,255,255,0.3);
          background: none;
          border: none;
          cursor: pointer;
          transition: all 0.15s;
          text-decoration: none;
        }
        .adm-icon-btn:hover { color: rgba(255,255,255,0.8); background: rgba(255,255,255,0.07); }

        /* Dropdown menu */
        .adm-menu-wrap { position: relative; }
        .adm-menu-backdrop {
          position: fixed;
          inset: 0;
          z-index: 50;
        }
        .adm-menu {
          position: absolute;
          right: 0;
          top: calc(100% + 4px);
          background: #1e1e1e;
          border: 1px solid rgba(255,255,255,0.12);
          min-width: 180px;
          z-index: 51;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
          animation: adm-menu-in 0.15s ease both;
        }
        @keyframes adm-menu-in {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .adm-menu-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          font-size: 12px;
          color: rgba(255,255,255,0.6);
          background: none;
          border: none;
          width: 100%;
          text-align: left;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.15s;
          letter-spacing: 0.03em;
        }
        .adm-menu-item:hover { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.9); }
        .adm-menu-item-danger { color: #f87171; }
        .adm-menu-item-danger:hover { background: rgba(239,68,68,0.1); color: #fca5a5; }
        .adm-menu-divider { height: 1px; background: rgba(255,255,255,0.07); margin: 4px 0; }

        /* ── Empty ── */
        .adm-empty {
          padding: 80px 40px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .adm-empty-icon { color: rgba(255,255,255,0.18); margin-bottom: 8px; }
        .adm-empty-title { font-size: 16px; color: rgba(255,255,255,0.55); font-weight: 400; }
        .adm-empty-sub { font-size: 13px; color: rgba(255,255,255,0.28); margin-bottom: 8px; }

        /* ── Featured info bar ── */
        .adm-featured-info {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: rgba(255,255,255,0.35);
          padding: 12px 16px;
          background: rgba(201,169,110,0.06);
          border: 1px solid rgba(201,169,110,0.15);
        }
        .adm-featured-info svg { color: #c9a96e; flex-shrink: 0; }
        .adm-featured-link { color: #c9a96e; text-decoration: none; transition: opacity 0.2s; }
        .adm-featured-link:hover { opacity: 0.7; }

        /* ── Modal ── */
        .adm-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 200;
          backdrop-filter: blur(4px);
          padding: 20px;
          animation: adm-fade 0.2s ease;
        }
        @keyframes adm-fade { from { opacity: 0; } to { opacity: 1; } }
        .adm-modal {
          background: #1a1a1a;
          border: 1px solid rgba(255,255,255,0.1);
          width: 100%;
          max-width: 440px;
          animation: adm-slide 0.25s ease;
          padding: 32px;
        }
        .adm-modal-lg { max-width: 620px; padding: 0; }
        @keyframes adm-slide {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .adm-modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 24px 28px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .adm-modal-title {
          font-size: 17px;
          font-weight: 500;
          color: rgba(255,255,255,0.9);
          margin-bottom: 3px;
        }
        .adm-modal-subtitle { font-size: 12px; color: rgba(255,255,255,0.35); }
        .adm-modal-close {
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255,255,255,0.3);
          background: none;
          border: none;
          cursor: pointer;
          transition: color 0.2s;
          flex-shrink: 0;
        }
        .adm-modal-close:hover { color: rgba(255,255,255,0.8); }
        .adm-modal-form { padding: 20px 28px; display: flex; flex-direction: column; gap: 16px; }
        .adm-modal-icon {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        }
        .adm-modal-icon-danger { background: rgba(239,68,68,0.12); color: #f87171; border: 1px solid rgba(239,68,68,0.2); }
        .adm-modal-body { font-size: 13px; color: rgba(255,255,255,0.55); line-height: 1.65; text-align: center; margin-bottom: 8px; }
        .adm-modal-body strong { color: rgba(255,255,255,0.8); }
        .adm-modal-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 8px;
        }
        .adm-modal-actions-border {
          padding: 16px 28px 20px;
          border-top: 1px solid rgba(255,255,255,0.07);
          margin-top: 0;
        }

        /* Form fields */
        .adm-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .adm-form-field { display: flex; flex-direction: column; gap: 6px; }
        .adm-form-label {
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.38);
        }
        .adm-form-input {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.88);
          padding: 9px 12px;
          font-size: 13px;
          font-family: inherit;
          outline: none;
          transition: border-color 0.2s;
          width: 100%;
        }
        .adm-form-input:focus { border-color: rgba(255,255,255,0.25); }
        .adm-form-input::placeholder { color: rgba(255,255,255,0.2); }
        .adm-form-textarea { resize: vertical; min-height: 80px; }
        .adm-input-prefix-wrap { position: relative; display: flex; align-items: center; }
        .adm-input-prefix {
          position: absolute;
          left: 10px;
          font-size: 12px;
          color: rgba(255,255,255,0.25);
          pointer-events: none;
          font-family: "DM Mono", monospace;
          white-space: nowrap;
        }
        .adm-form-input-prefixed { padding-left: 100px; }

        /* Hero style picker */
        .adm-hero-style-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
        .adm-hero-style-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 10px 8px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.45);
          font-size: 11px;
          letter-spacing: 0.06em;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.15s;
        }
        .adm-hero-style-btn:hover { border-color: rgba(255,255,255,0.2); color: rgba(255,255,255,0.75); }
        .adm-hero-style-active {
          border-color: #c9a96e !important;
          color: #c9a96e !important;
          background: rgba(201,169,110,0.08) !important;
        }
        .adm-hero-preview {
          width: 100%;
          height: 48px;
          display: flex;
          overflow: hidden;
          border-radius: 1px;
        }
        .adm-preview-col { flex: 1; }
        .adm-preview-text-col { background: rgba(255,255,255,0.06); }
        .adm-preview-img-col { background: rgba(255,255,255,0.12); }
        .adm-preview-wide { flex: 1.4; }
        .adm-preview-narrow { flex: 0.6; }
        .adm-preview-full { flex: 1; background: linear-gradient(160deg, rgba(255,255,255,0.06), rgba(255,255,255,0.14)); }
        .adm-preview-dark {
          flex: 1;
          background: #111;
          display: flex;
        }
        .adm-preview-dark-text { flex: 1; background: rgba(255,255,255,0.04); }
        .adm-preview-dark-img { flex: 1; background: rgba(255,255,255,0.1); }

        /* ── Toast ── */
        .adm-toast {
          position: fixed;
          bottom: 28px;
          left: 50%;
          transform: translateX(-50%);
          background: #252525;
          border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.88);
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
        .adm-toast svg { color: #4ade80; }
        .adm-toast-error svg { color: #f87171; }
        @keyframes adm-toast-in {
          from { opacity: 0; transform: translateX(-50%) translateY(10px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }

        /* ── Responsive ── */
        @media (max-width: 1100px) {
          .adm-stats-row { grid-template-columns: repeat(2, 1fr); }
          .adm-page { padding: 24px; }
        }
        @media (max-width: 768px) {
          .adm-header { flex-direction: column; }
          .adm-stats-row { grid-template-columns: 1fr 1fr; }
          .adm-form-row { grid-template-columns: 1fr; }
          .adm-hero-style-grid { grid-template-columns: repeat(2, 1fr); }
          .adm-modal-actions { flex-direction: column; align-items: stretch; }
          .adm-modal-actions .adm-btn { justify-content: center; }
        }
      `}</style>
    </div>
  );
}