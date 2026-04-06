"use client";
import { useState } from "react";
import Link from "next/link";
import AnnouncementBar from "@/components/AnnouncementBar";

// ─── Benefits shown on the left panel ────────────────────────────────────────
const PERKS = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    title: "Curated Wishlist",
    body: "Save pieces you love and return to them whenever you're ready.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
    title: "Order Tracking",
    body: "Follow every step of your order's journey, start to door.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    title: "Early Access",
    body: "Be the first to know about new collections and member exclusives.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    title: "Loyalty Points",
    body: "Earn points with every purchase. Redeem them for future orders.",
  },
];

// ─── Password strength ────────────────────────────────────────────────────────
function getStrength(pw: string): { score: number; label: string; color: string } {
  if (!pw) return { score: 0, label: "", color: "transparent" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const map = [
    { label: "Too short", color: "#c0392b" },
    { label: "Weak", color: "#c0392b" },
    { label: "Fair", color: "#b87333" },
    { label: "Good", color: "#c9a96e" },
    { label: "Strong", color: "#2a7a4a" },
  ];
  return { score, ...map[score] };
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function RegisterPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [newsletter, setNewsletter] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((p) => ({ ...p, [k]: e.target.value }));
      setErrors((p) => ({ ...p, [k]: "" }));
    };

  const strength = getStrength(form.password);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = "First name is required.";
    if (!form.lastName.trim()) e.lastName = "Last name is required.";
    if (!form.email.includes("@")) e.email = "Please enter a valid email.";
    if (form.password.length < 8) e.password = "Password must be at least 8 characters.";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match.";
    if (!agree) e.agree = "Please accept the terms to continue.";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    setSuccess(true);
  };

  return (
    <>
      <AnnouncementBar />

      {/* Back to store nav */}
      <div className="reg-topbar">
        <Link href="/" className="reg-logo">MAISON ELARA</Link>
        <Link href="/login" className="reg-signin-link">
          Already a member? <span>Sign in</span>
        </Link>
      </div>

      <main className="reg-page">
        {/* ── Left panel — editorial / brand ── */}
        <aside className="reg-panel">
          <div className="reg-panel-content">
            <div className="reg-panel-ornament">✦</div>
            <h2 className="reg-panel-heading">
              Join the
              <br />
              <em>Maison.</em>
            </h2>
            <p className="reg-panel-sub">
              A community of women who choose quality over quantity — and wear
              with intention.
            </p>

            <div className="reg-perks">
              {PERKS.map((perk) => (
                <div key={perk.title} className="reg-perk">
                  <div className="reg-perk-icon">{perk.icon}</div>
                  <div className="reg-perk-text">
                    <p className="reg-perk-title">{perk.title}</p>
                    <p className="reg-perk-body">{perk.body}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Decorative image blocks */}
            <div className="reg-panel-imagery">
              <div className="reg-panel-img reg-panel-img-1" />
              <div className="reg-panel-img reg-panel-img-2" />
            </div>
          </div>
        </aside>

        {/* ── Right panel — form ── */}
        <div className="reg-form-col">
          {success ? (
            <div className="reg-success">
              <div className="reg-success-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h2 className="reg-success-title">Welcome to Maison Elara.</h2>
              <p className="reg-success-sub">
                Your account has been created. We&apos;re glad to have you here.
              </p>
              <Link href="/shop" className="btn-primary" style={{ marginTop: 28 }}>
                Explore the Collection
              </Link>
            </div>
          ) : (
            <div className="reg-form-wrap">
              <div className="reg-form-header">
                <span className="reg-eyebrow">Create Account</span>
                <h1 className="reg-form-title">
                  Begin your
                  <br />
                  <em>journey.</em>
                </h1>
              </div>

              <form className="reg-form" onSubmit={handleSubmit} noValidate>
                {/* Name row */}
                <div className="reg-field-row">
                  <div className="reg-field">
                    <label className="reg-label">First Name</label>
                    <input
                      type="text"
                      className={`reg-input ${errors.firstName ? "reg-input-error" : ""}`}
                      placeholder="Sophie"
                      value={form.firstName}
                      onChange={set("firstName")}
                      autoComplete="given-name"
                    />
                    {errors.firstName && <p className="reg-error">{errors.firstName}</p>}
                  </div>
                  <div className="reg-field">
                    <label className="reg-label">Last Name</label>
                    <input
                      type="text"
                      className={`reg-input ${errors.lastName ? "reg-input-error" : ""}`}
                      placeholder="Beaumont"
                      value={form.lastName}
                      onChange={set("lastName")}
                      autoComplete="family-name"
                    />
                    {errors.lastName && <p className="reg-error">{errors.lastName}</p>}
                  </div>
                </div>

                {/* Email */}
                <div className="reg-field">
                  <label className="reg-label">Email Address</label>
                  <input
                    type="email"
                    className={`reg-input ${errors.email ? "reg-input-error" : ""}`}
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={set("email")}
                    autoComplete="email"
                  />
                  {errors.email && <p className="reg-error">{errors.email}</p>}
                </div>

                {/* Password */}
                <div className="reg-field">
                  <label className="reg-label">Password</label>
                  <div className="reg-input-wrap">
                    <input
                      type={showPassword ? "text" : "password"}
                      className={`reg-input reg-input-icon ${errors.password ? "reg-input-error" : ""}`}
                      placeholder="At least 8 characters"
                      value={form.password}
                      onChange={set("password")}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="reg-show-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {/* Strength meter */}
                  {form.password && (
                    <div className="reg-strength">
                      <div className="reg-strength-bars">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className="reg-strength-bar"
                            style={{
                              background: i <= strength.score ? strength.color : "var(--border)",
                              transition: "background 0.3s",
                            }}
                          />
                        ))}
                      </div>
                      <span className="reg-strength-label" style={{ color: strength.color }}>
                        {strength.label}
                      </span>
                    </div>
                  )}
                  {errors.password && <p className="reg-error">{errors.password}</p>}
                </div>

                {/* Confirm password */}
                <div className="reg-field">
                  <label className="reg-label">Confirm Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`reg-input ${errors.confirmPassword ? "reg-input-error" : ""}`}
                    placeholder="Repeat your password"
                    value={form.confirmPassword}
                    onChange={set("confirmPassword")}
                    autoComplete="new-password"
                  />
                  {errors.confirmPassword && (
                    <p className="reg-error">{errors.confirmPassword}</p>
                  )}
                </div>

                {/* Checkboxes */}
                <div className="reg-checks">
                  <label className={`reg-check-row ${errors.agree ? "reg-check-error" : ""}`}>
                    <input
                      type="checkbox"
                      checked={agree}
                      onChange={(e) => {
                        setAgree(e.target.checked);
                        setErrors((p) => ({ ...p, agree: "" }));
                      }}
                      className="reg-checkbox"
                    />
                    <span className="reg-check-text">
                      I agree to Maison Elara&apos;s{" "}
                      <Link href="/terms" className="reg-inline-link">Terms of Service</Link>
                      {" "}and{" "}
                      <Link href="/privacy" className="reg-inline-link">Privacy Policy</Link>
                    </span>
                  </label>
                  {errors.agree && <p className="reg-error" style={{ marginTop: -4 }}>{errors.agree}</p>}

                  <label className="reg-check-row">
                    <input
                      type="checkbox"
                      checked={newsletter}
                      onChange={(e) => setNewsletter(e.target.checked)}
                      className="reg-checkbox"
                    />
                    <span className="reg-check-text">
                      Send me style notes, exclusive offers, and early access to new collections
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="reg-submit-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="reg-spinner" />
                  ) : (
                    "Create Account"
                  )}
                </button>

                {/* Divider */}
                <div className="reg-divider">
                  <span>or continue with</span>
                </div>

                {/* OAuth */}
                <div className="reg-oauth-row">
                  <button type="button" className="reg-oauth-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google
                  </button>
                  <button type="button" className="reg-oauth-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    Apple
                  </button>
                </div>

                <p className="reg-login-cta">
                  Already have an account?{" "}
                  <Link href="/login" className="reg-inline-link">Sign in</Link>
                </p>
              </form>
            </div>
          )}
        </div>
      </main>

      <style>{`
        /* ── Topbar ── */
        .reg-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 60px;
          border-bottom: 1px solid var(--border);
          background: var(--cream);
        }
        .reg-logo {
          font-family: var(--font-display);
          font-size: 20px;
          font-weight: 500;
          letter-spacing: 0.15em;
          color: var(--charcoal);
        }
        .reg-signin-link {
          font-size: 13px;
          color: var(--muted);
          letter-spacing: 0.04em;
        }
        .reg-signin-link span {
          color: var(--gold);
          border-bottom: 1px solid var(--gold);
          padding-bottom: 1px;
          margin-left: 4px;
          transition: color 0.2s;
        }
        .reg-signin-link:hover span { color: var(--charcoal); border-color: var(--charcoal); }

        /* ── Page layout ── */
        .reg-page {
          display: grid;
          grid-template-columns: 420px 1fr;
          min-height: calc(100vh - 114px);
        }

        /* ── Left panel ── */
        .reg-panel {
          background: var(--charcoal);
          position: relative;
          overflow: hidden;
        }
        .reg-panel-content {
          padding: 56px 48px;
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .reg-panel-ornament {
          font-size: 14px;
          color: var(--gold);
          letter-spacing: 0.2em;
          margin-bottom: 32px;
          animation: fadeUp 0.7s ease both;
        }
        .reg-panel-heading {
          font-family: var(--font-display);
          font-size: clamp(40px, 3.5vw, 56px);
          font-weight: 400;
          line-height: 1.04;
          color: rgba(250,247,242,0.92);
          margin-bottom: 20px;
          animation: fadeUp 0.7s 0.08s ease both;
        }
        .reg-panel-heading em { font-style: italic; color: var(--gold); }
        .reg-panel-sub {
          font-family: var(--font-editorial);
          font-size: 16px;
          font-weight: 300;
          color: rgba(250,247,242,0.48);
          line-height: 1.75;
          max-width: 280px;
          margin-bottom: 44px;
          animation: fadeUp 0.7s 0.14s ease both;
        }

        /* Perks */
        .reg-perks {
          display: flex;
          flex-direction: column;
          gap: 22px;
          flex: 1;
          animation: fadeUp 0.7s 0.2s ease both;
        }
        .reg-perk {
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }
        .reg-perk-icon {
          width: 36px;
          height: 36px;
          flex-shrink: 0;
          border: 1px solid rgba(201,169,110,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--gold);
          margin-top: 2px;
        }
        .reg-perk-title {
          font-size: 13px;
          font-weight: 500;
          color: rgba(250,247,242,0.85);
          letter-spacing: 0.04em;
          margin-bottom: 3px;
        }
        .reg-perk-body {
          font-family: var(--font-editorial);
          font-size: 14px;
          font-weight: 300;
          color: rgba(250,247,242,0.4);
          line-height: 1.6;
        }

        /* Imagery deco */
        .reg-panel-imagery {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 160px;
          height: 200px;
        }
        .reg-panel-img {
          position: absolute;
          border-radius: 2px;
        }
        .reg-panel-img-1 {
          width: 100%;
          height: 72%;
          background: linear-gradient(155deg,#3a3020 0%,#2a2018 100%);
          bottom: 0; right: 0;
        }
        .reg-panel-img-2 {
          width: 60%;
          height: 45%;
          background: linear-gradient(155deg,rgba(201,169,110,0.18) 0%,rgba(201,169,110,0.06) 100%);
          border: 1px solid rgba(201,169,110,0.2);
          top: 0; right: 16px;
        }

        /* ── Form column ── */
        .reg-form-col {
          background: var(--cream);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 56px 48px;
          overflow-y: auto;
        }
        .reg-form-wrap {
          width: 100%;
          max-width: 480px;
          animation: fadeUp 0.6s ease both;
        }
        .reg-form-header {
          margin-bottom: 40px;
        }
        .reg-eyebrow {
          display: block;
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 14px;
        }
        .reg-form-title {
          font-family: var(--font-display);
          font-size: clamp(32px, 3vw, 44px);
          font-weight: 400;
          line-height: 1.1;
          color: var(--charcoal);
        }
        .reg-form-title em { font-style: italic; color: var(--gold); }

        /* ── Form fields ── */
        .reg-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .reg-field-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .reg-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .reg-label {
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--charcoal-light);
          font-weight: 400;
        }
        .reg-input {
          padding: 13px 14px;
          border: 1px solid var(--border);
          background: var(--white);
          font-size: 14px;
          color: var(--charcoal);
          font-family: var(--font-body);
          outline: none;
          transition: border-color 0.2s;
          width: 100%;
        }
        .reg-input:focus { border-color: var(--charcoal); }
        .reg-input::placeholder { color: var(--muted); }
        .reg-input-error { border-color: #c0392b; }
        .reg-input-icon { padding-right: 44px; }
        .reg-error {
          font-size: 12px;
          color: #c0392b;
          letter-spacing: 0.02em;
        }

        /* Password visibility toggle */
        .reg-input-wrap { position: relative; }
        .reg-show-btn {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--muted);
          display: flex;
          align-items: center;
          transition: color 0.2s;
          padding: 4px;
        }
        .reg-show-btn:hover { color: var(--charcoal); }

        /* Strength meter */
        .reg-strength {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 6px;
        }
        .reg-strength-bars {
          display: flex;
          gap: 4px;
          flex: 1;
        }
        .reg-strength-bar {
          flex: 1;
          height: 3px;
          border-radius: 2px;
        }
        .reg-strength-label {
          font-size: 11px;
          letter-spacing: 0.06em;
          white-space: nowrap;
        }

        /* Checkboxes */
        .reg-checks {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-top: -4px;
        }
        .reg-check-row {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          cursor: pointer;
        }
        .reg-check-row.reg-check-error .reg-check-text { color: #c0392b; }
        .reg-checkbox {
          width: 16px;
          height: 16px;
          accent-color: var(--charcoal);
          cursor: pointer;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .reg-check-text {
          font-size: 13px;
          color: var(--charcoal-light);
          line-height: 1.55;
        }
        .reg-inline-link {
          color: var(--gold);
          border-bottom: 1px solid var(--gold);
          padding-bottom: 1px;
          transition: color 0.2s;
        }
        .reg-inline-link:hover { color: var(--charcoal); border-color: var(--charcoal); }

        /* Submit button */
        .reg-submit-btn {
          width: 100%;
          padding: 16px;
          background: var(--charcoal);
          color: var(--cream);
          font-size: 12px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          font-family: var(--font-body);
          border: 1px solid var(--charcoal);
          transition: all 0.25s;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 52px;
          margin-top: 4px;
        }
        .reg-submit-btn:hover:not(:disabled) { background: var(--gold); border-color: var(--gold); }
        .reg-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        /* Spinner */
        .reg-spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(250,247,242,0.3);
          border-top-color: var(--cream);
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Divider */
        .reg-divider {
          display: flex;
          align-items: center;
          gap: 14px;
          margin: 4px 0;
        }
        .reg-divider::before,
        .reg-divider::after {
          content: "";
          flex: 1;
          height: 1px;
          background: var(--border);
        }
        .reg-divider span {
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted);
          white-space: nowrap;
        }

        /* OAuth */
        .reg-oauth-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .reg-oauth-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 13px;
          border: 1px solid var(--border);
          background: var(--white);
          font-size: 13px;
          color: var(--charcoal);
          font-family: var(--font-body);
          letter-spacing: 0.04em;
          transition: all 0.2s;
          cursor: pointer;
        }
        .reg-oauth-btn:hover {
          border-color: var(--charcoal);
          background: var(--cream-dark);
        }

        .reg-login-cta {
          text-align: center;
          font-size: 13px;
          color: var(--muted);
          margin-top: -4px;
        }

        /* ── Success state ── */
        .reg-success {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 14px;
          padding: 20px;
          animation: fadeUp 0.5s ease both;
          max-width: 380px;
        }
        .reg-success-icon {
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
        .reg-success-title {
          font-family: var(--font-display);
          font-size: 28px;
          font-weight: 400;
          color: var(--charcoal);
        }
        .reg-success-sub {
          font-family: var(--font-editorial);
          font-size: 16px;
          color: var(--muted);
          font-weight: 300;
          line-height: 1.65;
        }

        /* ── Responsive ── */
        @media (max-width: 1024px) {
          .reg-page { grid-template-columns: 360px 1fr; }
          .reg-panel-content { padding: 48px 36px; }
        }
        @media (max-width: 800px) {
          .reg-page { grid-template-columns: 1fr; }
          .reg-panel { display: none; }
          .reg-form-col { padding: 40px 24px; align-items: flex-start; }
          .reg-topbar { padding: 16px 24px; }
        }
        @media (max-width: 480px) {
          .reg-field-row { grid-template-columns: 1fr; }
          .reg-oauth-row { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}