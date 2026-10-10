import type { ReactNode } from "react";
import { Crown, ShieldCheck, User, type LucideIcon } from "lucide-react";

import type { UserRole } from "@/features/auth/constants/auth-cookie";
import { USER_ROLE_LABELS } from "../types/user.types";

const ROLE_META: Record<UserRole, { icon: LucideIcon; badgeClass: string }> = {
  guest: {
    icon: User,
    badgeClass: "border-border-strong bg-foreground/5 text-text-gray",
  },
  admin: {
    icon: ShieldCheck,
    badgeClass: "border-sky-400/40 bg-sky-400/15 text-sky-700 dark:text-sky-300",
  },
  owner: {
    icon: Crown,
    badgeClass:
      "border-primary-400/40 bg-primary-400/15 text-primary-600 dark:text-primary-300",
  },
};

/** چیپ نقش کاربر — رنگ/آیکون/برچسب از `ROLE_META` (تک‌منبع). */
export default function UserRoleBadge({ role }: { role: UserRole }): ReactNode {
  const meta = ROLE_META[role];
  const Icon = meta.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${meta.badgeClass}`}
    >
      <Icon className="size-3.5 shrink-0" aria-hidden="true" />
      {USER_ROLE_LABELS[role]}
    </span>
  );
}
