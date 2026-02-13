"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const menuItems = [
	{ icon: "dashboard", label: "Dashboard", href: "/admin" },
	{
		icon: "calendar_month",
		label: "Manajemen Booking",
		href: "/admin/booking",
	},
	{ icon: "group", label: "User Management", href: "/admin/users" },
	{ icon: "event_available", label: "Kuota & Jadwal", href: "/admin/kuota" },
	{ icon: "payments", label: "Verifikasi Payment", href: "/admin/payments" },
	{ icon: "campaign", label: "Berita & Gallery", href: "/admin/content/news" },
	{ icon: "description", label: "Laporan", href: "/admin/reports" },
	{ icon: "settings", label: "Pengaturan", href: "/admin/settings" },
];

export default function AdminSidebar() {
	const pathname = usePathname();

	return (
		<aside className="fixed left-0 top-0 h-screen w-64 bg-surface-dark border-r border-border-dark z-50 flex flex-col">
			{/* Brand */}
			<div className="p-6 border-b border-border-dark flex items-center gap-3">
				<div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
					<span className="material-symbols-outlined text-white text-2xl">
						mountain_flag
					</span>
				</div>
				<div>
					<h2 className="text-white font-black text-lg leading-none">
						SUROLOYO
					</h2>
					<p className="text-primary text-[10px] font-bold tracking-widest uppercase mt-1">
						Admin Panel
					</p>
				</div>
			</div>

			{/* Menu */}
			<nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
				{menuItems.map((item) => {
					const isActive = pathname === item.href;
					return (
						<Link key={item.href} href={item.href}>
							<div
								className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative group ${
									isActive
										? "bg-primary text-white shadow-lg shadow-primary/20"
										: "text-gray-400 hover:bg-white/5 hover:text-white"
								}`}>
								<span
									className={`material-symbols-outlined text-xl ${isActive ? "" : "text-gray-500 group-hover:text-primary"}`}>
									{item.icon}
								</span>
								<span className="font-semibold text-sm">{item.label}</span>

								{isActive && (
									<motion.div
										layoutId="active-sidebar"
										className="absolute inset-0 bg-primary rounded-xl -z-10"
										transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
									/>
								)}
							</div>
						</Link>
					);
				})}
			</nav>

			{/* Footer Info */}
			<div className="p-4 border-t border-border-dark">
				<div className="bg-background-dark/50 rounded-xl p-4 border border-border-dark/30 text-center">
					<p className="text-[10px] text-gray-500 font-medium">
						Suroloyo Booking v1.0.0
					</p>
					<p className="text-[10px] text-gray-600 mt-1">
						© 2026 Developer Team
					</p>
				</div>
			</div>
		</aside>
	);
}
