import { supabase } from "@/lib/supabase";
import useSWR from "swr";

const fetchBookingDetail = async (id: string) => {
    const { data, error } = await supabase
        .from("bookings")
        .select(`
            *,
            members:booking_members(*)
        `)
        .eq("id", id)
        .single();
    
    if (error) throw error;
    return data;
};

export default function BookingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, loading } = useBooking();
  const ticketRef = useRef<HTMLDivElement>(null);
  
  const bookingId = params?.id as string;
  const { data: selectedBooking, isLoading: isBookingLoading } = useSWR(
      bookingId ? ["booking", bookingId] : null,
      ([, id]) => fetchBookingDetail(id)
  );

  // Auth Gate
  useEffect(() => {
    if (!loading && !user) {
        router.push("/masuk?returnUrl=/riwayat");
    }
  }, [user, loading, router]);

  if (loading || (!user && !loading)) {
    return (
        <div className="min-h-screen bg-background-dark flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        </div>
    );
  }

  const handlePrint = () => {
    const printContent = ticketRef.current;
    if (printContent) {
        const originalContents = document.body.innerHTML;
        const printContents = printContent.innerHTML;
        
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload(); 
    }
  };
  
  const handleWhatsApp = () => {
      if (!selectedBooking) return;
      const leaderName = selectedBooking.members?.find((m: any) => m.is_leader)?.name || "Ketua Tim";
      const message = `Halo Admin Suroloyo Booking, saya ingin konfirmasi pembayaran untuk Booking ID: ${selectedBooking.id} atas nama ${leaderName}.`;
      const url = `https://wa.me/6281234567890?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
  };

  if (!user) return null;

  if (isBookingLoading) {
      return (
        <>
            <Header />
            <main className="flex-grow pt-24 pb-12 px-4 md:px-10 flex items-center justify-center min-h-[60vh]">
                <div className="w-full max-w-2xl h-80 bg-surface-dark border border-border-dark rounded-2xl animate-pulse" />
            </main>
        </>
      )
  }

  if (!selectedBooking) {
      return (
        <>
            <Header />
            <main className="flex-grow pt-24 pb-12 px-4 md:px-10 flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-white mb-2">Booking Tidak Ditemukan</h2>
                    <p className="text-gray-400 mb-6">ID Booking yang Anda cari tidak tersedia.</p>
                    <Link href="/riwayat" className="text-primary hover:underline font-bold">
                        Kembali ke Riwayat
                    </Link>
                </div>
            </main>
        </>
      )
  }

  return (
    <>
      <Header />
      <main className="flex-grow pt-24 pb-12 px-4 md:px-10">
        <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">
            
            {/* Nav Back */}
            <div className="flex items-center gap-2 mb-2">
                <Link href="/riwayat" className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                    <span className="material-symbols-outlined text-white">arrow_back</span>
                </Link>
                <div>
                     <h1 className="text-white text-2xl font-black">E-Ticket</h1>
                     <p className="text-gray-400 text-sm">Detail Pendakian</p>
                </div>
            </div>

            <div className="bg-surface-dark border border-border-dark rounded-2xl overflow-hidden flex flex-col">
                {/* Content */}
                <div ref={ticketRef} className="p-6 md:p-8 flex flex-col gap-8 bg-surface-dark text-white">
                     {/* QR Section */}
                    <div className="flex flex-col items-center justify-center py-6 bg-white rounded-xl mx-4 md:mx-0 shadow-xl overflow-hidden relative">
                        <div className="absolute top-0 w-full h-2 bg-gradient-to-r from-primary via-blue-400 to-primary" />
                        <h3 className="text-slate-900 font-black text-xl mb-4 tracking-tight">GUNUNG SUROLOYO</h3>
                        
                        <div className="bg-white p-2 rounded-lg border-2 border-slate-900">
                            <img 
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${selectedBooking.id}`}
                                alt="Booking QR Code"
                                className="w-40 h-40 object-contain"
                            />
                        </div>
                        <p className="mt-4 font-mono font-bold text-2xl text-slate-900 tracking-widest">
                            {selectedBooking.id}
                        </p>
                        <p className="text-xs text-slate-500 font-medium uppercase mt-1">Kode Booking</p>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-2 md:px-0">
                        <div>
                            <h4 className="text-gray-500 text-xs font-bold uppercase mb-3">Informasi Pendakian</h4>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary">calendar_month</span>
                                    <div>
                                        <p className="text-white font-bold">{selectedBooking.booking_date}</p>
                                        <p className="text-xs text-gray-400">Tanggal Naik</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary">person</span>
                                    <div>
                                        <p className="text-white font-bold">
                                            {selectedBooking.members?.find((m: any) => m.is_leader)?.name || "Ketua Tim"}
                                        </p>
                                        <p className="text-xs text-gray-400">Ketua Tim</p>
                                    </div>
                                </div>
                                    <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary">location_on</span>
                                    <div>
                                        <p className="text-white font-bold">Via Nyatnyono</p>
                                        <p className="text-xs text-gray-400">Jalur Pendakian</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-gray-500 text-xs font-bold uppercase mb-3">Anggota Tim ({selectedBooking.total_participants})</h4>
                            <div className="bg-background-dark/50 rounded-lg p-3">
                                {selectedBooking.members?.sort((a: any, b: any) => (b.is_leader ? 1 : -1) - (a.is_leader ? 1 : -1)).map((m: any, i: number) => (
                                    <div key={i} className={`flex items-center gap-2 mb-2 pb-2 last:mb-0 last:pb-0 ${i < selectedBooking.members.length - 1 ? 'border-b border-gray-700/50' : ''}`}>
                                        <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${m.is_leader ? 'bg-primary/20 text-primary' : 'bg-gray-700 text-gray-400'}`}>
                                            {m.is_leader ? 'L' : i + 1}
                                        </span>
                                        <span className={`text-sm truncate ${m.is_leader ? 'text-white font-bold' : 'text-gray-300'}`}>
                                            {m.name} {m.is_leader && '(Ketua)'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="p-4 sm:p-6 border-t border-border-dark bg-slate-900 flex flex-col sm:flex-row justify-end gap-3 sticky bottom-0">
                        <button 
                        onClick={handleWhatsApp}
                        className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-colors w-full sm:w-auto"
                        >
                        <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" className="w-5 h-5" alt="WA" />
                        Konfirmasi Admin
                        </button>
                        <button 
                        onClick={handlePrint}
                        className="px-4 py-3 bg-primary hover:bg-blue-600 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-colors w-full sm:w-auto"
                        >
                        <span className="material-symbols-outlined text-lg">download</span>
                        Download E-Ticket
                        </button>
                </div>
            </div>

        </div>
      </main>
    </>
  );
}
