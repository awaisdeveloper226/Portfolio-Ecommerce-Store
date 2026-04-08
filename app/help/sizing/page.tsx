"use client";

import { useState } from "react";
import Link from "next/link";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ─── Types ────────────────────────────────────────────────────────────────────
type Unit = "cm" | "in";
type Category = "tops" | "dresses" | "trousers" | "outerwear" | "knitwear";

// ─── Size Data ────────────────────────────────────────────────────────────────
const SIZE_LABELS = ["XS", "S", "M", "L", "XL", "XXL"];

const MEASUREMENTS: Record<
  Category,
  {
    rows: { label: string; cm: number[]; in: number[] }[];
    note?: string;
  }
> = {
  tops: {
    rows: [
      { label: "Bust",        cm: [80, 84, 88, 94, 100, 106], in: [31.5, 33, 34.5, 37, 39.5, 41.5] },
      { label: "Waist",       cm: [62, 66, 70, 76,  82,  88], in: [24.5, 26, 27.5, 30, 32.5, 34.5] },
      { label: "Hip",         cm: [88, 92, 96, 102,108, 114], in: [34.5, 36, 38,   40, 42.5, 45]   },
      { label: "Shoulder",    cm: [36, 37, 38, 39.5,41, 42.5],in: [14.2, 14.6,15,15.5,16.1,16.7]  },
      { label: "Sleeve",      cm: [60, 61, 62, 63,  64,  65], in: [23.6, 24, 24.4,24.8,25.2,25.6] },
    ],
    note: "Measurements refer to body measurements, not garment measurements. Our tops are designed with 2–4 cm ease.",
  },
  dresses: {
    rows: [
      { label: "Bust",        cm: [80, 84, 88, 94, 100, 106], in: [31.5, 33, 34.5, 37, 39.5, 41.5] },
      { label: "Waist",       cm: [62, 66, 70, 76,  82,  88], in: [24.5, 26, 27.5, 30, 32.5, 34.5] },
      { label: "Hip",         cm: [88, 92, 96, 102,108, 114], in: [34.5, 36, 38,   40, 42.5, 45]   },
      { label: "Length",      cm: [133,134,135,136, 137, 138],in: [52.4,52.8,53.1,53.5,53.9,54.3] },
    ],
    note: "Dress lengths are measured from the highest point of the shoulder. Midi lengths land below the knee.",
  },
  trousers: {
    rows: [
      { label: "Waist",       cm: [62, 66, 70, 76,  82,  88], in: [24.5, 26, 27.5, 30, 32.5, 34.5] },
      { label: "Hip",         cm: [88, 92, 96, 102,108, 114], in: [34.5, 36, 38,   40, 42.5, 45]   },
      { label: "Inseam",      cm: [74, 75, 76, 77,  78,  79], in: [29.1,29.5, 30,  30.3,30.7,31.1] },
      { label: "Rise",        cm: [24, 25, 26, 27,  28,  29], in: [9.4,  9.8, 10.2,10.6,11,  11.4] },
      { label: "Thigh",       cm: [54, 56, 59, 63,  67,  71], in: [21.3,22.1,23.2,24.8,26.4,28]   },
    ],
    note: "Wide-leg styles carry 6–8 cm ease at the thigh. Tapered styles carry 3–4 cm ease.",
  },
  outerwear: {
    rows: [
      { label: "Bust",        cm: [84, 88, 92, 98, 104, 110], in: [33,  34.5, 36.2,38.6,40.9,43.3] },
      { label: "Shoulder",    cm: [37, 38, 39, 40.5,42, 43.5],in: [14.6,15,  15.4,15.9,16.5,17.1] },
      { label: "Sleeve",      cm: [61, 62, 63, 64,  65,  66], in: [24,  24.4,24.8,25.2,25.6, 26]  },
      { label: "Length",      cm: [88, 89, 90, 91,  92,  93], in: [34.6,35,  35.4,35.8,36.2,36.6] },
    ],
    note: "Outerwear is sized to layer over knitwear. Structured pieces carry 4–6 cm ease at the bust.",
  },
  knitwear: {
    rows: [
      { label: "Bust",        cm: [82, 86, 90, 96, 102, 108], in: [32.3,33.9,35.4,37.8,40.2,42.5] },
      { label: "Waist",       cm: [68, 72, 76, 82,  88,  94], in: [26.8,28.3,29.9,32.3,34.6,37]   },
      { label: "Shoulder",    cm: [36, 37, 38, 39.5,41, 42.5],in: [14.2,14.6, 15, 15.5,16.1,16.7] },
      { label: "Sleeve",      cm: [61, 62, 63, 64,  65,  66], in: [24,  24.4,24.8,25.2,25.6, 26]  },
      { label: "Length",      cm: [60, 61, 62, 63,  64,  65], in: [23.6, 24, 24.4,24.8,25.2,25.6] },
    ],
    note: "Knitwear is designed for a relaxed fit. Natural fibres may stretch 2–3% with wear.",
  },
};

const CATEGORY_LABELS: Record<Category, string> = {
  tops:      "Tops & Blouses",
  dresses:   "Dresses & Skirts",
  trousers:  "Trousers & Shorts",
  outerwear: "Outerwear",
  knitwear:  "Knitwear",
};

