import type { ReactNode } from "react";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import CopyrightText from "@/components/ui/CopyrightText";

export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  return (
    <div className="bg-background relative flex flex-col items-center justify-center px-4 py-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-primary-400/10 absolute top-[-20%] right-[-10%] size-150 rounded-full blur-[120px]" />
        <div className="bg-primary-500/10 absolute bottom-[-15%] left-[-5%] size-125 rounded-full blur-[100px]" />
        <div className="bg-primary-400/10 absolute top-1/2 left-1/2 size-75 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px]" />
      </div>

      <div className="mb-9">
        <Logo />
      </div>

      <div className="relative z-10 w-full">{children}</div>

      <CopyrightText />
    </div>
  );
}
