import Link from "next/link";
import { type ReactNode } from "react";
import logo from "@/assets/images/logo.png";
import Image from "next/image";

export default function Logo(): ReactNode {
  return (
    <Link
      href="/"
      className="flex items-center justify-center gap-x-2"
      aria-label="هورایزن"
    >
      <Image width={49} src={logo} alt="logo" />
      <span className=" text-sm font-bold sm:text-base self-end">
        هورایزن کابینز
      </span>
    </Link>
  );
}
