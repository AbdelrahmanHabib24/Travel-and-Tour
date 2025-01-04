/* eslint-disable @next/next/no-img-element */  
"use client";  
import Link from "next/link";  
import React, { useEffect, useState, useCallback } from "react";  
import Nav from "@/app/componant/Nav"; // Ensure this path is correct  
import { CiMenuFries } from "react-icons/ci";  
import { IoCloseOutline } from "react-icons/io5";  

const Header = () => {  
  const [active, setActive] = useState(false);  
  const [menuOpened, setMenuOpened] = useState(false);  

  const toggleMenu = useCallback(() => {  
    setMenuOpened(prevState => !prevState);  
  }, []);  

  useEffect(() => {  
    const handleScroll = () => setActive(window.scrollY > 40);  
    window.addEventListener("scroll", handleScroll);  
    return () => window.removeEventListener("scroll", handleScroll);  
  }, []);  

  return (  
    <header className={`${active ? "bg-white shadow-lg py-3" : "bg-opacity-70 py-4"} fixed right-0 left-0 top-0 w-full z-50 transition-all duration-500`}>  
      <div className="max_padd_container flexBetween transition-all duration-500 ">  
        <Link href="./">  
          <img src="/logo.svg" alt="Logo" height={99} width={133} />  
        </Link>  

        <Nav   
          containerStyles="hidden lg:flex item-center mr-20 text-center justify-between gap-x-12"   
          linkStyles="hover:text-secondary cursor-pointer text-tertiary"   
        />  

        <button className="bg-secondary hover:text-tertiary text-xl text-white rounded-lg py-1 px-4">  
          login  
        </button>  

        <div   
          onClick={toggleMenu}   
          role="button"   
          aria-expanded={menuOpened}   
          aria-label="Toggle menu"   
          className="transition-all duration-500 lg:hidden cursor-pointer"  
          tabIndex={0} // Allow keyboard navigation  
          onKeyDown={(e) => e.key === 'Enter' && toggleMenu()} // Support keyboard navigation  
        >  
          {menuOpened ? <IoCloseOutline className="transition-all duration-500" /> : <CiMenuFries className="transition-all duration-500"/>}   
        </div>  

        {menuOpened && (  
          <div className="absolute bg-white shadow-lg rounded-lg right-[0.5%] top-14 z-50 transition-all duration-500 mt-3">  
            <Nav   
              containerStyles="flexCenter transition-all duration-500 py-8 gap-y-6 px-6 flex-col"   
              linkStyles="hover:text-secondary cursor-pointer text-tertiary"   
            />  
          </div>  
        )}  
      </div>  
    </header>  
  );  
};  

export default Header;