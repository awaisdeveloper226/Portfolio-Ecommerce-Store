"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────
type LoyaltyTier = "Bronze" | "Silver" | "Gold" | "Platinum";

type Customer = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  phone?: string;
  loyaltyPoints: number;
  loyaltyTier: LoyaltyTier;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  joinedAt: string;
  country: string;
  emailVerified: boolean;
  status: "active" | "inactive" | "blocked";
  tags: string[];
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_CUSTOMERS: Customer[] = [
  {
    id: "usr_001",
    firstName: "Sophie",
    lastName: "Beaumont",
    email: "sophie@example.com",
    avatar: "SB",
    phone: "+44 7700 900123",
    loyaltyPoints: 1240,
    loyaltyTier: "Gold",
    totalOrders: 8,
    totalSpent: 2480,
    lastOrderDate: "2025-04-08T14:22:00Z",
    joinedAt: "2023-03-15T09:00:00Z",
    country: "United Kingdom",
    emailVerified: true,
    status: "active",
    tags: ["VIP", "Repeat Buyer"],
  },
  {
    id: "usr_002",
    firstName: "Amara",
    lastName: "Konte",
    email: "amara.k@example.com",
    avatar: "AK",
    loyaltyPoints: 320,
    loyaltyTier: "Silver",
    totalOrders: 3,
    totalSpent: 960,
    lastOrderDate: "2025-04-08T11:32:00Z",
    joinedAt: "2024-01-20T10:00:00Z",
    country: "France",
    emailVerified: true,
    status: "active",
    tags: [],
  },
  {
    id: "usr_003",
    firstName: "Léa",
    lastName: "Marchand",
    email: "lea.m@example.com",
    avatar: "LM",
    phone: "+33 6 12 34 56 78",
    loyaltyPoints: 755,
    loyaltyTier: "Gold",
    totalOrders: 5,
    totalSpent: 2310,
    lastOrderDate: "2025-04-07T18:48:00Z",
    joinedAt: "2023-08-12T08:00:00Z",
    country: "Germany",
    emailVerified: true,
    status: "active",
    tags: ["Repeat Buyer"],
  },
  {
    id: "usr_004",
    firstName: "Yuki",
    lastName: "Tanaka",
    email: "yuki.t@example.com",
    avatar: "YT",
    loyaltyPoints: 95,
    loyaltyTier: "Bronze",
    totalOrders: 1,
    totalSpent: 95,
    lastOrderDate: "2025-04-07T15:15:00Z",
    joinedAt: "2025-04-06T12:00:00Z",
    country: "Japan",
    emailVerified: false,
    status: "active",
    tags: ["New"],
  },
  {
    id: "usr_005",
    firstName: "Clara",
    lastName: "Okonkwo",
    email: "clara.o@example.com",
    avatar: "CO",
    loyaltyPoints: 370,
    loyaltyTier: "Silver",
    totalOrders: 4,
    totalSpent: 1280,
    lastOrderDate: "2025-04-06T10:20:00Z",
    joinedAt: "2023-11-05T09:00:00Z",
    country: "Nigeria",
    emailVerified: true,
    status: "active",
    tags: [],
  },
  {
    id: "usr_006",
    firstName: "Hana",
    lastName: "Müller",
    email: "hana.m@example.com",
    avatar: "HM",
    loyaltyPoints: 0,
    loyaltyTier: "Bronze",
    totalOrders: 2,
    totalSpent: 550,
    lastOrderDate: "2025-04-05T09:12:00Z",
    joinedAt: "2024-06-18T11:00:00Z",
    country: "Germany",
    emailVerified: true,
    status: "inactive",
    tags: [],
  },
  {
    id: "usr_007",
    firstName: "Priya",
    lastName: "Shah",
    email: "priya.s@example.com",
    avatar: "PS",
    loyaltyPoints: 640,
    loyaltyTier: "Gold",
    totalOrders: 6,
    totalSpent: 1920,
    lastOrderDate: "2025-04-04T16:44:00Z",
    joinedAt: "2023-05-22T14:00:00Z",
    country: "Australia",
    emailVerified: true,
    status: "active",
    tags: ["Repeat Buyer"],
  },
  {
    id: "usr_008",
    firstName: "Celine",
    lastName: "Dupont",
    email: "celine.d@example.com",
    avatar: "CD",
    phone: "+33 1 23 45 67 89",
    loyaltyPoints: 590,
    loyaltyTier: "Silver",
    totalOrders: 3,
    totalSpent: 590,
    lastOrderDate: "2025-04-08T17:01:00Z",
    joinedAt: "2024-02-10T10:00:00Z",
    country: "France",
    emailVerified: true,
    status: "active",
    tags: [],
  },
  {
    id: "usr_009",
    firstName: "Ingrid",
    lastName: "Larsson",
    email: "ingrid.l@example.com",
    avatar: "IL",
    loyaltyPoints: 1620,
    loyaltyTier: "Platinum",
    totalOrders: 12,
    totalSpent: 4980,
    lastOrderDate: "2025-04-06T08:55:00Z",
    joinedAt: "2022-09-01T09:00:00Z",
    country: "Sweden",
    emailVerified: true,
    status: "active",
    tags: ["VIP", "Repeat Buyer"],
  },
  {
    id: "usr_010",
    firstName: "Noa",
    lastName: "Ben-David",
    email: "noa.b@example.com",
    avatar: "NB",
    loyaltyPoints: 0,
    loyaltyTier: "Bronze",
    totalOrders: 1,
    totalSpent: 340,
    lastOrderDate: "2025-04-03T12:10:00Z",
    joinedAt: "2025-03-28T08:00:00Z",
    country: "Israel",
    emailVerified: true,
    status: "active",
    tags: ["New"],
  },
  {
    id: "usr_011",
    firstName: "Mei",
    lastName: "Chen",
    email: "mei.c@example.com",
    avatar: "MC",
    loyaltyPoints: 455,
    loyaltyTier: "Silver",
    totalOrders: 4,
    totalSpent: 1380,
    lastOrderDate: "2025-04-05T14:20:00Z",
    joinedAt: "2023-12-14T09:00:00Z",
    country: "Singapore",
    emailVerified: true,
    status: "active",
    tags: [],
  },
  {
    id: "usr_012",
    firstName: "Valentina",
    lastName: "Rossi",
    email: "v.rossi@example.com",
    avatar: "VR",
    loyaltyPoints: 0,
    loyaltyTier: "Bronze",
    totalOrders: 0,
    totalSpent: 0,
    lastOrderDate: "",
    joinedAt: "2025-04-08T20:05:00Z",
    country: "Italy",
    emailVerified: false,
    status: "active",
    tags: ["New"],
  },
];

