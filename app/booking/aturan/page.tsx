"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";
import { useBooking } from "@/context/BookingContext";
import BookingProgressBar from "@/components/BookingProgressBar";

const rules = [
  { icon: "delete_forever", title: "Bawa Sampah Turun", desc: "Saya berjanji membawa semua sampah logistik turun kembali dan tidak meninggalkan jejak." },
  { icon: "block", title: "Dilarang Sajam & Miras", desc: "Dilarang keras membawa senjata tajam, senjata api, dan minuman keras (beralkohol)." },
  { icon: "local_fire_department", title: "Dilarang Membuat Api Unggun", desc: "Dilarang membuat api unggun di area konservasi hutan untuk mencegah kebakaran." },
  { icon: "hiking", title: "Patuhi Jalur Resmi", desc: "Wajib berjalan di jalur resmi pendakian dan tidak memotong jalan (short cut) yang merusak ekosistem." },
  { icon: "diversity_3", title: "Hormati Norma Setempat", desc: "Menjaga sopan santun dan menghormati adat istiadat warga desa Nyatnyono." },
];

export default function BookingAturanPage() {
  const router = useRouter();
  const { user } = useBooking();
  const [agreed, setAgreed] = useState(false);

  // Auth Gate
  useEffect(() => {
    if (!user) {
        router.push("/masuk?returnUrl=/booking/aturan");
    }
  }, [user, router]);

  const handleNext = () => {
      if (agreed) {
          router.push("/booking/jadwal");
      }
  };

  return (
    <>
      <Header />
      <main className="flex-grow flex flex-col items-center pt-24 pb-12 px-4">
        <div className="w-full max-w-3xl flex flex-col gap-8">
          
          <BookingProgressBar currentStep={1} />

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-2 mt-4"
          >
            <h1 className="text-white text-3xl md:text-4xl font-black tracking-tight">
              SOP & Peraturan Pendakian
            </h1>
            <p className="text-gray-400 text-sm md:text-base">
              Harap pahami dan patuhi aturan berikut demi keselamatan bersama dan kelestarian alam.
            </p>
          </motion.div>

          {/* Rules List (Refined UI) */}
          <motion.div 
            className="bg-surface-dark border border-border-dark rounded-2xl p-6 md:p-8 shadow-xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="space-y-6">
                {rules.map((rule, index) => (
                    <div key={index} className="flex gap-4 items-start">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                            <span className="material-symbols-outlined text-primary text-xl">{rule.icon}</span>
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-lg mb-1">{rule.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{rule.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="h-px bg-border-dark my-8" />

            {/* Agreement Checkbox */}
            <label className="flex gap-3 items-start cursor-pointer group p-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10">
                <div className="relative flex items-center mt-1">
                    <input 
                        type="checkbox" 
                        className="peer sr-only"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                    />
                    <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                        agreed ? "bg-primary border-primary" : "border-gray-500 group-hover:border-primary"
                    }`}>
                        <span className={`material-symbols-outlined text-white text-base ${agreed ? "opacity-100" : "opacity-0"}`}>check</span>
                    </div>
                </div>
                <div className="flex-1">
                    <span className={`font-bold block text-base ${agreed ? "text-white" : "text-gray-300"}`}>
                        Saya setuju dan sanggup mematuhi aturan
                    </span>
                    <span className="text-xs text-gray-500 block mt-1 leading-relaxed">
                        Dengan mencentang ini, saya menyatakan bahwa saya telah membaca, memahami, dan siap menerima sanksi jika melanggar SOP yang berlaku di Gunung Suroloyo.
                    </span>
                </div>
            </label>
          </motion.div>

          {/* Navigation */}
          <div className="flex justify-end">
             <button
              onClick={handleNext}
              disabled={!agreed}
              className={`flex items-center justify-center gap-2 rounded-full h-12 px-8 text-base font-bold transition-all shadow-lg ${
                agreed
                  ? "bg-primary hover:bg-blue-500 text-white shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1"
                  : "bg-gray-700 text-gray-500 cursor-not-allowed opacity-50"
              }`}
            >
              <span>Lanjutkan</span>
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>
          </div>

        </div>
      </main>
    </>
  );
}
