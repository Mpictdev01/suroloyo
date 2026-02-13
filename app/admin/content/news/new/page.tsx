"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import ImageUpload from "@/components/admin/ImageUpload";

export default function NewNewsArticlePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        excerpt: "",
        featured_image: "",
        status: "draft"
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const generateSlug = (title: string) => {
        return title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const slug = generateSlug(formData.title);

        try {
            const { error } = await supabase
                .from("news_articles")
                .insert([{
                    ...formData,
                    slug,
                    published_at: formData.status === 'published' ? new Date().toISOString() : null
                }]);

            if (error) throw error;
            toast.success("Berita berhasil dibuat!");
            router.push("/admin/content/news");
        } catch (err: any) {
            toast.error("Gagal menyimpan: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => router.back()}
                    className="w-10 h-10 rounded-xl bg-surface-dark border border-border-dark flex items-center justify-center text-gray-400 hover:text-white"
                >
                    <span className="material-symbols-outlined text-xl">arrow_back</span>
                </button>
                <div>
                    <h1 className="text-2xl font-black text-white">Tulis Berita Baru</h1>
                    <p className="text-gray-500 text-sm">Buat pengumuman atau artikel terbaru untuk pendaki</p>
                </div>
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-surface-dark border border-border-dark rounded-3xl p-6 md:p-8 shadow-2xl"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Judul Artikel</label>
                        <input 
                            name="title"
                            required
                            type="text" 
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Contoh: Jalur Suroloyo Dibuka Kembali"
                            className="w-full bg-background-dark border border-border-dark rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-primary transition-all text-lg"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Ringkasan (Excerpt)</label>
                        <textarea 
                            name="excerpt"
                            rows={2}
                            value={formData.excerpt}
                            onChange={handleChange}
                            placeholder="Tuliskan pengantar singkat artikel ini..."
                            className="w-full bg-background-dark border border-border-dark rounded-xl px-4 py-3 text-white outline-none focus:border-primary transition-all resize-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Konten Utama</label>
                        <textarea 
                            name="content"
                            required
                            rows={12}
                            value={formData.content}
                            onChange={handleChange}
                            placeholder="Tuliskan isi artikel selengkapnya di sini..."
                            className="w-full bg-background-dark border border-border-dark rounded-xl px-4 py-3 text-white outline-none focus:border-primary transition-all font-serif leading-relaxed"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ImageUpload 
                            label="Foto Sampul (Featured Image)"
                            folder="news"
                            value={formData.featured_image}
                            onChange={(url) => setFormData({...formData, featured_image: url})}
                        />

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Status Publikasi</label>
                            <select 
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full bg-background-dark border border-border-dark rounded-xl px-4 py-3 text-white outline-none focus:border-primary transition-all font-bold"
                            >
                                <option value="draft">Simpan Sebagai Draft</option>
                                <option value="published">Terbitkan Sekarang</option>
                            </select>
                        </div>
                    </div>

                    <div className="h-px bg-border-dark my-4" />

                    <div className="flex justify-end gap-3">
                        <button 
                            type="button"
                            onClick={() => router.back()}
                            className="px-6 py-3 text-gray-400 font-bold hover:text-white transition-colors"
                        >
                            Batal
                        </button>
                        <button 
                            type="submit"
                            disabled={loading}
                            className="px-8 py-3 bg-primary text-white font-black rounded-xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
                        >
                            {loading ? (
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                "SIMPAN ARTIKEL"
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
