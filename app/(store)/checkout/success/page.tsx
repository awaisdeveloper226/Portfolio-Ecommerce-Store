"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ─── Mock order data ──────────────────────────────────────────────────────────
const MOCK_ORDER = {
  orderNumber: "ME-005012",
  date: "8 April 2025",
  estimatedDelivery: "11 – 14 April 2025",
  shippingMethod: "Standard Delivery",
  email: "customer@example.com",
  items: [
    { id: 1, name: "Silk Slip Dress",      variant: "Sand · Size S",    qty: 1, price: 285, color: "#e8d5c0" },
    { id: 2, name: "Linen Wide Trousers",  variant: "Sage · Size M",    qty: 2, price: 195, color: "#c8d5c0" },
    { id: 3, name: "Cashmere Turtleneck",  variant: "Charcoal · Size S",qty: 1, price: 320, color: "#d0c8d5" },
  ],
  subtotal: 995,
  discount: 0,
  shipping: 0,
  total: 995,
  loyaltyEarned: 995,
  address: {
    name: "Sophie Beaumont",
    line1: "12 Elara Lane",
    line2: "Kensington",
    city: "London",
    postCode: "SW1A 1AA",
    country: "United Kingdom",
  },
  paymentMethod: "Visa",
  paymentLast4: "4242",
};

// ─── Confetti particle ────────────────────────────────────────────────────────
function ConfettiParticle({ delay, left, color }: { delay: number; left: number; color: string }) {
  return (
    <div
      className="confetti-particle"
      style={{
        left: `${left}%`,
        animationDelay: `${delay}s`,
        background: color,
      }}
    />
  );
}

// ─── Animated checkmark ───────────────────────────────────────────────────────
function CheckCircle() {
  return (
    <div className="check-circle">
      <svg
        className="check-svg"
        width="56"
        height="56"
        viewBox="0 0 56 56"
        fill="none"
      >
        <circle
          className="check-ring"
          cx="28"
          cy="28"
          r="26"
          stroke="var(--gold)"
          strokeWidth="2"
          fill="none"
        />
        <path
          className="check-tick"
          d="M16 28L24 36L40 20"
          stroke="var(--gold)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>
  );
}

// ─── Order Timeline ───────────────────────────────────────────────────────────
const TIMELINE_STEPS = [
  { label: "Order Confirmed",     icon: "✓", active: true,  done: true  },
  { label: "Preparing",           icon: "◈", active: false, done: false },
  { label: "Dispatched",          icon: "↗", active: false, done: false },
  { label: "Out for Delivery",    icon: "◎", active: false, done: false },
  { label: "Delivered",           icon: "✦", active: false, done: false },
];

