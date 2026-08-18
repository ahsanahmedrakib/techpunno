import {
  ensureSuperAdmin,
  verifyUserCredentials,
  type AuthUser,
} from "./users";

export async function verifyAdminCredentials(
  username: string,
  password: string,
): Promise<AuthUser | null> {
  await ensureSuperAdmin();
  const user = await verifyUserCredentials(username, password);
  return user ? { username: user.username, role: user.role } : null;
}