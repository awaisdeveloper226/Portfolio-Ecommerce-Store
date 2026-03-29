import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Maison Elara — Quiet Luxury for the Modern Woman",
    template: "%s | Maison Elara",
  },
  description:
    "Timeless silhouettes crafted from sustainably sourced fabrics. Shop women's dresses, tops, trousers, knitwear and more.",
  keywords: [
    "women's fashion",
    "sustainable clothing",
    "luxury fashion",
    "dresses",
    "tops",
  ],
  authors: [{ name: "Maison Elara" }],
  openGraph: {
    title: "Maison Elara",
    description: "Quiet luxury for the modern woman.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400;1,500&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
