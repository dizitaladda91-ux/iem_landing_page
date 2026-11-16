import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, invalidateAuthToken, getAuthenticatedUser } from "@/lib/auth";
import { addAuditLog } from "@/lib/dataStore";

export async function POST(req: NextRequest) {
  try {
    const user = getAuthenticatedUser(req) || "Admin";

    // Extract token to revoke
    const cookieToken = req.cookies.get(COOKIE_NAME)?.value;
    const authHeader = req.headers.get("authorization");
    const headerToken = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;
    const tokenToRevoke = cookieToken || headerToken;

    if (tokenToRevoke) {
      await invalidateAuthToken(tokenToRevoke);
    }

    const forwardedFor = req.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

    // Audit log logout event
    await addAuditLog({
      action: "LOGOUT",
      category: "AUTH",
      user,
      description: `User "${user}" signed out. Active JWT session invalidated immediately.`,
      details: "Cookie cleared and session token added to revoked blacklist in Neon DB.",
      ip,
    });

    const response = NextResponse.json({
      success: true,
      message: "Session terminated successfully. Token revoked.",
    });

    // Delete cookie completely
    response.cookies.delete(COOKIE_NAME);
    response.cookies.set(COOKIE_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
      path: "/",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Logout failed." }, { status: 500 });
  }
}
