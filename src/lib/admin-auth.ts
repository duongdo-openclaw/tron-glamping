import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const ADMIN_COOKIE_NAME = "tron_admin";

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || "";
}

function signToken(seed: string) {
  const secret = getAdminPassword();
  if (!secret) return "";
  return createHmac("sha256", secret).update(seed).digest("hex");
}

export function isAdminPasswordValid(password: string) {
  const expected = getAdminPassword();
  if (!expected) return false;
  return password === expected;
}

export function makeAdminCookieToken() {
  return signToken("tron-admin-auth");
}

export function isAdminTokenValid(rawToken: string | undefined) {
  if (!rawToken) return false;
  const expected = makeAdminCookieToken();
  if (!expected) return false;

  const a = Buffer.from(rawToken);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;

  return timingSafeEqual(a, b);
}

export async function isAdminAuthed() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return isAdminTokenValid(token);
}

export async function requireAdminPage() {
  const ok = await isAdminAuthed();
  if (!ok) redirect("/admin/login");
}

export async function requireAdminApi() {
  const ok = await isAdminAuthed();
  if (!ok) {
    throw new Error("UNAUTHORIZED");
  }
}
