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
            className={`relative flex items-center gap-2 sm:gap-3 px-5 py-3 sm:px-7 sm:py-4 rounded-full shadow-xl backdrop-blur-md border border-white/20 transition-all duration-300
              ${disabled 
                ? "opacity-0 pointer-events-none translate-y-4" 
                : "bg-gradient-to-r from-orange-500 to-rose-500 hover:shadow-orange-500/40 hover:scale-105"
              }
              text-white
            `}
          >
            <FaHeadset className="text-xl sm:text-2xl drop-shadow-md" />
            {startButtonText && (
              <span className="text-sm sm:text-base font-semibold tracking-wide drop-shadow-md">
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
