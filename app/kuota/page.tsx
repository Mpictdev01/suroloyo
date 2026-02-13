"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Header from "@/components/Header";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

import { useRouter } from "next/navigation";
import { useBooking } from "@/context/BookingContext";

export default function KuotaPage() {
  const router = useRouter();
  const { user } = useBooking();

  const handleBooking = () => {
      if (user) {
        router.push("/booking/aturan");
      } else {
        router.push("/masuk?returnUrl=/booking/aturan");
      }
  };

  interface KuotaItem {
    day: number | string;
    passed?: boolean;
    slots?: number;
    color?: string;
    selected?: boolean;
  }

  const days: KuotaItem[] = [
    { day: "", passed: true },
    { day: "", passed: true },
    { day: 1, passed: true },
    { day: 2, slots: 120, color: "primary" },
    { day: 3, slots: 98, color: "primary" },
    { day: 4, slots: 8, color: "yellow" },
    { day: 5, slots: 0, color: "red" },
    { day: 6, slots: 45, color: "primary", selected: true },
    { day: 7, slots: 135, color: "primary" },
    ...Array.from({ length: 24 }, (_, i) => ({ day: i + 8 })),
  ];

  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col xl:flex-row pt-16">
        {/* Calendar Section */}
        <div className="flex-1 flex flex-col p-6 lg:p-10 overflow-y-auto">
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 pb-4">
              <Link href="/" className="text-gray-500 text-sm font-medium hover:underline">
                Home
              </Link>
              <span className="text-gray-600 text-sm">/</span>
              <span className="text-white text-sm font-medium">Quota Check</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="flex flex-col gap-2">
                <h1 className="text-white text-3xl md:text-4xl font-black leading-tight tracking-tight">
                  Quota Availability
                </h1>
                <p className="text-gray-400 text-base">
                  Check availability for Mount Suroloyo via Nyatnyono trail.
                </p>
              </div>
              <div className="flex items-center gap-2 bg-surface-dark p-1.5 rounded-lg border border-border-dark">
                <button className="size-10 flex items-center justify-center rounded hover:bg-slate-700 text-white transition-colors">
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <span className="text-white font-bold text-center text-sm py-2 px-4 min-w-[160px]">
                  October 2024
                </span>
                <button className="size-10 flex items-center justify-center rounded hover:bg-slate-700 text-white transition-colors">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex gap-3 mb-6 flex-wrap">
            <div className="flex h-8 items-center gap-x-2 rounded-lg bg-primary/20 border border-transparent pl-2 pr-4">
              <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
              <p className="text-white text-xs font-bold uppercase tracking-wide">High Quota (&gt;10)</p>
            </div>
            <div className="flex h-8 items-center gap-x-2 rounded-lg bg-yellow-900/20 border border-transparent pl-2 pr-4">
              <span className="material-symbols-outlined text-yellow-400 text-[20px]">warning</span>
              <p className="text-white text-xs font-bold uppercase tracking-wide">Limited Quota (&lt;10)</p>
            </div>
            <div className="flex h-8 items-center gap-x-2 rounded-lg bg-red-900/20 border border-transparent pl-2 pr-4">
              <span className="material-symbols-outlined text-red-400 text-[20px]">cancel</span>
              <p className="text-white text-xs font-bold uppercase tracking-wide">Full / Closed</p>
            </div>
          </div>

          {/* Calendar Grid */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="w-full bg-surface-dark rounded-xl border border-border-dark shadow-sm overflow-hidden flex-1 flex flex-col min-h-[500px]"
          >
            <div className="grid grid-cols-7 border-b border-border-dark bg-slate-800">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="py-3 text-center text-xs font-bold uppercase tracking-wider text-gray-400">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 flex-1 auto-rows-fr">
              {days.map((item, index) => (
                <div
                  key={index}
                  className={`relative border-b border-r border-border-dark p-3 min-h-[80px] transition-colors cursor-pointer ${
                    item.passed
                      ? "bg-slate-900/50 opacity-30"
                      : item.selected
                      ? "border-2 border-primary bg-primary/10 z-10 shadow-[0_0_15px_rgba(0,123,255,0.15)]"
                      : item.slots === 0
                      ? "bg-red-900/20 hover:bg-red-900/30"
                      : "hover:bg-slate-700"
                  }`}
                >
                  {item.day && (
                    <>
                      {item.selected && (
                        <div className="absolute top-2 right-2 size-2 bg-primary rounded-full animate-pulse"></div>
                      )}
                      <span className={`block text-sm font-medium mb-2 ${item.passed ? "text-gray-500" : "text-white"}`}>
                        {item.day}
                      </span>
                      {item.slots !== undefined && !item.passed && (
                        <div className="flex flex-col gap-1">
                          <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                item.color === "primary"
                                  ? "bg-primary"
                                  : item.color === "yellow"
                                  ? "bg-yellow-400"
                                  : "bg-red-500"
                              }`}
                              style={{ width: `${Math.min((item.slots / 150) * 100, 100)}%` }}
                            ></div>
                          </div>
                          <span
                            className={`text-xs font-medium ${
                              item.color === "primary"
                                ? "text-primary"
                                : item.color === "yellow"
                                ? "text-yellow-400"
                                : "text-red-400 font-bold"
                            }`}
                          >
                            {item.slots === 0 ? "FULL" : `${item.slots} Left`}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <aside className="w-full xl:w-[400px] bg-surface-dark border-l border-border-dark flex flex-col shadow-2xl">
          <div className="p-6 md:p-8 flex flex-col h-full">
            <div className="flex items-start justify-between mb-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-primary mb-1">Availability Detail</p>
                <h2 className="text-2xl font-bold text-white">Sat, 6 Oct 2024</h2>
              </div>
              <div className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                Open
              </div>
            </div>

            {/* Circular Progress */}
            <div className="flex flex-col items-center justify-center py-8 mb-8 relative">
              <div className="relative size-48">
                <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-900"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  />
                  <path
                    className="text-primary drop-shadow-[0_0_8px_rgba(0,123,255,0.5)]"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray="30, 100"
                    strokeLinecap="round"
                    strokeWidth="3"
                  />
                </svg>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                  <span className="block text-4xl font-black text-white">45</span>
                  <span className="block text-xs text-gray-400 font-medium uppercase tracking-wide">Slots Left</span>
                </div>
              </div>
              <p className="mt-4 text-center text-gray-400 text-sm">Out of 150 total capacity</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-slate-900 p-4 rounded-xl border border-border-dark">
                <div className="flex items-center gap-2 mb-2 text-gray-400">
                  <span className="material-symbols-outlined text-[20px]">group</span>
                  <span className="text-xs font-bold uppercase">Registered</span>
                </div>
                <p className="text-xl font-bold text-white">105</p>
              </div>
              <div className="bg-slate-900 p-4 rounded-xl border border-border-dark">
                <div className="flex items-center gap-2 mb-2 text-gray-400">
                  <span className="material-symbols-outlined text-[20px]">payments</span>
                  <span className="text-xs font-bold uppercase">Price</span>
                </div>
                <p className="text-xl font-bold text-white">
                  25K <span className="text-xs font-normal text-gray-500">IDR</span>
                </p>
              </div>
            </div>

            <div className="h-px w-full bg-border-dark mb-8"></div>

            {/* Info */}
            <div className="bg-[#15232d] border border-[#1e3a4d] rounded-lg p-4 mb-auto">
              <div className="flex gap-3">
                <span className="material-symbols-outlined text-blue-500 shrink-0">info</span>
                <p className="text-sm text-blue-100 leading-relaxed">
                  Please ensure you arrive at the basecamp 30 minutes before your scheduled hike time.
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8">
              <button
                onClick={handleBooking}
                className="group w-full flex items-center justify-center gap-3 bg-primary hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40"
              >
                <span>Proceed to Booking</span>
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>
              <p className="text-center mt-3 text-xs text-gray-500">By booking, you agree to our Terms & Rules</p>
            </div>
          </div>
        </aside>
      </main>
    </>
  );
}
