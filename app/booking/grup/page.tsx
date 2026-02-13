"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { useBooking, Member } from "@/context/BookingContext";
import BookingProgressBar from "@/components/BookingProgressBar";

export default function BookingGrupPage() {
  const router = useRouter();
  const { leader, members, addMember, removeMember, user } = useBooking();
  
  // State for new member form
  const [newMember, setNewMember] = useState<Partial<Member>>({
    name: "",
    id: "", // NIK
    phone: "",
    gender: "L",
    address: ""
  });

  // Auth Gate
  useEffect(() => {
    if (!user) {
        router.push("/masuk?returnUrl=/booking/grup");
    }
  }, [user, router]);

  const totalParticipants = (leader ? 1 : 0) + members.length;
  // Min 1 (Leader only), Max 10
  const isValidGroup = totalParticipants >= 1 && totalParticipants <= 10;
  const isLeaderComplete = leader && leader.id && leader.phone && leader.address && leader.dob && leader.ktpPhoto && leader.emergencyContact?.name && leader.emergencyContact?.phone;

  const handleAddMember = () => {
    if (!newMember.name || !newMember.id || !newMember.phone || !newMember.address) {
        alert("Mohon lengkapi semua data anggota.");
        return;
    }
    
    if (totalParticipants >= 10) {
        alert("Maksimal 10 orang dalam satu grup.");
        return;
    }

    addMember({
      name: newMember.name!,
      id: newMember.id!,
      phone: newMember.phone!,
      address: newMember.address!,
      gender: newMember.gender as "L" | "P",
      avatar: `https://ui-avatars.com/api/?background=random&name=${newMember.name}`,
    });

    // Reset form
    setNewMember({
        name: "",
        id: "",
        phone: "",
        gender: "L",
        address: ""
    });
  };

  const handleNext = () => {
    // Validation for leader data is relaxed to allow navigation
    // if (!isLeaderComplete) {
    //     alert("Data Ketua Grup belum lengkap. Silakan lengkapi profil terlebih dahulu.");
    //     return;
    // }
    if (!isValidGroup) {
      alert("Jumlah pendaki minimal 1 orang dan maksimal 10 orang.");
      return;
    }
    router.push("/booking/bayar");
  };

  if (!user) return null;

  return (
    <>
      <Header />
      <main className="flex-grow pt-24 pb-12 px-4 md:px-10">
        <div className="w-full max-w-7xl mx-auto flex flex-col gap-8">
            
            <div className="max-w-3xl mx-auto w-full">
               <BookingProgressBar currentStep={3} />
            </div>

            <div className="flex flex-col xl:flex-row gap-8">
                {/* Main Content */}
                <div className="flex-1 flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-white text-3xl font-black">Data Pendaki</h1>
                        <p className="text-gray-400">Pastikan data sesuai KTP/Identitas. Ketua grup wajib melengkapi data.</p>
                    </div>

                    {/* Leader Card */}
                    <div className="bg-surface-dark border border-border-dark rounded-xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <span className="material-symbols-outlined text-9xl">person</span>
                        </div>
                        
                        <div className="flex justify-between items-start relative z-10 mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    Ketua Grup
                                    <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">Anda</span>
                                </h3>
                                <p className="text-sm text-gray-400">Penanggung jawab rombongan.</p>
                            </div>
                            {!isLeaderComplete ? (
                                <Link 
                                    href="/profil?returnUrl=/booking/grup"
                                    className="px-4 py-2 bg-yellow-600/20 text-yellow-500 hover:bg-yellow-600/30 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors animate-pulse border border-yellow-500/30"
                                >
                                    <span className="material-symbols-outlined text-lg">edit</span>
                                    Lengkapi Profil
                                </Link>
                            ) : (
                                <Link 
                                    href="/profil?returnUrl=/booking/grup"
                                    className="text-gray-400 hover:text-white transition-colors"
                                    title="Edit Profil"
                                >
                                    <span className="material-symbols-outlined">edit</span>
                                </Link>
                            )}
                        </div>

                        {leader && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                                <div className="flex items-center gap-4 p-3 bg-background-dark/50 rounded-lg">
                                    <img src={leader.avatar} className="w-12 h-12 rounded-full border border-gray-600" />
                                    <div>
                                        <p className="font-bold text-white">{leader.name}</p>
                                        <p className="text-xs text-gray-400">{leader.email}</p>
                                    </div>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between border-b border-gray-700 pb-1">
                                        <span className="text-gray-500">NIK</span>
                                        <span className="text-white font-medium">{leader.id || "-"}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-700 pb-1">
                                        <span className="text-gray-500">No HP</span>
                                        <span className="text-white font-medium">{leader.phone || "-"}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-700 pb-1">
                                        <span className="text-gray-500">Alamat</span>
                                        <span className="text-white font-medium truncate max-w-[150px]">{leader.address || "-"}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Add Member Form */}
                    <div className="bg-surface-dark border border-border-dark rounded-xl p-6">
                         <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">group_add</span>
                            Tambah Anggota
                        </h3>
                        {/* Notice for Max Members */}
                        {totalParticipants >= 10 && (
                            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400 text-sm font-bold">
                                <span className="material-symbols-outlined">warning</span>
                                Kuota grup penuh (Maksimal 10 orang).
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <input 
                                type="text" 
                                placeholder="Nama Lengkap (Sesuai KTP)"
                                className="bg-background-dark border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary text-sm"
                                value={newMember.name}
                                disabled={totalParticipants >= 10}
                                onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                            />
                            <div className="flex gap-2">
                                <select 
                                    className="bg-background-dark border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary text-sm w-1/3"
                                    value={newMember.gender}
                                    disabled={totalParticipants >= 10}
                                    onChange={(e) => setNewMember({...newMember, gender: e.target.value as "L" | "P"})}
                                >
                                    <option value="L">Pria</option>
                                    <option value="P">Wanita</option>
                                </select>
                                <input 
                                    type="text" 
                                    placeholder="NIK / No. Identitas"
                                    className="bg-background-dark border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary text-sm flex-1"
                                    value={newMember.id}
                                    disabled={totalParticipants >= 10}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, '');
                                        setNewMember({...newMember, id: val});
                                    }}
                                />
                            </div>
                            <input 
                                type="text" 
                                placeholder="No. Telepon / HP"
                                className="bg-background-dark border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary text-sm"
                                value={newMember.phone}
                                disabled={totalParticipants >= 10}
                                onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, '');
                                        setNewMember({...newMember, phone: val});
                                    }}
                            />
                            <input 
                                type="text" 
                                placeholder="Alamat Domisili"
                                className="bg-background-dark border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary text-sm"
                                value={newMember.address}
                                disabled={totalParticipants >= 10}
                                onChange={(e) => setNewMember({...newMember, address: e.target.value})}
                            />
                        </div>
                        <button 
                            onClick={handleAddMember}
                            disabled={totalParticipants >= 10}
                            className="w-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/50 font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="material-symbols-outlined">add</span>
                            Tambahkan Anggota
                        </button>
                    </div>

                    {/* Member List */}
                     <div className="bg-surface-dark border border-border-dark rounded-xl overflow-hidden">
                        <div className="p-4 bg-background-dark border-b border-border-dark flex justify-between items-center">
                            <span className="text-gray-400 font-bold text-sm">Daftar Anggota ({members.length})</span>
                            <span className="text-xs text-gray-500">Geser kiri untuk hapus di mobile</span>
                        </div>
                        {members.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 flex flex-col items-center">
                                <span className="material-symbols-outlined text-4xl mb-2 opacity-30">groups</span>
                                <p>Belum ada anggota tambahan.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-800">
                                {members.map((m, i) => (
                                    <div key={i} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                                {m.gender === "L" ? "P" : "W"}
                                            </div>
                                            <div>
                                                <p className="font-bold text-white text-sm">{m.name}</p>
                                                <div className="flex gap-3 text-xs text-gray-500">
                                                    <span>NIK: {m.id}</span>
                                                    <span>HP: {m.phone}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => removeMember(i)}
                                            className="text-gray-500 hover:text-red-500 transition-colors"
                                        >
                                            <span className="material-symbols-outlined">delete</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Summary */}
                 <aside className="w-full xl:w-[350px] flex flex-col gap-6">
                    <div className="bg-surface-dark p-6 rounded-2xl border border-border-dark h-fit sticky top-24">
                        <h3 className="text-white font-bold text-lg mb-4">Ringkasan Grup</h3>
                        
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-full bg-slate-950 rounded-full h-2">
                                <div 
                                    className={`h-full rounded-full transition-all duration-500 ${isValidGroup ? "bg-green-500" : "bg-yellow-500"}`}
                                    style={{ width: `${(totalParticipants/10)*100}%` }}
                                />
                            </div>
                            <span className="text-xs font-bold text-white whitespace-nowrap">{totalParticipants}/10 Org</span>
                        </div>

                         <div className="space-y-3 mb-6">
                            <div className="flex items-start gap-3">
                                <span className={`material-symbols-outlined text-[20px] ${isLeaderComplete ? "text-green-500" : "text-yellow-500"}`}>
                                    {isLeaderComplete ? "check_circle" : "warning"}
                                </span>
                                <p className="text-sm text-gray-300">Data Ketua {isLeaderComplete ? "Lengkap" : "Belum Lengkap"}</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className={`material-symbols-outlined text-[20px] ${totalParticipants >= 1 ? "text-green-500" : "text-red-500"}`}>
                                    {totalParticipants >= 1 ? "check_circle" : "error"}
                                </span>
                                <p className="text-sm text-gray-300">Min. 1 Pendaki ({totalParticipants}/10)</p>
                            </div>
                        </div>

                        <button
                            onClick={handleNext}
                            className={`w-full h-12 font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 ${
                                isValidGroup 
                                ? "bg-primary hover:bg-blue-500 text-white shadow-primary/25" 
                                : "bg-gray-700 text-gray-500 cursor-not-allowed"
                            }`}
                        >
                            <span>Lanjut Pembayaran</span>
                            <span className="material-symbols-outlined">arrow_forward</span>
                        </button>
                    </div>
                 </aside>
            </div>
        </div>
      </main>
    </>
  );
}
