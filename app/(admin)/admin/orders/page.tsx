"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────
type OrderStatus =
  | "pending"
  | "payment_failed"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "return_requested"
  | "returned"
  | "refunded";

type PaymentStatus = "pending" | "paid" | "failed" | "refunded" | "partially_refunded";

type Order = {
  id: string;
  orderNumber: string;
  customer: { name: string; email: string; avatar: string };
  items: { name: string; qty: number; image: string }[];
  itemCount: number;
  subtotal: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: "card" | "paypal" | "apple_pay";
  shippingMethod: "standard" | "express" | "next_day";
  country: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_ORDERS: Order[] = [
  {
    id: "ord_001",
    orderNumber: "ME-005018",
    customer: { name: "Sophie Beaumont", email: "sophie@example.com", avatar: "SB" },
    items: [{ name: "Silk Slip Dress", qty: 1, image: "#e8d5c0" }, { name: "Linen Wide Trousers", qty: 1, image: "#c8d5c0" }],
    itemCount: 2,
    subtotal: 480,
    total: 480,
    status: "delivered",
    paymentStatus: "paid",
    paymentMethod: "card",
    shippingMethod: "standard",
    country: "United Kingdom",
    trackingNumber: "DHL1234567890",
    createdAt: "2025-04-08T14:22:00Z",
    updatedAt: "2025-04-12T09:00:00Z",
  },
  {
    id: "ord_002",
    orderNumber: "ME-005017",
    customer: { name: "Amara Konte", email: "amara.k@example.com", avatar: "AK" },
    items: [{ name: "Cashmere Turtleneck", qty: 1, image: "#d0c8d5" }],
    itemCount: 1,
    subtotal: 320,
    total: 320,
    status: "processing",
    paymentStatus: "paid",
    paymentMethod: "paypal",
    shippingMethod: "express",
    country: "France",
    createdAt: "2025-04-08T11:32:00Z",
    updatedAt: "2025-04-08T11:35:00Z",
  },
  {
    id: "ord_003",
    orderNumber: "ME-005016",
    customer: { name: "Léa Marchand", email: "lea.m@example.com", avatar: "LM" },
    items: [{ name: "Wrap Blazer", qty: 1, image: "#d5d0c0" }, { name: "Merino Cardigan", qty: 1, image: "#c8d5e0" }, { name: "Silk Scarf", qty: 1, image: "#e8d5b0" }],
    itemCount: 3,
    subtotal: 755,
    total: 755,
    status: "shipped",
    paymentStatus: "paid",
    paymentMethod: "card",
    shippingMethod: "express",
    country: "Germany",
    trackingNumber: "DPD9876543210",
    createdAt: "2025-04-07T18:48:00Z",
    updatedAt: "2025-04-09T07:30:00Z",
  },
  {
    id: "ord_004",
    orderNumber: "ME-005015",
    customer: { name: "Yuki Tanaka", email: "yuki.t@example.com", avatar: "YT" },
    items: [{ name: "Satin Cami Top", qty: 1, image: "#ddd5c5" }],
    itemCount: 1,
    subtotal: 95,
    total: 95,
    status: "confirmed",
    paymentStatus: "paid",
    paymentMethod: "apple_pay",
    shippingMethod: "standard",
    country: "Japan",
    createdAt: "2025-04-07T15:15:00Z",
    updatedAt: "2025-04-07T15:16:00Z",
  },
  {
    id: "ord_005",
    orderNumber: "ME-005014",
    customer: { name: "Clara Okonkwo", email: "clara.o@example.com", avatar: "CO" },
    items: [{ name: "Ribbed Maxi Dress", qty: 1, image: "#ddc5d0" }, { name: "Leather Belt", qty: 1, image: "#c0ae98" }],
    itemCount: 2,
    subtotal: 370,
    total: 370,
    status: "delivered",
    paymentStatus: "paid",
    paymentMethod: "card",
    shippingMethod: "standard",
    country: "Nigeria",
    trackingNumber: "FED4321098765",
    createdAt: "2025-04-06T10:20:00Z",
    updatedAt: "2025-04-10T14:00:00Z",
  },
  {
    id: "ord_006",
    orderNumber: "ME-005013",
    customer: { name: "Hana Müller", email: "hana.m@example.com", avatar: "HM" },
    items: [{ name: "Merino Cardigan", qty: 1, image: "#c8d5e0" }],
    itemCount: 1,
    subtotal: 275,
    total: 275,
    status: "refunded",
    paymentStatus: "refunded",
    paymentMethod: "card",
    shippingMethod: "express",
    country: "Germany",
    createdAt: "2025-04-05T09:12:00Z",
    updatedAt: "2025-04-09T11:30:00Z",
  },
  {
    id: "ord_007",
    orderNumber: "ME-005012",
    customer: { name: "Priya Shah", email: "priya.s@example.com", avatar: "PS" },
    items: [{ name: "Fluid Midi Skirt", qty: 1, image: "#ddc5b5" }, { name: "Oversized Linen Shirt", qty: 1, image: "#c5ddc5" }],
    itemCount: 2,
    subtotal: 320,
    total: 320,
    status: "return_requested",
    paymentStatus: "paid",
    paymentMethod: "paypal",
    shippingMethod: "standard",
    country: "Australia",
    createdAt: "2025-04-04T16:44:00Z",
    updatedAt: "2025-04-07T10:00:00Z",
  },
  {
    id: "ord_008",
    orderNumber: "ME-005011",
    customer: { name: "Celine Dupont", email: "celine.d@example.com", avatar: "CD" },
    items: [{ name: "Double-Breasted Coat", qty: 1, image: "#c8c0b8" }],
    itemCount: 1,
    subtotal: 590,
    total: 590,
    status: "pending",
    paymentStatus: "pending",
    paymentMethod: "card",
    shippingMethod: "next_day",
    country: "France",
    createdAt: "2025-04-08T17:01:00Z",
    updatedAt: "2025-04-08T17:01:00Z",
  },
  {
    id: "ord_009",
    orderNumber: "ME-005010",
    customer: { name: "Ingrid Larsson", email: "ingrid.l@example.com", avatar: "IL" },
    items: [{ name: "Pleated Midi Dress", qty: 2, image: "#b8ccc4" }],
    itemCount: 2,
    subtotal: 620,
    total: 620,
    status: "confirmed",
    paymentStatus: "paid",
    paymentMethod: "card",
    shippingMethod: "express",
    country: "Sweden",
    createdAt: "2025-04-06T08:55:00Z",
    updatedAt: "2025-04-06T09:00:00Z",
  },
  {
    id: "ord_010",
    orderNumber: "ME-005009",
    customer: { name: "Noa Ben-David", email: "noa.b@example.com", avatar: "NB" },
    items: [{ name: "Alpaca Ribbed Pullover", qty: 1, image: "#e0d8cc" }],
    itemCount: 1,
    subtotal: 340,
    total: 340,
    status: "cancelled",
    paymentStatus: "refunded",
    paymentMethod: "apple_pay",
    shippingMethod: "standard",
    country: "Israel",
    createdAt: "2025-04-03T12:10:00Z",
    updatedAt: "2025-04-03T18:30:00Z",
  },
  {
    id: "ord_011",
    orderNumber: "ME-005008",
    customer: { name: "Mei Chen", email: "mei.c@example.com", avatar: "MC" },
    items: [{ name: "Linen Co-ord Set", qty: 1, image: "#e0dac8" }, { name: "Wide-Brim Hat", qty: 1, image: "#d4c4b0" }],
    itemCount: 2,
    subtotal: 455,
    total: 455,
    status: "shipped",
    paymentStatus: "paid",
    paymentMethod: "card",
    shippingMethod: "express",
    country: "Singapore",
    trackingNumber: "TNT5678901234",
    createdAt: "2025-04-05T14:20:00Z",
    updatedAt: "2025-04-07T08:00:00Z",
  },
  {
    id: "ord_012",
    orderNumber: "ME-005007",
    customer: { name: "Valentina Rossi", email: "v.rossi@example.com", avatar: "VR" },
    items: [{ name: "Silk Blouse", qty: 1, image: "#e8d5d5" }],
    itemCount: 1,
    subtotal: 210,
    total: 210,
    status: "payment_failed",
    paymentStatus: "failed",
    paymentMethod: "card",
    shippingMethod: "standard",
    country: "Italy",
    createdAt: "2025-04-08T20:05:00Z",
    updatedAt: "2025-04-08T20:06:00Z",
  },
];

// ─── Config ───────────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string; dot: string }> = {
  pending:          { label: "Pending",          color: "#f59e0b", bg: "rgba(245,158,11,0.12)",  dot: "#f59e0b" },
  payment_failed:   { label: "Payment Failed",   color: "#ef4444", bg: "rgba(239,68,68,0.12)",   dot: "#ef4444" },
  confirmed:        { label: "Confirmed",        color: "#c9a96e", bg: "rgba(201,169,110,0.12)", dot: "#c9a96e" },
  processing:       { label: "Processing",       color: "#60a5fa", bg: "rgba(96,165,250,0.12)",  dot: "#60a5fa" },
  shipped:          { label: "Shipped",          color: "#a78bfa", bg: "rgba(167,139,250,0.12)", dot: "#a78bfa" },
  delivered:        { label: "Delivered",        color: "#4ade80", bg: "rgba(74,222,128,0.12)",  dot: "#4ade80" },
  cancelled:        { label: "Cancelled",        color: "#6b7280", bg: "rgba(107,114,128,0.12)", dot: "#6b7280" },
  return_requested: { label: "Return Requested", color: "#f97316", bg: "rgba(249,115,22,0.12)",  dot: "#f97316" },
  returned:         { label: "Returned",         color: "#94a3b8", bg: "rgba(148,163,184,0.12)", dot: "#94a3b8" },
  refunded:         { label: "Refunded",         color: "#34d399", bg: "rgba(52,211,153,0.12)",  dot: "#34d399" },
};

