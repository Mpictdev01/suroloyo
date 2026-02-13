"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useBooking } from "@/context/BookingContext";
import { useState } from "react";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function DaftarPage() {
  const router = useRouter();
  const { setLeader } = useBooking();
  const [formData, setFormData] = useState({
    fullname: "",
    nik: "",
    email: "",
    whatsapp: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLeader({
      name: formData.fullname,
      id: formData.nik,
      email: formData.email,
      phone: formData.whatsapp,
      avatar: "https://ui-avatars.com/api/?background=random&name=" + formData.fullname,
    });
    router.push("/booking/aturan");
  };

  return (
    <>
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center py-10 px-4 sm:px-6 lg:px-8 pt-24">
        <div className="w-full max-w-5xl">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="mb-8"
          >
            <div className="flex flex-col gap-2">
              <Link href="/kuota" className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                <span className="text-sm font-medium hover:underline">Back to Selection</span>
              </Link>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white mt-2">
                Registration & KYC
              </h2>
              <p className="text-gray-400 text-base md:text-lg">
                Finalize your booking for Suroloyo via Nyatnyono basecamp.
              </p>
            </div>
          </motion.div>

          <motion.form
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ delay: 0.1 }}
            className="w-full"
            onSubmit={handleSubmit}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Form Fields */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-200" htmlFor="fullname">
                    Full Name
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-gray-400 group-focus-within:text-primary">
                        person
                      </span>
                    </div>
                    <input
                      className="w-full pl-11 pr-4 py-3.5 bg-surface-dark border border-border-dark rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary text-white placeholder-gray-500 transition-all shadow-sm"
                      id="fullname"
                      name="fullname"
                      value={formData.fullname}
                      onChange={handleChange}
                      placeholder="Enter your full name as on ID"
                      required
                      type="text"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-200" htmlFor="nik">
                    Identity Number (NIK / Passport)
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-gray-400 group-focus-within:text-primary">
                        badge
                      </span>
                    </div>
                    <input
                      className="w-full pl-11 pr-4 py-3.5 bg-surface-dark border border-border-dark rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary text-white placeholder-gray-500 transition-all shadow-sm"
                      id="nik"
                      name="nik"
                      value={formData.nik}
                      onChange={handleChange}
                      placeholder="e.g. 3301234567890001"
                      required
                      type="text"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-200" htmlFor="email">
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-gray-400 group-focus-within:text-primary">
                        mail
                      </span>
                    </div>
                    <input
                      className="w-full pl-11 pr-4 py-3.5 bg-surface-dark border border-border-dark rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary text-white placeholder-gray-500 transition-all shadow-sm"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                      required
                      type="email"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-200" htmlFor="whatsapp">
                    WhatsApp Number
                  </label>
                  <div className="flex relative group">
                    <div className="flex items-center justify-center bg-background-dark border border-border-dark border-r-0 rounded-l-xl px-4 min-w-[80px]">
                      <span className="text-gray-300 font-medium flex items-center gap-1">
                        🇮🇩 +62
                      </span>
                    </div>
                    <input
                      className="w-full pl-4 pr-4 py-3.5 bg-surface-dark border border-border-dark rounded-r-xl focus:ring-2 focus:ring-primary/50 focus:border-primary text-white placeholder-gray-500 transition-all shadow-sm"
                      id="whatsapp"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      placeholder="812-3456-7890"
                      required
                      type="tel"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    We will send the booking confirmation to this number.
                  </p>
                </div>
              </div>

              {/* Upload Section */}
              <div className="lg:col-span-5">
                <div className="flex flex-col gap-2 h-full">
                  <label className="text-sm font-semibold text-gray-200">
                    Upload ID Card / Passport
                  </label>
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="flex-1 min-h-[320px] relative w-full rounded-2xl border-2 border-dashed border-border-dark bg-surface-dark/50 hover:bg-surface-dark hover:border-primary transition-all duration-300 group cursor-pointer flex flex-col items-center justify-center p-8 text-center"
                  >
                    <input
                      accept="image/png, image/jpeg, image/jpg"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      type="file"
                    />
                    <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <span className="material-symbols-outlined text-3xl text-primary">
                        cloud_upload
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">Drag & drop your ID</h3>
                    <p className="text-sm text-gray-400 mb-6">or click to browse from your device</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 bg-background-dark/50 py-2 px-4 rounded-full">
                      <span className="material-symbols-outlined text-base">image</span>
                      <span>JPG, PNG • Max 5MB</span>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Submit Section */}
              <div className="lg:col-span-12 mt-4 pt-6 border-t border-border-dark">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <label className="flex items-start gap-3 cursor-pointer group max-w-lg">
                    <input
                      className="mt-1 size-5 rounded text-primary bg-surface-dark border-border-dark focus:ring-primary transition-all"
                      type="checkbox"
                      required
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-white group-hover:text-primary transition-colors">
                        I certify that the data provided is true and accurate.
                      </span>
                      <span className="text-xs text-gray-400">
                        By registering, you agree to our terms and safety regulations for climbing Suroloyo.
                      </span>
                    </div>
                  </label>
                  <button
                    type="submit"
                    className="w-full md:w-auto min-w-[200px] h-14 bg-primary hover:bg-blue-600 focus:ring-4 focus:ring-primary/30 text-white font-bold text-lg rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                  >
                    <span>Daftar Sekarang</span>
                    <span className="material-symbols-outlined text-xl">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.form>
        </div>
      </main>
      <Footer />
    </>
  );
}
