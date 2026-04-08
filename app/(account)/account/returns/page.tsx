"use client";

import { useState } from "react";
import Link from "next/link";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ─── Types ────────────────────────────────────────────────────────────────────
type ReturnStatus = "Processing" | "Received" | "Refunded" | "Rejected";

type ReturnItem = {
  name: string;
  size: string;
  color: string;
  reason: string;
  refundAmount: number;
  image: string;
};

type Return = {
  id: string;
  orderId: string;
  requestedDate: string;
  status: ReturnStatus;
  items: ReturnItem[];
  timeline: { label: string; date: string; done: boolean; current: boolean }[];
  refundMethod: string;
  totalRefund: number;
};

type EligibleItem = {
  orderId: string;
  orderDate: string;
  id: number;
  name: string;
  category: string;
  size: string;
  color: string;
  colorLabel: string;
  price: number;
  image: string;
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const EXISTING_RETURNS: Return[] = [
  {
    id: "RT-00412",
    orderId: "ME-004690",
    requestedDate: "4 Mar 2025",
    status: "Processing",
    items: [
      {
        name: "Wrap Blazer",
        size: "M",
        color: "#d5d0c0",
        reason: "Sizing issue",
        refundAmount: 410,
        image: "#d5d0c0",
      },
    ],
    timeline: [
      { label: "Return requested", date: "4 Mar", done: true, current: false },
      { label: "Label generated", date: "4 Mar", done: true, current: false },
      { label: "Item received by warehouse", date: "", done: false, current: true },
      { label: "Refund issued", date: "", done: false, current: false },
    ],
    refundMethod: "Original payment method",
    totalRefund: 410,
  },
];

// Delivered orders eligible for return (within 30 days)
const ELIGIBLE_ITEMS: EligibleItem[] = [
  {
    orderId: "ME-004821",
    orderDate: "28 Mar 2025",
    id: 1,
    name: "Silk Slip Dress",
    category: "Dresses",
    size: "S",
    color: "#e8d5c0",
    colorLabel: "Sand",
    price: 285,
    image: "#e8d5c0",
  },
  {
    orderId: "ME-004821",
    orderDate: "28 Mar 2025",
    id: 2,
    name: "Linen Wide Trousers",
    category: "Trousers",
    size: "M",
    color: "#c8d5c0",
    colorLabel: "Sage",
    price: 195,
    image: "#c8d5c0",
  },
  {
    orderId: "ME-004756",
    orderDate: "12 Mar 2025",
    id: 3,
    name: "Cashmere Turtleneck",
    category: "Knitwear",
    size: "M",
    color: "#d0c8d5",
    colorLabel: "Lavender",
    price: 320,
    image: "#d0c8d5",
  },
];

const RETURN_REASONS = [
  "Sizing issue — too large",
  "Sizing issue — too small",
  "Not as described",
  "Changed my mind",
  "Received wrong item",
  "Item arrived damaged",
  "Quality not as expected",
  "Other",
];

const STATUS_CONFIG: Record<ReturnStatus, { color: string; bg: string; label: string }> = {
  Processing: { color: "#b87333", bg: "#fff9f4", label: "Processing" },
  Received:   { color: "#3a6a9a", bg: "#f0f4fa", label: "Received" },
  Refunded:   { color: "#2a7a4a", bg: "#f0faf4", label: "Refunded" },
  Rejected:   { color: "#c0392b", bg: "#fff5f5", label: "Rejected" },
};

// ─── Return Timeline ──────────────────────────────────────────────────────────
function ReturnTimeline({ steps }: { steps: Return["timeline"] }) {
  return (
    <div className="ret-timeline">
      {steps.map((step, i) => (
        <div
          key={i}
          className={`ret-tl-step ${step.done ? "ret-tl-done" : ""} ${step.current ? "ret-tl-current" : ""}`}
        >
          <div className="ret-tl-track">
            <div className="ret-tl-dot">
              {(step.done || step.current) && (
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              )}
            </div>
            {i < steps.length - 1 && (
              <div className={`ret-tl-line ${step.done ? "ret-tl-line-done" : ""}`} />
            )}
          </div>
          <div className="ret-tl-content">
            <p className="ret-tl-label">{step.label}</p>
            {step.date && <p className="ret-tl-date">{step.date}</p>}
            {!step.date && !step.done && <p className="ret-tl-pending">Pending</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Existing Return Card ─────────────────────────────────────────────────────
function ReturnCard({ ret }: { ret: Return }) {
  const [expanded, setExpanded] = useState(true);
  const status = STATUS_CONFIG[ret.status];

  return (
    <div className="ret-card">
      {/* Header */}
      <div className="ret-card-header" onClick={() => setExpanded(!expanded)}>
        <div className="ret-card-header-left">
          <div>
            <div className="ret-card-id-row">
              <span className="ret-card-id">Return {ret.id}</span>
              <span
                className="ret-status-badge"
                style={{ color: status.color, background: status.bg, borderColor: status.color }}
              >
                {status.label}
              </span>
            </div>
            <span className="ret-card-order">
              for Order{" "}
              <Link
                href={`/account/orders/${ret.orderId}`}
                className="ret-order-link"
                onClick={(e) => e.stopPropagation()}
              >
                {ret.orderId}
              </Link>
              {" "}· Requested {ret.requestedDate}
            </span>
          </div>
        </div>
        <div className="ret-card-header-right">
          <span className="ret-card-refund">−${ret.totalRefund}</span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={`ret-chevron ${expanded ? "ret-chevron-open" : ""}`}
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </div>

      {expanded && (
        <div className="ret-card-body">
          {/* Items */}
          <div className="ret-card-items">
            {ret.items.map((item, i) => (
              <div key={i} className="ret-card-item">
                <div className="ret-item-img" style={{ background: item.image }} />
                <div className="ret-item-info">
                  <p className="ret-item-name">{item.name}</p>
                  <div className="ret-item-meta">
                    <span className="ret-meta-pill">
                      <span className="ret-meta-swatch" style={{ background: item.color }} />
                    </span>
                    <span className="ret-meta-pill">Size {item.size}</span>
                    <span className="ret-meta-pill ret-reason-pill">"{item.reason}"</span>
                  </div>
                </div>
                <span className="ret-item-refund">${item.refundAmount}</span>
              </div>
            ))}
          </div>

          <div className="ret-card-lower">
            {/* Timeline */}
            <div className="ret-card-tl">
              <p className="ret-section-label">Return Progress</p>
              <ReturnTimeline steps={ret.timeline} />
            </div>

            {/* Refund info */}
            <div className="ret-card-refund-info">
              <p className="ret-section-label">Refund Details</p>
              <div className="ret-refund-rows">
                <div className="ret-refund-row">
                  <span>Refund to</span>
                  <span>{ret.refundMethod}</span>
                </div>
                <div className="ret-refund-row ret-refund-total">
                  <span>Total refund</span>
                  <span>${ret.totalRefund}</span>
                </div>
              </div>
              <p className="ret-refund-note">
                Refunds typically appear within 5–10 business days of the item being received.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── New Return Form ──────────────────────────────────────────────────────────
type SelectedItem = EligibleItem & { reason: string; notes: string };

function NewReturnForm({ onSuccess }: { onSuccess: () => void }) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selected, setSelected] = useState<SelectedItem[]>([]);
  const [refundMethod, setRefundMethod] = useState<"original" | "store_credit">("original");
  const [submitted, setSubmitted] = useState(false);

  // Group eligible items by order
  const byOrder = ELIGIBLE_ITEMS.reduce<Record<string, EligibleItem[]>>((acc, item) => {
    if (!acc[item.orderId]) acc[item.orderId] = [];
    acc[item.orderId].push(item);
    return acc;
  }, {});

  const toggleItem = (item: EligibleItem) => {
    const exists = selected.find((s) => s.id === item.id);
    if (exists) {
      setSelected((p) => p.filter((s) => s.id !== item.id));
    } else {
      setSelected((p) => [...p, { ...item, reason: "", notes: "" }]);
    }
  };

  const setReason = (id: number, reason: string) =>
    setSelected((p) => p.map((s) => (s.id === id ? { ...s, reason } : s)));

  const setNotes = (id: number, notes: string) =>
    setSelected((p) => p.map((s) => (s.id === id ? { ...s, notes } : s)));

  const canProceedStep1 = selected.length > 0;
  const canProceedStep2 = selected.every((s) => s.reason !== "");

  const totalRefund = selected.reduce((sum, s) => sum + s.price, 0);

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      onSuccess();
    }, 10000);
  };

  if (submitted) {
    return (
      <div className="ret-success">
        <div className="ret-success-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h2 className="ret-success-title">Return Requested</h2>
        <p className="ret-success-sub">
          We&apos;ve emailed your prepaid return label. Drop off your parcel within 14 days.
        </p>
        <div className="ret-success-detail">
          <div className="ret-success-row">
            <span>Items</span>
            <span>{selected.length}</span>
          </div>
          <div className="ret-success-row">
            <span>Estimated refund</span>
            <span>${totalRefund}</span>
          </div>
          <div className="ret-success-row">
            <span>Refund to</span>
            <span>{refundMethod === "original" ? "Original payment method" : "Store credit"}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ret-form-wrap">
      {/* Step indicator */}
      <div className="ret-steps">
        {[
          { n: 1, label: "Select Items" },
          { n: 2, label: "Reasons" },
          { n: 3, label: "Confirm" },
        ].map((s, i) => (
          <span key={s.n} className="ret-step-item">
            <span className={`ret-step-num ${step === s.n ? "ret-step-active" : ""} ${step > s.n ? "ret-step-done" : ""}`}>
              {step > s.n ? (
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              ) : s.n}
            </span>
            <span className={`ret-step-label ${step === s.n ? "ret-step-label-active" : ""}`}>{s.label}</span>
            {i < 2 && <span className="ret-step-sep">›</span>}
          </span>
        ))}
      </div>

      {/* ── Step 1: Select items ── */}
      {step === 1 && (
        <div className="ret-step-body">
          <h3 className="ret-step-title">Which items would you like to return?</h3>
          <p className="ret-step-sub">Select all items you wish to include in this return.</p>

          {Object.entries(byOrder).map(([orderId, items]) => (
            <div key={orderId} className="ret-order-group">
              <div className="ret-order-group-header">
                <span className="ret-order-group-id">{orderId}</span>
                <span className="ret-order-group-date">{items[0].orderDate}</span>
              </div>
              {items.map((item) => {
                const isSelected = !!selected.find((s) => s.id === item.id);
                return (
                  <label key={item.id} className={`ret-select-item ${isSelected ? "ret-select-item-active" : ""}`}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleItem(item)}
                      className="ret-checkbox"
                    />
                    <div className="ret-select-img" style={{ background: item.image }} />
                    <div className="ret-select-info">
                      <span className="ret-select-cat">{item.category}</span>
                      <p className="ret-select-name">{item.name}</p>
                      <div className="ret-select-meta">
                        <span className="ret-meta-pill">
                          <span className="ret-meta-swatch" style={{ background: item.color }} />
                          {item.colorLabel}
                        </span>
                        <span className="ret-meta-pill">Size {item.size}</span>
                      </div>
                    </div>
                    <span className="ret-select-price">${item.price}</span>
                  </label>
                );
              })}
            </div>
          ))}

          <div className="ret-step-footer">
            <span className="ret-selected-count">
              {selected.length > 0
                ? `${selected.length} item${selected.length > 1 ? "s" : ""} selected`
                : "No items selected"}
            </span>
            <button
              className="btn-primary"
              disabled={!canProceedStep1}
              onClick={() => setStep(2)}
              style={{ opacity: canProceedStep1 ? 1 : 0.45, cursor: canProceedStep1 ? "pointer" : "not-allowed" }}
            >
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* ── Step 2: Reasons ── */}
      {step === 2 && (
        <div className="ret-step-body">
          <h3 className="ret-step-title">Why are you returning {selected.length === 1 ? "this item" : "these items"}?</h3>
          <p className="ret-step-sub">Your feedback helps us improve.</p>

          {selected.map((item) => (
            <div key={item.id} className="ret-reason-block">
              <div className="ret-reason-item-header">
                <div className="ret-reason-img" style={{ background: item.image }} />
                <div>
                  <p className="ret-reason-name">{item.name}</p>
                  <p className="ret-reason-meta">Size {item.size} · {item.colorLabel}</p>
                </div>
              </div>

              <div className="ret-reason-field">
                <label className="ret-field-label">Reason for return <span className="ret-required">*</span></label>
                <div className="ret-select-wrap">
                  <select
                    className="ret-select"
                    value={item.reason}
                    onChange={(e) => setReason(item.id, e.target.value)}
                  >
                    <option value="">Select a reason…</option>
                    {RETURN_REASONS.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                  <svg className="ret-select-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
              </div>

              <div className="ret-reason-field">
                <label className="ret-field-label">Additional notes <span className="ret-optional">(optional)</span></label>
                <textarea
                  className="ret-textarea"
                  placeholder="Any details that might help us process your return…"
                  value={item.notes}
                  onChange={(e) => setNotes(item.id, e.target.value)}
                  rows={2}
                />
              </div>
            </div>
          ))}

          <div className="ret-step-footer">
            <button className="ret-back-btn" onClick={() => setStep(1)}>← Back</button>
            <button
              className="btn-primary"
              disabled={!canProceedStep2}
              onClick={() => setStep(3)}
              style={{ opacity: canProceedStep2 ? 1 : 0.45, cursor: canProceedStep2 ? "pointer" : "not-allowed" }}
            >
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* ── Step 3: Confirm ── */}
      {step === 3 && (
        <div className="ret-step-body">
          <h3 className="ret-step-title">Review your return</h3>
          <p className="ret-step-sub">Please confirm the details before we generate your label.</p>

          {/* Summary of items */}
          <div className="ret-confirm-items">
            {selected.map((item) => (
              <div key={item.id} className="ret-confirm-item">
                <div className="ret-confirm-img" style={{ background: item.image }} />
                <div className="ret-confirm-info">
                  <p className="ret-confirm-name">{item.name}</p>
                  <p className="ret-confirm-reason">{item.reason}</p>
                </div>
                <span className="ret-confirm-price">${item.price}</span>
              </div>
            ))}
          </div>

          {/* Refund method */}
          <div className="ret-refund-method">
            <p className="ret-field-label" style={{ marginBottom: 10 }}>Refund method</p>
            <div className="ret-refund-options">
              <label className={`ret-refund-option ${refundMethod === "original" ? "ret-refund-option-active" : ""}`}>
                <input
                  type="radio"
                  name="refund"
                  value="original"
                  checked={refundMethod === "original"}
                  onChange={() => setRefundMethod("original")}
                  className="ret-radio"
                />
                <div className="ret-refund-option-body">
                  <p className="ret-refund-option-title">Original payment method</p>
                  <p className="ret-refund-option-sub">5–10 business days after receipt</p>
                </div>
              </label>
              <label className={`ret-refund-option ${refundMethod === "store_credit" ? "ret-refund-option-active" : ""}`}>
                <input
                  type="radio"
                  name="refund"
                  value="store_credit"
                  checked={refundMethod === "store_credit"}
                  onChange={() => setRefundMethod("store_credit")}
                  className="ret-radio"
                />
                <div className="ret-refund-option-body">
                  <p className="ret-refund-option-title">
                    Store credit
                    <span className="ret-credit-bonus"> +10% bonus</span>
                  </p>
                  <p className="ret-refund-option-sub">Instant, no waiting period</p>
                </div>
              </label>
            </div>
          </div>

          {/* Total */}
          <div className="ret-confirm-total">
            <div className="ret-confirm-total-row">
              <span>{selected.length} item{selected.length > 1 ? "s" : ""}</span>
              <span>${totalRefund}</span>
            </div>
            {refundMethod === "store_credit" && (
              <div className="ret-confirm-total-row ret-bonus-row">
                <span>10% store credit bonus</span>
                <span>+${Math.round(totalRefund * 0.1)}</span>
              </div>
            )}
            <div className="ret-confirm-divider" />
            <div className="ret-confirm-total-row ret-grand-total">
              <span>Estimated refund</span>
              <span>
                ${refundMethod === "store_credit"
                  ? Math.round(totalRefund * 1.1)
                  : totalRefund}
              </span>
            </div>
          </div>

          {/* Policy note */}
          <div className="ret-policy-note">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            Items must be unworn, unwashed, and in original packaging. A prepaid label will be emailed to you.
          </div>

          <div className="ret-step-footer">
            <button className="ret-back-btn" onClick={() => setStep(2)}>← Back</button>
            <button className="btn-primary ret-submit-btn" onClick={handleSubmit}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 1 0 .49-4.5" />
              </svg>
              Submit Return Request
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ReturnsPage() {
  const [view, setView] = useState<"list" | "new">("list");

  const handleSuccess = () => {
    setView("list");
  };

  return (
    <>
      <AnnouncementBar />
      <Navbar />

      <main className="ret-page">
        {/* ── Hero ── */}
        <section className="ret-hero">
          <div className="ret-hero-inner">
            <nav className="ret-breadcrumb">
              <Link href="/">Home</Link>
              <span className="ret-sep">·</span>
              <Link href="/account">My Account</Link>
              <span className="ret-sep">·</span>
              <span>Returns</span>
            </nav>
            <div className="ret-hero-row">
              <div>
                <h1 className="ret-hero-title">
                  My <em>Returns</em>
                </h1>
                <p className="ret-hero-sub">
                  Free returns within 30 days of delivery.
                </p>
              </div>
              {view === "list" && (
                <button className="btn-primary" onClick={() => setView("new")}>
                  ↩ Start a Return
                </button>
              )}
              {view === "new" && (
                <button className="ret-back-hero-btn" onClick={() => setView("list")}>
                  ← Back to Returns
                </button>
              )}
            </div>
          </div>
        </section>

        <div className="ret-layout">
          {/* ── Sidebar ── */}
          <aside className="ret-sidebar">
            <nav className="ret-sidebar-nav">
              {[
                { label: "Overview", href: "/account" },
                { label: "My Orders", href: "/account/orders" },
                { label: "Wishlist", href: "/wishlist" },
                { label: "Addresses", href: "/account/addresses" },
                { label: "Profile & Security", href: "/account/profile" },
                { label: "Returns", href: "/account/returns", active: true },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`ret-sidebar-item ${item.active ? "ret-sidebar-active" : ""}`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Policy card */}
            <div className="ret-policy-card">
              <p className="ret-policy-card-title">Return Policy</p>
              <ul className="ret-policy-list">
                <li>30-day return window</li>
                <li>Free prepaid label</li>
                <li>Unworn &amp; original packaging</li>
                <li>Refund in 5–10 days</li>
                <li>+10% bonus as store credit</li>
              </ul>
              <Link href="/help/returns" className="ret-policy-link">
                Full policy →
              </Link>
            </div>
          </aside>

          {/* ── Main ── */}
          <div className="ret-main">
            {view === "list" && (
              <>
                {/* Existing returns */}
                {EXISTING_RETURNS.length > 0 ? (
                  <div className="ret-list">
                    <div className="ret-list-header">
                      <h2 className="ret-list-title">Active Returns</h2>
                      <span className="ret-list-count">{EXISTING_RETURNS.length} return{EXISTING_RETURNS.length > 1 ? "s" : ""}</span>
                    </div>
                    {EXISTING_RETURNS.map((ret) => (
                      <ReturnCard key={ret.id} ret={ret} />
                    ))}
                  </div>
                ) : (
                  <div className="ret-empty">
                    <div className="ret-empty-icon">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.9">
                        <polyline points="1 4 1 10 7 10" />
                        <path d="M3.51 15a9 9 0 1 0 .49-4.5" />
                      </svg>
                    </div>
                    <h3 className="ret-empty-title">No returns yet</h3>
                    <p className="ret-empty-sub">
                      If something isn&apos;t right, we make it easy to send back.
                    </p>
                    <button className="btn-primary" onClick={() => setView("new")}>
                      Start a Return
                    </button>
                  </div>
                )}

                {/* Start new return CTA — shown below existing returns */}
                {EXISTING_RETURNS.length > 0 && (
                  <div className="ret-new-cta">
                    <div className="ret-new-cta-text">
                      <p className="ret-new-cta-title">Need to return something else?</p>
                      <p className="ret-new-cta-sub">
                        You have {ELIGIBLE_ITEMS.length} eligible item{ELIGIBLE_ITEMS.length !== 1 ? "s" : ""} from recent orders.
                      </p>
                    </div>
                    <button className="ret-new-cta-btn" onClick={() => setView("new")}>
                      Start a New Return →
                    </button>
                  </div>
                )}
              </>
            )}

            {view === "new" && (
              ELIGIBLE_ITEMS.length === 0 ? (
                <div className="ret-empty">
                  <div className="ret-empty-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.9">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M8 12h8M12 8v8" />
                    </svg>
                  </div>
                  <h3 className="ret-empty-title">No eligible items</h3>
                  <p className="ret-empty-sub">
                    Items are eligible for return within 30 days of delivery.
                  </p>
                  <Link href="/account/orders" className="btn-primary">View My Orders</Link>
                </div>
              ) : (
                <NewReturnForm onSuccess={handleSuccess} />
              )
            )}
          </div>
        </div>
      </main>

      <Footer />

      <style>{`
        /* ── Page ── */
        .ret-page { background: var(--cream); min-height: 80vh; }

        /* ── Hero ── */
        .ret-hero {
          background: var(--cream-dark);
          border-bottom: 1px solid var(--border);
          padding: 48px 60px 40px;
        }
        .ret-breadcrumb {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 20px;
        }
        .ret-breadcrumb a { transition: color 0.2s; }
        .ret-breadcrumb a:hover { color: var(--gold); }
        .ret-sep { color: var(--border); }
        .ret-hero-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
          flex-wrap: wrap;
        }
        .ret-hero-title {
          font-family: var(--font-display);
          font-size: clamp(36px, 4vw, 52px);
          font-weight: 400;
          color: var(--charcoal);
          line-height: 1.05;
          margin-bottom: 8px;
          animation: fadeUp 0.6s ease both;
        }
        .ret-hero-title em { font-style: italic; color: var(--gold); }
        .ret-hero-sub {
          font-family: var(--font-editorial);
          font-size: 15px;
          color: var(--muted);
          font-weight: 300;
        }
        .ret-back-hero-btn {
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--charcoal-light);
          border: 1px solid var(--border);
          padding: 12px 24px;
          background: transparent;
          font-family: var(--font-body);
          cursor: pointer;
          transition: all 0.2s;
        }
        .ret-back-hero-btn:hover { border-color: var(--charcoal); color: var(--charcoal); }

        /* ── Layout ── */
        .ret-layout {
          display: grid;
          grid-template-columns: 220px 1fr;
          gap: 48px;
          max-width: 1200px;
          margin: 0 auto;
          padding: 48px 60px 80px;
          align-items: start;
        }

        /* ── Sidebar ── */
        .ret-sidebar { position: sticky; top: 100px; }
        .ret-sidebar-nav {
          display: flex;
          flex-direction: column;
          border: 1px solid var(--border);
          margin-bottom: 20px;
        }
        .ret-sidebar-item {
          padding: 14px 20px;
          font-size: 13px;
          color: var(--charcoal-light);
          letter-spacing: 0.04em;
          border-bottom: 1px solid var(--border);
          transition: all 0.18s;
          background: var(--cream);
        }
        .ret-sidebar-item:last-child { border-bottom: none; }
        .ret-sidebar-item:hover { background: var(--cream-dark); color: var(--charcoal); }
        .ret-sidebar-active { background: var(--charcoal) !important; color: var(--cream) !important; }

        /* Policy card */
        .ret-policy-card {
          border: 1px solid var(--border);
          padding: 20px;
          background: var(--cream-dark);
        }
        .ret-policy-card-title {
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 14px;
        }
        .ret-policy-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 16px;
        }
        .ret-policy-list li {
          font-size: 12px;
          color: var(--charcoal-light);
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .ret-policy-list li::before {
          content: "✦";
          color: var(--gold);
          font-size: 8px;
          flex-shrink: 0;
        }
        .ret-policy-link {
          font-size: 11px;
          color: var(--gold);
          letter-spacing: 0.06em;
          border-bottom: 1px solid var(--gold);
          padding-bottom: 1px;
          transition: color 0.2s;
        }
        .ret-policy-link:hover { color: var(--charcoal); border-color: var(--charcoal); }

        /* ── Return card ── */
        .ret-card {
          border: 1px solid var(--border);
          background: var(--cream);
          margin-bottom: 16px;
          animation: fadeUp 0.4s ease both;
        }
        .ret-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          cursor: pointer;
          transition: background 0.18s;
          gap: 16px;
        }
        .ret-card-header:hover { background: var(--cream-dark); }
        .ret-card-header-left { flex: 1; min-width: 0; }
        .ret-card-id-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 5px;
          flex-wrap: wrap;
        }
        .ret-card-id {
          font-size: 13px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--charcoal);
          font-weight: 400;
        }
        .ret-status-badge {
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          border: 1px solid;
          padding: 3px 10px;
          font-weight: 400;
        }
        .ret-card-order {
          font-size: 12px;
          color: var(--muted);
        }
        .ret-order-link {
          color: var(--gold);
          border-bottom: 1px solid var(--gold);
          padding-bottom: 1px;
          transition: color 0.2s;
        }
        .ret-order-link:hover { color: var(--charcoal); border-color: var(--charcoal); }
        .ret-card-header-right {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-shrink: 0;
        }
        .ret-card-refund {
          font-family: var(--font-display);
          font-size: 18px;
          font-weight: 400;
          color: var(--charcoal);
        }
        .ret-chevron { color: var(--muted); transition: transform 0.2s; }
        .ret-chevron-open { transform: rotate(180deg); }

        /* Card body */
        .ret-card-body {
          border-top: 1px solid var(--border);
          padding: 24px;
          animation: fadeUp 0.25s ease both;
        }
        .ret-card-items { margin-bottom: 24px; }
        .ret-card-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 0;
          border-bottom: 1px solid var(--border);
        }
        .ret-card-item:last-child { border-bottom: none; }
        .ret-item-img {
          width: 52px;
          height: 64px;
          flex-shrink: 0;
          border-radius: 1px;
        }
        .ret-item-info { flex: 1; }
        .ret-item-name {
          font-family: var(--font-display);
          font-size: 15px;
          font-weight: 400;
          color: var(--charcoal);
          margin-bottom: 6px;
        }
        .ret-item-meta { display: flex; gap: 6px; flex-wrap: wrap; }
        .ret-item-refund {
          font-size: 15px;
          color: var(--charcoal);
          flex-shrink: 0;
        }

        /* Shared meta pill */
        .ret-meta-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          color: var(--muted);
          background: var(--cream-dark);
          border: 1px solid var(--border);
          padding: 3px 8px;
        }
        .ret-meta-swatch {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
          box-shadow: 0 0 0 1px var(--border);
        }
        .ret-reason-pill {
          font-style: italic;
          color: var(--charcoal-light);
        }

        /* Card lower */
        .ret-card-lower {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
        }
        .ret-section-label {
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 16px;
        }

        /* Timeline */
        .ret-timeline { display: flex; flex-direction: column; }
        .ret-tl-step { display: flex; gap: 14px; align-items: flex-start; }
        .ret-tl-track {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex-shrink: 0;
          width: 20px;
        }
        .ret-tl-dot {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 1.5px solid var(--border);
          background: var(--cream);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--muted);
          flex-shrink: 0;
          z-index: 1;
        }
        .ret-tl-done .ret-tl-dot {
          border-color: var(--charcoal-light);
          background: var(--cream-dark);
          color: var(--charcoal-light);
        }
        .ret-tl-current .ret-tl-dot {
          border-color: var(--charcoal);
          background: var(--charcoal);
          color: var(--cream);
        }
        .ret-tl-line {
          width: 1px;
          min-height: 24px;
          background: var(--border);
          margin: 3px 0;
          flex: 1;
        }
        .ret-tl-line-done { background: var(--charcoal-light); }
        .ret-tl-content { padding-bottom: 20px; flex: 1; }
        .ret-tl-step:last-child .ret-tl-content { padding-bottom: 0; }
        .ret-tl-label { font-size: 13px; color: var(--charcoal-light); margin-bottom: 2px; }
        .ret-tl-done .ret-tl-label, .ret-tl-current .ret-tl-label { color: var(--charcoal); }
        .ret-tl-current .ret-tl-label { font-weight: 500; }
        .ret-tl-date { font-size: 11px; color: var(--muted); }
        .ret-tl-pending { font-size: 11px; color: var(--border); font-style: italic; }

        /* Refund info */
        .ret-refund-rows { display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px; }
        .ret-refund-row {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          color: var(--charcoal-light);
        }
        .ret-refund-total { font-weight: 500; color: var(--charcoal); font-size: 14px; }
        .ret-refund-note {
          font-family: var(--font-editorial);
          font-size: 12px;
          color: var(--muted);
          font-style: italic;
          line-height: 1.6;
        }

        /* ── New return CTA ── */
        .ret-new-cta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 24px 28px;
          border: 1px dashed var(--border);
          background: var(--cream-dark);
          flex-wrap: wrap;
          margin-top: 8px;
        }
        .ret-new-cta-title {
          font-family: var(--font-display);
          font-size: 16px;
          font-weight: 400;
          color: var(--charcoal);
          margin-bottom: 4px;
        }
        .ret-new-cta-sub { font-size: 13px; color: var(--muted); }
        .ret-new-cta-btn {
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--gold);
          border: none;
          border-bottom: 1px solid var(--gold);
          padding-bottom: 1px;
          background: none;
          cursor: pointer;
          font-family: var(--font-body);
          transition: color 0.2s;
          white-space: nowrap;
        }
        .ret-new-cta-btn:hover { color: var(--charcoal); border-color: var(--charcoal); }

        /* ── Empty ── */
        .ret-empty {
          text-align: center;
          padding: 80px 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          animation: fadeUp 0.5s ease both;
        }
        .ret-empty-icon { color: var(--gold); opacity: 0.55; margin-bottom: 8px; }
        .ret-empty-title {
          font-family: var(--font-display);
          font-size: 24px;
          font-weight: 400;
          color: var(--charcoal);
        }
        .ret-empty-sub {
          font-family: var(--font-editorial);
          font-size: 16px;
          color: var(--muted);
          font-weight: 300;
          max-width: 340px;
          margin-bottom: 8px;
        }

        /* ── List header ── */
        .ret-list-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--border);
        }
        .ret-list-title {
          font-family: var(--font-display);
          font-size: 20px;
          font-weight: 400;
          color: var(--charcoal);
        }
        .ret-list-count { font-size: 13px; color: var(--muted); }

        /* ── Form ── */
        .ret-form-wrap {
          border: 1px solid var(--border);
          background: var(--cream);
          animation: fadeUp 0.4s ease both;
        }

        /* Step indicator */
        .ret-steps {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 20px 28px;
          border-bottom: 1px solid var(--border);
          background: var(--cream-dark);
          flex-wrap: wrap;
        }
        .ret-step-item { display: flex; align-items: center; gap: 8px; }
        .ret-step-num {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          border: 1.5px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          color: var(--muted);
          flex-shrink: 0;
          transition: all 0.2s;
        }
        .ret-step-active { border-color: var(--charcoal); background: var(--charcoal); color: var(--cream); }
        .ret-step-done { border-color: var(--charcoal-light); background: var(--cream-dark); color: var(--charcoal-light); }
        .ret-step-label { font-size: 12px; color: var(--muted); letter-spacing: 0.04em; }
        .ret-step-label-active { color: var(--charcoal); font-weight: 500; }
        .ret-step-sep { color: var(--border); font-size: 14px; margin: 0 2px; }

        /* Step body */
        .ret-step-body { padding: 28px; }
        .ret-step-title {
          font-family: var(--font-display);
          font-size: 20px;
          font-weight: 400;
          color: var(--charcoal);
          margin-bottom: 6px;
        }
        .ret-step-sub {
          font-family: var(--font-editorial);
          font-size: 14px;
          color: var(--muted);
          font-style: italic;
          margin-bottom: 24px;
        }

        /* Order group */
        .ret-order-group { margin-bottom: 20px; }
        .ret-order-group-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid var(--border);
          margin-bottom: 2px;
        }
        .ret-order-group-id {
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--muted);
        }
        .ret-order-group-date { font-size: 12px; color: var(--muted); }

        /* Selectable item */
        .ret-select-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 16px;
          border: 1px solid var(--border);
          border-top: none;
          cursor: pointer;
          transition: background 0.15s;
          background: var(--cream);
        }
        .ret-select-item:hover { background: var(--cream-dark); }
        .ret-select-item-active { background: rgba(201,169,110,0.05); border-color: var(--charcoal); }
        .ret-checkbox {
          width: 16px;
          height: 16px;
          accent-color: var(--charcoal);
          cursor: pointer;
          flex-shrink: 0;
        }
        .ret-select-img {
          width: 44px;
          height: 54px;
          flex-shrink: 0;
          border-radius: 1px;
        }
        .ret-select-info { flex: 1; }
        .ret-select-cat {
          display: block;
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 3px;
        }
        .ret-select-name {
          font-family: var(--font-display);
          font-size: 14px;
          font-weight: 400;
          color: var(--charcoal);
          margin-bottom: 6px;
        }
        .ret-select-meta { display: flex; gap: 6px; }
        .ret-select-price { font-size: 14px; color: var(--charcoal); flex-shrink: 0; }

        /* Step footer */
        .ret-step-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 24px;
          border-top: 1px solid var(--border);
          margin-top: 24px;
          gap: 16px;
        }
        .ret-selected-count { font-size: 13px; color: var(--muted); }
        .ret-back-btn {
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--muted);
          background: none;
          border: none;
          cursor: pointer;
          font-family: var(--font-body);
          transition: color 0.2s;
          padding: 0;
        }
        .ret-back-btn:hover { color: var(--charcoal); }

        /* Reason blocks */
        .ret-reason-block {
          border: 1px solid var(--border);
          padding: 20px;
          margin-bottom: 16px;
          background: var(--cream-dark);
        }
        .ret-reason-item-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--border);
        }
        .ret-reason-img {
          width: 44px;
          height: 54px;
          flex-shrink: 0;
          border-radius: 1px;
        }
        .ret-reason-name {
          font-family: var(--font-display);
          font-size: 15px;
          font-weight: 400;
          color: var(--charcoal);
          margin-bottom: 3px;
        }
        .ret-reason-meta { font-size: 12px; color: var(--muted); }
        .ret-reason-field { margin-bottom: 12px; }
        .ret-reason-field:last-child { margin-bottom: 0; }
        .ret-field-label {
          display: block;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--charcoal-light);
          margin-bottom: 6px;
        }
        .ret-required { color: var(--gold); }
        .ret-optional { color: var(--muted); font-size: 10px; text-transform: none; letter-spacing: 0; }
        .ret-select-wrap { position: relative; }
        .ret-select {
          width: 100%;
          padding: 11px 36px 11px 14px;
          border: 1px solid var(--border);
          background: var(--white);
          font-size: 14px;
          color: var(--charcoal);
          font-family: var(--font-body);
          outline: none;
          appearance: none;
          cursor: pointer;
          transition: border-color 0.2s;
        }
        .ret-select:focus { border-color: var(--charcoal); }
        .ret-select-chevron {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: var(--muted);
        }
        .ret-textarea {
          width: 100%;
          padding: 11px 14px;
          border: 1px solid var(--border);
          background: var(--white);
          font-size: 14px;
          color: var(--charcoal);
          font-family: var(--font-body);
          outline: none;
          resize: vertical;
          transition: border-color 0.2s;
        }
        .ret-textarea:focus { border-color: var(--charcoal); }
        .ret-textarea::placeholder { color: var(--muted); }

        /* Confirm step */
        .ret-confirm-items {
          border: 1px solid var(--border);
          margin-bottom: 24px;
        }
        .ret-confirm-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 16px;
          border-bottom: 1px solid var(--border);
        }
        .ret-confirm-item:last-child { border-bottom: none; }
        .ret-confirm-img {
          width: 44px;
          height: 54px;
          flex-shrink: 0;
          border-radius: 1px;
        }
        .ret-confirm-info { flex: 1; }
        .ret-confirm-name {
          font-family: var(--font-display);
          font-size: 14px;
          font-weight: 400;
          color: var(--charcoal);
          margin-bottom: 3px;
        }
        .ret-confirm-reason { font-size: 12px; color: var(--muted); font-style: italic; }
        .ret-confirm-price { font-size: 14px; color: var(--charcoal); flex-shrink: 0; }

        /* Refund method */
        .ret-refund-method { margin-bottom: 24px; }
        .ret-refund-options { display: flex; flex-direction: column; gap: 8px; }
        .ret-refund-option {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 16px;
          border: 1px solid var(--border);
          cursor: pointer;
          transition: all 0.18s;
          background: var(--cream);
        }
        .ret-refund-option:hover { background: var(--cream-dark); }
        .ret-refund-option-active { border-color: var(--charcoal); background: var(--cream-dark); }
        .ret-radio { accent-color: var(--charcoal); cursor: pointer; flex-shrink: 0; width: 16px; height: 16px; }
        .ret-refund-option-body {}
        .ret-refund-option-title { font-size: 14px; color: var(--charcoal); margin-bottom: 2px; font-weight: 400; }
        .ret-refund-option-sub { font-size: 12px; color: var(--muted); }
        .ret-credit-bonus {
          font-size: 11px;
          color: #2a7a4a;
          background: #f0faf4;
          border: 1px solid #c8e6c9;
          padding: 2px 7px;
          margin-left: 8px;
          letter-spacing: 0.04em;
        }

        /* Total */
        .ret-confirm-total {
          border: 1px solid var(--border);
          padding: 16px 20px;
          background: var(--cream-dark);
          margin-bottom: 16px;
        }
        .ret-confirm-total-row {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          color: var(--charcoal-light);
          margin-bottom: 8px;
        }
        .ret-confirm-total-row:last-child { margin-bottom: 0; }
        .ret-bonus-row { color: #2a7a4a; font-size: 13px; }
        .ret-confirm-divider { height: 1px; background: var(--border); margin: 10px 0; }
        .ret-grand-total { font-size: 16px; color: var(--charcoal); font-weight: 500; }

        /* Policy note */
        .ret-policy-note {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 12px;
          color: var(--muted);
          line-height: 1.6;
          padding: 12px 14px;
          background: var(--cream-dark);
          border: 1px solid var(--border);
          margin-bottom: 0;
        }
        .ret-policy-note svg { flex-shrink: 0; margin-top: 2px; color: var(--gold); }

        .ret-submit-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        /* Success */
        .ret-success {
          padding: 60px 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 14px;
          animation: fadeUp 0.5s ease both;
        }
        .ret-success-icon {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: var(--cream-dark);
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #2a7a4a;
          margin-bottom: 8px;
        }
        .ret-success-title {
          font-family: var(--font-display);
          font-size: 26px;
          font-weight: 400;
          color: var(--charcoal);
        }
        .ret-success-sub {
          font-family: var(--font-editorial);
          font-size: 16px;
          color: var(--muted);
          font-weight: 300;
          max-width: 360px;
        }
        .ret-success-detail {
          border: 1px solid var(--border);
          width: 100%;
          max-width: 360px;
          margin-top: 8px;
        }
        .ret-success-row {
          display: flex;
          justify-content: space-between;
          padding: 11px 16px;
          font-size: 13px;
          color: var(--charcoal-light);
          border-bottom: 1px solid var(--border);
        }
        .ret-success-row:last-child { border-bottom: none; }

        /* ── Responsive ── */
        @media (max-width: 1100px) {
          .ret-layout { padding: 40px; gap: 36px; grid-template-columns: 200px 1fr; }
          .ret-hero { padding: 40px 40px 32px; }
        }
        @media (max-width: 900px) {
          .ret-layout { grid-template-columns: 1fr; padding: 24px 20px 60px; }
          .ret-hero { padding: 36px 20px 28px; }
          .ret-sidebar { position: static; }
          .ret-sidebar-nav { flex-direction: row; flex-wrap: wrap; }
          .ret-sidebar-item { flex: 1 1 auto; border-bottom: none; border-right: 1px solid var(--border); padding: 11px 10px; font-size: 11px; text-align: center; }
          .ret-sidebar-item:last-child { border-right: none; }
          .ret-policy-card { display: none; }
          .ret-card-lower { grid-template-columns: 1fr; gap: 24px; }
        }
        @media (max-width: 640px) {
          .ret-hero-row { flex-direction: column; align-items: flex-start; }
          .ret-card-header { flex-wrap: wrap; }
          .ret-step-body { padding: 20px; }
          .ret-steps { padding: 16px 20px; }
          .ret-step-footer { flex-direction: column-reverse; align-items: stretch; }
          .ret-step-footer .btn-primary { text-align: center; }
          .ret-success { padding: 40px 20px; }
        }
      `}</style>
    </>
  );
}