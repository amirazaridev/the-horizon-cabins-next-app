import localFont from "next/font/local";

const fonts = localFont({
  src: [
    {
      path: "../assets/fonts/IRANYekanXFaNum-Thin.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "../assets/fonts/IRANYekanXFaNum-UltraLight.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "../assets/fonts/IRANYekanXFaNum-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../assets/fonts/IRANYekanXFaNum-Regular.woff2",
      weight: "400", // یا 'normal'
      style: "normal",
    },
    {
      path: "../assets/fonts/IRANYekanXFaNum-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../assets/fonts/IRANYekanXFaNum-DemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../assets/fonts/IRANYekanXFaNum-Bold.woff2",
      weight: "700", // یا 'bold'
      style: "normal",
    },
    {
      path: "../assets/fonts/IRANYekanXFaNum-ExtraBold.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "../assets/fonts/IRANYekanXFaNum-Black.woff2",
      weight: "900",
      style: "normal",
    },
    {
      path: "../assets/fonts/IRANYekanXFaNum-ExtraBlack.woff2",
      weight: "950",
      style: "normal",
    },
    {
      path: "../assets/fonts/IRANYekanXFaNum-Heavy.woff2",
      weight: "1000",
      style: "normal",
    },
  ],
  variable: "--font-iranyekan",
  display: "swap",
});
export default fonts;
