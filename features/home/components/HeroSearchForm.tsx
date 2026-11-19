"use client";

import React, { useCallback, useRef, useState } from "react";
import { IoLocation } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import TravelDatePicker from "./TravelDatePicker";

const cities = [
  "Italy",
  "France",
  "Australia",
  "Hong Kong",
  "Brazil",
  "London",
  "Indonesia",
  "Switzerland",
  "India",
] as const;

const HeroSearchForm: React.FC = () => {
  const locale = useLocale();
  const isRTL = locale === "ar";
  const t = useTranslations("home.hero");
  const router = useRouter();

  const [form, setForm] = useState({ city: "", date: "", maxPrice: 1000 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dateButtonRef = useRef<HTMLButtonElement | null>(null);

  const handleDateChange = useCallback((dateStr: string) => {
    setForm((prev) => ({ ...prev, date: dateStr }));
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { id, value } = e.target;
      setForm((prev) => ({
        ...prev,
        [id]: id === "maxPrice" ? +value : value,
      }));
    },
    [],
  );

  const handleSearch = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const { city, maxPrice, date } = form;
      if (!date) {
        setIsOpen(true);
        dateButtonRef.current?.focus();
        return;
      }
      setIsSubmitting(true);
      try {
        await new Promise((res) => setTimeout(res, 2000));
        router.push(
          `/results?city=${encodeURIComponent(city)}&maxPrice=${maxPrice}`,
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [form, router],
  );

  return (
    <form
      className="bg-white p-4 sm:p-6 rounded-lg text-start shadow-lg flex flex-col md:flex-row gap-4 form-fade-up"
      role="form"
      aria-labelledby="search-form"
      onSubmit={handleSearch}
    >
      <h2 id="search-form" className="sr-only">
        {t("searchFormTitle")}
      </h2>

      {/* Destination */}
      <div className="flex flex-col text-start flex-1 min-w-[160px]">
        <label
          htmlFor="city"
          className="text-gray-700 font-semibold text-sm mb-1 text-start"
        >
          {t("searchDestination")}
        </label>
        <div className="flex items-center bg-gray-100 rounded-md border border-gray-300 focus-within:border-secondary transition">
          <select
            id="city"
            value={form.city}
            onChange={handleChange}
            required
            className={`flex-1 h-11 px-3 bg-transparent focus:outline-none min-w-0 text-start ${
              form.city ? "text-gray-800" : "text-gray-400"
            }`}
          >
            <option value="" className="text-gray-400">
              {t("selectDestination")}
            </option>

            {cities.map((c) => (
              <option key={c} value={c} className="text-gray-700">
                {t(`destinations.${c}`)}
              </option>
            ))}
          </select>
          <IoLocation className="text-gray-500 mx-2 shrink-0" />
        </div>
      </div>

      {/* Date */}
      <TravelDatePicker
        value={form.date}
        onChange={handleDateChange}
        isRTL={isRTL}
        label={t("selectDate")}
        placeholder={t("selectDatePlaceholder")}
        ariaLabel={t("calendarAriaLabel")}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        buttonRef={dateButtonRef}
      />

      {/* Max Price */}
      <div className="flex flex-col text-start flex-1 min-w-[180px]">
        <div className="flex items-center justify-between mb-1">
          <label
            htmlFor="maxPrice"
            className="text-gray-700 font-semibold text-sm"
          >
            {t("maxPrice")}
          </label>
          <span className="text-secondary font-bold text-xs sm:text-sm">
            {isRTL
              ? `${form.maxPrice.toLocaleString("ar-EG")} دولار`
              : `$${form.maxPrice.toLocaleString()}`}
          </span>
        </div>
        <div className="h-11 px-3.5 bg-gray-100 rounded-md border border-gray-300 focus-within:border-secondary flex items-center transition">
          <input
            type="range"
            id="maxPrice"
            min={1000}
            max={5000}
            step={100}
            value={form.maxPrice}
            onChange={handleChange}
            aria-label={t("maxPrice")}
            className="w-full h-1.5 bg-gray-300/80 rounded-lg appearance-none cursor-pointer accent-secondary focus:outline-none"
          />
        </div>
      </div>

      {/* Button */}
      <div className="flex flex-col justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full md:w-auto h-11 flex items-center justify-center gap-2 text-white px-7 rounded-md text-sm sm:text-base font-semibold bg-secondary hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-secondary/40 shadow-xs hover:shadow transition-all duration-200 cursor-pointer ${
            isSubmitting ? "opacity-70 cursor-wait" : ""
          }`}
        >
          {isSubmitting ? (
            <svg
              className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
          ) : (
            <FaSearch className="h-4 w-4 sm:h-5 sm:w-5" />
          )}
          <span>{isSubmitting ? t("searching") : t("searchButton")}</span>
        </button>
      </div>
    </form>
  );
};

export default HeroSearchForm;