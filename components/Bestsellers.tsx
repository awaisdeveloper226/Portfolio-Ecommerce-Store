"use client";
import Link from "next/link";
const bestsellers = [
  {
    id: 5,
    name: "Fluid Midi Skirt",
    price: "$175",
    color: "#ddc5b5",
    reviews: 142,
  },
  {
    id: 6,
    name: "Oversized Linen Shirt",
    price: "$145",
    color: "#c5ddc5",
    reviews: 98,
  },
  {
    id: 7,
    name: "Cropped Wool Jacket",
    price: "$390",
    color: "#c5c5dd",
    reviews: 76,
  },
  {
    id: 8,
    name: "Satin Cami Top",
    price: "$95",
    color: "#ddd5c5",
    reviews: 203,
  },
  {
    id: 9,
    name: "Tailored Shorts",
    price: "$160",
    color: "#c5ddd5",
    reviews: 55,
  },
  {
    id: 10,
    name: "Ribbed Maxi Dress",
    price: "$255",
    color: "#ddc5d0",
    reviews: 187,
  },
];

function BestsellerCard({ product }: { product: (typeof bestsellers)[0] }) {
  return (
    <div className="bs-card">
      <div className="bs-img" style={{ background: product.color }}>
        <div className="bs-img-overlay">
          <button className="bs-quick-add">Quick Add</button>
        </div>
      </div>
      <div className="bs-info">
        <h4 className="bs-name">{product.name}</h4>
        <div className="bs-bottom">
          <span className="bs-price">{product.price}</span>
          <span className="bs-reviews">★ {product.reviews}</span>
        </div>
      </div>
    </div>
  );
}

export default function Bestsellers() {
  return (
    <section className="bestsellers-section">
      <div className="section-header">
        <div className="section-header-line" />
        <h2 className="section-title">Customer Favourites</h2>
        <div className="section-header-line" />
      </div>
      <div className="bs-grid">
        {bestsellers.map((p) => (
          <BestsellerCard key={p.id} product={p} />
        ))}
      </div>
      <div className="bs-footer">
        <Link href="/shop?sort=bestselling" className="btn-outline">
          Shop All Bestsellers
        </Link>
      </div>
    </section>
  );
}
