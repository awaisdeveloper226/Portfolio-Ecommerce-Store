import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { authenticateRequest } from "@/lib/auth";
import { ChangePasswordSchema, parseBody } from "@/lib/validations";
import { ok, badRequest, unauthorized, serverError } from "@/lib/api";

// POST /api/user/password
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const payload = await authenticateRequest(req);
    if (!payload) return unauthorized();

    const body = await req.json();
    const parsed = parseBody(ChangePasswordSchema, body);
    if (!parsed.success) return badRequest("Validation failed", parsed.errors);

    const { currentPassword, newPassword } = parsed.data;

    const user = await User.findById(payload.sub).select("+password");
    if (!user) return unauthorized("User not found.");

    const isValid = await user.comparePassword(currentPassword);
    if (!isValid) return badRequest("Current password is incorrect.");

    user.password = newPassword;
    await user.save();

    return ok(null, "Password changed successfully.");
  } catch (error) {
    return serverError("Failed to change password", error);
  }
}