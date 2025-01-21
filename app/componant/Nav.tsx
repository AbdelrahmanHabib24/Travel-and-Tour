/* eslint-disable react/jsx-no-duplicate-props */  
/* eslint-disable react/jsx-key */  
import React from "react";  
import Link from "next/link"; // Importing Next.js Link component  
import { LINKS } from "@/app/ulits/type"; // Ensure the path to your LINKS is correct  

// Type definition for the props of the Nav component  
type NavProps = {  
  linkStyles?: string;      // Link styles (optional)  
  containerStyles?: string; // Container styles (optional)  
};  

// Default props  
const defaultProps = {  
  linkStyles: 'default-link-class', // Default styles for links  
  containerStyles: 'default-container-class', // Default container styles  
};  

const Nav: React.FC<NavProps> = ({  
  containerStyles,  
  linkStyles,  
}) => {  
  return (  
    <nav className={containerStyles} role="navigation" aria-label="Main Navigation">  
      {LINKS.map((link) => (  
        <Link key={link.title} href={link.path} passHref> {/* Using Next.js Link for routing */}  
          <a className={linkStyles} role="link" tabIndex={0}> {/* Anchor tag required for better accessibility */}  
            {link.title}  
          </a>  
        </Link>  
      ))}  
    </nav>  
  );  
};  

// Set default props  
Nav.defaultProps = defaultProps;  

export default Nav;