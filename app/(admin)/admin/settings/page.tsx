"use client";

import { useState } from "react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────
type SettingsTab =
  | "general"
  | "store"
  | "shipping"
  | "payments"
  | "notifications"
  | "team"
  | "security";

type TeamRole = "Super Admin" | "Admin" | "Editor" | "Viewer";

type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
  avatar: string;
  status: "active" | "invited";
  lastSeen: string;
};

// ─── Mock Team Data ───────────────────────────────────────────────────────────
const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "tm_001",
    name: "Admin",
    email: "admin@maisonelara.com",
    role: "Super Admin",
    avatar: "AD",
    status: "active",
    lastSeen: "Now",
  },
  {
    id: "tm_002",
    name: "Isabelle Fontaine",
    email: "isabelle@maisonelara.com",
    role: "Admin",
    avatar: "IF",
    status: "active",
    lastSeen: "2 hours ago",
  },
  {
    id: "tm_003",
    name: "Marcus Webb",
    email: "marcus@maisonelara.com",
    role: "Editor",
    avatar: "MW",
    status: "active",
    lastSeen: "Yesterday",
  },
  {
    id: "tm_004",
    name: "claire.b@agency.com",
    email: "claire.b@agency.com",
    role: "Viewer",
    avatar: "CB",
    status: "invited",
    lastSeen: "—",
  },
];

const ROLE_CONFIG: Record<TeamRole, { color: string; bg: string }> = {
  "Super Admin": { color: "#c9a96e", bg: "rgba(201,169,110,0.12)" },
  Admin:         { color: "#60a5fa", bg: "rgba(96,165,250,0.12)"  },
  Editor:        { color: "#4ade80", bg: "rgba(74,222,128,0.12)"  },
  Viewer:        { color: "#94a3b8", bg: "rgba(148,163,184,0.12)" },
};

// ─── Reusable components ──────────────────────────────────────────────────────
function Field({
  label,
  hint,
  children,
  required,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div className="s-field">
      <label className="s-label">
        {label}
        {required && <span className="s-required"> *</span>}
      </label>
      {children}
      {hint && <p className="s-hint">{hint}</p>}
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  label,
  desc,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  desc?: string;
}) {
  return (
    <label className="s-toggle-row">
      <div className="s-toggle-text-group">
        <span className="s-toggle-label">{label}</span>
        {desc && <span className="s-toggle-desc">{desc}</span>}
      </div>
      <input
        type="checkbox"
        className="s-toggle-input"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="s-toggle-track" />
    </label>
  );
}

function SectionCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="s-card">
      <div className="s-card-header">
        <h3 className="s-card-title">{title}</h3>
        {subtitle && <p className="s-card-sub">{subtitle}</p>}
      </div>
      <div className="s-card-body">{children}</div>
    </div>
  );
}

// ─── Tab: General ─────────────────────────────────────────────────────────────
function GeneralTab() {
  const [form, setForm] = useState({
    storeName: "Maison Elara",
    storeEmail: "hello@maisonelara.com",
    supportEmail: "support@maisonelara.com",
    phone: "+44 20 7123 4567",
    timezone: "Europe/London",
    dateFormat: "DD/MM/YYYY",
    weightUnit: "g",
    dimensionUnit: "cm",
    orderPrefix: "ME-",
  });

  return (
    <div className="s-tab-content">
      <SectionCard title="Store Identity" subtitle="Your store name and contact details.">
        <div className="s-form-row">
          <Field label="Store Name" required>
            <input
              className="s-input"
              value={form.storeName}
              onChange={(e) => setForm((p) => ({ ...p, storeName: e.target.value }))}
            />
          </Field>
          <Field label="Order Number Prefix">
            <input
              className="s-input s-input-mono"
              value={form.orderPrefix}
              onChange={(e) => setForm((p) => ({ ...p, orderPrefix: e.target.value }))}
              placeholder="e.g. ME-"
            />
          </Field>
        </div>
        <div className="s-form-row">
          <Field label="Store Email" required hint="Used for system notifications and customer receipts.">
            <input
              className="s-input"
              type="email"
              value={form.storeEmail}
              onChange={(e) => setForm((p) => ({ ...p, storeEmail: e.target.value }))}
            />
          </Field>
          <Field label="Support Email" hint="Displayed to customers on order emails.">
            <input
              className="s-input"
              type="email"
              value={form.supportEmail}
              onChange={(e) => setForm((p) => ({ ...p, supportEmail: e.target.value }))}
            />
          </Field>
        </div>
        <Field label="Phone Number" hint="Shown on invoices and legal documents.">
          <input
            className="s-input"
            value={form.phone}
            onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
          />
        </Field>
      </SectionCard>

      <SectionCard title="Locale & Formatting">
        <div className="s-form-row">
          <Field label="Timezone">
            <div className="s-select-wrap">
              <select
                className="s-input s-select"
                value={form.timezone}
                onChange={(e) => setForm((p) => ({ ...p, timezone: e.target.value }))}
              >
                <option value="Europe/London">Europe/London (GMT)</option>
                <option value="Europe/Paris">Europe/Paris (CET)</option>
                <option value="America/New_York">America/New_York (EST)</option>
                <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
              </select>
              <ChevronIcon />
            </div>
          </Field>
          <Field label="Date Format">
            <div className="s-select-wrap">
              <select
                className="s-input s-select"
                value={form.dateFormat}
                onChange={(e) => setForm((p) => ({ ...p, dateFormat: e.target.value }))}
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
              <ChevronIcon />
            </div>
          </Field>
        </div>
        <div className="s-form-row">
          <Field label="Weight Unit">
            <div className="s-radio-group">
              {["g", "kg", "lb", "oz"].map((u) => (
                <label key={u} className={`s-radio-btn ${form.weightUnit === u ? "s-radio-active" : ""}`}>
                  <input
                    type="radio"
                    value={u}
                    checked={form.weightUnit === u}
                    onChange={() => setForm((p) => ({ ...p, weightUnit: u }))}
                    style={{ display: "none" }}
                  />
                  {u}
                </label>
              ))}
            </div>
          </Field>
          <Field label="Dimension Unit">
            <div className="s-radio-group">
              {["cm", "in"].map((u) => (
                <label key={u} className={`s-radio-btn ${form.dimensionUnit === u ? "s-radio-active" : ""}`}>
                  <input
                    type="radio"
                    value={u}
                    checked={form.dimensionUnit === u}
                    onChange={() => setForm((p) => ({ ...p, dimensionUnit: u }))}
                    style={{ display: "none" }}
                  />
                  {u}
                </label>
              ))}
            </div>
          </Field>
        </div>
      </SectionCard>
    </div>
  );
}

