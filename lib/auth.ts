import { NextRequest } from "next/server";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "maison-elara-secret-change-in-production"
);
const ACCESS_TOKEN_TTL = "15m";
const REFRESH_TOKEN_TTL = "30d";

export interface JWTPayload {
  sub: string;       // user id
  email: string;
  role: "customer" | "admin";
  iat?: number;
  exp?: number;
}

// ─── Token creation ───────────────────────────────────────────────────────────

export async function signAccessToken(payload: Omit<JWTPayload, "iat" | "exp">) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_TTL)
    .sign(JWT_SECRET);
}

export async function signRefreshToken(userId: string) {
  return new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(REFRESH_TOKEN_TTL)
    .sign(JWT_SECRET);
}

// ─── Token verification ───────────────────────────────────────────────────────

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

// ─── Extract token from request ───────────────────────────────────────────────

export function getTokenFromRequest(req: NextRequest): string | null {
  // 1. Authorization header
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }
  // 2. Cookie
  const cookieToken = req.cookies.get("access_token")?.value;
  if (cookieToken) return cookieToken;

  return null;
}

// ─── Authenticate request ─────────────────────────────────────────────────────

export async function authenticateRequest(req: NextRequest): Promise<JWTPayload | null> {
  const token = getTokenFromRequest(req);
  if (!token) return null;
  return verifyToken(token);
}

// ─── Cookie helpers ───────────────────────────────────────────────────────────

export function createAuthCookies(accessToken: string, refreshToken: string) {
  return {
    accessToken: {
      name: "access_token",
      value: accessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      maxAge: 15 * 60, // 15 minutes
      path: "/",
    },
    refreshToken: {
      name: "refresh_token",
      value: refreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    },
  };
}

export function clearAuthCookies() {
  return {
    accessToken: {
      name: "access_token",
      value: "",
      maxAge: 0,
      path: "/",
    },
    refreshToken: {
      name: "refresh_token",
      value: "",
      maxAge: 0,
      path: "/",
    },
  };
}