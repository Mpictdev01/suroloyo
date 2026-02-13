"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import useSWR from "swr";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

const fetchQuota = async () => {
    const { data, error } = await supabase
        .from("daily_quota")
        .select("*")
        .order("date", { ascending: true });
    
    if (error) throw error;
    return data;
};

export default function QuotaManagementPage() {
    const { data: quotaData, error, isLoading, mutate } = useSWR("admin/quota", fetchQuota);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [editQuota, setEditQuota] = useState(150);
    const [isOpen, setIsOpen] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const handleUpdateQuota = async () => {
        if (!selectedDate) return;
        setIsSubmitting(true);
        try {
            const { error } = await supabase
                .from("daily_quota")
                .upsert({ 
                    date: selectedDate, 
                    total_quota: editQuota, 
                    is_open: isOpen,
                    updated_at: new Date().toISOString()
                });

            if (error) throw error;
            toast.success("Kuota berhasil diperbarui!");
            mutate();
            setSelectedDate(null);
        } catch (err: any) {
            toast.error("Gagal memperbarui kuota: " + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black text-white">Kuota & Jadwal</h1>
                    <p className="text-gray-500 text-sm">Atur kuota harian dan kelola pembukaan jalur</p>
                </div>
                
                <div className="flex bg-surface-dark border border-border-dark p-1 rounded-2xl">
                    <button onClick={prevMonth} className="p-2 text-gray-400 hover:text-white transition-colors">
                        <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    <div className="px-6 py-2 text-white font-bold min-w-[160px] text-center">
                        {currentDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                    </div>
                    <button onClick={nextMonth} className="p-2 text-gray-400 hover:text-white transition-colors">
                        <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                <div className="xl:col-span-3 bg-surface-dark border border-border-dark rounded-3xl p-6 md:p-8 shadow-2xl">
                    <div className="grid grid-cols-7 gap-2 mb-4">
                        {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((day, i) => (
                            <div key={i} className="text-center text-[10px] font-black uppercase tracking-widest text-gray-500 py-2">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                        {Array(firstDayOfMonth).fill(0).map((_, i) => (
                            <div key={`empty-${i}`} className="aspect-square bg-background-dark/30 rounded-2xl border border-border-dark/30 opacity-20" />
                        ))}
                        
                        {Array(daysInMonth).fill(0).map((_, i) => {
                            const day = i + 1;
                            const dateStr = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                            const qData = quotaData?.find(q => q.date === dateStr);
                            const filled = qData?.filled || 0;
                            const total = qData?.total_quota || 150;
                            const percent = (filled / total) * 100;
                            const isClosed = qData?.is_open === false;

                            return (
                                <motion.div
                                    whileHover={{ y: -2 }}
                                    key={day}
                                    onClick={() => {
                                        setSelectedDate(dateStr);
                                        setEditQuota(total);
                                        setIsOpen(qData ? qData.is_open : true);
                                    }}
                                    className={`aspect-square p-2 md:p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden group ${
                                        isClosed ? "bg-rose-500/10 border-rose-500/30" :
                                        selectedDate === dateStr ? "bg-primary/20 border-primary shadow-lg shadow-primary/20" :
                                        "bg-background-dark border-border-dark hover:border-gray-500"
                                    }`}
                                >
                                    <span className={`text-sm font-black ${isClosed ? "text-rose-500" : "text-white"}`}>{day}</span>
                                    
                                    {!isClosed ? (
                                        <div className="flex flex-col gap-1">
                                            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full transition-all duration-1000 ${percent > 90 ? 'bg-rose-500' : percent > 70 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                                                    style={{ width: `${percent}%` }} 
                                                />
                                            </div>
                                            <p className="text-[9px] md:text-[10px] font-bold text-gray-500 text-right">
                                                <span className="text-gray-300">{filled}</span>/{total}
                                            </p>
                                        </div>
                                    ) : (
                                        <span className="material-symbols-outlined text-rose-500 text-sm md:text-xl text-center">block</span>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="bg-surface-dark border border-border-dark rounded-3xl p-6 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <span className="material-symbols-outlined text-6xl">info</span>
                        </div>
                        <h3 className="text-white font-bold text-lg mb-4">Informasi Kuota</h3>
                        <p className="text-gray-500 text-sm leading-relaxed mb-6">
                            Gunakan panel ini untuk menyesuaikan kuota harian. Jalur yang ditutup tidak akan muncul di kalender booking pendaki.
                        </p>
                        
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                                <span className="text-gray-300 text-xs font-bold uppercase tracking-widest">Aman ({"<70%"})</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-amber-500" />
                                <span className="text-gray-300 text-xs font-bold uppercase tracking-widest">Padat (70-90%)</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-rose-500" />
                                <span className="text-gray-300 text-xs font-bold uppercase tracking-widest">Penuh ({">90%"})</span>
                            </div>
                        </div>
                    </div>

                    <AnimatePresence>
                        {selectedDate && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="bg-primary border border-primary/20 rounded-3xl p-6 shadow-2xl shadow-primary/20"
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-white font-black text-xl uppercase tracking-tighter">Edit Kuota</h3>
                                    <button onClick={() => setSelectedDate(null)} className="text-white/50 hover:text-white">
                                        <span className="material-symbols-outlined">close</span>
                                    </button>
                                </div>
                                <p className="text-white/80 font-bold mb-6 text-sm">
                                    {new Date(selectedDate).toLocaleDateString('id-ID', { dateStyle: 'full' })}
                                </p>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/60">Total Kuota (Orang)</label>
                                        <input 
                                            type="number"
                                            value={editQuota}
                                            onChange={(e) => setEditQuota(parseInt(e.target.value))}
                                            className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white font-black outline-none focus:bg-white/20 transition-all"
                                        />
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-white/10 rounded-2xl border border-white/20">
                                        <span className="text-sm font-bold text-white">Buka Jalur?</span>
                                        <button 
                                            onClick={() => setIsOpen(!isOpen)}
                                            className={`w-12 h-6 rounded-full relative transition-colors ${isOpen ? 'bg-emerald-500' : 'bg-rose-500'}`}
                                        >
                                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isOpen ? 'left-7' : 'left-1'}`} />
                                        </button>
                                    </div>

                                    <button
                                        disabled={isSubmitting}
                                        onClick={handleUpdateQuota}
                                        className="w-full py-4 bg-white text-primary font-black rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <span className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <span className="material-symbols-outlined">save</span>
                                                SIMPAN DATA
                                            </>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
