import type { Metadata } from "next";
import fonts from "@/constants/fonts";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "هورایزن کابینز | ویلای لوکس",
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
    >
      <body className="bg-background text-foreground flex min-h-full flex-col justify-between">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
