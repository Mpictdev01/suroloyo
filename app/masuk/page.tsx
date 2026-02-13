"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { useBooking } from "@/context/BookingContext";

const sliderImages = [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDja-fxX1pYPfnyDL0kRDBy8ME9loQv_zjuGbc3YkEY4ubeEzj7uCj-yh2-lSQSzTUfKToJluawQavdXUolSj4WD8u0K5mAVnBW8Vc4uNfGQGDlvkk501rHAb8A30TZ2QERVP6KJqK3ff-B_ywOpdr7scx3M8sQ2In9pHIwmTbHE5jfNdXO4nQD2U_o2wAei_eWTNXc4Ng6wvM_iA6ZHhjahHUK9ux7MqYiqyrjzpKDEyBmFd4LmDSHZopkmMgO_q1N8fQWGCgLQJo", // Pemandangan
    "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070&auto=format&fit=crop", // Pendaki
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop" // Awan
];

import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/";
  const { login } = useBooking();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % sliderImages.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Starting login process for:", email);

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            console.error("Supabase Auth Error:", error);
            throw error;
        }

        console.log("Login successful, user data:", data.user?.id);
        toast.success("Login berhasil!");
        
        // Wait a bit to ensure session is locally saved before redirecting
        setTimeout(() => {
            router.push(returnUrl);
        }, 100);
    } catch (error: any) {
        console.error("Login catch block:", error);
        // Ignore AbortError as it's often a dev-only noise or harmless interruption
        if (error.name === 'AbortError' || error.message?.includes('aborted')) {
            console.warn("Login request was aborted, but this might be normal during navigation.");
            return;
        }
        toast.error(error.message || "Gagal login. Periksa email dan password Anda.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B1121] p-4 overflow-hidden">
        {/* Main Floating Card */}
        <div className="w-full max-w-[1200px] h-[85vh] min-h-[600px] max-h-[800px] flex rounded-[32px] overflow-hidden bg-surface-dark shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/5 relative">
            
            {/* Left Side - Image Slider */}
            <div className="hidden lg:block w-1/2 relative h-full">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentImageIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                        className="absolute inset-0"
                    >
                        <img 
                            src={sliderImages[currentImageIndex]} 
                            alt="Slider" 
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-blue-900/20 mix-blend-multiply"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    </motion.div>
                </AnimatePresence>
                
                <div className="absolute bottom-12 left-12 z-10 max-w-lg pr-8">
                     <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-4xl font-black mb-4 leading-tight text-white drop-shadow-lg"
                     >
                        Jelajahi Keindahan <span className="text-primary">Suroloyo</span>
                     </motion.h2>
                     <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-lg text-gray-100 drop-shadow-md"
                     >
                        Ribuan pendaki telah menciptakan kenangan tak terlupakan di sini. Giliran Anda sekarang!
                     </motion.p>
                     
                     <div className="flex gap-2 mt-6">
                        {sliderImages.map((_, idx) => (
                            <button 
                                key={idx}
                                onClick={() => setCurrentImageIndex(idx)}
                                className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentImageIndex ? "w-8 bg-primary shadow-[0_0_10px_rgba(59,130,246,0.5)]" : "w-2 bg-white/50 hover:bg-white"}`}
                            />
                        ))}
                     </div>
                </div>

                <Link href="/" className="absolute top-8 left-8 z-20 flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10 hover:bg-white/20 transition-all hover:scale-105 group">
                    <span className="material-symbols-outlined text-white text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
                    <span className="text-sm font-bold text-white">Kembali ke Beranda</span>
                </Link>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 lg:p-12 relative h-full overflow-hidden bg-[#131b2e]">
                {/* Mobile Only Back Button */}
                <div className="lg:hidden flex justify-between items-center mb-6">
                    <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white">
                        <span className="material-symbols-outlined">arrow_back</span>
                        <span className="text-sm font-bold">Kembali</span>
                    </Link>
                </div>

                 <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-[400px] mx-auto"
                 >
                    <div className="mb-8">
                        <h1 className="text-3xl font-black text-white mb-2">Selamat Datang</h1>
                        <p className="text-gray-400">Masuk untuk melanjutkan reservasi pendakian Anda.</p>
                    </div>

                    <form onSubmit={handleLogin} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-bold text-gray-300 ml-1">Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-5 py-3.5 bg-[#0F1623] border border-white/10 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-white transition-all placeholder:text-gray-600"
                                placeholder="name@example.com"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-sm font-bold text-gray-300">Password</label>
                                <Link href="#" className="text-xs text-primary hover:underline hover:text-blue-400 transition-colors">Lupa password?</Link>
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-5 py-3.5 bg-[#0F1623] border border-white/10 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-white transition-all placeholder:text-gray-600"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-primary hover:bg-blue-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 flex items-center justify-center gap-2 mt-4 group transform hover:-translate-y-0.5"
                        >
                            {isLoading ? (
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            ) : (
                                <>
                                    <span>Masuk Sekarang</span>
                                    <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="my-6 flex items-center gap-4">
                        <div className="h-px bg-white/10 flex-grow"></div>
                        <span className="text-[10px] uppercase text-gray-500 font-bold tracking-widest">Atau masuk dengan</span>
                        <div className="h-px bg-white/10 flex-grow"></div>
                    </div>

                    <button className="w-full py-3.5 bg-[#0F1623] border border-white/10 hover:bg-white/5 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-3 hover:border-white/20 group">
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5 group-hover:scale-110 transition-transform" alt="Google" />
                        <span>Google Account</span>
                    </button>

                    <p className="text-center text-sm text-gray-400 mt-8">
                        Belum punya akun?{" "}
                        <Link href="/daftar-akun" className="text-primary font-bold hover:underline hover:text-blue-400 transition-colors">
                            Daftar dulu
                        </Link>
                    </p>
                 </motion.div>
            </div>
        </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0B1121] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
