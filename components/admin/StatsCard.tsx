"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: {
    value: number;
    isUp: boolean;
  };
  color: "primary" | "success" | "warning" | "danger";
  loading?: boolean;
}

const colorMap = {
  primary: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  success: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  warning: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  danger: "bg-rose-500/10 text-rose-500 border-rose-500/20",
};

export default function StatsCard({ title, value, icon, trend, color, loading }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface-dark border border-border-dark p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${colorMap[color]}`}>
          <span className="material-symbols-outlined text-2xl">{icon}</span>
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-bold ${trend.isUp ? "text-emerald-500" : "text-rose-500"}`}>
            <span className="material-symbols-outlined text-sm">
              {trend.isUp ? "trending_up" : "trending_down"}
            </span>
            {trend.value}%
          </div>
        )}
      </div>

      <div>
        <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
        {loading ? (
          <div className="h-8 w-24 bg-white/5 animate-pulse rounded-lg" />
        ) : (
          <h3 className="text-2xl font-black text-white tracking-tight">{value}</h3>
        )}
      </div>
      
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 p-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
        <span className="material-symbols-outlined text-6xl">{icon}</span>
      </div>
    </motion.div>
  );
}
