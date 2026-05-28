import { headers } from "next/headers";
import type { ReactNode } from "react";
import AdminSidebar from "@/modules/admin/components/layout/admin-sidebar";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = (await headers()).get("x-pathname") ?? "";

  if (pathname === "/admin/giris") {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 ml-60 min-h-screen">{children}</main>
    </div>
  );
}
