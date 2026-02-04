import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE_NAME = "faultee_session";

export async function setSession(user: { email: string }) {
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  const sessionData = JSON.stringify({ email: user.email, expires });

  // In a real app, you would encrypt this session data
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionData, {
    expires,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!session) return null;

  try {
    return JSON.parse(session);
  } catch (e) {
    return null;
  }
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!session) return null;

  // Refresh the session so it doesn't expire if the user is active
  const parsed = JSON.parse(session);
  parsed.expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const res = NextResponse.next();
  res.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: JSON.stringify(parsed),
    httpOnly: true,
    expires: parsed.expires,
  });
  return res;
}
