"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import { useBooking } from "@/context/BookingContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PembayaranPage() {
  const router = useRouter();
  const { members, bookingId, generateBookingId } = useBooking();
  const [timeLeft, setTimeLeft] = useState({ hours: 1, minutes: 59, seconds: 59 });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!bookingId) {
      generateBookingId();
    }
  }, [bookingId, generateBookingId]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText("8800123456789000");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCheckStatus = () => {
    // Simulate payment verification
    setTimeout(() => {
      router.push("/tiket");
    }, 1000);
  };

  const totalAmount = (members.length + 1) * 25000; // Base price + members

  if (members.length === 0) {
      return (
        <div className="min-h-screen flex items-center justify-center flex-col gap-4 text-center">
            <p>Data booking tidak ditemukan.</p>
            <Link href="/daftar" className="text-primary hover:underline">Kembali ke Pendaftaran</Link>
        </div>
      )
  }

  return (
    <>
      <Header />
      <main className="flex-1 flex flex-col items-center py-10 px-4 md:px-10 pt-24 overflow-y-auto">
        <div className="w-full max-w-[640px] flex flex-col gap-6">
          {/* Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-4 text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 shadow-[0_0_10px_rgba(59,130,246,0.15)]">
              <span className="material-symbols-outlined text-primary text-sm">schedule</span>
              <span className="text-primary text-sm font-bold uppercase tracking-wide">Menunggu Pembayaran</span>
            </div>
            <h1 className="text-white text-3xl font-bold">Selesaikan pembayaran dalam</h1>
            
            {/* Countdown */}
            <div className="flex gap-3 py-2">
              {[
                { value: timeLeft.hours.toString().padStart(2, "0"), label: "Jam" },
                { value: timeLeft.minutes.toString().padStart(2, "0"), label: "Menit" },
                { value: timeLeft.seconds.toString().padStart(2, "0"), label: "Detik" },
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-surface-dark border border-primary/30 shadow-inner">
                    <p className="text-primary text-2xl font-bold font-mono">{item.value}</p>
                  </div>
                  <p className="text-gray-400 text-xs font-medium uppercase">{item.label}</p>
                  {index < 2 && (
                    <span className="absolute translate-x-[3.5rem] text-primary/50 text-2xl font-bold">:</span>
                  )}
                </div>
              ))}
            </div>
            <p className="text-gray-400 text-sm">
              Batas akhir pembayaran: <span className="text-white font-medium">Besok, 14:30 WIB</span>
            </p>
          </motion.div>

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-surface-dark border border-border-dark rounded-2xl overflow-hidden shadow-2xl shadow-black/50"
          >
            <div className="p-6 border-b border-border-dark bg-slate-900 flex justify-between items-center">
              <div>
                <p className="text-gray-400 text-xs font-medium mb-1">Total Tagihan ({members.length + 1} Pax)</p>
                <p className="text-white text-2xl font-bold">Rp {totalAmount.toLocaleString('id-ID')}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-xs font-medium mb-1">Order ID</p>
                <p className="text-primary text-sm font-mono tracking-wide">#{bookingId || "GENERATING..."}</p>
              </div>
            </div>

            <div className="p-6 flex flex-col gap-6">
              {/* Bank Info */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-10 bg-white rounded flex items-center justify-center overflow-hidden p-1 border-2 border-primary/20">
                  <img
                    alt="BRI Bank Logo"
                    className="object-contain w-full h-full"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxMSV205vU8qPS_xmIT-Us5GVSp5wx2ZvQXaUq4zK1z6iEhGpHcdvBzXF6mXk2qWLntg0zR9GLCOg1Mlnz_LzFgAtbm_7qrfp6U6a7V9Ep726akt4Hi6FnBMRGQzRTUWKsFofkMXflJYcLSDBvLdD5YMvLsn54JJG6hqRL9wLqJZG3srHyhhlxmHRHvhx2J02hW88QECT19HF_-SBNXMYob0UrupuXVdwbW71xxvrs0fznsfks_OXqCRYaWh6nAj7SuyXCwJdkhj8"
                  />
                </div>
                <div>
                  <p className="text-white font-bold text-lg">Bank BRI</p>
                  <p className="text-primary/80 text-sm">Virtual Account</p>
                </div>
              </div>

              {/* VA Number */}
              <div className="bg-primary/5 rounded-xl p-4 border border-primary/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none"></div>
                <div className="flex flex-col gap-1 relative z-10">
                  <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">Nomor Virtual Account</span>
                  <span className="text-primary text-2xl md:text-3xl font-mono font-bold tracking-wider">
                    8800 1234 5678 9000
                  </span>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCopy}
                  className="relative z-10 flex items-center gap-2 bg-slate-900 hover:bg-surface-dark text-white border border-border-dark hover:border-primary/50 px-4 py-2 rounded-lg transition-all whitespace-nowrap group shadow-lg"
                >
                  <span className="material-symbols-outlined text-lg text-primary group-hover:scale-110 transition-transform">
                    {copied ? "check" : "content_copy"}
                  </span>
                  <span className="text-sm font-bold">{copied ? "Tersalin!" : "Salin"}</span>
                </motion.button>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="border-t border-border-dark">
              <div className="p-4 bg-slate-900/50">
                <h3 className="text-white font-bold text-sm">Cara Pembayaran</h3>
              </div>
              {[
                { icon: "atm", title: "ATM BRI", steps: ["Masukkan Kartu ATM BRI dan PIN Anda.", "Pilih menu Transaksi Lain > Pembayaran > Lainnya > BRIVA.", "Masukkan Nomor Virtual Account.", "Konfirmasi dan selesaikan transaksi."] },
                { icon: "smartphone", title: "Mobile Banking BRI (BRImo)", steps: ["Login ke aplikasi BRImo.", "Pilih menu Pembayaran > BRIVA.", "Masukkan Nomor Virtual Account.", "Masukkan PIN dan konfirmasi."] },
                { icon: "storefront", title: "Minimarket (Indomaret / Alfamart)", steps: ["Pergi ke gerai terdekat.", "Beritahu kasir untuk pembayaran BRIVA.", "Berikan Nomor Virtual Account.", "Bayar dan simpan struk."] },
              ].map((method, index) => (
                <details key={index} className="group border-b border-border-dark last:border-0">
                  <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-surface-dark/50 transition-colors select-none">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary">{method.icon}</span>
                      <span className="text-white font-medium">{method.title}</span>
                    </div>
                    <span className="material-symbols-outlined text-gray-400 group-open:rotate-180 transition-transform">
                      expand_more
                    </span>
                  </summary>
                  <div className="px-4 pb-4 pl-11 text-gray-400 text-sm leading-relaxed">
                    <ol className="list-decimal space-y-2 ml-4">
                      {method.steps.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                  </div>
                </details>
              ))}
            </div>
          </motion.div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleCheckStatus}
              className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-primary text-white font-bold text-base hover:bg-primary-hover transition-colors shadow-lg shadow-primary/25 ring-1 ring-primary/50"
            >
              <span className="material-symbols-outlined">check_circle</span>
              Cek Status Pembayaran
            </button>
            <button className="w-full h-12 flex items-center justify-center gap-2 rounded-xl text-gray-400 font-medium text-sm hover:text-white hover:bg-surface-dark border border-transparent hover:border-border-dark transition-all">
              Batalkan Pesanan
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
