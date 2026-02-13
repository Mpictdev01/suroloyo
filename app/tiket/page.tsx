"use client";

import { motion } from "framer-motion";
import Header from "@/components/Header";
import { useBooking } from "@/context/BookingContext";
import Link from "next/link";

export default function TiketPage() {
  const { leader, members, bookingDate, bookingId } = useBooking();
  const allMembers = leader ? [leader, ...members] : [];

  if (!leader || !bookingDate) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4 text-center">
         <p>Data tiket tidak ditemukan.</p>
         <Link href="/daftar" className="text-primary hover:underline">Register Baru</Link>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          #printable-ticket, #printable-ticket * { visibility: visible; }
          #printable-ticket {
            position: absolute;
            left: 0; top: 0;
            width: 100%;
            background-color: white !important;
            color: black !important;
            box-shadow: none !important;
            border: none !important;
          }
          .no-print { display: none !important; }
          .text-white { color: black !important; }
          .text-gray-400 { color: #555 !important; }
          .bg-surface-dark { background-color: white !important; }
        }
      `}</style>
      <Header />
      <main className="flex-grow pt-20 flex flex-col items-center justify-center p-4 md:p-6 lg:p-10">
        <div className="w-full max-w-2xl flex flex-col gap-6">
          {/* Status Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-900/50 border border-green-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              <span className="material-symbols-outlined text-green-400">check_circle</span>
              <span className="text-green-400 text-sm font-bold uppercase tracking-wide">Booking Terkonfirmasi</span>
            </div>
            <p className="text-gray-400 text-sm mt-3">Booking ID: {bookingId}</p>
          </motion.div>

          {/* Ticket */}
          <motion.div
            id="printable-ticket"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-surface-dark border border-border-dark rounded-2xl overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-primary to-blue-600 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-white">
                <span className="material-symbols-outlined text-3xl">landscape</span>
                <div>
                  <h2 className="text-xl font-bold tracking-tight">Suroloyo Booking</h2>
                  <p className="text-blue-200 text-sm">Official E-Ticket</p>
                </div>
              </div>
              <div className="flex gap-4 no-print">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                >
                  <span className="material-symbols-outlined text-lg">download</span>
                  Download PDF
                </button>
                <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium">
                  <span className="material-symbols-outlined text-lg">share</span>
                  Share
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col gap-6">
              {/* Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="col-span-2 md:col-span-1">
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Tanggal Pendakian</p>
                  <p className="text-lg font-bold text-white">{new Date(bookingDate).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Waktu Check-in</p>
                  <p className="text-lg font-bold text-white">06:00 WIB</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Jalur Pendakian</p>
                  <p className="text-lg font-bold text-primary">Via Nyatnyono</p>
                </div>
              </div>

              <div className="border-t border-dashed border-border-dark"></div>

              {/* Members */}
              <div>
                <h3 className="text-white font-bold text-base mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-lg">group</span>
                  Anggota Terdaftar ({allMembers.length} orang)
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {allMembers.map((member, index) => (
                    <div key={index} className="flex items-center gap-3 bg-slate-900 p-3 rounded-lg border border-border-dark">
                      <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-primary font-bold text-sm">{member.name.charAt(0)}</span>
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-white text-sm font-medium truncate">{member.name}</p>
                        <p className="text-gray-500 text-xs font-mono">{member.id}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-dashed border-border-dark"></div>

              {/* QR Code */}
              <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-slate-900 rounded-xl border border-border-dark">
                <div className="shrink-0 w-36 h-36 bg-white rounded-xl p-2 shadow-lg">
                  <div
                    className="w-full h-full bg-contain bg-center bg-no-repeat"
                    style={{
                      backgroundImage: `url('https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${bookingId}')`,
                    }}
                  />
                </div>
                <div className="flex flex-col gap-2 text-center md:text-left">
                  <h4 className="text-white font-bold text-lg">QR Code Check-in</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Scan kode QR ini di Basecamp Nyatnyono saat check-in. Pastikan semua anggota hadir saat proses verifikasi.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-yellow-500 mt-1 justify-center md:justify-start">
                    <span className="material-symbols-outlined text-sm">info</span>
                    <span>Valid hanya untuk tanggal yang tertera.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-border-dark bg-slate-900">
              <div className="flex flex-col gap-4">
                <h4 className="text-white font-bold text-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-lg">info</span>
                  Informasi Penting
                </h4>
                <ul className="text-gray-400 text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-[16px] mt-0.5 text-gray-600">check</span>
                    <span>Hadir di basecamp 30 menit sebelum waktu check-in.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-[16px] mt-0.5 text-gray-600">check</span>
                    <span>Bawa KTP/identitas asli dan tiket ini (digital maupun cetak).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-[16px] mt-0.5 text-gray-600">check</span>
                    <span>Pastikan kondisi fisik prima dan tidak sedang sakit.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-[16px] mt-0.5 text-gray-600">check</span>
                    <span>Patuhi semua peraturan pendakian yang telah disetujui.</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* WhatsApp Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="no-print w-full flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-green-600/20"
          >
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Kirim ke WhatsApp
          </motion.button>
        </div>
      </main>
    </>
  );
}
