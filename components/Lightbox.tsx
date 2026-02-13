"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

interface LightboxProps {
  isOpen: boolean;
  imageSrc: string;
  altText: string;
  onClose: () => void;
}

export default function Lightbox({ isOpen, imageSrc, altText, onClose }: LightboxProps) {
  
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden"; // Prevent scrolling
    }
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
        >
            <motion.div
                 initial={{ scale: 0.9, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 exit={{ scale: 0.9, opacity: 0 }}
                 onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
                 className="relative w-full max-w-5xl max-h-[90vh] flex flex-col items-center"
            >
                <img 
                    src={imageSrc} 
                    alt={altText} 
                    className="w-auto h-auto max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl" 
                />
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 flex items-center justify-center text-white transition-colors"
                >
                    <span className="material-symbols-outlined">close</span>
                </button>
                <p className="mt-4 text-white text-lg font-medium tracking-wide drop-shadow-md">{altText}</p>
            </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