const PAYMENT_CONFIG: Record<PaymentStatus, { label: string; color: string }> = {
  pending:             { label: "Pending",          color: "#f59e0b" },
  paid:                { label: "Paid",             color: "#4ade80" },
  failed:              { label: "Failed",           color: "#ef4444" },
  refunded:            { label: "Refunded",         color: "#34d399" },
  partially_refunded:  { label: "Partial Refund",   color: "#f97316" },
};

const SHIPPING_LABELS: Record<string, string> = {
  standard: "Standard",
  express: "Express",
  next_day: "Next Day",
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  card: "Card",
  paypal: "PayPal",
  apple_pay: "Apple Pay",
};

type SortKey = "createdAt" | "total" | "orderNumber";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
}
function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}
function formatRevenue(n: number) {
  return `$${n.toLocaleString()}`;
}

// ─── Order Detail Modal ───────────────────────────────────────────────────────
function OrderDetailModal({ order, onClose }: { order: Order; onClose: () => void }) {
  const status = STATUS_CONFIG[order.status];
  const payment = PAYMENT_CONFIG[order.paymentStatus];

  const timeline: { label: string; done: boolean; current: boolean }[] = [
    { label: "Order Placed",    done: true,  current: false },
    { label: "Payment Confirmed", done: ["confirmed","processing","shipped","delivered","return_requested","returned","refunded"].includes(order.status), current: false },
    { label: "Processing",      done: ["processing","shipped","delivered","return_requested","returned","refunded"].includes(order.status), current: order.status === "processing" },
    { label: "Shipped",         done: ["shipped","delivered","return_requested","returned","refunded"].includes(order.status), current: order.status === "shipped" },
    { label: "Delivered",       done: ["delivered","return_requested","returned","refunded"].includes(order.status), current: order.status === "delivered" },
  ];

  return (
    <div className="adm-modal-backdrop" onClick={onClose}>
      <div className="adm-detail-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="adm-detail-header">
          <div>
            <p className="adm-detail-eyebrow">Order Details</p>
            <h2 className="adm-detail-title">{order.orderNumber}</h2>
            <p className="adm-detail-sub">Placed {formatDate(order.createdAt)} at {formatTime(order.createdAt)}</p>
          </div>
          <div className="adm-detail-header-right">
            <span className="adm-status-pill" style={{ color: status.color, background: status.bg }}>
              <span className="adm-status-dot" style={{ background: status.dot }} />
              {status.label}
            </span>
            <button className="adm-modal-close" onClick={onClose}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="adm-detail-body">
          {/* Customer */}
          <div className="adm-detail-section">
            <p className="adm-detail-section-label">Customer</p>
            <div className="adm-detail-customer">
              <div className="adm-detail-avatar">{order.customer.avatar}</div>
              <div>
                <p className="adm-detail-customer-name">{order.customer.name}</p>
                <p className="adm-detail-customer-email">{order.customer.email}</p>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="adm-detail-section">
            <p className="adm-detail-section-label">Items ({order.itemCount})</p>
            <div className="adm-detail-items">
              {order.items.map((item, i) => (
                <div key={i} className="adm-detail-item">
                  <div className="adm-detail-item-img" style={{ background: item.image }} />
                  <div className="adm-detail-item-info">
                    <p className="adm-detail-item-name">{item.name}</p>
                    <p className="adm-detail-item-qty">Qty: {item.qty}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment & Shipping */}
          <div className="adm-detail-grid-2">
            <div className="adm-detail-section">
              <p className="adm-detail-section-label">Payment</p>
              <div className="adm-detail-row">
                <span>Method</span>
                <span>{PAYMENT_METHOD_LABELS[order.paymentMethod]}</span>
              </div>
              <div className="adm-detail-row">
                <span>Status</span>
                <span style={{ color: payment.color }}>{payment.label}</span>
              </div>
              <div className="adm-detail-row adm-detail-row-total">
                <span>Total</span>
                <span>{formatRevenue(order.total)}</span>
              </div>
            </div>
            <div className="adm-detail-section">
              <p className="adm-detail-section-label">Shipping</p>
              <div className="adm-detail-row">
                <span>Method</span>
                <span>{SHIPPING_LABELS[order.shippingMethod]}</span>
              </div>
              <div className="adm-detail-row">
                <span>Destination</span>
                <span>{order.country}</span>
              </div>
              {order.trackingNumber && (
                <div className="adm-detail-row">
                  <span>Tracking</span>
                  <span className="adm-tracking-num">{order.trackingNumber}</span>
                </div>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className="adm-detail-section">
            <p className="adm-detail-section-label">Order Progress</p>
            <div className="adm-detail-timeline">
              {timeline.map((step, i) => (
                <div key={i} className="adm-tl-step">
                  <div className="adm-tl-track">
                    <div className={`adm-tl-dot ${step.done ? "adm-tl-dot-done" : ""} ${step.current ? "adm-tl-dot-current" : ""}`}>
                      {step.done && (
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      )}
                    </div>
                    {i < timeline.length - 1 && (
                      <div className={`adm-tl-line ${step.done ? "adm-tl-line-done" : ""}`} />
                    )}
                  </div>
                  <p className={`adm-tl-label ${step.done ? "adm-tl-label-done" : ""} ${step.current ? "adm-tl-label-current" : ""}`}>
                    {step.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="adm-detail-footer">
          <Link href={`/admin/orders/${order.id}`} className="adm-btn adm-btn-primary">
            View Full Details
          </Link>
          <button className="adm-btn adm-btn-ghost">Print Invoice</button>
          {["confirmed", "processing"].includes(order.status) && (
            <button className="adm-btn adm-btn-ghost">Mark Shipped</button>
          )}
          {order.status === "return_requested" && (
            <button className="adm-btn adm-btn-ghost" style={{ color: "#f97316", borderColor: "rgba(249,115,22,0.3)" }}>
              Process Return
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Order Row ────────────────────────────────────────────────────────────────
function OrderRow({
  order,
  onView,
  onStatusChange,
}: {
  order: Order;
  onView: (o: Order) => void;
  onStatusChange: (id: string, status: OrderStatus) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const status = STATUS_CONFIG[order.status];
  const payment = PAYMENT_CONFIG[order.paymentStatus];

  return (
    <tr className="adm-tr">
      {/* Order number */}
      <td className="adm-td adm-td-main">
        <div className="adm-order-num-cell">
          <button className="adm-order-num" onClick={() => onView(order)}>
            {order.orderNumber}
          </button>
          <p className="adm-order-date">{formatDate(order.createdAt)}</p>
        </div>
      </td>

      {/* Customer */}
      <td className="adm-td">
        <div className="adm-customer-cell">
          <div className="adm-avatar">{order.customer.avatar}</div>
          <div className="adm-customer-info">
            <p className="adm-customer-name">{order.customer.name}</p>
            <p className="adm-customer-country">{order.country}</p>
          </div>
        </div>
      </td>

      {/* Items */}
      <td className="adm-td adm-td-muted">
        <div className="adm-items-cell">
          <div className="adm-item-swatches">
            {order.items.slice(0, 3).map((item, i) => (
              <div
                key={i}
                className="adm-item-swatch"
                style={{ background: item.image, zIndex: order.items.length - i }}
                title={item.name}
              />
            ))}
          </div>
          <span className="adm-item-count">
            {order.itemCount} {order.itemCount === 1 ? "item" : "items"}
          </span>
        </div>
      </td>

      {/* Total */}
      <td className="adm-td">
        <span className="adm-total">{formatRevenue(order.total)}</span>
      </td>

      {/* Status */}
      <td className="adm-td">
        <span className="adm-status-pill" style={{ color: status.color, background: status.bg }}>
          <span className="adm-status-dot" style={{ background: status.dot }} />
          {status.label}
        </span>
      </td>

      {/* Payment */}
      <td className="adm-td">
        <div className="adm-payment-cell">
          <span className="adm-payment-status" style={{ color: payment.color }}>{payment.label}</span>
          <span className="adm-payment-method">{PAYMENT_METHOD_LABELS[order.paymentMethod]}</span>
        </div>
      </td>

      {/* Shipping */}
      <td className="adm-td adm-td-muted">
        <div className="adm-shipping-cell">
          <span>{SHIPPING_LABELS[order.shippingMethod]}</span>
          {order.trackingNumber && (
            <span className="adm-tracking-badge">Tracked</span>
          )}
        </div>
      </td>

      {/* Actions */}
      <td className="adm-td adm-td-actions">
        <div className="adm-row-actions">
          <button className="adm-icon-btn" title="View order" onClick={() => onView(order)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
          <Link href={`/admin/orders/${order.id}`} className="adm-icon-btn" title="Edit order">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </Link>
          <div className="adm-menu-wrap">
            <button className="adm-icon-btn" onClick={() => setMenuOpen(!menuOpen)} title="More">
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
                  <p className="adm-menu-label">Update Status</p>
                  {(["confirmed", "processing", "shipped", "delivered"] as OrderStatus[]).map((s) => (
                    <button
                      key={s}
                      className="adm-menu-item"
                      onClick={() => { onStatusChange(order.id, s); setMenuOpen(false); }}
                      style={order.status === s ? { color: STATUS_CONFIG[s].color } : {}}
                    >
                      <span className="adm-menu-dot" style={{ background: STATUS_CONFIG[s].dot }} />
                      {STATUS_CONFIG[s].label}
                    </button>
                  ))}
                  <div className="adm-menu-divider" />
                  <button className="adm-menu-item">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <polyline points="6 9 6 2 18 2 18 9" />
                      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                      <rect x="6" y="14" width="12" height="8" />
                    </svg>
                    Print Invoice
                  </button>
                  <button className="adm-menu-item">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    Email Customer
                  </button>
                  <div className="adm-menu-divider" />
                  <button
                    className="adm-menu-item adm-menu-item-danger"
                    onClick={() => { onStatusChange(order.id, "cancelled"); setMenuOpen(false); }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="15" y1="9" x2="9" y2="15" />
                      <line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                    Cancel Order
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
export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");
  const [sortBy, setSortBy] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<"desc" | "asc">("desc");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleStatusChange = (id: string, status: OrderStatus) => {
    setOrders((p) => p.map((o) => o.id === id ? { ...o, status } : o));
    showToast(`Order updated to ${STATUS_CONFIG[status].label}`);
  };

  const toggleSort = (col: SortKey) => {
    if (sortBy === col) setSortDir((d) => d === "desc" ? "asc" : "desc");
    else { setSortBy(col); setSortDir("desc"); }
  };

  // Filter & sort
  const filtered = useMemo(() => {
    let data = orders.filter((o) => {
      const q = search.toLowerCase();
      const matchSearch = !q
        || o.orderNumber.toLowerCase().includes(q)
        || o.customer.name.toLowerCase().includes(q)
        || o.customer.email.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || o.status === statusFilter;
      return matchSearch && matchStatus;
    });
    return data.sort((a, b) => {
      const mult = sortDir === "desc" ? -1 : 1;
      if (sortBy === "createdAt") return mult * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      if (sortBy === "total") return mult * (a.total - b.total);
      if (sortBy === "orderNumber") return mult * a.orderNumber.localeCompare(b.orderNumber);
      return 0;
    });
  }, [orders, search, statusFilter, sortBy, sortDir]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // Stats
  const totalRevenue = orders.filter((o) => o.paymentStatus === "paid").reduce((s, o) => s + o.total, 0);
  const pendingCount = orders.filter((o) => ["pending", "confirmed", "processing"].includes(o.status)).length;
  const shippedCount = orders.filter((o) => o.status === "shipped").length;
  const returnCount  = orders.filter((o) => ["return_requested", "returned"].includes(o.status)).length;

  const SortIcon = ({ col }: { col: SortKey }) => (
    <svg
      width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
      style={{
        opacity: sortBy === col ? 1 : 0.28,
        transform: sortBy === col && sortDir === "asc" ? "rotate(180deg)" : "none",
        transition: "transform 0.2s",
        flexShrink: 0,
      }}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );

  // Status counts for filter pills
  const statusCounts: Partial<Record<"all" | OrderStatus, number>> = { all: orders.length };
  orders.forEach((o) => { statusCounts[o.status] = (statusCounts[o.status] ?? 0) + 1; });

  const FILTER_PILLS: { key: "all" | OrderStatus; label: string }[] = [
    { key: "all",              label: "All" },
    { key: "pending",          label: "Pending" },
    { key: "confirmed",        label: "Confirmed" },
    { key: "processing",       label: "Processing" },
    { key: "shipped",          label: "Shipped" },
    { key: "delivered",        label: "Delivered" },
    { key: "return_requested", label: "Returns" },
    { key: "refunded",         label: "Refunded" },
    { key: "cancelled",        label: "Cancelled" },
  ];

  return (
    <div className="adm-page">
      {/* ── Header ── */}
      <div className="adm-header">
        <div className="adm-header-left">
          <nav className="adm-breadcrumb">
            <Link href="/admin">Dashboard</Link>
            <span className="adm-bc-sep">›</span>
            <span>Orders</span>
          </nav>
          <h1 className="adm-page-title">Orders</h1>
          <p className="adm-page-sub">Manage and fulfil customer orders</p>
        </div>
        <div className="adm-header-right">
          <button className="adm-btn adm-btn-ghost">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="adm-stats-row">
        {[
          { label: "Total Orders",   value: orders.length,              icon: "◎", accent: "#c9a96e" },
          { label: "Total Revenue",  value: `$${(totalRevenue/1000).toFixed(1)}k`, icon: "$", accent: "#4ade80" },
          { label: "Pending / Active", value: pendingCount,             icon: "◈", accent: "#f59e0b" },
          { label: "In Transit",     value: shippedCount,               icon: "↗", accent: "#a78bfa" },
          { label: "Returns",        value: returnCount,                icon: "↩", accent: "#f97316" },
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
              placeholder="Search order, customer, email…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
            {search && (
              <button className="adm-search-clear" onClick={() => { setSearch(""); setPage(1); }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Status filter pills */}
          <div className="adm-filter-pills">
            {FILTER_PILLS.map((f) => (
              <button
                key={f.key}
                className={`adm-filter-pill ${statusFilter === f.key ? "adm-filter-pill-active" : ""}`}
                onClick={() => { setStatusFilter(f.key); setPage(1); }}
              >
                {f.key !== "all" && (
                  <span className="adm-filter-dot" style={{ background: STATUS_CONFIG[f.key as OrderStatus]?.dot }} />
                )}
                {f.label}
                {statusCounts[f.key] !== undefined && (
                  <span className="adm-filter-count">{statusCounts[f.key]}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="adm-toolbar-right">
          <span className="adm-result-count">{filtered.length} order{filtered.length !== 1 ? "s" : ""}</span>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="adm-table-wrap">
        {paginated.length === 0 ? (
          <div className="adm-empty">
            <div className="adm-empty-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.9">
                <polyline points="9 11 12 14 22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
            </div>
            <p className="adm-empty-title">No orders found</p>
            <p className="adm-empty-sub">
              {search ? `No results for "${search}"` : "Orders will appear here once customers start purchasing."}
            </p>
          </div>
        ) : (
          <table className="adm-table">
            <thead>
              <tr className="adm-thead-tr">
                <th
                  className="adm-th adm-th-main adm-th-sortable"
                  onClick={() => toggleSort("orderNumber")}
                >
                  <span>Order</span> <SortIcon col="orderNumber" />
                </th>
                <th className="adm-th">Customer</th>
                <th className="adm-th">Items</th>
                <th
                  className="adm-th adm-th-sortable"
                  onClick={() => toggleSort("total")}
                >
                  <span>Total</span> <SortIcon col="total" />
                </th>
                <th className="adm-th">Status</th>
                <th className="adm-th">Payment</th>
                <th className="adm-th">Shipping</th>
                <th className="adm-th adm-th-actions"></th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((order) => (
                <OrderRow
                  key={order.id}
                  order={order}
                  onView={setSelectedOrder}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="adm-pagination">
          <span className="adm-page-info">
            Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
          </span>
          <div className="adm-page-btns">
            <button className="adm-page-btn" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              ← Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .reduce<(number | "…")[]>((acc, p, i, arr) => {
                if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("…");
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === "…" ? (
                  <span key={`ellipsis-${i}`} className="adm-page-ellipsis">…</span>
                ) : (
                  <button
                    key={p}
                    className={`adm-page-btn adm-page-num ${page === p ? "adm-page-active" : ""}`}
                    onClick={() => setPage(p as number)}
                  >
                    {p}
                  </button>
                )
              )}
            <button className="adm-page-btn" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
              Next →
            </button>
          </div>
        </div>
      )}

      {/* ── Order Detail Modal ── */}
      {selectedOrder && (
        <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className={`adm-toast ${toast.type === "error" ? "adm-toast-error" : ""}`}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            {toast.type === "error"
              ? <><circle cx="12" cy="12" r="10" /><path d="M15 9l-6 6M9 9l6 6" /></>
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
        .adm-header {
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
          cursor: pointer;
          border: none;
          transition: all 0.18s;
          white-space: nowrap;
          text-decoration: none;
        }
        .adm-btn-primary { background: #c9a96e; color: #0f0f0f; font-weight: 500; }
        .adm-btn-primary:hover { background: #d4b87e; }
        .adm-btn-ghost {
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.65);
          border: 1px solid rgba(255,255,255,0.1);
        }
        .adm-btn-ghost:hover { background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.9); }

        /* ── Stats ── */
        .adm-stats-row {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
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
          gap: 14px;
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
          width: 260px;
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
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 6px 11px;
          font-size: 11px;
          letter-spacing: 0.05em;
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
        .adm-filter-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
        .adm-filter-count {
          font-size: 10px;
          color: rgba(255,255,255,0.3);
          padding-left: 2px;
        }
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
        .adm-th-sortable {
          cursor: pointer;
          display: table-cell;
        }
        .adm-th-sortable span { display: inline-flex; align-items: center; gap: 5px; }
        .adm-th-sortable:hover { color: rgba(255,255,255,0.6); }
        .adm-th-actions { width: 110px; }
        .adm-th-main { min-width: 140px; }

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
        .adm-td-actions { text-align: right; }

        /* Order number cell */
        .adm-order-num-cell {}
        .adm-order-num {
          font-size: 13px;
          font-weight: 500;
          color: #c9a96e;
          letter-spacing: 0.08em;
          background: none;
          border: none;
          cursor: pointer;
          font-family: inherit;
          padding: 0;
          transition: opacity 0.2s;
          display: block;
          margin-bottom: 3px;
        }
        .adm-order-num:hover { opacity: 0.75; }
        .adm-order-date { font-size: 11px; color: rgba(255,255,255,0.28); }

        /* Customer cell */
        .adm-customer-cell { display: flex; align-items: center; gap: 10px; }
        .adm-avatar {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: rgba(201,169,110,0.15);
          border: 1px solid rgba(201,169,110,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 500;
          color: #c9a96e;
          letter-spacing: 0.04em;
          flex-shrink: 0;
        }
        .adm-customer-name { font-size: 13px; color: rgba(255,255,255,0.8); margin-bottom: 2px; }
        .adm-customer-country { font-size: 11px; color: rgba(255,255,255,0.28); }

        /* Items cell */
        .adm-items-cell { display: flex; align-items: center; gap: 10px; }
        .adm-item-swatches { display: flex; }
        .adm-item-swatch {
          width: 24px;
          height: 30px;
          border-radius: 2px;
          border: 1.5px solid #0f0f0f;
          margin-right: -6px;
          flex-shrink: 0;
        }
        .adm-item-count { font-size: 12px; color: rgba(255,255,255,0.38); padding-left: 4px; }

        /* Total */
        .adm-total { font-size: 14px; font-weight: 500; color: rgba(255,255,255,0.88); }

        /* Status */
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

        /* Payment cell */
        .adm-payment-cell { display: flex; flex-direction: column; gap: 2px; }
        .adm-payment-status { font-size: 12px; font-weight: 500; }
        .adm-payment-method { font-size: 11px; color: rgba(255,255,255,0.28); }

        /* Shipping cell */
        .adm-shipping-cell { display: flex; flex-direction: column; gap: 4px; }
        .adm-tracking-badge {
          display: inline-block;
          font-size: 9px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #4ade80;
          background: rgba(74,222,128,0.1);
          padding: 1px 5px;
          width: fit-content;
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

        /* Dropdown */
        .adm-menu-wrap { position: relative; }
        .adm-menu-backdrop { position: fixed; inset: 0; z-index: 50; }
        .adm-menu {
          position: absolute;
          right: 0;
          top: calc(100% + 4px);
          background: #1e1e1e;
          border: 1px solid rgba(255,255,255,0.12);
          min-width: 190px;
          z-index: 51;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
          animation: adm-menu-in 0.15s ease both;
        }
        @keyframes adm-menu-in {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .adm-menu-label {
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.25);
          padding: 10px 14px 6px;
        }
        .adm-menu-item {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 9px 14px;
          font-size: 12px;
          color: rgba(255,255,255,0.6);
          background: none;
          border: none;
          width: 100%;
          text-align: left;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.15s;
          border-bottom: 1px solid transparent;
        }
        .adm-menu-item:hover { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.9); }
        .adm-menu-item-danger { color: #f87171; }
        .adm-menu-item-danger:hover { background: rgba(239,68,68,0.1); color: #fca5a5; }
        .adm-menu-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
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
        .adm-empty-sub { font-size: 13px; color: rgba(255,255,255,0.28); }

        /* ── Pagination ── */
        .adm-pagination {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 0 4px;
          gap: 16px;
          flex-wrap: wrap;
        }
        .adm-page-info { font-size: 12px; color: rgba(255,255,255,0.3); }
        .adm-page-btns { display: flex; align-items: center; gap: 4px; }
        .adm-page-btn {
          padding: 6px 12px;
          font-size: 12px;
          border: 1px solid rgba(255,255,255,0.1);
          background: transparent;
          color: rgba(255,255,255,0.45);
          cursor: pointer;
          font-family: inherit;
          transition: all 0.15s;
        }
        .adm-page-btn:hover:not(:disabled) { border-color: rgba(255,255,255,0.2); color: rgba(255,255,255,0.8); }
        .adm-page-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        .adm-page-num { width: 34px; padding: 6px 0; text-align: center; }
        .adm-page-active { background: rgba(201,169,110,0.12) !important; border-color: rgba(201,169,110,0.3) !important; color: #c9a96e !important; }
        .adm-page-ellipsis { padding: 6px 6px; font-size: 12px; color: rgba(255,255,255,0.2); }

        /* ── Detail Modal ── */
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
          animation: adm-fade 0.2s ease;
        }
        @keyframes adm-fade { from { opacity: 0; } to { opacity: 1; } }
        .adm-detail-modal {
          background: #1a1a1a;
          border: 1px solid rgba(255,255,255,0.1);
          width: 100%;
          max-width: 620px;
          max-height: 90vh;
          overflow-y: auto;
          animation: adm-slide 0.25s ease;
          display: flex;
          flex-direction: column;
        }
        @keyframes adm-slide {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .adm-detail-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 24px 28px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.02);
          flex-shrink: 0;
        }
        .adm-detail-header-right { display: flex; align-items: center; gap: 12px; }
        .adm-detail-eyebrow {
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #c9a96e;
          margin-bottom: 6px;
        }
        .adm-detail-title {
          font-family: "Playfair Display", Georgia, serif;
          font-size: 22px;
          font-weight: 400;
          color: rgba(255,255,255,0.92);
          margin-bottom: 4px;
        }
        .adm-detail-sub { font-size: 12px; color: rgba(255,255,255,0.32); }
        .adm-modal-close {
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255,255,255,0.3);
          background: none;
          border: none;
          cursor: pointer;
          transition: color 0.2s;
        }
        .adm-modal-close:hover { color: rgba(255,255,255,0.8); }

        .adm-detail-body {
          padding: 20px 28px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          flex: 1;
        }
        .adm-detail-section { display: flex; flex-direction: column; gap: 10px; }
        .adm-detail-section-label {
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          margin-bottom: 2px;
        }
        .adm-detail-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

        /* Customer in modal */
        .adm-detail-customer { display: flex; align-items: center; gap: 12px; }
        .adm-detail-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(201,169,110,0.15);
          border: 1px solid rgba(201,169,110,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 500;
          color: #c9a96e;
          flex-shrink: 0;
        }
        .adm-detail-customer-name { font-size: 14px; color: rgba(255,255,255,0.85); margin-bottom: 3px; }
        .adm-detail-customer-email { font-size: 12px; color: rgba(255,255,255,0.3); }

        /* Items in modal */
        .adm-detail-items { display: flex; flex-direction: column; gap: 8px; }
        .adm-detail-item { display: flex; align-items: center; gap: 12px; padding: 10px 12px; background: rgba(255,255,255,0.03); }
        .adm-detail-item-img { width: 36px; height: 44px; flex-shrink: 0; border-radius: 1px; }
        .adm-detail-item-name { font-size: 13px; color: rgba(255,255,255,0.75); margin-bottom: 3px; }
        .adm-detail-item-qty { font-size: 11px; color: rgba(255,255,255,0.3); }

        /* Details rows */
        .adm-detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
          padding: 8px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.55);
        }
        .adm-detail-row:last-child { border-bottom: none; }
        .adm-detail-row span:last-child { color: rgba(255,255,255,0.8); }
        .adm-detail-row-total { font-size: 14px; font-weight: 500; }
        .adm-detail-row-total span:last-child { color: rgba(255,255,255,0.95); }
        .adm-tracking-num { font-family: "DM Mono", monospace; font-size: 11px; }

        /* Timeline in modal */
        .adm-detail-timeline { display: flex; align-items: flex-start; gap: 0; }
        .adm-tl-step { flex: 1; display: flex; flex-direction: column; align-items: center; position: relative; }
        .adm-tl-track { display: flex; align-items: center; width: 100%; margin-bottom: 8px; }
        .adm-tl-dot {
          width: 22px; height: 22px; border-radius: 50%;
          border: 1.5px solid rgba(255,255,255,0.15);
          background: transparent;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; position: relative; z-index: 1;
          color: rgba(255,255,255,0.3);
        }
        .adm-tl-dot-done { border-color: rgba(255,255,255,0.4); background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.7); }
        .adm-tl-dot-current { border-color: #c9a96e; background: rgba(201,169,110,0.15); color: #c9a96e; }
        .adm-tl-line { flex: 1; height: 1px; background: rgba(255,255,255,0.08); }
        .adm-tl-line-done { background: rgba(255,255,255,0.25); }
        .adm-tl-label { font-size: 10px; letter-spacing: 0.04em; color: rgba(255,255,255,0.28); text-align: center; }
        .adm-tl-label-done { color: rgba(255,255,255,0.5); }
        .adm-tl-label-current { color: #c9a96e; font-weight: 500; }

        /* Modal footer */
        .adm-detail-footer {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 16px 28px 20px;
          border-top: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.02);
          flex-shrink: 0;
          flex-wrap: wrap;
        }

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
        @media (max-width: 1200px) {
          .adm-stats-row { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 1000px) {
          .adm-page { padding: 20px; }
          .adm-stats-row { grid-template-columns: repeat(2, 1fr); }
          /* hide less critical columns on smaller screens */
          .adm-table th:nth-child(7),
          .adm-table td:nth-child(7) { display: none; }
        }
        @media (max-width: 768px) {
          .adm-header { flex-direction: column; }
          .adm-search { width: 100%; }
          .adm-filter-pills { gap: 3px; }
          .adm-filter-pill { padding: 5px 9px; font-size: 10px; }
          .adm-detail-grid-2 { grid-template-columns: 1fr; }
          .adm-detail-footer { flex-direction: column; align-items: stretch; }
          .adm-detail-footer .adm-btn { justify-content: center; }
        }
      `}</style>
    </div>
  );
}