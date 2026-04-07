"use client";

import { use, useState } from "react";
import Link from "next/link";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const ORDERS: Record<string, {
  id: string;
  date: string;
  status: "Delivered" | "Processing" | "Shipped" | "Returned" | "Cancelled";
  items: { id: number; name: string; category: string; size: string; color: string; colorLabel: string; qty: number; price: number; image: string }[];
  subtotal: number;
  discount: number;
  discountCode?: string;
  shipping: number;
  total: number;
  shippingMethod: string;
  address: { name: string; line1: string; line2?: string; city: string; postCode: string; country: string };
  tracking?: { carrier: string; number: string; url: string };
  timeline: { label: string; date: string; time: string; done: boolean; current: boolean }[];
  loyaltyEarned: number;
  paymentMethod: string;
  paymentLast4: string;
}> = {
  "ME-004821": {
    id: "ME-004821",
    date: "28 March 2025",
    status: "Delivered",
    items: [
      { id: 1, name: "Silk Slip Dress", category: "Dresses", size: "S", color: "#e8d5c0", colorLabel: "Sand", qty: 1, price: 285, image: "#e8d5c0" },
      { id: 2, name: "Linen Wide Trousers", category: "Trousers", size: "M", color: "#c8d5c0", colorLabel: "Sage", qty: 1, price: 195, image: "#c8d5c0" },
    ],
    subtotal: 480,
    discount: 0,
    shipping: 0,
    total: 480,
    shippingMethod: "Standard Delivery",
    address: { name: "Sophie Beaumont", line1: "12 Elara Lane", line2: "Kensington", city: "London", postCode: "SW1A 1AA", country: "United Kingdom" },
    tracking: { carrier: "DHL Express", number: "1234567890", url: "#" },
    timeline: [
      { label: "Order placed", date: "22 Mar", time: "10:14 AM", done: true, current: false },
      { label: "Payment confirmed", date: "22 Mar", time: "10:15 AM", done: true, current: false },
      { label: "Preparing your order", date: "23 Mar", time: "9:00 AM", done: true, current: false },
      { label: "Dispatched", date: "24 Mar", time: "2:30 PM", done: true, current: false },
      { label: "Out for delivery", date: "28 Mar", time: "8:00 AM", done: true, current: false },
      { label: "Delivered", date: "28 Mar", time: "1:42 PM", done: true, current: true },
    ],
    loyaltyEarned: 480,
    paymentMethod: "Visa",
    paymentLast4: "4242",
  },
  "ME-004756": {
    id: "ME-004756",
    date: "12 March 2025",
    status: "Delivered",
    items: [
      { id: 3, name: "Cashmere Turtleneck", category: "Knitwear", size: "M", color: "#d0c8d5", colorLabel: "Lavender", qty: 1, price: 320, image: "#d0c8d5" },
    ],
    subtotal: 320,
    discount: 32,
    discountCode: "ELARA10",
    shipping: 0,
    total: 288,
    shippingMethod: "Express Delivery",
    address: { name: "Sophie Beaumont", line1: "12 Elara Lane", line2: "Kensington", city: "London", postCode: "SW1A 1AA", country: "United Kingdom" },
    tracking: { carrier: "DHL Express", number: "0987654321", url: "#" },
    timeline: [
      { label: "Order placed", date: "10 Mar", time: "3:22 PM", done: true, current: false },
      { label: "Payment confirmed", date: "10 Mar", time: "3:23 PM", done: true, current: false },
      { label: "Preparing your order", date: "11 Mar", time: "8:00 AM", done: true, current: false },
      { label: "Dispatched", date: "11 Mar", time: "4:00 PM", done: true, current: false },
      { label: "Out for delivery", date: "12 Mar", time: "9:15 AM", done: true, current: false },
      { label: "Delivered", date: "12 Mar", time: "12:05 PM", done: true, current: true },
    ],
    loyaltyEarned: 288,
    paymentMethod: "Mastercard",
    paymentLast4: "1234",
  },
  "ME-004690": {
    id: "ME-004690",
    date: "2 March 2025",
    status: "Returned",
    items: [
      { id: 4, name: "Wrap Blazer", category: "Outerwear", size: "M", color: "#d5d0c0", colorLabel: "Stone", qty: 1, price: 410, image: "#d5d0c0" },
      { id: 5, name: "Merino Cardigan", category: "Knitwear", size: "S", color: "#c8d5e0", colorLabel: "Slate", qty: 1, price: 275, image: "#c8d5e0" },
    ],
    subtotal: 685,
    discount: 0,
    shipping: 0,
    total: 685,
    shippingMethod: "Standard Delivery",
    address: { name: "Sophie Beaumont", line1: "12 Elara Lane", city: "London", postCode: "SW1A 1AA", country: "United Kingdom" },
    timeline: [
      { label: "Order placed", date: "26 Feb", time: "11:00 AM", done: true, current: false },
      { label: "Payment confirmed", date: "26 Feb", time: "11:01 AM", done: true, current: false },
      { label: "Dispatched", date: "28 Feb", time: "3:00 PM", done: true, current: false },
      { label: "Delivered", date: "2 Mar", time: "10:30 AM", done: true, current: false },
      { label: "Return requested", date: "4 Mar", time: "2:15 PM", done: true, current: false },
      { label: "Return received", date: "8 Mar", time: "11:00 AM", done: true, current: true },
    ],
    loyaltyEarned: 0,
    paymentMethod: "Visa",
    paymentLast4: "4242",
  },
};

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  Delivered:  { color: "#2a7a4a", bg: "#f0faf4", label: "Delivered" },
  Processing: { color: "#b87333", bg: "#fff9f4", label: "Processing" },
  Shipped:    { color: "#3a6a9a", bg: "#f0f4fa", label: "Shipped" },
  Returned:   { color: "#8a8478", bg: "#f5f4f2", label: "Returned" },
  Cancelled:  { color: "#c0392b", bg: "#fff5f5", label: "Cancelled" },
};

