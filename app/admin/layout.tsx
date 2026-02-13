"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AdminProvider, useAdmin } from "@/context/AdminContext";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAdmin();
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!loading && !user && !isLoginPage) {
      router.push("/admin/login");
    }
  }, [user, loading, router, isLoginPage]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-dark text-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading Suroloyo Admin...</p>
        </div>
      </div>
    );
  }

  // Jika di halaman login, tampilkan tanpa sidebar/header
  if (isLoginPage) {
    return <div className="min-h-screen bg-background-dark">{children}</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background-dark flex">
      {/* Sidebar - Fixed on left */}
      <AdminSidebar />
      
      {/* Main Content Area */}
      <main className="flex-1 ml-64 min-h-screen flex flex-col">
        <AdminHeader />
        <div className="flex-1 p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminProvider>
  );
}
