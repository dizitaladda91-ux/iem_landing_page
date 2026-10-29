import crypto from "crypto";

export interface JwtPayload {
  sub: string;
  role: string;
  iat: number;
  exp: number;
  jti: string;
  [key: string]: any;
}

// Convert string / buffer to base64url
function base64UrlEncode(input: Buffer | string): string {
  const buf = typeof input === "string" ? Buffer.from(input, "utf-8") : input;
  return buf
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

// Decode base64url to string
function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return Buffer.from(base64, "base64").toString("utf-8");
}

/**
 * Sign a JWT using HMAC SHA256 (HS256)
 * @param payload Claims payload
 * @param secret Secret key for signing
 * @param expiresInSeconds Lifetime in seconds (default 12 hours)
 */
export function signJwt(
  payload: Record<string, any>,
  secret: string,
  expiresInSeconds: number = 12 * 60 * 60
): string {
  const now = Math.floor(Date.now() / 1000);
  const jti = crypto.randomBytes(16).toString("hex");

  const fullPayload: JwtPayload = {
    ...payload,
    sub: payload.sub || "admin",
    role: payload.role || "admin",
    iat: now,
    exp: now + expiresInSeconds,
    jti,
  };

  const header = {
    alg: "HS256",
    typ: "JWT",
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));
  const dataToSign = `${encodedHeader}.${encodedPayload}`;

  const signature = crypto
    .createHmac("sha256", secret)
    .update(dataToSign)
    .digest();

  const encodedSignature = base64UrlEncode(signature);

  return `${dataToSign}.${encodedSignature}`;
}

/**
 * Verify an HS256 JWT
 */
export function verifyJwt(
  token: string,
  secret: string
): { valid: boolean; payload?: JwtPayload; reason?: string } {
  if (!token || typeof token !== "string") {
    return { valid: false, reason: "Missing or invalid token format" };
  }

  const parts = token.split(".");
  if (parts.length !== 3) {
    return { valid: false, reason: "Invalid JWT segments count" };
  }

  const [encodedHeader, encodedPayload, encodedSignature] = parts;

  // 1. Verify header
  try {
    const header = JSON.parse(base64UrlDecode(encodedHeader));
    if (header.alg !== "HS256" || header.typ !== "JWT") {
      return { valid: false, reason: "Unsupported algorithm or token type" };
    }
  } catch {
    return { valid: false, reason: "Malformed token header" };
  }

  // 2. Verify signature
  const dataToSign = `${encodedHeader}.${encodedPayload}`;
  const expectedSignature = base64UrlEncode(
    crypto.createHmac("sha256", secret).update(dataToSign).digest()
  );

  // Constant time comparison to prevent timing attacks
  const sigBuffer = Buffer.from(encodedSignature);
  const expectedBuffer = Buffer.from(expectedSignature);
  if (
    sigBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(sigBuffer, expectedBuffer)
  ) {
    return { valid: false, reason: "Invalid cryptographic signature" };
  }

  // 3. Verify payload & expiration
  try {
    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as JwtPayload;
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp < now) {
      return { valid: false, reason: "Token has expired" };
    }

    return { valid: true, payload };
  } catch {
    return { valid: false, reason: "Malformed token payload" };
  }
}

/**
 * Extract payload without verifying signature (useful for reading jti during revocation)
 */
export function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    return JSON.parse(base64UrlDecode(parts[1])) as JwtPayload;
  } catch {
    return null;
  }
}
