"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import useSWR from "swr";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

const fetchAdmins = async () => {
    const { data, error } = await supabase
        .from("users")
        .select("id, name, email, role, created_at")
        .in("role", ["admin", "super_admin"])
        .order("created_at", { ascending: true });
    
    if (error) throw error;
    return data;
};

export default function SettingsPage() {
    const { data: admins, mutate } = useSWR("admin/list", fetchAdmins);
    const [isSaving, setIsSaving] = useState(false);
    
    const [siteSettings, setSiteSettings] = useState({
        ticket_price: 15000,
        min_participants: 1,
        max_participants: 10,
        booking_window_days: 30,
        admin_whatsapp: "081234567890"
    });

    const handleSaveGeneral = async () => {
        setIsSaving(true);
        try {
            // Simulasi simpan setting ke tabel settings atau metadata
            toast.success("Pengaturan umum berhasil disimpan!");
        } catch (err: any) {
            toast.error("Gagal menyimpan: " + err.message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-8 max-w-6xl">
            <div>
                <h1 className="text-2xl font-black text-white">System Settings</h1>
                <p className="text-gray-500 text-sm">Kelola konfigurasi aplikasi, harga tiket, dan hak akses admin</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* General Configuration */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-surface-dark border border-border-dark rounded-3xl p-8 shadow-xl">
                        <h3 className="text-white font-bold text-lg mb-8 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">tune</span>
                            Konfigurasi Booking & Harga
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Harga Tiket (Rp Per Orang)</label>
                                <input 
                                    type="number"
                                    value={siteSettings.ticket_price}
                                    onChange={(e) => setSiteSettings({...siteSettings, ticket_price: parseInt(e.target.value)})}
                                    className="w-full bg-background-dark border border-border-dark rounded-xl px-4 py-3 text-white font-black outline-none focus:border-primary transition-all text-xl"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">WhatsApp Admin (Konfirmasi)</label>
                                <input 
                                    type="text"
                                    value={siteSettings.admin_whatsapp}
                                    onChange={(e) => setSiteSettings({...siteSettings, admin_whatsapp: e.target.value})}
                                    className="w-full bg-background-dark border border-border-dark rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-primary transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Maksimal Booking (Hari Ke Depan)</label>
                                <input 
                                    type="number"
                                    value={siteSettings.booking_window_days}
                                    onChange={(e) => setSiteSettings({...siteSettings, booking_window_days: parseInt(e.target.value)})}
                                    className="w-full bg-background-dark border border-border-dark rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-primary transition-all"
                                />
                                <p className="text-[10px] text-gray-600 italic mt-1">Lama waktu pendaki bisa booking sebelum hari H.</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Maksimal Peserta Per Grup</label>
                                <input 
                                    type="number"
                                    value={siteSettings.max_participants}
                                    onChange={(e) => setSiteSettings({...siteSettings, max_participants: parseInt(e.target.value)})}
                                    className="w-full bg-background-dark border border-border-dark rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-primary transition-all"
                                />
                            </div>
                        </div>

                        <div className="mt-10 pt-6 border-t border-border-dark flex justify-end">
                            <button
                                onClick={handleSaveGeneral}
                                disabled={isSaving}
                                className="px-10 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
                            >
                                {isSaving ? (
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined">save</span>
                                        SIMPAN PERUBAHAN
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="bg-surface-dark border border-border-dark rounded-3xl p-8 shadow-xl">
                         <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">security</span>
                            Manajemen Akses Admin
                        </h3>

                        <div className="space-y-4">
                            {admins?.map((admin: any) => (
                                <div key={admin.id} className="flex items-center justify-between p-4 bg-background-dark/50 border border-border-dark/50 rounded-2xl group hover:border-primary/30 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-black text-sm">
                                            {admin.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-white font-bold text-sm">{admin.name}</p>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">{admin.role}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <p className="text-[9px] text-gray-600 font-medium">Join: {new Date(admin.created_at).toLocaleDateString()}</p>
                                        <button className="text-[10px] text-rose-500 font-black hover:underline opacity-0 group-hover:opacity-100 transition-opacity">REVOKE AKSES</button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button className="w-full mt-6 py-4 border border-dashed border-border-dark rounded-2xl text-gray-500 font-bold text-sm hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined">person_add</span>
                            TAMBAH AKUN ADMIN BARU
                        </button>
                    </div>
                </div>

                {/* Sidebar Info / Activity */}
                <div className="space-y-6">
                    <div className="bg-surface-dark border border-border-dark rounded-3xl p-8 relative overflow-hidden group">
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all" />
                        <h4 className="text-white font-bold mb-4">Informasi Sistem</h4>
                        <div className="space-y-4">
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-500">Database Engine</span>
                                <span className="text-emerald-500 font-bold">Supabase (PostgreSQL)</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-500">Storage</span>
                                <span className="text-primary font-bold">Supabase Storage</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-500">Framework</span>
                                <span className="text-white font-bold">Next.js 16.1.6</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-500">Server Status</span>
                                <div className="flex items-center gap-1.5 text-emerald-500 font-bold">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    OPERATIONAL
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-surface-dark border border-border-dark rounded-3xl p-8 shadow-xl">
                        <h4 className="text-white font-bold mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">history</span>
                            Activity Logs
                        </h4>
                        <div className="space-y-6 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-border-dark">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="pl-8 relative">
                                    <div className="absolute left-1.5 top-1 w-3 h-3 rounded-full bg-primary border-4 border-surface-dark" />
                                    <p className="text-xs text-white font-bold">Update Harga Tiket</p>
                                    <p className="text-[10px] text-gray-500 mt-1">Oleh Admin Suroloyo • 2 jam yang lalu</p>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-8 text-[10px] text-primary font-black uppercase tracking-widest hover:underline">LIHAT SEMUA LOG</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
