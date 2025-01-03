/* eslint-disable react-hooks/exhaustive-deps */  
/* eslint-disable @typescript-eslint/no-unused-vars */  
"use client";  

import React, { useEffect, useState, useCallback, useRef } from "react";  
import { IoLocation } from "react-icons/io5";  
import debounce from "lodash/debounce";  
import Loading from "../loading"; 
import BackgroundVideo from "./BackgroundVideo";  

const Hero: React.FC = () => {  
  const [typedText, setTypedText] = useState("");  
  const [city, setCity] = useState("");  
  const [date, setDate] = useState("");  
  const [maxPrice, setMaxPrice] = useState(1000);  
  const [isLoading, setIsLoading] = useState(true);

  const fullText = "Travel To Any Corner In The World";  
  const typingSpeed = 100;  
  const backspacingSpeed = 50;  
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);  

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

  const debouncedHandleCityChange = useCallback(  
    debounce((value: string) => setCity(value), 300),  
    []  
  );  

  const handleCityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {  
    debouncedHandleCityChange(e.target.value);  
  };  

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {  
    setMaxPrice(Number(e.target.value));  
  };  

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {  
    setDate(e.target.value);  
  };  

  useEffect(() => {  
    const timer = setTimeout(() => {  
      setIsLoading(false);  
    }, 10000); 

    return () => clearTimeout(timer);  
  }, []);  

  if (isLoading) {  
    return <Loading />; 
  }  

  return (  
    <section className="relative w-full h-screen flex items-center justify-center" id="home">  
      <div className="absolute inset-0 bg-[#2f6a7f2f] z-10"></div>  
      <BackgroundVideo />  

      <div className="relative z-20 text-white md:mt-0 flex flex-col items-center text-center px-4 md:px-0 lg:w-full">  
        <p className="text-lg text-orange-500 mb-4 md:text-2xl">{typedText}</p>  
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-8">  
          Make Your Tour Amazing With Us  
        </h1>  
        <div>  
          <span className="bg-white medium-16 text-tertiary p-2 rounded-lg">  
            Search For Your Trip  
          </span>  
        </div>  

        <form  
          className="bg-white p-4 sm:p-6 rounded-lg text-start shadow-lg w-full sm:w-[49%] flex flex-col gap-4 sm:flex-row md:w-[83%]"  
          role="form"  
          aria-labelledby="search-form"  
        >  
          <h2 id="search-form" className="sr-only">  
            Search for your trip  
          </h2>  

          <div className="flex-1">  
            <label htmlFor="city" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">  
              Search your destination:  
            </label>  
            <div className="flex items-center bg-gray-100 rounded-md">  
              <input  
                type="text"  
                id="city"  
                className="flex-1 p-2 border-none rounded-l-md bg-transparent text-gray-700 border-gray-300 focus:outline-none focus:border-blue-500"  
                placeholder="Enter city..."  
                onChange={handleCityInputChange}  
              />  
              <IoLocation className="text-gray-500 mx-2" />  
            </div>  
          </div>  

          {/* Date Input */}  
          <div className="flex-1">  
            <label htmlFor="date" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">  
              Select your date:  
            </label>  
            <input  
              type="date"  
              id="date"  
              className="w-full p-2 border-none rounded-md bg-gray-100 text-gray-700 border-gray-300 focus:outline-none focus:border-blue-500"  
              value={date}  
              onChange={handleDateChange}  
            />  
          </div>  

          <div className="flex-1">  
            <label htmlFor="price" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">  
              Max price:  
            </label>  
            <input  
              type="range"  
              id="price"  
              max={5000}  
              min={1000}  
              className="w-full bg-gradient-to-r from-blue-500 to-blue-700"  
              value={maxPrice}  
              onChange={handleMaxPriceChange}  
              aria-label="Select maximum price"  
            />  
            <div className="text-gray-700 text-xs sm:text-sm mt-1">  
              Max Price: ${maxPrice}  
            </div>  
          </div>  
        </form>  
      </div>  
    </section>  
  );  
};  

export default Hero;