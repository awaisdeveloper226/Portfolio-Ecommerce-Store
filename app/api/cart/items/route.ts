import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";
import Product from "@/models/Product";
import Discount from "@/models/Discount";
import { authenticateRequest } from "@/lib/auth";
import { ok, badRequest, notFound, serverError } from "@/lib/api";

// PATCH /api/cart/items  — update quantity or remove item
export async function PATCH(req: NextRequest) {
  try {
    await connectDB();

    const payload = await authenticateRequest(req);
    const sessionId = req.cookies.get("cart_session")?.value;
    const filter = payload ? { user: payload.sub } : { sessionId };

    const body = await req.json();
    const { sku, quantity } = body;

    if (!sku) return badRequest("SKU is required.");
    if (quantity === undefined) return badRequest("Quantity is required.");

    const cart = await Cart.findOne(filter);
    if (!cart) return notFound("Cart not found.");

    if (quantity <= 0) {
      // Remove item
      cart.items = cart.items.filter((i) => i.sku !== sku);
    } else {
      const itemIdx = cart.items.findIndex((i) => i.sku === sku);
      if (itemIdx === -1) return notFound("Item not found in cart.");

      // Validate stock
      const item = cart.items[itemIdx];
      const product = await Product.findById(item.product);
      const variant = product?.variants.find((v) => v.sku === sku);
      if (variant && quantity > variant.stock) {
        return badRequest(`Only ${variant.stock} unit(s) available.`);
      }
      if (quantity > 10) return badRequest("Maximum 10 units per item.");

      cart.items[itemIdx].quantity = quantity;
    }

    await cart.save();
    return ok(cart, "Cart updated");
  } catch (error) {
    return serverError("Failed to update cart", error);
  }
}

// POST /api/cart/items — alias; handled in parent route
// DELETE /api/cart/items  — remove specific item by SKU
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    const payload = await authenticateRequest(req);
    const sessionId = req.cookies.get("cart_session")?.value;
    const filter = payload ? { user: payload.sub } : { sessionId };

    const sp = req.nextUrl.searchParams;
    const sku = sp.get("sku");
    if (!sku) return badRequest("SKU query param is required.");

    const cart = await Cart.findOne(filter);
    if (!cart) return notFound("Cart not found.");

    cart.items = cart.items.filter((i) => i.sku !== sku);
    await cart.save();

    return ok(cart, "Item removed from cart");
  } catch (error) {
    return serverError("Failed to remove item", error);
  }
}