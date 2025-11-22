import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.barbudaleisure.com',
      },
    ],
  },
};

export default nextConfig;
