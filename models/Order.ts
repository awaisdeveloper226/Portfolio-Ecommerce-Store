import mongoose, { Schema, Document, Model } from "mongoose";

export type OrderStatus =
  | "pending"
  | "payment_failed"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "return_requested"
  | "returned"
  | "refunded";

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  image?: string;
  color: string;
  colorLabel: string;
  size: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface IOrder extends Document {
  _id: mongoose.Types.ObjectId;
  orderNumber: string; // e.g. ME-004821
  user?: mongoose.Types.ObjectId;
  guestEmail?: string;
  items: IOrderItem[];
  shippingAddress: {
    firstName: string;
    lastName: string;
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postCode: string;
    country: string;
    phone?: string;
  };
  billingAddress?: {
    firstName: string;
    lastName: string;
    line1: string;
    line2?: string;
    city: string;
    postCode: string;
    country: string;
  };
  subtotal: number;
  discountAmount: number;
  discountCode?: string;
  shippingCost: number;
  shippingMethod: "standard" | "express" | "next_day";
  tax: number;
  total: number;
  currency: string;
  status: OrderStatus;
  paymentStatus: "pending" | "paid" | "failed" | "refunded" | "partially_refunded";
  paymentMethod: "card" | "paypal" | "apple_pay";
  stripePaymentIntentId?: string;
  stripeSessionId?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  carrier?: string;
  estimatedDelivery?: Date;
  deliveredAt?: Date;
  notes?: string;
  loyaltyPointsEarned: number;
  loyaltyPointsUsed: number;
  statusHistory: {
    status: OrderStatus;
    timestamp: Date;
    note?: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  name: { type: String, required: true },
  slug: { type: String, required: true },
  image: String,
  color: String,
  colorLabel: String,
  size: { type: String, required: true },
  sku: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
});

const AddressSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    line1: { type: String, required: true },
    line2: String,
    city: { type: String, required: true },
    state: String,
    postCode: { type: String, required: true },
    country: { type: String, required: true },
    phone: String,
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: "User", index: true },
    guestEmail: String,
    items: [OrderItemSchema],
    shippingAddress: AddressSchema,
    billingAddress: AddressSchema,
    subtotal: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 },
    discountCode: String,
    shippingCost: { type: Number, default: 0 },
    shippingMethod: {
      type: String,
      enum: ["standard", "express", "next_day"],
      default: "standard",
    },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    status: {
      type: String,
      enum: [
        "pending",
        "payment_failed",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "return_requested",
        "returned",
        "refunded",
      ],
      default: "pending",
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded", "partially_refunded"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["card", "paypal", "apple_pay"],
      required: true,
    },
    stripePaymentIntentId: { type: String, index: true },
    stripeSessionId: String,
    trackingNumber: String,
    trackingUrl: String,
    carrier: String,
    estimatedDelivery: Date,
    deliveredAt: Date,
    notes: String,
    loyaltyPointsEarned: { type: Number, default: 0 },
    loyaltyPointsUsed: { type: Number, default: 0 },
    statusHistory: [
      {
        status: String,
        timestamp: { type: Date, default: Date.now },
        note: String,
      },
    ],
  },
  { timestamps: true }
);

// Auto-generate order number before saving
OrderSchema.pre("save", async function (next) {
  if (this.isNew && !this.orderNumber) {
    const count = await mongoose.model("Order").countDocuments();
    this.orderNumber = `ME-${String(100000 + count + 1).padStart(6, "0")}`;
  }
  // Push to status history on status change
  if (this.isModified("status")) {
    this.statusHistory.push({ status: this.status, timestamp: new Date() });
  }
  next();
});

const Order: Model<IOrder> =
  mongoose.models.Order ?? mongoose.model<IOrder>("Order", OrderSchema);

export default Order;