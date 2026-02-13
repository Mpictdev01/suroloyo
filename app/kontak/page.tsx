"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

export default function KontakPage() {
  return (
    <>
      <Header />
      <main className="flex-grow pt-24 pb-12 px-4 md:px-10">
        <section className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-6"
          >
            <h1 className="text-4xl font-bold text-white mb-4">Kontak Kami</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-surface-dark border border-border-dark p-6 rounded-xl">
                <h3 className="text-xl font-bold text-white mb-4">Basecamp Nyatnyono</h3>
                <p className="text-gray-300 mb-2">
                  Jl. Pendakian Suroloyo No. 1<br />
                  Nyatnyono, Jawa Tengah<br />
                  Indonesia
                </p>
                <div className="flex gap-2 items-center text-primary mt-4">
                  <span className="material-symbols-outlined">call</span>
                  <span>+62 812-3456-7890</span>
                </div>
                <div className="flex gap-2 items-center text-primary mt-2">
                  <span className="material-symbols-outlined">email</span>
                  <span>info@suroloyobooking.com</span>
                </div>
              </div>
              
              <div className="bg-surface-dark border border-border-dark p-6 rounded-xl">
                <h3 className="text-xl font-bold text-white mb-4">Jam Operasional</h3>
                <ul className="text-gray-300 space-y-2">
                  <li className="flex justify-between">
                    <span>Senin - Jumat:</span>
                    <span>08:00 - 16:00 WIB</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Sabtu - Minggu:</span>
                    <span>24 Jam</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}
