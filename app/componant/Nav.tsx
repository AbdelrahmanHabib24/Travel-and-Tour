/* eslint-disable react/jsx-no-duplicate-props */  
/* eslint-disable react/jsx-key */  
import React from "react";  
import Link from "next/link"; // Importing Next.js Link component  
import { LINKS } from "@/app/ulits/type"; // Ensure the path to your LINKS is correct  

type NavProps = {  
  linkStyles?: string;      
  containerStyles?: string; 
};  

// Default props  
const defaultProps = {  
  linkStyles: 'default-link-class', 
  containerStyles: 'default-container-class',
};  

const Nav: React.FC<NavProps> = ({  
  containerStyles,  
  linkStyles,  
}) => {  
  return (  
    <nav className={containerStyles} role="navigation" aria-label="Main Navigation">  
      {LINKS.map((link) => (  
        <Link key={link.title} href={link.path} passHref> {/* Using Next.js Link for routing */}  
          <a className={linkStyles} role="link"> {/* Anchor tag required for better accessibility */}  
            {link.title}  
          </a>  
        </Link>  
      ))}  
    </nav>  
  );  
};  

Nav.defaultProps = defaultProps;  

export default Nav;