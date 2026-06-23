import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { Role } from "@prisma/client";

export type { Role } from "@prisma/client";
export {
  isCountryRep,
  canViewSensitiveData,
  isAdmin,
  getPostLoginPath,
} from "@/lib/roles";

export type SessionUser = {
  id: string;
  email: string;
  fullName: string;
  role: Role;
};

const COOKIE_NAME = "iac_session";
const secret = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "dev-secret-change-me"
);

export async function createSession(user: SessionUser) {
  const token = await new SignJWT({
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);

  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function getSession(): Promise<SessionUser | null> {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    return {
      id: payload.id as string,
      email: payload.email as string,
      fullName: payload.fullName as string,
      role: payload.role as Role,
    };
  } catch {
    return null;
  }
}

export async function destroySession() {
  cookies().delete(COOKIE_NAME);
}
