"use client";

import { useState } from "react";
import Link from "next/link";

// ─── Mock data ────────────────────────────────────────────────────────────────
const STATS = [
  {
    label: "Revenue (30d)",
    value: "$48,320",
    change: "+12.4%",
    up: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    accent: "#c9a96e",
    sparkline: [32, 28, 40, 35, 48, 42, 55, 50, 62, 58, 70, 65],
  },
  {
    label: "Orders (30d)",
    value: "184",
    change: "+8.1%",
    up: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
    accent: "#5c8ee0",
    sparkline: [20, 24, 18, 30, 26, 32, 28, 36, 30, 38, 34, 42],
  },
  {
    label: "Customers",
    value: "3,241",
    change: "+3.7%",
    up: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    accent: "#4caf7d",
    sparkline: [60, 62, 58, 65, 68, 64, 70, 72, 68, 75, 78, 74],
  },
  {
    label: "Avg. Order Value",
    value: "$262",
    change: "-2.3%",
    up: false,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    accent: "#b87898",
    sparkline: [80, 76, 82, 78, 74, 78, 72, 70, 74, 68, 66, 70],
  },
];

const RECENT_ORDERS = [
  { id: "ME-005018", customer: "Sophie Beaumont", items: 2, total: 480, status: "Delivered",   date: "Today, 2:14 PM" },
  { id: "ME-005017", customer: "Amara Konte",     items: 1, total: 320, status: "Processing",  date: "Today, 11:32 AM" },
  { id: "ME-005016", customer: "Léa Marchand",    items: 3, total: 755, status: "Shipped",     date: "Yesterday, 6:48 PM" },
  { id: "ME-005015", customer: "Yuki Tanaka",     items: 1, total: 145, status: "Confirmed",   date: "Yesterday, 3:15 PM" },
  { id: "ME-005014", customer: "Clara Okonkwo",   items: 2, total: 590, status: "Delivered",   date: "2 days ago" },
  { id: "ME-005013", customer: "Hana Müller",     items: 1, total: 275, status: "Refunded",    date: "2 days ago" },
];

const LOW_STOCK = [
  { id: 3,  name: "Cashmere Turtleneck",  sku: "CT-LAV-M", size: "M", color: "Lavender", stock: 2 },
  { id: 4,  name: "Wrap Blazer",          sku: "WB-STN-S", size: "S", color: "Stone",    stock: 1 },
  { id: 19, name: "Double-Breasted Coat", sku: "DC-CHR-XS",size: "XS",color: "Charcoal", stock: 3 },
  { id: 14, name: "Pleated Midi Dress",   sku: "PM-SLT-L", size: "L", color: "Slate",    stock: 2 },
];

const TOP_PRODUCTS = [
  { name: "Silk Slip Dress",      revenue: "$12,480", units: 44, trend: "up",   pct: 92 },
  { name: "Ribbed Maxi Dress",    revenue: "$8,925",  units: 35, trend: "up",   pct: 78 },
  { name: "Cashmere Turtleneck",  revenue: "$7,680",  units: 24, trend: "down", pct: 62 },
  { name: "Satin Cami Top",       revenue: "$6,270",  units: 66, trend: "up",   pct: 58 },
  { name: "Linen Co-ord Set",     revenue: "$5,760",  units: 18, trend: "up",   pct: 48 },
];

const STATUS_CONFIG: Record<string, { color: string; bg: string }> = {
  Delivered:  { color: "#4caf7d", bg: "rgba(76,175,125,0.1)"   },
  Processing: { color: "#c9a96e", bg: "rgba(201,169,110,0.1)"  },
  Shipped:    { color: "#5c8ee0", bg: "rgba(92,142,224,0.1)"   },
  Confirmed:  { color: "#b87898", bg: "rgba(184,120,152,0.1)"  },
  Refunded:   { color: "#6b6560", bg: "rgba(107,101,96,0.1)"   },
  Cancelled:  { color: "#e05c5c", bg: "rgba(224,92,92,0.1)"    },
};

