import Landing from "@/features/landing";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ویلاهای لوکس",
};

export default async function Home() {
  return <Landing />;
}
