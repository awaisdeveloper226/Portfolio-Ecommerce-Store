import { NextRequest } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { ResetPasswordSchema, parseBody } from "@/lib/validations";
import { ok, badRequest, serverError } from "@/lib/api";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const parsed = parseBody(ResetPasswordSchema, body);
    if (!parsed.success) return badRequest("Validation failed", parsed.errors);

    const { token, password } = parsed.data;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return badRequest("Password reset token is invalid or has expired.");
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return ok(null, "Password reset successfully. Please log in with your new password.");
  } catch (error) {
    return serverError("Failed to reset password", error);
  }
}