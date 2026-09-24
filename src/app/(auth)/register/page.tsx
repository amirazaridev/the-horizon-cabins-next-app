import type { Metadata } from "next";
import type { ReactNode } from "react";
import RegisterForm from "@/features/auth/components/RegisterForm";

export const metadata: Metadata = {
  title: "ثبت‌نام",
};

export default function RegisterPage(): ReactNode {
  return <RegisterForm />;
}
