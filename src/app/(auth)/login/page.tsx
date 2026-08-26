import type { Metadata } from "next";
import type { ReactNode } from "react";
import LoginForm from "@/features/auth/components/LoginForm";

export const metadata: Metadata = {
  title: "ورود | هورایزن کابینز",
};

export default function LoginPage(): ReactNode {
  return (
    <section className="flex min-h-screen items-center justify-center px-4 py-16">
      <LoginForm />
    </section>
  );
}
