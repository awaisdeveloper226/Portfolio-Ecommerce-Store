"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// ─── Nav config ───────────────────────────────────────────────────────────────
const NAV_SECTIONS = [
  {
    label: "Overview",
    items: [
      {
        key: "dashboard",
        label: "Dashboard",
        href: "/admin",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
          </svg>
        ),
      },
    ],
  },
  {
    label: "Catalogue",
    items: [
      {
        key: "products",
        label: "Products",
        href: "/admin/products",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
        ),
        badge: "248",
      },
      {
        key: "categories",
        label: "Categories",
        href: "/admin/categories",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>
        ),
      },
      {
        key: "collections",
        label: "Collections",
        href: "/admin/collections",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="7" width="20" height="14" rx="2" />
            <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
          </svg>
        ),
      },
      {
        key: "media",
        label: "Media Library",
        href: "/admin/media",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        ),
      },
    ],
  },
  {
    label: "Commerce",
    items: [
      {
        key: "orders",
        label: "Orders",
        href: "/admin/orders",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polyline points="9 11 12 14 22 4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
        ),
        badge: "12",
        badgeColor: "#c9a96e",
      },
      {
        key: "customers",
        label: "Customers",
        href: "/admin/customers",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        ),
      },
      {
        key: "discounts",
        label: "Discounts",
        href: "/admin/discounts",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
            <line x1="7" y1="7" x2="7.01" y2="7" />
          </svg>
        ),
      },
    ],
  },
  {
    label: "System",
    items: [
      {
        key: "settings",
        label: "Settings",
        href: "/admin/settings",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        ),
      },
    ],
  },
];

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ collapsed, setCollapsed }: { collapsed: boolean; setCollapsed: (v: boolean) => void }) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <aside className={`adm-sidebar ${collapsed ? "adm-sidebar-collapsed" : ""}`}>
      {/* Logo */}
      <div className="adm-sidebar-logo">
        {!collapsed && (
          <div className="adm-logo-text">
            <span className="adm-logo-main">MAISON</span>
            <span className="adm-logo-sub">ELARA</span>
          </div>
        )}
        {collapsed && <span className="adm-logo-icon">ME</span>}
        <button
          className="adm-collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {collapsed ? <path d="m9 18 6-6-6-6" /> : <path d="m15 18-6-6 6-6" />}
          </svg>
        </button>
      </div>

      {/* Nav */}
      <nav className="adm-nav">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} className="adm-nav-section">
            {!collapsed && (
              <p className="adm-nav-section-label">{section.label}</p>
            )}
            {section.items.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={`adm-nav-item ${isActive(item.href) ? "adm-nav-active" : ""}`}
                title={collapsed ? item.label : undefined}
              >
                <span className="adm-nav-icon">{item.icon}</span>
                {!collapsed && (
                  <>
                    <span className="adm-nav-label">{item.label}</span>
                    {item.badge && (
                      <span
                        className="adm-nav-badge"
                        style={item.badgeColor ? { background: item.badgeColor } : {}}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="adm-sidebar-footer">
        {!collapsed && (
          <div className="adm-sidebar-user">
            <div className="adm-user-avatar">AD</div>
            <div className="adm-user-info">
              <p className="adm-user-name">Admin</p>
              <p className="adm-user-role">Super Admin</p>
            </div>
          </div>
        )}
        <Link href="/" className="adm-view-store-btn" title="View store">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          {!collapsed && <span>View Store</span>}
        </Link>
      </div>
    </aside>
  );
}

// ─── Top bar ──────────────────────────────────────────────────────────────────
function Topbar({ title }: { title?: string }) {
  const pathname = usePathname();

  // Derive breadcrumb from pathname
  const crumbs = pathname
    .split("/")
    .filter(Boolean)
    .map((seg, i, arr) => ({
      label: seg.charAt(0).toUpperCase() + seg.slice(1),
      href: "/" + arr.slice(0, i + 1).join("/"),
    }));

  return (
    <header className="adm-topbar">
      <div className="adm-topbar-left">
        <nav className="adm-topbar-breadcrumb">
          {crumbs.map((c, i) => (
            <span key={c.href} className="adm-bc-item">
              {i < crumbs.length - 1 ? (
                <Link href={c.href} className="adm-bc-link">{c.label}</Link>
              ) : (
                <span className="adm-bc-current">{c.label}</span>
              )}
              {i < crumbs.length - 1 && <span className="adm-bc-sep">›</span>}
            </span>
          ))}
        </nav>
      </div>
      <div className="adm-topbar-right">
        {/* Search */}
        <div className="adm-topbar-search">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input type="text" placeholder="Search…" className="adm-search-input" />
          <kbd className="adm-search-kbd">⌘K</kbd>
        </div>

        {/* Notification */}
        <button className="adm-icon-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className="adm-notif-dot" />
        </button>

        {/* Store link */}
        <Link href="/" className="adm-topbar-store-link">
          ↗ maisonelara.com
        </Link>
      </div>
    </header>
  );
}

// ─── Layout ───────────────────────────────────────────────────────────────────
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <div className={`adm-shell ${collapsed ? "adm-shell-collapsed" : ""}`}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="adm-main">
        <Topbar />
        <div className="adm-content">
          {children}
        </div>
      </div>

      <style>{`
        /* ── Reset & vars ── */
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --adm-bg:        #0f0f0f;
          --adm-surface:   #161616;
          --adm-surface2:  #1e1e1e;
          --adm-border:    #2a2a2a;
          --adm-border2:   #333;
          --adm-text:      #e8e4df;
          --adm-muted:     #6b6560;
          --adm-muted2:    #4a4540;
          --adm-gold:      #c9a96e;
          --adm-gold-dim:  rgba(201,169,110,0.12);
          --adm-green:     #4caf7d;
          --adm-red:       #e05c5c;
          --adm-blue:      #5c8ee0;
          --adm-sidebar-w: 220px;
          --adm-sidebar-collapsed: 60px;
          --adm-topbar-h:  52px;
          --font-body: "DM Sans", system-ui, sans-serif;
          --font-display: "Playfair Display", Georgia, serif;
        }

        /* ── Shell ── */
        .adm-shell {
          display: grid;
          grid-template-columns: var(--adm-sidebar-w) 1fr;
          min-height: 100vh;
          background: var(--adm-bg);
          color: var(--adm-text);
          font-family: var(--font-body);
          transition: grid-template-columns 0.25s ease;
        }
        .adm-shell-collapsed {
          grid-template-columns: var(--adm-sidebar-collapsed) 1fr;
        }

        /* ── Sidebar ── */
        .adm-sidebar {
          background: var(--adm-surface);
          border-right: 1px solid var(--adm-border);
          display: flex;
          flex-direction: column;
          height: 100vh;
          position: sticky;
          top: 0;
          overflow: hidden;
          transition: width 0.25s ease;
          width: var(--adm-sidebar-w);
        }
        .adm-sidebar-collapsed {
          width: var(--adm-sidebar-collapsed);
        }

        /* Logo */
        .adm-sidebar-logo {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 14px;
          height: var(--adm-topbar-h);
          border-bottom: 1px solid var(--adm-border);
          flex-shrink: 0;
        }
        .adm-logo-text {
          display: flex;
          flex-direction: column;
          gap: 1px;
          overflow: hidden;
          white-space: nowrap;
        }
        .adm-logo-main {
          font-family: var(--font-display);
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.18em;
          color: var(--adm-text);
        }
        .adm-logo-sub {
          font-size: 9px;
          letter-spacing: 0.22em;
          color: var(--adm-gold);
          text-transform: uppercase;
        }
        .adm-logo-icon {
          font-family: var(--font-display);
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.12em;
          color: var(--adm-gold);
        }
        .adm-collapse-btn {
          width: 26px;
          height: 26px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--adm-muted);
          background: transparent;
          border: 1px solid var(--adm-border);
          cursor: pointer;
          flex-shrink: 0;
          transition: all 0.18s;
        }
        .adm-collapse-btn:hover { border-color: var(--adm-border2); color: var(--adm-text); }

        /* Nav */
        .adm-nav {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 12px 0;
          scrollbar-width: thin;
          scrollbar-color: var(--adm-border) transparent;
        }
        .adm-nav-section {
          margin-bottom: 4px;
        }
        .adm-nav-section-label {
          font-size: 9px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--adm-muted2);
          padding: 10px 16px 4px;
          white-space: nowrap;
          overflow: hidden;
        }
        .adm-nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 14px;
          font-size: 13px;
          color: var(--adm-muted);
          letter-spacing: 0.02em;
          transition: all 0.15s;
          position: relative;
          white-space: nowrap;
          overflow: hidden;
          text-decoration: none;
        }
        .adm-nav-item:hover {
          color: var(--adm-text);
          background: var(--adm-surface2);
        }
        .adm-nav-active {
          color: var(--adm-text) !important;
          background: var(--adm-gold-dim) !important;
        }
        .adm-nav-active::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 2px;
          background: var(--adm-gold);
        }
        .adm-nav-icon {
          display: flex;
          align-items: center;
          flex-shrink: 0;
          color: inherit;
        }
        .adm-nav-active .adm-nav-icon { color: var(--adm-gold); }
        .adm-nav-label { flex: 1; }
        .adm-nav-badge {
          font-size: 10px;
          padding: 1px 6px;
          background: var(--adm-surface2);
          color: var(--adm-muted);
          border: 1px solid var(--adm-border);
          flex-shrink: 0;
          letter-spacing: 0.04em;
        }
        .adm-nav-active .adm-nav-badge {
          background: var(--adm-gold-dim);
          border-color: rgba(201,169,110,0.3);
          color: var(--adm-gold);
        }

        /* Footer */
        .adm-sidebar-footer {
          border-top: 1px solid var(--adm-border);
          padding: 12px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .adm-sidebar-user {
          display: flex;
          align-items: center;
          gap: 10px;
          overflow: hidden;
        }
        .adm-user-avatar {
          width: 30px;
          height: 30px;
          border-radius: 2px;
          background: var(--adm-gold-dim);
          border: 1px solid rgba(201,169,110,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.08em;
          color: var(--adm-gold);
          flex-shrink: 0;
        }
        .adm-user-name {
          font-size: 12px;
          color: var(--adm-text);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .adm-user-role {
          font-size: 10px;
          color: var(--adm-muted);
          letter-spacing: 0.04em;
          white-space: nowrap;
        }
        .adm-view-store-btn {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 7px 10px;
          font-size: 11px;
          color: var(--adm-muted);
          border: 1px solid var(--adm-border);
          transition: all 0.18s;
          letter-spacing: 0.04em;
          white-space: nowrap;
          overflow: hidden;
          text-decoration: none;
        }
        .adm-view-store-btn:hover {
          color: var(--adm-text);
          border-color: var(--adm-border2);
        }

        /* ── Main ── */
        .adm-main {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          overflow: hidden;
        }

        /* ── Topbar ── */
        .adm-topbar {
          height: var(--adm-topbar-h);
          border-bottom: 1px solid var(--adm-border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 28px;
          background: var(--adm-surface);
          position: sticky;
          top: 0;
          z-index: 50;
          flex-shrink: 0;
          gap: 20px;
        }
        .adm-topbar-left { display: flex; align-items: center; }
        .adm-topbar-breadcrumb {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .adm-bc-item {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .adm-bc-link {
          font-size: 13px;
          color: var(--adm-muted);
          transition: color 0.15s;
          text-decoration: none;
        }
        .adm-bc-link:hover { color: var(--adm-text); }
        .adm-bc-current {
          font-size: 13px;
          color: var(--adm-text);
          font-weight: 500;
        }
        .adm-bc-sep { color: var(--adm-muted2); font-size: 14px; }

        .adm-topbar-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .adm-topbar-search {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          border: 1px solid var(--adm-border);
          background: var(--adm-surface2);
          color: var(--adm-muted);
          min-width: 200px;
        }
        .adm-search-input {
          border: none;
          background: transparent;
          font-size: 13px;
          color: var(--adm-text);
          font-family: var(--font-body);
          outline: none;
          flex: 1;
          min-width: 0;
        }
        .adm-search-input::placeholder { color: var(--adm-muted); }
        .adm-search-kbd {
          font-size: 10px;
          color: var(--adm-muted2);
          border: 1px solid var(--adm-border2);
          padding: 1px 5px;
          letter-spacing: 0.04em;
          flex-shrink: 0;
        }
        .adm-icon-btn {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--adm-border);
          background: transparent;
          color: var(--adm-muted);
          cursor: pointer;
          transition: all 0.15s;
          position: relative;
        }
        .adm-icon-btn:hover { border-color: var(--adm-border2); color: var(--adm-text); }
        .adm-notif-dot {
          position: absolute;
          top: 5px;
          right: 5px;
          width: 6px;
          height: 6px;
          background: var(--adm-gold);
          border-radius: 50%;
          border: 1.5px solid var(--adm-surface);
        }
        .adm-topbar-store-link {
          font-size: 11px;
          letter-spacing: 0.08em;
          color: var(--adm-muted);
          border: 1px solid var(--adm-border);
          padding: 5px 12px;
          transition: all 0.15s;
          text-decoration: none;
          white-space: nowrap;
        }
        .adm-topbar-store-link:hover { color: var(--adm-text); border-color: var(--adm-border2); }

        /* ── Content ── */
        .adm-content {
          flex: 1;
          overflow-y: auto;
          padding: 28px;
          background: var(--adm-bg);
        }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .adm-shell { grid-template-columns: var(--adm-sidebar-collapsed) 1fr; }
          .adm-sidebar { width: var(--adm-sidebar-collapsed); }
          .adm-logo-text, .adm-nav-label, .adm-nav-badge,
          .adm-nav-section-label, .adm-sidebar-user,
          .adm-view-store-btn span { display: none; }
          .adm-collapse-btn { display: none; }
          .adm-topbar { padding: 0 16px; }
          .adm-topbar-search { min-width: 140px; }
          .adm-content { padding: 16px; }
        }
      `}</style>
    </div>
  );
}