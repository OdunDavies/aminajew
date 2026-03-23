import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";

// In-memory rate limiter: max 5 attempts per IP per 15 minutes
const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function getClientIp(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
}

function checkRateLimit(ip: string): { allowed: boolean; retryAfterSecs: number } {
  const now = Date.now();
  const entry = attempts.get(ip);

  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, retryAfterSecs: 0 };
  }

  if (entry.count >= MAX_ATTEMPTS) {
    return { allowed: false, retryAfterSecs: Math.ceil((entry.resetAt - now) / 1000) };
  }

  entry.count++;
  return { allowed: true, retryAfterSecs: 0 };
}

function clearRateLimit(ip: string) {
  attempts.delete(ip);
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const { allowed, retryAfterSecs } = checkRateLimit(ip);

  if (!allowed) {
    return NextResponse.json(
      { error: `Too many attempts. Try again in ${Math.ceil(retryAfterSecs / 60)} minute(s).` },
      { status: 429, headers: { "Retry-After": String(retryAfterSecs) } }
    );
  }

  const { password } = await request.json();
  const adminPassword = process.env.ADMIN_PASSWORD ?? "";
  const jwtSecret = process.env.ADMIN_JWT_SECRET ?? "";

  if (!adminPassword || !jwtSecret) {
    return NextResponse.json({ error: "Admin credentials not configured on server" }, { status: 503 });
  }

  // Constant-time comparison to prevent timing attacks
  let match = false;
  try {
    match =
      password.length === adminPassword.length &&
      timingSafeEqual(Buffer.from(password), Buffer.from(adminPassword));
  } catch {
    match = false;
  }

  if (!match) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  // Clear failed attempts on successful login
  clearRateLimit(ip);

  const secret = new TextEncoder().encode(jwtSecret);
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);

  const cookieStore = await cookies();
  cookieStore.set("admin_session", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return NextResponse.json({ ok: true });
}
