"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import useSWR from "swr";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import Link from "next/link";

import ImageUpload from "@/components/admin/ImageUpload";

const fetchGallery = async () => {
    const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data;
};

export default function GalleryManagementPage() {
    const { data: gallery, error, isLoading, mutate } = useSWR("admin/gallery", fetchGallery);
    const [isAdding, setIsAdding] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        image_url: "",
        caption: "",
        category: "general",
        is_featured: false
    });

    const handleAddPhoto = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.image_url) {
            toast.error("Silakan pilih dan unggah foto terlebih dahulu");
            return;
        }

        setIsSubmitting(true);
        try {
            const { error } = await supabase
                .from("gallery")
                .insert([formData]);

            if (error) throw error;
            toast.success("Foto berhasil ditambahkan ke galeri!");
            setIsAdding(false);
            setFormData({ image_url: "", caption: "", category: "general", is_featured: false });
            mutate();
        } catch (err: any) {
            toast.error("Gagal menambahkan foto: " + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Apakah Anda yakin ingin menghapus foto ini?")) return;
        
        setIsDeleting(id);
        try {
            const { error } = await supabase
                .from("gallery")
                .delete()
                .eq("id", id);
            
            if (error) throw error;
            toast.success("Foto berhasil dihapus");
            mutate();
        } catch (err: any) {
            toast.error("Gagal menghapus: " + err.message);
        } finally {
            setIsDeleting(null);
        }
    };

    const handleToggleFeatured = async (id: string, currentStatus: boolean) => {
        try {
            const { error } = await supabase
                .from("gallery")
                .update({ is_featured: !currentStatus })
                .eq("id", id);
            
            if (error) throw error;
            toast.success(!currentStatus ? "Ditandai sebagai unggulan" : "Batal jadi unggulan");
            mutate();
        } catch (err: any) {
            toast.error("Gagal memperbarui status: " + err.message);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-2xl font-black text-white">Content Management</h1>
                    <p className="text-gray-500 text-sm">Kelola berita, pengumuman, dan galeri pendakian</p>
                </div>
                
                <button 
                    onClick={() => setIsAdding(true)}
                    className="bg-primary hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
                >
                    <span className="material-symbols-outlined font-black">add_a_photo</span>
                    Tambah Foto Baru
                </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex bg-surface-dark p-1 rounded-2xl border border-border-dark w-fit">
                <Link href="/admin/content/news">
                    <button className="px-8 py-2.5 rounded-xl text-gray-500 hover:text-white font-bold text-sm transition-all">
                        Berita & Pengumuman
                    </button>
                </Link>
                <Link href="/admin/content/gallery">
                    <button className="px-8 py-2.5 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 transition-all">
                        Gallery Foto
                    </button>
                </Link>
            </div>

            {/* Gallery Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {[1,2,3,4,5,6].map(i => (
                        <div key={i} className="aspect-square bg-surface-dark border border-border-dark rounded-2xl animate-pulse" />
                    ))}
                </div>
            ) : !gallery || gallery.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-surface-dark border border-border-dark rounded-3xl text-center">
                    <span className="material-symbols-outlined text-gray-700 text-8xl mb-4">image_search</span>
                    <h3 className="text-xl font-bold text-white mb-2">Galeri Kosong</h3>
                    <p className="text-gray-500">Mulai unggah foto-foto keren pendakian untuk pendaki lainnya.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {gallery.map((item) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            key={item.id}
                            className="group relative aspect-square bg-surface-dark border border-border-dark rounded-2xl overflow-hidden shadow-xl"
                        >
                            <img 
                                src={item.image_url} 
                                alt={item.caption} 
                                className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
                            />
                            
                            {/* Overlay Controls */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                <p className="text-white font-bold text-sm line-clamp-1">{item.caption || "Tanpa Keterangan"}</p>
                                <p className="text-gray-400 text-[10px] uppercase font-black tracking-widest mb-3">{item.category}</p>
                                
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => handleToggleFeatured(item.id, item.is_featured)}
                                        className={`flex-1 p-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                                            item.is_featured ? 'bg-amber-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'
                                        }`}
                                    >
                                        <span className="material-symbols-outlined text-sm">
                                            {item.is_featured ? 'star' : 'star_border'}
                                        </span>
                                        {item.is_featured ? 'Featured' : 'Mark'}
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(item.id)}
                                        disabled={isDeleting === item.id}
                                        className="p-2 bg-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white rounded-lg transition-all"
                                    >
                                        {isDeleting === item.id ? (
                                            <span className="w-4 h-4 border-2 border-rose-500/30 border-t-rose-500 rounded-full animate-spin" />
                                        ) : (
                                            <span className="material-symbols-outlined text-sm">delete</span>
                                        )}
                                    </button>
                                </div>
                            </div>
                            
                            {item.is_featured && (
                                <div className="absolute top-2 right-2 bg-amber-500 text-white p-1 rounded-lg shadow-lg">
                                    <span className="material-symbols-outlined text-sm block">grade</span>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Add Photo Modal */}
            <AnimatePresence>
                {isAdding && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
                            onClick={() => setIsAdding(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 40 }}
                            className="relative w-full max-w-lg bg-surface-dark border border-border-dark rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="p-8 overflow-y-auto custom-scrollbar">
                                <h3 className="text-xl font-black text-white mb-6">Tambah Foto Galeri</h3>
                                
                                <form onSubmit={handleAddPhoto} className="space-y-6">
                                <ImageUpload 
                                    label="Upload Foto"
                                    folder="gallery"
                                    value={formData.image_url}
                                    onChange={(url) => setFormData({...formData, image_url: url})}
                                />

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Keterangan (Caption)</label>
                                    <input 
                                        type="text"
                                        placeholder="Tulis suasana foto ini..."
                                        value={formData.caption}
                                        onChange={(e) => setFormData({...formData, caption: e.target.value})}
                                        className="w-full bg-background-dark border border-border-dark rounded-xl px-4 py-3 text-white outline-none focus:border-primary transition-all"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Kategori</label>
                                        <select 
                                            value={formData.category}
                                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                                            className="w-full bg-background-dark border border-border-dark rounded-xl px-4 py-3 text-white outline-none focus:border-primary transition-all font-bold"
                                        >
                                            <option value="general">Umum</option>
                                            <option value="landscape">Pemandangan</option>
                                            <option value="activities">Aktivitas</option>
                                            <option value="facilities">Fasilitas</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col justify-end pb-3">
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <div 
                                                onClick={() => setFormData({...formData, is_featured: !formData.is_featured})}
                                                className={`w-12 h-6 rounded-full relative transition-colors ${formData.is_featured ? 'bg-amber-500' : 'bg-background-dark border border-border-dark'}`}
                                            >
                                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.is_featured ? 'left-7' : 'left-1'}`} />
                                            </div>
                                            <span className="text-xs font-bold text-gray-300 group-hover:text-white">Featured?</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsAdding(false)}
                                        className="flex-1 py-3 bg-white/5 text-white font-bold rounded-xl hover:bg-white/10 transition-all"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-[2] py-3 bg-primary text-white font-black rounded-xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <span className="material-symbols-outlined text-lg">cloud_upload</span>
                                                SIMPAN FOTO
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
                )}
            </AnimatePresence>
        </div>
    );
}
