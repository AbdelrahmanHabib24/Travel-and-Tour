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

const footerLinks = [
  { title: "Home", href: "/#" },
  { title: "About", href: "/#about" },
  { title: "Services", href: "/#services" },
  { title: "Blog", href: "/#blog" },
  { title: "Contact", href: "/#contact" },
];

const socialLinks = [
  { name: "Instagram", href: "https://instagram.com", icon: FaInstagram },
  { name: "Facebook", href: "https://facebook.com", icon: FaFacebook },
  { name: "LinkedIn", href: "https://linkedin.com", icon: FaLinkedin },
];

const contactInfo = {
  location: "Egypt, Alexandria",
  phone: "+201023289634",
  email: "abdelrahmanhabib502@gmail.com",
};

const NewsletterSignup: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentYear = new Date().getFullYear();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await new Promise((res) => setTimeout(res, 1000));
      alert(`Thank you for subscribing with ${email}!`);
      setEmail("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-base font-bold mb-3">Subscribe to Our Newsletter</h2>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-2 w-full"
        aria-label="Newsletter form"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="flex-1 px-3 py-2 rounded-md text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-gray-100"
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
      <p className="mt-4 text-xs text-gray-400">
        © {currentYear} Travel. All rights reserved.{" "}
        <Link href="/privacy-policy" className="text-blue-400 hover:underline">
          Privacy Policy
        </Link>
      </p>
    </div>
  );
};

const Footer: React.FC = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer
      className="relative w-full flex flex-col text-white bg-cover bg-bottom overflow-hidden"
      style={{ backgroundImage: `url(${Banner})` }}
    >
      <div className="absolute inset-0 bg-black/50 -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row lg:justify-between gap-10">
          {/* Company Info */}
          <div className="flex flex-col flex-1">
            <Link
              href="/"
              className="flex items-center gap-2 mb-4"
              aria-label="Travel Home"
            >
              <FaPlane className="text-gray-200 w-6 h-6 hover:text-blue-400 hover:rotate-45 transition-all duration-300" />
              <h1 className="text-lg font-bold">Travel</h1>
            </Link>
            <p className="text-gray-300 text-sm">
              Explore the world&#39;s most amazing destinations with us. Book
              your dream trip and enjoy exclusive offers, reliable service, and
              unforgettable experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex-1">
            <h2 className="text-base font-bold mb-3">Quick Links</h2>
            <ul className="flex flex-col gap-2 text-sm">
              {footerLinks.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="text-gray-200 hover:text-blue-400 hover:translate-x-1 transition-all duration-300"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="flex-1">
            <h2 className="text-base font-bold mb-3">Contact Us</h2>
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

            <div className="space-y-2 text-sm text-gray-200">
              <div className="flex items-center gap-3">
                <FaLocationArrow />
                <span>{contactInfo.location}</span>
              </div>
              <div className="flex items-center gap-3">
                <FaMobileAlt />
                <span>{contactInfo.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <FaEnvelope />
                <Link
                  href={`mailto:${contactInfo.email}`}
                  className="hover:text-blue-400 transition-colors duration-300"
                >
                  {contactInfo.email}
                </Link>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="flex-1 w-full sm:w-auto">
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
        <FaArrowUp />
      </button>
    </footer>
  );
};

export default Footer;