// ─── Measurement guide data ───────────────────────────────────────────────────
const HOW_TO_MEASURE = [
  {
    key:  "bust",
    icon: "◎",
    title: "Bust",
    body:  "Measure around the fullest part of your chest, keeping the tape parallel to the floor. Wear a well-fitted bra.",
  },
  {
    key:  "waist",
    icon: "○",
    title: "Waist",
    body:  "Measure around your natural waistline — the narrowest point of your torso, usually just above the navel.",
  },
  {
    key:  "hip",
    icon: "◇",
    title: "Hip",
    body:  "Stand with feet together. Measure around the fullest part of your hips and seat, about 20 cm below your waist.",
  },
  {
    key:  "inseam",
    icon: "△",
    title: "Inseam",
    body:  "Measure from your crotch to the bottom of your ankle along the inner leg. Best done with a friend.",
  },
  {
    key:  "shoulder",
    icon: "□",
    title: "Shoulder",
    body:  "Measure from the edge of one shoulder to the other across your upper back, following the natural shoulder line.",
  },
  {
    key:  "sleeve",
    icon: "◈",
    title: "Sleeve",
    body:  "With arm slightly bent, measure from the shoulder point to the wrist bone.",
  },
];

// ─── International size conversion ───────────────────────────────────────────
const INT_SIZES = [
  { label: "Maison Elara", values: ["XS", "S", "M", "L", "XL", "XXL"] },
  { label: "UK",           values: ["6",  "8", "10","12","14","16"]    },
  { label: "US",           values: ["2",  "4", "6", "8", "10","12"]    },
  { label: "EU",           values: ["34", "36","38","40","42","44"]     },
  { label: "IT",           values: ["38", "40","42","44","46","48"]     },
  { label: "FR",           values: ["36", "38","40","42","44","46"]     },
  { label: "AU",           values: ["6",  "8", "10","12","14","16"]    },
  { label: "JP",           values: ["5",  "7", "9", "11","13","15"]    },
];

// ─── Fit Calculator ───────────────────────────────────────────────────────────
function FitCalculator({ unit }: { unit: Unit }) {
  const [bust,  setBust]  = useState("");
  const [waist, setWaist] = useState("");
  const [hip,   setHip]   = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [note,   setNote]   = useState<string | null>(null);

  const calculate = () => {
    const b = parseFloat(bust);
    const w = parseFloat(waist);
    const h = parseFloat(hip);
    if (!b && !w && !h) { setResult(null); setNote(null); return; }

    // Convert to cm for comparison
    const bc = unit === "in" ? b * 2.54 : b;
    const wc = unit === "in" ? w * 2.54 : w;
    const hc = unit === "in" ? h * 2.54 : h;

    const bustSizes  = MEASUREMENTS.tops.rows[0].cm;    // [80,84,88,94,100,106]
    const waistSizes = MEASUREMENTS.tops.rows[1].cm;    // [62,66,70,76,82,88]
    const hipSizes   = MEASUREMENTS.trousers.rows[1].cm;// [88,92,96,102,108,114]

    const idx = (val: number, arr: number[]) => {
      for (let i = 0; i < arr.length; i++) if (val <= arr[i]) return i;
      return arr.length - 1;
    };

    const scores = [
      bc ? idx(bc, bustSizes)  : null,
      wc ? idx(wc, waistSizes) : null,
      hc ? idx(hc, hipSizes)   : null,
    ].filter((x): x is number => x !== null);

    if (scores.length === 0) { setResult(null); setNote(null); return; }

    const maxIdx = Math.max(...scores);
    const minIdx = Math.min(...scores);
    const recommended = SIZE_LABELS[maxIdx];

    if (maxIdx !== minIdx) {
      setNote(`Your measurements span ${SIZE_LABELS[minIdx]}–${SIZE_LABELS[maxIdx]}. We recommend sizing up for the best fit across all garments.`);
    } else {
      setNote(null);
    }
    setResult(recommended);
  };

  const label = unit === "cm" ? "cm" : "in";

  return (
    <div className="sz-calc">
      <div className="sz-calc-header">
        <div className="sz-calc-ornament">✦</div>
        <h3 className="sz-calc-title">Find Your Size</h3>
        <p className="sz-calc-sub">
          Enter your measurements and we&apos;ll suggest your best fit.
        </p>
      </div>

      <div className="sz-calc-fields">
        {[
          { label: `Bust (${label})`,  val: bust,  set: setBust  },
          { label: `Waist (${label})`, val: waist, set: setWaist },
          { label: `Hip (${label})`,   val: hip,   set: setHip   },
        ].map((f) => (
          <div key={f.label} className="sz-calc-field">
            <label className="sz-calc-label">{f.label}</label>
            <input
              type="number"
              className="sz-calc-input"
              placeholder={unit === "cm" ? "e.g. 86" : "e.g. 34"}
              value={f.val}
              onChange={(e) => f.set(e.target.value)}
              min={0}
            />
          </div>
        ))}
      </div>

      <button className="sz-calc-btn" onClick={calculate}>
        Calculate My Size
      </button>

      {result && (
        <div className="sz-calc-result">
          <div className="sz-calc-result-inner">
            <p className="sz-calc-result-label">Recommended Size</p>
            <p className="sz-calc-result-size">{result}</p>
          </div>
          {note && <p className="sz-calc-result-note">{note}</p>}
        </div>
      )}
    </div>
  );
}

