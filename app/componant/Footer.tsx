import React from 'react';  
import Link from 'next/link';  
import '@fortawesome/fontawesome-free/css/all.min.css';
interface FooterLinkProps {  
  href: string; // Define href type as string  
  children: React.ReactNode; // Define children type  
}  

const FooterLink: React.FC<FooterLinkProps> = ({ href, children }) => (  
  <li>  
    <Link href={href} className="hover:text-orange-500 transition duration-300">  
      {children}  
    </Link>  
  </li>  
);  

const Footer: React.FC = () => {  
  const currentYear = new Date().getFullYear();  

  return (  
    <footer className="bg-gray-800 text-white">  
      <div className="max_padd_container py-6">  
        <div className="flex flex-col sm:flex-row sm:justify-between md:text-center lg:text-center lg:mr-10 lg:gap-28 sm:flexStart sm:mx-5">  
          <div className="flex-1">  
            <h4 className="text-lg text-secondary font-semibold pb-2">Quick Links</h4>  
            <ul>  
              <FooterLink href="#about">About Us</FooterLink>  
              <FooterLink href="#services">Services</FooterLink>  
              <FooterLink href="#contact">Contact</FooterLink>  
              <FooterLink href="#privacy">Privacy Policy</FooterLink>  
            </ul>  
          </div>  
          <div className="flex-1">  
            <h4 className="text-lg text-secondary font-semibold pb-2">Learn More</h4>  
            <ul>  
              <FooterLink href="#faq">FAQ</FooterLink>  
              <FooterLink href="#blog">Blog</FooterLink>  
              <FooterLink href="#testimonials">Testimonials</FooterLink>  
              <FooterLink href="#resources">Resources</FooterLink>  
            </ul>  
          </div>  
          <div className="flex-1">  
            <h4 className="text-lg text-secondary font-semibold pb-2">Community</h4>  
            <ul>  
              <FooterLink href="#events">Events</FooterLink>  
              <FooterLink href="#forum">Forum</FooterLink>  
              <FooterLink href="#volunteer">Volunteer</FooterLink>  
              <FooterLink href="#support">Support Us</FooterLink>  
            </ul>  
          </div>  
          <div className="flex-1">  
            <h4 className="text-lg text-secondary font-semibold pb-2">Follow Us</h4>  
            <ul>  
              <li>  
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition duration-300" aria-label="Facebook">  
                  Facebook  
                </a>  
              </li>  
              <li>  
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition duration-300" aria-label="Twitter">  
                  Twitter  
                </a>  
              </li>  
              <li>  
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition duration-300" aria-label="Instagram">  
                  Instagram  
                </a>  
              </li>  
              <li>  
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition duration-300" aria-label="LinkedIn">  
                  LinkedIn  
                </a>  
              </li>  
            </ul>  
          </div>  
        </div>  
      </div>  
      <hr />  
      <div className="bg-gray-800 py-4 flex text-center gap-x-6 justify-center items-center">  
    <p className="text-center  justify-center flex">&copy; {currentYear} Passport. All rights reserved.</p>  
    
</div>
    </footer>  
  );  
};  

export default Footer;