import { NextRequest, NextResponse } from "next/server";
import { isRequestAuthenticated, getAuthenticatedUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const authenticated = isRequestAuthenticated(req);
  if (!authenticated) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const username = getAuthenticatedUser(req) || process.env.ADMIN_USERNAME || "admin";

  return NextResponse.json({
    authenticated: true,
    user: username,
    role: "admin",
    singleTabEnforced: true,
  });
}
