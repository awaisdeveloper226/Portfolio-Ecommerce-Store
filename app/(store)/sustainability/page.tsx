"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ─── Animated Counter ─────────────────────────────────────────────────────────
function Counter({
  target,
  suffix = "",
  prefix = "",
  duration = 2000,
}: {
  target: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(ease * target));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return (
    <span ref={ref}>
      {prefix}{count}{suffix}
    </span>
  );
}

// ─── Scroll-reveal wrapper ────────────────────────────────────────────────────
function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.65s ${delay}s ease, transform 0.65s ${delay}s ease`,
      }}
    >
      {children}
    </div>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
function ProgressBar({ value, color = "var(--gold)" }: { value: number; color?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setAnimated(true); observer.disconnect(); }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="sust-progress-track" ref={ref}>
      <div
        className="sust-progress-fill"
        style={{
          width: animated ? `${value}%` : "0%",
          background: color,
          transition: "width 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />
    </div>
  );
}

// ─── Accordion ────────────────────────────────────────────────────────────────
function Accordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="sust-accordion">
      {items.map((item, i) => (
        <div key={i} className={`sust-accordion-item ${open === i ? "sust-accordion-open" : ""}`}>
          <button className="sust-accordion-trigger" onClick={() => setOpen(open === i ? null : i)}>
            <span>{item.q}</span>
            <span className="sust-accordion-icon">{open === i ? "−" : "+"}</span>
          </button>
          <div
            className="sust-accordion-body"
            style={{ maxHeight: open === i ? "300px" : "0px" }}
          >
            <p>{item.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function SustainabilityPage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />

      <main className="sust-page">

        {/* ── Hero ── */}
        <section className="sust-hero">
          <div className="sust-hero-bg" />
          {/* Decorative grid lines */}
          <div className="sust-hero-grid-lines">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="sust-grid-line" style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>

          <div className="sust-hero-inner">
            <div className="sust-hero-text">
              <nav className="sust-breadcrumb">
                <Link href="/">Home</Link>
                <span className="sust-sep">·</span>
                <span>Sustainability</span>
              </nav>
              <span className="sust-eyebrow">Our Commitment</span>
              <h1 className="sust-hero-title">
                Fashion that
                <br />
                <em>heals</em> the world,
                <br />
                not harms it.
              </h1>
              <p className="sust-hero-lead">
                Sustainability isn&apos;t a feature we added — it is the reason
                Maison Elara exists. Every decision we make begins and ends
                with a single question: does this harm or heal?
              </p>
              <div className="sust-hero-cta">
                <a href="#impact" className="btn-primary">View Our Impact Report</a>
                <a href="#standards" className="btn-ghost">Our Standards</a>
              </div>
            </div>

            {/* Hero image collage */}
            <div className="sust-hero-imagery">
              <div className="sust-hero-img sust-hero-img-main" style={{ background: "linear-gradient(155deg,#c8d8c0 0%,#a8c0a8 100%)" }}>
                <div className="sust-hero-img-caption">
                  <span className="sust-caption-line" />
                  <span>Organic Irish Linen, Atelier Lyon</span>
                </div>
              </div>
              <div className="sust-hero-img sust-hero-img-sm1" style={{ background: "linear-gradient(155deg,#d4c4b0 0%,#c0ae98 100%)" }} />
              <div className="sust-hero-img sust-hero-img-sm2" style={{ background: "linear-gradient(155deg,#b8ccc4 0%,#a0b8b0 100%)" }} />
              <div className="sust-hero-badge">
                <div className="sust-badge-inner">
                  <span className="sust-badge-icon">✦</span>
                  <span className="sust-badge-text">Carbon</span>
                  <span className="sust-badge-num">Neutral</span>
                  <span className="sust-badge-year">Since 2022</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Manifesto band ── */}
        <section className="sust-manifesto">
          <div className="sust-manifesto-inner">
            <div className="sust-manifesto-line" />
            <blockquote className="sust-manifesto-quote">
              &ldquo;The most sustainable garment is the one you wear a hundred times.
              We design for the hundredth wear.&rdquo;
            </blockquote>
            <p className="sust-manifesto-attr">— Elara Voss, Founder &amp; Creative Director</p>
            <div className="sust-manifesto-line" />
          </div>
        </section>

        {/* ── Impact Numbers ── */}
        <section id="impact" className="sust-impact">
          <Reveal>
            <div className="sust-section-label">
              <div className="sust-label-line" />
              <span>2024 Impact Report</span>
              <div className="sust-label-line" />
            </div>
          </Reveal>

          <div className="sust-impact-grid">
            {[
              {
                num: 110,
                suffix: "%",
                label: "Carbon Offset",
                sub: "We offset more than we emit — verified annually by a third party.",
                color: "#b8c4bb",
              },
              {
                num: 100,
                suffix: "%",
                label: "Sustainable Fabrics",
                sub: "Every fibre is GOTS-certified, OEKO-TEX verified, or certified deadstock.",
                color: "#c9a96e",
              },
              {
                num: 12,
                suffix: "",
                label: "Artisan Partners",
                sub: "Long-term, fairly paid partnerships with family ateliers across 3 countries.",
                color: "#d4b5a0",
              },
              {
                num: 1,
                suffix: "%",
                label: "Revenue to Reforestation",
                sub: "Every purchase funds certified reforestation projects through 1% for the Planet.",
                color: "#9aacb0",
              },
              {
                num: 28,
                suffix: "",
                label: "Countries Reached",
                sub: "80,000+ women wearing with intention across six continents.",
                color: "#c4b5d4",
              },
              {
                num: 0,
                suffix: "",
                prefix: "",
                label: "Landfill Waste",
                sub: "100% of our packaging is compostable or returnable. Zero to landfill.",
                color: "#b8ccc4",
              },
            ].map((stat, i) => (
              <Reveal key={stat.label} delay={i * 0.08} className="sust-impact-card">
                <div className="sust-impact-card-inner">
                  <div className="sust-impact-accent" style={{ background: stat.color }} />
                  <div className="sust-impact-num" style={{ color: stat.color }}>
                    <Counter
                      target={stat.num}
                      suffix={stat.suffix}
                      prefix={stat.prefix ?? ""}
                    />
                  </div>
                  <h3 className="sust-impact-label">{stat.label}</h3>
                  <p className="sust-impact-sub">{stat.sub}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── Pillars ── */}
        <section className="sust-pillars">
          <div className="sust-pillars-bg" />
          <div className="sust-pillars-inner">
            <Reveal>
              <span className="sust-eyebrow" style={{ display: "block", marginBottom: 12 }}>How We Do It</span>
              <h2 className="sust-section-title">
                Four pillars.<br />
                <em>One planet.</em>
              </h2>
            </Reveal>

            <div className="sust-pillars-grid">
              {/* Pillar 1 — Fabric */}
              <Reveal delay={0} className="sust-pillar">
                <div className="sust-pillar-num">01</div>
                <div className="sust-pillar-icon-wrap">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                </div>
                <h3 className="sust-pillar-title">Fabric First</h3>
                <p className="sust-pillar-body">
                  We source exclusively from GOTS-certified organic farms, OEKO-TEX 100 verified mills, and certified deadstock suppliers. No synthetic blends. No compromises on what touches your skin — or the earth.
                </p>
                <div className="sust-pillar-metrics">
                  <div className="sust-pillar-metric">
                    <span>GOTS Certified</span>
                    <ProgressBar value={100} color="#b8c4bb" />
                  </div>
                  <div className="sust-pillar-metric">
                    <span>OEKO-TEX Verified</span>
                    <ProgressBar value={100} color="#b8c4bb" />
                  </div>
                  <div className="sust-pillar-metric">
                    <span>Deadstock / Upcycled</span>
                    <ProgressBar value={22} color="#b8c4bb" />
                  </div>
                </div>
              </Reveal>

              {/* Pillar 2 — People */}
              <Reveal delay={0.1} className="sust-pillar">
                <div className="sust-pillar-num">02</div>
                <div className="sust-pillar-icon-wrap">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <h3 className="sust-pillar-title">People & Partners</h3>
                <p className="sust-pillar-body">
                  Every atelier partner signs our Ethical Maker Charter — guaranteeing fair wages, safe conditions, and long-term contracts. No seasonal cancellations, no race to the bottom. We visit every partner in person, every year.
                </p>
                <div className="sust-pillar-metrics">
                  <div className="sust-pillar-metric">
                    <span>Partners on fair-wage contracts</span>
                    <ProgressBar value={100} color="#d4b5a0" />
                  </div>
                  <div className="sust-pillar-metric">
                    <span>Workers above living wage</span>
                    <ProgressBar value={100} color="#d4b5a0" />
                  </div>
                  <div className="sust-pillar-metric">
                    <span>Partners with safety certification</span>
                    <ProgressBar value={100} color="#d4b5a0" />
                  </div>
                </div>
              </Reveal>

              {/* Pillar 3 — Climate */}
              <Reveal delay={0.2} className="sust-pillar">
                <div className="sust-pillar-num">03</div>
                <div className="sust-pillar-icon-wrap">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
                  </svg>
                </div>
                <h3 className="sust-pillar-title">Climate Action</h3>
                <p className="sust-pillar-body">
                  We measure our full Scope 1, 2, and 3 emissions annually — from raw material extraction to your front door. We then offset 110% of that total through Gold Standard-certified projects and publish the full report here every year.
                </p>
                <div className="sust-pillar-metrics">
                  <div className="sust-pillar-metric">
                    <span>Emissions offset (vs target 100%)</span>
                    <ProgressBar value={110} color="#9aacb0" />
                  </div>
                  <div className="sust-pillar-metric">
                    <span>Renewable energy in operations</span>
                    <ProgressBar value={86} color="#9aacb0" />
                  </div>
                  <div className="sust-pillar-metric">
                    <span>Packaging compostable</span>
                    <ProgressBar value={100} color="#9aacb0" />
                  </div>
                </div>
              </Reveal>

              {/* Pillar 4 — Longevity */}
              <Reveal delay={0.3} className="sust-pillar">
                <div className="sust-pillar-num">04</div>
                <div className="sust-pillar-icon-wrap">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <polyline points="23 4 23 10 17 10" />
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                  </svg>
                </div>
                <h3 className="sust-pillar-title">Longevity by Design</h3>
                <p className="sust-pillar-body">
                  The most sustainable garment is the one you never need to replace. Every piece is tested through 120 wear cycles. Our lifetime repair guarantee and Elara Second Life resale platform mean your piece lives as long as you do.
                </p>
                <div className="sust-pillar-metrics">
                  <div className="sust-pillar-metric">
                    <span>Pieces returned for repair</span>
                    <ProgressBar value={68} color="#c4b5d4" />
                  </div>
                  <div className="sust-pillar-metric">
                    <span>Resale pieces successfully rehomed</span>
                    <ProgressBar value={94} color="#c4b5d4" />
                  </div>
                  <div className="sust-pillar-metric">
                    <span>Customer satisfaction: repaired pieces</span>
                    <ProgressBar value={97} color="#c4b5d4" />
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── Certifications ── */}
        <section id="standards" className="sust-certs">
          <Reveal>
            <div className="sust-section-label">
              <div className="sust-label-line" />
              <span>Independently Verified</span>
              <div className="sust-label-line" />
            </div>
            <h2 className="sust-section-title" style={{ textAlign: "center", marginBottom: 48 }}>
              Standards we <em>hold ourselves to.</em>
            </h2>
          </Reveal>

          <div className="sust-certs-grid">
            {[
              {
                name: "GOTS",
                full: "Global Organic Textile Standard",
                desc: "The world's leading textile processing standard for organic fibres, covering ecological and social criteria.",
                icon: "◈",
                accent: "#b8c4bb",
              },
              {
                name: "OEKO-TEX 100",
                full: "Made in Green",
                desc: "Certifies our products are manufactured in environmentally friendly facilities under safe and socially responsible conditions.",
                icon: "○",
                accent: "#c9a96e",
              },
              {
                name: "B Corp",
                full: "Pending Certification",
                desc: "We are currently in assessment for B Corp status — the gold standard for social and environmental performance. Expected 2025.",
                icon: "△",
                accent: "#d4b5a0",
              },
              {
                name: "1% for the Planet",
                full: "Founding Member",
                desc: "We commit 1% of annual revenue — not profit — to certified environmental non-profits focused on reforestation.",
                icon: "✦",
                accent: "#9aacb0",
              },
              {
                name: "Gold Standard",
                full: "Carbon Credits",
                desc: "Our carbon offsets are purchased exclusively through Gold Standard-certified projects, the highest quality available.",
                icon: "□",
                accent: "#c4b5d4",
              },
              {
                name: "Ethical Maker Charter",
                full: "Proprietary Standard",
                desc: "Our own binding supplier code covering living wages, safe conditions, no child labour, and mandatory annual audits.",
                icon: "◇",
                accent: "#d4c4a0",
              },
            ].map((cert, i) => (
              <Reveal key={cert.name} delay={i * 0.07} className="sust-cert-card">
                <div className="sust-cert-icon" style={{ color: cert.accent }}>{cert.icon}</div>
                <h3 className="sust-cert-name">{cert.name}</h3>
                <span className="sust-cert-full" style={{ color: cert.accent }}>{cert.full}</span>
                <p className="sust-cert-desc">{cert.desc}</p>
                <div className="sust-cert-bar" style={{ background: cert.accent }} />
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── Supply Chain Map ── */}
        <section className="sust-supply">
          <div className="sust-supply-inner">
            <div className="sust-supply-text">
              <Reveal>
                <span className="sust-eyebrow">Full Transparency</span>
                <h2 className="sust-section-title">
                  We name our
                  <br />
                  <em>suppliers.</em>
                </h2>
                <p className="sust-supply-body">
                  Most brands guard their supply chains like trade secrets. We
                  publish ours. Below is every atelier, mill, and farm we work
                  with — because accountability requires visibility.
                </p>
                <p className="sust-supply-body">
                  Every partner undergoes an annual third-party audit. Results
                  are published in full in our Impact Report, released every
                  January.
                </p>
              </Reveal>

              <div className="sust-supply-list">
                {[
                  { place: "Porto, Portugal", name: "Atelier Costeira", role: "Knitwear & Outerwear", year: "Partner since 2021" },
                  { place: "Florence, Italy", name: "Tessuti Fiorentini", role: "Silk & Satin Weaving", year: "Partner since 2020" },
                  { place: "Kyoto, Japan", name: "Nishijin Studio", role: "Specialty Textiles", year: "Partner since 2021" },
                  { place: "Donegal, Ireland", name: "Ó Murchadha Linen", role: "Organic Linen", year: "Partner since 2019" },
                  { place: "Lyon, France", name: "Ateliers du Rhône", role: "Pattern & Cut", year: "Partner since 2019" },
                ].map((p, i) => (
                  <Reveal key={p.name} delay={i * 0.07} className="sust-supply-item">
                    <div className="sust-supply-dot" />
                    <div className="sust-supply-item-text">
                      <div className="sust-supply-item-top">
                        <span className="sust-supply-name">{p.name}</span>
                        <span className="sust-supply-year">{p.year}</span>
                      </div>
                      <span className="sust-supply-place">{p.place} · {p.role}</span>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            {/* Visual map placeholder */}
            <div className="sust-supply-map">
              <div className="sust-map-bg" style={{ background: "linear-gradient(160deg,#d5e4d8 0%,#c0d0c4 100%)" }}>
                {/* Decorative dots for partner locations */}
                {[
                  { top: "38%", left: "44%", label: "Porto" },
                  { top: "52%", left: "50%", label: "Lyon / Florence" },
                  { top: "35%", left: "47%", label: "Donegal" },
                  { top: "48%", left: "78%", label: "Kyoto" },
                ].map((dot, i) => (
                  <div
                    key={i}
                    className="sust-map-dot"
                    style={{ top: dot.top, left: dot.left, animationDelay: `${i * 0.3}s` }}
                  >
                    <div className="sust-map-dot-inner" />
                    <span className="sust-map-dot-label">{dot.label}</span>
                  </div>
                ))}
                <div className="sust-map-label">Our Atelier Network</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Repair & Resale ── */}
        <section className="sust-circular">
          <div className="sust-circular-header">
            <Reveal>
              <span className="sust-eyebrow" style={{ textAlign: "center", display: "block" }}>Circular by Design</span>
              <h2 className="sust-section-title" style={{ textAlign: "center" }}>
                A piece for <em>life.</em>
              </h2>
            </Reveal>
          </div>

          <div className="sust-circular-grid">
            <Reveal delay={0} className="sust-circular-card sust-circular-card-dark">
              <div className="sust-circular-card-num">01</div>
              <div className="sust-circular-icon">↩</div>
              <h3 className="sust-circular-title">Lifetime Repair</h3>
              <p className="sust-circular-body">
                Every Maison Elara piece comes with a lifetime repair guarantee. A torn seam, a worn hem, a broken button — send it back, and our in-house atelier will restore it to perfect condition. Free of charge. Always.
              </p>
              <Link href="/help/returns" className="sust-circular-link">
                Start a Repair Request →
              </Link>
            </Reveal>

            <Reveal delay={0.1} className="sust-circular-card">
              <div className="sust-circular-card-num">02</div>
              <div className="sust-circular-icon" style={{ color: "var(--gold)" }}>⇄</div>
              <h3 className="sust-circular-title">Elara Second Life</h3>
              <p className="sust-circular-body">
                Loved it but ready to move on? List your piece on our curated resale platform. We authenticate every item, photograph it in our studio, and pass 85% of the sale price directly back to you.
              </p>
              <Link href="/shop" className="sust-circular-link" style={{ color: "var(--gold)", borderColor: "var(--gold)" }}>
                Visit Second Life →
              </Link>
            </Reveal>

            <Reveal delay={0.2} className="sust-circular-card">
              <div className="sust-circular-card-num">03</div>
              <div className="sust-circular-icon" style={{ color: "var(--muted)" }}>◎</div>
              <h3 className="sust-circular-title">End-of-Life Return</h3>
              <p className="sust-circular-body">
                If a piece is truly beyond repair, return it to us. We disassemble it, recover every reusable fibre, and partner with textile recyclers to ensure nothing reaches landfill. You receive a £20 credit.
              </p>
              <Link href="/help/contact" className="sust-circular-link">
                Learn About Returns →
              </Link>
            </Reveal>
          </div>
        </section>

        {/* ── Annual Report Preview ── */}
        <section className="sust-report">
          <div className="sust-report-inner">
            <Reveal className="sust-report-left">
              <span className="sust-eyebrow">Published Annually</span>
              <h2 className="sust-section-title">
                Our 2024<br />
                <em>Impact Report.</em>
              </h2>
              <p className="sust-report-body">
                Every year in January we publish a full, audited report covering
                our carbon emissions, supply chain audits, fabric sourcing data,
                wage disclosures, and progress against each commitment. No
                cherry-picking. No greenwashing.
              </p>
              <p className="sust-report-body">
                Because if we believe in transparency for the industry, we have
                to model it ourselves.
              </p>
              <div className="sust-report-actions">
                <a href="/sustainability/report-2024.pdf" className="btn-primary">
                  Download 2024 Report (PDF)
                </a>
                <Link href="/about" className="btn-ghost">Our Story</Link>
              </div>
            </Reveal>

            <div className="sust-report-right">
              {/* Report card graphic */}
              <Reveal delay={0.15} className="sust-report-card">
                <div className="sust-report-card-header">
                  <span className="sust-report-card-eyebrow">Maison Elara</span>
                  <h3 className="sust-report-card-title">Impact Report 2024</h3>
                  <span className="sust-report-card-sub">Published January 2025</span>
                </div>
                <div className="sust-report-card-stats">
                  {[
                    { label: "Scope 1+2+3 emissions", value: "182t CO₂e" },
                    { label: "Offsets purchased", value: "200t CO₂e" },
                    { label: "Net position", value: "−18t CO₂e" },
                    { label: "Supplier audits completed", value: "12 / 12" },
                    { label: "Workers interviewed", value: "184" },
                    { label: "Living wage compliance", value: "100%" },
                  ].map((row) => (
                    <div key={row.label} className="sust-report-row">
                      <span className="sust-report-row-label">{row.label}</span>
                      <span className="sust-report-row-val">{row.value}</span>
                    </div>
                  ))}
                </div>
                <div className="sust-report-card-footer">
                  <span>Verified by EcoAudit Partners Ltd</span>
                  <span className="sust-report-card-check">✓ Third-party audited</span>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="sust-faq">
          <div className="sust-faq-inner">
            <Reveal>
              <div className="sust-section-label" style={{ marginBottom: 40 }}>
                <div className="sust-label-line" />
                <span>Common Questions</span>
                <div className="sust-label-line" />
              </div>
            </Reveal>

            <Accordion
              items={[
                {
                  q: "What does 'carbon neutral' actually mean for Maison Elara?",
                  a: "We measure all Scope 1 (direct), Scope 2 (energy), and Scope 3 (supply chain, shipping, customer returns) emissions each year. We then purchase 110% of that volume in Gold Standard-certified carbon credits — meaning we offset more than we produce. Our full methodology and offset purchase receipts are published in our annual Impact Report.",
                },
                {
                  q: "Are your sustainability claims independently verified?",
                  a: "Yes. Our carbon accounting is audited annually by EcoAudit Partners Ltd, an accredited third-party sustainability consultancy. Our organic fabric certifications are issued and renewed by GOTS and OEKO-TEX directly. Supplier audits are conducted by Bureau Veritas. We publish all audit summaries in our Impact Report.",
                },
                {
                  q: "What is deadstock fabric, and why do you use it?",
                  a: "Deadstock is fabric that was produced but never used by another brand — it would otherwise go to landfill. We source certified deadstock from mills and brands who can verify its origin. It counts for approximately 22% of our total fabric use and represents some of the most beautiful materials we work with.",
                },
                {
                  q: "How does the Lifetime Repair guarantee work?",
                  a: "Any Maison Elara piece — regardless of when you purchased it — can be sent to our Lyon atelier for repair. We cover the cost of the repair itself; you cover shipping to us, and we return it free of charge. There is no time limit, no condition limit. We have restored pieces that are six years old.",
                },
                {
                  q: "Is the packaging really fully compostable?",
                  a: "Yes. Our mailer bags are made from Novamont Mater-Bi, a certified home-compostable bioplastic derived from corn starch. Our tissue paper is FSC-certified and printed with water-based inks. Our garment tags are made from recycled cotton. The only non-compostable element is our care label, which we are currently in the process of replacing with a plant-based alternative.",
                },
                {
                  q: "How can I participate in the Second Life resale platform?",
                  a: "Visit maisonelara.com/second-life with your order number. We'll send you a prepaid shipping label. Once we receive and authenticate your piece, it goes live in the Second Life shop within 48 hours. You receive 85% of the sale price as store credit or a bank transfer.",
                },
              ]}
            />
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="sust-cta">
          <div className="sust-cta-bg" />
          <div className="sust-cta-inner">
            <Reveal>
              <span className="sust-eyebrow" style={{ color: "rgba(250,247,242,0.6)" }}>Join Us</span>
              <h2 className="sust-cta-title">
                Wear less.<br />
                <em>Choose well.</em><br />
                Make it last.
              </h2>
              <p className="sust-cta-sub">
                Every piece you choose from Maison Elara is a vote for a
                different kind of fashion industry.
              </p>
              <div className="sust-cta-actions">
                <Link href="/shop" className="btn-primary">Shop the Collection</Link>
                <Link href="/about" className="sust-cta-ghost">Our Story →</Link>
              </div>
            </Reveal>
          </div>
        </section>

      </main>

      <Footer />

      <style>{`
        /* ── Shared ── */
        .sust-page { overflow-x: hidden; }
        .sust-eyebrow {
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 16px;
        }
        .sust-section-title {
          font-family: var(--font-display);
          font-size: clamp(32px, 3.5vw, 48px);
          font-weight: 400;
          line-height: 1.1;
          color: var(--charcoal);
          margin-bottom: 28px;
        }
        .sust-section-title em { font-style: italic; color: var(--gold); }
        .sust-section-label {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 56px;
          justify-content: center;
        }
        .sust-label-line { flex: none; width: 48px; height: 1px; background: var(--border); }
        .sust-section-label span {
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--muted);
          white-space: nowrap;
        }
        .sust-sep { color: var(--border); }

        /* ── Hero ── */
        .sust-hero {
          position: relative;
          min-height: 90vh;
          display: flex;
          align-items: center;
          overflow: hidden;
          border-bottom: 1px solid var(--border);
        }
        .sust-hero-bg {
          position: absolute;
          inset: 0;
          background: linear-gradient(155deg,#f0ebe0 0%,#e0eed8 60%,#d8e8d0 100%);
        }
        .sust-hero-grid-lines {
          position: absolute;
          inset: 0;
          display: flex;
          gap: 0;
          pointer-events: none;
          z-index: 0;
        }
        .sust-grid-line {
          flex: 1;
          border-right: 1px solid rgba(180,200,180,0.22);
          animation: sust-line-in 1.2s ease both;
          transform-origin: top;
        }
        @keyframes sust-line-in {
          from { transform: scaleY(0); opacity: 0; }
          to { transform: scaleY(1); opacity: 1; }
        }

        .sust-hero-inner {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          padding: 80px 60px 60px;
          width: 100%;
          align-items: center;
        }
        .sust-hero-text {}
        .sust-breadcrumb {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 24px;
          animation: fadeUp 0.8s ease both;
        }
        .sust-breadcrumb a:hover { color: var(--gold); transition: color 0.2s; }

        .sust-hero-title {
          font-family: var(--font-display);
          font-size: clamp(44px, 5.5vw, 76px);
          font-weight: 400;
          line-height: 1.04;
          color: var(--charcoal);
          margin-bottom: 28px;
          animation: fadeUp 0.8s 0.1s ease both;
        }
        .sust-hero-title em { font-style: italic; color: #5a8a5a; }
        .sust-hero-lead {
          font-family: var(--font-editorial);
          font-size: 18px;
          font-weight: 300;
          color: var(--muted);
          line-height: 1.8;
          max-width: 440px;
          margin-bottom: 40px;
          animation: fadeUp 0.8s 0.2s ease both;
        }
        .sust-hero-cta {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          animation: fadeUp 0.8s 0.3s ease both;
        }

        /* Hero imagery */
        .sust-hero-imagery {
          position: relative;
          height: 68vh;
          animation: fadeUp 0.8s 0.2s ease both;
        }
        .sust-hero-img {
          position: absolute;
          border-radius: 2px;
          overflow: hidden;
        }
        .sust-hero-img-main {
          width: 76%;
          height: 86%;
          top: 0; right: 0;
          display: flex;
          align-items: flex-end;
        }
        .sust-hero-img-caption {
          padding: 16px 20px;
          background: rgba(26,26,26,0.6);
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(250,247,242,0.7);
        }
        .sust-caption-line { width: 24px; height: 1px; background: var(--gold); flex-shrink: 0; }
        .sust-hero-img-sm1 {
          width: 44%;
          height: 40%;
          bottom: 0; left: 0;
          border: 8px solid #f0ebe0;
        }
        .sust-hero-img-sm2 {
          width: 30%;
          height: 28%;
          bottom: 28%;
          right: 2%;
          border: 6px solid #f0ebe0;
          z-index: 2;
        }
        .sust-hero-badge {
          position: absolute;
          bottom: 48%;
          left: 36%;
          z-index: 3;
          background: #1a1a1a;
          padding: 16px 20px;
          border: 1px solid rgba(201,169,110,0.4);
        }
        .sust-badge-inner { display: flex; flex-direction: column; align-items: center; gap: 2px; }
        .sust-badge-icon { font-size: 12px; color: var(--gold); margin-bottom: 4px; }
        .sust-badge-text { font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(250,247,242,0.5); }
        .sust-badge-num { font-family: var(--font-display); font-size: 22px; font-weight: 400; color: var(--gold); line-height: 1.1; }
        .sust-badge-year { font-size: 10px; letter-spacing: 0.1em; color: rgba(250,247,242,0.4); }

        /* ── Manifesto ── */
        .sust-manifesto {
          background: #1a2a1a;
          padding: 72px 60px;
        }
        .sust-manifesto-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 28px;
          max-width: 720px;
          margin: 0 auto;
          text-align: center;
        }
        .sust-manifesto-line { width: 48px; height: 1px; background: rgba(180,200,180,0.4); }
        .sust-manifesto-quote {
          font-family: var(--font-editorial);
          font-size: clamp(20px, 2.5vw, 30px);
          font-style: italic;
          font-weight: 300;
          color: rgba(220,235,220,0.88);
          line-height: 1.65;
        }
        .sust-manifesto-attr {
          font-size: 12px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(180,200,180,0.55);
        }

        /* ── Impact ── */
        .sust-impact {
          padding: 88px 60px;
          background: var(--cream);
        }
        .sust-impact-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2px;
          background: var(--border);
          border: 1px solid var(--border);
        }
        .sust-impact-card { background: var(--cream); }
        .sust-impact-card-inner {
          padding: 36px 32px;
          height: 100%;
          display: flex;
          flex-direction: column;
          gap: 0;
          transition: background 0.2s;
        }
        .sust-impact-card:hover .sust-impact-card-inner { background: var(--cream-dark); }
        .sust-impact-accent { width: 24px; height: 2px; margin-bottom: 20px; }
        .sust-impact-num {
          font-family: var(--font-display);
          font-size: clamp(40px, 4vw, 56px);
          font-weight: 400;
          line-height: 1;
          margin-bottom: 12px;
        }
        .sust-impact-label {
          font-family: var(--font-display);
          font-size: 18px;
          font-weight: 400;
          color: var(--charcoal);
          margin-bottom: 10px;
        }
        .sust-impact-sub {
          font-family: var(--font-editorial);
          font-size: 14px;
          font-weight: 300;
          color: var(--muted);
          line-height: 1.7;
        }

        /* ── Pillars ── */
        .sust-pillars {
          position: relative;
          padding: 88px 60px;
          overflow: hidden;
        }
        .sust-pillars-bg {
          position: absolute;
          inset: 0;
          background: var(--cream-dark);
        }
        .sust-pillars-inner { position: relative; z-index: 1; }
        .sust-pillars-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2px;
          background: var(--border);
          border: 1px solid var(--border);
          margin-top: 48px;
        }
        .sust-pillar {
          background: var(--cream);
          padding: 44px 40px;
          transition: background 0.2s;
        }
        .sust-pillar:hover { background: #f5f0e8; }
        .sust-pillar-num {
          font-family: var(--font-display);
          font-size: 13px;
          letter-spacing: 0.12em;
          color: var(--border);
          margin-bottom: 20px;
        }
        .sust-pillar-icon-wrap {
          color: var(--gold);
          margin-bottom: 20px;
        }
        .sust-pillar-title {
          font-family: var(--font-display);
          font-size: 22px;
          font-weight: 400;
          color: var(--charcoal);
          margin-bottom: 14px;
        }
        .sust-pillar-body {
          font-family: var(--font-editorial);
          font-size: 15px;
          font-weight: 300;
          color: var(--muted);
          line-height: 1.8;
          margin-bottom: 28px;
        }
        .sust-pillar-metrics { display: flex; flex-direction: column; gap: 12px; }
        .sust-pillar-metric {}
        .sust-pillar-metric span {
          display: block;
          font-size: 11px;
          letter-spacing: 0.06em;
          color: var(--muted);
          margin-bottom: 5px;
        }
        .sust-progress-track {
          height: 3px;
          background: var(--border);
        }
        .sust-progress-fill { height: 100%; }

        /* ── Certifications ── */
        .sust-certs {
          padding: 88px 60px;
          background: var(--cream);
        }
        .sust-certs-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2px;
          background: var(--border);
          border: 1px solid var(--border);
        }
        .sust-cert-card {
          background: var(--cream);
          padding: 40px 36px;
          position: relative;
          overflow: hidden;
          transition: background 0.22s;
        }
        .sust-cert-card:hover { background: var(--cream-dark); }
        .sust-cert-icon {
          font-size: 22px;
          margin-bottom: 18px;
          display: block;
        }
        .sust-cert-name {
          font-family: var(--font-display);
          font-size: 18px;
          font-weight: 400;
          color: var(--charcoal);
          margin-bottom: 5px;
        }
        .sust-cert-full {
          display: block;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 14px;
        }
        .sust-cert-desc {
          font-family: var(--font-editorial);
          font-size: 14px;
          font-weight: 300;
          color: var(--muted);
          line-height: 1.75;
          margin-bottom: 20px;
        }
        .sust-cert-bar {
          position: absolute;
          bottom: 0; left: 0;
          height: 2px;
          width: 0;
          transition: width 0.5s ease;
        }
        .sust-cert-card:hover .sust-cert-bar { width: 100%; }

        /* ── Supply Chain ── */
        .sust-supply {
          padding: 88px 60px;
          background: var(--cream-dark);
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
        }
        .sust-supply-inner {
          display: grid;
          grid-template-columns: 1fr 1.1fr;
          gap: 80px;
          align-items: start;
        }
        .sust-supply-body {
          font-family: var(--font-editorial);
          font-size: 16px;
          font-weight: 300;
          color: var(--muted);
          line-height: 1.85;
          margin-bottom: 20px;
        }
        .sust-supply-list {
          margin-top: 36px;
          border: 1px solid var(--border);
        }
        .sust-supply-item {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 16px 20px;
          border-bottom: 1px solid var(--border);
          background: var(--cream);
          transition: background 0.15s;
        }
        .sust-supply-item:last-child { border-bottom: none; }
        .sust-supply-item:hover { background: #f5f0e8; }
        .sust-supply-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--gold);
          flex-shrink: 0;
          margin-top: 6px;
        }
        .sust-supply-item-text { display: flex; flex-direction: column; gap: 3px; }
        .sust-supply-item-top { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
        .sust-supply-name { font-size: 14px; color: var(--charcoal); font-weight: 400; }
        .sust-supply-year { font-size: 11px; color: var(--muted); white-space: nowrap; }
        .sust-supply-place { font-size: 12px; color: var(--muted); letter-spacing: 0.04em; }

        /* Map */
        .sust-supply-map {
          position: sticky;
          top: 100px;
        }
        .sust-map-bg {
          width: 100%;
          height: 480px;
          border-radius: 2px;
          position: relative;
          overflow: hidden;
        }
        .sust-map-dot {
          position: absolute;
          transform: translate(-50%, -50%);
          z-index: 2;
        }
        .sust-map-dot-inner {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--gold);
          border: 2px solid white;
          box-shadow: 0 0 0 4px rgba(201,169,110,0.25);
          animation: sust-pulse 2s infinite;
        }
        @keyframes sust-pulse {
          0%, 100% { box-shadow: 0 0 0 4px rgba(201,169,110,0.25); }
          50% { box-shadow: 0 0 0 8px rgba(201,169,110,0.1); }
        }
        .sust-map-dot-label {
          position: absolute;
          top: 18px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 10px;
          letter-spacing: 0.08em;
          color: var(--charcoal);
          background: white;
          padding: 3px 8px;
          white-space: nowrap;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        .sust-map-label {
          position: absolute;
          bottom: 16px;
          left: 16px;
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(0,0,0,0.4);
        }

        /* ── Circular ── */
        .sust-circular {
          padding: 88px 60px;
          background: var(--cream);
        }
        .sust-circular-header { margin-bottom: 52px; }
        .sust-circular-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2px;
          background: var(--border);
          border: 1px solid var(--border);
        }
        .sust-circular-card {
          background: var(--cream);
          padding: 44px 36px;
          position: relative;
          transition: background 0.2s;
        }
        .sust-circular-card:hover { background: var(--cream-dark); }
        .sust-circular-card-dark {
          background: var(--charcoal);
          color: var(--cream);
        }
        .sust-circular-card-dark:hover { background: #2a2a2a; }
        .sust-circular-card-num {
          font-family: var(--font-display);
          font-size: 12px;
          letter-spacing: 0.14em;
          color: var(--border);
          margin-bottom: 20px;
        }
        .sust-circular-card-dark .sust-circular-card-num { color: rgba(255,255,255,0.15); }
        .sust-circular-icon {
          font-size: 28px;
          color: rgba(250,247,242,0.7);
          margin-bottom: 20px;
          display: block;
        }
        .sust-circular-title {
          font-family: var(--font-display);
          font-size: 22px;
          font-weight: 400;
          color: var(--cream);
          margin-bottom: 14px;
        }
        .sust-circular-card:not(.sust-circular-card-dark) .sust-circular-title { color: var(--charcoal); }
        .sust-circular-body {
          font-family: var(--font-editorial);
          font-size: 15px;
          font-weight: 300;
          color: rgba(250,247,242,0.6);
          line-height: 1.8;
          margin-bottom: 28px;
        }
        .sust-circular-card:not(.sust-circular-card-dark) .sust-circular-body { color: var(--muted); }
        .sust-circular-link {
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(250,247,242,0.7);
          border-bottom: 1px solid rgba(250,247,242,0.3);
          padding-bottom: 2px;
          transition: all 0.2s;
        }
        .sust-circular-link:hover { color: var(--gold); border-color: var(--gold); }
        .sust-circular-card:not(.sust-circular-card-dark) .sust-circular-link {
          color: var(--charcoal-light);
          border-color: var(--border);
        }
        .sust-circular-card:not(.sust-circular-card-dark) .sust-circular-link:hover { color: var(--gold); border-color: var(--gold); }

        /* ── Report ── */
        .sust-report {
          padding: 88px 60px;
          background: var(--cream-dark);
          border-top: 1px solid var(--border);
        }
        .sust-report-inner {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }
        .sust-report-body {
          font-family: var(--font-editorial);
          font-size: 16px;
          font-weight: 300;
          color: var(--muted);
          line-height: 1.85;
          margin-bottom: 20px;
        }
        .sust-report-actions { display: flex; gap: 14px; margin-top: 12px; flex-wrap: wrap; }

        /* Report card */
        .sust-report-card {
          background: var(--charcoal);
          padding: 0;
          overflow: hidden;
        }
        .sust-report-card-header {
          padding: 32px 32px 28px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .sust-report-card-eyebrow {
          display: block;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 8px;
        }
        .sust-report-card-title {
          font-family: var(--font-display);
          font-size: 22px;
          font-weight: 400;
          color: rgba(250,247,242,0.92);
          margin-bottom: 6px;
        }
        .sust-report-card-sub {
          font-size: 12px;
          color: rgba(250,247,242,0.35);
          letter-spacing: 0.06em;
        }
        .sust-report-card-stats {
          padding: 8px 0;
        }
        .sust-report-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 32px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          gap: 16px;
        }
        .sust-report-row:last-child { border-bottom: none; }
        .sust-report-row-label { font-size: 13px; color: rgba(250,247,242,0.45); }
        .sust-report-row-val { font-size: 13px; color: rgba(250,247,242,0.85); font-weight: 500; white-space: nowrap; }
        .sust-report-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 32px;
          background: rgba(255,255,255,0.04);
          border-top: 1px solid rgba(255,255,255,0.08);
          font-size: 11px;
          color: rgba(250,247,242,0.3);
          letter-spacing: 0.04em;
          gap: 12px;
        }
        .sust-report-card-check { color: #6aaa6a; white-space: nowrap; }

        /* ── FAQ ── */
        .sust-faq {
          padding: 80px 60px;
          background: var(--cream);
          border-top: 1px solid var(--border);
        }
        .sust-faq-inner { max-width: 760px; margin: 0 auto; }
        .sust-accordion { }
        .sust-accordion-item {
          border-bottom: 1px solid var(--border);
        }
        .sust-accordion-trigger {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 0;
          font-size: 15px;
          color: var(--charcoal);
          text-align: left;
          gap: 16px;
          background: none;
          border: none;
          cursor: pointer;
          font-family: var(--font-body);
          transition: color 0.2s;
        }
        .sust-accordion-trigger:hover { color: var(--gold); }
        .sust-accordion-icon {
          font-size: 20px;
          color: var(--muted);
          flex-shrink: 0;
          line-height: 1;
        }
        .sust-accordion-body {
          overflow: hidden;
          transition: max-height 0.35s cubic-bezier(0.4,0,0.2,1);
        }
        .sust-accordion-body p {
          font-family: var(--font-editorial);
          font-size: 15px;
          font-weight: 300;
          color: var(--muted);
          line-height: 1.8;
          padding-bottom: 20px;
        }
        .sust-accordion-open .sust-accordion-trigger { color: var(--charcoal); }

        /* ── CTA ── */
        .sust-cta {
          position: relative;
          padding: 100px 60px;
          overflow: hidden;
          text-align: center;
        }
        .sust-cta-bg {
          position: absolute;
          inset: 0;
          background: linear-gradient(155deg,#1a2a1a 0%,#0d1a0d 100%);
        }
        .sust-cta-inner { position: relative; z-index: 1; max-width: 540px; margin: 0 auto; }
        .sust-cta-title {
          font-family: var(--font-display);
          font-size: clamp(40px, 5vw, 68px);
          font-weight: 400;
          line-height: 1.08;
          color: rgba(220,235,220,0.92);
          margin-bottom: 20px;
        }
        .sust-cta-title em { font-style: italic; color: #8aba8a; }
        .sust-cta-sub {
          font-family: var(--font-editorial);
          font-size: 17px;
          font-weight: 300;
          color: rgba(180,200,180,0.6);
          line-height: 1.75;
          margin-bottom: 40px;
        }
        .sust-cta-actions { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
        .sust-cta-ghost {
          font-size: 12px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(180,200,180,0.7);
          border-bottom: 1px solid rgba(180,200,180,0.3);
          padding-bottom: 2px;
          display: inline-flex;
          align-items: center;
          transition: all 0.2s;
        }
        .sust-cta-ghost:hover { color: rgba(220,235,220,0.9); border-color: rgba(220,235,220,0.5); }

        /* ── Responsive ── */
        @media (max-width: 1100px) {
          .sust-hero-inner { grid-template-columns: 1fr 1fr; padding: 60px 40px; gap: 40px; }
          .sust-supply-inner { grid-template-columns: 1fr 1fr; gap: 48px; }
          .sust-report-inner { grid-template-columns: 1fr 1fr; gap: 48px; }
          .sust-pillars-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 900px) {
          .sust-hero-inner { grid-template-columns: 1fr; }
          .sust-hero-imagery { display: none; }
          .sust-impact-grid { grid-template-columns: repeat(2, 1fr); }
          .sust-certs-grid { grid-template-columns: repeat(2, 1fr); }
          .sust-supply-inner { grid-template-columns: 1fr; }
          .sust-supply-map { display: none; }
          .sust-circular-grid { grid-template-columns: 1fr; }
          .sust-report-inner { grid-template-columns: 1fr; }
          .sust-pillars-grid { grid-template-columns: 1fr; }
          .sust-hero, .sust-manifesto, .sust-impact, .sust-pillars,
          .sust-certs, .sust-supply, .sust-circular, .sust-report,
          .sust-faq, .sust-cta {
            padding-left: 40px;
            padding-right: 40px;
          }
        }
        @media (max-width: 640px) {
          .sust-hero, .sust-manifesto, .sust-impact, .sust-pillars,
          .sust-certs, .sust-supply, .sust-circular, .sust-report,
          .sust-faq, .sust-cta {
            padding-left: 20px;
            padding-right: 20px;
          }
          .sust-impact-grid { grid-template-columns: 1fr; }
          .sust-certs-grid { grid-template-columns: 1fr; }
          .sust-hero-inner { padding-top: 48px; padding-bottom: 48px; }
          .sust-report-card-footer { flex-direction: column; align-items: flex-start; gap: 4px; }
        }
      `}</style>
    </>
  );
}