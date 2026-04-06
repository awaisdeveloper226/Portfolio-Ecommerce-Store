import { NextResponse } from "next/server";

export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string>;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
};

export function ok<T>(data: T, message?: string, meta?: ApiResponse["meta"], status = 200) {
  return NextResponse.json<ApiResponse<T>>(
    { success: true, data, message, meta },
    { status }
  );
}

export function created<T>(data: T, message = "Created successfully") {
  return NextResponse.json<ApiResponse<T>>(
    { success: true, data, message },
    { status: 201 }
  );
}

export function noContent() {
  return new NextResponse(null, { status: 204 });
}

export function badRequest(message: string, errors?: Record<string, string>) {
  return NextResponse.json<ApiResponse>(
    { success: false, message, errors },
    { status: 400 }
  );
}

export function unauthorized(message = "Unauthorized") {
  return NextResponse.json<ApiResponse>(
    { success: false, message },
    { status: 401 }
  );
}

export function forbidden(message = "Forbidden") {
  return NextResponse.json<ApiResponse>(
    { success: false, message },
    { status: 403 }
  );
}

export function notFound(message = "Not found") {
  return NextResponse.json<ApiResponse>(
    { success: false, message },
    { status: 404 }
  );
}

export function conflict(message: string) {
  return NextResponse.json<ApiResponse>(
    { success: false, message },
    { status: 409 }
  );
}

export function serverError(message = "Internal server error", error?: unknown) {
  if (process.env.NODE_ENV === "development" && error) {
    console.error("[API Error]", error);
  }
  return NextResponse.json<ApiResponse>(
    { success: false, message },
    { status: 500 }
  );
}

// Pagination helper
export function parsePagination(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10)));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

export function buildMeta(total: number, page: number, limit: number) {
  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}