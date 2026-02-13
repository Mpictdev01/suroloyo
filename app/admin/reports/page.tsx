"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import * as XLSX from "xlsx";

export default function ReportsPage() {
    const [dateRange, setDateRange] = useState({
        start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    });
    const [reportType, setReportType] = useState("booking");
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerateReport = async () => {
        setIsGenerating(true);
        try {
            // Fetch data based on report type
            let query = supabase
                .from("bookings")
                .select(`
                    id,
                    booking_date,
                    total_price,
                    status,
                    payment_status,
                    created_at,
                    users (name, email)
                `)
                .gte("booking_date", dateRange.start)
                .lte("booking_date", dateRange.end);

            const { data, error } = await query;

            if (error) throw error;

            if (!data || data.length === 0) {
                toast.error("Tidak ada data untuk periode ini.");
                return;
            }

            // Transform data for Excel
            const excelData = data.map(item => ({
                "ID Booking": item.id,
                "Nama Pendaki": item.users?.name || "N/A",
                "Email": item.users?.email || "N/A",
                "Tanggal Pendakian": new Date(item.booking_date).toLocaleDateString("id-ID"),
                "Total Bayar": item.total_price,
                "Status Booking": item.status,
                "Status Pembayaran": item.payment_status,
                "Tanggal Transaksi": new Date(item.created_at).toLocaleString("id-ID")
            }));

            // Create workbook and worksheet
            const ws = XLSX.utils.json_to_sheet(excelData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Laporan " + reportType);

            // Generate file and trigger download
            XLSX.writeFile(wb, `Laporan_${reportType}_${dateRange.start}_to_${dateRange.end}.xlsx`);

            toast.success(`Laporan ${reportType} berhasil di-download!`);

        } catch (err: any) {
            toast.error("Gagal men-generate laporan: " + err.message);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-black text-white">Reports & Analytics</h1>
                <p className="text-gray-500 text-sm">Download laporan data dan analisis performa sistem</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Configuration Panel */}
                <div className="xl:col-span-1 space-y-6">
                    <div className="bg-surface-dark border border-border-dark rounded-3xl p-8 shadow-xl">
                        <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">analytics</span>
                            Konfigurasi Laporan
                        </h3>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Jenis Laporan</label>
                                <select 
                                    value={reportType}
                                    onChange={(e) => setReportType(e.target.value)}
                                    className="w-full bg-background-dark border border-border-dark rounded-xl px-4 py-3 text-white outline-none focus:border-primary transition-all font-bold"
                                >
                                    <option value="booking">Laporan Booking Pendakian</option>
                                    <option value="revenue">Laporan Pendapatan (Revenue)</option>
                                    <option value="users">Laporan Pertumbuhan User</option>
                                    <option value="payments">Laporan Metode Pembayaran</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Dari Tanggal</label>
                                    <input 
                                        type="date"
                                        value={dateRange.start}
                                        onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                                        className="w-full bg-background-dark border border-border-dark rounded-xl px-4 py-3 text-white outline-none focus:border-primary transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Hingga Tanggal</label>
                                    <input 
                                        type="date"
                                        value={dateRange.end}
                                        onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                                        className="w-full bg-background-dark border border-border-dark rounded-xl px-4 py-3 text-white outline-none focus:border-primary transition-all"
                                    />
                                </div>
                            </div>

                            <div className="h-px bg-border-dark my-2" />

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Format File</label>
                                <div className="flex gap-2">
                                    {['Excel', 'PDF', 'CSV'].map(format => (
                                        <button 
                                            key={format}
                                            className="flex-1 py-2 bg-background-dark border border-border-dark rounded-xl text-xs font-bold text-white hover:border-primary transition-all"
                                        >
                                            {format}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={handleGenerateReport}
                                disabled={isGenerating}
                                className="w-full py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isGenerating ? (
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined">download</span>
                                        DOWNLOAD LAPORAN
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex gap-4">
                         <span className="material-symbols-outlined text-amber-500">info</span>
                         <p className="text-xs text-amber-500/80 leading-relaxed font-medium">
                            Laporan akan mencakup semua status booking kecuali yang draf. Pastikan range tanggal tidak melebihi 1 tahun untuk performa optimal.
                         </p>
                    </div>
                </div>

                {/* Quick Stats / Preview Area */}
                <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 h-fit">
                    <div className="bg-surface-dark border border-border-dark rounded-3xl p-6 shadow-lg">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-500 font-bold">
                                <span className="material-symbols-outlined">payments</span>
                            </div>
                            <div>
                                <h4 className="text-white font-bold">Total Pendapatan</h4>
                                <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Estimasi Periode Ini</p>
                            </div>
                        </div>
                        <p className="text-3xl font-black text-white">Rp 12.450.000</p>
                        <div className="mt-4 flex items-center gap-2 text-emerald-500 text-xs font-bold">
                            <span className="material-symbols-outlined text-sm">trending_up</span>
                            +12% vs bulan lalu
                        </div>
                    </div>

                    <div className="bg-surface-dark border border-border-dark rounded-3xl p-6 shadow-lg">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary font-bold">
                                <span className="material-symbols-outlined">hiking</span>
                            </div>
                            <div>
                                <h4 className="text-white font-bold">Total Pendaki</h4>
                                <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Kunjungan Terdaftar</p>
                            </div>
                        </div>
                        <p className="text-3xl font-black text-white">458 Orang</p>
                        <div className="mt-4 flex items-center gap-2 text-primary text-xs font-bold">
                            <span className="material-symbols-outlined text-sm">groups</span>
                            Rata-rata 4 orang/grup
                        </div>
                    </div>

                    <div className="md:col-span-2 bg-surface-dark border border-border-dark rounded-3xl p-8 flex flex-col items-center justify-center text-center opacity-50 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
                        <span className="material-symbols-outlined text-6xl text-gray-700 mb-4 transition-transform group-hover:scale-110">monitoring</span>
                        <h4 className="text-lg font-bold text-white mb-2">Visualisasi Grafik</h4>
                        <p className="text-sm text-gray-500 max-w-sm">
                            Fitur grafik interaktif untuk perbandingan bulanan sedang dalam pengembangan. Gunakan fitur Download Laporan untuk data detail.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
