"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import useSWR from "swr";
import { motion } from "framer-motion";
import Link from "next/link";

const fetchBookings = async (status: string, search: string) => {
  let query = supabase
    .from("bookings")
    .select(`
      id,
      booking_date,
      status,
      total_participants,
      total_price,
      created_at,
      user_id,
      users (name, email)
    `)
    .order("created_at", { ascending: false });

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  if (search) {
    query = query.or(`id.ilike.%${search}%,admin_notes.ilike.%${search}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export default function BookingListPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: bookings, error, isLoading, mutate } = useSWR(
    ["admin/bookings", statusFilter, searchTerm],
    () => fetchBookings(statusFilter, searchTerm)
  );

  const stats = [
    { label: "Total", count: bookings?.length || 0, color: "text-blue-500" },
    { label: "Pending", count: bookings?.filter(b => b.status === 'pending').length || 0, color: "text-amber-500" },
    { label: "Approved", count: bookings?.filter(b => b.status === 'approved').length || 0, color: "text-emerald-500" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Manajemen Booking</h1>
          <p className="text-gray-500 text-sm">Kelola dan verifikasi semua pendaftaran pendakian</p>
        </div>
        
        <div className="flex items-center gap-2">
           {stats.map((s, i) => (
             <div key={i} className="bg-surface-dark border border-border-dark px-4 py-2 rounded-xl flex items-center gap-2">
               <span className={`text-xs font-bold uppercase tracking-wider ${s.color}`}>{s.label}</span>
               <span className="text-white font-black">{s.count}</span>
             </div>
           ))}
        </div>
      </div>

      {/* Filters & Search */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative md:col-span-2">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">search</span>
          <input
            type="text"
            placeholder="Cari ID Booking atau Nama..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-surface-dark border border-border-dark rounded-xl text-white focus:ring-2 focus:ring-primary outline-none transition-all"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-surface-dark border border-border-dark rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-primary transition-all"
        >
          <option value="all">Semua Status</option>
          <option value="pending">Pending</option>
          <option value="verified">Verified</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-surface-dark border border-border-dark rounded-2xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-background-dark/50 text-gray-500 text-[10px] uppercase tracking-widest font-bold">
                <th className="px-6 py-4">Booking ID</th>
                <th className="px-6 py-4">Pendaki (Leader)</th>
                <th className="px-6 py-4">Tgl Mendaki</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-dark/50 text-sm">
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-6 py-4">
                      <div className="h-6 bg-white/5 rounded w-full" />
                    </td>
                  </tr>
                ))
              ) : bookings?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-gray-500 italic">
                    Data booking tidak ditemukan.
                  </td>
                </tr>
              ) : (
                bookings?.map((booking: any) => (
                  <tr key={booking.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <p className="text-white font-mono font-bold tracking-tight">{booking.id}</p>
                      <p className="text-[10px] text-gray-500 mt-1">
                        Dibuat: {new Date(booking.created_at).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white font-semibold">{booking.users?.name || 'Unknown'}</p>
                      <p className="text-xs text-gray-500">{booking.users?.email || '-'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-300">
                        <span className="material-symbols-outlined text-sm text-primary">calendar_today</span>
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
                        <button className="p-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg transition-all">
                          <span className="material-symbols-outlined text-xl">visibility</span>
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
