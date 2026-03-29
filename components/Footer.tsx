"use client";
import Link from "next/link";
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <p className="footer-logo">MAISON ELARA</p>
          <p className="footer-tagline">Quiet luxury for the modern woman.</p>
          <div className="footer-socials">
            <a href="#" aria-label="Instagram">
              IG
            </a>
            <a href="#" aria-label="Pinterest">
              PT
            </a>
            <a href="#" aria-label="TikTok">
              TK
            </a>
          </div>
        </div>
        <div className="footer-links">
          <div className="footer-col">
            <h4>Shop</h4>
            <Link href="/category/new-arrivals">New Arrivals</Link>
            <Link href="/category/dresses">Dresses</Link>
            <Link href="/category/tops">Tops</Link>
            <Link href="/category/trousers">Trousers</Link>
            <Link href="/collections/sale">Sale</Link>
          </div>
          <div className="footer-col">
            <h4>Help</h4>
            <Link href="/help/sizing">Size Guide</Link>
            <Link href="/help/shipping">Shipping Info</Link>
            <Link href="/help/returns">Returns</Link>
            <Link href="/help/contact">Contact Us</Link>
            <Link href="/help/faq">FAQ</Link>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <Link href="/about">Our Story</Link>
            <Link href="/sustainability">Sustainability</Link>
            <Link href="/press">Press</Link>
            <Link href="/careers">Careers</Link>
            <Link href="/affiliates">Affiliates</Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 Maison Elara. All rights reserved.</p>
        <div className="footer-legal">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/cookies">Cookies</Link>
        </div>
        <div className="footer-payments">
          <span>VISA</span>
          <span>MC</span>
          <span>AMEX</span>
          <span>PayPal</span>
          <span>Stripe</span>
        </div>
      </div>
    </footer>
  );
}
