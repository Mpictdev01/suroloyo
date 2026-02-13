"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import useSWR from "swr";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { toast } from "react-hot-toast";

import { getUsers } from "@/app/actions";

const fetchUsers = async (role: string, search: string) => {
  // Use Server Action to bypass RLS
  const { users, error } = await getUsers();
  
  if (error) throw error;
  
  let filteredData = users || [];

  // Filter in memory since we fetched all users (or we could add params to server action, 
  // but for now memory filtering is fine for < 1000 users)
  if (role && role !== "all") {
    filteredData = filteredData.filter((u: any) => u.role === role);
  }

  if (search) {
    const lowerSearch = search.toLowerCase();
    filteredData = filteredData.filter((u: any) => 
      (u.name?.toLowerCase().includes(lowerSearch)) ||
      (u.email?.toLowerCase().includes(lowerSearch)) ||
      (u.phone?.toLowerCase().includes(lowerSearch))
    );
  }

  return filteredData;
};

export default function UserListPage() {
  const [roleFilter, setRoleFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminRole, setNewAdminRole] = useState("admin");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: users, error, isLoading, mutate } = useSWR(
    ["admin/users", roleFilter, searchTerm],
    () => fetchUsers(roleFilter, searchTerm)
  );

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail) return;
    
    setIsSubmitting(true);
    try {
      // Note: This only works if the user already exists in Auth. 
      // In a real app, you might use Supabase Admin API or send an invitation.
      // For this prototype, we'll try to find user by email and upgrade their role.
      const { data, error: findError } = await supabase
        .from("users")
        .select("id")
        .eq("email", newAdminEmail)
        .maybeSingle();

      if (findError) throw findError;
      if (!data) {
        toast.error("User dengan email tersebut tidak ditemukan. User harus mendaftar akun terlebih dahulu.");
        return;
      }

      const { error: updateError } = await supabase
        .from("users")
        .update({ role: newAdminRole })
        .eq("id", data.id);

      if (updateError) throw updateError;

      toast.success(`Berhasil menambahkan ${newAdminRole} baru!`);
      setShowAddModal(false);
      setNewAdminEmail("");
      mutate();
    } catch (err: any) {
      toast.error("Gagal menambahkan admin: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleBan = async (userId: string, currentStatus: boolean) => {
    // ... rest of toggle ban
    try {
      const { error } = await supabase
        .from("users")
        .update({ is_banned: !currentStatus })
        .eq("id", userId);

      if (error) throw error;
      
      toast.success(currentStatus ? "User berhasil di-unban" : "User berhasil di-ban");
      mutate();
    } catch (err: any) {
      toast.error("Gagal mengubah status user: " + err.message);
    }
  };

  const stats = [
    { label: "Total Users", count: users?.length || 0, color: "text-blue-500" },
    { label: "Admins", count: users?.filter(u => u.role === 'admin' || u.role === 'super_admin').length || 0, color: "text-purple-500" },
    { label: "Banned", count: users?.filter(u => u.is_banned).length || 0, color: "text-rose-500" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">User Management</h1>
          <p className="text-gray-500 text-sm">Kelola data pendakian dan hak akses pengguna</p>
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative md:col-span-2">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">search</span>
          <input
            type="text"
            placeholder="Cari Nama, Email, atau HP..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-surface-dark border border-border-dark rounded-xl text-white focus:ring-2 focus:ring-primary outline-none transition-all"
          />
        </div>
        
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="bg-surface-dark border border-border-dark rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-primary transition-all"
        >
          <option value="all">Semua Role</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="super_admin">Super Admin</option>
        </select>
        
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-primary hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">person_add</span>
          Tambah Admin
        </button>
      </div>

      {/* User Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface-dark border border-border-dark rounded-2xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-background-dark/50 text-gray-500 text-[10px] uppercase tracking-widest font-bold">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Kontak</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Bergabung</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-dark/50 text-sm">
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-6 py-4">
                      <div className="h-10 bg-white/5 rounded w-full" />
                    </td>
                  </tr>
                ))
              ) : users?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-gray-500 italic">
                    Data user tidak ditemukan.
                  </td>
                </tr>
              ) : (
                users?.map((u: any) => (
                  <tr key={u.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden border border-border-dark">
                          {u.avatar ? (
                            <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="material-symbols-outlined text-gray-500">person</span>
                          )}
                        </div>
                        <div>
                          <p className="text-white font-bold">{u.name}</p>
                          <p className="text-[10px] text-gray-500 font-mono select-all">ID: {u.id.substring(0, 8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <p className="text-white font-medium">{u.email}</p>
                        <p className="text-xs text-gray-500">{u.phone || '-'}</p>
                        {u.is_missing_profile && (
                            <span className="text-[9px] text-amber-500 font-bold uppercase tracking-wider mt-1 flex items-center gap-1">
                                <span className="material-symbols-outlined text-[10px]">warning</span>
                                No Profile
                            </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                        u.role === 'super_admin' ? 'bg-purple-500/10 text-purple-500' :
                        u.role === 'admin' ? 'bg-blue-500/10 text-blue-500' :
                        'bg-slate-500/10 text-slate-400'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${u.is_banned ? 'bg-rose-500' : 'bg-emerald-500 animate-pulse'}`} />
                        <span className={u.is_banned ? 'text-rose-500 font-bold' : 'text-emerald-500 font-bold'}>
                          {u.is_banned ? 'Banned' : 'Active'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-xs">
                      {new Date(u.created_at).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link href={`/admin/users/${u.id}`}>
                          <button className="p-2 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all" title="Detail Profile">
                            <span className="material-symbols-outlined text-xl">visibility</span>
                          </button>
                        </Link>
                        
                        <button 
                          onClick={() => handleToggleBan(u.id, u.is_banned)}
                          className={`p-2 rounded-lg transition-all ${
                            u.is_banned 
                              ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white" 
                              : "bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white"
                          }`}
                          title={u.is_banned ? "Unban User" : "Ban User"}
                        >
                          <span className="material-symbols-outlined text-xl">
                            {u.is_banned ? 'how_to_reg' : 'block'}
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Add Admin Modal */}
      <AnimatePresence>
        {showAddModal && (
          <>
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]" 
              onClick={() => setShowAddModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-surface-dark border border-border-dark rounded-3xl p-8 shadow-2xl z-[70] max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-white">Tambah Admin Baru</h3>
                <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-white">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <form onSubmit={handleAddAdmin} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Email Pengguna</label>
                  <input
                    type="email"
                    required
                    placeholder="nama@email.com"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-background-dark border border-border-dark rounded-xl text-white outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                  <p className="text-[10px] text-gray-500">User harus sudah mendaftar sebagai pendaki terlebih dahulu.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Pilih Role</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setNewAdminRole("admin")}
                      className={`px-4 py-3 rounded-xl border font-bold text-sm transition-all ${
                        newAdminRole === "admin" 
                          ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" 
                          : "bg-background-dark border-border-dark text-gray-500 hover:border-gray-500"
                      }`}
                    >
                      Admin
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewAdminRole("super_admin")}
                      className={`px-4 py-3 rounded-xl border font-bold text-sm transition-all ${
                        newAdminRole === "super_admin" 
                          ? "bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-600/20" 
                          : "bg-background-dark border-border-dark text-gray-500 hover:border-gray-500"
                      }`}
                    >
                      Super Admin
                    </button>
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-6 py-3 bg-white/5 text-white font-bold rounded-xl hover:bg-white/10 transition-all"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-[2] px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-xl">check_circle</span>
                        Simpan Admin
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
