import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./lib/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  images: {
    qualities: [75, 90],
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "i.pravatar.cc" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.pixabay.com" },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/:path*.jpg',
        destination: '/:path*.webp',
      },
      {
        source: '/:path*.jpeg',
        destination: '/:path*.webp',
      },
      {
        source: '/:path*.png',
        destination: '/:path*.webp',
      },
    ];
  },
};

export default withNextIntl(nextConfig);
