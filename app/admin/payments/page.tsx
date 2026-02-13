"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import useSWR from "swr";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

const fetchPendingPayments = async () => {
  const { data, error } = await supabase
    .from("bookings")
    .select(`
      id,
      booking_date,
      total_price,
      payment_proof_url,
      payment_status,
      status,
      created_at,
      user_id,
      users (name, email)
    `)
    .eq("payment_status", "pending")
    .not("payment_proof_url", "is", null)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
};

export default function PaymentVerificationPage() {
  const { data: payments, error, isLoading, mutate } = useSWR(
    "admin/payments/pending",
    fetchPendingPayments
  );
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const handleVerify = async (bookingId: string, action: "approve" | "reject", reason?: string) => {
    setIsProcessing(bookingId);
    try {
      const updates = action === "approve" 
        ? { 
            payment_status: "verified", 
            status: "verified", 
            payment_verified_at: new Date().toISOString() 
          }
        : { 
            payment_status: "failed", 
            rejection_reason: reason 
          };

      const { error } = await supabase
        .from("bookings")
        .update(updates)
        .eq("id", bookingId);

      if (error) throw error;

      toast.success(action === "approve" ? "Pembayaran berhasil diverifikasi!" : "Pembayaran ditolak.");
      mutate();
    } catch (err: any) {
      toast.error("Gagal memproses verifikasi: " + err.message);
    } finally {
      setIsProcessing(null);
    }
  };

  return (
		<div className="space-y-6">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
				<div>
					<h1 className="text-2xl font-black text-white">
						Verifikasi Pembayaran
					</h1>
					<p className="text-gray-500 text-sm">
						Review bukti transfer dan konfirmasi pembayaran booking
					</p>
				</div>

				<div className="bg-amber-500/10 border border-amber-500/20 px-6 py-3 rounded-2xl flex items-center gap-3 shadow-lg shadow-amber-500/5">
					<div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
						<span className="material-symbols-outlined font-black">
							pending_actions
						</span>
					</div>
					<div>
						<p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">
							Menunggu Verifikasi
						</p>
						<p className="text-white text-xl font-black leading-none mt-0.5">
							{payments?.length || 0}
						</p>
					</div>
				</div>
			</div>

			{isLoading ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{[1, 2, 3].map((i) => (
						<div
							key={i}
							className="bg-surface-dark border border-border-dark rounded-2xl h-80 animate-pulse"
						/>
					))}
				</div>
			) : !payments || payments.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-20 bg-surface-dark border border-border-dark rounded-3xl text-center">
					<span className="material-symbols-outlined text-gray-700 text-8xl mb-4">
						check_circle
					</span>
					<h3 className="text-xl font-bold text-white mb-2">Semua Beres!</h3>
					<p className="text-gray-500">
						Tidak ada pembayaran yang butuh verifikasi saat ini.
					</p>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
					{payments.map((p) => {
						const user = Array.isArray(p.users) ? p.users[0] : p.users;
						return (
							<motion.div
								layout
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								key={p.id}
								className="bg-surface-dark border border-border-dark rounded-2xl overflow-hidden flex flex-col group shadow-xl hover:border-primary/30 transition-all">
								<div className="relative aspect-video bg-background-dark flex items-center justify-center overflow-hidden">
									<img
										src={p.payment_proof_url}
										alt="Bukti Transfer"
										className="w-full h-full object-cover cursor-zoom-in transition-transform group-hover:scale-105"
										onClick={() => setSelectedImage(p.payment_proof_url)}
									/>
									<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity pointer-events-none">
										<span className="material-symbols-outlined text-white text-4xl">
											zoom_in
										</span>
									</div>
									<div className="absolute top-4 left-4">
										<span className="bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
											Rp {p.total_price.toLocaleString()}
										</span>
									</div>
								</div>

								<div className="p-6 flex-1 flex flex-col gap-4">
									<div className="flex justify-between items-start">
										<div>
											<h3 className="text-white font-bold text-lg">
												{user?.name || "Unknown User"}
											</h3>
											<p className="text-gray-500 text-xs">
												{user?.email || "-"}
											</p>
										</div>
										<div className="text-right">
											<p className="text-primary font-mono font-bold text-sm">
												#{p.id}
											</p>
											<p className="text-[10px] text-gray-500 mt-1 uppercase font-bold">
												{new Date(p.created_at).toLocaleDateString()}
											</p>
										</div>
									</div>

									<div className="bg-background-dark/50 rounded-xl p-3 border border-border-dark/50 flex items-center justify-between text-xs">
										<div className="flex flex-col">
											<span className="text-gray-500 font-bold uppercase tracking-wider text-[9px]">
												Tgl Mendaki
											</span>
											<span className="text-gray-300 font-bold mt-0.5">
												{new Date(p.booking_date).toLocaleDateString("id-ID", {
													dateStyle: "medium",
												})}
											</span>
										</div>
										<div className="flex flex-col text-right">
											<span className="text-gray-500 font-bold uppercase tracking-wider text-[9px]">
												Waktu Bayar
											</span>
											<span className="text-gray-300 font-bold mt-0.5">
												{new Date(p.created_at).toLocaleTimeString("id-ID", {
													hour: "2-digit",
													minute: "2-digit",
												})}{" "}
												WIB
											</span>
										</div>
									</div>

									<div className="mt-auto pt-4 flex gap-2">
										<button
											disabled={isProcessing === p.id}
											onClick={() => handleVerify(p.id, "reject")}
											className="flex-1 px-4 py-3 bg-rose-500/10 text-rose-500 font-bold rounded-xl border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all text-xs uppercase tracking-wider disabled:opacity-50">
											Tolak
										</button>
										<button
											disabled={isProcessing === p.id}
											onClick={() => handleVerify(p.id, "approve")}
											className="flex-[2] px-4 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-blue-600 transition-all text-xs uppercase tracking-wider disabled:opacity-50 flex items-center justify-center gap-2">
											{isProcessing === p.id ? (
												<span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
											) : (
												<>
													<span className="material-symbols-outlined text-sm">
														check_circle
													</span>
													Verifikasi
												</>
											)}
										</button>
									</div>
								</div>
							</motion.div>
						);
					})}
				</div>
			)}

			<AnimatePresence>
				{selectedImage && (
					<div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="absolute inset-0 bg-black/95"
							onClick={() => setSelectedImage(null)}
						/>

						<motion.div
							initial={{ scale: 0.9, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.9, opacity: 0 }}
							className="relative max-w-5xl w-full h-[90vh] flex items-center justify-center">
							<img
								src={selectedImage}
								alt="Full View"
								className="w-full h-full object-contain pointer-events-none"
							/>
							<button
								onClick={() => setSelectedImage(null)}
								className="absolute -top-12 right-0 text-white hover:text-primary transition-colors flex items-center gap-2 font-bold">
								TUTUP <span className="material-symbols-outlined">close</span>
							</button>
						</motion.div>
					</div>
				)}
			</AnimatePresence>
		</div>
	);
}
