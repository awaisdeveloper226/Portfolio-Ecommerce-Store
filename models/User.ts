import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

export interface IAddress {
  _id?: mongoose.Types.ObjectId;
  label: string;
  firstName: string;
  lastName: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  avatar?: string;
  phone?: string;
  role: "customer" | "admin";
  addresses: IAddress[];
  loyaltyPoints: number;
  loyaltyTier: "Bronze" | "Silver" | "Gold" | "Platinum";
  emailVerified: boolean;
  emailVerificationToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  wishlist: mongoose.Types.ObjectId[];
  communicationPrefs: {
    newArrivals: boolean;
    memberOffers: boolean;
    styleNotes: boolean;
    orderUpdates: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
  fullName: string;
}

const AddressSchema = new Schema<IAddress>({
  label: { type: String, default: "Home" },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  line1: { type: String, required: true },
  line2: String,
  city: { type: String, required: true },
  state: String,
  postCode: { type: String, required: true },
  country: { type: String, required: true, default: "United Kingdom" },
  phone: String,
  isDefault: { type: Boolean, default: false },
});

const UserSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: { type: String, select: false },
    avatar: String,
    phone: String,
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    addresses: [AddressSchema],
    loyaltyPoints: { type: Number, default: 0 },
    loyaltyTier: {
      type: String,
      enum: ["Bronze", "Silver", "Gold", "Platinum"],
      default: "Bronze",
    },
    emailVerified: { type: Boolean, default: false },
    emailVerificationToken: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
    wishlist: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    communicationPrefs: {
      newArrivals: { type: Boolean, default: true },
      memberOffers: { type: Boolean, default: true },
      styleNotes: { type: Boolean, default: false },
      orderUpdates: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: full name
UserSchema.virtual("fullName").get(function (this: IUser) {
  return `${this.firstName} ${this.lastName}`;
});

// Pre-save: hash password
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Pre-save: update loyalty tier
UserSchema.pre("save", function (next) {
  if (this.isModified("loyaltyPoints")) {
    if (this.loyaltyPoints >= 5000) this.loyaltyTier = "Platinum";
    else if (this.loyaltyPoints >= 2000) this.loyaltyTier = "Gold";
    else if (this.loyaltyPoints >= 500) this.loyaltyTier = "Silver";
    else this.loyaltyTier = "Bronze";
  }
  next();
});

// Method: compare password
UserSchema.methods.comparePassword = async function (
  candidate: string
): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidate, this.password);
};

const User: Model<IUser> =
  mongoose.models.User ?? mongoose.model<IUser>("User", UserSchema);

export default User;