"use client";
import Link from "next/link";
import React, { useEffect, useState, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import Nav from "@/components/layout/Nav";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import { CiMenuFries } from "react-icons/ci";
import { IoCloseOutline } from "react-icons/io5";
import { useAuth } from "@/features/auth/hooks/useAuth";
import Image from "next/image";
import { useTranslations } from "next-intl";

const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [active, setActive] = useState(false);
  const [menuOpened, setMenuOpened] = useState(false);
  const t = useTranslations("common");

  const { user, logout } = useAuth();

  const toggleMenu = useCallback(() => setMenuOpened((prev) => !prev), []);

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      router.push("/Login");
    }
  };

  useEffect(() => {
    const handleScroll = () => setActive(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavigate = (path: string) => router.push(path);

  return (
    <header
      className={`fixed top-0 start-0 end-0 z-50 transition-all duration-300 ${
        active ? "bg-white shadow-md py-3" : "bg-transparent py-4"
      }`}
    >
      <div className="max_padd_container flex justify-between items-center gap-x-4 md:gap-x-6">
        {/* Logo */}
        <Link href="/">
          <Image src="/logo.svg" alt={t("nav.logoAlt")} width={133} height={99} priority />
        </Link>

        {/* Desktop Navigation */}
        <Nav
          containerStyles="hidden lg:flex items-center gap-x-8 xl:gap-x-10"
          linkStyles="hover:text-secondary cursor-pointer text-tertiary font-medium transition-colors"
        />

        {/* Actions & Language Switch */}
        <div className="flex items-center gap-x-3 md:gap-x-4 lg:gap-x-6">
          {/* Minimalist Globe Language Switcher */}
          <LanguageSwitcher />

          {user.isLoggedIn ? (
            <button
              type="button"
              onClick={handleLogout}
              className="bg-orange-500 text-white rounded-lg py-1 px-3 md:px-4 text-sm md:text-base hover:bg-orange-600 transform hover:scale-105 transition-all duration-300"
            >
              {t("nav.logout")}
            </button>
          ) : (
            <>
              {pathname !== "/Login" && (
                <button
                  type="button"
                  onClick={() => handleNavigate("/Login")}
                  className="hidden sm:inline-flex bg-white border border-secondary text-secondary rounded-lg py-1 px-3 md:px-4 text-sm md:text-base hover:bg-secondary hover:text-white transition-all duration-300 font-medium"
                >
                  {t("nav.login")}
                </button>
              )}
              <button
                type="button"
                onClick={() => handleNavigate("/SignUp")}
                className="hidden sm:inline-flex bg-secondary text-white rounded-lg py-1 px-3 md:px-4 text-sm md:text-base hover:bg-secondary/90 transform hover:scale-105 transition-all duration-300 font-medium"
              >
                {t("nav.signup")}
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          aria-expanded={menuOpened}
          aria-label={t("nav.toggleMenu")}
          onClick={toggleMenu}
          className="lg:hidden cursor-pointer transition-all duration-500 text-2xl"
        >
          {menuOpened ? <IoCloseOutline /> : <CiMenuFries />}
        </button>

        {/* Mobile Menu */}
        {menuOpened && (
          <div className="absolute top-16 end-4 bg-white shadow-xl rounded-2xl z-50 transition-all duration-500 min-w-[220px] border border-gray-100">
            <Nav
              containerStyles="flex flex-col items-center py-6 gap-y-4 px-6"
              linkStyles="hover:text-secondary cursor-pointer text-tertiary font-medium"
            />
            <div className="flex flex-col items-center gap-y-3 pb-6 px-6 border-t border-gray-100 pt-4">
              {user.isLoggedIn ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  {t("nav.logout")}
                </button>
              ) : (
                <div className="flex flex-col gap-y-2 w-full">
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpened(false);
                      handleNavigate("/Login");
                    }}
                    className="w-full text-center text-sm py-1.5 rounded-lg border border-secondary text-secondary"
                  >
                    {t("nav.login")}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpened(false);
                      handleNavigate("/SignUp");
                    }}
                    className="w-full text-center text-sm py-1.5 rounded-lg bg-secondary text-white"
                  >
                    {t("nav.signup")}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
