"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import useSWR from "swr";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { toast } from "react-hot-toast";

const fetchNews = async () => {
    const { data, error } = await supabase
        .from("news_articles")
        .select("*")
        .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data;
};

export default function NewsManagementPage() {
    const { data: news, error, isLoading, mutate } = useSWR("admin/news", fetchNews);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        if (!confirm("Apakah Anda yakin ingin menghapus artikel ini?")) return;
        
        setIsDeleting(id);
        try {
            const { error } = await supabase
                .from("news_articles")
                .delete()
                .eq("id", id);
            
            if (error) throw error;
            toast.success("Artikel berhasil dihapus");
            mutate();
        } catch (err: any) {
            toast.error("Gagal menghapus: " + err.message);
        } finally {
            setIsDeleting(null);
        }
    };

    const handleToggleStatus = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'published' ? 'draft' : 'published';
        try {
            const { error } = await supabase
                .from("news_articles")
                .update({ 
                    status: newStatus,
                    published_at: newStatus === 'published' ? new Date().toISOString() : null
                })
                .eq("id", id);
            
            if (error) throw error;
            toast.success(`Status diubah menjadi ${newStatus}`);
            mutate();
        } catch (err: any) {
            toast.error("Gagal mengubah status: " + err.message);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-2xl font-black text-white">Content Management</h1>
                    <p className="text-gray-500 text-sm">Kelola berita, pengumuman, dan galeri pendakian</p>
                </div>
                
                <Link href="/admin/content/news/new">
                    <button className="bg-primary hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-primary/20">
                        <span className="material-symbols-outlined font-black">add</span>
                        Tulis Berita Baru
                    </button>
                </Link>
            </div>

            {/* Navigation Tabs */}
            <div className="flex bg-surface-dark p-1 rounded-2xl border border-border-dark w-fit">
                <Link href="/admin/content/news">
                    <button className="px-8 py-2.5 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 transition-all">
                        Berita & Pengumuman
                    </button>
                </Link>
                <Link href="/admin/content/gallery">
                    <button className="px-8 py-2.5 rounded-xl text-gray-500 hover:text-white font-bold text-sm transition-all">
                        Gallery Foto
                    </button>
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {isLoading ? (
                    [1,2,3].map(i => <div key={i} className="h-32 bg-surface-dark border border-border-dark rounded-2xl animate-pulse" />)
                ) : !news || news.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-surface-dark border border-border-dark rounded-3xl text-center">
                        <span className="material-symbols-outlined text-gray-700 text-8xl mb-4">article</span>
                        <h3 className="text-xl font-bold text-white mb-2">Belum ada berita</h3>
                        <p className="text-gray-500">Mulai tulis artikel pertama Anda untuk pendaki.</p>
                    </div>
                ) : (
                    news.map((item) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            key={item.id}
                            className="bg-surface-dark border border-border-dark rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-center gap-6 group hover:border-primary/30 transition-all shadow-xl"
                        >
                            <div className="w-full md:w-32 h-32 rounded-xl bg-background-dark overflow-hidden flex-shrink-0 border border-border-dark">
                                {item.featured_image ? (
                                    <img src={item.featured_image} alt={item.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-700">
                                        <span className="material-symbols-outlined text-4xl">image</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 flex flex-col gap-2 w-full">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
                                        item.status === 'published' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                                    }`}>
                                        {item.status}
                                    </span>
                                    <span className="text-gray-600 text-[10px]">•</span>
                                    <p className="text-gray-500 text-xs">{new Date(item.created_at).toLocaleDateString('id-ID', { dateStyle: 'medium' })}</p>
                                </div>
                                <h3 className="text-white font-bold text-lg group-hover:text-primary transition-colors line-clamp-1">{item.title}</h3>
                                <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
                                    {item.excerpt || "Tidak ada ringkasan artikel..."}
                                </p>
                            </div>

                            <div className="flex items-center gap-2 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-none border-border-dark">
                                <button 
                                    onClick={() => handleToggleStatus(item.id, item.status)}
                                    className="p-2 text-gray-400 hover:text-white transition-colors"
                                    title={item.status === 'published' ? 'Tarik dari Publik (Draft)' : 'Terbitkan'}
                                >
                                    <span className="material-symbols-outlined">
                                        {item.status === 'published' ? 'visibility_off' : 'visibility'}
                                    </span>
                                </button>
                                <Link href={`/admin/content/news/${item.id}`}>
                                    <button className="p-2 text-gray-400 hover:text-primary transition-colors">
                                        <span className="material-symbols-outlined">edit</span>
                                    </button>
                                </Link>
                                <button 
                                    disabled={isDeleting === item.id}
                                    onClick={() => handleDelete(item.id)}
                                    className="p-2 text-gray-400 hover:text-rose-500 transition-colors disabled:opacity-50"
                                >
                                    {isDeleting === item.id ? (
                                        <span className="w-5 h-5 border-2 border-rose-500/30 border-t-rose-500 rounded-full animate-spin" />
                                    ) : (
                                        <span className="material-symbols-outlined">delete</span>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}
