import type { ReactNode } from "react";
import Logo from "@/components/ui/Logo";
import CopyrightText from "@/components/ui/CopyrightText";

export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  return (
    <div className="bg-background relative flex min-h-dvh flex-col items-center overflow-hidden px-4 pb-1">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="bg-primary-400/10 absolute top-[-20%] right-[-10%] size-150 rounded-full blur-[120px]" />
        <div className="bg-primary-500/10 absolute bottom-[-15%] left-[-5%] size-125 rounded-full blur-[100px]" />
        <div className="bg-primary-400/10 absolute top-1/2 left-1/2 size-75 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 flex w-full flex-1 flex-col items-center justify-center">
        <header className="mb-6">
          <Logo />
        </header>

        <main className="w-full">{children}</main>

        <CopyrightText />
      </div>
    </div>
  );
}
