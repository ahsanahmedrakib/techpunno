import type { Metadata } from "next";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { requireAdmin } from "@/lib/auth/guard";

export const metadata: Metadata = {
  title: "Admin | TechPunno",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();
  return (
    <AdminSidebar username={user.username} role={user.role}>
      {children}
    </AdminSidebar>
  );
}