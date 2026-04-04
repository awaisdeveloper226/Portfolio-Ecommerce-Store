"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ─── Animated Counter ─────────────────────────────────────────────────────────
function Counter({
  target,
  suffix = "",
  duration = 1800,
}: {
  target: number;
  suffix?: string;
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
      {count}
      {suffix}
    </span>
  );
}

// ─── Timeline Entry ───────────────────────────────────────────────────────────
function TimelineEntry({
  year,
  title,
  body,
  accent,
  align,
}: {
  year: string;
  title: string;
  body: string;
  accent: string;
  align: "left" | "right";
}) {
  return (
    <div
      className={`timeline-entry timeline-entry-${align}`}
      style={{ "--accent": accent } as React.CSSProperties}
    >
      <div className="timeline-year">{year}</div>
      <div className="timeline-dot" />
      <div className="timeline-content">
        <h3 className="timeline-title">{title}</h3>
        <p className="timeline-body">{body}</p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AboutPage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="about-page">

        {/* ── Hero ── */}
        <section className="about-hero">
          <div className="about-hero-bg" />
          <div className="about-hero-inner">
            <span className="about-eyebrow">Our Story</span>
            <h1 className="about-hero-title">
              Dressed with <em>purpose</em>,<br />
              worn with <em>grace.</em>
            </h1>
            <p className="about-hero-lead">
              Maison Elara was born from a single conviction — that luxury
              should never cost the earth.
            </p>
            <div className="about-hero-scroll">
              <span className="scroll-label">Scroll</span>
              <div className="scroll-line" />
            </div>
          </div>
          {/* Decorative image blocks */}
          <div className="about-hero-images">
            <div
              className="about-hero-img about-hero-img-1"
              style={{ background: "linear-gradient(150deg,#e8ddd0 0%,#d4c4b0 100%)" }}
            >
              <span className="img-label-float">Paris, 2019</span>
            </div>
            <div
              className="about-hero-img about-hero-img-2"
              style={{ background: "linear-gradient(150deg,#c8d5c8 0%,#b0c4b4 100%)" }}
            />
            <div
              className="about-hero-img about-hero-img-3"
              style={{ background: "linear-gradient(150deg,#d0c8d5 0%,#b8b0c4 100%)" }}
            />
          </div>
        </section>

        {/* ── Manifesto ── */}
        <section className="about-manifesto">
          <div className="manifesto-inner">
            <div className="manifesto-line" />
            <blockquote className="manifesto-quote">
              &ldquo;We believe that the most radical act in fashion is to buy
              less, choose well, and make it last.&rdquo;
            </blockquote>
            <p className="manifesto-attr">— Elara Voss, Founder</p>
            <div className="manifesto-line" />
          </div>
        </section>

        {/* ── Stats ── */}
        <section className="about-stats">
          <div className="stats-grid">
            {[
              { value: 340, suffix: "+", label: "Timeless Pieces" },
              { value: 12, suffix: "", label: "Artisan Partners" },
              { value: 48, suffix: "h", label: "Delivery Promise" },
              { value: 100, suffix: "%", label: "Sustainable Fabrics" },
            ].map((s) => (
              <div key={s.label} className="stat-block">
                <div className="stat-block-num">
                  <Counter target={s.value} suffix={s.suffix} />
                </div>
                <div className="stat-block-label">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Founding Story ── */}
        <section className="about-founding">
          <div className="founding-inner">
            <div className="founding-imagery">
              <div
                className="founding-img founding-img-main"
                style={{ background: "linear-gradient(160deg,#d4c4b0 0%,#c0ae98 100%)" }}
              >
                <div className="founding-img-caption">Atelier, Lyon · 2019</div>
              </div>
              <div
                className="founding-img founding-img-secondary"
                style={{ background: "linear-gradient(160deg,#b8ccc4 0%,#a0b8b0 100%)" }}
              />
              <div className="founding-ornament">✦</div>
            </div>
            <div className="founding-text">
              <span className="about-section-eyebrow">The Beginning</span>
              <h2 className="about-section-title">
                A Parisian atelier,
                <br />
                <em>a quiet revolution.</em>
              </h2>
              <p className="about-section-body">
                Elara Voss spent fifteen years as a pattern maker for some of
                Europe&apos;s most storied fashion houses. She watched
                extraordinary fabrics discarded, artisan skills left unvalued,
                and the cycle of fast fashion accelerating beyond reason.
              </p>
              <p className="about-section-body">
                In 2019, she left Paris to open a small atelier in Lyon, with
                a mandate to do the opposite: source deliberately, craft
                slowly, price honestly, and build pieces that outlive every
                trend.
              </p>
              <p className="about-section-body">
                What began as twelve debut pieces sent to 40 subscribers has
                grown into a community of 80,000 women across 28 countries —
                all united by the same quiet conviction.
              </p>
              <Link href="/shop" className="btn-primary">
                Explore the Collection
              </Link>
            </div>
          </div>
        </section>

        {/* ── Values ── */}
        <section className="about-values">
          <div className="values-header">
            <div className="section-header-line" />
            <h2 className="section-title">What We Stand For</h2>
            <div className="section-header-line" />
          </div>
          <div className="values-grid">
            {[
              {
                icon: "✦",
                title: "Radical Transparency",
                body: "Every price tag on our website shows you exactly what you're paying for: materials, labour, duties, and our margin. No mystification.",
                accent: "#c9a96e",
              },
              {
                icon: "◈",
                title: "Artisan Partnership",
                body: "We work with 12 family-run ateliers across Portugal, Italy, and Japan. Long-term contracts, fair wages, no seasonal cancellations.",
                accent: "#b8c4bb",
              },
              {
                icon: "◇",
                title: "Fabric First",
                body: "Every fibre is GOTS-certified organic, OEKO-TEX 100 verified, or reclaimed deadstock. We never compromise on what touches your skin.",
                accent: "#d4b5a0",
              },
              {
                icon: "○",
                title: "Slow Fashion, Real Fashion",
                body: "We launch two considered collections a year — not 52. Each piece is tested through 120 wear cycles before it earns a place in our range.",
                accent: "#9aacb0",
              },
              {
                icon: "△",
                title: "Climate Action",
                body: "We offset 110% of our carbon footprint, give 1% of revenue to reforestation initiatives, and ship in fully compostable packaging.",
                accent: "#c4b5d4",
              },
              {
                icon: "□",
                title: "The Right to Repair",
                body: "Buy once, wear forever. Every Maison Elara piece comes with a lifetime repair guarantee. Send it back, we'll restore it.",
                accent: "#d4c4a0",
              },
            ].map((v) => (
              <div
                key={v.title}
                className="value-card"
                style={{ "--v-accent": v.accent } as React.CSSProperties}
              >
                <div className="value-icon">{v.icon}</div>
                <h3 className="value-title">{v.title}</h3>
                <p className="value-body">{v.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Timeline ── */}
        <section className="about-timeline">
          <div className="timeline-header">
            <span className="about-section-eyebrow" style={{ textAlign: "center", display: "block" }}>
              Our Journey
            </span>
            <h2 className="about-section-title" style={{ textAlign: "center", marginBottom: 0 }}>
              Five years of <em>quiet growth.</em>
            </h2>
          </div>
          <div className="timeline-track">
            <div className="timeline-spine" />
            <TimelineEntry
              year="2019"
              title="The First Twelve"
              body="Elara leaves her role as head pattern maker at a Paris maison and launches Maison Elara with twelve debut pieces and a waiting list of 40 subscribers."
              accent="#c9a96e"
              align="left"
            />
            <TimelineEntry
              year="2020"
              title="The Linen Edit"
              body="Our first dedicated fabric capsule — 18 pieces in certified organic Irish linen — sells out in 72 hours and earns our first press coverage in Vogue France."
              accent="#b8c4bb"
              align="right"
            />
            <TimelineEntry
              year="2021"
              title="Atelier Network"
              body="We formalise long-term partnerships with artisan workshops in Porto, Florence, and Kyoto. Every partner signs our Ethical Maker Charter."
              accent="#d4b5a0"
              align="left"
            />
            <TimelineEntry
              year="2022"
              title="Carbon Neutral"
              body="Maison Elara achieves verified carbon neutrality across Scope 1, 2 and 3 emissions. We offset 110% and publish our full impact report annually."
              accent="#9aacb0"
              align="right"
            />
            <TimelineEntry
              year="2023"
              title="80,000 Women"
              body="Our community crosses 80,000 members across 28 countries. We launch the Lifetime Repair Programme and our first resale platform, Elara Second Life."
              accent="#c4b5d4"
              align="left"
            />
            <TimelineEntry
              year="2024"
              title="The Next Chapter"
              body="We open our first physical atelier-boutique in London's Marylebone. The space doubles as a repair studio, community space, and exhibition venue."
              accent="#c9a96e"
              align="right"
            />
          </div>
        </section>

        {/* ── Team ── */}
        <section className="about-team">
          <div className="team-header">
            <div className="section-header-line" />
            <h2 className="section-title">The People</h2>
            <div className="section-header-line" />
          </div>
          <div className="team-grid">
            {[
              {
                name: "Elara Voss",
                role: "Founder & Creative Director",
                bio: "15 years in Parisian haute couture before building something she truly believed in.",
                color: "#e8d5c0",
              },
              {
                name: "Mariko Tanaka",
                role: "Head of Textiles",
                bio: "Former researcher at the Textile Exchange, obsessed with fibre traceability.",
                color: "#c8d5c8",
              },
              {
                name: "Céleste Arnaud",
                role: "Lead Pattern Maker",
                bio: "Trained at Studio Berçot. Believes a perfect fit is an act of respect.",
                color: "#d0c8d5",
              },
              {
                name: "Kwame Asante",
                role: "Head of Supply Chain",
                bio: "Pioneered ethical sourcing at two B-Corp certified apparel brands before joining Elara.",
                color: "#c8d5e0",
              },
            ].map((person) => (
              <div key={person.name} className="team-card">
                <div
                  className="team-portrait"
                  style={{ background: person.color }}
                >
                  <span className="portrait-placeholder">Portrait</span>
                </div>
                <div className="team-info">
                  <h3 className="team-name">{person.name}</h3>
                  <span className="team-role">{person.role}</span>
                  <p className="team-bio">{person.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Press ── */}
        <section className="about-press">
          <div className="press-inner">
            <span className="about-section-eyebrow" style={{ textAlign: "center", display: "block" }}>
              As Seen In
            </span>
            <div className="press-logos">
              {["Vogue", "The Times", "Wallpaper*", "Monocle", "Dezeen", "Harper's Bazaar"].map(
                (pub) => (
                  <div key={pub} className="press-logo">
                    {pub}
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="about-cta">
          <div className="about-cta-inner">
            <div
              className="about-cta-img"
              style={{ background: "linear-gradient(135deg,#e8ddd0 0%,#c0ae98 100%)" }}
            />
            <div className="about-cta-text">
              <span className="about-section-eyebrow">Join Us</span>
              <h2 className="about-section-title">
                Ready to wear
                <br />
                <em>with intention?</em>
              </h2>
              <p className="about-section-body">
                Explore pieces made to last a lifetime — for a woman who knows
                exactly who she is.
              </p>
              <div className="cta-actions">
                <Link href="/shop" className="btn-primary">
                  Shop the Collection
                </Link>
                <Link href="/sustainability" className="btn-ghost">
                  Our Sustainability Report
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <style>{`
        /* ── About Page Layout ── */
        .about-page {
          overflow-x: hidden;
        }

        /* ── Hero ── */
        .about-hero {
          position: relative;
          min-height: 92vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          padding: 80px 60px 60px;
          gap: 60px;
          overflow: hidden;
        }
        .about-hero-bg {
          position: absolute;
          inset: 0;
          background: var(--cream-dark);
          z-index: 0;
        }
        .about-hero-inner {
          position: relative;
          z-index: 1;
        }
        .about-eyebrow {
          display: block;
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 28px;
          animation: fadeUp 0.8s ease both;
        }
        .about-hero-title {
          font-family: var(--font-display);
          font-size: clamp(44px, 5.5vw, 76px);
          font-weight: 400;
          line-height: 1.05;
          color: var(--charcoal);
          margin-bottom: 28px;
          animation: fadeUp 0.8s 0.1s ease both;
        }
        .about-hero-title em {
          font-style: italic;
          color: var(--gold);
        }
        .about-hero-lead {
          font-family: var(--font-editorial);
          font-size: 19px;
          font-weight: 300;
          color: var(--muted);
          line-height: 1.75;
          max-width: 420px;
          margin-bottom: 48px;
          animation: fadeUp 0.8s 0.2s ease both;
        }
        .about-hero-scroll {
          display: flex;
          align-items: center;
          gap: 16px;
          animation: fadeUp 0.8s 0.35s ease both;
        }
        .scroll-label {
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--muted);
        }
        .scroll-line {
          width: 60px;
          height: 1px;
          background: var(--gold);
          transform-origin: left;
          animation: growLine 1.2s 0.5s ease both;
        }
        @keyframes growLine {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }

        /* Hero Image Collage */
        .about-hero-images {
          position: relative;
          height: 70vh;
          z-index: 1;
          animation: fadeUp 0.8s 0.25s ease both;
        }
        .about-hero-img {
          position: absolute;
          border-radius: 3px;
        }
        .about-hero-img-1 {
          width: 72%;
          height: 80%;
          top: 0;
          right: 0;
          display: flex;
          align-items: flex-end;
          padding: 20px;
        }
        .about-hero-img-2 {
          width: 42%;
          height: 44%;
          bottom: 0;
          left: 0;
          border: 8px solid var(--cream-dark);
        }
        .about-hero-img-3 {
          width: 30%;
          height: 26%;
          bottom: 28%;
          right: 4%;
          border: 6px solid var(--cream-dark);
        }
        .img-label-float {
          background: var(--charcoal);
          color: var(--cream);
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 8px 14px;
        }

        /* ── Manifesto ── */
        .about-manifesto {
          padding: 80px 60px;
          background: var(--charcoal);
        }
        .manifesto-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 28px;
          text-align: center;
          max-width: 700px;
          margin: 0 auto;
        }
        .manifesto-line {
          width: 48px;
          height: 1px;
          background: var(--gold);
        }
        .manifesto-quote {
          font-family: var(--font-editorial);
          font-size: clamp(20px, 2.5vw, 30px);
          font-style: italic;
          font-weight: 300;
          color: rgba(250, 247, 242, 0.88);
          line-height: 1.6;
        }
        .manifesto-attr {
          font-size: 12px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--gold);
        }

        /* ── Stats ── */
        .about-stats {
          padding: 64px 60px;
          border-bottom: 1px solid var(--border);
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
        }
        .stat-block {
          text-align: center;
          padding: 24px;
          border-right: 1px solid var(--border);
        }
        .stat-block:last-child {
          border-right: none;
        }
        .stat-block-num {
          font-family: var(--font-display);
          font-size: clamp(40px, 4vw, 60px);
          font-weight: 400;
          color: var(--charcoal);
          margin-bottom: 8px;
        }
        .stat-block-label {
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--muted);
        }

        /* ── Founding ── */
        .about-founding {
          padding: 100px 60px;
        }
        .founding-inner {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }
        .founding-imagery {
          position: relative;
          height: 580px;
        }
        .founding-img {
          position: absolute;
          border-radius: 2px;
        }
        .founding-img-main {
          width: 78%;
          height: 85%;
          top: 0;
          left: 0;
          display: flex;
          align-items: flex-end;
          padding: 0;
          overflow: hidden;
        }
        .founding-img-caption {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(26,26,26,0.72);
          color: rgba(250,247,242,0.8);
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 12px 16px;
        }
        .founding-img-secondary {
          width: 52%;
          height: 48%;
          bottom: 0;
          right: 0;
          border: 8px solid var(--cream);
        }
        .founding-ornament {
          position: absolute;
          top: 46%;
          right: 24%;
          font-size: 32px;
          color: var(--gold);
          line-height: 1;
          background: var(--cream);
          padding: 8px;
        }
        .about-section-eyebrow {
          display: block;
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 16px;
        }
        .about-section-title {
          font-family: var(--font-display);
          font-size: clamp(30px, 3vw, 44px);
          font-weight: 400;
          line-height: 1.12;
          color: var(--charcoal);
          margin-bottom: 28px;
        }
        .about-section-title em {
          font-style: italic;
          color: var(--gold);
        }
        .about-section-body {
          font-family: var(--font-editorial);
          font-size: 17px;
          font-weight: 300;
          color: var(--muted);
          line-height: 1.8;
          margin-bottom: 20px;
        }

        /* ── Values ── */
        .about-values {
          padding: 80px 60px;
          background: var(--cream-dark);
        }
        .values-header {
          display: flex;
          align-items: center;
          gap: 24px;
          margin-bottom: 56px;
        }
        .values-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2px;
          background: var(--border);
          border: 1px solid var(--border);
        }
        .value-card {
          background: var(--cream);
          padding: 40px 36px;
          transition: background 0.25s;
        }
        .value-card:hover {
          background: var(--cream-dark);
        }
        .value-icon {
          font-size: 20px;
          color: var(--v-accent, var(--gold));
          margin-bottom: 20px;
          display: block;
        }
        .value-title {
          font-family: var(--font-display);
          font-size: 18px;
          font-weight: 400;
          color: var(--charcoal);
          margin-bottom: 12px;
        }
        .value-body {
          font-family: var(--font-editorial);
          font-size: 15px;
          font-weight: 300;
          color: var(--muted);
          line-height: 1.75;
        }

        /* ── Timeline ── */
        .about-timeline {
          padding: 100px 60px;
        }
        .timeline-header {
          margin-bottom: 72px;
        }
        .timeline-header .about-section-eyebrow {
          margin-bottom: 12px;
        }
        .timeline-track {
          position: relative;
          max-width: 900px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .timeline-spine {
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 1px;
          background: var(--border);
          transform: translateX(-50%);
        }
        .timeline-entry {
          display: grid;
          grid-template-columns: 1fr 32px 1fr;
          align-items: start;
          gap: 0;
          padding: 32px 0;
        }
        .timeline-entry-left .timeline-year {
          grid-column: 1;
          text-align: right;
          padding-right: 32px;
          order: 1;
        }
        .timeline-entry-left .timeline-dot {
          grid-column: 2;
          order: 2;
        }
        .timeline-entry-left .timeline-content {
          grid-column: 3;
          padding-left: 32px;
          order: 3;
        }
        .timeline-entry-right .timeline-content {
          grid-column: 1;
          text-align: right;
          padding-right: 32px;
          order: 1;
        }
        .timeline-entry-right .timeline-dot {
          grid-column: 2;
          order: 2;
        }
        .timeline-entry-right .timeline-year {
          grid-column: 3;
          padding-left: 32px;
          order: 3;
        }
        .timeline-year {
          font-family: var(--font-display);
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.12em;
          color: var(--accent, var(--gold));
          padding-top: 4px;
        }
        .timeline-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--accent, var(--gold));
          border: 2px solid var(--cream);
          box-shadow: 0 0 0 1px var(--accent, var(--gold));
          margin: 5px auto 0;
          position: relative;
          z-index: 1;
        }
        .timeline-title {
          font-family: var(--font-display);
          font-size: 18px;
          font-weight: 400;
          color: var(--charcoal);
          margin-bottom: 8px;
        }
        .timeline-body {
          font-family: var(--font-editorial);
          font-size: 15px;
          font-weight: 300;
          color: var(--muted);
          line-height: 1.75;
        }

        /* ── Team ── */
        .about-team {
          padding: 80px 60px;
          background: var(--cream-dark);
        }
        .team-header {
          display: flex;
          align-items: center;
          gap: 24px;
          margin-bottom: 56px;
        }
        .team-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        .team-card {
          display: flex;
          flex-direction: column;
        }
        .team-portrait {
          height: 300px;
          border-radius: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          overflow: hidden;
        }
        .portrait-placeholder {
          font-family: var(--font-editorial);
          font-size: 13px;
          color: rgba(0,0,0,0.28);
          letter-spacing: 0.1em;
        }
        .team-name {
          font-family: var(--font-display);
          font-size: 17px;
          font-weight: 400;
          color: var(--charcoal);
          margin-bottom: 4px;
        }
        .team-role {
          display: block;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 10px;
        }
        .team-bio {
          font-family: var(--font-editorial);
          font-size: 14px;
          font-weight: 300;
          color: var(--muted);
          line-height: 1.7;
        }

        /* ── Press ── */
        .about-press {
          padding: 60px 60px;
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
        }
        .press-inner {
          max-width: 900px;
          margin: 0 auto;
        }
        .press-inner .about-section-eyebrow {
          margin-bottom: 36px;
        }
        .press-logos {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0;
          flex-wrap: wrap;
        }
        .press-logo {
          flex: 1;
          min-width: 120px;
          text-align: center;
          font-family: var(--font-display);
          font-size: 15px;
          font-weight: 400;
          letter-spacing: 0.1em;
          color: var(--muted);
          padding: 16px 20px;
          border-right: 1px solid var(--border);
          transition: color 0.2s;
        }
        .press-logo:last-child {
          border-right: none;
        }
        .press-logo:hover {
          color: var(--charcoal);
        }

        /* ── CTA ── */
        .about-cta {
          padding: 100px 60px;
        }
        .about-cta-inner {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }
        .about-cta-img {
          height: 500px;
          border-radius: 2px;
        }
        .cta-actions {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          margin-top: 36px;
        }

        /* ── Responsive ── */
        @media (max-width: 1100px) {
          .about-hero {
            grid-template-columns: 1fr;
            min-height: auto;
            padding: 60px 40px;
          }
          .about-hero-images {
            height: 50vw;
          }
          .founding-inner,
          .about-cta-inner {
            grid-template-columns: 1fr;
            gap: 48px;
          }
          .founding-imagery {
            height: 400px;
          }
          .about-cta-img {
            height: 340px;
          }
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .stat-block:nth-child(2) {
            border-right: none;
          }
          .stat-block:nth-child(3) {
            border-top: 1px solid var(--border);
          }
          .stat-block:nth-child(4) {
            border-top: 1px solid var(--border);
            border-right: none;
          }
          .team-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .values-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 768px) {
          .about-hero,
          .about-manifesto,
          .about-stats,
          .about-founding,
          .about-values,
          .about-timeline,
          .about-team,
          .about-press,
          .about-cta {
            padding-left: 20px;
            padding-right: 20px;
          }
          .about-hero-images {
            height: 70vw;
          }
          .timeline-entry {
            grid-template-columns: 48px 1fr;
          }
          .timeline-spine {
            left: 24px;
          }
          .timeline-entry-left .timeline-year,
          .timeline-entry-right .timeline-year {
            grid-column: 2;
            text-align: left;
            padding-left: 20px;
            padding-right: 0;
            order: 1;
          }
          .timeline-entry-left .timeline-dot,
          .timeline-entry-right .timeline-dot {
            grid-column: 1;
            grid-row: 1 / 3;
            order: 0;
            margin-top: 5px;
          }
          .timeline-entry-left .timeline-content,
          .timeline-entry-right .timeline-content {
            grid-column: 2;
            text-align: left;
            padding-left: 20px;
            padding-right: 0;
            order: 2;
          }
          .values-grid,
          .team-grid {
            grid-template-columns: 1fr;
          }
          .stats-grid {
            grid-template-columns: 1fr 1fr;
          }
          .press-logos {
            gap: 0;
          }
          .press-logo {
            min-width: 33%;
            font-size: 13px;
          }
        }
      `}</style>
    </>
  );
}