"use client";

import { forwardRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

type FloatingAssistantProps = {
  disabled?: boolean;
  onStartCall?: () => void;
};

const FloatingAssistant = forwardRef<HTMLDivElement, FloatingAssistantProps>(
  ({ disabled, onStartCall }, ref) => {
    const t = useTranslations("sunny");
    const [showTooltip, setShowTooltip] = useState(true);

    useEffect(() => {
      const timer = setTimeout(() => setShowTooltip(false), 7000);
      return () => clearTimeout(timer);
    }, []);

    if (disabled) {
      return null;
    }

    return (
      <motion.div
        ref={ref}
        aria-disabled={disabled}
        initial={{ opacity: 0, scale: 0.85, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="fixed bottom-5 end-6 sm:bottom-6 sm:end-8 z-40 select-none"
      >
        <div className="relative group flex flex-col items-center justify-center">
          {/* Restored Speech Bubble Tooltip centered directly above the avatar button */}
          <div
            role="tooltip"
            className={`absolute bottom-[calc(100%+14px)] end-0 max-w-[calc(100vw-2rem)] px-4 py-2 bg-white text-[#102D40] rounded-2xl shadow-[0_8px_24px_rgba(7,59,80,0.16)] border border-[#E2E8F0] whitespace-nowrap pointer-events-none transition-all duration-300 z-20 ${
              showTooltip
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-95 translate-y-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:scale-100 group-focus-within:translate-y-0"
            }`}
          >
            <div className="flex flex-col text-start leading-snug">
              <span className="text-[12px] font-medium text-[#64748B]">
                {t("floating.planWith")}
              </span>
              <span className="text-[13px] font-extrabold text-[#073B50] flex items-center gap-1">
                <span>{t("floating.name")}</span>
                <span aria-hidden="true">✨</span>
              </span>
            </div>

            {/* Downward Speech Bubble Pointer centered directly above the mascot */}
            <div className="absolute -bottom-1.5 end-[22px] sm:end-[26px] w-3 h-3 bg-white border-r border-b border-[#E2E8F0] transform rotate-45" />
          </div>

          {/* Clean, circular floating assistant button */}
          <button
            type="button"
            onClick={onStartCall}
            aria-label={t("floating.ariaLabel")}
            className="relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white p-2 border border-orange-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_24px_rgba(255,129,63,0.22)] hover:border-orange-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <Image
              src="/sunny-avatar-transparent.png"
              alt={t("header.avatarAlt")}
              width={64}
              height={64}
              className="w-full h-full object-contain select-none"
              draggable={false}
            />
            {/* Active online indicator dot */}
            <span
              className="absolute bottom-0.5 end-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-2xs"
              aria-hidden="true"
            />
          </button>
        </div>
      </motion.div>
    );
  }
);

FloatingAssistant.displayName = "FloatingAssistant";
export default FloatingAssistant;
