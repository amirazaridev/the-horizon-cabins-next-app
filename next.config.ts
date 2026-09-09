import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.121", "192.168.8.148"],
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
};

export default nextConfig;
