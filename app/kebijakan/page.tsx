"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

export default function KebijakanPage() {
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
            <h1 className="text-4xl font-bold text-white mb-4">Kebijakan Privasi</h1>
            <div className="prose prose-invert max-w-none text-gray-300">
              <p>
                Terakhir diperbarui: {new Date().toLocaleDateString("id-ID")}
              </p>
              <p>
                Selamat datang di Suroloyo Booking. Kami menghargai privasi Anda dan berkomitmen untuk melindungi data pribadi yang Anda bagikan kepada kami.
              </p>
              <h3>1. Informasi yang Kami Kumpulkan</h3>
              <p>
                Kami mengumpulkan informasi yang Anda berikan saat mendaftar, seperti nama, alamat email, dan nomor telepon, serta data pendakian untuk keperluan administrasi dan keselamatan.
              </p>
              <h3>2. Penggunaan Informasi</h3>
              <p>
                Informasi Anda digunakan untuk memproses booking, mengirimkan E-Ticket, dan menghubungi Anda jika terjadi perubahan jadwal atau kondisi darurat.
              </p>
              <h3>3. Keamanan Data</h3>
              <p>
                Kami menerapkan langkah-langkah keamanan teknis untuk melindungi data Anda dari akses yang tidak sah.
              </p>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}
