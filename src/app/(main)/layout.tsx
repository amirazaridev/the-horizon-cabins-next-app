import Layout from "@/components/ui/Layout";
import type { ReactNode } from "react";

export default function MainLayout({ children }: { children: ReactNode }): ReactNode {
  return <Layout>{children}</Layout>;
}