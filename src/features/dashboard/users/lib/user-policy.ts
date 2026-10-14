import type { UserRole } from "@/features/auth/constants/auth-cookie";
import type { AdminUser } from "../types/user.types";

export interface UserRowPermissions {
  canToggleStatus: boolean;
  canChangeRole: boolean;
  canDelete: boolean;
}

export function userRowPermissions(
  actorRole: UserRole,
  target: AdminUser,
): UserRowPermissions {
  const actorIsOwner = actorRole === "owner";
  const actorIsAdmin = actorRole === "admin";

  const targetIsOwner = target.role === "owner";
  const targetIsGuest = target.role === "guest";

  return {
    canToggleStatus: (actorIsOwner && !targetIsOwner) || (actorIsAdmin && targetIsGuest),
    canChangeRole: actorIsOwner && !targetIsOwner,
    canDelete: actorIsOwner && !targetIsOwner,
  };
}
