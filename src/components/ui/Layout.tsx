import { PropsWithChildren, type ReactNode } from "react";
import Navbar from "@/components/ui/navbar";
import Footer from "./Footer";

type Props = PropsWithChildren;

export default function Layout({ children }: Props): ReactNode {
  return (
    <>
      <Navbar />
      {children}
      <Footer/>
    </>
  );
}
