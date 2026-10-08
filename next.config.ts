import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.121", "192.168.8.120","172.18.180.149"],
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
  /**
   * ریدایرکت مسیرهای قدیمی ناحیه‌ی مهمان (`/my/*`) به ساختار جدید
   * (`/account/*`).
   *
   * ⚠️ ناحیه‌ی مهمان از `(main)` جدا و به گروه مسیر `(guest)` منتقل شد و
   * آدرس‌هایش هم تغییر کرد؛ این ریدایرکت‌ها لینک‌های قدیمی و بوکمارک‌ها را
   * زنده نگه می‌دارند. موقتی (307) هستند تا وقتی مطمئن شدیم چیزی به مسیر
   * قدیمی وابسته نیست، بتوان به 308 تغییرشان داد. پارامترهای query
   * (مثل `?status=`) خودکار منتقل می‌شوند.
   */
  async redirects() {
    return [
      { source: "/my", destination: "/account", permanent: false },
      {
        source: "/my/bookings",
        destination: "/account/bookings",
        permanent: false,
      },
      {
        source: "/my/account",
        destination: "/account/settings",
        permanent: false,
      },
      {
        source: "/my/favorites",
        destination: "/account/favorites",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
