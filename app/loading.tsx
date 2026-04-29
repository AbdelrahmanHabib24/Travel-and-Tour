"use client";

import { motion } from "framer-motion";

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-50/50 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-50/50 rounded-full blur-[120px] animate-pulse" />

      <div className="relative flex flex-col items-center scale-75 md:scale-100">
        {/* TRAVEL ANIMATION */}
        <div className="relative w-48 h-48 flex items-center justify-center">
          {/* Outer Orbit Path */}
          <div className="absolute inset-0 border-[1px] border-dashed border-gray-200 rounded-full" />
          
          {/* Orbiting Plane */}
          <div className="absolute inset-0 animate-[spin_4s_linear_infinite]">
            <div className="absolute top-[-12px] left-1/2 -translate-x-1/2">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-blue-500 fill-current rotate-90 drop-shadow-lg">
                <path d="M21,16L21,14L13,9L13,3.5C13,2.17 11.83,1.1 10.5,1.1C9.17,1.1 8.1,2.17 8.1,3.5L8.1,9L0.1,14L0.1,16L8.1,13.5L8.1,19L6.1,20.5L6.1,22L10.5,21L15,22L15,20.5L13,19L13,13.5L21,16Z" />
              </svg>
            </div>
          </div>

          {/* Central Rotating Globe using Framer Motion */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="relative w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-400 rounded-full shadow-2xl flex items-center justify-center"
          >
            <svg viewBox="0 0 24 24" className="w-12 h-12 text-white/90 fill-current">
              <path d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M11,19.93C7.05,19.44,4,16.08,4,12c0-0.35,0.03-0.69,0.08-1.02L9,15v1c0,1.1,0.9,2,2,2V19.93z M17.9,17.39C17.64,16.58,16.9,16,16,16h-1v-3c0-0.55-0.45-1-1-1H8v-2h2c0.55,0,1-0.45,1-1V7h2c1.1,0,2-0.9,2-2V4.59C17.05,5.81,19,8.66,19,12C19,14.01,18.59,15.91,17.9,17.39z" />
            </svg>
            
          </motion.div>
        </div>
      </div>
    </div>
  );
}
