"use client";
import { useState } from "react";
import Link from "next/link";
import AnnouncementBar from "@/components/AnnouncementBar";

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const e: Record<string, string> = {};
    if (!email.includes("@")) e.email = "Please enter a valid email.";
    if (password.length < 1) e.password = "Password is required.";
    return e;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setServerError("");
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    // Simulate wrong credentials for demo
    setServerError("Invalid email or password. Please try again.");
  };

  const setField =
    (setter: (v: string) => void, key: string) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
      setErrors((p) => ({ ...p, [key]: "" }));
      setServerError("");
    };

  return (
    <>
      <AnnouncementBar />

      {/* Top bar */}
      <div className="login-topbar">
        <Link href="/" className="login-logo">
          MAISON ELARA
        </Link>
        <Link href="/register" className="login-join-link">
          New here? <span>Create account</span>
        </Link>
      </div>

      <main className="login-page">
        {/* ── Left: Form ── */}
        <div className="login-form-col">
          <div className="login-form-wrap">
            {/* Header */}
            <div className="login-form-header">
              <span className="login-eyebrow">Welcome back</span>
              <h1 className="login-form-title">
                Sign in to<br />
                <em>your Maison.</em>
              </h1>
            </div>

            {/* Server error */}
            {serverError && (
              <div className="login-server-error">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {serverError}
              </div>
            )}

            <form className="login-form" onSubmit={handleSubmit} noValidate>
              {/* Email */}
              <div className="login-field">
                <label className="login-label">Email Address</label>
                <input
                  type="email"
                  className={`login-input ${errors.email ? "login-input-error" : ""}`}
                  placeholder="you@example.com"
                  value={email}
                  onChange={setField(setEmail, "email")}
                  autoComplete="email"
                />
                {errors.email && <p className="login-error">{errors.email}</p>}
              </div>

              {/* Password */}
              <div className="login-field">
                <div className="login-label-row">
                  <label className="login-label">Password</label>
                  <Link href="/forgot-password" className="login-forgot-link">
                    Forgot password?
                  </Link>
                </div>
                <div className="login-input-wrap">
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`login-input login-input-icon ${errors.password ? "login-input-error" : ""}`}
                    placeholder="••••••••"
                    value={password}
                    onChange={setField(setPassword, "password")}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="login-show-btn"
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
                {errors.password && <p className="login-error">{errors.password}</p>}
              </div>

              {/* Remember me */}
              <label className="login-check-row">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="login-checkbox"
                />
                <span className="login-check-text">Keep me signed in</span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                className="login-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <span className="login-spinner" />
                ) : (
                  "Sign In"
                )}
              </button>

              {/* Divider */}
              <div className="login-divider">
                <span>or continue with</span>
              </div>

              {/* OAuth */}
              <div className="login-oauth-row">
                <button type="button" className="login-oauth-btn">
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Google
                </button>
                <button type="button" className="login-oauth-btn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  Apple
                </button>
              </div>

              <p className="login-register-cta">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="login-inline-link">
                  Join Maison Elara
                </Link>
              </p>
            </form>
          </div>
        </div>

        {/* ── Right: Editorial Panel ── */}
        <aside className="login-panel">
          <div className="login-panel-content">
            {/* Decorative image blocks */}
            <div className="login-panel-imagery">
              <div
                className="login-panel-img login-panel-img-main"
                style={{ background: "linear-gradient(155deg,#e8ddd0 0%,#d4c4b0 100%)" }}
              >
                <div className="login-panel-img-label">
                  <span className="login-panel-caption-line" />
                  <span>Maison Elara · SS25</span>
                </div>
              </div>
              <div
                className="login-panel-img login-panel-img-sm1"
                style={{ background: "linear-gradient(155deg,#c8d5c8 0%,#b0c4b4 100%)" }}
              />
              <div
                className="login-panel-img login-panel-img-sm2"
                style={{ background: "linear-gradient(155deg,#d0c8d5 0%,#b8b0c4 100%)" }}
              />
            </div>

            {/* Text */}
            <div className="login-panel-text">
              <div className="login-panel-ornament">✦</div>
              <h2 className="login-panel-heading">
                Your wardrobe,
                <br />
                <em>waiting.</em>
              </h2>
              <p className="login-panel-sub">
                Sign in to access your wishlist, track your orders, and
                discover pieces curated just for you.
              </p>

              {/* Member perks */}
              <div className="login-perks">
                {[
                  { icon: "★", label: "1,240 loyalty points waiting" },
                  { icon: "↩", label: "Free 30-day returns on every order" },
                  { icon: "◈", label: "Early access to new collections" },
                  { icon: "✦", label: "Exclusive member-only offers" },
                ].map((p) => (
                  <div key={p.label} className="login-perk">
                    <span className="login-perk-icon">{p.icon}</span>
                    <span className="login-perk-label">{p.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </main>

      <style>{`
        /* ── Topbar ── */
        .login-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 60px;
          border-bottom: 1px solid var(--border);
          background: var(--cream);
        }
        .login-logo {
          font-family: var(--font-display);
          font-size: 20px;
          font-weight: 500;
          letter-spacing: 0.15em;
          color: var(--charcoal);
        }
        .login-join-link {
          font-size: 13px;
          color: var(--muted);
          letter-spacing: 0.04em;
        }
        .login-join-link span {
          color: var(--gold);
          border-bottom: 1px solid var(--gold);
          padding-bottom: 1px;
          margin-left: 4px;
          transition: color 0.2s;
        }
        .login-join-link:hover span {
          color: var(--charcoal);
          border-color: var(--charcoal);
        }

        /* ── Page Layout ── */
        .login-page {
          display: grid;
          grid-template-columns: 1fr 420px;
          min-height: calc(100vh - 114px);
        }

        /* ── Form Column ── */
        .login-form-col {
          background: var(--cream);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 56px 48px;
          overflow-y: auto;
        }
        .login-form-wrap {
          width: 100%;
          max-width: 440px;
          animation: fadeUp 0.6s ease both;
        }

        /* Header */
        .login-form-header {
          margin-bottom: 36px;
        }
        .login-eyebrow {
          display: block;
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 14px;
        }
        .login-form-title {
          font-family: var(--font-display);
          font-size: clamp(32px, 3vw, 44px);
          font-weight: 400;
          line-height: 1.1;
          color: var(--charcoal);
        }
        .login-form-title em {
          font-style: italic;
          color: var(--gold);
        }

        /* Server error */
        .login-server-error {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #fff5f5;
          border: 1px solid #f5c6c6;
          padding: 12px 16px;
          font-size: 13px;
          color: #c0392b;
          margin-bottom: 24px;
          letter-spacing: 0.02em;
          animation: fadeUp 0.3s ease both;
        }

        /* Form */
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .login-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .login-label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .login-label {
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--charcoal-light);
          font-weight: 400;
        }
        .login-forgot-link {
          font-size: 12px;
          color: var(--gold);
          border-bottom: 1px solid var(--gold);
          padding-bottom: 1px;
          transition: color 0.2s;
        }
        .login-forgot-link:hover {
          color: var(--charcoal);
          border-color: var(--charcoal);
        }
        .login-input {
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
        .login-input:focus {
          border-color: var(--charcoal);
        }
        .login-input::placeholder {
          color: var(--muted);
        }
        .login-input-error {
          border-color: #c0392b;
        }
        .login-input-icon {
          padding-right: 44px;
        }
        .login-error {
          font-size: 12px;
          color: #c0392b;
          letter-spacing: 0.02em;
        }

        /* Password toggle */
        .login-input-wrap {
          position: relative;
        }
        .login-show-btn {
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
        .login-show-btn:hover {
          color: var(--charcoal);
        }

        /* Remember me */
        .login-check-row {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          margin-top: -4px;
        }
        .login-checkbox {
          width: 16px;
          height: 16px;
          accent-color: var(--charcoal);
          cursor: pointer;
          flex-shrink: 0;
        }
        .login-check-text {
          font-size: 13px;
          color: var(--charcoal-light);
        }

        /* Submit */
        .login-submit-btn {
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
        .login-submit-btn:hover:not(:disabled) {
          background: var(--gold);
          border-color: var(--gold);
        }
        .login-submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        /* Spinner */
        .login-spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(250, 247, 242, 0.3);
          border-top-color: var(--cream);
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Divider */
        .login-divider {
          display: flex;
          align-items: center;
          gap: 14px;
          margin: 4px 0;
        }
        .login-divider::before,
        .login-divider::after {
          content: "";
          flex: 1;
          height: 1px;
          background: var(--border);
        }
        .login-divider span {
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted);
          white-space: nowrap;
        }

        /* OAuth */
        .login-oauth-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .login-oauth-btn {
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
        .login-oauth-btn:hover {
          border-color: var(--charcoal);
          background: var(--cream-dark);
        }

        .login-inline-link {
          color: var(--gold);
          border-bottom: 1px solid var(--gold);
          padding-bottom: 1px;
          transition: color 0.2s;
        }
        .login-inline-link:hover {
          color: var(--charcoal);
          border-color: var(--charcoal);
        }
        .login-register-cta {
          text-align: center;
          font-size: 13px;
          color: var(--muted);
          margin-top: -4px;
        }

        /* ── Right Panel ── */
        .login-panel {
          background: var(--charcoal);
          position: relative;
          overflow: hidden;
        }
        .login-panel-content {
          height: 100%;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        /* Imagery */
        .login-panel-imagery {
          position: relative;
          flex: 1;
          min-height: 360px;
        }
        .login-panel-img {
          position: absolute;
          border-radius: 2px;
          overflow: hidden;
        }
        .login-panel-img-main {
          top: 0;
          left: 0;
          right: 0;
          bottom: 40%;
          display: flex;
          align-items: flex-end;
        }
        .login-panel-img-label {
          padding: 14px 20px;
          background: rgba(26, 26, 26, 0.65);
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(250, 247, 242, 0.65);
        }
        .login-panel-caption-line {
          width: 20px;
          height: 1px;
          background: var(--gold);
          flex-shrink: 0;
        }
        .login-panel-img-sm1 {
          bottom: 0;
          left: 0;
          width: 55%;
          top: 62%;
          border: 6px solid var(--charcoal);
        }
        .login-panel-img-sm2 {
          bottom: 0;
          right: 0;
          width: 42%;
          top: 58%;
          border: 6px solid var(--charcoal);
        }

        /* Panel text */
        .login-panel-text {
          padding: 36px 40px 48px;
          position: relative;
          z-index: 1;
        }
        .login-panel-ornament {
          font-size: 13px;
          color: var(--gold);
          letter-spacing: 0.2em;
          margin-bottom: 16px;
        }
        .login-panel-heading {
          font-family: var(--font-display);
          font-size: clamp(28px, 2.8vw, 40px);
          font-weight: 400;
          line-height: 1.08;
          color: rgba(250, 247, 242, 0.92);
          margin-bottom: 14px;
          animation: fadeUp 0.7s 0.08s ease both;
        }
        .login-panel-heading em {
          font-style: italic;
          color: var(--gold);
        }
        .login-panel-sub {
          font-family: var(--font-editorial);
          font-size: 15px;
          font-weight: 300;
          color: rgba(250, 247, 242, 0.45);
          line-height: 1.7;
          margin-bottom: 28px;
          animation: fadeUp 0.7s 0.15s ease both;
        }

        /* Perks */
        .login-perks {
          display: flex;
          flex-direction: column;
          gap: 12px;
          animation: fadeUp 0.7s 0.22s ease both;
        }
        .login-perk {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.07);
          transition: background 0.2s;
        }
        .login-perk:hover {
          background: rgba(255, 255, 255, 0.08);
        }
        .login-perk-icon {
          font-size: 12px;
          color: var(--gold);
          flex-shrink: 0;
          width: 20px;
          text-align: center;
        }
        .login-perk-label {
          font-size: 12px;
          color: rgba(250, 247, 242, 0.6);
          letter-spacing: 0.03em;
        }

        /* ── Responsive ── */
        @media (max-width: 1024px) {
          .login-page { grid-template-columns: 1fr 360px; }
        }
        @media (max-width: 800px) {
          .login-page { grid-template-columns: 1fr; }
          .login-panel { display: none; }
          .login-form-col { padding: 40px 24px; align-items: flex-start; }
          .login-topbar { padding: 16px 24px; }
        }
        @media (max-width: 480px) {
          .login-oauth-row { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}