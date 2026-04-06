import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { authenticateRequest } from "@/lib/auth";
import { AddressSchema, parseBody } from "@/lib/validations";
import { ok, created, badRequest, notFound, unauthorized, serverError } from "@/lib/api";
import mongoose from "mongoose";

// GET /api/user/addresses
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const payload = await authenticateRequest(req);
    if (!payload) return unauthorized();

    const user = await User.findById(payload.sub).select("addresses");
    if (!user) return unauthorized();

    return ok(user.addresses);
  } catch (error) {
    return serverError("Failed to fetch addresses", error);
  }
}

// POST /api/user/addresses  — add address
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const payload = await authenticateRequest(req);
    if (!payload) return unauthorized();

    const body = await req.json();
    const parsed = parseBody(AddressSchema, body);
    if (!parsed.success) return badRequest("Validation failed", parsed.errors);

    const user = await User.findById(payload.sub);
    if (!user) return unauthorized();

    // If new address is default, clear others
    if (parsed.data.isDefault) {
      user.addresses.forEach((a) => { a.isDefault = false; });
    }

    // If no addresses yet, make this one default
    if (user.addresses.length === 0) {
      parsed.data.isDefault = true;
    }

    user.addresses.push(parsed.data as typeof user.addresses[0]);
    await user.save();

    return created(user.addresses, "Address added");
  } catch (error) {
    return serverError("Failed to add address", error);
  }
}

// PUT /api/user/addresses/[addressId]  — update address (handled in sub-route)
// DELETE /api/user/addresses?addressId=xxx
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const payload = await authenticateRequest(req);
    if (!payload) return unauthorized();

    const addressId = req.nextUrl.searchParams.get("addressId");
    if (!addressId) return badRequest("addressId is required.");

    const user = await User.findById(payload.sub);
    if (!user) return unauthorized();

    const addr = user.addresses.id(addressId);
    if (!addr) return notFound("Address not found.");

    const wasDefault = addr.isDefault;
    user.addresses.pull({ _id: new mongoose.Types.ObjectId(addressId) });

    // If deleted was default, make first remaining one default
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();
    return ok(user.addresses, "Address removed");
  } catch (error) {
    return serverError("Failed to remove address", error);
  }
}

// PATCH /api/user/addresses?addressId=xxx  — update or set default
export async function PATCH(req: NextRequest) {
  try {
    await connectDB();
    const payload = await authenticateRequest(req);
    if (!payload) return unauthorized();

    const addressId = req.nextUrl.searchParams.get("addressId");
    if (!addressId) return badRequest("addressId is required.");

    const body = await req.json();
    const user = await User.findById(payload.sub);
    if (!user) return unauthorized();

    const addr = user.addresses.id(addressId);
    if (!addr) return notFound("Address not found.");

    // Handle set-as-default
    if (body.setDefault) {
      user.addresses.forEach((a) => { a.isDefault = false; });
      addr.isDefault = true;
    } else {
      // Merge fields
      Object.assign(addr, body);
      if (addr.isDefault) {
        user.addresses.forEach((a) => {
          if (a._id?.toString() !== addressId) a.isDefault = false;
        });
      }
    }

    await user.save();
    return ok(user.addresses, "Address updated");
  } catch (error) {
    return serverError("Failed to update address", error);
  }
}