// ─── Tab: Store ───────────────────────────────────────────────────────────────
function StoreTab() {
  const [toggles, setToggles] = useState({
    guestCheckout: true,
    reviews: true,
    wishlist: true,
    stockDisplay: true,
    lowStockBadge: true,
    soldOut: false,
    maintenanceMode: false,
    passwordProtect: false,
  });
  const [currency, setCurrency] = useState("GBP");
  const [lowStockThreshold, setLowStockThreshold] = useState("5");

  const toggle = (k: keyof typeof toggles) =>
    setToggles((p) => ({ ...p, [k]: !p[k] }));

  return (
    <div className="s-tab-content">
      <SectionCard title="Currency & Pricing">
        <div className="s-form-row">
          <Field label="Default Currency">
            <div className="s-select-wrap">
              <select className="s-input s-select" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                {[
                  { code: "GBP", label: "British Pound (£)" },
                  { code: "EUR", label: "Euro (€)" },
                  { code: "USD", label: "US Dollar ($)" },
                  { code: "JPY", label: "Japanese Yen (¥)" },
                  { code: "AUD", label: "Australian Dollar (A$)" },
                ].map((c) => (
                  <option key={c.code} value={c.code}>{c.label}</option>
                ))}
              </select>
              <ChevronIcon />
            </div>
          </Field>
          <Field label="Low Stock Threshold" hint="Show 'Low Stock' badge below this quantity.">
            <input
              type="number"
              className="s-input"
              value={lowStockThreshold}
              min={1}
              onChange={(e) => setLowStockThreshold(e.target.value)}
            />
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="Customer Features" subtitle="Control which features are available to shoppers.">
        <div className="s-toggles-stack">
          <Toggle checked={toggles.guestCheckout} onChange={() => toggle("guestCheckout")}
            label="Guest Checkout" desc="Allow purchases without creating an account." />
          <Toggle checked={toggles.reviews} onChange={() => toggle("reviews")}
            label="Product Reviews" desc="Display verified customer reviews on product pages." />
          <Toggle checked={toggles.wishlist} onChange={() => toggle("wishlist")}
            label="Wishlist" desc="Let customers save items to a personal wishlist." />
          <Toggle checked={toggles.stockDisplay} onChange={() => toggle("stockDisplay")}
            label="Show Stock Counts" desc="Display exact stock numbers on product pages." />
          <Toggle checked={toggles.lowStockBadge} onChange={() => toggle("lowStockBadge")}
            label="Low Stock Badge" desc="Show a 'Only X left' badge when stock is low." />
          <Toggle checked={toggles.soldOut} onChange={() => toggle("soldOut")}
            label="Show Sold Out Products" desc="Keep sold-out products visible but mark them unavailable." />
        </div>
      </SectionCard>

      <SectionCard title="Storefront Access" subtitle="Control who can access the store.">
        <div className="s-toggles-stack">
          <Toggle checked={toggles.maintenanceMode} onChange={() => toggle("maintenanceMode")}
            label="Maintenance Mode" desc="Take the store offline. Only admins can access it." />
          <Toggle checked={toggles.passwordProtect} onChange={() => toggle("passwordProtect")}
            label="Password Protection" desc="Require a password to view the storefront." />
        </div>
        {toggles.passwordProtect && (
          <div style={{ marginTop: 14 }}>
            <Field label="Storefront Password">
              <input type="password" className="s-input" placeholder="Enter password…" />
            </Field>
          </div>
        )}
      </SectionCard>
    </div>
  );
}

