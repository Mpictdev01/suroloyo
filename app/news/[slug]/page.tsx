"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import useSWR from "swr";

const fetchArticle = async (slug: string) => {
    const { data, error } = await supabase
        .from("news_articles")
        .select("*, author:users(name)")
        .eq("slug", slug)
        .single();
    
    if (error) throw error;
    return data;
};

export default function NewsDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  
  const { data: article, error, isLoading } = useSWR(slug ? `news/${slug}` : null, () => fetchArticle(slug));

  if (isLoading) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow flex items-center justify-center pt-24 pb-12 px-4">
                <div className="w-full max-w-4xl h-[600px] bg-surface-dark border border-border-dark rounded-2xl animate-pulse" />
            </main>
            <Footer />
        </div>
    );
  }

  if (error || !article) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow flex items-center justify-center pt-24 pb-12 px-4">
                <div className="text-center">
                    <h1 className="text-4xl font-black text-white mb-4">404</h1>
                    <p className="text-xl text-gray-400 mb-6">Artikel tidak ditemukan.</p>
                    <Link href="/#news" className="text-primary hover:underline font-bold">
                        Kembali ke Beranda
                    </Link>
                </div>
            </main>
            <Footer />
        </div>
    );
  }

  const publishDate = new Date(article.published_at || article.created_at).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <>
      <Header />
      <main className="flex-grow pt-24 pb-12 px-4 md:px-10">
        <article className="max-w-4xl mx-auto bg-surface-dark border border-border-dark rounded-2xl overflow-hidden shadow-2xl">
            {/* Hero Image */}
            <div className="h-64 sm:h-96 w-full relative">
                <img 
                    src={article.featured_image} 
                    alt={article.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent"></div>
            </div>

            {/* Content */}
            <div className="p-6 md:p-10 -mt-20 relative z-10">
                <Link href="/#news" className="inline-flex items-center gap-2 text-sm font-bold text-gray-300 hover:text-primary mb-6 transition-all bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10 hover:scale-105 active:scale-95">
                    <span className="material-symbols-outlined text-lg">arrow_back</span>
                    Kembali ke Suroloyo News
                </Link>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-4">
                    <span className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-lg">calendar_today</span>
                        {publishDate}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                    <span className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-lg">person</span>
                        {article.author?.name || "Admin"}
                    </span>
                </div>

                <motion.h1 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl md:text-5xl font-black text-white mb-8 leading-tight"
                >
                    {article.title}
                </motion.h1>

                <div 
                    className="prose prose-invert prose-lg max-w-none text-gray-300 news-content"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                />

                <div className="mt-12 pt-8 border-t border-border-dark flex justify-between items-center">
                    <p className="text-sm text-gray-400">Bagikan artikel ini:</p>
                    <div className="flex gap-4">
                        <button className="w-10 h-10 rounded-full bg-blue-600/20 hover:bg-blue-600 flex items-center justify-center text-white transition-colors group">
                             <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                             </svg>
                        </button>
                        <button className="w-10 h-10 rounded-full bg-black/20 hover:bg-black/80 border border-white/10 hover:border-white/30 flex items-center justify-center text-white transition-colors group">
                             <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                             </svg>
                        </button>
                        <button className="w-10 h-10 rounded-full bg-green-500/20 hover:bg-green-500 flex items-center justify-center text-white transition-colors group">
                             <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                             </svg>
                        </button>
                    </div>
                </div>
            </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
