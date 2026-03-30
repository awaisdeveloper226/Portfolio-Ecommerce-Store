"use client";
import Link from "next/link";
export default function ShopHero({
  activeCategory,
}: {
  activeCategory: string;
}) {
  return (
    <section className="shop-hero">
      <div className="shop-hero-inner">
        <div className="shop-breadcrumb">
          <Link href="/">Home</Link>
          <span className="breadcrumb-sep">·</span>
          <span>
            {activeCategory === "All" ? "All Pieces" : activeCategory}
          </span>
        </div>
        <h1 className="shop-hero-title">
          {activeCategory === "All" ? (
            <>
              All <em>Pieces</em>
            </>
          ) : (
            <>{activeCategory}</>
          )}
        </h1>
        <p className="shop-hero-sub">
          {activeCategory === "All"
            ? "340+ timeless silhouettes, sustainably crafted."
            : `Explore our curated ${activeCategory.toLowerCase()} edit.`}
        </p>
      </div>
      {/* Decorative line pattern */}
      <div className="shop-hero-deco">
        {Array(5)
          .fill(null)
          .map((_, i) => (
            <div
              key={i}
              className="deco-line"
              style={{ animationDelay: `${i * 0.12}s` }}
            />
          ))}
      </div>
    </section>
  );
}
