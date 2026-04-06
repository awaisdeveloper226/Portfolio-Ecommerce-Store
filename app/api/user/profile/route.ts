import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { authenticateRequest } from "@/lib/auth";
import {
  UpdateProfileSchema,
  ChangePasswordSchema,
  parseBody,
} from "@/lib/validations";
import { ok, badRequest, unauthorized, serverError } from "@/lib/api";

// GET /api/user/profile
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const payload = await authenticateRequest(req);
    if (!payload) return unauthorized();

    const user = await User.findById(payload.sub).select(
      "-password -passwordResetToken -emailVerificationToken"
    );
    if (!user) return unauthorized("User not found.");

    return ok(user);
  } catch (error) {
    return serverError("Failed to fetch profile", error);
  }
}

// PATCH /api/user/profile
export async function PATCH(req: NextRequest) {
  try {
    await connectDB();

    const payload = await authenticateRequest(req);
    if (!payload) return unauthorized();

    const body = await req.json();
    const parsed = parseBody(UpdateProfileSchema, body);
    if (!parsed.success) return badRequest("Validation failed", parsed.errors);

    const user = await User.findByIdAndUpdate(
      payload.sub,
      { $set: parsed.data },
      { new: true, runValidators: true }
    ).select("-password -passwordResetToken -emailVerificationToken");

    if (!user) return unauthorized("User not found.");

    return ok(user, "Profile updated successfully");
  } catch (error) {
    return serverError("Failed to update profile", error);
  }
}