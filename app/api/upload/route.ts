import { NextRequest } from "next/server";
import { authenticateRequest } from "@/lib/auth";
import { ok, badRequest, forbidden, serverError } from "@/lib/api";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

// POST /api/upload
// Handles image uploads for product images and review images
// In production, replace with S3/Cloudflare R2/Vercel Blob upload
export async function POST(req: NextRequest) {
  try {
    const payload = await authenticateRequest(req);
    if (!payload) return forbidden("Authentication required.");

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const context = (formData.get("context") as string) ?? "general"; // product | review | avatar

    if (!file) return badRequest("No file provided.");
    if (!ALLOWED_TYPES.includes(file.type)) {
      return badRequest(`File type not allowed. Use: ${ALLOWED_TYPES.join(", ")}`);
    }
    if (file.size > MAX_SIZE_BYTES) {
      return badRequest(`File too large. Maximum size is ${MAX_SIZE_MB}MB.`);
    }

    // Only admins can upload product images
    if (context === "product" && payload.role !== "admin") {
      return forbidden("Admin access required for product image uploads.");
    }

    // In production, upload to cloud storage:
    //
    // import { put } from "@vercel/blob";
    // const blob = await put(`${context}/${Date.now()}-${file.name}`, file, {
    //   access: "public",
    // });
    // return ok({ url: blob.url }, "File uploaded successfully");
    //
    // Or for AWS S3:
    // const s3 = new S3Client({ region: process.env.AWS_REGION });
    // const key = `${context}/${payload.sub}/${Date.now()}-${file.name}`;
    // await s3.send(new PutObjectCommand({
    //   Bucket: process.env.AWS_S3_BUCKET,
    //   Key: key,
    //   Body: Buffer.from(await file.arrayBuffer()),
    //   ContentType: file.type,
    // }));
    // const url = `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/${key}`;

    // Development mock response
    const mockUrl = `https://cdn.maisonelara.com/${context}/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;

    return ok(
      { url: mockUrl, filename: file.name, size: file.size, type: file.type },
      "File uploaded successfully"
    );
  } catch (error) {
    return serverError("Upload failed", error);
  }
}