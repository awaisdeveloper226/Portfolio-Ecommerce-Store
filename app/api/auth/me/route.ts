// /app/api/auth/me/route.ts

import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { authenticateRequest } from "@/lib/auth";
import { ok, unauthorized, serverError } from "@/lib/api";

// GET /api/auth/me
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const payload = await authenticateRequest(req);
    if (!payload) return unauthorized();

    const user = await User.findById(payload.sub).select(
      "-password -passwordResetToken -emailVerificationToken"
    );

    if (!user) return unauthorized("User not found.");

    return ok({
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      loyaltyPoints: user.loyaltyPoints,
      loyaltyTier: user.loyaltyTier,
      avatar: user.avatar,
      phone: user.phone,
      addresses: user.addresses,
      communicationPrefs: user.communicationPrefs,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
    });
  } catch (error) {
    return serverError("Failed to fetch user", error);
  }
}