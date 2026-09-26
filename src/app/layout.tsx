import type { Metadata } from "next";
import fonts from "@/constants/fonts";
import { ThemeProvider } from "@/contexts/ThemeContext";
import "@/app/globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: {
    default: "هورایزن کابینز | ویلاهای لوکس",
    template: "هورایزن کابینز | %s",
  },
  description:
    "از شلوغی شهر فاصله بگیرید و در دل طبیعت، لوکس بودن را تجربه کنید.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${fonts.variable} h-full antialiased`}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body className="bg-background text-foreground flex min-h-full flex-col justify-between">
        <ThemeProvider>
          {children}
          <Toaster position="top-center" reverseOrder={false} />
        </ThemeProvider>
      </body>
    </html>
  );
}
