import type { Metadata } from "next";
import type { ReactNode } from "react";

import GuestShell from "@/features/guest/shared/components/GuestShell";
import { requireGuestArea } from "@/features/auth/guards/server-guards";

export const metadata: Metadata = {
  title: {
    default: "حساب کاربری",
    template: "حساب کاربری | %s",
  },
};

export default async function GuestRootLayout({
  children,
}: {
  children: ReactNode;
}): Promise<ReactNode> {
  const user = await requireGuestArea("/account");

  return <GuestShell email={user.email}>{children}</GuestShell>;
}
