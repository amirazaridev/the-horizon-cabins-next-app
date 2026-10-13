import Link from "next/link";
import { type ReactNode } from "react";
import logo from '@/assets/images/logo.png';
import Image from "next/image";

export default function Logo(): ReactNode {
  return (
    <Link href="/" className="flex items-center justify-center" aria-label="هورایزن">
      <Image className="" width={49} src={logo} alt="" />
    </Link>
  );
}
