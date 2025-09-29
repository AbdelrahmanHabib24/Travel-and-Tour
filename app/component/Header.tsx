"use client";
import Link from "next/link";
import React, { useEffect, useState, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import Nav from "@/app/component/Nav";
import { CiMenuFries } from "react-icons/ci";
import { IoCloseOutline } from "react-icons/io5";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import { fetchUser, logoutUser } from "@/store/userslice";
import Image from "next/image";

const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [active, setActive] = useState(false);
  const [menuOpened, setMenuOpened] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user);

  const toggleMenu = useCallback(() => setMenuOpened(prev => !prev), []);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    router.push("/Login");
  };

  useEffect(() => {
    const handleScroll = () => setActive(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!user.isLoggedIn) {
      dispatch(fetchUser());
    }
  }, [dispatch, user.isLoggedIn, pathname]);

  const handleNavigate = (path: string) => router.push(path);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        active ? "bg-white shadow-lg py-3" : "bg-opacity-70 py-4"
      }`}
    >
      <div className="max_padd_container flex justify-between items-center gap-x-6">
        {/* Logo */}
        <Link href="/">
          <Image src="/logo.svg" alt="Go to homepage" width={133} height={99} />
        </Link>

        {/* Desktop Navigation */}
        <Nav
          containerStyles="hidden lg:flex items-center gap-x-10"
          linkStyles="hover:text-secondary cursor-pointer text-tertiary"
        />

        {/* Actions */}
        <div className="flex items-center gap-x-6 lg:gap-x-12">
          {user.isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-orange-500 text-white rounded-lg py-1 px-2 md:px-3 text-sm md:text-lg hover:text-tertiary transform hover:scale-105 transition-all duration-300"
            >
              Log out
            </button>
          ) : (
            <>
              <button
                onClick={() => handleNavigate("/SignUp")}
                className="bg-secondary text-white rounded-lg py-1 px-2 md:px-3 text-sm md:text-lg hover:text-tertiary transform hover:scale-105 transition-all duration-300"
              >
                Signup
              </button>
              {pathname !== "/Login" && (
                <button
                  onClick={() => handleNavigate("/Login")}
                  className="bg-secondary text-white rounded-lg py-1 px-2 md:px-3 text-sm md:text-lg hover:text-tertiary transition-all duration-300"
                >
                  Login
                </button>
              )}
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div
          role="button"
          aria-expanded={menuOpened}
          aria-label="Toggle menu"
          tabIndex={0}
          onClick={toggleMenu}
          onKeyDown={(e) => e.key === "Enter" && toggleMenu()}
          className="lg:hidden cursor-pointer transition-all duration-500"
        >
          {menuOpened ? <IoCloseOutline /> : <CiMenuFries />}
        </div>

        {/* Mobile Menu */}
        {menuOpened && (
          <div className="absolute top-14 right-1 bg-white shadow-lg rounded-lg z-50 transition-all duration-500 mt-3">
            <Nav
              containerStyles="flex flex-col items-center py-8 gap-y-6 px-6"
              linkStyles="hover:text-secondary cursor-pointer text-tertiary"
            />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
