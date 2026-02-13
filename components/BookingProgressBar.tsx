"use client";

import { motion } from "framer-motion";

interface BookingProgressBarProps {
  currentStep: number;
}

export default function BookingProgressBar({ currentStep }: BookingProgressBarProps) {
  const steps = [
    { number: 1, label: "Aturan" },
    { number: 2, label: "Jadwal" },
    { number: 3, label: "Anggota" },
    { number: 4, label: "Bayar" },
  ];

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between relative">
        {/* Connection Line Background */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-700 -translate-y-1/2 z-0 rounded-full" />
        
        {/* Connection Line Progress */}
        <motion.div 
          className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-0 rounded-full origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: (currentStep - 1) / (steps.length - 1) }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />

        {steps.map((step) => {
          const isActive = step.number <= currentStep;
          const isCurrent = step.number === currentStep;

          return (
            <div key={step.number} className="relative z-10 flex flex-col items-center">
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: isActive ? "#0EA5E9" : "#1F2937", // primary (sky-500) or gray-800
                  scale: isCurrent ? 1.2 : 1,
                  borderColor: isActive ? "#0EA5E9" : "#374151",
                }}
                className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-background-dark shadow-lg transition-colors duration-300 ${
                    isActive ? "text-white" : "text-gray-400"
                }`}
              >
                {isActive && step.number < currentStep ? (
                  <span className="material-symbols-outlined text-lg">check</span>
                ) : (
                  <span className="text-sm font-bold">{step.number}</span>
                )}
              </motion.div>
              <div className="absolute top-12 whitespace-nowrap">
                <span className={`text-xs font-bold uppercase tracking-wider ${
                    isActive ? "text-primary" : "text-gray-500"
                }`}>
                    {step.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
