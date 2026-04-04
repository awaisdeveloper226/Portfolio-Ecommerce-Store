"use client";
import { useState } from "react";
import Link from "next/link";
import AnnouncementBar from "@/components/AnnouncementBar";
import Footer from "@/components/Footer";

// ─── Types ────────────────────────────────────────────────────────────────────
type Step = "information" | "shipping" | "payment";

// ─── Mock Cart Items ──────────────────────────────────────────────────────────
const cartItems = [
  {
    id: 1,
    name: "Silk Slip Dress",
    variant: "Sand · Size S",
    price: 285,
    qty: 1,
    color: "#e8d5c0",
  },
  {
    id: 2,
    name: "Linen Wide Trousers",
    variant: "Sage · Size M",
    price: 195,
    originalPrice: 240,
    qty: 2,
    color: "#c8d5c0",
  },
  {
    id: 3,
    name: "Cashmere Turtleneck",
    variant: "Charcoal · Size S",
    price: 320,
    qty: 1,
    color: "#d0c8d5",
  },
];

// ─── Progress Indicator ───────────────────────────────────────────────────────
function CheckoutProgress({
  step,
  setStep,
  completedSteps,
}: {
  step: Step;
  setStep: (s: Step) => void;
  completedSteps: Step[];
}) {
  const steps: { key: Step; label: string }[] = [
    { key: "information", label: "Information" },
    { key: "shipping", label: "Shipping" },
    { key: "payment", label: "Payment" },
  ];

  return (
    <nav className="checkout-progress">
      {steps.map((s, i) => {
        const isActive = step === s.key;
        const isDone = completedSteps.includes(s.key);
        const isClickable = isDone;
        return (
          <span key={s.key} className="progress-item">
            <button
              className={`progress-step ${isActive ? "progress-active" : ""} ${isDone ? "progress-done" : ""}`}
              onClick={() => isClickable && setStep(s.key)}
              disabled={!isClickable && !isActive}
            >
              <span className="progress-num">
                {isDone ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                ) : (
                  i + 1
                )}
              </span>
              <span className="progress-label">{s.label}</span>
            </button>
            {i < steps.length - 1 && <span className="progress-sep">›</span>}
          </span>
        );
      })}
    </nav>
  );
}

