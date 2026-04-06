import { NextRequest } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { ForgotPasswordSchema, parseBody } from "@/lib/validations";
import { ok, badRequest, serverError } from "@/lib/api";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const parsed = parseBody(ForgotPasswordSchema, body);
    if (!parsed.success) return badRequest("Validation failed", parsed.errors);

    const { email } = parsed.data;

    const user = await User.findOne({ email });

    // Always return ok to prevent email enumeration
    if (!user) {
      return ok(
        null,
        "If an account exists with that email, you will receive a password reset link."
      );
    }

    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save({ validateBeforeSave: false });

    // TODO: Send email with reset link
    // await sendPasswordResetEmail(email, token);
    // Reset link would be: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password/${token}`

    if (process.env.NODE_ENV === "development") {
      console.log(`[DEV] Password reset token for ${email}: ${token}`);
    }

    return ok(
      null,
      "If an account exists with that email, you will receive a password reset link."
    );
  } catch (error) {
    return serverError("Failed to process request", error);
  }
}