"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import { useBooking } from "@/context/BookingContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BookingProgressBar from "@/components/BookingProgressBar";

import { supabase } from "@/lib/supabase";
import useSWR from "swr";

const fetchPaymentSettings = async () => {
    const { data, error } = await supabase
        .from("settings")
        .select("*")
        .match({ category: "pembayaran" });
    
    if (error) throw error;
    
    // Map settings to key-value object
    const settings: Record<string, string> = {};
    data.forEach(s => {
        settings[s.key] = s.value;
    });
    return settings;
};

export default function BookingBayarPage() {
  const router = useRouter();
  const { members, bookingId, generateBookingId, user, leader, bookingDate, addToHistory, resetBooking } = useBooking();
  const [timeLeft, setTimeLeft] = useState({ hours: 1, minutes: 59, seconds: 59 });
  const [copied, setCopied] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { data: settings, isLoading } = useSWR("settings/payment", fetchPaymentSettings);

  const bankName = settings?.bank_name || "Bank BRI";
  const bankAccount = settings?.bank_account_number || "8800123456789000";
  const bankOwner = settings?.bank_account_name || "PT. Wisata Alam Suroloyo";

  // Auth Gate
  useEffect(() => {
    if (!user) {
        router.push("/masuk?returnUrl=/booking/bayar");
    }
  }, [user, router]);

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
    navigator.clipboard.writeText(bankAccount.replace(/\s/g, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          setUploadedFile(e.target.files[0]);
      }
  };

  const handleConfirmPayment = async () => {
    if (!uploadedFile) {
        toast.error("Mohon upload bukti transfer terlebih dahulu.");
        return;
    }
    
    setIsUploading(true);
    
    try {
        if (!user || !leader || !bookingDate || !bookingId) return;

        // 1. Upload Proof of Transfer to Storage
        const fileExt = uploadedFile.name.split('.').pop();
        const fileName = `${bookingId}_${Math.random()}.${fileExt}`;
        const filePath = `payment-proofs/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('bookings')
            .upload(filePath, uploadedFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
            .from('bookings')
            .getPublicUrl(filePath);

        // 2. Create Booking in Database
        const { error: bookingError } = await supabase
            .from('bookings')
            .insert({
                id: bookingId,
                user_id: user.id,
                booking_date: bookingDate,
                status: 'pending',
                total_participants: members.length + 1,
                total_price: totalAmount,
                payment_method: 'Bank BRI',
                payment_proof_url: publicUrl,
                payment_status: 'pending'
            });

        if (bookingError) throw bookingError;

        // 3. Create Booking Members
        const membersToInsert = [
            {
                booking_id: bookingId,
                name: leader.name,
                nik: leader.id,
                phone: leader.phone,
                gender: leader.gender,
                address: leader.address,
                is_leader: true,
                dob: leader.dob,
                emergency_contact: leader.emergencyContact
            },
            ...members.map(m => ({
                booking_id: bookingId,
                name: m.name,
                nik: m.id,
                phone: m.phone,
                gender: m.gender,
                address: m.address,
                is_leader: false,
                dob: m.dob,
                emergency_contact: m.emergencyContact
            }))
        ];

        const { error: membersError } = await supabase
            .from('booking_members')
            .insert(membersToInsert);

        if (membersError) throw membersError;

        // 4. Update Daily Quota (Increment filled)
        const { error: quotaError } = await supabase.rpc('increment_quota_filled', {
            target_date: bookingDate,
            count: members.length + 1
        });

        // If RPC fails (legacy or not exists), try manual update
        if (quotaError) {
            const { data: currentQuota } = await supabase
                .from('daily_quota')
                .select('filled')
                .eq('date', bookingDate)
                .single();
            
            await supabase
                .from('daily_quota')
                .update({ filled: (currentQuota?.filled || 0) + (members.length + 1) })
                .eq('date', bookingDate);
        }

        toast.success("Booking berhasil diajukan! Menunggu verifikasi admin.");
        resetBooking();
        router.push("/riwayat");
    } catch (error: any) {
        toast.error(error.message || "Gagal menyimpan data booking.");
        console.error(error);
    } finally {
        setIsUploading(false);
    }
  };

  if (!user) return null;

  if (members.length === 0 && !bookingId) {
        // Fallback if accessed directly without data (should normally redirect)
       return (
         <div className="min-h-screen flex items-center justify-center flex-col gap-4 text-center">
             <p>Data booking tidak ditemukan.</p>
             <Link href="/booking/jadwal" className="text-primary hover:underline">Mulai Booking Baru</Link>
         </div>
       )
   }

  const totalAmount = (members.length + 1) * 25000; // Base price + members

  return (
    <>
      <Header />
      <main className="flex-grow pt-24 pb-12 px-4 md:px-10">
        <div className="w-full max-w-7xl mx-auto flex flex-col gap-8">
            <div className="max-w-3xl mx-auto w-full">
               <BookingProgressBar currentStep={4} />
            </div>

            <div className="flex flex-col xl:flex-row gap-8 items-start">
                 {/* Main Content (Payment Info) */}
                 <div className="flex-1 w-full xl:w-2/3 flex flex-col gap-6">
                    <div className="bg-surface-dark border border-border-dark rounded-2xl overflow-hidden shadow-xl">
                        {/* Header Tagihan */}
                        <div className="p-6 border-b border-border-dark bg-slate-900 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Total Tagihan ({members.length + 1} Orang)</p>
                                <p className="text-white text-3xl font-black tracking-tight">Rp {totalAmount.toLocaleString('id-ID')}</p>
                            </div>
                            <div className="flex flex-col items-end">
                                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Batas Waktu</p>
                                <div className="flex items-center gap-1 text-red-400 font-mono font-bold text-lg bg-red-900/10 px-3 py-1 rounded-lg">
                                    <span className="material-symbols-outlined text-[20px]">timer</span>
                                    <span>
                                        {timeLeft.hours.toString().padStart(2, "0")}:{timeLeft.minutes.toString().padStart(2, "0")}:{timeLeft.seconds.toString().padStart(2, "0")}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 md:p-8 flex flex-col gap-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center shadow-sm">
                                    <span className="material-symbols-outlined text-primary text-3xl">account_balance</span>
                                </div>
                                <div>
                                    <p className="text-white font-bold text-lg">{bankName}</p>
                                    <p className="text-gray-400 text-sm">{bankOwner}</p>
                                </div>
                            </div>

                             {/* VA Number */}
                            <div className="bg-primary/5 rounded-2xl p-6 border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-primary/10 transition-colors"></div>
                                <div className="flex flex-col gap-2 relative z-10 text-center md:text-left">
                                    <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">Nomor Rekening / Virtual Account</span>
                                    <span className="text-white text-3xl md:text-4xl font-mono font-bold tracking-wider">
                                        {bankAccount}
                                    </span>
                                </div>
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleCopy}
                                    className="relative z-10 flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-6 py-3 rounded-xl border border-border-dark hover:border-primary transition-all shadow-lg"
                                >
                                    <span className="material-symbols-outlined text-primary">
                                        {copied ? "check" : "content_copy"}
                                    </span>
                                    <span className="font-bold">{copied ? "Disalin" : "Salin"}</span>
                                </motion.button>
                            </div>
                            
                            {/* Upload Bukti */}
                            <div className="border-t border-border-dark pt-8">
                                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">upload_file</span>
                                    Upload Bukti Transfer
                                </h3>
                                
                                <label className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${uploadedFile ? "border-primary bg-primary/5" : "border-gray-600 hover:border-gray-500 hover:bg-white/5"}`}>
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                                        {uploadedFile ? (
                                            <>
                                                <span className="material-symbols-outlined text-4xl text-primary mb-2">description</span>
                                                <p className="text-sm font-bold text-white">{uploadedFile.name}</p>
                                                <p className="text-xs text-green-400 mt-1">Siap untuk diupload</p>
                                            </>
                                        ) : (
                                             <>
                                                <span className="material-symbols-outlined text-4xl text-gray-400 mb-2">cloud_upload</span>
                                                <p className="text-sm text-gray-300 font-bold mb-1">Klik untuk upload bukti transfer</p>
                                                <p className="text-xs text-gray-500">Format: JPG, PNG, PDF (Max 2MB)</p>
                                            </>
                                        )}
                                    </div>
                                    <input type="file" className="hidden" accept="image/*,application/pdf" onChange={handleFileChange} />
                                </label>
                            </div>
                        </div>
                    </div>
                 </div>

                 {/* Sidebar Summary & Action */}
                 <aside className="w-full xl:w-1/3 flex flex-col gap-6">
                    <div className="bg-surface-dark border border-border-dark rounded-2xl p-6 sticky top-24">
                        <h3 className="text-white font-bold text-lg mb-6">Rincian Booking</h3>
                        
                        <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-700">
                             <div className="flex flex-col">
                                 <span className="text-xs text-gray-500 font-bold uppercase">Booking ID</span>
                                 <span className="text-primary font-mono font-bold text-lg">#{bookingId}</span>
                             </div>
                             <div className="flex flex-col text-right">
                                 <span className="text-xs text-gray-500 font-bold uppercase">Tanggal</span>
                                 <span className="text-white font-bold">{bookingDate || "-"}</span>
                             </div>
                        </div>

                         <div className="space-y-3 mb-6">
                             <div className="flex justify-between text-sm">
                                 <span className="text-gray-400">Tiket Masuk (Leader)</span>
                                 <span className="text-white font-medium">Rp 25.000</span>
                             </div>
                             {members.length > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Anggota Tambahan x{members.length}</span>
                                    <span className="text-white font-medium">Rp {(members.length * 25000).toLocaleString('id-ID')}</span>
                                </div>
                             )}
                             <div className="flex justify-between text-sm pt-2 border-t border-gray-700">
                                 <span className="text-white font-bold">Total Pembayaran</span>
                                 <span className="text-primary font-black text-lg">Rp {totalAmount.toLocaleString('id-ID')}</span>
                             </div>
                         </div>

                         <div className="bg-blue-900/10 border border-blue-500/20 p-4 rounded-xl mb-6 flex gap-3">
                             <span className="material-symbols-outlined text-blue-400 text-xl shrink-0">verified_user</span>
                             <p className="text-xs text-blue-200 leading-relaxed">
                                 Pembayaran Anda aman. Tiket akan terbit otomatis setelah konfirmasi pembayaran berhasil.
                             </p>
                         </div>

                         <button
                            onClick={handleConfirmPayment}
                            disabled={isUploading}
                            className={`w-full h-14 rounded-xl font-bold flex items-center justify-center gap-2 text-lg shadow-lg transition-all ${
                                isUploading 
                                ? "bg-gray-600 cursor-not-allowed opacity-80" 
                                : "bg-primary hover:bg-blue-600 text-white shadow-primary/25"
                            }`}
                         >
                            {isUploading ? (
                                <>
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                                    <span>Memproses...</span>
                                </>
                            ) : (
                                <>
                                    <span>Konfirmasi Pembayaran</span>
                                    <span className="material-symbols-outlined">arrow_forward</span>
                                </>
                            )}
                         </button>
                    </div>
                 </aside>
            </div>
        </div>
      </main>
    </>
  );
}
