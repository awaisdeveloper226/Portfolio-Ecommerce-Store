import { z } from "zod";

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const RegisterSchema = z.object({
  firstName: z.string().min(1).max(50).trim(),
  lastName: z.string().min(1).max(50).trim(),
  email: z.string().email().toLowerCase().trim(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[0-9]/, "Must contain a number"),
});

export const LoginSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(1),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
});

export const ResetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/)
    .regex(/[0-9]/),
});

// ─── User / Profile ───────────────────────────────────────────────────────────

export const UpdateProfileSchema = z.object({
  firstName: z.string().min(1).max(50).trim().optional(),
  lastName: z.string().min(1).max(50).trim().optional(),
  phone: z.string().optional(),
  communicationPrefs: z
    .object({
      newArrivals: z.boolean().optional(),
      memberOffers: z.boolean().optional(),
      styleNotes: z.boolean().optional(),
      orderUpdates: z.boolean().optional(),
    })
    .optional(),
});

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z
    .string()
    .min(8)
    .regex(/[A-Z]/)
    .regex(/[0-9]/),
});

export const AddressSchema = z.object({
  label: z.string().default("Home"),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  line1: z.string().min(1).max(200),
  line2: z.string().max(200).optional(),
  city: z.string().min(1).max(100),
  state: z.string().max(100).optional(),
  postCode: z.string().min(1).max(20),
  country: z.string().min(1).max(100),
  phone: z.string().optional(),
  isDefault: z.boolean().default(false),
});

// ─── Products ─────────────────────────────────────────────────────────────────

export const ProductQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  category: z
    .enum(["dresses", "tops", "trousers", "outerwear", "knitwear", "accessories"])
    .optional(),
  search: z.string().optional(),
  sort: z
    .enum(["newest", "oldest", "price_asc", "price_desc", "rating", "bestselling"])
    .default("newest"),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  sizes: z.string().optional(), // comma-separated: "S,M,L"
  colors: z.string().optional(),
  tag: z.enum(["New", "Bestseller", "Sale"]).optional(),
  collection: z.string().optional(),
  isFeatured: z.coerce.boolean().optional(),
  inStock: z.coerce.boolean().optional(),
});

// ─── Cart ─────────────────────────────────────────────────────────────────────

export const AddToCartSchema = z.object({
  productId: z.string().min(1),
  size: z.string().min(1),
  color: z.string().optional(),
  colorLabel: z.string().optional(),
  colorHex: z.string().optional(),
  sku: z.string().min(1),
  quantity: z.coerce.number().min(1).max(10).default(1),
});

export const UpdateCartItemSchema = z.object({
  itemId: z.string().min(1),
  quantity: z.coerce.number().min(0).max(10), // 0 = remove
});

// ─── Checkout ─────────────────────────────────────────────────────────────────

export const CheckoutSchema = z.object({
  email: z.string().email(),
  shippingAddress: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    line1: z.string().min(1),
    line2: z.string().optional(),
    city: z.string().min(1),
    state: z.string().optional(),
    postCode: z.string().min(1),
    country: z.string().min(1),
    phone: z.string().optional(),
  }),
  billingAddressSameAsShipping: z.boolean().default(true),
  billingAddress: z
    .object({
      firstName: z.string().min(1),
      lastName: z.string().min(1),
      line1: z.string().min(1),
      line2: z.string().optional(),
      city: z.string().min(1),
      postCode: z.string().min(1),
      country: z.string().min(1),
    })
    .optional(),
  shippingMethod: z.enum(["standard", "express", "next_day"]).default("standard"),
  discountCode: z.string().optional(),
  paymentMethod: z.enum(["card", "paypal", "apple_pay"]).default("card"),
});

// ─── Reviews ─────────────────────────────────────────────────────────────────

export const CreateReviewSchema = z.object({
  productId: z.string().min(1),
  rating: z.coerce.number().min(1).max(5),
  title: z.string().max(120).optional(),
  body: z.string().min(10).max(2000),
});

// ─── Helper: parse and validate ───────────────────────────────────────────────

export type ParseResult<T> =
  | { success: true; data: T }
  | { success: false; errors: Record<string, string> };

export function parseBody<T>(schema: z.ZodSchema<T>, input: unknown): ParseResult<T> {
  const result = schema.safeParse(input);
  if (result.success) {
    return { success: true, data: result.data };
  }
  const errors: Record<string, string> = {};
  result.error.errors.forEach((e) => {
    const key = e.path.join(".");
    errors[key] = e.message;
  });
  return { success: false, errors };
}