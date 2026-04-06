import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICartItem {
  product: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  image?: string;
  color: string;
  colorLabel: string;
  colorHex: string;
  size: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  compareAtPrice?: number;
}

export interface ICart extends Document {
  _id: mongoose.Types.ObjectId;
  user?: mongoose.Types.ObjectId;
  sessionId?: string; // for guest carts
  items: ICartItem[];
  discountCode?: string;
  discountAmount: number;
  subtotal: number;
  total: number;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema = new Schema<ICartItem>({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  name: { type: String, required: true },
  slug: { type: String, required: true },
  image: String,
  color: String,
  colorLabel: String,
  colorHex: String,
  size: { type: String, required: true },
  sku: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1, max: 10 },
  unitPrice: { type: Number, required: true },
  compareAtPrice: Number,
});

const CartSchema = new Schema<ICart>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", index: true },
    sessionId: { type: String, index: true },
    items: [CartItemSchema],
    discountCode: String,
    discountAmount: { type: Number, default: 0 },
    subtotal: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      index: { expireAfterSeconds: 0 },
    },
  },
  { timestamps: true }
);

// Recalculate totals before saving
CartSchema.pre("save", function (next) {
  this.subtotal = this.items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );
  this.total = Math.max(0, this.subtotal - this.discountAmount);
  next();
});

const Cart: Model<ICart> =
  mongoose.models.Cart ?? mongoose.model<ICart>("Cart", CartSchema);

export default Cart;