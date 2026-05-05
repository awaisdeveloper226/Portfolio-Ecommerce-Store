"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────
type DiscountType = "percentage" | "fixed";
type DiscountStatus = "active" | "scheduled" | "expired" | "disabled";
type AppliesTo = "all" | "specific_products" | "specific_categories";

type Discount = {
  id: string;
  code: string;
  type: DiscountType;
  value: number;
  minOrderValue?: number;
  maxUses?: number;
  usedCount: number;
  isActive: boolean;
  startsAt?: string;
  expiresAt?: string;
  appliesTo: AppliesTo;
  categories?: string[];
  revenue: number;
  createdAt: string;
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const INITIAL_DISCOUNTS: Discount[] = [
  {
    id: "disc_001",
    code: "ELARA10",
    type: "percentage",
    value: 10,
    minOrderValue: 100,
    maxUses: undefined,
    usedCount: 1284,
    isActive: true,
    startsAt: "2025-01-01T00:00:00Z",
    expiresAt: undefined,
    appliesTo: "all",
    revenue: 38420,
    createdAt: "2025-01-01T09:00:00Z",
  },
  {
    id: "disc_002",
    code: "WELCOME20",
    type: "percentage",
    value: 20,
    minOrderValue: 150,
    maxUses: 1000,
    usedCount: 847,
    isActive: true,
    startsAt: "2025-01-01T00:00:00Z",
    expiresAt: "2025-12-31T23:59:59Z",
    appliesTo: "all",
    revenue: 67840,
    createdAt: "2025-01-01T09:00:00Z",
  },
  {
    id: "disc_003",
    code: "LINEN15",
    type: "percentage",
    value: 15,
    minOrderValue: 120,
    maxUses: 500,
    usedCount: 312,
    isActive: true,
    startsAt: "2025-02-01T00:00:00Z",
    expiresAt: "2025-06-30T23:59:59Z",
    appliesTo: "specific_categories",
    categories: ["tops", "trousers"],
    revenue: 18640,
    createdAt: "2025-01-28T10:00:00Z",
  },
  {
    id: "disc_004",
    code: "SUMMER50",
    type: "fixed",
    value: 50,
    minOrderValue: 200,
    maxUses: 200,
    usedCount: 200,
    isActive: false,
    startsAt: "2024-06-01T00:00:00Z",
    expiresAt: "2024-08-31T23:59:59Z",
    appliesTo: "all",
    revenue: 9800,
    createdAt: "2024-05-28T09:00:00Z",
  },
  {
    id: "disc_005",
    code: "PRESS30",
    type: "percentage",
    value: 30,
    minOrderValue: undefined,
    maxUses: 50,
    usedCount: 23,
    isActive: true,
    startsAt: "2025-03-01T00:00:00Z",
    expiresAt: "2025-12-31T23:59:59Z",
    appliesTo: "all",
    revenue: 12060,
    createdAt: "2025-02-25T11:00:00Z",
  },
  {
    id: "disc_006",
    code: "RESORT25",
    type: "percentage",
    value: 25,
    minOrderValue: 180,
    maxUses: 300,
    usedCount: 0,
    isActive: false,
    startsAt: "2025-05-15T00:00:00Z",
    expiresAt: "2025-07-31T23:59:59Z",
    appliesTo: "all",
    revenue: 0,
    createdAt: "2025-04-10T14:00:00Z",
  },
  {
    id: "disc_007",
    code: "LOYALTY100",
    type: "fixed",
    value: 100,
    minOrderValue: 400,
    maxUses: undefined,
    usedCount: 56,
    isActive: true,
    startsAt: "2025-01-01T00:00:00Z",
    expiresAt: undefined,
    appliesTo: "all",
    revenue: 22400,
    createdAt: "2025-01-01T09:00:00Z",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getStatus(d: Discount): DiscountStatus {
  const now = new Date();
  if (!d.isActive) {
    if (d.startsAt && new Date(d.startsAt) > now) return "scheduled";
    return d.expiresAt && new Date(d.expiresAt) < now ? "expired" : "disabled";
  }
  if (d.startsAt && new Date(d.startsAt) > now) return "scheduled";
  if (d.expiresAt && new Date(d.expiresAt) < now) return "expired";
  return "active";
}

const STATUS_CONFIG: Record<DiscountStatus, { label: string; color: string; bg: string; dot: string }> = {
  active:    { label: "Active",    color: "#4ade80", bg: "rgba(74,222,128,0.1)",  dot: "#4ade80" },
  scheduled: { label: "Scheduled", color: "#f59e0b", bg: "rgba(245,158,11,0.1)",  dot: "#f59e0b" },
  expired:   { label: "Expired",   color: "#64748b", bg: "rgba(100,116,139,0.1)", dot: "#64748b" },
  disabled:  { label: "Disabled",  color: "#94a3b8", bg: "rgba(148,163,184,0.1)", dot: "#94a3b8" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function formatValue(d: Discount) {
  return d.type === "percentage" ? `${d.value}%` : `$${d.value}`;
}

function formatRevenue(n: number) {
  return n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n}`;
}

function usagePct(d: Discount) {
  if (!d.maxUses) return null;
  return Math.round((d.usedCount / d.maxUses) * 100);
}

// ─── Discount Form Modal ──────────────────────────────────────────────────────
function DiscountModal({
  initial,
  onClose,
  onSave,
}: {
  initial?: Discount | null;
  onClose: () => void;
  onSave: (d: Discount) => void;
}) {
  const isEdit = !!initial;
  const [form, setForm] = useState({
    code: initial?.code ?? "",
    type: initial?.type ?? ("percentage" as DiscountType),
    value: initial?.value ?? 10,
    minOrderValue: initial?.minOrderValue ?? "",
    maxUses: initial?.maxUses ?? "",
    isActive: initial?.isActive ?? true,
    startsAt: initial?.startsAt ? initial.startsAt.slice(0, 10) : "",
    expiresAt: initial?.expiresAt ? initial.expiresAt.slice(0, 10) : "",
    appliesTo: initial?.appliesTo ?? ("all" as AppliesTo),
  });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const set = <K extends keyof typeof form>(k: K, v: typeof form[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleSave = () => {
    if (!form.code.trim()) { setError("Discount code is required."); return; }
    if (!form.value || Number(form.value) <= 0) { setError("Value must be greater than 0."); return; }
    if (form.type === "percentage" && Number(form.value) > 100) { setError("Percentage cannot exceed 100%."); return; }

    const result: Discount = {
      id: initial?.id ?? `disc_${Date.now()}`,
      code: form.code.toUpperCase().trim(),
      type: form.type,
      value: Number(form.value),
      minOrderValue: form.minOrderValue !== "" ? Number(form.minOrderValue) : undefined,
      maxUses: form.maxUses !== "" ? Number(form.maxUses) : undefined,
      usedCount: initial?.usedCount ?? 0,
      isActive: form.isActive,
      startsAt: form.startsAt ? new Date(form.startsAt).toISOString() : undefined,
      expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : undefined,
      appliesTo: form.appliesTo,
      revenue: initial?.revenue ?? 0,
      createdAt: initial?.createdAt ?? new Date().toISOString(),
    };

    onSave(result);
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 800);
  };

  return (
    <div className="adm-modal-backdrop" onClick={onClose}>
      <div className="adm-modal adm-modal-lg" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="adm-modal-header">
          <div>
            <p className="adm-modal-eyebrow">{isEdit ? "Edit Discount" : "New Discount"}</p>
            <h2 className="adm-modal-title">{isEdit ? initial!.code : "Create Discount Code"}</h2>
          </div>
          <button className="adm-modal-close" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="adm-modal-body">
          {error && (
            <div className="adm-error-banner">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          {/* Code */}
          <div className="adm-form-row">
            <div className="adm-field">
              <label className="adm-label">Discount Code <span className="adm-required">*</span></label>
              <input
                className="adm-input adm-input-mono adm-input-upper"
                placeholder="e.g. SUMMER20"
                value={form.code}
                onChange={(e) => { set("code", e.target.value.toUpperCase()); setError(""); }}
              />
              <p className="adm-field-hint">Customers enter this at checkout. Must be unique.</p>
            </div>
            <div className="adm-field">
              <label className="adm-label">Status</label>
              <label className="adm-toggle-label" style={{ paddingTop: 10 }}>
                <input
                  type="checkbox"
                  className="adm-toggle-input"
                  checked={form.isActive}
                  onChange={(e) => set("isActive", e.target.checked)}
                />
                <span className="adm-toggle-track" />
                <span className="adm-toggle-text">{form.isActive ? "Active" : "Disabled"}</span>
              </label>
            </div>
          </div>

          {/* Type + Value */}
          <div className="adm-field">
            <label className="adm-label">Discount Type <span className="adm-required">*</span></label>
            <div className="adm-type-grid">
              {(["percentage", "fixed"] as DiscountType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`adm-type-btn ${form.type === t ? "adm-type-active" : ""}`}
                  onClick={() => { set("type", t); setError(""); }}
                >
                  <span className="adm-type-icon">{t === "percentage" ? "%" : "$"}</span>
                  <span className="adm-type-label">{t === "percentage" ? "Percentage Off" : "Fixed Amount Off"}</span>
                  <span className="adm-type-desc">
                    {t === "percentage" ? "e.g. 10% off total" : "e.g. $50 off total"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="adm-form-row">
            <div className="adm-field">
              <label className="adm-label">
                {form.type === "percentage" ? "Percentage Off" : "Fixed Amount ($)"} <span className="adm-required">*</span>
              </label>
              <div className="adm-value-input-wrap">
                <span className="adm-value-prefix">
                  {form.type === "percentage" ? "%" : "$"}
                </span>
                <input
                  type="number"
                  className="adm-input adm-input-prefixed"
                  value={form.value}
                  onChange={(e) => { set("value", Number(e.target.value)); setError(""); }}
                  min={1}
                  max={form.type === "percentage" ? 100 : undefined}
                />
              </div>
            </div>
            <div className="adm-field">
              <label className="adm-label">Minimum Order Value ($) <span className="adm-optional">(optional)</span></label>
              <input
                type="number"
                className="adm-input"
                placeholder="No minimum"
                value={form.minOrderValue}
                onChange={(e) => set("minOrderValue", e.target.value)}
                min={0}
              />
            </div>
          </div>

          {/* Usage limit + dates */}
          <div className="adm-form-row">
            <div className="adm-field">
              <label className="adm-label">Usage Limit <span className="adm-optional">(optional)</span></label>
              <input
                type="number"
                className="adm-input"
                placeholder="Unlimited"
                value={form.maxUses}
                onChange={(e) => set("maxUses", e.target.value)}
                min={1}
              />
              <p className="adm-field-hint">Leave blank for unlimited uses.</p>
            </div>
            <div className="adm-field">
              <label className="adm-label">Applies To</label>
              <div className="adm-select-wrap">
                <select
                  className="adm-input adm-select"
                  value={form.appliesTo}
                  onChange={(e) => set("appliesTo", e.target.value as AppliesTo)}
                >
                  <option value="all">All Products</option>
                  <option value="specific_categories">Specific Categories</option>
                  <option value="specific_products">Specific Products</option>
                </select>
                <svg className="adm-select-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            </div>
          </div>

          <div className="adm-form-row">
            <div className="adm-field">
              <label className="adm-label">Start Date <span className="adm-optional">(optional)</span></label>
              <input
                type="date"
                className="adm-input adm-input-date"
                value={form.startsAt}
                onChange={(e) => set("startsAt", e.target.value)}
              />
            </div>
            <div className="adm-field">
              <label className="adm-label">Expiry Date <span className="adm-optional">(optional)</span></label>
              <input
                type="date"
                className="adm-input adm-input-date"
                value={form.expiresAt}
                onChange={(e) => set("expiresAt", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
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
                {isEdit ? "Saved" : "Created"}
              </>
            ) : (
              isEdit ? "Save Changes" : "Create Discount"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Delete Modal ─────────────────────────────────────────────────────────────
function DeleteModal({
  discount,
  onClose,
  onConfirm,
}: {
  discount: Discount;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="adm-modal-backdrop" onClick={onClose}>
      <div className="adm-modal adm-modal-sm" onClick={(e) => e.stopPropagation()}>
        <div className="adm-modal-header">
          <h2 className="adm-modal-title" style={{ color: "#f87171" }}>Delete Discount</h2>
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
                Deleting <strong>{discount.code}</strong> will permanently remove this discount code. Customers currently using it during checkout may encounter an error.
              </p>
            </div>
          </div>
        </div>
        <div className="adm-modal-footer">
          <button className="adm-btn-ghost" onClick={onClose}>Cancel</button>
          <button className="adm-btn-danger" onClick={onConfirm}>Delete Code</button>
        </div>
      </div>
    </div>
  );
}

// ─── Discount Row ─────────────────────────────────────────────────────────────
function DiscountRow({
  discount,
  onEdit,
  onDelete,
  onToggle,
}: {
  discount: Discount;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
}) {
  const status = getStatus(discount);
  const sc = STATUS_CONFIG[status];
  const pct = usagePct(discount);

  return (
    <tr className="adm-tr">
      {/* Code */}
      <td className="adm-td adm-td-main">
        <div className="adm-code-cell">
          <div className="adm-code-badge">
            <span className="adm-code-text">{discount.code}</span>
          </div>
          <div className="adm-code-meta">
            <span className="adm-code-type">
              {discount.type === "percentage" ? "%" : "$"} ·{" "}
              {discount.appliesTo === "all" ? "All products" : discount.appliesTo === "specific_categories" ? "Categories" : "Products"}
            </span>
            <span className="adm-code-created">{formatDate(discount.createdAt)}</span>
          </div>
        </div>
      </td>

      {/* Value */}
      <td className="adm-td">
        <div className="adm-value-cell">
          <span className="adm-value-num" style={{ color: discount.type === "percentage" ? "#c9a96e" : "#60a5fa" }}>
            {formatValue(discount)}
          </span>
          {discount.minOrderValue && (
            <span className="adm-value-min">min ${discount.minOrderValue}</span>
          )}
        </div>
      </td>

      {/* Status */}
      <td className="adm-td">
        <span className="adm-status-pill" style={{ color: sc.color, background: sc.bg }}>
          <span className="adm-status-dot" style={{ background: sc.dot }} />
          {sc.label}
        </span>
      </td>

      {/* Usage */}
      <td className="adm-td">
        <div className="adm-usage-cell">
          <div className="adm-usage-nums">
            <span className="adm-usage-used">{discount.usedCount.toLocaleString()}</span>
            {discount.maxUses && (
              <span className="adm-usage-max"> / {discount.maxUses.toLocaleString()}</span>
            )}
            {!discount.maxUses && <span className="adm-usage-max"> uses</span>}
          </div>
          {pct !== null && (
            <div className="adm-usage-bar">
              <div
                className="adm-usage-fill"
                style={{
                  width: `${Math.min(pct, 100)}%`,
                  background: pct >= 90 ? "#f87171" : pct >= 70 ? "#f59e0b" : "#4ade80",
                }}
              />
            </div>
          )}
        </div>
      </td>

      {/* Revenue */}
      <td className="adm-td">
        <span className="adm-revenue">{formatRevenue(discount.revenue)}</span>
      </td>

      {/* Dates */}
      <td className="adm-td adm-td-muted">
        <div className="adm-dates-cell">
          {discount.startsAt && <span>{formatDate(discount.startsAt)}</span>}
          {discount.expiresAt ? (
            <span className={new Date(discount.expiresAt) < new Date() ? "adm-date-expired" : ""}>
              → {formatDate(discount.expiresAt)}
            </span>
          ) : (
            <span className="adm-date-no-expiry">No expiry</span>
          )}
        </div>
      </td>

      {/* Actions */}
      <td className="adm-td adm-td-actions">
        <div className="adm-row-actions">
          <button
            className={`adm-toggle-pill ${discount.isActive ? "adm-toggle-pill-on" : ""}`}
            onClick={onToggle}
            title={discount.isActive ? "Disable" : "Enable"}
          >
            {discount.isActive ? "On" : "Off"}
          </button>
          <button className="adm-icon-btn adm-action-edit" onClick={onEdit} title="Edit">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button className="adm-icon-btn adm-action-delete" onClick={onDelete} title="Delete">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminDiscountsPage() {
  const [discounts, setDiscounts] = useState<Discount[]>(INITIAL_DISCOUNTS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | DiscountStatus>("all");
  const [typeFilter, setTypeFilter] = useState<"all" | DiscountType>("all");
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Discount | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Discount | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = (d: Discount) => {
    setDiscounts((prev) => {
      const exists = prev.find((x) => x.id === d.id);
      if (exists) {
        showToast(`"${d.code}" updated`);
        return prev.map((x) => (x.id === d.id ? d : x));
      }
      showToast(`"${d.code}" created`);
      return [d, ...prev];
    });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setDiscounts((prev) => prev.filter((d) => d.id !== deleteTarget.id));
    showToast(`"${deleteTarget.code}" deleted`, "error");
    setDeleteTarget(null);
  };

  const toggleDiscount = (id: string) => {
    setDiscounts((prev) =>
      prev.map((d) => d.id === id ? { ...d, isActive: !d.isActive } : d)
    );
  };

  // Filter
  const filtered = useMemo(() => {
    return discounts.filter((d) => {
      const q = search.toLowerCase();
      if (q && !d.code.toLowerCase().includes(q)) return false;
      if (typeFilter !== "all" && d.type !== typeFilter) return false;
      if (statusFilter !== "all" && getStatus(d) !== statusFilter) return false;
      return true;
    });
  }, [discounts, search, statusFilter, typeFilter]);

  // Stats
  const totalActive = discounts.filter((d) => getStatus(d) === "active").length;
  const totalRevenue = discounts.reduce((s, d) => s + d.revenue, 0);
  const totalUses = discounts.reduce((s, d) => s + d.usedCount, 0);

  const statusCounts: Record<string, number> = { all: discounts.length };
  discounts.forEach((d) => {
    const s = getStatus(d);
    statusCounts[s] = (statusCounts[s] ?? 0) + 1;
  });

  return (
    <div className="adm-page">

      {/* ── Header ── */}
      <div className="adm-page-header">
        <div>
          <div className="adm-breadcrumb">
            <Link href="/admin">Dashboard</Link>
            <span className="adm-bc-sep">›</span>
            <span>Discounts</span>
          </div>
          <h1 className="adm-page-title">Discounts</h1>
          <p className="adm-page-sub">Manage promo codes, coupons, and discount rules.</p>
        </div>
        <button
          className="adm-btn-primary"
          onClick={() => { setEditTarget(null); setShowModal(true); }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Discount
        </button>
      </div>

      {/* ── Stats ── */}
      <div className="adm-stats-row">
        {[
          { label: "Total Codes",     value: discounts.length,          icon: "◈", accent: "#c9a96e" },
          { label: "Active",          value: totalActive,               icon: "○", accent: "#4ade80" },
          { label: "Total Uses",      value: totalUses.toLocaleString(),icon: "△", accent: "#60a5fa" },
          { label: "Revenue Driven",  value: `$${(totalRevenue/1000).toFixed(1)}k`, icon: "$", accent: "#a78bfa" },
        ].map((s) => (
          <div key={s.label} className="adm-stat-card">
            <div className="adm-stat-icon" style={{ color: s.accent, background: `${s.accent}18` }}>
              {s.icon}
            </div>
            <div className="adm-stat-body">
              <div className="adm-stat-value">{s.value}</div>
              <div className="adm-stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div className="adm-toolbar">
        <div className="adm-toolbar-left">
          {/* Search */}
          <div className="adm-search-wrap">
            <svg className="adm-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              className="adm-search"
              placeholder="Search codes…"
              value={search}
              onChange={(e) => setSearch(e.target.value.toUpperCase())}
            />
            {search && (
              <button className="adm-search-clear" onClick={() => setSearch("")}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Status filter */}
          <div className="adm-filter-pills">
            {(["all", "active", "scheduled", "expired", "disabled"] as const).map((f) => (
              <button
                key={f}
                className={`adm-filter-pill ${statusFilter === f ? "adm-filter-pill-active" : ""}`}
                onClick={() => setStatusFilter(f)}
              >
                {f !== "all" && (
                  <span className="adm-filter-dot" style={{ background: STATUS_CONFIG[f].dot }} />
                )}
                {f === "all" ? `All (${discounts.length})` : `${STATUS_CONFIG[f].label} (${statusCounts[f] ?? 0})`}
              </button>
            ))}
          </div>

          {/* Type filter */}
          <div className="adm-type-pills">
            {(["all", "percentage", "fixed"] as const).map((t) => (
              <button
                key={t}
                className={`adm-type-filter ${typeFilter === t ? "adm-type-filter-active" : ""}`}
                onClick={() => setTypeFilter(t)}
              >
                {t === "all" ? "All Types" : t === "percentage" ? "% Off" : "$ Off"}
              </button>
            ))}
          </div>
        </div>

        <div className="adm-toolbar-right">
          <span className="adm-result-count">{filtered.length} code{filtered.length !== 1 ? "s" : ""}</span>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="adm-table-wrap">
        {filtered.length === 0 ? (
          <div className="adm-empty">
            <div className="adm-empty-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.9">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                <line x1="7" y1="7" x2="7.01" y2="7" />
              </svg>
            </div>
            <p className="adm-empty-title">No discount codes found</p>
            <p className="adm-empty-sub">
              {search ? `No results for "${search}"` : "Create your first discount code to get started."}
            </p>
            {!search && (
              <button
                className="adm-btn-primary"
                onClick={() => { setEditTarget(null); setShowModal(true); }}
              >
                New Discount
              </button>
            )}
          </div>
        ) : (
          <table className="adm-table">
            <thead>
              <tr className="adm-thead-tr">
                <th className="adm-th adm-th-main">Code</th>
                <th className="adm-th">Discount</th>
                <th className="adm-th">Status</th>
                <th className="adm-th">Usage</th>
                <th className="adm-th">Revenue</th>
                <th className="adm-th">Validity</th>
                <th className="adm-th adm-th-actions"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <DiscountRow
                  key={d.id}
                  discount={d}
                  onEdit={() => { setEditTarget(d); setShowModal(true); }}
                  onDelete={() => setDeleteTarget(d)}
                  onToggle={() => toggleDiscount(d.id)}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Summary Banner ── */}
      {discounts.length > 0 && (
        <div className="adm-summary-bar">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
            <line x1="7" y1="7" x2="7.01" y2="7"/>
          </svg>
          <span>
            {totalActive} active code{totalActive !== 1 ? "s" : ""} ·{" "}
            {totalUses.toLocaleString()} total redemptions ·{" "}
            <strong style={{ color: "rgba(255,255,255,0.8)" }}>{formatRevenue(totalRevenue)}</strong> revenue attributed to discounts
          </span>
        </div>
      )}

      {/* ── Modals ── */}
      {showModal && (
        <DiscountModal
          initial={editTarget}
          onClose={() => { setShowModal(false); setEditTarget(null); }}
          onSave={(d) => { handleSave(d); setShowModal(false); setEditTarget(null); }}
        />
      )}

      {deleteTarget && (
        <DeleteModal
          discount={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}

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
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* ── Header ── */
        .adm-page-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
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
        .adm-breadcrumb a { color: rgba(255,255,255,0.45); transition: color 0.2s; text-decoration: none; }
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

        /* ── Buttons ── */
        .adm-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 18px;
          background: #c9a96e;
          color: #0f0f0f;
          font-size: 12px;
          letter-spacing: 0.06em;
          font-family: inherit;
          font-weight: 500;
          cursor: pointer;
          border: none;
          transition: background 0.18s;
          white-space: nowrap;
        }
        .adm-btn-primary:hover { background: #d4b87e; }
        .adm-btn-saved { background: #4ade80 !important; color: #0f0f0f !important; }
        .adm-btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 18px;
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.65);
          border: 1px solid rgba(255,255,255,0.1);
          font-size: 12px;
          letter-spacing: 0.06em;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.18s;
        }
        .adm-btn-ghost:hover { background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.9); }
        .adm-btn-danger {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 18px;
          background: rgba(239,68,68,0.15);
          color: #f87171;
          border: 1px solid rgba(239,68,68,0.2);
          font-size: 12px;
          letter-spacing: 0.06em;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.18s;
        }
        .adm-btn-danger:hover { background: rgba(239,68,68,0.25); }

        /* ── Stats ── */
        .adm-stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }
        .adm-stat-card {
          background: #171717;
          border: 1px solid rgba(255,255,255,0.07);
          padding: 16px 18px;
          display: flex;
          align-items: center;
          gap: 14px;
          transition: border-color 0.2s;
        }
        .adm-stat-card:hover { border-color: rgba(255,255,255,0.13); }
        .adm-stat-icon {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          font-size: 14px;
          flex-shrink: 0;
          font-style: normal;
        }
        .adm-stat-value {
          font-size: 22px;
          font-weight: 500;
          color: rgba(255,255,255,0.92);
          line-height: 1;
          margin-bottom: 3px;
          font-family: "Playfair Display", serif;
        }
        .adm-stat-label {
          font-size: 11px;
          color: rgba(255,255,255,0.38);
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        /* ── Toolbar ── */
        .adm-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }
        .adm-toolbar-left { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .adm-search-wrap { position: relative; display: flex; align-items: center; }
        .adm-search-icon { position: absolute; left: 12px; color: rgba(255,255,255,0.3); pointer-events: none; }
        .adm-search {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.88);
          padding: 9px 36px 9px 34px;
          font-size: 13px;
          font-family: "DM Mono", monospace;
          font-weight: 500;
          letter-spacing: 0.06em;
          outline: none;
          width: 200px;
          transition: border-color 0.2s;
        }
        .adm-search:focus { border-color: rgba(255,255,255,0.25); background: rgba(255,255,255,0.07); }
        .adm-search::placeholder { color: rgba(255,255,255,0.25); font-family: "DM Sans", sans-serif; font-weight: 400; letter-spacing: 0; }
        .adm-search-clear {
          position: absolute; right: 10px;
          color: rgba(255,255,255,0.3); display: flex;
          align-items: center; background: none;
          border: none; cursor: pointer; padding: 2px;
          transition: color 0.2s;
        }
        .adm-search-clear:hover { color: rgba(255,255,255,0.7); }

        .adm-filter-pills { display: flex; gap: 4px; flex-wrap: wrap; }
        .adm-filter-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 11px;
          font-size: 11px;
          letter-spacing: 0.05em;
          color: rgba(255,255,255,0.45);
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          cursor: pointer;
          font-family: inherit;
          transition: all 0.15s;
          white-space: nowrap;
        }
        .adm-filter-pill:hover { color: rgba(255,255,255,0.75); border-color: rgba(255,255,255,0.15); }
        .adm-filter-pill-active { color: rgba(255,255,255,0.92) !important; background: rgba(255,255,255,0.1) !important; border-color: rgba(255,255,255,0.2) !important; }
        .adm-filter-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }

        .adm-type-pills { display: flex; border: 1px solid rgba(255,255,255,0.08); overflow: hidden; }
        .adm-type-filter {
          padding: 6px 12px;
          font-size: 11px;
          letter-spacing: 0.04em;
          color: rgba(255,255,255,0.38);
          background: rgba(255,255,255,0.03);
          border-right: 1px solid rgba(255,255,255,0.08);
          cursor: pointer;
          font-family: inherit;
          transition: all 0.15s;
          white-space: nowrap;
        }
        .adm-type-filter:last-child { border-right: none; }
        .adm-type-filter:hover { color: rgba(255,255,255,0.7); background: rgba(255,255,255,0.07); }
        .adm-type-filter-active { color: #c9a96e !important; background: rgba(201,169,110,0.1) !important; }

        .adm-result-count { font-size: 12px; color: rgba(255,255,255,0.3); white-space: nowrap; }
        .adm-toolbar-right { flex-shrink: 0; }

        /* ── Table ── */
        .adm-table-wrap {
          background: #141414;
          border: 1px solid rgba(255,255,255,0.07);
          overflow-x: auto;
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
          user-select: none;
        }
        .adm-th-main { min-width: 200px; }
        .adm-th-actions { width: 140px; }

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
        .adm-td-muted { color: rgba(255,255,255,0.38); font-size: 12px; }
        .adm-td-actions { text-align: right; }

        /* Code cell */
        .adm-code-cell { display: flex; flex-direction: column; gap: 4px; }
        .adm-code-badge {
          display: inline-flex;
          align-items: center;
          background: rgba(201,169,110,0.1);
          border: 1px solid rgba(201,169,110,0.2);
          padding: 4px 10px;
          width: fit-content;
        }
        .adm-code-text {
          font-family: "DM Mono", "Courier New", monospace;
          font-size: 13px;
          font-weight: 600;
          color: #c9a96e;
          letter-spacing: 0.08em;
        }
        .adm-code-meta { display: flex; gap: 8px; align-items: center; }
        .adm-code-type { font-size: 11px; color: rgba(255,255,255,0.3); }
        .adm-code-created { font-size: 11px; color: rgba(255,255,255,0.2); }

        /* Value cell */
        .adm-value-cell { display: flex; flex-direction: column; gap: 3px; }
        .adm-value-num { font-size: 18px; font-family: "Playfair Display", serif; font-weight: 400; }
        .adm-value-min { font-size: 11px; color: rgba(255,255,255,0.3); }

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

        /* Usage cell */
        .adm-usage-cell { display: flex; flex-direction: column; gap: 5px; }
        .adm-usage-nums { display: flex; align-items: baseline; }
        .adm-usage-used { font-size: 14px; color: rgba(255,255,255,0.8); font-weight: 500; }
        .adm-usage-max { font-size: 12px; color: rgba(255,255,255,0.3); }
        .adm-usage-bar {
          height: 3px;
          background: rgba(255,255,255,0.07);
          width: 80px;
        }
        .adm-usage-fill { height: 100%; transition: width 0.5s ease; }

        /* Revenue */
        .adm-revenue {
          font-size: 14px;
          font-weight: 500;
          color: rgba(255,255,255,0.85);
        }

        /* Dates */
        .adm-dates-cell { display: flex; flex-direction: column; gap: 2px; }
        .adm-date-expired { color: #f87171; }
        .adm-date-no-expiry { color: rgba(255,255,255,0.2); font-style: italic; }

        /* Row actions */
        .adm-row-actions { display: flex; align-items: center; gap: 6px; justify-content: flex-end; }
        .adm-toggle-pill {
          padding: 4px 10px;
          font-size: 11px;
          letter-spacing: 0.08em;
          font-family: inherit;
          cursor: pointer;
          border: 1px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.4);
          transition: all 0.18s;
        }
        .adm-toggle-pill:hover { border-color: rgba(255,255,255,0.3); color: rgba(255,255,255,0.7); }
        .adm-toggle-pill-on {
          border-color: rgba(74,222,128,0.3) !important;
          background: rgba(74,222,128,0.08) !important;
          color: #4ade80 !important;
        }
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
        }
        .adm-icon-btn:hover { color: rgba(255,255,255,0.8); background: rgba(255,255,255,0.07); }
        .adm-action-edit:hover { color: #c9a96e; }
        .adm-action-delete:hover { color: #f87171; }

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

        /* ── Summary bar ── */
        .adm-summary-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: rgba(255,255,255,0.35);
          padding: 12px 16px;
          background: rgba(201,169,110,0.06);
          border: 1px solid rgba(201,169,110,0.15);
        }
        .adm-summary-bar svg { color: #c9a96e; flex-shrink: 0; }

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
          max-width: 540px;
          max-height: 90vh;
          overflow-y: auto;
          animation: adm-slide 0.25s ease;
        }
        .adm-modal-lg { max-width: 600px; }
        .adm-modal-sm { max-width: 440px; }
        @keyframes adm-slide {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .adm-modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 22px 26px 18px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.02);
        }
        .adm-modal-eyebrow {
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #c9a96e;
          margin-bottom: 5px;
        }
        .adm-modal-title {
          font-family: "Playfair Display", Georgia, serif;
          font-size: 20px;
          font-weight: 400;
          color: rgba(255,255,255,0.92);
        }
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
        .adm-modal-body {
          padding: 22px 26px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .adm-modal-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
          padding: 16px 26px 20px;
          border-top: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.02);
        }

        /* Form */
        .adm-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .adm-field { display: flex; flex-direction: column; gap: 6px; }
        .adm-label {
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.38);
        }
        .adm-required { color: #c9a96e; }
        .adm-optional { color: rgba(255,255,255,0.2); font-size: 10px; text-transform: none; letter-spacing: 0; }
        .adm-field-hint { font-size: 11px; color: rgba(255,255,255,0.22); margin-top: 2px; }
        .adm-input {
          padding: 9px 12px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.88);
          font-size: 13px;
          font-family: "DM Sans", sans-serif;
          outline: none;
          transition: border-color 0.2s;
          width: 100%;
        }
        .adm-input:focus { border-color: rgba(255,255,255,0.25); }
        .adm-input::placeholder { color: rgba(255,255,255,0.2); }
        .adm-input-mono { font-family: "DM Mono", monospace; font-size: 13px; letter-spacing: 0.06em; font-weight: 600; }
        .adm-input-upper { text-transform: uppercase; }
        .adm-input-date { color-scheme: dark; }

        /* Value input with prefix */
        .adm-value-input-wrap { position: relative; }
        .adm-value-prefix {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 14px;
          font-weight: 600;
          color: #c9a96e;
          pointer-events: none;
        }
        .adm-input-prefixed { padding-left: 28px; }

        /* Type selector */
        .adm-type-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .adm-type-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 14px 10px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.45);
          cursor: pointer;
          font-family: inherit;
          transition: all 0.15s;
        }
        .adm-type-btn:hover { border-color: rgba(255,255,255,0.2); color: rgba(255,255,255,0.75); }
        .adm-type-active { border-color: #c9a96e !important; background: rgba(201,169,110,0.08) !important; color: #c9a96e !important; }
        .adm-type-icon { font-size: 20px; font-weight: 700; line-height: 1; }
        .adm-type-label { font-size: 12px; letter-spacing: 0.04em; font-weight: 500; }
        .adm-type-desc { font-size: 10px; color: rgba(255,255,255,0.28); }
        .adm-type-active .adm-type-desc { color: rgba(201,169,110,0.5); }

        /* Select */
        .adm-select-wrap { position: relative; }
        .adm-select { appearance: none; padding-right: 32px; cursor: pointer; }
        .adm-select-chevron {
          position: absolute;
          right: 10px; top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: rgba(255,255,255,0.3);
        }

        /* Toggle */
        .adm-toggle-label { display: flex; align-items: center; gap: 10px; cursor: pointer; }
        .adm-toggle-input { display: none; }
        .adm-toggle-track {
          width: 38px; height: 20px;
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
          position: relative;
          transition: background 0.2s;
          flex-shrink: 0;
        }
        .adm-toggle-track::after {
          content: "";
          position: absolute;
          width: 14px; height: 14px;
          background: rgba(255,255,255,0.5);
          border-radius: 50%;
          top: 3px; left: 3px;
          transition: transform 0.2s;
        }
        .adm-toggle-input:checked + .adm-toggle-track { background: #4ade80; }
        .adm-toggle-input:checked + .adm-toggle-track::after { transform: translateX(18px); background: white; }
        .adm-toggle-text { font-size: 13px; color: rgba(255,255,255,0.5); }

        /* Error banner */
        .adm-error-banner {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.2);
          color: #f87171;
          font-size: 13px;
        }

        /* Delete warning */
        .adm-delete-warning {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 16px;
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.2);
        }
        .adm-delete-warning svg { color: #f87171; flex-shrink: 0; margin-top: 2px; }
        .adm-delete-warning-title { font-size: 14px; color: #f87171; font-weight: 500; margin-bottom: 4px; }
        .adm-delete-warning-body { font-size: 13px; color: rgba(255,255,255,0.5); line-height: 1.5; }
        .adm-delete-warning-body strong { color: rgba(255,255,255,0.8); }

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
          .adm-page-header { flex-direction: column; }
          .adm-toolbar { flex-direction: column; align-items: flex-start; }
          .adm-form-row { grid-template-columns: 1fr; }
          .adm-type-grid { grid-template-columns: 1fr; }
          .adm-modal-footer { flex-direction: column; align-items: stretch; }
          .adm-modal-footer .adm-btn-primary,
          .adm-modal-footer .adm-btn-ghost { justify-content: center; }
        }
      `}</style>
    </div>
  );
}