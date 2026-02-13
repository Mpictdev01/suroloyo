"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Starting Admin login attempt...");

    try {
      // 1. Sign in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        console.error("1. Auth Error:", JSON.stringify(authError, null, 2));
        throw authError;
      }

      const userId = authData.user?.id;
      console.log("2. Auth Success. User ID:", userId);

      // Give a tiny moment for the session to be shared across contexts
      await new Promise(resolve => setTimeout(resolve, 300));

      // 2. Fetch Profile using Server Action (Bypass RLS)
      // We give a small delay to ensure session propagation if needed, though usually redundant with server actions
      await new Promise(resolve => setTimeout(resolve, 300));

      let userData;
      try {
          // Import dynamically to ensure it's treated as server action call
          const { user, error } = await import("@/app/actions").then(mod => mod.checkUserRole(userId));
          
          if (error) {
              console.error("3. Profile Check Error (Server Action):", error);
              throw new Error("Gagal mengambil data profil admin.");
          }
          
          userData = user;
          console.log("4. Profile Data received:", userData);

          if (!userData) {
            console.error("5. No profile found for ID:", userId);
            await supabase.auth.signOut();
            throw new Error("Akun terdaftar, namun profil admin tidak ditemukan.");
          }

          console.log("6. User Role:", userData.role);

          if (userData.role !== "admin" && userData.role !== "super_admin") {
            console.warn("7. Unauthorized access attempt by role:", userData.role);
            await supabase.auth.signOut();
            throw new Error(`Akses ditolak. Peran Anda: '${userData.role}'. Butuh: 'admin'.`);
          }

      } catch (profileErr: any) {
           console.error("Profile check exception:", profileErr);
           throw profileErr;
      }

      toast.success("Login Berhasil! Mengalihkan...");
      setTimeout(() => {
          router.push("/admin");
      }, 300);
    } catch (error: any) {
      console.error("Final catch Login Error:", error);
      if (error.name === 'AbortError' || error.message?.includes('aborted')) return;
      
      const errorMessage = error.message || (typeof error === 'string' ? error : "Terjadi kesalahan sistem saat login.");
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-background-dark to-slate-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 mb-4">
            <span className="material-symbols-outlined text-primary text-3xl">admin_panel_settings</span>
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Admin Panel</h1>
          <p className="text-gray-400">Suroloyo Booking System</p>
        </div>

        {/* Login Form */}
        <div className="bg-surface-dark border border-border-dark rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="text-sm font-bold text-gray-300 mb-2 block">
                Email Admin
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-background-dark border border-border-dark rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-white transition-all placeholder:text-gray-600"
                placeholder="admin@suroloyo.com"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="text-sm font-bold text-gray-300 mb-2 block">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-background-dark border border-border-dark rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-white transition-all placeholder:text-gray-600"
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-primary hover:bg-blue-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Admin Panel</span>
                  <span className="material-symbols-outlined text-xl">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-border-dark">
            <p className="text-center text-sm text-gray-500">
              Hanya untuk admin yang berwenang
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <button
            onClick={() => router.push("/")}
            className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2 mx-auto"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            <span>Kembali ke Beranda</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
