import { PropsWithChildren, type ReactNode } from "react";
import Navbar from "@/components/ui/Navbar";
import Footer from "../ui/Footer";

type Props = PropsWithChildren;

export default function Layout({ children }: Props): ReactNode {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
