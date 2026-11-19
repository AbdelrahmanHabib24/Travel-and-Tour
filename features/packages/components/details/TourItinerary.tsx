"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { LuCalendarDays, LuChevronDown, LuX } from "react-icons/lu";
import type { ItineraryItem } from "../../types";

export interface TourItineraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: ItineraryItem[];
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
}

export default function TourItinerary({
  isOpen,
  onClose,
  items,
  triggerRef,
}: TourItineraryModalProps) {
  const t = useTranslations("package-details");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const shouldReduceMotion = useReducedMotion();

  // Exactly one day expanded at a time; first day open by default
  const [expandedDay, setExpandedDay] = useState<number | null>(0);

  const modalRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  const toggleDay = useCallback((index: number) => {
    setExpandedDay((prev) => (prev === index ? null : index));
  }, []);

  // Restore focus to trigger on close
  const handleClose = useCallback(() => {
    onClose();
    setTimeout(() => {
      triggerRef?.current?.focus();
    }, 50);
  }, [onClose, triggerRef]);

  // Lock background scroll and dismiss on Escape while modal is open
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    // Focus close button on open
    const timer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 60);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timer);
    };
  }, [isOpen, handleClose]);



  if (!items || items.length === 0) return null;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          key="itinerary-portal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0.05 : 0.25 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-hidden"
        >
          {/* Backdrop with noticeable fade */}
          <motion.div
            key="itinerary-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.05 : 0.25 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
            aria-hidden="true"
          />

          {/* Modal Container: Bottom sheet on mobile, centered dialog on desktop */}
          <motion.div
            key="itinerary-modal"
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="itinerary-modal-title"
            initial={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.96, y: 24 }
            }
            animate={
              shouldReduceMotion
                ? { opacity: 1 }
                : { opacity: 1, scale: 1, y: 0 }
            }
            exit={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.96, y: 24 }
            }
            transition={{
              type: "spring",
              damping: 28,
              stiffness: 300,
              duration: 0.3,
            }}
            className="relative z-10 w-full sm:max-w-xl max-h-[85vh] bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden text-start"
          >
            {/* Mobile swipe indicator bar */}
            <div className="sm:hidden pt-3 pb-1 flex justify-center">
              <span className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="px-5 sm:px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0 text-orange-500">
                  <LuCalendarDays className="w-4 h-4" />
                </div>
                <h2
                  id="itinerary-modal-title"
                  className="text-base sm:text-lg font-bold text-gray-900 truncate"
                >
                  {t("itinerary.title")}
                </h2>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 shrink-0">
                  {isRTL
                    ? items.length === 1
                      ? "يوم واحد"
                      : items.length === 2
                      ? "يومان"
                      : items.length <= 10
                      ? `${items.length} أيام`
                      : `${items.length} يوماً`
                    : `${items.length} ${items.length === 1 ? "Day" : "Days"}`}
                </span>
              </div>

              {/* Close button */}
              <button
                ref={closeButtonRef}
                type="button"
                onClick={handleClose}
                aria-label={t("itinerary.close")}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 flex items-center justify-center transition-colors cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
              >
                <LuX className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Day-by-Day Accordion Area */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-2.5 divide-y divide-gray-100/80">
              {items.map((item, index) => {
                const isOpen = expandedDay === index;
                const description =
                  item.description ||
                  (Array.isArray(item.activities)
                    ? item.activities.join(" ")
                    : "");

                return (
                  <div
                    key={`${item.day}-${index}`}
                    className={index > 0 ? "pt-2.5" : ""}
                  >
                    <h3>
                      <button
                        type="button"
                        id={`day-trigger-${index}`}
                        aria-expanded={isOpen}
                        aria-controls={`day-content-${index}`}
                        onClick={() => toggleDay(index)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl text-start transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2  ${
                          isOpen ? "bg-orange-50/40" : "hover:bg-orange-50/40"
                        }`}
                      >
                        <span
                          className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-bold transition-colors ${
                            isOpen
                              ? "bg-orange-500 text-white"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {t("itinerary.day", { day: item.day })}
                        </span>
                        <span className="min-w-0 flex-1 font-semibold text-gray-800 text-sm sm:text-base truncate">
                          {item.title}
                        </span>
                        <LuChevronDown
                          aria-hidden="true"
                          className={`shrink-0 text-xs transition-transform duration-200 ${
                            isOpen
                              ? "rotate-180 text-orange-600"
                              : "text-gray-400"
                          }`}
                        />
                      </button>
                    </h3>

                    {/* Collapsible Content: Only one day open at a time with smooth animated accordion */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={`day-content-${index}`}
                          role="region"
                          aria-labelledby={`day-trigger-${index}`}
                          initial={
                            shouldReduceMotion
                              ? { opacity: 0 }
                              : { height: 0, opacity: 0 }
                          }
                          animate={
                            shouldReduceMotion
                              ? { opacity: 1 }
                              : { height: "auto", opacity: 1 }
                          }
                          exit={
                            shouldReduceMotion
                              ? { opacity: 0 }
                              : { height: 0, opacity: 0 }
                          }
                          transition={{
                            duration: shouldReduceMotion ? 0.05 : 0.25,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className="overflow-hidden"
                        >
                          {description && (
                            <p className="px-3 pt-2 pb-3 text-xs sm:text-sm leading-relaxed text-gray-600 whitespace-pre-line">
                              {description}
                            </p>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
