import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { ok, badRequest, serverError } from "@/lib/api";
import { FilterQuery } from "mongoose";
import { IProduct } from "@/models/Product";

// GET /api/products/search?q=silk&limit=10
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const sp = req.nextUrl.searchParams;
    const q = sp.get("q")?.trim();
    const limit = Math.min(50, parseInt(sp.get("limit") ?? "10", 10));
    const category = sp.get("category");
    const autocomplete = sp.get("autocomplete") === "true";

    if (!q || q.length < 1) {
      return badRequest("Search query is required.");
    }

    const filter: FilterQuery<IProduct> = {
      isActive: true,
      $text: { $search: q },
    };

    if (category) filter.category = category;

    let selectFields = "name slug category price compareAtPrice tag images colors averageRating reviewCount totalStock";
    if (autocomplete) {
      selectFields = "name slug category price tag images colors";
    }

    const products = await Product.find(filter, { score: { $meta: "textScore" } })
      .select(selectFields)
      .sort({ score: { $meta: "textScore" } })
      .limit(limit)
      .lean();

    // Also try regex search as fallback for partial matches
    let results = products;
    if (products.length < 5 && q.length >= 2) {
      const regexFilter: FilterQuery<IProduct> = {
        isActive: true,
        name: { $regex: q, $options: "i" },
        _id: { $nin: products.map((p) => p._id) },
      };
      if (category) regexFilter.category = category;

      const regexResults = await Product.find(regexFilter)
        .select(selectFields)
        .limit(limit - products.length)
        .lean();

      results = [...products, ...regexResults];
    }

    return ok(results, undefined, { total: results.length });
  } catch (error) {
    return serverError("Search failed", error);
  }
}