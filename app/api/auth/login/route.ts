import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { LoginSchema, parseBody } from "@/lib/validations";
import { signAccessToken, signRefreshToken, createAuthCookies } from "@/lib/auth";
import { ok, badRequest, unauthorized, serverError } from "@/lib/api";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const parsed = parseBody(LoginSchema, body);
    if (!parsed.success) return badRequest("Validation failed", parsed.errors);

    const { email, password } = parsed.data;

    // Find user with password field
    const user = await User.findOne({ email }).select("+password");
    if (!user) return unauthorized("Invalid email or password.");

    const isValid = await user.comparePassword(password);
    if (!isValid) return unauthorized("Invalid email or password.");

    // Issue tokens
    const accessToken = await signAccessToken({
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    });
    const refreshToken = await signRefreshToken(user._id.toString());

    const cookies = createAuthCookies(accessToken, refreshToken);

    const response = ok(
      {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          loyaltyPoints: user.loyaltyPoints,
          loyaltyTier: user.loyaltyTier,
          avatar: user.avatar,
        },
        accessToken,
      },
      "Logged in successfully"
    );

    response.cookies.set(cookies.accessToken);
    response.cookies.set(cookies.refreshToken);

    return response;
  } catch (error) {
    return serverError("Login failed", error);
  }
}