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
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // حداکثر حجم برای پردازش (به بایت)
  },
};

export default nextConfig;
