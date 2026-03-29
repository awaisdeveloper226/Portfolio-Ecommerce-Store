"use client";
import Link from "next/link";

export default function AnnouncementBar() {
  return (
    <div className="announcement-bar">
      <p>
        Free shipping on orders over $150 &nbsp;·&nbsp; New arrivals every
        Friday &nbsp;·&nbsp; <Link href="/shop">Shop Now →</Link>
      </p>
    </div>
  );
}
