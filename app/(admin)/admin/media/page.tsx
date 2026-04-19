"use client";

import { useState, useRef, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type MediaType = "image" | "video";
type MediaContext = "product" | "collection" | "editorial" | "avatar" | "general";

type MediaItem = {
  id: string;
  filename: string;
  url: string;
  type: MediaType;
  context: MediaContext;
  size: number; // bytes
  width: number;
  height: number;
  alt?: string;
  usedIn: { type: string; name: string }[];
  uploadedAt: string;
  color: string; // placeholder bg colour
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_MEDIA: MediaItem[] = [
  {
    id: "m001", filename: "silk-slip-dress-sand.jpg",    url: "#", type: "image", context: "product",
    size: 842_000,  width: 1200, height: 1600, alt: "Silk Slip Dress in Sand",
    usedIn: [{ type: "product", name: "Silk Slip Dress" }],
    uploadedAt: "2025-04-01T10:14:00Z", color: "#e8d5c0",
  },
  {
    id: "m002", filename: "silk-slip-dress-charcoal.jpg", url: "#", type: "image", context: "product",
    size: 790_000,  width: 1200, height: 1600, alt: "Silk Slip Dress in Charcoal",
    usedIn: [{ type: "product", name: "Silk Slip Dress" }],
    uploadedAt: "2025-04-01T10:16:00Z", color: "#2d2d2d",
  },
  {
    id: "m003", filename: "ss25-hero-campaign.jpg",       url: "#", type: "image", context: "collection",
    size: 2_140_000, width: 2400, height: 1600, alt: "SS25 Campaign Hero",
    usedIn: [{ type: "collection", name: "Spring / Summer 2025" }],
    uploadedAt: "2025-03-28T09:00:00Z", color: "#e8ddd0",
  },
  {
    id: "m004", filename: "cashmere-turtleneck-lavender.jpg", url: "#", type: "image", context: "product",
    size: 688_000,  width: 1200, height: 1600, alt: "Cashmere Turtleneck Lavender",
    usedIn: [{ type: "product", name: "Cashmere Turtleneck" }],
    uploadedAt: "2025-03-25T14:22:00Z", color: "#d0c8d5",
  },
  {
    id: "m005", filename: "linen-edit-hero.jpg",           url: "#", type: "image", context: "collection",
    size: 1_820_000, width: 2400, height: 1800, alt: "The Linen Edit Hero",
    usedIn: [{ type: "collection", name: "The Linen Edit" }],
    uploadedAt: "2025-03-20T11:05:00Z", color: "#e0d5b8",
  },
  {
    id: "m006", filename: "wrap-blazer-stone.jpg",         url: "#", type: "image", context: "product",
    size: 921_000,  width: 1200, height: 1600, alt: "Wrap Blazer Stone",
    usedIn: [{ type: "product", name: "Wrap Blazer" }],
    uploadedAt: "2025-03-18T08:44:00Z", color: "#d5d0c0",
  },
  {
    id: "m007", filename: "editorial-manifesto.jpg",       url: "#", type: "image", context: "editorial",
    size: 1_340_000, width: 1600, height: 2400, alt: "Editorial — Manifesto",
    usedIn: [{ type: "page", name: "About" }],
    uploadedAt: "2025-03-15T16:30:00Z", color: "#d4c4b0",
  },
  {
    id: "m008", filename: "bestselling-hero.jpg",          url: "#", type: "image", context: "collection",
    size: 1_560_000, width: 2400, height: 1600, alt: "Customer Favourites Hero",
    usedIn: [{ type: "collection", name: "Customer Favourites" }],
    uploadedAt: "2025-03-10T13:00:00Z", color: "#faf7f2",
  },
  {
    id: "m009", filename: "fluid-midi-skirt-dusk.jpg",    url: "#", type: "image", context: "product",
    size: 754_000,  width: 1200, height: 1600, alt: "Fluid Midi Skirt Dusk",
    usedIn: [{ type: "product", name: "Fluid Midi Skirt" }],
    uploadedAt: "2025-03-08T10:10:00Z", color: "#ddc5b5",
  },
  {
    id: "m010", filename: "ss25-lookbook-01.jpg",          url: "#", type: "image", context: "editorial",
    size: 2_010_000, width: 2400, height: 3200, alt: "SS25 Lookbook 01",
    usedIn: [{ type: "collection", name: "Shop the Look" }],
    uploadedAt: "2025-03-05T09:00:00Z", color: "#c8d5e0",
  },
  {
    id: "m011", filename: "satin-cami-top-ivory.jpg",      url: "#", type: "image", context: "product",
    size: 612_000,  width: 1200, height: 1600, alt: "Satin Cami Top Ivory",
    usedIn: [{ type: "product", name: "Satin Cami Top" }],
    uploadedAt: "2025-03-01T15:44:00Z", color: "#ddd5c5",
  },
  {
    id: "m012", filename: "sustainability-atelier.jpg",    url: "#", type: "image", context: "editorial",
    size: 1_890_000, width: 2400, height: 1600, alt: "Atelier Lyon — Sustainability",
    usedIn: [{ type: "page", name: "Sustainability" }],
    uploadedAt: "2025-02-28T11:20:00Z", color: "#c8d8c0",
  },
];

const CONTEXT_CONFIG: Record<MediaContext, { label: string; color: string }> = {
  product:    { label: "Product",    color: "#c9a96e" },
  collection: { label: "Collection", color: "#5c8ee0" },
  editorial:  { label: "Editorial",  color: "#b87898" },
  avatar:     { label: "Avatar",     color: "#4caf7d" },
  general:    { label: "General",    color: "#6b6560" },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatBytes(bytes: number): string {
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`;
  if (bytes >= 1_000)     return `${(bytes / 1_000).toFixed(0)} KB`;
  return `${bytes} B`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

// ─── Upload Zone ──────────────────────────────────────────────────────────────
function UploadZone({ onUpload }: { onUpload: (count: number) => void }) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/") || f.type.startsWith("video/"));
    if (files.length === 0) return;
    simulateUpload(files.length);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    simulateUpload(files.length);
  };

  const simulateUpload = async (count: number) => {
    setUploading(true);
    setProgress(0);
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(r => setTimeout(r, 40));
      setProgress(i);
    }
    setUploading(false);
    setProgress(0);
    onUpload(count);
  };

  return (
    <div
      className={`adm-upload-zone ${dragging ? "adm-upload-dragging" : ""}`}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => !uploading && inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/avif,video/mp4"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      {uploading ? (
        <div className="adm-upload-progress">
          <div className="adm-upload-progress-bar" style={{ width: `${progress}%` }} />
          <span className="adm-upload-progress-label">Uploading… {progress}%</span>
        </div>
      ) : (
        <>
          <div className="adm-upload-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <p className="adm-upload-title">Drop files here or <span>browse</span></p>
          <p className="adm-upload-sub">JPEG, PNG, WebP, AVIF · Max 5 MB per file</p>
        </>
      )}
    </div>
  );
}

// ─── Media Card ───────────────────────────────────────────────────────────────
function MediaCard({
  item,
  selected,
  onSelect,
  onOpen,
}: {
  item: MediaItem;
  selected: boolean;
  onSelect: (id: string) => void;
  onOpen: (item: MediaItem) => void;
}) {
  const ctx = CONTEXT_CONFIG[item.context];

  return (
    <div
      className={`adm-media-card ${selected ? "adm-media-selected" : ""}`}
      onClick={() => onOpen(item)}
    >
      {/* Thumbnail */}
      <div className="adm-media-thumb" style={{ background: item.color }}>
        <span className="adm-media-thumb-label">
          {item.width}×{item.height}
        </span>
        {/* Context badge */}
        <span className="adm-media-ctx-badge" style={{ color: ctx.color, background: `${ctx.color}18` }}>
          {ctx.label}
        </span>
        {/* Select checkbox */}
        <button
          className="adm-media-select-btn"
          onClick={(e) => { e.stopPropagation(); onSelect(item.id); }}
          aria-label="Select"
        >
          {selected ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          ) : null}
        </button>
      </div>

      {/* Info */}
      <div className="adm-media-info">
        <p className="adm-media-filename" title={item.filename}>
          {item.filename}
        </p>
        <div className="adm-media-meta">
          <span>{formatBytes(item.size)}</span>
          <span className="adm-media-meta-sep">·</span>
          <span>{formatDate(item.uploadedAt)}</span>
        </div>
        {item.usedIn.length > 0 && (
          <div className="adm-media-used">
            <span className="adm-media-used-dot" />
            <span>Used in {item.usedIn[0].name}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────
function DetailPanel({
  item,
  onClose,
  onDelete,
}: {
  item: MediaItem;
  onClose: () => void;
  onDelete: (id: string) => void;
}) {
  const [alt, setAlt] = useState(item.alt ?? "");
  const [saved, setSaved] = useState(false);
  const ctx = CONTEXT_CONFIG[item.context];

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <aside className="adm-detail-panel">
      <div className="adm-detail-header">
        <h2 className="adm-detail-title">File Details</h2>
        <button className="adm-detail-close" onClick={onClose}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Preview */}
      <div className="adm-detail-preview" style={{ background: item.color }}>
        <span className="adm-detail-preview-label">Preview</span>
        <div className="adm-detail-preview-dims">{item.width} × {item.height}px</div>
      </div>

      {/* Fields */}
      <div className="adm-detail-fields">
        <div className="adm-detail-field">
          <label className="adm-detail-label">Filename</label>
          <p className="adm-detail-val adm-detail-mono">{item.filename}</p>
        </div>

        <div className="adm-detail-field">
          <label className="adm-detail-label">URL</label>
          <div className="adm-detail-url-row">
            <span className="adm-detail-val adm-detail-mono adm-detail-url">
              /uploads/{item.filename}
            </span>
            <button className="adm-detail-copy-btn" onClick={() => navigator.clipboard.writeText(`/uploads/${item.filename}`)}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            </button>
          </div>
        </div>

        <div className="adm-detail-field-row">
          <div className="adm-detail-field">
            <label className="adm-detail-label">Size</label>
            <p className="adm-detail-val">{formatBytes(item.size)}</p>
          </div>
          <div className="adm-detail-field">
            <label className="adm-detail-label">Dimensions</label>
            <p className="adm-detail-val">{item.width} × {item.height}</p>
          </div>
        </div>

        <div className="adm-detail-field-row">
          <div className="adm-detail-field">
            <label className="adm-detail-label">Context</label>
            <span className="adm-detail-badge" style={{ color: ctx.color, background: `${ctx.color}18` }}>
              {ctx.label}
            </span>
          </div>
          <div className="adm-detail-field">
            <label className="adm-detail-label">Uploaded</label>
            <p className="adm-detail-val">{formatDate(item.uploadedAt)}</p>
          </div>
        </div>

        {/* Alt text */}
        <div className="adm-detail-field">
          <label className="adm-detail-label">Alt Text</label>
          <input
            type="text"
            className="adm-detail-input"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            placeholder="Describe this image for accessibility…"
          />
        </div>

        {/* Used in */}
        {item.usedIn.length > 0 && (
          <div className="adm-detail-field">
            <label className="adm-detail-label">Used In</label>
            <div className="adm-detail-usages">
              {item.usedIn.map((u, i) => (
                <div key={i} className="adm-detail-usage">
                  <span className="adm-detail-usage-type">{u.type}</span>
                  <span className="adm-detail-usage-name">{u.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="adm-detail-actions">
        <button className={`adm-btn-primary ${saved ? "adm-btn-saved" : ""}`} onClick={save} style={{ flex: 1 }}>
          {saved ? (
            <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              Saved
            </>
          ) : "Save Changes"}
        </button>
        <a href="#" className="adm-btn-ghost adm-btn-icon" title="Download" download>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </a>
        <button
          className="adm-btn-ghost adm-btn-icon adm-btn-danger-icon"
          title="Delete"
          onClick={() => onDelete(item.id)}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
        </button>
      </div>
    </aside>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminMediaPage() {
  const [media, setMedia] = useState<MediaItem[]>(MOCK_MEDIA);
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [contextFilter, setContextFilter] = useState<"all" | MediaContext>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeItem, setActiveItem] = useState<MediaItem | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"date" | "name" | "size">("date");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleUpload = (count: number) => {
    showToast(`${count} file${count !== 1 ? "s" : ""} uploaded successfully`);
  };

  const handleDelete = (id: string) => {
    setMedia(p => p.filter(m => m.id !== id));
    if (activeItem?.id === id) setActiveItem(null);
    setSelected(p => p.filter(s => s !== id));
    showToast("File deleted");
  };

  const handleBulkDelete = () => {
    setMedia(p => p.filter(m => !selected.includes(m.id)));
    if (activeItem && selected.includes(activeItem.id)) setActiveItem(null);
    showToast(`${selected.length} file${selected.length !== 1 ? "s" : ""} deleted`);
    setSelected([]);
  };

  const toggleSelect = (id: string) => {
    setSelected(p => p.includes(id) ? p.filter(s => s !== id) : [...p, id]);
  };

  const toggleSelectAll = () => {
    if (selected.length === filtered.length) setSelected([]);
    else setSelected(filtered.map(m => m.id));
  };

  // Filter & sort
  let filtered = media.filter(m => {
    if (contextFilter !== "all" && m.context !== contextFilter) return false;
    if (search && !m.filename.toLowerCase().includes(search.toLowerCase()) &&
        !(m.alt ?? "").toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
  filtered = [...filtered].sort((a, b) => {
    if (sortBy === "date") return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
    if (sortBy === "name") return a.filename.localeCompare(b.filename);
    return b.size - a.size;
  });

  const totalSize = media.reduce((s, m) => s + m.size, 0);
  const usedStorage = Math.round((totalSize / (500 * 1_000_000)) * 100);

  return (
    <div className="adm-page">

      {/* ── Header ── */}
      <div className="adm-page-header">
        <div>
          <div className="adm-breadcrumb">
            <span>Admin</span>
            <span className="adm-bc-sep">›</span>
            <span>Media Library</span>
          </div>
          <h1 className="adm-page-title">Media Library</h1>
          <p className="adm-page-sub">
            {media.length} files · {formatBytes(totalSize)} used
          </p>
        </div>
        <div className="adm-header-right">
          <div className="adm-storage-pill">
            <div className="adm-storage-bar">
              <div className="adm-storage-fill" style={{ width: `${Math.min(usedStorage, 100)}%` }} />
            </div>
            <span className="adm-storage-label">{formatBytes(totalSize)} / 500 MB</span>
          </div>
        </div>
      </div>

      {/* ── Upload Zone ── */}
      <UploadZone onUpload={handleUpload} />

      {/* ── Toolbar ── */}
      <div className="adm-toolbar">
        <div className="adm-toolbar-left">
          {/* Search */}
          <div className="adm-search-wrap">
            <svg className="adm-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              className="adm-search-input"
              placeholder="Search files…"
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

          {/* Context filter pills */}
          <div className="adm-filter-tabs">
            <button
              className={`adm-filter-tab ${contextFilter === "all" ? "adm-filter-active" : ""}`}
              onClick={() => setContextFilter("all")}
            >
              All ({media.length})
            </button>
            {(Object.keys(CONTEXT_CONFIG) as MediaContext[]).map(ctx => {
              const count = media.filter(m => m.context === ctx).length;
              if (count === 0) return null;
              return (
                <button
                  key={ctx}
                  className={`adm-filter-tab ${contextFilter === ctx ? "adm-filter-active" : ""}`}
                  onClick={() => setContextFilter(ctx)}
                  style={contextFilter === ctx ? { color: CONTEXT_CONFIG[ctx].color } : {}}
                >
                  {CONTEXT_CONFIG[ctx].label} ({count})
                </button>
              );
            })}
          </div>
        </div>

        <div className="adm-toolbar-right">
          {/* Sort */}
          <div className="adm-sort-wrap">
            <select
              className="adm-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            >
              <option value="date">Date</option>
              <option value="name">Name</option>
              <option value="size">Size</option>
            </select>
            <svg className="adm-sort-chevron" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>

          {/* View mode */}
          <div className="adm-view-toggle">
            <button
              className={`adm-view-btn ${viewMode === "grid" ? "adm-view-active" : ""}`}
              onClick={() => setViewMode("grid")}
              title="Grid view"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
              </svg>
            </button>
            <button
              className={`adm-view-btn ${viewMode === "list" ? "adm-view-active" : ""}`}
              onClick={() => setViewMode("list")}
              title="List view"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>

          <span className="adm-result-count">{filtered.length} files</span>
        </div>
      </div>

      {/* ── Bulk Actions ── */}
      {selected.length > 0 && (
        <div className="adm-bulk-bar">
          <button className="adm-bulk-check" onClick={toggleSelectAll}>
            {selected.length === filtered.length ? "Deselect all" : `${selected.length} selected`}
          </button>
          <div className="adm-bulk-actions">
            <button className="adm-bulk-btn" onClick={() => { navigator.clipboard.writeText(selected.join(",")); showToast("URLs copied"); }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Copy URLs
            </button>
            <button className="adm-bulk-btn adm-bulk-btn-danger" onClick={handleBulkDelete}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              </svg>
              Delete {selected.length} file{selected.length !== 1 ? "s" : ""}
            </button>
            <button className="adm-bulk-cancel" onClick={() => setSelected([])}>Cancel</button>
          </div>
        </div>
      )}

      {/* ── Main Layout ── */}
      <div className={`adm-media-layout ${activeItem ? "adm-media-layout-split" : ""}`}>
        {/* Grid / List */}
        <div className="adm-media-main">
          {filtered.length === 0 ? (
            <div className="adm-empty">
              <div className="adm-empty-icon">◈</div>
              <p className="adm-empty-title">No files found</p>
              <p className="adm-empty-sub">
                {search ? `No results for "${search}"` : "Upload your first file above."}
              </p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="adm-media-grid">
              {filtered.map(item => (
                <MediaCard
                  key={item.id}
                  item={item}
                  selected={selected.includes(item.id)}
                  onSelect={toggleSelect}
                  onOpen={setActiveItem}
                />
              ))}
            </div>
          ) : (
            <div className="adm-media-list">
              <div className="adm-list-head">
                <div className="adm-list-col-name">File</div>
                <div className="adm-list-col">Context</div>
                <div className="adm-list-col">Dimensions</div>
                <div className="adm-list-col">Size</div>
                <div className="adm-list-col">Uploaded</div>
                <div className="adm-list-col">Used In</div>
                <div className="adm-list-col-actions" />
              </div>
              {filtered.map(item => {
                const ctx = CONTEXT_CONFIG[item.context];
                return (
                  <div
                    key={item.id}
                    className={`adm-list-row ${selected.includes(item.id) ? "adm-list-row-selected" : ""}`}
                    onClick={() => setActiveItem(item)}
                  >
                    <div className="adm-list-col-name">
                      <button
                        className={`adm-list-checkbox ${selected.includes(item.id) ? "adm-list-checkbox-checked" : ""}`}
                        onClick={(e) => { e.stopPropagation(); toggleSelect(item.id); }}
                      >
                        {selected.includes(item.id) && (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        )}
                      </button>
                      <div className="adm-list-thumb" style={{ background: item.color }} />
                      <span className="adm-list-filename">{item.filename}</span>
                    </div>
                    <div className="adm-list-col">
                      <span className="adm-list-badge" style={{ color: ctx.color, background: `${ctx.color}18` }}>
                        {ctx.label}
                      </span>
                    </div>
                    <div className="adm-list-col adm-list-muted">{item.width} × {item.height}</div>
                    <div className="adm-list-col adm-list-muted">{formatBytes(item.size)}</div>
                    <div className="adm-list-col adm-list-muted">{formatDate(item.uploadedAt)}</div>
                    <div className="adm-list-col adm-list-muted">
                      {item.usedIn.length > 0 ? item.usedIn[0].name : "—"}
                    </div>
                    <div className="adm-list-col-actions">
                      <button
                        className="adm-icon-btn"
                        title="Delete"
                        onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {activeItem && (
          <DetailPanel
            item={activeItem}
            onClose={() => setActiveItem(null)}
            onDelete={handleDelete}
          />
        )}
      </div>

      {/* ── Toast ── */}
      {toast && (
        <div className="adm-toast">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M20 6L9 17l-5-5" />
          </svg>
          {toast}
        </div>
      )}

      <style>{`
        /* ── Admin CSS Variables ── */
        .adm-page {
          --adm-bg:           #111111;
          --adm-surface:      #1a1a1a;
          --adm-surface-2:    #222222;
          --adm-border:       #2a2a2a;
          --adm-border-light: #333333;
          --adm-text:         #f0ece4;
          --adm-text-secondary: #8a8478;
          --adm-muted:        #5a5650;
          --adm-gold:         #c9a96e;
          --adm-gold-dim:     rgba(201,169,110,0.15);
          --adm-danger:       #e05c5c;

          background: var(--adm-bg);
          color: var(--adm-text);
          font-family: "DM Sans", system-ui, sans-serif;
          min-height: 100vh;
          padding: 36px 48px 80px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        /* ── Page Header ── */
        .adm-page-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 24px;
          flex-wrap: wrap;
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
        }
        .adm-page-sub { font-size: 13px; color: var(--adm-text-secondary); }
        .adm-header-right { display: flex; align-items: center; gap: 16px; }

        /* Storage pill */
        .adm-storage-pill {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 14px;
          border: 1px solid var(--adm-border-light);
          background: var(--adm-surface);
        }
        .adm-storage-bar {
          width: 80px;
          height: 3px;
          background: var(--adm-border-light);
        }
        .adm-storage-fill {
          height: 100%;
          background: var(--adm-gold);
          transition: width 0.5s ease;
        }
        .adm-storage-label { font-size: 11px; color: var(--adm-text-secondary); white-space: nowrap; }

        /* ── Upload Zone ── */
        .adm-upload-zone {
          border: 1px dashed var(--adm-border-light);
          background: var(--adm-surface);
          padding: 36px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
          overflow: hidden;
          min-height: 130px;
        }
        .adm-upload-zone:hover {
          border-color: var(--adm-gold);
          background: var(--adm-gold-dim);
        }
        .adm-upload-dragging {
          border-color: var(--adm-gold) !important;
          background: rgba(201,169,110,0.12) !important;
        }
        .adm-upload-icon { color: var(--adm-gold); opacity: 0.7; }
        .adm-upload-title {
          font-size: 14px;
          color: var(--adm-text-secondary);
        }
        .adm-upload-title span {
          color: var(--adm-gold);
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .adm-upload-sub { font-size: 11px; color: var(--adm-muted); letter-spacing: 0.06em; }
        .adm-upload-progress {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .adm-upload-progress-bar {
          height: 2px;
          background: var(--adm-gold);
          transition: width 0.1s linear;
          align-self: flex-start;
        }
        .adm-upload-progress-label { font-size: 12px; color: var(--adm-gold); letter-spacing: 0.06em; }

        /* ── Toolbar ── */
        .adm-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }
        .adm-toolbar-left { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .adm-toolbar-right { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }

        .adm-search-wrap {
          position: relative;
          min-width: 200px;
          max-width: 300px;
          flex: 1;
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
          padding: 9px 36px 9px 34px;
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
          background: none;
          border: none;
          cursor: pointer;
          transition: color 0.2s;
        }
        .adm-search-clear:hover { color: var(--adm-text); }

        .adm-filter-tabs {
          display: flex;
          border: 1px solid var(--adm-border-light);
          overflow: hidden;
          flex-wrap: wrap;
        }
        .adm-filter-tab {
          padding: 8px 14px;
          font-size: 11px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--adm-muted);
          background: var(--adm-surface);
          border-right: 1px solid var(--adm-border-light);
          cursor: pointer;
          font-family: "DM Sans", sans-serif;
          transition: all 0.15s;
          white-space: nowrap;
        }
        .adm-filter-tab:last-child { border-right: none; }
        .adm-filter-tab:hover { color: var(--adm-text); background: var(--adm-surface-2); }
        .adm-filter-active { background: var(--adm-gold-dim) !important; color: var(--adm-gold) !important; }

        .adm-sort-wrap { position: relative; }
        .adm-sort-select {
          appearance: none;
          background: var(--adm-surface);
          border: 1px solid var(--adm-border-light);
          color: var(--adm-text-secondary);
          padding: 8px 28px 8px 12px;
          font-size: 12px;
          font-family: "DM Sans", sans-serif;
          outline: none;
          cursor: pointer;
          transition: border-color 0.2s;
        }
        .adm-sort-select:focus { border-color: var(--adm-gold); }
        .adm-sort-chevron {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: var(--adm-muted);
        }
        .adm-view-toggle {
          display: flex;
          border: 1px solid var(--adm-border-light);
          overflow: hidden;
        }
        .adm-view-btn {
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--adm-surface);
          border-right: 1px solid var(--adm-border-light);
          color: var(--adm-muted);
          cursor: pointer;
          transition: all 0.15s;
        }
        .adm-view-btn:last-child { border-right: none; }
        .adm-view-btn:hover { color: var(--adm-text); background: var(--adm-surface-2); }
        .adm-view-active { background: var(--adm-gold-dim) !important; color: var(--adm-gold) !important; }
        .adm-result-count { font-size: 12px; color: var(--adm-muted); }

        /* ── Bulk Bar ── */
        .adm-bulk-bar {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 18px;
          background: var(--adm-gold-dim);
          border: 1px solid rgba(201,169,110,0.25);
          flex-wrap: wrap;
          animation: adm-fade-in 0.2s ease both;
        }
        @keyframes adm-fade-in { from { opacity: 0; } to { opacity: 1; } }
        .adm-bulk-check {
          font-size: 12px;
          color: var(--adm-gold);
          font-weight: 500;
          background: none;
          border: none;
          cursor: pointer;
          font-family: "DM Sans", sans-serif;
          transition: opacity 0.15s;
        }
        .adm-bulk-check:hover { opacity: 0.75; }
        .adm-bulk-actions { display: flex; gap: 8px; flex: 1; }
        .adm-bulk-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          font-size: 11px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--adm-text);
          background: var(--adm-surface-2);
          border: 1px solid var(--adm-border-light);
          cursor: pointer;
          font-family: "DM Sans", sans-serif;
          transition: all 0.15s;
        }
        .adm-bulk-btn:hover { border-color: var(--adm-text); }
        .adm-bulk-btn-danger { color: var(--adm-danger) !important; border-color: rgba(224,92,92,0.3) !important; }
        .adm-bulk-btn-danger:hover { background: rgba(224,92,92,0.1) !important; }
        .adm-bulk-cancel {
          font-size: 11px;
          color: var(--adm-muted);
          background: none;
          border: none;
          cursor: pointer;
          font-family: "DM Sans", sans-serif;
          margin-left: auto;
          transition: color 0.15s;
        }
        .adm-bulk-cancel:hover { color: var(--adm-text); }

        /* ── Layout ── */
        .adm-media-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
          align-items: start;
        }
        .adm-media-layout-split {
          grid-template-columns: 1fr 300px;
        }
        .adm-media-main { min-width: 0; }

        /* ── Media Grid ── */
        .adm-media-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
          gap: 2px;
          background: var(--adm-border);
          border: 1px solid var(--adm-border);
        }
        .adm-media-card {
          background: var(--adm-surface);
          cursor: pointer;
          transition: background 0.15s;
          position: relative;
        }
        .adm-media-card:hover { background: var(--adm-surface-2); }
        .adm-media-selected { background: var(--adm-gold-dim) !important; }
        .adm-media-thumb {
          height: 150px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .adm-media-thumb-label {
          font-size: 10px;
          letter-spacing: 0.06em;
          color: rgba(0,0,0,0.22);
          position: absolute;
          bottom: 8px;
          right: 8px;
          background: rgba(255,255,255,0.5);
          padding: 2px 6px;
        }
        .adm-media-ctx-badge {
          position: absolute;
          top: 8px;
          left: 8px;
          font-size: 9px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 2px 6px;
        }
        .adm-media-select-btn {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 22px;
          height: 22px;
          border-radius: 2px;
          border: 1.5px solid rgba(255,255,255,0.5);
          background: rgba(26,26,26,0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          opacity: 0;
          transition: opacity 0.15s;
          cursor: pointer;
          backdrop-filter: blur(4px);
        }
        .adm-media-card:hover .adm-media-select-btn,
        .adm-media-selected .adm-media-select-btn {
          opacity: 1;
        }
        .adm-media-selected .adm-media-select-btn {
          background: var(--adm-gold);
          border-color: var(--adm-gold);
        }
        .adm-media-info {
          padding: 10px 12px;
        }
        .adm-media-filename {
          font-size: 12px;
          color: var(--adm-text);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-bottom: 4px;
        }
        .adm-media-meta {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 10px;
          color: var(--adm-muted);
        }
        .adm-media-meta-sep { opacity: 0.4; }
        .adm-media-used {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 10px;
          color: var(--adm-text-secondary);
          margin-top: 4px;
        }
        .adm-media-used-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--adm-gold);
          flex-shrink: 0;
        }

        /* ── List View ── */
        .adm-media-list {
          border: 1px solid var(--adm-border);
          overflow: hidden;
        }
        .adm-list-head {
          display: grid;
          grid-template-columns: 2fr 100px 110px 80px 110px 1fr 80px;
          padding: 10px 16px;
          background: var(--adm-surface-2);
          border-bottom: 1px solid var(--adm-border);
          gap: 12px;
        }
        .adm-list-head > div {
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--adm-muted);
        }
        .adm-list-row {
          display: grid;
          grid-template-columns: 2fr 100px 110px 80px 110px 1fr 80px;
          padding: 12px 16px;
          border-bottom: 1px solid var(--adm-border);
          background: var(--adm-surface);
          gap: 12px;
          align-items: center;
          cursor: pointer;
          transition: background 0.15s;
        }
        .adm-list-row:last-child { border-bottom: none; }
        .adm-list-row:hover { background: var(--adm-surface-2); }
        .adm-list-row-selected { background: var(--adm-gold-dim) !important; }
        .adm-list-col-name {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }
        .adm-list-checkbox {
          width: 18px;
          height: 18px;
          border: 1.5px solid var(--adm-border-light);
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: all 0.15s;
          color: white;
        }
        .adm-list-checkbox-checked { background: var(--adm-gold); border-color: var(--adm-gold); }
        .adm-list-thumb {
          width: 36px;
          height: 44px;
          flex-shrink: 0;
          border-radius: 1px;
        }
        .adm-list-filename {
          font-size: 13px;
          color: var(--adm-text);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .adm-list-col {
          font-size: 12px;
          color: var(--adm-text-secondary);
          white-space: nowrap;
        }
        .adm-list-muted { color: var(--adm-muted); }
        .adm-list-badge {
          font-size: 10px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 2px 7px;
        }
        .adm-list-col-actions {
          display: flex;
          justify-content: flex-end;
        }

        /* ── Detail Panel ── */
        .adm-detail-panel {
          background: var(--adm-surface);
          border: 1px solid var(--adm-border);
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 80px;
          max-height: calc(100vh - 120px);
          overflow-y: auto;
        }
        .adm-detail-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 20px;
          border-bottom: 1px solid var(--adm-border);
          background: var(--adm-surface-2);
          flex-shrink: 0;
        }
        .adm-detail-title {
          font-family: "Playfair Display", Georgia, serif;
          font-size: 16px;
          font-weight: 400;
          color: var(--adm-text);
        }
        .adm-detail-close {
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--adm-muted);
          background: none;
          border: 1px solid var(--adm-border);
          cursor: pointer;
          transition: all 0.15s;
        }
        .adm-detail-close:hover { color: var(--adm-text); border-color: var(--adm-border-light); }
        .adm-detail-preview {
          height: 200px;
          position: relative;
          display: flex;
          align-items: flex-end;
          padding: 10px 14px;
          flex-shrink: 0;
        }
        .adm-detail-preview-label {
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(0,0,0,0.22);
        }
        .adm-detail-preview-dims {
          position: absolute;
          top: 10px;
          right: 10px;
          font-size: 10px;
          color: rgba(0,0,0,0.3);
          background: rgba(255,255,255,0.5);
          padding: 2px 8px;
          letter-spacing: 0.04em;
        }
        .adm-detail-fields {
          padding: 18px 20px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          flex: 1;
        }
        .adm-detail-field { display: flex; flex-direction: column; gap: 5px; }
        .adm-detail-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .adm-detail-label {
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--adm-muted);
        }
        .adm-detail-val { font-size: 12px; color: var(--adm-text-secondary); }
        .adm-detail-mono { font-family: "DM Mono", "Courier New", monospace; font-size: 11px; }
        .adm-detail-url-row { display: flex; align-items: center; gap: 8px; }
        .adm-detail-url {
          flex: 1;
          min-width: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .adm-detail-copy-btn {
          width: 26px;
          height: 26px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--adm-surface-2);
          border: 1px solid var(--adm-border);
          color: var(--adm-muted);
          cursor: pointer;
          flex-shrink: 0;
          transition: all 0.15s;
        }
        .adm-detail-copy-btn:hover { color: var(--adm-text); border-color: var(--adm-border-light); }
        .adm-detail-badge {
          font-size: 10px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 3px 8px;
          display: inline-block;
          align-self: flex-start;
        }
        .adm-detail-input {
          background: var(--adm-surface-2);
          border: 1px solid var(--adm-border-light);
          color: var(--adm-text);
          padding: 8px 10px;
          font-size: 12px;
          font-family: "DM Sans", sans-serif;
          outline: none;
          transition: border-color 0.2s;
          width: 100%;
        }
        .adm-detail-input:focus { border-color: var(--adm-gold); }
        .adm-detail-input::placeholder { color: var(--adm-muted); }
        .adm-detail-usages { display: flex; flex-direction: column; gap: 4px; }
        .adm-detail-usage {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 10px;
          background: var(--adm-surface-2);
          border: 1px solid var(--adm-border);
        }
        .adm-detail-usage-type {
          font-size: 9px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--adm-gold);
          background: var(--adm-gold-dim);
          padding: 1px 5px;
        }
        .adm-detail-usage-name { font-size: 12px; color: var(--adm-text-secondary); }
        .adm-detail-actions {
          display: flex;
          gap: 8px;
          padding: 14px 20px;
          border-top: 1px solid var(--adm-border);
          background: var(--adm-surface-2);
          flex-shrink: 0;
        }

        /* ── Buttons ── */
        .adm-btn-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 9px 16px;
          background: var(--adm-gold);
          color: #111;
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          border: 1px solid var(--adm-gold);
          cursor: pointer;
          font-family: "DM Sans", sans-serif;
          font-weight: 500;
          transition: all 0.2s;
        }
        .adm-btn-primary:hover { background: #d4b87a; border-color: #d4b87a; }
        .adm-btn-saved { background: #4a9a6a !important; border-color: #4a9a6a !important; color: white !important; }
        .adm-btn-ghost {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 9px 14px;
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
        .adm-btn-ghost:hover { border-color: var(--adm-text-secondary); color: var(--adm-text); }
        .adm-btn-icon { padding: 9px !important; }
        .adm-btn-danger-icon:hover { border-color: var(--adm-danger) !important; color: var(--adm-danger) !important; }
        .adm-icon-btn {
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--adm-muted);
          background: none;
          border: none;
          cursor: pointer;
          transition: all 0.15s;
        }
        .adm-icon-btn:hover { color: var(--adm-danger); }

        /* ── Empty ── */
        .adm-empty {
          padding: 80px 40px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          border: 1px solid var(--adm-border);
          background: var(--adm-surface);
        }
        .adm-empty-icon { font-size: 24px; color: var(--adm-gold); opacity: 0.5; margin-bottom: 6px; }
        .adm-empty-title {
          font-family: "Playfair Display", Georgia, serif;
          font-size: 18px;
          font-weight: 400;
          color: var(--adm-text);
        }
        .adm-empty-sub { font-size: 13px; color: var(--adm-muted); }

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
        @keyframes adm-toast-in {
          from { opacity: 0; transform: translateX(-50%) translateY(10px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }

        /* ── Responsive ── */
        @media (max-width: 1100px) {
          .adm-page { padding: 28px 24px 60px; }
          .adm-media-layout-split { grid-template-columns: 1fr; }
          .adm-detail-panel { position: static; max-height: none; }
          .adm-media-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); }
        }
        @media (max-width: 768px) {
          .adm-page-header { flex-direction: column; }
          .adm-toolbar { flex-direction: column; align-items: flex-start; }
          .adm-toolbar-right { width: 100%; justify-content: flex-start; flex-wrap: wrap; }
          .adm-filter-tabs { flex-wrap: nowrap; overflow-x: auto; }
          .adm-list-head,
          .adm-list-row { grid-template-columns: 2fr 80px 80px 60px; }
          .adm-list-head > *:nth-child(n+5),
          .adm-list-row > *:nth-child(n+5) { display: none; }
        }
        @media (max-width: 480px) {
          .adm-media-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </div>
  );
}