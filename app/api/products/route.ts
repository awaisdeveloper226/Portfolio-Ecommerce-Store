import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { ProductQuerySchema, parseBody } from "@/lib/validations";
import { authenticateRequest } from "@/lib/auth";
import {
  ok,
  created,
  badRequest,
  forbidden,
  serverError,
  parsePagination,
  buildMeta,
} from "@/lib/api";
import { FilterQuery } from "mongoose";
import { IProduct } from "@/models/Product";

// GET /api/products
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const sp = req.nextUrl.searchParams;
    const parsed = parseBody(ProductQuerySchema, Object.fromEntries(sp));
    if (!parsed.success) return badRequest("Invalid query parameters", parsed.errors);

    const q = parsed.data;
    const { page, limit, skip } = parsePagination(sp);

    // Build filter
    const filter: FilterQuery<IProduct> = { isActive: true };

    if (q.category) filter.category = q.category;
    if (q.tag) filter.tag = q.tag;
    if (q.collection) filter.collections = q.collection;
    if (q.isFeatured !== undefined) filter.isFeatured = q.isFeatured;
    if (q.inStock) filter.totalStock = { $gt: 0 };

    if (q.minPrice !== undefined || q.maxPrice !== undefined) {
      filter.price = {};
      if (q.minPrice !== undefined) filter.price.$gte = q.minPrice;
      if (q.maxPrice !== undefined) filter.price.$lte = q.maxPrice;
    }

    if (q.sizes) {
      const sizeArr = q.sizes.split(",").map((s) => s.trim());
      filter.availableSizes = { $in: sizeArr };
    }

    // Full-text search
    if (q.search) {
      filter.$text = { $search: q.search };
    }

    // Sort
    let sort: Record<string, 1 | -1> = { createdAt: -1 };
    if (q.sort === "price_asc") sort = { price: 1 };
    else if (q.sort === "price_desc") sort = { price: -1 };
    else if (q.sort === "rating") sort = { averageRating: -1 };
    else if (q.sort === "bestselling") sort = { reviewCount: -1 };
    else if (q.sort === "oldest") sort = { createdAt: 1 };

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Product.countDocuments(filter),
    ]);

    return ok(products, undefined, buildMeta(total, page, limit));
  } catch (error) {
    return serverError("Failed to fetch products", error);
  }
}

// POST /api/products  (admin only)
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const payload = await authenticateRequest(req);
    if (!payload) return forbidden("Authentication required.");
    if (payload.role !== "admin") return forbidden("Admin access required.");

    const body = await req.json();

    // Auto-generate slug from name if not provided
    if (!body.slug && body.name) {
      body.slug = body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }

    const product = await Product.create(body);
    return created(product, "Product created successfully");
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException).code === 11000) {
      return badRequest("A product with this slug already exists.");
    }
    return serverError("Failed to create product", error);
  }
}