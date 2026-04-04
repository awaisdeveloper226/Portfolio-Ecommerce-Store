"use client";
import { useState } from "react";
import Link from "next/link";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ─── Types ────────────────────────────────────────────────────────────────────
type CartItem = {
  id: number;
  name: string;
  category: string;
  price: number;
  size: string;
  color: string;
  colorLabel: string;
  quantity: number;
  tag?: string | null;
};

// ─── Mock Cart Data ───────────────────────────────────────────────────────────
const initialItems: CartItem[] = [
  {
    id: 1,
    name: "Silk Slip Dress",
    category: "Dresses",
    price: 285,
    size: "S",
    color: "#e8d5c0",
    colorLabel: "Sand",
    quantity: 1,
    tag: "Bestseller",
  },
  {
    id: 3,
    name: "Cashmere Turtleneck",
    category: "Knitwear",
    price: 320,
    size: "M",
    color: "#d0c8d5",
    colorLabel: "Lavender",
    quantity: 2,
    tag: "New",
  },
  {
    id: 6,
    name: "Oversized Linen Shirt",
    category: "Tops",
    price: 145,
    size: "L",
    color: "#c5ddc5",
    colorLabel: "Sage",
    quantity: 1,
    tag: null,
  },
];

const upsellProducts = [
  {
    id: 8,
    name: "Satin Cami Top",
    price: 95,
    color: "#ddd5c5",
    tag: "Bestseller",
  },
  {
    id: 5,
    name: "Fluid Midi Skirt",
    price: 175,
    color: "#ddc5b5",
    tag: null,
  },
  {
    id: 11,
    name: "Silk Scarf",
    price: 85,
    color: "#e8d5b0",
    tag: null,
  },
  {
    id: 13,
    name: "Wide-Brim Hat",
    price: 135,
    color: "#d4c4b0",
    tag: null,
  },
];