// ─── Size Table ───────────────────────────────────────────────────────────────
function SizeTable({ category, unit }: { category: Category; unit: Unit }) {
  const data = MEASUREMENTS[category];
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="sz-table-wrap">
      <div className="sz-table-scroll">
        <table className="sz-table">
          <thead>
            <tr>
              <th className="sz-th sz-th-measure">Measurement</th>
              {SIZE_LABELS.map((s, i) => (
                <th
                  key={s}
                  className={`sz-th sz-th-size ${hovered === i ? "sz-col-hover" : ""}`}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {s}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, ri) => (
              <tr key={row.label} className={ri % 2 === 0 ? "sz-tr-even" : "sz-tr-odd"}>
                <td className="sz-td sz-td-label">{row.label}</td>
                {(unit === "cm" ? row.cm : row.in).map((val, ci) => (
                  <td
                    key={ci}
                    className={`sz-td sz-td-val ${hovered === ci ? "sz-col-hover" : ""}`}
                    onMouseEnter={() => setHovered(ci)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    {val}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.note && (
        <p className="sz-table-note">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {data.note}
        </p>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SizingPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("tops");
  const [unit, setUnit] = useState<Unit>("cm");

  return (
    <>
      <AnnouncementBar />
      <Navbar />

      <main className="sz-page">

        {/* ── Hero ── */}
        <section className="sz-hero">
          <div className="sz-hero-bg" />

          {/* Decorative vertical lines */}
          <div className="sz-hero-lines" aria-hidden="true">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="sz-hero-line" style={{ animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>

          <div className="sz-hero-inner">
            <div className="sz-hero-text">
              <nav className="sz-breadcrumb">
                <Link href="/">Home</Link>
                <span className="sz-sep">·</span>
                <Link href="/help">Help</Link>
                <span className="sz-sep">·</span>
                <span>Size Guide</span>
              </nav>

              <span className="sz-eyebrow">Fit with Intention</span>
              <h1 className="sz-hero-title">
                Size <em>Guide.</em>
              </h1>
              <p className="sz-hero-lead">
                Every Maison Elara piece is cut to flatter the body as it
                naturally is. Our sizing is consistent across categories —
                measured against the body, not the garment.
              </p>

              <div className="sz-hero-pills">
                <div className="sz-hero-pill">
                  <span className="sz-pill-icon">✦</span>
                  Free returns if the fit isn&apos;t right
                </div>
                <div className="sz-hero-pill">
                  <span className="sz-pill-icon">◈</span>
                  Consistent sizing across all categories
                </div>
                <div className="sz-hero-pill">
                  <span className="sz-pill-icon">○</span>
                  Need help? Our stylists are here Mon–Fri
                </div>
              </div>
            </div>

            {/* Decorative figure silhouette */}
            <div className="sz-hero-figure" aria-hidden="true">
              <svg viewBox="0 0 220 480" fill="none" xmlns="http://www.w3.org/2000/svg" className="sz-figure-svg">
                {/* Head */}
                <circle cx="110" cy="44" r="28" stroke="var(--gold)" strokeWidth="1" fill="none" opacity="0.6" />
                {/* Neck */}
                <line x1="110" y1="72" x2="110" y2="88" stroke="var(--gold)" strokeWidth="1" opacity="0.5" />
                {/* Shoulders */}
                <path d="M66 92 Q110 84 154 92" stroke="var(--gold)" strokeWidth="1" fill="none" opacity="0.7" />
                {/* Bust */}
                <path d="M64 92 Q56 120 60 136 Q84 144 110 144 Q136 144 160 136 Q164 120 156 92" stroke="var(--gold)" strokeWidth="1" fill="none" opacity="0.6" />
                {/* Waist */}
                <path d="M60 136 Q62 172 72 186 Q90 194 110 194 Q130 194 148 186 Q158 172 160 136" stroke="var(--gold)" strokeWidth="1" fill="none" opacity="0.6" />
                {/* Hip */}
                <path d="M72 186 Q62 214 64 236 Q86 248 110 248 Q134 248 156 236 Q158 214 148 186" stroke="var(--gold)" strokeWidth="1" fill="none" opacity="0.6" />
                {/* Left leg */}
                <path d="M64 236 Q60 290 62 350 Q72 358 84 356 Q92 298 110 248" stroke="var(--gold)" strokeWidth="1" fill="none" opacity="0.5" />
                {/* Right leg */}
                <path d="M156 236 Q160 290 158 350 Q148 358 136 356 Q128 298 110 248" stroke="var(--gold)" strokeWidth="1" fill="none" opacity="0.5" />
                {/* Left arm */}
                <path d="M66 92 Q44 130 42 186 Q50 190 58 188 Q66 144 72 106" stroke="var(--gold)" strokeWidth="1" fill="none" opacity="0.5" />
                {/* Right arm */}
                <path d="M154 92 Q176 130 178 186 Q170 190 162 188 Q154 144 148 106" stroke="var(--gold)" strokeWidth="1" fill="none" opacity="0.5" />

                {/* Bust measurement line */}
                <line x1="36" y1="130" x2="184" y2="130" stroke="var(--gold)" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.45" />
                <text x="18" y="134" fontSize="9" fill="var(--gold)" opacity="0.7" fontFamily="DM Sans, sans-serif">B</text>

                {/* Waist measurement line */}
                <line x1="44" y1="178" x2="176" y2="178" stroke="var(--gold)" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.45" />
                <text x="26" y="182" fontSize="9" fill="var(--gold)" opacity="0.7" fontFamily="DM Sans, sans-serif">W</text>

                {/* Hip measurement line */}
                <line x1="42" y1="226" x2="178" y2="226" stroke="var(--gold)" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.45" />
                <text x="24" y="230" fontSize="9" fill="var(--gold)" opacity="0.7" fontFamily="DM Sans, sans-serif">H</text>
              </svg>

              {/* Floating labels */}
              <div className="sz-fig-label sz-fig-bust">Bust</div>
              <div className="sz-fig-label sz-fig-waist">Waist</div>
              <div className="sz-fig-label sz-fig-hip">Hip</div>
            </div>
          </div>
        </section>

        {/* ── How to Measure ── */}
        <section className="sz-howto">
          <div className="sz-howto-inner">
            <div className="sz-section-header">
              <div className="sz-rule" />
              <h2 className="sz-section-title">How to Measure</h2>
              <div className="sz-rule" />
            </div>
            <p className="sz-section-sub">
              Use a soft measuring tape for accurate results. Measure directly
              against your body, not over clothing.
            </p>
            <div className="sz-howto-grid">
              {HOW_TO_MEASURE.map((item, i) => (
                <div
                  key={item.key}
                  className="sz-howto-card"
                  style={{ animationDelay: `${i * 0.07}s` }}
                >
                  <div className="sz-howto-icon">{item.icon}</div>
                  <h3 className="sz-howto-title">{item.title}</h3>
                  <p className="sz-howto-body">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Size Tables + Calculator ── */}
        <section className="sz-tables-section">
          <div className="sz-tables-inner">

            {/* Controls row */}
            <div className="sz-controls">
              {/* Category tabs */}
              <div className="sz-cat-tabs">
                {(Object.keys(CATEGORY_LABELS) as Category[]).map((cat) => (
                  <button
                    key={cat}
                    className={`sz-cat-tab ${activeCategory === cat ? "sz-cat-active" : ""}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {CATEGORY_LABELS[cat]}
                  </button>
                ))}
              </div>

              {/* Unit toggle */}
              <div className="sz-unit-toggle">
                <button
                  className={`sz-unit-btn ${unit === "cm" ? "sz-unit-active" : ""}`}
                  onClick={() => setUnit("cm")}
                >
                  cm
                </button>
                <button
                  className={`sz-unit-btn ${unit === "in" ? "sz-unit-active" : ""}`}
                  onClick={() => setUnit("in")}
                >
                  in
                </button>
              </div>
            </div>

            {/* Table + Calculator side by side */}
            <div className="sz-table-layout">
              <div className="sz-table-col">
                <div className="sz-table-heading">
                  <h2 className="sz-table-title">{CATEGORY_LABELS[activeCategory]}</h2>
                  <span className="sz-table-unit-badge">{unit === "cm" ? "Centimetres" : "Inches"}</span>
                </div>
                <SizeTable category={activeCategory} unit={unit} />
              </div>

              <div className="sz-calc-col">
                <FitCalculator unit={unit} />
              </div>
            </div>
          </div>
        </section>

        {/* ── International Conversion ── */}
        <section className="sz-intl">
          <div className="sz-intl-inner">
            <div className="sz-section-header">
              <div className="sz-rule" />
              <h2 className="sz-section-title">International Size Conversion</h2>
              <div className="sz-rule" />
            </div>
            <div className="sz-intl-table-wrap">
              <div className="sz-intl-scroll">
                <table className="sz-intl-table">
                  <thead>
                    <tr>
                      {INT_SIZES.map((row) => (
                        <th key={row.label} className={`sz-intl-th ${row.label === "Maison Elara" ? "sz-intl-th-me" : ""}`}>
                          {row.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {SIZE_LABELS.map((_, colIdx) => (
                      <tr key={colIdx} className={colIdx % 2 === 0 ? "sz-tr-even" : "sz-tr-odd"}>
                        {INT_SIZES.map((row) => (
                          <td
                            key={row.label}
                            className={`sz-intl-td ${row.label === "Maison Elara" ? "sz-intl-td-me" : ""}`}
                          >
                            {row.values[colIdx]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* ── Fit Philosophy ── */}
        <section className="sz-philosophy">
          <div className="sz-philosophy-inner">
            <div className="sz-philosophy-text">
              <span className="sz-eyebrow">Our Approach</span>
              <h2 className="sz-philosophy-title">
                Cut for the
                <br />
                <em>body you have.</em>
              </h2>
              <p className="sz-philosophy-body">
                We reject the idea that women should change their body to fit
                our clothes. Every pattern is graded by hand, tested across six
                body shapes, and refined until the fit is honest.
              </p>
              <p className="sz-philosophy-body">
                If you&apos;re between sizes, we always recommend sizing up —
                a piece that moves with you is more elegant than one that
                constrains. And if it&apos;s not right, returns are free,
                always.
              </p>
              <div className="sz-philosophy-actions">
                <Link href="/help/contact" className="btn-primary">
                  Ask a Stylist
                </Link>
                <Link href="/help/returns" className="btn-ghost">
                  Return Policy
                </Link>
              </div>
            </div>
            <div className="sz-philosophy-cards">
              {[
                {
                  icon: "✦",
                  title: "Free Returns",
                  body:  "If the fit isn't perfect, return it within 30 days. No questions, no fees.",
                  accent: "#c9a96e",
                },
                {
                  icon: "◈",
                  title: "Personal Styling",
                  body:  "Our stylists can advise on sizing before you purchase. Email or live chat.",
                  accent: "#b8c4bb",
                },
                {
                  icon: "○",
                  title: "120-Wear Testing",
                  body:  "Every piece is tested through 120 wear cycles to ensure the fit holds.",
                  accent: "#d4b5a0",
                },
              ].map((card) => (
                <div key={card.title} className="sz-phil-card">
                  <span className="sz-phil-icon" style={{ color: card.accent }}>{card.icon}</span>
                  <h3 className="sz-phil-title">{card.title}</h3>
                  <p className="sz-phil-body">{card.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="sz-faq">
          <div className="sz-faq-inner">
            <div className="sz-section-header" style={{ marginBottom: 36 }}>
              <div className="sz-rule" />
              <h2 className="sz-section-title">Common Questions</h2>
              <div className="sz-rule" />
            </div>
            <div className="sz-faq-grid">
              {[
                {
                  q: "What if I'm between two sizes?",
                  a: "Size up. Our pieces are designed with ease built in, and a slightly larger fit reads more elegant than a tight one. If you're between sizes specifically in the bust, size to your bust and our stylists can advise on tailoring options.",
                },
                {
                  q: "Do your sizes run true to size?",
                  a: "Yes — our sizing reflects actual body measurements, not vanity sizing. If you normally wear a UK 10, you'll find our M fits perfectly. We've deliberately avoided the inconsistency common in luxury fashion.",
                },
                {
                  q: "Will knitwear stretch over time?",
                  a: "Natural fibres like cashmere and merino will relax 2–3% with wear. We account for this in our sizing. After washing (always cold, gentle cycle), the piece will return to its original dimensions.",
                },
                {
                  q: "How do you handle petite or tall proportions?",
                  a: "Our standard sizing is based on a 165–170 cm height. For petite frames (under 160 cm), we recommend hemming dresses and trousers — our atelier offers this service. For taller frames (over 175 cm), our wide-leg trousers and maxi dresses work best.",
                },
                {
                  q: "Can I exchange for a different size?",
                  a: "Yes — exchanges are free and processed within 3 business days of receiving the return. Simply start a return and select 'exchange' rather than 'refund' as the resolution.",
                },
                {
                  q: "How do I care for my piece to maintain the fit?",
                  a: "Follow the care label closely. Most Maison Elara pieces should be washed cold or hand-washed. Avoid tumble-drying — lay flat to dry silk and knitwear. Steam rather than iron where possible.",
                },
              ].map((item, i) => (
                <div key={i} className="sz-faq-item">
                  <h3 className="sz-faq-q">{item.q}</h3>
                  <p className="sz-faq-a">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Help links ── */}
        <section className="sz-help-links">
          <div className="sz-help-links-inner">
            {[
              { label: "Returns & Exchanges", href: "/help/returns",  icon: "↩" },
              { label: "Shipping Info",        href: "/help/shipping", icon: "↗" },
              { label: "Contact a Stylist",    href: "/help/contact",  icon: "✉" },
              { label: "FAQ",                  href: "/help/faq",      icon: "?" },
            ].map((link) => (
              <Link key={link.label} href={link.href} className="sz-help-link">
                <span className="sz-help-link-icon">{link.icon}</span>
                <span className="sz-help-link-label">{link.label}</span>
                <span className="sz-help-link-arrow">→</span>
              </Link>
            ))}
          </div>
        </section>

      </main>

      <Footer />

      <style>{`
        /* ── Page ── */
        .sz-page { background: var(--cream); overflow-x: hidden; }

        /* ── Hero ── */
        .sz-hero {
          position: relative;
          min-height: 80vh;
          display: flex;
          align-items: center;
          border-bottom: 1px solid var(--border);
          overflow: hidden;
        }
        .sz-hero-bg {
          position: absolute;
          inset: 0;
          background: linear-gradient(160deg, var(--cream-dark) 0%, #ede8dd 100%);
        }
        .sz-hero-lines {
          position: absolute;
          inset: 0;
          display: flex;
          pointer-events: none;
          z-index: 0;
        }
        .sz-hero-line {
          flex: 1;
          border-right: 1px solid rgba(201,169,110,0.1);
          animation: sz-line-grow 1s ease both;
          transform-origin: top;
        }
        @keyframes sz-line-grow {
          from { transform: scaleY(0); }
          to   { transform: scaleY(1); }
        }

        .sz-hero-inner {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 60px;
          align-items: center;
          padding: 80px 60px 64px;
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
        }

        .sz-breadcrumb {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 22px;
          animation: fadeUp 0.6s ease both;
        }
        .sz-breadcrumb a:hover { color: var(--gold); transition: color 0.2s; }
        .sz-sep { color: var(--border); }

        .sz-eyebrow {
          display: block;
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 14px;
        }
        .sz-hero-title {
          font-family: var(--font-display);
          font-size: clamp(52px, 7vw, 92px);
          font-weight: 400;
          line-height: 1.0;
          color: var(--charcoal);
          margin-bottom: 22px;
          animation: fadeUp 0.7s 0.08s ease both;
        }
        .sz-hero-title em { font-style: italic; color: var(--gold); }
        .sz-hero-lead {
          font-family: var(--font-editorial);
          font-size: 17px;
          font-weight: 300;
          color: var(--muted);
          line-height: 1.8;
          max-width: 420px;
          margin-bottom: 32px;
          animation: fadeUp 0.7s 0.16s ease both;
        }
        .sz-hero-pills {
          display: flex;
          flex-direction: column;
          gap: 8px;
          animation: fadeUp 0.7s 0.24s ease both;
        }
        .sz-hero-pill {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: var(--charcoal-light);
          padding: 10px 16px;
          border: 1px solid var(--border);
          background: rgba(255,255,255,0.5);
        }
        .sz-pill-icon { color: var(--gold); font-size: 10px; flex-shrink: 0; }

        /* Silhouette figure */
        .sz-hero-figure {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 480px;
          animation: fadeUp 0.8s 0.2s ease both;
        }
        .sz-figure-svg {
          width: 220px;
          height: 480px;
        }
        .sz-fig-label {
          position: absolute;
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--gold);
          padding: 3px 10px;
          background: var(--cream-dark);
          border: 1px solid rgba(201,169,110,0.3);
          white-space: nowrap;
        }
        .sz-fig-bust  { top: 27%;  right: -10px; }
        .sz-fig-waist { top: 37%;  right: -10px; }
        .sz-fig-hip   { top: 47%;  right: -10px; }

        /* ── How to Measure ── */
        .sz-howto {
          padding: 80px 60px;
          background: var(--cream);
          border-bottom: 1px solid var(--border);
        }
        .sz-howto-inner { max-width: 1200px; margin: 0 auto; }
        .sz-section-header {
          display: flex;
          align-items: center;
          gap: 24px;
          margin-bottom: 16px;
        }
        .sz-rule { flex: 1; height: 1px; background: var(--border); }
        .sz-section-title {
          font-family: var(--font-display);
          font-size: 28px;
          font-weight: 400;
          color: var(--charcoal);
          white-space: nowrap;
        }
        .sz-section-sub {
          text-align: center;
          font-family: var(--font-editorial);
          font-size: 15px;
          color: var(--muted);
          font-style: italic;
          margin-bottom: 44px;
        }
        .sz-howto-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2px;
          background: var(--border);
          border: 1px solid var(--border);
        }
        .sz-howto-card {
          background: var(--cream);
          padding: 36px 32px;
          transition: background 0.2s;
          animation: fadeUp 0.5s ease both;
        }
        .sz-howto-card:hover { background: var(--cream-dark); }
        .sz-howto-icon {
          font-size: 20px;
          color: var(--gold);
          margin-bottom: 16px;
        }
        .sz-howto-title {
          font-family: var(--font-display);
          font-size: 18px;
          font-weight: 400;
          color: var(--charcoal);
          margin-bottom: 10px;
        }
        .sz-howto-body {
          font-family: var(--font-editorial);
          font-size: 14px;
          font-weight: 300;
          color: var(--muted);
          line-height: 1.75;
        }

        /* ── Tables Section ── */
        .sz-tables-section {
          padding: 64px 60px;
          border-bottom: 1px solid var(--border);
        }
        .sz-tables-inner { max-width: 1200px; margin: 0 auto; }

        .sz-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 32px;
          flex-wrap: wrap;
        }
        .sz-cat-tabs {
          display: flex;
          gap: 0;
          border: 1px solid var(--border);
          overflow: hidden;
          flex-wrap: wrap;
        }
        .sz-cat-tab {
          padding: 10px 20px;
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--charcoal-light);
          background: var(--cream);
          border-right: 1px solid var(--border);
          font-family: var(--font-body);
          cursor: pointer;
          transition: all 0.18s;
        }
        .sz-cat-tab:last-child { border-right: none; }
        .sz-cat-tab:hover { background: var(--cream-dark); color: var(--charcoal); }
        .sz-cat-active {
          background: var(--charcoal) !important;
          color: var(--cream) !important;
        }

        .sz-unit-toggle {
          display: flex;
          border: 1px solid var(--border);
          overflow: hidden;
          flex-shrink: 0;
        }
        .sz-unit-btn {
          padding: 10px 20px;
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--charcoal-light);
          background: var(--cream);
          border-right: 1px solid var(--border);
          font-family: var(--font-body);
          cursor: pointer;
          transition: all 0.18s;
        }
        .sz-unit-btn:last-child { border-right: none; }
        .sz-unit-active {
          background: var(--charcoal);
          color: var(--cream);
        }

        /* Table layout */
        .sz-table-layout {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 32px;
          align-items: start;
        }
        .sz-table-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
          flex-wrap: wrap;
          gap: 8px;
        }
        .sz-table-title {
          font-family: var(--font-display);
          font-size: 22px;
          font-weight: 400;
          color: var(--charcoal);
        }
        .sz-table-unit-badge {
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted);
          border: 1px solid var(--border);
          padding: 4px 12px;
        }

        /* Table */
        .sz-table-wrap {}
        .sz-table-scroll { overflow-x: auto; }
        .sz-table {
          width: 100%;
          border-collapse: collapse;
          border: 1px solid var(--border);
        }
        .sz-th {
          padding: 13px 16px;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted);
          font-weight: 400;
          text-align: center;
          border-bottom: 2px solid var(--border);
          background: var(--cream-dark);
          white-space: nowrap;
        }
        .sz-th-measure { text-align: left; min-width: 110px; }
        .sz-td {
          padding: 12px 16px;
          font-size: 14px;
          color: var(--charcoal-light);
          text-align: center;
          border-bottom: 1px solid var(--border);
          transition: background 0.15s;
        }
        .sz-td-label {
          text-align: left;
          font-size: 13px;
          color: var(--charcoal);
          letter-spacing: 0.04em;
          font-weight: 400;
        }
        .sz-td-val { font-feature-settings: "tnum"; }
        .sz-tr-even .sz-td { background: var(--cream); }
        .sz-tr-odd  .sz-td { background: rgba(240,235,228,0.45); }
        .sz-col-hover { background: rgba(201,169,110,0.08) !important; color: var(--charcoal) !important; }
        .sz-table-note {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 12px;
          color: var(--muted);
          line-height: 1.6;
          padding: 12px 14px;
          background: var(--cream-dark);
          border: 1px solid var(--border);
          border-top: none;
          font-style: italic;
        }
        .sz-table-note svg { flex-shrink: 0; margin-top: 2px; color: var(--gold); }

        /* ── Fit Calculator ── */
        .sz-calc {
          border: 1px solid var(--border);
          background: var(--cream-dark);
          padding: 28px 24px;
          position: sticky;
          top: 100px;
        }
        .sz-calc-header { text-align: center; margin-bottom: 24px; }
        .sz-calc-ornament { font-size: 14px; color: var(--gold); margin-bottom: 10px; }
        .sz-calc-title {
          font-family: var(--font-display);
          font-size: 20px;
          font-weight: 400;
          color: var(--charcoal);
          margin-bottom: 8px;
        }
        .sz-calc-sub {
          font-family: var(--font-editorial);
          font-size: 13px;
          color: var(--muted);
          font-style: italic;
          line-height: 1.5;
        }
        .sz-calc-fields { display: flex; flex-direction: column; gap: 12px; margin-bottom: 16px; }
        .sz-calc-field { display: flex; flex-direction: column; gap: 5px; }
        .sz-calc-label {
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--charcoal-light);
        }
        .sz-calc-input {
          padding: 11px 12px;
          border: 1px solid var(--border);
          background: var(--white);
          font-size: 14px;
          color: var(--charcoal);
          font-family: var(--font-body);
          outline: none;
          transition: border-color 0.2s;
          width: 100%;
        }
        .sz-calc-input:focus { border-color: var(--charcoal); }
        .sz-calc-input::placeholder { color: var(--muted); }
        .sz-calc-input::-webkit-inner-spin-button,
        .sz-calc-input::-webkit-outer-spin-button { -webkit-appearance: none; }
        .sz-calc-btn {
          width: 100%;
          padding: 13px;
          background: var(--charcoal);
          color: var(--cream);
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-family: var(--font-body);
          cursor: pointer;
          transition: background 0.2s;
          border: 1px solid var(--charcoal);
        }
        .sz-calc-btn:hover { background: var(--gold); border-color: var(--gold); }
        .sz-calc-result {
          margin-top: 16px;
          animation: fadeUp 0.3s ease both;
        }
        .sz-calc-result-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          background: var(--charcoal);
          margin-bottom: 10px;
        }
        .sz-calc-result-label {
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(250,247,242,0.5);
        }
        .sz-calc-result-size {
          font-family: var(--font-display);
          font-size: 32px;
          font-weight: 400;
          color: var(--gold);
          line-height: 1;
        }
        .sz-calc-result-note {
          font-family: var(--font-editorial);
          font-size: 12px;
          color: var(--muted);
          font-style: italic;
          line-height: 1.6;
          padding: 10px 12px;
          border: 1px solid var(--border);
          background: var(--cream);
        }

        /* ── International Conversion ── */
        .sz-intl {
          padding: 72px 60px;
          background: var(--cream-dark);
          border-bottom: 1px solid var(--border);
        }
        .sz-intl-inner { max-width: 1200px; margin: 0 auto; }
        .sz-intl-table-wrap { margin-top: 36px; }
        .sz-intl-scroll { overflow-x: auto; }
        .sz-intl-table {
          width: 100%;
          border-collapse: collapse;
          border: 1px solid var(--border);
        }
        .sz-intl-th {
          padding: 12px 20px;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted);
          font-weight: 400;
          text-align: center;
          border-bottom: 2px solid var(--border);
          background: var(--cream);
          white-space: nowrap;
        }
        .sz-intl-th-me {
          background: var(--charcoal);
          color: var(--cream);
        }
        .sz-intl-td {
          padding: 12px 20px;
          font-size: 14px;
          color: var(--charcoal-light);
          text-align: center;
          border-bottom: 1px solid var(--border);
          font-feature-settings: "tnum";
        }
        .sz-intl-td-me {
          font-family: var(--font-display);
          font-size: 15px;
          color: var(--charcoal);
          font-weight: 400;
          background: rgba(201,169,110,0.06);
        }

        /* ── Philosophy ── */
        .sz-philosophy {
          padding: 80px 60px;
          background: var(--cream);
        }
        .sz-philosophy-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }
        .sz-philosophy-title {
          font-family: var(--font-display);
          font-size: clamp(32px, 3.5vw, 48px);
          font-weight: 400;
          line-height: 1.12;
          color: var(--charcoal);
          margin-bottom: 24px;
        }
        .sz-philosophy-title em { font-style: italic; color: var(--gold); }
        .sz-philosophy-body {
          font-family: var(--font-editorial);
          font-size: 16px;
          font-weight: 300;
          color: var(--muted);
          line-height: 1.85;
          margin-bottom: 18px;
        }
        .sz-philosophy-actions {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          margin-top: 32px;
        }
        .sz-philosophy-cards {
          display: flex;
          flex-direction: column;
          gap: 2px;
          background: var(--border);
          border: 1px solid var(--border);
        }
        .sz-phil-card {
          background: var(--cream);
          padding: 28px 28px;
          transition: background 0.2s;
        }
        .sz-phil-card:hover { background: var(--cream-dark); }
        .sz-phil-icon {
          display: block;
          font-size: 18px;
          margin-bottom: 12px;
        }
        .sz-phil-title {
          font-family: var(--font-display);
          font-size: 17px;
          font-weight: 400;
          color: var(--charcoal);
          margin-bottom: 8px;
        }
        .sz-phil-body {
          font-family: var(--font-editorial);
          font-size: 14px;
          font-weight: 300;
          color: var(--muted);
          line-height: 1.7;
        }

        /* ── FAQ ── */
        .sz-faq {
          padding: 72px 60px;
          background: var(--cream-dark);
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
        }
        .sz-faq-inner { max-width: 1200px; margin: 0 auto; }
        .sz-faq-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2px;
          background: var(--border);
          border: 1px solid var(--border);
        }
        .sz-faq-item {
          background: var(--cream);
          padding: 28px 28px;
          transition: background 0.18s;
        }
        .sz-faq-item:hover { background: var(--cream-dark); }
        .sz-faq-q {
          font-family: var(--font-display);
          font-size: 16px;
          font-weight: 400;
          color: var(--charcoal);
          margin-bottom: 10px;
          line-height: 1.35;
        }
        .sz-faq-a {
          font-family: var(--font-editorial);
          font-size: 14px;
          font-weight: 300;
          color: var(--muted);
          line-height: 1.75;
        }

        /* ── Help Links ── */
        .sz-help-links {
          padding: 0;
          border-top: 1px solid var(--border);
        }
        .sz-help-links-inner {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
          background: var(--border);
          max-width: 100%;
        }
        .sz-help-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 24px 32px;
          background: var(--cream);
          transition: background 0.18s;
          border-right: 1px solid var(--border);
        }
        .sz-help-link:last-child { border-right: none; }
        .sz-help-link:hover { background: var(--cream-dark); }
        .sz-help-link:hover .sz-help-link-arrow { transform: translateX(4px); }
        .sz-help-link-icon {
          font-size: 16px;
          color: var(--gold);
          flex-shrink: 0;
          width: 20px;
          text-align: center;
        }
        .sz-help-link-label {
          font-size: 13px;
          color: var(--charcoal);
          letter-spacing: 0.04em;
          flex: 1;
        }
        .sz-help-link-arrow {
          font-size: 16px;
          color: var(--gold);
          transition: transform 0.2s;
        }

        /* ── Responsive ── */
        @media (max-width: 1100px) {
          .sz-hero-inner { padding: 60px 40px 52px; gap: 40px; }
          .sz-table-layout { grid-template-columns: 1fr; }
          .sz-calc { position: static; }
          .sz-howto,
          .sz-tables-section,
          .sz-intl,
          .sz-philosophy,
          .sz-faq { padding-left: 40px; padding-right: 40px; }
          .sz-philosophy-inner { grid-template-columns: 1fr; gap: 48px; }
        }
        @media (max-width: 900px) {
          .sz-hero-inner { grid-template-columns: 1fr; padding: 52px 20px; }
          .sz-hero-figure { display: none; }
          .sz-howto-grid { grid-template-columns: repeat(2, 1fr); }
          .sz-faq-grid { grid-template-columns: 1fr; }
          .sz-help-links-inner { grid-template-columns: repeat(2, 1fr); }
          .sz-help-link { border-bottom: 1px solid var(--border); }
          .sz-howto,
          .sz-tables-section,
          .sz-intl,
          .sz-philosophy,
          .sz-faq { padding-left: 20px; padding-right: 20px; }
          .sz-cat-tabs { overflow-x: auto; }
        }
        @media (max-width: 640px) {
          .sz-hero-inner { padding: 44px 20px; }
          .sz-howto-grid { grid-template-columns: 1fr; }
          .sz-controls { flex-direction: column; align-items: flex-start; }
          .sz-cat-tabs { width: 100%; }
          .sz-help-links-inner { grid-template-columns: 1fr; }
          .sz-help-link { border-right: none; border-bottom: 1px solid var(--border); }
          .sz-help-link:last-child { border-bottom: none; }
          .sz-hero-title { font-size: clamp(48px, 14vw, 72px); }
        }
      `}</style>
    </>
  );
}