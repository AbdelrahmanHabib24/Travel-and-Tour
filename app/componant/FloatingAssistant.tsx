"use client";
import { forwardRef } from "react";
import { motion } from "framer-motion";
import { FaRobot } from "react-icons/fa";

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
          scale: disabled ? 1 : [1, 1.1, 1],
          rotate: disabled ? 0 : [0, 10, -10, 0],
        }}
        transition={{
          repeat: disabled ? 0 : Infinity,
          duration: 3,
          ease: "easeInOut",
        }}
        className={`fixed bottom-6 right-6 z-50`}
      >
        <button
          onClick={onStartCall}
          disabled={disabled}
          className={`bg-blue-500 text-white p-4 rounded-full shadow-lg flex items-center gap-2 ${
            disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
          }`}
        >
          <FaRobot className="text-2xl" />
          {startButtonText && (
            <span className="text-sm font-medium">{startButtonText}</span>
          )}
        </button>
      </motion.div>
    );
  }
);

FloatingAssistant.displayName = "FloatingAssistant";
export default FloatingAssistant;
