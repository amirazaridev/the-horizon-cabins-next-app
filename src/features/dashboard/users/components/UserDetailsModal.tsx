"use client";

import type { ReactNode } from "react";
import { CalendarClock, CreditCard, Mail, Phone, ShieldCheck } from "lucide-react";

import Modal from "@/components/ui/Modal";
import { formatJalaliFull, formatJalaliTime } from "@/libs/utils/jalali";
import { USER_GENDER_LABELS, type AdminUser } from "../types/user.types";
import UserRoleBadge from "./UserRoleBadge";
import UserStatusBadge from "./UserStatusBadge";

interface UserDetailsModalProps {
  user: AdminUser | null;
  isOpen: boolean;
  onClose: () => void;
}

/** مودال «جزییات کاربر» — خلاصه‌ی کامل حساب و پروفایل مهمان بدون ترک صفحه. */
export default function UserDetailsModal({
  user,
  isOpen,
  onClose,
}: UserDetailsModalProps): ReactNode {
  if (!user) return null;

  const guest = user.guest;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title="جزییات کاربر"
      description={`شناسه‌ی حساب: ${user.id}`}
    >
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <UserRoleBadge role={user.role} />
            <UserStatusBadge active={user.active} />
          </div>
          <span className="text-text truncate text-sm font-bold">{guest?.fullName ?? "—"}</span>
        </div>

        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <DetailRow icon={<Mail className="size-4" />} label="ایمیل">
            {user.email}
          </DetailRow>
          <DetailRow icon={<Phone className="size-4" />} label="تلفن">
            {guest?.phoneNumber ?? "—"}
          </DetailRow>
          <DetailRow icon={<CreditCard className="size-4" />} label="کد ملی">
            {guest?.nationalId ?? "—"}
          </DetailRow>
          <DetailRow label="جنسیت">
            {guest?.gender ? USER_GENDER_LABELS[guest.gender] : "—"}
          </DetailRow>
          <DetailRow label="تاریخ تولد">
            {guest?.dateOfBirth ? formatJalaliFull(guest.dateOfBirth) : "—"}
          </DetailRow>
          <DetailRow icon={<CalendarClock className="size-4" />} label="تاریخ ثبت">
            {formatJalaliFull(user.createdAt)}
          </DetailRow>
        </dl>

        {(user.lastLoginAttempt || user.lockedUntil) && (
          <section className="border-border bg-background rounded-2xl border p-4">
            <h3 className="text-text mb-3 flex items-center gap-1.5 text-sm font-bold">
              <ShieldCheck className="size-4" />
              امنیت حساب
            </h3>
            <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
              {user.lastLoginAttempt && (
                <DetailRow label="آخرین تلاش ورود">
                  {formatJalaliFull(user.lastLoginAttempt)} — {formatJalaliTime(user.lastLoginAttempt)}
                </DetailRow>
              )}
              {user.lockedUntil && (
                <DetailRow label="قفل تا">{formatJalaliFull(user.lockedUntil)}</DetailRow>
              )}
            </dl>
          </section>
        )}
      </div>
    </Modal>
  );
}

function DetailRow({
  icon,
  label,
  children,
}: {
  icon?: ReactNode;
  label: string;
  children: ReactNode;
}): ReactNode {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-text-gray flex items-center gap-1.5 text-xs">
        {icon}
        {label}
      </dt>
      <dd className="text-text truncate text-sm font-semibold">{children}</dd>
    </div>
  );
}
