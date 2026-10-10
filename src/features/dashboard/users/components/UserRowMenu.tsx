"use client";

import { useState, type ReactNode } from "react";
import {
  CircleSlash,
  ClipboardList,
  MoreVertical,
  ShieldCheck,
  Trash2,
  UserCheck,
} from "lucide-react";

import Menus from "@/components/ui/Menus";
import ConfirmModal from "@/components/ui/ConfirmModal";
import type { UserRole } from "@/features/auth/constants/auth-cookie";
import { deleteUserAction, setUserStatusAction } from "../actions/user.actions";
import { userRowPermissions } from "../lib/user-policy";
import type { AdminUser, UserActionFeedback } from "../types/user.types";
import UserRoleModal from "./UserRoleModal";

interface UserRowMenuProps {
  user: AdminUser;
  /** نقش کاربر جاری — مبنای نمایش/پنهان‌کردن آیتم‌ها. */
  actorRole: UserRole;
  onShowDetails: (user: AdminUser) => void;
  onFeedback: (feedback: UserActionFeedback) => void;
}

/**
 * منوی ردیف کاربر — «جزییات کاربر»، «فعال/غیرفعال کردن حساب»، «تغییر نقش»
 * و «حذف کاربر».
 *
 * ⚠️ آیتم‌هایی که سیاست اجازه نمی‌دهد **پنهان** می‌شوند (نه غیرفعال)، چون
 * کاربر هیچ‌وقت نباید بتواند آن‌ها را اجرا کند. گارد نهایی سمت بک‌اند است.
 */
export default function UserRowMenu({
  user,
  actorRole,
  onShowDetails,
  onFeedback,
}: UserRowMenuProps): ReactNode {
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const menuId = `user-menu-${user.id}`;

  const permissions = userRowPermissions(actorRole, user);
  const willActivate = !user.active;
  const displayName = user.guest?.fullName ?? user.email;

  const confirmStatus = async () => {
    const result = await setUserStatusAction(user.id, willActivate);
    onFeedback(result);
  };

  const confirmDelete = async () => {
    const result = await deleteUserAction(user.id);
    onFeedback(result);
  };

  return (
    <>
      <Menus>
        <Menus.Toggle id={menuId} icon={<MoreVertical className="size-5" />} />
        <Menus.List id={menuId}>
          <Menus.Button icon={<ClipboardList />} onClick={() => onShowDetails(user)}>
            جزییات کاربر
          </Menus.Button>

          {permissions.canToggleStatus && (
            <Menus.Button
              icon={willActivate ? <UserCheck /> : <CircleSlash />}
              danger={!willActivate}
              onClick={() => setIsStatusOpen(true)}
            >
              {willActivate ? "فعال کردن حساب" : "غیرفعال کردن حساب"}
            </Menus.Button>
          )}

          {permissions.canChangeRole && (
            <Menus.Button icon={<ShieldCheck />} onClick={() => setIsRoleOpen(true)}>
              تغییر نقش
            </Menus.Button>
          )}

          {permissions.canDelete && (
            <>
              <Menus.Divider />
              <Menus.Button
                icon={<Trash2 />}
                danger
                onClick={() => setIsDeleteOpen(true)}
              >
                حذف کاربر
              </Menus.Button>
            </>
          )}
        </Menus.List>
      </Menus>

      <ConfirmModal
        isOpen={isStatusOpen}
        onClose={() => setIsStatusOpen(false)}
        onConfirm={confirmStatus}
        title={willActivate ? "فعال کردن حساب" : "غیرفعال کردن حساب"}
        description={
          willActivate
            ? `آیا حساب «${displayName}» فعال شود؟ کاربر می‌تواند دوباره وارد شود.`
            : `آیا حساب «${displayName}» غیرفعال شود؟ تا فعال‌سازی مجدد امکان ورود ندارد.`
        }
        confirmText={willActivate ? "بله، فعال کن" : "بله، غیرفعال کن"}
        variant={willActivate ? "primary" : "danger"}
      />

      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        title="حذف کاربر"
        description={`آیا از حذف کامل حساب «${displayName}» مطمئن هستید؟ این عملیات قابل بازگشت نیست.`}
        confirmText="بله، حذف کن"
        variant="danger"
      />

      <UserRoleModal
        user={user}
        isOpen={isRoleOpen}
        onClose={() => setIsRoleOpen(false)}
        onFeedback={onFeedback}
      />
    </>
  );
}
