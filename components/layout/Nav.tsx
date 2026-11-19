"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import AOS from "aos";
import "aos/dist/aos.css";
import { useTranslations } from "next-intl";

type NavProps = {
  linkStyles?: string;
  containerStyles?: string;
};

const Nav: React.FC<NavProps> = ({
  containerStyles = "default-container-class",
  linkStyles = "default-link-class",
}) => {
  const t = useTranslations("common");

  useEffect(() => {
    AOS.init({
      duration: 600,
      once: true,
      offset: 100,
    });
  }, []);

  const navLinks = [
    { title: t("nav.home"), path: "/" },
    { title: t("nav.about"), path: "/about" },
    { title: t("nav.blog"), path: "/blog" },
    { title: t("nav.packages"), path: "/#feature" },
    { title: t("nav.testimonials"), path: "/#testimonials" },
  ];

  return (
    <nav className={containerStyles} role="navigation" aria-label={t("nav.mainNavAria")}>
      {navLinks.map((link, index) => (
        <Link
          key={link.path + link.title}
          href={link.path}
          className={linkStyles}
          role="link"
          data-aos="fade-down"
          data-aos-delay={index * 100}
        >
          {link.title}
        </Link>
      ))}
    </nav>
  );
};

export default Nav;
