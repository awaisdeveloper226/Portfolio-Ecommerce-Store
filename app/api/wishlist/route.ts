import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Wishlist from "@/models/Wishlist";
import Product from "@/models/Product";
import { authenticateRequest } from "@/lib/auth";
import { ok, badRequest, notFound, unauthorized, serverError } from "@/lib/api";
import crypto from "crypto";

// GET /api/wishlist
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // Support public share token
    const shareToken = req.nextUrl.searchParams.get("token");

    let wishlist;
    if (shareToken) {
      wishlist = await Wishlist.findOne({ shareToken, isPublic: true }).populate(
        "items.product",
        "name slug price compareAtPrice images category tag averageRating reviewCount totalStock colors availableSizes"
      );
      if (!wishlist) return notFound("Shared wishlist not found.");
    } else {
      const payload = await authenticateRequest(req);
      if (!payload) return unauthorized();

      wishlist = await Wishlist.findOne({ user: payload.sub }).populate(
        "items.product",
        "name slug price compareAtPrice images category tag averageRating reviewCount totalStock colors availableSizes"
      );

      if (!wishlist) return ok({ items: [], shareToken: null, isPublic: false });
    }

    return ok(wishlist);
  } catch (error) {
    return serverError("Failed to fetch wishlist", error);
  }
}

// POST /api/wishlist  — add product
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const payload = await authenticateRequest(req);
    if (!payload) return unauthorized();

    const { productId, notifyOnRestock } = await req.json();
    if (!productId) return badRequest("productId is required.");

    const product = await Product.findById(productId);
    if (!product || !product.isActive) return notFound("Product not found.");

    let wishlist = await Wishlist.findOne({ user: payload.sub });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: payload.sub, items: [] });
    }

    const alreadySaved = wishlist.items.some(
      (i) => i.product.toString() === productId
    );

    if (alreadySaved) {
      // Update notifyOnRestock if passed
      if (notifyOnRestock !== undefined) {
        const item = wishlist.items.find((i) => i.product.toString() === productId);
        if (item) item.notifyOnRestock = notifyOnRestock;
        await wishlist.save();
      }
      return ok(wishlist, "Already in wishlist");
    }

    wishlist.items.push({
      product: product._id,
      addedAt: new Date(),
      notifyOnRestock: notifyOnRestock ?? false,
    });

    await wishlist.save();
    return ok(wishlist, "Added to wishlist");
  } catch (error) {
    return serverError("Failed to add to wishlist", error);
  }
}

// DELETE /api/wishlist?productId=xxx  — remove product
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    const payload = await authenticateRequest(req);
    if (!payload) return unauthorized();

    const productId = req.nextUrl.searchParams.get("productId");
    if (!productId) return badRequest("productId is required.");

    const wishlist = await Wishlist.findOne({ user: payload.sub });
    if (!wishlist) return ok(null, "Nothing to remove");

    wishlist.items = wishlist.items.filter(
      (i) => i.product.toString() !== productId
    );
    await wishlist.save();

    return ok(wishlist, "Removed from wishlist");
  } catch (error) {
    return serverError("Failed to remove from wishlist", error);
  }
}

// PATCH /api/wishlist  — toggle share / generate share token
export async function PATCH(req: NextRequest) {
  try {
    await connectDB();

    const payload = await authenticateRequest(req);
    if (!payload) return unauthorized();

    const { isPublic } = await req.json();

    let wishlist = await Wishlist.findOne({ user: payload.sub });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: payload.sub, items: [] });
    }

    wishlist.isPublic = isPublic ?? !wishlist.isPublic;

    if (wishlist.isPublic && !wishlist.shareToken) {
      wishlist.shareToken = crypto.randomBytes(16).toString("hex");
    }

    await wishlist.save();

    return ok(
      { isPublic: wishlist.isPublic, shareToken: wishlist.shareToken },
      wishlist.isPublic ? "Wishlist is now public" : "Wishlist is now private"
    );
  } catch (error) {
    return serverError("Failed to update wishlist", error);
  }
}