/* eslint-disable react/jsx-no-duplicate-props */  
/* eslint-disable react/jsx-key */  
import React from "react";  
import { Link } from "react-scroll"; // Import the Link component for smooth scrolling  
import { LINKS } from "@/app/ulits/type"; // Ensure the path to your LINKS is correct  

// Type definition for the props of the Nav component  
type NavProps = {  
  linkStyles?: string;      // Link styles (optional)  
  containerStyles?: string; // Container styles (optional)  
  offset?: number;          // Optional offset for scroll position  
  duration?: number;        // Optional duration for scroll animation  
};  

// Default props  
const defaultProps = {  
  linkStyles: 'default-link-class', // Default styles for links  
  containerStyles: 'default-container-class', // Default container styles  
  offset: 0, // Default offset for scroll  
  duration: 500, // Default duration for scroll  
};  

const Nav: React.FC<NavProps> = ({  
  containerStyles,  
  linkStyles,  
  offset,  
  duration,  
}) => {  
  return (  
    <nav className={containerStyles} role="navigation" aria-label="Main Navigation">  
      {LINKS.map((link) => (  
        <Link  
          key={link.title}  
          to={link.path} // The path should match the ID of sections you want to scroll to  
          spy={true}  
          smooth={true}  
          duration={duration}  
          offset={offset} // Use the offset prop for smooth scrolling adjustment  
          activeClass="active"  
          className={linkStyles} // Apply styles to each link  
          role="link"  
          tabIndex={0} // Make the link focusable  
        >  
          {link.title}  
        </Link>  
      ))}  
    </nav>  
  );  
};  

// Set default props  
Nav.defaultProps = defaultProps;  

export default Nav;