// ─── Config ───────────────────────────────────────────────────────────────────
const TIER_CONFIG: Record<LoyaltyTier, { color: string; bg: string; dot: string }> = {
  Bronze:   { color: "#cd7f32", bg: "rgba(205,127,50,0.12)",  dot: "#cd7f32" },
  Silver:   { color: "#94a3b8", bg: "rgba(148,163,184,0.12)", dot: "#94a3b8" },
  Gold:     { color: "#c9a96e", bg: "rgba(201,169,110,0.12)", dot: "#c9a96e" },
  Platinum: { color: "#a78bfa", bg: "rgba(167,139,250,0.12)", dot: "#a78bfa" },
};

const STATUS_CONFIG: Record<string, { color: string; bg: string; dot: string }> = {
  active:   { color: "#4ade80", bg: "rgba(74,222,128,0.1)",  dot: "#4ade80" },
  inactive: { color: "#94a3b8", bg: "rgba(148,163,184,0.1)", dot: "#94a3b8" },
  blocked:  { color: "#f87171", bg: "rgba(248,113,113,0.1)", dot: "#f87171" },
};

type SortKey = "joinedAt" | "totalSpent" | "totalOrders" | "loyaltyPoints" | "lastName";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
}
function formatRevenue(n: number) {
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}k`;
  return `$${n}`;
}
function timeAgo(iso: string) {
  if (!iso) return "—";
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

// ─── Customer Detail Panel ─────────────────────────────────────────────────────
function CustomerPanel({ customer, onClose }: { customer: Customer; onClose: () => void }) {
  const tier = TIER_CONFIG[customer.loyaltyTier];
  const status = STATUS_CONFIG[customer.status];

  return (
    <aside className="adm-panel">
      <div className="adm-panel-header">
        <div className="adm-panel-header-top">
          <h3 className="adm-panel-title">Customer Profile</h3>
          <button className="adm-panel-close" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="adm-panel-identity">
          <div className="adm-panel-avatar">{customer.avatar}</div>
          <div>
            <p className="adm-panel-name">{customer.firstName} {customer.lastName}</p>
            <p className="adm-panel-email">{customer.email}</p>
            <div className="adm-panel-badges">
              <span className="adm-status-pill" style={{ color: status.color, background: status.bg }}>
                <span className="adm-status-dot" style={{ background: status.dot }} />
                {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
              </span>
              <span className="adm-tier-pill" style={{ color: tier.color, background: tier.bg }}>
                ✦ {customer.loyaltyTier}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="adm-panel-body">
        {/* Stats */}
        <div className="adm-panel-stats">
          {[
            { label: "Total Spent", value: formatRevenue(customer.totalSpent) },
            { label: "Orders",      value: customer.totalOrders },
            { label: "Points",      value: customer.loyaltyPoints.toLocaleString() },
          ].map((s) => (
            <div key={s.label} className="adm-panel-stat">
              <span className="adm-panel-stat-val">{s.value}</span>
              <span className="adm-panel-stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Details */}
        <div className="adm-panel-section">
          <p className="adm-panel-section-label">Details</p>
          <div className="adm-panel-rows">
            {[
              { label: "Country",       val: customer.country },
              { label: "Phone",         val: customer.phone ?? "—" },
              { label: "Joined",        val: formatDate(customer.joinedAt) },
              { label: "Last Order",    val: timeAgo(customer.lastOrderDate) },
              { label: "Email Status",  val: customer.emailVerified ? "Verified" : "Unverified",
                color: customer.emailVerified ? "#4ade80" : "#f87171" },
            ].map((row) => (
              <div key={row.label} className="adm-panel-row">
                <span className="adm-panel-row-label">{row.label}</span>
                <span className="adm-panel-row-val" style={row.color ? { color: row.color } : {}}>
                  {row.val}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Tags */}
        {customer.tags.length > 0 && (
          <div className="adm-panel-section">
            <p className="adm-panel-section-label">Tags</p>
            <div className="adm-panel-tags">
              {customer.tags.map((tag) => (
                <span key={tag} className="adm-panel-tag">{tag}</span>
              ))}
            </div>
          </div>
        )}

        {/* Loyalty progress */}
        <div className="adm-panel-section">
          <p className="adm-panel-section-label">Loyalty Progress</p>
          <div className="adm-panel-loyalty">
            <div className="adm-panel-loyalty-header">
              <span style={{ color: tier.color }}>✦ {customer.loyaltyTier}</span>
              <span className="adm-panel-loyalty-pts">{customer.loyaltyPoints.toLocaleString()} pts</span>
            </div>
            {customer.loyaltyTier !== "Platinum" && (() => {
              const nextThresholds: Record<string, number> = { Bronze: 500, Silver: 2000, Gold: 5000 };
              const next = nextThresholds[customer.loyaltyTier] ?? 5000;
              const pct = Math.min(100, Math.round((customer.loyaltyPoints / next) * 100));
              return (
                <>
                  <div className="adm-panel-loyalty-bar">
                    <div className="adm-panel-loyalty-fill" style={{ width: `${pct}%`, background: tier.color }} />
                  </div>
                  <p className="adm-panel-loyalty-sub">
                    {next - customer.loyaltyPoints} pts to next tier
                  </p>
                </>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="adm-panel-footer">
        <Link href={`/admin/orders?customer=${customer.email}`} className="adm-panel-btn adm-panel-btn-primary">
          View Orders
        </Link>
        <button className="adm-panel-btn adm-panel-btn-ghost">Send Email</button>
        {customer.status === "active" ? (
          <button className="adm-panel-btn adm-panel-btn-danger">Block Customer</button>
        ) : (
          <button className="adm-panel-btn adm-panel-btn-ghost">Unblock</button>
        )}
      </div>
    </aside>
  );
}

// ─── Customer Row ─────────────────────────────────────────────────────────────
function CustomerRow({
  customer,
  onView,
}: {
  customer: Customer;
  onView: (c: Customer) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const tier = TIER_CONFIG[customer.loyaltyTier];
  const status = STATUS_CONFIG[customer.status];

  return (
    <tr className="adm-tr">
      {/* Customer */}
      <td className="adm-td adm-td-main">
        <div className="adm-customer-cell">
          <div className="adm-avatar">
            {customer.avatar}
            {!customer.emailVerified && <span className="adm-avatar-dot" />}
          </div>
          <div className="adm-customer-info">
            <button className="adm-customer-name" onClick={() => onView(customer)}>
              {customer.firstName} {customer.lastName}
            </button>
            <p className="adm-customer-email">{customer.email}</p>
          </div>
        </div>
      </td>

      {/* Status */}
      <td className="adm-td">
        <span className="adm-status-pill" style={{ color: status.color, background: status.bg }}>
          <span className="adm-status-dot" style={{ background: status.dot }} />
          {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
        </span>
      </td>

      {/* Loyalty Tier */}
      <td className="adm-td">
        <span className="adm-tier-pill" style={{ color: tier.color, background: tier.bg }}>
          ✦ {customer.loyaltyTier}
        </span>
      </td>

      {/* Orders */}
      <td className="adm-td adm-td-center">
        <span className="adm-num-badge">{customer.totalOrders}</span>
      </td>

      {/* Total Spent */}
      <td className="adm-td">
        <span className="adm-td-stat">{formatRevenue(customer.totalSpent)}</span>
      </td>

      {/* Loyalty Points */}
      <td className="adm-td">
        <span className="adm-td-stat">{customer.loyaltyPoints.toLocaleString()}</span>
      </td>

      {/* Last Order */}
      <td className="adm-td adm-td-muted adm-td-date">
        {timeAgo(customer.lastOrderDate)}
      </td>

      {/* Joined */}
      <td className="adm-td adm-td-muted adm-td-date">
        {formatDate(customer.joinedAt)}
      </td>

      {/* Actions */}
      <td className="adm-td adm-td-actions">
        <div className="adm-row-actions">
          <button className="adm-icon-btn" title="View profile" onClick={() => onView(customer)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
          <Link href={`/admin/orders?customer=${customer.email}`} className="adm-icon-btn" title="View orders">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </Link>
          <div className="adm-menu-wrap">
            <button className="adm-icon-btn" onClick={() => setMenuOpen(!menuOpen)} title="More">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="5" r="1" fill="currentColor" />
                <circle cx="12" cy="12" r="1" fill="currentColor" />
                <circle cx="12" cy="19" r="1" fill="currentColor" />
              </svg>
            </button>
            {menuOpen && (
              <>
                <div className="adm-menu-backdrop" onClick={() => setMenuOpen(false)} />
                <div className="adm-menu">
                  <button className="adm-menu-item" onClick={() => { onView(customer); setMenuOpen(false); }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    View Profile
                  </button>
                  <button className="adm-menu-item">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    Send Email
                  </button>
                  <button className="adm-menu-item">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    Adjust Points
                  </button>
                  <div className="adm-menu-divider" />
                  <button className="adm-menu-item adm-menu-item-danger">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="15" y1="9" x2="9" y2="15" />
                      <line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                    Block Customer
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminCustomersPage() {
  const [customers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive" | "blocked">("all");
  const [tierFilter, setTierFilter] = useState<"all" | LoyaltyTier>("all");
  const [sortBy, setSortBy] = useState<SortKey>("joinedAt");
  const [sortDir, setSortDir] = useState<"desc" | "asc">("desc");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const toggleSort = (col: SortKey) => {
    if (sortBy === col) setSortDir((d) => d === "desc" ? "asc" : "desc");
    else { setSortBy(col); setSortDir("desc"); }
  };

  const filtered = useMemo(() => {
    let data = customers.filter((c) => {
      const q = search.toLowerCase();
      const matchSearch = !q ||
        c.firstName.toLowerCase().includes(q) ||
        c.lastName.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || c.status === statusFilter;
      const matchTier = tierFilter === "all" || c.loyaltyTier === tierFilter;
      return matchSearch && matchStatus && matchTier;
    });
    return data.sort((a, b) => {
      const mult = sortDir === "desc" ? -1 : 1;
      if (sortBy === "joinedAt") return mult * (new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime());
      if (sortBy === "totalSpent") return mult * (a.totalSpent - b.totalSpent);
      if (sortBy === "totalOrders") return mult * (a.totalOrders - b.totalOrders);
      if (sortBy === "loyaltyPoints") return mult * (a.loyaltyPoints - b.loyaltyPoints);
      if (sortBy === "lastName") return mult * a.lastName.localeCompare(b.lastName);
      return 0;
    });
  }, [customers, search, statusFilter, tierFilter, sortBy, sortDir]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // Stats
  const totalRevenue = customers.reduce((s, c) => s + c.totalSpent, 0);
  const activeCount = customers.filter((c) => c.status === "active").length;
  const newThisMonth = customers.filter((c) => {
    const d = new Date(c.joinedAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;
  const vipCount = customers.filter((c) => ["Gold", "Platinum"].includes(c.loyaltyTier)).length;

  const SortIcon = ({ col }: { col: SortKey }) => (
    <svg
      width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
      style={{
        opacity: sortBy === col ? 1 : 0.28,
        transform: sortBy === col && sortDir === "asc" ? "rotate(180deg)" : "none",
        transition: "transform 0.2s",
        flexShrink: 0,
      }}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );

  return (
    <div className="adm-page">
      {/* ── Header ── */}
      <div className="adm-header">
        <div className="adm-header-left">
          <nav className="adm-breadcrumb">
            <Link href="/admin">Dashboard</Link>
            <span className="adm-bc-sep">›</span>
            <span>Customers</span>
          </nav>
          <h1 className="adm-page-title">Customers</h1>
          <p className="adm-page-sub">Manage accounts, loyalty tiers, and customer insights</p>
        </div>
        <div className="adm-header-right">
          <button className="adm-btn adm-btn-ghost">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="adm-stats-row">
        {[
          { label: "Total Customers", value: customers.length,          icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          ), accent: "#c9a96e" },
          { label: "Active",           value: activeCount,              icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <path d="M20 6L9 17l-5-5" />
            </svg>
          ), accent: "#4ade80" },
          { label: "Lifetime Revenue", value: `$${(totalRevenue/1000).toFixed(1)}k`, icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          ), accent: "#60a5fa" },
          { label: "Gold & Platinum",  value: vipCount,                 icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          ), accent: "#c9a96e" },
          { label: "New This Month",   value: newThisMonth,             icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
              <line x1="12" y1="11" x2="12" y2="15" />
              <line x1="10" y1="13" x2="14" y2="13" />
            </svg>
          ), accent: "#a78bfa" },
        ].map((s) => (
          <div key={s.label} className="adm-stat-card">
            <div className="adm-stat-icon" style={{ color: s.accent, background: `${s.accent}18` }}>
              {s.icon}
            </div>
            <div className="adm-stat-body">
              <div className="adm-stat-value">{s.value}</div>
              <div className="adm-stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div className="adm-toolbar">
        <div className="adm-toolbar-left">
          {/* Search */}
          <div className="adm-search-wrap">
            <svg className="adm-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              className="adm-search"
              placeholder="Search name, email, country…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
            {search && (
              <button className="adm-search-clear" onClick={() => { setSearch(""); setPage(1); }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Status filter */}
          <div className="adm-filter-pills">
            {([
              { key: "all",      label: `All (${customers.length})` },
              { key: "active",   label: `Active (${customers.filter(c => c.status === "active").length})` },
              { key: "inactive", label: `Inactive (${customers.filter(c => c.status === "inactive").length})` },
              { key: "blocked",  label: `Blocked (${customers.filter(c => c.status === "blocked").length})` },
            ] as const).map((f) => (
              <button
                key={f.key}
                className={`adm-filter-pill ${statusFilter === f.key ? "adm-filter-pill-active" : ""}`}
                onClick={() => { setStatusFilter(f.key); setPage(1); }}
              >
                {f.key !== "all" && (
                  <span className="adm-filter-dot" style={{ background: STATUS_CONFIG[f.key]?.dot }} />
                )}
                {f.label}
              </button>
            ))}
          </div>

          {/* Tier filter */}
          <div className="adm-tier-filter">
            <select
              className="adm-tier-select"
              value={tierFilter}
              onChange={(e) => { setTierFilter(e.target.value as typeof tierFilter); setPage(1); }}
            >
              <option value="all">All Tiers</option>
              {(["Bronze", "Silver", "Gold", "Platinum"] as LoyaltyTier[]).map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <svg className="adm-tier-chevron" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
        </div>

        <div className="adm-toolbar-right">
          <span className="adm-result-count">{filtered.length} customer{filtered.length !== 1 ? "s" : ""}</span>
        </div>
      </div>

      {/* ── Main layout: table + panel ── */}
      <div className={`adm-main-layout ${selectedCustomer ? "adm-main-layout-split" : ""}`}>
        {/* Table */}
        <div className="adm-table-container">
          <div className="adm-table-wrap">
            {paginated.length === 0 ? (
              <div className="adm-empty">
                <div className="adm-empty-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.9">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <p className="adm-empty-title">No customers found</p>
                <p className="adm-empty-sub">
                  {search ? `No results for "${search}"` : "Customers will appear here once they register."}
                </p>
              </div>
            ) : (
              <table className="adm-table">
                <thead>
                  <tr className="adm-thead-tr">
                    <th className="adm-th adm-th-main">Customer</th>
                    <th className="adm-th">Status</th>
                    <th className="adm-th">Loyalty</th>
                    <th className="adm-th adm-th-sortable adm-th-center" onClick={() => toggleSort("totalOrders")}>
                      Orders <SortIcon col="totalOrders" />
                    </th>
                    <th className="adm-th adm-th-sortable" onClick={() => toggleSort("totalSpent")}>
                      Spent <SortIcon col="totalSpent" />
                    </th>
                    <th className="adm-th adm-th-sortable" onClick={() => toggleSort("loyaltyPoints")}>
                      Points <SortIcon col="loyaltyPoints" />
                    </th>
                    <th className="adm-th adm-th-sortable" onClick={() => toggleSort("joinedAt")}>
                      Last Order <SortIcon col="joinedAt" />
                    </th>
                    <th className="adm-th adm-th-sortable" onClick={() => toggleSort("joinedAt")}>
                      Joined <SortIcon col="joinedAt" />
                    </th>
                    <th className="adm-th adm-th-actions" />
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((c) => (
                    <CustomerRow
                      key={c.id}
                      customer={c}
                      onView={setSelectedCustomer}
                    />
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="adm-pagination">
              <span className="adm-page-info">
                Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
              </span>
              <div className="adm-page-btns">
                <button className="adm-page-btn" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                  ← Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .reduce<(number | "…")[]>((acc, p, i, arr) => {
                    if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("…");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) =>
                    p === "…" ? (
                      <span key={`ellipsis-${i}`} className="adm-page-ellipsis">…</span>
                    ) : (
                      <button
                        key={p}
                        className={`adm-page-btn adm-page-num ${page === p ? "adm-page-active" : ""}`}
                        onClick={() => setPage(p as number)}
                      >
                        {p}
                      </button>
                    )
                  )}
                <button className="adm-page-btn" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Customer panel */}
        {selectedCustomer && (
          <CustomerPanel
            customer={selectedCustomer}
            onClose={() => setSelectedCustomer(null)}
          />
        )}
      </div>

      <style>{`
        /* ── Admin Dark System ── */
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
          gap: 20px;
        }

        /* ── Header ── */
        .adm-header {
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
        .adm-breadcrumb a { color: rgba(255,255,255,0.45); transition: color 0.2s; text-decoration: none; }
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
        .adm-header-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }

        /* ── Buttons ── */
        .adm-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 18px;
          font-size: 12px;
          letter-spacing: 0.06em;
          font-family: inherit;
          cursor: pointer;
          border: none;
          transition: all 0.18s;
          white-space: nowrap;
        }
        .adm-btn-primary { background: #c9a96e; color: #0f0f0f; font-weight: 500; }
        .adm-btn-primary:hover { background: #d4b87e; }
        .adm-btn-ghost {
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.65);
          border: 1px solid rgba(255,255,255,0.1);
        }
        .adm-btn-ghost:hover { background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.9); }
        .adm-btn-danger {
          background: rgba(239,68,68,0.15);
          color: #f87171;
          border: 1px solid rgba(239,68,68,0.2);
        }
        .adm-btn-danger:hover { background: rgba(239,68,68,0.25); }

        /* ── Stats ── */
        .adm-stats-row {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 12px;
        }
        .adm-stat-card {
          background: #171717;
          border: 1px solid rgba(255,255,255,0.07);
          padding: 16px 18px;
          display: flex;
          align-items: center;
          gap: 14px;
          transition: border-color 0.2s;
        }
        .adm-stat-card:hover { border-color: rgba(255,255,255,0.13); }
        .adm-stat-icon {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          flex-shrink: 0;
        }
        .adm-stat-value {
          font-size: 22px;
          font-weight: 500;
          color: rgba(255,255,255,0.92);
          line-height: 1;
          margin-bottom: 3px;
          font-family: "Playfair Display", serif;
        }
        .adm-stat-label {
          font-size: 11px;
          color: rgba(255,255,255,0.38);
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        /* ── Toolbar ── */
        .adm-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          flex-wrap: wrap;
        }
        .adm-toolbar-left { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .adm-search-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }
        .adm-search-icon {
          position: absolute;
          left: 12px;
          color: rgba(255,255,255,0.3);
          pointer-events: none;
        }
        .adm-search {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.88);
          padding: 9px 36px 9px 34px;
          font-size: 13px;
          font-family: inherit;
          outline: none;
          width: 240px;
          transition: border-color 0.2s, background 0.2s;
        }
        .adm-search:focus { border-color: rgba(255,255,255,0.25); background: rgba(255,255,255,0.07); }
        .adm-search::placeholder { color: rgba(255,255,255,0.25); }
        .adm-search-clear {
          position: absolute;
          right: 10px;
          color: rgba(255,255,255,0.3);
          display: flex;
          align-items: center;
          background: none;
          border: none;
          cursor: pointer;
          transition: color 0.2s;
        }
        .adm-search-clear:hover { color: rgba(255,255,255,0.7); }

        .adm-filter-pills { display: flex; gap: 4px; flex-wrap: wrap; }
        .adm-filter-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 6px 11px;
          font-size: 11px;
          letter-spacing: 0.05em;
          color: rgba(255,255,255,0.45);
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          cursor: pointer;
          transition: all 0.15s;
          font-family: inherit;
          white-space: nowrap;
        }
        .adm-filter-pill:hover { color: rgba(255,255,255,0.75); border-color: rgba(255,255,255,0.15); }
        .adm-filter-pill-active {
          color: rgba(255,255,255,0.92) !important;
          background: rgba(255,255,255,0.1) !important;
          border-color: rgba(255,255,255,0.2) !important;
        }
        .adm-filter-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }

        .adm-tier-filter { position: relative; }
        .adm-tier-select {
          appearance: none;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.65);
          padding: 8px 28px 8px 12px;
          font-size: 12px;
          font-family: inherit;
          outline: none;
          cursor: pointer;
          transition: border-color 0.2s;
        }
        .adm-tier-select:focus { border-color: rgba(255,255,255,0.25); }
        .adm-tier-chevron {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: rgba(255,255,255,0.3);
        }

        .adm-result-count { font-size: 12px; color: rgba(255,255,255,0.3); white-space: nowrap; }
        .adm-toolbar-right { flex-shrink: 0; }

        /* ── Main Layout ── */
        .adm-main-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          align-items: start;
        }
        .adm-main-layout-split {
          grid-template-columns: 1fr 300px;
        }
        .adm-table-container { min-width: 0; }

        /* ── Table ── */
        .adm-table-wrap {
          background: #141414;
          border: 1px solid rgba(255,255,255,0.07);
          overflow-x: auto;
        }
        .adm-table { width: 100%; border-collapse: collapse; }
        .adm-thead-tr { border-bottom: 1px solid rgba(255,255,255,0.08); }
        .adm-th {
          padding: 12px 16px;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          font-weight: 400;
          text-align: left;
          white-space: nowrap;
          background: rgba(255,255,255,0.02);
          user-select: none;
        }
        .adm-th-sortable { cursor: pointer; display: table-cell; }
        .adm-th-sortable:hover { color: rgba(255,255,255,0.6); }
        .adm-th-center { text-align: center; }
        .adm-th-actions { width: 110px; }
        .adm-th-main { min-width: 220px; }

        .adm-tr {
          border-bottom: 1px solid rgba(255,255,255,0.05);
          transition: background 0.15s;
        }
        .adm-tr:last-child { border-bottom: none; }
        .adm-tr:hover { background: rgba(255,255,255,0.03); }
        .adm-td {
          padding: 12px 16px;
          vertical-align: middle;
          font-size: 13px;
          color: rgba(255,255,255,0.7);
        }
        .adm-td-main { padding: 10px 16px; }
        .adm-td-muted { color: rgba(255,255,255,0.38); }
        .adm-td-center { text-align: center; }
        .adm-td-date { white-space: nowrap; font-size: 12px; }
        .adm-td-stat { font-size: 13px; color: rgba(255,255,255,0.65); }
        .adm-td-actions { text-align: right; }

        /* Customer cell */
        .adm-customer-cell { display: flex; align-items: center; gap: 10px; }
        .adm-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(201,169,110,0.15);
          border: 1px solid rgba(201,169,110,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 500;
          color: #c9a96e;
          letter-spacing: 0.04em;
          flex-shrink: 0;
          position: relative;
        }
        .adm-avatar-dot {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #f87171;
          border: 1.5px solid #0f0f0f;
        }
        .adm-customer-name {
          font-size: 13px;
          font-weight: 500;
          color: rgba(255,255,255,0.88);
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
          font-family: inherit;
          transition: color 0.2s;
          display: block;
          margin-bottom: 2px;
          text-align: left;
        }
        .adm-customer-name:hover { color: #c9a96e; }
        .adm-customer-email { font-size: 11px; color: rgba(255,255,255,0.3); }

        /* Badges */
        .adm-status-pill, .adm-tier-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          letter-spacing: 0.06em;
          padding: 4px 10px;
          white-space: nowrap;
        }
        .adm-status-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
        .adm-num-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 28px;
          height: 22px;
          padding: 0 6px;
          background: rgba(255,255,255,0.07);
          font-size: 12px;
          color: rgba(255,255,255,0.6);
        }

        /* Row actions */
        .adm-row-actions { display: flex; align-items: center; gap: 4px; justify-content: flex-end; }
        .adm-icon-btn {
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255,255,255,0.3);
          background: none;
          border: none;
          cursor: pointer;
          transition: all 0.15s;
          text-decoration: none;
        }
        .adm-icon-btn:hover { color: rgba(255,255,255,0.8); background: rgba(255,255,255,0.07); }

        /* Dropdown */
        .adm-menu-wrap { position: relative; }
        .adm-menu-backdrop { position: fixed; inset: 0; z-index: 50; }
        .adm-menu {
          position: absolute;
          right: 0;
          top: calc(100% + 4px);
          background: #1e1e1e;
          border: 1px solid rgba(255,255,255,0.12);
          min-width: 180px;
          z-index: 51;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
          animation: adm-menu-in 0.15s ease both;
        }
        @keyframes adm-menu-in {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .adm-menu-item {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 9px 14px;
          font-size: 12px;
          color: rgba(255,255,255,0.6);
          background: none;
          border: none;
          width: 100%;
          text-align: left;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.15s;
        }
        .adm-menu-item:hover { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.9); }
        .adm-menu-item-danger { color: #f87171; }
        .adm-menu-item-danger:hover { background: rgba(239,68,68,0.1); color: #fca5a5; }
        .adm-menu-divider { height: 1px; background: rgba(255,255,255,0.07); margin: 4px 0; }

        /* ── Empty ── */
        .adm-empty {
          padding: 80px 40px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .adm-empty-icon { color: rgba(255,255,255,0.18); margin-bottom: 8px; }
        .adm-empty-title { font-size: 16px; color: rgba(255,255,255,0.55); font-weight: 400; }
        .adm-empty-sub { font-size: 13px; color: rgba(255,255,255,0.28); }

        /* ── Pagination ── */
        .adm-pagination {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          border-top: 1px solid rgba(255,255,255,0.07);
          background: #141414;
          gap: 16px;
          flex-wrap: wrap;
        }
        .adm-page-info { font-size: 12px; color: rgba(255,255,255,0.3); }
        .adm-page-btns { display: flex; align-items: center; gap: 4px; }
        .adm-page-btn {
          padding: 6px 12px;
          font-size: 12px;
          border: 1px solid rgba(255,255,255,0.1);
          background: transparent;
          color: rgba(255,255,255,0.45);
          cursor: pointer;
          font-family: inherit;
          transition: all 0.15s;
        }
        .adm-page-btn:hover:not(:disabled) { border-color: rgba(255,255,255,0.2); color: rgba(255,255,255,0.8); }
        .adm-page-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        .adm-page-num { width: 34px; padding: 6px 0; text-align: center; }
        .adm-page-active { background: rgba(201,169,110,0.12) !important; border-color: rgba(201,169,110,0.3) !important; color: #c9a96e !important; }
        .adm-page-ellipsis { padding: 6px 6px; font-size: 12px; color: rgba(255,255,255,0.2); }

        /* ── Customer Panel ── */
        .adm-panel {
          background: #141414;
          border: 1px solid rgba(255,255,255,0.07);
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 80px;
          max-height: calc(100vh - 120px);
          overflow-y: auto;
          animation: adm-panel-in 0.25s ease both;
        }
        @keyframes adm-panel-in {
          from { opacity: 0; transform: translateX(16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .adm-panel-header {
          border-bottom: 1px solid rgba(255,255,255,0.07);
          padding: 20px;
          background: rgba(255,255,255,0.02);
          flex-shrink: 0;
        }
        .adm-panel-header-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        .adm-panel-title {
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
        }
        .adm-panel-close {
          width: 26px;
          height: 26px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255,255,255,0.3);
          background: none;
          border: none;
          cursor: pointer;
          transition: color 0.2s;
        }
        .adm-panel-close:hover { color: rgba(255,255,255,0.8); }
        .adm-panel-identity { display: flex; align-items: flex-start; gap: 12px; }
        .adm-panel-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(201,169,110,0.15);
          border: 1px solid rgba(201,169,110,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 500;
          color: #c9a96e;
          flex-shrink: 0;
        }
        .adm-panel-name {
          font-size: 15px;
          font-weight: 500;
          color: rgba(255,255,255,0.9);
          margin-bottom: 3px;
        }
        .adm-panel-email {
          font-size: 11px;
          color: rgba(255,255,255,0.3);
          margin-bottom: 8px;
        }
        .adm-panel-badges { display: flex; gap: 6px; flex-wrap: wrap; }

        .adm-panel-body {
          padding: 16px 20px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          flex: 1;
        }

        /* Stats row in panel */
        .adm-panel-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.07);
        }
        .adm-panel-stat {
          background: #1a1a1a;
          padding: 14px 10px;
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .adm-panel-stat-val {
          font-family: "Playfair Display", serif;
          font-size: 18px;
          font-weight: 400;
          color: rgba(255,255,255,0.88);
          line-height: 1;
        }
        .adm-panel-stat-label {
          font-size: 9px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
        }

        .adm-panel-section { display: flex; flex-direction: column; gap: 8px; }
        .adm-panel-section-label {
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.28);
          margin-bottom: 2px;
        }
        .adm-panel-rows { display: flex; flex-direction: column; gap: 0; border: 1px solid rgba(255,255,255,0.07); }
        .adm-panel-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 9px 12px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          font-size: 12px;
        }
        .adm-panel-row:last-child { border-bottom: none; }
        .adm-panel-row-label { color: rgba(255,255,255,0.38); }
        .adm-panel-row-val { color: rgba(255,255,255,0.75); font-weight: 400; }

        .adm-panel-tags { display: flex; gap: 6px; flex-wrap: wrap; }
        .adm-panel-tag {
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #c9a96e;
          background: rgba(201,169,110,0.1);
          border: 1px solid rgba(201,169,110,0.2);
          padding: 3px 8px;
        }

        .adm-panel-loyalty {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          padding: 12px 14px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .adm-panel-loyalty-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
        }
        .adm-panel-loyalty-pts { color: rgba(255,255,255,0.55); font-size: 11px; }
        .adm-panel-loyalty-bar {
          height: 3px;
          background: rgba(255,255,255,0.08);
        }
        .adm-panel-loyalty-fill {
          height: 100%;
          transition: width 0.6s ease;
        }
        .adm-panel-loyalty-sub {
          font-size: 11px;
          color: rgba(255,255,255,0.28);
          letter-spacing: 0.04em;
        }

        /* Panel footer */
        .adm-panel-footer {
          padding: 14px 20px;
          border-top: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.02);
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex-shrink: 0;
        }
        .adm-panel-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 9px 14px;
          font-size: 11px;
          letter-spacing: 0.08em;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.18s;
          white-space: nowrap;
          text-decoration: none;
          text-transform: uppercase;
          border: none;
        }
        .adm-panel-btn-primary { background: #c9a96e; color: #0f0f0f; font-weight: 500; }
        .adm-panel-btn-primary:hover { background: #d4b87e; }
        .adm-panel-btn-ghost {
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.65);
          border: 1px solid rgba(255,255,255,0.1);
        }
        .adm-panel-btn-ghost:hover { background: rgba(255,255,255,0.1); }
        .adm-panel-btn-danger {
          background: rgba(239,68,68,0.12);
          color: #f87171;
          border: 1px solid rgba(239,68,68,0.2);
        }
        .adm-panel-btn-danger:hover { background: rgba(239,68,68,0.2); }

        /* ── Responsive ── */
        @media (max-width: 1400px) {
          .adm-stats-row { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 1100px) {
          .adm-page { padding: 20px; }
          .adm-main-layout-split { grid-template-columns: 1fr; }
          .adm-panel { position: static; max-height: none; }
          .adm-stats-row { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 768px) {
          .adm-header { flex-direction: column; }
          .adm-search { width: 100%; }
          .adm-toolbar { flex-direction: column; align-items: flex-start; }
          .adm-stats-row { grid-template-columns: repeat(2, 1fr); }
          .adm-table th:nth-child(n+6),
          .adm-table td:nth-child(n+6) { display: none; }
        }
      `}</style>
    </div>
  );
}