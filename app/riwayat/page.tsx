"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { useBooking, BookingHistoryItem } from "@/context/BookingContext";

import { supabase } from "@/lib/supabase";
import useSWR from "swr";

const fetchUserBookings = async (userId: string) => {
    const { data, error } = await supabase
        .from("bookings")
        .select(`
            *,
            members:booking_members(*)
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data;
};

export default function RiwayatPage() {
  const router = useRouter();
  const { user, loading } = useBooking();

  const { data: userBookings, isLoading: isBookingsLoading } = useSWR(
    user ? ["bookings", user.id] : null,
    ([, userId]) => fetchUserBookings(userId)
  );

  // Auth Gate
  useEffect(() => {
    if (!loading && !user) {
        router.push("/masuk?returnUrl=/riwayat");
    }
  }, [user, loading, router]);

  if (loading || (!user && !loading)) {
      return (
          <div className="min-h-screen bg-background-dark flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          </div>
      );
  }

  return (
    <>
      <Header />
      <main className="flex-grow pt-24 pb-12 px-4 md:px-10">
        <div className="w-full max-w-5xl mx-auto flex flex-col gap-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-white text-3xl font-black">Riwayat Booking</h1>
                <p className="text-gray-400">Daftar pendakian yang telah Anda pesan.</p>
            </div>

            {isBookingsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-surface-dark border border-border-dark rounded-xl h-48 animate-pulse" />
                    ))}
                </div>
            ) : !userBookings || userBookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-surface-dark border border-border-dark rounded-2xl text-center">
                    <span className="material-symbols-outlined text-border-dark text-8xl mb-4">history_toggle_off</span>
                    <h3 className="text-xl font-bold text-white mb-2">Belum ada riwayat</h3>
                    <p className="text-gray-400 mb-6">Anda belum melakukan booking pendakian apapun.</p>
                    <Link href="/booking/jadwal" className="px-6 py-3 bg-primary hover:bg-blue-600 text-white font-bold rounded-xl transition-colors">
                        Mulai Booking Sekarang
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userBookings.map((item: any) => (
                        <Link href={`/riwayat/${item.id}`} key={item.id} className="block h-full">
                            <div 
                                className="bg-surface-dark border border-border-dark rounded-xl overflow-hidden hover:border-primary/50 transition-all shadow-lg hover:shadow-primary/10 group h-full flex flex-col"
                            >
                                <div className={`h-2 w-full ${
                                    item.status === 'approved' || item.status === 'verified' ? 'bg-green-500' :
                                    item.status === 'pending' ? 'bg-yellow-500' :
                                    item.status === 'rejected' || item.status === 'cancelled' ? 'bg-red-500' :
                                    'bg-primary'
                                }`} />
                                <div className="p-6 flex flex-col gap-4 flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Tanggal</p>
                                            <p className="text-white font-bold text-lg">{item.booking_date}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                            (item.status === "approved" || item.status === 'verified') ? "bg-green-500/20 text-green-400" :
                                            item.status === "pending" ? "bg-yellow-500/20 text-yellow-400" :
                                            "bg-red-500/20 text-red-400"
                                        }`}>
                                            {
                                                item.status === 'pending' ? 'Diproses' :
                                                item.status === 'verified' ? 'Terverifikasi' :
                                                item.status === 'approved' ? 'Berhasil' :
                                                item.status === 'rejected' ? 'Ditolak' :
                                                item.status === 'cancelled' ? 'Dibatalkan' : 
                                                item.status
                                            }
                                        </span>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3 text-sm text-gray-300">
                                            <span className="material-symbols-outlined text-primary">groups</span>
                                            {item.total_participants} Peserta
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-gray-300">
                                            <span className="material-symbols-outlined text-primary">payments</span>
                                            Rp {item.total_price?.toLocaleString('id-ID')}
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-gray-300">
                                            <span className="material-symbols-outlined text-primary">receipt_long</span>
                                            #{item.id}
                                        </div>
                                    </div>
                                </div>
                                <div className="px-6 py-4 bg-slate-900 border-t border-border-dark flex justify-between items-center group-hover:bg-primary/5 transition-colors">
                                    <span className="text-primary font-bold text-sm">Lihat Detail</span>
                                    <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
      </main>
    </>
  );
}
