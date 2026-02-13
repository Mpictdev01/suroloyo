"use client";

import { use, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import useSWR from "swr";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import { getUserDetails } from "@/app/actions";

const fetchUserDetail = async (id: string) => {
  // Use Server Action to bypass RLS
  const { user, bookings, error } = await getUserDetails(id);
  
  if (error) throw new Error(typeof error === 'string' ? error : error.message || "Failed to fetch user details");

  return { user, bookings };
};

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const { data, error, isLoading } = useSWR(
    id ? `admin/users/${id}` : null,
    () => fetchUserDetail(id)
  );

  // Modal State
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState("user");
  const [isUpdating, setIsUpdating] = useState(false);

  // Initialize selected role when data loads
  useEffect(() => {
      if (data?.user) {
          setSelectedRole(data.user.role);
      }
  }, [data]);

  const handleUpdateRole = async () => {
    if (!data?.user) return;
    setIsUpdating(true);
    
    try {
        // Dynamic import to use server action
        const { updateUserRole } = await import("@/app/actions");
        const { error } = await updateUserRole(data.user.id, selectedRole);

        if (error) throw error;
        
        toast.success(`Role berhasil diubah menjadi ${selectedRole}`);
        setShowRoleModal(false);
        // Refresh data
        window.location.reload(); 
    } catch (err: any) {
        toast.error("Gagal update role: " + (err.message || "Unknown error"));
    } finally {
        setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-rose-500/10 border border-rose-500/20 p-8 rounded-2xl text-center">
        <span className="material-symbols-outlined text-4xl text-rose-500 mb-4">error</span>
        <h3 className="text-white font-bold text-xl uppercase">Error Loading User</h3>
        <p className="text-rose-300 mt-2">{error?.message || "User tidak ditemukan"}</p>
        <button 
          onClick={() => router.back()}
          className="mt-6 px-6 py-2 bg-rose-500 text-white font-bold rounded-xl hover:bg-rose-600 transition-all"
        >
          Kembali
        </button>
      </div>
    );
  }

  const { user, bookings } = data;

  return (
    <div className="space-y-8 pb-12">
      {/* Breadcrumbs & Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="w-10 h-10 rounded-xl bg-surface-dark border border-border-dark flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h1 className="text-2xl font-black text-white">{user.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                user.role === 'super_admin' ? 'bg-purple-500/10 text-purple-500' :
                user.role === 'admin' ? 'bg-blue-500/10 text-blue-500' :
                'bg-slate-500/10 text-slate-400'
              }`}>
                {user.role}
              </span>
              <span className="text-gray-600 text-[10px]">•</span>
              <p className="text-gray-500 text-xs font-mono">{user.id}</p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <button 
            onClick={() => setShowRoleModal(true)}
            className="flex-1 md:flex-none px-6 py-3 bg-surface-dark border border-border-dark text-white font-bold rounded-xl hover:bg-white/5 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-xl">edit</span>
            Edit Role
          </button>
          <button className={`flex-1 md:flex-none px-6 py-3 font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
            user.is_banned 
              ? "bg-emerald-500 text-white hover:bg-emerald-600" 
              : "bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white"
          }`}>
            <span className="material-symbols-outlined text-xl">
              {user.is_banned ? 'how_to_reg' : 'block'}
            </span>
            {user.is_banned ? 'Unban User' : 'Ban User'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Details */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-surface-dark border border-border-dark rounded-2xl p-6">
            {user.is_missing_profile && (
                <div className="mb-6 bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex items-start gap-3">
                    <span className="material-symbols-outlined text-amber-500 text-xl mt-0.5">warning</span>
                    <div>
                        <h4 className="text-amber-500 font-bold text-sm uppercase">Data Profil Tidak Lengkap</h4>
                        <p className="text-amber-200/80 text-xs mt-1 leading-relaxed">
                            User ini terdaftar di sistem Auth namun tidak memiliki data profil publik. 
                            Fitur edit profil mungkin tidak berfungsi sepenuhnya untuk user ini.
                        </p>
                    </div>
                </div>
            )}
            <div className="flex flex-col items-center text-center pb-6 border-b border-border-dark">
                <div className="w-24 h-24 rounded-3xl bg-slate-800 flex items-center justify-center overflow-hidden border-2 border-primary/20 mb-4 shadow-xl shadow-primary/10">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="material-symbols-outlined text-4xl text-gray-500">person</span>
                  )}
                </div>
                <h3 className="text-white font-bold text-lg">{user.name}</h3>
                <p className="text-gray-500 text-sm">{user.email}</p>
                {user.is_banned && (
                  <div className="mt-3 px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span className="text-rose-500 text-[10px] font-black uppercase tracking-widest">Banned User</span>
                  </div>
                )}
            </div>
            
            <div className="pt-6 space-y-4">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Nomor Telepon</span>
                <p className="text-white font-medium">{user.phone || '-'}</p>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">NIK</span>
                <p className="text-white font-mono">{user.nik || '-'}</p>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Jenis Kelamin</span>
                <p className="text-white font-medium">{user.gender === 'L' ? 'Laki-laki' : user.gender === 'P' ? 'Perempuan' : '-'}</p>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Alamat</span>
                <p className="text-white text-sm leading-relaxed">{user.address || '-'}</p>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Bergabung Sejak</span>
                <p className="text-white font-medium">
                  {new Date(user.created_at).toLocaleDateString('id-ID', { dateStyle: 'long' })}
                </p>
              </div>
            </div>
          </div>
          
          {/* Identity Info */}
          <div className="bg-surface-dark border border-border-dark rounded-2xl p-6">
            <h3 className="text-white font-bold flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-primary">badge</span>
              Identitas KTP
            </h3>
            {user.ktp_photo_url ? (
              <div className="relative group cursor-zoom-in rounded-xl overflow-hidden border border-border-dark">
                <img src={user.ktp_photo_url} alt="KTP" className="w-full aspect-video object-cover transition-transform group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <span className="material-symbols-outlined text-white text-3xl">zoom_in</span>
                </div>
              </div>
            ) : (
              <div className="aspect-video bg-background-dark/50 border border-dashed border-border-dark rounded-xl flex flex-col items-center justify-center text-gray-600">
                <span className="material-symbols-outlined text-3xl mb-1">image_not_supported</span>
                <span className="text-xs font-medium">Belum Upload KTP</span>
              </div>
            )}
          </div>
        </div>

        {/* Booking History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface-dark border border-border-dark rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-border-dark flex justify-between items-center">
              <h3 className="text-white font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">calendar_month</span>
                Riwayat Booking
              </h3>
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">
                {bookings?.length || 0} Booking
              </span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-background-dark/50 text-gray-500 text-[10px] uppercase tracking-widest font-bold">
                    <th className="px-6 py-4">Booking ID</th>
                    <th className="px-6 py-4">Tanggal Mendaki</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4 text-center">Detail</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-dark/50 text-sm">
                  {bookings?.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500 italic">
                        User belum pernah melakukan booking.
                      </td>
                    </tr>
                  ) : (
                    bookings.map((booking: any) => (
                      <tr key={booking.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-6 py-4">
                          <p className="text-white font-mono font-bold tracking-tight">{booking.id}</p>
                          <p className="text-[10px] text-gray-500 mt-1">
                            Dibuat: {new Date(booking.created_at).toLocaleDateString()}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-gray-300 font-medium">
                            <span className="material-symbols-outlined text-sm text-primary">event</span>
                            {new Date(booking.booking_date).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            booking.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500' :
                            booking.status === 'pending' ? 'bg-amber-500/10 text-amber-500' :
                            booking.status === 'rejected' ? 'bg-rose-500/10 text-rose-500' :
                            'bg-gray-500/10 text-gray-400'
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-white font-bold">Rp {booking.total_price.toLocaleString()}</p>
                          <p className="text-[10px] text-gray-500">{booking.total_participants} Orang</p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Link href={`/admin/booking/${booking.id}`}>
                            <button className="p-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg transition-all shadow-lg shadow-primary/5">
                              <span className="material-symbols-outlined text-xl">open_in_new</span>
                            </button>
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Quick Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface-dark border border-border-dark p-6 rounded-2xl flex items-center gap-4 shadow-xl shadow-black/20">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <span className="material-symbols-outlined text-2xl">payments</span>
              </div>
              <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Kontribusi</p>
                <h4 className="text-white text-xl font-black">
                  Rp {bookings.reduce((sum: number, b: any) => sum + (b.total_price || 0), 0).toLocaleString()}
                </h4>
              </div>
            </div>
            <div className="bg-surface-dark border border-border-dark p-6 rounded-2xl flex items-center gap-4 shadow-xl shadow-black/20">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                <span className="material-symbols-outlined text-2xl">group</span>
              </div>
              <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Teman Mendaki</p>
                <h4 className="text-white text-xl font-black">
                  {bookings.reduce((sum: number, b: any) => sum + (b.total_participants || 0), 0)} Orang
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Role Modal */}
      <AnimatePresence>
        {showRoleModal && (
          <>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]" onClick={() => setShowRoleModal(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-surface-dark border border-border-dark rounded-3xl p-8 shadow-2xl z-[70] max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-xl font-black text-white mb-6">Ubah Role User</h3>
              <div className="space-y-3">
                {['user', 'admin', 'super_admin'].map((role) => (
                  <button
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    className={`w-full px-4 py-4 rounded-2xl border font-bold text-sm transition-all flex items-center justify-between ${
                      selectedRole === role 
                        ? "bg-primary/10 border-primary text-primary" 
                        : "bg-background-dark border-border-dark text-gray-400 hover:border-gray-500"
                    }`}
                  >
                    <span className="uppercase tracking-widest">{role}</span>
                    {selectedRole === role && <span className="material-symbols-outlined">check_circle</span>}
                  </button>
                ))}
              </div>
              <div className="pt-8 flex gap-3">
                <button
                  onClick={() => setShowRoleModal(false)}
                  className="flex-1 px-6 py-3 bg-white/5 text-white font-bold rounded-xl hover:bg-white/10 transition-all font-mono text-xs uppercase"
                >
                  Batal
                </button>
                <button
                  onClick={handleUpdateRole}
                  disabled={isUpdating || selectedRole === user.role}
                  className="flex-[2] px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-blue-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2 font-mono text-xs uppercase"
                >
                   {isUpdating ? "Updating..." : "Simpan Role"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Lightbox placeholder for KTP */}
      {/* ... could be added later ... */}
    </div>
  );
}
