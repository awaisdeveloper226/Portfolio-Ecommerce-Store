import mongoose, { Schema, Document, Model } from "mongoose";

export interface IWishlistItem {
  product: mongoose.Types.ObjectId;
  addedAt: Date;
  notifyOnRestock: boolean;
}

export interface IWishlist extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  items: IWishlistItem[];
  shareToken?: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const WishlistItemSchema = new Schema<IWishlistItem>({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  addedAt: { type: Date, default: Date.now },
  notifyOnRestock: { type: Boolean, default: false },
});

const WishlistSchema = new Schema<IWishlist>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
    items: [WishlistItemSchema],
    shareToken: { type: String, index: true },
    isPublic: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Wishlist: Model<IWishlist> =
  mongoose.models.Wishlist ?? mongoose.model<IWishlist>("Wishlist", WishlistSchema);

export default Wishlist;