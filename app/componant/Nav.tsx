"use client"; // Ensure this is a client component since we're using useEffect
import Link from "next/link";
import { useEffect } from "react";
import { LINKS } from "@/app/ulits/type"; // Make sure this path is correct
import AOS from "aos"; // Import AOS
import "aos/dist/aos.css"; // Import AOS CSS

type NavProps = {
  linkStyles?: string;
  containerStyles?: string;
};

const defaultProps = {
  linkStyles: "default-link-class",
  containerStyles: "default-container-class",
};

const Nav: React.FC<NavProps> = ({ containerStyles, linkStyles }) => {
  // Initialize AOS on component mount
  useEffect(() => {
    AOS.init({
      duration: 600, // Animation duration in milliseconds
      once: true, // Whether animation should happen only once
      offset: 100, // Offset (in pixels) from the top of the element to trigger the animation
    });
  }, []);

  return (
    <nav
      className={containerStyles}
      role="navigation"
      aria-label="Main Navigation"
    >
      {LINKS.map((link, index) => (
        <Link
          key={link.title}
          href={link.path}
          className={linkStyles}
          role="link"
          data-aos="fade-right" // AOS animation type
          data-aos-delay={index * 100} // Delay each link's animation (e.g., 0ms, 100ms, 200ms, etc.)
        >
          {link.title}
        </Link>
      ))}
    </nav>
  );
};

Nav.defaultProps = defaultProps;

export default Nav;