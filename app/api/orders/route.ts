import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import Cart from "@/models/Cart";
import Product from "@/models/Product";
import User from "@/models/User";
import Discount from "@/models/Discount";
import { authenticateRequest } from "@/lib/auth";
import { CheckoutSchema, parseBody } from "@/lib/validations";
import {
  ok,
  created,
  badRequest,
  unauthorized,
  serverError,
  parsePagination,
  buildMeta,
} from "@/lib/api";

const SHIPPING_COSTS: Record<string, number> = {
  standard: 0,   // free over $150, else $12
  express: 14,
  next_day: 22,
};

const FREE_SHIPPING_THRESHOLD = 150;
const LOYALTY_POINTS_RATE = 1; // 1 point per $1 spent

// GET /api/orders  — list current user's orders
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const payload = await authenticateRequest(req);
    if (!payload) return unauthorized();

    const sp = req.nextUrl.searchParams;
    const { page, limit, skip } = parsePagination(sp);
    const status = sp.get("status");

    const filter: Record<string, unknown> = { user: payload.sub };
    if (status) filter.status = status;

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("-statusHistory")
        .lean(),
      Order.countDocuments(filter),
    ]);

    return ok(orders, undefined, buildMeta(total, page, limit));
  } catch (error) {
    return serverError("Failed to fetch orders", error);
  }
}

// POST /api/orders  — place order (after payment confirmation)
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const payload = await authenticateRequest(req);
    const body = await req.json();
    const parsed = parseBody(CheckoutSchema, body);
    if (!parsed.success) return badRequest("Validation failed", parsed.errors);

    const {
      email,
      shippingAddress,
      billingAddressSameAsShipping,
      billingAddress,
      shippingMethod,
      discountCode,
      paymentMethod,
    } = parsed.data;

    // Get cart
    const sessionId = req.cookies.get("cart_session")?.value;
    const cartFilter = payload ? { user: payload.sub } : { sessionId };
    const cart = await Cart.findOne(cartFilter);

    if (!cart || cart.items.length === 0) {
      return badRequest("Your cart is empty.");
    }

    // Validate stock & build order items
    const orderItems = [];
    for (const item of cart.items) {
      const product = await Product.findById(item.product);
      if (!product || !product.isActive) {
        return badRequest(`"${item.name}" is no longer available.`);
      }
      const variant = product.variants.find((v) => v.sku === item.sku);
      if (!variant || variant.stock < item.quantity) {
        return badRequest(
          `Insufficient stock for "${item.name}" (${item.size}). Only ${variant?.stock ?? 0} left.`
        );
      }
      orderItems.push({
        product: product._id,
        name: product.name,
        slug: product.slug,
        image: product.images?.[0]?.url,
        color: item.color,
        colorLabel: item.colorLabel,
        size: item.size,
        sku: item.sku,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.unitPrice * item.quantity,
      });
    }

    const subtotal = orderItems.reduce((sum, i) => sum + i.totalPrice, 0);

    // Shipping cost
    let shippingCost = SHIPPING_COSTS[shippingMethod] ?? 0;
    if (shippingMethod === "standard" && subtotal < FREE_SHIPPING_THRESHOLD) {
      shippingCost = 12;
    }

    // Discount
    let discountAmount = 0;
    let appliedCode: string | undefined;
    if (discountCode) {
      const discount = await Discount.findOne({
        code: discountCode.toUpperCase(),
        isActive: true,
      });
      if (discount) {
        if (discount.type === "percentage") {
          discountAmount = Math.round(subtotal * (discount.value / 100) * 100) / 100;
        } else {
          discountAmount = Math.min(discount.value, subtotal);
        }
        appliedCode = discount.code;
        // Mark as used
        await Discount.findByIdAndUpdate(discount._id, {
          $inc: { usedCount: 1 },
          ...(payload ? { $addToSet: { usedBy: payload.sub } } : {}),
        });
      }
    }

    const total = Math.max(0, subtotal - discountAmount + shippingCost);
    const loyaltyPointsEarned = Math.floor(total * LOYALTY_POINTS_RATE);

    // Create order
    const order = await Order.create({
      user: payload?.sub,
      guestEmail: payload ? undefined : email,
      items: orderItems,
      shippingAddress,
      billingAddress: billingAddressSameAsShipping
        ? undefined
        : billingAddress,
      subtotal,
      discountAmount,
      discountCode: appliedCode,
      shippingCost,
      shippingMethod,
      tax: 0, // Tax calculation would go here
      total,
      currency: "USD",
      status: "pending",
      paymentStatus: "pending",
      paymentMethod,
      loyaltyPointsEarned,
    });

    // Decrement stock
    for (const item of cart.items) {
      await Product.updateOne(
        { "variants.sku": item.sku },
        { $inc: { "variants.$.stock": -item.quantity } }
      );
      // Recalculate totalStock
      const product = await Product.findById(item.product);
      if (product) {
        product.totalStock = product.variants.reduce((s, v) => s + v.stock, 0);
        await product.save();
      }
    }

    // Clear cart
    cart.items = [];
    cart.discountAmount = 0;
    cart.discountCode = undefined;
    await cart.save();

    // Add loyalty points to user
    if (payload) {
      await User.findByIdAndUpdate(payload.sub, {
        $inc: { loyaltyPoints: loyaltyPointsEarned },
      });
    }

    return created(
      { orderId: order._id, orderNumber: order.orderNumber, total },
      "Order placed successfully"
    );
  } catch (error) {
    return serverError("Failed to place order", error);
  }
}