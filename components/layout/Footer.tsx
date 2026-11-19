"use client";

import React, { useState } from "react";
import Link from "next/link";
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
import { useTranslations } from "next-intl";
import { toast } from "sonner";

const Banner = "/footer-pattern.webp";

const socialLinks = [
  { name: "Instagram", href: "https://instagram.com", icon: FaInstagram },
  { name: "Facebook", href: "https://facebook.com", icon: FaFacebook },
  { name: "LinkedIn", href: "https://linkedin.com", icon: FaLinkedin },
];

const NewsletterSignup: React.FC = () => {
  const t = useTranslations("common");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentYear = new Date().getFullYear();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await new Promise((res) => setTimeout(res, 800));
      toast.success(t("footer.subscribedSuccess", { email }));
      setEmail("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full text-start">
      <h2 className="text-base font-bold mb-3">{t("footer.newsletterTitle")}</h2>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-2 w-full"
        aria-label={t("footer.newsletterFormAria")}
      >
        <input
          type="email"
          name="newsletter-email"
          aria-label={t("footer.newsletterPlaceholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("footer.newsletterPlaceholder")}
          className="flex-1 px-3 py-2 rounded-md text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-secondary dark:bg-gray-700 dark:text-gray-100"
          required
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-secondary hover:bg-secondary/90 text-white px-4 py-2 rounded-md transition-colors duration-300 text-sm disabled:opacity-50 font-medium"
        >
          {isSubmitting ? t("footer.subscribing") : t("footer.subscribe")}
        </button>
      </form>
      <p className="mt-4 text-xs text-gray-400">
        © {currentYear} {t("brand.name")}. {t("footer.copyright")}{" "}
        <Link href="/#" prefetch={false} className="text-secondary hover:underline">
          {t("footer.privacyPolicy")}
        </Link>
      </p>
    </div>
  );
};

const Footer: React.FC = () => {
  const t = useTranslations("common");
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (typeof document !== "undefined") {
      document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
      document.body.scrollTo({ top: 0, behavior: "smooth" });
      const main = document.querySelector("main");
      if (main) main.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const footerLinks = [
    { title: t("nav.home"), href: "/#" },
    { title: t("nav.about"), href: "/#about" },
    { title: t("nav.packages"), href: "/#feature" },
    { title: t("nav.blog"), href: "/blog" },
    { title: t("contactInfo.title"), href: "/#contact" },
  ];

  return (
    <footer
      className="relative w-full flex flex-col text-white bg-cover bg-bottom overflow-hidden text-start"
      style={{ backgroundImage: `url(${Banner})` }}
    >
      <div className="absolute inset-0 bg-black/60 -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row lg:justify-between gap-10">
          {/* Company Info */}
          <div className="flex flex-col flex-1">
            <Link
              href="/"
              className="flex items-center gap-2 mb-4"
              aria-label={t("footer.homeAria")}
            >
              <FaPlane className="text-secondary w-6 h-6 hover:rotate-45 transition-all duration-300" />
              <span className="text-lg font-bold">{t("brand.name")} — {t("brand.tagline")}</span>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed">
              {t("footer.description")}
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex-1">
            <h2 className="text-base font-bold mb-3">{t("footer.quickLinks")}</h2>
            <ul className="flex flex-col gap-2 text-sm">
              {footerLinks.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="text-gray-200 hover:text-secondary transition-all duration-300 inline-block"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="flex-1">
            <h2 className="text-base font-bold mb-3">{t("contactInfo.title")}</h2>
            <div className="flex items-center gap-3 mb-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t("footer.followUs", { platform: social.name })}
                    className="text-gray-200 hover:text-secondary transition-colors duration-300"
                  >
                    <Icon className="text-lg" />
                  </Link>
                );
              })}
            </div>

            <div className="space-y-2 text-sm text-gray-200">
              <div className="flex items-center gap-3">
                <FaLocationArrow className="text-secondary shrink-0" />
                <span>{t("contactInfo.address")}</span>
              </div>
              <div className="flex items-center gap-3">
                <FaMobileAlt className="text-secondary shrink-0" />
                <span className="dir-ltr">{t("contactInfo.phone")}</span>
              </div>
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-secondary shrink-0" />
                <Link
                  href={`mailto:${t("contactInfo.email")}`}
                  className="hover:text-secondary transition-colors duration-300"
                >
                  {t("contactInfo.email")}
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

      {/* Back to Top Button - Vertically aligned directly above FloatingAssistant */}
      <div className="fixed bottom-[88px] sm:bottom-[96px] end-6 sm:end-8 w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center pointer-events-none z-40 select-none">
        <button
          type="button"
          onClick={scrollToTop}
          className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center bg-secondary hover:bg-secondary/90 text-white rounded-full shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer pointer-events-auto"
          aria-label={t("footer.scrollToTop")}
        >
          <FaArrowUp className="w-4 h-4" />
        </button>
      </div>
    </footer>
  );
};

export default Footer;
