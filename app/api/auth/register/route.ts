import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { RegisterSchema, parseBody } from "@/lib/validations";
import { signAccessToken, signRefreshToken, createAuthCookies } from "@/lib/auth";
import { created, badRequest, conflict, serverError } from "@/lib/api";
import { NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const parsed = parseBody(RegisterSchema, body);
    if (!parsed.success) return badRequest("Validation failed", parsed.errors);

    const { firstName, lastName, email, password } = parsed.data;

    // Check for existing user
    const existing = await User.findOne({ email });
    if (existing) return conflict("An account with this email already exists.");

    // Create user
    const user = await User.create({ firstName, lastName, email, password });

    // Issue tokens
    const accessToken = await signAccessToken({
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    });
    const refreshToken = await signRefreshToken(user._id.toString());

    const cookies = createAuthCookies(accessToken, refreshToken);

    const response = created(
      {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          loyaltyPoints: user.loyaltyPoints,
          loyaltyTier: user.loyaltyTier,
        },
        accessToken,
      },
      "Account created successfully"
    );

    response.cookies.set(cookies.accessToken);
    response.cookies.set(cookies.refreshToken);

    return response;
  } catch (error) {
    return serverError("Failed to create account", error);
  }
}