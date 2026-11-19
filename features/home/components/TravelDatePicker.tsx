"use client";

import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { IoCalendarOutline } from "react-icons/io5";
import { DayPicker } from "@daypicker/react";
import { arSA, enUS } from "@daypicker/react/locale";
import "@daypicker/react/dist/style.css";
import {
  formatDateToYYYYMMDD,
  parseYYYYMMDDToDate,
} from "@/lib/utils/date";

export interface TravelDatePickerProps {
  value: string;
  onChange: (dateStr: string) => void;
  isRTL: boolean;
  label: string;
  placeholder: string;
  ariaLabel: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  buttonRef?: React.RefObject<HTMLButtonElement | null>;
}

const TravelDatePicker: React.FC<TravelDatePickerProps> = ({
  value,
  onChange,
  isRTL,
  label,
  placeholder,
  ariaLabel,
  isOpen,
  onOpenChange,
  buttonRef,
}) => {
  const datePickerRef = useRef<HTMLDivElement | null>(null);
  const internalButtonRef = useRef<HTMLButtonElement | null>(null);
  const resolvedButtonRef = buttonRef ?? internalButtonRef;

  // Close calendar popup on click outside or Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(e.target as Node) &&
        resolvedButtonRef.current &&
        !resolvedButtonRef.current.contains(e.target as Node)
      ) {
        onOpenChange(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false);
        resolvedButtonRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onOpenChange, resolvedButtonRef]);

  const selectedDate = useMemo(() => parseYYYYMMDDToDate(value), [value]);

  const formattedDateDisplay = useMemo(() => {
    if (!selectedDate) return "";
    try {
      return new Intl.DateTimeFormat(isRTL ? "ar-SA" : "en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(selectedDate);
    } catch {
      return value;
    }
  }, [selectedDate, isRTL, value]);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const handleDateSelect = useCallback(
    (date: Date | undefined) => {
      if (date) {
        onChange(formatDateToYYYYMMDD(date));
        onOpenChange(false);
        resolvedButtonRef.current?.focus();
      } else {
        onChange("");
      }
    },
    [onChange, onOpenChange, resolvedButtonRef],
  );

  return (
    <div className="flex flex-col text-start relative flex-1 min-w-[160px]">
      <label
        htmlFor="hero-date-button"
        className="text-gray-700 font-semibold text-sm mb-1 text-start"
      >
        {label}
      </label>
      <button
        id="hero-date-button"
        type="button"
        ref={resolvedButtonRef}
        onClick={() => onOpenChange(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onOpenChange(true);
          }
        }}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        className="w-full h-11 px-3 bg-gray-100 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:border-secondary transition flex items-center justify-between text-start cursor-pointer min-w-[160px]"
      >
        <span className={value ? "text-gray-800 font-normal" : "text-gray-400"}>
          {formattedDateDisplay || placeholder}
        </span>
        <IoCalendarOutline className="text-gray-500 mx-1 shrink-0 text-lg" />
      </button>

      {isOpen && (
        <div
          ref={datePickerRef}
          role="dialog"
          aria-modal="true"
          aria-label={ariaLabel}
          className="absolute z-50 top-full mt-2 start-0 max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-2xl border border-gray-200 p-3 text-gray-800"
        >
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            locale={isRTL ? arSA : enUS}
            dir={isRTL ? "rtl" : "ltr"}
            numerals={isRTL ? "arab" : "latn"}
            disabled={{ before: today }}
            defaultMonth={selectedDate || today}
          />
        </div>
      )}
    </div>
  );
};

export default TravelDatePicker;