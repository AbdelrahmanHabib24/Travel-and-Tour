/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    qualities: [75, 90],
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "i.pravatar.cc" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.pixabay.com" },
      { protocol: "https", hostname: "your-image-host.com", pathname: "/path/to/image/**" },
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

module.exports = nextConfig;