// ─── Order Summary ────────────────────────────────────────────────────────────
function OrderSummary({ promoApplied }: { promoApplied: boolean }) {
  const [promoCode, setPromoCode] = useState("");
  const [promoOpen, setPromoOpen] = useState(false);
  const [promoError, setPromoError] = useState("");

  const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shipping = subtotal >= 150 ? 0 : 12;
  const discount = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + shipping - discount;

  const applyPromo = () => {
    if (promoCode.toLowerCase() === "elara10") {
      setPromoError("");
      setPromoOpen(false);
    } else {
      setPromoError("Invalid code. Try ELARA10.");
    }
  };

  return (
    <aside className="order-summary">
      <h2 className="summary-title">Your Order</h2>

      {/* Items */}
      <div className="summary-items">
        {cartItems.map((item) => (
          <div key={item.id} className="summary-item">
            <div className="summary-item-img" style={{ background: item.color }}>
              <span className="summary-item-qty">{item.qty}</span>
            </div>
            <div className="summary-item-info">
              <p className="summary-item-name">{item.name}</p>
              <p className="summary-item-variant">{item.variant}</p>
            </div>
            <div className="summary-item-price">
              {item.originalPrice && (
                <span className="summary-item-orig">${item.originalPrice * item.qty}</span>
              )}
              <span>${item.price * item.qty}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Promo */}
      <div className="summary-promo">
        {!promoOpen ? (
          <button className="promo-toggle" onClick={() => setPromoOpen(true)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
              <circle cx="7" cy="7" r="1" fill="currentColor" />
            </svg>
            Have a promo code?
          </button>
        ) : (
          <div className="promo-field">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Enter code"
              className="promo-input"
            />
            <button className="promo-apply" onClick={applyPromo}>Apply</button>
          </div>
        )}
        {promoError && <p className="promo-error">{promoError}</p>}
      </div>

      {/* Totals */}
      <div className="summary-totals">
        <div className="total-row">
          <span>Subtotal</span>
          <span>${subtotal}</span>
        </div>
        {discount > 0 && (
          <div className="total-row total-discount">
            <span>Promo (ELARA10)</span>
            <span>−${discount}</span>
          </div>
        )}
        <div className="total-row">
          <span>Shipping</span>
          <span>{shipping === 0 ? <span className="free-shipping">Free</span> : `$${shipping}`}</span>
        </div>
        {subtotal < 150 && (
          <p className="shipping-notice">
            Add ${150 - subtotal} more for free shipping
          </p>
        )}
        <div className="total-row total-grand">
          <span>Total</span>
          <span>${total}</span>
        </div>
      </div>

      {/* Trust badges */}
      <div className="trust-badges">
        <div className="trust-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span>Secure checkout</span>
        </div>
        <div className="trust-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span>Free returns within 30 days</span>
        </div>
      </div>
    </aside>
  );
}

// ─── Information Step ─────────────────────────────────────────────────────────
function InformationStep({ onNext }: { onNext: () => void }) {
  const [email, setEmail] = useState("");
  const [subscribe, setSubscribe] = useState(true);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    address: "",
    apt: "",
    city: "",
    country: "United Kingdom",
    postCode: "",
    phone: "",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  return (
    <div className="checkout-step">
      {/* Contact */}
      <div className="form-section">
        <div className="form-section-header">
          <h3 className="form-section-title">Contact</h3>
          <span className="form-section-link">
            Already have an account?{" "}
            <Link href="/login" className="inline-link">Log in</Link>
          </span>
        </div>
        <div className="field-group">
          <div className="field">
            <label className="field-label">Email address</label>
            <input
              type="email"
              className="field-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={subscribe}
            onChange={(e) => setSubscribe(e.target.checked)}
            className="checkbox-input"
          />
          <span className="checkbox-text">
            Email me with exclusive offers and style notes from our editors
          </span>
        </label>
      </div>

      {/* Shipping address */}
      <div className="form-section">
        <h3 className="form-section-title">Delivery Address</h3>
        <div className="field-group">
          <div className="field field-select">
            <label className="field-label">Country / Region</label>
            <div className="select-wrap">
              <select className="field-input field-select-el" value={form.country} onChange={set("country")}>
                <option>United Kingdom</option>
                <option>United States</option>
                <option>France</option>
                <option>Germany</option>
                <option>Australia</option>
                <option>Canada</option>
                <option>Pakistan</option>
              </select>
              <svg className="select-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
          </div>
        </div>
        <div className="field-row">
          <div className="field">
            <label className="field-label">First name</label>
            <input type="text" className="field-input" value={form.firstName} onChange={set("firstName")} />
          </div>
          <div className="field">
            <label className="field-label">Last name</label>
            <input type="text" className="field-input" value={form.lastName} onChange={set("lastName")} />
          </div>
        </div>
        <div className="field-group">
          <div className="field">
            <label className="field-label">Address</label>
            <input type="text" className="field-input" placeholder="Street and number" value={form.address} onChange={set("address")} />
          </div>
          <div className="field">
            <label className="field-label">Apartment, suite, etc. <span className="field-optional">(optional)</span></label>
            <input type="text" className="field-input" value={form.apt} onChange={set("apt")} />
          </div>
        </div>
        <div className="field-row">
          <div className="field">
            <label className="field-label">City</label>
            <input type="text" className="field-input" value={form.city} onChange={set("city")} />
          </div>
          <div className="field">
            <label className="field-label">Postal code</label>
            <input type="text" className="field-input" value={form.postCode} onChange={set("postCode")} />
          </div>
        </div>
        <div className="field-group">
          <div className="field">
            <label className="field-label">Phone <span className="field-optional">(optional)</span></label>
            <input type="tel" className="field-input" value={form.phone} onChange={set("phone")} />
          </div>
        </div>
      </div>

      <div className="step-actions">
        <Link href="/cart" className="back-link">
          ← Return to cart
        </Link>
        <button className="btn-primary" onClick={onNext}>
          Continue to Shipping
        </button>
      </div>
    </div>
  );
}

// ─── Shipping Step ────────────────────────────────────────────────────────────
const shippingOptions = [
  {
    id: "standard",
    label: "Standard Delivery",
    desc: "3–5 business days",
    price: 0,
    priceLabel: "Free",
  },
  {
    id: "express",
    label: "Express Delivery",
    desc: "1–2 business days",
    price: 14,
    priceLabel: "$14",
  },
  {
    id: "next",
    label: "Next Day",
    desc: "Order before 2pm",
    price: 22,
    priceLabel: "$22",
  },
];

function ShippingStep({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [selected, setSelected] = useState("standard");

  return (
    <div className="checkout-step">
      {/* Breadcrumb summary */}
      <div className="step-summary">
        <div className="step-summary-row">
          <span className="step-summary-label">Contact</span>
          <span className="step-summary-val">customer@example.com</span>
          <button className="step-summary-edit" onClick={onBack}>Edit</button>
        </div>
        <div className="step-summary-row">
          <span className="step-summary-label">Ship to</span>
          <span className="step-summary-val">12 Elara Lane, London, SW1A 1AA</span>
          <button className="step-summary-edit" onClick={onBack}>Edit</button>
        </div>
      </div>

      <div className="form-section">
        <h3 className="form-section-title">Shipping Method</h3>
        <div className="shipping-options">
          {shippingOptions.map((opt) => (
            <label key={opt.id} className={`shipping-option ${selected === opt.id ? "shipping-option-active" : ""}`}>
              <input
                type="radio"
                name="shipping"
                value={opt.id}
                checked={selected === opt.id}
                onChange={() => setSelected(opt.id)}
                className="shipping-radio"
              />
              <div className="shipping-option-body">
                <div className="shipping-option-left">
                  <span className="shipping-dot" />
                  <div>
                    <p className="shipping-label">{opt.label}</p>
                    <p className="shipping-desc">{opt.desc}</p>
                  </div>
                </div>
                <span className={`shipping-price ${opt.price === 0 ? "shipping-free" : ""}`}>
                  {opt.priceLabel}
                </span>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="step-actions">
        <button className="back-link" onClick={onBack}>
          ← Return to information
        </button>
        <button className="btn-primary" onClick={onNext}>
          Continue to Payment
        </button>
      </div>
    </div>
  );
}

// ─── Payment Step ─────────────────────────────────────────────────────────────
function PaymentStep({ onBack }: { onBack: () => void }) {
  const [method, setMethod] = useState<"card" | "paypal" | "apple">("card");
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [billingMatch, setBillingMatch] = useState(true);
  const setC = (k: keyof typeof card) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setCard((p) => ({ ...p, [k]: e.target.value }));

  const formatCard = (val: string) =>
    val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const formatExpiry = (val: string) => {
    const clean = val.replace(/\D/g, "").slice(0, 4);
    return clean.length >= 3 ? `${clean.slice(0, 2)}/${clean.slice(2)}` : clean;
  };

  return (
    <div className="checkout-step">
      {/* Summary */}
      <div className="step-summary">
        <div className="step-summary-row">
          <span className="step-summary-label">Contact</span>
          <span className="step-summary-val">customer@example.com</span>
          <button className="step-summary-edit" onClick={onBack}>Edit</button>
        </div>
        <div className="step-summary-row">
          <span className="step-summary-label">Ship to</span>
          <span className="step-summary-val">12 Elara Lane, London, SW1A 1AA</span>
          <button className="step-summary-edit" onClick={onBack}>Edit</button>
        </div>
        <div className="step-summary-row">
          <span className="step-summary-label">Method</span>
          <span className="step-summary-val">Standard Delivery · Free</span>
          <button className="step-summary-edit" onClick={onBack}>Edit</button>
        </div>
      </div>

      {/* Payment method tabs */}
      <div className="form-section">
        <h3 className="form-section-title">Payment</h3>
        <p className="payment-secure-note">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          All transactions are encrypted and secure
        </p>

        <div className="payment-tabs">
          {(["card", "paypal", "apple"] as const).map((m) => (
            <button
              key={m}
              className={`payment-tab ${method === m ? "payment-tab-active" : ""}`}
              onClick={() => setMethod(m)}
            >
              {m === "card" && (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                    <line x1="1" y1="10" x2="23" y2="10" />
                  </svg>
                  Card
                </>
              )}
              {m === "paypal" && "PayPal"}
              {m === "apple" && "Apple Pay"}
            </button>
          ))}
        </div>

        {method === "card" && (
          <div className="card-form">
            <div className="field-group">
              <div className="field">
                <label className="field-label">Card number</label>
                <div className="card-input-wrap">
                  <input
                    type="text"
                    className="field-input"
                    placeholder="1234 5678 9012 3456"
                    value={card.number}
                    onChange={(e) => setCard((p) => ({ ...p, number: formatCard(e.target.value) }))}
                    maxLength={19}
                  />
                  <div className="card-icons">
                    <span className="card-icon-chip">VISA</span>
                    <span className="card-icon-chip">MC</span>
                  </div>
                </div>
              </div>
              <div className="field">
                <label className="field-label">Name on card</label>
                <input
                  type="text"
                  className="field-input"
                  placeholder="As it appears on your card"
                  value={card.name}
                  onChange={setC("name")}
                />
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label className="field-label">Expiry date</label>
                <input
                  type="text"
                  className="field-input"
                  placeholder="MM/YY"
                  value={card.expiry}
                  onChange={(e) => setCard((p) => ({ ...p, expiry: formatExpiry(e.target.value) }))}
                  maxLength={5}
                />
              </div>
              <div className="field">
                <label className="field-label">
                  Security code
                  <span className="cvv-hint" title="3-digit code on the back of your card">?</span>
                </label>
                <input
                  type="text"
                  className="field-input"
                  placeholder="CVV"
                  value={card.cvv}
                  onChange={setC("cvv")}
                  maxLength={4}
                />
              </div>
            </div>
          </div>
        )}

        {method === "paypal" && (
          <div className="alt-payment-msg">
            <p>You will be redirected to PayPal to complete your purchase securely.</p>
          </div>
        )}

        {method === "apple" && (
          <div className="alt-payment-msg">
            <p>Use Touch ID or Face ID to pay with Apple Pay.</p>
          </div>
        )}
      </div>

      {/* Billing address */}
      <div className="form-section">
        <h3 className="form-section-title">Billing Address</h3>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={billingMatch}
            onChange={(e) => setBillingMatch(e.target.checked)}
            className="checkbox-input"
          />
          <span className="checkbox-text">Same as delivery address</span>
        </label>
        {!billingMatch && (
          <div className="billing-form-extra" style={{ marginTop: 20 }}>
            <div className="field-row">
              <div className="field">
                <label className="field-label">First name</label>
                <input type="text" className="field-input" />
              </div>
              <div className="field">
                <label className="field-label">Last name</label>
                <input type="text" className="field-input" />
              </div>
            </div>
            <div className="field-group">
              <div className="field">
                <label className="field-label">Address</label>
                <input type="text" className="field-input" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="step-actions">
        <button className="back-link" onClick={onBack}>
          ← Return to shipping
        </button>
        <button className="btn-primary btn-pay">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          Pay Now · ${cartItems.reduce((s, i) => s + i.price * i.qty, 0) + 0}
        </button>
      </div>

      <p className="checkout-legal">
        By completing your purchase you agree to our{" "}
        <Link href="/terms" className="inline-link">Terms of Service</Link> and{" "}
        <Link href="/privacy" className="inline-link">Privacy Policy</Link>.
      </p>
    </div>
  );
}

// ─── Checkout Nav ─────────────────────────────────────────────────────────────
function CheckoutNav() {
  return (
    <nav className="checkout-nav">
      <Link href="/" className="checkout-logo">
        MAISON ELARA
      </Link>
      <div className="checkout-nav-right">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        <span>Secure Checkout</span>
      </div>
    </nav>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const [step, setStep] = useState<Step>("information");
  const [completedSteps, setCompletedSteps] = useState<Step[]>([]);

  const advance = (current: Step, next: Step) => {
    setCompletedSteps((p) => (p.includes(current) ? p : [...p, current]));
    setStep(next);
  };

  return (
    <>
      <AnnouncementBar />
      <CheckoutNav />

      <main className="checkout-page">
        <div className="checkout-inner">
          {/* Left column */}
          <div className="checkout-left">
            <CheckoutProgress step={step} setStep={setStep} completedSteps={completedSteps} />

            {step === "information" && (
              <InformationStep onNext={() => advance("information", "shipping")} />
            )}
            {step === "shipping" && (
              <ShippingStep
                onNext={() => advance("shipping", "payment")}
                onBack={() => setStep("information")}
              />
            )}
            {step === "payment" && (
              <PaymentStep onBack={() => setStep("shipping")} />
            )}
          </div>

          {/* Right column */}
          <div className="checkout-right">
            <OrderSummary promoApplied={completedSteps.length > 0} />
          </div>
        </div>
      </main>

      <style>{`
        /* ── Checkout Layout ── */
        .checkout-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 60px;
          border-bottom: 1px solid var(--border);
          background: var(--cream);
        }
        .checkout-logo {
          font-family: var(--font-display);
          font-size: 20px;
          font-weight: 500;
          letter-spacing: 0.15em;
          color: var(--charcoal);
        }
        .checkout-nav-right {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          letter-spacing: 0.08em;
          color: var(--muted);
          text-transform: uppercase;
        }

        .checkout-page {
          min-height: 80vh;
          padding: 48px 60px 80px;
          background: var(--cream);
        }
        .checkout-inner {
          display: grid;
          grid-template-columns: 1fr 420px;
          gap: 64px;
          max-width: 1100px;
          margin: 0 auto;
          align-items: start;
        }

        /* ── Progress ── */
        .checkout-progress {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-bottom: 36px;
        }
        .progress-item {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .progress-step {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: var(--muted);
          letter-spacing: 0.06em;
          padding: 0;
          background: none;
          border: none;
          cursor: default;
          transition: color 0.2s;
        }
        .progress-step.progress-done {
          color: var(--charcoal-light);
          cursor: pointer;
        }
        .progress-step.progress-active {
          color: var(--charcoal);
          font-weight: 500;
        }
        .progress-num {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 1px solid currentColor;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          flex-shrink: 0;
        }
        .progress-step.progress-done .progress-num {
          background: var(--charcoal);
          border-color: var(--charcoal);
          color: var(--cream);
        }
        .progress-step.progress-active .progress-num {
          background: var(--charcoal);
          border-color: var(--charcoal);
          color: var(--cream);
        }
        .progress-sep {
          color: var(--border);
          margin: 0 6px;
          font-size: 16px;
        }

        /* ── Step summary breadcrumb ── */
        .step-summary {
          border: 1px solid var(--border);
          margin-bottom: 28px;
        }
        .step-summary-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-bottom: 1px solid var(--border);
          font-size: 13px;
        }
        .step-summary-row:last-child {
          border-bottom: none;
        }
        .step-summary-label {
          color: var(--muted);
          letter-spacing: 0.06em;
          width: 60px;
          flex-shrink: 0;
          font-size: 12px;
          text-transform: uppercase;
        }
        .step-summary-val {
          flex: 1;
          color: var(--charcoal);
        }
        .step-summary-edit {
          font-size: 12px;
          color: var(--gold);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          border-bottom: 1px solid var(--gold);
          padding-bottom: 1px;
          cursor: pointer;
          background: none;
          border-left: none;
          border-right: none;
          border-top: none;
          transition: color 0.2s;
        }
        .step-summary-edit:hover { color: var(--charcoal); border-color: var(--charcoal); }

        /* ── Form Sections ── */
        .form-section {
          margin-bottom: 32px;
        }
        .form-section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .form-section-title {
          font-family: var(--font-display);
          font-size: 18px;
          font-weight: 400;
          color: var(--charcoal);
          margin-bottom: 20px;
        }
        .form-section-header .form-section-title { margin-bottom: 0; }
        .form-section-link {
          font-size: 13px;
          color: var(--muted);
        }
        .inline-link {
          color: var(--gold);
          border-bottom: 1px solid var(--gold);
          padding-bottom: 1px;
          transition: color 0.2s;
        }
        .inline-link:hover { color: var(--charcoal); border-color: var(--charcoal); }

        .field-group { display: flex; flex-direction: column; gap: 16px; margin-bottom: 16px; }
        .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
        .field { display: flex; flex-direction: column; gap: 6px; }
        .field-label {
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--charcoal-light);
          font-weight: 400;
        }
        .field-optional { color: var(--muted); font-size: 10px; }
        .field-input {
          width: 100%;
          padding: 12px 14px;
          border: 1px solid var(--border);
          background: var(--white);
          font-size: 14px;
          color: var(--charcoal);
          font-family: var(--font-body);
          outline: none;
          transition: border-color 0.2s;
        }
        .field-input:focus { border-color: var(--charcoal); }
        .field-input::placeholder { color: var(--muted); font-size: 13px; }
        .select-wrap { position: relative; }
        .field-select-el { cursor: pointer; appearance: none; }
        .select-chevron {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: var(--muted);
        }

        /* ── Checkbox ── */
        .checkbox-label {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          cursor: pointer;
          margin-top: 8px;
        }
        .checkbox-input {
          width: 16px;
          height: 16px;
          accent-color: var(--charcoal);
          cursor: pointer;
          flex-shrink: 0;
          margin-top: 1px;
        }
        .checkbox-text { font-size: 13px; color: var(--charcoal-light); line-height: 1.5; }

        /* ── Shipping options ── */
        .shipping-options { display: flex; flex-direction: column; gap: 0; border: 1px solid var(--border); }
        .shipping-option {
          display: block;
          border-bottom: 1px solid var(--border);
          cursor: pointer;
          transition: background 0.2s;
        }
        .shipping-option:last-child { border-bottom: none; }
        .shipping-option:hover { background: var(--cream-dark); }
        .shipping-option-active { background: var(--cream-dark); }
        .shipping-radio { display: none; }
        .shipping-option-body {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          gap: 12px;
        }
        .shipping-option-left { display: flex; align-items: center; gap: 14px; }
        .shipping-dot {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 1.5px solid var(--border);
          flex-shrink: 0;
          position: relative;
          transition: border-color 0.2s;
        }
        .shipping-option-active .shipping-dot {
          border-color: var(--charcoal);
          background: var(--charcoal);
          box-shadow: inset 0 0 0 3px var(--cream-dark);
        }
        .shipping-label { font-size: 14px; color: var(--charcoal); font-weight: 400; }
        .shipping-desc { font-size: 12px; color: var(--muted); margin-top: 2px; }
        .shipping-price { font-size: 14px; color: var(--charcoal); flex-shrink: 0; }
        .shipping-free { color: #2a7a4a; font-weight: 500; }

        /* ── Payment ── */
        .payment-secure-note {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: var(--muted);
          margin-bottom: 20px;
          margin-top: -10px;
        }
        .payment-tabs {
          display: flex;
          border: 1px solid var(--border);
          margin-bottom: 20px;
        }
        .payment-tab {
          flex: 1;
          padding: 12px;
          font-size: 13px;
          color: var(--charcoal-light);
          letter-spacing: 0.05em;
          border-right: 1px solid var(--border);
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .payment-tab:last-child { border-right: none; }
        .payment-tab:hover { background: var(--cream-dark); color: var(--charcoal); }
        .payment-tab-active { background: var(--charcoal); color: var(--cream); }
        .card-form { margin-top: 4px; }
        .card-input-wrap { position: relative; }
        .card-icons {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          gap: 6px;
          pointer-events: none;
        }
        .card-icon-chip {
          font-size: 9px;
          letter-spacing: 0.06em;
          border: 1px solid var(--border);
          padding: 2px 5px;
          color: var(--muted);
        }
        .cvv-hint {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 1px solid var(--muted);
          font-size: 9px;
          color: var(--muted);
          margin-left: 4px;
          cursor: help;
        }
        .alt-payment-msg {
          padding: 24px 20px;
          background: var(--cream-dark);
          border: 1px solid var(--border);
          font-family: var(--font-editorial);
          font-size: 15px;
          color: var(--muted);
          text-align: center;
          font-style: italic;
        }

        /* ── Step actions ── */
        .step-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 32px;
          gap: 20px;
        }
        .back-link {
          font-size: 13px;
          color: var(--muted);
          letter-spacing: 0.05em;
          background: none;
          border: none;
          cursor: pointer;
          transition: color 0.2s;
          padding: 0;
          font-family: var(--font-body);
        }
        .back-link:hover { color: var(--charcoal); }
        .btn-pay {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .checkout-legal {
          margin-top: 20px;
          font-size: 12px;
          color: var(--muted);
          text-align: center;
          line-height: 1.6;
        }

        /* ── Order Summary (right column) ── */
        .order-summary {
          background: var(--cream-dark);
          border: 1px solid var(--border);
          padding: 32px;
          position: sticky;
          top: 100px;
        }
        .summary-title {
          font-family: var(--font-display);
          font-size: 20px;
          font-weight: 400;
          color: var(--charcoal);
          margin-bottom: 24px;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--border);
        }
        .summary-items { margin-bottom: 24px; display: flex; flex-direction: column; gap: 16px; }
        .summary-item { display: grid; grid-template-columns: 64px 1fr auto; gap: 14px; align-items: center; }
        .summary-item-img {
          width: 64px;
          height: 80px;
          position: relative;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .summary-item-qty {
          position: absolute;
          top: -8px;
          right: -8px;
          width: 20px;
          height: 20px;
          background: var(--charcoal-mid);
          color: var(--cream);
          border-radius: 50%;
          font-size: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .summary-item-name {
          font-family: var(--font-display);
          font-size: 14px;
          font-weight: 400;
          color: var(--charcoal);
          margin-bottom: 3px;
        }
        .summary-item-variant { font-size: 12px; color: var(--muted); }
        .summary-item-price {
          font-size: 14px;
          color: var(--charcoal);
          text-align: right;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 2px;
        }
        .summary-item-orig {
          font-size: 12px;
          color: var(--muted);
          text-decoration: line-through;
        }

        /* Promo */
        .summary-promo { margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid var(--border); }
        .promo-toggle {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 13px;
          color: var(--charcoal-light);
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          font-family: var(--font-body);
          transition: color 0.2s;
        }
        .promo-toggle:hover { color: var(--gold); }
        .promo-field { display: flex; gap: 0; border: 1px solid var(--border); overflow: hidden; }
        .promo-input {
          flex: 1;
          padding: 10px 14px;
          border: none;
          background: var(--white);
          font-size: 13px;
          color: var(--charcoal);
          font-family: var(--font-body);
          outline: none;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .promo-apply {
          padding: 10px 18px;
          background: var(--charcoal);
          color: var(--cream);
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          transition: background 0.2s;
          font-family: var(--font-body);
          cursor: pointer;
          border: none;
        }
        .promo-apply:hover { background: var(--gold); }
        .promo-error { font-size: 12px; color: #c0392b; margin-top: 8px; }

        /* Totals */
        .summary-totals { margin-bottom: 24px; display: flex; flex-direction: column; gap: 10px; }
        .total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
          color: var(--charcoal-light);
        }
        .total-discount { color: #2a7a4a; }
        .total-grand {
          font-size: 17px;
          color: var(--charcoal);
          font-weight: 500;
          border-top: 1px solid var(--border);
          padding-top: 12px;
          margin-top: 4px;
        }
        .free-shipping { color: #2a7a4a; }
        .shipping-notice {
          font-size: 11px;
          color: var(--muted);
          background: var(--cream);
          border: 1px solid var(--border);
          padding: 8px 12px;
          letter-spacing: 0.03em;
        }

        /* Trust */
        .trust-badges { display: flex; flex-direction: column; gap: 8px; padding-top: 16px; border-top: 1px solid var(--border); }
        .trust-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: var(--muted);
        }

        /* ── Responsive ── */
        @media (max-width: 960px) {
          .checkout-inner {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .checkout-right { order: -1; }
          .order-summary { position: static; }
          .checkout-page { padding: 32px 20px 60px; }
          .checkout-nav { padding: 16px 20px; }
        }
        @media (max-width: 600px) {
          .field-row { grid-template-columns: 1fr; }
          .step-actions { flex-direction: column-reverse; align-items: stretch; }
          .back-link { text-align: center; }
          .checkout-progress { gap: 2px; }
          .progress-label { display: none; }
        }
      `}</style>
    </>
  );
}