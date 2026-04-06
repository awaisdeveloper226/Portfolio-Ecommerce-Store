import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";
import Discount from "@/models/Discount";
import { authenticateRequest } from "@/lib/auth";
import { ok, badRequest, notFound, serverError } from "@/lib/api";

// POST /api/cart/discount  — apply promo code
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const payload = await authenticateRequest(req);
    const sessionId = req.cookies.get("cart_session")?.value;
    const filter = payload ? { user: payload.sub } : { sessionId };

    const { code } = await req.json();
    if (!code) return badRequest("Promo code is required.");

    const cart = await Cart.findOne(filter);
    if (!cart) return notFound("Cart not found.");
    if (cart.items.length === 0) return badRequest("Your cart is empty.");

    const discount = await Discount.findOne({
      code: code.toUpperCase(),
      isActive: true,
    });

    if (!discount) return badRequest("Invalid or expired promo code.");

    // Check expiry
    const now = new Date();
    if (discount.startsAt && discount.startsAt > now) {
      return badRequest("This code is not yet active.");
    }
    if (discount.expiresAt && discount.expiresAt < now) {
      return badRequest("This promo code has expired.");
    }

    // Check usage limit
    if (discount.maxUses && discount.usedCount >= discount.maxUses) {
      return badRequest("This promo code has reached its usage limit.");
    }

    // Check if user already used it
    if (payload && discount.usedBy.map(String).includes(payload.sub)) {
      return badRequest("You have already used this promo code.");
    }

    // Check minimum order
    if (discount.minOrderValue && cart.subtotal < discount.minOrderValue) {
      return badRequest(
        `Minimum order of $${discount.minOrderValue} required for this code.`
      );
    }

    // Calculate discount
    let discountAmount = 0;
    if (discount.type === "percentage") {
      discountAmount = Math.round(cart.subtotal * (discount.value / 100) * 100) / 100;
    } else {
      discountAmount = Math.min(discount.value, cart.subtotal);
    }

    cart.discountCode = discount.code;
    cart.discountAmount = discountAmount;
    await cart.save();

    return ok(
      { cart, discountAmount, code: discount.code },
      `Promo code applied — $${discountAmount.toFixed(2)} off`
    );
  } catch (error) {
    return serverError("Failed to apply promo code", error);
  }
}

// DELETE /api/cart/discount  — remove promo code
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    const payload = await authenticateRequest(req);
    const sessionId = req.cookies.get("cart_session")?.value;
    const filter = payload ? { user: payload.sub } : { sessionId };

    const cart = await Cart.findOne(filter);
    if (!cart) return notFound("Cart not found.");

    cart.discountCode = undefined;
    cart.discountAmount = 0;
    await cart.save();

    return ok(cart, "Promo code removed");
  } catch (error) {
    return serverError("Failed to remove promo code", error);
  }
}