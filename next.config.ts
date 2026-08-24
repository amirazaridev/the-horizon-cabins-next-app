import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.121","192.168.8.148"],
  
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**", // یا مسیر دقیق‌تر مثل '/photo-*/**'
      },
    ],
  },
};

export default nextConfig;
