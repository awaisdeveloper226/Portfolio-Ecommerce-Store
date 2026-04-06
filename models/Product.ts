import mongoose, { Schema, Document, Model } from "mongoose";

export interface IVariant {
  color: string;
  colorLabel: string;
  colorHex: string;
  size: string;
  sku: string;
  stock: number;
  price?: number; // override if differs from base
}

export interface IProduct extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  category: string;
  subcategory?: string;
  price: number;
  compareAtPrice?: number; // original price for sale items
  cost?: number; // COGS (admin only)
  images: {
    url: string;
    alt?: string;
    position: number;
  }[];
  colors: {
    label: string;
    hex: string;
  }[];
  availableSizes: string[];
  variants: IVariant[];
  tags: string[];
  materials: string[];
  careInstructions?: string;
  sustainability?: string;
  isActive: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestseller: boolean;
  isSustainable: boolean;
  tag?: "New" | "Bestseller" | "Sale" | null;
  totalStock: number;
  reviewCount: number;
  averageRating: number;
  collections: string[]; // e.g. ['ss25', 'linen-edit']
  weight?: number; // grams, for shipping
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  metaTitle?: string;
  metaDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const VariantSchema = new Schema<IVariant>({
  color: String,
  colorLabel: String,
  colorHex: String,
  size: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  stock: { type: Number, required: true, default: 0, min: 0 },
  price: Number,
});

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true, index: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    description: { type: String, required: true },
    shortDescription: String,
    category: {
      type: String,
      required: true,
      enum: ["dresses", "tops", "trousers", "outerwear", "knitwear", "accessories"],
      index: true,
    },
    subcategory: String,
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, min: 0 },
    cost: { type: Number, min: 0, select: false },
    images: [
      {
        url: { type: String, required: true },
        alt: String,
        position: { type: Number, default: 0 },
      },
    ],
    colors: [
      {
        label: String,
        hex: String,
      },
    ],
    availableSizes: [{ type: String, enum: ["XS", "S", "M", "L", "XL", "XXL"] }],
    variants: [VariantSchema],
    tags: [String],
    materials: [String],
    careInstructions: String,
    sustainability: String,
    isActive: { type: Boolean, default: true, index: true },
    isFeatured: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isBestseller: { type: Boolean, default: false },
    isSustainable: { type: Boolean, default: true },
    tag: { type: String, enum: ["New", "Bestseller", "Sale", null], default: null },
    totalStock: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    collections: [{ type: String, index: true }],
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
    },
    metaTitle: String,
    metaDescription: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for search & filtering
ProductSchema.index({ name: "text", description: "text", tags: "text" });
ProductSchema.index({ price: 1 });
ProductSchema.index({ averageRating: -1 });
ProductSchema.index({ createdAt: -1 });
ProductSchema.index({ category: 1, isActive: 1 });

// Pre-save: recalculate totalStock from variants
ProductSchema.pre("save", function (next) {
  if (this.variants && this.variants.length > 0) {
    this.totalStock = this.variants.reduce((sum, v) => sum + (v.stock || 0), 0);
  }
  next();
});

const Product: Model<IProduct> =
  mongoose.models.Product ?? mongoose.model<IProduct>("Product", ProductSchema);

export default Product;