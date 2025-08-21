/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Link from "next/link";
import { useState } from "react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaLocationArrow,
  FaMobileAlt,
  FaArrowUp,
  FaEnvelope,
  FaPlane,
} from "react-icons/fa";

const Banner = "/footer-pattern.jpg"; 

interface FooterLink {
  title: string;
  href: string;
}

interface SocialLink {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

// Footer Links Data
const footerLinks: FooterLink[] = [
  { title: "Home", href: "/#" },
  { title: "About", href: "/#about" },
  { title: "Contact", href: "/#contact" },
  { title: "Blog", href: "/#blog" },
];

// Social Media Links Data
const socialLinks: SocialLink[] = [
  { name: "Instagram", href: "https://instagram.com", icon: FaInstagram },
  { name: "Facebook", href: "https://facebook.com", icon: FaFacebook },
  { name: "LinkedIn", href: "https://linkedin.com", icon: FaLinkedin },
];

// Contact Information
const contactInfo = {
  location: "Noida, Uttar Pradesh",
  phone: "+91 123456789",
  email: "support@shopsy.com",
};

// CSS Keyframes for Zoom-In Animation
const styles = `
  @keyframes zoomIn {
    from { opacity: 0; transform: scale(0.8); }
    to { opacity: 1; transform: scale(1); }
  }
  .zoom-in {
    opacity: 0;
    animation: zoomIn 800ms ease-out forwards;
  }
`;

// Newsletter Signup Component
const NewsletterSignup: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const currentYear = new Date().getFullYear();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate an API call (replace with actual API integration)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert(`Thank you for subscribing with ${email}!`);
      setEmail("");
    } catch (error) {
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-base font-bold mb-3 text-left">
        Subscribe to Our Newsletter
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="flex-1 px-3 py-2 rounded-md text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-gray-100"
          aria-label="Email for newsletter subscription"
          required
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-300 text-sm disabled:opacity-50"
        >
          {isSubmitting ? "Subscribing..." : "Subscribe"}
        </button>
      </form>
      {/* Copyright and Privacy Policy */}
      <div className="mt-4 text-xs text-gray-400">
        <p>
          © {currentYear} Travel. All rights reserved.{" "}
          <Link href="/privacy-policy" className="text-blue-400 hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
};

const Footer: React.FC = () => {
  // Function to scroll to the top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Inject CSS keyframes */}
      <style>{styles}</style>
      <footer
        className="relative flex flex-col text-white bg-cover overflow-hidden bg-bottom bg-no-repeat bg-gray-900"
        style={{ backgroundImage: `url(${Banner})` }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50 -z-10" />

        <div className="max_padd_container mx-auto px-4 py-8">
          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 zoom-in"
          >
            {/* Company Details */}
            <div className="flex flex-col text-left">
              <Link
                href="/"
                className="flex items-center gap-2 mb-4"
                aria-label="Travel Home"
              >
                <FaPlane className="text-gray-200 w-6 h-6 hover:text-blue-400 hover:rotate-45 transition-all duration-300" />
                <h1 className="text-lg font-bold">Travel</h1>
              </Link>
              <p className="text-gray-300 text-sm">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum in
                beatae ea recusandae blanditiis veritatis.
              </p>
            </div>

            {/* Important Links */}
            <div>
              <h2 className="text-base font-bold mb-3 text-left">
                Important Links
              </h2>
              <ul className="flex flex-col gap-2">
                {footerLinks.map((link) => (
                  <li key={link.title}>
                    <Link
                      href={link.href}
                      className="text-gray-200 hover:text-blue-400 hover:translate-x-1 transition-all duration-300 text-sm"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Links */}
            <div>
              <h2 className="text-base font-bold mb-3 text-left">Links</h2>
              <ul className="flex flex-col gap-2">
                {footerLinks.map((link) => (
                  <li key={link.title}>
                    <Link
                      href={link.href}
                      className="text-gray-200 hover:text-blue-400 hover:translate-x-1 transition-all duration-300 text-sm"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact and Social Links */}
            <div>
              {/* Social Media Links */}
              <div className="flex items-center gap-3 mb-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <Link
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Follow us on ${social.name}`}
                      className="text-gray-200 hover:text-blue-400 transition-colors duration-300"
                    >
                      <Icon className="text-lg" />
                    </Link>
                  );
                })}
              </div>

              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <FaLocationArrow className="text-sm" />
                  <p className="text-gray-200 text-sm">{contactInfo.location}</p>
                </div>
                <div className="flex items-center gap-3">
                  <FaMobileAlt className="text-sm" />
                  <p className="text-gray-200 text-sm">{contactInfo.phone}</p>
                </div>
                <div className="flex items-center gap-3">
                  <FaEnvelope className="text-sm" />
                  <Link
                    href={`mailto:${contactInfo.email}`}
                    className="text-gray-200 hover:text-blue-400 transition-colors duration-300 text-sm"
                  >
                    {contactInfo.email}
                  </Link>
                </div>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div>
              <NewsletterSignup />
            </div>
          </div>
        </div>

        {/* Back to Top Button */}
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 hover:scale-110 transition-all duration-300"
          aria-label="Scroll to top"
        >
          <FaArrowUp className="text-base" />
        </button>
      </footer>
    </>
  );
};

export default Footer;