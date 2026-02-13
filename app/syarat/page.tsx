"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

export default function SyaratPage() {
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
            <h1 className="text-4xl font-bold text-white mb-4">Syarat & Ketentuan</h1>
            <div className="prose prose-invert max-w-none text-gray-300">
              <p>
                Dengan menggunakan layanan Suroloyo Booking, Anda menyetujui syarat dan ketentuan berikut:
              </p>
              <h3>1. Pendaftaran</h3>
              <p>
                Setiap pendaki wajib mendaftar dengan data yang valid dan sesuai identitas asli (KTP/SIM/Paspor).
              </p>
              <h3>2. Pembayaran</h3>
              <p>
                Pembayaran tiket dilakukan secara online melalui metode yang tersedia. Tiket tidak dapat dikembalikan (non-refundable) kecuali jika jalur ditutup oleh pihak pengelola.
              </p>
              <h3>3. Aturan Pendakian</h3>
              <p>
                Pendaki wajib mematuhi segala peraturan yang berlaku di kawasan Gunung Suroloyo, termasuk menjaga kebersihan dan tidak merusak alam.
              </p>
              <h3>4. Sanksi</h3>
              <p>
                Pelanggaran terhadap aturan dapat dikenakan sanksi berupa denda atau larangan mendaki di masa mendatang.
              </p>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}
