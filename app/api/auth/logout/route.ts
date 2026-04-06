// /app/api/auth/logout/route.ts

import { NextResponse } from "next/server";
import { clearAuthCookies } from "@/lib/auth";
import { ok } from "@/lib/api";

// POST /api/auth/logout
export async function POST() {
  const clear = clearAuthCookies();

  const response = ok(null, "Logged out successfully");
  response.cookies.set(clear.accessToken);
  response.cookies.set(clear.refreshToken);

  return response;
}