// ─── Mini sparkline ───────────────────────────────────────────────────────────
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80;
  const h = 32;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  });
  const pathD = "M" + pts.join(" L");
  const areaD = `${pathD} L${w},${h} L0,${h} Z`;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={`sg-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#sg-${color.replace("#", "")})`} />
      <path d={pathD} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [period, setPeriod] = useState<"7d" | "30d" | "90d">("30d");

  return (
    <div className="dash">

      {/* ── Page header ── */}
      <div className="dash-header">
        <div>
          <h1 className="dash-title">Dashboard</h1>
          <p className="dash-sub">Good morning — here&apos;s what&apos;s happening today.</p>
        </div>
        <div className="dash-header-right">
          <div className="dash-period-tabs">
            {(["7d", "30d", "90d"] as const).map((p) => (
              <button
                key={p}
                className={`dash-period-btn ${period === p ? "dash-period-active" : ""}`}
                onClick={() => setPeriod(p)}
              >
                {p}
              </button>
            ))}
          </div>
          <Link href="/admin/products/new" className="dash-cta-btn">
            + New Product
          </Link>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="dash-stats-grid">
        {STATS.map((s, i) => (
          <div key={s.label} className="dash-stat-card" style={{ animationDelay: `${i * 0.07}s` }}>
            <div className="dash-stat-top">
              <div className="dash-stat-icon" style={{ color: s.accent, background: `${s.accent}15` }}>
                {s.icon}
              </div>
              <span className={`dash-stat-change ${s.up ? "dash-change-up" : "dash-change-down"}`}>
                {s.up ? "▲" : "▼"} {s.change}
              </span>
            </div>
            <p className="dash-stat-value">{s.value}</p>
            <p className="dash-stat-label">{s.label}</p>
            <div className="dash-stat-spark">
              <Sparkline data={s.sparkline} color={s.accent} />
            </div>
          </div>
        ))}
      </div>

      {/* ── Middle row ── */}
      <div className="dash-mid-grid">

        {/* Recent orders */}
        <div className="dash-card dash-orders-card">
          <div className="dash-card-header">
            <h2 className="dash-card-title">Recent Orders</h2>
            <Link href="/admin/orders" className="dash-card-link">View all →</Link>
          </div>
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_ORDERS.map((o) => {
                  const s = STATUS_CONFIG[o.status] ?? { color: "#6b6560", bg: "rgba(107,101,96,0.1)" };
                  return (
                    <tr key={o.id} className="dash-table-row">
                      <td>
                        <Link href={`/admin/orders/${o.id}`} className="dash-order-id">
                          {o.id}
                        </Link>
                      </td>
                      <td className="dash-td-customer">{o.customer}</td>
                      <td className="dash-td-muted">{o.items}</td>
                      <td className="dash-td-bold">${o.total}</td>
                      <td>
                        <span
                          className="dash-status-pill"
                          style={{ color: s.color, background: s.bg }}
                        >
                          {o.status}
                        </span>
                      </td>
                      <td className="dash-td-muted">{o.date}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column */}
        <div className="dash-right-col">

          {/* Top products */}
          <div className="dash-card">
            <div className="dash-card-header">
              <h2 className="dash-card-title">Top Products</h2>
              <Link href="/admin/products" className="dash-card-link">View all →</Link>
            </div>
            <div className="dash-top-products">
              {TOP_PRODUCTS.map((p, i) => (
                <div key={p.name} className="dash-top-item">
                  <span className="dash-top-rank">0{i + 1}</span>
                  <div className="dash-top-info">
                    <p className="dash-top-name">{p.name}</p>
                    <div className="dash-top-bar-wrap">
                      <div
                        className="dash-top-bar"
                        style={{
                          width: `${p.pct}%`,
                          background: p.trend === "up" ? "#4caf7d" : "#e05c5c",
                        }}
                      />
                    </div>
                  </div>
                  <div className="dash-top-meta">
                    <span className="dash-top-rev">{p.revenue}</span>
                    <span className="dash-top-units">{p.units} sold</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Low stock */}
          <div className="dash-card dash-stock-card">
            <div className="dash-card-header">
              <h2 className="dash-card-title">
                Low Stock
                <span className="dash-alert-badge">{LOW_STOCK.length}</span>
              </h2>
              <Link href="/admin/products?filter=low_stock" className="dash-card-link">Manage →</Link>
            </div>
            <div className="dash-stock-list">
              {LOW_STOCK.map((item) => (
                <div key={item.sku} className="dash-stock-item">
                  <div className="dash-stock-info">
                    <p className="dash-stock-name">{item.name}</p>
                    <p className="dash-stock-sku">{item.sku} · {item.size} · {item.color}</p>
                  </div>
                  <div className="dash-stock-qty-wrap">
                    <span
                      className="dash-stock-qty"
                      style={{ color: item.stock === 1 ? "#e05c5c" : "#c9a96e" }}
                    >
                      {item.stock} left
                    </span>
                    <Link href={`/admin/products/${item.id}`} className="dash-stock-edit">
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Quick actions ── */}
      <div className="dash-quick-actions">
        <p className="dash-quick-label">Quick Actions</p>
        <div className="dash-quick-grid">
          {[
            { label: "Add Product",     href: "/admin/products/new",   icon: "+" },
            { label: "New Collection",  href: "/admin/collections",    icon: "◈" },
            { label: "Add Discount",    href: "/admin/discounts",      icon: "%" },
            { label: "Upload Media",    href: "/admin/media",          icon: "↑" },
            { label: "View Orders",     href: "/admin/orders",         icon: "◎" },
            { label: "Manage Customers",href: "/admin/customers",      icon: "◇" },
          ].map((a) => (
            <Link key={a.label} href={a.href} className="dash-quick-card">
              <span className="dash-quick-icon">{a.icon}</span>
              <span className="dash-quick-text">{a.label}</span>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        /* ── Dashboard ── */
        .dash { display: flex; flex-direction: column; gap: 24px; }

        /* Header */
        .dash-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
        }
        .dash-title {
          font-family: var(--font-display);
          font-size: 26px;
          font-weight: 400;
          color: var(--adm-text);
          margin-bottom: 4px;
        }
        .dash-sub { font-size: 13px; color: var(--adm-muted); }
        .dash-header-right { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .dash-period-tabs {
          display: flex;
          border: 1px solid var(--adm-border);
          overflow: hidden;
        }
        .dash-period-btn {
          padding: 7px 14px;
          font-size: 12px;
          letter-spacing: 0.06em;
          color: var(--adm-muted);
          background: transparent;
          border-right: 1px solid var(--adm-border);
          cursor: pointer;
          font-family: var(--font-body);
          transition: all 0.15s;
        }
        .dash-period-btn:last-child { border-right: none; }
        .dash-period-btn:hover { color: var(--adm-text); background: var(--adm-surface2); }
        .dash-period-active { background: var(--adm-gold-dim) !important; color: var(--adm-gold) !important; }
        .dash-cta-btn {
          padding: 8px 18px;
          background: var(--adm-gold);
          color: #0f0f0f;
          font-size: 12px;
          letter-spacing: 0.08em;
          font-family: var(--font-body);
          text-decoration: none;
          transition: opacity 0.18s;
          white-space: nowrap;
        }
        .dash-cta-btn:hover { opacity: 0.88; }

        /* Stats */
        .dash-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }
        .dash-stat-card {
          background: var(--adm-surface);
          border: 1px solid var(--adm-border);
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          animation: dash-in 0.4s ease both;
          position: relative;
          overflow: hidden;
        }
        @keyframes dash-in {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .dash-stat-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 4px;
        }
        .dash-stat-icon {
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 2px;
        }
        .dash-stat-change {
          font-size: 11px;
          letter-spacing: 0.04em;
        }
        .dash-change-up   { color: #4caf7d; }
        .dash-change-down { color: #e05c5c; }
        .dash-stat-value {
          font-family: var(--font-display);
          font-size: 26px;
          font-weight: 400;
          color: var(--adm-text);
          line-height: 1;
        }
        .dash-stat-label {
          font-size: 11px;
          letter-spacing: 0.08em;
          color: var(--adm-muted);
          text-transform: uppercase;
        }
        .dash-stat-spark {
          margin-top: 8px;
          opacity: 0.8;
        }

        /* Cards */
        .dash-card {
          background: var(--adm-surface);
          border: 1px solid var(--adm-border);
          padding: 20px;
        }
        .dash-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 18px;
          padding-bottom: 14px;
          border-bottom: 1px solid var(--adm-border);
        }
        .dash-card-title {
          font-size: 14px;
          font-weight: 500;
          color: var(--adm-text);
          letter-spacing: 0.02em;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .dash-alert-badge {
          font-size: 10px;
          padding: 1px 7px;
          background: rgba(224,92,92,0.15);
          color: #e05c5c;
          border: 1px solid rgba(224,92,92,0.3);
          letter-spacing: 0.04em;
        }
        .dash-card-link {
          font-size: 12px;
          color: var(--adm-gold);
          text-decoration: none;
          letter-spacing: 0.04em;
          transition: opacity 0.15s;
        }
        .dash-card-link:hover { opacity: 0.75; }

        /* Middle layout */
        .dash-mid-grid {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 12px;
          align-items: start;
        }
        .dash-right-col { display: flex; flex-direction: column; gap: 12px; }

        /* Table */
        .dash-table-wrap { overflow-x: auto; }
        .dash-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }
        .dash-table th {
          text-align: left;
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--adm-muted);
          font-weight: 400;
          padding: 0 12px 10px 0;
          white-space: nowrap;
          border-bottom: 1px solid var(--adm-border);
        }
        .dash-table th:last-child { padding-right: 0; }
        .dash-table-row td {
          padding: 11px 12px 11px 0;
          border-bottom: 1px solid var(--adm-border);
          vertical-align: middle;
          white-space: nowrap;
        }
        .dash-table-row:last-child td { border-bottom: none; }
        .dash-table-row:hover td { background: var(--adm-surface2); }
        .dash-order-id {
          font-size: 12px;
          letter-spacing: 0.08em;
          color: var(--adm-gold);
          text-decoration: none;
        }
        .dash-order-id:hover { text-decoration: underline; }
        .dash-td-customer { color: var(--adm-text); }
        .dash-td-muted    { color: var(--adm-muted); font-size: 12px; }
        .dash-td-bold     { color: var(--adm-text); font-weight: 500; }
        .dash-status-pill {
          font-size: 10px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 3px 8px;
          display: inline-block;
        }

        /* Top products */
        .dash-top-products { display: flex; flex-direction: column; gap: 14px; }
        .dash-top-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .dash-top-rank {
          font-size: 11px;
          color: var(--adm-muted2);
          letter-spacing: 0.06em;
          flex-shrink: 0;
          width: 20px;
        }
        .dash-top-info { flex: 1; min-width: 0; }
        .dash-top-name {
          font-size: 12px;
          color: var(--adm-text);
          margin-bottom: 5px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .dash-top-bar-wrap {
          height: 3px;
          background: var(--adm-border);
        }
        .dash-top-bar {
          height: 100%;
          transition: width 0.6s ease;
        }
        .dash-top-meta {
          text-align: right;
          flex-shrink: 0;
        }
        .dash-top-rev {
          display: block;
          font-size: 12px;
          color: var(--adm-text);
          font-weight: 500;
        }
        .dash-top-units {
          display: block;
          font-size: 10px;
          color: var(--adm-muted);
          letter-spacing: 0.04em;
        }

        /* Low stock */
        .dash-stock-card { border-color: rgba(224,92,92,0.2); }
        .dash-stock-list { display: flex; flex-direction: column; gap: 0; }
        .dash-stock-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid var(--adm-border);
          gap: 12px;
        }
        .dash-stock-item:last-child { border-bottom: none; padding-bottom: 0; }
        .dash-stock-info { flex: 1; min-width: 0; }
        .dash-stock-name {
          font-size: 12px;
          color: var(--adm-text);
          margin-bottom: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .dash-stock-sku { font-size: 10px; color: var(--adm-muted); letter-spacing: 0.04em; }
        .dash-stock-qty-wrap { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
        .dash-stock-qty { font-size: 12px; font-weight: 500; letter-spacing: 0.04em; }
        .dash-stock-edit {
          font-size: 11px;
          color: var(--adm-muted);
          text-decoration: none;
          border: 1px solid var(--adm-border);
          padding: 2px 8px;
          transition: all 0.15s;
        }
        .dash-stock-edit:hover { color: var(--adm-text); border-color: var(--adm-border2); }

        /* Quick actions */
        .dash-quick-actions {}
        .dash-quick-label {
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--adm-muted);
          margin-bottom: 10px;
        }
        .dash-quick-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 8px;
        }
        .dash-quick-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 16px 12px;
          background: var(--adm-surface);
          border: 1px solid var(--adm-border);
          text-decoration: none;
          transition: all 0.18s;
          cursor: pointer;
        }
        .dash-quick-card:hover {
          border-color: var(--adm-gold);
          background: var(--adm-gold-dim);
        }
        .dash-quick-icon {
          font-size: 18px;
          color: var(--adm-gold);
          line-height: 1;
        }
        .dash-quick-text {
          font-size: 11px;
          letter-spacing: 0.06em;
          color: var(--adm-muted);
          text-align: center;
          line-height: 1.4;
        }
        .dash-quick-card:hover .dash-quick-text { color: var(--adm-text); }

        /* ── Responsive ── */
        @media (max-width: 1200px) {
          .dash-stats-grid { grid-template-columns: repeat(2, 1fr); }
          .dash-mid-grid { grid-template-columns: 1fr; }
          .dash-quick-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 640px) {
          .dash-stats-grid { grid-template-columns: 1fr 1fr; }
          .dash-quick-grid { grid-template-columns: repeat(2, 1fr); }
          .dash-header { flex-direction: column; }
        }
      `}</style>
    </div>
  );
}