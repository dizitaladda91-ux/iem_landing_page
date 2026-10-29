import { NextRequest, NextResponse } from "next/server";
import { checkAdminCredentials, generateAuthToken, COOKIE_NAME } from "@/lib/auth";
import { addAuditLog } from "@/lib/dataStore";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    const forwardedFor = req.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";
    const userAgent = req.headers.get("user-agent") || "Browser Client";

    if (!username || !password) {
      await addAuditLog({
        action: "SECURITY_ALERT",
        category: "SECURITY",
        user: username || "Anonymous",
        description: "Failed login attempt: missing credentials.",
        details: `IP: ${ip}, User-Agent: ${userAgent}`,
        ip,
      });

      return NextResponse.json(
        { error: "Please enter both Admin ID and Password." },
        { status: 400 }
      );
    }

    const isValid = checkAdminCredentials(username.trim(), password.trim());
    if (!isValid) {
      await addAuditLog({
        action: "SECURITY_ALERT",
        category: "SECURITY",
        user: username.trim(),
        description: `Failed login attempt for user "${username.trim()}": Invalid credentials.`,
        details: `IP: ${ip}`,
        ip,
      });

      return NextResponse.json(
        { error: "Invalid Admin ID or Password. Please check credentials in .env.local." },
        { status: 401 }
      );
    }

    // Generate RFC-compliant HS256 JWT
    const token = generateAuthToken(username.trim());

    // Log successful login
    await addAuditLog({
      action: "LOGIN",
      category: "AUTH",
      user: username.trim(),
      description: `Admin "${username.trim()}" authenticated successfully via JWT.`,
      details: `Session initialized with Single-Tab protection. IP: ${ip}`,
      ip,
    });

    const response = NextResponse.json({
      success: true,
      message: "Admin authentication successful. JWT session active.",
      username: username.trim(),
      token,
    });

    // Set secure HTTP-only cookie with SameSite=Strict
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 12 * 60 * 60, // 12 hours
      path: "/",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Login process failed." }, { status: 500 });
  }
}
