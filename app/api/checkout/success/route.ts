import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { authenticateRequest } from "@/lib/auth";
import { ok, notFound, forbidden, serverError } from "@/lib/api";

// GET /api/checkout/success?orderNumber=ME-004821
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const orderNumber = req.nextUrl.searchParams.get("orderNumber");
    const orderId = req.nextUrl.searchParams.get("orderId");

    if (!orderNumber && !orderId) {
      return notFound("Order reference is required.");
    }

    const filter = orderNumber
      ? { orderNumber: orderNumber.toUpperCase() }
      : { _id: orderId };

    const order = await Order.findOne(filter).populate(
      "items.product",
      "name slug images"
    );

    if (!order) return notFound("Order not found.");

    // For authenticated users, verify ownership
    const payload = await authenticateRequest(req);
    if (payload && order.user && order.user.toString() !== payload.sub) {
      return forbidden("Access denied.");
    }

    return ok({
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      items: order.items,
      subtotal: order.subtotal,
      discountAmount: order.discountAmount,
      shippingCost: order.shippingCost,
      total: order.total,
      shippingAddress: order.shippingAddress,
      shippingMethod: order.shippingMethod,
      estimatedDelivery: order.estimatedDelivery,
      loyaltyPointsEarned: order.loyaltyPointsEarned,
      createdAt: order.createdAt,
    });
  } catch (error) {
    return serverError("Failed to fetch order confirmation", error);
  }
}