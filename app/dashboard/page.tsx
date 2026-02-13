"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Header from "@/components/Header";

const activities = [
  { date: "2024-01-15", dest: "Suroloyo - Nyatnyono", group: 4, status: "Selesai", statusColor: "bg-green-600" },
  { date: "2023-12-20", dest: "Suroloyo - Nyatnyono", group: 3, status: "Selesai", statusColor: "bg-green-600" },
  { date: "Scheduled", dest: "Suroloyo - via Kaliurang (Segera)", group: 5, status: "Menunggu", statusColor: "bg-yellow-600" },
];

export default function DashboardPage() {
  return (
    <>
      <Header />
      <main className="flex-grow pt-20">
        <div className="px-4 md:px-6 lg:px-10 py-8 flex flex-col gap-8">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
          >
            <div className="flex flex-col gap-1">
              <p className="text-gray-400 text-sm">Selamat datang kembali,</p>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Budi Santoso!</h1>
            </div>
            <Link
              href="/kuota"
              className="flex items-center justify-center gap-2 rounded-xl h-12 px-6 bg-primary hover:bg-blue-600 text-white font-bold shadow-lg shadow-primary/20 transition-all"
            >
              <span className="material-symbols-outlined">add</span>
              <span>New Booking</span>
            </Link>
          </motion.div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Member Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-4 bg-gradient-to-br from-slate-900 via-surface-dark to-slate-900 border border-border-dark rounded-2xl p-6 relative overflow-hidden shadow-2xl"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="flex justify-between items-start relative z-10 mb-6">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">landscape</span>
                  <span className="text-white font-bold text-sm tracking-wide">SUROLOYO</span>
                </div>
                <span className="text-primary text-xs font-bold uppercase tracking-widest border border-primary/50 rounded-full px-2 py-0.5 bg-primary/10">
                  Verified
                </span>
              </div>
              <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Digital Member Card</h3>
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-20 h-20 min-w-[80px] rounded-xl bg-cover bg-center border-2 border-primary shadow-lg"
                  style={{
                    backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAs6SlIlogxgEocilZEJY_nAGCYjxEDRWSitaDTSQqfODP5TE1Cenks6IMQbQHPddu3jDmABkgWrCOir_P1BCGaNS4VsLcWGXEtrsnBbktpN6DOvEyOalxZtRW31WQLMQ8A-fr85Rs1COfOjK9WuQqPlXfKpv_g3KQOUO0KJ1RU4Ucc6ndLgdUfLRMTwnQApEUf4VrIYkiO6x9uA2846ye6gGdMUH7WIDhj6_JZkYpGOGPFpH-3rENcqlZMjhzsCft8Xo9j43u1VLU')`,
                  }}
                />
                <div>
                  <p className="text-white text-xl font-bold">Budi Santoso</p>
                  <p className="text-primary font-mono text-sm font-medium">ID: CL-12345</p>
                  <p className="text-gray-400 text-xs mt-1">Member since 2023</p>
                </div>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-gray-500 text-xs uppercase font-bold tracking-wider">Quick Access</p>
                  <p className="text-gray-300 text-xs mt-1">Scan for verification</p>
                </div>
                <div className="w-20 h-20 bg-white rounded-lg p-1.5 shadow-lg">
                  <div
                    className="w-full h-full bg-contain bg-center bg-no-repeat"
                    style={{
                      backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBqR-32s-ZYXRLAJbQjFh5M8OGGNOeADXDGxqJvtGHxXtqgijg-G2zH8jlWK8oiSwUO4N4lG9WwGm-LvIjWfz_J-Dky_R2AwIaVOJvq1AW2jjHC6S0WtBqhEL5S1WJYiNjJWGFXiCcXaWKxLZBPqJBZ3f8AcQYwrS7yHcPd0F1LKkEnmOV9_A8RMf2p8k4TKT4RKVH3wA2j9Y4P8AHIW2Y6G3mRE9w2gJ7m7m4oJR8J8f_0B0')`,
                    }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-8 bg-surface-dark border border-border-dark rounded-2xl p-6"
            >
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">analytics</span>
                Performance Overview
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-900 rounded-xl p-4 border border-border-dark hover:border-primary/50 transition-colors">
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <span className="material-symbols-outlined text-lg">flag</span>
                    <span className="text-xs font-bold uppercase tracking-wide">Total Summits</span>
                  </div>
                  <p className="text-3xl font-black text-white">12</p>
                  <p className="text-xs text-green-400 mt-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">trending_up</span>
                    +3 this year
                  </p>
                </div>
                <div className="bg-slate-900 rounded-xl p-4 border border-border-dark hover:border-primary/50 transition-colors">
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <span className="material-symbols-outlined text-lg">altitude</span>
                    <span className="text-xs font-bold uppercase tracking-wide">Highest Elev.</span>
                  </div>
                  <p className="text-3xl font-black text-white">1,492m</p>
                  <p className="text-xs text-primary mt-1">Gunung Suroloyo</p>
                </div>
                <div className="bg-slate-900 rounded-xl p-4 border border-border-dark hover:border-primary/50 transition-colors">
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <span className="material-symbols-outlined text-lg">event_note</span>
                    <span className="text-xs font-bold uppercase tracking-wide">Active Bookings</span>
                  </div>
                  <p className="text-3xl font-black text-white">1</p>
                  <Link href="/tiket" className="text-xs text-primary mt-1 flex items-center gap-1 hover:underline">
                    <span>View Ticket</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-12 bg-surface-dark border border-border-dark rounded-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-border-dark flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">history</span>
                  Recent Activity
                </h3>
                <Link href="#" className="text-primary text-sm font-bold hover:underline">
                  View All History
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border-dark">
                  <thead className="bg-slate-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Destination</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Group Size</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-dark">
                    {activities.map((activity, index) => (
                      <tr key={index} className="hover:bg-slate-800/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{activity.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{activity.dest}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 hidden sm:table-cell">{activity.group} climbers</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-bold text-white ${activity.statusColor}`}>
                            {activity.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                          <button className="text-gray-400 hover:text-primary transition-colors p-2">
                            <span className="material-symbols-outlined">chevron_right</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </>
  );
}
