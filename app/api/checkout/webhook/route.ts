import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import User from "@/models/User";

// Stripe webhook — called by Stripe on payment events
// POST /api/checkout/webhook
export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature");

  // In production, verify the webhook signature:
  //
  // import Stripe from "stripe";
  // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  // let event: Stripe.Event;
  // try {
  //   event = stripe.webhooks.constructEvent(
  //     rawBody,
  //     signature!,
  //     process.env.STRIPE_WEBHOOK_SECRET!
  //   );
  // } catch (err) {
  //   return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  // }

  // For development, parse the body directly
  let event: { type: string; data: { object: Record<string, unknown> } };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  try {
    await connectDB();

    switch (event.type) {
      case "payment_intent.succeeded": {
        const pi = event.data.object;
        const order = await Order.findOne({
          stripePaymentIntentId: pi.id as string,
        });
        if (order) {
          order.status = "confirmed";
          order.paymentStatus = "paid";
          await order.save();

          // Award loyalty points
          if (order.user && order.loyaltyPointsEarned > 0) {
            await User.findByIdAndUpdate(order.user, {
              $inc: { loyaltyPoints: order.loyaltyPointsEarned },
            });
          }
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const pi = event.data.object;
        await Order.findOneAndUpdate(
          { stripePaymentIntentId: pi.id as string },
          { status: "payment_failed", paymentStatus: "failed" }
        );
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object;
        await Order.findOneAndUpdate(
          { stripePaymentIntentId: charge.payment_intent as string },
          { status: "refunded", paymentStatus: "refunded" }
        );
        break;
      }

      default:
        // Unhandled event type — just acknowledge
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[Webhook Error]", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

// Stripe requires raw body — disable Next.js body parsing
export const config = {
  api: { bodyParser: false },
};