// ─── Quantity Stepper ─────────────────────────────────────────────────────────
function QuantityStepper({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="qty-stepper">
      <button
        className="qty-btn"
        onClick={() => onChange(Math.max(1, value - 1))}
        aria-label="Decrease quantity"
        disabled={value <= 1}
      >
        −
      </button>
      <span className="qty-value">{value}</span>
      <button
        className="qty-btn"
        onClick={() => onChange(value + 1)}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}

// ─── Cart Item Row ────────────────────────────────────────────────────────────
function CartItemRow({
  item,
  onQtyChange,
  onRemove,
}: {
  item: CartItem;
  onQtyChange: (id: number, qty: number) => void;
  onRemove: (id: number) => void;
}) {
  return (
    <div className="cart-item">
      {/* Product Image */}
      <div className="cart-item-img" style={{ background: item.color }}>
        <span className="cart-img-text">Product Image</span>
        {item.tag && (
          <span
            className={`cart-item-tag ${
              item.tag === "Sale"
                ? "tag-sale"
                : item.tag === "Bestseller"
                  ? "tag-best"
                  : "tag-new"
            }`}
          >
            {item.tag}
          </span>
        )}
      </div>

      {/* Item Details */}
      <div className="cart-item-details">
        <div className="cart-item-header">
          <div>
            <span className="cart-item-cat">{item.category}</span>
            <h3 className="cart-item-name">{item.name}</h3>
          </div>
          <button
            className="cart-remove-btn"
            onClick={() => onRemove(item.id)}
            aria-label="Remove item"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="cart-item-meta">
          <div className="cart-meta-pill">
            <span className="meta-pill-dot" style={{ background: item.color }} />
            <span>{item.colorLabel}</span>
          </div>
          <div className="cart-meta-pill">
            <span>Size:</span>
            <span className="meta-pill-bold">{item.size}</span>
          </div>
        </div>

        <div className="cart-item-footer">
          <QuantityStepper
            value={item.quantity}
            onChange={(qty) => onQtyChange(item.id, qty)}
          />
          <div className="cart-item-price">
            <span className="cart-item-total">
              ${(item.price * item.quantity).toLocaleString()}
            </span>
            {item.quantity > 1 && (
              <span className="cart-item-unit">${item.price} each</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Order Summary ────────────────────────────────────────────────────────────
function OrderSummary({
  subtotal,
  itemCount,
  promoApplied,
  promoCode,
  setPromoCode,
  applyPromo,
  removePromo,
}: {
  subtotal: number;
  itemCount: number;
  promoApplied: boolean;
  promoCode: string;
  setPromoCode: (s: string) => void;
  applyPromo: () => void;
  removePromo: () => void;
}) {
  const discount = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const shipping = subtotal >= 150 ? 0 : 12;
  const total = subtotal - discount + shipping;

  return (
    <aside className="order-summary">
      <h2 className="summary-title">Order Summary</h2>

      <div className="summary-rows">
        <div className="summary-row">
          <span>
            Subtotal{" "}
            <span className="summary-count">({itemCount} items)</span>
          </span>
          <span>${subtotal.toLocaleString()}</span>
        </div>

        {promoApplied && (
          <div className="summary-row summary-discount">
            <span>Discount (ELARA10)</span>
            <span>−${discount}</span>
          </div>
        )}

        <div className="summary-row">
          <span>Shipping</span>
          <span>
            {shipping === 0 ? (
              <span className="summary-free">Free</span>
            ) : (
              `$${shipping}`
            )}
          </span>
        </div>

        {!promoApplied && subtotal < 150 && (
          <p className="summary-shipping-note">
            Add ${150 - subtotal} more for free shipping
          </p>
        )}
      </div>

      {/* Promo Code */}
      <div className="promo-section">
        {promoApplied ? (
          <div className="promo-applied">
            <div className="promo-applied-info">
              <span className="promo-check">✦</span>
              <span className="promo-code-text">ELARA10 applied</span>
            </div>
            <button className="promo-remove" onClick={removePromo}>
              Remove
            </button>
          </div>
        ) : (
          <div className="promo-input-row">
            <input
              type="text"
              placeholder="Promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
              className="promo-input"
              onKeyDown={(e) => e.key === "Enter" && applyPromo()}
            />
            <button className="promo-btn" onClick={applyPromo}>
              Apply
            </button>
          </div>
        )}
      </div>

      <div className="summary-divider" />

      <div className="summary-row summary-total">
        <span>Total</span>
        <span>${total.toLocaleString()}</span>
      </div>

      <Link href="/checkout" className="btn-checkout">
        Proceed to Checkout
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </Link>

      <div className="summary-security">
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <span>Secure checkout · SSL encrypted</span>
      </div>

      <div className="summary-payments">
        {["VISA", "MC", "AMEX", "PayPal"].map((p) => (
          <span key={p} className="payment-chip">
            {p}
          </span>
        ))}
      </div>
    </aside>
  );
}

// ─── Empty Cart ───────────────────────────────────────────────────────────────
function EmptyCart() {
  return (
    <div className="empty-cart">
      <div className="empty-cart-icon">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        >
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      </div>
      <h2 className="empty-cart-title">Your cart is empty</h2>
      <p className="empty-cart-sub">
        Discover timeless pieces crafted for the modern woman.
      </p>
      <Link href="/shop" className="btn-primary">
        Explore the Collection
      </Link>
    </div>
  );
}

// ─── Upsell Strip ─────────────────────────────────────────────────────────────
function UpsellStrip() {
  return (
    <section className="upsell-section">
      <div className="section-header" style={{ marginBottom: 32 }}>
        <div className="section-header-line" />
        <h2 className="section-title">You Might Also Love</h2>
        <div className="section-header-line" />
      </div>
      <div className="upsell-grid">
        {upsellProducts.map((p) => (
          <div key={p.id} className="upsell-card">
            <div className="upsell-img" style={{ background: p.color }}>
              <span className="cart-img-text">Product Image</span>
              {p.tag && <span className="product-tag tag-best">{p.tag}</span>}
              <button className="upsell-add">Quick Add</button>
            </div>
            <div className="upsell-info">
              <h4 className="upsell-name">{p.name}</h4>
              <span className="upsell-price">${p.price}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Main Cart Page ───────────────────────────────────────────────────────────
export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>(initialItems);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState(false);

  const updateQty = (id: number, qty: number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item)),
    );
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const applyPromo = () => {
    if (promoCode === "ELARA10") {
      setPromoApplied(true);
      setPromoError(false);
    } else {
      setPromoError(true);
      setTimeout(() => setPromoError(false), 2000);
    }
  };

  const removePromo = () => {
    setPromoApplied(false);
    setPromoCode("");
  };

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <>
      <style>{`
        /* ── Cart Hero / Breadcrumb ── */
        .cart-hero {
          background: var(--cream-dark);
          border-bottom: 1px solid var(--border);
          padding: 40px 60px 36px;
        }
        .cart-breadcrumb {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 12px;
          letter-spacing: 0.08em;
          color: var(--muted);
          margin-bottom: 14px;
          text-transform: uppercase;
        }
        .cart-breadcrumb a:hover { color: var(--gold); }
        .breadcrumb-sep { color: var(--border); }
        .cart-hero-title {
          font-family: var(--font-display);
          font-size: clamp(36px, 4vw, 52px);
          font-weight: 400;
          color: var(--charcoal);
          line-height: 1.05;
        }
        .cart-hero-title em {
          font-style: italic;
          color: var(--gold);
        }
        .cart-hero-sub {
          font-family: var(--font-editorial);
          font-size: 15px;
          color: var(--muted);
          margin-top: 8px;
          font-weight: 300;
        }

        /* ── Cart Layout ── */
        .cart-layout {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 60px;
          padding: 48px 60px 80px;
          align-items: start;
          max-width: 1400px;
          margin: 0 auto;
        }

        /* ── Cart Left ── */
        .cart-left {}
        .cart-items-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--border);
          margin-bottom: 0;
        }
        .cart-items-label {
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--muted);
        }
        .cart-clear-btn {
          font-size: 12px;
          color: var(--muted);
          letter-spacing: 0.06em;
          text-decoration: underline;
          transition: color 0.2s;
        }
        .cart-clear-btn:hover { color: var(--charcoal); }

        /* ── Cart Item ── */
        .cart-item {
          display: grid;
          grid-template-columns: 140px 1fr;
          gap: 24px;
          padding: 28px 0;
          border-bottom: 1px solid var(--border);
          animation: fadeUp 0.4s ease both;
        }
        .cart-item-img {
          height: 175px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          flex-shrink: 0;
        }
        .cart-img-text {
          font-family: var(--font-editorial);
          font-size: 12px;
          color: rgba(0,0,0,0.25);
          letter-spacing: 0.08em;
        }
        .cart-item-tag {
          position: absolute;
          top: 10px;
          left: 10px;
          font-size: 9px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 4px 8px;
          font-weight: 500;
        }
        .cart-item-details {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 4px 0;
        }
        .cart-item-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .cart-item-cat {
          display: block;
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 4px;
        }
        .cart-item-name {
          font-family: var(--font-display);
          font-size: 19px;
          font-weight: 400;
          color: var(--charcoal);
        }
        .cart-remove-btn {
          color: var(--muted);
          padding: 4px;
          transition: color 0.2s, transform 0.2s;
          flex-shrink: 0;
        }
        .cart-remove-btn:hover {
          color: var(--charcoal);
          transform: rotate(90deg);
        }
        .cart-item-meta {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        .cart-meta-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: var(--muted);
          background: var(--cream-dark);
          padding: 5px 10px;
          border: 1px solid var(--border);
        }
        .meta-pill-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
          box-shadow: 0 0 0 1px var(--border);
        }
        .meta-pill-bold {
          font-weight: 500;
          color: var(--charcoal);
          letter-spacing: 0.06em;
        }
        .cart-item-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        /* ── Quantity Stepper ── */
        .qty-stepper {
          display: flex;
          align-items: center;
          border: 1px solid var(--border);
        }
        .qty-btn {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          color: var(--charcoal-light);
          transition: all 0.2s;
          line-height: 1;
        }
        .qty-btn:hover:not(:disabled) {
          background: var(--charcoal);
          color: var(--cream);
        }
        .qty-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        .qty-value {
          width: 44px;
          text-align: center;
          font-size: 14px;
          color: var(--charcoal);
          border-left: 1px solid var(--border);
          border-right: 1px solid var(--border);
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* ── Price ── */
        .cart-item-price {
          text-align: right;
        }
        .cart-item-total {
          display: block;
          font-family: var(--font-display);
          font-size: 20px;
          font-weight: 400;
          color: var(--charcoal);
        }
        .cart-item-unit {
          font-size: 12px;
          color: var(--muted);
        }

        /* ── Continue Shopping ── */
        .continue-shopping {
          padding-top: 28px;
        }
        .continue-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--charcoal-light);
          border-bottom: 1px solid var(--border);
          padding-bottom: 3px;
          transition: all 0.2s;
        }
        .continue-link:hover {
          color: var(--gold);
          border-color: var(--gold);
        }

        /* ── Order Summary ── */
        .order-summary {
          background: var(--cream-dark);
          border: 1px solid var(--border);
          padding: 36px 32px;
          position: sticky;
          top: 100px;
        }
        .summary-title {
          font-family: var(--font-display);
          font-size: 22px;
          font-weight: 400;
          color: var(--charcoal);
          margin-bottom: 28px;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--border);
        }
        .summary-rows {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-bottom: 24px;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
          color: var(--charcoal-light);
        }
        .summary-count {
          color: var(--muted);
          font-size: 13px;
        }
        .summary-discount {
          color: #2e7d32;
        }
        .summary-free {
          color: #2e7d32;
          font-weight: 500;
        }
        .summary-shipping-note {
          font-size: 12px;
          color: var(--muted);
          font-family: var(--font-editorial);
          font-style: italic;
          margin-top: -6px;
        }
        .summary-divider {
          height: 1px;
          background: var(--border);
          margin: 20px 0;
        }
        .summary-total {
          font-size: 17px;
          font-weight: 500;
          color: var(--charcoal);
          margin-bottom: 24px;
        }

        /* ── Promo ── */
        .promo-section {
          margin-bottom: 20px;
        }
        .promo-input-row {
          display: flex;
          border: 1px solid var(--border);
          overflow: hidden;
        }
        .promo-input {
          flex: 1;
          padding: 11px 14px;
          font-size: 13px;
          border: none;
          background: white;
          font-family: var(--font-body);
          color: var(--charcoal);
          letter-spacing: 0.06em;
          outline: none;
        }
        .promo-input::placeholder { color: var(--muted); }
        .promo-btn {
          padding: 11px 18px;
          background: var(--charcoal);
          color: var(--cream);
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          transition: background 0.2s;
          white-space: nowrap;
        }
        .promo-btn:hover { background: var(--gold); }
        .promo-applied {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #f0f7f0;
          border: 1px solid #c8e6c9;
          padding: 12px 14px;
        }
        .promo-applied-info {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .promo-check { color: #2e7d32; font-size: 10px; }
        .promo-code-text {
          font-size: 13px;
          color: #2e7d32;
          letter-spacing: 0.06em;
          font-weight: 500;
        }
        .promo-remove {
          font-size: 12px;
          color: var(--muted);
          text-decoration: underline;
          transition: color 0.2s;
        }
        .promo-remove:hover { color: var(--charcoal); }

        /* ── Checkout Button ── */
        .btn-checkout {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          background: var(--charcoal);
          color: var(--cream);
          padding: 16px 24px;
          font-size: 12px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          font-weight: 400;
          transition: all 0.25s;
          border: 1px solid var(--charcoal);
          margin-bottom: 16px;
        }
        .btn-checkout:hover {
          background: var(--gold);
          border-color: var(--gold);
        }
        .summary-security {
          display: flex;
          align-items: center;
          gap: 6px;
          justify-content: center;
          font-size: 11px;
          color: var(--muted);
          letter-spacing: 0.04em;
          margin-bottom: 20px;
        }
        .summary-payments {
          display: flex;
          gap: 8px;
          justify-content: center;
        }
        .payment-chip {
          font-size: 10px;
          letter-spacing: 0.06em;
          border: 1px solid var(--border);
          padding: 4px 8px;
          color: var(--muted);
        }

        /* ── Empty Cart ── */
        .empty-cart {
          grid-column: 1 / -1;
          text-align: center;
          padding: 100px 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }
        .empty-cart-icon {
          color: var(--gold);
          opacity: 0.6;
          margin-bottom: 8px;
        }
        .empty-cart-title {
          font-family: var(--font-display);
          font-size: 28px;
          font-weight: 400;
          color: var(--charcoal);
        }
        .empty-cart-sub {
          font-family: var(--font-editorial);
          font-size: 16px;
          color: var(--muted);
          font-weight: 300;
          margin-bottom: 8px;
        }

        /* ── Upsell ── */
        .upsell-section {
          padding: 60px 60px 80px;
          border-top: 1px solid var(--border);
        }
        .upsell-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          padding: 0;
        }
        .upsell-card { cursor: pointer; }
        .upsell-img {
          height: 280px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          margin-bottom: 14px;
        }
        .upsell-add {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: var(--charcoal);
          color: var(--cream);
          padding: 12px;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          opacity: 0;
          transform: translateY(4px);
          transition: all 0.25s;
        }
        .upsell-card:hover .upsell-add {
          opacity: 1;
          transform: translateY(0);
        }
        .upsell-card:hover .upsell-img img,
        .upsell-card:hover .upsell-img > div {
          transform: scale(1.04);
        }
        .upsell-name {
          font-family: var(--font-display);
          font-size: 15px;
          font-weight: 400;
          color: var(--charcoal);
          margin-bottom: 4px;
        }
        .upsell-price {
          font-size: 14px;
          color: var(--charcoal-light);
        }

        /* ── Trust Bar ── */
        .cart-trust-bar {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0;
          border: 1px solid var(--border);
          margin: 0 60px 0;
        }
        .trust-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 20px 28px;
          border-right: 1px solid var(--border);
        }
        .trust-item:last-child { border-right: none; }
        .trust-icon { color: var(--gold); flex-shrink: 0; }
        .trust-text h4 {
          font-size: 13px;
          font-weight: 500;
          color: var(--charcoal);
          margin-bottom: 2px;
          letter-spacing: 0.04em;
        }
        .trust-text p {
          font-size: 12px;
          color: var(--muted);
          font-family: var(--font-editorial);
        }

        /* ── Responsive ── */
        @media (max-width: 1100px) {
          .cart-layout {
            grid-template-columns: 1fr 340px;
            gap: 40px;
            padding: 40px 40px 60px;
          }
          .upsell-grid { grid-template-columns: repeat(2, 1fr); }
          .cart-trust-bar { margin: 0 40px; }
        }
        @media (max-width: 900px) {
          .cart-layout {
            grid-template-columns: 1fr;
            padding: 32px 20px 60px;
          }
          .order-summary { position: static; }
          .cart-hero { padding: 32px 20px 28px; }
          .upsell-section { padding: 40px 20px 60px; }
          .cart-trust-bar { grid-template-columns: 1fr; margin: 0 20px; }
          .trust-item { border-right: none; border-bottom: 1px solid var(--border); }
          .trust-item:last-child { border-bottom: none; }
          .upsell-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .cart-item { grid-template-columns: 110px 1fr; gap: 16px; }
          .cart-item-img { height: 140px; }
          .cart-item-name { font-size: 16px; }
        }
      `}</style>

      <AnnouncementBar />
      <Navbar />

      <main>
        {/* Cart Hero */}
        <div className="cart-hero">
          <div className="cart-breadcrumb">
            <Link href="/">Home</Link>
            <span className="breadcrumb-sep">·</span>
            <Link href="/shop">Shop</Link>
            <span className="breadcrumb-sep">·</span>
            <span>Shopping Cart</span>
          </div>
          <h1 className="cart-hero-title">
            Your <em>Cart</em>
          </h1>
          {items.length > 0 && (
            <p className="cart-hero-sub">
              {itemCount} {itemCount === 1 ? "piece" : "pieces"} selected
            </p>
          )}
        </div>

        {/* Trust Bar */}
        {items.length > 0 && (
          <div className="cart-trust-bar" style={{ margin: "0 60px" }}>
            <div className="trust-item">
              <svg
                className="trust-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
              <div className="trust-text">
                <h4>Free Shipping</h4>
                <p>On all orders over $150</p>
              </div>
            </div>
            <div className="trust-item">
              <svg
                className="trust-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <polyline points="23 4 23 10 17 10" />
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
              </svg>
              <div className="trust-text">
                <h4>Easy Returns</h4>
                <p>30-day hassle-free returns</p>
              </div>
            </div>
            <div className="trust-item">
              <svg
                className="trust-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <div className="trust-text">
                <h4>Secure Payment</h4>
                <p>SSL encrypted checkout</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Layout */}
        <div className="cart-layout">
          {items.length === 0 ? (
            <EmptyCart />
          ) : (
            <>
              {/* Left: Items */}
              <div className="cart-left">
                <div className="cart-items-header">
                  <span className="cart-items-label">
                    {itemCount} {itemCount === 1 ? "item" : "items"}
                  </span>
                  <button
                    className="cart-clear-btn"
                    onClick={() => setItems([])}
                  >
                    Clear cart
                  </button>
                </div>

                {items.map((item) => (
                  <CartItemRow
                    key={item.id}
                    item={item}
                    onQtyChange={updateQty}
                    onRemove={removeItem}
                  />
                ))}

                <div className="continue-shopping">
                  <Link href="/shop" className="continue-link">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                    Continue Shopping
                  </Link>
                </div>
              </div>

              {/* Right: Summary */}
              <OrderSummary
                subtotal={subtotal}
                itemCount={itemCount}
                promoApplied={promoApplied}
                promoCode={promoCode}
                setPromoCode={setPromoCode}
                applyPromo={applyPromo}
                removePromo={removePromo}
              />
            </>
          )}
        </div>

        {/* Upsell */}
        <UpsellStrip />
      </main>

      <Footer />
    </>
  );
}