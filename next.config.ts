import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: "/uploads/**",
      },
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "blog.securemango.com",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
