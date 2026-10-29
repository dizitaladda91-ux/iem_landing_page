import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { signJwt, verifyJwt, decodeJwtPayload } from "@/lib/jwt";
import { isTokenRevoked, revokeToken } from "@/lib/dataStore";

const DEFAULT_USERNAME = process.env.ADMIN_USERNAME || "admin";
const DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD || "jashn@runway2026";
const SECRET_KEY =
  process.env.ADMIN_JWT_SECRET ||
  process.env.ADMIN_SECRET ||
  "iem-runway-jwt-secret-key-lucknow-2026-auth";

export const COOKIE_NAME = "iem_admin_session";

/**
 * Generate an RFC-compliant HS256 JWT for admin
 */
export function generateAuthToken(username: string): string {
  return signJwt(
    {
      sub: username,
      role: "admin",
      permissions: ["contestants:write", "leads:read", "logs:read"],
    },
    SECRET_KEY,
    12 * 60 * 60 // 12 hours validity
  );
}

/**
 * Verify JWT token with signature, expiry, and active session check
 */
export function verifyAuthToken(token: string): boolean {
  if (!token) return false;

  const result = verifyJwt(token, SECRET_KEY);
  if (!result.valid || !result.payload) {
    return false;
  }

  // Check if session was revoked on logout
  if (result.payload.jti && isTokenRevoked(result.payload.jti)) {
    return false;
  }

  return true;
}

/**
 * Invalidate a token on logout so it can never be reused
 */
export async function invalidateAuthToken(token: string): Promise<void> {
  if (!token) return;
  const payload = decodeJwtPayload(token);
  if (payload && payload.jti) {
    await revokeToken(payload.jti, payload.exp);
  }
}

/**
 * Check admin login credentials
 */
export function checkAdminCredentials(id: string, pass: string): boolean {
  const expectedUser = process.env.ADMIN_USERNAME || DEFAULT_USERNAME;
  const expectedPass = process.env.ADMIN_PASSWORD || DEFAULT_PASSWORD;
  return id === expectedUser && pass === expectedPass;
}

/**
 * Check if the incoming request has a valid, unrevoked JWT session
 */
export function isRequestAuthenticated(request?: NextRequest): boolean {
  if (request) {
    // 1. Check HTTP-only cookie
    const cookieToken = request.cookies.get(COOKIE_NAME)?.value;
    if (cookieToken && verifyAuthToken(cookieToken)) {
      return true;
    }

    // 2. Check Bearer Authorization header
    const authHeader = request.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7).trim();
      if (verifyAuthToken(token)) {
        return true;
      }
    }
  }

  // 3. Fallback to server cookies() store
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (token && verifyAuthToken(token)) {
      return true;
    }
  } catch {
    // Ignore when cookies() context not available
  }

  return false;
}

/**
 * Helper to get authenticated username from request
 */
export function getAuthenticatedUser(request?: NextRequest): string | null {
  let token: string | undefined;

  if (request) {
    token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
      const authHeader = request.headers.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7).trim();
      }
    }
  }

  if (!token) {
    try {
      token = cookies().get(COOKIE_NAME)?.value;
    } catch {
      // ignore
    }
  }

  if (token) {
    const result = verifyJwt(token, SECRET_KEY);
    if (result.valid && result.payload && !isTokenRevoked(result.payload.jti)) {
      return result.payload.sub || "admin";
    }
  }

  return null;
}