function OrderTimeline() {
  return (
    <div className="scs-timeline-wrap">
      {TIMELINE_STEPS.map((step, i) => (
        <div key={i} className={`scs-tl-step ${step.done ? "scs-tl-done" : ""} ${step.active ? "scs-tl-active" : ""}`}>
          <div className="scs-tl-track">
            <div className="scs-tl-dot">
              <span className="scs-tl-icon">{step.icon}</span>
            </div>
            {i < TIMELINE_STEPS.length - 1 && (
              <div className={`scs-tl-line ${step.done ? "scs-tl-line-done" : ""}`} />
            )}
          </div>
          <p className="scs-tl-label">{step.label}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Suggested products ───────────────────────────────────────────────────────
const SUGGESTED = [
  { id: 5,  name: "Fluid Midi Skirt",   price: 175, color: "#ddc5b5", tag: null          },
  { id: 8,  name: "Satin Cami Top",     price: 95,  color: "#ddd5c5", tag: "Bestseller"  },
  { id: 15, name: "Merino Cardigan",    price: 275, color: "#c8d5e0", tag: null          },
  { id: 16, name: "Linen Co-ord Set",   price: 320, color: "#e0dac8", tag: "Bestseller"  },
];

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderNumber?: string }>;
}) {
  const sp = use(searchParams);
  const orderNumber = sp.orderNumber ?? MOCK_ORDER.orderNumber;
  const order = MOCK_ORDER; // In production: fetch by orderNumber

  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Confetti config
  const CONFETTI_COLORS = ["#c9a96e", "#e8d5b0", "#d0c8d5", "#c8d5c0", "#1a1a1a"];
  const confettiParticles = Array.from({ length: 28 }, (_, i) => ({
    delay: Math.random() * 1.2,
    left: Math.random() * 100,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  }));

  return (
    <>
      <AnnouncementBar />
      <Navbar />

      <main className="scs-page">

        {/* ── Confetti ── */}
        <div className="scs-confetti" aria-hidden="true">
          {confettiParticles.map((p, i) => (
            <ConfettiParticle key={i} {...p} />
          ))}
        </div>

        {/* ── Hero confirmation band ── */}
        <section className="scs-hero" style={{ opacity: revealed ? 1 : 0, transform: revealed ? "none" : "translateY(16px)", transition: "opacity 0.7s ease, transform 0.7s ease" }}>
          <div className="scs-hero-inner">
            <CheckCircle />

            <div className="scs-hero-text">
              <span className="scs-eyebrow">Order Confirmed</span>
              <h1 className="scs-hero-title">
                Thank you,{" "}
                <em>{order.address.name.split(" ")[0]}.</em>
              </h1>
              <p className="scs-hero-sub">
                Your order <strong>{orderNumber}</strong> is confirmed. We&apos;ll
                send a shipping update to <strong>{order.email}</strong> once
                your pieces are on their way.
              </p>
            </div>

            <div className="scs-hero-meta">
              <div className="scs-meta-pill">
                <span className="scs-meta-label">Order</span>
                <span className="scs-meta-val">{orderNumber}</span>
              </div>
              <div className="scs-meta-sep" />
              <div className="scs-meta-pill">
                <span className="scs-meta-label">Estimated Delivery</span>
                <span className="scs-meta-val">{order.estimatedDelivery}</span>
              </div>
              <div className="scs-meta-sep" />
              <div className="scs-meta-pill">
                <span className="scs-meta-label">Loyalty Points Earned</span>
                <span className="scs-meta-val scs-gold">+{order.loyaltyEarned} pts</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Order Progress Timeline ── */}
        <section className="scs-progress-section">
          <div className="scs-progress-inner">
            <h2 className="scs-section-title">Order Progress</h2>
            <OrderTimeline />
          </div>
        </section>

        {/* ── Main layout: items + sidebar ── */}
        <div className="scs-layout">

          {/* ── Left: Items + Delivery ── */}
          <div className="scs-left">

            {/* Items */}
            <div className="scs-card">
              <h2 className="scs-card-title">
                {order.items.length} {order.items.length === 1 ? "Item" : "Items"} Ordered
              </h2>
              <div className="scs-items">
                {order.items.map((item) => (
                  <div key={item.id} className="scs-item">
                    <div className="scs-item-img" style={{ background: item.color }}>
                      <span className="scs-item-img-label">Product Image</span>
                      {item.qty > 1 && (
                        <span className="scs-item-qty-badge">{item.qty}</span>
                      )}
                    </div>
                    <div className="scs-item-info">
                      <h3 className="scs-item-name">{item.name}</h3>
                      <p className="scs-item-variant">{item.variant}</p>
                    </div>
                    <span className="scs-item-price">
                      ${item.price * item.qty}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery info */}
            <div className="scs-card scs-delivery-card">
              <h2 className="scs-card-title">Delivery Details</h2>

              <div className="scs-detail-grid">
                <div className="scs-detail-block">
                  <p className="scs-detail-label">Shipping to</p>
                  <address className="scs-address">
                    <p>{order.address.name}</p>
                    <p>{order.address.line1}</p>
                    {order.address.line2 && <p>{order.address.line2}</p>}
                    <p>{order.address.city}, {order.address.postCode}</p>
                    <p>{order.address.country}</p>
                  </address>
                </div>

                <div className="scs-detail-block">
                  <p className="scs-detail-label">Shipping Method</p>
                  <p className="scs-detail-val">{order.shippingMethod}</p>
                  <p className="scs-detail-sub">Est. arrival {order.estimatedDelivery}</p>
                </div>

                <div className="scs-detail-block">
                  <p className="scs-detail-label">Payment</p>
                  <div className="scs-payment-row">
                    <span className="scs-payment-chip">{order.paymentMethod}</span>
                    <span className="scs-payment-detail">•••• {order.paymentLast4}</span>
                  </div>
                </div>

                <div className="scs-detail-block">
                  <p className="scs-detail-label">Confirmation sent to</p>
                  <p className="scs-detail-val">{order.email}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="scs-actions-row">
              <Link href={`/account/orders/${orderNumber}`} className="scs-action-btn scs-action-primary">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                View Order Details
              </Link>
              <button className="scs-action-btn" onClick={() => window.print()}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <polyline points="6 9 6 2 18 2 18 9" />
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                  <rect x="6" y="14" width="12" height="8" />
                </svg>
                Print Receipt
              </button>
              <Link href="/help/contact" className="scs-action-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                Contact Support
              </Link>
            </div>
          </div>

          {/* ── Right: Summary + Loyalty ── */}
          <div className="scs-right">

            {/* Order summary */}
            <div className="scs-card scs-summary-card">
              <h2 className="scs-card-title">Order Summary</h2>
              <div className="scs-summary-rows">
                <div className="scs-summary-row">
                  <span>Subtotal</span>
                  <span>${order.subtotal}</span>
                </div>
                {order.discount > 0 && (
                  <div className="scs-summary-row scs-discount">
                    <span>Discount</span>
                    <span>−${order.discount}</span>
                  </div>
                )}
                <div className="scs-summary-row">
                  <span>Shipping</span>
                  <span className="scs-free">Free</span>
                </div>
              </div>
              <div className="scs-summary-divider" />
              <div className="scs-summary-row scs-total">
                <span>Total Charged</span>
                <span>${order.total}</span>
              </div>
            </div>

            {/* Loyalty card */}
            <div className="scs-card scs-loyalty-card">
              <div className="scs-loyalty-ornament">✦</div>
              <p className="scs-loyalty-title">Points Earned</p>
              <p className="scs-loyalty-num">+{order.loyaltyEarned}</p>
              <p className="scs-loyalty-sub">
                These points have been added to your account. Redeem them on
                your next order for exclusive discounts.
              </p>
              <Link href="/account" className="scs-loyalty-link">
                View your account →
              </Link>
            </div>

            {/* What happens next */}
            <div className="scs-card scs-next-card">
              <h2 className="scs-card-title">What Happens Next</h2>
              <div className="scs-next-steps">
                {[
                  { icon: "✉", label: "Confirmation email sent to your inbox" },
                  { icon: "◈", label: "We'll prepare your order within 24 hours" },
                  { icon: "↗", label: "Tracking link emailed when dispatched" },
                  { icon: "✦", label: "Your pieces arrive " + order.estimatedDelivery },
                ].map((step, i) => (
                  <div key={i} className="scs-next-step">
                    <span className="scs-next-icon">{step.icon}</span>
                    <span className="scs-next-label">{step.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Return policy reminder */}
            <div className="scs-policy-note">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 1 0 .49-4.5" />
              </svg>
              Free 30-day returns on all items.{" "}
              <Link href="/help/returns" className="scs-policy-link">
                View return policy →
              </Link>
            </div>
          </div>
        </div>

        {/* ── You May Also Love ── */}
        <section className="scs-suggested">
          <div className="scs-suggested-header">
            <div className="scs-rule" />
            <h2 className="scs-suggested-title">You May Also Love</h2>
            <div className="scs-rule" />
          </div>
          <div className="scs-suggested-grid">
            {SUGGESTED.map((p) => (
              <div key={p.id} className="scs-sugg-card">
                <div className="scs-sugg-img" style={{ background: p.color }}>
                  <span className="scs-sugg-img-label">Product Image</span>
                  {p.tag && (
                    <span className="scs-sugg-tag tag-best">{p.tag}</span>
                  )}
                  <button className="scs-sugg-add">Add to Cart</button>
                </div>
                <h3 className="scs-sugg-name">{p.name}</h3>
                <p className="scs-sugg-price">${p.price}</p>
              </div>
            ))}
          </div>
          <div className="scs-suggested-cta">
            <Link href="/shop" className="btn-primary">
              Continue Shopping
            </Link>
          </div>
        </section>

      </main>

      <Footer />

      <style>{`
        /* ── Page ── */
        .scs-page {
          background: var(--cream);
          min-height: 80vh;
          position: relative;
          overflow-x: hidden;
        }

        /* ── Confetti ── */
        .scs-confetti {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 50;
          overflow: hidden;
        }
        .confetti-particle {
          position: absolute;
          top: -10px;
          width: 7px;
          height: 7px;
          opacity: 0;
          animation: confetti-fall 2.4s ease-in both;
        }
        @keyframes confetti-fall {
          0%   { opacity: 1; transform: translateY(0) rotate(0deg) scale(1); }
          80%  { opacity: 0.8; }
          100% { opacity: 0; transform: translateY(100vh) rotate(480deg) scale(0.6); }
        }

        /* ── Checkmark ── */
        .check-circle {
          flex-shrink: 0;
          animation: pop-in 0.5s 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        @keyframes pop-in {
          from { opacity: 0; transform: scale(0.5); }
          to   { opacity: 1; transform: scale(1); }
        }
        .check-ring {
          stroke-dasharray: 164;
          stroke-dashoffset: 164;
          animation: draw-ring 0.6s 0.3s ease forwards;
        }
        @keyframes draw-ring {
          to { stroke-dashoffset: 0; }
        }
        .check-tick {
          stroke-dasharray: 40;
          stroke-dashoffset: 40;
          animation: draw-tick 0.4s 0.8s ease forwards;
        }
        @keyframes draw-tick {
          to { stroke-dashoffset: 0; }
        }

        /* ── Hero ── */
        .scs-hero {
          background: var(--cream-dark);
          border-bottom: 1px solid var(--border);
          padding: 56px 60px 48px;
        }
        .scs-hero-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 28px;
        }
        .scs-eyebrow {
          display: block;
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 10px;
        }
        .scs-hero-title {
          font-family: var(--font-display);
          font-size: clamp(36px, 4.5vw, 58px);
          font-weight: 400;
          color: var(--charcoal);
          line-height: 1.08;
          margin-bottom: 12px;
        }
        .scs-hero-title em { font-style: italic; color: var(--gold); }
        .scs-hero-sub {
          font-family: var(--font-editorial);
          font-size: 16px;
          font-weight: 300;
          color: var(--muted);
          line-height: 1.75;
          max-width: 520px;
        }
        .scs-hero-sub strong { color: var(--charcoal); font-weight: 400; }

        .scs-hero-meta {
          display: flex;
          align-items: center;
          gap: 0;
          border: 1px solid var(--border);
          flex-wrap: wrap;
          animation: fadeUp 0.6s 0.3s ease both;
        }
        .scs-meta-pill {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 14px 24px;
        }
        .scs-meta-sep {
          width: 1px;
          height: 44px;
          background: var(--border);
          flex-shrink: 0;
        }
        .scs-meta-label {
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--muted);
        }
        .scs-meta-val {
          font-size: 15px;
          color: var(--charcoal);
          font-weight: 400;
        }
        .scs-gold { color: var(--gold) !important; }

        /* ── Progress ── */
        .scs-progress-section {
          border-bottom: 1px solid var(--border);
          padding: 36px 60px;
          background: var(--cream);
        }
        .scs-progress-inner {
          max-width: 1200px;
          margin: 0 auto;
        }
        .scs-section-title {
          font-family: var(--font-display);
          font-size: 18px;
          font-weight: 400;
          color: var(--charcoal);
          margin-bottom: 24px;
        }
        .scs-timeline-wrap {
          display: flex;
          align-items: flex-start;
          gap: 0;
        }
        .scs-tl-step {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }
        .scs-tl-track {
          display: flex;
          align-items: center;
          width: 100%;
          margin-bottom: 10px;
        }
        .scs-tl-dot {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1.5px solid var(--border);
          background: var(--cream);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          position: relative;
          z-index: 1;
          transition: all 0.3s;
        }
        .scs-tl-icon {
          font-size: 11px;
          color: var(--muted);
        }
        .scs-tl-done .scs-tl-dot {
          background: var(--charcoal);
          border-color: var(--charcoal);
        }
        .scs-tl-done .scs-tl-icon { color: var(--cream); }
        .scs-tl-active .scs-tl-dot {
          background: var(--gold);
          border-color: var(--gold);
          box-shadow: 0 0 0 4px rgba(201,169,110,0.2);
          animation: pulse-dot 2s infinite;
        }
        @keyframes pulse-dot {
          0%, 100% { box-shadow: 0 0 0 4px rgba(201,169,110,0.2); }
          50%       { box-shadow: 0 0 0 8px rgba(201,169,110,0.08); }
        }
        .scs-tl-active .scs-tl-icon { color: var(--cream); }
        .scs-tl-line {
          flex: 1;
          height: 1.5px;
          background: var(--border);
        }
        .scs-tl-line-done { background: var(--charcoal); }
        .scs-tl-label {
          font-size: 11px;
          letter-spacing: 0.06em;
          color: var(--muted);
          text-align: center;
        }
        .scs-tl-done .scs-tl-label { color: var(--charcoal); }
        .scs-tl-active .scs-tl-label { color: var(--gold); font-weight: 500; }

        /* ── Layout ── */
        .scs-layout {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 32px;
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 60px 64px;
          align-items: start;
        }

        /* ── Card ── */
        .scs-card {
          border: 1px solid var(--border);
          background: var(--cream);
          padding: 28px;
          margin-bottom: 20px;
          animation: fadeUp 0.5s ease both;
        }
        .scs-card-title {
          font-family: var(--font-display);
          font-size: 18px;
          font-weight: 400;
          color: var(--charcoal);
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--border);
        }

        /* ── Items ── */
        .scs-items { display: flex; flex-direction: column; gap: 0; }
        .scs-item {
          display: grid;
          grid-template-columns: 72px 1fr auto;
          gap: 16px;
          align-items: center;
          padding: 16px 0;
          border-bottom: 1px solid var(--border);
        }
        .scs-item:first-child { padding-top: 0; }
        .scs-item:last-child { border-bottom: none; padding-bottom: 0; }
        .scs-item-img {
          height: 88px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 1px;
          flex-shrink: 0;
        }
        .scs-item-img-label {
          font-family: var(--font-editorial);
          font-size: 10px;
          color: rgba(0,0,0,0.22);
          letter-spacing: 0.06em;
        }
        .scs-item-qty-badge {
          position: absolute;
          top: -7px;
          right: -7px;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--charcoal);
          color: var(--cream);
          font-size: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .scs-item-name {
          font-family: var(--font-display);
          font-size: 15px;
          font-weight: 400;
          color: var(--charcoal);
          margin-bottom: 4px;
        }
        .scs-item-variant { font-size: 12px; color: var(--muted); }
        .scs-item-price {
          font-family: var(--font-display);
          font-size: 16px;
          font-weight: 400;
          color: var(--charcoal);
          flex-shrink: 0;
        }

        /* ── Delivery ── */
        .scs-delivery-card { background: var(--cream-dark); }
        .scs-detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px 32px;
        }
        .scs-detail-block {}
        .scs-detail-label {
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 6px;
        }
        .scs-detail-val { font-size: 14px; color: var(--charcoal); }
        .scs-detail-sub { font-size: 12px; color: var(--muted); margin-top: 3px; }
        .scs-address {
          font-style: normal;
          font-size: 13px;
          color: var(--charcoal-light);
          line-height: 1.7;
        }
        .scs-payment-row { display: flex; align-items: center; gap: 10px; margin-top: 2px; }
        .scs-payment-chip {
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          border: 1px solid var(--border);
          padding: 3px 8px;
          color: var(--muted);
        }
        .scs-payment-detail { font-size: 13px; color: var(--charcoal-light); letter-spacing: 0.06em; }

        /* ── Action buttons ── */
        .scs-actions-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .scs-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 11px 20px;
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
        .scs-action-btn:hover { border-color: var(--charcoal); color: var(--charcoal); }
        .scs-action-primary {
          background: var(--charcoal);
          color: var(--cream);
          border-color: var(--charcoal);
        }
        .scs-action-primary:hover { background: var(--gold); border-color: var(--gold); color: var(--cream); }

        /* ── Summary card ── */
        .scs-summary-card { background: var(--cream-dark); }
        .scs-summary-rows { display: flex; flex-direction: column; gap: 10px; margin-bottom: 14px; }
        .scs-summary-row {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          color: var(--charcoal-light);
        }
        .scs-discount { color: #2a7a4a; }
        .scs-free { color: #2a7a4a; }
        .scs-summary-divider { height: 1px; background: var(--border); margin-bottom: 14px; }
        .scs-total { font-size: 16px; color: var(--charcoal); font-weight: 500; }

        /* ── Loyalty card ── */
        .scs-loyalty-card {
          background: var(--charcoal);
          text-align: center;
          padding: 32px 28px;
        }
        .scs-loyalty-ornament { font-size: 16px; color: var(--gold); margin-bottom: 10px; }
        .scs-loyalty-title {
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(250,247,242,0.5);
          margin-bottom: 6px;
        }
        .scs-loyalty-num {
          font-family: var(--font-display);
          font-size: 44px;
          font-weight: 400;
          color: var(--gold);
          line-height: 1;
          margin-bottom: 14px;
        }
        .scs-loyalty-sub {
          font-family: var(--font-editorial);
          font-size: 13px;
          font-weight: 300;
          color: rgba(250,247,242,0.45);
          line-height: 1.65;
          margin-bottom: 18px;
        }
        .scs-loyalty-link {
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--gold);
          border-bottom: 1px solid rgba(201,169,110,0.4);
          padding-bottom: 2px;
          transition: opacity 0.2s;
        }
        .scs-loyalty-link:hover { opacity: 0.7; }

        /* ── What's next ── */
        .scs-next-steps { display: flex; flex-direction: column; gap: 12px; }
        .scs-next-step {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 13px;
          color: var(--charcoal-light);
        }
        .scs-next-icon {
          width: 28px;
          height: 28px;
          border: 1px solid var(--border);
          background: var(--cream-dark);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          color: var(--gold);
          flex-shrink: 0;
        }
        .scs-next-label { line-height: 1.4; }

        /* ── Policy note ── */
        .scs-policy-note {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: var(--muted);
          padding: 12px 16px;
          border: 1px solid var(--border);
          background: var(--cream-dark);
        }
        .scs-policy-note svg { color: var(--gold); flex-shrink: 0; }
        .scs-policy-link {
          color: var(--gold);
          border-bottom: 1px solid var(--gold);
          padding-bottom: 1px;
          transition: color 0.2s;
        }
        .scs-policy-link:hover { color: var(--charcoal); border-color: var(--charcoal); }

        /* ── Suggested ── */
        .scs-suggested {
          padding: 48px 60px 80px;
          border-top: 1px solid var(--border);
          background: var(--cream-dark);
        }
        .scs-suggested-header {
          display: flex;
          align-items: center;
          gap: 24px;
          margin-bottom: 36px;
        }
        .scs-rule { flex: 1; height: 1px; background: var(--border); }
        .scs-suggested-title {
          font-family: var(--font-display);
          font-size: 26px;
          font-weight: 400;
          color: var(--charcoal);
          white-space: nowrap;
        }
        .scs-suggested-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 36px;
        }
        .scs-sugg-card { cursor: pointer; }
        .scs-sugg-img {
          height: 300px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          margin-bottom: 12px;
        }
        .scs-sugg-img-label {
          font-family: var(--font-editorial);
          font-size: 12px;
          color: rgba(0,0,0,0.22);
          letter-spacing: 0.08em;
        }
        .scs-sugg-tag {
          position: absolute;
          top: 10px;
          left: 10px;
          font-size: 9px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 4px 8px;
          background: var(--gold);
          color: white;
        }
        .scs-sugg-add {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          background: var(--charcoal);
          color: var(--cream);
          padding: 12px;
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          opacity: 0;
          transform: translateY(4px);
          transition: all 0.25s;
          border: none;
          font-family: var(--font-body);
          cursor: pointer;
        }
        .scs-sugg-card:hover .scs-sugg-add { opacity: 1; transform: translateY(0); }
        .scs-sugg-name {
          font-family: var(--font-display);
          font-size: 15px;
          font-weight: 400;
          color: var(--charcoal);
          margin-bottom: 4px;
        }
        .scs-sugg-price { font-size: 14px; color: var(--muted); }
        .scs-suggested-cta { text-align: center; }

        /* ── Responsive ── */
        @media (max-width: 1100px) {
          .scs-layout { grid-template-columns: 1fr 320px; padding: 36px 40px 56px; }
          .scs-hero { padding: 48px 40px; }
          .scs-progress-section { padding: 32px 40px; }
          .scs-suggested { padding: 48px 40px 64px; }
        }
        @media (max-width: 900px) {
          .scs-layout { grid-template-columns: 1fr; padding: 24px 20px 48px; }
          .scs-right { display: contents; }
          .scs-summary-card { order: -1; }
          .scs-hero { padding: 40px 20px; }
          .scs-hero-meta { width: 100%; }
          .scs-progress-section { padding: 28px 20px; }
          .scs-suggested { padding: 40px 20px 56px; }
          .scs-suggested-grid { grid-template-columns: repeat(2, 1fr); }
          .scs-timeline-wrap .scs-tl-label { font-size: 10px; }
        }
        @media (max-width: 640px) {
          .scs-detail-grid { grid-template-columns: 1fr; }
          .scs-item { grid-template-columns: 60px 1fr auto; }
          .scs-actions-row { flex-direction: column; }
          .scs-action-btn { justify-content: center; }
          .scs-meta-sep { display: none; }
          .scs-hero-meta { flex-direction: column; gap: 0; border: 1px solid var(--border); }
          .scs-meta-pill { border-bottom: 1px solid var(--border); padding: 12px 16px; }
          .scs-meta-pill:last-child { border-bottom: none; }
        }
      `}</style>
    </>
  );
}