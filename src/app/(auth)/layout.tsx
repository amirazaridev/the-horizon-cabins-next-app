import type { ReactNode } from "react";
import Link from "next/link";
import Logo from "@/components/ui/Logo";

export default function AuthLayout({ children }: { children: ReactNode }): ReactNode {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8 overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-20%] right-[-10%] size-[600px] rounded-full bg-primary-400/5 blur-[120px]" />
        <div className="absolute bottom-[-15%] left-[-5%] size-[500px] rounded-full bg-primary-500/5 blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 size-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-400/3 blur-[80px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(251,191,36,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(251,191,36,0.3) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <Link
        href="/"
        className="relative z-10 mb-6 flex items-center gap-3 transition-opacity duration-300 hover:opacity-80"
      >
        <Logo />
      </Link>

      <div className="relative z-10 w-full">{children}</div>

      <p className="relative z-10 mt-6 text-center text-xs text-white/30">
        © {new Date().getFullYear()} هورایزن کابینز. تمامی حقوق محفوظ است.
      </p>
    </div>
  );
}
