import { PropsWithChildren, type ReactNode } from "react";
import Navbar from "@/components/ui/Navbar";
import type { NavbarUser } from "@/components/ui/Navbar/types";
import Footer from "../ui/Footer";

type Props = PropsWithChildren<{
  /** کاربر وارد‌شده — از Server Component والد تزریق می‌شود. */
  user?: NavbarUser | null;
}>;

export default function Layout({ children, user = null }: Props): ReactNode {
  return (
    <>
      <Navbar user={user} />
      {children}
      <Footer />
    </>
  );
}
