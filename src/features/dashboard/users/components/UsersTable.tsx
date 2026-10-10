"use client";

import { useState, type ReactNode } from "react";
import { CheckCircle2, TriangleAlert, Users as UsersIcon, X } from "lucide-react";

import CardDashContainer from "@/components/ui/CardDashContainer";
import Table, { type TableColumn } from "@/components/ui/Table";
import { formatJalaliFull } from "@/libs/utils/jalali";
import type { UserRole } from "@/features/auth/constants/auth-cookie";
import type { AdminUser, UserActionFeedback } from "../types/user.types";
import UserDetailsModal from "./UserDetailsModal";
import UserRoleBadge from "./UserRoleBadge";
import UserRowMenu from "./UserRowMenu";
import UserStatusBadge from "./UserStatusBadge";

interface UsersTableProps {
  users: AdminUser[];
  /** نقش کاربر جاری — مبنای اختیارات هر ردیف. */
  actorRole: UserRole;
  /** متن حالت خالی — بین صفحه‌ی کاربران و مدیران متفاوت است. */
  emptyMessage?: string;
}

/**
 * جدول کاربران — مشترک بین صفحه‌ی «افراد و مهمانان» و «مدیران».
 * ستون آخر منوی عملیات است (آیتم‌هایش با سیاست نقش فیلتر می‌شوند).
 */
export default function UsersTable({
  users,
  actorRole,
  emptyMessage = "کاربری با این فیلترها پیدا نشد.",
}: UsersTableProps): ReactNode {
  const [detailsUser, setDetailsUser] = useState<AdminUser | null>(null);
  const [feedback, setFeedback] = useState<UserActionFeedback | null>(null);

  const columns: TableColumn<AdminUser>[] = [
    {
      key: "user",
      header: "کاربر",
      sortValue: (user) => user.guest?.fullName ?? user.email,
      render: (user) => (
        <span className="flex flex-col gap-0.5">
          <span className="text-text font-semibold">{user.guest?.fullName ?? "—"}</span>
          <span className="text-text-gray text-xs" dir="ltr">
            {user.email}
          </span>
        </span>
      ),
    },
    {
      key: "role",
      header: "نقش",
      align: "center",
      render: (user) => <UserRoleBadge role={user.role} />,
    },
    {
      key: "status",
      header: "وضعیت",
      align: "center",
      render: (user) => <UserStatusBadge active={user.active} />,
    },
    {
      key: "phone",
      header: "تلفن",
      hideOnMobile: true,
      render: (user) => (
        <span className="tabular-nums" dir="ltr">
          {user.guest?.phoneNumber ?? "—"}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "تاریخ ثبت",
      align: "end",
      hideOnMobile: true,
      sortValue: (user) => new Date(user.createdAt).getTime(),
      render: (user) => (
        <span className="text-text-gray text-xs tabular-nums">
          {formatJalaliFull(user.createdAt)}
        </span>
      ),
    },
    {
      key: "actions",
      header: <span className="sr-only">عملیات</span>,
      align: "end",
      className: "w-14",
      render: (user) => (
        <UserRowMenu
          user={user}
          actorRole={actorRole}
          onShowDetails={setDetailsUser}
          onFeedback={setFeedback}
        />
      ),
    },
  ];

  return (
    <CardDashContainer className="flex w-full flex-col gap-4 p-5">
      {feedback && (
        <FeedbackBanner feedback={feedback} onDismiss={() => setFeedback(null)} />
      )}

      <Table
        columns={columns}
        rows={users}
        rowKey={(user) => user.id}
        caption="فهرست کاربران"
        emptyState={<EmptyState message={emptyMessage} />}
      />

      <UserDetailsModal
        user={detailsUser}
        isOpen={detailsUser !== null}
        onClose={() => setDetailsUser(null)}
      />
    </CardDashContainer>
  );
}

/* ==========================================================================
   کمکی‌ها
   ========================================================================== */

function FeedbackBanner({
  feedback,
  onDismiss,
}: {
  feedback: UserActionFeedback;
  onDismiss: () => void;
}): ReactNode {
  const isSuccess = feedback.success;

  return (
    <div
      role="status"
      className={`flex items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-sm ${
        isSuccess
          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
          : "border-danger/40 bg-danger/10 text-danger"
      }`}
    >
      <span className="flex items-center gap-2">
        {isSuccess ? (
          <CheckCircle2 className="size-4 shrink-0" />
        ) : (
          <TriangleAlert className="size-4 shrink-0" />
        )}
        {feedback.message}
      </span>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="بستن پیام"
        className="cursor-pointer opacity-70 transition-opacity hover:opacity-100"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}

function EmptyState({ message }: { message: string }): ReactNode {
  return (
    <div className="text-text-gray flex flex-col items-center justify-center gap-3 py-12 text-center">
      <UsersIcon className="size-9" strokeWidth={1.5} />
      <span className="text-sm">{message}</span>
    </div>
  );
}
