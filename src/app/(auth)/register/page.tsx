import type { Metadata } from "next";
import type { ReactNode } from "react";
import RegisterForm from "@/features/auth/components/RegisterForm";

export const metadata: Metadata = {
  title: "ثبت‌نام | هورایزن کابینز",
};

export default function RegisterPage(): ReactNode {
  return (
    <section className="flex min-h-screen items-center justify-center px-4 py-16">
      <RegisterForm />
    </section>
  );
}
