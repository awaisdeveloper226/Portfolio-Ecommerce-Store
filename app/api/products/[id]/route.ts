import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { authenticateRequest } from "@/lib/auth";
import { ok, notFound, forbidden, badRequest, noContent, serverError } from "@/lib/api";

interface Params {
  params: Promise<{ id: string }>;
}

// GET /api/products/[id]
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { id } = await params;

    // Support lookup by id or slug
    const product = await Product.findOne({
      $or: [
        ...(id.match(/^[a-f\d]{24}$/i) ? [{ _id: id }] : []),
        { slug: id },
      ],
      isActive: true,
    });

    if (!product) return notFound("Product not found.");
    return ok(product);
  } catch (error) {
    return serverError("Failed to fetch product", error);
  }
}

// PATCH /api/products/[id]  (admin only)
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { id } = await params;

    const payload = await authenticateRequest(req);
    if (!payload) return forbidden("Authentication required.");
    if (payload.role !== "admin") return forbidden("Admin access required.");

    const body = await req.json();

    const product = await Product.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );
    if (!product) return notFound("Product not found.");

    return ok(product, "Product updated successfully");
  } catch (error) {
    return serverError("Failed to update product", error);
  }
}

// DELETE /api/products/[id]  (admin only — soft delete)
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { id } = await params;

    const payload = await authenticateRequest(req);
    if (!payload) return forbidden("Authentication required.");
    if (payload.role !== "admin") return forbidden("Admin access required.");

    const product = await Product.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );
    if (!product) return notFound("Product not found.");

    return noContent();
  } catch (error) {
    return serverError("Failed to delete product", error);
  }
}