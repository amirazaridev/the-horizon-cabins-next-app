import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";
import LoginForm from "@/features/auth/components/LoginForm";
import AuthFormSkeleton from "@/features/auth/components/AuthFormSkeleton";

export const metadata: Metadata = {
  title: "ورود",
};

export default function LoginPage(): ReactNode {
  return (
    <Suspense fallback={<AuthFormSkeleton />}>
      <LoginForm />
    </Suspense>
  );
}
