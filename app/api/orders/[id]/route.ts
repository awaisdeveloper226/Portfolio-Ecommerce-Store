import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { authenticateRequest } from "@/lib/auth";
import { ok, badRequest, notFound, forbidden, serverError } from "@/lib/api";

interface Params {
  params: Promise<{ id: string }>;
}

// GET /api/orders/[id]
export async function GET(req: NextRequest, { params }: Params) {
  try {
    await connectDB();

    const payload = await authenticateRequest(req);
    if (!payload) return forbidden("Authentication required.");

    const { id } = await params;

    // Support lookup by orderId or orderNumber (e.g. ME-004821)
    const order = await Order.findOne({
      $or: [
        ...(id.match(/^[a-f\d]{24}$/i) ? [{ _id: id }] : []),
        { orderNumber: id.toUpperCase() },
      ],
    }).populate("items.product", "name slug images");

    if (!order) return notFound("Order not found.");

    // Users can only see their own orders; admins see all
    if (
      payload.role !== "admin" &&
      order.user?.toString() !== payload.sub
    ) {
      return forbidden("Access denied.");
    }

    return ok(order);
  } catch (error) {
    return serverError("Failed to fetch order", error);
  }
}

// PATCH /api/orders/[id]  — update status (admin) or cancel (customer)
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    await connectDB();

    const payload = await authenticateRequest(req);
    if (!payload) return forbidden("Authentication required.");

    const { id } = await params;
    const body = await req.json();
    const { status, trackingNumber, trackingUrl, carrier, estimatedDelivery, note } = body;

    const order = await Order.findOne({
      $or: [
        ...(id.match(/^[a-f\d]{24}$/i) ? [{ _id: id }] : []),
        { orderNumber: id.toUpperCase() },
      ],
    });

    if (!order) return notFound("Order not found.");

    // Customers can only cancel their own pending orders
    if (payload.role !== "admin") {
      if (order.user?.toString() !== payload.sub) return forbidden("Access denied.");
      if (status && status !== "cancelled") return forbidden("You can only cancel orders.");
      if (status === "cancelled" && !["pending", "confirmed"].includes(order.status)) {
        return badRequest("This order cannot be cancelled.");
      }
    }

    if (status) order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (trackingUrl) order.trackingUrl = trackingUrl;
    if (carrier) order.carrier = carrier;
    if (estimatedDelivery) order.estimatedDelivery = new Date(estimatedDelivery);
    if (status === "delivered") order.deliveredAt = new Date();

    // Status history pushed automatically by pre-save hook
    await order.save();

    return ok(order, "Order updated successfully");
  } catch (error) {
    return serverError("Failed to update order", error);
  }
}