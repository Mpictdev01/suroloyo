"use client";

import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    folder?: string;
    label?: string;
}

export default function ImageUpload({ value, onChange, folder = "general", label = "Upload Gambar" }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Image validation
        if (!file.type.startsWith("image/")) {
            toast.error("File harus berupa gambar");
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB Limit for higher quality
            toast.error("Ukuran gambar maksimal 5MB");
            return;
        }

        setIsUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
            const filePath = `${folder}/${fileName}`;

            // Create bucket if it doesn't exist is usually handled via dashboard, 
            // but we assume 'content' bucket exists or we handle the error.
            const { error: uploadError } = await supabase.storage
                .from("content")
                .upload(filePath, file);

            if (uploadError) {
                // If bucket doesn't exist, we might get an error. 
                // In production, buckets should be pre-created.
                throw uploadError;
            }

            const { data } = supabase.storage
                .from("content")
                .getPublicUrl(filePath);

            onChange(data.publicUrl);
            toast.success("Gambar berhasil diunggah");
        } catch (error: any) {
            console.error("Upload error:", error);
            toast.error("Gagal mengunggah gambar: " + (error.message || "Pastikan bucket 'content' sudah dibuat di Supabase Storage"));
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemove = () => {
        onChange("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="space-y-2">
            {label && <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">{label}</label>}
            
            <div className={`relative w-full aspect-video md:aspect-[2/1] bg-background-dark border-2 border-dashed border-border-dark rounded-2xl overflow-hidden flex flex-col items-center justify-center group transition-all hover:border-primary/50`}>
                {value ? (
                    <>
                        <img src={value} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity gap-2">
                            <button 
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="p-3 bg-white text-black rounded-full hover:scale-110 transition-transform shadow-xl flex items-center justify-center"
                            >
                                <span className="material-symbols-outlined block">edit</span>
                            </button>
                            <button 
                                type="button"
                                onClick={handleRemove}
                                className="p-3 bg-rose-500 text-white rounded-full hover:scale-110 transition-transform shadow-xl flex items-center justify-center"
                            >
                                <span className="material-symbols-outlined block">delete</span>
                            </button>
                        </div>
                    </>
                ) : (
                    <button 
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="flex flex-col items-center gap-3 text-gray-500 group-hover:text-primary transition-colors w-full h-full justify-center"
                    >
                        {isUploading ? (
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                                <p className="text-xs font-bold animate-pulse text-primary">Mengunggah...</p>
                            </div>
                        ) : (
                            <>
                                <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 group-hover:scale-110 transition-all">
                                    <span className="material-symbols-outlined text-4xl">add_a_photo</span>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-bold">Pilih file gambar</p>
                                    <p className="text-[10px] uppercase font-black tracking-widest mt-1 opacity-50">JPG, PNG, WEBP (Max 5MB)</p>
                                </div>
                            </>
                        )}
                    </button>
                )}

                <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleUpload}
                    accept="image/*"
                    className="hidden" 
                />
            </div>
        </div>
    );
}
