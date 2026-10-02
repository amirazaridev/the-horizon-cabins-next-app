import type { ReactNode } from "react";

import AuthFormSkeleton from "@/features/auth/components/AuthFormSkeleton";

export default function Loading(): ReactNode {
  return <AuthFormSkeleton />;
}
