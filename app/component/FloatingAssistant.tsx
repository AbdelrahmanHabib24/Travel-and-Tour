"use client";
import { forwardRef } from "react";
import { motion } from "framer-motion";
import { FaHeadset } from "react-icons/fa";

type FloatingAssistantProps = {
  disabled?: boolean;
  startButtonText?: string;
  onStartCall?: () => void;
};

const FloatingAssistant = forwardRef<HTMLDivElement, FloatingAssistantProps>(
  ({ disabled, startButtonText, onStartCall }, ref) => {
    return (
      <motion.div
        ref={ref}
        aria-disabled={disabled}
        animate={{
          y: disabled ? 0 : [0, -8, 0],
        }}
        transition={{
          repeat: disabled ? 0 : Infinity,
          duration: 3,
          ease: "easeInOut",
        }}
        className={`fixed bottom-6 sm:bottom-8 right-6 sm:right-8 z-50`}
      >
        <div className="relative group">
          {/* Subtle glowing pulse behind the button */}
          {!disabled && (
            <div className="absolute inset-0 rounded-full bg-orange-400 opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-500"></div>
          )}
          
          <button
            onClick={onStartCall}
            disabled={disabled}
            className={`relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-2xl backdrop-blur-md border border-white/20 transition-all duration-300
              ${disabled 
                ? "opacity-0 pointer-events-none translate-y-4" 
                : "bg-gradient-to-r from-orange-500 to-rose-500 hover:shadow-orange-500/40 hover:scale-110"
              }
              text-white
            `}
          >
            <FaHeadset className="text-2xl sm:text-3xl drop-shadow-md" />
            
            {/* Desktop Tooltip */}
            {startButtonText && (
              <span className="absolute right-[110%] px-4 py-2 bg-gray-900/90 text-white text-sm font-medium rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 whitespace-nowrap pointer-events-none hidden sm:block shadow-xl border border-white/10">
                {startButtonText}
              </span>
            )}
          </button>
        </div>
      </motion.div>
    );
  }
);

FloatingAssistant.displayName = "FloatingAssistant";
export default FloatingAssistant;
