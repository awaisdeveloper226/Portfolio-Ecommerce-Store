import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Review from "@/models/Review";
import Order from "@/models/Order";
import { authenticateRequest } from "@/lib/auth";
import { CreateReviewSchema, parseBody } from "@/lib/validations";
import {
  ok,
  created,
  badRequest,
  unauthorized,
  conflict,
  serverError,
  parsePagination,
  buildMeta,
} from "@/lib/api";

// GET /api/reviews?productId=xxx&page=1&limit=10
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const sp = req.nextUrl.searchParams;
    const productId = sp.get("productId");
    const { page, limit, skip } = parsePagination(sp);
    const sort = sp.get("sort") ?? "newest"; // newest | helpful | rating_high | rating_low

    if (!productId) return badRequest("productId is required.");

    const filter = { product: productId, isApproved: true };

    let sortQuery: Record<string, 1 | -1> = { createdAt: -1 };
    if (sort === "helpful") sortQuery = { helpfulVotes: -1 };
    else if (sort === "rating_high") sortQuery = { rating: -1 };
    else if (sort === "rating_low") sortQuery = { rating: 1 };

    const [reviews, total] = await Promise.all([
      Review.find(filter)
        .populate("user", "firstName lastName avatar")
        .sort(sortQuery)
        .skip(skip)
        .limit(limit)
        .lean(),
      Review.countDocuments(filter),
    ]);

    // Rating breakdown
    const breakdown = await Review.aggregate([
      { $match: { product: productId, isApproved: true } }, // Note: cast needed for ObjectId in real use
      { $group: { _id: "$rating", count: { $sum: 1 } } },
    ]);

    const ratingBreakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    breakdown.forEach((b) => {
      ratingBreakdown[b._id as keyof typeof ratingBreakdown] = b.count;
    });

    return ok(
      { reviews, ratingBreakdown },
      undefined,
      buildMeta(total, page, limit)
    );
  } catch (error) {
    return serverError("Failed to fetch reviews", error);
  }
}

// POST /api/reviews
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const payload = await authenticateRequest(req);
    if (!payload) return unauthorized();

    const body = await req.json();
    const parsed = parseBody(CreateReviewSchema, body);
    if (!parsed.success) return badRequest("Validation failed", parsed.errors);

    const { productId, rating, title, body: reviewBody } = parsed.data;

    // Check if already reviewed
    const existing = await Review.findOne({
      product: productId,
      user: payload.sub,
    });
    if (existing) return conflict("You have already reviewed this product.");

    // Check for verified purchase
    const purchaseOrder = await Order.findOne({
      user: payload.sub,
      "items.product": productId,
      status: "delivered",
    });

    const review = await Review.create({
      product: productId,
      user: payload.sub,
      rating,
      title,
      body: reviewBody,
      verifiedPurchase: !!purchaseOrder,
      order: purchaseOrder?._id,
    });

    await review.populate("user", "firstName lastName avatar");

    return created(review, "Review submitted successfully");
  } catch (error) {
    return serverError("Failed to submit review", error);
  }
}