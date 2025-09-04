"use client"; 
import Link from "next/link";
import { useEffect } from "react";
import { LINKS } from "@/app/ulits/type"; 
import AOS from "aos"; 
import "aos/dist/aos.css";

type NavProps = {
  linkStyles?: string;
  containerStyles?: string;
};



const Nav: React.FC<NavProps> = ({
  containerStyles = "default-container-class",
  linkStyles = "default-link-class",
}) => {
  useEffect(() => {
    AOS.init({
      duration: 600,
      once: true,
      offset: 100,
    });
  }, []);

  return (
    <nav className={containerStyles} role="navigation" aria-label="Main Navigation">
      {LINKS.map((link, index) => (
        <Link
          key={link.title}
          href={link.path}
          className={linkStyles}
          role="link"
          data-aos="fade-right"
          data-aos-delay={index * 100}
        >
          {link.title}
        </Link>
      ))}
    </nav>
  );
};



export default Nav;