import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { ok, serverError } from "@/lib/api";

const CATEGORY_META: Record<
  string,
  { label: string; description: string; order: number }
> = {
  dresses: {
    label: "Dresses",
    description: "Silhouettes across silk, linen and fine jersey.",
    order: 1,
  },
  tops: {
    label: "Tops",
    description: "From structured blouses to fluid cami tops.",
    order: 2,
  },
  trousers: {
    label: "Trousers",
    description: "Wide leg, tapered, fluid and everything between.",
    order: 3,
  },
  outerwear: {
    label: "Outerwear",
    description: "Pieces built for every climate.",
    order: 4,
  },
  knitwear: {
    label: "Knitwear",
    description: "Cashmere, merino and organic cotton.",
    order: 5,
  },
  accessories: {
    label: "Accessories",
    description: "Scarves, belts, hats and more.",
    order: 6,
  },
};

// GET /api/categories
export async function GET(_req: NextRequest) {
  try {
    await connectDB();

    // Aggregate product counts per category
    const counts = await Product.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: "$category", count: { $sum: 1 }, inStock: { $sum: { $cond: [{ $gt: ["$totalStock", 0] }, 1, 0] } } } },
    ]);

    const countMap: Record<string, { count: number; inStock: number }> = {};
    counts.forEach((c) => {
      countMap[c._id] = { count: c.count, inStock: c.inStock };
    });

    const categories = Object.entries(CATEGORY_META)
      .map(([slug, meta]) => ({
        slug,
        label: meta.label,
        description: meta.description,
        order: meta.order,
        productCount: countMap[slug]?.count ?? 0,
        inStockCount: countMap[slug]?.inStock ?? 0,
      }))
      .sort((a, b) => a.order - b.order);

    return ok(categories);
  } catch (error) {
    return serverError("Failed to fetch categories", error);
  }
}