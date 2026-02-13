"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Lightbox from "@/components/Lightbox";
import { useBooking } from "@/context/BookingContext";
import useSWR from "swr";
import { getHomepageData } from "@/app/actions";

const fetchHomepageData = async () => {
    // Connect to Server Action which uses Service Role (Bypassing RLS)
    const data = await getHomepageData();
    return data;
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const bookingSteps = [
    {
        icon: "app_registration",
        title: "1. Registrasi Akun",
        desc: "Buat akun dengan data diri yang valid. Pastikan email dan nomor WA aktif untuk verifikasi."
    },
    {
        icon: "calendar_month",
        title: "2. Pilih Jadwal",
        desc: "Cek kuota pendakian yang tersedia. Pilih tanggal naik dan turun yang diinginkan."
    },
    {
        icon: "payments",
        title: "3. Pembayaran",
        desc: "Lakukan pembayaran mudah melalui QRIS, E-Wallet, atau Transfer Bank."
    },
    {
        icon: "qr_code",
        title: "4. E-Ticket Terbit",
        desc: "Simpan E-Ticket (QR Code) untuk ditunjukkan di Basecamp saat registrasi ulang."
    }
];

export default function HomePage() {
  const router = useRouter();
  const { user } = useBooking();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState({ src: "", alt: "" });

  /* 
    Use SWR to fetch data on client side, but fetcher now calls Server Action 
    We wrapping it to match SWR expectation (promise returning data)
  */
  const { data, isLoading } = useSWR("homepage/data", fetchHomepageData);
  const gallery = data?.gallery || [];
  const news = data?.news || [];

  const handleBooking = () => {
    if (user) {
      router.push("/booking/aturan");
    } else {
      router.push("/masuk?returnUrl=/booking/aturan");
    }
  };

  const openLightbox = (src: string, alt: string) => {
      setSelectedImage({ src, alt });
      setLightboxOpen(true);
  };

  return (
    <>
      <Header />
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="relative flex flex-col items-center justify-center min-h-[600px] w-full p-4 lg:p-10">
          <div className="absolute inset-0 z-0 w-full h-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-black/30 to-background-dark z-10"></div>
            <div
              className="w-full h-full bg-cover bg-center bg-no-repeat transform scale-105"
              style={{
                backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDja-fxX1pYPfnyDL0kRDBy8ME9loQv_zjuGbc3YkEY4ubeEzj7uCj-yh2-lSQSzTUfKToJluawQavdXUolSj4WD8u0K5mAVnBW8Vc4uNfGQGDlvkk501rHAb8A30TZ2QERVP6KJqK3ff-B_ywOpdr7scx3M8sQ2In9pHIwmTbHE5jfNdXO4nQD2U_o2wAei_eWTNXc4Ng6wvM_iA6ZHhjahHUK9ux7MqYiqyrjzpKDEyBmFd4LmDSHZopkmMgO_q1N8fQWGCgLQJo")`,
              }}
            ></div>
          </div>
          <motion.div
            className="relative z-20 flex flex-col items-center text-center gap-6 max-w-4xl px-4"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 backdrop-blur-sm mb-2"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-xs font-medium text-blue-100 tracking-wide">
                Jalur Pendakian Resmi Dibuka
              </span>
            </motion.div>
            <motion.h1
              variants={fadeInUp}
              className="text-white text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight"
            >
              Jelajahi Suroloyo <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-primary">
                via Nyatnyono
              </span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-blue-100 text-lg md:text-xl font-medium leading-relaxed max-w-2xl"
            >
              Sistem registrasi pendakian resmi, aman, dan terintegrasi. Nikmati
              keindahan alam dengan persiapan yang matang.
            </motion.p>
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 mt-4"
            >
              <button
                onClick={handleBooking}
                className="flex items-center justify-center h-12 px-8 rounded-lg bg-primary text-white hover:bg-primary-dark hover:scale-105 transition-all duration-300 text-base font-bold shadow-[0_0_20px_rgba(0,123,255,0.4)]"
              >
                Booking Sekarang
              </button>
              <Link
                href="#panduan"
                className="flex items-center justify-center h-12 px-8 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white transition-all text-base font-bold"
              >
                Lihat Panduan
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* Booking Steps (Panduan) Section */}
        <section className="w-full px-4 md:px-10 py-20 relative z-30 bg-background-dark" id="panduan">
            <div className="max-w-7xl mx-auto">
                <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="flex flex-col gap-12"
                >
                    <motion.div variants={fadeInUp} className="text-center max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Panduan Booking</h2>
                        <p className="text-gray-400 text-lg">Ikuti 4 langkah mudah untuk memulai petualangan Anda di Gunung Suroloyo.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {bookingSteps.map((step, index) => (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                whileHover={{ y: -5 }}
                                className="bg-surface-dark border border-border-dark p-6 rounded-2xl flex flex-col gap-4 hover:border-primary/50 transition-colors shadow-lg"
                            >
                                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-2">
                                    <span className="material-symbols-outlined text-3xl">{step.icon}</span>
                                </div>
                                <h3 className="text-xl font-bold text-white leading-tight">{step.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>

        {/* Gallery Section */}
        <section className="w-full px-4 md:px-10 py-20 bg-background-dark" id="gallery">
            <div className="max-w-7xl mx-auto">
                 <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="flex flex-col gap-12"
                >
                    <motion.div variants={fadeInUp} className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-border-dark pb-8">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-black text-white mb-2">Galeri Keindahan</h2>
                            <p className="text-gray-400">Potret momen terbaik para pendaki di Gunung Suroloyo.</p>
                        </div>
                        <button className="text-primary font-bold hover:text-white transition-colors flex items-center gap-2">
                            Lihat Semua Foto <span className="material-symbols-outlined">arrow_forward</span>
                        </button>
                    </motion.div>

                    <div className="grid grid-cols-2 md:grid-cols-4 md:auto-rows-fr h-auto md:h-[600px] gap-4">
                        {isLoading ? (
                            [1,2,3,4].map(i => <div key={i} className="rounded-xl bg-surface-dark border border-border-dark animate-pulse h-[200px]" />)
                        ) : gallery.length === 0 ? (
                            <div className="col-span-full py-10 text-center text-gray-500 font-bold border border-dashed border-border-dark rounded-2xl">Belum ada foto galeri unggulan.</div>
                        ) : (
                            gallery.map((img: any, index: number) => (
                                <motion.div
                                    key={img.id}
                                    variants={fadeInUp}
                                    whileHover={{ scale: 1.02 }}
                                    layoutId={`gallery-${index}`}
                                    onClick={() => openLightbox(img.image_url, img.caption)}
                                    className={`group relative rounded-xl overflow-hidden cursor-pointer bg-slate-800 w-full h-full min-h-[200px] md:min-h-0 ${
                                        index === 0 || index === 3 ? "md:col-span-1 md:row-span-2" : "md:col-span-1 md:row-span-1"
                                    }`}
                                >
                                    <img 
                                        src={img.image_url} 
                                        alt={img.caption} 
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                        <p className="text-white font-bold text-lg">{img.caption}</p>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </motion.div>
            </div>
        </section>

        {/* Suroloyo News Section */}
        <section className="w-full px-4 md:px-10 py-20 bg-background-dark" id="news">
            <div className="max-w-7xl mx-auto">
                 <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="flex flex-col gap-12"
                >
                    <motion.div variants={fadeInUp} className="text-center">
                        <span className="text-primary font-bold tracking-wider text-sm uppercase mb-2 block">Blog & Artikel</span>
                        <h2 className="text-3xl md:text-4xl font-black text-white">Suroloyo News</h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {isLoading ? (
                            [1,2,3].map(i => <div key={i} className="h-96 rounded-2xl bg-surface-dark border border-border-dark animate-pulse" />)
                        ) : news.length === 0 ? (
                            <div className="col-span-full py-10 text-center text-gray-500">Belum ada berita terbaru.</div>
                        ) : (
                            news.map((article: any, index: number) => (
                                <Link href={`/news/${article.slug}`} key={article.id}>
                                    <motion.div
                                        variants={fadeInUp}
                                        whileHover={{ y: -8 }}
                                        className="bg-surface-dark rounded-2xl overflow-hidden border border-border-dark hover:border-primary/50 transition-all shadow-lg group h-full flex flex-col"
                                    >
                                        <div className="h-48 w-full overflow-hidden">
                                            <img 
                                                src={article.featured_image} 
                                                alt={article.title} 
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        </div>
                                        <div className="p-6 flex flex-col flex-1">
                                            <div className="text-xs text-primary font-bold mb-3 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-sm">calendar_today</span>
                                                {new Date(article.created_at).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
                                            </div>
                                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                                {article.title}
                                            </h3>
                                            <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 mb-4 flex-1">
                                                {article.excerpt}
                                            </p>
                                            <span className="text-white font-bold text-sm flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                                                Baca Selengkapnya
                                                <span className="material-symbols-outlined text-lg">arrow_forward</span>
                                            </span>
                                        </div>
                                    </motion.div>
                                </Link>
                            ))
                        )}
                    </div>
                </motion.div>
            </div>
        </section>

        {/* Location Section */}
        <section className="w-full px-4 md:px-10 py-20 bg-background-dark" id="lokasi">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <motion.div 
                         initial="hidden"
                         whileInView="visible"
                         viewport={{ once: true }}
                         variants={fadeInUp}
                         className="flex flex-col gap-6"
                    >
                        <h2 className="text-3xl md:text-4xl font-black text-white">Lokasi Basecamp</h2>
                        <p className="text-gray-300 text-lg leading-relaxed">
                            Basecamp Pendakian Gunung Suroloyo via Nyatnyono terletak di Desa Nyatnyono, Ungaran Barat, Semarang. Akses mudah dijangkau dengan kendaraan roda dua maupun roda empat.
                        </p>
                        
                        <div className="flex flex-col gap-4 mt-2">
                            <div className="flex items-start gap-4 p-4 bg-background-dark rounded-xl border border-white/5">
                                <span className="material-symbols-outlined text-primary text-2xl mt-1">location_on</span>
                                <div>
                                    <h4 className="text-white font-bold mb-1">Alamat</h4>
                                    <p className="text-gray-400 text-sm">Jl. Candi Gedong Songo, Nyatnyono, Kec. Ungaran Bar., Kabupaten Semarang, Jawa Tengah 50551</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 bg-background-dark rounded-xl border border-white/5">
                                <span className="material-symbols-outlined text-primary text-2xl mt-1">schedule</span>
                                <div>
                                    <h4 className="text-white font-bold mb-1">Jam Operasional</h4>
                                    <p className="text-gray-400 text-sm">Buka 24 Jam (Registrasi Pendakian 07:00 - 22:00 WIB)</p>
                                </div>
                            </div>
                        </div>

                        <a 
                            href="https://maps.google.com" 
                            target="_blank" 
                            className="inline-flex items-center justify-center h-12 px-8 rounded-lg bg-primary text-white hover:bg-primary-dark transition-all duration-300 text-base font-bold shadow-lg shadow-primary/20 w-fit mt-4"
                        >
                            Buka di Google Maps
                        </a>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                         whileInView={{ opacity: 1, scale: 1 }}
                         viewport={{ once: true }}
                         transition={{ duration: 0.5 }}
                        className="rounded-2xl overflow-hidden border border-border-dark shadow-2xl h-[400px] lg:h-[500px] relative group"
                    >
                         <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15830.569588663852!2d110.38043689626217!3d-7.281142998634599!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e70877a5dc0d7d9%3A0xe53a3eab4b12e3e9!2sBasecamp%20Suroloyo%20Via%20Nyatnyono!5e0!3m2!1sen!2sid!4v1698285918239!5m2!1sen!2sid"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen={true}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="grayscale group-hover:grayscale-0 transition-all duration-500"
                        ></iframe>
                    </motion.div>
                </div>
            </div>
        </section>

      </main>
      <Footer />
      
      <Lightbox 
        isOpen={lightboxOpen}
        imageSrc={selectedImage.src}
        altText={selectedImage.alt}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  );
}
