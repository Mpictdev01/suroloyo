"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import Header from "@/components/Header";
import { useBooking } from "@/context/BookingContext";
import BookingProgressBar from "@/components/BookingProgressBar";
import { supabase } from "@/lib/supabase";
import useSWR from "swr";

const fetchQuota = async (year: number, month: number) => {
    // Get start and end of month
    const startOfMonth = new Date(year, month, 1).toISOString();
    const endOfMonth = new Date(year, month + 1, 0).toISOString();

    const { data, error } = await supabase
        .from("daily_quota")
        .select("*")
        .gte("date", startOfMonth.split('T')[0])
        .lte("date", endOfMonth.split('T')[0]);
    
    if (error) throw error;
    return data;
};

export default function BookingJadwalPage() {
  const router = useRouter();
  const { setBookingDate, bookingDate, user } = useBooking();
  const [selected, setSelected] = useState<string | null>(bookingDate);
  const [currentMonthOffset, setCurrentMonthOffset] = useState(0); 
  
  // Current month reference
  const now = new Date();
  const activeYear = now.getFullYear();
  const activeMonth = now.getMonth() + currentMonthOffset;
  const viewDate = new Date(activeYear, activeMonth, 1);
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const { data: quotaData, isLoading } = useSWR(`quota/${year}/${month}`, () => fetchQuota(year, month));

  // Auth Gate
  useEffect(() => {
    if (!user) {
        router.push("/masuk?returnUrl=/booking/jadwal");
    }
  }, [user, router]);

  const handleSelect = (date: string) => {
    setSelected(date);
    setBookingDate(date);
  };

  const handleNext = () => {
    if (selected) {
      router.push("/booking/grup");
    }
  };

  // Generate Calendar Data
  const days = useMemo(() => {
      const monthName = viewDate.toLocaleString('id-ID', { month: 'long', year: 'numeric' });
      
      const startDay = new Date(year, month, 1).getDay(); // 0 = Sun
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      interface CalendarItem {
        day: number | string;
        date?: string;
        slots?: number;
        total?: number;
        status?: "safe" | "warning" | "full";
        passed: boolean;
        isOpen?: boolean;
      }

      const generatedDays: CalendarItem[] = [];

      // Empty slots for previous month
      for (let i = 0; i < startDay; i++) {
          generatedDays.push({ day: "", passed: true });
      }

      const today = new Date();
      today.setHours(0,0,0,0);

      // Days
      for (let i = 1; i <= daysInMonth; i++) {
          const currentDate = new Date(year, month, i);
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
          
          const quota = quotaData?.find(q => q.date === dateStr);
          const totalQuota = quota?.total_quota || 150;
          const filled = quota?.filled || 0;
          const remaining = totalQuota - filled;
          const isOpen = quota ? quota.is_open : true;
          
          const isPassed = currentDate < today;
          
          let status: "safe" | "warning" | "full" = "safe";
          if (remaining <= 0 || !isOpen) status = "full";
          else if (remaining < 20) status = "warning";

          generatedDays.push({
              day: i,
              date: dateStr,
              slots: remaining,
              total: totalQuota,
              status: status,
              passed: isPassed || !isOpen,
              isOpen: isOpen
          });
      }

      return { monthName, items: generatedDays };
  }, [year, month, quotaData, viewDate]);

  const selectedDayData = useMemo(() => {
      if (!selected) return null;
      return days.items.find(d => d.date === selected);
  }, [selected, days]);

  const formatDate = (dateStr: string) => {
      if (!dateStr) return "-";
      return new Date(dateStr).toLocaleDateString("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric"
      });
  };

  return (
    <>
      <Header />
      <main className="flex-grow flex flex-col pt-24 pb-12 px-4 md:px-10">
        <div className="w-full max-w-7xl mx-auto flex flex-col gap-8">
            
            <div className="max-w-3xl mx-auto w-full">
               <BookingProgressBar currentStep={2} />
            </div>

            <div className="flex flex-col xl:flex-row gap-8">
                {/* Calendar Section */}
                <div className="flex-1 flex flex-col">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-white text-3xl font-black">Pilih Tanggal</h1>
                            <p className="text-gray-400">Jadwal pendakian tersedia untuk bulan ini.</p>
                        </div>
                        <div className="flex items-center gap-2 bg-surface-dark p-1.5 rounded-lg border border-border-dark">
                            <button 
                                onClick={() => setCurrentMonthOffset(Math.max(0, currentMonthOffset - 1))}
                                disabled={currentMonthOffset === 0}
                                className="size-10 flex items-center justify-center rounded hover:bg-slate-700 text-white transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                            >
                                <span className="material-symbols-outlined">chevron_left</span>
                            </button>
                            <span className="text-white font-bold text-center text-sm py-2 px-4 min-w-[140px]">
                                {days.monthName}
                            </span>
                            <button 
                                onClick={() => setCurrentMonthOffset(currentMonthOffset + 1)}
                                className="size-10 flex items-center justify-center rounded hover:bg-slate-700 text-white transition-colors"
                            >
                                <span className="material-symbols-outlined">chevron_right</span>
                            </button>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="flex gap-3 mb-4 flex-wrap">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/20">
                            <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                            <span className="text-white text-xs font-bold uppercase">Aman</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-yellow-900/20">
                            <span className="material-symbols-outlined text-yellow-400 text-sm">warning</span>
                            <span className="text-white text-xs font-bold uppercase">Terbatas</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-900/20">
                            <span className="material-symbols-outlined text-red-400 text-sm">cancel</span>
                            <span className="text-white text-xs font-bold uppercase">Penuh</span>
                        </div>
                    </div>

                    {/* Grid */}
                    <div className="bg-surface-dark rounded-xl border border-border-dark overflow-hidden">
                        <div className="grid grid-cols-7 border-b border-border-dark bg-slate-800">
                            {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((day) => (
                                <div key={day} className="py-3 text-center text-xs font-bold uppercase tracking-wider text-gray-400">
                                    {day}
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7">
                            {days.items.map((item, index) => {
                                const isSelected = selected === item.date;
                                const isFull = item.status === "full";
                                
                                return (
                                    <div
                                        key={index}
                                        onClick={() => !item.passed && !isFull && item.day && handleSelect(item.date!)}
                                        className={`relative border-b border-r border-border-dark p-2 sm:p-3 min-h-[80px] transition-all cursor-pointer ${
                                            item.passed ? "bg-slate-900/50 opacity-30 cursor-default" :
                                            isSelected ? "bg-primary/20 shadow-inner z-10" :
                                            isFull ? "bg-red-900/10 cursor-not-allowed" :
                                            "hover:bg-slate-700"
                                        }`}
                                    >
                                        {item.day && (
                                            <>
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className={`text-sm font-bold ${
                                                        isSelected ? "text-primary scale-110" : 
                                                        item.passed ? "text-gray-600" : "text-white"
                                                    }`}>
                                                        {item.day}
                                                    </span>
                                                    {isSelected && <span className="material-symbols-outlined text-primary text-base">check_circle</span>}
                                                </div>
                                                
                                                {!item.passed && item.slots !== undefined && (
                                                    <div className="flex flex-col gap-1">
                                                        <div className="w-full bg-slate-900 rounded-full h-1">
                                                            <div 
                                                                className={`h-full rounded-full ${isFull ? "bg-red-500" : item.status === "warning" ? "bg-yellow-500" : "bg-primary"}`}
                                                                style={{ width: `${Math.min((item.slots/item.total!)*100, 100)}%` }}
                                                            />
                                                        </div>
                                                        <span className={`text-[10px] font-medium ${isFull ? "text-red-400" : "text-gray-400"}`}>
                                                            {isFull ? "HABIS" : `${item.slots} Slot`}
                                                        </span>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Sidebar Detail */}
                <aside className="w-full xl:w-[350px] flex flex-col gap-6">
                    <div className="bg-surface-dark p-6 rounded-2xl border border-border-dark h-fit sticky top-24">
                        <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">event</span>
                            Detail Pilihan
                        </h3>
                        
                        {selectedDayData ? (
                            <div className="flex flex-col gap-4">
                                <div className="p-4 rounded-xl bg-background-dark border border-border-dark">
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">Tanggal</span>
                                    <span className="text-2xl font-black text-white">{formatDate(selectedDayData.date!)}</span>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 rounded-xl bg-background-dark border border-border-dark">
                                        <span className="text-xs font-bold text-gray-500 uppercase block mb-1">Status</span>
                                        <span className={`font-bold flex items-center gap-1 ${
                                            selectedDayData.status === "safe" ? "text-green-400" :
                                            selectedDayData.status === "warning" ? "text-yellow-400" : "text-red-400"
                                        }`}>
                                            <span className="material-symbols-outlined text-sm">
                                                {selectedDayData.status === "safe" ? "check_circle" : "warning"}
                                            </span> 
                                            {selectedDayData.status === "safe" ? "Aman" : 
                                             selectedDayData.status === "warning" ? "Terbatas" : "Penuh"}
                                        </span>
                                    </div>
                                    <div className="p-3 rounded-xl bg-background-dark border border-border-dark">
                                        <span className="text-xs font-bold text-gray-500 uppercase block mb-1">Sisa Kuota</span>
                                        <span className="text-white font-bold">{selectedDayData.slots} Orang</span>
                                    </div>
                                </div>

                                <div className="p-3 rounded-xl bg-blue-900/20 border border-primary/20 flex gap-3 items-start">
                                    <span className="material-symbols-outlined text-primary text-xl shrink-0">info</span>
                                    <p className="text-sm text-blue-100">
                                        Pastikan tanggal sudah benar. Anda tidak dapat mengubah tanggal setelah tiket terbit.
                                    </p>
                                </div>

                                <button
                                    onClick={handleNext}
                                    className="w-full h-12 bg-primary hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2 mt-2"
                                >
                                    <span>Lanjut ke Anggota</span>
                                    <span className="material-symbols-outlined">arrow_forward</span>
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-10 text-center opacity-50">
                                <span className="material-symbols-outlined text-4xl mb-2">calendar_month</span>
                                <p className="text-sm">Silakan pilih tanggal pendakian di kalender.</p>
                            </div>
                        )}
                    </div>
                </aside>
            </div>
        </div>
      </main>
    </>
  );
}
