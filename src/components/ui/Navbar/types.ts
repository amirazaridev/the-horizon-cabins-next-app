import type { UserRole } from "@/features/auth/constants/auth-cookie";

export type NavbarUser = {
  email: string;
  role: UserRole;
};
