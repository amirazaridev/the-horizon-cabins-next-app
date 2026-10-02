import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";
import LoginForm from "@/features/auth/components/LoginForm";
import AuthFormSkeleton from "@/features/auth/components/AuthFormSkeleton";

export const metadata: Metadata = {
  title: "ورود",
};

export default function LoginPage(): ReactNode {
  // `LoginForm` از `useSearchParams` استفاده می‌کند؛ در Next.js باید داخل
  // یک مرز Suspense قرار بگیرد تا رندر استاتیک صفحه fail نکند.
  return (
    <Suspense fallback={<AuthFormSkeleton />}>
      <LoginForm />
    </Suspense>
  );
}
