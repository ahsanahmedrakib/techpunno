import { EncryptJWT, jwtDecrypt } from "jose";
import {
  ACCESS_TTL_SEC,
  REFRESH_TTL_SEC,
  getAccessKey,
  getRefreshKey,
} from "./keys";
import type { UserRole } from "./users";

export interface TokenUser {
  username: string;
  jti: string;
  role: UserRole;
}

export async function createAccessToken(
  username: string,
  role: UserRole,
): Promise<string> {
  return new EncryptJWT({ type: "access", role })
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setSubject(username)
    .setIssuedAt()
    .setExpirationTime(`${ACCESS_TTL_SEC}s`)
    .setJti(crypto.randomUUID())
    .encrypt(await getAccessKey());
}

export async function createRefreshToken(
  username: string,
  jti: string,
  role: UserRole,
): Promise<string> {
  return new EncryptJWT({ type: "refresh", role })
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setSubject(username)
    .setIssuedAt()
    .setExpirationTime(`${REFRESH_TTL_SEC}s`)
    .setJti(jti)
    .encrypt(await getRefreshKey());
}

export async function verifyAccessToken(
  token: string,
): Promise<TokenUser | null> {
  try {
    const { payload } = await jwtDecrypt(token, await getAccessKey());
    if (payload.type !== "access" || !payload.sub || !payload.jti) return null;
    return {
      username: payload.sub,
      jti: payload.jti,
      role: payload.role as UserRole,
    };
  } catch {
    return null;
  }
}

export async function verifyRefreshToken(
  token: string,
): Promise<TokenUser | null> {
  try {
    const { payload } = await jwtDecrypt(token, await getRefreshKey());
    if (payload.type !== "refresh" || !payload.sub || !payload.jti) return null;
    return {
      username: payload.sub,
      jti: payload.jti,
      role: payload.role as UserRole,
    };
  } catch {
    return null;
  }
}