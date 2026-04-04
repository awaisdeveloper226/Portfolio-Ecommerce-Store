"use client";
import { useState } from "react";
import Link from "next/link";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const user = {
  name: "Sophie Beaumont",
  email: "sophie@example.com",
  memberSince: "March 2023",
  tier: "Gold Member",
  points: 1240,
  nextTierPoints: 2000,
  avatar: "SB",
};

const recentOrders = [
  {
    id: "ME-004821",
    date: "28 Mar 2025",
    items: ["Silk Slip Dress", "Linen Wide Trousers"],
    total: 480,
    status: "Delivered",
    statusColor: "#2a7a4a",
  },
  {
    id: "ME-004756",
    date: "12 Mar 2025",
    items: ["Cashmere Turtleneck"],
    total: 320,
    status: "Delivered",
    statusColor: "#2a7a4a",
  },
  {
    id: "ME-004690",
    date: "2 Mar 2025",
    items: ["Wrap Blazer", "Merino Cardigan"],
    total: 685,
    status: "Returned",
    statusColor: "#8a8478",
  },
  {
    id: "ME-004601",
    date: "14 Feb 2025",
    items: ["Pleated Midi Dress"],
    total: 310,
    status: "Delivered",
    statusColor: "#2a7a4a",
  },
];

const savedAddresses = [
  {
    id: 1,
    label: "Home",
    name: "Sophie Beaumont",
    line1: "12 Elara Lane",
    line2: "Kensington",
    city: "London",
    postCode: "SW1A 1AA",
    country: "United Kingdom",
    isDefault: true,
  },
  {
    id: 2,
    label: "Office",
    name: "Sophie Beaumont",
    line1: "45 Maison Street",
    line2: "Floor 3",
    city: "London",
    postCode: "EC2A 4NE",
    country: "United Kingdom",
    isDefault: false,
  },
];

const wishlistPreview = [
  { id: 1, name: "Ribbed Maxi Dress", price: 255, color: "#ddc5d0" },
  { id: 2, name: "Silk Scarf", price: 85, color: "#e8d5b0" },
  { id: 3, name: "Linen Co-ord Set", price: 320, color: "#e0dac8" },
];

// ─── Sidebar Nav ──────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  {
    key: "overview",
    label: "Overview",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    key: "orders",
    label: "My Orders",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
  },
  {
    key: "wishlist",
    label: "Wishlist",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  {
    key: "addresses",
    label: "Addresses",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    key: "profile",
    label: "Profile & Security",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    key: "returns",
    label: "Returns",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-4.5" />
      </svg>
    ),
  },
];

