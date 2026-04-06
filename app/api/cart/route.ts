import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";
import Product from "@/models/Product";
import Discount from "@/models/Discount";
import { authenticateRequest } from "@/lib/auth";
import { AddToCartSchema, parseBody } from "@/lib/validations";
import { ok, badRequest, notFound, serverError } from "@/lib/api";

// Helper: get or create cart for user/session
async function getOrCreateCart(userId?: string, sessionId?: string) {
  const filter = userId ? { user: userId } : { sessionId };
  let cart = await Cart.findOne(filter);
  if (!cart) {
    cart = await Cart.create({
      ...(userId ? { user: userId } : { sessionId }),
      items: [],
    });
  }
  return cart;
}

// GET /api/cart
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const payload = await authenticateRequest(req);
    const sessionId = req.cookies.get("cart_session")?.value;

    const filter = payload
      ? { user: payload.sub }
      : sessionId
      ? { sessionId }
      : null;

    if (!filter) return ok({ items: [], subtotal: 0, total: 0, discountAmount: 0 });

    const cart = await Cart.findOne(filter).populate(
      "items.product",
      "name slug images isActive totalStock"
    );

    if (!cart) return ok({ items: [], subtotal: 0, total: 0, discountAmount: 0 });

    return ok(cart);
  } catch (error) {
    return serverError("Failed to fetch cart", error);
  }
}

// POST /api/cart  — add item
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const payload = await authenticateRequest(req);
    const sessionId =
      req.cookies.get("cart_session")?.value ??
      `guest_${Date.now()}_${Math.random().toString(36).slice(2)}`;

    const body = await req.json();
    const parsed = parseBody(AddToCartSchema, body);
    if (!parsed.success) return badRequest("Validation failed", parsed.errors);

    const { productId, size, color, colorLabel, colorHex, sku, quantity } = parsed.data;

    // Validate product & stock
    const product = await Product.findById(productId);
    if (!product || !product.isActive) return notFound("Product not found.");

    const variant = product.variants.find((v) => v.sku === sku);
    if (!variant) return badRequest("Invalid product variant.");
    if (variant.stock < quantity) {
      return badRequest(`Only ${variant.stock} unit(s) available.`);
    }

    const cart = await getOrCreateCart(payload?.sub, sessionId);

    // Check if same SKU already in cart
    const existingIdx = cart.items.findIndex((i) => i.sku === sku);

    if (existingIdx >= 0) {
      const newQty = cart.items[existingIdx].quantity + quantity;
      if (newQty > variant.stock) {
        return badRequest(`Only ${variant.stock} unit(s) available.`);
      }
      if (newQty > 10) return badRequest("Maximum 10 units per item.");
      cart.items[existingIdx].quantity = newQty;
    } else {
      cart.items.push({
        product: product._id,
        name: product.name,
        slug: product.slug,
        image: product.images?.[0]?.url,
        color: color ?? "",
        colorLabel: colorLabel ?? "",
        colorHex: colorHex ?? "",
        size,
        sku,
        quantity,
        unitPrice: variant.price ?? product.price,
        compareAtPrice: product.compareAtPrice,
      });
    }

    await cart.save();

    const response = ok(cart, "Item added to cart");

    // Set session cookie for guests
    if (!payload) {
      response.cookies.set("cart_session", sessionId, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
        sameSite: "lax",
      });
    }

    return response;
  } catch (error) {
    return serverError("Failed to add item to cart", error);
  }
}

// DELETE /api/cart  — clear entire cart
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    const payload = await authenticateRequest(req);
    const sessionId = req.cookies.get("cart_session")?.value;

    const filter = payload ? { user: payload.sub } : { sessionId };
    await Cart.findOneAndUpdate(filter, { $set: { items: [], discountAmount: 0, discountCode: undefined } });

    return ok(null, "Cart cleared");
  } catch (error) {
    return serverError("Failed to clear cart", error);
  }
}