import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.121", "192.168.8.148","172.18.180.149"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hmkleisvyqlrgdkvhmdp.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/cabins_images/**",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", 
    },
  },
};

export default nextConfig;