// ─── Overview Panel ───────────────────────────────────────────────────────────
function OverviewPanel({ setActiveTab }: { setActiveTab: (t: string) => void }) {
  const progressPct = Math.round((user.points / user.nextTierPoints) * 100);

  return (
    <div className="panel">
      {/* Welcome */}
      <div className="panel-welcome">
        <div className="welcome-avatar">{user.avatar}</div>
        <div className="welcome-text">
          <h2 className="welcome-name">Welcome back, {user.name.split(" ")[0]}.</h2>
          <p className="welcome-sub">Member since {user.memberSince}</p>
        </div>
        <div className="welcome-tier">
          <span className="tier-badge">✦ {user.tier}</span>
        </div>
      </div>

      {/* Loyalty progress */}
      <div className="loyalty-card">
        <div className="loyalty-header">
          <div>
            <p className="loyalty-label">Loyalty Points</p>
            <p className="loyalty-pts">{user.points.toLocaleString()} pts</p>
          </div>
          <div className="loyalty-next">
            <p className="loyalty-next-label">Next tier at</p>
            <p className="loyalty-next-val">{user.nextTierPoints.toLocaleString()} pts</p>
          </div>
        </div>
        <div className="loyalty-bar-wrap">
          <div className="loyalty-bar">
            <div className="loyalty-fill" style={{ width: `${progressPct}%` }} />
          </div>
          <span className="loyalty-pct">{progressPct}%</span>
        </div>
        <p className="loyalty-hint">
          Earn {user.nextTierPoints - user.points} more points to unlock <strong>Platinum</strong> status.
        </p>
      </div>

      {/* Stats row */}
      <div className="stats-row">
        {[
          { label: "Orders", value: recentOrders.length, action: () => setActiveTab("orders") },
          { label: "Saved Pieces", value: wishlistPreview.length + "+", action: () => setActiveTab("wishlist") },
          { label: "Addresses", value: savedAddresses.length, action: () => setActiveTab("addresses") },
          { label: "Returns", value: 1, action: () => setActiveTab("returns") },
        ].map((s) => (
          <button key={s.label} className="stat-card" onClick={s.action}>
            <span className="stat-card-val">{s.value}</span>
            <span className="stat-card-label">{s.label}</span>
          </button>
        ))}
      </div>

      {/* Recent orders */}
      <div className="section-block">
        <div className="section-block-header">
          <h3 className="section-block-title">Recent Orders</h3>
          <button className="section-block-link" onClick={() => setActiveTab("orders")}>
            View all →
          </button>
        </div>
        <div className="orders-table">
          {recentOrders.slice(0, 3).map((order) => (
            <div key={order.id} className="order-row">
              <div className="order-row-left">
                <span className="order-id">{order.id}</span>
                <span className="order-items">{order.items.join(", ")}</span>
              </div>
              <div className="order-row-right">
                <span className="order-date">{order.date}</span>
                <span className="order-total">${order.total}</span>
                <span className="order-status" style={{ color: order.statusColor }}>
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Wishlist preview */}
      <div className="section-block">
        <div className="section-block-header">
          <h3 className="section-block-title">Saved Pieces</h3>
          <button className="section-block-link" onClick={() => setActiveTab("wishlist")}>
            View wishlist →
          </button>
        </div>
        <div className="wl-preview-row">
          {wishlistPreview.map((item) => (
            <div key={item.id} className="wl-preview-card">
              <div className="wl-preview-img" style={{ background: item.color }} />
              <p className="wl-preview-name">{item.name}</p>
              <p className="wl-preview-price">${item.price}</p>
            </div>
          ))}
          <Link href="/wishlist" className="wl-preview-more">
            <span>+</span>
            <span>View All</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Orders Panel ─────────────────────────────────────────────────────────────
function OrdersPanel() {
  const [activeOrder, setActiveOrder] = useState<string | null>(null);

  return (
    <div className="panel">
      <div className="panel-header">
        <h2 className="panel-title">My Orders</h2>
        <p className="panel-sub">{recentOrders.length} orders placed</p>
      </div>

      <div className="orders-list">
        {recentOrders.map((order) => (
          <div key={order.id} className="order-card">
            <div
              className="order-card-top"
              onClick={() => setActiveOrder(activeOrder === order.id ? null : order.id)}
            >
              <div className="order-card-meta">
                <span className="order-id-lg">{order.id}</span>
                <span className="order-card-date">{order.date}</span>
              </div>
              <div className="order-card-right">
                <span className="order-status-badge" style={{ color: order.statusColor, borderColor: order.statusColor }}>
                  {order.status}
                </span>
                <span className="order-card-total">${order.total}</span>
                <svg
                  width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2"
                  className={`order-chevron ${activeOrder === order.id ? "open" : ""}`}
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            </div>

            {activeOrder === order.id && (
              <div className="order-card-detail">
                <div className="order-detail-items">
                  {order.items.map((item, i) => (
                    <div key={i} className="order-detail-item">
                      <div className="order-item-img" style={{ background: "#e8d5c0" }} />
                      <div>
                        <p className="order-item-name">{item}</p>
                        <p className="order-item-meta">Qty: 1 · Size M</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="order-detail-actions">
                  {order.status === "Delivered" && (
                    <>
                      <Link href={`/account/orders/${order.id}`} className="order-action-btn">
                        View Details
                      </Link>
                      <Link href="/account/returns" className="order-action-btn">
                        Request Return
                      </Link>
                    </>
                  )}
                  {order.status === "Returned" && (
                    <Link href={`/account/orders/${order.id}`} className="order-action-btn">
                      View Details
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Addresses Panel ──────────────────────────────────────────────────────────
function AddressesPanel() {
  const [addresses, setAddresses] = useState(savedAddresses);
  const [adding, setAdding] = useState(false);

  const setDefault = (id: number) =>
    setAddresses((p) => p.map((a) => ({ ...a, isDefault: a.id === id })));

  const remove = (id: number) =>
    setAddresses((p) => p.filter((a) => a.id !== id));

  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <h2 className="panel-title">Saved Addresses</h2>
          <p className="panel-sub">Manage your delivery addresses</p>
        </div>
        <button className="btn-primary" onClick={() => setAdding(true)}>+ Add Address</button>
      </div>

      <div className="addresses-grid">
        {addresses.map((addr) => (
          <div key={addr.id} className={`addr-card ${addr.isDefault ? "addr-default" : ""}`}>
            <div className="addr-card-top">
              <span className="addr-label">{addr.label}</span>
              {addr.isDefault && <span className="addr-default-badge">Default</span>}
            </div>
            <p className="addr-name">{addr.name}</p>
            <p className="addr-line">{addr.line1}</p>
            {addr.line2 && <p className="addr-line">{addr.line2}</p>}
            <p className="addr-line">{addr.city}, {addr.postCode}</p>
            <p className="addr-line">{addr.country}</p>
            <div className="addr-actions">
              <button className="addr-action-btn">Edit</button>
              {!addr.isDefault && (
                <>
                  <button className="addr-action-btn" onClick={() => setDefault(addr.id)}>
                    Set Default
                  </button>
                  <button className="addr-action-btn addr-remove" onClick={() => remove(addr.id)}>
                    Remove
                  </button>
                </>
              )}
            </div>
          </div>
        ))}

        {adding && (
          <div className="addr-card addr-add-form">
            <p className="addr-add-title">New Address</p>
            <div className="addr-field-row">
              <input className="addr-input" placeholder="First name" />
              <input className="addr-input" placeholder="Last name" />
            </div>
            <input className="addr-input" placeholder="Address line 1" />
            <input className="addr-input" placeholder="City" />
            <input className="addr-input" placeholder="Postal code" />
            <div className="addr-form-actions">
              <button className="addr-action-btn" onClick={() => setAdding(false)}>Cancel</button>
              <button className="btn-primary" style={{ padding: "10px 20px", fontSize: "11px" }} onClick={() => setAdding(false)}>
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Profile Panel ────────────────────────────────────────────────────────────
function ProfilePanel() {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ firstName: "Sophie", lastName: "Beaumont", email: user.email, phone: "+44 7700 900123" });
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [saved, setSaved] = useState(false);

  const save = () => { setSaved(true); setEditing(false); setTimeout(() => setSaved(false), 2500); };
  const setF = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  return (
    <div className="panel">
      <div className="panel-header">
        <h2 className="panel-title">Profile & Security</h2>
        <p className="panel-sub">Manage your personal details and password</p>
      </div>

      {/* Personal info */}
      <div className="profile-section">
        <div className="profile-section-header">
          <h3 className="profile-section-title">Personal Information</h3>
          {!editing ? (
            <button className="section-block-link" onClick={() => setEditing(true)}>Edit</button>
          ) : (
            <div style={{ display: "flex", gap: 12 }}>
              <button className="section-block-link" onClick={() => setEditing(false)}>Cancel</button>
              <button className="btn-primary" style={{ padding: "8px 20px", fontSize: "11px" }} onClick={save}>Save</button>
            </div>
          )}
        </div>

        <div className="profile-fields">
          {(["firstName", "lastName", "email", "phone"] as const).map((k) => (
            <div key={k} className="profile-field">
              <label className="profile-field-label">
                {k === "firstName" ? "First Name" : k === "lastName" ? "Last Name" : k === "email" ? "Email" : "Phone"}
              </label>
              {editing ? (
                <input className="field-input" value={form[k]} onChange={setF(k)} />
              ) : (
                <p className="profile-field-val">{form[k]}</p>
              )}
            </div>
          ))}
        </div>

        {saved && (
          <p className="profile-saved">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            Changes saved
          </p>
        )}
      </div>

      {/* Password */}
      <div className="profile-section">
        <h3 className="profile-section-title">Change Password</h3>
        <div className="profile-fields">
          {(["current", "next", "confirm"] as const).map((k) => (
            <div key={k} className="profile-field">
              <label className="profile-field-label">
                {k === "current" ? "Current Password" : k === "next" ? "New Password" : "Confirm Password"}
              </label>
              <input
                type="password"
                className="field-input"
                value={pwForm[k]}
                onChange={(e) => setPwForm((p) => ({ ...p, [k]: e.target.value }))}
                placeholder="••••••••"
              />
            </div>
          ))}
        </div>
        <button className="btn-primary" style={{ marginTop: 8 }}>Update Password</button>
      </div>

      {/* Preferences */}
      <div className="profile-section">
        <h3 className="profile-section-title">Communication Preferences</h3>
        <div className="prefs-list">
          {[
            { label: "New arrivals & collections", checked: true },
            { label: "Exclusive member offers", checked: true },
            { label: "Style notes from our editors", checked: false },
            { label: "Order updates & shipping", checked: true },
          ].map((pref) => (
            <label key={pref.label} className="pref-row">
              <input type="checkbox" defaultChecked={pref.checked} className="checkbox-input" />
              <span className="pref-label">{pref.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Danger zone */}
      <div className="profile-section profile-danger">
        <h3 className="profile-section-title" style={{ color: "#c0392b" }}>Account Actions</h3>
        <div className="danger-actions">
          <button className="danger-btn">Sign Out of All Devices</button>
          <button className="danger-btn danger-delete">Delete Account</button>
        </div>
      </div>
    </div>
  );
}

// ─── Wishlist Panel ───────────────────────────────────────────────────────────
function WishlistPanel() {
  return (
    <div className="panel">
      <div className="panel-header">
        <h2 className="panel-title">My Wishlist</h2>
        <p className="panel-sub">Pieces you&apos;ve saved</p>
      </div>
      <div className="wl-panel-grid">
        {wishlistPreview.map((item) => (
          <div key={item.id} className="wl-panel-card">
            <div className="wl-panel-img" style={{ background: item.color }} />
            <p className="wl-panel-name">{item.name}</p>
            <p className="wl-panel-price">${item.price}</p>
            <button className="wl-add-btn" style={{ marginTop: 8 }}>Add to Cart</button>
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center", marginTop: 32 }}>
        <Link href="/wishlist" className="btn-outline">View Full Wishlist →</Link>
      </div>
    </div>
  );
}

// ─── Returns Panel ────────────────────────────────────────────────────────────
function ReturnsPanel() {
  return (
    <div className="panel">
      <div className="panel-header">
        <h2 className="panel-title">Returns</h2>
        <p className="panel-sub">Easy 30-day returns on all orders</p>
      </div>

      {/* Active return */}
      <div className="return-card">
        <div className="return-card-header">
          <div>
            <span className="return-id">Return #RT-00412</span>
            <span className="return-order">for Order ME-004690</span>
          </div>
          <span className="return-status return-processing">Processing</span>
        </div>
        <div className="return-items">
          <div className="return-item">
            <div className="return-item-img" style={{ background: "#d5d0c0" }} />
            <div>
              <p className="return-item-name">Wrap Blazer</p>
              <p className="return-item-meta">Size M · Reason: Sizing issue</p>
            </div>
            <span className="return-item-refund">$410</span>
          </div>
        </div>
        <div className="return-timeline">
          {[
            { label: "Return requested", done: true, date: "4 Mar" },
            { label: "Label generated", done: true, date: "4 Mar" },
            { label: "Item received", done: false, date: "" },
            { label: "Refund issued", done: false, date: "" },
          ].map((step, i) => (
            <div key={i} className={`timeline-step ${step.done ? "timeline-done" : ""}`}>
              <div className="timeline-dot" />
              {i < 3 && <div className="timeline-line" />}
              <p className="timeline-label">{step.label}</p>
              {step.date && <p className="timeline-date">{step.date}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* New return CTA */}
      <div className="return-new">
        <div className="return-new-icon">↩</div>
        <h3 className="return-new-title">Start a New Return</h3>
        <p className="return-new-sub">
          Free returns within 30 days of delivery. Items must be unworn and in original packaging.
        </p>
        <Link href="/account/returns" className="btn-primary">
          Request Return
        </Link>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("overview");

  const panels: Record<string, React.ReactNode> = {
    overview: <OverviewPanel setActiveTab={setActiveTab} />,
    orders: <OrdersPanel />,
    wishlist: <WishlistPanel />,
    addresses: <AddressesPanel />,
    profile: <ProfilePanel />,
    returns: <ReturnsPanel />,
  };

  return (
    <>
      <AnnouncementBar />
      <Navbar />

      <main className="account-page">
        {/* Page header */}
        <div className="account-hero">
          <div className="account-breadcrumb">
            <Link href="/">Home</Link>
            <span className="breadcrumb-sep">·</span>
            <span>My Account</span>
          </div>
          <h1 className="account-hero-title">My <em>Account</em></h1>
        </div>

        <div className="account-layout">
          {/* Sidebar */}
          <aside className="account-sidebar">
            {/* User card */}
            <div className="sidebar-user">
              <div className="sidebar-avatar">{user.avatar}</div>
              <div className="sidebar-user-info">
                <p className="sidebar-name">{user.name}</p>
                <p className="sidebar-email">{user.email}</p>
              </div>
            </div>

            {/* Nav */}
            <nav className="sidebar-nav">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.key}
                  className={`sidebar-nav-item ${activeTab === item.key ? "sidebar-nav-active" : ""}`}
                  onClick={() => setActiveTab(item.key)}
                >
                  <span className="sidebar-nav-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            <button className="sidebar-logout">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sign Out
            </button>
          </aside>

          {/* Main content */}
          <div className="account-main">
            {panels[activeTab]}
          </div>
        </div>
      </main>

      <Footer />

      <style>{`
        /* ── Hero ── */
        .account-page { background: var(--cream); min-height: 80vh; }
        .account-hero {
          background: var(--cream-dark);
          border-bottom: 1px solid var(--border);
          padding: 48px 60px 40px;
        }
        .account-breadcrumb {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 12px;
          letter-spacing: 0.08em;
          color: var(--muted);
          text-transform: uppercase;
          margin-bottom: 16px;
        }
        .account-breadcrumb a { transition: color 0.2s; }
        .account-breadcrumb a:hover { color: var(--gold); }
        .breadcrumb-sep { color: var(--border); }
        .account-hero-title {
          font-family: var(--font-display);
          font-size: clamp(36px, 4vw, 52px);
          font-weight: 400;
          color: var(--charcoal);
          line-height: 1.05;
          animation: fadeUp 0.6s ease both;
        }
        .account-hero-title em { font-style: italic; color: var(--gold); }

        /* ── Layout ── */
        .account-layout {
          display: grid;
          grid-template-columns: 260px 1fr;
          gap: 0;
          max-width: 1200px;
          margin: 0 auto;
          padding: 48px 60px 80px;
          align-items: start;
          gap: 48px;
        }

        /* ── Sidebar ── */
        .account-sidebar {
          position: sticky;
          top: 100px;
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .sidebar-user {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 20px;
          background: var(--cream-dark);
          border: 1px solid var(--border);
          margin-bottom: 4px;
        }
        .sidebar-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: var(--charcoal);
          color: var(--cream);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-display);
          font-size: 14px;
          flex-shrink: 0;
          letter-spacing: 0.06em;
        }
        .sidebar-name {
          font-size: 14px;
          color: var(--charcoal);
          font-weight: 400;
          margin-bottom: 2px;
        }
        .sidebar-email { font-size: 12px; color: var(--muted); }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          border: 1px solid var(--border);
          border-top: none;
        }
        .sidebar-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 20px;
          font-size: 13px;
          color: var(--charcoal-light);
          letter-spacing: 0.04em;
          border-bottom: 1px solid var(--border);
          transition: all 0.18s;
          text-align: left;
          background: var(--cream);
          font-family: var(--font-body);
          cursor: pointer;
        }
        .sidebar-nav-item:last-child { border-bottom: none; }
        .sidebar-nav-item:hover { background: var(--cream-dark); color: var(--charcoal); }
        .sidebar-nav-active {
          background: var(--charcoal) !important;
          color: var(--cream) !important;
        }
        .sidebar-nav-icon { display: flex; align-items: center; flex-shrink: 0; }

        .sidebar-logout {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 20px;
          font-size: 13px;
          color: var(--muted);
          letter-spacing: 0.06em;
          border: 1px solid var(--border);
          border-top: none;
          transition: all 0.18s;
          background: var(--cream);
          font-family: var(--font-body);
          cursor: pointer;
          text-transform: uppercase;
        }
        .sidebar-logout:hover { color: #c0392b; border-color: #c0392b; background: #fff8f8; }

        /* ── Panel shared ── */
        .panel { animation: fadeUp 0.4s ease both; }
        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
          padding-bottom: 24px;
          border-bottom: 1px solid var(--border);
          flex-wrap: wrap;
          gap: 16px;
        }
        .panel-title {
          font-family: var(--font-display);
          font-size: 28px;
          font-weight: 400;
          color: var(--charcoal);
          margin-bottom: 4px;
        }
        .panel-sub { font-size: 13px; color: var(--muted); font-family: var(--font-editorial); font-style: italic; }

        /* ── Overview ── */
        .panel-welcome {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 28px;
          background: var(--charcoal);
          color: var(--cream);
          margin-bottom: 24px;
        }
        .welcome-avatar {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: rgba(201,169,110,0.3);
          border: 1px solid var(--gold);
          color: var(--gold);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-display);
          font-size: 16px;
          flex-shrink: 0;
        }
        .welcome-text { flex: 1; }
        .welcome-name {
          font-family: var(--font-display);
          font-size: 22px;
          font-weight: 400;
          margin-bottom: 4px;
        }
        .welcome-sub { font-size: 12px; color: rgba(250,247,242,0.5); letter-spacing: 0.06em; }
        .tier-badge {
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--gold);
          border: 1px solid rgba(201,169,110,0.4);
          padding: 6px 14px;
          white-space: nowrap;
        }

        .loyalty-card {
          padding: 24px;
          border: 1px solid var(--border);
          background: var(--cream-dark);
          margin-bottom: 24px;
        }
        .loyalty-header { display: flex; justify-content: space-between; margin-bottom: 16px; }
        .loyalty-label { font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); margin-bottom: 4px; }
        .loyalty-pts { font-family: var(--font-display); font-size: 28px; font-weight: 400; color: var(--charcoal); }
        .loyalty-next-label { font-size: 11px; color: var(--muted); text-align: right; margin-bottom: 4px; }
        .loyalty-next-val { font-size: 16px; color: var(--charcoal-light); text-align: right; }
        .loyalty-bar-wrap { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
        .loyalty-bar { flex: 1; height: 4px; background: var(--border); }
        .loyalty-fill { height: 100%; background: var(--gold); transition: width 0.6s ease; }
        .loyalty-pct { font-size: 12px; color: var(--muted); white-space: nowrap; }
        .loyalty-hint { font-size: 12px; color: var(--muted); font-family: var(--font-editorial); font-style: italic; }

        .stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1px;
          background: var(--border);
          border: 1px solid var(--border);
          margin-bottom: 32px;
        }
        .stat-card {
          background: var(--cream);
          padding: 20px;
          text-align: center;
          cursor: pointer;
          transition: background 0.2s;
          display: flex;
          flex-direction: column;
          gap: 4px;
          border: none;
          font-family: var(--font-body);
        }
        .stat-card:hover { background: var(--cream-dark); }
        .stat-card-val {
          font-family: var(--font-display);
          font-size: 26px;
          font-weight: 400;
          color: var(--charcoal);
        }
        .stat-card-label { font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); }

        .section-block { margin-bottom: 32px; }
        .section-block-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .section-block-title {
          font-family: var(--font-display);
          font-size: 18px;
          font-weight: 400;
          color: var(--charcoal);
        }
        .section-block-link {
          font-size: 12px;
          color: var(--gold);
          letter-spacing: 0.06em;
          border-bottom: 1px solid var(--gold);
          padding-bottom: 1px;
          background: none;
          border-left: none;
          border-right: none;
          border-top: none;
          cursor: pointer;
          font-family: var(--font-body);
          transition: color 0.2s;
        }
        .section-block-link:hover { color: var(--charcoal); border-color: var(--charcoal); }

        /* Orders table */
        .orders-table { border: 1px solid var(--border); }
        .order-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 18px;
          border-bottom: 1px solid var(--border);
          gap: 16px;
        }
        .order-row:last-child { border-bottom: none; }
        .order-row-left { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
        .order-id { font-size: 12px; letter-spacing: 0.1em; color: var(--muted); text-transform: uppercase; }
        .order-items {
          font-size: 13px;
          color: var(--charcoal);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 260px;
        }
        .order-row-right { display: flex; align-items: center; gap: 20px; flex-shrink: 0; }
        .order-date { font-size: 12px; color: var(--muted); }
        .order-total { font-size: 14px; color: var(--charcoal); font-weight: 400; }
        .order-status { font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; }

        /* Wishlist preview */
        .wl-preview-row { display: flex; gap: 16px; }
        .wl-preview-card { flex: 1; }
        .wl-preview-img { height: 140px; border-radius: 1px; margin-bottom: 10px; }
        .wl-preview-name { font-family: var(--font-display); font-size: 14px; font-weight: 400; color: var(--charcoal); margin-bottom: 4px; }
        .wl-preview-price { font-size: 13px; color: var(--muted); }
        .wl-preview-more {
          width: 80px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          border: 1px dashed var(--border);
          font-size: 12px;
          color: var(--muted);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          transition: all 0.2s;
          height: 140px;
          margin-bottom: 10px;
        }
        .wl-preview-more:hover { border-color: var(--gold); color: var(--gold); }
        .wl-preview-more span:first-child { font-size: 20px; font-weight: 300; }

        /* ── Orders Panel ── */
        .orders-list { display: flex; flex-direction: column; gap: 1px; background: var(--border); border: 1px solid var(--border); }
        .order-card { background: var(--cream); }
        .order-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 20px;
          cursor: pointer;
          transition: background 0.18s;
          gap: 16px;
        }
        .order-card-top:hover { background: var(--cream-dark); }
        .order-card-meta { display: flex; flex-direction: column; gap: 3px; }
        .order-id-lg { font-size: 13px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--charcoal); font-weight: 400; }
        .order-card-date { font-size: 12px; color: var(--muted); }
        .order-card-right { display: flex; align-items: center; gap: 16px; flex-shrink: 0; }
        .order-status-badge {
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          border: 1px solid;
          padding: 4px 10px;
        }
        .order-card-total { font-size: 15px; color: var(--charcoal); }
        .order-chevron { transition: transform 0.2s; color: var(--muted); }
        .order-chevron.open { transform: rotate(180deg); }

        .order-card-detail {
          padding: 0 20px 20px;
          border-top: 1px solid var(--border);
          animation: fadeUp 0.25s ease both;
        }
        .order-detail-items { display: flex; flex-direction: column; gap: 12px; padding: 16px 0; }
        .order-detail-item { display: flex; align-items: center; gap: 14px; }
        .order-item-img { width: 56px; height: 68px; flex-shrink: 0; border-radius: 1px; }
        .order-item-name { font-size: 14px; color: var(--charcoal); margin-bottom: 3px; }
        .order-item-meta { font-size: 12px; color: var(--muted); }
        .order-detail-actions { display: flex; gap: 10px; padding-top: 8px; border-top: 1px solid var(--border); }
        .order-action-btn {
          padding: 9px 18px;
          border: 1px solid var(--border);
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--charcoal-light);
          transition: all 0.2s;
          font-family: var(--font-body);
          cursor: pointer;
          background: transparent;
        }
        .order-action-btn:hover { border-color: var(--charcoal); color: var(--charcoal); }

        /* ── Addresses ── */
        .addresses-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .addr-card {
          padding: 24px;
          border: 1px solid var(--border);
          background: var(--cream);
          transition: border-color 0.2s;
        }
        .addr-default { border-color: var(--charcoal); }
        .addr-card-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
        .addr-label { font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); }
        .addr-default-badge {
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          background: var(--charcoal);
          color: var(--cream);
          padding: 3px 8px;
        }
        .addr-name { font-size: 14px; color: var(--charcoal); font-weight: 400; margin-bottom: 6px; }
        .addr-line { font-size: 13px; color: var(--charcoal-light); margin-bottom: 2px; }
        .addr-actions { display: flex; gap: 10px; margin-top: 16px; padding-top: 14px; border-top: 1px solid var(--border); flex-wrap: wrap; }
        .addr-action-btn {
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--charcoal-light);
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          font-family: var(--font-body);
          transition: color 0.2s;
          border-bottom: 1px solid transparent;
        }
        .addr-action-btn:hover { color: var(--gold); border-color: var(--gold); }
        .addr-remove:hover { color: #c0392b !important; border-color: #c0392b !important; }

        .addr-add-form { background: var(--cream-dark); }
        .addr-add-title { font-family: var(--font-display); font-size: 16px; font-weight: 400; color: var(--charcoal); margin-bottom: 16px; }
        .addr-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px; }
        .addr-input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid var(--border);
          background: var(--white);
          font-size: 13px;
          color: var(--charcoal);
          font-family: var(--font-body);
          outline: none;
          transition: border-color 0.2s;
          margin-bottom: 10px;
          display: block;
        }
        .addr-input:focus { border-color: var(--charcoal); }
        .addr-form-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 4px; }

        /* ── Profile ── */
        .profile-section {
          padding: 28px 0;
          border-bottom: 1px solid var(--border);
        }
        .profile-section:last-child { border-bottom: none; }
        .profile-section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .profile-section-title {
          font-family: var(--font-display);
          font-size: 18px;
          font-weight: 400;
          color: var(--charcoal);
        }
        .profile-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 16px 24px; }
        .profile-field {}
        .profile-field-label {
          display: block;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 6px;
        }
        .profile-field-val { font-size: 14px; color: var(--charcoal); padding: 12px 0; border-bottom: 1px solid var(--border); }
        .profile-saved {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 12px;
          color: #2a7a4a;
          margin-top: 14px;
          letter-spacing: 0.04em;
        }

        .prefs-list { display: flex; flex-direction: column; gap: 14px; }
        .pref-row { display: flex; align-items: center; gap: 12px; cursor: pointer; }
        .pref-label { font-size: 14px; color: var(--charcoal-light); }

        .profile-danger { padding-top: 28px; }
        .danger-actions { display: flex; gap: 12px; flex-wrap: wrap; }
        .danger-btn {
          padding: 10px 20px;
          border: 1px solid var(--border);
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--charcoal-light);
          background: transparent;
          cursor: pointer;
          font-family: var(--font-body);
          transition: all 0.2s;
        }
        .danger-btn:hover { border-color: #c0392b; color: #c0392b; }
        .danger-delete:hover { background: #c0392b; color: white; }

        /* ── Wishlist Panel ── */
        .wl-panel-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 8px; }
        .wl-panel-img { height: 200px; border-radius: 1px; margin-bottom: 10px; }
        .wl-panel-name { font-family: var(--font-display); font-size: 15px; font-weight: 400; color: var(--charcoal); margin-bottom: 4px; }
        .wl-panel-price { font-size: 13px; color: var(--muted); margin-bottom: 8px; }
        .wl-add-btn {
          width: 100%;
          padding: 10px;
          background: var(--charcoal);
          color: var(--cream);
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          border: none;
          cursor: pointer;
          font-family: var(--font-body);
          transition: background 0.2s;
        }
        .wl-add-btn:hover { background: var(--gold); }

        /* ── Returns ── */
        .return-card {
          border: 1px solid var(--border);
          padding: 24px;
          margin-bottom: 32px;
          background: var(--cream-dark);
        }
        .return-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 12px;
        }
        .return-id { display: block; font-size: 14px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--charcoal); margin-bottom: 3px; }
        .return-order { font-size: 12px; color: var(--muted); }
        .return-status { font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; padding: 5px 12px; border: 1px solid; }
        .return-processing { color: #b87333; border-color: #b87333; background: #fff9f4; }

        .return-items { margin-bottom: 24px; }
        .return-item { display: flex; align-items: center; gap: 14px; }
        .return-item-img { width: 56px; height: 68px; flex-shrink: 0; border-radius: 1px; }
        .return-item-name { font-size: 14px; color: var(--charcoal); margin-bottom: 3px; }
        .return-item-meta { font-size: 12px; color: var(--muted); }
        .return-item-refund { margin-left: auto; font-size: 15px; color: var(--charcoal); }

        .return-timeline {
          display: flex;
          align-items: flex-start;
          gap: 0;
          padding-top: 20px;
          border-top: 1px solid var(--border);
        }
        .timeline-step {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }
        .timeline-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid var(--border);
          background: var(--cream);
          margin-bottom: 8px;
          position: relative;
          z-index: 1;
          flex-shrink: 0;
        }
        .timeline-done .timeline-dot {
          background: var(--charcoal);
          border-color: var(--charcoal);
        }
        .timeline-line {
          position: absolute;
          top: 5px;
          left: 50%;
          width: 100%;
          height: 2px;
          background: var(--border);
          z-index: 0;
        }
        .timeline-done .timeline-line { background: var(--charcoal); }
        .timeline-label { font-size: 11px; letter-spacing: 0.06em; color: var(--charcoal-light); text-align: center; }
        .timeline-date { font-size: 11px; color: var(--muted); margin-top: 3px; }

        .return-new {
          text-align: center;
          padding: 48px 40px;
          border: 1px dashed var(--border);
          background: var(--cream);
        }
        .return-new-icon { font-size: 28px; color: var(--gold); margin-bottom: 16px; }
        .return-new-title {
          font-family: var(--font-display);
          font-size: 22px;
          font-weight: 400;
          color: var(--charcoal);
          margin-bottom: 10px;
        }
        .return-new-sub {
          font-family: var(--font-editorial);
          font-size: 15px;
          color: var(--muted);
          font-weight: 300;
          margin-bottom: 24px;
          max-width: 400px;
          margin-left: auto;
          margin-right: auto;
        }

        /* ── Field shared ── */
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
        .checkbox-input { width: 15px; height: 15px; accent-color: var(--charcoal); cursor: pointer; flex-shrink: 0; }

        /* ── Responsive ── */
        @media (max-width: 1100px) {
          .account-layout { grid-template-columns: 220px 1fr; padding: 36px 40px 60px; gap: 36px; }
        }
        @media (max-width: 900px) {
          .account-layout { grid-template-columns: 1fr; padding: 24px 20px 60px; }
          .account-hero { padding: 36px 20px 28px; }
          .account-sidebar { position: static; }
          .sidebar-nav { flex-direction: row; flex-wrap: wrap; border: 1px solid var(--border); }
          .sidebar-nav-item { flex: 1 1 auto; justify-content: center; border-right: 1px solid var(--border); border-bottom: none; padding: 12px 10px; font-size: 11px; }
          .sidebar-nav-item:last-child { border-right: none; }
          .sidebar-nav-icon { display: none; }
          .sidebar-user { display: none; }
          .sidebar-logout { display: none; }
          .stats-row { grid-template-columns: repeat(2, 1fr); }
          .addresses-grid { grid-template-columns: 1fr; }
          .profile-fields { grid-template-columns: 1fr; }
          .wl-panel-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .panel-welcome { flex-wrap: wrap; }
          .welcome-tier { width: 100%; }
          .order-row-right { gap: 10px; }
          .order-row { flex-direction: column; align-items: flex-start; }
          .sidebar-nav-item span { display: none; }
          .sidebar-nav-icon { display: flex; }
          .sidebar-nav-item { padding: 12px 16px; }
        }
      `}</style>
    </>
  );
}