// ─── Review Modal ─────────────────────────────────────────────────────────────
function ReviewModal({ item, onClose }: { item: { name: string; image: string }; onClose: () => void }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    setSubmitted(true);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {submitted ? (
          <div className="modal-success">
            <div className="modal-success-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h3 className="modal-success-title">Thank you for your review</h3>
            <p className="modal-success-sub">Your feedback helps our community dress with intention.</p>
            <button className="btn-primary" onClick={onClose} style={{ marginTop: 8 }}>Done</button>
          </div>
        ) : (
          <>
            <div className="modal-header">
              <div className="modal-item-preview">
                <div className="modal-item-img" style={{ background: item.image }} />
                <div>
                  <p className="modal-item-name">{item.name}</p>
                  <p className="modal-eyebrow">Write a Review</p>
                </div>
              </div>
            </div>

            <form className="modal-form" onSubmit={handleSubmit}>
              {/* Stars */}
              <div className="modal-field">
                <label className="modal-label">Your Rating</label>
                <div className="modal-stars">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      className="modal-star-btn"
                      onMouseEnter={() => setHover(s)}
                      onMouseLeave={() => setHover(0)}
                      onClick={() => setRating(s)}
                      aria-label={`${s} star${s > 1 ? "s" : ""}`}
                    >
                      <svg width="28" height="28" viewBox="0 0 24 24"
                        fill={(hover || rating) >= s ? "var(--gold)" : "none"}
                        stroke={(hover || rating) >= s ? "var(--gold)" : "var(--border)"}
                        strokeWidth="1.5"
                        style={{ transition: "all 0.15s" }}
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    </button>
                  ))}
                  {rating > 0 && (
                    <span className="modal-rating-label">
                      {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
                    </span>
                  )}
                </div>
              </div>

              <div className="modal-field">
                <label className="modal-label">Review Title</label>
                <input
                  type="text"
                  className="modal-input"
                  placeholder="Summarise your experience"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="modal-field">
                <label className="modal-label">Your Review</label>
                <textarea
                  className="modal-input modal-textarea"
                  placeholder="What did you love? How does it fit? Would you recommend it?"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="modal-cancel" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={rating === 0} style={{ opacity: rating === 0 ? 0.5 : 1 }}>
                  Submit Review
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function OrderDetailPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = use(params);
  const order = ORDERS[orderId];

  const [reviewItem, setReviewItem] = useState<{ name: string; image: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const copyTracking = () => {
    if (order?.tracking?.number) {
      navigator.clipboard.writeText(order.tracking.number).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // 404-like state
  if (!order) {
    return (
      <>
        <AnnouncementBar />
        <Navbar />
        <main className="od-not-found">
          <div className="od-not-found-inner">
            <div className="od-not-found-ornament">✦</div>
            <h1 className="od-not-found-title">Order Not Found</h1>
            <p className="od-not-found-sub">
              We couldn&apos;t find an order with the reference{" "}
              <strong>{orderId}</strong>. It may have been removed or the link is incorrect.
            </p>
            <Link href="/account" className="btn-primary">Return to My Account</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const status = STATUS_CONFIG[order.status];
  const canReturn = order.status === "Delivered";
  const canReview = order.status === "Delivered";

  return (
    <>
      <AnnouncementBar />
      <Navbar />

      <main className="od-page">

        {/* ── Hero / Header ── */}
        <section className="od-hero">
          <div className="od-hero-inner">
            <nav className="od-breadcrumb">
              <Link href="/">Home</Link>
              <span className="od-sep">·</span>
              <Link href="/account">My Account</Link>
              <span className="od-sep">·</span>
              <Link href="/account">Orders</Link>
              <span className="od-sep">·</span>
              <span>{order.id}</span>
            </nav>

            <div className="od-hero-row">
              <div>
                <div className="od-hero-id-row">
                  <h1 className="od-hero-title">Order <em>{order.id}</em></h1>
                  <span
                    className="od-status-badge"
                    style={{ color: status.color, background: status.bg, borderColor: status.color }}
                  >
                    {status.label}
                  </span>
                </div>
                <p className="od-hero-sub">Placed on {order.date}</p>
              </div>

              <div className="od-hero-actions">
                {canReturn && (
                  <Link href="/account/returns" className="od-action-btn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <polyline points="1 4 1 10 7 10" />
                      <path d="M3.51 15a9 9 0 1 0 .49-4.5" />
                    </svg>
                    Request Return
                  </Link>
                )}
                <button className="od-action-btn" onClick={() => window.print()}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <polyline points="6 9 6 2 18 2 18 9" />
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                    <rect x="6" y="14" width="12" height="8" />
                  </svg>
                  Print Receipt
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className="od-layout">

          {/* ── Left column ── */}
          <div className="od-left">

            {/* Order timeline */}
            <div className="od-card">
              <h2 className="od-card-title">Order Timeline</h2>
              <div className="od-timeline">
                {order.timeline.map((step, i) => (
                  <div
                    key={i}
                    className={`od-timeline-step ${step.done ? "od-step-done" : ""} ${step.current ? "od-step-current" : ""}`}
                  >
                    <div className="od-step-track">
                      <div className="od-step-dot">
                        {step.current && (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        )}
                        {step.done && !step.current && (
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        )}
                      </div>
                      {i < order.timeline.length - 1 && (
                        <div className={`od-step-line ${step.done ? "od-step-line-done" : ""}`} />
                      )}
                    </div>
                    <div className="od-step-content">
                      <p className="od-step-label">{step.label}</p>
                      {step.date && (
                        <p className="od-step-date">{step.date} · {step.time}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tracking */}
            {order.tracking && (
              <div className="od-card od-tracking-card">
                <div className="od-tracking-header">
                  <div>
                    <h2 className="od-card-title">Tracking</h2>
                    <p className="od-tracking-carrier">{order.tracking.carrier}</p>
                  </div>
                  <a
                    href={order.tracking.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="od-tracking-link"
                  >
                    Track on carrier site →
                  </a>
                </div>
                <div className="od-tracking-number-row">
                  <span className="od-tracking-num">{order.tracking.number}</span>
                  <button className="od-copy-btn" onClick={copyTracking}>
                    {copied ? (
                      <>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                        Copied
                      </>
                    ) : (
                      <>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Items */}
            <div className="od-card">
              <h2 className="od-card-title">
                {order.items.length} {order.items.length === 1 ? "Item" : "Items"}
              </h2>
              <div className="od-items">
                {order.items.map((item) => (
                  <div key={item.id} className="od-item">
                    <div className="od-item-img" style={{ background: item.image }}>
                      <span className="od-item-img-label">Product Image</span>
                    </div>
                    <div className="od-item-info">
                      <span className="od-item-cat">{item.category}</span>
                      <h3 className="od-item-name">{item.name}</h3>
                      <div className="od-item-meta">
                        <div className="od-meta-pill">
                          <span className="od-meta-swatch" style={{ background: item.color }} />
                          {item.colorLabel}
                        </div>
                        <div className="od-meta-pill">
                          Size: <strong>{item.size}</strong>
                        </div>
                        <div className="od-meta-pill">Qty: <strong>{item.qty}</strong></div>
                      </div>
                    </div>
                    <div className="od-item-right">
                      <span className="od-item-price">${item.price}</span>
                      {canReview && (
                        <button
                          className="od-review-btn"
                          onClick={() => setReviewItem({ name: item.name, image: item.image })}
                        >
                          Write a Review
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ── Right column ── */}
          <div className="od-right">

            {/* Order summary */}
            <div className="od-card od-summary-card">
              <h2 className="od-card-title">Order Summary</h2>
              <div className="od-summary-rows">
                <div className="od-summary-row">
                  <span>Subtotal</span>
                  <span>${order.subtotal}</span>
                </div>
                {order.discount > 0 && (
                  <div className="od-summary-row od-summary-discount">
                    <span>
                      Discount
                      {order.discountCode && (
                        <span className="od-discount-code"> ({order.discountCode})</span>
                      )}
                    </span>
                    <span>−${order.discount}</span>
                  </div>
                )}
                <div className="od-summary-row">
                  <span>Shipping</span>
                  <span>{order.shipping === 0 ? <span className="od-free">Free</span> : `$${order.shipping}`}</span>
                </div>
              </div>
              <div className="od-summary-divider" />
              <div className="od-summary-row od-summary-total">
                <span>Total</span>
                <span>${order.total}</span>
              </div>

              {order.loyaltyEarned > 0 && (
                <div className="od-loyalty-earned">
                  <span className="od-loyalty-icon">✦</span>
                  <span>+{order.loyaltyEarned} loyalty points earned</span>
                </div>
              )}
            </div>

            {/* Delivery details */}
            <div className="od-card">
              <h2 className="od-card-title">Delivery Details</h2>

              <div className="od-detail-block">
                <p className="od-detail-label">Shipping Method</p>
                <p className="od-detail-val">{order.shippingMethod}</p>
              </div>

              <div className="od-detail-block">
                <p className="od-detail-label">Delivery Address</p>
                <address className="od-address">
                  <p>{order.address.name}</p>
                  <p>{order.address.line1}</p>
                  {order.address.line2 && <p>{order.address.line2}</p>}
                  <p>{order.address.city}, {order.address.postCode}</p>
                  <p>{order.address.country}</p>
                </address>
              </div>
            </div>

            {/* Payment */}
            <div className="od-card">
              <h2 className="od-card-title">Payment</h2>
              <div className="od-payment-row">
                <div className="od-payment-chip">{order.paymentMethod}</div>
                <span className="od-payment-detail">
                  •••• •••• •••• {order.paymentLast4}
                </span>
              </div>
              <div className="od-detail-block" style={{ marginTop: 14 }}>
                <p className="od-detail-label">Amount charged</p>
                <p className="od-detail-val">${order.total}.00</p>
              </div>
            </div>

            {/* Help */}
            <div className="od-card od-help-card">
              <p className="od-help-title">Need help with this order?</p>
              <p className="od-help-sub">
                Our team is available Monday – Friday, 9am – 6pm GMT.
              </p>
              <div className="od-help-actions">
                <Link href="/help/contact" className="od-help-btn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  Contact Support
                </Link>
                <Link href="/help/returns" className="od-help-btn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <polyline points="1 4 1 10 7 10" />
                    <path d="M3.51 15a9 9 0 1 0 .49-4.5" />
                  </svg>
                  Returns Info
                </Link>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />

      {/* ── Review Modal ── */}
      {reviewItem && (
        <ReviewModal item={reviewItem} onClose={() => setReviewItem(null)} />
      )}

      <style>{`
        /* ── Page ── */
        .od-page { background: var(--cream); min-height: 80vh; }

        /* ── Hero ── */
        .od-hero {
          background: var(--cream-dark);
          border-bottom: 1px solid var(--border);
          padding: 48px 60px 40px;
        }
        .od-breadcrumb {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 20px;
        }
        .od-breadcrumb a { transition: color 0.2s; }
        .od-breadcrumb a:hover { color: var(--gold); }
        .od-sep { color: var(--border); }
        .od-hero-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
          flex-wrap: wrap;
        }
        .od-hero-id-row {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 8px;
          flex-wrap: wrap;
        }
        .od-hero-title {
          font-family: var(--font-display);
          font-size: clamp(28px, 3.5vw, 44px);
          font-weight: 400;
          color: var(--charcoal);
          line-height: 1.05;
          animation: fadeUp 0.6s ease both;
        }
        .od-hero-title em { font-style: italic; color: var(--gold); }
        .od-status-badge {
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          border: 1px solid;
          padding: 5px 14px;
          flex-shrink: 0;
          font-weight: 400;
        }
        .od-hero-sub {
          font-family: var(--font-editorial);
          font-size: 15px;
          color: var(--muted);
          font-weight: 300;
        }
        .od-hero-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          animation: fadeUp 0.6s 0.1s ease both;
        }
        .od-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 10px 20px;
          border: 1px solid var(--border);
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--charcoal-light);
          background: transparent;
          font-family: var(--font-body);
          cursor: pointer;
          transition: all 0.2s;
        }
        .od-action-btn:hover { border-color: var(--charcoal); color: var(--charcoal); }

        /* ── Layout ── */
        .od-layout {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 32px;
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 60px 80px;
          align-items: start;
        }

        /* ── Card ── */
        .od-card {
          border: 1px solid var(--border);
          background: var(--cream);
          padding: 28px 28px;
          margin-bottom: 20px;
          animation: fadeUp 0.4s ease both;
        }
        .od-card-title {
          font-family: var(--font-display);
          font-size: 18px;
          font-weight: 400;
          color: var(--charcoal);
          margin-bottom: 22px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--border);
        }

        /* ── Timeline ── */
        .od-timeline {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .od-timeline-step {
          display: flex;
          gap: 18px;
          align-items: flex-start;
        }
        .od-step-track {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex-shrink: 0;
          width: 24px;
        }
        .od-step-dot {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 2px solid var(--border);
          background: var(--cream);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--muted);
          flex-shrink: 0;
          position: relative;
          z-index: 1;
          transition: all 0.2s;
        }
        .od-step-done .od-step-dot {
          border-color: var(--charcoal-light);
          background: var(--cream-dark);
          color: var(--charcoal-light);
        }
        .od-step-current .od-step-dot {
          border-color: var(--charcoal);
          background: var(--charcoal);
          color: var(--cream);
        }
        .od-step-line {
          width: 1px;
          flex: 1;
          min-height: 32px;
          background: var(--border);
          margin: 4px 0;
        }
        .od-step-line-done { background: var(--charcoal-light); }
        .od-step-content {
          padding-bottom: 28px;
          flex: 1;
        }
        .od-timeline-step:last-child .od-step-content { padding-bottom: 0; }
        .od-step-label {
          font-size: 14px;
          color: var(--charcoal-light);
          font-weight: 400;
          margin-bottom: 3px;
          line-height: 1.3;
        }
        .od-step-done .od-step-label { color: var(--charcoal); }
        .od-step-current .od-step-label {
          color: var(--charcoal);
          font-weight: 500;
        }
        .od-step-date {
          font-size: 12px;
          color: var(--muted);
          letter-spacing: 0.03em;
        }

        /* ── Tracking ── */
        .od-tracking-card { background: var(--cream-dark); }
        .od-tracking-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }
        .od-tracking-carrier {
          font-size: 13px;
          color: var(--muted);
          margin-top: -14px;
          margin-bottom: 16px;
          font-family: var(--font-editorial);
          font-style: italic;
        }
        .od-tracking-link {
          font-size: 12px;
          color: var(--gold);
          letter-spacing: 0.04em;
          border-bottom: 1px solid var(--gold);
          padding-bottom: 1px;
          white-space: nowrap;
          transition: color 0.2s;
          flex-shrink: 0;
        }
        .od-tracking-link:hover { color: var(--charcoal); border-color: var(--charcoal); }
        .od-tracking-number-row {
          display: flex;
          align-items: center;
          gap: 12px;
          background: var(--cream);
          border: 1px solid var(--border);
          padding: 12px 16px;
        }
        .od-tracking-num {
          flex: 1;
          font-family: "DM Mono", "Courier New", monospace;
          font-size: 14px;
          color: var(--charcoal);
          letter-spacing: 0.08em;
        }
        .od-copy-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--charcoal-light);
          background: none;
          border: none;
          cursor: pointer;
          font-family: var(--font-body);
          transition: color 0.2s;
          padding: 4px 8px;
          flex-shrink: 0;
        }
        .od-copy-btn:hover { color: var(--gold); }

        /* ── Items ── */
        .od-items { display: flex; flex-direction: column; gap: 0; }
        .od-item {
          display: grid;
          grid-template-columns: 80px 1fr auto;
          gap: 18px;
          align-items: start;
          padding: 18px 0;
          border-bottom: 1px solid var(--border);
        }
        .od-item:first-child { padding-top: 0; }
        .od-item:last-child { border-bottom: none; padding-bottom: 0; }
        .od-item-img {
          height: 96px;
          border-radius: 1px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .od-item-img-label {
          font-family: var(--font-editorial);
          font-size: 10px;
          color: rgba(0,0,0,0.22);
          letter-spacing: 0.06em;
        }
        .od-item-cat {
          display: block;
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 4px;
        }
        .od-item-name {
          font-family: var(--font-display);
          font-size: 16px;
          font-weight: 400;
          color: var(--charcoal);
          margin-bottom: 10px;
        }
        .od-item-meta {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }
        .od-meta-pill {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          color: var(--muted);
          background: var(--cream-dark);
          border: 1px solid var(--border);
          padding: 3px 8px;
          letter-spacing: 0.03em;
        }
        .od-meta-swatch {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
          box-shadow: 0 0 0 1px var(--border);
        }
        .od-item-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 10px;
          flex-shrink: 0;
        }
        .od-item-price {
          font-family: var(--font-display);
          font-size: 18px;
          font-weight: 400;
          color: var(--charcoal);
        }
        .od-review-btn {
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--gold);
          background: none;
          border: none;
          border-bottom: 1px solid var(--gold);
          padding-bottom: 1px;
          cursor: pointer;
          font-family: var(--font-body);
          transition: color 0.2s;
          white-space: nowrap;
        }
        .od-review-btn:hover { color: var(--charcoal); border-color: var(--charcoal); }

        /* ── Summary card ── */
        .od-summary-card { background: var(--cream-dark); }
        .od-summary-rows { display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px; }
        .od-summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
          color: var(--charcoal-light);
        }
        .od-summary-discount { color: #2a7a4a; }
        .od-discount-code {
          font-size: 11px;
          letter-spacing: 0.06em;
        }
        .od-free { color: #2a7a4a; }
        .od-summary-divider { height: 1px; background: var(--border); margin: 4px 0 14px; }
        .od-summary-total {
          font-size: 17px;
          font-weight: 500;
          color: var(--charcoal);
        }
        .od-loyalty-earned {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 16px;
          padding: 10px 14px;
          background: var(--cream);
          border: 1px solid var(--border);
          font-size: 12px;
          color: var(--muted);
          letter-spacing: 0.04em;
        }
        .od-loyalty-icon { color: var(--gold); font-size: 10px; }

        /* ── Detail blocks ── */
        .od-detail-block { margin-bottom: 16px; }
        .od-detail-block:last-child { margin-bottom: 0; }
        .od-detail-label {
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 6px;
        }
        .od-detail-val { font-size: 14px; color: var(--charcoal); }
        .od-address {
          font-style: normal;
          font-size: 13px;
          color: var(--charcoal-light);
          line-height: 1.7;
        }

        /* ── Payment ── */
        .od-payment-row { display: flex; align-items: center; gap: 12px; }
        .od-payment-chip {
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          border: 1px solid var(--border);
          padding: 4px 10px;
          color: var(--muted);
        }
        .od-payment-detail { font-size: 13px; color: var(--charcoal-light); letter-spacing: 0.06em; }

        /* ── Help card ── */
        .od-help-card { background: var(--cream-dark); }
        .od-help-title {
          font-family: var(--font-display);
          font-size: 16px;
          font-weight: 400;
          color: var(--charcoal);
          margin-bottom: 6px;
        }
        .od-help-sub {
          font-family: var(--font-editorial);
          font-size: 13px;
          color: var(--muted);
          font-weight: 300;
          margin-bottom: 18px;
          line-height: 1.6;
        }
        .od-help-actions { display: flex; flex-direction: column; gap: 8px; }
        .od-help-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 11px 16px;
          border: 1px solid var(--border);
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--charcoal-light);
          background: var(--cream);
          font-family: var(--font-body);
          transition: all 0.2s;
        }
        .od-help-btn:hover { border-color: var(--charcoal); color: var(--charcoal); }

        /* ── Not found ── */
        .od-not-found {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          padding: 60px 20px;
          background: var(--cream);
        }
        .od-not-found-inner {
          text-align: center;
          max-width: 420px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
        }
        .od-not-found-ornament { font-size: 22px; color: var(--gold); opacity: 0.5; }
        .od-not-found-title {
          font-family: var(--font-display);
          font-size: 32px;
          font-weight: 400;
          color: var(--charcoal);
        }
        .od-not-found-sub {
          font-family: var(--font-editorial);
          font-size: 16px;
          color: var(--muted);
          font-weight: 300;
          line-height: 1.7;
          margin-bottom: 8px;
        }

        /* ── Review Modal ── */
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(26,26,26,0.52);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 200;
          backdrop-filter: blur(4px);
          padding: 20px;
          animation: fadeIn 0.2s ease both;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .modal-box {
          background: var(--cream);
          width: 100%;
          max-width: 500px;
          position: relative;
          animation: slideUp 0.3s ease both;
          max-height: 90vh;
          overflow-y: auto;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .modal-close-btn {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--muted);
          transition: color 0.2s;
          z-index: 2;
        }
        .modal-close-btn:hover { color: var(--charcoal); }
        .modal-header {
          padding: 24px 28px 20px;
          border-bottom: 1px solid var(--border);
          background: var(--cream-dark);
        }
        .modal-item-preview { display: flex; align-items: center; gap: 14px; }
        .modal-item-img {
          width: 52px;
          height: 64px;
          flex-shrink: 0;
          border-radius: 1px;
        }
        .modal-item-name {
          font-family: var(--font-display);
          font-size: 16px;
          font-weight: 400;
          color: var(--charcoal);
          margin-bottom: 4px;
        }
        .modal-eyebrow {
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--gold);
        }
        .modal-form { padding: 24px 28px; display: flex; flex-direction: column; gap: 18px; }
        .modal-field { display: flex; flex-direction: column; gap: 8px; }
        .modal-label {
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--charcoal-light);
        }
        .modal-stars { display: flex; align-items: center; gap: 4px; }
        .modal-star-btn { padding: 2px; transition: transform 0.1s; }
        .modal-star-btn:hover { transform: scale(1.1); }
        .modal-rating-label {
          font-size: 12px;
          color: var(--gold);
          letter-spacing: 0.06em;
          margin-left: 8px;
        }
        .modal-input {
          padding: 12px 14px;
          border: 1px solid var(--border);
          background: var(--white);
          font-size: 14px;
          color: var(--charcoal);
          font-family: var(--font-body);
          outline: none;
          transition: border-color 0.2s;
          width: 100%;
        }
        .modal-input:focus { border-color: var(--charcoal); }
        .modal-input::placeholder { color: var(--muted); }
        .modal-textarea { resize: vertical; min-height: 100px; }
        .modal-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
          padding-top: 4px;
          border-top: 1px solid var(--border);
        }
        .modal-cancel {
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--muted);
          background: none;
          border: none;
          cursor: pointer;
          font-family: var(--font-body);
          transition: color 0.2s;
        }
        .modal-cancel:hover { color: var(--charcoal); }

        /* Success state */
        .modal-success {
          padding: 52px 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 12px;
        }
        .modal-success-icon {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: var(--cream-dark);
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #2a7a4a;
          margin-bottom: 8px;
        }
        .modal-success-title {
          font-family: var(--font-display);
          font-size: 22px;
          font-weight: 400;
          color: var(--charcoal);
        }
        .modal-success-sub {
          font-family: var(--font-editorial);
          font-size: 15px;
          color: var(--muted);
          font-weight: 300;
          max-width: 320px;
        }

        /* ── Responsive ── */
        @media (max-width: 1100px) {
          .od-layout { grid-template-columns: 1fr 320px; padding: 36px 40px 60px; }
          .od-hero { padding: 40px 40px 32px; }
        }
        @media (max-width: 900px) {
          .od-layout { grid-template-columns: 1fr; padding: 24px 20px 60px; }
          .od-right { display: contents; }
          .od-summary-card { order: -1; }
          .od-hero { padding: 36px 20px 28px; }
        }
        @media (max-width: 600px) {
          .od-item { grid-template-columns: 68px 1fr; }
          .od-item-right { grid-column: 2; flex-direction: row; align-items: center; justify-content: space-between; }
          .od-hero-row { flex-direction: column; align-items: flex-start; }
          .od-card { padding: 20px; }
        }
      `}</style>
    </>
  );
}