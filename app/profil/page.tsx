"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import { useBooking, Member } from "@/context/BookingContext";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function ProfilContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl");
  const { user, leader, setLeader } = useBooking();
  // ... rest of state
  const [loading, setLoading] = useState(false);
  
  // File Input Ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Member>>({
    name: "",
    id: "", // NIK
    phone: "",
    gender: "L",
    address: "",
    dob: "",
    ktpPhoto: "",
    emergencyContact: {
        name: "",
        phone: "",
        relation: ""
    }
  });

  useEffect(() => {
    if (!user) {
        router.push("/masuk?returnUrl=/profil");
        return;
    }
    
    // Load initial data from leader context or user
    if (leader) {
        setFormData({
            name: leader.name,
            id: leader.id,
            phone: leader.phone || "",
            gender: leader.gender || "L",
            address: leader.address || "",
            dob: leader.dob || "",
            ktpPhoto: leader.ktpPhoto || "",
            emergencyContact: leader.emergencyContact || { name: "", phone: "", relation: "" }
        });
    } else {
        setFormData({
            name: user.name,
            id: user.nik || "",
            phone: user.phone || "",
            gender: user.gender || "L",
            address: user.address || "",
            dob: "",
            ktpPhoto: "",
            emergencyContact: { name: "", phone: "", relation: "" }
        });
    }
  }, [user, leader, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("ec_")) {
        const ecField = name.replace("ec_", "");
        setFormData(prev => ({
            ...prev,
            emergencyContact: {
                ...prev.emergencyContact!,
                [ecField]: value
            }
        }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setFormData(prev => ({ ...prev, ktpPhoto: reader.result as string }));
          };
          reader.readAsDataURL(file);
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Granular Validation
    const missingFields = [];
    if (!formData.name) missingFields.push("Nama Lengkap");
    if (!formData.id) missingFields.push("NIK");
    if (!formData.phone) missingFields.push("Nomor HP");
    if (!formData.address) missingFields.push("Alamat");
    if (!formData.dob) missingFields.push("Tanggal Lahir");
    if (!formData.ktpPhoto) missingFields.push("Foto KTP");

    if (missingFields.length > 0) {
        alert(`Mohon lengkapi data berikut: ${missingFields.join(", ")}`);
        setLoading(false);
        return;
    }

    if (!formData.emergencyContact?.name || !formData.emergencyContact?.phone) {
        alert("Mohon lengkapi kontak darurat.");
        setLoading(false);
        return;
    }

    // Update Leader Context
    if (user) {
        const updatedLeader: Member = {
            ...leader!, // Preserves existing fields if any
            name: formData.name!,
            id: formData.id!, // NIK
            phone: formData.phone!,
            gender: formData.gender as "L" | "P",
            address: formData.address!,
            email: user.email,
            avatar: user.avatar,
            dob: formData.dob,
            ktpPhoto: formData.ktpPhoto,
            emergencyContact: formData.emergencyContact
        };
        
        setLeader(updatedLeader);
        
        setTimeout(() => {
            setLoading(false);
            if (returnUrl) {
                router.push(returnUrl);
            } else {
                alert("Profil berhasil disimpan!");
            }
        }, 800);
    }
  };

  if (!user) return null;

  return (
    <>
      <Header />
      <main className="flex-grow pt-24 pb-12 px-4 md:px-10">
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-white text-3xl font-black">Lengkapi Biodata</h1>
                <p className="text-gray-400">Data ini wajib dilengkapi untuk verifikasi pendakian.</p>
            </div>

            {/* Warning Alert */}
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-4 flex gap-4 items-start">
                <span className="material-symbols-outlined text-yellow-500 text-2xl shrink-0">warning</span>
                <div>
                    <h3 className="text-yellow-500 font-bold mb-1">PENTING: Verifikasi KTP</h3>
                    <p className="text-sm text-yellow-100/80 leading-relaxed">
                        Foto KTP wajib diupload dengan jelas, tidak blur, tulisan terbaca, dan tidak terpotong. 
                        Jika foto KTP tidak sesuai ketentuan, <strong className="text-yellow-400">booking Anda tidak akan dikonfirmasi</strong> oleh admin dan tiket tidak akan terbit.
                    </p>
                </div>
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-surface-dark border border-border-dark rounded-2xl p-6 md:p-8 shadow-xl"
            >
                <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                    
                    {/* Section: Data Diri */}
                    <div className="flex flex-col gap-6">
                        <h3 className="text-white font-bold text-xl border-b border-gray-800 pb-2">Data Pribadi</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-gray-300">Nama Sesuai KTP <span className="text-red-500">*</span></label>
                                <input 
                                    type="text" 
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-background-dark border border-border-dark rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-gray-300">NIK (Nomor Induk Kependudukan) <span className="text-red-500">*</span></label>
                                <input 
                                    type="text" 
                                    name="id" 
                                    value={formData.id}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, '');
                                        if(val.length <= 16) handleChange({ ...e, target: { ...e.target, value: val, name: 'id' } });
                                    }}
                                    className="w-full bg-background-dark border border-border-dark rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors font-mono"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-gray-300">Tanggal Lahir <span className="text-red-500">*</span></label>
                                <input 
                                    type="date" 
                                    name="dob"
                                    value={formData.dob}
                                    onChange={handleChange}
                                    className="w-full bg-background-dark border border-border-dark rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors appearance-none"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-gray-300">Jenis Kelamin <span className="text-red-500">*</span></label>
                                <div className="flex gap-4 pt-1">
                                    <label className="flex items-center gap-2 cursor-pointer bg-background-dark px-4 py-3 rounded-xl border border-border-dark flex-1 hover:border-gray-500 transition-colors">
                                        <input type="radio" name="gender" value="L" checked={formData.gender === "L"} onChange={handleChange} className="w-4 h-4 text-primary" />
                                        <span className="text-white">Laki-laki</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer bg-background-dark px-4 py-3 rounded-xl border border-border-dark flex-1 hover:border-gray-500 transition-colors">
                                        <input type="radio" name="gender" value="P" checked={formData.gender === "P"} onChange={handleChange} className="w-4 h-4 text-primary" />
                                        <span className="text-white">Perempuan</span>
                                    </label>
                                </div>
                            </div>
                            
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-gray-300">Nomor WhatsApp / HP <span className="text-red-500">*</span></label>
                                <input 
                                    type="tel" 
                                    name="phone"
                                    value={formData.phone}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, '');
                                        handleChange({ ...e, target: { ...e.target, value: val, name: 'phone' } });
                                    }}
                                    className="w-full bg-background-dark border border-border-dark rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors font-mono"
                                />
                            </div>

                             <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-gray-300">Alamat Lengkap (Sesuai KTP) <span className="text-red-500">*</span></label>
                                <textarea 
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    rows={1}
                                    className="w-full bg-background-dark border border-border-dark rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors resize-none h-[50px]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section: Kontak Darurat */}
                    <div className="flex flex-col gap-6">
                        <h3 className="text-white font-bold text-xl border-b border-gray-800 pb-2">Kontak Darurat</h3>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-gray-300">Nama Kontak <span className="text-red-500">*</span></label>
                                <input 
                                    type="text" 
                                    name="ec_name"
                                    value={formData.emergencyContact?.name}
                                    onChange={handleChange}
                                    placeholder="Kerabat / Orang Tua"
                                    className="w-full bg-background-dark border border-border-dark rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                />
                            </div>
                             <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-gray-300">Nomor HP <span className="text-red-500">*</span></label>
                                <input 
                                    type="tel" 
                                    name="ec_phone"
                                    value={formData.emergencyContact?.phone}
                                    onChange={(e) => {
                                         const val = e.target.value.replace(/\D/g, '');
                                         handleChange({ ...e, target: { ...e.target, value: val, name: 'ec_phone' } });
                                    }}
                                    className="w-full bg-background-dark border border-border-dark rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors font-mono"
                                />
                            </div>
                             <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-gray-300">Hubungan <span className="text-red-500">*</span></label>
                                <select 
                                    name="ec_relation"
                                    value={formData.emergencyContact?.relation}
                                    onChange={handleChange}
                                    className="w-full bg-background-dark border border-border-dark rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                >
                                    <option value="">Pilih Hubungan</option>
                                    <option value="Orang Tua">Orang Tua</option>
                                    <option value="Suami/Istri">Suami/Istri</option>
                                    <option value="Saudara">Saudara Kandung</option>
                                    <option value="Teman">Teman</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Section: Upload KTP */}
                    <div className="flex flex-col gap-6">
                        <h3 className="text-white font-bold text-xl border-b border-gray-800 pb-2">Upload Identitas (KTP/SIM/Paspor)</h3>
                        
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            <div className="w-full md:w-1/2">
                                <input 
                                    type="file" 
                                    ref={fileInputRef}
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                <div 
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`w-full h-48 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all ${
                                        formData.ktpPhoto ? "border-primary bg-primary/10" : "border-gray-700 bg-background-dark hover:border-gray-500"
                                    }`}
                                >
                                    {formData.ktpPhoto ? (
                                        <img src={formData.ktpPhoto} alt="Preview KTP" className="h-full w-full object-contain rounded-xl" />
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined text-4xl text-gray-500 mb-2">add_a_photo</span>
                                            <span className="text-gray-400 font-bold text-sm">Upload Foto KTP</span>
                                            <span className="text-gray-600 text-xs mt-1">Maks. 2MB. Format JPG/PNG</span>
                                        </>
                                    )}
                                </div>
                                {formData.ktpPhoto && (
                                     <button 
                                        type="button"
                                        onClick={() => setFormData(prev => ({...prev, ktpPhoto: ""}))}
                                        className="text-red-400 text-xs font-bold mt-2 hover:underline flex items-center gap-1"
                                     >
                                        <span className="material-symbols-outlined text-sm">delete</span> Hapus Foto
                                     </button>
                                )}
                            </div>
                            <div className="w-full md:w-1/2 space-y-3">
                                <p className="text-sm font-bold text-white mb-2">Pastikan foto KTP Anda:</p>
                                <ul className="text-sm text-gray-400 space-y-2 list-disc pl-5">
                                    <li>Data KTP terlihat <strong>jelas dan tajam</strong>.</li>
                                    <li>Tidak blur, gelap, atau terkena pantulan cahaya (glare).</li>
                                    <li>Seluruh bagian KTP terlihat, <strong>tidak terpotong</strong> frame foto.</li>
                                    <li>NIK dan Nama terbaca dengan baik.</li>
                                </ul>
                                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-300 font-bold mt-4">
                                    Admin berhak menolak booking apabila foto identitas tidak valid / mencurigakan.
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-border-dark my-4" />

                    <div className="flex items-center justify-end gap-4">
                        <button 
                            type="button" 
                            onClick={() => router.back()}
                            className="px-6 py-3 rounded-xl text-gray-400 font-bold hover:text-white hover:bg-white/5 transition-colors"
                        >
                            Batal
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="px-8 py-3 bg-primary hover:bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                            Simpan Biodata
                        </button>
                    </div>

                </form>
            </motion.div>
        </div>
      </main>
    </>
  );
}

export default function ProfilPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0B1121] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    }>
      <ProfilContent />
    </Suspense>
  );
}
