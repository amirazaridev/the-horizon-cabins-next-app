import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const iranYekan = localFont({
  src: [
    {
      path: "./font/IRANYekanXFaNum-Thin.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "./font/IRANYekanXFaNum-UltraLight.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "./font/IRANYekanXFaNum-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./font/IRANYekanXFaNum-Regular.woff2",
      weight: "400", // یا 'normal'
      style: "normal",
    },
    {
      path: "./font/IRANYekanXFaNum-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./font/IRANYekanXFaNum-DemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./font/IRANYekanXFaNum-Bold.woff2",
      weight: "700", // یا 'bold'
      style: "normal",
    },
    {
      path: "./font/IRANYekanXFaNum-ExtraBold.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "./font/IRANYekanXFaNum-Black.woff2",
      weight: "900",
      style: "normal",
    },
    {
      path: "./font/IRANYekanXFaNum-ExtraBlack.woff2",
      weight: "950",
      style: "normal",
    },
    {
      path: "./font/IRANYekanXFaNum-Heavy.woff2",
      weight: "1000",
      style: "normal",
    },
  ],
  variable: "--font-iranyekan",
  display: "swap",
});

export const metadata: Metadata = {
  title: "هورایزن کابینز | ویلای لوکس",
  description:
    "از شلوغی شهر فاصله بگیرید و در دل طبیعت، لوکس بودن را تجربه کنید.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${iranYekan.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">{children}</body>
    </html>
  );
}
