"use client";

import { useAdmin } from "@/context/AdminContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function AdminHeader() {
  const { user, signOut } = useAdmin();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();

  const getTitle = () => {
    if (pathname === "/admin") return "Dashboard Overview";
    if (pathname.startsWith("/admin/booking")) return "Manajemen Booking";
    if (pathname.startsWith("/admin/users")) return "User Management";
    if (pathname.startsWith("/admin/kuota")) return "Kuota & Jadwal";
    if (pathname.startsWith("/admin/payments")) return "Verifikasi Pembayaran";
    if (pathname.startsWith("/admin/content")) return "Content Management";
    if (pathname.startsWith("/admin/reports")) return "Laporan";
    if (pathname.startsWith("/admin/settings")) return "Pengaturan";
    return "Admin Panel";
  };

  return (
    <header className="h-20 bg-surface-dark/80 backdrop-blur-md border-b border-border-dark sticky top-0 z-40 px-8 flex items-center justify-between">
      {/* Title/Search Area */}
      <div>
        <h1 className="text-xl font-bold text-white">{getTitle()}</h1>
        <p className="text-sm text-gray-500">Selamat datang kembali, {user?.name}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-6">
        {/* Notifications */}
        <button className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-background-dark border border-border-dark text-gray-400 hover:text-white transition-colors">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-surface-dark" />
        </button>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 p-1.5 pl-4 bg-background-dark border border-border-dark rounded-xl hover:bg-background-dark/80 transition-all"
          >
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-white leading-none">{user?.name}</p>
              <p className="text-[10px] text-primary font-medium mt-1 uppercase tracking-wider">{user?.role}</p>
            </div>
            <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center text-primary border border-primary/20">
              <span className="material-symbols-outlined text-xl">person_filled</span>
            </div>
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setIsProfileOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-56 bg-surface-dark border border-border-dark rounded-2xl shadow-2xl p-2 z-20"
                >
                  <div className="p-3 border-b border-border-dark mb-2">
                    <p className="text-xs font-medium text-gray-500">Logged in as</p>
                    <p className="text-sm font-bold text-white truncate">{user?.email}</p>
                  </div>
                  
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                    <span className="material-symbols-outlined text-xl">settings</span>
                    <span className="text-sm font-semibold">Account Settings</span>
                  </button>
                  
                  <button 
                    onClick={() => signOut()}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-all mt-1"
                  >
                    <span className="material-symbols-outlined text-xl">logout</span>
                    <span className="text-sm font-semibold">Sign Out</span>
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
