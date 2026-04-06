import mongoose, { Schema, Document, Model } from "mongoose";

export interface IReview extends Document {
  _id: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  order?: mongoose.Types.ObjectId;
  rating: number; // 1–5
  title?: string;
  body: string;
  verifiedPurchase: boolean;
  images?: string[];
  helpfulVotes: number;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    order: { type: Schema.Types.ObjectId, ref: "Order" },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, maxlength: 120 },
    body: { type: String, required: true, maxlength: 2000 },
    verifiedPurchase: { type: Boolean, default: false },
    images: [String],
    helpfulVotes: { type: Number, default: 0 },
    isApproved: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

// One review per user per product
ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

// After save/delete: update product rating
async function updateProductRating(productId: mongoose.Types.ObjectId) {
  const Review = mongoose.model("Review");
  const stats = await Review.aggregate([
    { $match: { product: productId, isApproved: true } },
    {
      $group: {
        _id: "$product",
        averageRating: { $avg: "$rating" },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  const Product = mongoose.model("Product");
  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
      reviewCount: stats[0].reviewCount,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      averageRating: 0,
      reviewCount: 0,
    });
  }
}

ReviewSchema.post("save", function () {
  updateProductRating(this.product as mongoose.Types.ObjectId);
});

ReviewSchema.post("findOneAndDelete", function (doc) {
  if (doc) updateProductRating(doc.product);
});

const Review: Model<IReview> =
  mongoose.models.Review ?? mongoose.model<IReview>("Review", ReviewSchema);

export default Review;