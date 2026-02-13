"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useBooking } from "@/context/BookingContext";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false); // State for Info Dropdown
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useBooking();
  const profileRef = useRef(null);

  const handleBookingClick = () => {
    if (user) {
      router.push("/booking/aturan");
    } else {
      router.push("/masuk?returnUrl=/booking/aturan");
    }
  };

  const handleScrollToSection = (id: string) => {
      setIsInfoOpen(false);
      setIsOpen(false);
      
      const element = document.getElementById(id);
      if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
      } else {
          // If not on homepage, navigate to homepage first then scroll
          if (pathname !== "/") {
              router.push(`/#${id}`);
          }
      }
  };

  const infoLinks = [
      { id: "panduan", label: "Panduan Booking" },
      { id: "gallery", label: "Galeri Foto" },
      { id: "news", label: "Suroloyo News" },
      { id: "lokasi", label: "Lokasi Basecamp" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background-dark/80 backdrop-blur-md border-b border-white/5">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-xl">landscape</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Suroloyo<span className="text-primary">Booking</span></span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
                href="/" 
                className={`text-sm font-medium transition-colors ${pathname === "/" ? "text-primary" : "text-gray-300 hover:text-white"}`}
            >
                Beranda
            </Link>

            {/* Informasi Dropdown */}
            <div 
                className="relative"
                onMouseEnter={() => setIsInfoOpen(true)}
                onMouseLeave={() => setIsInfoOpen(false)}
            >
                <button 
                    className={`flex items-center gap-1 text-sm font-medium transition-colors ${isInfoOpen || pathname.includes("/news") ? "text-white" : "text-gray-300 hover:text-white"}`}
                >
                    Informasi
                    <span className={`material-symbols-outlined text-lg transition-transform duration-200 ${isInfoOpen ? "rotate-180" : ""}`}>expand_more</span>
                </button>
                
                <AnimatePresence>
                    {isInfoOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-56 bg-surface-dark border border-border-dark rounded-xl shadow-2xl overflow-hidden py-1"
                        >
                            {infoLinks.map((link) => (
                                <button
                                    key={link.id}
                                    onClick={() => handleScrollToSection(link.id)}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors text-left"
                                >
                                    {link.label}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <Link 
                href="/kuota" 
                className={`text-sm font-medium transition-colors ${pathname === "/kuota" ? "text-primary" : "text-gray-300 hover:text-white"}`}
            >
                Cek Kuota
            </Link>

            {user && (
                 <Link 
                    href="/booking/aturan" 
                    className={`text-sm font-medium transition-colors ${pathname.startsWith("/booking") ? "text-primary" : "text-gray-300 hover:text-white"}`}
                >
                    Booking
                </Link>
            )}
          </nav>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
               <div className="relative">
                 <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 hover:bg-white/5 p-2 rounded-full transition-colors border border-transparent hover:border-white/10"
                 >
                    <span className="text-sm font-bold text-white text-right hidden lg:block">Hi, {user.name.split(" ")[0]}</span>
                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border-2 border-primary/20" />
                 </button>

                 {/* Dropdown Profile */}
                 <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-56 bg-surface-dark border border-border-dark rounded-xl shadow-2xl overflow-hidden py-1"
                    >
                      <div className="px-4 py-3 border-b border-border-dark">
                        <p className="text-sm text-white font-bold">{user.name}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      </div>
                      <Link href="/profil" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-lg">person</span>
                        Profil Saya
                      </Link>
                      <Link href="/riwayat" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-lg">history</span>
                        Riwayat Booking
                      </Link>
                      <div className="h-px bg-border-dark my-1"></div>
                      <button 
                        onClick={() => {
                          if(confirm("Keluar dari akun?")) logout();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors text-left"
                      >
                        <span className="material-symbols-outlined text-lg">logout</span>
                        Keluar
                      </button>
                    </motion.div>
                  )}
                 </AnimatePresence>
               </div>
            ) : (
                <button
                    onClick={handleBookingClick}
                    className="bg-primary hover:bg-blue-600 text-white text-sm font-bold px-5 py-2.5 rounded-full transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
                >
                    <span>Booking Sekarang</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors border border-white/10"
          >
             {user ? (
               <img src={user.avatar} alt="Profile" className="w-6 h-6 rounded-full" />
             ) : (
               <span className="material-symbols-outlined">{isOpen ? "close" : "menu"}</span>
             )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/5 bg-background-dark/95 backdrop-blur-xl transition-all duration-300 overflow-hidden"
          >
            <nav className="flex flex-col p-4 gap-2 max-h-[80vh] overflow-y-auto">
              {user && (
                 <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10 mb-2">
                    <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full border-2 border-primary" />
                    <div className="flex flex-col">
                        <span className="font-bold text-white">{user.name}</span>
                        <span className="text-xs text-gray-400">{user.email}</span>
                    </div>
                 </div>
              )}

              <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className={`p-4 rounded-xl text-base font-medium transition-colors ${
                    pathname === "/" ? "bg-primary/10 text-primary" : "text-gray-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  Beranda
              </Link>
                
              {/* Mobile Info Menu */}
              <div className="flex flex-col gap-1">
                 <p className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">Informasi</p>
                 {infoLinks.map((link) => (
                    <button
                        key={link.id}
                        onClick={() => handleScrollToSection(link.id)}
                        className="w-full text-left p-4 rounded-xl text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                    >
                        {link.label}
                    </button>
                 ))}
              </div>

              <Link
                  href="/kuota"
                  onClick={() => setIsOpen(false)}
                  className={`p-4 rounded-xl text-base font-medium transition-colors ${
                    pathname === "/kuota" ? "bg-primary/10 text-primary" : "text-gray-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  Cek Kuota
              </Link>

              <div className="h-px bg-white/10 my-2"></div>

              {user ? (
                   <>
                     <Link href="/profil" className="flex items-center gap-3 p-4 rounded-xl text-gray-300 hover:bg-white/5 hover:text-white">
                        <span className="material-symbols-outlined">person</span>
                        Profil Saya
                     </Link>
                     <Link href="/riwayat" className="flex items-center gap-3 p-4 rounded-xl text-gray-300 hover:bg-white/5 hover:text-white">
                        <span className="material-symbols-outlined">history</span>
                        Riwayat Booking
                     </Link>
                     <button
                        onClick={() => {
                            logout();
                            setIsOpen(false);
                        }}
                        className="w-full flex items-center gap-3 p-4 rounded-xl text-red-400 hover:bg-red-500/10 font-bold transition-colors text-left"
                    >
                        <span className="material-symbols-outlined">logout</span>
                        Logout
                    </button>
                   </>
              ) : (
                   <button
                    onClick={() => {
                        handleBookingClick();
                        setIsOpen(false);
                    }}
                    className="w-full bg-primary hover:bg-blue-600 text-white font-bold p-4 rounded-xl transition-all shadow-lg shadow-primary/20 mt-2 flex items-center justify-center gap-2"
                    >
                    <span>Booking Sekarang</span>
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </button>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

