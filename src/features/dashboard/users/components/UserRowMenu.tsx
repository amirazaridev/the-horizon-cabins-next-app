"use client";

import { useState, type ReactNode } from "react";
import { CircleSlash, ClipboardList, MoreVertical, ShieldCheck, UserCheck } from "lucide-react";

import Menus from "@/components/ui/Menus";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { setUserStatusAction } from "../actions/user.actions";
import type { AdminUser, UserActionFeedback } from "../types/user.types";
import UserRoleModal from "./UserRoleModal";

interface UserRowMenuProps {
  user: AdminUser;
  /** آیا کاربر جاری اجازه‌ی تغییر نقش دارد؟ (فقط مالک) */
  canManageRoles: boolean;
  onShowDetails: (user: AdminUser) => void;
  onFeedback: (feedback: UserActionFeedback) => void;
}

/**
 * منوی ردیف کاربر — «جزییات کاربر»، «فعال/غیرفعال کردن حساب» و
 * «تغییر نقش» (فقط برای مالک).
 *
 * عملیات‌ها Server Action هستند؛ نتیجه به‌صورت بنر بالای جدول نمایش داده
 * می‌شود (همان الگوی صفحه‌ی رزروها).
 */
export default function UserRowMenu({
  user,
  canManageRoles,
  onShowDetails,
  onFeedback,
}: UserRowMenuProps): ReactNode {
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const menuId = `user-menu-${user.id}`;

  const willActivate = !user.active;
  const displayName = user.guest?.fullName ?? user.email;

  const confirmStatus = async () => {
    const result = await setUserStatusAction(user.id, willActivate);
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

          <Menus.Button
            icon={willActivate ? <UserCheck /> : <CircleSlash />}
            danger={!willActivate}
            onClick={() => setIsStatusOpen(true)}
          >
            {willActivate ? "فعال کردن حساب" : "غیرفعال کردن حساب"}
          </Menus.Button>

          {canManageRoles && (
            <>
              <Menus.Divider />
              <Menus.Button icon={<ShieldCheck />} onClick={() => setIsRoleOpen(true)}>
                تغییر نقش
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

      <UserRoleModal
        user={user}
        isOpen={isRoleOpen}
        onClose={() => setIsRoleOpen(false)}
        onFeedback={onFeedback}
      />
    </>
  );
}
