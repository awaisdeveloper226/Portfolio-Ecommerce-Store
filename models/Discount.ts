import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDiscount extends Document {
  _id: mongoose.Types.ObjectId;
  code: string;
  type: "percentage" | "fixed";
  value: number; // percent (10 = 10%) or fixed amount
  minOrderValue?: number;
  maxUses?: number;
  usedCount: number;
  usedBy: mongoose.Types.ObjectId[];
  isActive: boolean;
  startsAt?: Date;
  expiresAt?: Date;
  appliesTo: "all" | "specific_products" | "specific_categories";
  productIds?: mongoose.Types.ObjectId[];
  categories?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const DiscountSchema = new Schema<IDiscount>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, index: true },
    type: { type: String, enum: ["percentage", "fixed"], required: true },
    value: { type: Number, required: true, min: 0 },
    minOrderValue: { type: Number, min: 0 },
    maxUses: Number,
    usedCount: { type: Number, default: 0 },
    usedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    isActive: { type: Boolean, default: true },
    startsAt: Date,
    expiresAt: Date,
    appliesTo: {
      type: String,
      enum: ["all", "specific_products", "specific_categories"],
      default: "all",
    },
    productIds: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    categories: [String],
  },
  { timestamps: true }
);

const Discount: Model<IDiscount> =
  mongoose.models.Discount ?? mongoose.model<IDiscount>("Discount", DiscountSchema);

export default Discount;