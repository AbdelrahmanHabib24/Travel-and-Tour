/* eslint-disable @next/next/no-img-element */  
"use client";  
import Link from "next/link";  
import React, { useEffect, useState, useCallback } from "react";  
import { usePathname, useRouter } from "next/navigation";  
import Nav from "@/app/componant/Nav";  
import { CiMenuFries } from "react-icons/ci";  
import { IoCloseOutline } from "react-icons/io5";  

const Header = () => {  
  const pathname = usePathname();  
  const router = useRouter();  
  const [active, setActive] = useState(false);  
  const [menuOpened, setMenuOpened] = useState(false);  
  const [isLoggedIn, setIsLoggedIn] = useState(false);  

  const toggleMenu = useCallback(() => {  
    setMenuOpened((prevState) => !prevState);  
  }, []);  

  const handleLogout = () => {  
    document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";   
    setIsLoggedIn(false); 
    router.push("/Login");   
  };  

  useEffect(() => {  
    const handleScroll = () => setActive(window.scrollY > 40);  
    window.addEventListener("scroll", handleScroll);  
    return () => window.removeEventListener("scroll", handleScroll);  
  }, []);  

  useEffect(() => {  
    const authToken = document.cookie.split("; ").find((row) => row.startsWith("authToken="));  
    setIsLoggedIn(!!authToken); 
  }, [pathname]);  

  const handleSignUpClick = () => router.push("/SignUp");  
  const handleLoginClick = () => router.push("/Login");  

  return (  
    <header  
      className={`${  
        active ? "bg-white shadow-lg py-3" : "bg-opacity-70 py-4"  
      } fixed right-0 left-0 top-0 w-full z-50 transition-all duration-500`}  
    >  
      <div className="max_padd_container flex justify-between gap-x-6 items-center transition-all duration-500">  
        <Link href="/" style={{ display: "block" }}>  
          <img  
            src="/logo.svg"  
            alt="Go to the homepage"  
            height={99}  
            width={133}  
          />  
        </Link>  

        <Nav  
          containerStyles="hidden lg:flex items-center text-center justify-between gap-x-10"  
          linkStyles="hover:text-secondary cursor-pointer text-tertiary"  
        />  
        <div className="flex items-center lg:gap-x-12 gap-x-10 md:gap-x-32">  
          {isLoggedIn ? (  
            <button  
              onClick={handleLogout}  
              className="bg-orange-500 text-white text-sm md:text-lg rounded-lg py-1 px-2 md:px-2 hover:text-tertiary transform hover:scale-105 transition-all duration-300"  
            >  
              Log out  
            </button>  
          ) : (  
            <>  
              <button  
                onClick={handleSignUpClick}  
                className="bg-secondary text-white text-sm md:text-lg rounded-lg py-1 px-2 md:px-2 hover:text-tertiary transform hover:scale-105 transition-all duration-300"  
              >  
                Signup  
              </button>  
              {pathname !== "/Login" && (  
                <button  
                  onClick={handleLoginClick}  
                  className="bg-secondary text-white text-sm md:text-lg rounded-lg py-1 px-2 md:px-2 hover:text-tertiary  transition-all duration-300"  
                >  
                  Login  
                </button>  
              )}  
            </>  
          )}  
        </div>  

        <div  
          onClick={toggleMenu}  
          role="button"  
          aria-expanded={menuOpened}  
          aria-label="Toggle menu"  
          className="transition-all duration-500 lg:hidden cursor-pointer"  
          tabIndex={0}  
          onKeyDown={(e) => e.key === "Enter" && toggleMenu()}  
        >  
          {menuOpened ? (  
            <IoCloseOutline className="transition-all duration-500" />  
          ) : (  
            <CiMenuFries className="transition-all duration-500" />  
          )}  
        </div>  

        {menuOpened && (  
          <div className="absolute bg-white shadow-lg rounded-lg right-1 top-14 z-50 transition-all duration-500 mt-3">  
            <Nav  
              containerStyles="flex flex-col items-center transition-all duration-500 py-8 gap-y-6 px-6"  
              linkStyles="hover:text-secondary cursor-pointer text-tertiary"  
            />  
          </div>  
        )}  
      </div>  
    </header>  
  );  
};  

export default Header;  