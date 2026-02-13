"use client";

import { use, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import ImageUpload from "@/components/admin/ImageUpload";

const fetchArticle = async (id: string) => {
    const { data, error } = await supabase
        .from("news_articles")
        .select("*")
        .eq("id", id)
        .single();
    if (error) throw error;
    return data;
};

export default function EditNewsArticlePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        excerpt: "",
        featured_image: "",
        status: "draft"
    });

    useEffect(() => {
        if (id) {
            fetchArticle(id).then(data => {
                setFormData({
                    title: data.title,
                    content: data.content,
                    excerpt: data.excerpt || "",
                    featured_image: data.featured_image || "",
                    status: data.status
                });
                setFetching(false);
            }).catch(err => {
                toast.error("Gagal memuat artikel: " + err.message);
                router.push("/admin/content/news");
            });
        }
    }, [id, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase
                .from("news_articles")
                .update({
                    ...formData,
                    updated_at: new Date().toISOString(),
                    published_at: formData.status === 'published' ? new Date().toISOString() : null
                })
                .eq("id", id);

            if (error) throw error;
            toast.success("Artikel berhasil diperbarui!");
            router.push("/admin/content/news");
        } catch (err: any) {
            toast.error("Gagal memperbarui: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return <div className="min-h-[400px] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>;
    }

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
                    <h1 className="text-2xl font-black text-white">Edit Artikel</h1>
                    <p className="text-gray-500 text-sm">Perbarui konten pengumuman atau berita Anda</p>
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
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
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
                                "PERBARUI ARTIKEL"
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