// ─── Tab: Shipping ────────────────────────────────────────────────────────────
function ShippingTab() {
  const [zones] = useState([
    { name: "United Kingdom", methods: ["Standard (3-5 days) — Free over £150", "Express (1-2 days) — £8.95", "Next Day — £12.95"] },
    { name: "European Union", methods: ["Standard (5-7 days) — £12.00", "Express (2-3 days) — £22.00"] },
    { name: "Rest of World", methods: ["Standard (7-14 days) — £18.00"] },
  ]);
  const [freeThreshold, setFreeThreshold] = useState("150");
  const [returnDays, setReturnDays] = useState("30");

  return (
    <div className="s-tab-content">
      <SectionCard title="Free Shipping" subtitle="Automatically apply free shipping when order meets the threshold.">
        <div className="s-form-row">
          <Field label="Free Shipping Threshold (£)" hint="Set to 0 to disable.">
            <div className="s-input-prefix-wrap">
              <span className="s-input-prefix">£</span>
              <input
                type="number"
                className="s-input s-input-prefixed"
                value={freeThreshold}
                onChange={(e) => setFreeThreshold(e.target.value)}
                min={0}
              />
            </div>
          </Field>
          <Field label="Return Window (days)">
            <input
              type="number"
              className="s-input"
              value={returnDays}
              onChange={(e) => setReturnDays(e.target.value)}
              min={0}
            />
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="Shipping Zones" subtitle="Manage delivery methods and rates by destination.">
        <div className="s-zones-list">
          {zones.map((zone) => (
            <div key={zone.name} className="s-zone-card">
              <div className="s-zone-header">
                <div className="s-zone-dot" />
                <span className="s-zone-name">{zone.name}</span>
                <button className="s-zone-edit-btn">Edit</button>
              </div>
              <div className="s-zone-methods">
                {zone.methods.map((method) => (
                  <div key={method} className="s-zone-method">
                    <span className="s-zone-method-dot" />
                    <span>{method}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <button className="s-add-zone-btn">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add Shipping Zone
          </button>
        </div>
      </SectionCard>
    </div>
  );
}

// ─── Tab: Payments ────────────────────────────────────────────────────────────
function PaymentsTab() {
  const [stripeEnabled, setStripeEnabled] = useState(true);
  const [paypalEnabled, setPaypalEnabled] = useState(true);
  const [applePayEnabled, setApplePayEnabled] = useState(true);
  const [testMode, setTestMode] = useState(false);
  const [stripeKey, setStripeKey] = useState("sk_live_••••••••••••••••••••••••");

  return (
    <div className="s-tab-content">
      <SectionCard title="Payment Providers" subtitle="Configure which payment methods are available at checkout.">
        <div className="s-payment-providers">
          {[
            {
              id: "stripe",
              name: "Stripe",
              desc: "Card payments (Visa, Mastercard, Amex), Apple Pay, Google Pay",
              enabled: stripeEnabled,
              onToggle: () => setStripeEnabled((p) => !p),
              badge: "Connected",
              badgeColor: "#4ade80",
            },
            {
              id: "paypal",
              name: "PayPal",
              desc: "PayPal and PayPal Credit",
              enabled: paypalEnabled,
              onToggle: () => setPaypalEnabled((p) => !p),
              badge: "Connected",
              badgeColor: "#4ade80",
            },
            {
              id: "apple",
              name: "Apple Pay",
              desc: "One-touch payment for iOS and macOS Safari users",
              enabled: applePayEnabled,
              onToggle: () => setApplePayEnabled((p) => !p),
              badge: "Via Stripe",
              badgeColor: "#94a3b8",
            },
          ].map((p) => (
            <div key={p.id} className="s-provider-row">
              <div className="s-provider-info">
                <div className="s-provider-name-row">
                  <span className="s-provider-name">{p.name}</span>
                  <span className="s-provider-badge" style={{ color: p.badgeColor, background: `${p.badgeColor}18` }}>
                    {p.badge}
                  </span>
                </div>
                <span className="s-provider-desc">{p.desc}</span>
              </div>
              <input type="checkbox" className="s-toggle-input" checked={p.enabled} onChange={p.onToggle} />
              <span className="s-toggle-track" />
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Stripe Configuration">
        <div className="s-warning-banner">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          API keys are encrypted at rest. Never share your secret key.
        </div>
        <Field label="Secret Key" hint="Your Stripe secret key — starting with sk_live_ or sk_test_.">
          <div className="s-key-row">
            <input
              type="password"
              className="s-input s-input-mono"
              value={stripeKey}
              onChange={(e) => setStripeKey(e.target.value)}
            />
            <button className="s-key-reveal-btn" title="Reveal key">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
          </div>
        </Field>
        <div className="s-form-row">
          <Field label="Mode">
            <div className="s-radio-group">
              {["Live", "Test"].map((m) => (
                <label
                  key={m}
                  className={`s-radio-btn ${(m === "Test") === testMode ? "s-radio-active" : ""}`}
                  style={(m === "Test") === testMode && m === "Test" ? { color: "#f59e0b", borderColor: "rgba(245,158,11,0.4)", background: "rgba(245,158,11,0.08)" } : {}}
                >
                  <input
                    type="radio"
                    value={m}
                    checked={(m === "Test") === testMode}
                    onChange={() => setTestMode(m === "Test")}
                    style={{ display: "none" }}
                  />
                  {m}
                </label>
              ))}
            </div>
          </Field>
        </div>
      </SectionCard>
    </div>
  );
}

// ─── Tab: Notifications ───────────────────────────────────────────────────────
function NotificationsTab() {
  const [email, setEmail] = useState({
    newOrder: true,
    orderShipped: true,
    orderDelivered: false,
    returnRequest: true,
    lowStock: true,
    newCustomer: false,
    abandonedCart: true,
    reviewPosted: false,
  });

  const [sms, setSms] = useState({
    newOrder: false,
    lowStock: false,
  });

  const [notifEmail, setNotifEmail] = useState("admin@maisonelara.com");

  const toggleEmail = (k: keyof typeof email) =>
    setEmail((p) => ({ ...p, [k]: !p[k] }));

  const notifications = [
    { key: "newOrder" as const, label: "New Order", desc: "When a customer places an order." },
    { key: "orderShipped" as const, label: "Order Shipped", desc: "When an order is marked as shipped." },
    { key: "orderDelivered" as const, label: "Order Delivered", desc: "When delivery is confirmed." },
    { key: "returnRequest" as const, label: "Return Request", desc: "When a customer requests a return." },
    { key: "lowStock" as const, label: "Low Stock Alert", desc: "When a variant falls below threshold." },
    { key: "newCustomer" as const, label: "New Customer", desc: "When a new account is created." },
    { key: "abandonedCart" as const, label: "Abandoned Cart", desc: "When a cart is abandoned for 24h." },
    { key: "reviewPosted" as const, label: "Review Posted", desc: "When a customer submits a review." },
  ];

  return (
    <div className="s-tab-content">
      <SectionCard title="Notification Email" subtitle="Admin alerts will be sent to this address.">
        <Field label="Email Address">
          <input
            className="s-input"
            type="email"
            value={notifEmail}
            onChange={(e) => setNotifEmail(e.target.value)}
          />
        </Field>
      </SectionCard>

      <SectionCard title="Email Notifications" subtitle="Choose which events trigger an email to admins.">
        <div className="s-toggles-stack">
          {notifications.map((n) => (
            <Toggle
              key={n.key}
              checked={email[n.key]}
              onChange={() => toggleEmail(n.key)}
              label={n.label}
              desc={n.desc}
            />
          ))}
        </div>
      </SectionCard>

      <SectionCard title="SMS Notifications" subtitle="Requires a Twilio integration.">
        <div className="s-provider-badge-row">
          <span className="s-sms-badge">Twilio not connected</span>
          <button className="s-link-btn">Connect Twilio →</button>
        </div>
        <div className="s-toggles-stack s-toggles-disabled">
          <Toggle checked={sms.newOrder} onChange={() => setSms((p) => ({ ...p, newOrder: !p.newOrder }))}
            label="New Order SMS" desc="Instant SMS alert for new orders." />
          <Toggle checked={sms.lowStock} onChange={() => setSms((p) => ({ ...p, lowStock: !p.lowStock }))}
            label="Low Stock SMS" desc="SMS when stock drops below threshold." />
        </div>
      </SectionCard>
    </div>
  );
}

// ─── Tab: Team ────────────────────────────────────────────────────────────────
function TeamTab() {
  const [members, setMembers] = useState(TEAM_MEMBERS);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<TeamRole>("Editor");

  const handleInvite = () => {
    if (!inviteEmail) return;
    setMembers((p) => [
      ...p,
      {
        id: `tm_${Date.now()}`,
        name: inviteEmail,
        email: inviteEmail,
        role: inviteRole,
        avatar: inviteEmail.slice(0, 2).toUpperCase(),
        status: "invited",
        lastSeen: "—",
      },
    ]);
    setInviteEmail("");
    setShowInvite(false);
  };

  return (
    <div className="s-tab-content">
      <SectionCard
        title="Team Members"
        subtitle="Control who has access to the Maison Elara admin panel."
      >
        <div className="s-team-list">
          {members.map((m) => {
            const role = ROLE_CONFIG[m.role];
            return (
              <div key={m.id} className="s-team-row">
                <div className="s-team-avatar">{m.avatar}</div>
                <div className="s-team-info">
                  <div className="s-team-name-row">
                    <span className="s-team-name">{m.name}</span>
                    {m.status === "invited" && (
                      <span className="s-invited-badge">Invited</span>
                    )}
                  </div>
                  <span className="s-team-email">{m.email}</span>
                </div>
                <div className="s-team-meta">
                  <span className="s-team-role" style={{ color: role.color, background: role.bg }}>
                    {m.role}
                  </span>
                  <span className="s-team-seen">{m.lastSeen}</span>
                </div>
                {m.role !== "Super Admin" && (
                  <div className="s-team-actions">
                    <div className="s-select-wrap">
                      <select
                        className="s-input s-select s-select-sm"
                        value={m.role}
                        onChange={(e) =>
                          setMembers((p) =>
                            p.map((x) =>
                              x.id === m.id ? { ...x, role: e.target.value as TeamRole } : x
                            )
                          )
                        }
                      >
                        {(["Admin", "Editor", "Viewer"] as TeamRole[]).map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                      <ChevronIcon />
                    </div>
                    <button
                      className="s-remove-btn"
                      onClick={() => setMembers((p) => p.filter((x) => x.id !== m.id))}
                      title="Remove member"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {showInvite ? (
          <div className="s-invite-form">
            <div className="s-form-row">
              <Field label="Email Address" required>
                <input
                  className="s-input"
                  type="email"
                  placeholder="colleague@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </Field>
              <Field label="Role">
                <div className="s-select-wrap">
                  <select
                    className="s-input s-select"
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as TeamRole)}
                  >
                    {(["Admin", "Editor", "Viewer"] as TeamRole[]).map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                  <ChevronIcon />
                </div>
              </Field>
            </div>
            <div className="s-invite-actions">
              <button className="s-btn-ghost" onClick={() => setShowInvite(false)}>Cancel</button>
              <button className="s-btn-primary" onClick={handleInvite}>Send Invite</button>
            </div>
          </div>
        ) : (
          <button className="s-invite-trigger" onClick={() => setShowInvite(true)}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Invite Team Member
          </button>
        )}
      </SectionCard>

      <SectionCard title="Role Permissions" subtitle="What each role can do in the admin panel.">
        <div className="s-permissions-table">
          <div className="s-perm-head">
            <div />
            {(["Admin", "Editor", "Viewer"] as TeamRole[]).map((r) => (
              <div key={r} className="s-perm-role" style={{ color: ROLE_CONFIG[r].color }}>
                {r}
              </div>
            ))}
          </div>
          {[
            { action: "View Dashboard & Orders",     admin: true, editor: true,  viewer: true  },
            { action: "Manage Products & Collections", admin: true, editor: true,  viewer: false },
            { action: "Manage Customers",             admin: true, editor: false, viewer: false },
            { action: "Manage Discounts",             admin: true, editor: true,  viewer: false },
            { action: "Access Media Library",         admin: true, editor: true,  viewer: true  },
            { action: "Edit Settings",                admin: true, editor: false, viewer: false },
            { action: "Manage Team",                  admin: true, editor: false, viewer: false },
          ].map((row) => (
            <div key={row.action} className="s-perm-row">
              <div className="s-perm-action">{row.action}</div>
              {[row.admin, row.editor, row.viewer].map((v, i) => (
                <div key={i} className="s-perm-cell">
                  {v ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2.5">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

// ─── Tab: Security ────────────────────────────────────────────────────────────
function SecurityTab() {
  const [twoFactor, setTwoFactor] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState("480");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [ipWhitelist, setIpWhitelist] = useState("");

  const sessions = [
    { device: "Chrome on macOS", location: "London, UK", lastActive: "Now", current: true },
    { device: "Safari on iPhone", location: "London, UK", lastActive: "2 hours ago", current: false },
    { device: "Firefox on Windows", location: "Paris, FR", lastActive: "3 days ago", current: false },
  ];

  return (
    <div className="s-tab-content">
      <SectionCard title="Change Password">
        <div className="s-form-col">
          <Field label="Current Password">
            <input
              type="password"
              className="s-input"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
            />
          </Field>
          <div className="s-form-row">
            <Field label="New Password">
              <input
                type="password"
                className="s-input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
              />
            </Field>
            <Field label="Confirm New Password">
              <input
                type="password"
                className="s-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
              />
            </Field>
          </div>
          {newPassword.length > 0 && (
            <div className="s-password-strength">
              <div className="s-strength-bars">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="s-strength-bar"
                    style={{
                      background:
                        newPassword.length >= i * 3
                          ? newPassword.length >= 12 ? "#4ade80"
                          : newPassword.length >= 8 ? "#f59e0b"
                          : "#ef4444"
                          : "rgba(255,255,255,0.08)",
                    }}
                  />
                ))}
              </div>
              <span className="s-strength-label">
                {newPassword.length < 6 ? "Weak" : newPassword.length < 10 ? "Fair" : newPassword.length < 14 ? "Good" : "Strong"}
              </span>
            </div>
          )}
          <div className="s-save-row">
            <button className="s-btn-primary" disabled={!currentPassword || !newPassword || newPassword !== confirmPassword}>
              Update Password
            </button>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Two-Factor Authentication" subtitle="Add an extra layer of security to your account.">
        <div className="s-2fa-row">
          <div>
            <p className="s-2fa-status" style={{ color: twoFactor ? "#4ade80" : "rgba(255,255,255,0.4)" }}>
              {twoFactor ? "✓ Enabled" : "Not enabled"}
            </p>
            <p className="s-2fa-desc">
              {twoFactor
                ? "Your account is protected with an authenticator app."
                : "Protect your account by requiring a code in addition to your password."}
            </p>
          </div>
          <button
            className={twoFactor ? "s-btn-ghost" : "s-btn-primary"}
            onClick={() => setTwoFactor((p) => !p)}
          >
            {twoFactor ? "Disable 2FA" : "Enable 2FA"}
          </button>
        </div>
      </SectionCard>

      <SectionCard title="Session & Access">
        <Field label="Session Timeout (minutes)" hint="Automatically log out after this period of inactivity.">
          <div className="s-select-wrap">
            <select
              className="s-input s-select"
              value={sessionTimeout}
              onChange={(e) => setSessionTimeout(e.target.value)}
            >
              <option value="60">60 minutes</option>
              <option value="240">4 hours</option>
              <option value="480">8 hours</option>
              <option value="1440">24 hours</option>
              <option value="0">Never</option>
            </select>
            <ChevronIcon />
          </div>
        </Field>
        <Field label="IP Whitelist" hint="Restrict admin access to specific IP addresses. One per line. Leave blank to allow all.">
          <textarea
            className="s-input s-textarea s-input-mono"
            rows={4}
            placeholder={"192.168.1.1\n10.0.0.0/24"}
            value={ipWhitelist}
            onChange={(e) => setIpWhitelist(e.target.value)}
          />
        </Field>
      </SectionCard>

      <SectionCard title="Active Sessions">
        <div className="s-sessions-list">
          {sessions.map((s, i) => (
            <div key={i} className="s-session-row">
              <div className="s-session-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <path d="M8 21h8M12 17v4" />
                </svg>
              </div>
              <div className="s-session-info">
                <span className="s-session-device">
                  {s.device}
                  {s.current && <span className="s-current-badge">Current</span>}
                </span>
                <span className="s-session-meta">{s.location} · {s.lastActive}</span>
              </div>
              {!s.current && (
                <button className="s-revoke-btn">Revoke</button>
              )}
            </div>
          ))}
        </div>
        <button className="s-danger-text-btn">Revoke All Other Sessions</button>
      </SectionCard>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function ChevronIcon() {
  return (
    <svg
      className="s-select-chevron"
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 900));
    setSaving(false);
    setSaved(true);
    showToast("Settings saved");
    setTimeout(() => setSaved(false), 2500);
  };

  const tabs: { key: SettingsTab; label: string; icon: React.ReactNode }[] = [
    {
      key: "general",
      label: "General",
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
        </svg>
      ),
    },
    {
      key: "store",
      label: "Store",
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      key: "shipping",
      label: "Shipping",
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="1" y="3" width="15" height="13" />
          <path d="M16 8h4l3 3v5h-7V8z" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
      ),
    },
    {
      key: "payments",
      label: "Payments",
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="1" y="4" width="22" height="16" rx="2" />
          <line x1="1" y1="10" x2="23" y2="10" />
        </svg>
      ),
    },
    {
      key: "notifications",
      label: "Notifications",
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      ),
    },
    {
      key: "team",
      label: "Team",
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      key: "security",
      label: "Security",
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
    },
  ];

  const tabContent: Record<SettingsTab, React.ReactNode> = {
    general: <GeneralTab />,
    store: <StoreTab />,
    shipping: <ShippingTab />,
    payments: <PaymentsTab />,
    notifications: <NotificationsTab />,
    team: <TeamTab />,
    security: <SecurityTab />,
  };

  return (
    <div className="adm-page">
      {/* ── Header ── */}
      <div className="adm-page-header">
        <div>
          <div className="adm-breadcrumb">
            <Link href="/admin">Dashboard</Link>
            <span className="adm-bc-sep">›</span>
            <span>Settings</span>
          </div>
          <h1 className="adm-page-title">Settings</h1>
          <p className="adm-page-sub">Manage your store configuration, team, and integrations.</p>
        </div>
        <button
          className={`s-btn-primary ${saved ? "s-btn-saved" : ""}`}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? (
            <span className="s-spinner" />
          ) : saved ? (
            <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              Saved
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>

      {/* ── Layout ── */}
      <div className="s-layout">
        {/* Sidebar Nav */}
        <nav className="s-sidebar-nav">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`s-nav-item ${activeTab === tab.key ? "s-nav-active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <span className="s-nav-icon">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="s-content">
          {tabContent[activeTab]}
        </div>
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
        /* ── Base ── */
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
          gap: 24px;
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
        .adm-breadcrumb a { color: rgba(255,255,255,0.45); text-decoration: none; transition: color 0.2s; }
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

        /* ── Layout ── */
        .s-layout {
          display: grid;
          grid-template-columns: 200px 1fr;
          gap: 24px;
          align-items: start;
        }

        /* ── Sidebar Nav ── */
        .s-sidebar-nav {
          background: #141414;
          border: 1px solid rgba(255,255,255,0.07);
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 80px;
          overflow: hidden;
        }
        .s-nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 11px 16px;
          font-size: 13px;
          color: rgba(255,255,255,0.45);
          background: none;
          border: none;
          border-left: 2px solid transparent;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.15s;
          text-align: left;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          white-space: nowrap;
        }
        .s-nav-item:last-child { border-bottom: none; }
        .s-nav-item:hover { color: rgba(255,255,255,0.8); background: rgba(255,255,255,0.03); }
        .s-nav-active {
          color: rgba(255,255,255,0.92) !important;
          background: rgba(201,169,110,0.08) !important;
          border-left-color: #c9a96e !important;
        }
        .s-nav-active .s-nav-icon { color: #c9a96e; }
        .s-nav-icon { display: flex; align-items: center; flex-shrink: 0; color: inherit; }

        /* ── Content ── */
        .s-content { min-width: 0; }
        .s-tab-content { display: flex; flex-direction: column; gap: 16px; }

        /* ── Cards ── */
        .s-card {
          background: #141414;
          border: 1px solid rgba(255,255,255,0.07);
          overflow: hidden;
        }
        .s-card-header {
          padding: 18px 22px 16px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.02);
        }
        .s-card-title {
          font-family: "Playfair Display", Georgia, serif;
          font-size: 16px;
          font-weight: 400;
          color: rgba(255,255,255,0.92);
          margin-bottom: 3px;
        }
        .s-card-sub { font-size: 12px; color: rgba(255,255,255,0.35); }
        .s-card-body {
          padding: 20px 22px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* ── Form ── */
        .s-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .s-form-col { display: flex; flex-direction: column; gap: 14px; }
        .s-field { display: flex; flex-direction: column; gap: 6px; }
        .s-label {
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.38);
        }
        .s-required { color: #c9a96e; }
        .s-hint { font-size: 11px; color: rgba(255,255,255,0.22); margin-top: 2px; }
        .s-input {
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
        .s-input:focus { border-color: rgba(255,255,255,0.3); }
        .s-input::placeholder { color: rgba(255,255,255,0.2); }
        .s-input-mono { font-family: "DM Mono", "Courier New", monospace; font-size: 12px; letter-spacing: 0.04em; }
        .s-textarea { resize: vertical; min-height: 80px; }
        .s-input-prefix-wrap { position: relative; display: flex; align-items: center; }
        .s-input-prefix {
          position: absolute;
          left: 10px;
          font-size: 13px;
          color: rgba(255,255,255,0.4);
          pointer-events: none;
        }
        .s-input-prefixed { padding-left: 24px; }
        .s-select-wrap { position: relative; }
        .s-select { appearance: none; cursor: pointer; padding-right: 28px; }
        .s-select-sm { padding: 6px 28px 6px 10px; font-size: 12px; }
        .s-select-chevron {
          position: absolute;
          right: 9px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: rgba(255,255,255,0.3);
        }

        /* ── Radio group ── */
        .s-radio-group { display: flex; gap: 6px; flex-wrap: wrap; }
        .s-radio-btn {
          padding: 6px 14px;
          font-size: 12px;
          letter-spacing: 0.04em;
          color: rgba(255,255,255,0.38);
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          cursor: pointer;
          transition: all 0.15s;
          font-family: inherit;
          user-select: none;
        }
        .s-radio-btn:hover { color: rgba(255,255,255,0.7); border-color: rgba(255,255,255,0.15); }
        .s-radio-active {
          color: rgba(255,255,255,0.92) !important;
          background: rgba(201,169,110,0.1) !important;
          border-color: rgba(201,169,110,0.35) !important;
        }

        /* ── Toggle ── */
        .s-toggle-row {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .s-toggle-row:last-child { border-bottom: none; }
        .s-toggle-text-group { flex: 1; min-width: 0; }
        .s-toggle-label { display: block; font-size: 13px; color: rgba(255,255,255,0.8); margin-bottom: 2px; }
        .s-toggle-desc { display: block; font-size: 11px; color: rgba(255,255,255,0.32); }
        .s-toggle-input { display: none; }
        .s-toggle-track {
          width: 38px;
          height: 20px;
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
          position: relative;
          transition: background 0.2s;
          flex-shrink: 0;
        }
        .s-toggle-track::after {
          content: "";
          position: absolute;
          width: 14px;
          height: 14px;
          background: rgba(255,255,255,0.4);
          border-radius: 50%;
          top: 3px;
          left: 3px;
          transition: transform 0.2s, background 0.2s;
        }
        .s-toggle-input:checked + .s-toggle-track { background: #c9a96e; }
        .s-toggle-input:checked + .s-toggle-track::after { transform: translateX(18px); background: white; }
        .s-toggles-stack { display: flex; flex-direction: column; }
        .s-toggles-disabled { opacity: 0.45; pointer-events: none; }

        /* ── Buttons ── */
        .s-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 10px 20px;
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
        .s-btn-primary:hover { background: #d4b87e; }
        .s-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
        .s-btn-saved { background: #4ade80 !important; }
        .s-btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 10px 18px;
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.65);
          border: 1px solid rgba(255,255,255,0.1);
          font-size: 12px;
          letter-spacing: 0.06em;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.18s;
        }
        .s-btn-ghost:hover { background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.9); }
        .s-save-row { display: flex; }
        .s-spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(17,17,17,0.3);
          border-top-color: #111;
          border-radius: 50%;
          animation: s-spin 0.6s linear infinite;
        }
        @keyframes s-spin { to { transform: rotate(360deg); } }

        /* ── Shipping zones ── */
        .s-zones-list { display: flex; flex-direction: column; gap: 10px; }
        .s-zone-card {
          border: 1px solid rgba(255,255,255,0.08);
          overflow: hidden;
        }
        .s-zone-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          background: rgba(255,255,255,0.03);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .s-zone-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #c9a96e;
          flex-shrink: 0;
        }
        .s-zone-name { flex: 1; font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.85); }
        .s-zone-edit-btn {
          font-size: 11px;
          color: rgba(255,255,255,0.38);
          background: none;
          border: 1px solid rgba(255,255,255,0.1);
          padding: 3px 10px;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.15s;
        }
        .s-zone-edit-btn:hover { color: rgba(255,255,255,0.8); border-color: rgba(255,255,255,0.2); }
        .s-zone-methods { padding: 10px 16px; display: flex; flex-direction: column; gap: 6px; }
        .s-zone-method { display: flex; align-items: center; gap: 9px; font-size: 12px; color: rgba(255,255,255,0.45); }
        .s-zone-method-dot { width: 4px; height: 4px; border-radius: 50%; background: rgba(255,255,255,0.2); flex-shrink: 0; }
        .s-add-zone-btn {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 11px 16px;
          font-size: 12px;
          color: rgba(255,255,255,0.38);
          background: none;
          border: 1px dashed rgba(255,255,255,0.1);
          cursor: pointer;
          font-family: inherit;
          transition: all 0.15s;
        }
        .s-add-zone-btn:hover { color: #c9a96e; border-color: rgba(201,169,110,0.3); }

        /* ── Payment providers ── */
        .s-payment-providers { display: flex; flex-direction: column; }
        .s-provider-row {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .s-provider-row:last-child { border-bottom: none; }
        .s-provider-info { flex: 1; min-width: 0; }
        .s-provider-name-row { display: flex; align-items: center; gap: 10px; margin-bottom: 3px; }
        .s-provider-name { font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.85); }
        .s-provider-badge {
          font-size: 10px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 2px 7px;
        }
        .s-provider-desc { font-size: 11px; color: rgba(255,255,255,0.32); }
        .s-warning-banner {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 10px 14px;
          background: rgba(245,158,11,0.08);
          border: 1px solid rgba(245,158,11,0.2);
          color: #f59e0b;
          font-size: 12px;
        }
        .s-key-row { display: flex; gap: 8px; }
        .s-key-reveal-btn {
          width: 38px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.38);
          cursor: pointer;
          transition: all 0.15s;
        }
        .s-key-reveal-btn:hover { color: rgba(255,255,255,0.7); border-color: rgba(255,255,255,0.2); }

        /* ── Notifications ── */
        .s-provider-badge-row { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
        .s-sms-badge {
          font-size: 11px;
          color: rgba(255,255,255,0.35);
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          padding: 4px 10px;
        }
        .s-link-btn {
          font-size: 12px;
          color: #c9a96e;
          background: none;
          border: none;
          cursor: pointer;
          font-family: inherit;
          transition: opacity 0.15s;
        }
        .s-link-btn:hover { opacity: 0.7; }

        /* ── Team ── */
        .s-team-list { display: flex; flex-direction: column; gap: 0; margin-bottom: 16px; }
        .s-team-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .s-team-row:last-child { border-bottom: none; }
        .s-team-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: rgba(201,169,110,0.15);
          border: 1px solid rgba(201,169,110,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 500;
          color: #c9a96e;
          letter-spacing: 0.04em;
          flex-shrink: 0;
        }
        .s-team-info { flex: 1; min-width: 0; }
        .s-team-name-row { display: flex; align-items: center; gap: 8px; margin-bottom: 2px; }
        .s-team-name { font-size: 13px; color: rgba(255,255,255,0.8); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .s-invited-badge {
          font-size: 9px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #f59e0b;
          background: rgba(245,158,11,0.1);
          border: 1px solid rgba(245,158,11,0.2);
          padding: 1px 6px;
          flex-shrink: 0;
        }
        .s-team-email { font-size: 11px; color: rgba(255,255,255,0.28); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; }
        .s-team-meta { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; flex-shrink: 0; }
        .s-team-role {
          font-size: 10px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 2px 8px;
          white-space: nowrap;
        }
        .s-team-seen { font-size: 11px; color: rgba(255,255,255,0.22); white-space: nowrap; }
        .s-team-actions { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
        .s-remove-btn {
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          color: rgba(255,255,255,0.22);
          cursor: pointer;
          transition: color 0.15s;
        }
        .s-remove-btn:hover { color: #f87171; }
        .s-invite-trigger {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 10px 0;
          font-size: 12px;
          color: rgba(255,255,255,0.38);
          background: none;
          border: none;
          cursor: pointer;
          font-family: inherit;
          transition: color 0.15s;
          letter-spacing: 0.04em;
        }
        .s-invite-trigger:hover { color: #c9a96e; }
        .s-invite-form {
          border-top: 1px solid rgba(255,255,255,0.07);
          padding-top: 16px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .s-invite-actions { display: flex; gap: 8px; justify-content: flex-end; }

        /* ── Permissions table ── */
        .s-permissions-table { display: flex; flex-direction: column; }
        .s-perm-head {
          display: grid;
          grid-template-columns: 1fr repeat(3, 80px);
          padding: 10px 0;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .s-perm-role {
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          text-align: center;
        }
        .s-perm-row {
          display: grid;
          grid-template-columns: 1fr repeat(3, 80px);
          padding: 11px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          align-items: center;
        }
        .s-perm-row:last-child { border-bottom: none; }
        .s-perm-action { font-size: 12px; color: rgba(255,255,255,0.55); }
        .s-perm-cell { display: flex; align-items: center; justify-content: center; }

        /* ── Security ── */
        .s-password-strength { display: flex; align-items: center; gap: 10px; }
        .s-strength-bars { display: flex; gap: 4px; }
        .s-strength-bar { width: 32px; height: 3px; transition: background 0.3s; }
        .s-strength-label { font-size: 11px; color: rgba(255,255,255,0.38); }
        .s-2fa-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
        .s-2fa-status { font-size: 13px; font-weight: 500; margin-bottom: 4px; }
        .s-2fa-desc { font-size: 12px; color: rgba(255,255,255,0.35); line-height: 1.5; }
        .s-sessions-list { display: flex; flex-direction: column; gap: 0; margin-bottom: 14px; }
        .s-session-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .s-session-row:last-child { border-bottom: none; }
        .s-session-icon {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.38);
          flex-shrink: 0;
        }
        .s-session-info { flex: 1; min-width: 0; }
        .s-session-device { display: flex; align-items: center; gap: 8px; font-size: 13px; color: rgba(255,255,255,0.75); margin-bottom: 2px; }
        .s-current-badge {
          font-size: 9px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #4ade80;
          background: rgba(74,222,128,0.1);
          padding: 1px 6px;
        }
        .s-session-meta { font-size: 11px; color: rgba(255,255,255,0.28); }
        .s-revoke-btn {
          font-size: 11px;
          color: rgba(255,255,255,0.35);
          background: none;
          border: 1px solid rgba(255,255,255,0.1);
          padding: 4px 10px;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.15s;
          flex-shrink: 0;
        }
        .s-revoke-btn:hover { color: #f87171; border-color: rgba(248,113,113,0.3); }
        .s-danger-text-btn {
          font-size: 12px;
          color: #f87171;
          background: none;
          border: none;
          cursor: pointer;
          font-family: inherit;
          transition: opacity 0.15s;
          padding: 0;
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .s-danger-text-btn:hover { opacity: 0.7; }

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
        .adm-toast svg { color: #4ade80; flex-shrink: 0; }
        @keyframes adm-toast-in {
          from { opacity: 0; transform: translateX(-50%) translateY(10px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }

        /* ── Responsive ── */
        @media (max-width: 1100px) {
          .s-layout { grid-template-columns: 180px 1fr; }
        }
        @media (max-width: 900px) {
          .s-layout { grid-template-columns: 1fr; }
          .s-sidebar-nav { flex-direction: row; flex-wrap: wrap; position: static; overflow-x: auto; }
          .s-nav-item { border-left: none; border-bottom: 2px solid transparent; padding: 10px 14px; }
          .s-nav-active { border-bottom-color: #c9a96e !important; border-left-color: transparent !important; }
          .adm-page { padding: 20px; }
        }
        @media (max-width: 640px) {
          .s-form-row { grid-template-columns: 1fr; }
          .s-perm-head, .s-perm-row { grid-template-columns: 1fr repeat(3, 60px); }
        }
      `}</style>
    </div>
  );
}