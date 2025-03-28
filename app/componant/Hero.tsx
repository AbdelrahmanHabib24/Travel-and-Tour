/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useState, useRef } from "react";
import { IoLocation } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import { useRouter } from "next/navigation";
import BackgroundVideo from "./BackgroundVideo";

// Move CSS keyframes to globals.css (suggested, but shown here for completeness)
const styles = `
  @keyframes fadeDown {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes zoomIn {
    from { opacity: 0; transform: scale(0.8); }
    to { opacity: 1; transform: scale(1); }
  }
  .fade-down, .fade-up, .zoom-in, .form-fade-up {
    opacity: 0;
  }
  .fade-down.visible { animation: fadeDown 800ms ease-out 200ms forwards; }
  .fade-up.visible { animation: fadeUp 800ms ease-out 400ms forwards; }
  .zoom-in.visible { animation: zoomIn 800ms ease-out 600ms forwards; }
  .form-fade-up.visible { animation: fadeUp 800ms ease-out 800ms forwards; }
  /* Add input focus animation */
  @keyframes inputFocus {
    from { transform: scale(1); }
    to { transform: scale(1.02); box-shadow: 0 0 8px rgba(59, 130, 246, 0.5); }
  }
  .input-focus:focus-within {
    animation: inputFocus 300ms ease-out forwards;
  }
`;

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
  const [city, setCity] = useState("");
  const [date, setDate] = useState("");
  const [maxPrice, setMaxPrice] = useState(1000);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fullText = "Travel To Any Corner In The World";
  const typingSpeed = 100;
  const backspacingSpeed = 50;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();

  const typedTextRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const searchSectionRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (typedTextRef.current) observer.observe(typedTextRef.current);
    if (headingRef.current) observer.observe(headingRef.current);
    if (searchSectionRef.current) observer.observe(searchSectionRef.current);
    if (formRef.current) observer.observe(formRef.current);

    return () => {
      if (typedTextRef.current) observer.unobserve(typedTextRef.current);
      if (headingRef.current) observer.unobserve(headingRef.current);
      if (searchSectionRef.current) observer.unobserve(searchSectionRef.current);
      if (formRef.current) observer.unobserve(formRef.current);
    };
  }, []);

  // Typing animation
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
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCity(event.target.value);
    setError(null); // Clear error on change
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDate(event.target.value);
    setError(null); // Clear error on change
  };

  const handleMaxPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMaxPrice(Number(event.target.value));
  };

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Form validation
    if (!city) {
      setError("Please select a destination.");
      return;
    }
    if (!date) {
      setError("Please select a date.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Simulate API call (replace with actual API logic)
      await new Promise((resolve) => setTimeout(resolve, 2000));
      router.push(`/results?city=${city}&maxPrice=${maxPrice}`);
    } catch (err) {
      setError("An error occurred while searching. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <section className="relative w-full h-screen flex items-center justify-center" id="home">
        <div className="absolute inset-0 bg-[#2f6a7f2f] z-10"></div>
        <BackgroundVideo />

        <div className="relative max_padd_container z-20 text-white flex flex-col justify-center gap-8 text-center px-4 sm:px-10 w-full">
          {/* Typed Text */}
          <p
            ref={typedTextRef}
            className="text-base sm:text-lg md:text-2xl text-orange-500 fade-down"
            aria-live="polite"
          >
            {typedText}
          </p>

          {/* Main Heading */}
          <h1
            ref={headingRef}
            className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold fade-up"
          >
            Make Your Tour Amazing With Us
          </h1>

          {/* Search Section */}
          <div ref={searchSectionRef} className="zoom-in">
            <span className="bg-white text-tertiary px-4 py-2 rounded-lg text-sm sm:text-base font-medium">
              Search For Your Trip
            </span>

            {/* Search Form */}
            <form
              ref={formRef}
              className="bg-white p-4 sm:p-6 rounded-lg text-start shadow-lg w-full max-w-4xl mx-auto flex flex-col sm:flex-row gap-4 form-fade-up"
              role="form"
              aria-labelledby="search-form"
              onSubmit={handleSearch}
            >
              <h2 id="search-form" className="sr-only">
                Search for your trip
              </h2>

              {/* Error Message */}
              {error && (
                <div className="w-full text-center sm:col-span-3">
                  <p className="text-red-500 text-sm" role="alert">
                    {error}
                  </p>
                </div>
              )}

              {/* City Input */}
              <div className="flex-1 input-focus">
                <label
                  htmlFor="city"
                  className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1"
                >
                  Select your destination:
                </label>
                <div className="flex items-center bg-gray-100 rounded-md border border-gray-300 focus-within:border-blue-500 transition-all">
                  <select
                    id="city"
                    className="flex-1 p-2 sm:p-3 border-none rounded-md bg-transparent text-gray-700 focus:outline-none"
                    value={city}
                    onChange={handleCityChange}
                    aria-invalid={error && !city ? "true" : "false"}
                    aria-describedby={error && !city ? "city-error" : undefined}
                    required
                  >
                    <option value="">Select a city...</option>
                    {cities.map((cityName) => (
                      <option key={cityName} value={cityName}>
                        {cityName}
                      </option>
                    ))}
                  </select>
                  <IoLocation className="text-gray-500 mx-2" />
                </div>
              </div>

              {/* Date Input */}
              <div className="flex-1 input-focus">
                <label
                  htmlFor="date"
                  className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1"
                >
                  Select your date:
                </label>
                <input
                  type="date"
                  id="date"
                  className="w-full p-2 sm:p-3 border-none rounded-md bg-gray-100 text-gray-700 border border-gray-300 focus:outline-none focus:border-blue-500 transition-all"
                  value={date}
                  onChange={handleDateChange}
                  min={new Date().toISOString().split("T")[0]} // Prevent past dates
                  aria-invalid={error && !date ? "true" : "false"}
                  aria-describedby={error && !date ? "date-error" : undefined}
                  required
                />
              </div>

              {/* Max Price Input */}
              <div className="flex-1 input-focus">
                <label
                  htmlFor="price"
                  className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1"
                >
                  Max price:
                </label>
                <input
                  type="range"
                  id="price"
                  max={5000}
                  min={1000}
                  className="w-full accent-blue-500"
                  value={maxPrice}
                  onChange={handleMaxPriceChange}
                  aria-label="Select maximum price"
                />
                <div className="text-gray-700 text-xs sm:text-sm mt-1">
                  Max Price: ${maxPrice.toLocaleString()}
                </div>
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className={`
                  relative flex items-center justify-center gap-2
                  bg-blue-500 text-white py-2 px-2 sm:py-3 sm:px-6 rounded-md
                  text-sm sm:text-base font-medium
                  hover:bg-blue-600 hover:scale-105 active:scale-95
                  focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
                  transition-all duration-300
                  disabled:bg-blue-300 disabled:cursor-not-allowed
                  ${isSubmitting ? "opacity-70 cursor-wait" : ""}
                `}
                disabled={isSubmitting}
                aria-label={isSubmitting ? "Searching in progress" : "Search for your trip"}
                aria-busy={isSubmitting}
              >
                <span className="flex items-center gap-2">
                  {isSubmitting ? (
                    <svg
                      className="animate-spin h-5 w-5 text-white"
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
                </span>
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;