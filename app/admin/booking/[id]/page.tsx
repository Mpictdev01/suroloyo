"use client";

import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import useSWR from "swr";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const fetchBookingDetail = async (id: string) => {
  const { data: booking, error } = await supabase
    .from("bookings")
    .select(`
      *,
      users (id, name, email, phone, nik, address),
      booking_members (*)
    `)
    .eq("id", id)
    .single();

  if (error) throw error;
  return booking;
};

export default function BookingDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const { data: booking, error, isLoading, mutate } = useSWR(
    id ? `admin/booking/${id}` : null,
    () => fetchBookingDetail(id as string)
  );

  const updateStatus = async (newStatus: string) => {
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq("id", id);

      if (error) throw error;
      
      toast.success(`Booking status diperbarui ke: ${newStatus}`);
      mutate();
    } catch (err: any) {
      toast.error(err.message || "Gagal memperbarui status");
    }
  };

  if (isLoading) return <div className="text-white">Memuat detail booking...</div>;
  if (error || !booking) return <div className="text-red-500">Error: Booking tidak ditemukan.</div>;

  return (
    <div className="space-y-8 pb-20">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-2 text-sm"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span> Kembali ke Daftar
          </button>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            Detail Booking <span className="text-primary font-mono">{booking.id}</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {booking.status === 'pending' && (
            <>
              <button 
                onClick={() => updateStatus('rejected')}
                className="px-6 py-3 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-xl font-bold hover:bg-rose-500 hover:text-white transition-all"
              >
                Reject
              </button>
              <button 
                onClick={() => updateStatus('approved')}
                className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-blue-600 transition-all shadow-lg shadow-primary/20"
              >
                Approve Booking
              </button>
            </>
          )}
          {booking.status === 'approved' && (
            <button 
               disabled
               className="px-6 py-3 bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 rounded-xl font-bold opacity-70"
            >
              ✅ Terverifikasi
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Data Utama */}
        <div className="lg:col-span-2 space-y-8">
          {/* Info Utama */}
          <div className="bg-surface-dark border border-border-dark rounded-2xl p-8 space-y-8">
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Tgl Mendaki</p>
                  <p className="text-white font-bold">{new Date(booking.booking_date).toLocaleDateString('id-ID', { dateStyle: 'full' })}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Total Peserta</p>
                  <p className="text-white font-bold">{booking.total_participants} Orang</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Total Harga</p>
                  <p className="text-primary font-black text-lg">Rp {booking.total_price.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Status</p>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    booking.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500' :
                    booking.status === 'pending' ? 'bg-amber-500/10 text-amber-500' :
                    'bg-gray-500/10 text-gray-400'
                  }`}>
                    {booking.status}
                  </span>
                </div>
             </div>

             <div className="border-t border-border-dark pt-8">
                <h3 className="text-lg font-bold text-white mb-6">Data Anggota Pendakian</h3>
                <div className="space-y-4">
                   {booking.booking_members?.map((member: any, i: number) => (
                     <div key={i} className="bg-background-dark/50 border border-border-dark/30 rounded-xl p-6 flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex gap-4">
                           <div className="w-12 h-12 rounded-lg bg-surface-dark border border-border-dark flex items-center justify-center text-gray-500 shrink-0">
                              <span className="material-symbols-outlined">person</span>
                           </div>
                           <div>
                              <p className="text-white font-bold">{member.name} {member.is_leader && <span className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded ml-2 uppercase">Leader</span>}</p>
                              <p className="text-gray-500 text-sm">NIK: {member.nik}</p>
                           </div>
                        </div>
                        <div className="text-right flex flex-col justify-center">
                           <p className="text-gray-400 text-sm">{member.phone}</p>
                           <p className="text-gray-500 text-xs">{member.address}</p>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>

        {/* Right Column: Sidebar Data */}
        <div className="space-y-8">
          {/* Bukti Pembayaran */}
          <div className="bg-surface-dark border border-border-dark rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Bukti Pembayaran</h3>
            {booking.payment_proof_url ? (
               <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-border-dark group">
                  <img 
                    src={booking.payment_proof_url} 
                    alt="Bukti Transfer" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <a 
                    href={booking.payment_proof_url} 
                    target="_blank" 
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold"
                  >
                    <span className="material-symbols-outlined">open_in_new</span> Lihat Full
                  </a>
               </div>
            ) : (
              <div className="aspect-[3/4] rounded-xl border-2 border-dashed border-border-dark flex flex-col items-center justify-center text-gray-600 bg-background-dark/20 text-center p-6">
                 <span className="material-symbols-outlined text-4xl mb-2">payments</span>
                 <p className="text-sm">Belum ada unggahan bukti pembayaran.</p>
              </div>
            )}
          </div>

          {/* Data Pemesan (User System) */}
          <div className="bg-surface-dark border border-border-dark rounded-2xl p-6">
             <h3 className="text-lg font-bold text-white mb-4">Akun Pemesan</h3>
             <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary">
                   <span className="material-symbols-outlined">account_circle</span>
                </div>
                <div>
                   <p className="text-white font-bold">{booking.users?.name}</p>
                   <p className="text-gray-500 text-xs">{booking.users?.email}</p>
                </div>
             </div>
             <div className="space-y-3 pt-4 border-t border-border-dark/50">
                <div className="flex justify-between text-xs">
                   <span className="text-gray-500 uppercase tracking-wider font-bold">User ID</span>
                   <span className="text-gray-400 font-mono truncate ml-4">{booking.user_id}</span>
                </div>
                <div className="flex justify-between text-xs">
                   <span className="text-gray-500 uppercase tracking-wider font-bold">Status Akun</span>
                   <span className="text-emerald-500 font-bold uppercase">Active</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
