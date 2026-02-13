"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useBooking } from "@/context/BookingContext";

import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useBooking();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
        const { data, error } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: {
                data: {
                    name: formData.name,
                }
            }
        });

        if (error) throw error;

        toast.success("Pendaftaran berhasil! Silakan cek email untuk verifikasi atau Anda bisa langsung masuk.");
        router.push("/masuk"); 
    } catch (error: any) {
        toast.error(error.message || "Gagal mendaftarkan akun.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="flex-grow flex items-center justify-center pt-24 pb-12 px-4">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface-dark border border-border-dark rounded-2xl p-8 shadow-2xl"
          >
            <div className="text-center mb-8">
              <h1 className="text-2xl font-black text-white mb-2">Buat Akun Baru</h1>
              <p className="text-gray-400 text-sm">Bergabung dengan komunitas Suroloyo.</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-300">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-950 border border-border-dark rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-white transition-all"
                  placeholder="Budi Santoso"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-300">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-950 border border-border-dark rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-white transition-all"
                  placeholder="name@example.com"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-300">Password</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-950 border border-border-dark rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-white transition-all"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-primary hover:bg-blue-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 mt-2"
              >
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span>Daftar Sekarang</span>
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-gray-400 mt-8">
              Sudah punya akun?{" "}
              <Link href="/masuk" className="text-primary font-bold hover:underline">
                Masuk disini
              </Link>
            </p>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
