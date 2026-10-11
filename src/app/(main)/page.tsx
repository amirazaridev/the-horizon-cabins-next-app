import type { Metadata } from "next";

import Landing from "@/features/landing";

export const metadata: Metadata = {
  title: "ویلاهای لوکس",
};

export default async function Home() {
  return <Landing />;
}
