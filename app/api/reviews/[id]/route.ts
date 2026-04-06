import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Review from "@/models/Review";
import { authenticateRequest } from "@/lib/auth";
import { ok, notFound, unauthorized, serverError } from "@/lib/api";

interface Params {
  params: Promise<{ id: string }>;
}

// POST /api/reviews/[id]/helpful
export async function POST(req: NextRequest, { params }: Params) {
  try {
    await connectDB();

    const payload = await authenticateRequest(req);
    if (!payload) return unauthorized();

    const { id } = await params;

    const review = await Review.findByIdAndUpdate(
      id,
      { $inc: { helpfulVotes: 1 } },
      { new: true }
    );

    if (!review) return notFound("Review not found.");

    return ok({ helpfulVotes: review.helpfulVotes }, "Marked as helpful");
  } catch (error) {
    return serverError("Failed to vote", error);
  }
}

// DELETE /api/reviews/[id]  — author or admin delete
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    await connectDB();

    const payload = await authenticateRequest(req);
    if (!payload) return unauthorized();

    const { id } = await params;

    const review = await Review.findById(id);
    if (!review) return notFound("Review not found.");

    if (
      payload.role !== "admin" &&
      review.user.toString() !== payload.sub
    ) {
      return notFound("Review not found.");
    }

    await review.deleteOne();
    return ok(null, "Review deleted");
  } catch (error) {
    return serverError("Failed to delete review", error);
  }
}