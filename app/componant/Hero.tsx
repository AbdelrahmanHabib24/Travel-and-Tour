/* ---------------------- Hero.tsx ---------------------- */
"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { IoLocation } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import { useRouter } from "next/navigation";
import BackgroundVideo from "./BackgroundVideo";

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
];

const Hero: React.FC = () => {
  const [typedText, setTypedText] = useState("");
  const [form, setForm] = useState({ city: "", date: "", maxPrice: 1000 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const fullText = "Travel To Any Corner In The World";
  const typingSpeed = 100;
  const backspacingSpeed = 50;

  const animatedRefs = useRef<(HTMLElement | null)[]>([]);

  // Intersection animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.1 }
    );

    animatedRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Typing effect
  useEffect(() => {
    const type = (i: number) => {
      if (i <= fullText.length) {
        setTypedText(fullText.slice(0, i));
        timerRef.current = setTimeout(() => type(i + 1), typingSpeed);
      } else {
        timerRef.current = setTimeout(() => backspace(fullText.length), 1000);
      }
    };

    const backspace = (i: number) => {
      if (i >= 0) {
        setTypedText(fullText.slice(0, i));
        timerRef.current = setTimeout(() => backspace(i - 1), backspacingSpeed);
      } else {
        timerRef.current = setTimeout(() => type(0), 500);
      }
    };

    type(0);
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { id, value } = e.target;
      setForm((prev) => ({
        ...prev,
        [id]: id === "maxPrice" ? +value : value,
      }));
    },
    []
  );

  const handleSearch = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const { city, date, maxPrice } = form;
      setIsSubmitting(true);
      try {
        await new Promise((res) => setTimeout(res, 2000));
        router.push(`/results?city=${city}&maxPrice=${maxPrice}`);
      } finally {
        setIsSubmitting(false);
      }
    },
    [form, router]
  );

  return (
    <section
      className="relative w-full min-h-screen flex items-center justify-center"
      id="home"
    >
      <div className="absolute inset-0 bg-[#2f6a7f2f] z-10" />
      <BackgroundVideo />

      <div className="relative z-20 text-white flex flex-col items-center gap-6 text-center px-4 sm:px-6 lg:px-10 w-full  ">
        <p className="text-orange-400 text-base sm:text-lg md:text-2xl fade-down">
          {typedText}
        </p>

        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold fade-up">
          Make Your Tour Amazing With Us
        </h1>

        <div
          ref={(el) => {
            animatedRefs.current[2] = el;
          }}
          className="w-full  sm:flex flex-col   items-center "
        >
          {/* Title Label */}
          {/* Search Section */}{" "}
          <div className="zoom-in">
            {" "}
            <span className="bg-white text-tertiary px-4 py-2 rounded-lg text-sm sm:text-base font-medium">
              {" "}
              Search For Your Trip{" "}
            </span>{" "}
            {/* Search Form */}{" "}
            <form
              className="bg-white p-4 sm:p-6 rounded-lg text-start shadow-lg 
             flex flex-col md:flex-row gap-4 form-fade-up"
              role="form"
              aria-labelledby="search-form"
              onSubmit={handleSearch}
            >
              <h2 id="search-form" className="sr-only">
                Search for your trip
              </h2>
              {/* Destination */}
              <div className="flex flex-col text-left">
                <label
                  htmlFor="city"
                  className="text-gray-700 font-semibold text-sm mb-1 text-left"
                >
                  Select your destination:
                </label>
                <div className="flex items-center bg-gray-100 rounded-md border border-gray-300 focus-within:border-blue-500 transition">
                  <select
                    id="city"
                    value={form.city}
                    onChange={handleChange}
                    required
                    className="flex-1 h-11 px-3 bg-transparent text-gray-700 focus:outline-none min-w-0"
                  >
                    <option value="">Select a city...</option>
                    {cities.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <IoLocation className="text-gray-500 mx-2" />
                </div>
              </div>
              {/* Date */}
              <div className="flex flex-col text-left">
                <label
                  htmlFor="date"
                  className="text-gray-700 font-semibold text-sm mb-1 text-left"
                >
                  Select your date:
                </label>
                <input
                  type="date"
                  id="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full h-11 px-3 bg-gray-100 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 transition"
                />
              </div>
              {/* Max Price */}
              <div className="flex flex-col text-left">
                <label
                  htmlFor="maxPrice"
                  className="text-gray-700 font-semibold text-sm mb-1 text-left"
                >
                  Max Price:
                </label>
                <input
                  type="range"
                  id="maxPrice"
                  min={1000}
                  max={5000}
                  step={100}
                  value={form.maxPrice}
                  onChange={handleChange}
                  className="w-full accent-blue-500"
                />
                <span className="text-gray-600 text-sm mt-1 text-left">
                  ${form.maxPrice.toLocaleString()}
                </span>
              </div>
              {/* Button */}
              <div className="flex items-center justify-center sm:mt-5 ">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full h-11 flex items-center justify-center py gap-2 bg-blue-500 text-white px-6 rounded-md text-sm sm:text-base font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 ${
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
                  <span>{isSubmitting ? "Searching..." : "Search"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
