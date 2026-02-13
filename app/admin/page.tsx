"use client";

import { useAdmin } from "@/context/AdminContext";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import StatsCard from "@/components/admin/StatsCard";
import useSWR from "swr";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts";

// Fetcher for SWR
const fetchDashboardStats = async () => {
  // 1. Total Bookings
  const { count: totalBookings } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true });

  // 2. Pending Verifications
  const { count: pendingVerifications } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");

  // 3. Total participants (from all verified/approved bookings)
  const { data: participantsData } = await supabase
    .from("bookings")
    .select("total_participants")
    .in("status", ["verified", "approved"]);
  
  const totalParticipants = participantsData?.reduce((acc, curr) => acc + curr.total_participants, 0) || 0;

  // 4. Total Revenue
  const { data: revenueData } = await supabase
    .from("bookings")
    .select("total_price")
    .eq("payment_status", "verified");
    
  const totalRevenue = revenueData?.reduce((acc, curr) => acc + curr.total_price, 0) || 0;

  // 5. Recent Bookings (for chart/list)
  const { data: recentBookings } = await supabase
    .from("bookings")
    .select("created_at, total_price, status")
    .order("created_at", { ascending: false })
    .limit(10);

  return {
    totalBookings: totalBookings || 0,
    pendingVerifications: pendingVerifications || 0,
    totalParticipants,
    totalRevenue,
    recentBookings: recentBookings || []
  };
};

export default function AdminDashboard() {
  const { user } = useAdmin();
  const { data, error, isLoading } = useSWR("admin/dashboard-stats", fetchDashboardStats, {
    refreshInterval: 30000, // Refresh every 30s
  });

  // Sample data for charts (in real app, this would come from DB grouped by date)
  const chartData = [
    { name: "Mon", bookings: 4 },
    { name: "Tue", bookings: 7 },
    { name: "Wed", bookings: 5 },
    { name: "Thu", bookings: 12 },
    { name: "Fri", bookings: 8 },
    { name: "Sat", bookings: 18 },
    { name: "Sun", bookings: 15 },
  ];

  const statusData = [
    { name: "Approved", value: 45, color: "#10b981" },
    { name: "Pending", value: 25, color: "#f59e0b" },
    { name: "Rejected", value: 10, color: "#ef4444" },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Booking"
          value={data?.totalBookings || 0}
          icon="event_note"
          color="primary"
          loading={isLoading}
          trend={{ value: 12, isUp: true }}
        />
        <StatsCard
          title="Pending Verifikasi"
          value={data?.pendingVerifications || 0}
          icon="pending_actions"
          color="warning"
          loading={isLoading}
        />
        <StatsCard
          title="Total Pendaki"
          value={data?.totalParticipants || 0}
          icon="groups"
          color="success"
          loading={isLoading}
          trend={{ value: 5, isUp: true }}
        />
        <StatsCard
          title="Total Revenue"
          value={`Rp ${(data?.totalRevenue || 0).toLocaleString()}`}
          icon="payments"
          color="danger"
          loading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-2 bg-surface-dark border border-border-dark rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-white font-bold text-lg">Tren Booking</h2>
              <p className="text-gray-500 text-sm">Aktivitas booking 7 hari terakhir</p>
            </div>
            <select className="bg-background-dark border border-border-dark text-gray-400 text-xs rounded-lg px-3 py-2 outline-none focus:border-primary transition-colors">
              <option>7 Hari Terakhir</option>
              <option>30 Hari Terakhir</option>
            </select>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2F3E" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1A1F2E', 
                    border: '1px solid #2A2F3E',
                    borderRadius: '12px',
                    color: '#fff'
                  }}
                  itemStyle={{ color: '#3b82f6' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="bookings" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorBookings)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Status Distribution */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-surface-dark border border-border-dark rounded-2xl p-6"
        >
          <div className="mb-8">
            <h2 className="text-white font-bold text-lg">Status Booking</h2>
            <p className="text-gray-500 text-sm">Distribusi status saat ini</p>
          </div>

          <div className="h-[250px] w-full mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2F3E" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: '#fff', fontSize: 12, fontWeight: 600 }}
                  width={80}
                />
                <Tooltip
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ 
                    backgroundColor: '#1A1F2E', 
                    border: '1px solid #2A2F3E',
                    borderRadius: '12px'
                  }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-4">
            {statusData.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-400">{item.name}</span>
                </div>
                <span className="text-white font-bold">{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
      
      {/* Recent Bookings Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-surface-dark border border-border-dark rounded-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-border-dark flex items-center justify-between">
          <div>
            <h2 className="text-white font-bold text-lg">Booking Terbaru</h2>
            <p className="text-gray-500 text-sm">Aktivitas pendaftaran pendaki terakhir</p>
          </div>
          <button 
            onClick={() => window.location.href = "/admin/booking"}
            className="px-4 py-2 bg-background-dark border border-border-dark rounded-xl text-primary text-sm font-bold hover:bg-primary/10 transition-all"
          >
            Lihat Semua
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-background-dark/50 text-gray-500 text-[10px] uppercase tracking-widest font-bold">
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Total Peserta</th>
                <th className="px-6 py-4">Waktu Daftar</th>
                <th className="px-6 py-4 text-right">Total Bayar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-dark/50">
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={4} className="px-6 py-4">
                      <div className="h-4 bg-white/5 animate-pulse rounded w-full" />
                    </td>
                  </tr>
                ))
              ) : data?.recentBookings.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500 italic text-sm">
                    Belum ada aktivitas booking.
                  </td>
                </tr>
              ) : (
                data?.recentBookings.map((booking: any, i: number) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        booking.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500' :
                        booking.status === 'pending' ? 'bg-amber-500/10 text-amber-500' :
                        'bg-gray-500/10 text-gray-500'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white text-sm font-semibold">{booking.total_participants} Orang</p>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-xs">
                      {new Date(booking.created_at).toLocaleString('id-ID', { 
                        dateStyle: 'medium', 
                        timeStyle: 'short' 
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="text-white font-bold text-sm">Rp {booking.total_price.toLocaleString()}</p>
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
