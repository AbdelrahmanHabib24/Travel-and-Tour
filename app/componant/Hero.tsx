"use client";  

import React, { useEffect, useState, useRef } from "react";  
import { IoLocation } from "react-icons/io5";  
import { useRouter } from "next/navigation";  
import BackgroundVideo from "./BackgroundVideo";  

const cities = ["Italy", "France",  "Australia" , "Hong Kong" , "Brazil" , "London" , "Indonesia" , "Switzerland","India"

]; 



const Hero: React.FC = () => {  
  const [typedText, setTypedText] = useState("");  
  const [city, setCity] = useState("");  
  const [date, setDate] = useState("");  
  const [maxPrice, setMaxPrice] = useState(1000);  
  const fullText = "Travel To Any Corner In The World";  
  const typingSpeed = 100;  
  const backspacingSpeed = 50;  
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);  
  const router = useRouter();  

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
  };  

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {  
    setDate(event.target.value);  
  };  

  const handleMaxPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {  
    setMaxPrice(Number(event.target.value));  
  };  

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {  
    event.preventDefault();  
    router.push(`/results?city=${city}&&maxPrice=${maxPrice}`);  
  };  

  return (  
    <section className="relative w-full h-screen flexCenter" id="home">  
      <div className="absolute inset-0 bg-[#2f6a7f2f] z-10"></div>  
      <BackgroundVideo />  

      <div className="relative max_padd_container z-20 text-white md:mt-0 flex flex-col justify-center gap-10 text-center px-10 w-full">  
        <p className="text-lg text-orange-500 md:text-2xl">{typedText}</p>  
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold sm:mb-4">  
          Make Your Tour Amazing With Us  
        </h1>  
        <div>  
          <span className="bg-white medium-16 text-tertiary p-2 rounded-lg">  
            Search For Your Trip  
          </span>  

          <form  
            className="bg-white p-4 sm:p-6 rounded-lg text-start shadow-lg w-full sm:w-[49%] flex flex-col justify-center gap-4 sm:flex-row md:w-[100%]"  
            role="form"  
            aria-labelledby="search-form"  
            onSubmit={handleSearch}  
          >  
            <h2 id="search-form" className="sr-only">  
              Search for your trip  
            </h2>  

            {/* قائمة اختيار المدينة بدلاً من حقل النص */}  
            <div className="flex-1">  
              <label htmlFor="city" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">  
                Select your destination:  
              </label>  
              <div className="flex items-center bg-gray-100 rounded-md">  
                <select  
                  id="city"  
                  className="flex-1 p-2 border-none rounded-md bg-transparent text-gray-700 border-gray-300 focus:outline-none focus:border-blue-500"  
                  value={city}  
                  onChange={handleCityChange}  
                >  
                  <option value="">Select a city...</option>  
                  {cities.map((cityName) => (  
                    <option key={cityName} value={cityName}>{cityName}</option>  
                  ))}  
                </select>  
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

            {/* Max Price Input */}  
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

            <button  
              type="submit"  
              className="bg-blue-500 text-white py-2 rounded-md px-4 flexCenter hover:bg-blue-600 transition "  
            >  
              Search  
            </button>

          </form>  
        </div>  
      </div>  
    </section>  
  );  
};  

export default Hero;